import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// ---- Constants -------------------------------------------------------------

const PAPER = "#F4EFE4";
const PAPER_DEEP = "#EBE3D2";
const NAVY = "#1B3A5B";

// Approximate IATA codes (pre-supplied; do not fetch).
const IATA: Record<string, string> = {
  "charleston-sc": "CHS",
  "acadia-np": "BHB",
  "asheville-nc": "AVL",
  "savannah-ga": "SAV",
};

// ---- Helpers ---------------------------------------------------------------

function fmtMonthDay(iso: string): string {
  // "2026-09-12" -> "12 SEP 26"
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const [y, m, d] = iso.split("-");
  return `${d} ${months[Number(m) - 1]} ${y.slice(2)}`;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

// Deterministic pseudo-random barcode widths so SSR/CSR match.
function barcodeBars(seed: string, n: number): number[] {
  const out: number[] = [];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = 0; i < n; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const r = Math.abs(h % 1000) / 1000; // 0..1
    // Heights of bars (here as widths in horizontal, as heights in vertical)
    const w = 1 + Math.floor(r * 4); // 1..4 px
    out.push(w);
  }
  return out;
}

// ---- Sub-components --------------------------------------------------------

function Field({
  label,
  value,
  mono = true,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[9px] tracking-[0.18em] text-[#1B3A5B]/60 uppercase">
        {label}
      </div>
      <div
        className={`${
          mono ? "font-mono" : ""
        } text-[#1A1A1A] text-[15px] leading-tight mt-0.5`}
      >
        {value}
      </div>
    </div>
  );
}

function Perforation() {
  // Vertical dashed line plus two half-circle notches at top + bottom that
  // punch into the paper so the perforation reads as a real tear strip.
  return (
    <div className="relative w-0 self-stretch shrink-0" aria-hidden>
      {/* Top notch */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full"
        style={{ background: PAPER === "#F4EFE4" ? "#0a0a0a" : PAPER }}
      />
      {/* Bottom notch */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full"
        style={{ background: "#0a0a0a" }}
      />
      {/* Dashed line */}
      <div className="border-l-2 border-dashed border-[#1B3A5B]/40 h-full" />
    </div>
  );
}

function VerticalBarcode({ seed }: { seed: string }) {
  const bars = barcodeBars(seed, 64);
  return (
    <div className="flex flex-col gap-[1px] items-stretch h-full justify-center">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-[#1A1A1A]"
          style={{ height: `${w}px`, opacity: w > 2 ? 1 : 0.85 }}
        />
      ))}
    </div>
  );
}

function HorizontalBarcode({ seed }: { seed: string }) {
  const bars = barcodeBars(seed, 90);
  return (
    <div className="flex flex-row gap-[1px] items-stretch h-10">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-[#1A1A1A]"
          style={{ width: `${w}px`, opacity: w > 2 ? 1 : 0.85 }}
        />
      ))}
    </div>
  );
}

// ---- Main ticket -----------------------------------------------------------

