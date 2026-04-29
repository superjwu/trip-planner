import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v17 — Forest Cabin / Ranger Station
// Palette: Forest green #1F3A2C, Warm cream #F1E8D5, Rust #B5563A,
//          Mossy gold #C9A664, Smoke #3D352B
// Design language: National-park ranger station meets analog field notebook.
// Badge stamps, kraft-paper textures, trail-marker aesthetics.

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const DISPLAY_FONT = "'Bebas Neue', 'Oswald', 'Impact', sans-serif";
const MONO_FONT = "'IBM Plex Mono', ui-monospace, monospace";
const BODY_FONT = "'Lora', Georgia, serif";

// Rotation angles for rank badges — restrained, not scrapbook
const BADGE_ROTATIONS = [6, -5, 7, -4];
// Rotation for hero photos (taped-in snapshot feel)
const PHOTO_ROTATIONS = [-1.5, 1.2, -0.8, 1.8];

export default function ForestCabinGalleryPage() {
  return (
    <main
      className="min-h-screen text-[#3D352B]"
      style={{
        background:
          "radial-gradient(ellipse at 20% 10%, #EDE0C8 0%, transparent 55%), " +
          "radial-gradient(ellipse at 80% 80%, #D8CDB8 0%, transparent 50%), " +
          "linear-gradient(160deg, #F1E8D5 0%, #EAE0CC 40%, #E2D6BE 100%)",
      }}
    >
      {/* Subtle topo-line paper texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 28px, #3D352B 28px, #3D352B 29px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-[#3D352B]/60 hover:text-[#3D352B] transition-colors"
          style={{ fontFamily: MONO_FONT }}
        >
          <span aria-hidden>&#8592;</span>
          <span>all directions</span>
        </Link>

        {/* Masthead — ranger-station bulletin board */}
        <Masthead trip={TRIP} />

        {/* Field log entries */}
        <section className="mt-12 space-y-0">
          {PICKS.map((pick, i) => (
            <FieldLogEntry
              key={pick.slug}
              pick={pick}
              badgeRotation={BADGE_ROTATIONS[i] ?? 5}
              photoRotation={PHOTO_ROTATIONS[i] ?? -1}
              isLast={i === PICKS.length - 1}
            />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p
            className="text-xs tracking-[0.25em] text-[#3D352B]/40 uppercase"
            style={{ fontFamily: MONO_FONT, fontVariant: "small-caps" }}
          >
            MOCK LAYOUT &middot; NO REAL DATA
          </p>
          <p
            className="mt-1 text-xs text-[#3D352B]/30"
            style={{ fontFamily: MONO_FONT }}
          >
            v17 &mdash; Forest Cabin Field Guide
          </p>
        </footer>
      </div>
    </main>
  );
}

function Masthead({ trip }: { trip: GalleryTrip }) {
  return (
    <section
      className="mt-8 overflow-hidden rounded-sm"
      style={{
        boxShadow: "0 6px 32px -8px rgba(31,58,44,0.35), 0 2px 8px -2px rgba(31,58,44,0.2)",
      }}
    >
      {/* Green header band */}
      <div
        className="bg-[#1F3A2C] px-8 py-7"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 100% 0%, rgba(201,166,100,0.12) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 0% 100%, rgba(201,166,100,0.08) 0%, transparent 50%)",
        }}
      >
        {/* Top rule */}
        <div className="mb-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#C9A664]/40" />
          <span
            className="text-[10px] tracking-[0.3em] text-[#C9A664]/70 uppercase"
            style={{ fontFamily: MONO_FONT }}
          >
            FALL FIELD GUIDE 2026
          </span>
          <div className="h-px flex-1 bg-[#C9A664]/40" />
        </div>

        {/* Main title */}
        <h1
          className="text-center text-[#F1E8D5] leading-none"
          style={{ fontFamily: DISPLAY_FONT, fontSize: "clamp(2.2rem, 6vw, 3.8rem)", letterSpacing: "0.06em" }}
        >
          FOUR DESTINATIONS
        </h1>
        <div className="mt-1 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-[#C9A664]/50" />
          <span
            className="text-[#C9A664] text-sm tracking-[0.2em]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            RANGER STATION BULLETIN
          </span>
          <div className="h-px w-16 bg-[#C9A664]/50" />
        </div>

        {/* Bottom rule */}
        <div className="mt-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#C9A664]/40" />
          <div
            className="h-2 w-2 rotate-45 bg-[#C9A664]/60"
            aria-hidden
          />
          <div className="h-px flex-1 bg-[#C9A664]/40" />
        </div>
      </div>

      {/* Metadata strip — monospace trail-register style */}
      <div
        className="bg-[#1F3A2C]/90 border-t border-[#C9A664]/20 px-8 py-5"
        style={{ fontFamily: MONO_FONT }}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 text-xs tabular-nums">
          <MetaCell label="ORIGIN" value={`${trip.origin} (${trip.originCode})`} />
          <MetaCell label="DEPART" value={formatDate(trip.departOn)} />
          <MetaCell label="RETURN" value={formatDate(trip.returnOn)} />
          <MetaCell label="DURATION" value={`${trip.tripLengthDays} DAYS`} />
          <MetaCell label="VIBES" value={trip.vibes.map(v => v.toUpperCase()).join(" / ")} />
          <MetaCell label="BUDGET" value={trip.budgetBand} />
          <MetaCell label="PACE" value={trip.pace.toUpperCase()} />
          <MetaCell label="AVOID" value={trip.dislikes} />
        </div>
      </div>
    </section>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#C9A664]/60 text-[10px] tracking-[0.15em] uppercase">{label}</p>
      <p className="text-[#F1E8D5]/80 mt-0.5 leading-tight">{value}</p>
    </div>
  );
}

