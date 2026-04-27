import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAuthContext } from "../auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Creates a Supabase client tied to the current Clerk session.
 * Pass-through `accessToken` callback follows the Third-Party Auth pattern:
 * Supabase calls it on every request and forwards the JWT.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const ctx = await getAuthContext();
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    accessToken: async () => (await ctx.getToken()) ?? "",
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Service-role client — bypasses RLS. Use ONLY for:
 * - reading public seed data
 * - writing rec_cache
 * - background hydration jobs
 * Never expose to client code.
 */
export function createAdminSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
