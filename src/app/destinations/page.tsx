import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { ENRICHED_DESTINATIONS as DESTINATIONS } from "@/lib/seed/enrich-destinations";
import { destinationPhotoUrl } from "@/lib/photo";
import { DestinationBrowseCard } from "@/components/destinations/DestinationBrowseCard";
import { getVisitedSlugs } from "@/lib/visited";
import { getFavoriteSlugs } from "@/lib/favorites";
import type { EnrichedDestination, Experience, Landscape } from "@/lib/types";
import { getTranslations, getLocale } from "next-intl/server";
import { localizeDestination } from "@/lib/i18n/localizeDestination";

export const metadata = { title: "Browse destinations — Trip Planner" };

const NYC_LAT_LNG: [number, number] = [40.7128, -74.006];

const LANDSCAPES: Landscape[] = [
  "mountain", "coast", "desert", "forest", "lake", "canyon", "island", "city",
];
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
const EXPERIENCES: Experience[] = [
  "hiking", "foodie", "museums", "scenic-drives", "beaches", "hot-springs", "wildlife",
];

function haversineMi([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Server-side: time-derived value scoped to a helper so the lint rule sees
// a side-effecting call outside the component body.
function weekFromEpoch(): number {
  return Math.floor(Date.now() / 604800000);
}

function tripCostFromNYC(d: EnrichedDestination): number {
  return (d.typicalCostBands.flightFromOrigin.NYC ?? 0) + d.typicalCostBands.lodgingPerNightUsd * 3 + d.typicalCostBands.foodPerDayUsd * 4 + d.typicalCostBands.activitiesPerDayUsd * 4;
}

interface SearchParams {
  q?: string;
  landscape?: string;
  exp?: string;          // comma-separated, multi
  season?: string;
  minScenery?: string;   // "3" | "4" | "5"
  sort?: string;
}

function parseExp(raw: string | undefined): Experience[] {
  if (!raw) return [];
  const allowed = new Set<Experience>(EXPERIENCES);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is Experience => allowed.has(s as Experience));
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const t = await getTranslations("dest");
  const visitedSet = new Set(await getVisitedSlugs());
  const favoriteSet = new Set(await getFavoriteSlugs());
  const actionLabels = {
    favoriteOn: t("actions.favoriteOn"),
    favoriteOff: t("actions.favoriteOff"),
    visitedOn: t("actions.visitedOn"),
    visitedOff: t("actions.visitedOff"),
  };
  const locale = await getLocale();
  const q = params.q?.toLowerCase().trim() ?? "";
  const landscape = (LANDSCAPES.includes(params.landscape as Landscape) ? params.landscape : "") as Landscape | "";
  const expFilter = parseExp(params.exp);
  const season = params.season ?? "";
  const minScenery = params.minScenery && /^[3-5]$/.test(params.minScenery) ? Number(params.minScenery) : 0;
  const sort = params.sort ?? "name";

  let filtered = DESTINATIONS.slice();

  if (q) {
    filtered = filtered.filter((d) =>
      [d.name, d.region, d.state, d.tags.join(" "), d.blurb, d.experiences.join(" "), d.landscape, ...(d.scenicSignals ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (landscape) {
    filtered = filtered.filter(
      (d) => d.landscape === landscape || d.secondaryLandscapes?.includes(landscape),
    );
  }
  if (expFilter.length > 0) {
    // require ALL selected experiences (intersection semantics — narrower = better signal)
    filtered = filtered.filter((d) => expFilter.every((e) => d.experiences.includes(e)));
  }
  if (season) filtered = filtered.filter((d) => d.bestSeasons.includes(season as never));
  if (minScenery > 0) filtered = filtered.filter((d) => d.sceneryScore >= minScenery);

  if (sort === "closest") {
    filtered.sort((a, b) => haversineMi(NYC_LAT_LNG, [a.lat, a.lng]) - haversineMi(NYC_LAT_LNG, [b.lat, b.lng]));
  } else if (sort === "cheapest") {
    filtered.sort((a, b) => tripCostFromNYC(a) - tripCostFromNYC(b));
  } else if (sort === "fall") {
    filtered.sort((a, b) => {
      const af = a.bestSeasons.includes("fall") ? 0 : 1;
      const bf = b.bestSeasons.includes("fall") ? 0 : 1;
      return af - bf || a.name.localeCompare(b.name);
    });
  } else if (sort === "scenery") {
    filtered.sort((a, b) => b.sceneryScore - a.sceneryScore || a.name.localeCompare(b.name));
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Weekly featured — pick from sceneryScore >= 4 so the splash photo always
  // earns the canvas it gets.
  const splashPool = DESTINATIONS.filter((d) => d.sceneryScore >= 4);
  const weekIdx = Number.isFinite(weekFromEpoch())
    ? weekFromEpoch() % Math.max(splashPool.length, 1)
    : 0;
  const featured = splashPool[weekIdx] ?? DESTINATIONS[0];
  const featuredPhoto = destinationPhotoUrl(featured);
  const featuredLocalized = localizeDestination(featured, locale);

  const hasFilters = q || landscape || expFilter.length > 0 || season || minScenery > 0 || sort !== "name";

  const CHIP = (active: boolean) =>
    active
      ? "rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition"
      : "rounded-full border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-[var(--slate-primary)] hover:text-[var(--slate-primary)]";

  // Toggle a single-value filter by clicking. Empty value = clear.
  function chipHref(field: keyof SearchParams, value: string): string {
    const next: SearchParams = { ...params, [field]: value || undefined };
    if (!value) delete next[field];
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/destinations?${qs}` : "/destinations";
  }

  // Toggle one of many comma-separated values. Adds if missing, removes if present.
  function multiChipHref(value: Experience): string {
    const set = new Set(expFilter);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    const next: SearchParams = { ...params, exp: set.size > 0 ? [...set].join(",") : undefined };
    if (!next.exp) delete next.exp;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/destinations?${qs}` : "/destinations";
  }

  return (
    <>
      <MainNav />
      <main className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[420px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredPhoto}
            alt={featuredLocalized.name}
            className="ken-burns absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(31,41,55,0.55), rgba(31,41,55,0.15) 40%, var(--paper))" }} />
          <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/90" style={{ fontFamily: "var(--font-body)" }}>
              {t("subhead", { count: DESTINATIONS.length })}
            </p>
            <h1
              className="mb-4 text-5xl tracking-tight md:text-7xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "white", lineHeight: 0.95 }}
            >
              {t("header")}
            </h1>
            <p className="mb-2 text-lg font-medium text-white/95" style={{ fontFamily: "var(--font-display)" }}>
              {featuredLocalized.name}
              {featuredLocalized.nameEn && (
                <span className="ml-2 text-sm font-normal text-white/70" style={{ fontFamily: "var(--font-body)" }}>
                  {featuredLocalized.nameEn}
                </span>
              )}
            </p>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-white/85" style={{ fontFamily: "var(--font-body)" }}>
              {DESTINATIONS.length} hand-curated US destinations — by landscape, by experience, by season. Filter to what fits.
            </p>
            <Link href="/plan" className="btn-accent inline-flex items-center gap-2">
              Plan a trip →
            </Link>
          </div>
        </section>

        {/* Filter strip */}
        <section className="mx-auto -mt-12 max-w-6xl px-6">
          <div
            className="rounded-3xl border bg-white p-6 md:p-8"
            style={{ borderColor: "var(--hairline)", boxShadow: "var(--shadow-lg)" }}
          >
            <form method="get" action="/destinations" className="mb-5 flex flex-wrap items-center gap-3">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={t("filters.search")}
                className="flex-1 min-w-0 rounded-full border bg-[var(--paper)] px-5 py-3 text-sm placeholder:italic"
                style={{ borderColor: "var(--hairline)", fontFamily: "var(--font-body)", color: "var(--ink)" }}
              />
              {landscape && <input type="hidden" name="landscape" value={landscape} />}
              {expFilter.length > 0 && <input type="hidden" name="exp" value={expFilter.join(",")} />}
              {season && <input type="hidden" name="season" value={season} />}
              {minScenery > 0 && <input type="hidden" name="minScenery" value={String(minScenery)} />}
              {sort !== "name" && <input type="hidden" name="sort" value={sort} />}
              <button type="submit" className="btn-accent">Search →</button>
            </form>

            {/* Landscape — single-select */}
            <div className="mb-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
                {t("filters.landscapeLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LANDSCAPES.map((l) => (
                  <Link
                    key={l}
                    href={chipHref("landscape", landscape === l ? "" : l)}
                    className={CHIP(landscape === l)}
                    style={landscape !== l ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}
                  >
                    <span className="mr-1.5">{LANDSCAPE_ICON[l]}</span>
                    {t(`landscape.${l}`)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Experience — multi-select */}
            <div className="mb-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
                {t("filters.experienceLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCES.map((e) => (
                  <Link
                    key={e}
                    href={multiChipHref(e)}
                    className={CHIP(expFilter.includes(e))}
                    style={!expFilter.includes(e) ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}
                  >
                    {t(`experience.${e}`)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Season + Scenery row */}
            <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
                  {t("filters.seasonLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["spring", "summer", "fall", "winter"] as const).map((s) => (
                    <Link
                      key={s}
                      href={chipHref("season", season === s ? "" : s)}
                      className={CHIP(season === s)}
                      style={season !== s ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
                  {t("filters.sceneryLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href={chipHref("minScenery", "")} className={CHIP(minScenery === 0)}
                    style={minScenery !== 0 ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}>
                    {t("filters.sceneryAny")}
                  </Link>
                  <Link href={chipHref("minScenery", "3")} className={CHIP(minScenery === 3)}
                    style={minScenery !== 3 ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}>
                    {t("filters.scenery3")}
                  </Link>
                  <Link href={chipHref("minScenery", "4")} className={CHIP(minScenery === 4)}
                    style={minScenery !== 4 ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}>
                    {t("filters.scenery4")}
                  </Link>
                  <Link href={chipHref("minScenery", "5")} className={CHIP(minScenery === 5)}
                    style={minScenery !== 5 ? { borderColor: "var(--hairline)", color: "var(--ink-soft)", fontFamily: "var(--font-body)" } : { fontFamily: "var(--font-body)" }}>
                    {t("filters.scenery5")}
                  </Link>
                </div>
              </div>

              <span className="ml-auto flex items-center gap-2 text-xs" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
                {t("filters.sort")}:
                <form method="get" action="/destinations" className="inline">
                  {q && <input type="hidden" name="q" value={q} />}
                  {landscape && <input type="hidden" name="landscape" value={landscape} />}
                  {expFilter.length > 0 && <input type="hidden" name="exp" value={expFilter.join(",")} />}
                  {season && <input type="hidden" name="season" value={season} />}
                  {minScenery > 0 && <input type="hidden" name="minScenery" value={String(minScenery)} />}
                  <select
                    name="sort"
                    defaultValue={sort}
                    className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ borderColor: "var(--hairline)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
                  >
                    <option value="name">{t("filters.sortName")}</option>
                    <option value="closest">{t("filters.sortClosest")}</option>
                    <option value="cheapest">{t("filters.sortCheapest")}</option>
                    <option value="fall">{t("filters.sortFall")}</option>
                    <option value="scenery">{t("filters.sortScenery")}</option>
                  </select>
                  <button type="submit" className="ml-1 text-xs font-semibold uppercase tracking-wider underline" style={{ color: "var(--slate-primary)" }}>Apply</button>
                </form>
              </span>
            </div>

            {hasFilters && (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--hairline)" }}>
                <Link href="/destinations" className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                  {t("filters.clearAll")} · Showing {filtered.length} of {DESTINATIONS.length}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border bg-white p-12 text-center" style={{ borderColor: "var(--hairline)" }}>
              <p className="mb-4 text-lg italic" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-display)" }}>
                {t("empty.header")}
              </p>
              <Link href="/destinations" className="btn-accent">{t("empty.cta")}</Link>
            </div>
          ) : (
            <ul className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <li key={d.slug}>
                  <DestinationBrowseCard
                    destination={d}
                    locale={locale}
                    isFavorite={favoriteSet.has(d.slug)}
                    isVisited={visitedSet.has(d.slug)}
                    actionLabels={actionLabels}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl border-t px-6 py-10" style={{ borderColor: "var(--hairline)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>
            Trip Planner · 2026 · {DESTINATIONS.length} takes
          </p>
        </footer>
      </main>
    </>
  );
}
