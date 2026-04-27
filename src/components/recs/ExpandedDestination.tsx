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

interface Props {
  pick: RecommendationPick;
  destination: SeedDestination;
  cost: CostBreakdownT;
  weather: WeatherForecast;
  bookingLinks: BookingLinksT;
  itinerary?: ItineraryDay[]; // null when not yet generated
  itineraryLoading?: boolean;
  onSave?: () => void;
  onClose?: () => void;
}

export function ExpandedDestination({
  pick,
  destination,
  cost,
  weather,
  bookingLinks,
  itinerary,
  itineraryLoading,
  onSave,
  onClose,
}: Props) {
  const photo = destinationPhotoUrl(destination);

  return (
    <section className="glass-strong relative overflow-hidden">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/55 px-2.5 py-1 text-sm text-white backdrop-blur-sm transition hover:bg-black/80"
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
        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="hero-eyebrow mb-2 text-[var(--accent)]">
            Pick #{pick.rank} · {destination.region}
          </p>
          <h2
            className="font-serif text-4xl font-bold leading-tight text-white drop-shadow"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            {destination.name}, {destination.state}
          </h2>
          <p
            className="mt-2 max-w-2xl text-base italic text-white/85"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {destination.blurb}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 px-7 py-7 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="hero-eyebrow mb-3 text-[var(--accent)]">Why this one</p>
          <p className="text-base leading-relaxed text-white/90">
            {pick.reasoning}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {pick.matchTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3
            className="mt-8 font-serif text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            What you'll see
          </h3>
          <ul className="mt-3 space-y-3">
            {destination.attractions.map((a) => (
              <li key={a.name} className="border-l-2 border-[var(--primary)] pl-4">
                <p className="text-sm font-semibold text-white">{a.name}</p>
                <p className="text-sm text-[var(--text-muted)]">{a.description}</p>
              </li>
            ))}
          </ul>

          {/* Itinerary */}
          <div className="mt-8">
            <h3
              className="font-serif text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              Day-by-day itinerary
            </h3>
            {itineraryLoading && (
              <p className="mt-3 animate-pulse text-sm text-[var(--text-muted)]">
                Drafting your itinerary…
              </p>
            )}
            {!itineraryLoading && !itinerary && (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Click into a card to generate the itinerary.
              </p>
            )}
            {itinerary && (
              <ol className="mt-3 space-y-3">
                {itinerary.map((day) => (
                  <li key={day.day} className="flex gap-4">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-text)]"
                    >
                      {day.day}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{day.title}</p>
                      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                        {day.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="glass px-5 py-4">
            <h4
              className="font-serif text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              🌤 Weather
            </h4>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-white">
                {weather.highF}° / {weather.lowF}°F
              </span>{" "}
              · {weather.summary}
            </p>
          </div>
          <CostBreakdown cost={cost} />
          <BookingLinks links={bookingLinks} />
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-text)] shadow-[0_0_24px_var(--primary-glow)] transition hover:opacity-90"
            >
              ✦ Save this trip
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}
