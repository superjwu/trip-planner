"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
import { isClerkConfigured } from "@/lib/clerk-config";
import { normalize } from "@/lib/normalize";
import {
  REC_PROMPT_VERSION,
  SEED_VERSION,
  type RawTripInput,
} from "@/lib/types";

const RawTripInputSchema = z.object({
  origin: z.enum(["NYC", "CHI", "LAX", "SFO", "SEA"]),
  departOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vibes: z
    .array(
      z.enum([
        "city",
        "nature",
        "foodie",
        "chill",
        "adventure",
        "scenic",
        "cultural",
        "nightlife",
      ]),
    )
    .min(1),
  budget: z.enum(["under-500", "500-1000", "1000-2000", "2000-plus"]),
  pace: z.enum(["relaxed", "balanced", "packed"]).optional(),
  dislikes: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateTripResult =
  | { ok: true; tripId: string }
  | { ok: false; error: string };

export async function createTrip(input: RawTripInput): Promise<CreateTripResult> {
  const parsed = RawTripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid trip input." };
  }

  const userId = await requireUserId();
  const normalized = normalize(parsed.data);

  // When Clerk isn't configured (placeholder env), use the admin client because
  // RLS would reject inserts from an unauthenticated session. This keeps the
  // dev experience working before real keys exist.
  const sb = isClerkConfigured() ? await createServerSupabase() : createAdminSupabase();

  try {
    const { data, error } = await sb
      .from("trips")
      .insert({
        clerk_user_id: userId,
        origin_city: normalized.originCode,
        depart_on: normalized.departOn,
        return_on: normalized.returnOn,
        raw_input: parsed.data,
        normalized_input: normalized,
        compute_status: "pending",
        seed_version: SEED_VERSION,
        prompt_version: REC_PROMPT_VERSION,
        user_status: "draft",
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        ok: false,
        error: friendlyError(error?.message ?? "Could not save trip."),
      };
    }

    return { ok: true, tripId: data.id };
  } catch (e) {
    return {
      ok: false,
      error: friendlyError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

function friendlyError(raw: string): string {
  if (/fetch failed|ENOTFOUND|getaddrinfo/i.test(raw)) {
    return "Supabase isn't reachable — set NEXT_PUBLIC_SUPABASE_URL and the keys in .env.local.";
  }
  return raw;
}

export async function gotoTrip(tripId: string) {
  redirect(`/trips/${tripId}`);
}
