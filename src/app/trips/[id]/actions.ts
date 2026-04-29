"use server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import {
  createAdminSupabase,
  createOwnerScopedSupabase,
} from "@/lib/supabase/server";
import {
  cacheKey,
  preFilter,
  rankDestinationsWithRetry,
} from "@/lib/llm/recommend";
import { DESTINATIONS } from "@/lib/seed/destinations";
import {
  NormalizedTripInputSchema,
  RecommendationResponseSchema,
  SeedDestinationSchema,
} from "@/lib/schemas";
import type { NormalizedTripInput, SeedDestination } from "@/lib/types";
import { hydrateRecommendation } from "@/lib/hydrate";
import { generateItineraryWithRetry } from "@/lib/llm/itinerary";
import { CodexNotConnectedError, CodexAuthExpiredError, CodexRateLimitError } from "@/lib/llm/codex-auth";

interface TripRowRaw {
  id: string;
  clerk_user_id: string;
  normalized_input: unknown;
  compute_status: "pending" | "computing" | "ready" | "failed";
}

interface RecRowRaw {
  id: string;
  trip_id: string;
  rank: number;
  destination_slug: string;
  destination_snapshot: unknown;
  itinerary: unknown;
}

function parseNormalizedInput(raw: unknown): NormalizedTripInput {
  return NormalizedTripInputSchema.parse(raw);
}

/**
 * Idempotent compute: only one caller wins the lock (conditional UPDATE on
 * compute_status='pending'). Losers return ok:true without re-running Claude.
 */
export async function computeRecommendations(tripId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const sb = await createOwnerScopedSupabase();
  const admin = createAdminSupabase();

  const { data: trip, error: tripErr } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status")
    .eq("id", tripId)
    .maybeSingle<TripRowRaw>();

  if (tripErr || !trip) {
    return { ok: false, error: tripErr?.message ?? "Trip not found." };
  }
  if (trip.compute_status === "ready") {
    return { ok: true };
  }

  let input: NormalizedTripInput;
  try {
    input = parseNormalizedInput(trip.normalized_input);
  } catch (e) {
    return { ok: false, error: `Trip input invalid: ${(e as Error).message}` };
  }

  // Race-safe lock with stale-lock recovery: take the lock if status is
  // 'pending' OR the lock has been held for >5 minutes (the previous worker
  // probably died). PostgREST doesn't support OR across multiple .eq() calls
  // so we use the .or() filter syntax.
  const staleLockCutoff = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data: lockRows, error: lockErr } = await sb
    .from("trips")
    .update({
      compute_status: "computing",
      computing_started_at: new Date().toISOString(),
    })
    .eq("id", tripId)
    .or(
      `compute_status.eq.pending,and(compute_status.eq.computing,computing_started_at.lt.${staleLockCutoff})`,
    )
    .select("id");
  if (lockErr) {
    return { ok: false, error: lockErr.message };
  }
  if (!lockRows || lockRows.length === 0) {
    // Another worker holds the lock or already finished. Defer to it.
    return { ok: true };
  }

  try {
    const candidates = preFilter(input);
    if (candidates.length < 4) {
      throw new Error(
        `Only ${candidates.length} candidates passed the pre-filter — relax some constraints.`,
      );
    }

    // Cache lookup (admin client bypasses RLS for the public cache table).
    const key = cacheKey(input);
    const { data: cached } = await admin
      .from("rec_cache")
      .select("response")
      .eq("key", key)
      .maybeSingle();

    let response: import("@/lib/schemas").RecommendationResponse;
    let meta: Record<string, unknown> = {
      model: "cache",
      promptVersion: "cache",
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      candidateCount: candidates.length,
      fromCache: true,
    };

    if (cached?.response) {
      response = RecommendationResponseSchema.parse(cached.response);
    } else {
      const userId = await requireUserId();
      const ranked = await rankDestinationsWithRetry({
        clerkUserId: userId,
        input,
        candidates,
      });
      response = ranked.response;
      meta = ranked.meta as unknown as Record<string, unknown>;
      const { error: cacheWriteErr } = await admin
        .from("rec_cache")
        .upsert({ key, response }, { onConflict: "key" });
      if (cacheWriteErr && process.env.NODE_ENV !== "production") {
        console.warn("[rec_cache] write failed:", cacheWriteErr.message);
      }
    }

    // Clear any stale rows under our trip; we hold the lock so this is safe.
    const { error: deleteErr } = await sb
      .from("recommendations")
      .delete()
      .eq("trip_id", tripId);
    if (deleteErr) throw deleteErr;

    const hydratedPicks = await Promise.all(
      response.picks.map(async (pick) => {
        const dest = DESTINATIONS.find((d) => d.slug === pick.slug)!;
        const bundle = await hydrateRecommendation({ input, destination: dest });
        return { pick, dest, bundle };
      }),
    );

    const rows = hydratedPicks.map(({ pick, dest, bundle }) => ({
      trip_id: tripId,
      rank: pick.rank,
      destination_slug: pick.slug,
      reasoning: pick.reasoning,
      match_tags: pick.match_tags,
      destination_snapshot: dest,
      hydration: { weather: bundle.weather, cost: bundle.cost },
      booking_links: bundle.bookingLinks,
      itinerary: null,
      llm_meta: meta,
      hydration_status: "ready",
    }));

    const { error: insertErr } = await sb.from("recommendations").insert(rows);
    if (insertErr) throw insertErr;

    await sb
      .from("trips")
      .update({ compute_status: "ready", compute_error: null })
      .eq("id", tripId);

    // No revalidatePath() here: this action is invoked during the trip page's
    // server-render (page calls compute → re-fetches → renders). Next.js 16
    // forbids calling revalidatePath during render. The page reads fresh data
    // explicitly via fetchTrip/fetchRecs after compute returns, which is
    // sufficient.
    return { ok: true };
  } catch (err) {
    const message = friendlyComputeError(err);
    await sb
      .from("trips")
      .update({ compute_status: "failed", compute_error: message })
      .eq("id", tripId);
    return { ok: false, error: message };
  }
}

