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
import { isAuthBypassEnabled } from "@/lib/clerk-config";
import {
  CodexAuthExpiredError,
  CodexNotConnectedError,
  decodeChatgptAccountId,
  refreshAccessToken,
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
  if (!k || k.length < 16) {
    if (isAuthBypassEnabled()) {
      // Memory-fallback path doesn't actually use this, but the helpers still
      // call masterKey() when they try Supabase first. Return a sentinel so we
      // can attempt the RPC (and gracefully fail back to memory).
      return "dev-bypass-no-encryption-key";
    }
    throw new Error(
      "CODEX_TOKEN_ENCRYPTION_KEY is missing or too short. Set a 32+ char random string in .env.local.",
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
    if (error) throw new Error(`codex_auth_read failed: ${error.message}`);
    row = (data as typeof row) ?? null;
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
      return decodeChatgptAccountId(fresh.accessToken);
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
      const { error: writeErr } = await admin.rpc("codex_auth_upsert", {
        p_clerk_user_id: clerkUserId,
        p_access_token: fresh.accessToken,
        p_refresh_token: fresh.refreshToken,
        p_access_token_expires_at: fresh.expiresAt.toISOString(),
        p_chatgpt_account_id: newAccountId,
        p_key: key,
      });
      if (writeErr) throw new Error(`codex_auth_upsert failed: ${writeErr.message}`);
    } catch (err) {
      if (!shouldFallbackToMemory(err)) throw new CodexAuthExpiredError();
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
    if (error) throw new Error(`codex_auth_upsert failed: ${error.message}`);
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
    if (error) throw new Error(`deleteCodexAuth failed: ${error.message}`);
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
    const { data } = await admin
      .from("user_codex_auth")
      .select("chatgpt_account_id, access_token_expires_at")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();
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
