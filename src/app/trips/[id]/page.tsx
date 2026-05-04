import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getLocale } from "next-intl/server";
import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { DestinationCard } from "@/components/recs/DestinationCard";
import { ExpandedDestination } from "@/components/recs/ExpandedDestination";
import { TradeoffMatrix } from "@/components/recs/TradeoffMatrix";
import { RefinePanel } from "@/components/recs/RefinePanel";
import { RoundSwitcher, type RoundSummary } from "@/components/recs/RoundSwitcher";
import { GeneratingProgress } from "@/components/recs/GeneratingProgress";
import { RouteAtlas } from "@/components/recs/RouteAtlas";
import { SaveTripButton } from "@/components/trip/SaveTripButton";
import { createOwnerScopedSupabase } from "@/lib/supabase/server";
import {
  BookingLinksSchema,
  HydrationSchema,
  NormalizedTripInputSchema,
  SeedDestinationSchema,
  TradeoffsSchema,
  UserStatusSchema,
  buildItineraryResponseSchema,
} from "@/lib/schemas";
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
import { localizeDestination } from "@/lib/i18n/localizeDestination";

export const dynamic = "force-dynamic";
// First-visit compute is synchronous within the server-render: preFilter →
// rank (~6-9s with reasoning=low) → hydrate (~1-3s). Vercel Hobby defaults
// to 10s which is too tight; bump to 60s. Same goes for the createRefineRound
// server action invoked from RefinePanel — it inherits this page's timeout.
export const maxDuration = 60;

export const metadata = {
  title: "Your trip — Trip Planner",
};

interface TripRowRaw {
  id: string;
  clerk_user_id: string;
  origin_city: string | null;
  depart_on: string | null;
  return_on: string | null;
  normalized_input: unknown;
  compute_status: "pending" | "computing" | "ready" | "failed";
  compute_error: string | null;
  user_status: string;
  active_round_id: string | null;
}

interface RecRowRaw {
  id: string;
  rank: number;
  destination_slug: string;
  reasoning: string;
  match_tags: string[];
  tradeoffs: unknown;
  destination_snapshot: unknown;
  hydration: unknown;
  booking_links: unknown;
  itinerary: unknown;
}

// Parsed shape used by the rendering helpers below.
interface ParsedRec {
  id: string;
  rank: number;
  destination_slug: string;
  reasoning: string;
  match_tags: string[];
  tradeoffs: import("@/lib/types").Tradeoffs | null;
  destination: SeedDestination;
  hydration: { weather: WeatherForecast; cost: CostBreakdown } | null;
  booking_links: BookingLinks | null;
  itinerary: { days: ItineraryDay[] } | null;
}

const RecRowSchema = z.object({
  id: z.string(),
  rank: z.number(),
  destination_slug: z.string(),
  reasoning: z.string(),
  match_tags: z.array(z.string()),
});

function parseRec(raw: RecRowRaw, expectedDays: number | null): ParsedRec | null {
  const head = RecRowSchema.safeParse(raw);
  const dest = SeedDestinationSchema.safeParse(raw.destination_snapshot);
  if (!head.success || !dest.success) return null;

  const hydration = HydrationSchema.safeParse(raw.hydration);
  const booking = BookingLinksSchema.safeParse(raw.booking_links);
  let itinerary: { days: ItineraryDay[] } | null = null;
  if (raw.itinerary && expectedDays && expectedDays > 0) {
    const Itin = buildItineraryResponseSchema(expectedDays);
    const itinParsed = Itin.safeParse(raw.itinerary);
    if (itinParsed.success) itinerary = itinParsed.data;
  }

  const tradeoffs = TradeoffsSchema.safeParse(raw.tradeoffs);
  return {
    id: head.data.id,
    rank: head.data.rank,
    destination_slug: head.data.destination_slug,
    reasoning: head.data.reasoning,
    match_tags: head.data.match_tags,
    tradeoffs: tradeoffs.success
      ? (tradeoffs.data as import("@/lib/types").Tradeoffs)
      : null,
    destination: dest.data,
    hydration: hydration.success ? hydration.data : null,
    booking_links: booking.success ? booking.data : null,
    itinerary,
  };
}