function friendlyComputeError(err: unknown): string {
  if (err instanceof CodexNotConnectedError) {
    return "Connect ChatGPT first — your account isn't linked yet.";
  }
  if (err instanceof CodexAuthExpiredError) {
    return "Your ChatGPT connection expired. Reconnect to continue.";
  }
  if (err instanceof CodexRateLimitError) {
    return "Your ChatGPT account hit a rate limit. Try again in a minute.";
  }
  return err instanceof Error ? err.message : String(err);
}

/**
 * Toggle a trip between draft / saved / archived.
 */
export async function setTripStatus(args: {
  tripId: string;
  status: "draft" | "saved" | "archived";
}): Promise<{ ok: boolean; error?: string }> {
  const sb = await createOwnerScopedSupabase();
  const { error } = await sb
    .from("trips")
    .update({ user_status: args.status })
    .eq("id", args.tripId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/trips/${args.tripId}`);
  revalidatePath(`/trips`);
  return { ok: true };
}

/**
 * Lazy itinerary generation for a single recommendation. Idempotent: if the
 * itinerary already exists on the row, returns immediately.
 *
 * Verifies that the recommendation actually belongs to the trip in args, so
 * a caller can't mix one trip's prefs with another trip's destination.
 */
export async function ensureItinerary(args: {
  tripId: string;
  recId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const sb = await createOwnerScopedSupabase();

  const { data: rec, error: recErr } = await sb
    .from("recommendations")
    .select("id, trip_id, rank, destination_slug, destination_snapshot, itinerary")
    .eq("id", args.recId)
    .maybeSingle<RecRowRaw>();
  if (recErr || !rec) {
    return { ok: false, error: recErr?.message ?? "Recommendation not found." };
  }
  if (rec.trip_id !== args.tripId) {
    return { ok: false, error: "Recommendation does not belong to this trip." };
  }
  if (rec.itinerary) {
    return { ok: true };
  }

  const { data: trip } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status")
    .eq("id", args.tripId)
    .maybeSingle<TripRowRaw>();
  if (!trip) {
    return { ok: false, error: "Trip not found." };
  }

  let input: NormalizedTripInput;
  try {
    input = parseNormalizedInput(trip.normalized_input);
  } catch (e) {
    return { ok: false, error: `Trip input invalid: ${(e as Error).message}` };
  }

  let destination: SeedDestination;
  try {
    destination = SeedDestinationSchema.parse(rec.destination_snapshot);
  } catch (e) {
    return {
      ok: false,
      error: `destination_snapshot malformed: ${(e as Error).message}`,
    };
  }

  try {
    const userId = await requireUserId();
    const { response } = await generateItineraryWithRetry({
      clerkUserId: userId,
      input,
      destination,
      tripLengthDays: input.tripLengthDays,
    });
    await sb
      .from("recommendations")
      .update({ itinerary: response })
      .eq("id", rec.id);
    // No revalidatePath here either — same reason as computeRecommendations.
    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendlyComputeError(err) };
  }
}
