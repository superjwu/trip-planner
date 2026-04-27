import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import {
  RecommendationResponseSchema,
  type RecommendationResponse,
} from "../schemas";
import { DESTINATIONS } from "../seed/destinations";
import {
  REC_MODEL,
  REC_PROMPT_VERSION,
  SEED_VERSION,
  type NormalizedTripInput,
  type SeedDestination,
} from "../types";
import { buildRecUserPrompt, REC_SYSTEM_PROMPT } from "./prompts";

const FLIGHT_CEILING_BY_BAND: Record<string, number> = {
  "under-500": 350,
  "500-1000": 500,
  "1000-2000": 700,
  "2000-plus": 1500,
};

/**
 * Returns destinations that pass code-side hard filters: origin city not in
 * the candidate list, season compat, and budget feasibility (rough flight cap
 * derived from the band).
 */
export function preFilter(
  input: NormalizedTripInput,
  pool: SeedDestination[] = DESTINATIONS,
): SeedDestination[] {
  const flightCap = FLIGHT_CEILING_BY_BAND[input.budgetBand] ?? 800;

  return pool.filter((d) => {
    // Don't recommend destinations indexed against the user's origin
    if (d.slug === slugForOrigin(input.originCode)) return false;

    // Best-season compat: if dest has explicit best_seasons, the trip's season must overlap
    if (
      d.bestSeasons.length > 0 &&
      !d.bestSeasons.includes(input.seasonHint)
    ) {
      return false;
    }

    // Rough flight feasibility — flight estimate from origin must fit in budget band
    const flightEst = d.typicalCostBands.flightFromOrigin[input.originCode];
    if (flightEst === undefined) return true; // unknown — let the LLM judge
    if (flightEst > flightCap) return false;

    return true;
  });
}

// Slugs that correspond to the user's origin (so we don't recommend NYC to NYC).
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

export interface RankResult {
  response: RecommendationResponse;
  meta: {
    model: string;
    promptVersion: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    candidateCount: number;
    fromCache: boolean;
  };
}

export async function rankDestinations(
  input: NormalizedTripInput,
  candidates: SeedDestination[],
): Promise<RankResult> {
  if (candidates.length < 4) {
    throw new Error(`Need at least 4 candidates, got ${candidates.length}`);
  }

  const userPrompt = buildRecUserPrompt({ input, candidates });
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const start = Date.now();
  const message = await client.messages.create({
    model: REC_MODEL,
    max_tokens: 1500,
    system: REC_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });
  const latencyMs = Date.now() - start;

  const text = message.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("");

  const response = parseRecResponse(text);

  // Reject picks that aren't in the candidate list
  const candidateSlugs = new Set(candidates.map((d) => d.slug));
  for (const pick of response.picks) {
    if (!candidateSlugs.has(pick.slug)) {
      throw new Error(`LLM picked unknown slug: ${pick.slug}`);
    }
  }

  return {
    response,
    meta: {
      model: REC_MODEL,
      promptVersion: REC_PROMPT_VERSION,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      latencyMs,
      candidateCount: candidates.length,
      fromCache: false,
    },
  };
}

function parseRecResponse(raw: string): RecommendationResponse {
  // Tolerate code fences / leading prose by extracting the first {...} block.
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("LLM returned no JSON object");
  let json: unknown;
  try {
    json = JSON.parse(match[0]);
  } catch (e) {
    throw new Error(`LLM JSON parse failed: ${(e as Error).message}`);
  }
  return RecommendationResponseSchema.parse(json);
}

/**
 * One retry on parse / validation failure (single Claude call has occasional
 * misformat). After two attempts, surfaces the original error.
 */
export async function rankDestinationsWithRetry(
  input: NormalizedTripInput,
  candidates: SeedDestination[],
): Promise<RankResult> {
  try {
    return await rankDestinations(input, candidates);
  } catch (firstErr) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rec] rank attempt 1 failed:", firstErr);
    }
    return await rankDestinations(input, candidates);
  }
}
