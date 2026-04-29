import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v20 — Sage & Terracotta / Slow Living
// Palette: Sage #8FA68E · Terracotta #C77554 · Oat #EFE5D2 · Smoke ink #3D352B
//          Soft cream #F6EFDE · Dusty olive #7B8A6D
// Design language: Kinfolk / studio-pottery / Aesop — earthy, organic, warm.

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

// 4-petal flower glyph rendered as inline SVG
function PetalGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* top petal */}
      <ellipse cx="12" cy="7" rx="3.2" ry="5.5" fill="#C77554" opacity="0.85" />
      {/* bottom petal */}
      <ellipse cx="12" cy="17" rx="3.2" ry="5.5" fill="#C77554" opacity="0.85" />
      {/* left petal */}
      <ellipse cx="7" cy="12" rx="5.5" ry="3.2" fill="#C77554" opacity="0.85" />
      {/* right petal */}
      <ellipse cx="17" cy="12" rx="5.5" ry="3.2" fill="#C77554" opacity="0.85" />
      {/* center */}
      <circle cx="12" cy="12" r="2.2" fill="#EFE5D2" />
    </svg>
  );
}

// Wavy SVG divider
function WavyDivider() {
  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M0,6 C33,0 66,12 100,6 C133,0 166,12 200,6 C233,0 266,12 300,6 C333,0 366,12 400,6"
        stroke="#8FA68E"
        strokeWidth="1.2"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}

