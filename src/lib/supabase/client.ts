"use client";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client tied to the Clerk session.
 * Re-creates the client when the auth state changes.
 */
export function useSupabase() {
  const { getToken } = useAuth();
  return useMemo(
    () =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        accessToken: async () => (await getToken()) ?? "",
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    [getToken],
  );
}
