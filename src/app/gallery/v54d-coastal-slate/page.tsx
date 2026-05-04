import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney, miscSpend, rankLabel } from "../_helpers";
import { DM_Sans, Manrope } from "next/font/google";
import { feature } from "topojson-client";
import { geoAlbersUsa, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import statesTopoRaw from "us-atlas/states-10m.json";

// ─── Real US geography (build-time projection of state silhouettes) ─────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATES_FC = feature(statesTopoRaw as any, (statesTopoRaw as any).objects.states) as unknown as FeatureCollection;

const NYC_LL: [number, number] = [-74.006, 40.7128];
const PICK_LL: Record<string, [number, number]> = {
  "charleston-sc": [-79.9311, 32.7765],
  "acadia-np": [-68.2733, 44.3386],
  "asheville-nc": [-82.5515, 35.5951],
  "savannah-ga": [-81.0998, 32.0809],
};

// Per-pick chapter colors tuned to the coastal slate palette.
const PICK_HUE: Record<string, string> = {
  "charleston-sc": "#E76F51",  // coral
  "acadia-np": "#2C5474",      // slate-blue
  "asheville-nc": "#84A98C",   // soft sage
  "savannah-ga": "#C0875F",    // warm sand
};

function buildAtlas(width: number, height: number) {
  const projection = geoAlbersUsa().fitSize([width, height], STATES_FC);
  const pathGen = geoPath(projection);
  const statePaths = STATES_FC.features
    .map((f) => ({ id: String(f.id ?? Math.random()), d: pathGen(f) ?? "" }))
    .filter((s) => s.d.length > 0);
  const nyc = (projection(NYC_LL) as [number, number] | null) ?? [0, 0];
  const picks: Record<string, [number, number]> = {};
  for (const [slug, ll] of Object.entries(PICK_LL)) {
    picks[slug] = (projection(ll) as [number, number] | null) ?? [0, 0];
  }
  return { width, height, statePaths, nyc, picks };
}

const HERO_ATLAS = buildAtlas(720, 440);

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = { title: "v54d Coastal Slate — Trip Planner" };

// ─── Decorative SVG blobs ──────────────────────────────────────────────────

function BlobTerracotta() {
  return (
    <svg
      className="absolute top-0 right-0 w-[520px] pointer-events-none"
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M380 55 C450 100 490 185 470 280 C450 375 350 430 250 410 C150 390 70 310 85 210 C100 110 190 35 290 25 C335 18 355 35 380 55Z"
        fill="#2C5474"
        opacity="0.12"
      />
    </svg>
  );
}

// ─── Real US atlas, styled in the coastal slate palette ─────────────
function WellnessAtlas() {
  const { width, height, statePaths, nyc, picks } = HERO_ATLAS;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="US map showing trip routes from NYC to four destinations"
      style={{ width: "100%", height: "auto" }}
    >
      {/* State silhouettes — soft slate fill, slate hairline border */}
      <g>
        {statePaths.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="#E8EDF2"
            stroke="rgba(44,84,116,0.22)"
            strokeWidth={0.55}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Soft route lines from NYC to each pick */}
      {PICKS.map((pick) => {
        const coord = picks[pick.slug];
        const color = PICK_HUE[pick.slug] ?? "#2C5474";
        if (!coord) return null;
        return (
          <line
            key={pick.slug}
            x1={nyc[0]} y1={nyc[1]}
            x2={coord[0]} y2={coord[1]}
            stroke={color}
            strokeWidth={1.6}
            strokeOpacity={0.7}
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
        );
      })}

      {/* Pick destinations */}
      {PICKS.map((pick) => {
        const coord = picks[pick.slug];
        const color = PICK_HUE[pick.slug] ?? "#2C5474";
        if (!coord) return null;
        const [x, y] = coord;
        const labelOffset = x > nyc[0] ? 14 : -14;
        const anchor = x > nyc[0] ? "start" : "end";
        return (
          <g key={pick.slug}>
            <circle cx={x} cy={y} r={9} fill="#F4F6F8" stroke={color} strokeWidth={2.5} />
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text
              x={x + labelOffset}
              y={y + 4.5}
              textAnchor={anchor}
              fontSize={11}
              fill="#1F2937"
              fontFamily="var(--font-display)"
              fontWeight={500}
            >
              {pick.name}
            </text>
            <text
              x={x + labelOffset}
              y={y + 18}
              textAnchor={anchor}
              fontSize={9}
              fill="#4B5563"
              fontFamily="var(--font-body)"
              letterSpacing="0.10em"
              style={{ textTransform: "uppercase" }}
            >
              {pick.state}
            </text>
          </g>
        );
      })}

      {/* NYC origin — with concentric rings for emphasis */}
      <circle cx={nyc[0]} cy={nyc[1]} r={14} fill="rgba(44,84,116,0.10)" />
      <circle cx={nyc[0]} cy={nyc[1]} r={9} fill="rgba(44,84,116,0.18)" />
      <circle cx={nyc[0]} cy={nyc[1]} r={5} fill="#2C5474" />
      <text
        x={nyc[0] + 14}
        y={nyc[1] - 6}
        textAnchor="start"
        fontSize={11}
        fill="#1F2937"
        fontFamily="var(--font-display)"
        fontWeight={600}
      >
        New York City
      </text>
      <text
        x={nyc[0] + 14}
        y={nyc[1] + 8}
        textAnchor="start"
        fontSize={9}
        fill="#4B5563"
        fontFamily="var(--font-body)"
        letterSpacing="0.10em"
        style={{ textTransform: "uppercase" }}
      >
        Origin · NYC
      </text>
    </svg>
  );
}

