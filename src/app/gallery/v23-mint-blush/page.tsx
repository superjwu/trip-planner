import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v23 — Mint × Blush / Wellness Spa
// Palette: Mint #A8D5BA · Blush #F2C5C0 · Bone #F4EEE6 · Slate #3E4B57
//          Soft cream #FBF7EE · Muted teal #6F8E89
// Design language: Aesop / Le Labo / modern hot-spring resort — spa-calm,
// generous breathing room, whisper-thin display serif, delicate rounded forms.

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

const DISPLAY_SERIF = "'Cormorant Garamond', Georgia, serif";
const BODY_SANS = "'Inter Tight', 'Inter', system-ui, sans-serif";

export default function MintBlushGalleryPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#F4EEE6", fontFamily: BODY_SANS }}
    >
      {/* Ambient blob shapes */}
      <div
        className="pointer-events-none absolute left-[-180px] top-[-120px] h-[520px] w-[520px] rounded-full"
        style={{ background: "rgba(168,213,186,0.18)", filter: "blur(90px)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-140px] top-[380px] h-[420px] w-[420px] rounded-full"
        style={{ background: "rgba(242,197,192,0.16)", filter: "blur(80px)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[200px] left-[20%] h-[360px] w-[360px] rounded-full"
        style={{ background: "rgba(168,213,186,0.12)", filter: "blur(100px)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
        {/* Back link */}
        <BackLink />

        {/* Trip banner */}
        <TripBanner trip={TRIP} />

        {/* Pick cards */}
        <section className="mt-20 space-y-16">
          {PICKS.map((pick) => (
            <PickCard key={pick.slug} pick={pick} />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center">
          <p
            className="text-sm italic tracking-wide"
            style={{ color: "#6F8E89", fontFamily: DISPLAY_SERIF, fontWeight: 300 }}
          >
            A composition study — no reservations are made.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ─── Back link ─── */

function BackLink() {
  return (
    <Link
      href="/gallery"
      className="inline-flex items-center gap-2 text-sm tracking-wide transition-opacity hover:opacity-70"
      style={{ color: "#3E4B57", fontWeight: 300, letterSpacing: "0.04em" }}
    >
      <span aria-hidden>&#8592;</span>
      <span>back to selections</span>
    </Link>
  );
}

/* ─── Trip banner ─── */

function TripBanner({ trip }: { trip: GalleryTrip }) {
  const eyebrow = `AUTUMN ESCAPE · ${trip.originCode} · SEPT 12–16`;

  const pills = [
    trip.originCode,
    `${formatDate(trip.departOn)} – ${formatDate(trip.returnOn)}`,
    trip.vibes.join(", "),
    trip.budgetBand,
    `${trip.pace} pace`,
  ];

  return (
    <section
      className="mt-12 rounded-[32px] p-10 sm:p-14"
      style={{
        background: "#FBF7EE",
        boxShadow:
          "0 8px 40px -10px rgba(168,213,186,0.45), 0 2px 12px -4px rgba(62,75,87,0.06)",
      }}
    >
      {/* Eyebrow */}
      <p
        className="text-[10px] tracking-[0.22em]"
        style={{ color: "#6F8E89", fontWeight: 400, fontFamily: BODY_SANS }}
      >
        {eyebrow}
      </p>

      {/* Headline */}
      <h1
        className="mt-5 text-4xl sm:text-5xl"
        style={{
          fontFamily: DISPLAY_SERIF,
          fontWeight: 300,
          fontStyle: "italic",
          color: "#3E4B57",
          lineHeight: 1.18,
        }}
      >
        Four restorative routes.
      </h1>

      {/* Meta pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        {pills.map((p) => (
          <span
            key={p}
            className="rounded-full px-4 py-1.5 text-xs tracking-wide"
            style={{
              background: "#EAF4EE",
              color: "#3E4B57",
              fontWeight: 300,
              letterSpacing: "0.04em",
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─── Pick card ─── */

function PickCard({ pick }: { pick: GalleryPick }) {
  return (
    <article
      className="rounded-[28px] p-8 sm:p-10"
      style={{
        background: "#FBF7EE",
        boxShadow:
          "0 12px 48px -16px rgba(62,75,87,0.10), 0 4px 16px -6px rgba(168,213,186,0.25)",
      }}
    >
      {/* Rank numeral */}
      <p
        className="mb-5 text-xs italic"
        style={{
          fontFamily: DISPLAY_SERIF,
          fontWeight: 300,
          color: "#F2C5C0",
          letterSpacing: "0.05em",
        }}
      >
        no. {pick.rank}
      </p>

      {/* Hero photo */}
      <div
        className="overflow-hidden rounded-[20px]"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(168,213,186,0.35), 0 4px 20px -8px rgba(168,213,186,0.4)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={pick.name}
          className="h-64 w-full object-cover sm:h-80"
          style={{ display: "block" }}
        />
      </div>

      {/* Destination name */}
      <h2
        className="mt-8 text-4xl sm:text-5xl"
        style={{
          fontFamily: DISPLAY_SERIF,
          fontWeight: 300,
          fontStyle: "italic",
          color: "#3E4B57",
          lineHeight: 1.15,
        }}
      >
        {pick.name}
      </h2>

      {/* Region */}
      <p
        className="mt-2 text-xs tracking-[0.14em]"
        style={{ color: "#6F8E89", fontWeight: 400 }}
      >
        {pick.region.toUpperCase()}
      </p>

      {/* Blurb */}
      <p
        className="mt-6 text-[15px]"
        style={{ color: "#3E4B57", fontWeight: 300, lineHeight: 1.75 }}
      >
        {pick.blurb}
      </p>

      {/* Reasoning panel */}
      <div
        className="mt-8 rounded-2xl p-6"
        style={{ background: "rgba(168,213,186,0.18)" }}
      >
        <p
          className="text-[10px] tracking-[0.18em]"
          style={{ color: "#6F8E89", fontWeight: 400 }}
        >
          WHY THIS PICK
        </p>
        <p
          className="mt-3 text-sm"
          style={{ color: "#3E4B57", fontWeight: 300, lineHeight: 1.75 }}
        >
          {pick.reasoning}
        </p>
      </div>

      {/* Match tags */}
      <div className="mt-7 flex flex-wrap gap-2">
        {pick.matchTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3.5 py-1.5 text-[11px] tracking-wide"
            style={{
              background: "transparent",
              border: "1px solid rgba(168,213,186,0.6)",
              color: "#3E4B57",
              fontWeight: 300,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Weather + Cost panels */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <WeatherPanel pick={pick} />
        <CostPanel pick={pick} />
      </div>

      {/* Attractions */}
      <AttractionsRow pick={pick} />

      {/* Itinerary */}
      <Itinerary pick={pick} />

      {/* CTA */}
      <div className="mt-10 flex">
        <button
          className="rounded-full px-8 py-3 text-sm tracking-wide transition-opacity hover:opacity-75"
          style={{
            background: "#A8D5BA",
            color: "#3E4B57",
            fontWeight: 300,
            fontFamily: BODY_SANS,
            letterSpacing: "0.05em",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save for later
        </button>
      </div>
    </article>
  );
}

/* ─── Weather panel ─── */

function WeatherPanel({ pick }: { pick: GalleryPick }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#F4EEE6" }}
    >
      <p
        className="text-[10px] tracking-[0.16em]"
        style={{ color: "#6F8E89", fontWeight: 400 }}
      >
        SEPTEMBER WEATHER
      </p>
      <div className="mt-4 flex items-center gap-4">
        {/* CSS sun glyph */}
        <div
          className="h-8 w-8 flex-none rounded-full"
          style={{ background: "rgba(168,213,186,0.55)" }}
          aria-hidden
        />
        <div>
          <p
            className="text-lg"
            style={{
              color: "#3E4B57",
              fontWeight: 300,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2,
            }}
          >
            {pick.weather.highF}&deg;&thinsp;/&thinsp;{pick.weather.lowF}&deg;
          </p>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "#6F8E89", fontWeight: 300, lineHeight: 1.5 }}
          >
            {pick.weather.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Cost panel ─── */

function CostPanel({ pick }: { pick: GalleryPick }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#F4EEE6" }}
    >
      <p
        className="text-[10px] tracking-[0.16em]"
        style={{ color: "#6F8E89", fontWeight: 400 }}
      >
        ESTIMATED COST
      </p>
      <p
        className="mt-4 text-lg"
        style={{
          color: "#3E4B57",
          fontWeight: 300,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.2,
        }}
      >
        {formatMoney(pick.cost.totalUsd)}&thinsp;&middot;&thinsp;est.
      </p>
      <div
        className="mt-3 space-y-1 text-xs"
        style={{ color: "#6F8E89", fontWeight: 300 }}
      >
        <div className="flex justify-between">
          <span>Flights</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatMoney(pick.cost.flightUsd)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Lodging</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatMoney(pick.cost.lodgingUsd)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Attractions ─── */

function AttractionsRow({ pick }: { pick: GalleryPick }) {
  return (
    <div className="mt-9">
      <p
        className="text-[10px] tracking-[0.18em]"
        style={{ color: "#6F8E89", fontWeight: 400 }}
      >
        POINTS OF INTEREST
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pick.attractions.slice(0, 3).map((a) => (
          <div
            key={a.name}
            className="rounded-2xl p-4"
            style={{ background: "rgba(168,213,186,0.13)" }}
          >
            <p
              className="text-sm"
              style={{ color: "#3E4B57", fontWeight: 400, lineHeight: 1.3 }}
            >
              {a.name}
            </p>
            <p
              className="mt-1.5 text-[11px]"
              style={{ color: "#6F8E89", fontWeight: 300, lineHeight: 1.6 }}
            >
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Itinerary timeline ─── */

function Itinerary({ pick }: { pick: GalleryPick }) {
  return (
    <div className="mt-9">
      <p
        className="text-[10px] tracking-[0.18em]"
        style={{ color: "#6F8E89", fontWeight: 400 }}
      >
        {pick.itinerary.length}-DAY ITINERARY
      </p>
      <ol className="mt-5 space-y-0">
        {pick.itinerary.map((day, idx) => (
          <li key={day.day} className="relative flex gap-5">
            {/* Vertical hairline connector */}
            {idx < pick.itinerary.length - 1 && (
              <div
                className="absolute left-[14px] top-7 w-px"
                style={{
                  height: "calc(100% + 4px)",
                  background: "rgba(242,197,192,0.55)",
                }}
                aria-hidden
              />
            )}

            {/* Day dot */}
            <div className="relative z-10 flex-none">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: "rgba(168,213,186,0.35)" }}
              >
                <span
                  className="text-[10px]"
                  style={{
                    color: "#3E4B57",
                    fontWeight: 400,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {day.day}
                </span>
              </div>
            </div>

            {/* Day content card */}
            <div
              className="mb-4 flex-1 rounded-2xl p-5"
              style={{ background: "#F4EEE6" }}
            >
              <p
                className="text-sm"
                style={{
                  color: "#3E4B57",
                  fontWeight: 400,
                  lineHeight: 1.3,
                }}
              >
                {day.title}
              </p>
              <p
                className="mt-2 text-[12px]"
                style={{ color: "#6F8E89", fontWeight: 300, lineHeight: 1.7 }}
              >
                {day.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
