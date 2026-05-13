import type {
  CostBreakdown,
  ParsedStop,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";
import { PhotoCredit } from "./PhotoCredit";
import { tagClass } from "@/lib/ui/tag-tones";
import { localizeDestination } from "@/lib/i18n/localizeDestination";

interface Props {
  pick: RecommendationPick;
  destination: SeedDestination;
  cost?: CostBreakdown;
  weather?: WeatherForecast;
  expanded?: boolean;
  onToggle?: () => void;
  locale?: string;
  /**
   * Phase B: the route's stops, ordered. Single-stop routes (default
   * today) render unchanged — when the parent passes a multi-stop array,
   * the rank chip and a companion-stop chip strip light up below the name.
   */
  stops?: ParsedStop[];
}

export function DestinationCard({
  pick,
  destination,
  cost,
  weather,
  expanded,
  onToggle,
  locale = "en",
  stops,
}: Props) {
  const photo = destinationPhotoUrl(destination);
  const { name, nameEn } = localizeDestination(destination, locale);

  // Phase B: companion stops are anything past the anchor. `stops` is
  // undefined on call sites that haven't been migrated yet (e.g. the
  // /trips/demo preview); we treat that as a 1-stop route.
  const companionStops = stops && stops.length > 1 ? stops.slice(1) : [];
  const isMultiStop = companionStops.length > 0;

  return (
    <article
      className={`relative flex h-full cursor-pointer flex-col overflow-hidden bg-white transition-shadow ${
        expanded ? "ring-2 ring-[var(--accent)]" : ""
      }`}
      style={{
        borderRadius: "1.5rem",
        border: "1px solid var(--hairline)",
        boxShadow: "0 30px 60px -20px rgba(31,41,55,0.15)",
      }}
      onClick={onToggle}
    >
      {/* Hero photo */}
      <div className="group relative h-56 w-full overflow-hidden" style={{ borderRadius: "1rem 1rem 0 0" }}>
        <img
          src={photo}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        <PhotoCredit destination={destination} />
        {/* Rank chip — slate-primary tint. Phase B: appends stop count
            for multi-stop routes ("Pick #2 · 2 stops"). */}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "var(--slate-tint)",
            color: "var(--slate-primary)",
            fontFamily: "var(--font-display-stack)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(44,84,116,0.15)",
          }}
        >
          Pick #{pick.rank}
          {isMultiStop ? ` · ${(stops?.length ?? 1)} stops` : null}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div>
          <h3
            className="line-clamp-2 text-2xl font-semibold leading-tight"
            style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
          >
            {name}
          </h3>
          {nameEn && (
            <p className="text-xs text-[var(--ink-soft)] mt-0.5 font-normal not-italic" style={{ fontFamily: "var(--font-body)" }}>
              {nameEn}
            </p>
          )}
          <p
            className="mt-1 text-xs italic"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            {destination.region} · {destination.state}
          </p>
        </div>

        {isMultiStop ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {companionStops.map((stop) => {
              const { name: stopName } = localizeDestination(stop.destination, locale);
              return (
                <span
                  key={stop.slug}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    fontFamily: "var(--font-body-stack)",
                  }}
                >
                  + {stopName}
                  {stop.days ? ` · ${stop.days}d` : null}
                </span>
              );
            })}
          </div>
        ) : null}

        <p
          className="line-clamp-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink)" }}
        >
          {pick.reasoning}
        </p>

        <div className="flex max-h-[1.85rem] flex-wrap gap-1.5 overflow-hidden">
          {pick.matchTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Spec strip — tabular nums, DM Sans */}
        <div
          className="mt-auto flex items-end justify-between pt-3"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
            >
              Est. total {cost?.source === "amadeus" ? "(live)" : "(estimate)"}
            </p>
            <p
              className="text-xl font-semibold tabular-nums"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
            >
              {cost ? `$${cost.totalUsd.toLocaleString()}` : "—"}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
            >
              Forecast
            </p>
            <p
              className="text-sm font-semibold tabular-nums"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
            >
              {weather ? `${weather.highF}° / ${weather.lowF}°F` : "—"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
