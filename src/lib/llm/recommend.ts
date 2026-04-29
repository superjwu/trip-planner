import crypto from "node:crypto";
import {
  RecommendationResponseSchema,
  REC_TOOL_PARAMETERS_SCHEMA,
  type RecommendationResponse,
} from "../schemas";
import { DESTINATIONS } from "../seed/destinations";
import {
  REC_MODEL,
  REC_PROMPT_VERSION,
  REC_REASONING,
  SEED_VERSION,
  type NormalizedTripInput,
  type SeedDestination,
} from "../types";
import {
  buildCandidatesBlock,
  buildRefineBlock,
  buildUserPrefsBlock,
  REC_SYSTEM_PROMPT,
  type RefineContext,
} from "./prompts";
import {
  buildInput,
  codexCompletion,
  type CodexTool,
} from "./codex-client";
import { resolveCodexAuth } from "./codex-token";
import { lodgingNights } from "../normalize";

// Upper-bound dollars per band. Pre-filter rejects any destination whose
// rough total-trip estimate (flight + lodging × days + food × days +
// activities × days) exceeds 1.15 × this ceiling. The 15% headroom lets the
// LLM still pick a destination that's slightly over budget when nothing else
// fits, rather than returning fewer than 4 candidates.
const BUDGET_CEILING_BY_BAND: Record<string, number> = {
  "under-500": 500,
  "500-1000": 1000,
  "1000-2000": 2000,
  "2000-plus": 4000,
};
const BUDGET_HEADROOM = 1.15;

/**
 * Rough all-in trip cost from origin = flight + lodging·nights + food·days +
 * activities·days. Mirrors the formula in src/lib/hydrate.ts:buildCost (which
 * runs at hydration time, against possibly-live Amadeus data) so the
 * pre-filter sees what the user will eventually see on the card.
 *
 * Note: nights = days - 1 (depart-morning / return-evening). A 4-day trip is
 * 3 hotel nights. This was a Codex audit catch — the prior version used
 * days for lodging and over-counted by ~1 night, which pushed scenic
 * destinations like Aspen and Big Sur over budget bands artificially.
 */
export function estimateTripCostUsd(
  destination: SeedDestination,
  input: NormalizedTripInput,
): number {
  const flight = destination.typicalCostBands.flightFromOrigin[input.originCode] ?? 350;
  const days = input.tripLengthDays;
  const nights = lodgingNights(days);
  const lodging = destination.typicalCostBands.lodgingPerNightUsd * nights;
  const food = destination.typicalCostBands.foodPerDayUsd * days;
  const activities = destination.typicalCostBands.activitiesPerDayUsd * days;
  return flight + lodging + food + activities;
}

/**
 * Returns destinations that pass code-side hard filters: origin not in the
 * candidate list, season compat, and budget feasibility (whole-trip estimate,
 * not just flight cost).
 */
export function preFilter(
  input: NormalizedTripInput,
  pool: SeedDestination[] = DESTINATIONS,
): SeedDestination[] {
  const ceiling = BUDGET_CEILING_BY_BAND[input.budgetBand] ?? 2000;
  const cap = ceiling * BUDGET_HEADROOM;

  return pool.filter((d) => {
    if (d.slug === slugForOrigin(input.originCode)) return false;
    if (d.bestSeasons.length > 0 && !d.bestSeasons.includes(input.seasonHint)) {
      return false;
    }
    const total = estimateTripCostUsd(d, input);
    if (total > cap) return false;
    return true;
  });
}

function slugForOrigin(origin: NormalizedTripInput["originCode"]): string {
  switch (origin) {
    case "NYC": return "nyc";
    case "CHI": return "chicago";
    case "LAX": return "los-angeles";
    case "SFO": return "san-francisco";
    case "SEA": return "seattle";
  }
}

