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
  input: CodexInputMessage[];
  tools?: CodexTool[];
  /** Forced tool name. When set, the model must emit a function_call to this tool. */
  forceTool?: string;
  /** Stable cache key — passed via session_id + conversation_id to nudge the
   * Codex backend's own prompt cache. */
  promptCacheKey?: string;
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
  if (args.maxOutputTokens) body.max_output_tokens = args.maxOutputTokens;

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
  const final = pickFinalResponseEvent(events);
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

/** The Responses-style stream ends with a `response.completed` event whose
 *  payload contains the full response object. Older variants may emit
 *  `response.done` or just include the response object on the last data line. */
function pickFinalResponseEvent(events: SseEvent[]): CodexResponseJson {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e.type === "response.completed" || e.type === "response.done") {
      const r = e.payload["response"];
      if (r && typeof r === "object") return r as CodexResponseJson;
      return e.payload as CodexResponseJson;
    }
  }
  // Fallback: last event with usable shape.
  for (let i = events.length - 1; i >= 0; i--) {
    const p = events[i].payload;
    if (p && typeof p === "object" && ("output" in p || "usage" in p)) {
      return p as CodexResponseJson;
    }
  }
  throw new Error("Codex stream ended without a response.completed event");
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
 * Helper to build the OpenAI-Responses-style input message array our two
 * call sites need.
 */
export function buildInput(args: {
  system: string;
  userBlocks: string[];
}): CodexInputMessage[] {
  return [
    {
      type: "message",
      role: "system",
      content: [{ type: "input_text", text: args.system }],
    },
    {
      type: "message",
      role: "user",
      content: args.userBlocks.map((t) => ({ type: "input_text" as const, text: t })),
    },
  ];
}
