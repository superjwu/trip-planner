import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

const serif = {
  fontFamily:
    "'Garamond', 'EB Garamond', 'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  fontFeatureSettings: "'liga' 1, 'kern' 1",
};

function formatDateRange(trip: GalleryTrip) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  const year = new Date(trip.returnOn).getFullYear();
  return `${fmt(trip.departOn)} – ${fmt(trip.returnOn)}, ${year}`;
}

function MetaDot() {
  return (
    <span
      aria-hidden
      className="inline-block h-[3px] w-[3px] rounded-full bg-[#8B6F4E]/60 mx-3 align-middle"
    />
  );
}

function MoneyLine({ pick }: { pick: GalleryPick }) {
  return (
    <span className="tabular-nums">
      ${pick.cost.totalUsd.toLocaleString()}
      <span className="text-[#8B6F4E]/70"> all in</span>
    </span>
  );
}

function WeatherLine({ pick }: { pick: GalleryPick }) {
  return (
    <span className="tabular-nums">
      {pick.weather.highF}° / {pick.weather.lowF}°
      <span className="text-[#8B6F4E]/70"> · {pick.weather.summary}</span>
    </span>
  );
}

function HeroPick({ pick }: { pick: GalleryPick }) {
  return (
    <section className="relative w-full">
      <figure className="relative w-full h-[60vh] min-h-[480px] overflow-hidden">
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* soft gradient anchoring the overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/55 via-[#1A1614]/10 to-transparent"
        />

        {/* tiny hint at the top — rank + region */}
        <div className="absolute top-8 left-8 right-8 flex items-start justify-between text-[#F8F5F0]">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]">
            <span className="tabular-nums">01</span>
            <span className="h-px w-8 bg-[#F8F5F0]/60" />
            <span>The pick</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#F8F5F0]/85">
            {pick.region}
          </div>
        </div>

        {/* floating editorial card, bottom-left */}
        <figcaption className="absolute bottom-8 left-8 right-8 sm:right-auto sm:max-w-xl">
          <div className="bg-[#F8F5F0]/95 backdrop-blur-sm border border-[#E8E3DA] p-7 sm:p-9">
            <div className="flex items-baseline justify-between mb-4">
              <span
                className="text-[11px] uppercase tracking-[0.32em] text-[#8B6F4E]"
                style={serif}
              >
                Pick · 01
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#8B6F4E]/80">
                {pick.state}
              </span>
            </div>
            <h2
              className="text-[44px] sm:text-[56px] leading-[0.95] text-[#1A1614] tracking-[-0.01em]"
              style={serif}
            >
              {pick.name}
            </h2>
            <p className="mt-5 text-[14px] leading-[1.7] text-[#1A1614]/85">
              {pick.reasoning}
            </p>

            <div className="mt-7 pt-5 border-t border-[#E8E3DA] grid grid-cols-2 gap-5 text-[12px] text-[#1A1614]/80">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#8B6F4E] mb-1.5">
                  Estimated
                </div>
                <MoneyLine pick={pick} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#8B6F4E] mb-1.5">
                  Weather
                </div>
                <WeatherLine pick={pick} />
              </div>
            </div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

function PickCard({ pick }: { pick: GalleryPick }) {
  const rankLabel = String(pick.rank).padStart(2, "0");
  return (
    <article className="flex flex-col">
      <figure className="relative w-full aspect-[4/5] overflow-hidden bg-[#E8E3DA]">
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.28em] text-[#F8F5F0] mix-blend-difference">
          {rankLabel}
        </div>
      </figure>

      <div className="pt-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="text-[26px] leading-tight text-[#1A1614] tracking-[-0.01em]"
            style={serif}
          >
            {pick.name}
          </h3>
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#8B6F4E] whitespace-nowrap">
            {pick.state}
          </span>
        </div>

        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8B6F4E]/90">
          {pick.region}
        </div>

        <p className="text-[13.5px] leading-[1.7] text-[#1A1614]/80">
          {pick.blurb}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          {pick.matchTags.map((t) => (
            <span
              key={t}
              className="text-[11px] uppercase tracking-[0.18em] text-[#1A1614]/55"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-2 pt-4 border-t border-[#E8E3DA] flex items-center justify-between text-[12px] text-[#1A1614]/75">
          <MoneyLine pick={pick} />
          <span className="tabular-nums text-[#1A1614]/65">
            {pick.weather.highF}° / {pick.weather.lowF}°
          </span>
        </div>
      </div>
    </article>
  );
}

export default function V8PremiumGalleryPage() {
  const hero = PICKS.find((p) => p.rank === 1) ?? PICKS[0];
  const rest = PICKS.filter((p) => p.slug !== hero.slug).sort(
    (a, b) => a.rank - b.rank,
  );

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#1A1614] font-sans antialiased">
      {/* Top bar — quiet wordmark + back link */}
      <header className="px-6 sm:px-10 lg:px-14 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/gallery"
            className="text-[11px] uppercase tracking-[0.28em] text-[#1A1614]/70 hover:text-[#1A1614] transition-colors"
          >
            ← Gallery
          </Link>
          <div
            className="text-[12px] tracking-[0.3em] uppercase text-[#8B6F4E]"
            style={serif}
          >
            Atelier · Trips
          </div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#1A1614]/50">
            v8 · Premium
          </div>
        </div>
      </header>

      {/* Trip header */}
      <section className="px-6 sm:px-10 lg:px-14 pt-10 pb-14 max-w-[1400px]">
        <div className="text-[11px] uppercase tracking-[0.32em] text-[#8B6F4E] mb-6">
          A curated four-day shortlist
        </div>
        <h1
          className="text-[56px] sm:text-[80px] lg:text-[104px] leading-[0.92] tracking-[-0.02em] text-[#1A1614]"
          style={serif}
        >
          Your trip,
          <br />
          <span className="italic text-[#8B6F4E]">fall 2026.</span>
        </h1>

        <div className="mt-10 pt-6 border-t border-[#E8E3DA] flex flex-wrap items-center text-[12px] text-[#1A1614]/75 tracking-[0.04em]">
          <span>
            <span className="uppercase tracking-[0.22em] text-[#8B6F4E] mr-2">
              From
            </span>
            {TRIP.origin}
          </span>
          <MetaDot />
          <span>
            <span className="uppercase tracking-[0.22em] text-[#8B6F4E] mr-2">
              When
            </span>
            {formatDateRange(TRIP)}
          </span>
          <MetaDot />
          <span>
            <span className="uppercase tracking-[0.22em] text-[#8B6F4E] mr-2">
              Vibes
            </span>
            {TRIP.vibes.join(", ")}
          </span>
          <MetaDot />
          <span>
            <span className="uppercase tracking-[0.22em] text-[#8B6F4E] mr-2">
              Budget
            </span>
            {TRIP.budgetBand}
          </span>
          <MetaDot />
          <span>
            <span className="uppercase tracking-[0.22em] text-[#8B6F4E] mr-2">
              Pace
            </span>
            {TRIP.pace}
          </span>
        </div>
      </section>

      {/* Hero pick */}
      <HeroPick pick={hero} />

      {/* Section bridge */}
      <section className="px-6 sm:px-10 lg:px-14 pt-24 pb-10 max-w-[1400px]">
        <div className="flex items-end justify-between gap-8 border-b border-[#E8E3DA] pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#8B6F4E] mb-3">
              Also considered
            </div>
            <h2
              className="text-[36px] sm:text-[44px] leading-[1] tracking-[-0.01em] text-[#1A1614]"
              style={serif}
            >
              Three quieter alternates.
            </h2>
          </div>
          <div className="hidden sm:block max-w-sm text-[13px] leading-[1.7] text-[#1A1614]/70">
            Each one is shoulder-season honest — short flights from {TRIP.originCode},
            small crowds, real food.
          </div>
        </div>
      </section>

      {/* Picks grid 2–4 */}
      <section className="px-6 sm:px-10 lg:px-14 pb-28 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-16">
          {rest.map((p) => (
            <PickCard key={p.slug} pick={p} />
          ))}
        </div>
      </section>

      {/* Itinerary preview for hero */}
      <section className="bg-[#EFEAE1] border-t border-[#E8E3DA]">
        <div className="px-6 sm:px-10 lg:px-14 py-24 max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.32em] text-[#8B6F4E] mb-4">
              A preview itinerary
            </div>
            <h2
              className="text-[40px] sm:text-[52px] leading-[0.98] tracking-[-0.01em] text-[#1A1614]"
              style={serif}
            >
              Four days in
              <br />
              <span className="italic">{hero.name}.</span>
            </h2>
            <p className="mt-6 text-[13.5px] leading-[1.75] text-[#1A1614]/75 max-w-sm">
              An unhurried sketch — built for {TRIP.pace} pace, edited around
              {" "}
              {TRIP.dislikes}.
            </p>

            <div className="mt-10 pt-6 border-t border-[#D9D2C5] text-[12px] text-[#1A1614]/70">
              <div className="flex justify-between py-2">
                <span className="uppercase tracking-[0.22em] text-[#8B6F4E]">
                  Flight
                </span>
                <span className="tabular-nums">
                  ${hero.cost.flightUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-[#D9D2C5]">
                <span className="uppercase tracking-[0.22em] text-[#8B6F4E]">
                  Lodging
                </span>
                <span className="tabular-nums">
                  ${hero.cost.lodgingUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-[#D9D2C5] text-[#1A1614]">
                <span className="uppercase tracking-[0.22em]">Total</span>
                <span className="tabular-nums">
                  ${hero.cost.totalUsd.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-8 flex flex-col">
            {hero.itinerary.map((day, idx) => (
              <li
                key={day.day}
                className={`grid grid-cols-12 gap-6 py-8 ${
                  idx === 0 ? "" : "border-t border-[#D9D2C5]"
                }`}
              >
                <div className="col-span-2 sm:col-span-1">
                  <span
                    className="text-[28px] tabular-nums text-[#8B6F4E]"
                    style={serif}
                  >
                    {String(day.day).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-10 sm:col-span-11">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#8B6F4E]/80 mb-2">
                    Day {day.day}
                  </div>
                  <h3
                    className="text-[24px] sm:text-[28px] leading-tight text-[#1A1614] tracking-[-0.005em]"
                    style={serif}
                  >
                    {day.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.75] text-[#1A1614]/75 max-w-2xl">
                    {day.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 lg:px-14 py-14 border-t border-[#E8E3DA]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-[1400px]">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.28em] text-[#1A1614]/80 hover:text-[#1A1614] transition-colors"
          >
            <span className="inline-block h-px w-10 bg-[#8B6F4E] group-hover:w-14 transition-all" />
            Back to gallery
          </Link>
          <div
            className="text-[11px] uppercase tracking-[0.3em] text-[#8B6F4E]"
            style={serif}
          >
            Compiled with care · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}