function FieldLogEntry({
  pick,
  badgeRotation,
  photoRotation,
  isLast,
}: {
  pick: GalleryPick;
  badgeRotation: number;
  photoRotation: number;
  isLast: boolean;
}) {
  return (
    <>
      <article
        className="relative bg-[#F1E8D5] rounded-sm overflow-visible"
        style={{
          boxShadow: "0 4px 24px -8px rgba(31,58,44,0.2), 0 1px 4px rgba(31,58,44,0.1)",
          backgroundImage:
            "radial-gradient(ellipse at 95% 5%, rgba(201,166,100,0.08) 0%, transparent 40%)",
        }}
      >
        {/* Header strip — destination name + region */}
        <div className="bg-[#1F3A2C] px-6 py-4 flex items-center justify-between gap-4 relative overflow-hidden">
          {/* Subtle grain texture on header */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #F1E8D5, #F1E8D5 1px, transparent 1px, transparent 6px)",
            }}
            aria-hidden
          />
          <div className="relative">
            <h2
              className="text-[#F1E8D5] leading-none"
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                letterSpacing: "0.05em",
              }}
            >
              {pick.name.toUpperCase()}
            </h2>
            <p
              className="text-[#C9A664] mt-0.5 text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: MONO_FONT }}
            >
              {pick.region}
            </p>
          </div>
          {/* Region label right side */}
          <div
            className="hidden sm:block text-right"
            style={{ fontFamily: MONO_FONT }}
          >
            <p className="text-[#F1E8D5]/40 text-[10px] tracking-[0.15em]">FIELD ENTRY</p>
            <p className="text-[#C9A664]/70 text-[11px] mt-0.5">#{String(pick.rank).padStart(2, "0")}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
            {/* Left column: rank badge + photo */}
            <div className="flex flex-col items-center gap-6 lg:items-start">
              {/* Rank badge stamp */}
              <div className="relative">
                <div
                  className="relative flex items-center justify-center rounded-full bg-[#F1E8D5] border-[3px] border-[#B5563A]"
                  style={{
                    width: 80,
                    height: 80,
                    transform: `rotate(${badgeRotation}deg)`,
                    boxShadow:
                      "0 2px 12px rgba(181,86,58,0.25), inset 0 0 0 2px rgba(181,86,58,0.15)",
                  }}
                >
                  {/* Inner ring */}
                  <div
                    className="absolute inset-[6px] rounded-full border border-[#B5563A]/40"
                    aria-hidden
                  />
                  <span
                    className="text-[#B5563A] relative z-10"
                    style={{
                      fontFamily: DISPLAY_FONT,
                      fontSize: "2rem",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {pick.rank}
                  </span>
                </div>
                {/* Stamp arc label */}
                <p
                  className="text-center text-[#B5563A]/70 text-[9px] tracking-[0.2em] mt-1.5 uppercase"
                  style={{ fontFamily: MONO_FONT }}
                >
                  PICK
                </p>
              </div>

              {/* Hero photo — taped into notebook */}
              <div
                className="bg-white p-2 pb-6 shadow-[4px_6px_20px_rgba(61,53,43,0.25)]"
                style={{
                  transform: `rotate(${photoRotation}deg)`,
                  maxWidth: 220,
                  width: "100%",
                }}
              >
                <img
                  src={pick.heroPhotoUrl}
                  alt={`${pick.name} hero`}
                  className="w-full object-cover"
                  style={{ height: 160, display: "block" }}
                />
                {/* Caption strip */}
                <p
                  className="text-center text-[#3D352B]/50 text-[9px] tracking-[0.12em] mt-2 uppercase"
                  style={{ fontFamily: MONO_FONT }}
                >
                  {pick.name} &mdash; {pick.state}
                </p>
              </div>

              {/* Match tags */}
              <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                {pick.matchTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block border border-[#3D352B]/30 text-[#3D352B]/70 px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase rounded-sm"
                    style={{ fontFamily: MONO_FONT }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column: all text content */}
            <div className="space-y-6 min-w-0">
              {/* Blurb */}
              <p
                className="text-[#3D352B] text-base leading-relaxed"
                style={{ fontFamily: BODY_FONT }}
              >
                {pick.blurb}
              </p>

              {/* Field Notes box — reasoning */}
              <div
                className="border border-dashed border-[#3D352B]/30 rounded-sm p-4"
                style={{
                  background: "rgba(61,53,43,0.04)",
                }}
              >
                <p
                  className="text-[10px] tracking-[0.25em] text-[#3D352B]/50 uppercase mb-2"
                  style={{ fontFamily: MONO_FONT }}
                >
                  FIELD NOTES
                </p>
                <p
                  className="text-[#3D352B]/80 text-sm leading-relaxed"
                  style={{ fontFamily: BODY_FONT, fontStyle: "italic" }}
                >
                  {pick.reasoning}
                </p>
              </div>

              {/* Trail Data strip — weather + costs */}
              <div className="rounded-sm overflow-hidden border border-[#1F3A2C]/15">
                {/* Header */}
                <div className="bg-[#1F3A2C]/10 px-4 py-2 border-b border-[#1F3A2C]/15">
                  <p
                    className="text-[10px] tracking-[0.25em] text-[#1F3A2C] uppercase"
                    style={{ fontFamily: MONO_FONT }}
                  >
                    TRAIL DATA
                  </p>
                </div>
                <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ fontFamily: MONO_FONT }}>
                  {/* Weather */}
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-[#3D352B]/50 uppercase mb-2">WEATHER / SEPT</p>
                    <div className="space-y-1 text-xs tabular-nums text-[#3D352B]">
                      <div className="flex justify-between gap-4">
                        <span className="text-[#3D352B]/60">HIGH</span>
                        <span className="font-medium">{pick.weather.highF}&deg; F</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[#3D352B]/60">LOW</span>
                        <span className="font-medium">{pick.weather.lowF}&deg; F</span>
                      </div>
                      <div className="mt-2 text-[#3D352B]/70 text-[11px] leading-snug">{pick.weather.summary}</div>
                    </div>
                  </div>
                  {/* Costs */}
                  <div className="sm:border-l sm:border-[#1F3A2C]/10 sm:pl-4">
                    <p className="text-[9px] tracking-[0.2em] text-[#3D352B]/50 uppercase mb-2">COST REGISTER</p>
                    <div className="space-y-1 text-xs tabular-nums text-[#3D352B]">
                      <div className="flex justify-between gap-4">
                        <span className="text-[#3D352B]/60">FLIGHT</span>
                        <span>{formatMoney(pick.cost.flightUsd)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[#3D352B]/60">LODGING</span>
                        <span>{formatMoney(pick.cost.lodgingUsd)}</span>
                      </div>
                      <div className="mt-1 flex justify-between gap-4 border-t border-[#3D352B]/15 pt-1.5">
                        <span className="text-[#3D352B] font-medium">TOTAL</span>
                        <span
                          className="text-[#B5563A] font-medium"
                        >
                          {formatMoney(pick.cost.totalUsd)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-column: Points of Interest + Itinerary */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-5">
                {/* Points of Interest — clipboard sidebar */}
                <div
                  className="rounded-sm border border-[#C9A664]/40 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(175deg, #F4EBD8 0%, #EDE2CB 100%)",
                  }}
                >
                  {/* Clipboard clip */}
                  <div className="flex items-center justify-center pt-3 pb-1">
                    <div
                      className="w-10 h-4 rounded-full bg-[#C9A664]/40 border border-[#C9A664]/60"
                      aria-hidden
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <p
                      className="text-[10px] tracking-[0.25em] text-[#3D352B]/50 uppercase mb-3"
                      style={{ fontFamily: MONO_FONT }}
                    >
                      POINTS OF INTEREST
                    </p>
                    <ul className="space-y-3">
                      {pick.attractions.map((a, idx) => (
                        <li key={a.name} className="flex gap-2.5">
                          {/* Trail marker dot */}
                          <span
                            className="flex-none mt-0.5 w-5 h-5 rounded-full bg-[#1F3A2C] flex items-center justify-center text-[#F1E8D5] text-[9px] font-bold"
                            style={{ fontFamily: MONO_FONT }}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p
                              className="text-[#3D352B] text-xs font-semibold leading-snug"
                              style={{ fontFamily: BODY_FONT }}
                            >
                              {a.name}
                            </p>
                            <p
                              className="text-[#3D352B]/60 text-[11px] leading-snug mt-0.5"
                              style={{ fontFamily: BODY_FONT }}
                            >
                              {a.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Itinerary — 4-day field log */}
                <div>
                  <p
                    className="text-[10px] tracking-[0.25em] text-[#3D352B]/50 uppercase mb-3"
                    style={{ fontFamily: MONO_FONT }}
                  >
                    {pick.itinerary.length}-DAY FIELD LOG
                  </p>
                  <ol className="space-y-3">
                    {pick.itinerary.map((d) => (
                      <li key={d.day} className="flex gap-3">
                        {/* Mossy-gold day roundel */}
                        <div className="flex-none flex flex-col items-center">
                          <span
                            className="w-7 h-7 rounded-full bg-[#C9A664] flex items-center justify-center text-[#1F3A2C] text-xs font-bold leading-none"
                            style={{ fontFamily: MONO_FONT }}
                          >
                            {d.day}
                          </span>
                          {/* Dotted trail line connecting days */}
                          {d.day < pick.itinerary.length && (
                            <div
                              className="mt-1 w-px flex-1 min-h-[16px]"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(to bottom, #C9A664 0px, #C9A664 3px, transparent 3px, transparent 7px)",
                              }}
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className="pb-3 min-w-0">
                          <p
                            className="text-[#3D352B] text-xs font-semibold leading-snug"
                            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.05em", fontSize: "0.8rem" }}
                          >
                            {d.title.toUpperCase()}
                          </p>
                          <p
                            className="text-[#3D352B]/70 text-[12px] leading-snug mt-0.5"
                            style={{ fontFamily: BODY_FONT }}
                          >
                            {d.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Topo-line / dotted-trail divider between picks */}
      {!isLast && (
        <div className="relative flex items-center justify-center py-6" aria-hidden>
          <div
            className="absolute inset-x-0 top-1/2 h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #C9A664 0px, #C9A664 6px, transparent 6px, transparent 12px)",
            }}
          />
          {/* Center diamond marker */}
          <div
            className="relative z-10 w-3 h-3 rotate-45 bg-[#F1E8D5] border-2 border-[#C9A664]"
          />
        </div>
      )}
    </>
  );
}
