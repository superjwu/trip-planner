/**
 * Per-request Codex token resolver.
 *
 * Loads the encrypted access/refresh tokens for a Clerk user, refreshes if the
 * access token is within the refresh window, and writes any new tokens back to
 * the DB. All DB access is via the service-role client because the encryption
 * uses a server-only key (CODEX_TOKEN_ENCRYPTION_KEY) and the tokens
 * themselves are encrypted with pgp_sym_encrypt.
 *
 * DEV-ONLY FALLBACK: when Supabase is unreachable AND DEV_BYPASS_AUTH=1, every
 * function below falls back to a module-level in-memory Map. Lets the demo
 * flow run end-to-end on a laptop without provisioning Supabase first. Cleared
 * on every server restart. Never engaged in production.
 */
import { createAdminSupabase } from "@/lib/supabase/server";
import { SupabaseFailure, supabaseFailure } from "@/lib/supabase/errors";
import { isAuthBypassEnabled } from "@/lib/clerk-config";
import {
  CodexAuthExpiredError,
  CodexNotConnectedError,
  refreshAccessToken,
  resolveChatgptAccountId,
} from "./codex-auth";

const REFRESH_WINDOW_MS = 60_000; // refresh if expiring within 60s

// ─────────────────────────────────────────────────────────────
// Dev-only in-memory store. Plaintext tokens here, on purpose:
// this branch only engages when DEV_BYPASS_AUTH=1 *and* the DB
// fetch already failed. Production never touches it.
// ─────────────────────────────────────────────────────────────
interface MemoryTokenRecord {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO
  chatgptAccountId: string;
}
const DEV_MEMORY: Map<string, MemoryTokenRecord> = (() => {
  const g = globalThis as unknown as { __codexDevMemory?: Map<string, MemoryTokenRecord> };
  if (!g.__codexDevMemory) g.__codexDevMemory = new Map();
  return g.__codexDevMemory;
})();

function isFetchFailure(err: unknown): boolean {
  // Prefer the classified code — the raw message is now wrapped by
  // supabaseFailure(), so substring-matching it would silently stop matching.
  if (err instanceof SupabaseFailure) return err.code === "supabase_unreachable";
  const msg = err instanceof Error ? err.message : String(err);
  return /fetch failed|ENOTFOUND|getaddrinfo|ECONNREFUSED|EAI_AGAIN/i.test(msg);
}

function shouldFallbackToMemory(err: unknown): boolean {
  if (!isAuthBypassEnabled()) return false;
  return isFetchFailure(err);
}

function logDevFallback(op: string, err: unknown) {
  if (process.env.NODE_ENV === "production") return;
  console.warn(
    `[codex-token] ${op} via in-memory dev fallback (Supabase unreachable, DEV_BYPASS_AUTH=1):`,
    (err as Error).message,
  );
}

interface ResolvedCodexAuth {
  accessToken: string;
  chatgptAccountId: string;
  refreshed: boolean;
}

function masterKey(): string {
  const k = process.env.CODEX_TOKEN_ENCRYPTION_KEY;
  if (!k || k.length < 32) {
    if (isAuthBypassEnabled()) {
      // Memory-fallback path doesn't actually use this, but the helpers still
      // call masterKey() when they try Supabase first. Return a sentinel so we
      // can attempt the RPC (and gracefully fail back to memory).
      return "dev-bypass-no-encryption-key";
    }
    throw new Error(
      "CODEX_TOKEN_ENCRYPTION_KEY missing or too short (need ≥32 chars). Generate with `openssl rand -hex 32`.",
    );
  }
  return k;
}

/**
 * Reads the encrypted row for `clerkUserId`, decrypts in Postgres
 * (pgp_sym_decrypt), refreshes if needed, returns the live access token plus
 * the chatgpt_account_id required as a header on Codex backend requests.
 */
