// Shared types for the trip planner.
// Treat these as the contract between the wizard, the rec engine, and the UI.

export type OriginCityCode = "NYC" | "CHI" | "LAX" | "SFO" | "SEA";

export const ORIGIN_CITIES: { code: OriginCityCode; label: string; airport: string }[] = [
  { code: "NYC", label: "New York City", airport: "JFK" },
  { code: "CHI", label: "Chicago", airport: "ORD" },
  { code: "LAX", label: "Los Angeles", airport: "LAX" },
  { code: "SFO", label: "San Francisco", airport: "SFO" },
  { code: "SEA", label: "Seattle", airport: "SEA" },
];

export type Vibe = "city" | "nature" | "foodie" | "chill" | "adventure" | "scenic" | "cultural" | "nightlife";

export type BudgetBand = "under-500" | "500-1000" | "1000-2000" | "2000-plus";

export const BUDGET_BANDS: { code: BudgetBand; label: string; max?: number }[] = [
  { code: "under-500", label: "Under $500", max: 500 },
  { code: "500-1000", label: "$500 – $1,000", max: 1000 },
  { code: "1000-2000", label: "$1,000 – $2,000", max: 2000 },
  { code: "2000-plus", label: "$2,000+" },
];

export type Pace = "relaxed" | "balanced" | "packed";

export interface RawTripInput {
  origin: OriginCityCode;
  departOn: string; // ISO date 'YYYY-MM-DD'
  returnOn: string; // ISO date 'YYYY-MM-DD'
  vibes: Vibe[];
  budget: BudgetBand;
  pace?: Pace;
  dislikes?: string;
  notes?: string;
  /**
   * Phase F: when set, the user clicked this destination from /destinations
   * before reaching the wizard. The rec engine treats this as a structural
   * commitment — the slug MUST appear at rank 1 or 2.
   */
  anchorSlug?: string;
}

export interface NormalizedTripInput {
  originCode: OriginCityCode;
  originAirport: string;
  departOn: string;
  returnOn: string;
  tripLengthDays: number;
  vibes: Vibe[];
  budgetBand: BudgetBand;
  budgetCeilingUsd: number | null;
  pace: Pace;
  seasonHint: "spring" | "summer" | "fall" | "winter";
  dislikes: string;
  notes?: string;
  /** Phase F: validated against `DESTINATIONS` in `normalize()`. Undefined if missing/unknown. */
  anchorSlug?: string;
}

/**
 * v3 enrichment axes — populated for every destination via the curated
 * overrides + deterministic inference pipeline in `enrich-destinations.ts`.
 * The browse page and the rec engine both consume the enriched shape.
 */
export type Landscape =
  | "mountain"
  | "coast"
  | "desert"
  | "forest"
  | "lake"
  | "canyon"
  | "island"
  | "city";

export type Experience =
  | "hiking"
  | "foodie"
  | "museums"
  | "scenic-drives"
  | "beaches"
  | "hot-springs"
  | "wildlife";

export type ScenicSignal =
  | "iconic-vista"
  | "wildlife"
  | "geological-feature"
  | "water-feature"
  | "dark-sky"
  | "fall-color"
  | "wildflower-bloom"
  | "coastal-cliffs"
  | "alpine"
  | "redwood";

export type SceneryScore = 1 | 2 | 3 | 4 | 5;

export interface SeedDestination {
  slug: string;
  name: string;
  region: string;
  state: string;
  lat: number;
  lng: number;
  tags: Vibe[];
  blurb: string;
  heroPhotoUrl?: string; // populated by prefetch script
  attractions: { name: string; description: string }[];
  typicalCostBands: {
    flightFromOrigin: Partial<Record<OriginCityCode, number>>;
    lodgingPerNightUsd: number;
    foodPerDayUsd: number;
    activitiesPerDayUsd: number;
  };
  bestSeasons: ("spring" | "summer" | "fall" | "winter")[];
  maxFlightHoursFromOrigin?: Partial<Record<OriginCityCode, number>>;
  // v3 enrichment — populated by `enrich-destinations.ts` for every entry.
  // Optional on the raw input shape; required after enrichment.
  landscape?: Landscape;
  secondaryLandscapes?: Landscape[];
  experiences?: Experience[];
  sceneryScore?: SceneryScore;
  scenicSignals?: ScenicSignal[];
}

