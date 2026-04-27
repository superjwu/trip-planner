"use server";
import { revalidatePath } from "next/cache";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { isClerkConfigured } from "@/lib/clerk-config";
import {
  cacheKey,
  preFilter,
  rankDestinationsWithRetry,
} from "@/lib/llm/recommend";
import { DESTINATIONS } from "@/lib/seed/destinations";
import type { NormalizedTripInput } from "@/lib/types";
import { RecommendationResponseSchema } from "@/lib/schemas";
import { hydrateRecommendation } from "@/lib/hydrate";
import { generateItineraryWithRetry } from "@/lib/llm/itinerary";
import type { SeedDestination } from "@/lib/types";

interface TripRow {
  id: string;
  clerk_user_id: string;
  normalized_input: NormalizedTripInput;
  compute_status: "pending" | "computing" | "ready" | "failed";
}

interface RecRow {
  id: string;
  trip_id: string;
  rank: number;
  destination_slug: string;
  destination_snapshot: SeedDestination;
  itinerary: unknown;
}

/**
 * Idempotent compute: if the trip already has recommendations and is ready,
 * returns immediately. Otherwise filters candidates, hits Claude (with cache
 * lookup), persists 4 recommendation rows, flips compute_status to 'ready'.
 */
export async function computeRecommendations(tripId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const sb = isClerkConfigured()
    ? await createServerSupabase()
    : createAdminSupabase();
  const admin = createAdminSupabase();

  const { data: trip, error: tripErr } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status")
    .eq("id", tripId)
    .maybeSingle<TripRow>();

  if (tripErr || !trip) {
    return { ok: false, error: tripErr?.message ?? "Trip not found." };
  }
  if (trip.compute_status === "ready") {
    return { ok: true };
  }
  if (!trip.normalized_input) {
    return { ok: false, error: "Trip missing normalized input." };
  }

  // Mark as computing so concurrent requests don't double-fire
  await sb.from("trips").update({ compute_status: "computing" }).eq("id", tripId);

  try {
    const input = trip.normalized_input;
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
      const ranked = await rankDestinationsWithRetry(input, candidates);
      response = ranked.response;
      meta = ranked.meta as unknown as Record<string, unknown>;
      // Best-effort cache write (admin bypasses RLS).
      await admin.from("rec_cache").upsert({ key, response });
    }

    // Persist recommendation rows. Clear any stale rows first (cascading delete
    // keyed off trip_id is fine to call even when there are none).
    await sb.from("recommendations").delete().eq("trip_id", tripId);

    // Hydrate all 4 picks in parallel: weather always, Amadeus best-effort,
    // booking links deterministic. hydrateRecommendation never throws.
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

    revalidatePath(`/trips/${tripId}`);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sb
      .from("trips")
      .update({ compute_status: "failed", compute_error: message })
      .eq("id", tripId);
    return { ok: false, error: message };
  }
}

/**
 * Toggle a trip between draft / saved / archived.
 */
export async function setTripStatus(args: {
  tripId: string;
  status: "draft" | "saved" | "archived";
}): Promise<{ ok: boolean; error?: string }> {
  const sb = isClerkConfigured()
    ? await createServerSupabase()
    : createAdminSupabase();
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
 */
export async function ensureItinerary(args: {
  tripId: string;
  recId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const sb = isClerkConfigured()
    ? await createServerSupabase()
    : createAdminSupabase();

  const { data: rec, error: recErr } = await sb
    .from("recommendations")
    .select("id, trip_id, rank, destination_slug, destination_snapshot, itinerary")
    .eq("id", args.recId)
    .maybeSingle<RecRow>();
  if (recErr || !rec) {
    return { ok: false, error: recErr?.message ?? "Recommendation not found." };
  }
  if (rec.itinerary) {
    return { ok: true };
  }

  const { data: trip } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status")
    .eq("id", args.tripId)
    .maybeSingle<TripRow>();
  if (!trip || !trip.normalized_input) {
    return { ok: false, error: "Trip not found." };
  }

  try {
    const { response } = await generateItineraryWithRetry({
      input: trip.normalized_input,
      destination: rec.destination_snapshot,
    });
    await sb
      .from("recommendations")
      .update({ itinerary: response })
      .eq("id", rec.id);
    revalidatePath(`/trips/${args.tripId}`);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
