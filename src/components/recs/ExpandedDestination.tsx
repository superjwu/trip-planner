import type {
  BookingLinks as BookingLinksT,
  CostBreakdown as CostBreakdownT,
  ItineraryDay,
  ParsedStop,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";
import { PhotoCredit } from "./PhotoCredit";
import { CostBreakdown } from "@/components/trip/CostBreakdown";
import { BookingLinks } from "@/components/trip/BookingLinks";
import { tagClass } from "@/lib/ui/tag-tones";
import { localizeDestination } from "@/lib/i18n/localizeDestination";

interface Props {
  pick: RecommendationPick;
  destination: SeedDestination;
  cost?: CostBreakdownT;
  weather?: WeatherForecast;
  bookingLinks?: BookingLinksT | null;
  itinerary?: ItineraryDay[];
  itineraryMissing?: boolean;
  itineraryLoading?: boolean;
  /** Drives the skeleton row count while itinerary drafts. Defaults to 5. */
  tripLengthDays?: number;
  onClose?: () => void;
  locale?: string;
  /**
   * Phase B: stops on this route, ordered. When length > 1 a "The Route"
   * section renders between the reasoning card and the attractions grid.
   */
  stops?: ParsedStop[];
}

export function ExpandedDestination({
  pick,
  destination,
  cost,
  weather,
  bookingLinks,
  itinerary,
  itineraryMissing,
  itineraryLoading,
  tripLengthDays,
  onClose,
  locale = "en",
  stops,
}: Props) {
  const photo = destinationPhotoUrl(destination);
  const { name, nameEn, blurb } = localizeDestination(destination, locale);
  const isMultiStop = stops !== undefined && stops.length > 1;

  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{
        borderRadius: "1.5rem",
        border: "1px solid var(--hairline)",
        boxShadow: "0 30px 60px -20px rgba(31,41,55,0.15)",
      }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/95 px-2.5 py-1 text-sm shadow transition hover:bg-white"
          style={{ color: "var(--ink)" }}
        >
          ✕
        </button>
      )}

      {/* Hero */}
      <div className="group relative h-72 w-full overflow-hidden" style={{ borderRadius: "1.5rem 1.5rem 0 0" }}>
        <img
          src={photo}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <PhotoCredit destination={destination} />
        <div className="absolute bottom-6 left-6 right-6">
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/95"
            style={{ fontFamily: "var(--font-body-stack)" }}
          >
            Pick #{pick.rank} · {destination.region}
          </p>
          <h2
            className="text-4xl font-semibold leading-tight text-white drop-shadow"
            style={{ fontFamily: "var(--font-display-stack)" }}
          >
            {name}, {destination.state}
          </h2>
          {nameEn && (
            <p className="text-xs text-white/70 mt-1 font-normal" style={{ fontFamily: "var(--font-body-stack)" }}>
              {nameEn}
            </p>
          )}
          <p
            className="mt-2 max-w-2xl text-base italic text-white/90"
            style={{ fontFamily: "var(--font-display-stack)" }}
          >
            {blurb}
          </p>
          {/* Note: pick.reasoning (shown below) stays English — LLM-generated content;
              will be localized in a future pass once the rec engine supports zh output. */}
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 px-7 py-7 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {/* Reasoning card — slate-primary left border, paper-deep bg */}
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "var(--paper-deep)",
              borderLeft: "4px solid var(--slate-primary)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] mb-2"
              style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
            >
              Why this one
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink)" }}
            >
              {pick.reasoning}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pick.matchTags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${tagClass(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Phase B: The Route — only shows for multi-stop combos.
              Single-stop routes (today's default) skip this section. */}
          {isMultiStop && stops ? (
            <div className="mt-7">
              <h3
                className="text-xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
              >
                The Route
              </h3>
              <ol className="space-y-3">
                {stops.map((stop) => {
                  const { name: stopName, blurb: stopBlurb } = localizeDestination(
                    stop.destination,
                    locale,
                  );
                  return (
                    <li
                      key={stop.slug}
                      className="flex items-start gap-3 rounded-2xl px-4 py-3"
                      style={{
                        background: "var(--paper-deep)",
                        border: "1px solid var(--hairline)",
                      }}
                    >
                      <span
                        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          background: "var(--accent)",
                          color: "white",
                          fontFamily: "var(--font-display-stack)",
                        }}
                      >
                        {stop.order}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p
                            className="text-base font-semibold"
                            style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                          >
                            {stopName}
                          </p>
                          <p
                            className="text-xs italic"
                            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
                          >
                            {stop.destination.region} · {stop.destination.state}
                          </p>
                          {stop.days ? (
                            <span
                              className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums"
                              style={{
                                background: "var(--slate-tint)",
                                color: "var(--slate-primary)",
                                fontFamily: "var(--font-body-stack)",
                              }}
                            >
                              {stop.days} {stop.days === 1 ? "day" : "days"}
                            </span>
                          ) : null}
                        </div>
                        <p
                          className="mt-1 line-clamp-2 text-sm leading-relaxed"
                          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
                        >
                          {stopBlurb}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}

          {/* What you'll see — 3-col white rounded mini-cards */}
          <div className="mt-7">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
            >
              What you&apos;ll see
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destination.attractions.map((a) => (
                <div
                  key={a.name}
                  className="rounded-3xl bg-white px-4 py-4"
                  style={{
                    border: "1px solid var(--hairline)",
                    boxShadow: "0 8px 20px -8px rgba(31,41,55,0.10)",
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                  >
                    {a.name}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
                  >
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Day-by-day — coral circle avatars */}
          <div className="mt-7">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
            >
              Day-by-day itinerary
            </h3>
            {itineraryLoading && (
              <ItineraryDraftingSkeleton tripLengthDays={tripLengthDays ?? 5} />
            )}
            {!itineraryLoading && itineraryMissing && !itinerary && (
              <p
                className="mt-3 text-sm"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                Couldn&apos;t generate an itinerary right now. Try refreshing the page.
              </p>
            )}
            {itinerary && (
              <ol className="space-y-0">
                {itinerary.map((day, di) => (
                  <li key={day.day}>
                    <div className="flex gap-4 py-5">
                      {/* Coral circle avatar */}
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white tabular-nums"
                        style={{
                          background: "var(--accent)",
                          fontFamily: "var(--font-display-stack)",
                          boxShadow: "0 8px 16px -6px rgba(231,111,81,0.45)",
                        }}
                      >
                        {day.day}
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                        >
                          {day.title}
                        </p>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
                        >
                          {day.description}
                        </p>
                      </div>
                    </div>
                    {di < (itinerary?.length ?? 0) - 1 && (
                      <div
                        className="ml-14"
                        style={{ borderTop: "1px solid var(--hairline)" }}
                      />
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Weather */}
          <div
            className="rounded-2xl px-5 py-4 bg-white"
            style={{ border: "1px solid var(--hairline)" }}
          >
            <h4
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
            >
              🌤 Weather
            </h4>
            {weather ? (
              <p
                className="text-sm tabular-nums"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                <span
                  className="font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-display-stack)" }}
                >
                  {weather.highF}° / {weather.lowF}°F
                </span>{" "}
                · {weather.summary}
              </p>
            ) : (
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                Forecast unavailable for these dates.
              </p>
            )}
          </div>

          {/* Cost breakdown */}
          {cost ? (
            <CostBreakdown cost={cost} stops={stops} />
          ) : (
            <div
              className="rounded-2xl px-5 py-4 bg-white"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <h4
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
              >
                💰 Cost breakdown
              </h4>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                Cost estimate not yet available — check the booking links for live prices.
              </p>
            </div>
          )}

          {/* Booking links */}
          {bookingLinks ? (
            <BookingLinks links={bookingLinks} />
          ) : (
            <div
              className="rounded-2xl px-5 py-4 bg-white"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <h4
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
              >
                🎟 Book it
              </h4>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                Booking links unavailable.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

/**
 * Skeleton shown while the day-by-day LLM call is in flight (typically
 * 6–12s on gpt-5.5 reasoning=low). Renders N placeholder day rows whose
 * layout matches the real day rows, plus an italic wait-time hint and a
 * coral progress bar with a staggered pulse — so the wait feels like
 * "drafting" instead of a blank pause.
 */
function ItineraryDraftingSkeleton({ tripLengthDays }: { tripLengthDays: number }) {
  const clamped = Math.max(1, Math.min(14, tripLengthDays));
  const days = Array.from({ length: clamped }, (_, i) => i + 1);
  return (
    <div>
      <p
        className="mb-4 text-xs italic"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        Drafting your day-by-day · usually 6–12 seconds.
      </p>
      <ol className="space-y-0">
        {days.map((d, i) => (
          <li key={d}>
            <div className="flex gap-4 py-5">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
                style={{
                  background: "var(--paper-deep)",
                  color: "var(--ink-soft)",
                  fontFamily: "var(--font-display-stack)",
                }}
              >
                {d}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="h-4 w-2/3 rounded animate-pulse"
                  style={{
                    background: "var(--paper-deep)",
                    animationDelay: `${i * 90}ms`,
                  }}
                />
                <div
                  className="mt-2 h-3 w-full rounded animate-pulse"
                  style={{
                    background: "var(--paper-deep)",
                    animationDelay: `${i * 90 + 60}ms`,
                  }}
                />
                <div
                  className="mt-2 h-3 w-5/6 rounded animate-pulse"
                  style={{
                    background: "var(--paper-deep)",
                    animationDelay: `${i * 90 + 120}ms`,
                  }}
                />
              </div>
            </div>
            {i < days.length - 1 && (
              <div
                aria-hidden="true"
                className="ml-5 h-px"
                style={{ background: "var(--hairline)" }}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