function Ticket({
  pick,
  trip,
  index,
}: {
  pick: GalleryPick;
  trip: GalleryTrip;
  index: number;
}) {
  const dest = IATA[pick.slug] ?? pick.state;
  const seq = pad2(pick.rank);
  const flightNo = `TP${(100 + pick.rank * 27) % 1000}`;
  const recordLocator = `${dest}${pick.state}${pick.rank}X`.toUpperCase();

  return (
    <article
      className="relative shadow-[0_2px_0_rgba(0,0,0,0.04),0_24px_60px_-30px_rgba(27,58,91,0.45)]"
      style={{ background: PAPER }}
    >
      {/* Subtle paper grain via repeating gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #1B3A5B 0 1px, transparent 1px 3px)",
        }}
        aria-hidden
      />

      <div className="relative flex">
        {/* ============ LEFT MAIN ============ */}
        <div className="flex-1 min-w-0">
          {/* Airline header bar */}
          <div
            className="flex items-stretch text-[#F4EFE4]"
            style={{ background: NAVY }}
          >
            <div className="flex items-center gap-3 px-5 py-3">
              {/* Hero thumbnail acting as livery */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pick.heroPhotoUrl}
                alt=""
                className="h-10 w-10 object-cover ring-2 ring-[#F4EFE4]/80 grayscale-[15%]"
              />
              <div>
                <div className="font-mono text-[10px] tracking-[0.32em] opacity-80">
                  TRIP PLANNER
                </div>
                <div className="font-serif text-[18px] leading-none tracking-wide italic">
                  Boarding Pass
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center px-5 gap-6 border-l border-[#F4EFE4]/20">
              <div className="font-mono text-[10px] tracking-[0.2em] opacity-80 leading-tight text-right">
                <div>FLIGHT</div>
                <div className="text-[14px] tracking-[0.18em] opacity-100">
                  {flightNo}
                </div>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] opacity-80 leading-tight text-right">
                <div>PNR</div>
                <div className="text-[14px] tracking-[0.18em] opacity-100">
                  {recordLocator}
                </div>
              </div>
            </div>
          </div>

          {/* Big route */}
          <div className="px-6 pt-5 pb-3 relative">
            {/* Watermark stamp */}
            <div
              className="absolute right-6 top-6 border-2 border-[#1B3A5B]/40 text-[#1B3A5B]/40 px-3 py-1 rotate-[-8deg] font-mono text-[10px] tracking-[0.3em]"
              aria-hidden
            >
              ECON · CONFIRMED
            </div>

            <div className="flex items-end gap-5">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#1B3A5B]/70">
                  FROM
                </div>
                <div className="font-mono text-[56px] leading-none tracking-tight text-[#1A1A1A]">
                  JFK
                </div>
                <div className="text-[11px] tracking-wide text-[#1B3A5B]/70 mt-1">
                  New York · NYC Metro
                </div>
              </div>

              <div className="pb-3 flex-1 relative">
                {/* dotted plane path */}
                <div className="flex items-center gap-1 px-2">
                  <div className="flex-1 border-t border-dotted border-[#1B3A5B]/50" />
                  <span className="text-[#1B3A5B] text-lg leading-none">✈</span>
                  <div className="flex-1 border-t border-dotted border-[#1B3A5B]/50" />
                </div>
                <div className="text-center font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/60 mt-1">
                  NON-STOP
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#1B3A5B]/70">
                  TO
                </div>
                <div className="font-mono text-[56px] leading-none tracking-tight text-[#1A1A1A]">
                  {dest}
                </div>
                <div className="text-[11px] tracking-wide text-[#1B3A5B]/70 mt-1">
                  {pick.name} · {pick.region}
                </div>
              </div>
            </div>
          </div>

          {/* Passenger / metadata strip */}
          <div className="px-6 mt-2">
            <div className="border-t border-b border-[#1B3A5B]/25 py-3 grid grid-cols-12 gap-x-4 gap-y-3">
              <Field
                className="col-span-4"
                label="Passenger"
                value="GUEST / TRAVELER"
              />
              <Field
                className="col-span-2"
                label="Date"
                value={fmtMonthDay(trip.departOn)}
              />
              <Field className="col-span-2" label="Boarding" value="11:45A" />
              <Field
                className="col-span-2"
                label="Gate"
                value={`G/${trip.tripLengthDays}-DAY`}
              />
              <Field className="col-span-2" label="Seat" value={`${pad2(pick.rank)}A`} />

              <Field
                className="col-span-4"
                label="Class"
                value={`${trip.seasonHint.toUpperCase()} · ${trip.vibes
                  .slice(0, 2)
                  .join(" + ")
                  .toUpperCase()}`}
              />
              <Field className="col-span-3" label="Pace" value={trip.pace.toUpperCase()} />
              <Field
                className="col-span-3"
                label="Budget Band"
                value={trip.budgetBand}
              />
              <Field
                className="col-span-2"
                label="Return"
                value={fmtMonthDay(trip.returnOn)}
              />
            </div>
          </div>

          {/* Blurb + reasoning */}
          <div className="px-6 py-5 grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <div className="font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/70 uppercase mb-1">
                Destination Brief
              </div>
              <p className="text-[14px] leading-snug text-[#1A1A1A]">
                {pick.blurb}
              </p>

              <div className="font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/70 uppercase mt-4 mb-1">
                Why this fits
              </div>
              <p className="text-[13px] leading-snug text-[#1A1A1A]/80">
                {pick.reasoning}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {pick.matchTags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] tracking-[0.18em] uppercase border border-[#1B3A5B]/40 text-[#1B3A5B] px-2 py-[3px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-5">
              <div className="font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/70 uppercase mb-2">
                On-Ground Itinerary Hits
              </div>
              <ol className="space-y-2.5">
                {pick.attractions.slice(0, 3).map((a, i) => (
                  <li key={a.name} className="flex gap-3">
                    <span className="font-mono text-[10px] text-[#1B3A5B]/60 pt-0.5 w-5 shrink-0">
                      {pad2(i + 1)}
                    </span>
                    <div>
                      <div className="text-[13px] text-[#1A1A1A] leading-tight">
                        {a.name}
                      </div>
                      <div className="text-[11px] text-[#1B3A5B]/70 leading-snug mt-0.5">
                        {a.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Lower OCR strip */}
          <div
            className="px-6 py-2 font-mono text-[10px] tracking-[0.18em] text-[#1B3A5B]/70 border-t border-[#1B3A5B]/20 flex items-center justify-between"
            style={{ background: PAPER_DEEP }}
          >
            <span>
              &gt;&gt;TPNYC{trip.originCode}{dest}/{trip.departOn.replaceAll("-", "")}/
              {pad2(pick.rank)}A&lt;&lt;{recordLocator}&lt;&lt;
            </span>
            <span>{flightNo} · ETKT 220 {recordLocator}</span>
          </div>
        </div>

        {/* ============ PERFORATION ============ */}
        <Perforation />

        {/* ============ RIGHT STUB ============ */}
        <div
          className="w-[260px] shrink-0 flex flex-col"
          style={{ background: PAPER_DEEP }}
        >
          {/* Stub header */}
          <div
            className="px-4 py-3 text-[#F4EFE4]"
            style={{ background: NAVY }}
          >
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] tracking-[0.32em] opacity-80">
                STUB
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] opacity-80">
                {flightNo}
              </div>
            </div>
            <div className="font-mono text-[44px] leading-none mt-1">
              {seq}
            </div>
            <div className="font-mono text-[10px] tracking-[0.22em] opacity-80 mt-1">
              RANK / {pick.matchTags.length} TAGS
            </div>
          </div>

          {/* Route mini */}
          <div className="px-4 pt-3 pb-2 border-b border-dashed border-[#1B3A5B]/30">
            <div className="flex items-baseline justify-between font-mono">
              <div>
                <div className="text-[8px] tracking-[0.22em] text-[#1B3A5B]/60">
                  FROM
                </div>
                <div className="text-[20px] text-[#1A1A1A] leading-none">JFK</div>
              </div>
              <span className="text-[#1B3A5B] text-sm">→</span>
              <div className="text-right">
                <div className="text-[8px] tracking-[0.22em] text-[#1B3A5B]/60">
                  TO
                </div>
                <div className="text-[20px] text-[#1A1A1A] leading-none">
                  {dest}
                </div>
              </div>
            </div>
            <div className="font-mono text-[9px] tracking-[0.22em] text-[#1B3A5B]/60 mt-2">
              {fmtMonthDay(trip.departOn)} · {pad2(pick.rank)}A
            </div>
          </div>

          {/* Cost block */}
          <div className="px-4 py-3 border-b border-dashed border-[#1B3A5B]/30">
            <div className="font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/70 uppercase mb-2">
              Fare Breakdown
            </div>
            <dl className="font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <dt className="text-[#1B3A5B]/70">FLT</dt>
                <dd className="text-[#1A1A1A]">${pick.cost.flightUsd}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#1B3A5B]/70">LDG</dt>
                <dd className="text-[#1A1A1A]">${pick.cost.lodgingUsd}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#1B3A5B]/70">MISC</dt>
                <dd className="text-[#1A1A1A]">
                  $
                  {pick.cost.totalUsd -
                    pick.cost.flightUsd -
                    pick.cost.lodgingUsd}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#1B3A5B]/30 pt-1 mt-1">
                <dt className="text-[#1A1A1A] tracking-[0.15em]">TOTAL</dt>
                <dd className="text-[#1A1A1A]">${pick.cost.totalUsd}</dd>
              </div>
            </dl>
          </div>

          {/* Weather */}
          <div className="px-4 py-3 border-b border-dashed border-[#1B3A5B]/30">
            <div className="font-mono text-[9px] tracking-[0.25em] text-[#1B3A5B]/70 uppercase mb-1.5">
              WX / Outlook
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-[20px] text-[#1A1A1A] leading-none">
                {pick.weather.highF}°
              </span>
              <span className="text-[12px] text-[#1B3A5B]/60">
                / {pick.weather.lowF}°F
              </span>
            </div>
            <div className="text-[11px] leading-snug text-[#1A1A1A]/80 mt-1">
              {pick.weather.summary}
            </div>
          </div>

          {/* Barcode + closer */}
          <div className="px-4 py-3 flex gap-3 flex-1 min-h-[120px]">
            <div className="w-9 shrink-0">
              <VerticalBarcode seed={pick.slug + "-stub"} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[9px] tracking-[0.22em] text-[#1B3A5B]/70 uppercase">
                  E-Ticket
                </div>
                <div className="font-mono text-[11px] text-[#1A1A1A] mt-0.5 break-all">
                  {recordLocator}-{pad2(index + 1)}
                </div>
              </div>
              <div className="font-mono text-[9px] tracking-[0.18em] text-[#1B3A5B] uppercase leading-snug border-t border-[#1B3A5B]/30 pt-2">
                Boarding Pass
                <br />
                — Keep This Stub
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---- Passenger info card (for pick #1) ------------------------------------

function PassengerInfoCard({ pick, trip }: { pick: GalleryPick; trip: GalleryTrip }) {
  const dest = IATA[pick.slug] ?? pick.state;
  return (
    <section
      className="relative mt-6 shadow-[0_2px_0_rgba(0,0,0,0.04),0_18px_40px_-26px_rgba(27,58,91,0.4)]"
      style={{ background: PAPER }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #1B3A5B 0 1px, transparent 1px 3px)",
        }}
        aria-hidden
      />
      {/* Folded card header */}
      <div
        className="flex items-center justify-between px-5 py-2 text-[#F4EFE4]"
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] tracking-[0.32em] opacity-80">
            PASSENGER INFO CARD
          </div>
          <div className="font-serif italic text-[14px]">In-flight Itinerary</div>
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] opacity-80">
          JFK → {dest} · {trip.tripLengthDays} DAYS
        </div>
      </div>

      {/* Fold lines: 3 vertical dashed lines making 4 panels */}
      <div className="relative grid grid-cols-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-dashed border-[#1B3A5B]/25"
            style={{ left: `${(i + 1) * 25}%` }}
            aria-hidden
          />
        ))}
        {pick.itinerary.map((d) => (
          <div key={d.day} className="px-4 py-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#1B3A5B]/70">
                DAY
              </span>
              <span className="font-mono text-[28px] leading-none text-[#1A1A1A]">
                {pad2(d.day)}
              </span>
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#1B3A5B]/60 mt-2 uppercase">
              {fmtMonthDay(
                shiftIsoDate(trip.departOn, d.day - 1),
              )}
            </div>
            <div className="text-[13px] text-[#1A1A1A] mt-2 leading-tight">
              {d.title}
            </div>
            <div className="text-[11px] text-[#1B3A5B]/75 leading-snug mt-1.5">
              {d.description}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom strip with horizontal barcode */}
      <div
        className="px-5 py-3 border-t border-[#1B3A5B]/20 flex items-center gap-4"
        style={{ background: PAPER_DEEP }}
      >
        <div className="font-mono text-[10px] tracking-[0.22em] text-[#1B3A5B]/70 uppercase shrink-0">
          Carry With Boarding Pass
        </div>
        <div className="flex-1 overflow-hidden">
          <HorizontalBarcode seed={pick.slug + "-info"} />
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] text-[#1B3A5B]/70 shrink-0">
          IT/{dest}/{trip.tripLengthDays}D
        </div>
      </div>
    </section>
  );
}

function shiftIsoDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  const ny = date.getUTCFullYear();
  const nm = pad2(date.getUTCMonth() + 1);
  const nd = pad2(date.getUTCDate());
  return `${ny}-${nm}-${nd}`;
}

// ---- Page ------------------------------------------------------------------

export default function V10BoardingPage() {
  return (
    <main
      className="min-h-screen pb-24"
      style={{
        background:
          "radial-gradient(ellipse at top, #0d1f33 0%, #060d17 60%, #03070d 100%)",
      }}
    >
      {/* Top bar */}
      <div className="max-w-[1180px] mx-auto px-8 pt-8 flex items-center justify-between text-[#F4EFE4]/80">
        <Link
          href="/gallery"
          className="font-mono text-[11px] tracking-[0.22em] uppercase hover:text-[#F4EFE4]"
        >
          ← Back to Gallery
        </Link>
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase opacity-60">
          v10 · Boarding Pass
        </div>
      </div>

      {/* Brand block */}
      <header className="max-w-[1180px] mx-auto px-8 pt-10 pb-8 text-[#F4EFE4]">
        <div className="flex items-end justify-between gap-8 border-b border-[#F4EFE4]/15 pb-6">
          <div>
            <div className="font-mono text-[11px] tracking-[0.45em] opacity-70">
              EST. 2026 · ROUTE PLANNING DIVISION
            </div>
            <h1 className="font-serif italic text-[44px] leading-none mt-2 tracking-wide">
              Trip Planner
            </h1>
            <div className="font-mono text-[12px] tracking-[0.32em] mt-2 opacity-90">
              · NYC METRO ·
            </div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-right space-y-1 opacity-90">
            <div>
              <span className="opacity-60 mr-2">DEP</span>
              {fmtMonthDay(TRIP.departOn)}
            </div>
            <div>
              <span className="opacity-60 mr-2">RTN</span>
              {fmtMonthDay(TRIP.returnOn)}
            </div>
            <div>
              <span className="opacity-60 mr-2">PAX</span>1 · GUEST
            </div>
            <div>
              <span className="opacity-60 mr-2">FARE</span>
              {TRIP.budgetBand}
            </div>
          </div>
        </div>

        {/* Stamped meta */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="border-2 border-[#F4EFE4]/40 text-[#F4EFE4]/80 px-3 py-1 rotate-[-2deg] font-mono text-[10px] tracking-[0.3em] uppercase">
            ✦ Itinerary Issued · {fmtMonthDay("2026-04-29")} ✦
          </div>
          {TRIP.vibes.map((v) => (
            <span
              key={v}
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#F4EFE4]/70 border border-[#F4EFE4]/25 px-2 py-1"
            >
              {v}
            </span>
          ))}
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#F4EFE4]/70 border border-[#F4EFE4]/25 px-2 py-1">
            {TRIP.pace} pace
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#F4EFE4]/70 border border-[#F4EFE4]/25 px-2 py-1">
            avoid: {TRIP.dislikes}
          </span>
        </div>

        <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-[#F4EFE4]/70 font-serif italic">
          Four candidate boarding passes have been issued against your travel
          profile. Tear along the perforation; retain the right-hand stub for
          your records.
        </p>
      </header>

      {/* Tickets */}
      <section className="max-w-[1180px] mx-auto px-8 space-y-10">
        {PICKS.map((p, i) => (
          <div key={p.slug}>
            <Ticket pick={p} trip={TRIP} index={i} />
            {i === 0 ? <PassengerInfoCard pick={p} trip={TRIP} /> : null}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="max-w-[1180px] mx-auto px-8 mt-16 text-[#F4EFE4]/50 font-mono text-[10px] tracking-[0.28em] uppercase flex items-center justify-between border-t border-[#F4EFE4]/10 pt-6">
        <span>End of Itinerary · Thank you for flying Trip Planner</span>
        <span>Form 220-A · Ed. 2026</span>
      </footer>
    </main>
  );
}
