import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAuthContext } from "../auth";
import { isAuthBypassEnabled, isClerkConfigured } from "../clerk-config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Creates a Supabase client tied to the current Clerk session.
 * Pass-through `accessToken` callback follows the Third-Party Auth pattern.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const ctx = await getAuthContext();
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    accessToken: async () => (await ctx.getToken()) ?? "",
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role client — bypasses RLS. Use ONLY for:
 *   - reading public seed data (where RLS already permits anon read)
 *   - writing rec_cache (a public dedupe table)
 *   - background hydration jobs that don't need owner scoping
 * Never expose to client code, and never use for user-scoped reads/writes.
 */
export function createAdminSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Owner-scoped client — picks the right backend for the current auth state.
 * - Clerk configured: returns the Third-Party-Auth Supabase client (RLS on).
 * - Explicit DEV_BYPASS_AUTH=1: returns admin client (no RLS, dev only).
 * - Otherwise: throws — code that needs owner scoping should never run when
 *   the user isn't authenticated.
 *
 * Use this for any read/write of `trips` or `recommendations`.
 */
export async function createOwnerScopedSupabase(): Promise<SupabaseClient> {
  if (isClerkConfigured()) {
    return createServerSupabase();
  }
  if (isAuthBypassEnabled()) {
    return createAdminSupabase();
  }
  throw new Error(
    "Cannot perform owner-scoped Supabase access without Clerk configured or DEV_BYPASS_AUTH=1.",
  );
}
