import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v24 — Wine × Champagne / Boutique Hotel Concierge
// Palette:
//   Wine red   #5E1A2C  (accent — rank, hairlines, CTA, italic accents)
//   Champagne  #E8D8A6  (ribbons, inset panels, pills)
//   Blush      #EFD6CD  (primary paper / page ground)
//   Ink        #2A1A1F  (primary text)
//   Soft cream #FAF1E6  (card surfaces, layered paper)
//
// Design language: Boutique-hotel concierge brochure — NoMad / Belmond in-room compendium.
// Warm-light luxury. Photography-led, restrained wine accents.

const DISPLAY_SERIF = "'Playfair Display', 'Cormorant', Georgia, serif";
const BODY_SANS = "'Inter', system-ui, sans-serif";

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

function romanOf(rank: number): string {
  return ROMAN[rank - 1] ?? String(rank);
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function WineChampagnePage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "#EFD6CD", fontFamily: BODY_SANS }}
    >
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-6 pt-8 sm:px-10">
        <Link
          href="/gallery"
          className="inline-block text-[11px] uppercase tracking-[0.22em] text-[#2A1A1F] transition-opacity hover:opacity-60"
          style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
        >
          &larr;&nbsp; Return to library
        </Link>
      </div>

      {/* Masthead */}
      <Masthead trip={TRIP} />

      {/* Picks */}
      <section className="mx-auto max-w-4xl px-6 pb-20 sm:px-10">
        {PICKS.map((pick, i) => (
          <div key={pick.slug}>
            <PickCard pick={pick} />
            {i < PICKS.length - 1 && <Divider />}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#5E1A2C]/20 py-8 text-center">
        <p
          className="text-[12px] text-[#2A1A1F]/55 tracking-[0.08em]"
          style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic" }}
        >
          A study from the concierge desk &mdash; visual only.
        </p>
      </footer>
    </main>
  );
}

/* ─── Masthead ─────────────────────────────────────────────────── */

function Masthead({ trip }: { trip: GalleryTrip }) {
  const vibeStr = trip.vibes.join(", ");
  return (
    <header
      className="mx-auto max-w-4xl px-6 py-14 text-center sm:px-10 sm:py-20"
    >
      {/* Eyebrow */}
      <p
        className="text-[10px] uppercase tracking-[0.32em] text-[#5E1A2C]"
        style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
      >
        Volume&nbsp;04&nbsp;&middot;&nbsp;Autumn Compendium
      </p>

      {/* Headline */}
      <h1
        className="mt-5 text-[42px] leading-[1.12] text-[#2A1A1F] sm:text-[58px]"
        style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 700 }}
      >
        Quietly: four propositions.
      </h1>

      {/* Hairline */}
      <div className="mx-auto mt-8 h-px w-24 bg-[#5E1A2C]/30" />

      {/* Metadata strip */}
      <p
        className="mt-6 text-[11px] uppercase tracking-[0.18em] text-[#2A1A1F]/70"
        style={{ fontFamily: BODY_SANS, fontWeight: 400 }}
      >
        {trip.origin}
        <span className="mx-3 text-[#5E1A2C]">&middot;</span>
        {formatDate(trip.departOn)} &ndash; {formatDate(trip.returnOn)}
        <span className="mx-3 text-[#5E1A2C]">&middot;</span>
        {vibeStr}
        <span className="mx-3 text-[#5E1A2C]">&middot;</span>
        {trip.budgetBand}
        <span className="mx-3 text-[#5E1A2C]">&middot;</span>
        {trip.pace} pace
      </p>
    </header>
  );
}

/* ─── Pick card ─────────────────────────────────────────────────── */

