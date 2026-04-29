import type { CostBreakdown, RecommendationPick, SeedDestination, WeatherForecast } from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";
import { tagClass } from "@/lib/ui/tag-tones";

interface Props {
  pick: RecommendationPick;
  destination: SeedDestination;
  cost?: CostBreakdown;
  weather?: WeatherForecast;
  expanded?: boolean;
  onToggle?: () => void;
}

export function DestinationCard({ pick, destination, cost, weather, expanded, onToggle }: Props) {
  const photo = destinationPhotoUrl(destination);

  return (
    <article
      className={`paper paper-hover relative flex cursor-pointer flex-col overflow-hidden bg-white ${
        expanded ? "ring-2 ring-[var(--accent)]" : ""
      }`}
      style={{ borderRadius: "var(--radius-lg)" }}
      onClick={onToggle}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${photo}')` }}
        />
        <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] shadow-sm">
          Pick #{pick.rank}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div>
          <h3
            className="font-serif text-2xl font-semibold leading-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            {destination.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            {destination.region} · {destination.state}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-[var(--ink)]/90">{pick.reasoning}</p>

        <div className="flex flex-wrap gap-1.5">
          {pick.matchTags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-[var(--hairline)] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              Est. total {cost?.source === "amadeus" ? "(live)" : "(estimate)"}
            </p>
            <p
              className="font-serif text-xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              {cost ? `$${cost.totalUsd.toLocaleString()}` : "—"}
            </p>
          </div>
          {weather && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                Forecast
              </p>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {weather.highF}° / {weather.lowF}°F
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