export function cacheKey(
  input: NormalizedTripInput,
  refine?: RefineContext,
): string {
  const payload = stableStringify({
    input,
    seedVersion: SEED_VERSION,
    promptVersion: REC_PROMPT_VERSION,
    model: REC_MODEL,
    // Refine context is part of the cache key on round 2+. Two users who
    // happen to give identical feedback on identical trips can share the
    // refined response.
    refine: refine
      ? {
          kept: [...refine.keptSlugs].sort(),
          avoided: [...refine.avoidedSlugs].sort(),
          presets: [...refine.feedbackPresets].sort(),
          feedbackText: refine.feedbackText,
          previousSlugs: refine.previousPicks
            .map((p) => p.slug)
            .sort(),
        }
      : null,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Order-independent JSON.stringify. Postgres JSONB doesn't preserve key
 * order across round-trips, so the same logical input would hash differently
 * coming from the wizard (TS object literal order) vs being read from the DB
 * (storage order). Sort keys recursively at every level to make the hash
 * stable.
 *
 * Edge cases vs raw JSON.stringify:
 * - `undefined` at the top level / inside objects: JSON.stringify omits the
 *   key entirely. We do the same to keep `{notes: undefined}` and `{}`
 *   collapse to the same hash. (For Codex review: this matters because a
 *   trip without notes goes through normalize() with `notes: undefined`,
 *   while a round-trip from JSONB drops the key entirely.)
 * - `undefined` inside arrays: JSON.stringify writes `null`. We do the same.
 * - Non-finite numbers (NaN, Infinity): JSON.stringify writes `null`. We do
 *   the same. None of our inputs should ever produce NaN, but this catches
 *   a future regression silently.
 */
function stableStringify(value: unknown): string {
  if (value === undefined) return "null";
  if (typeof value === "number" && !Number.isFinite(value)) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return (
    "{" +
    keys
      .map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k]))
      .join(",") +
    "}"
  );
}

const REC_TOOL: CodexTool = {
  type: "function",
  name: "pick_destinations",
  description:
    "Return the 4 best destinations from the candidate list, ranked, with one reasoning sentence each that cites a specific user preference.",
  parameters: REC_TOOL_PARAMETERS_SCHEMA as unknown as Record<string, unknown>,
  strict: true,
};

export interface RankResult {
  response: RecommendationResponse;
  meta: {
    model: string;
    promptVersion: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    candidateCount: number;
    chatgptAccountId: string;
    via: "codex-backend";
  };
}

/**
 * Single Codex call. Per-user OAuth: caller passes `clerkUserId`; we resolve
 * their access token + chatgpt-account-id via resolveCodexAuth() (auto-refreshes
 * near expiry). Pass `refine` on round 2+ so the model gets prior picks +
 * feedback.
 */
export async function rankDestinations(args: {
  clerkUserId: string;
  input: NormalizedTripInput;
  candidates: SeedDestination[];
  refine?: RefineContext;
}): Promise<RankResult> {
  if (args.candidates.length < 4) {
    throw new Error(`Need at least 4 candidates, got ${args.candidates.length}`);
  }
  const auth = await resolveCodexAuth(args.clerkUserId);

  const userBlocks = [
    buildCandidatesBlock(args.candidates),
    buildUserPrefsBlock(args.input, args.candidates),
  ];
  if (args.refine) {
    userBlocks.push(buildRefineBlock(args.refine));
  }

  const result = await codexCompletion({
    accessToken: auth.accessToken,
    chatgptAccountId: auth.chatgptAccountId,
    model: REC_MODEL,
    reasoning: { effort: REC_REASONING },
    instructions: REC_SYSTEM_PROMPT,
    input: buildInput({ userBlocks }),
    tools: [REC_TOOL],
    forceTool: REC_TOOL.name,
    promptCacheKey: `rec:${SEED_VERSION}:${REC_PROMPT_VERSION}`,
    maxOutputTokens: 1800,
  });

  if (!result.toolCall || result.toolCall.name !== REC_TOOL.name) {
    throw new Error(
      `Codex did not invoke pick_destinations. text="${result.text.slice(0, 200)}"`,
    );
  }
  const argsJson = safeParseJson(result.toolCall.arguments);
  const response = RecommendationResponseSchema.parse(argsJson);

  // Reject picks not in the candidate list.
  const candidateSlugs = new Set(args.candidates.map((d) => d.slug));
  for (const pick of response.picks) {
    if (!candidateSlugs.has(pick.slug)) {
      throw new Error(`Codex picked unknown slug: ${pick.slug}`);
    }
  }

  return {
    response,
    meta: {
      model: REC_MODEL,
      promptVersion: REC_PROMPT_VERSION,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      candidateCount: args.candidates.length,
      chatgptAccountId: auth.chatgptAccountId,
      via: "codex-backend",
    },
  };
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch (e) {
    throw new Error(`Codex tool arguments not JSON: ${(e as Error).message}`);
  }
}

/**
 * One retry on parse / validation failure (rare with forced tool calls but
 * we keep the backstop for resilience).
 */
export async function rankDestinationsWithRetry(args: {
  clerkUserId: string;
  input: NormalizedTripInput;
  candidates: SeedDestination[];
  refine?: RefineContext;
}): Promise<RankResult> {
  try {
    return await rankDestinations(args);
  } catch (firstErr) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rec] rank attempt 1 failed:", firstErr);
    }
    return await rankDestinations(args);
  }
}
