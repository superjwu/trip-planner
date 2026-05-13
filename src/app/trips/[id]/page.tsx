import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getLocale } from "next-intl/server";
import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { DestinationCard } from "@/components/recs/DestinationCard";
import { ExpandedDestination } from "@/components/recs/ExpandedDestination";
import { ItineraryAutoFetch } from "@/components/recs/ItineraryAutoFetch";
import { ScrollToTopOnNav } from "@/components/recs/ScrollToTopOnNav";
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
  ParsedStop,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";
import { computeRecommendations } from "./actions";
import { localizeDestination } from "@/lib/i18n/localizeDestination";
import { ENRICHED_DESTINATIONS } from "@/lib/seed/enrich-destinations";

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
  // Phase B: migration 0007 adds these. Backfill turns every pre-Phase-B
  // row into a 1-stop array. New rows after B.4 land carry the LLM-emitted
  // route shape.
  stops: unknown;
  stop_snapshots: unknown;
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
  // Phase B: 1–3 stops per rec. stops[0].destination === destination for
  // back-compat with the single-destination UI surfaces that haven't been
  // migrated yet (B.5 work).
  stops: ParsedStop[];
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

// Phase B: the stops column shape from the DB. The migration backfill
// shape mirrors what the LLM emits via the schema's preprocess.
const DbStopSchema = z.object({
  slug: z.string(),
  order: z.number().int().min(1).max(3),
  days: z.number().int().min(1).max(14).nullable(),
});
const DbStopArraySchema = z.array(DbStopSchema).min(1).max(3);
const DbStopSnapshotsSchema = z.array(SeedDestinationSchema).min(1).max(3);

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

  // Phase B: prefer DB-persisted stops over synthesis. parseRec stays
  // resilient to three cases:
  //   1. Pre-migration rows (no `stops` / `stop_snapshots` columns at all)
  //      — Supabase returns the keys as undefined; both safeParse calls
  //      fail; we synthesize a 1-stop array from `destination_snapshot`.
  //   2. Post-migration backfilled rows — `stops` and `stop_snapshots`
  //      are present as a 1-stop pair built from `destination_snapshot`.
  //      Parse succeeds and we zip them.
  //   3. Multi-stop rows persisted by the new rankAndPersist — same as
  //      (2) but length 2 or 3.
  // Single-stop legacy rows (no `stop_snapshots`) zip to the anchor
  // snapshot they already have on the row.
  const dbStops = DbStopArraySchema.safeParse(raw.stops);
  const dbStopSnapshots = DbStopSnapshotsSchema.safeParse(raw.stop_snapshots);
  let stops: ParsedStop[];
  if (dbStops.success && dbStopSnapshots.success && dbStops.data.length === dbStopSnapshots.data.length) {
    stops = dbStops.data.map((s, i) => ({
      slug: s.slug,
      order: s.order,
      days: s.days,
      destination: dbStopSnapshots.data[i],
    }));
  } else {
    stops = [
      { slug: head.data.destination_slug, order: 1, days: null, destination: dest.data },
    ];
  }

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
    stops,
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
    // Phase B: switched from an explicit field list to `*` so missing
    // columns (pre-migration `stops` / `stop_snapshots`) don't 500 the
    // whole trip page. parseRec already safe-parses every field; unknown
    // extras are ignored.
    .select("*")
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

  const recs =
    trip.compute_status === "ready"
      ? await fetchRecs(renderRound?.id ?? null, normalized?.tripLengthDays ?? null)
      : [];

  const focusRank = focusRaw ? Number(focusRaw) : null;
  // Lazy itinerary on focus — itinerary generation is a 6-15s LLM call.
  // Awaiting it server-side blocks the entire page render and made clicking
  // a pick feel slow. Render focused view immediately; if itinerary is
  // missing, ItineraryAutoFetch fires the server action client-side and
  // calls router.refresh() when done.
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
      <ScrollToTopOnNav />
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
              <div
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-3 text-sm"
                style={{
                  borderColor: "var(--accent)",
                  background: "rgba(231,111,81,0.08)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span>
                  <strong style={{ fontFamily: "var(--font-display)" }}>Round {renderRound.round_number}</strong>{" "}
                  is a historical view (read-only). Refine isn&apos;t available here — head back to the current round to keep iterating.
                </span>
                <Link
                  href={`/trips/${id}`}
                  className="btn-accent inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap"
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
            {normalized?.anchorSlug && (() => {
              const anchorDest = ENRICHED_DESTINATIONS.find((d) => d.slug === normalized.anchorSlug);
              if (!anchorDest) return null;
              const anchorLocalized = localizeDestination(anchorDest, locale);
              return (
                <div className="mb-12 flex justify-center">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                    style={{
                      borderColor: "var(--slate-primary)",
                      backgroundColor: "var(--slate-tint)",
                      color: "var(--slate-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span aria-hidden>✦</span>
                    {locale === "zh" ? "围绕" : "Planned around"}{" "}
                    <strong style={{ fontFamily: "var(--font-display)" }}>
                      {anchorLocalized.name}
                    </strong>
                    {locale === "zh" ? "策划" : ""}
                  </div>
                </div>
              );
            })()}
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
                      // Phase B: pass the chain of stop coords so the
                      // atlas can draw the multi-leg polyline. Single-stop
                      // routes have length 1; the atlas treats them as
                      // before.
                      stops: r.stops.map(
                        (s) => [s.destination.lng, s.destination.lat] as [number, number],
                      ),
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
        stops={rec.stops}
        itinerary={rec.itinerary?.days}
        itineraryMissing={!rec.itinerary}
        itineraryLoading={!rec.itinerary}
        locale={locale}
      />
      {!rec.itinerary && (
        <ItineraryAutoFetch tripId={tripId} recId={rec.id} />
      )}
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
      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {recs.map((r) => {
          const pick: RecommendationPick = {
            slug: r.destination_slug,
            rank: r.rank,
            reasoning: r.reasoning,
            matchTags: r.match_tags,
          };
          return (
            <Link key={r.id} href={`/trips/${tripId}?focus=${r.rank}`} className="block h-full">
              <DestinationCard
                pick={pick}
                destination={r.destination}
                cost={r.hydration?.cost}
                weather={r.hydration?.weather}
                locale={locale}
                stops={r.stops}
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
      <div className="mt-6 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
