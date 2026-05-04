import Link from "next/link";
import type { EnrichedDestination, Landscape } from "@/lib/types";
import { destinationPhotoUrl } from "@/lib/photo";
import { localizeDestination } from "@/lib/i18n/localizeDestination";

const TAG_TONE: Record<string, string> = {
  foodie: "tag-foodie",
  scenic: "tag-scenic",
  chill: "tag-chill",
  cultural: "tag-cultural",
  nature: "tag-scenic",
  city: "tag-cultural",
  adventure: "tag-default",
  nightlife: "tag-default",
};

const LANDSCAPE_ICON: Record<Landscape, string> = {
  mountain: "🏔",
  coast: "🌊",
  desert: "🏜",
  forest: "🌲",
  lake: "🏞",
  canyon: "⛰",
  island: "🏝",
  city: "🏙",
};

const LANDSCAPE_LABEL_EN: Record<Landscape, string> = {
  mountain: "Mountain",
  coast: "Coast",
  desert: "Desert",
  forest: "Forest",
  lake: "Lake",
  canyon: "Canyon",
  island: "Island",
  city: "City",
};

const LANDSCAPE_LABEL_ZH: Record<Landscape, string> = {
  mountain: "山地",
  coast: "海岸",
  desert: "沙漠",
  forest: "森林",
  lake: "湖泊",
  canyon: "峡谷",
  island: "岛屿",
  city: "城市",
};

function tripCostFromNYC(d: EnrichedDestination): number {
  const flight = d.typicalCostBands.flightFromOrigin.NYC ?? 0;
  const total = flight + d.typicalCostBands.lodgingPerNightUsd * 3 + d.typicalCostBands.foodPerDayUsd * 4 + d.typicalCostBands.activitiesPerDayUsd * 4;
  return Math.round(total / 50) * 50;
}

export function DestinationBrowseCard({
  destination,
  locale = "en",
}: {
  destination: EnrichedDestination;
  locale?: string;
}) {
  const photo = destinationPhotoUrl(destination);
  const cost = tripCostFromNYC(destination);
  const primaryTag = destination.tags[0];
  const { name, nameEn, blurb } = localizeDestination(destination, locale);
  const landscapeLabel =
    locale === "zh"
      ? LANDSCAPE_LABEL_ZH[destination.landscape]
      : LANDSCAPE_LABEL_EN[destination.landscape];

  return (
    <Link
      href={`/plan?anchor=${destination.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: "var(--hairline)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="relative aspect-[3/2] w-full flex-shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Landscape badge — primary terrain only, secondary stays in filter logic */}
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
          style={{
            background: "var(--slate-tint)",
            color: "var(--slate-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <span aria-hidden>{LANDSCAPE_ICON[destination.landscape]}</span>
          {landscapeLabel}
        </span>
        {/* Scenery score — real data, replaces the deterministic-rating */}
        <span
          className="absolute bottom-3 right-3 rounded-full bg-[var(--ink)]/65 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
          style={{ fontFamily: "var(--font-body)" }}
          title={`Scenery score: ${destination.sceneryScore}/5`}
        >
          {"★".repeat(destination.sceneryScore)}
          <span className="opacity-50">{"★".repeat(5 - destination.sceneryScore)}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p
          className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em]"
          style={{ color: "var(--slate-primary)", fontFamily: "var(--font-body)" }}
        >
          {destination.region} · {destination.state}
        </p>
        <h3
          className="mb-2 line-clamp-2 text-2xl tracking-tight transition-colors"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ink)" }}
        >
          {name}
        </h3>
        {nameEn && (
          <p className="text-xs text-[var(--ink-soft)] -mt-1 mb-1 font-normal not-italic" style={{ fontFamily: "var(--font-body)" }}>
            {nameEn}
          </p>
        )}
        <p
          className="mb-4 line-clamp-3 flex-1 text-sm italic leading-relaxed"
          style={{ color: "var(--ink-soft)", fontFamily: "var(--font-display)" }}
        >
          {blurb}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          <span className={`${TAG_TONE[primaryTag] ?? "tag-default"} rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider`}>
            {primaryTag}
          </span>
          <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
            {destination.bestSeasons[0]}
          </span>
          <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider tabular-nums"
            style={{ borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
            ~${cost}
          </span>
        </div>
      </div>
    </Link>
  );
}
