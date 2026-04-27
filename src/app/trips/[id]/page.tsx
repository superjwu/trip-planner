import { notFound } from "next/navigation";
import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { DestinationCard } from "@/components/recs/DestinationCard";
import { isClerkConfigured } from "@/lib/clerk-config";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import type {
  NormalizedTripInput,
  RecommendationPick,
  SeedDestination,
} from "@/lib/types";
import { computeRecommendations } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your trip — Trip Planner",
};

interface TripRow {
  id: string;
  clerk_user_id: string;
  origin_city: string | null;
  depart_on: string | null;
  return_on: string | null;
  normalized_input: NormalizedTripInput | null;
  compute_status: "pending" | "computing" | "ready" | "failed";
  compute_error: string | null;
  user_status: string;
}

interface RecommendationRow {
  id: string;
  rank: number;
  destination_slug: string;
  reasoning: string;
  match_tags: string[];
  destination_snapshot: SeedDestination;
  hydration: unknown;
  booking_links: unknown;
}

async function fetchTrip(id: string) {
  const sb = isClerkConfigured()
    ? await createServerSupabase()
    : createAdminSupabase();
  const { data, error } = await sb
    .from("trips")
    .select(
      "id, clerk_user_id, origin_city, depart_on, return_on, normalized_input, compute_status, compute_error, user_status",
    )
    .eq("id", id)
    .maybeSingle<TripRow>();
  return { trip: data, error };
}

async function fetchRecs(tripId: string) {
  const sb = isClerkConfigured()
    ? await createServerSupabase()
    : createAdminSupabase();
  const { data } = await sb
    .from("recommendations")
    .select("id, rank, destination_slug, reasoning, match_tags, destination_snapshot, hydration, booking_links")
    .eq("trip_id", tripId)
    .order("rank", { ascending: true });
  return (data as RecommendationRow[]) ?? [];
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let { trip, error } = await fetchTrip(id);
  if (error || !trip) notFound();

  // Synchronous compute on first visit when status='pending'. Loading.tsx
  // shows the skeleton during this await.
  if (trip.compute_status === "pending") {
    await computeRecommendations(id);
    ({ trip } = await fetchTrip(id));
    if (!trip) notFound();
  }

  const normalized = trip.normalized_input;
  const recs = trip.compute_status === "ready" ? await fetchRecs(id) : [];

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {normalized && <CompareHeader input={normalized} destinationCount={4} />}

        {trip.compute_status === "computing" && <ComputingState />}
        {trip.compute_status === "failed" && (
          <ErrorState message={trip.compute_error ?? "Something went wrong."} />
        )}

        {trip.compute_status === "ready" && recs.length > 0 && (
          <ResultsGrid recs={recs} />
        )}
      </main>
    </>
  );
}

function ResultsGrid({ recs }: { recs: RecommendationRow[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {recs.map((r) => {
        const pick: RecommendationPick = {
          slug: r.destination_slug,
          rank: r.rank,
          reasoning: r.reasoning,
          matchTags: r.match_tags,
        };
        return (
          <DestinationCard
            key={r.id}
            pick={pick}
            destination={r.destination_snapshot}
          />
        );
      })}
    </div>
  );
}

function ComputingState() {
  return (
    <section className="mt-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <article
            key={i}
            className="glass-strong relative overflow-hidden"
            style={{ minHeight: 420 }}
          >
            <div className="h-56 w-full animate-pulse bg-white/5" />
            <div className="space-y-3 px-5 py-4">
              <div className="h-5 w-3/5 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-white/10" />
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </article>
        ))}
      </div>
      <p
        className="mt-8 text-center text-sm italic text-[var(--text-muted)]"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Picking 4 destinations for you…
      </p>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass-strong mt-6 px-7 py-6 text-center">
      <p className="text-base font-semibold text-red-300">
        Couldn't generate recommendations
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
