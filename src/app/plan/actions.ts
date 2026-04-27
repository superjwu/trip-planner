"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { createOwnerScopedSupabase } from "@/lib/supabase/server";
import { normalize } from "@/lib/normalize";
import {
  REC_PROMPT_VERSION,
  SEED_VERSION,
  type RawTripInput,
} from "@/lib/types";

const FREE_TEXT_MAX = 280;

// Strip C0 control chars except \t (\x09) and \n (\x0A); strip DEL.
// Use a string-built RegExp to avoid embedding raw control bytes in source.
const CONTROL_CHAR_RE = new RegExp(
  "[\\x00-\\x08\\x0B-\\x1F\\x7F]",
  "g",
);

const FreeText = z
  .string()
  .max(FREE_TEXT_MAX)
  .transform((s) =>
    s
      .replace(CONTROL_CHAR_RE, "")
      .replace(/\r\n?/g, "\n")
      .trim(),
  );

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
    .min(1)
    .max(8),
  budget: z.enum(["under-500", "500-1000", "1000-2000", "2000-plus"]),
  pace: z.enum(["relaxed", "balanced", "packed"]).optional(),
  dislikes: FreeText.optional(),
  notes: FreeText.optional(),
});

export type CreateTripResult =
  | { ok: true; tripId: string }
  | { ok: false; error: string };

export async function createTrip(input: RawTripInput): Promise<CreateTripResult> {
  const parsed = RawTripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid trip input." };
  }

  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { ok: false, error: "Sign in to plan a trip." };
  }
  const normalized = normalize(parsed.data);

  let sb;
  try {
    sb = await createOwnerScopedSupabase();
  } catch (e) {
    return { ok: false, error: friendlyError((e as Error).message) };
  }

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
  if (/Cannot perform owner-scoped Supabase access/i.test(raw)) {
    return "Sign-in required. (Or set DEV_BYPASS_AUTH=1 to use a local dev user.)";
  }
  return raw;
}

export async function gotoTrip(tripId: string) {
  redirect(`/trips/${tripId}`);
}
