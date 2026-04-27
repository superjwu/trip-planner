import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { DestinationCard } from "@/components/recs/DestinationCard";
import { ExpandedDestination } from "@/components/recs/ExpandedDestination";
import { isClerkConfigured } from "@/lib/clerk-config";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import type {
  BookingLinks,
  CostBreakdown,
  ItineraryDay,
  NormalizedTripInput,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";
import { computeRecommendations, ensureItinerary } from "./actions";

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
  hydration: { weather: WeatherForecast; cost: CostBreakdown } | null;
  booking_links: BookingLinks | null;
  itinerary: { days: ItineraryDay[] } | null;
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
    .select("id, rank, destination_slug, reasoning, match_tags, destination_snapshot, hydration, booking_links, itinerary")
    .eq("trip_id", tripId)
    .order("rank", { ascending: true });
  return (data as RecommendationRow[]) ?? [];
}

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ focus?: string }>;
}) {
  const { id } = await params;
  const { focus: focusRaw } = await searchParams;
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
  let recs = trip.compute_status === "ready" ? await fetchRecs(id) : [];

  const focusRank = focusRaw ? Number(focusRaw) : null;
  const focused =
    focusRank !== null
      ? recs.find((r) => r.rank === focusRank) ?? null
      : null;

  // Lazy itinerary: if the focused rec doesn't have one yet, generate it now.
  if (focused && !focused.itinerary) {
    await ensureItinerary({ tripId: id, recId: focused.id });
    // Re-fetch only the focused row's itinerary
    recs = await fetchRecs(id);
  }
  const refocused =
    focusRank !== null
      ? recs.find((r) => r.rank === focusRank) ?? null
      : null;

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {normalized && <CompareHeader input={normalized} destinationCount={4} />}

        {trip.compute_status === "computing" && <ComputingState />}
        {trip.compute_status === "failed" && (
          <ErrorState message={trip.compute_error ?? "Something went wrong."} />
        )}

        {trip.compute_status === "ready" && refocused && (
          <FocusedView tripId={id} rec={refocused} />
        )}

        {trip.compute_status === "ready" && recs.length > 0 && !refocused && (
          <ResultsGrid tripId={id} recs={recs} />
        )}

        {trip.compute_status === "ready" && refocused && (
          <CompactGrid tripId={id} recs={recs} activeRank={refocused.rank} />
        )}
      </main>
    </>
  );
}

function FocusedView({ tripId, rec }: { tripId: string; rec: RecommendationRow }) {
  const pick: RecommendationPick = {
    slug: rec.destination_slug,
    rank: rec.rank,
    reasoning: rec.reasoning,
    matchTags: rec.match_tags,
  };
  const cost = rec.hydration?.cost ?? {
    flightUsd: 0,
    lodgingUsd: 0,
    foodUsd: 0,
    activitiesUsd: 0,
    totalUsd: 0,
    source: "estimate" as const,
  };
  const weather = rec.hydration?.weather ?? {
    highF: 0,
    lowF: 0,
    precipMm: 0,
    summary: "—",
  };
  const bookingLinks = rec.booking_links ?? { flights: "#", lodging: "#" };
  const itineraryDays = rec.itinerary?.days;

  return (
    <div className="mb-10">
      <Link
        href={`/trips/${tripId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition hover:text-white"
      >
        ← Back to all 4
      </Link>
      <ExpandedDestination
        pick={pick}
        destination={rec.destination_snapshot}
        cost={cost}
        weather={weather}
        bookingLinks={bookingLinks}
        itinerary={itineraryDays}
      />
    </div>
  );
}

function ResultsGrid({
  tripId,
  recs,
}: {
  tripId: string;
  recs: RecommendationRow[];
}) {
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
          <Link key={r.id} href={`/trips/${tripId}?focus=${r.rank}`} className="block">
            <DestinationCard
              pick={pick}
              destination={r.destination_snapshot}
              cost={r.hydration?.cost}
              weather={r.hydration?.weather}
            />
          </Link>
        );
      })}
    </div>
  );
}

function CompactGrid({
  tripId,
  recs,
  activeRank,
}: {
  tripId: string;
  recs: RecommendationRow[];
  activeRank: number;
}) {
  return (
    <section className="mt-10">
      <p className="hero-eyebrow mb-3 text-[var(--accent)]">Other picks</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {recs
          .filter((r) => r.rank !== activeRank)
          .map((r) => (
            <Link
              key={r.id}
              href={`/trips/${tripId}?focus=${r.rank}`}
              className="glass glass-hover flex items-center gap-3 px-4 py-3"
            >
              <span className="rounded bg-black/55 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                #{r.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate font-serif text-sm font-bold text-white"
                  style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
                >
                  {r.destination_snapshot.name}
                </p>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {r.destination_snapshot.region} · ${r.hydration?.cost.totalUsd?.toLocaleString() ?? "—"}
                </p>
              </div>
              <span className="text-[var(--primary)]">→</span>
            </Link>
          ))}
      </div>
    </section>
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
