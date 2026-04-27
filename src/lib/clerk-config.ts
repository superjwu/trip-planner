// Lets the project build without real Clerk keys (placeholder = bypass).
// Once a real publishable key is set, ClerkProvider + middleware activate.
//
// SECURITY: the dev-bypass mode allows ALL traffic and uses a single shared
// "dev-user" identity backed by the Supabase service role. To prevent a
// misconfigured production deploy from quietly running in this mode, the
// bypass requires BOTH a placeholder/missing publishable key AND the explicit
// DEV_BYPASS_AUTH=1 env var. Without the env flag, requests fail closed.

const PLACEHOLDER_PREFIX = "pk_test_placeholder";

export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (key.startsWith(PLACEHOLDER_PREFIX)) return false;
  return /^pk_(test|live)_[A-Za-z0-9_=]+$/.test(key) && key.length > 30;
}

/**
 * True only when (a) Clerk isn't configured AND (b) the operator explicitly
 * opted into a no-auth dev mode by setting DEV_BYPASS_AUTH=1. In any other
 * case we MUST behave as a normal authed app and fail closed if no Clerk
 * session is present.
 */
export function isAuthBypassEnabled(): boolean {
  if (isClerkConfigured()) return false;
  return process.env.DEV_BYPASS_AUTH === "1";
}