async function fetchTrip(id: string) {
  const sb = await createOwnerScopedSupabase();
  const { data, error } = await sb
    .from("trips")
    .select(
      "id, clerk_user_id, origin_city, depart_on, return_on, normalized_input, compute_status, compute_error, user_status, active_round_id",
    )
    .eq("id", id)
    .maybeSingle<TripRowRaw>();
  return { trip: data, error };
}

async function fetchRecs(roundId: string | null, expectedDays: number | null) {
  if (!roundId) return [] as ParsedRec[];
  const sb = await createOwnerScopedSupabase();
  const { data } = await sb
    .from("recommendations")
    .select("id, rank, destination_slug, reasoning, match_tags, tradeoffs, destination_snapshot, hydration, booking_links, itinerary")
    .eq("round_id", roundId)
    .order("rank", { ascending: true });
  const rows = (data as RecRowRaw[]) ?? [];
  return rows
    .map((r) => parseRec(r, expectedDays))
    .filter((r): r is ParsedRec => r !== null);
}

interface RoundRowRaw {
  id: string;
  round_number: number;
  feedback_presets: string[];
  feedback_text: string | null;
  why_these_four: string | null;
  compute_status: "pending" | "computing" | "ready" | "failed";
}

async function fetchRounds(tripId: string): Promise<RoundRowRaw[]> {
  const sb = await createOwnerScopedSupabase();
  const { data } = await sb
    .from("recommendation_rounds")
    .select("id, round_number, feedback_presets, feedback_text, why_these_four, compute_status")
    .eq("trip_id", tripId)
    .order("round_number", { ascending: true });
  return (data as RoundRowRaw[] | null) ?? [];
}

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ focus?: string; round?: string }>;
}) {
  const { id } = await params;
  const { focus: focusRaw, round: roundRaw } = await searchParams;
  const locale = await getLocale();
  const initial = await fetchTrip(id);
  if (initial.error || !initial.trip) notFound();
  let trip: TripRowRaw = initial.trip;

  const normalizedParse = NormalizedTripInputSchema.safeParse(trip.normalized_input);
  const normalized: NormalizedTripInput | null = normalizedParse.success
    ? normalizedParse.data
    : null;

  // First-visit compute (loading.tsx covers the wait).
  if (trip.compute_status === "pending") {
    await computeRecommendations(id);
    const reFetch = await fetchTrip(id);
    if (!reFetch.trip) notFound();
    trip = reFetch.trip;
  }

  // Pull the rounds list. If `?round=N` is provided we render that round's
  // recs (read-only mode for past rounds); otherwise the active one.
  const rounds = await fetchRounds(id);
  const requestedRoundN = roundRaw ? Number(roundRaw) : null;
  const requestedRound: RoundRowRaw | undefined =
    requestedRoundN && Number.isFinite(requestedRoundN)
      ? rounds.find((r) => r.round_number === requestedRoundN)
      : undefined;
  const renderRound: RoundRowRaw | null =
    requestedRound ?? rounds.find((r) => r.id === trip.active_round_id) ?? null;
  const isActiveRound = renderRound?.id === trip.active_round_id;

  let recs =
    trip.compute_status === "ready"
      ? await fetchRecs(renderRound?.id ?? null, normalized?.tripLengthDays ?? null)
      : [];

  const focusRank = focusRaw ? Number(focusRaw) : null;
  const focused =
    focusRank !== null
      ? recs.find((r) => r.rank === focusRank) ?? null
      : null;

  // Lazy itinerary on focus.
  if (focused && !focused.itinerary) {
    await ensureItinerary({ tripId: id, recId: focused.id });
    recs = await fetchRecs(renderRound?.id ?? null, normalized?.tripLengthDays ?? null);
  }
  const refocused =
    focusRank !== null
      ? recs.find((r) => r.rank === focusRank) ?? null
      : null;

  const roundSummaries: RoundSummary[] = rounds.map((r) => ({
    id: r.id,
    roundNumber: r.round_number,
    feedbackPresets: r.feedback_presets,
    feedbackText: r.feedback_text,
    isActive: r.id === trip.active_round_id,
  }));

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10" style={{ backgroundColor: "var(--paper)" }}>
        {normalized && (
          <div className="mb-6">
            {/* Trip header kicker */}
            <p
              className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slate-primary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Your trip
            </p>
            <CompareHeader input={normalized} />
            {trip.compute_status === "ready" && (
              <div className="mt-4 flex justify-end">
                <SaveTripButton
                  tripId={id}
                  initialStatus={
                    UserStatusSchema.safeParse(trip.user_status).data ?? "draft"
                  }
                />
              </div>
            )}
            {!isActiveRound && renderRound && (
              <div className="mt-4 rounded-2xl border border-[var(--hairline)] bg-[var(--paper-deep)] px-4 py-2 text-xs text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
                Viewing Round {renderRound.round_number} (read-only).{" "}
                <Link
                  href={`/trips/${id}`}
                  className="font-medium text-[var(--slate-primary)] underline"
                >
                  Back to current round →
                </Link>
              </div>
            )}
          </div>
        )}

        {!normalized && (
          <ErrorState message="This trip's preferences couldn't be parsed. Try creating a new trip." />
        )}

        {trip.compute_status === "computing" && <ComputingState />}
        {trip.compute_status === "failed" && (
          <ErrorState message={trip.compute_error ?? "Something went wrong."} />
        )}

        {trip.compute_status === "ready" && refocused && (
          <FocusedView tripId={id} rec={refocused} locale={locale} />
        )}

        {trip.compute_status === "ready" && recs.length > 0 && !refocused && (
          <>
            <div className="mt-32">
              <RoundSwitcher
                tripId={id}
                rounds={roundSummaries}
                activeRoundId={trip.active_round_id}
              />
            </div>
            <div className="mt-32">
              <TradeoffMatrix
                whyTheseFour={renderRound?.why_these_four}
                rows={recs.map((r) => ({
                  rank: r.rank,
                  name: r.destination.name,
                  state: r.destination.state,
                  tradeoffs: r.tradeoffs,
                }))}
              />
            </div>
            <div className="mt-32">
              <section>
                <p
                  className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slate-primary)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  The routes
                </p>
                <h2
                  className="mb-2 text-2xl tracking-tight md:text-3xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ink)" }}
                >
                  {recs.length} routes drawn from {normalized!.originCode}.
                </h2>
                <p
                  className="mb-8 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Each destination plotted at its real coordinates — rendered from US Census state
                  geometry, not a sketch.
                </p>
                <div
                  className="rounded-3xl border border-[var(--hairline)] bg-white p-6 md:p-10"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <RouteAtlas
                    originCode={normalized!.originCode}
                    originLabel={trip.origin_city ?? normalized!.originCode}
                    picks={recs.map((r) => ({
                      slug: r.destination_slug,
                      name: r.destination.name,
                      state: r.destination.state,
                      lat: r.destination.lat,
                      lng: r.destination.lng,
                      rank: r.rank,
                    }))}
                  />
                </div>
              </section>
            </div>
            <div className="mt-32">
              <ResultsGrid tripId={id} recs={recs} locale={locale} />
            </div>
            {isActiveRound && (
              <div className="mt-32">
                <RefinePanel
                  tripId={id}
                  picks={recs.map((r) => ({
                    rank: r.rank,
                    slug: r.destination_slug,
                    name: r.destination.name,
                  }))}
                />
              </div>
            )}
          </>
        )}

        {trip.compute_status === "ready" && refocused && recs.length > 1 && (
          <CompactGrid tripId={id} recs={recs} activeRank={refocused.rank} locale={locale} />
        )}
      </main>
    </>
  );
}

