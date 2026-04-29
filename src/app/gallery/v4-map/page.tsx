import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// Pin coordinates inside the 1000x600 viewBox.
const NYC = { x: 760, y: 200 };
const PIN_COORDS: Record<string, { x: number; y: number }> = {
  "acadia-np": { x: 820, y: 170 },
  "asheville-nc": { x: 700, y: 290 },
  "charleston-sc": { x: 730, y: 340 },
  "savannah-ga": { x: 715, y: 365 },
};

// Stylized, deliberately abstracted lower-48 silhouette. Hand-authored.
const US_PATH =
  "M 92 232 L 118 198 L 156 178 L 198 168 L 244 162 L 286 168 L 322 180 L 360 188 L 398 184 L 432 174 L 470 162 L 508 156 L 548 158 L 586 168 L 622 178 L 660 188 L 698 192 L 738 196 L 770 188 L 798 178 L 824 168 L 848 174 L 870 188 L 884 210 L 880 234 L 858 248 L 836 262 L 832 286 L 854 308 L 868 332 L 858 358 L 836 376 L 808 384 L 776 388 L 744 384 L 716 380 L 690 384 L 666 396 L 644 408 L 614 412 L 584 408 L 554 398 L 522 388 L 488 380 L 452 374 L 416 376 L 382 386 L 348 396 L 312 398 L 276 388 L 244 372 L 214 354 L 188 332 L 168 308 L 152 282 L 132 260 L 108 248 L 92 232 Z";

// A simple Florida appendage so the SE coast reads.
const FLORIDA_PATH =
  "M 728 388 L 752 408 L 770 432 L 776 460 L 770 484 L 754 498 L 738 488 L 728 462 L 724 432 L 726 408 Z";

// Great Lakes-ish notch (purely decorative, suggests geography).
const LAKES_PATH =
  "M 552 198 L 590 192 L 624 198 L 644 212 L 632 226 L 600 232 L 568 226 L 548 214 Z";

function curvePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  // Quadratic curve with control point bowed outward from the midpoint.
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Perpendicular offset, scaled by distance.
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist === 0 ? 1 : dist;
  const offset = Math.min(60, dist * 0.25);
  const cx = mx + (-dy / norm) * offset;
  const cy = my + (dx / norm) * offset;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function rankColor(rank: number) {
  // Gold for #1, sepia for the rest.
  return rank === 1 ? "#b6772a" : "#8a5a2b";
}

