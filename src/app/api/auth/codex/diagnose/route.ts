import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createAdminSupabase, createOwnerScopedSupabase } from "@/lib/supabase/server";
import { classifySupabaseError } from "@/lib/supabase/errors";
import { isClerkConfigured, isAuthBypassEnabled } from "@/lib/clerk-config";
import { isCodexOAuthEnabled } from "@/lib/llm/codex-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/codex/diagnose  (Clerk auth required)
 *
 * Answers "why is the ChatGPT integration broken in THIS environment?" in one
 * request, instead of one deploy per hypothesis. Every check names the single
 * dashboard action that fixes it.
 *
 * Deliberately safe to call in production: it reports presence and LENGTH of
 * secrets, never their values. The only identifiers returned are the Supabase
 * project host (already public via NEXT_PUBLIC_SUPABASE_URL) and the caller's
 * own Clerk user id.
 */

interface Check {
  name: string;
  ok: boolean;
  code?: string;
  detail?: string;
  hint?: string;
}

function envCheck(name: string, minLength = 1): Check {
  const v = process.env[name];
  if (!v) {
    return { name: `env.${name}`, ok: false, code: "missing", hint: `Set ${name} in this environment, then redeploy.` };
  }
  if (v.length < minLength) {
    return {
      name: `env.${name}`,
      ok: false,
      code: "too_short",
      detail: `length ${v.length}, need ≥${minLength}`,
      hint: `${name} looks truncated — re-copy the full value.`,
    };
  }
  if (/^PLACEHOLDER/i.test(v)) {
    return {
      name: `env.${name}`,
      ok: false,
      code: "placeholder",
      hint: `${name} is still the placeholder string. Replace it with the real value.`,
    };
  }
  return { name: `env.${name}`, ok: true, detail: `present, length ${v.length}` };
}

export async function GET() {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: "Sign in first.", code: "not_authed" }, { status: 401 });
  }

  const checks: Check[] = [];

  // ── 1. Configuration ────────────────────────────────────────
  checks.push({
    name: "config.CODEX_OAUTH_ENABLED",
    ok: isCodexOAuthEnabled(),
    detail: `value=${process.env.CODEX_OAUTH_ENABLED ?? "unset"}`,
    hint: isCodexOAuthEnabled() ? undefined : "Kill switch is off. Set CODEX_OAUTH_ENABLED=1 to enable the integration.",
  });
  checks.push({
    name: "config.clerk",
    ok: isClerkConfigured(),
    detail: `clerkConfigured=${isClerkConfigured()} authBypass=${isAuthBypassEnabled()}`,
    hint: isClerkConfigured() ? undefined : "Clerk publishable key missing or placeholder.",
  });
  checks.push(envCheck("NEXT_PUBLIC_SUPABASE_URL", 20));
  checks.push(envCheck("NEXT_PUBLIC_SUPABASE_ANON_KEY", 20));
  checks.push(envCheck("SUPABASE_SERVICE_ROLE_KEY", 20));
  checks.push(envCheck("CODEX_TOKEN_ENCRYPTION_KEY", 32));
  checks.push(envCheck("OAUTH_COOKIE_SIGNING_KEY", 32));

  const projectHost = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
    } catch {
      return null;
    }
  })();

  // ── 2. Service-role reachability (the Codex token path) ─────
  const admin = createAdminSupabase();
  try {
    const { error } = await admin.from("user_codex_auth").select("clerk_user_id", { head: true, count: "exact" });
    if (error) throw error;
    checks.push({ name: "supabase.serviceRole", ok: true, detail: `reached ${projectHost}` });
  } catch (err) {
    const d = classifySupabaseError(err, "diagnose.serviceRole");
    checks.push({ name: "supabase.serviceRole", ok: false, code: d.code, detail: d.summary, hint: d.hint });
  }

  // ── 3. Are the migrations applied? (RPC + decryption) ───────
  const encryptionKey = process.env.CODEX_TOKEN_ENCRYPTION_KEY ?? "";
  if (encryptionKey.length >= 32) {
    try {
      const { error } = await admin.rpc("codex_auth_read", { p_clerk_user_id: userId, p_key: encryptionKey });
      if (error) throw error;
      checks.push({ name: "supabase.codexRpc", ok: true, detail: "codex_auth_read callable and row (if any) decrypts" });
    } catch (err) {
      const d = classifySupabaseError(err, "diagnose.codex_auth_read");
      checks.push({ name: "supabase.codexRpc", ok: false, code: d.code, detail: d.summary, hint: d.hint });
    }
  } else {
    checks.push({
      name: "supabase.codexRpc",
      ok: false,
      code: "codex_encryption_key_missing",
      hint: "Cannot test decryption without CODEX_TOKEN_ENCRYPTION_KEY.",
    });
  }

  // ── 4. Clerk -> Supabase Third-Party Auth (owner-scoped reads) ──
  try {
    const owner = await createOwnerScopedSupabase();
    const { error } = await owner.from("trips").select("id", { head: true, count: "exact" });
    if (error) throw error;
    checks.push({ name: "supabase.thirdPartyAuth", ok: true, detail: "Supabase accepts the Clerk session token" });
  } catch (err) {
    const d = classifySupabaseError(err, "diagnose.ownerScoped");
    checks.push({ name: "supabase.thirdPartyAuth", ok: false, code: d.code, detail: d.summary, hint: d.hint });
  }

  // ── 5. This user's connection state ─────────────────────────
  try {
    const { data, error } = await admin
      .from("user_codex_auth")
      .select("chatgpt_account_id, access_token_expires_at, updated_at")
      .eq("clerk_user_id", userId)
      .maybeSingle();
    if (error) throw error;
    checks.push({
      name: "codex.connection",
      ok: Boolean(data),
      detail: data
        ? `connected, token expires ${data.access_token_expires_at}`
        : "no stored connection for this user",
      hint: data ? undefined : "Run the Connect ChatGPT flow on /plan.",
    });
  } catch (err) {
    const d = classifySupabaseError(err, "diagnose.connection");
    checks.push({ name: "codex.connection", ok: false, code: d.code, detail: d.summary, hint: d.hint });
  }

  const failed = checks.filter((c) => !c.ok);
  return NextResponse.json(
    {
      ok: failed.length === 0,
      clerkUserId: userId,
      projectHost,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      summary: failed.length === 0 ? "All checks passed." : `${failed.length} check(s) failed: ${failed.map((f) => f.name).join(", ")}`,
      firstActionableFix: failed.find((f) => f.hint)?.hint ?? null,
      checks,
    },
    { status: 200 },
  );
}
