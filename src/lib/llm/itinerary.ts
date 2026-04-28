import {
  buildItineraryResponseSchema,
  buildItineraryToolParametersSchema,
  type ItineraryResponse,
} from "../schemas";
import {
  ITIN_MODEL,
  ITIN_PROMPT_VERSION,
  ITIN_REASONING,
  type NormalizedTripInput,
  type SeedDestination,
} from "../types";
import {
  buildInput,
  codexCompletion,
  type CodexTool,
} from "./codex-client";
import { resolveCodexAuth } from "./codex-token";
import {
  buildItineraryUserPrompt,
  ITINERARY_SYSTEM_PROMPT,
} from "./prompts";

export interface ItineraryResult {
  response: ItineraryResponse;
  meta: {
    model: string;
    promptVersion: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    chatgptAccountId: string;
    via: "codex-backend";
  };
}

export async function generateItinerary(args: {
  clerkUserId: string;
  input: NormalizedTripInput;
  destination: SeedDestination;
  tripLengthDays: number;
}): Promise<ItineraryResult> {
  const auth = await resolveCodexAuth(args.clerkUserId);
  const tool: CodexTool = {
    type: "function",
    name: "write_itinerary",
    description: `Return exactly ${args.tripLengthDays} sequential days for the trip.`,
    parameters: buildItineraryToolParametersSchema(args.tripLengthDays) as unknown as Record<string, unknown>,
    strict: true,
  };

  const result = await codexCompletion({
    accessToken: auth.accessToken,
    chatgptAccountId: auth.chatgptAccountId,
    model: ITIN_MODEL,
    reasoning: { effort: ITIN_REASONING },
    instructions: ITINERARY_SYSTEM_PROMPT,
    input: buildInput({
      userBlocks: [
        buildItineraryUserPrompt({
          input: args.input,
          destination: args.destination,
          tripLengthDays: args.tripLengthDays,
        }),
      ],
    }),
    tools: [tool],
    forceTool: tool.name,
    maxOutputTokens: 1500,
  });

  if (!result.toolCall || result.toolCall.name !== tool.name) {
    throw new Error("Codex did not invoke write_itinerary");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(result.toolCall.arguments);
  } catch (e) {
    throw new Error(`Itinerary tool arguments not JSON: ${(e as Error).message}`);
  }
  const Schema = buildItineraryResponseSchema(args.tripLengthDays);
  const response = Schema.parse(parsed);

  return {
    response,
    meta: {
      model: ITIN_MODEL,
      promptVersion: ITIN_PROMPT_VERSION,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      chatgptAccountId: auth.chatgptAccountId,
      via: "codex-backend",
    },
  };
}

export async function generateItineraryWithRetry(args: {
  clerkUserId: string;
  input: NormalizedTripInput;
  destination: SeedDestination;
  tripLengthDays: number;
}): Promise<ItineraryResult> {
  try {
    return await generateItinerary(args);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[itin] attempt 1 failed:", e);
    }
    return await generateItinerary(args);
  }
}
