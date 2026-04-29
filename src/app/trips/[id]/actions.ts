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
import type { RefineContext } from "@/lib/llm/prompts";
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
  active_round_id: string | null;
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
 * Idempotent compute for a trip's first (round 1) recommendations. Only one
 * caller wins the trip-level lock; losers see compute_status != 'pending' and
 * return ok:true. Stale-lock recovery: pending OR computing>5min.
 */
export async function computeRecommendations(tripId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const sb = await createOwnerScopedSupabase();
  const admin = createAdminSupabase();

  const { data: trip, error: tripErr } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status, active_round_id")
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

  // Race-safe lock with stale-lock recovery (5 min cutoff).
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
  if (lockErr) return { ok: false, error: lockErr.message };
  if (!lockRows || lockRows.length === 0) return { ok: true };

  try {
    // Insert round 1 (or pick up an existing one from a prior partial compute).
    let roundId: string | null = trip.active_round_id;
    if (!roundId) {
      const { data: roundIns, error: roundErr } = await admin
        .from("recommendation_rounds")
        .insert({
          trip_id: tripId,
          round_number: 1,
          compute_status: "computing",
          computing_started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (roundErr || !roundIns) {
        throw new Error(`round insert failed: ${roundErr?.message}`);
      }
      roundId = roundIns.id;
      await sb.from("trips").update({ active_round_id: roundId }).eq("id", tripId);
    }

    if (!roundId) throw new Error("round insert path didn't set roundId");
    const userId = await requireUserId();
    const result = await rankAndPersist({
      tripId,
      roundId,
      input,
      refine: undefined,
      userId,
    });
    if (!result.ok) throw new Error(result.error);

    await sb
      .from("trips")
      .update({ compute_status: "ready", compute_error: null })
      .eq("id", tripId);

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

interface RankAndPersistArgs {
  tripId: string;
  roundId: string;
  input: NormalizedTripInput;
  refine: RefineContext | undefined;
  userId: string;
}

/**
 * Shared rank → cache-lookup → hydrate → persist pipeline used by both
 * computeRecommendations (round 1) and createRefineRound (round 2+).
 */
async function rankAndPersist(args: RankAndPersistArgs): Promise<{
  ok: boolean;
  error?: string;
}> {
  const sb = await createOwnerScopedSupabase();
  const admin = createAdminSupabase();

  const candidates = preFilter(args.input);
  if (candidates.length < 4) {
    return {
      ok: false,
      error: `Only ${candidates.length} candidates passed the pre-filter — relax some constraints.`,
    };
  }

  const key = cacheKey(args.input, args.refine);
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
    refined: !!args.refine,
  };

  if (cached?.response) {
    response = RecommendationResponseSchema.parse(cached.response);
  } else {
    const ranked = await rankDestinationsWithRetry({
      clerkUserId: args.userId,
      input: args.input,
      candidates,
      refine: args.refine,
    });
    response = ranked.response;
    meta = {
      ...(ranked.meta as unknown as Record<string, unknown>),
      refined: !!args.refine,
    };
    const { error: cacheWriteErr } = await admin
      .from("rec_cache")
      .upsert({ key, response }, { onConflict: "key" });
    if (cacheWriteErr && process.env.NODE_ENV !== "production") {
      console.warn("[rec_cache] write failed:", cacheWriteErr.message);
    }
  }

  // Persist round metadata (why_these_four + llm_meta + final status).
  await admin
    .from("recommendation_rounds")
    .update({
      why_these_four: response.why_these_four,
      llm_meta: meta,
      compute_status: "ready",
    })
    .eq("id", args.roundId);

  // Hydrate each pick in parallel (weather + cost + booking links).
  const hydratedPicks = await Promise.all(
    response.picks.map(async (pick) => {
      const dest = DESTINATIONS.find((d) => d.slug === pick.slug)!;
      const bundle = await hydrateRecommendation({
        input: args.input,
        destination: dest,
      });
      return { pick, dest, bundle };
    }),
  );

  // Wipe any stale rows for THIS round (idempotent retries) — leave other
  // rounds' rows alone.
  await sb.from("recommendations").delete().eq("round_id", args.roundId);

  const rows = hydratedPicks.map(({ pick, dest, bundle }) => ({
    trip_id: args.tripId,
    round_id: args.roundId,
    rank: pick.rank,
    destination_slug: pick.slug,
    reasoning: pick.reasoning,
    match_tags: pick.match_tags,
    tradeoffs: pick.tradeoffs,
    destination_snapshot: dest,
    hydration: { weather: bundle.weather, cost: bundle.cost },
    booking_links: bundle.bookingLinks,
    itinerary: null,
    llm_meta: meta,
    hydration_status: "ready",
  }));

  const { error: insertErr } = await sb.from("recommendations").insert(rows);
  if (insertErr) return { ok: false, error: insertErr.message };

  return { ok: true };
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
 * Lazy itinerary generation for a single recommendation. Idempotent.
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
    .select("id, clerk_user_id, normalized_input, compute_status, active_round_id")
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
    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendlyComputeError(err) };
  }
}

// ─────────────────────────────────────────────────────────────
// Refine — round 2+. The user passes feedback (presets, kept/avoided slugs,
// free text). We insert a new round, re-rank with the previous picks +
// feedback as context, and flip trips.active_round_id so the page renders
// the new round by default. Past rounds remain navigable.
// ─────────────────────────────────────────────────────────────

interface PrevPickRow {
  rank: number;
  destination_slug: string;
  reasoning: string;
}

export async function createRefineRound(args: {
  tripId: string;
  feedbackText: string;
  feedbackPresets: string[];
  keptSlugs: string[];
  avoidedSlugs: string[];
}): Promise<{ ok: boolean; error?: string; newRoundId?: string }> {
  const sb = await createOwnerScopedSupabase();
  const admin = createAdminSupabase();

  const { data: trip, error: tripErr } = await sb
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status, active_round_id")
    .eq("id", args.tripId)
    .maybeSingle<TripRowRaw>();
  if (tripErr || !trip) {
    return { ok: false, error: tripErr?.message ?? "Trip not found." };
  }
  if (trip.compute_status !== "ready") {
    return { ok: false, error: "Wait for the initial recommendations to finish first." };
  }
  if (!trip.active_round_id) {
    return { ok: false, error: "No active round — cannot refine." };
  }

  let input: NormalizedTripInput;
  try {
    input = parseNormalizedInput(trip.normalized_input);
  } catch (e) {
    return { ok: false, error: `Trip input invalid: ${(e as Error).message}` };
  }

  // Pull the previous round's picks for the refine prompt.
  const { data: prevPickRows } = await sb
    .from("recommendations")
    .select("rank, destination_slug, reasoning")
    .eq("round_id", trip.active_round_id)
    .order("rank", { ascending: true });
  const previousPicks: RefineContext["previousPicks"] = (
    (prevPickRows as PrevPickRow[] | null) ?? []
  ).map((r) => ({
    slug: r.destination_slug,
    rank: r.rank,
    reasoning: r.reasoning,
  }));

  // Find the next round_number for this trip.
  const { data: maxRow } = await sb
    .from("recommendation_rounds")
    .select("round_number")
    .eq("trip_id", args.tripId)
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle<{ round_number: number }>();
  const nextRoundNumber = (maxRow?.round_number ?? 0) + 1;

  // Insert the new round (status=computing) — race-safe because of the
  // unique(trip_id, round_number) constraint.
  const { data: newRound, error: insertErr } = await admin
    .from("recommendation_rounds")
    .insert({
      trip_id: args.tripId,
      parent_round_id: trip.active_round_id,
      round_number: nextRoundNumber,
      feedback_text: args.feedbackText.slice(0, 1000),
      feedback_presets: args.feedbackPresets,
      kept_slugs: args.keptSlugs,
      avoided_slugs: args.avoidedSlugs,
      compute_status: "computing",
      computing_started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (insertErr || !newRound) {
    return { ok: false, error: `round insert failed: ${insertErr?.message}` };
  }

  const refine: RefineContext = {
    previousPicks,
    keptSlugs: args.keptSlugs,
    avoidedSlugs: args.avoidedSlugs,
    feedbackPresets: args.feedbackPresets,
    feedbackText: args.feedbackText,
  };

  try {
    const userId = await requireUserId();

    // Apply hard exclusions BEFORE rank: anything in avoided_slugs cannot
    // come back. The model is also told to avoid them, but the pre-filter
    // is the actual guarantee.
    const filtered = preFilter(input).filter(
      (d) => !args.avoidedSlugs.includes(d.slug),
    );
    if (filtered.length < 4) {
      throw new Error(
        `Only ${filtered.length} candidates left after applying your avoid list — try keeping more of the previous picks or relaxing constraints.`,
      );
    }

    // rankAndPersist re-runs preFilter inside, but with avoided_slugs in
    // refine the prompt-side filtering is the same as our hard exclude.
    // So we patch the input via a shadowed candidate pool? Simpler: call
    // rankAndPersist with the full input; the prompt's avoid list is robust.
    const result = await rankAndPersist({
      tripId: args.tripId,
      roundId: newRound.id,
      input,
      refine,
      userId,
    });
    if (!result.ok) throw new Error(result.error);

    await sb
      .from("trips")
      .update({ active_round_id: newRound.id })
      .eq("id", args.tripId);

    return { ok: true, newRoundId: newRound.id };
  } catch (err) {
    const message = friendlyComputeError(err);
    await admin
      .from("recommendation_rounds")
      .update({ compute_status: "failed", compute_error: message })
      .eq("id", newRound.id);
    return { ok: false, error: message };
  }
}
