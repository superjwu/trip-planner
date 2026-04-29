import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v25 — Bento Citrus / Modern Dashboard
// Palette: Orange #FF6B35, Lemon #F4D03F, Lime #7FB069, Navy #172447,
//          White #FFFFFF, Light stone #F5F2EC, Soft peach #FFE5D4
// Design: Apple Music / Linear / Vercel bento-grid aesthetic.
// Each pick = its own cluster of color tiles on a 12-col CSS grid.

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const RANK_LABELS = ["01", "02", "03", "04"];

// Per-pick tile color distributions — vary so they don't look identical
const PICK_SCHEMES = [
  {
    // Charleston — orange-led
    why: "bg-[#FF6B35]",
    weather: "bg-[#172447]",
    cost: "bg-[#FFFFFF]",
    tags: "bg-[#F5F2EC]",
    attrs: "bg-[#FFFFFF]",
    itin: "bg-[#F4D03F]",
    itinText: "text-[#172447]",
    photoColSpan: "col-span-7",
    whyColSpan: "col-span-5",
    weatherColSpan: "col-span-4",
    costColSpan: "col-span-4",
    tagsColSpan: "col-span-4",
    attrsColSpan: "col-span-6",
    itinColSpan: "col-span-6",
  },
  {
    // Acadia — lime-led
    why: "bg-[#7FB069]",
    weather: "bg-[#172447]",
    cost: "bg-[#FFFFFF]",
    tags: "bg-[#F5F2EC]",
    attrs: "bg-[#F5F2EC]",
    itin: "bg-[#FF6B35]",
    itinText: "text-[#FFFFFF]",
    photoColSpan: "col-span-6",
    whyColSpan: "col-span-6",
    weatherColSpan: "col-span-5",
    costColSpan: "col-span-4",
    tagsColSpan: "col-span-3",
    attrsColSpan: "col-span-5",
    itinColSpan: "col-span-7",
  },
  {
    // Asheville — lemon-led
    why: "bg-[#F4D03F]",
    weather: "bg-[#172447]",
    cost: "bg-[#FFFFFF]",
    tags: "bg-[#FFE5D4]",
    attrs: "bg-[#FFFFFF]",
    itin: "bg-[#172447]",
    itinText: "text-[#FFFFFF]",
    photoColSpan: "col-span-8",
    whyColSpan: "col-span-4",
    weatherColSpan: "col-span-3",
    costColSpan: "col-span-5",
    tagsColSpan: "col-span-4",
    attrsColSpan: "col-span-7",
    itinColSpan: "col-span-5",
  },
  {
    // Savannah — peach / lime led
    why: "bg-[#7FB069]",
    weather: "bg-[#172447]",
    cost: "bg-[#FFE5D4]",
    tags: "bg-[#F5F2EC]",
    attrs: "bg-[#FFFFFF]",
    itin: "bg-[#F4D03F]",
    itinText: "text-[#172447]",
    photoColSpan: "col-span-7",
    whyColSpan: "col-span-5",
    weatherColSpan: "col-span-4",
    costColSpan: "col-span-3",
    tagsColSpan: "col-span-5",
    attrsColSpan: "col-span-5",
    itinColSpan: "col-span-7",
  },
] as const;

const TAG_COLORS: Record<string, string> = {
  foodie: "bg-[#FF6B35] text-white",
  scenic: "bg-[#7FB069] text-white",
  chill: "bg-[#172447] text-white",
  cultural: "bg-[#F4D03F] text-[#172447]",
  "short flight": "bg-[#FFE5D4] text-[#172447]",
  "shoulder season": "bg-[#F4D03F] text-[#172447]",
  "small crowds": "bg-[#7FB069] text-white",
  "mountain views": "bg-[#7FB069] text-white",
  walkable: "bg-[#FF6B35] text-white",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? "bg-[#F5F2EC] text-[#172447]";
}

