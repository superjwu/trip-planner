import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";

export default function SwissGalleryPage() {
  const departDate = formatDate(TRIP.departOn);
  const returnDate = formatDate(TRIP.returnOn);

  return (
    <main className="min-h-screen bg-[#FAFAF7] font-sans text-[#0A0A0A] antialiased">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        {/* TOP BAR — running header, like a printed report */}
        <div className="grid grid-cols-12 gap-4 border-b border-[#0A0A0A] pb-4 text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A]">
          <div className="col-span-3">Trip Planner / Gallery</div>
          <div className="col-span-6 text-center text-[#9A9A95]">
            Variant 07 &nbsp;/&nbsp; Swiss International Typographic
          </div>
          <div className="col-span-3 text-right tabular-nums">
            {todayIso()} &nbsp;/&nbsp; pp. 01–05
          </div>
        </div>

        {/* HEADER */}
        <header className="grid grid-cols-12 gap-4 pt-16">
          <div className="col-span-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
              Trip / 001
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.18em]">
              Filed&nbsp;{departDate}
            </div>
          </div>
          <div className="col-span-9">
            <h1 className="text-[88px] font-light leading-[0.92] tracking-[-0.03em]">
              Four destinations,
              <br />
              eastern seaboard,
              <br />
              <span className="text-[#9A9A95]">autumn 2026.</span>
            </h1>
          </div>
        </header>

        {/* META ROW — small caps tabular */}
        <section className="mt-16 grid grid-cols-12 gap-4 border-t border-b border-[#0A0A0A] py-6 text-[11px] uppercase tracking-[0.16em]">
          <MetaCell label="Origin" value={`${TRIP.origin} (${TRIP.originCode})`} span="col-span-3" />
          <MetaCell label="Depart" value={departDate} span="col-span-2" />
          <MetaCell label="Return" value={returnDate} span="col-span-2" />
          <MetaCell label="Length" value={`${TRIP.tripLengthDays} days`} span="col-span-1" />
          <MetaCell label="Pace" value={TRIP.pace} span="col-span-2" />
          <MetaCell label="Budget" value={TRIP.budgetBand} span="col-span-2" />
        </section>

        {/* SECONDARY META */}
        <section className="mt-4 grid grid-cols-12 gap-4 text-[11px] uppercase tracking-[0.16em]">
          <MetaCell label="Vibes" value={TRIP.vibes.join(" / ")} span="col-span-5" />
          <MetaCell label="Season" value={TRIP.seasonHint} span="col-span-2" />
          <MetaCell label="Avoid" value={TRIP.dislikes} span="col-span-5" />
        </section>

        {/* INDEX */}
        <section className="mt-24">
          <div className="grid grid-cols-12 gap-4 border-b border-[#0A0A0A] pb-3 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
            <div className="col-span-1">No.</div>
            <div className="col-span-4">Destination</div>
            <div className="col-span-4">Region</div>
            <div className="col-span-2 text-right">Total USD</div>
            <div className="col-span-1 text-right">Page</div>
          </div>
          {PICKS.map((p, i) => (
            <div
              key={p.slug}
              className="grid grid-cols-12 gap-4 border-b border-[#9A9A95]/40 py-3 text-[13px] tabular-nums"
            >
              <div className="col-span-1 text-[#9A9A95]">{pad(p.rank)}</div>
              <div className="col-span-4 font-medium tracking-[-0.01em]">{p.name}</div>
              <div className="col-span-4 text-[#9A9A95]">{p.region}</div>
              <div className="col-span-2 text-right">${p.cost.totalUsd.toLocaleString()}</div>
              <div className="col-span-1 text-right text-[#9A9A95]">
                {String(i + 2).padStart(2, "0")}
              </div>
            </div>
          ))}
        </section>

        {/* PICK BLOCKS */}
        <section className="mt-32 space-y-32">
          {PICKS.map((p, i) => (
            <PickBlock key={p.slug} pick={p} pageNumber={i + 2} />
          ))}
        </section>

        {/* COLOPHON / FOOTER */}
        <footer className="mt-32 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-6 text-[10px] uppercase tracking-[0.18em]">
          <div className="col-span-4">
            <div className="text-[#9A9A95]">Document</div>
            <div className="mt-2">Trip Planner / Variant 07</div>
          </div>
          <div className="col-span-4 text-center">
            <div className="text-[#9A9A95]">Set in</div>
            <div className="mt-2">Inter / Helvetica Neue</div>
          </div>
          <div className="col-span-4 text-right">
            <div className="text-[#9A9A95]">Return</div>
            <div className="mt-2">
              <Link href="/gallery" className="underline decoration-[#0A0A0A] underline-offset-4 hover:text-[#9A9A95]">
                /gallery
              </Link>
            </div>
          </div>
        </footer>

        {/* END MARK */}
        <div className="mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          <span className="block h-px w-16 bg-[#9A9A95]" />
          End of document
          <span className="block h-px flex-1 bg-[#9A9A95]" />
        </div>
      </div>
    </main>
  );
}