function BlobSunYellow() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-[420px] pointer-events-none"
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M70 340 C25 295 -15 205 18 130 C52 55 145 18 225 42 C305 65 355 158 330 245 C305 332 215 385 145 375 C112 370 90 362 70 340Z"
        fill="#E76F51"
        opacity="0.10"
      />
    </svg>
  );
}

function LeafDot({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "inline-block w-1.5 h-1.5 rounded-full bg-[#2C5474]"}
      aria-hidden="true"
    />
  );
}

function FloatingAccentDot({ className }: { className?: string }) {
  return (
    <div
      className={className ?? "absolute w-4 h-4 rounded-full bg-[#E76F51]"}
      aria-hidden="true"
    />
  );
}

// ─── Pick editorial block ──────────────────────────────────────────────────

function PickBlock({ pick, index }: { pick: GalleryPick; index: number }) {
  const isEven = index % 2 === 0;

  const pullQuoteRaw = pick.reasoning;
  const maxLen = 160;
  const pullQuote =
    pullQuoteRaw.length > maxLen
      ? pullQuoteRaw.slice(0, maxLen) + "…"
      : pullQuoteRaw;

  const imageCol = (
    <div className="col-span-12 lg:col-span-7 relative">
      <div className="relative">
        <img
          src={pick.heroPhotoUrl}
          alt={pick.name}
          className="w-full rounded-[3rem] object-cover aspect-[4/5]"
        />
        {/* Floating coral accent dot */}
        <FloatingAccentDot
          className={`absolute w-5 h-5 rounded-full bg-[#E76F51] shadow-lg ${isEven ? "bottom-8 right-8" : "bottom-8 left-8"}`}
        />
        {/* Organic accent mark at top corner */}
        <div
          className={`absolute top-6 ${isEven ? "left-6" : "right-6"}`}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="14" rx="13" ry="9" fill="rgba(44,84,116,0.15)" transform="rotate(-25 14 14)" />
            <ellipse cx="14" cy="14" rx="7" ry="5" fill="rgba(44,84,116,0.18)" transform="rotate(-25 14 14)" />
          </svg>
        </div>
      </div>
      <p
        className="mt-4 text-sm text-center"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#6B7280" }}
      >
        Photographed in {pick.region}.
      </p>
    </div>
  );

  const contentCol = (
    <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 justify-center">
      {/* Chapter label */}
      <p
        className="text-xs tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
      >
        Chapter {pick.rank.toString().padStart(2, "0")} · {pick.state}
      </p>

      {/* Destination name */}
      <h2
        className="text-5xl md:text-6xl font-light tracking-tight leading-[1]"
        style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
      >
        <em>{pick.name.split(" ")[0]}</em>
        {pick.name.split(" ").length > 1 ? " " + pick.name.split(" ").slice(1).join(" ") : ""}
      </h2>

      {/* Region */}
      <p
        className="text-2xl"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#4B5563" }}
      >
        {pick.region}
      </p>

      {/* Blurb */}
      <p
        className="text-base leading-[1.7] max-w-md"
        style={{ fontFamily: "var(--font-body)", color: "#1F2937" }}
      >
        {pick.blurb}
      </p>

      {/* Pull-quote card */}
      <div className="bg-[#E8EDF2] rounded-3xl p-8 border-l-4 border-[#2C5474]">
        <p
          className="text-xl"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
        >
          <span className="text-[#2C5474] mr-2" aria-hidden="true">❦</span>
          {pullQuote}
        </p>
      </div>

      {/* At-a-glance specs 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* WEATHER */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_-8px_rgba(31,41,55,0.08)]">
          <p
            className="text-xs tracking-[0.14em] uppercase mb-1"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Weather
          </p>
          <p
            className="text-lg font-medium tabular-nums leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            {pick.weather.highF}°/{pick.weather.lowF}°F
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
          >
            {pick.weather.summary}
          </p>
        </div>
        {/* BUDGET */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_-8px_rgba(31,41,55,0.08)]">
          <p
            className="text-xs tracking-[0.14em] uppercase mb-1"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Budget
          </p>
          <p
            className="text-lg font-medium tabular-nums leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            {formatMoney(pick.cost.totalUsd)}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
          >
            total est.
          </p>
        </div>
        {/* FLIGHT */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_-8px_rgba(31,41,55,0.08)]">
          <p
            className="text-xs tracking-[0.14em] uppercase mb-1"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Flight
          </p>
          <p
            className="text-lg font-medium tabular-nums leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            {formatMoney(pick.cost.flightUsd)}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
          >
            round-trip est.
          </p>
        </div>
        {/* LODGING */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_-8px_rgba(31,41,55,0.08)]">
          <p
            className="text-xs tracking-[0.14em] uppercase mb-1"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Lodging
          </p>
          <p
            className="text-lg font-medium tabular-nums leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            {formatMoney(pick.cost.lodgingUsd)}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
          >
            4 nights est.
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {pick.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#E8EDF2] text-[#2C5474] border border-[#CBD5E1] px-3 py-1 text-sm font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Discreet CTA link */}
      <a
        href="#"
        className="text-[#2C5474] transition-opacity hover:opacity-70"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem" }}
      >
        Wander to {pick.name} →
      </a>
    </div>
  );

  return (
    <article className="mt-32">
      {/* 12-col alternating grid */}
      <div className="grid grid-cols-12 gap-12 items-center">
        {isEven ? (
          <>
            {imageCol}
            {contentCol}
          </>
        ) : (
          <>
            {contentCol}
            {imageCol}
          </>
        )}
      </div>

      {/* WHAT YOU'LL SEE */}
      <div className="mt-20">
        <p
          className="text-xs tracking-[0.18em] uppercase mb-6"
          style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
        >
          What You&#39;ll See
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pick.attractions.map((attr, i) => (
            <div
              key={attr.name}
              className="rounded-3xl bg-white shadow-[0_20px_40px_-20px_rgba(31,41,55,0.1)] p-6"
            >
              <div
                className="text-[#2C5474] mb-3 text-2xl tabular-nums"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                aria-hidden="true"
              >
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <h4
                className="text-lg font-medium mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {attr.name}
              </h4>
              <p
                className="text-sm leading-[1.6]"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {attr.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* THE FOUR DAYS */}
      <div className="mt-20">
        <p
          className="text-xs tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
        >
          The Four Days
        </p>
        <h3
          className="text-3xl font-light mb-10"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
        >
          Day by day in {pick.name}.
        </h3>
        <div className="space-y-0">
          {pick.itinerary.map((day, di) => (
            <div key={day.day}>
              <div className="flex gap-6 items-start py-8">
                {/* Slate-blue circle avatar */}
                <div
                  className="shrink-0 w-12 h-12 rounded-full bg-[#2C5474] text-white flex items-center justify-center tabular-nums shadow-[0_10px_20px_-8px_rgba(44,84,116,0.4)]"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem" }}
                >
                  {day.day}
                </div>
                <div className="flex-1 pt-1 ml-4">
                  <p
                    className="text-xl mb-2"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
                  >
                    {day.title}
                  </p>
                  <p
                    className="text-base leading-[1.7]"
                    style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
                  >
                    {day.description}
                  </p>
                </div>
              </div>
              {di < pick.itinerary.length - 1 && (
                <div className="border-t border-[#CBD5E1] ml-16" />
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Page() {
  const trip = TRIP;
  const picks = PICKS;

  return (
    <main
      className={`${dmSans.variable} ${manrope.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#F4F6F8", color: "#1F2937" }}
    >
      {/* ── Inline keyframe styles ── */}
      <style>{`
        @keyframes fadeUpV54 {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .v54-fade-1 { animation: fadeUpV54 0.7s ease both 0.1s; }
          .v54-fade-2 { animation: fadeUpV54 0.7s ease both 0.2s; }
          .v54-fade-3 { animation: fadeUpV54 0.7s ease both 0.3s; }
          .v54-fade-4 { animation: fadeUpV54 0.7s ease both 0.4s; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(44,84,116,0.12), transparent 55%), radial-gradient(circle at 85% 75%, rgba(231,111,81,0.10), transparent 55%), linear-gradient(180deg,#F4F6F8 0%,#E8EDF2 100%)",
        }}
      >
        {/* Organic SVG blobs */}
        <BlobTerracotta />
        <BlobSunYellow />

        {/* Nav row */}
        <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-8 pt-8">
          <span
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
          >
            Wander
          </span>
          <div className="flex gap-2">
            {(["stories", "trips", "journal"] as const).map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-sm"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero center block */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-32 text-center">
          {/* Tiny kicker */}
          <div className="v54-fade-1 flex items-center justify-center gap-2 mb-8">
            <LeafDot className="inline-block w-1.5 h-1.5 rounded-full bg-[#2C5474]" />
            <p
              className="text-xs tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
            >
              ❦ Journal · {formatDateRange(trip)}
            </p>
          </div>

          {/* Massive headline */}
          <h1
            className="v54-fade-2 text-7xl md:text-8xl font-light tracking-tight leading-[0.95] mb-8"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            A <em>coastal</em> autumn for four.
          </h1>

          {/* Italic dek */}
          <p
            className="v54-fade-3 text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#4B5563" }}
          >
            We traced the slower South and the crispening Northeast, four corners
            each with their own warmth. September holds its color long enough — if
            you leave {trip.origin} before the light shifts.
          </p>

          {/* Above-fold CTA */}
          <div className="v54-fade-4 flex flex-col items-center gap-4">
            <a
              href="#picks"
              className="bg-[#E76F51] hover:bg-[#C75B43] text-white shadow-[0_20px_40px_-12px_rgba(231,111,81,0.35)] rounded-full px-10 py-5 font-medium transition-colors inline-block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Begin the journal →
            </a>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#6B7280" }}
            >
              For travelers who&#39;d rather wander than rush.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRIP FACTS PANEL
      ══════════════════════════════════════════════════════ */}
      <div className="px-8">
        <div className="bg-[#E8EDF2] rounded-[3rem] p-12 max-w-5xl mx-auto -mt-16 relative shadow-[0_30px_60px_-30px_rgba(31,41,55,0.18)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* ORIGIN */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <LeafDot />
                <p
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
                >
                  Origin
                </p>
              </div>
              <p
                className="text-2xl font-light"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {trip.origin}
              </p>
              <p
                className="text-sm tabular-nums"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {trip.originCode}
              </p>
            </div>

            {/* DURATION */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <LeafDot />
                <p
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
                >
                  Duration
                </p>
              </div>
              <p
                className="text-2xl font-light tabular-nums"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {trip.tripLengthDays} days
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {trip.pace} pace
              </p>
            </div>

            {/* BUDGET */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <LeafDot />
                <p
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
                >
                  Budget
                </p>
              </div>
              <p
                className="text-2xl font-light tabular-nums"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {trip.budgetBand}
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                per person
              </p>
            </div>

            {/* VIBES */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <LeafDot />
                <p
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
                >
                  Vibes
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {trip.vibes.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-white text-[#2C5474] border border-[#CBD5E1] px-3 py-1 text-sm font-medium"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ATLAS — real US map with routes
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-8 mt-32">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LeafDot />
            <p
              className="text-xs tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
            >
              The Routes
            </p>
            <LeafDot />
          </div>
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            Four routes, drawn from New York.
          </h2>
          <p
            className="text-base max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
          >
            Each destination plotted at its real coordinates — the map is rendered from
            actual US Census state geometry, not a sketch.
          </p>
        </div>
        <div
          className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_-30px_rgba(31,41,55,0.18)]"
        >
          <WellnessAtlas />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PICKS SECTION
      ══════════════════════════════════════════════════════ */}
      <section id="picks" className="max-w-6xl mx-auto px-8 mt-32">
        {/* Section header */}
        <div className="text-center mb-24">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-4"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            The Destinations
          </p>
          <h2
            className="text-5xl md:text-6xl font-light tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
          >
            Four destinations, four coastal moods.
          </h2>
        </div>

        {/* Pick editorial blocks */}
        {picks.map((pick, i) => (
          <PickBlock key={pick.slug} pick={pick} index={i} />
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════
          CLOSING BLOCK
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-8 mt-40 mb-24">
        <div
          className="rounded-[3rem] bg-white p-16 text-center shadow-[0_30px_60px_-30px_rgba(31,41,55,0.18)] relative overflow-hidden"
        >
          {/* Coral gradient accent strip on top edge */}
          <div
            className="absolute inset-x-0 top-0 h-1.5 rounded-t-[3rem]"
            style={{ background: "linear-gradient(90deg, #2C5474, #E76F51, #1E3A5F)" }}
            aria-hidden="true"
          />

          <p
            className="text-xs tracking-[0.22em] uppercase mb-6"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Where will you go?
          </p>
          <h2
            className="text-4xl md:text-5xl font-light mb-10 tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
          >
            Choose the coast. Begin gently.
          </h2>

          {/* 4 small organic circular pick avatars */}
          <div className="flex justify-center gap-8 flex-wrap mb-14">
            {picks.map((pick) => (
              <div key={pick.slug} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#CBD5E1] shadow-[0_10px_20px_-8px_rgba(31,41,55,0.15)]">
                  <img
                    src={pick.heroPhotoUrl}
                    alt={pick.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
                >
                  {pick.name}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#picks"
            className="bg-[#E76F51] hover:bg-[#C75B43] text-white shadow-[0_20px_40px_-12px_rgba(231,111,81,0.35)] rounded-full px-10 py-5 font-medium transition-colors inline-block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Choose your chapter →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer
        className="border-t border-[#CBD5E1]"
        style={{ backgroundColor: "#F4F6F8" }}
      >
        <div className="max-w-6xl mx-auto px-8 py-12 flex items-center justify-between">
          <p
            className="text-base"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#4B5563" }}
          >
            Wander · Travel as a gentle act.
          </p>
          <p
            className="text-sm tabular-nums"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            2026
          </p>
        </div>
      </footer>
    </main>
  );
}
