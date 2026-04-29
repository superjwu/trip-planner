import type {
  BookingLinks as BookingLinksT,
  CostBreakdown as CostBreakdownT,
  ItineraryDay,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";
import { CostBreakdown } from "@/components/trip/CostBreakdown";
import { BookingLinks } from "@/components/trip/BookingLinks";
import { tagClass } from "@/lib/ui/tag-tones";

interface Props {
  pick: RecommendationPick;
  destination: SeedDestination;
  cost?: CostBreakdownT;
  weather?: WeatherForecast;
  bookingLinks?: BookingLinksT | null;
  itinerary?: ItineraryDay[];
  itineraryMissing?: boolean;
  itineraryLoading?: boolean;
  onClose?: () => void;
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
  onClose,
}: Props) {
  const photo = destinationPhotoUrl(destination);

  return (
    <section
      className="paper-strong relative overflow-hidden bg-white"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/95 px-2.5 py-1 text-sm text-[var(--ink)] shadow transition hover:bg-white"
        >
          ✕
        </button>
      )}

      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden">
        <span
          className="ken-burns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${photo}')` }}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="hero-eyebrow mb-2 text-white/95">
            Pick #{pick.rank} · {destination.region}
          </p>
          <h2
            className="font-serif text-4xl font-semibold leading-tight text-white drop-shadow"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            {destination.name}, {destination.state}
          </h2>
          <p
            className="mt-2 max-w-2xl text-base italic text-white/90"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {destination.blurb}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 px-7 py-7 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="rounded-2xl bg-[var(--butter)] px-5 py-4">
            <p className="hero-eyebrow mb-2 text-[var(--ink-soft)]">Why this one</p>
            <p className="text-base leading-relaxed text-[var(--ink)]">
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

          <div className="mt-7 rounded-2xl bg-[var(--sage)] px-5 py-4">
            <h3
              className="font-serif text-xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              What you&apos;ll see
            </h3>
            <ul className="mt-3 space-y-3">
              {destination.attractions.map((a) => (
                <li key={a.name} className="border-l-2 border-[var(--accent)] pl-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">{a.name}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{a.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 rounded-2xl bg-[var(--rose)] px-5 py-4">
            <h3
              className="font-serif text-xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              Day-by-day itinerary
            </h3>
            {itineraryLoading && (
              <p className="mt-3 animate-pulse text-sm text-[var(--ink-soft)]">
                Drafting your itinerary…
              </p>
            )}
            {!itineraryLoading && itineraryMissing && !itinerary && (
              <p className="mt-3 text-sm text-[var(--ink-soft)]">
                Couldn&apos;t generate an itinerary right now. Try refreshing the page.
              </p>
            )}
            {itinerary && (
              <ol className="mt-3 space-y-3">
                {itinerary.map((day) => (
                  <li key={day.day} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                      {day.day}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{day.title}</p>
                      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                        {day.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="paper px-5 py-4">
            <h4
              className="font-serif text-lg font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              🌤 Weather
            </h4>
            {weather ? (
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                <span className="font-semibold text-[var(--ink)]">
                  {weather.highF}° / {weather.lowF}°F
                </span>{" "}
                · {weather.summary}
              </p>
            ) : (
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Forecast unavailable for these dates.
              </p>
            )}
          </div>
          {cost ? (
            <CostBreakdown cost={cost} />
          ) : (
            <div className="paper px-5 py-4">
              <h4
                className="font-serif text-lg font-semibold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
              >
                💰 Cost breakdown
              </h4>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Cost estimate not yet available — check the booking links for live prices.
              </p>
            </div>
          )}
          {bookingLinks ? (
            <BookingLinks links={bookingLinks} />
          ) : (
            <div className="paper px-5 py-4">
              <h4
                className="font-serif text-lg font-semibold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
              >
                🎟 Book it
              </h4>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Booking links unavailable.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
