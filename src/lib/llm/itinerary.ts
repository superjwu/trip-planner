import Anthropic from "@anthropic-ai/sdk";
import { ItineraryResponseSchema, type ItineraryResponse } from "../schemas";
import { ITIN_PROMPT_VERSION, REC_MODEL, type NormalizedTripInput, type SeedDestination } from "../types";
import { buildItineraryUserPrompt, ITINERARY_SYSTEM_PROMPT } from "./prompts";

export interface ItineraryResult {
  response: ItineraryResponse;
  meta: {
    model: string;
    promptVersion: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
  };
}

export async function generateItinerary(args: {
  input: NormalizedTripInput;
  destination: SeedDestination;
}): Promise<ItineraryResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const start = Date.now();
  const message = await client.messages.create({
    model: REC_MODEL,
    max_tokens: 1500,
    system: ITINERARY_SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildItineraryUserPrompt(args) },
    ],
  });
  const latencyMs = Date.now() - start;

  const text = message.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("");

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Itinerary LLM returned no JSON");
  const json = JSON.parse(match[0]);
  const response = ItineraryResponseSchema.parse(json);

  // Coerce day count to trip length, in case the model overshoots
  const trimmed = {
    days: response.days.slice(0, args.input.tripLengthDays),
  };

  return {
    response: trimmed,
    meta: {
      model: REC_MODEL,
      promptVersion: ITIN_PROMPT_VERSION,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      latencyMs,
    },
  };
}

export async function generateItineraryWithRetry(args: {
  input: NormalizedTripInput;
  destination: SeedDestination;
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
