import {
  BUDGET_BANDS,
  ORIGIN_CITIES,
  type BudgetBand,
  type NormalizedTripInput,
  type RawTripInput,
} from "./types";

export function tripLengthDays(departOn: string, returnOn: string): number {
  const start = Date.parse(departOn);
  const end = Date.parse(returnOn);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  const days = Math.round((end - start) / 86400_000);
  return Math.max(1, days);
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

export function normalize(raw: RawTripInput): NormalizedTripInput {
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
  };
}
