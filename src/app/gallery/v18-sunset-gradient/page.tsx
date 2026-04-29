import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v18 — Sunset Gradient / Dreamscape
// Palette: Plum #3D1F4F · Coral #E26D5C · Peach #F4B393 · Cream #FBE9D2 · Blush #F2C5C0 · Ink #1A0F2E
// Ultra-modern dreamy travel landing — glass/frosted cards over large conic sunset gradient.
// Display type: Inter Tight (sans) + Instrument Serif (italic display, one moment per pick).

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function SunsetGradientPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "conic-gradient(from 200deg at 70% 30%, #3D1F4F 0deg, #E26D5C 80deg, #F4B393 140deg, #FBE9D2 200deg, #F2C5C0 260deg, #E26D5C 300deg, #3D1F4F 360deg)",
        fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif",
        color: "#1A0F2E",
      }}
    >
      {/* Atmospheric noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Back link */}
      <div className="relative z-20 px-6 pt-7 sm:px-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight backdrop-blur-2xl transition-all hover:scale-[1.03]"
          style={{
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.28)",
            color: "#FBE9D2",
            boxShadow: "0 2px 16px rgba(61,31,79,0.25)",
          }}
        >
          <span aria-hidden>&#8592;</span>
          <span>directions</span>
        </Link>
      </div>

      {/* Hero band */}
      <HeroBand trip={TRIP} />

      {/* Picks */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-24 sm:px-10">
        <div className="space-y-32">
          {PICKS.map((pick, idx) => (
            <PickCard key={pick.slug} pick={pick} flip={idx % 2 !== 0} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 backdrop-blur-xl"
        style={{
          background: "rgba(26,15,46,0.72)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <p
            className="text-xs tracking-wide"
            style={{ color: "#F2C5C0", opacity: 0.7 }}
          >
            Visual exploration only &mdash; mock data. No booking functionality.
          </p>
          <Link
            href="/gallery"
            className="text-xs font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-80"
            style={{ color: "#F4B393" }}
          >
            &#8592; Gallery
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ─── Hero Band ─────────────────────────────────────────────────── */

function HeroBand({ trip }: { trip: GalleryTrip }) {
  const depart = formatDate(trip.departOn);
  const ret = formatDate(trip.returnOn);

  return (
    <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-16 pt-10 sm:px-10 sm:pt-12">
      {/* Eyebrow */}
      <p
        className="text-[11px] font-semibold tracking-[0.28em] uppercase"
        style={{ color: "#F4B393" }}
      >
        Fall &middot; {trip.tripLengthDays} Days &middot; {trip.origin} &rarr; ?
      </p>

      {/* Headline */}
      <h1
        className="mt-4 max-w-3xl text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
        style={{ color: "#FBE9D2" }}
      >
        Pick where you&apos;ll{" "}
        <span
          style={{
            fontFamily: "'Instrument Serif', 'Cormorant', serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#F2C5C0",
          }}
        >
          wander
        </span>{" "}
        next.
      </h1>

      {/* Sub copy */}
      <p
        className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
        style={{ color: "rgba(251,233,210,0.75)" }}
      >
        Four hand-picked U.S. destinations for {depart}&ndash;{ret}. Ranked by
        vibe match. All the detail up front so you can decide without a back-and-forth.
      </p>

      {/* Trip meta chips */}
      <div className="mt-8 flex flex-wrap gap-3">
        {trip.vibes.map((v) => (
          <MetaChip key={v} label={v} />
        ))}
        <MetaChip label={trip.budgetBand} />
        <MetaChip label={`${trip.pace} pace`} />
        <MetaChip label={`avoiding: ${trip.dislikes}`} />
      </div>
    </section>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold tracking-tight backdrop-blur-2xl"
      style={{
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.22)",
        color: "#FBE9D2",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {label}
    </span>
  );
}

/* ─── Pick Card ─────────────────────────────────────────────────── */

function PickCard({ pick, flip }: { pick: GalleryPick; flip: boolean }) {
  return (
    <article className="relative">
      <div
        className={`flex flex-col gap-0 overflow-hidden rounded-[40px] lg:flex-row ${
          flip ? "lg:flex-row-reverse" : ""
        }`}
        style={{
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(32px)",
          boxShadow:
            "0 40px 80px rgba(26,15,46,0.5), 0 8px 32px rgba(61,31,79,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Photo column */}
        <div className="relative min-h-[340px] flex-shrink-0 lg:w-[46%]">
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name} hero`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ mixBlendMode: "luminosity" }}
          />
          {/* Sunset colour overlay — picks up the gradient palette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(61,31,79,0.55) 0%, rgba(226,109,92,0.30) 50%, rgba(244,179,147,0.20) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Bottom fade into card */}
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                "linear-gradient(to top, rgba(26,15,46,0.7) 0%, transparent 100%)",
            }}
          />

          {/* Rank badge */}
          <div
            className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background:
                "linear-gradient(135deg, #E26D5C 0%, #3D1F4F 100%)",
              color: "#FBE9D2",
              boxShadow: "0 4px 16px rgba(226,109,92,0.45)",
            }}
          >
            {pick.rank}
          </div>

          {/* Destination name in italic display serif overlapping photo edge */}
          <div
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "rgba(244,179,147,0.9)" }}
            >
              {pick.region}
            </p>
            <h2
              className="mt-1 text-[clamp(2rem,5vw,3.2rem)] leading-[1.0] tracking-[-0.02em]"
              style={{
                fontFamily: "'Instrument Serif', 'Cormorant', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#FBE9D2",
                textShadow: "0 2px 20px rgba(26,15,46,0.6)",
              }}
            >
              {pick.name}
            </h2>
          </div>
        </div>

        {/* Content column */}
        <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
          {/* Blurb */}
          <p
            className="text-[1.0625rem] leading-[1.75] tracking-[-0.01em]"
            style={{ color: "rgba(251,233,210,0.9)" }}
          >
            {pick.blurb}
          </p>

          {/* Match tags */}
          <div className="flex flex-wrap gap-2">
            {pick.matchTags.map((t) => (
              <MatchTag key={t} tag={t} />
            ))}
          </div>

          {/* Reasoning inset */}
          <div
            className="rounded-[20px] p-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(16px)",
            }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#F4B393" }}
            >
              Why this pick
            </p>
            <p
              className="text-[0.9125rem] leading-relaxed"
              style={{ color: "rgba(251,233,210,0.82)" }}
            >
              {pick.reasoning}
            </p>
          </div>

          {/* Forecast / Budget panel */}
          <ForecastBudget pick={pick} />

          {/* Attractions */}
          <AttractionTiles pick={pick} />

          {/* Itinerary */}
          <ItineraryTimeline pick={pick} />

          {/* CTA */}
          <div className="pt-1">
            <button
              type="button"
              className="rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(226,109,92,0.5)]"
              style={{
                background:
                  "linear-gradient(120deg, #E26D5C 0%, #3D1F4F 100%)",
                color: "#FBE9D2",
                boxShadow: "0 4px 20px rgba(226,109,92,0.35)",
                fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif",
              }}
            >
              Save destination
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Match Tag ─────────────────────────────────────────────────── */

function MatchTag({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-tight"
      style={{
        background: "rgba(244,179,147,0.12)",
        border: "1px solid rgba(226,109,92,0.35)",
        color: "#F4B393",
        backdropFilter: "blur(8px)",
      }}
    >
      {tag}
    </span>
  );
}

/* ─── Forecast + Budget Panel ───────────────────────────────────── */

function ForecastBudget({ pick }: { pick: GalleryPick }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Weather */}
      <div
        className="rounded-[18px] p-5"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#F4B393" }}
        >
          Forecast &middot; September
        </p>
        <p
          className="text-[1.75rem] font-semibold tabular-nums tracking-tight leading-none"
          style={{ color: "#FBE9D2" }}
        >
          {pick.weather.highF}&deg;
          <span
            className="text-base font-normal"
            style={{ color: "rgba(244,179,147,0.65)" }}
          >
            /{pick.weather.lowF}&deg;
          </span>
        </p>
        <p
          className="mt-1.5 text-xs leading-snug"
          style={{ color: "rgba(251,233,210,0.6)" }}
        >
          {pick.weather.summary}
        </p>
      </div>

      {/* Budget */}
      <div
        className="rounded-[18px] p-5"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#F4B393" }}
        >
          Budget estimate
        </p>
        <table className="w-full text-xs tabular-nums">
          <tbody>
            <tr>
              <td
                className="py-[3px] pr-3"
                style={{ color: "rgba(251,233,210,0.55)" }}
              >
                Flights
              </td>
              <td
                className="py-[3px] text-right font-semibold"
                style={{ color: "#FBE9D2" }}
              >
                {formatMoney(pick.cost.flightUsd)}
              </td>
            </tr>
            <tr>
              <td
                className="py-[3px] pr-3"
                style={{ color: "rgba(251,233,210,0.55)" }}
              >
                Lodging
              </td>
              <td
                className="py-[3px] text-right font-semibold"
                style={{ color: "#FBE9D2" }}
              >
                {formatMoney(pick.cost.lodgingUsd)}
              </td>
            </tr>
            <tr
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <td
                className="pt-2 pr-3 text-[11px] font-semibold"
                style={{ color: "#F4B393" }}
              >
                Total
              </td>
              <td
                className="pt-2 text-right text-[11px] font-bold"
                style={{ color: "#F4B393" }}
              >
                {formatMoney(pick.cost.totalUsd)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Attraction Tiles ──────────────────────────────────────────── */

function AttractionTiles({ pick }: { pick: GalleryPick }) {
  return (
    <div>
      <p
        className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "#F4B393" }}
      >
        Don&apos;t miss
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {pick.attractions.slice(0, 3).map((a) => (
          <div
            key={a.name}
            className="rounded-[16px] p-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.11)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              className="text-[0.8125rem] font-semibold leading-snug tracking-tight"
              style={{ color: "#FBE9D2" }}
            >
              {a.name}
            </p>
            <p
              className="mt-1.5 text-[0.75rem] leading-snug"
              style={{ color: "rgba(251,233,210,0.55)" }}
            >
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Itinerary Timeline ────────────────────────────────────────── */

function ItineraryTimeline({ pick }: { pick: GalleryPick }) {
  return (
    <div>
      <p
        className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "#F4B393" }}
      >
        {pick.itinerary.length}-day shape
      </p>
      <ol className="space-y-3">
        {pick.itinerary.map((d, idx) => (
          <li key={d.day} className="flex gap-4">
            {/* Day circle with gradient */}
            <div className="relative flex flex-col items-center">
              <div
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold tabular-nums"
                style={{
                  background:
                    "linear-gradient(135deg, #E26D5C 0%, #3D1F4F 100%)",
                  color: "#FBE9D2",
                  boxShadow: "0 2px 12px rgba(226,109,92,0.4)",
                  flexShrink: 0,
                }}
              >
                {d.day}
              </div>
              {/* Connector line */}
              {idx < pick.itinerary.length - 1 && (
                <div
                  className="mt-1 w-px flex-1"
                  style={{
                    minHeight: "1.25rem",
                    background:
                      "linear-gradient(to bottom, rgba(226,109,92,0.35), rgba(61,31,79,0.15))",
                  }}
                />
              )}
            </div>
            {/* Text */}
            <div className="pb-1 pt-0.5">
              <p
                className="text-[0.875rem] font-semibold leading-snug tracking-tight"
                style={{ color: "#FBE9D2" }}
              >
                {d.title}
              </p>
              <p
                className="mt-1 text-[0.8125rem] leading-relaxed"
                style={{ color: "rgba(251,233,210,0.55)" }}
              >
                {d.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
