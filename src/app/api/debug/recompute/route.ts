import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import {
  preFilter,
  rankDestinationsWithRetry,
} from "@/lib/llm/recommend";
import { hydrateRecommendation } from "@/lib/hydrate";
import { DESTINATIONS } from "@/lib/seed/destinations";
import { NormalizedTripInputSchema } from "@/lib/schemas";
import type { NormalizedTripInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * DEV-ONLY: drives computeRecommendations for an existing trip without
 * needing a Clerk session. Resolves the trip's clerk_user_id via the admin
 * client, then runs the same rank → hydrate → persist path.
 *
 * Disabled in production via NODE_ENV check.
 *
 * GET /api/debug/recompute?trip=<uuid>
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in prod" }, { status: 404 });
  }
  const url = new URL(req.url);
  const tripId = url.searchParams.get("trip");
  if (!tripId) {
    return NextResponse.json({ error: "missing ?trip=<uuid>" }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data: trip, error: tripErr } = await admin
    .from("trips")
    .select("id, clerk_user_id, normalized_input, compute_status")
    .eq("id", tripId)
    .maybeSingle();
  if (tripErr || !trip) {
    return NextResponse.json({ error: tripErr?.message ?? "not found" }, { status: 404 });
  }

  let input: NormalizedTripInput;
  try {
    input = NormalizedTripInputSchema.parse(trip.normalized_input);
  } catch (e) {
    return NextResponse.json({ error: `bad input: ${(e as Error).message}` }, { status: 400 });
  }

  const candidates = preFilter(input);
  if (candidates.length < 4) {
    return NextResponse.json({
      error: `only ${candidates.length} candidates after preFilter`,
      candidates: candidates.map((c) => c.slug),
    }, { status: 400 });
  }

  const t0 = Date.now();
  let ranked;
  try {
    ranked = await rankDestinationsWithRetry({
      clerkUserId: trip.clerk_user_id,
      input,
      candidates,
    });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({
      stage: "rank",
      error: err.message,
      stack: err.stack?.split("\n").slice(0, 8).join("\n"),
    }, { status: 500 });
  }
  const rankMs = Date.now() - t0;

  // Persist
  await admin.from("recommendations").delete().eq("trip_id", tripId);

  const hydrated = await Promise.all(
    ranked.response.picks.map(async (pick) => {
      const dest = DESTINATIONS.find((d) => d.slug === pick.slug)!;
      const bundle = await hydrateRecommendation({ input, destination: dest });
      return { pick, dest, bundle };
    }),
  );

  const rows = hydrated.map(({ pick, dest, bundle }) => ({
    trip_id: tripId,
    rank: pick.rank,
    destination_slug: pick.slug,
    reasoning: pick.reasoning,
    match_tags: pick.match_tags,
    destination_snapshot: dest,
    hydration: { weather: bundle.weather, cost: bundle.cost },
    booking_links: bundle.bookingLinks,
    itinerary: null,
    llm_meta: ranked.meta,
    hydration_status: "ready",
  }));

  const { error: insertErr } = await admin.from("recommendations").insert(rows);
  if (insertErr) {
    return NextResponse.json({ stage: "insert", error: insertErr.message }, { status: 500 });
  }

  await admin.from("trips").update({ compute_status: "ready", compute_error: null }).eq("id", tripId);

  return NextResponse.json({
    stage: "done",
    rankMs,
    picks: ranked.response.picks.map((p) => ({ slug: p.slug, rank: p.rank, reasoning: p.reasoning })),
    meta: ranked.meta,
  });
}
