import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

const serifDisplay = { fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Didot', 'Bodoni 72', Georgia, serif" };
const serifText = { fontFamily: "'EB Garamond', 'Cormorant Garamond', Georgia, serif" };
const sansSmallcaps = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

function formatDateRange(trip: GalleryTrip) {
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  const year = new Date(trip.departOn + "T00:00:00").getFullYear();
  return `${fmt(trip.departOn)} – ${fmt(trip.returnOn)}, ${year}`;
}

function IssueMeta({ trip }: { trip: GalleryTrip }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#1a1a1a] pb-4 text-[#1a1a1a]">
      <span
        className="text-[10px] uppercase tracking-[0.45em]"
        style={sansSmallcaps}
      >
        The Wanderer&nbsp;&nbsp;·&nbsp;&nbsp;Vol. IV, No. 09
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.45em]"
        style={sansSmallcaps}
      >
        Autumn Edition · MMXXVI
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.45em]"
        style={sansSmallcaps}
      >
        $14.00 · {trip.originCode}
      </span>
    </div>
  );
}

function RuleLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[#1a1a1a]" />
      <span
        className="text-[10px] uppercase tracking-[0.45em] text-[#1a1a1a]"
        style={sansSmallcaps}
      >
        {children}
      </span>
      <span className="h-px flex-1 bg-[#1a1a1a]" />
    </div>
  );
}

function MatchTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {tags.map((t, i) => (
        <span
          key={t}
          className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
          style={sansSmallcaps}
        >
          {i > 0 && <span className="mr-4 text-[#b8a98a]">/</span>}
          {t}
        </span>
      ))}
    </div>
  );
}

