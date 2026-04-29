import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatLongDateRange, formatMoney, rankLabel } from "../_helpers";

function Compass() {
  return (
    <div className="relative h-28 w-28 shrink-0 rounded-full border border-[#b99d64]/60">
      <div className="absolute inset-3 rounded-full border border-[#b99d64]/30" />
      <div className="absolute left-1/2 top-2 h-12 w-px -translate-x-1/2 bg-[#b99d64]" />
      <div className="absolute bottom-2 left-1/2 h-12 w-px -translate-x-1/2 bg-[#b99d64]" />
      <div className="absolute left-2 top-1/2 h-px w-12 -translate-y-1/2 bg-[#b99d64]" />
      <div className="absolute right-2 top-1/2 h-px w-12 -translate-y-1/2 bg-[#b99d64]" />
      <span className="absolute left-1/2 top-1 -translate-x-1/2 text-xs text-[#d7c28b]">N</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-[#d7c28b]">S</span>
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-[#d7c28b]">W</span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-[#d7c28b]">E</span>
    </div>
  );
}

function DiscoveryCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="grid overflow-hidden border border-[#b99d64]/30 bg-[#f3ead8] text-[#172f2f] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.75)] md:grid-cols-[1fr_340px]">
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#7d6435]">
          <span>Field note {rankLabel(pick.rank)}</span>
          <span className="h-px w-10 bg-[#b99d64]" />
          <span>{pick.region}</span>
        </div>
        <h2 className="mt-4 font-serif text-3xl leading-none tracking-tight sm:text-4xl md:text-5xl">
          {pick.name}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#36504d]">
          {pick.blurb}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="border-l-2 border-[#b99d64] pl-4">
            <div className="text-xs uppercase tracking-[0.22em] text-[#7d6435]">
              Why the atlas marked it
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#233b39]">
              {pick.reasoning}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[#7d6435]">Budget</dt>
              <dd className="mt-1 font-bold">{formatMoney(pick.cost.totalUsd)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[#7d6435]">Weather</dt>
              <dd className="mt-1 font-bold">
                {pick.weather.highF}&deg; / {pick.weather.lowF}&deg;
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[#7d6435]">Pace</dt>
              <dd className="mt-1 font-bold capitalize">{TRIP.pace}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[#7d6435]">Tags</dt>
              <dd className="mt-1 font-bold">{pick.matchTags.length}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {pick.attractions.map((attraction) => (
            <div key={attraction.name} className="border-t border-[#b99d64]/40 pt-3">
              <div className="font-serif text-lg leading-tight">{attraction.name}</div>
              <p className="mt-1 text-xs leading-relaxed text-[#36504d]">
                {attraction.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <figure className="relative min-h-[320px] border-t border-[#b99d64]/30 md:border-l md:border-t-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="absolute inset-0 h-full w-full object-cover sepia-[35%]"
        />
        <div className="absolute inset-0 bg-[#172f2f]/15" />
        <figcaption className="absolute bottom-4 left-4 right-4 border border-[#f3ead8]/60 bg-[#172f2f]/85 p-4 text-[#f3ead8]">
          <div className="text-xs uppercase tracking-[0.24em] text-[#d7c28b]">
            Curiosity index
          </div>
          <div className="mt-2 text-3xl font-bold">{94 - pick.rank * 3}%</div>
          <p className="mt-1 text-xs leading-relaxed text-[#f3ead8]/75">
            Built from scenic pull, food culture, crowd avoidance, and oddity value.
          </p>
        </figcaption>
      </figure>
    </article>
  );
}

export default function V13AtlasObscuraPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#102222] text-[#f3ead8]">
      <div
        className="absolute inset-0 opacity-[0.08]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(#d7c28b 1px, transparent 1px), linear-gradient(90deg, #d7c28b 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/gallery" className="text-xs uppercase tracking-[0.22em] text-[#d7c28b] hover:text-white sm:text-sm">
            Back to gallery
          </Link>
          <span className="text-xs uppercase tracking-[0.22em] text-[#d7c28b] sm:text-sm">
            v13 - discovery editorial
          </span>
        </div>

        <header className="grid gap-8 py-12 lg:grid-cols-[1fr_220px]">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#d7c28b]">
              Trip Planner pocket atlas
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl md:text-7xl">
              A cabinet of four possible escapes.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#d8cbb2]">
              An editorial, object-like direction for travelers who want the
              trip to feel discovered, annotated, and collected.
            </p>
          </div>
          <aside className="flex flex-col items-start gap-5 border border-[#b99d64]/30 p-5">
            <Compass />
            <div className="text-sm leading-relaxed text-[#d8cbb2]">
              Origin: {TRIP.originCode}
              <br />
              Dates: {formatLongDateRange(TRIP)}
              <br />
              Season: {TRIP.seasonHint}
            </div>
          </aside>
        </header>

        <section className="space-y-8 pb-16">
          {PICKS.map((pick) => (
            <DiscoveryCard key={pick.slug} pick={pick} />
          ))}
        </section>
      </div>
    </main>
  );
}
