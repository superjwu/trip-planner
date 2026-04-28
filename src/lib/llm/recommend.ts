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
  buildUserPrefsBlock,
  REC_SYSTEM_PROMPT,
} from "./prompts";
import {
  buildInput,
  codexCompletion,
  type CodexTool,
} from "./codex-client";
import { resolveCodexAuth } from "./codex-token";

const FLIGHT_CEILING_BY_BAND: Record<string, number> = {
  "under-500": 350,
  "500-1000": 500,
  "1000-2000": 700,
  "2000-plus": 1500,
};

/**
 * Returns destinations that pass code-side hard filters: origin not in the
 * candidate list, season compat, and budget feasibility.
 */
export function preFilter(
  input: NormalizedTripInput,
  pool: SeedDestination[] = DESTINATIONS,
): SeedDestination[] {
  const flightCap = FLIGHT_CEILING_BY_BAND[input.budgetBand] ?? 800;
  return pool.filter((d) => {
    if (d.slug === slugForOrigin(input.originCode)) return false;
    if (d.bestSeasons.length > 0 && !d.bestSeasons.includes(input.seasonHint)) {
      return false;
    }
    const flightEst = d.typicalCostBands.flightFromOrigin[input.originCode];
    if (flightEst === undefined) return true;
    if (flightEst > flightCap) return false;
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

export function cacheKey(input: NormalizedTripInput): string {
  const payload = JSON.stringify({
    input,
    seedVersion: SEED_VERSION,
    promptVersion: REC_PROMPT_VERSION,
    model: REC_MODEL,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
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
 * Single Claude call →  single Codex call. Per-user OAuth: the caller passes
 * `clerkUserId`; we resolve their access token + chatgpt-account-id via
 * resolveCodexAuth() (which auto-refreshes near expiry).
 */
export async function rankDestinations(args: {
  clerkUserId: string;
  input: NormalizedTripInput;
  candidates: SeedDestination[];
}): Promise<RankResult> {
  if (args.candidates.length < 4) {
    throw new Error(`Need at least 4 candidates, got ${args.candidates.length}`);
  }
  const auth = await resolveCodexAuth(args.clerkUserId);

  const result = await codexCompletion({
    accessToken: auth.accessToken,
    chatgptAccountId: auth.chatgptAccountId,
    model: REC_MODEL,
    reasoning: { effort: REC_REASONING },
    input: buildInput({
      system: REC_SYSTEM_PROMPT,
      userBlocks: [
        buildCandidatesBlock(args.candidates),
        buildUserPrefsBlock(args.input),
      ],
    }),
    tools: [REC_TOOL],
    forceTool: REC_TOOL.name,
    promptCacheKey: `rec:${SEED_VERSION}:${REC_PROMPT_VERSION}`,
    maxOutputTokens: 1500,
  });

  if (!result.toolCall || result.toolCall.name !== REC_TOOL.name) {
    throw new Error("Codex did not invoke pick_destinations");
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