function PickCard({ pick }: { pick: GalleryPick }) {
  const roman = romanOf(pick.rank);

  return (
    <article
      className="relative overflow-hidden rounded-sm"
      style={{ background: "#FAF1E6" }}
    >
      {/* Champagne ribbon — top-left folio tag */}
      <div
        className="absolute left-0 top-0 z-10 px-5 py-2"
        style={{ background: "#E8D8A6" }}
      >
        <span
          className="text-[13px] text-[#5E1A2C]"
          style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 600 }}
        >
          no.&nbsp;{roman}.
        </span>
      </div>

      {/* Hero photo with 1px wine hairline frame */}
      <div className="p-5 pt-10">
        <div
          className="overflow-hidden"
          style={{ outline: "1px solid #5E1A2C" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name}`}
            className="block h-[340px] w-full object-cover sm:h-[440px]"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-8 pb-10 sm:px-12">
        {/* Destination name + region */}
        <div className="mt-2 border-b border-[#5E1A2C]/15 pb-5">
          <h2
            className="text-[36px] leading-[1.1] text-[#2A1A1F] sm:text-[46px]"
            style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 700 }}
          >
            {pick.name}
          </h2>
          <p
            className="mt-1.5 text-[10px] uppercase tracking-[0.26em] text-[#5E1A2C]"
            style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
          >
            {pick.region}
          </p>
        </div>

        {/* Blurb */}
        <p
          className="mt-6 text-[15px] leading-[1.75] text-[#2A1A1F]"
          style={{ fontFamily: BODY_SANS, fontWeight: 400 }}
        >
          {pick.blurb}
        </p>

        {/* WHY inset panel */}
        <div
          className="mt-7 rounded-sm px-6 py-5"
          style={{ background: "#E8D8A6" }}
        >
          <p
            className="text-[13px] text-[#5E1A2C]"
            style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 600 }}
          >
            Why
          </p>
          <p
            className="mt-2 text-[14px] leading-[1.7] text-[#2A1A1F]"
            style={{ fontFamily: BODY_SANS, fontWeight: 400 }}
          >
            {pick.reasoning}
          </p>
        </div>

        {/* Match tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {pick.matchTags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm px-3 py-1 text-[11px] tracking-[0.1em] text-[#2A1A1F]"
              style={{
                background: "#E8D8A6",
                border: "1px solid #5E1A2C",
                fontFamily: BODY_SANS,
                fontWeight: 400,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Particulars: weather + cost */}
        <div className="mt-8 grid grid-cols-1 gap-px border border-[#5E1A2C]/20 sm:grid-cols-2">
          {/* Weather */}
          <div className="p-5" style={{ background: "#FAF1E6" }}>
            <p
              className="text-[9px] uppercase tracking-[0.3em] text-[#5E1A2C]"
              style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
            >
              Weather
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
                >
                  High
                </span>
                <span
                  className="tabular-nums text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS }}
                >
                  {pick.weather.highF}&deg; F
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
                >
                  Low
                </span>
                <span
                  className="tabular-nums text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS }}
                >
                  {pick.weather.lowF}&deg; F
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
                >
                  Conditions
                </span>
                <span
                  className="text-right text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS, maxWidth: "55%" }}
                >
                  {pick.weather.summary}
                </span>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div
            className="border-t border-[#5E1A2C]/20 p-5 sm:border-l sm:border-t-0"
            style={{ background: "#FAF1E6" }}
          >
            <p
              className="text-[9px] uppercase tracking-[0.3em] text-[#5E1A2C]"
              style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
            >
              Estimated Cost
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
                >
                  Flights
                </span>
                <span
                  className="tabular-nums text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS }}
                >
                  {formatMoney(pick.cost.flightUsd)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500 }}
                >
                  Lodging
                </span>
                <span
                  className="tabular-nums text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS }}
                >
                  {formatMoney(pick.cost.lodgingUsd)}
                </span>
              </div>
              <div
                className="flex justify-between border-t border-[#5E1A2C]/20 pt-2 text-[13px]"
                style={{ marginTop: "8px" }}
              >
                <span
                  className="text-[#5E1A2C]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
                >
                  Total
                </span>
                <span
                  className="tabular-nums text-[#2A1A1F]"
                  style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
                >
                  {formatMoney(pick.cost.totalUsd)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attractions */}
        <div className="mt-8">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-[#2A1A1F]/60"
            style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
          >
            Not to be missed
          </p>
          <ol className="mt-4 space-y-4">
            {pick.attractions.map((a, i) => (
              <li key={a.name} className="flex gap-4">
                <span
                  className="mt-0.5 w-5 flex-none text-[14px] text-[#5E1A2C]"
                  style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 600 }}
                >
                  {ROMAN[i]}.
                </span>
                <div>
                  <p
                    className="text-[14px] text-[#2A1A1F]"
                    style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
                  >
                    {a.name}
                  </p>
                  <p
                    className="mt-0.5 text-[13px] leading-[1.65] text-[#2A1A1F]/70"
                    style={{ fontFamily: BODY_SANS, fontWeight: 400 }}
                  >
                    {a.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Itinerary */}
        <div className="mt-8">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-[#2A1A1F]/60"
            style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
          >
            Four-day shape
          </p>
          <div className="mt-4 space-y-3">
            {pick.itinerary.map((d, i) => (
              <div key={d.day} className="flex gap-4">
                {/* Champagne day ribbon */}
                <div
                  className="flex-none px-3 py-2 text-center"
                  style={{ background: "#E8D8A6", minWidth: "64px" }}
                >
                  <span
                    className="block text-[12px] text-[#5E1A2C]"
                    style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic", fontWeight: 600 }}
                  >
                    Day&nbsp;{ROMAN[i]}.
                  </span>
                </div>
                <div className="py-2">
                  <p
                    className="text-[13px] text-[#2A1A1F]"
                    style={{ fontFamily: BODY_SANS, fontWeight: 600 }}
                  >
                    {d.title}
                  </p>
                  <p
                    className="mt-0.5 text-[13px] leading-[1.65] text-[#2A1A1F]/65"
                    style={{ fontFamily: BODY_SANS, fontWeight: 400 }}
                  >
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-9">
          <button
            type="button"
            className="rounded-md px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-[#FAF1E6] transition-opacity hover:opacity-80"
            style={{ background: "#5E1A2C", fontFamily: BODY_SANS, fontWeight: 500 }}
          >
            Reserve concierge
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Divider ───────────────────────────────────────────────────── */

function Divider() {
  return (
    <div className="my-10 flex items-center gap-0">
      <div className="flex-1 border-t border-[#E8D8A6]" />
      <span
        className="px-5 text-[18px] text-[#5E1A2C]"
        style={{ fontFamily: DISPLAY_SERIF, fontStyle: "italic" }}
      >
        &sect;
      </span>
      <div className="flex-1 border-t border-[#E8D8A6]" />
    </div>
  );
}