function FocusedView({ tripId, rec, locale = "en" }: { tripId: string; rec: ParsedRec; locale?: string }) {
  const pick: RecommendationPick = {
    slug: rec.destination_slug,
    rank: rec.rank,
    reasoning: rec.reasoning,
    matchTags: rec.match_tags,
  };
  const cost = rec.hydration?.cost;
  const weather = rec.hydration?.weather;
  const bookingLinks = rec.booking_links;

  return (
    <div className="mb-10">
      <Link
        href={`/trips/${tripId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--slate-primary)] transition hover:opacity-70"
        style={{ fontFamily: "var(--font-body)" }}
      >
        ← Back to all 4
      </Link>
      <ExpandedDestination
        pick={pick}
        destination={rec.destination}
        cost={cost}
        weather={weather}
        bookingLinks={bookingLinks}
        itinerary={rec.itinerary?.days}
        itineraryMissing={!rec.itinerary}
        locale={locale}
      />
    </div>
  );
}

function ResultsGrid({
  tripId,
  recs,
  locale = "en",
}: {
  tripId: string;
  recs: ParsedRec[];
  locale?: string;
}) {
  return (
    <>
      <p
        className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slate-primary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        The destinations
      </p>
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
                destination={r.destination}
                cost={r.hydration?.cost}
                weather={r.hydration?.weather}
                locale={locale}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}

function CompactGrid({
  tripId,
  recs,
  activeRank,
  locale = "en",
}: {
  tripId: string;
  recs: ParsedRec[];
  activeRank: number;
  locale?: string;
}) {
  return (
    <section className="mt-10">
      <p
        className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slate-primary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Other picks
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {recs
          .filter((r) => r.rank !== activeRank)
          .map((r) => (
            <Link
              key={r.id}
              href={`/trips/${tripId}?focus=${r.rank}`}
              className="group flex items-center gap-3 rounded-3xl border border-[var(--hairline)] bg-white px-4 py-3 shadow-[0_4px_12px_-4px_rgba(31,41,55,0.08)] transition hover:border-[var(--slate-primary)] hover:shadow-[0_8px_20px_-8px_rgba(44,84,116,0.15)]"
            >
              <span
                className="rounded-full bg-[var(--slate-tint)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--slate-primary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                #{r.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {localizeDestination(r.destination, locale).name}
                </p>
                <p
                  className="truncate text-xs text-[var(--ink-soft)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {r.destination.region}
                  {r.hydration?.cost?.totalUsd
                    ? ` · ~$${r.hydration.cost.totalUsd.toLocaleString()}`
                    : ""}
                </p>
              </div>
              <span className="text-[var(--slate-primary)] transition group-hover:translate-x-0.5">→</span>
            </Link>
          ))}
      </div>
    </section>
  );
}

function ComputingState() {
  return (
    <section className="mt-8">
      <GeneratingProgress />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <article
            key={i}
            className="relative overflow-hidden rounded-3xl border border-[var(--hairline)] bg-white shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]"
            style={{ minHeight: 420 }}
          >
            <div className="h-56 w-full animate-pulse rounded-t-3xl bg-[var(--paper-deep)]" />
            <div className="space-y-3 px-5 py-4">
              <div className="h-5 w-3/5 animate-pulse rounded-full bg-[var(--paper-deep)]" />
              <div className="h-3 w-2/5 animate-pulse rounded-full bg-[var(--paper-deep)]" />
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded-full bg-[var(--paper-deep)]" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-[var(--paper-deep)]" />
                <div className="h-3 w-4/6 animate-pulse rounded-full bg-[var(--paper-deep)]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-3xl border border-[var(--hairline)] bg-white px-7 py-8 text-center shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]">
      <p
        className="text-base font-medium text-[#7a3f3f]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Couldn&apos;t generate recommendations
      </p>
      <p
        className="mt-1 text-sm text-[var(--ink-soft)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {message}
      </p>
    </div>
  );
}
