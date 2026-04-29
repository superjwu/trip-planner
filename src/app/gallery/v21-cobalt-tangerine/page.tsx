import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v21 — Cobalt × Tangerine / Bauhaus Modern
// Palette: Cobalt #1949C4 | Tangerine #FF7A33 | White #FFFFFF | Graphite #1B1B1B | Stone #F2EFE8
// Design language: Bauhaus / Swiss-modernist / Italian editorial — loud geometry,
// big flat color blocks, giant numerals, exposed 12-col grid. Pentagram meets Display Type.

const COBALT = "#1949C4";
const TANGERINE = "#FF7A33";
const GRAPHITE = "#1B1B1B";
const STONE = "#F2EFE8";

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

const displayFont = "'Archivo', 'Helvetica Neue', system-ui, sans-serif";
const bodyFont = "'Helvetica Neue', Arial, system-ui, sans-serif";

export default function CobaltTangerinePage() {
  return (
    <main
      style={{ background: "#FFFFFF", fontFamily: bodyFont, color: GRAPHITE }}
      className="min-h-screen"
    >
      {/* Back link */}
      <div className="px-8 pt-8 pb-4">
        <Link
          href="/gallery"
          style={{ color: COBALT, fontFamily: displayFont, letterSpacing: "0.18em" }}
          className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
        >
          <span style={{ fontSize: "1.1rem" }}>&larr;</span>
          <span>All Directions</span>
        </Link>
      </div>

      {/* Hero band — full cobalt block */}
      <HeroBand trip={TRIP} />

      {/* Picks */}
      <div className="relative">
        {PICKS.map((pick, i) => (
          <div key={pick.slug}>
            <PickSection pick={pick} index={i} />
            {i < PICKS.length - 1 && <Divider index={i} />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        style={{ background: COBALT }}
        className="mt-0 px-8 py-10 text-center"
      >
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: displayFont,
            letterSpacing: "0.25em",
            fontSize: "0.75rem",
          }}
          className="font-bold uppercase"
        >
          Visual Study&nbsp;&nbsp;·&nbsp;&nbsp;Mock Data&nbsp;&nbsp;·&nbsp;&nbsp;No Bookings Wired
        </p>
      </footer>
    </main>
  );
}

/* ── HERO BAND ──────────────────────────────────────────────────────── */

function HeroBand({ trip }: { trip: GalleryTrip }) {
  return (
    <section style={{ background: COBALT }} className="w-full px-8 pb-0 pt-12">
      {/* Eyebrow */}
      <p
        style={{
          color: TANGERINE,
          fontFamily: displayFont,
          letterSpacing: "0.22em",
          fontSize: "0.75rem",
        }}
        className="font-bold uppercase"
      >
        Itinerary No. 04&nbsp;&nbsp;&middot;&nbsp;&nbsp;September 2026
      </p>

      {/* Giant headline */}
      <h1
        style={{
          color: "#FFFFFF",
          fontFamily: displayFont,
          fontSize: "clamp(3rem, 8vw, 7rem)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          marginTop: "1rem",
        }}
      >
        Four Destinations,
        <br />
        Ranked.
      </h1>

      {/* Metadata strip */}
      <div
        style={{ borderTop: `2px solid ${TANGERINE}`, marginTop: "3rem" }}
        className="flex flex-wrap items-center gap-0"
      >
        <MetaCell label="Origin" value={trip.origin} />
        <MetaBar />
        <MetaCell label="Departs" value={fmtDate(trip.departOn)} />
        <MetaBar />
        <MetaCell label="Returns" value={fmtDate(trip.returnOn)} />
        <MetaBar />
        <MetaCell label="Vibes" value={trip.vibes.join(" / ").toUpperCase()} />
        <MetaBar />
        <MetaCell label="Budget" value={trip.budgetBand} />
        <MetaBar />
        <MetaCell label="Pace" value={trip.pace.toUpperCase()} />
      </div>
    </section>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 pr-6 pl-0">
      <p
        style={{ color: TANGERINE, fontSize: "0.6rem", letterSpacing: "0.18em", fontFamily: displayFont }}
        className="font-bold uppercase"
      >
        {label}
      </p>
      <p
        style={{ color: "#FFFFFF", fontFamily: displayFont, fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" }}
        className="font-bold mt-0.5"
      >
        {value}
      </p>
    </div>
  );
}

function MetaBar() {
  return (
    <span
      style={{ color: TANGERINE, fontSize: "1.5rem", lineHeight: 1, userSelect: "none", marginRight: "1.5rem" }}
      aria-hidden
    >
      |
    </span>
  );
}

/* ── SECTION DIVIDER ────────────────────────────────────────────────── */

function Divider({ index }: { index: number }) {
  const showCircle = index % 2 === 0;
  return (
    <div className="relative flex items-center justify-center" style={{ height: "6rem", background: "#FFFFFF" }}>
      {/* Thick tangerine rule */}
      <div
        style={{ background: TANGERINE, height: "5px", width: "100%", position: "absolute", top: "50%" }}
        aria-hidden
      />
      {/* Giant cobalt circle sitting on the rule */}
      {showCircle && (
        <div
          style={{
            background: COBALT,
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              background: TANGERINE,
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ── PICK SECTION ───────────────────────────────────────────────────── */

function PickSection({ pick, index }: { pick: GalleryPick; index: number }) {
  const isAlt = index % 2 === 1; // alternate layout: photo right
  const rankStr = String(pick.rank).padStart(2, "0");

  return (
    <article style={{ background: "#FFFFFF", borderTop: index === 0 ? `6px solid ${COBALT}` : "none" }}>
      {/* 12-col grid: photo col + body col, alternating */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: isAlt ? "5fr 7fr" : "7fr 5fr",
          minHeight: "600px",
        }}
      >
        {/* Photo block */}
        <div
          style={{ order: isAlt ? 2 : 1, position: "relative", overflow: "hidden" }}
          className="relative"
        >
          {/* Giant rank numeral overlapping photo */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              fontFamily: displayFont,
              fontSize: "clamp(6rem, 12vw, 10rem)",
              fontWeight: 900,
              lineHeight: 1,
              color: isAlt ? TANGERINE : "#FFFFFF",
              zIndex: 10,
              top: "1rem",
              [isAlt ? "right" : "left"]: "1rem",
              letterSpacing: "-0.04em",
              opacity: 0.92,
              textShadow: `3px 3px 0 ${isAlt ? COBALT : GRAPHITE}`,
            }}
          >
            {rankStr}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name} landscape`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              minHeight: "420px",
              filter: "saturate(1.15) contrast(1.05)",
            }}
          />
          {/* Color overlay stripe at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: TANGERINE,
            }}
            aria-hidden
          />
        </div>

        {/* Body block */}
        <div
          style={{
            order: isAlt ? 1 : 2,
            background: STONE,
            padding: "3rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {/* Destination name + region */}
          <header>
            <p
              style={{
                color: COBALT,
                fontFamily: displayFont,
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                fontWeight: 700,
                textTransform: "uppercase",
                fontVariant: "small-caps",
              }}
            >
              {pick.region}
            </p>
            <h2
              style={{
                color: GRAPHITE,
                fontFamily: displayFont,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                marginTop: "0.4rem",
              }}
            >
              {pick.name}
            </h2>
          </header>

          {/* Blurb */}
          <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: GRAPHITE, maxWidth: "48ch" }}>
            {pick.blurb}
          </p>

          {/* Match tags — flat cobalt fill, sharp corners */}
          <div className="flex flex-wrap gap-2">
            {pick.matchTags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: COBALT,
                  color: "#FFFFFF",
                  fontFamily: displayFont,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.35rem 0.75rem",
                  display: "inline-block",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Reasoning — tangerine-ruled section */}
          <div
            style={{
              borderTop: `3px solid ${TANGERINE}`,
              borderBottom: `3px solid ${TANGERINE}`,
              padding: "1rem 0",
            }}
          >
            <p
              style={{
                color: COBALT,
                fontFamily: displayFont,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              Why
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: GRAPHITE }}>{pick.reasoning}</p>
          </div>

          {/* Weather + cost tabular grid */}
          <WeatherCostGrid pick={pick} />

          {/* Attractions numbered list */}
          <AttractionsBlock pick={pick} />
        </div>
      </div>

      {/* Itinerary — full-width cobalt band below */}
      <ItineraryBand pick={pick} />
    </article>
  );
}

/* ── WEATHER + COST GRID ────────────────────────────────────────────── */

function WeatherCostGrid({ pick }: { pick: GalleryPick }) {
  return (
    <div style={{ border: `2px solid ${COBALT}` }}>
      {/* Header row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
      >
        {[
          { label: "High", value: `${pick.weather.highF}°F`, numeric: true },
          { label: "Low", value: `${pick.weather.lowF}°F`, numeric: true },
          { label: "Flights", value: fmtMoney(pick.cost.flightUsd), numeric: true },
          { label: "Lodging", value: fmtMoney(pick.cost.lodgingUsd), numeric: true },
        ].map((cell, ci) => (
          <div
            key={ci}
            style={{
              borderLeft: ci > 0 ? `2px solid ${COBALT}` : "none",
              padding: "0.5rem 0.75rem",
            }}
          >
            <p
              style={{
                color: TANGERINE,
                fontFamily: displayFont,
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "0.25rem",
              }}
            >
              {cell.label}
            </p>
            <p
              style={{
                color: GRAPHITE,
                fontFamily: displayFont,
                fontSize: "1rem",
                fontWeight: 700,
                fontVariantNumeric: cell.numeric ? "tabular-nums" : "normal",
              }}
            >
              {cell.value}
            </p>
          </div>
        ))}
      </div>
      {/* Weather summary row */}
      <div
        style={{
          borderTop: `2px solid ${COBALT}`,
          padding: "0.5rem 0.75rem",
          background: COBALT,
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: displayFont,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Weather:&nbsp;
          <span style={{ color: TANGERINE }}>{pick.weather.summary}</span>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          Total:&nbsp;
          <span style={{ color: TANGERINE, fontVariantNumeric: "tabular-nums" }}>
            {fmtMoney(pick.cost.totalUsd)}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── ATTRACTIONS BLOCK ──────────────────────────────────────────────── */

function AttractionsBlock({ pick }: { pick: GalleryPick }) {
  return (
    <div>
      <p
        style={{
          color: GRAPHITE,
          fontFamily: displayFont,
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        Don&apos;t Miss
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {pick.attractions.slice(0, 3).map((a, ai) => (
          <li key={a.name} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <span
              aria-hidden
              style={{
                color: TANGERINE,
                fontFamily: displayFont,
                fontSize: "2rem",
                fontWeight: 900,
                lineHeight: 1,
                minWidth: "2rem",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {ai + 1}
            </span>
            <div style={{ paddingTop: "0.2rem" }}>
              <p style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "0.85rem", color: GRAPHITE, margin: 0 }}>
                {a.name}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#555555", lineHeight: 1.5, margin: "0.15rem 0 0" }}>
                {a.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── ITINERARY BAND ─────────────────────────────────────────────────── */

function ItineraryBand({ pick }: { pick: GalleryPick }) {
  return (
    <div style={{ background: COBALT }}>
      {/* Band label */}
      <div style={{ padding: "1.25rem 2.5rem 0" }}>
        <p
          style={{
            color: TANGERINE,
            fontFamily: displayFont,
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          {pick.itinerary.length}-Day Itinerary Shape
        </p>
      </div>
      {/* 4-cell horizontal grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${pick.itinerary.length}, 1fr)`,
          borderTop: `2px solid rgba(255,122,51,0.4)`,
          marginTop: "0.75rem",
        }}
      >
        {pick.itinerary.map((day, di) => (
          <div
            key={day.day}
            style={{
              borderLeft: di > 0 ? `2px solid rgba(255,122,51,0.3)` : "none",
              padding: "1.25rem 1.5rem",
            }}
          >
            {/* Day numeral */}
            <p
              style={{
                color: TANGERINE,
                fontFamily: displayFont,
                fontSize: "1.75rem",
                fontWeight: 900,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
              }}
            >
              {String(day.day).padStart(2, "0")}
            </p>
            {/* Title */}
            <p
              style={{
                color: "#FFFFFF",
                fontFamily: displayFont,
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "0.4rem",
                marginBottom: "0.4rem",
              }}
            >
              {day.title}
            </p>
            {/* Description */}
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", lineHeight: 1.55 }}>
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
