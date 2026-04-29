import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

const ACCENT = "#FF3D00";

function fmtDate(iso: string) {
  // 2026-09-12 -> 09.12.26
  const [y, m, d] = iso.split("-");
  return `${m}.${d}.${y.slice(2)}`;
}

function pad(n: number, width = 3) {
  return String(n).padStart(width, "0");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] border-b-[2px] border-black">
      <div
        className="border-r-[2px] border-black px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
        style={accent ? { background: ACCENT, color: "#000" } : { background: "#000", color: "#fff" }}
      >
        {label}
      </div>
      <div className="px-3 py-2 text-[13px] uppercase tracking-[0.05em]">{value}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border-[2px] border-black px-2 py-[2px] text-[10px] uppercase tracking-[0.15em] mr-2 mb-2">
      [{children}]
    </span>
  );
}

function HeaderBand({ trip }: { trip: GalleryTrip }) {
  return (
    <header className="border-b-[4px] border-black">
      {/* Top metadata bar */}
      <div className="flex items-center justify-between border-b-[2px] border-black bg-black text-white px-4 py-1 text-[10px] uppercase tracking-[0.25em]">
        <span>{"// TRIP_PLANNER.GALLERY"}</span>
        <span>VARIANT 02 / 10 — BRUTALIST</span>
        <span>FILE NO. {pad(20260429, 8)}</span>
      </div>

      {/* Masthead */}
      <div className="grid grid-cols-12 border-b-[2px] border-black">
        <div className="col-span-8 border-r-[2px] border-black px-4 pt-4 pb-2">
          <div className="text-[10px] uppercase tracking-[0.3em] mb-2">
            ▸ DEPARTS {fmtDate(trip.departOn)} &nbsp;//&nbsp; RETURNS {fmtDate(trip.returnOn)} &nbsp;//&nbsp;{" "}
            {trip.tripLengthDays} DAYS
          </div>
          <h1 className="text-[88px] leading-[0.85] font-black uppercase tracking-[-0.04em]">
            DESTINATION<br />REPORT
          </h1>
          <div className="mt-3 text-[11px] uppercase tracking-[0.2em]">
            FROM <span className="px-1" style={{ background: ACCENT }}>{trip.origin}</span> ({trip.originCode})
            &nbsp;→&nbsp; 4 CANDIDATES
          </div>
        </div>
        <div className="col-span-4 flex flex-col">
          <div
            className="flex-1 border-b-[2px] border-black px-4 py-3"
            style={{ background: ACCENT }}
          >
            <div className="text-[10px] uppercase tracking-[0.25em]">
              {"// REC.RANK 1"}
            </div>
            <div className="text-[44px] leading-[0.9] font-black uppercase tracking-[-0.03em] mt-1">
              CHARLES<br />TON
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] mt-1">$1,240 / 4 NIGHTS</div>
          </div>
          <div className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] bg-white">
            ISSUED 04.29.26 &nbsp;//&nbsp; ED.001 &nbsp;//&nbsp; PRICE: $0.00
          </div>
        </div>
      </div>

      {/* Trip metadata rows */}
      <div className="grid grid-cols-2">
        <div className="border-r-[2px] border-black">
          <Row label="ORIGIN" value={`${trip.origin} / ${trip.originCode}`} />
          <Row label="DATES" value={`${fmtDate(trip.departOn)} → ${fmtDate(trip.returnOn)}`} />
          <Row label="LENGTH" value={`${trip.tripLengthDays} NIGHTS`} />
          <Row label="SEASON" value={trip.seasonHint} />
        </div>
        <div>
          <Row label="VIBES" value={trip.vibes.map((v) => `[${v.toUpperCase()}]`).join(" ")} accent />
          <Row label="BUDGET" value={trip.budgetBand} />
          <Row label="PACE" value={trip.pace} />
          <Row label="DISLIKES" value={trip.dislikes} />
        </div>
      </div>
    </header>
  );
}

function CostBar({ pick }: { pick: GalleryPick }) {
  const flightPct = (pick.cost.flightUsd / pick.cost.totalUsd) * 100;
  const lodgingPct = (pick.cost.lodgingUsd / pick.cost.totalUsd) * 100;
  const otherPct = 100 - flightPct - lodgingPct;
  const otherUsd = pick.cost.totalUsd - pick.cost.flightUsd - pick.cost.lodgingUsd;
  return (
    <div>
      <div className="flex border-[2px] border-black h-[18px]">
        <div className="border-r-[2px] border-black" style={{ width: `${flightPct}%`, background: "#000" }} />
        <div
          className="border-r-[2px] border-black"
          style={{ width: `${lodgingPct}%`, background: ACCENT }}
        />
        <div style={{ width: `${otherPct}%`, background: "#fff" }} />
      </div>
      <div className="mt-2 grid grid-cols-3 text-[10px] uppercase tracking-[0.15em]">
        <div className="border-r-[2px] border-black pr-2">
          <div className="opacity-60">FLIGHT</div>
          <div className="text-[14px] font-black">${pick.cost.flightUsd}</div>
        </div>
        <div className="border-r-[2px] border-black px-2">
          <div className="opacity-60">LODGING</div>
          <div className="text-[14px] font-black">${pick.cost.lodgingUsd}</div>
        </div>
        <div className="pl-2">
          <div className="opacity-60">OTHER</div>
          <div className="text-[14px] font-black">${otherUsd}</div>
        </div>
      </div>
    </div>
  );
}

