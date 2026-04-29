import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// ── Typography foundations ─────────────────────────────────────────────────
const displaySerif = {
  fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
  fontFeatureSettings: "'liga' 1, 'kern' 1, 'onum' 1",
};

const bodySerif = {
  fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDateRange(trip: GalleryTrip): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  const year = new Date(trip.returnOn).getFullYear();
  return `${fmt(trip.departOn)} – ${fmt(trip.returnOn)}, ${year}`;
}

function rankLabel(n: number): string {
  return String(n).padStart(2, "0");
}

// ── Hairline rule ──────────────────────────────────────────────────────────
function Rule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px bg-[#0B3954] ${className}`}
    />
  );
}

// ── Kicker label ──────────────────────────────────────────────────────────
function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-[0.34em] ${
        light ? "text-[#EAD7B7]/80" : "text-[#0B3954]/60"
      }`}
    >
      {children}
    </span>
  );
}

// ── Latitude-style metadata strip ─────────────────────────────────────────
function MetaStrip({ trip }: { trip: GalleryTrip }) {
  const items = [
    { label: "Origin", value: `${trip.origin} (${trip.originCode})` },
    { label: "Dates", value: formatDateRange(trip) },
    { label: "Pace", value: trip.pace },
    { label: "Budget", value: trip.budgetBand },
    { label: "Vibes", value: trip.vibes.join(", ") },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`py-4 pr-6 ${i > 0 ? "sm:border-l border-[#0B3954]/20 sm:pl-6" : ""} ${
            i < items.length - 1 ? "border-b sm:border-b-0 border-[#0B3954]/20" : ""
          }`}
        >
          <div className="text-[9px] uppercase tracking-[0.38em] text-[#0B3954]/50 mb-1">
            {item.label}
          </div>
          <div
            className="text-[13px] text-[#0B3954] tabular-nums"
            style={bodySerif}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tide-line divider ─────────────────────────────────────────────────────
function TideDivider() {
  return (
    <div aria-hidden className="w-full flex items-center gap-0 overflow-hidden" style={{ height: "12px" }}>
      {/* A simple wave-like chart rule: alternating thin/thicker marks */}
      <div className="flex-1 h-px bg-[#0B3954]/20" />
      <div className="mx-4 flex items-center gap-[3px]">
        {[3, 6, 4, 8, 5, 7, 4, 6, 3].map((h, i) => (
          <div
            key={i}
            className="bg-[#0B3954]/30"
            style={{ width: "1px", height: `${h}px` }}
          />
        ))}
      </div>
      <div className="flex-1 h-px bg-[#0B3954]/20" />
    </div>
  );
}

// ── Match tag pill ────────────────────────────────────────────────────────
function MatchTag({
  tag,
  variant = "teal",
}: {
  tag: string;
  variant?: "teal" | "coral";
}) {
  return (
    <span
      className={`inline-block px-3 py-1 text-[9px] uppercase tracking-[0.3em] border ${
        variant === "coral"
          ? "border-[#E76F51] text-[#E76F51]"
          : "border-[#0B3954]/40 text-[#0B3954]/70"
      }`}
    >
      {tag}
    </span>
  );
}

// ── Cost table ────────────────────────────────────────────────────────────
function CostTable({ pick }: { pick: GalleryPick }) {
  const rows = [
    { label: "Flight", value: pick.cost.flightUsd },
    { label: "Lodging (4 nights)", value: pick.cost.lodgingUsd },
    {
      label: "Meals + activities est.",
      value: pick.cost.totalUsd - pick.cost.flightUsd - pick.cost.lodgingUsd,
    },
    { label: "Estimated total", value: pick.cost.totalUsd, total: true },
  ];
  return (
    <div className="w-full text-[12px] text-[#0B3954]" style={bodySerif}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex justify-between py-2 ${
            i > 0 ? "border-t border-[#0B3954]/15" : ""
          } ${row.total ? "font-semibold" : ""}`}
        >
          <span
            className={`text-[9px] uppercase tracking-[0.28em] ${
              row.total ? "text-[#0B3954]" : "text-[#0B3954]/60"
            }`}
          >
            {row.label}
          </span>
          <span className="tabular-nums">${row.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Weather strip ────────────────────────────────────────────────────────
function WeatherStrip({ pick }: { pick: GalleryPick }) {
  return (
    <div className="flex items-baseline gap-6 text-[#0B3954]" style={bodySerif}>
      <div>
        <div className="text-[9px] uppercase tracking-[0.34em] text-[#0B3954]/50 mb-1">
          High
        </div>
        <div className="text-[22px] tabular-nums leading-none">{pick.weather.highF}°</div>
      </div>
      <div className="h-8 w-px bg-[#0B3954]/20" />
      <div>
        <div className="text-[9px] uppercase tracking-[0.34em] text-[#0B3954]/50 mb-1">
          Low
        </div>
        <div className="text-[22px] tabular-nums leading-none">{pick.weather.lowF}°</div>
      </div>
      <div className="h-8 w-px bg-[#0B3954]/20" />
      <div className="flex-1">
        <div className="text-[9px] uppercase tracking-[0.34em] text-[#0B3954]/50 mb-1">
          Conditions
        </div>
        <div className="text-[12px] leading-snug">{pick.weather.summary}</div>
      </div>
    </div>
  );
}

// ── Magazine sidebar — attractions ───────────────────────────────────────
function AttractionsSidebar({ pick }: { pick: GalleryPick }) {
  return (
    <aside>
      <Kicker>Worth your time</Kicker>
      <div className="mt-3 flex flex-col">
        {pick.attractions.map((a, i) => (
          <div
            key={a.name}
            className={`py-4 ${i > 0 ? "border-t border-[#0B3954]/15" : ""}`}
          >
            <div
              className="text-[13px] text-[#0B3954] mb-1 leading-snug"
              style={displaySerif}
            >
              {a.name}
            </div>
            <p className="text-[11.5px] leading-[1.65] text-[#0B3954]/60" style={bodySerif}>
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── Itinerary list ───────────────────────────────────────────────────────
function ItineraryList({ pick }: { pick: GalleryPick }) {
  return (
    <div>
      <Kicker>Day by day</Kicker>
      <ol className="mt-3">
        {pick.itinerary.map((day, idx) => (
          <li
            key={day.day}
            className={`grid grid-cols-[48px_1fr] gap-4 py-5 ${
              idx > 0 ? "border-t border-[#0B3954]/15" : ""
            }`}
          >
            <div
              className="text-[32px] leading-none text-[#E76F51] tabular-nums pt-0.5"
              style={displaySerif}
            >
              {rankLabel(day.day)}
            </div>
            <div>
              <div
                className="text-[15px] text-[#0B3954] leading-tight mb-1.5"
                style={displaySerif}
              >
                {day.title}
              </div>
              <p className="text-[12px] leading-[1.7] text-[#0B3954]/65" style={bodySerif}>
                {day.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Pick — full spread layout ─────────────────────────────────────────────
function PickSpread({ pick }: { pick: GalleryPick }) {
  const rank = rankLabel(pick.rank);

  return (
    <article className="mb-0">
      {/* Rank numeral + name row */}
      <div className="flex items-start justify-between gap-8 pt-16 pb-10">
        <div className="flex items-start gap-6">
          {/* Giant rank numeral */}
          <span
            className="text-[96px] leading-[0.85] text-[#E76F51] tabular-nums select-none flex-shrink-0"
            style={displaySerif}
            aria-hidden
          >
            {rank}
          </span>
          <div className="pt-2">
            <Kicker>{pick.region}</Kicker>
            <h2
              className="mt-1 text-[52px] sm:text-[64px] leading-[0.95] text-[#0B3954] tracking-[-0.01em]"
              style={displaySerif}
            >
              {pick.name}
            </h2>
          </div>
        </div>
        {/* Match tags — top-right */}
        <div className="hidden lg:flex flex-wrap gap-2 justify-end pt-4 max-w-[280px]">
          {pick.matchTags.slice(0, 3).map((tag, i) => (
            <MatchTag key={tag} tag={tag} variant={i === 0 ? "coral" : "teal"} />
          ))}
        </div>
      </div>

      {/* Asymmetric two-column: hero photo left, blurb + reasoning right */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0">
        {/* Hero — full bleed column */}
        <div className="relative overflow-hidden" style={{ minHeight: "440px" }}>
          <img
            src={pick.heroPhotoUrl}
            alt={pick.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Caption strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0B3954]/85 px-6 py-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#EAD7B7]/80">
              {pick.name} — {pick.region}
            </p>
          </div>
        </div>

        {/* Right column — editorial copy */}
        <div className="bg-[#F1EAD8] p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <Kicker>About this place</Kicker>
            <p
              className="mt-4 text-[18px] leading-[1.65] text-[#0B3954]"
              style={displaySerif}
            >
              {pick.blurb}
            </p>

            <div className="mt-8">
              <Rule />
              <div className="mt-6 bg-[#EAD7B7] px-5 py-5">
                <Kicker>Why we picked it</Kicker>
                <p
                  className="mt-3 text-[13.5px] leading-[1.7] text-[#0B3954]/80"
                  style={bodySerif}
                >
                  {pick.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile match tags */}
          <div className="flex flex-wrap gap-2 mt-8 lg:hidden">
            {pick.matchTags.map((tag, i) => (
              <MatchTag key={tag} tag={tag} variant={i === 0 ? "coral" : "teal"} />
            ))}
          </div>

          {/* Weather */}
          <div className="mt-8">
            <Rule />
            <div className="mt-4">
              <Kicker>September weather</Kicker>
              <div className="mt-3">
                <WeatherStrip pick={pick} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower section — cost / attractions / itinerary in 3 columns */}
      <div className="bg-[#EAD7B7] grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#0B3954]/15">
        {/* Cost */}
        <div className="p-8 lg:p-10">
          <Kicker>Estimated cost</Kicker>
          <div className="mt-4">
            <CostTable pick={pick} />
          </div>
        </div>
        {/* Attractions */}
        <div className="p-8 lg:p-10">
          <AttractionsSidebar pick={pick} />
        </div>
        {/* Itinerary */}
        <div className="p-8 lg:p-10">
          <ItineraryList pick={pick} />
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function V16CoastalDeepPage() {
  const sortedPicks = [...PICKS].sort((a, b) => a.rank - b.rank);

  return (
    <main
      className="min-h-screen bg-[#F8F4EB] text-[#0B3954] antialiased"
      style={bodySerif}
    >
      {/* ── Back link ── */}
      <div className="px-8 sm:px-12 lg:px-16 pt-8">
        <Link
          href="/gallery"
          className="text-[10px] uppercase tracking-[0.34em] text-[#0B3954]/60 hover:text-[#0B3954] transition-colors"
        >
          ← All directions
        </Link>
      </div>

      {/* ── Masthead ── */}
      <header className="px-8 sm:px-12 lg:px-16 pt-12 pb-0 max-w-6xl">
        {/* Publication line */}
        <div className="flex items-center gap-5 mb-10">
          <Kicker>Trip Planner</Kicker>
          <div className="h-px flex-1 bg-[#0B3954]/20" />
          <Kicker>Vol. 2026</Kicker>
        </div>

        <Rule />

        <div className="mt-8">
          {/* Kicker above display headline */}
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#0B3954]/50 mb-4">
            Four recommendations for
          </div>
          <h1
            className="text-[60px] sm:text-[80px] lg:text-[100px] leading-[0.92] tracking-[-0.02em] text-[#0B3954]"
            style={displaySerif}
          >
            Four ways to spend
            <br />
            <span className="italic text-[#E76F51]">Sept 12–16.</span>
          </h1>
        </div>

        {/* Metadata strip */}
        <div className="mt-10">
          <Rule />
          <div className="mt-0">
            <MetaStrip trip={TRIP} />
          </div>
          <Rule />
        </div>
      </header>

      {/* ── Intro note ── */}
      <div className="px-8 sm:px-12 lg:px-16 mt-12 max-w-2xl">
        <p
          className="text-[18px] leading-[1.7] text-[#0B3954]/75 italic"
          style={displaySerif}
        >
          A curated shortlist, each destination ranked for your blend of{" "}
          {TRIP.vibes.join(", ")} — all within reach of {TRIP.origin} on a{" "}
          {TRIP.budgetBand} budget.
        </p>
      </div>

      {/* ── Picks ── */}
      <div className="px-8 sm:px-12 lg:px-16 mt-4 max-w-6xl">
        {sortedPicks.map((pick, idx) => (
          <div key={pick.slug}>
            <PickSpread pick={pick} />
            {idx < sortedPicks.length - 1 && (
              <div className="my-0 py-10">
                <TideDivider />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-[#0B3954]/20 bg-[#0B3954]">
        <div className="px-8 sm:px-12 lg:px-16 py-10 max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/gallery"
            className="text-[10px] uppercase tracking-[0.34em] text-[#EAD7B7]/70 hover:text-[#EAD7B7] transition-colors"
          >
            ← All directions
          </Link>
          <p
            className="text-[11px] text-[#EAD7B7]/40 tracking-[0.06em]"
            style={bodySerif}
          >
            Mock layout — actual recommendations are AI-generated.
          </p>
          <div className="text-[10px] uppercase tracking-[0.34em] text-[#EAD7B7]/40">
            Coastal Deep · v16
          </div>
        </div>
      </footer>
    </main>
  );
}
