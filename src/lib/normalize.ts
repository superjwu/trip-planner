import {
  BUDGET_BANDS,
  ORIGIN_CITIES,
  type BudgetBand,
  type NormalizedTripInput,
  type RawTripInput,
} from "./types";
import { MAX_TRIP_DAYS } from "./schemas";
import { ENRICHED_DESTINATIONS } from "./seed/enrich-destinations";

export function tripLengthDays(departOn: string, returnOn: string): number {
  const start = Date.parse(departOn);
  const end = Date.parse(returnOn);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  const days = Math.round((end - start) / 86400_000);
  return Math.max(1, Math.min(MAX_TRIP_DAYS, days));
}

/**
 * Hotel nights = days - 1 for the standard depart-morning / return-evening
 * pattern. A 4-day trip is 3 nights of lodging. Bumped to 1 minimum so a
 * day-trip (departOn === returnOn) doesn't treat lodging as 0.
 */
export function lodgingNights(tripLengthDays: number): number {
  return Math.max(1, tripLengthDays - 1);
}

export function seasonForDate(isoDate: string): NormalizedTripInput["seasonHint"] {
  const d = new Date(isoDate);
  const m = d.getUTCMonth() + 1; // 1-12
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}

export function budgetCeiling(band: BudgetBand): number | null {
  return BUDGET_BANDS.find((b) => b.code === band)?.max ?? null;
}

export function originAirport(code: RawTripInput["origin"]): string {
  return ORIGIN_CITIES.find((c) => c.code === code)?.airport ?? "JFK";
}

/**
 * Slug set computed once at module load — `enrich-destinations.ts` already
 * runs dedupe so this matches the live candidate pool. We only check
 * existence; the rec engine handles origin-collision elsewhere.
 */
const KNOWN_SLUGS = new Set(ENRICHED_DESTINATIONS.map((d) => d.slug));

export function normalize(raw: RawTripInput): NormalizedTripInput {
  // Phase F: drop the anchor silently if the slug isn't in the live dataset.
  // The wizard already validates against DESTINATIONS at render time, so this
  // is a safety net for stale URLs / hand-typed query params.
  const anchorSlug =
    raw.anchorSlug && KNOWN_SLUGS.has(raw.anchorSlug) ? raw.anchorSlug : undefined;

  // Phase J: keep only known slugs and drop the anchor itself if present
  // (the user can't have "anchor on Big Sur AND avoid Big Sur" — the anchor
  // wins).
  const visitedSlugs = (raw.visitedSlugs ?? [])
    .filter((s) => KNOWN_SLUGS.has(s))
    .filter((s) => s !== anchorSlug);

  return {
    originCode: raw.origin,
    originAirport: originAirport(raw.origin),
    departOn: raw.departOn,
    returnOn: raw.returnOn,
    tripLengthDays: tripLengthDays(raw.departOn, raw.returnOn),
    vibes: raw.vibes,
    budgetBand: raw.budget,
    budgetCeilingUsd: budgetCeiling(raw.budget),
    pace: raw.pace ?? "balanced",
    seasonHint: seasonForDate(raw.departOn),
    dislikes: (raw.dislikes ?? "").trim(),
    notes: (raw.notes ?? "").trim() || undefined,
    anchorSlug,
    visitedSlugs: visitedSlugs.length > 0 ? visitedSlugs : undefined,
  };
}
