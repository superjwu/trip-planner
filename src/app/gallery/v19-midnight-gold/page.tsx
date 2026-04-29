import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v19 — Midnight Gold / Boutique Luxury
// Palette: midnight navy #0E1E36, brass gold #C8A24A, ivory #F1ECE2,
// blush #D5A6A1 (≤2 uses), deep charcoal #162236.
// Design language: Aman / Soho House / The Carlyle — quiet, warm-dark luxury.

const SERIF = "'Cormorant Garamond', 'Cormorant', 'EB Garamond', Georgia, serif";
const SANS = "'Inter', 'Helvetica Neue', system-ui, sans-serif";

const ROMAN = ["I", "II", "III", "IV"] as const;

function toRoman(n: number): string {
  return ROMAN[(n - 1) % 4] ?? String(n);
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function MidnightGoldPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#0E1E36", fontFamily: SANS }}
    >
      {/* Thin top brass rule */}
      <div className="h-px w-full" style={{ backgroundColor: "#C8A24A" }} />

      <div className="mx-auto max-w-4xl px-6 pb-32 pt-10 sm:px-10 sm:pt-14">
        {/* Back link */}
        <BackLink />

        {/* Masthead */}
        <Masthead trip={TRIP} />

        {/* Brass separator */}
        <div className="mt-16 h-px w-full" style={{ backgroundColor: "#C8A24A", opacity: 0.35 }} />

        {/* Four picks */}
        <section className="mt-0">
          {PICKS.map((pick, i) => (
            <PickEntry key={pick.slug} pick={pick} index={i} />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-24 pb-2 text-center">
          <div className="h-px w-24 mx-auto mb-8" style={{ backgroundColor: "#C8A24A", opacity: 0.4 }} />
          <p
            className="text-[10px] tracking-[0.3em]"
            style={{ color: "#C8A24A", fontFamily: SANS, fontWeight: 300 }}
          >
            VISUAL STUDY · NOT WIRED TO RESERVATIONS
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─── Back Link ───────────────────────────────────────────────────────────────

function BackLink() {
  return (
    <Link
      href="/gallery"
      className="group inline-flex items-center gap-2 pb-0.5"
      style={{
        color: "#C8A24A",
        fontFamily: SANS,
        fontSize: "12px",
        fontWeight: 300,
        letterSpacing: "0.12em",
        textDecoration: "none",
        borderBottom: "1px solid transparent",
      }}
    >
      <span style={{ color: "#C8A24A" }}>&#8592;</span>
      <span
        className="border-b border-transparent transition-colors duration-200 group-hover:border-[#C8A24A]"
        style={{ paddingBottom: "1px" }}
      >
        RETURN
      </span>
    </Link>
  );
}

// ─── Masthead ────────────────────────────────────────────────────────────────

function Masthead({ trip }: { trip: GalleryTrip }) {
  const depart = formatDate(trip.departOn);
  const ret = formatDate(trip.returnOn);

  // Build date range label like "12–16 SEPTEMBER"
  const departDay = new Date(trip.departOn + "T00:00:00").getDate();
  const returnDay = new Date(trip.returnOn + "T00:00:00").getDate();
  const monthName = new Date(trip.departOn + "T00:00:00")
    .toLocaleDateString("en-US", { month: "long" })
    .toUpperCase();

  return (
    <header className="mt-14 sm:mt-20">
      {/* Eyebrow */}
      <p
        className="text-[10px] tracking-[0.28em]"
        style={{ color: "#C8A24A", fontFamily: SANS, fontWeight: 300 }}
      >
        A SHORT-LIST &nbsp;·&nbsp; {trip.origin.toUpperCase()} &nbsp;·&nbsp;{" "}
        {departDay}–{returnDay} {monthName}
      </p>

      {/* Display title */}
      <h1
        className="mt-5 leading-[1.08]"
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#F1ECE2",
          letterSpacing: "-0.01em",
        }}
      >
        Four propositions for autumn.
      </h1>

      {/* Metadata strip */}
      <div
        className="mt-8 flex flex-wrap items-center gap-x-0 gap-y-2 text-[11px] tracking-[0.15em]"
        style={{ color: "#F1ECE2", fontFamily: SANS, fontWeight: 300, opacity: 0.7 }}
      >
        <MetaDot label="FROM" value={trip.origin.toUpperCase()} />
        <BrassDot />
        <MetaDot label="DATES" value={`${depart} – ${ret}`} />
        <BrassDot />
        <MetaDot label="VIBES" value={trip.vibes.map((v) => v.toUpperCase()).join(", ")} />
        <BrassDot />
        <MetaDot label="BUDGET" value={trip.budgetBand} />
        <BrassDot />
        <MetaDot label="PACE" value={trip.pace.toUpperCase()} />
      </div>
    </header>
  );
}

function MetaDot({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span style={{ color: "#C8A24A", opacity: 0.8 }}>{label}</span>
      <span>{value}</span>
    </span>
  );
}

function BrassDot() {
  return (
    <span
      className="mx-3"
      style={{ color: "#C8A24A", opacity: 0.6, fontWeight: 400 }}
      aria-hidden
    >
      ·
    </span>
  );
}

// ─── Pick Entry ──────────────────────────────────────────────────────────────

function PickEntry({ pick, index }: { pick: GalleryPick; index: number }) {
  const numeral = toRoman(pick.rank);
  const isLast = index === 3;

  return (
    <article className="mt-20 sm:mt-28">
      {/* ── Destination header ── */}
      <div className="flex items-start gap-5 sm:gap-8">
        {/* Roman numeral */}
        <div
          className="flex-none leading-none"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "#C8A24A",
            minWidth: "2.5rem",
          }}
          aria-label={`Pick ${numeral}`}
        >
          {numeral}.
        </div>

        {/* Name + region */}
        <div className="flex-1 min-w-0">
          <h2
            className="leading-[1.05]"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
              fontWeight: 400,
              color: "#F1ECE2",
              letterSpacing: "-0.01em",
            }}
          >
            {pick.name}
          </h2>
          <p
            className="mt-2 text-[10px] tracking-[0.25em]"
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              color: "#C8A24A",
              letterSpacing: "0.25em",
            }}
          >
            {pick.region.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ── Hero photo ── */}
      <div className="mt-8 ml-[4rem] sm:ml-[5.5rem]">
        <div
          style={{
            border: "1px solid #C8A24A",
            padding: "4px",
            backgroundColor: "#162236",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name}, ${pick.region}`}
            className="block w-full object-cover"
            style={{ height: "clamp(200px, 38vw, 420px)", display: "block" }}
          />
        </div>
      </div>

      {/* ── Body content ── */}
      <div className="mt-10 ml-[4rem] sm:ml-[5.5rem] space-y-10">

        {/* Blurb */}
        <p
          className="leading-[1.85] max-w-xl"
          style={{
            fontFamily: SANS,
            fontSize: "15px",
            fontWeight: 300,
            color: "#F1ECE2",
            opacity: 0.88,
          }}
        >
          {pick.blurb}
        </p>

        {/* Reasoning — inset with brass left keyline */}
        <div
          className="pl-5 max-w-xl"
          style={{ borderLeft: "1px solid #C8A24A" }}
        >
          <p
            className="mb-2 text-[9px] tracking-[0.28em]"
            style={{ fontFamily: SANS, fontWeight: 400, color: "#C8A24A" }}
          >
            WHY THIS PICK
          </p>
          <p
            className="leading-[1.8]"
            style={{
              fontFamily: SANS,
              fontSize: "13px",
              fontWeight: 300,
              color: "#F1ECE2",
              opacity: 0.75,
            }}
          >
            {pick.reasoning}
          </p>
        </div>

        {/* Match tags — small caps, brass dots, no pills */}
        <div
          className="flex flex-wrap items-center gap-x-0 gap-y-1 text-[10px] tracking-[0.2em]"
          style={{ fontFamily: SANS, fontWeight: 400, color: "#F1ECE2", opacity: 0.6 }}
        >
          {pick.matchTags.map((tag, ti) => (
            <span key={tag} className="inline-flex items-center">
              <span style={{ textTransform: "uppercase" }}>{tag}</span>
              {ti < pick.matchTags.length - 1 && (
                <span className="mx-2.5" style={{ color: "#C8A24A" }} aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Weather + Cost data panel */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-xl">
          {/* Weather */}
          <div>
            <p
              className="mb-3 text-[9px] tracking-[0.28em]"
              style={{ fontFamily: SANS, fontWeight: 400, color: "#C8A24A" }}
            >
              WEATHER · SEPTEMBER
            </p>
            <div className="space-y-2">
              <DataRow
                label="High"
                value={`${pick.weather.highF}°F`}
              />
              <DataRow
                label="Low"
                value={`${pick.weather.lowF}°F`}
              />
              <p
                className="pt-1 leading-snug"
                style={{
                  fontFamily: SANS,
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "#F1ECE2",
                  opacity: 0.55,
                }}
              >
                {pick.weather.summary}
              </p>
            </div>
          </div>

          {/* Cost */}
          <div>
            <p
              className="mb-3 text-[9px] tracking-[0.28em]"
              style={{ fontFamily: SANS, fontWeight: 400, color: "#C8A24A" }}
            >
              ESTIMATED COST
            </p>
            <div className="space-y-2">
              <DataRow label="Flights" value={formatMoney(pick.cost.flightUsd)} />
              <DataRow label="Lodging" value={formatMoney(pick.cost.lodgingUsd)} />
              <div
                className="pt-2"
                style={{ borderTop: "1px solid rgba(200, 162, 74, 0.25)" }}
              >
                <DataRow
                  label="Total"
                  value={formatMoney(pick.cost.totalUsd)}
                  accent
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attractions */}
        <div className="max-w-xl">
          <p
            className="mb-4 text-[9px] tracking-[0.28em]"
            style={{ fontFamily: SANS, fontWeight: 400, color: "#C8A24A" }}
          >
            NOTABLE ATTRACTIONS
          </p>
          <ol className="space-y-4">
            {pick.attractions.map((a, ai) => (
              <li key={a.name} className="flex gap-4">
                <span
                  className="flex-none tabular-nums leading-snug"
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: "15px",
                    fontWeight: 300,
                    color: "#C8A24A",
                    minWidth: "1.25rem",
                  }}
                >
                  {ai + 1}.
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#F1ECE2",
                      opacity: 0.9,
                    }}
                  >
                    {a.name}
                  </p>
                  <p
                    className="mt-0.5 leading-snug"
                    style={{
                      fontFamily: SANS,
                      fontSize: "12px",
                      fontWeight: 300,
                      color: "#F1ECE2",
                      opacity: 0.55,
                    }}
                  >
                    {a.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Itinerary */}
        <div className="max-w-xl">
          <p
            className="mb-5 text-[9px] tracking-[0.28em]"
            style={{ fontFamily: SANS, fontWeight: 400, color: "#C8A24A" }}
          >
            {pick.itinerary.length}-DAY ITINERARY
          </p>
          <ol className="space-y-6">
            {pick.itinerary.map((d) => (
              <li key={d.day} className="flex gap-4">
                <span
                  className="flex-none leading-snug"
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: "15px",
                    fontWeight: 300,
                    color: "#C8A24A",
                    whiteSpace: "nowrap",
                    minWidth: "4.5rem",
                  }}
                >
                  Day {toRoman(d.day)}.
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#F1ECE2",
                      opacity: 0.9,
                    }}
                  >
                    {d.title}
                  </p>
                  <p
                    className="mt-1 leading-relaxed"
                    style={{
                      fontFamily: SANS,
                      fontSize: "12px",
                      fontWeight: 300,
                      color: "#F1ECE2",
                      opacity: 0.55,
                    }}
                  >
                    {d.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Reserve CTA */}
        <div className="pt-2">
          <button
            type="button"
            disabled
            className="inline-block cursor-default px-8 py-3 text-[10px] tracking-[0.3em]"
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              color: "#C8A24A",
              border: "1px solid #C8A24A",
              backgroundColor: "transparent",
              letterSpacing: "0.3em",
            }}
          >
            RESERVE
          </button>
        </div>
      </div>

      {/* Divider between picks */}
      {!isLast && (
        <div
          className="mt-20 sm:mt-28 h-px"
          style={{ backgroundColor: "#C8A24A", opacity: 0.2 }}
        />
      )}
    </article>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function DataRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        style={{
          fontFamily: SANS,
          fontSize: "11px",
          fontWeight: 300,
          color: "#F1ECE2",
          opacity: 0.5,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{
          fontFamily: SANS,
          fontSize: accent ? "14px" : "13px",
          fontWeight: accent ? 400 : 300,
          color: accent ? "#C8A24A" : "#F1ECE2",
          opacity: accent ? 1 : 0.85,
        }}
      >
        {value}
      </span>
    </div>
  );
}