export async function resolveCodexAuth(clerkUserId: string): Promise<ResolvedCodexAuth> {
  const admin = createAdminSupabase();
  const key = masterKey();

  let row:
    | {
        access_token: string;
        refresh_token: string;
        access_token_expires_at: string;
        chatgpt_account_id: string;
      }
    | null = null;
  let useMemory = false;
  try {
    const { data, error } = await admin.rpc("codex_auth_read", {
      p_clerk_user_id: clerkUserId,
      p_key: key,
    });
    if (error) throw supabaseFailure(error, "codex_auth_read");
    // PostgREST wraps TABLE-returning RPC results as an array; our function
    // returns 0 or 1 rows so we just take the first.
    const rows = (data as Array<typeof row & object> | null) ?? [];
    row = rows.length > 0 ? rows[0] : null;
  } catch (err) {
    if (!shouldFallbackToMemory(err)) throw err;
    logDevFallback("resolveCodexAuth", err);
    useMemory = true;
    const mem = DEV_MEMORY.get(clerkUserId);
    if (mem) {
      row = {
        access_token: mem.accessToken,
        refresh_token: mem.refreshToken,
        access_token_expires_at: mem.expiresAt,
        chatgpt_account_id: mem.chatgptAccountId,
      };
    }
  }
  if (!row) throw new CodexNotConnectedError();

  const expiresAt = Date.parse(row.access_token_expires_at);
  if (expiresAt > Date.now() + REFRESH_WINDOW_MS) {
    return {
      accessToken: row.access_token,
      chatgptAccountId: row.chatgpt_account_id,
      refreshed: false,
    };
  }

  // Refresh
  const fresh = await refreshAccessToken(row.refresh_token);
  const newAccountId = (() => {
    try {
      // Prefer the refreshed id_token, matching upstream codex; keep the
      // previously stored id if this response carried neither claim.
      return resolveChatgptAccountId({
        idToken: fresh.idToken,
        accessToken: fresh.accessToken,
      });
    } catch {
      return row.chatgpt_account_id;
    }
  })();

  if (useMemory) {
    DEV_MEMORY.set(clerkUserId, {
      accessToken: fresh.accessToken,
      refreshToken: fresh.refreshToken,
      expiresAt: fresh.expiresAt.toISOString(),
      chatgptAccountId: newAccountId,
    });
  } else {
    try {
      // Compare-and-swap: only persist if the row's expiry still matches
      // what we observed before refreshing. If a parallel request already
      // refreshed (rows_updated == 0), fall through and re-read so this
      // request uses the fresher token.
      const { data: rowsUpdated, error: writeErr } = await admin.rpc(
        "codex_auth_upsert_cas",
        {
          p_clerk_user_id: clerkUserId,
          p_access_token: fresh.accessToken,
          p_refresh_token: fresh.refreshToken,
          p_access_token_expires_at: fresh.expiresAt.toISOString(),
          p_chatgpt_account_id: newAccountId,
          p_key: key,
          p_expected_old_expires: row.access_token_expires_at,
        },
      );
      if (writeErr) throw supabaseFailure(writeErr, "codex_auth_upsert_cas");
      if (rowsUpdated === 0) {
        // Someone else refreshed first. Re-read and return their token.
        const reread = await admin.rpc("codex_auth_read", {
          p_clerk_user_id: clerkUserId,
          p_key: key,
        });
        const rerows = (reread.data as Array<typeof row & object> | null) ?? [];
        if (rerows.length > 0) {
          return {
            accessToken: rerows[0].access_token,
            chatgptAccountId: rerows[0].chatgpt_account_id,
            refreshed: true,
          };
        }
        throw new CodexAuthExpiredError();
      }
    } catch (err) {
      if (!shouldFallbackToMemory(err)) {
        // The refresh already succeeded, so OpenAI has invalidated the old
        // refresh token — but we failed to store the new one. The stored row
        // is now unusable and only a reconnect fixes it. Log the real cause;
        // "expired" alone sends operators hunting in the wrong place.
        console.error("[codex-token] refresh succeeded but persist failed:", err);
        throw new CodexAuthExpiredError("unknown");
      }
      logDevFallback("resolveCodexAuth refresh-write", err);
      DEV_MEMORY.set(clerkUserId, {
        accessToken: fresh.accessToken,
        refreshToken: fresh.refreshToken,
        expiresAt: fresh.expiresAt.toISOString(),
        chatgptAccountId: newAccountId,
      });
    }
  }
  return {
    accessToken: fresh.accessToken,
    chatgptAccountId: newAccountId,
    refreshed: true,
  };
}

