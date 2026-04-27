import type { CostBreakdown, RecommendationPick, SeedDestination, WeatherForecast } from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";

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
      className={`glass-strong glass-hover relative flex cursor-pointer flex-col overflow-hidden ${
        expanded ? "ring-2 ring-[var(--primary)]" : ""
      }`}
      onClick={onToggle}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${photo}')` }}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded bg-black/55 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          #{pick.rank}
        </span>
        <div className="absolute bottom-3 left-4 right-4">
          <h3
            className="font-serif text-2xl font-bold leading-tight text-white drop-shadow"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            {destination.name}
          </h3>
          <p className="text-xs uppercase tracking-wider text-white/75">
            {destination.region} · {destination.state}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="text-sm leading-relaxed text-white/85">{pick.reasoning}</p>

        <div className="flex flex-wrap gap-1.5">
          {pick.matchTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-white/8 pt-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Est. total {cost?.source === "amadeus" ? "(live)" : "(estimate)"}
            </p>
            <p
              className="font-serif text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
            >
              {cost ? `$${cost.totalUsd.toLocaleString()}` : "—"}
            </p>
          </div>
          {weather && (
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Forecast
              </p>
              <p className="text-sm font-semibold text-white">
                {weather.highF}° / {weather.lowF}°F
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
