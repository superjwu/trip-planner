/**
 * ChatGPT (Codex) backend client.
 *
 * Talks to https://chatgpt.com/backend-api/codex/responses with the user's
 * OAuth access token in the Authorization header and chatgpt-account-id as a
 * required custom header. The shape is OpenAI Responses-style — input items,
 * tools (forced via tool_choice), reasoning effort.
 *
 * Source-of-truth headers + URL come from numman-ali/opencode-openai-codex-auth's
 * `lib/request/fetch-helpers.ts` and `lib/constants.ts`.
 */
import { CodexAuthExpiredError, CodexRateLimitError } from "./codex-auth";

const CODEX_BASE_URL = "https://chatgpt.com/backend-api";
const CODEX_RESPONSES_PATH = "/codex/responses";
const FETCH_TIMEOUT_MS = 90_000;

const CODEX_HEADERS = {
  ACCOUNT_ID: "chatgpt-account-id",
  BETA: "OpenAI-Beta",
  ORIGINATOR: "originator",
  CONVERSATION_ID: "conversation_id",
  SESSION_ID: "session_id",
};

const CODEX_HEADER_VALUES = {
  BETA_RESPONSES: "responses=experimental",
  ORIGINATOR_CODEX: "codex_cli_rs",
};

export interface CodexTool {
  type: "function";
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
  strict?: boolean;
}

export interface CodexInputMessage {
  type: "message";
  role: "system" | "user" | "assistant";
  content: { type: "input_text"; text: string }[];
}

export interface CodexCompletionArgs {
  accessToken: string;
  chatgptAccountId: string;
  model: string;
  reasoning?: { effort?: "minimal" | "low" | "medium" | "high" };
  /** Top-level system instructions string. The Codex backend requires this
   * field — it does NOT accept a system-role message inside `input`. */
  instructions: string;
  /** User-role messages only. */
  input: CodexInputMessage[];
  tools?: CodexTool[];
  /** Forced tool name. When set, the model must emit a function_call to this tool. */
  forceTool?: string;
  /** Stable cache key — passed via session_id + conversation_id to nudge the
   * Codex backend's own prompt cache. */
  promptCacheKey?: string;
  /** NOTE: max_output_tokens is not supported by the Codex backend. Field
   * kept on the interface for parity but ignored when serializing. */
  maxOutputTokens?: number;
}

export interface CodexFunctionCall {
  type: "function_call";
  name: string;
  arguments: string; // JSON string
}

export interface CodexResponseJson {
  output?: unknown[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  [k: string]: unknown;
}

export interface CodexCompletionResult {
  raw: CodexResponseJson;
  /** The first function_call output item, if present. */
  toolCall: CodexFunctionCall | null;
  /** All text output items concatenated, if any. */
  text: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

export async function codexCompletion(args: CodexCompletionArgs): Promise<CodexCompletionResult> {
  const url = `${CODEX_BASE_URL}${CODEX_RESPONSES_PATH}`;
  const body: Record<string, unknown> = {
    model: args.model,
    instructions: args.instructions,
    input: args.input,
    stream: true, // Codex backend always streams SSE
    store: false,
  };
  if (args.reasoning) body.reasoning = args.reasoning;
  if (args.tools && args.tools.length > 0) {
    body.tools = args.tools;
    if (args.forceTool) {
      body.tool_choice = { type: "function", name: args.forceTool };
    } else {
      body.tool_choice = "auto";
    }
  }
  // Codex backend rejects max_output_tokens; intentionally not forwarded.

  const headers: Record<string, string> = {
    Authorization: `Bearer ${args.accessToken}`,
    "Content-Type": "application/json",
    Accept: "text/event-stream",
    [CODEX_HEADERS.ACCOUNT_ID]: args.chatgptAccountId,
    [CODEX_HEADERS.BETA]: CODEX_HEADER_VALUES.BETA_RESPONSES,
    [CODEX_HEADERS.ORIGINATOR]: CODEX_HEADER_VALUES.ORIGINATOR_CODEX,
  };
  if (args.promptCacheKey) {
    headers[CODEX_HEADERS.CONVERSATION_ID] = args.promptCacheKey;
    headers[CODEX_HEADERS.SESSION_ID] = args.promptCacheKey;
  }

  const start = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const latencyMs = Date.now() - start;

  if (res.status === 401) throw new CodexAuthExpiredError();
  if (res.status === 429) throw new CodexRateLimitError();
  if (res.status === 404) {
    // Codex sometimes returns 404 with usage_limit_reached payload — treat as rate-limit.
    const text = await res.text();
    if (/usage_limit|rate_limit/i.test(text)) throw new CodexRateLimitError();
    throw new Error(`Codex 404: ${text}`);
  }
  if (!res.ok) {
    throw new Error(`Codex ${res.status}: ${await res.text()}`);
  }

  if (!res.body) throw new Error("Codex returned empty body");

  const events = await readSseEvents(res.body);
  const final = assembleResponse(events);
  return finalize(final, latencyMs);
}

interface SseEvent {
  type: string;
  payload: Record<string, unknown>;
}

async function readSseEvents(stream: ReadableStream<Uint8Array>): Promise<SseEvent[]> {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const events: SseEvent[] = [];
  let buffer = "";
  // SSE: events separated by blank line; each event has lines like "event: x", "data: {...}"
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const ev = parseSseBlock(block);
      if (ev) events.push(ev);
    }
  }
  if (buffer.trim()) {
    const ev = parseSseBlock(buffer);
    if (ev) events.push(ev);
  }
  return events;
}

