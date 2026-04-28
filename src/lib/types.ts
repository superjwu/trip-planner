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
}

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
}

export interface RecommendationPick {
  slug: string;
  rank: number;
  reasoning: string;
  matchTags: string[];
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

export const SEED_VERSION = 1;
export const REC_PROMPT_VERSION = "rec-v2-codex";
export const ITIN_PROMPT_VERSION = "itin-v2-codex";

// Codex-backend model names (per numman-ali/opencode-openai-codex-auth README).
// Sonnet/Haiku names from the prior Anthropic build are gone.
export const REC_MODEL = "gpt-5.2";
export const ITIN_MODEL = "gpt-5.1";

// Reasoning effort knobs accepted by the Codex Responses endpoint.
// Note: with GPT-5.x the model can silently emit 0 output items if reasoning
// exhausts its internal budget on a structured tool call. "low" is the
// conservative pick that reliably produces tool output.
export type ReasoningEffort = "minimal" | "low" | "medium" | "high";
export const REC_REASONING: ReasoningEffort = "low";
export const ITIN_REASONING: ReasoningEffort = "minimal";
