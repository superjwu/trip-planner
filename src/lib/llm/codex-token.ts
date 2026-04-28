/**
 * Per-request Codex token resolver.
 *
 * Loads the encrypted access/refresh tokens for a Clerk user, refreshes if the
 * access token is within the refresh window, and writes any new tokens back to
 * the DB. All DB access is via the service-role client because the encryption
 * uses a server-only key (CODEX_TOKEN_ENCRYPTION_KEY) and the tokens
 * themselves are encrypted with pgp_sym_encrypt.
 */
import { createAdminSupabase } from "@/lib/supabase/server";
import {
  CodexAuthExpiredError,
  CodexNotConnectedError,
  decodeChatgptAccountId,
  refreshAccessToken,
} from "./codex-auth";

const REFRESH_WINDOW_MS = 60_000; // refresh if expiring within 60s

interface ResolvedCodexAuth {
  accessToken: string;
  chatgptAccountId: string;
  refreshed: boolean;
}

function masterKey(): string {
  const k = process.env.CODEX_TOKEN_ENCRYPTION_KEY;
  if (!k || k.length < 16) {
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

  // pgp_sym_decrypt happens inside Postgres so the master key never leaves the server.
  const { data, error } = await admin.rpc("codex_auth_read", {
    p_clerk_user_id: clerkUserId,
    p_key: key,
  });
  if (error) {
    throw new Error(`codex_auth_read failed: ${error.message}`);
  }
  const row = data as {
    access_token: string;
    refresh_token: string;
    access_token_expires_at: string;
    chatgpt_account_id: string;
  } | null;
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
  const { error: writeErr } = await admin.rpc("codex_auth_upsert", {
    p_clerk_user_id: clerkUserId,
    p_access_token: fresh.accessToken,
    p_refresh_token: fresh.refreshToken,
    p_access_token_expires_at: fresh.expiresAt.toISOString(),
    p_chatgpt_account_id: newAccountId,
    p_key: key,
  });
  if (writeErr) {
    // Refresh succeeded but persist failed — surface as expired so the user reconnects
    throw new CodexAuthExpiredError();
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
  const { error } = await admin.rpc("codex_auth_upsert", {
    p_clerk_user_id: args.clerkUserId,
    p_access_token: args.accessToken,
    p_refresh_token: args.refreshToken,
    p_access_token_expires_at: args.expiresAt.toISOString(),
    p_chatgpt_account_id: args.chatgptAccountId,
    p_key: masterKey(),
  });
  if (error) {
    throw new Error(`codex_auth_upsert failed: ${error.message}`);
  }
}

export async function deleteCodexAuth(clerkUserId: string): Promise<void> {
  const admin = createAdminSupabase();
  const { error } = await admin
    .from("user_codex_auth")
    .delete()
    .eq("clerk_user_id", clerkUserId);
  if (error) {
    throw new Error(`deleteCodexAuth failed: ${error.message}`);
  }
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
  const { data } = await admin
    .from("user_codex_auth")
    .select("chatgpt_account_id, access_token_expires_at")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  if (!data) return { connected: false };
  return {
    connected: true,
    chatgptAccountId: data.chatgpt_account_id,
    expiresAt: data.access_token_expires_at,
  };
}