function MetaCell({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span: string;
}) {
  return (
    <div className={span}>
      <div className="text-[#9A9A95]">{label}</div>
      <div className="mt-2 text-[#0A0A0A]">{value}</div>
    </div>
  );
}

function PickBlock({ pick, pageNumber }: { pick: GalleryPick; pageNumber: number }) {
  const flightPct = Math.round((pick.cost.flightUsd / pick.cost.totalUsd) * 100);
  const lodgingPct = Math.round((pick.cost.lodgingUsd / pick.cost.totalUsd) * 100);
  const otherUsd = pick.cost.totalUsd - pick.cost.flightUsd - pick.cost.lodgingUsd;
  const otherPct = 100 - flightPct - lodgingPct;

  return (
    <article className="grid grid-cols-12 gap-4">
      {/* Folio strip */}
      <div className="col-span-12 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-4 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
        <div className="col-span-1 tabular-nums text-[#0A0A0A]">{pad(pick.rank)}</div>
        <div className="col-span-7">{pick.region}</div>
        <div className="col-span-4 text-right tabular-nums">
          p. {String(pageNumber).padStart(2, "0")}
        </div>
      </div>

      {/* Title row */}
      <div className="col-span-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">Rank</div>
        <div className="mt-2 text-[40px] font-light leading-none tabular-nums">
          {pad(pick.rank)}
        </div>
      </div>
      <div className="col-span-7">
        <h2 className="text-[80px] font-light leading-[0.92] tracking-[-0.03em]">
          {pick.name}
        </h2>
        <div className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#9A9A95]">
          {pick.region} &nbsp;/&nbsp; {pick.state}
        </div>
      </div>
      <div className="col-span-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          Match
        </div>
        <div className="mt-2 text-[13px] leading-[1.5]">
          {pick.matchTags.join(" · ")}
        </div>
      </div>

      {/* Hero photo — full width, no rounding */}
      <div className="col-span-12 mt-8">
        <img
          src={pick.heroPhotoUrl}
          alt={pick.name}
          className="block h-[480px] w-full object-cover"
        />
        <div className="mt-2 grid grid-cols-12 gap-4 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          <div className="col-span-1 tabular-nums">Fig. {pad(pick.rank)}</div>
          <div className="col-span-7">{pick.name}, {pick.state}</div>
          <div className="col-span-4 text-right">Source / Unsplash</div>
        </div>
      </div>

      {/* Body grid — blurb + reasoning */}
      <div className="col-span-12 mt-12 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-8">
        <div className="col-span-1 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          §1
        </div>
        <div className="col-span-3 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          Précis
        </div>
        <p className="col-span-8 text-[20px] font-light leading-[1.4] tracking-[-0.01em]">
          {pick.blurb}
        </p>
      </div>

      <div className="col-span-12 mt-8 grid grid-cols-12 gap-4">
        <div className="col-span-1 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          §2
        </div>
        <div className="col-span-3 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          Reasoning
        </div>
        <p className="col-span-8 text-[14px] leading-[1.6] text-[#0A0A0A]">
          {pick.reasoning}
        </p>
      </div>

      {/* Cost / weather table */}
      <div className="col-span-12 mt-16 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-8">
        {/* Cost column */}
        <div className="col-span-7">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
            §3 &nbsp;/&nbsp; Cost breakdown
          </div>
          <table className="mt-4 w-full border-collapse text-[13px] tabular-nums">
            <thead>
              <tr className="border-b border-[#0A0A0A] text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
                <th className="py-2 text-left font-normal">Line item</th>
                <th className="py-2 text-right font-normal">USD</th>
                <th className="py-2 text-right font-normal">%</th>
                <th className="py-2 pl-8 text-left font-normal">Bar</th>
              </tr>
            </thead>
            <tbody>
              <CostRow label="Flight" usd={pick.cost.flightUsd} pct={flightPct} />
              <CostRow label="Lodging" usd={pick.cost.lodgingUsd} pct={lodgingPct} />
              <CostRow label="On-ground" usd={otherUsd} pct={otherPct} />
              <tr className="border-t border-[#0A0A0A]">
                <td className="py-3 text-[11px] uppercase tracking-[0.16em]">Total</td>
                <td className="py-3 text-right text-[16px]">
                  ${pick.cost.totalUsd.toLocaleString()}
                </td>
                <td className="py-3 text-right">100</td>
                <td className="py-3 pl-8" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Weather column */}
        <div className="col-span-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
            §4 &nbsp;/&nbsp; Climate
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-b border-[#9A9A95]/40 pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
                High
              </div>
              <div className="mt-2 text-[40px] font-light leading-none tabular-nums">
                {pick.weather.highF}
                <span className="text-[16px] text-[#9A9A95]">°F</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
                Low
              </div>
              <div className="mt-2 text-[40px] font-light leading-none tabular-nums">
                {pick.weather.lowF}
                <span className="text-[16px] text-[#9A9A95]">°F</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[13px] leading-[1.5]">
            {pick.weather.summary}
          </div>
        </div>
      </div>

      {/* Attractions */}
      <div className="col-span-12 mt-16 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-8">
        <div className="col-span-1 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          §5
        </div>
        <div className="col-span-3 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          Notable points
        </div>
        <div className="col-span-8 grid grid-cols-3 gap-8">
          {pick.attractions.map((a, idx) => (
            <div key={a.name} className="border-t border-[#0A0A0A] pt-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#9A9A95] tabular-nums">
                {String(idx + 1).padStart(2, "0")} / {String(pick.attractions.length).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[18px] font-light leading-[1.15] tracking-[-0.01em]">
                {a.name}
              </div>
              <p className="mt-2 text-[12px] leading-[1.5] text-[#0A0A0A]">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div className="col-span-12 mt-16 grid grid-cols-12 gap-4 border-t border-[#0A0A0A] pt-8">
        <div className="col-span-1 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          §6
        </div>
        <div className="col-span-3 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
          Itinerary
        </div>
        <div className="col-span-8">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#0A0A0A] text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
                <th className="w-[60px] py-2 text-left font-normal">Day</th>
                <th className="w-[260px] py-2 text-left font-normal">Title</th>
                <th className="py-2 text-left font-normal">Notes</th>
              </tr>
            </thead>
            <tbody>
              {pick.itinerary.map((d) => (
                <tr key={d.day} className="border-b border-[#9A9A95]/40 align-top">
                  <td className="py-4 tabular-nums">{pad(d.day)}</td>
                  <td className="py-4 pr-8 font-medium tracking-[-0.01em]">
                    {d.title}
                  </td>
                  <td className="py-4 leading-[1.6] text-[#0A0A0A]">
                    {d.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tag strip — running tags as plain typographic line */}
      <div className="col-span-12 mt-12 border-t border-[#0A0A0A] pt-4 text-[10px] uppercase tracking-[0.18em] text-[#9A9A95]">
        Tags / {pick.tags.join(" · ")}
      </div>
    </article>
  );
}

function CostRow({ label, usd, pct }: { label: string; usd: number; pct: number }) {
  return (
    <tr className="border-b border-[#9A9A95]/40">
      <td className="py-3">{label}</td>
      <td className="py-3 text-right">${usd.toLocaleString()}</td>
      <td className="py-3 text-right">{pct}</td>
      <td className="py-3 pl-8">
        <div className="relative h-px w-full bg-[#9A9A95]/40">
          <div
            className="absolute left-0 top-0 h-px bg-[#0A0A0A]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </td>
    </tr>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDate(iso: string) {
  // YYYY-MM-DD → "12 Sep 2026"
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${String(d).padStart(2, "0")} ${months[m - 1]} ${y}`;
}

function todayIso() {
  return "2026-04-29";
}