export default function MapCentricGalleryPage() {
  const trip: GalleryTrip = TRIP;
  const picks: GalleryPick[] = [...PICKS].sort((a, b) => a.rank - b.rank);

  return (
    <main className="min-h-screen bg-[#f4ead5] text-[#3a2a18] [font-family:ui-serif,Georgia,'Times_New_Roman',serif] selection:bg-[#c5512a]/30">
      {/* Parchment grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #c2a878 0px, transparent 60%), radial-gradient(circle at 80% 90%, #b08858 0px, transparent 55%), repeating-linear-gradient(0deg, rgba(120,80,40,0.06) 0px, rgba(120,80,40,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-8">
        {/* Top header strip */}
        <header className="mb-6 flex flex-col gap-3 border-b-2 border-double border-[#8a5a2b]/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-[#8a5a2b] hover:text-[#c5512a]"
            >
              &larr; Back to gallery
            </Link>
            <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.2em] text-[#2a1c0e] sm:text-4xl">
              The {trip.seasonHint} atlas
            </h1>
            <p className="mt-1 text-sm italic text-[#6a4a28]">
              A cartographer&rsquo;s shortlist for {trip.tripLengthDays} days out of {trip.origin}.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-[#6a4a28] sm:grid-cols-4">
            <div>
              <dt className="opacity-70">Origin</dt>
              <dd className="text-[#2a1c0e]">{trip.originCode}</dd>
            </div>
            <div>
              <dt className="opacity-70">Depart</dt>
              <dd className="text-[#2a1c0e]">{trip.departOn}</dd>
            </div>
            <div>
              <dt className="opacity-70">Return</dt>
              <dd className="text-[#2a1c0e]">{trip.returnOn}</dd>
            </div>
            <div>
              <dt className="opacity-70">Budget</dt>
              <dd className="text-[#2a1c0e]">{trip.budgetBand}</dd>
            </div>
            <div>
              <dt className="opacity-70">Pace</dt>
              <dd className="text-[#2a1c0e]">{trip.pace}</dd>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <dt className="opacity-70">Vibes</dt>
              <dd className="text-[#2a1c0e]">{trip.vibes.join(" / ")}</dd>
            </div>
          </dl>
        </header>

        {/* The map */}
        <section
          aria-label="Destination map"
          className="relative h-[50vh] min-h-[420px] w-full overflow-hidden rounded-sm border border-[#8a5a2b]/50 bg-[#efe2c2] shadow-[inset_0_0_60px_rgba(120,80,40,0.25)]"
        >
          {/* Topographic line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 30% 40%, rgba(138,90,43,0.18) 0px, rgba(138,90,43,0.18) 1px, transparent 1px, transparent 14px), repeating-radial-gradient(circle at 70% 60%, rgba(138,90,43,0.14) 0px, rgba(138,90,43,0.14) 1px, transparent 1px, transparent 18px)",
            }}
          />

          {/* Compass + scale */}
          <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-[#6a4a28]">
            <svg viewBox="0 0 40 40" className="h-10 w-10">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#8a5a2b" strokeWidth="0.8" />
              <polygon points="20,4 23,20 20,17 17,20" fill="#c5512a" />
              <polygon points="20,36 23,20 20,23 17,20" fill="#3a2a18" />
              <text x="20" y="11" fontSize="6" textAnchor="middle" fill="#3a2a18" className="[font-family:ui-serif,serif]">N</text>
            </svg>
            <span>compass</span>
          </div>

          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 text-[10px] uppercase tracking-[0.25em] text-[#6a4a28]">
            <div className="flex items-center gap-2">
              <div className="h-[3px] w-24 bg-[#3a2a18]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #3a2a18 0 12px, transparent 12px 24px)" }} />
              <span>~600 mi</span>
            </div>
            <span className="italic">Plate IV &mdash; Eastern Seaboard</span>
          </div>

          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#8a5a2b" strokeWidth="0.6" opacity="0.35" />
              </pattern>
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#dfd0a8" />
                <stop offset="100%" stopColor="#c8b282" />
              </radialGradient>
              <filter id="rough" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
                <feDisplacementMap in="SourceGraphic" scale="1.2" />
              </filter>
            </defs>

            {/* Latitude / longitude grid */}
            <g stroke="#8a5a2b" strokeWidth="0.4" opacity="0.35">
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
              ))}
            </g>

            {/* US silhouette */}
            <g>
              <path d={US_PATH} fill="url(#hatch)" stroke="#3a2a18" strokeWidth="1.6" strokeLinejoin="round" />
              <path d={US_PATH} fill="#e8d6a8" opacity="0.6" />
              <path d={FLORIDA_PATH} fill="url(#hatch)" stroke="#3a2a18" strokeWidth="1.4" />
              <path d={FLORIDA_PATH} fill="#e8d6a8" opacity="0.6" />
              <path d={LAKES_PATH} fill="url(#oceanGrad)" stroke="#3a2a18" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Dotted territorial outline echo */}
            <path
              d={US_PATH}
              fill="none"
              stroke="#8a5a2b"
              strokeWidth="0.6"
              strokeDasharray="2 3"
              transform="translate(4 4)"
              opacity="0.45"
            />

            {/* Region labels (atlas-style) */}
            <g className="[font-family:ui-serif,serif]" fill="#6a4a28" opacity="0.7">
              <text x="320" y="260" fontSize="14" letterSpacing="6" textAnchor="middle">
                T H E   I N T E R I O R
              </text>
              <text x="540" y="450" fontSize="11" letterSpacing="4" textAnchor="middle">
                G U L F   O F   M E X I C O
              </text>
              <text x="900" y="360" fontSize="11" letterSpacing="4" textAnchor="middle" transform="rotate(-90 900 360)">
                A T L A N T I C   O C E A N
              </text>
            </g>

            {/* Great-circle-ish curves from NYC to each pick */}
            <g fill="none" stroke="#c5512a" strokeWidth="1.4" strokeLinecap="round">
              {picks.map((p) => {
                const to = PIN_COORDS[p.slug];
                if (!to) return null;
                return (
                  <path
                    key={p.slug}
                    d={curvePath(NYC, to)}
                    strokeDasharray="4 4"
                    opacity={0.85}
                  />
                );
              })}
            </g>

            {/* NYC origin pin */}
            <g>
              <circle cx={NYC.x} cy={NYC.y} r="14" fill="none" stroke="#1f3a5f" strokeWidth="1" opacity="0.4" />
              <circle cx={NYC.x} cy={NYC.y} r="9" fill="none" stroke="#1f3a5f" strokeWidth="1" opacity="0.6" />
              <circle cx={NYC.x} cy={NYC.y} r="5" fill="#1f3a5f" />
              <circle cx={NYC.x} cy={NYC.y} r="1.6" fill="#f4ead5" />
              <text
                x={NYC.x - 12}
                y={NYC.y - 14}
                fontSize="11"
                textAnchor="end"
                fill="#1f3a5f"
                className="[font-family:ui-serif,serif]"
                fontWeight="600"
                letterSpacing="2"
              >
                NYC &mdash; ORIGIN
              </text>
            </g>

            {/* Destination pins */}
            {picks.map((p) => {
              const c = PIN_COORDS[p.slug];
              if (!c) return null;
              const color = rankColor(p.rank);
              // Stagger labels so they don't collide with neighboring pins.
              const labelOffsets: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
                "acadia-np": { dx: 14, dy: -6, anchor: "start" },
                "asheville-nc": { dx: -14, dy: -6, anchor: "end" },
                "charleston-sc": { dx: 14, dy: 4, anchor: "start" },
                "savannah-ga": { dx: -14, dy: 14, anchor: "end" },
              };
              const lo = labelOffsets[p.slug] ?? { dx: 12, dy: -8, anchor: "start" as const };
              return (
                <g key={p.slug} className="group">
                  {/* Drop shadow halo */}
                  <circle cx={c.x} cy={c.y} r="16" fill={color} opacity="0.12" className="transition-all group-hover:opacity-25" />
                  {/* Pin teardrop */}
                  <path
                    d={`M ${c.x} ${c.y - 18} C ${c.x - 9} ${c.y - 18} ${c.x - 9} ${c.y - 4} ${c.x} ${c.y + 4} C ${c.x + 9} ${c.y - 4} ${c.x + 9} ${c.y - 18} ${c.x} ${c.y - 18} Z`}
                    fill={color}
                    stroke="#3a2a18"
                    strokeWidth="1"
                    className="transition-transform group-hover:[transform-box:fill-box] group-hover:[transform-origin:center_bottom] group-hover:scale-110"
                  />
                  {/* Rank badge inside pin */}
                  <circle cx={c.x} cy={c.y - 11} r="6" fill="#f4ead5" stroke="#3a2a18" strokeWidth="0.8" />
                  <text
                    x={c.x}
                    y={c.y - 8}
                    fontSize="9"
                    textAnchor="middle"
                    fill="#3a2a18"
                    fontWeight="700"
                    className="[font-family:ui-serif,serif]"
                  >
                    {p.rank}
                  </text>
                  {/* Label cartouche */}
                  <g transform={`translate(${c.x + lo.dx} ${c.y + lo.dy})`}>
                    <text
                      x="0"
                      y="0"
                      fontSize="12"
                      textAnchor={lo.anchor}
                      fill="#2a1c0e"
                      fontWeight="600"
                      letterSpacing="1.5"
                      className="[font-family:ui-serif,serif]"
                    >
                      {p.name.toUpperCase()}
                    </text>
                    <text
                      x="0"
                      y="12"
                      fontSize="9"
                      textAnchor={lo.anchor}
                      fill="#6a4a28"
                      letterSpacing="2"
                      className="[font-family:ui-serif,serif]"
                    >
                      {p.state}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </section>

        {/* Legend tying pins to cards */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-[#6a4a28]">
          <span className="italic normal-case tracking-normal text-[12px] text-[#3a2a18]">
            Numbered pins above correspond to the cards below.
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-[#1f3a5f]" /> origin
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-[#b6772a]" /> top pick
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-[#8a5a2b]" /> shortlist
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-[2px] w-8 bg-[#c5512a]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #c5512a 0 4px, transparent 4px 8px)" }} />
            flight path
          </span>
        </div>

        {/* Cards */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {picks.map((p) => (
            <article
              key={p.slug}
              className="relative overflow-hidden rounded-sm border border-[#8a5a2b]/60 bg-[#fbf3df] p-5 shadow-[0_2px_0_rgba(138,90,43,0.25),0_8px_20px_rgba(58,42,24,0.08)]"
            >
              {/* Corner decorations */}
              <div aria-hidden className="pointer-events-none absolute inset-2 border border-[#8a5a2b]/25" />

              <header className="flex items-start gap-4">
                {/* Rank badge */}
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#3a2a18] text-2xl font-bold"
                  style={{ background: rankColor(p.rank), color: "#f4ead5" }}
                >
                  <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-2 border-[#3a2a18] bg-[#f4ead5]" />
                  {p.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#8a5a2b]">
                    Pin {p.rank} &middot; {p.state}
                  </div>
                  <h2 className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#2a1c0e]">
                    {p.name}
                  </h2>
                  <p className="text-sm italic text-[#6a4a28]">{p.region}</p>
                </div>
              </header>

              <div className="mt-4 flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.heroPhotoUrl}
                  alt={p.name}
                  className="h-28 w-36 shrink-0 rounded-sm border border-[#8a5a2b]/50 object-cover [filter:sepia(0.25)_saturate(0.9)]"
                />
                <p className="text-[14px] leading-relaxed text-[#3a2a18]">{p.blurb}</p>
              </div>

              <div className="mt-4 border-t border-dashed border-[#8a5a2b]/50 pt-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#8a5a2b]">
                  Cartographer&rsquo;s note
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#3a2a18]">{p.reasoning}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.matchTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-[#8a5a2b]/60 bg-[#f4ead5] px-2 py-[2px] text-[10px] uppercase tracking-[0.18em] text-[#6a4a28]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-sm border border-[#8a5a2b]/40 bg-[#f4ead5] p-2">
                  <dt className="uppercase tracking-[0.22em] text-[#8a5a2b] text-[9px]">Cost</dt>
                  <dd className="mt-0.5 font-semibold text-[#2a1c0e]">${p.cost.totalUsd.toLocaleString()}</dd>
                  <dd className="text-[10px] text-[#6a4a28]">
                    fl ${p.cost.flightUsd} &middot; lo ${p.cost.lodgingUsd}
                  </dd>
                </div>
                <div className="rounded-sm border border-[#8a5a2b]/40 bg-[#f4ead5] p-2">
                  <dt className="uppercase tracking-[0.22em] text-[#8a5a2b] text-[9px]">Weather</dt>
                  <dd className="mt-0.5 font-semibold text-[#2a1c0e]">
                    {p.weather.highF}&deg; / {p.weather.lowF}&deg;
                  </dd>
                  <dd className="text-[10px] text-[#6a4a28]">{p.weather.summary}</dd>
                </div>
                <div className="rounded-sm border border-[#8a5a2b]/40 bg-[#f4ead5] p-2">
                  <dt className="uppercase tracking-[0.22em] text-[#8a5a2b] text-[9px]">Bearing</dt>
                  <dd className="mt-0.5 font-semibold text-[#2a1c0e]">
                    {bearing(NYC, PIN_COORDS[p.slug] ?? NYC)}
                  </dd>
                  <dd className="text-[10px] text-[#6a4a28]">from NYC</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#8a5a2b]">Attractions</div>
                <ul className="mt-1 space-y-1">
                  {p.attractions.map((a) => (
                    <li key={a.name} className="text-[13px] text-[#3a2a18]">
                      <span className="font-semibold text-[#2a1c0e]">{a.name}.</span>{" "}
                      <span className="text-[#5a4228]">{a.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {p.rank === 1 && (
                <div className="mt-4 rounded-sm border border-[#8a5a2b]/50 bg-[#f4ead5] p-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#c5512a]">
                    Recommended itinerary &mdash; {p.name}
                  </div>
                  <ol className="mt-2 space-y-2">
                    {p.itinerary.map((d) => (
                      <li key={d.day} className="flex gap-3 text-[13px]">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8a5a2b] bg-[#fbf3df] text-[11px] font-bold text-[#3a2a18]">
                          {d.day}
                        </span>
                        <div>
                          <div className="font-semibold uppercase tracking-[0.08em] text-[#2a1c0e]">
                            {d.title}
                          </div>
                          <div className="text-[12px] leading-relaxed text-[#5a4228]">
                            {d.description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {p.rank !== 1 && (
                <details className="group/itin mt-4 rounded-sm border border-dashed border-[#8a5a2b]/50 bg-[#f4ead5]/60 p-3 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.3em] text-[#8a5a2b] hover:text-[#c5512a]">
                    Day-by-day for {p.name} &rarr;
                  </summary>
                  <ol className="mt-2 space-y-1.5">
                    {p.itinerary.map((d) => (
                      <li key={d.day} className="text-[12px] text-[#3a2a18]">
                        <span className="font-semibold">Day {d.day} &mdash; {d.title}.</span>{" "}
                        <span className="text-[#5a4228]">{d.description}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </article>
          ))}
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t-2 border-double border-[#8a5a2b]/60 pt-6 text-[11px] uppercase tracking-[0.25em] text-[#6a4a28] sm:flex-row sm:items-center sm:justify-between">
          <span className="italic normal-case tracking-normal">
            Plate IV. Drawn from {trip.origin}, {trip.seasonHint} of 2026.
          </span>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-[#8a5a2b] hover:text-[#c5512a]"
          >
            &larr; Back to gallery
          </Link>
        </footer>
      </div>
    </main>
  );
}

// Compute a rough cardinal bearing from origin to destination in our flipped
// SVG coordinate space (y grows downward).
function bearing(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y; // positive dy = south
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = N, 90 = E
  const norm = (angle + 360) % 360;
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(norm / 22.5) % 16;
  return dirs[idx];
}