function PickCard({ pick }: { pick: GalleryPick }) {
  const isLead = pick.rank === 1;
  return (
    <article className="border-b-[4px] border-black">
      {/* Card top strip */}
      <div className="flex items-stretch border-b-[2px] border-black bg-black text-white">
        <div
          className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] border-r-[2px] border-white"
          style={{ background: ACCENT, color: "#000" }}
        >
          {`// REC.RANK ${pad2(pick.rank)}`}
        </div>
        <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] border-r-[2px] border-white">
          [{pad(pick.rank)}]
        </div>
        <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] border-r-[2px] border-white">
          ID.{pick.slug.toUpperCase()}
        </div>
        <div className="flex-1" />
        <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em]">
          STATE / {pick.state}
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* Hero + numeral */}
        <div className="col-span-5 border-r-[2px] border-black relative">
          <img
            src={pick.heroPhotoUrl}
            alt={pick.name}
            className="w-full h-[420px] object-cover grayscale contrast-125"
          />
          <div
            className="absolute top-0 left-0 px-3 py-1 text-[10px] uppercase tracking-[0.25em] border-r-[2px] border-b-[2px] border-black"
            style={{ background: ACCENT, color: "#000" }}
          >
            ▸ HERO IMG // {pick.slug}.jpg
          </div>
          <div className="absolute bottom-0 right-0 leading-none">
            <div
              className="text-[180px] font-black tracking-[-0.06em] px-2"
              style={{
                color: "#fff",
                WebkitTextStroke: "2px #000",
                mixBlendMode: "difference",
              }}
            >
              {pad2(pick.rank)}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t-[2px] border-black bg-white px-3 py-1 flex justify-between text-[10px] uppercase tracking-[0.2em]">
            <span>WX / {pick.weather.highF}°F H · {pick.weather.lowF}°F L</span>
            <span>{pick.weather.summary}</span>
          </div>
        </div>

        {/* Main info */}
        <div className="col-span-7">
          {/* Name + region */}
          <div className="border-b-[2px] border-black px-4 pt-4 pb-3">
            <div className="text-[10px] uppercase tracking-[0.3em] mb-1">
              {`// CANDIDATE ${pad2(pick.rank)} OF 04`}
            </div>
            <h2
              className="font-black uppercase tracking-[-0.04em] leading-[0.85]"
              style={{ fontSize: isLead ? "84px" : "64px" }}
            >
              {pick.name.toUpperCase()}
            </h2>
            <div className="mt-2 text-[11px] uppercase tracking-[0.2em]">
              ▸ {pick.region}
            </div>
          </div>

          {/* Blurb + reasoning */}
          <div className="grid grid-cols-2 border-b-[2px] border-black">
            <div className="border-r-[2px] border-black px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.25em] mb-2 inline-block px-1" style={{ background: "#000", color: "#fff" }}>
                §01 BLURB
              </div>
              <p className="text-[13px] leading-[1.4]">{pick.blurb}</p>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.25em] mb-2 inline-block px-1" style={{ background: ACCENT, color: "#000" }}>
                §02 WHY THIS
              </div>
              <p className="text-[13px] leading-[1.4]">{pick.reasoning}</p>
            </div>
          </div>

          {/* Match tags */}
          <div className="border-b-[2px] border-black px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.25em] mb-2">
              {`// MATCH.TAGS [${pick.matchTags.length}]`}
            </div>
            <div>
              {pick.matchTags.map((t) => (
                <Chip key={t}>{t.toUpperCase()}</Chip>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="border-b-[2px] border-black px-4 py-3">
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-[10px] uppercase tracking-[0.25em]">
                {"// EST.COST.USD"}
              </div>
              <div className="text-[34px] font-black tracking-[-0.03em] leading-none">
                ${pick.cost.totalUsd.toLocaleString()}
              </div>
            </div>
            <CostBar pick={pick} />
          </div>

          {/* Attractions */}
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.25em] mb-2">
              {`// ATTRACTIONS [${pick.attractions.length}]`}
            </div>
            <ol className="space-y-2">
              {pick.attractions.map((a, i) => (
                <li
                  key={a.name}
                  className="grid grid-cols-[40px_1fr] border-[2px] border-black"
                >
                  <div
                    className="border-r-[2px] border-black flex items-center justify-center text-[14px] font-black"
                    style={{ background: i === 0 ? ACCENT : "#fff" }}
                  >
                    {pad2(i + 1)}
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-[12px] font-black uppercase tracking-[0.05em]">{a.name}</div>
                    <div className="text-[11px] leading-[1.3] mt-[2px]">{a.description}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="border-t-[2px] border-black">
        <div
          className="px-4 py-2 border-b-[2px] border-black text-[10px] uppercase tracking-[0.3em]"
          style={{ background: "#000", color: "#fff" }}
        >
          {`// ITINERARY.LOG - ${pick.itinerary.length} ENTRIES - SUBJ: ${pick.name.toUpperCase()}`}
        </div>
        <div className="grid grid-cols-4">
          {pick.itinerary.map((d, i) => (
            <div
              key={d.day}
              className={`px-3 py-3 ${i < pick.itinerary.length - 1 ? "border-r-[2px] border-black" : ""}`}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <div
                  className="text-[10px] uppercase tracking-[0.25em] px-1"
                  style={{ background: ACCENT }}
                >
                  DAY {pad2(d.day)}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                  {pad(d.day)}/{pad(pick.itinerary.length)}
                </div>
              </div>
              <div className="text-[13px] font-black uppercase tracking-[0.02em] leading-[1.1]">
                {d.title}
              </div>
              <div className="text-[11px] leading-[1.35] mt-1">{d.description}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function BrutalistGalleryPage() {
  return (
    <main className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white">
      {/* Top utility nav */}
      <nav className="flex items-center justify-between border-b-[2px] border-black px-4 py-2 text-[10px] uppercase tracking-[0.25em] bg-white">
        <Link
          href="/gallery"
          className="border-[2px] border-black px-3 py-1 hover:bg-black hover:text-white"
        >
          ◂◂ BACK / GALLERY
        </Link>
        <div className="hidden md:flex gap-2">
          <span className="border-[2px] border-black px-2 py-1">SECTION A</span>
          <span className="border-[2px] border-black px-2 py-1">04 PICKS</span>
          <span
            className="border-[2px] border-black px-2 py-1"
            style={{ background: ACCENT }}
          >
            {"// SYS.OK"}
          </span>
        </div>
        <div>REV. 2026.04.29</div>
      </nav>

      <HeaderBand trip={TRIP} />

      {/* Section divider */}
      <div className="flex items-center justify-between border-b-[2px] border-black px-4 py-2 bg-white text-[10px] uppercase tracking-[0.3em]">
        <span>§ SECTION B — CANDIDATES</span>
        <span className="flex gap-3">
          <span>RANKED 01 → 04</span>
          <span style={{ background: ACCENT }} className="px-1">SORT: REC.SCORE DESC</span>
        </span>
      </div>

      {/* Picks */}
      <section>
        {PICKS.map((p) => (
          <PickCard key={p.slug} pick={p} />
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t-[2px] border-black">
        <div className="grid grid-cols-12">
          <div className="col-span-8 border-r-[2px] border-black px-4 py-6">
            <div className="text-[10px] uppercase tracking-[0.3em] mb-2">
              {"// END.OF.REPORT"}
            </div>
            <div className="text-[44px] font-black uppercase tracking-[-0.04em] leading-[0.9]">
              NO SOFT EDGES.<br />NO GRADIENTS.<br />NO APOLOGIES.
            </div>
          </div>
          <div className="col-span-4 flex flex-col">
            <div
              className="px-4 py-3 border-b-[2px] border-black text-[10px] uppercase tracking-[0.25em]"
              style={{ background: ACCENT }}
            >
              FILE / GALLERY/V2-BRUTALIST/PAGE.TSX
            </div>
            <div className="px-4 py-3 border-b-[2px] border-black text-[10px] uppercase tracking-[0.25em]">
              BUILT WITH NEXT 16 // TAILWIND 4
            </div>
            <Link
              href="/gallery"
              className="px-4 py-3 text-[10px] uppercase tracking-[0.25em] bg-black text-white hover:bg-white hover:text-black"
            >
              ◂◂ RETURN TO GALLERY INDEX
            </Link>
          </div>
        </div>
        <div className="bg-black text-white px-4 py-1 flex justify-between text-[10px] uppercase tracking-[0.3em]">
          <span>© 2026 TRIP_PLANNER.GALLERY</span>
          <span>EOF — {pad(20260429, 8)}</span>
        </div>
      </footer>
    </main>
  );
}