/**
 * Same as `SeedDestination` but with all v3 enrichment fields required.
 * Returned by `enrich-destinations.ts` and used everywhere downstream
 * (browse page, rec engine, prompts).
 */
export interface EnrichedDestination extends SeedDestination {
  landscape: Landscape;
  experiences: Experience[];
  sceneryScore: SceneryScore;
}

export interface Tradeoffs {
  flight: 1 | 2 | 3;
  budget: 1 | 2 | 3;
  crowd: 1 | 2 | 3;
  vibeFit: 1 | 2 | 3;
  seasonFit: 1 | 2 | 3;
}

export interface RecommendationPick {
  slug: string;
  rank: number;
  reasoning: string;
  matchTags: string[];
  tradeoffs?: Tradeoffs;
}

export interface CostBreakdown {
  flightUsd: number;
  lodgingUsd: number;
  foodUsd: number;
  activitiesUsd: number;
  totalUsd: number;
  /** Overall provenance: 'amadeus' if both flight + lodging live, 'mixed' if one, 'estimate' if neither. */
  source: "amadeus" | "estimate" | "mixed";
  flightSource?: "amadeus" | "estimate";
  lodgingSource?: "amadeus" | "estimate";
}

export interface WeatherForecast {
  highF: number;
  lowF: number;
  precipMm: number;
  summary: string;
}

export interface BookingLinks {
  flights: string;
  lodging: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

// Bumped to 2 when the seed grew from 26 → 40 destinations.
// Bumped to 3 when the rank prompt was enriched (attractions + per-origin
// flight cost + season fit) and reasoning effort was raised from "none" → "low",
// per Codex audit. The cache key embeds this, so old `rec_cache` rows and the
// Codex backend's prompt cache are invalidated automatically.
// Bumped to 4 when 286 destinations were imported from the
// superjwu/tourist-plan repo (40 hand-curated + 286 imported = 326 total).
// Geocoded via Wikipedia REST API; cost bands heuristic per haversine
// distance. See `scripts/import-tourist-plan-extras.ts`.
// Bumped to 5 when v3 enrichment landed: landscape / secondaryLandscapes /
// experiences / sceneryScore / scenicSignals on every destination, plus
// ~100 hand-curated extras (lake/beach/island/scenic-byway/missing-cities).
export const SEED_VERSION = 5;
// Bumped to v4 when (a) attraction descriptions + lat/lng + nearby list
// added to candidates block, (b) tradeoffs moved to code-side computation,
// (c) refine pre-filter + preset boosts wired through.
// Bumped to v5-phase-e when the candidate block adds landscape +
// experiences + descriptive scenic profile, and the system prompt picks up
// the "scenery as tiebreaker" rule. Required for cache key freshness.
// Bumped to v5-phase-f when the prompt picks up the ANCHOR DESTINATION
// hard rule. The cache key already varies on input, but the prompt itself
// changed — explicit version bump documents the cache flush.
// Bumped to v6-gpt55 when both flows moved to gpt-5.5 with bumped reasoning
// effort. The model name is already in the cache key so this is documentary,
// but it forces a clean cache flush for users whose old responses were
// generated by gpt-5.2.
export const REC_PROMPT_VERSION = "rec-v6-gpt55";
export const ITIN_PROMPT_VERSION = "itin-v3-gpt55";

// Codex-backend model names (per numman-ali/opencode-openai-codex-auth README).
// Sonnet/Haiku names from the prior Anthropic build are gone.
// Phase F+: switched both flows to gpt-5.5 for higher quality. Reasoning
// effort stays differentiated per call (see below).
export const REC_MODEL = "gpt-5.5";
export const ITIN_MODEL = "gpt-5.5";

// Reasoning effort knobs accepted by the Codex Responses endpoint:
// 'none' | 'low' | 'medium' | 'high' | 'xhigh'.
//
// REC ('medium'):    quality-sensitive — tradeoff scoring + anchor-aware
//                    composition need real CoT. Bumped from 'low' when
//                    moving to gpt-5.5; the larger model handles deeper
//                    reasoning more efficiently.
// ITIN ('low'):      more templated than ranking but still benefits from
//                    light CoT for places-by-name accuracy. Bumped from
//                    'none' on the model upgrade.
// Both calls remain well under the 30s budget the wizard's progress
// component promises.
export type ReasoningEffort = "none" | "low" | "medium" | "high" | "xhigh";
export const REC_REASONING: ReasoningEffort = "medium";
export const ITIN_REASONING: ReasoningEffort = "low";
