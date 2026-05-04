/**
 * Code-side tradeoff computation. Replaces the LLM-emitted tradeoffs in
 * `RecommendationPick.tradeoffs` with deterministic scores derived from
 * (input, destination) so the matrix is coherent across rounds.
 *
 * Why move this out of the LLM:
 * - Tradeoff scores swing wildly between rounds for the same destination.
 * - Cheap places sometimes get marked low-budget.
 * - The model isn't a reliable arithmetic engine for ratio comparisons.
 *
 * What still belongs in the model: `vibeFit` is partially judgment-based
 * (e.g. "scenic" maps to multiple destination tags), but a deterministic
 * tag-overlap heuristic is a coherent baseline. `crowd` is the hardest —
 * we use a tag-derived heuristic with seasonal modifiers.
 */
import type { Tradeoffs } from "../schemas";
import type { NormalizedTripInput, SeedDestination } from "../types";
import { estimateTripCostUsd } from "./recommend";
import { lodgingNights } from "../normalize";

const ADJACENT_SEASON: Record<string, string[]> = {
  spring: ["summer", "winter"],
  summer: ["spring", "fall"],
  fall: ["summer", "winter"],
  winter: ["fall", "spring"],
};

/**
 * Bucket a number into a 1-3 score given thresholds. Higher input → higher
 * score by default; flip with `invert: true` for "lower is better" axes.
 */
function bucket(value: number, lo: number, hi: number, invert = false): 1 | 2 | 3 {
  // value < lo → 1; value < hi → 2; else → 3
  let score: 1 | 2 | 3;
  if (value < lo) score = 1;
  else if (value < hi) score = 2;
  else score = 3;
  if (invert) score = (4 - score) as 1 | 2 | 3;
  return score;
}

function flightScore(
  input: NormalizedTripInput,
  destination: SeedDestination,
): 1 | 2 | 3 {
  const flight = destination.typicalCostBands.flightFromOrigin[input.originCode] ?? 350;
  // Lower flight cost ≈ shorter/easier. Thresholds calibrated to the
  // origins we support: <= $200 is "very short" (e.g. NYC→Boston), <= $325
  // is "moderate", > $325 is "real flight."
  return bucket(flight, 201, 326, true);
}

function budgetScore(
  input: NormalizedTripInput,
  destination: SeedDestination,
): 1 | 2 | 3 {
  const total = estimateTripCostUsd(destination, input);
  const ceiling = input.budgetCeilingUsd ?? null;
  if (!ceiling) return 2; // No ceiling → neutral
  const ratio = total / ceiling;
  // ratio <= 0.7 → tons of headroom (3); 0.7-0.95 → comfortable (2); > 0.95 → tight (1)
  if (ratio <= 0.7) return 3;
  if (ratio <= 0.95) return 2;
  return 1;
}

function seasonScore(
  input: NormalizedTripInput,
  destination: SeedDestination,
): 1 | 2 | 3 {
  if (destination.bestSeasons.length === 0) return 2; // No data → neutral
  if (destination.bestSeasons.includes(input.seasonHint)) return 3;
  const adjacent = ADJACENT_SEASON[input.seasonHint] ?? [];
  if (destination.bestSeasons.some((s) => adjacent.includes(s))) return 2;
  return 1;
}

function vibeScore(
  input: NormalizedTripInput,
  destination: SeedDestination,
): 1 | 2 | 3 {
  // Match user vibes against destination tags. Both arrays use the same
  // Vibe enum, so direct intersection works.
  const vibes = new Set(input.vibes);
  const overlap = destination.tags.filter((t) => vibes.has(t)).length;
  // 0 overlap → 1; 1 overlap → 2; 2+ overlap → 3
  if (overlap === 0) return 1;
  if (overlap === 1) return 2;
  return 3;
}

function crowdScore(
  input: NormalizedTripInput,
  destination: SeedDestination,
): 1 | 2 | 3 {
  // Heuristic: parks + small towns + chill-tagged places are quieter.
  // Cities + nightlife + summer cluster as "more crowded."
  const isPark = destination.slug.endsWith("-np");
  const isCity = destination.tags.includes("city");
  const isChill = destination.tags.includes("chill");
  const isPopularSummer =
    input.seasonHint === "summer" && (isPark || isCity);

  if (isPopularSummer) return 1;
  if (isPark && (input.seasonHint === "fall" || input.seasonHint === "spring")) {
    return 3; // Shoulder-season parks are notably quiet
  }
  if (isChill && !isCity) return 3;
  if (isCity && input.seasonHint === "summer") return 1;
  if (isCity) return 2;
  return 2;
}

export function computeTradeoffs(
  input: NormalizedTripInput,
  destination: SeedDestination,
): Tradeoffs {
  return {
    flight: flightScore(input, destination),
    budget: budgetScore(input, destination),
    crowd: crowdScore(input, destination),
    vibeFit: vibeScore(input, destination),
    seasonFit: seasonScore(input, destination),
  };
}

/**
 * Helper used by Phase A.3 preset boosts. Produces a comparable cost number
 * for sorting: the same `estimateTripCostUsd` minus the lodging-nights
 * adjustment, so cheaper picks bubble up.
 */
export function comparableTotalUsd(
  input: NormalizedTripInput,
  destination: SeedDestination,
): number {
  // Reuse the existing estimator. lodgingNights handles the nights = days-1
  // edge case.
  void lodgingNights; // referenced for clarity; actual call inside estimateTripCostUsd
  return estimateTripCostUsd(destination, input);
}