export default function BentoCitrusPage() {
  return (
    <main
      className="min-h-screen bg-[#F5F2EC]"
      style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif" }}
    >
      {/* Back link */}
      <div className="px-6 pt-6 sm:px-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-xl bg-[#172447] px-4 py-2 text-sm font-600 text-white transition hover:bg-[#1e2f5a]"
          style={{ fontWeight: 600 }}
        >
          <span aria-hidden>&#8592;</span>
          <span>all directions</span>
        </Link>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8 sm:px-10">
        {/* ── Hero bento ── */}
        <HeroBento trip={TRIP} />

        {/* ── Pick bentos ── */}
        <div className="mt-12 flex flex-col gap-12">
          {PICKS.map((pick, i) => (
            <PickBento key={pick.slug} pick={pick} scheme={PICK_SCHEMES[i]} index={i} />
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-14 rounded-2xl bg-[#F5F2EC] border border-[#172447]/10 px-6 py-4 text-center">
          <p
            className="text-xs text-[#172447]/50 tracking-widest uppercase"
            style={{ fontWeight: 500 }}
          >
            MOCK COMPOSITION &middot; LIVE DATA NOT WIRED
          </p>
        </footer>
      </div>
    </main>
  );
}

function HeroBento({ trip }: { trip: GalleryTrip }) {
  return (
    <section>
      <div className="grid grid-cols-12 gap-3">
        {/* Big headline tile — 8 cols, 2 rows */}
        <div className="col-span-12 row-span-2 rounded-3xl bg-[#172447] p-8 sm:col-span-8">
          <p
            className="text-xs uppercase tracking-[0.22em] text-[#7FB069]"
            style={{ fontWeight: 700 }}
          >
            Trip plan
          </p>
          <h1
            className="mt-4 text-4xl leading-[1.05] text-white sm:text-5xl"
            style={{ fontWeight: 800 }}
          >
            Where you&apos;ll wander
            <br />
            <span className="text-[#F4D03F]">Sept 12&ndash;16</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-white/60" style={{ fontWeight: 400 }}>
            Four hand-curated U.S. destinations from {trip.origin} &mdash; one shortlist, zero
            crowds.
          </p>
        </div>

        {/* Orange budget tile — 4 cols */}
        <div className="col-span-12 rounded-3xl bg-[#FF6B35] p-6 sm:col-span-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70" style={{ fontWeight: 700 }}>
            FALL &middot; {trip.tripLengthDays} DAYS
          </p>
          <p
            className="mt-2 font-[tabular-nums] text-5xl leading-none text-white"
            style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
          >
            $1k&ndash;$2k
          </p>
          <p className="mt-2 text-sm text-white/70" style={{ fontWeight: 500 }}>
            total budget band
          </p>
        </div>

        {/* Lemon vibes tile — 4 cols */}
        <div className="col-span-6 rounded-3xl bg-[#F4D03F] p-5 sm:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#172447]/60" style={{ fontWeight: 700 }}>
            vibes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {trip.vibes.map((v) => (
              <span
                key={v}
                className="rounded-full bg-[#172447] px-3 py-1 text-xs text-white"
                style={{ fontWeight: 600 }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Lime "from" tile — 4 cols */}
        <div className="col-span-6 rounded-3xl bg-[#7FB069] p-5 sm:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70" style={{ fontWeight: 700 }}>
            from
          </p>
          <p
            className="mt-2 text-5xl leading-none text-[#172447]"
            style={{ fontWeight: 800 }}
          >
            {trip.originCode}
          </p>
        </div>

        {/* White pace tile — 4 cols */}
        <div className="col-span-12 rounded-3xl bg-white p-5 sm:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#172447]/50" style={{ fontWeight: 700 }}>
            pace
          </p>
          <p className="mt-2 text-2xl text-[#172447]" style={{ fontWeight: 700 }}>
            {trip.pace}
          </p>
          <p className="mt-1 text-xs text-[#172447]/50" style={{ fontWeight: 500 }}>
            shoulder season &middot; {trip.seasonHint}
          </p>
        </div>
      </div>
    </section>
  );
}

type Scheme = (typeof PICK_SCHEMES)[number];

function PickBento({
  pick,
  scheme,
  index,
}: {
  pick: GalleryPick;
  scheme: Scheme;
  index: number;
}) {
  const rankLabel = RANK_LABELS[index];

  return (
    <article>
      {/* Section label */}
      <div className="mb-3 flex items-center gap-3">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#172447] text-xs text-white"
          style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
        >
          {rankLabel}
        </span>
        <span className="text-lg text-[#172447]" style={{ fontWeight: 700 }}>
          {pick.name}
        </span>
        <span className="text-sm text-[#172447]/50" style={{ fontWeight: 500 }}>
          {pick.region}
        </span>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* ── Row 1: hero photo + why tile ── */}

        {/* Hero photo */}
        <div
          className={`${scheme.photoColSpan} relative row-span-2 min-h-[300px] overflow-hidden rounded-3xl`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name} landscape`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172447] via-[#172447]/30 to-transparent" />
          {/* Rank chip */}
          <div className="absolute left-4 top-4">
            <span
              className="inline-flex items-center rounded-full bg-[#FF6B35] px-3 py-1 text-xs text-white"
              style={{ fontWeight: 800 }}
            >
              {rankLabel}
            </span>
          </div>
          {/* Destination name */}
          <div className="absolute bottom-0 left-0 p-5">
            <p
              className="text-3xl leading-tight text-white"
              style={{ fontWeight: 800 }}
            >
              {pick.name}
            </p>
            <p className="mt-0.5 text-sm text-white/70" style={{ fontWeight: 500 }}>
              {pick.state}
            </p>
          </div>
        </div>

        {/* Why tile */}
        <div
          className={`${scheme.whyColSpan} rounded-3xl p-5 ${scheme.why}`}
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-white/70"
            style={{ fontWeight: 700 }}
          >
            WHY
          </p>
          <p
            className="mt-2 text-sm leading-relaxed text-white"
            style={{ fontWeight: 400 }}
          >
            {pick.reasoning}
          </p>
        </div>

        {/* ── Row 2 continuation: weather + cost + tags ── */}

        {/* Weather tile */}
        <div
          className={`${scheme.weatherColSpan} rounded-3xl p-5 ${scheme.weather}`}
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-white/60"
            style={{ fontWeight: 700 }}
          >
            FORECAST
          </p>
          <p
            className="mt-2 font-[tabular-nums] text-4xl text-white"
            style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
          >
            {pick.weather.highF}&deg;
          </p>
          <p
            className="text-lg text-white/50"
            style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
          >
            {pick.weather.lowF}&deg; low
          </p>
          <p className="mt-2 text-xs text-white/60" style={{ fontWeight: 400 }}>
            {pick.weather.summary}
          </p>
        </div>

        {/* Cost tile */}
        <div
          className={`${scheme.costColSpan} rounded-3xl p-5 ${scheme.cost}`}
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-[#172447]/60"
            style={{ fontWeight: 700 }}
          >
            BUDGET
          </p>
          <p
            className="mt-2 font-[tabular-nums] text-3xl text-[#FF6B35]"
            style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
          >
            {formatMoney(pick.cost.totalUsd)}
          </p>
          <div className="mt-3 space-y-1 text-xs text-[#172447]/60" style={{ fontWeight: 500 }}>
            <div className="flex justify-between">
              <span>Flight</span>
              <span
                className="tabular-nums text-[#172447]"
                style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
              >
                {formatMoney(pick.cost.flightUsd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Lodging</span>
              <span
                className="tabular-nums text-[#172447]"
                style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
              >
                {formatMoney(pick.cost.lodgingUsd)}
              </span>
            </div>
          </div>
        </div>

        {/* Tags tile */}
        <div
          className={`${scheme.tagsColSpan} rounded-3xl p-5 ${scheme.tags}`}
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-[#172447]/60"
            style={{ fontWeight: 700 }}
          >
            MATCHES
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pick.matchTags.map((t) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-1 text-[11px] ${tagColor(t)}`}
                style={{ fontWeight: 600 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Row 3: attractions + itinerary ── */}

        {/* Attractions tile */}
        <div
          className={`${scheme.attrsColSpan} rounded-3xl p-5 ${scheme.attrs}`}
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-[#172447]/60"
            style={{ fontWeight: 700 }}
          >
            POINTS
          </p>
          <ul className="mt-3 space-y-2">
            {pick.attractions.slice(0, 3).map((a) => (
              <li key={a.name} className="flex flex-col">
                <span className="text-sm text-[#172447]" style={{ fontWeight: 700 }}>
                  {a.name}
                </span>
                <span className="text-xs text-[#172447]/60" style={{ fontWeight: 400 }}>
                  {a.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Itinerary tile */}
        <div
          className={`${scheme.itinColSpan} rounded-3xl p-5 ${scheme.itin}`}
        >
          <p
            className={`text-[11px] uppercase tracking-[0.22em] ${scheme.itinText} opacity-60`}
            style={{ fontWeight: 700 }}
          >
            ITINERARY
          </p>
          <p
            className={`mt-1 font-[tabular-nums] text-4xl ${scheme.itinText}`}
            style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
          >
            {pick.itinerary.length} DAYS
          </p>
          <ol className="mt-3 space-y-2">
            {pick.itinerary.map((d) => (
              <li key={d.day} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/20 text-[10px] ${scheme.itinText}`}
                  style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                >
                  {d.day}
                </span>
                <span>
                  <span
                    className={`text-xs ${scheme.itinText}`}
                    style={{ fontWeight: 700 }}
                  >
                    {d.title}
                  </span>
                  <span
                    className={`block text-[11px] ${scheme.itinText} opacity-60`}
                    style={{ fontWeight: 400 }}
                  >
                    {d.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