/**
 * One-time persist after the OAuth device-code dance completes. Writes the
 * encrypted tokens via the same SQL function used by resolveCodexAuth.
 */
export async function persistCodexAuth(args: {
  clerkUserId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  chatgptAccountId: string;
}): Promise<void> {
  const admin = createAdminSupabase();
  try {
    const { error } = await admin.rpc("codex_auth_upsert", {
      p_clerk_user_id: args.clerkUserId,
      p_access_token: args.accessToken,
      p_refresh_token: args.refreshToken,
      p_access_token_expires_at: args.expiresAt.toISOString(),
      p_chatgpt_account_id: args.chatgptAccountId,
      p_key: masterKey(),
    });
    if (error) throw supabaseFailure(error, "codex_auth_upsert");
  } catch (err) {
    if (!shouldFallbackToMemory(err)) throw err;
    logDevFallback("persistCodexAuth", err);
    DEV_MEMORY.set(args.clerkUserId, {
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: args.expiresAt.toISOString(),
      chatgptAccountId: args.chatgptAccountId,
    });
  }
}

export async function deleteCodexAuth(clerkUserId: string): Promise<void> {
  const admin = createAdminSupabase();
  try {
    const { error } = await admin
      .from("user_codex_auth")
      .delete()
      .eq("clerk_user_id", clerkUserId);
    if (error) throw supabaseFailure(error, "deleteCodexAuth");
  } catch (err) {
    if (!shouldFallbackToMemory(err)) throw err;
    logDevFallback("deleteCodexAuth", err);
  }
  // In dev-bypass mode we always also clear the in-memory record so the
  // disconnect button works regardless of which path persisted it.
  DEV_MEMORY.delete(clerkUserId);
}

/**
 * Lightweight existence check — used by /plan to decide whether to render the
 * gate or the wizard. Doesn't decrypt anything.
 */
export async function hasCodexAuth(clerkUserId: string): Promise<{
  connected: boolean;
  chatgptAccountId?: string;
  expiresAt?: string;
}> {
  const admin = createAdminSupabase();
  try {
    const { data, error } = await admin
      .from("user_codex_auth")
      .select("chatgpt_account_id, access_token_expires_at")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();
    // Previously this destructured `data` only. A dead/misconfigured Supabase
    // then rendered as a clean "not connected", so /plan showed the Connect
    // gate forever with no clue why — which is exactly how a deleted project
    // and a placeholder service-role key stayed invisible. Throw instead, and
    // let the dev-fallback logic below decide whether it's recoverable.
    if (error) throw supabaseFailure(error, "hasCodexAuth.select");
    if (!data) {
      // Even on success we may have only the memory record (mixed mode)
      const mem = DEV_MEMORY.get(clerkUserId);
      if (mem) {
        return {
          connected: true,
          chatgptAccountId: mem.chatgptAccountId,
          expiresAt: mem.expiresAt,
        };
      }
      return { connected: false };
    }
    return {
      connected: true,
      chatgptAccountId: data.chatgpt_account_id,
      expiresAt: data.access_token_expires_at,
    };
  } catch (err) {
    if (!shouldFallbackToMemory(err)) throw err;
    logDevFallback("hasCodexAuth", err);
    const mem = DEV_MEMORY.get(clerkUserId);
    if (!mem) return { connected: false };
    return {
      connected: true,
      chatgptAccountId: mem.chatgptAccountId,
      expiresAt: mem.expiresAt,
    };
  }
}
