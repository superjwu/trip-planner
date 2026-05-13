/**
 * Phase B post-rank validators for multi-stop combos.
 *
 * Layered with `RecommendationPickSchema.superRefine`: the schema covers
 * structural rules (`stops[0].slug === pick.slug`, sequential `order`,
 * no duplicate slugs within a single route). These validators cover
 * cross-cutting rules that need runtime context Zod doesn't have access
 * to: the candidate pool and the trip length.
 *
 * Returns a flat list of human-readable errors so the caller (rank-and-
 * persist) can either retry with explicit feedback or surface the
 * problem in `llm_meta` for observability.
 */
import type { RecommendationResponse } from "../schemas";
import type { SeedDestination } from "../types";

export interface ValidateStopsInput {
  response: RecommendationResponse;
  candidates: SeedDestination[];
  tripLengthDays: number;
}

export function validateStops(input: ValidateStopsInput): string[] {
  const { response, candidates, tripLengthDays } = input;
  const candidateSlugs = new Set(candidates.map((d) => d.slug));
  const errors: string[] = [];

  for (const [pickIdx, pick] of response.picks.entries()) {
    // Every stop slug must be in the candidate pool — the schema only
    // checks slug shape, not membership.
    for (const [stopIdx, stop] of pick.stops.entries()) {
      if (!candidateSlugs.has(stop.slug)) {
        errors.push(
          `pick[${pickIdx}].stops[${stopIdx}].slug "${stop.slug}" is not in the candidate pool`,
        );
      }
    }

    // Day allocation: enforce sum(days) === tripLengthDays ONLY when every
    // stop has days set. Mixed null/number is allowed (the itinerary
    // writer fills nulls in B.6); fully-null stops defer to the writer.
    const allDaysSet = pick.stops.every((s) => s.days !== null);
    if (allDaysSet) {
      const totalDays = pick.stops.reduce((acc, s) => acc + (s.days ?? 0), 0);
      if (totalDays !== tripLengthDays) {
        errors.push(
          `pick[${pickIdx}] stops.days sum to ${totalDays} but trip is ${tripLengthDays} days`,
        );
      }
    }
  }

  return errors;
}
