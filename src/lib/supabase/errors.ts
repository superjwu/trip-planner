/**
 * Turns Supabase / PostgREST / pgcrypto failures into specific, greppable
 * codes with an actionable hint.
 *
 * Motivation: a stretch of debugging where every layer reported the same
 * useless string. "Invalid API key", "TypeError: fetch failed" and "No
 * suitable key or wrong key type" each have exactly one cause and exactly one
 * fix, but nothing in the app said which knob to turn — so each one cost a
 * round-trip to find out. Every classification below maps to a single
 * dashboard action.
 *
 * Never put secret values in these messages. Host names and key *lengths* are
 * fine; key material is not.
 */

export type SupabaseFailureCode =
  /** DNS/connection failure — project paused, deleted, or wrong URL. */
  | "supabase_unreachable"
  /** apikey header rejected — wrong/stale publishable or secret key. */
  | "supabase_bad_api_key"
  /** PostgREST couldn't verify the Clerk JWT — Third-Party Auth not wired up. */
  | "supabase_thirdparty_auth_unconfigured"
  /** Table missing — migrations not applied to this project. */
  | "supabase_missing_table"
  /** RPC missing — migrations not applied, or wrong signature. */
  | "supabase_missing_function"
  /** Role lacks EXECUTE/SELECT — wrong client used for this call. */
  | "supabase_permission_denied"
  /** PostgREST schema cache still warming (transient, retry). */
  | "supabase_schema_cache_cold"
  /** pgcrypto couldn't decrypt — CODEX_TOKEN_ENCRYPTION_KEY differs from the
   *  one the row was written with. */
  | "codex_encryption_key_mismatch"
  /** pgcrypto got an empty key — CODEX_TOKEN_ENCRYPTION_KEY unset/blank. */
  | "codex_encryption_key_missing"
  | "supabase_unknown";

export interface SupabaseFailureDetail {
  code: SupabaseFailureCode;
  /** One line naming the actual problem. */
  summary: string;
  /** The single action that fixes it. */
  hint: string;
  /** Which call failed, e.g. "codex_auth_upsert". */
  operation: string;
  /** Project host we were talking to — the fastest way to spot a stale URL. */
  projectHost: string | null;
  /** Original message, preserved for the log. */
  raw: string;
}

/** Error carrying a {@link SupabaseFailureDetail}. */
export class SupabaseFailure extends Error {
  readonly detail: SupabaseFailureDetail;

  constructor(detail: SupabaseFailureDetail) {
    super(`[${detail.code}] ${detail.operation}: ${detail.summary} — ${detail.hint}`);
    this.name = "SupabaseFailure";
    this.detail = detail;
  }

  get code(): SupabaseFailureCode {
    return this.detail.code;
  }
}

function projectHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

interface RawSupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Classify a supabase-js error (or a thrown Error) into a specific code.
 * `operation` should name the call site, e.g. "codex_auth_read".
 */
export function classifySupabaseError(err: unknown, operation: string): SupabaseFailureDetail {
  const e = (err ?? {}) as RawSupabaseError;
  const message = e.message ?? (err instanceof Error ? err.message : String(err));
  const pgCode = e.code ?? "";
  const blob = `${pgCode} ${message} ${e.details ?? ""}`;
  const host = projectHost();

  const is = (re: RegExp) => re.test(blob);

  // Order matters: the specific patterns must precede the generic ones.
  if (is(/fetch failed|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|getaddrinfo|ETIMEDOUT/i)) {
    return {
      code: "supabase_unreachable",
      summary: `Could not reach ${host ?? "the Supabase project"}.`,
      hint: "The project is paused/deleted or NEXT_PUBLIC_SUPABASE_URL is stale. Check the project is live in the Supabase dashboard, then confirm the URL in this environment matches it.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/Invalid API key|JWSError|invalid_api_key/i) && !is(/PGRST301/)) {
    return {
      code: "supabase_bad_api_key",
      summary: `${host ?? "Supabase"} rejected the apikey header.`,
      hint: "The key belongs to a different project or is truncated. Re-copy from Supabase → Settings → API Keys, set it in this environment, and redeploy — NEXT_PUBLIC_* values are inlined at build time, so a cached rebuild keeps the old one.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/PGRST301|No suitable key|not find a suitable key/i)) {
    return {
      code: "supabase_thirdparty_auth_unconfigured",
      summary: "PostgREST could not verify the Clerk session token.",
      hint: "Register Clerk under Supabase → Authentication → Third-Party Auth (Add provider → Clerk, paste your Clerk domain). Owner-scoped reads of trips/recommendations fail until this exists on THIS project.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/PGRST202|Could not find the function/i)) {
    return {
      code: "supabase_missing_function",
      summary: `RPC used by ${operation} does not exist on ${host ?? "this project"}.`,
      hint: "Migrations were not applied to this project. Apply supabase/migrations/*.sql via the Supabase MCP apply_migration, in order.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/42P01|Could not find the table|relation .* does not exist/i)) {
    return {
      code: "supabase_missing_table",
      summary: `A table used by ${operation} does not exist on ${host ?? "this project"}.`,
      hint: "Migrations were not applied to this project. Apply supabase/migrations/*.sql in order.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/PGRST002|schema cache/i)) {
    return {
      code: "supabase_schema_cache_cold",
      summary: "PostgREST's schema cache is still warming up.",
      hint: "Transient, typically right after a project resumes. Retry in a few seconds; if it persists, reload the schema cache from the Supabase dashboard.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/42501|permission denied/i)) {
    return {
      code: "supabase_permission_denied",
      summary: `The role used for ${operation} lacks permission.`,
      hint: "Token reads/writes must use the service-role client (createAdminSupabase). If this came from an anon-scoped client, that's the bug — see the RLS/grants in migration 0002.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/Wrong key or corrupt data/i)) {
    return {
      code: "codex_encryption_key_mismatch",
      summary: "pgcrypto could not decrypt the stored token.",
      hint: "CODEX_TOKEN_ENCRYPTION_KEY in this environment differs from the one the row was encrypted with. Make it identical everywhere, or delete the row from user_codex_auth and reconnect.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  if (is(/Illegal argument to function/i)) {
    return {
      code: "codex_encryption_key_missing",
      summary: "pgcrypto was handed an empty encryption key.",
      hint: "CODEX_TOKEN_ENCRYPTION_KEY is blank in this environment. Set it to the same 32+ char value used elsewhere.",
      operation,
      projectHost: host,
      raw: message,
    };
  }

  return {
    code: "supabase_unknown",
    summary: `${operation} failed: ${message}`,
    hint: "Unrecognised failure — check the Supabase logs for this project, and the function logs for this request.",
    operation,
    projectHost: host,
    raw: message,
  };
}

/**
 * Build (and log) a {@link SupabaseFailure}. Call at every Supabase error site
 * so the server log always names the knob to turn.
 */
export function supabaseFailure(err: unknown, operation: string): SupabaseFailure {
  const detail = classifySupabaseError(err, operation);
  console.error(
    `[supabase:${detail.code}] op=${detail.operation} host=${detail.projectHost ?? "unset"} raw=${JSON.stringify(detail.raw)} fix=${detail.hint}`,
  );
  return new SupabaseFailure(detail);
}
