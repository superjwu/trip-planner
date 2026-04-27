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

interface TripRow {
  id: string;
  clerk_user_id: string;
  normalized_input: NormalizedTripInput;
  compute_status: "pending" | "computing" | "ready" | "failed";
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

    const rows = response.picks.map((pick) => {
      const dest = DESTINATIONS.find((d) => d.slug === pick.slug)!;
      return {
        trip_id: tripId,
        rank: pick.rank,
        destination_slug: pick.slug,
        reasoning: pick.reasoning,
        match_tags: pick.match_tags,
        destination_snapshot: dest,
        hydration: null,
        booking_links: null,
        itinerary: null,
        llm_meta: meta,
        hydration_status: "pending",
      };
    });

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