function parseSseBlock(block: string): SseEvent | null {
  let type = "message";
  const dataLines: string[] = [];
  for (const raw of block.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(":")) continue;
    if (line.startsWith("event:")) {
      type = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (dataLines.length === 0) return null;
  const data = dataLines.join("\n");
  if (data === "[DONE]") return { type: "done", payload: {} };
  try {
    return { type, payload: JSON.parse(data) as Record<string, unknown> };
  } catch {
    return null;
  }
}

/**
 * Codex backend streams the response as Responses-API events:
 *   response.created → in_progress → output_item.added (per item) →
 *   response.function_call_arguments.delta (many) → ...arguments.done →
 *   response.output_item.done (per item, with full arguments) → response.completed
 *
 * The terminal `response.completed` event sometimes ships with an empty
 * `output: []` snapshot (Codex backend specific). The reliable path is to
 * assemble output items from `response.output_item.done` events and merge
 * accumulated `function_call_arguments.delta` chunks.
 */
function assembleResponse(events: SseEvent[]): CodexResponseJson {
  // Final item snapshots, indexed by output_index when present
  const items: Record<string, Record<string, unknown>> = {};
  // Argument deltas accumulated per item_id
  const argDeltas: Record<string, string[]> = {};

  let metaResponse: CodexResponseJson | null = null;

  for (const ev of events) {
    const p = ev.payload;
    if (!p || typeof p !== "object") continue;

    if (ev.type === "response.completed" || ev.type === "response.done") {
      const r = (p as { response?: unknown }).response;
      if (r && typeof r === "object") {
        metaResponse = r as CodexResponseJson;
      } else {
        metaResponse = p as CodexResponseJson;
      }
      continue;
    }

    if (ev.type === "response.output_item.done" || ev.type === "response.output_item.added") {
      const item = (p as { item?: Record<string, unknown> }).item;
      const idx = (p as { output_index?: number }).output_index;
      if (item && typeof idx === "number") {
        const key = String(idx);
        // .done overrides .added for the same index
        if (ev.type === "response.output_item.done" || !items[key]) {
          items[key] = { ...item };
        }
      }
      continue;
    }

    if (ev.type === "response.function_call_arguments.delta") {
      const idx = (p as { output_index?: number }).output_index;
      const delta = (p as { delta?: string }).delta;
      if (typeof idx === "number" && typeof delta === "string") {
        const key = String(idx);
        (argDeltas[key] ||= []).push(delta);
      }
      continue;
    }

    if (ev.type === "response.function_call_arguments.done") {
      const idx = (p as { output_index?: number }).output_index;
      const args = (p as { arguments?: string }).arguments;
      if (typeof idx === "number" && typeof args === "string") {
        const key = String(idx);
        const target = (items[key] ||= { type: "function_call" });
        target.arguments = args;
      }
      continue;
    }
  }

  // Merge accumulated arg deltas into items where we don't already have a final
  // arguments string (covers backends that omit the arguments.done event).
  for (const [key, parts] of Object.entries(argDeltas)) {
    const target = (items[key] ||= { type: "function_call" });
    if (typeof target.arguments !== "string" || (target.arguments as string).length === 0) {
      target.arguments = parts.join("");
    }
  }

  const output = Object.entries(items)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, v]) => v);

  if (metaResponse) {
    return { ...metaResponse, output };
  }
  return { output, usage: {} } as CodexResponseJson;
}

function finalize(raw: CodexResponseJson, latencyMs: number): CodexCompletionResult {
  const output = Array.isArray(raw.output) ? (raw.output as Record<string, unknown>[]) : [];
  let toolCall: CodexFunctionCall | null = null;
  const textParts: string[] = [];
  for (const item of output) {
    if (item.type === "function_call" && typeof item.name === "string" && typeof item.arguments === "string") {
      toolCall = {
        type: "function_call",
        name: item.name,
        arguments: item.arguments,
      };
    } else if (item.type === "message" && Array.isArray(item.content)) {
      for (const c of item.content as Record<string, unknown>[]) {
        if ((c.type === "output_text" || c.type === "text") && typeof c.text === "string") {
          textParts.push(c.text);
        }
      }
    }
  }
  const usage = raw.usage ?? {};
  return {
    raw,
    toolCall,
    text: textParts.join(""),
    inputTokens: typeof usage.input_tokens === "number" ? usage.input_tokens : 0,
    outputTokens: typeof usage.output_tokens === "number" ? usage.output_tokens : 0,
    latencyMs,
  };
}

/**
 * Helper to build a single user message containing all the non-system blocks.
 * The system prompt goes into `instructions` at the top level — see
 * CodexCompletionArgs.instructions.
 */
export function buildInput(args: {
  userBlocks: string[];
}): CodexInputMessage[] {
  return [
    {
      type: "message",
      role: "user",
      content: args.userBlocks.map((t) => ({ type: "input_text" as const, text: t })),
    },
  ];
}