// Sage circle number bullet for attractions
function SageBullet({ n }: { n: number }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full text-[#F6EFDE]"
      style={{
        width: 26,
        height: 26,
        backgroundColor: "#8FA68E",
        fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
        fontSize: 12,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}

export default function SageTerracottaGalleryPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#EFE5D2", color: "#3D352B" }}
    >
      {/* Floating background blob motifs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "8%",
          left: "-12%",
          width: 520,
          height: 480,
          backgroundColor: "#8FA68E",
          opacity: 0.08,
          borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "42%",
          right: "-10%",
          width: 440,
          height: 400,
          backgroundColor: "#C77554",
          opacity: 0.06,
          borderRadius: "45% 55% 40% 60% / 55% 40% 60% 45%",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "74%",
          left: "5%",
          width: 360,
          height: 320,
          backgroundColor: "#8FA68E",
          opacity: 0.07,
          borderRadius: "50% 50% 65% 35% / 40% 60% 40% 60%",
          zIndex: 0,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20" style={{ zIndex: 1 }}>
        {/* Back link */}
        <BackLink />

        {/* Trip banner */}
        <TripBanner trip={TRIP} />

        {/* Picks */}
        <section className="mt-16">
          <div className="mb-4 text-center">
            <WavyDivider />
            <p
              className="mt-4 text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
            >
              Four places, one at a time
            </p>
            <WavyDivider />
          </div>

          <div className="mt-10 flex flex-col gap-20">
            {PICKS.map((pick) => (
              <PickCard key={pick.slug} pick={pick} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center">
          <WavyDivider />
          <p
            className="mt-6 text-sm italic"
            style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
          >
            A study in arrangement — none of this is wired.
          </p>
        </footer>
      </div>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      href="/gallery"
      className="inline-block text-sm italic"
      style={{
        color: "#3D352B",
        fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
        textDecoration: "none",
      }}
    >
      &larr; back to all directions
    </Link>
  );
}

function TripBanner({ trip }: { trip: GalleryTrip }) {
  const metaPills = [
    trip.origin,
    `${formatDate(trip.departOn)} – ${formatDate(trip.returnOn)}`,
    ...trip.vibes,
    trip.budgetBand,
    `${trip.pace} pace`,
  ];

  return (
    <section
      className="mt-10 rounded-[32px] px-8 py-10 sm:px-12 sm:py-12"
      style={{
        backgroundColor: "#F6EFDE",
        boxShadow: "0 8px 48px -16px rgba(61,53,43,0.18)",
      }}
    >
      {/* Eyebrow */}
      <p
        className="text-[10px] uppercase tracking-[0.28em]"
        style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
      >
        A Fall Shortlist &nbsp;&middot;&nbsp; {trip.tripLengthDays} Days &nbsp;&middot;&nbsp; From {trip.origin}
      </p>

      {/* Headline */}
      <h1
        className="mt-4 text-4xl italic sm:text-5xl"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "#3D352B",
          lineHeight: 1.18,
          fontStyle: "italic",
        }}
      >
        Four places, slowly considered.
      </h1>

      {/* Meta pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        {metaPills.map((pill) => (
          <span
            key={pill}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              border: "1px solid #8FA68E",
              color: "#3D352B",
              fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
              backgroundColor: "transparent",
            }}
          >
            {pill}
          </span>
        ))}
      </div>
    </section>
  );
}

function PickCard({ pick }: { pick: GalleryPick }) {
  return (
    <article
      className="rounded-[32px] px-7 py-9 sm:px-10 sm:py-10"
      style={{
        backgroundColor: "#F6EFDE",
        boxShadow: "0 12px 56px -20px rgba(61,53,43,0.16)",
      }}
    >
      {/* Rank + destination header */}
      <header className="flex items-start gap-5">
        <div className="flex flex-col items-center gap-1 pt-1">
          <span
            className="leading-none tabular-nums"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 64,
              fontStyle: "italic",
              color: "#C77554",
              lineHeight: 1,
            }}
          >
            {pick.rank}
          </span>
          <PetalGlyph size={18} />
        </div>
        <div>
          <h2
            className="text-3xl italic sm:text-4xl"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#3D352B",
              lineHeight: 1.15,
            }}
          >
            {pick.name}
          </h2>
          <p
            className="mt-1 text-sm italic"
            style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
          >
            {pick.region}
          </p>
        </div>
      </header>

      {/* Hero photo */}
      <div className="mt-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name} landscape`}
          className="w-full object-cover"
          style={{
            borderRadius: 24,
            outline: "6px solid #8FA68E",
            outlineOffset: -3,
            boxShadow: "0 8px 32px -12px rgba(61,53,43,0.22)",
            maxHeight: 380,
          }}
        />
      </div>

      {/* Blurb */}
      <p
        className="mt-7 text-base leading-[1.8]"
        style={{ fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif", color: "#3D352B" }}
      >
        {pick.blurb}
      </p>

      {/* Why we chose it */}
      <div
        className="mt-6 rounded-[16px] px-6 py-5"
        style={{
          backgroundColor: "#EFE5D2",
          borderLeft: "4px solid #8FA68E",
        }}
      >
        <p
          className="text-xs italic"
          style={{ color: "#C77554", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
        >
          Why we chose it
        </p>
        <p
          className="mt-2 text-sm leading-[1.75]"
          style={{ fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif", color: "#3D352B" }}
        >
          {pick.reasoning}
        </p>
      </div>

      {/* Match tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {pick.matchTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
            style={{
              border: "1px solid #8FA68E",
              color: "#3D352B",
              fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
            }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 5, height: 5, backgroundColor: "#C77554", flexShrink: 0 }}
            />
            {tag}
          </span>
        ))}
      </div>

      {/* Particulars data block */}
      <div
        className="mt-7 rounded-[16px] px-6 py-5"
        style={{ backgroundColor: "#EFE5D2" }}
      >
        <p
          className="mb-4 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
        >
          Particulars
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <Particular label="Flights" value={formatMoney(pick.cost.flightUsd)} />
          <Particular label="Lodging" value={formatMoney(pick.cost.lodgingUsd)} />
          <Particular label="Total" value={formatMoney(pick.cost.totalUsd)} />
          <Particular
            label="Weather"
            value={`${pick.weather.highF}° / ${pick.weather.lowF}°`}
          />
        </div>
        <p
          className="mt-3 text-xs italic"
          style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
        >
          {pick.weather.summary}
        </p>
      </div>

      {/* Attractions */}
      <div className="mt-7">
        <p
          className="mb-4 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
        >
          Worth your time
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {pick.attractions.slice(0, 3).map((a, i) => (
            <div
              key={a.name}
              className="rounded-[14px] px-4 py-4"
              style={{ backgroundColor: "#EFE5D2" }}
            >
              <div className="flex items-start gap-3">
                <SageBullet n={i + 1} />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
                      color: "#3D352B",
                    }}
                  >
                    {a.name}
                  </p>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
                  >
                    {a.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary thread */}
      <div className="mt-7">
        <p
          className="mb-5 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
        >
          {pick.itinerary.length}-day shape
        </p>
        <div className="relative">
          {/* Vertical sage hairline */}
          <div
            className="absolute"
            style={{
              left: 13,
              top: 20,
              bottom: 20,
              width: 1,
              backgroundColor: "#8FA68E",
              opacity: 0.45,
            }}
          />
          <ol className="flex flex-col gap-3">
            {pick.itinerary.map((day) => (
              <li key={day.day} className="flex items-start gap-4">
                {/* Day numeral */}
                <span
                  className="relative z-10 flex-none text-sm tabular-nums"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "#C77554",
                    fontStyle: "italic",
                    fontSize: 22,
                    lineHeight: 1,
                    width: 27,
                    textAlign: "center",
                    paddingTop: 2,
                  }}
                >
                  {day.day}
                </span>
                <div
                  className="flex-1 rounded-[12px] px-4 py-3"
                  style={{ backgroundColor: "#EFE5D2" }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
                      color: "#3D352B",
                    }}
                  >
                    {day.title}
                  </p>
                  <p
                    className="mt-0.5 text-xs leading-relaxed"
                    style={{ color: "#7B8A6D", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
                  >
                    {day.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-start">
        <button
          type="button"
          className="rounded-full px-7 py-3 text-sm"
          style={{
            backgroundColor: "#C77554",
            color: "#F6EFDE",
            fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Hold this place
        </button>
      </div>
    </article>
  );
}

function Particular({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "#8FA68E", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-sm tabular-nums"
        style={{ color: "#3D352B", fontFamily: "'Lora', 'Source Serif Pro', Georgia, serif" }}
      >
        {value}
      </p>
    </div>
  );
}