function HeroPick({ pick, trip }: { pick: GalleryPick; trip: GalleryTrip }) {
  const dropCap = pick.blurb.charAt(0);
  const restBlurb = pick.blurb.slice(1);

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-[#1a1a1a] pt-10">
      {/* Numeral + label */}
      <div className="col-span-12 flex items-end justify-between md:col-span-12">
        <div className="flex items-baseline gap-6">
          <span
            className="text-[140px] leading-[0.85] tracking-[-0.04em] text-[#1a1a1a] md:text-[200px]"
            style={serifDisplay}
          >
            01
          </span>
          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] uppercase tracking-[0.5em] text-[#7a6a4a]"
              style={sansSmallcaps}
            >
              The Cover Story
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.4em] text-[#1a1a1a]"
              style={sansSmallcaps}
            >
              {pick.region}
            </span>
          </div>
        </div>
        <span
          className="hidden text-[10px] uppercase tracking-[0.4em] text-[#7a6a4a] md:block"
          style={sansSmallcaps}
        >
          Folio · 12
        </span>
      </div>

      {/* Hero photo */}
      <figure className="col-span-12 md:col-span-8">
        <img
          src={pick.heroPhotoUrl}
          alt={pick.name}
          className="h-[480px] w-full object-cover md:h-[620px]"
        />
        <figcaption
          className="mt-3 flex items-baseline justify-between text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
          style={sansSmallcaps}
        >
          <span>Plate I · {pick.name}, photographed September</span>
          <span className="text-[#b8a98a]">— The Wanderer</span>
        </figcaption>
      </figure>

      {/* Right column: title block + blurb */}
      <div className="col-span-12 md:col-span-4">
        <div
          className="text-[11px] uppercase tracking-[0.4em] text-[#7a6a4a]"
          style={sansSmallcaps}
        >
          Destination, Recommended
        </div>
        <h2
          className="mt-3 text-[88px] font-light leading-[0.88] tracking-[-0.025em] text-[#1a1a1a] md:text-[120px]"
          style={serifDisplay}
        >
          {pick.name}.
        </h2>
        <div className="mt-6 h-px w-16 bg-[#1a1a1a]" />
        <p
          className="mt-6 text-[19px] italic leading-[1.45] text-[#2a2a2a]"
          style={serifText}
        >
          “Antebellum row houses, oyster bars, and the Battery at golden hour —
          a walkable Southern food capital that quiets down after Labor Day.”
        </p>
      </div>

      {/* Body copy with drop cap */}
      <div className="col-span-12 grid grid-cols-12 gap-x-6 md:col-span-12">
        <div className="col-span-12 md:col-span-2">
          <div
            className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            Why Here
          </div>
          <div className="mt-2 h-px w-10 bg-[#1a1a1a]" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <p
            className="text-[18px] leading-[1.55] text-[#1a1a1a] [column-fill:balance]"
            style={serifText}
          >
            <span
              className="float-left mr-3 mt-2 text-[88px] font-light leading-[0.7] text-[#1a1a1a]"
              style={serifDisplay}
            >
              {dropCap}
            </span>
            {restBlurb} {pick.reasoning}
          </p>
        </div>
        <aside className="col-span-12 md:col-span-4 md:border-l md:border-[#cfc3a8] md:pl-6">
          <div
            className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            The Particulars
          </div>
          <dl className="mt-4 space-y-3 text-[#1a1a1a]">
            <div className="flex items-baseline justify-between border-b border-dotted border-[#cfc3a8] pb-2">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Estimate
              </dt>
              <dd className="text-[22px]" style={serifDisplay}>
                ${pick.cost.totalUsd.toLocaleString()}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-dotted border-[#cfc3a8] pb-2">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Air · Bed
              </dt>
              <dd className="text-[14px]" style={serifText}>
                ${pick.cost.flightUsd} · ${pick.cost.lodgingUsd}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-dotted border-[#cfc3a8] pb-2">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Mercury
              </dt>
              <dd className="text-[14px]" style={serifText}>
                {pick.weather.highF}° / {pick.weather.lowF}°F
              </dd>
            </div>
            <div className="pb-2">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Forecast
              </dt>
              <dd className="mt-1 text-[15px] italic" style={serifText}>
                {pick.weather.summary}.
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {/* Match tags */}
      <div className="col-span-12">
        <RuleLabel>The Brief — Tagged</RuleLabel>
        <div className="mt-4 flex justify-center">
          <MatchTags tags={pick.matchTags} />
        </div>
      </div>

      {/* Attractions */}
      <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-3">
          <div
            className="text-[11px] uppercase tracking-[0.4em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            Three Things
          </div>
          <h3
            className="mt-2 text-[42px] leading-[0.95] tracking-[-0.02em] text-[#1a1a1a]"
            style={serifDisplay}
          >
            Worth the Trouble.
          </h3>
        </div>
        {pick.attractions.map((a, idx) => (
          <div
            key={a.name}
            className="col-span-12 md:col-span-3 border-t border-[#1a1a1a] pt-4"
          >
            <div
              className="text-[10px] uppercase tracking-[0.4em] text-[#7a6a4a]"
              style={sansSmallcaps}
            >
              No. 0{idx + 1}
            </div>
            <h4
              className="mt-2 text-[26px] leading-[1.05] text-[#1a1a1a]"
              style={serifDisplay}
            >
              {a.name}
            </h4>
            <p
              className="mt-2 text-[14px] leading-[1.5] text-[#2a2a2a]"
              style={serifText}
            >
              {a.description}
            </p>
          </div>
        ))}
      </div>

      {/* Itinerary */}
      <div className="col-span-12 mt-4">
        <RuleLabel>The Itinerary · {trip.tripLengthDays} Days</RuleLabel>
        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8">
          {pick.itinerary.map((d) => (
            <div key={d.day} className="col-span-12 md:col-span-3">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[64px] leading-[0.85] tracking-[-0.03em] text-[#1a1a1a]"
                  style={serifDisplay}
                >
                  {String(d.day).padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.4em] text-[#7a6a4a]"
                  style={sansSmallcaps}
                >
                  Day
                </span>
              </div>
              <div className="mt-3 h-px w-12 bg-[#1a1a1a]" />
              <h5
                className="mt-3 text-[20px] italic leading-[1.15] text-[#1a1a1a]"
                style={serifDisplay}
              >
                {d.title}
              </h5>
              <p
                className="mt-3 text-[13px] leading-[1.55] text-[#2a2a2a]"
                style={serifText}
              >
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function MinorPick({ pick }: { pick: GalleryPick }) {
  const numeral = String(pick.rank).padStart(2, "0");

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-[#1a1a1a] pt-10">
      {/* Header strip */}
      <div className="col-span-12 flex items-baseline justify-between">
        <div className="flex items-baseline gap-5">
          <span
            className="text-[72px] leading-[0.85] tracking-[-0.03em] text-[#1a1a1a]"
            style={serifDisplay}
          >
            {numeral}
          </span>
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
              style={sansSmallcaps}
            >
              Also Considered
            </div>
            <div
              className="mt-1 text-[10px] uppercase tracking-[0.4em] text-[#1a1a1a]"
              style={sansSmallcaps}
            >
              {pick.region}
            </div>
          </div>
        </div>
        <div
          className="hidden text-[10px] uppercase tracking-[0.4em] text-[#7a6a4a] md:block"
          style={sansSmallcaps}
        >
          Page {12 + pick.rank * 4}
        </div>
      </div>

      {/* Photo + side block, asymmetric per rank */}
      {pick.rank === 2 ? (
        <>
          <figure className="col-span-12 md:col-span-7">
            <img
              src={pick.heroPhotoUrl}
              alt={pick.name}
              className="h-[360px] w-full object-cover"
            />
            <figcaption
              className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
              style={sansSmallcaps}
            >
              Plate II · {pick.name}
            </figcaption>
          </figure>
          <div className="col-span-12 md:col-span-5">
            <h2
              className="text-[64px] font-light leading-[0.9] tracking-[-0.025em] text-[#1a1a1a] md:text-[80px]"
              style={serifDisplay}
            >
              {pick.name}.
            </h2>
            <p
              className="mt-4 text-[16px] leading-[1.5] text-[#2a2a2a]"
              style={serifText}
            >
              {pick.blurb}
            </p>
          </div>
        </>
      ) : pick.rank === 3 ? (
        <>
          <div className="col-span-12 md:col-span-5 md:order-1 order-2">
            <h2
              className="text-[64px] font-light leading-[0.9] tracking-[-0.025em] text-[#1a1a1a] md:text-[80px]"
              style={serifDisplay}
            >
              {pick.name}.
            </h2>
            <p
              className="mt-4 text-[16px] leading-[1.5] text-[#2a2a2a]"
              style={serifText}
            >
              {pick.blurb}
            </p>
          </div>
          <figure className="col-span-12 md:col-span-7 md:order-2 order-1">
            <img
              src={pick.heroPhotoUrl}
              alt={pick.name}
              className="h-[360px] w-full object-cover"
            />
            <figcaption
              className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
              style={sansSmallcaps}
            >
              Plate III · {pick.name}
            </figcaption>
          </figure>
        </>
      ) : (
        <>
          <figure className="col-span-12 md:col-span-6">
            <img
              src={pick.heroPhotoUrl}
              alt={pick.name}
              className="h-[360px] w-full object-cover"
            />
            <figcaption
              className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
              style={sansSmallcaps}
            >
              Plate IV · {pick.name}
            </figcaption>
          </figure>
          <div className="col-span-12 md:col-span-6">
            <h2
              className="text-[64px] font-light leading-[0.9] tracking-[-0.025em] text-[#1a1a1a] md:text-[80px]"
              style={serifDisplay}
            >
              {pick.name}.
            </h2>
            <p
              className="mt-4 text-[16px] leading-[1.5] text-[#2a2a2a]"
              style={serifText}
            >
              {pick.blurb}
            </p>
          </div>
        </>
      )}

      {/* Reasoning + ledger */}
      <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-7 md:border-r md:border-[#cfc3a8] md:pr-6">
          <div
            className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            Editor’s Note
          </div>
          <p
            className="mt-3 text-[16px] leading-[1.55] text-[#1a1a1a]"
            style={serifText}
          >
            {pick.reasoning}
          </p>
          <div className="mt-5">
            <MatchTags tags={pick.matchTags} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div
            className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            The Particulars
          </div>
          <dl className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between border-b border-dotted border-[#cfc3a8] pb-1.5">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Estimate
              </dt>
              <dd className="text-[20px]" style={serifDisplay}>
                ${pick.cost.totalUsd.toLocaleString()}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-dotted border-[#cfc3a8] pb-1.5">
              <dt
                className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                style={sansSmallcaps}
              >
                Mercury
              </dt>
              <dd className="text-[13px]" style={serifText}>
                {pick.weather.highF}° / {pick.weather.lowF}°F · {pick.weather.summary}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <div
              className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
              style={sansSmallcaps}
            >
              Three Things
            </div>
            <ul className="mt-3 space-y-2">
              {pick.attractions.slice(0, 3).map((a, i) => (
                <li key={a.name} className="flex items-baseline gap-3">
                  <span
                    className="text-[11px] tracking-[0.3em] text-[#b8a98a]"
                    style={sansSmallcaps}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <span
                      className="text-[15px] italic text-[#1a1a1a]"
                      style={serifDisplay}
                    >
                      {a.name}
                    </span>
                    <span
                      className="text-[13px] text-[#3a3a3a]"
                      style={serifText}
                    >
                      {" — "}
                      {a.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EditorialGalleryPage() {
  const hero = PICKS.find((p) => p.rank === 1) ?? PICKS[0];
  const others = PICKS.filter((p) => p.rank !== 1).sort((a, b) => a.rank - b.rank);

  return (
    <main
      className="min-h-screen bg-[#f5efe1] text-[#1a1a1a] selection:bg-[#1a1a1a] selection:text-[#f5efe1]"
      style={serifText}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-14 md:py-16">
        {/* Top nav back link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/gallery"
            className="group inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.45em] text-[#1a1a1a] hover:text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            <span aria-hidden>←</span>
            <span className="border-b border-transparent group-hover:border-[#7a6a4a]">
              Return to the Gallery
            </span>
          </Link>
          <span
            className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
            style={sansSmallcaps}
          >
            Variant I · Editorial
          </span>
        </div>

        {/* Masthead */}
        <header className="border-b border-[#1a1a1a] pb-6">
          <IssueMeta trip={TRIP} />
          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 md:col-span-2">
              <div className="flex flex-col gap-2">
                <span
                  className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
                  style={sansSmallcaps}
                >
                  Feature
                </span>
                <span className="h-px w-10 bg-[#1a1a1a]" />
                <span
                  className="text-[10px] uppercase tracking-[0.45em] text-[#1a1a1a]"
                  style={sansSmallcaps}
                >
                  An Itinerary in Four Acts
                </span>
              </div>
            </div>
            <h1
              className="col-span-12 text-[88px] font-light leading-[0.84] tracking-[-0.035em] text-[#1a1a1a] md:col-span-10 md:text-[160px]"
              style={serifDisplay}
            >
              Four Days,
              <br />
              <span className="italic">Four Souths.</span>
            </h1>
          </div>

          {/* Standfirst / dek */}
          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 md:col-span-3">
              <div
                className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
                style={sansSmallcaps}
              >
                The Brief
              </div>
              <div className="mt-3 space-y-2">
                <div
                  className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                  style={sansSmallcaps}
                >
                  From
                </div>
                <div className="text-[22px] leading-[1.05]" style={serifDisplay}>
                  {TRIP.origin}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                  style={sansSmallcaps}
                >
                  When
                </div>
                <div className="text-[15px] italic" style={serifText}>
                  {formatDateRange(TRIP)}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.35em] text-[#3a3a3a]"
                  style={sansSmallcaps}
                >
                  Budget
                </div>
                <div className="text-[15px]" style={serifText}>
                  {TRIP.budgetBand}
                </div>
              </div>
            </div>
            <p
              className="col-span-12 text-[24px] leading-[1.32] text-[#1a1a1a] md:col-span-9 md:text-[30px]"
              style={serifText}
            >
              <span className="italic text-[#7a6a4a]">A dispatch.</span>{" "}
              For the traveller departing {TRIP.origin} this {TRIP.seasonHint},
              chasing the {TRIP.vibes.slice(0, -1).join(", ")} and the{" "}
              {TRIP.vibes.slice(-1)} — at a {TRIP.pace} pace, with a quiet
              dislike of {TRIP.dislikes}. Herewith, four destinations, ranked
              and unranked, photographed and considered.
            </p>
          </div>

          {/* Vibe smallcaps row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#cfc3a8] pt-4">
            <span
              className="text-[10px] uppercase tracking-[0.5em] text-[#7a6a4a]"
              style={sansSmallcaps}
            >
              Filed Under
            </span>
            {TRIP.vibes.map((v) => (
              <span
                key={v}
                className="text-[11px] uppercase tracking-[0.45em] text-[#1a1a1a]"
                style={sansSmallcaps}
              >
                {v}
              </span>
            ))}
            <span className="ml-auto text-[10px] italic text-[#7a6a4a]" style={serifText}>
              — Photographs by The Wanderer
            </span>
          </div>
        </header>

        {/* Section divider */}
        <div className="my-16">
          <RuleLabel>The Picks · Four in Order</RuleLabel>
        </div>

        {/* Hero pick */}
        <HeroPick pick={hero} trip={TRIP} />

        <div className="my-20 flex items-center justify-center gap-6">
          <span className="h-px w-16 bg-[#1a1a1a]" />
          <span
            className="text-[18px] tracking-[0.4em] text-[#1a1a1a]"
            style={serifDisplay}
          >
            ❦
          </span>
          <span className="h-px w-16 bg-[#1a1a1a]" />
        </div>

        {/* Minor picks */}
        <div className="space-y-20">
          {others.map((p) => (
            <MinorPick key={p.slug} pick={p} />
          ))}
        </div>

        {/* Colophon footer */}
        <footer className="mt-24 border-t border-[#1a1a1a] pt-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <div
                className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
                style={sansSmallcaps}
              >
                Colophon
              </div>
              <p
                className="mt-3 text-[14px] italic leading-[1.55] text-[#3a3a3a]"
                style={serifText}
              >
                Set in Cormorant Garamond and EB Garamond. Printed on the web,
                in the year MMXXVI. All routes computed from {TRIP.originCode}.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div
                className="text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
                style={sansSmallcaps}
              >
                Masthead
              </div>
              <p
                className="mt-3 text-[14px] leading-[1.55] text-[#3a3a3a]"
                style={serifText}
              >
                Editor at Large · The Itinerant
                <br />
                Photography · Field Correspondents
                <br />
                Cartography · Public Domain
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/gallery"
                className="inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.45em] text-[#1a1a1a] hover:text-[#7a6a4a]"
                style={sansSmallcaps}
              >
                <span aria-hidden>←</span>
                <span className="border-b border-[#1a1a1a]">
                  Back to the Gallery
                </span>
              </Link>
              <div
                className="mt-6 text-[10px] uppercase tracking-[0.45em] text-[#7a6a4a]"
                style={sansSmallcaps}
              >
                — Fin —
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
