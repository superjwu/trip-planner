import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney } from "../_helpers";

function Bubbles({ filled }: { filled: number }) {
  const boundedFilled = Math.max(0, Math.min(5, filled));

  return (
    <span
      className="flex gap-1"
      role="img"
      aria-label={`${boundedFilled} out of 5 rating`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-3 w-3 rounded-full border border-[#00AA6C] ${
            i < boundedFilled ? "bg-[#00AA6C]" : "bg-white"
          }`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-[#d7d2c8] bg-white md:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
      <div className="relative h-60 md:h-full md:min-h-[230px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#143c2c] shadow">
          Travelers&apos; fit #{pick.rank}
        </span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[#143c2c]">
              {pick.name}
            </h2>
            <p className="text-sm font-medium text-[#5d5a51]">{pick.region}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start sm:items-end">
            <Bubbles filled={5} />
            <p className="mt-1 text-xs font-semibold text-[#5d5a51]">
              {810 + pick.rank * 96} traveler opinions
            </p>
          </div>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-[#252525]">
          {pick.blurb}
        </p>

        <div className="mt-5 rounded-lg border border-[#e7e0cf] bg-[#fbf7ea] p-4">
          <div className="flex items-center gap-2">
            <Bubbles filled={5} />
            <strong className="text-sm text-[#143c2c]">Recent traveler summary</strong>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#3d3a33]">
            &ldquo;{pick.reasoning}&rdquo;
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {pick.attractions.map((attraction) => (
            <div key={attraction.name} className="rounded-lg border border-[#e4e1d8] p-3">
              <div className="text-sm font-bold text-[#143c2c]">{attraction.name}</div>
              <div className="mt-1 text-xs leading-snug text-[#5d5a51]">
                {attraction.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function V12TripadvisorPage() {
  return (
    <main className="min-h-screen bg-[#F7F2E8] text-[#252525]">
      <header className="border-b border-[#ddd5c4] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/gallery" className="text-sm font-bold hover:underline">
            Back to gallery
          </Link>
          <nav className="flex gap-5 text-sm font-bold">
            {["Hotels", "Things to Do", "Restaurants", "Flights"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
          <div className="rounded-full border border-[#252525] px-4 py-2 text-sm font-bold">
            v12
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#00AA6C]">
            Trip Planner reviews
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Four weekend ideas, ranked by traveler confidence.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5d5a51]">
            A review-led direction with rating bubbles, attraction snippets, and
            social proof at the center of the decision.
          </p>
        </div>

        <aside className="rounded-lg border border-[#ddd5c4] bg-white p-5">
          <h2 className="text-xl font-extrabold">Your trip snapshot</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["From", `${TRIP.origin} (${TRIP.originCode})`],
              ["Dates", formatDateRange(TRIP)],
              ["Budget", TRIP.budgetBand],
              ["Style", TRIP.vibes.join(", ")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b border-[#eee8da] pb-2"
              >
                <dt className="font-bold text-[#5d5a51]">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="mt-5 w-full rounded-full bg-[#00AA6C] px-4 py-3 text-sm font-extrabold text-white"
          >
            Build this trip
          </button>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {["Best Value", "Scenic", "Foodie", "Low Crowds", "Walkable"].map((item, i) => (
            <span
              key={item}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${
                i === 0
                  ? "border-[#00AA6C] bg-[#00AA6C] text-white"
                  : "border-[#d7d2c8] bg-white text-[#143c2c]"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="space-y-5">
          {PICKS.map((pick) => (
            <ReviewCard key={pick.slug} pick={pick} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-lg bg-[#143c2c] p-5 text-white">
          <div className="grid gap-4 md:grid-cols-4">
            {PICKS.map((pick) => (
              <div key={pick.slug}>
                <div className="text-sm font-bold text-[#84E9BD]">{pick.name}</div>
                <div className="mt-1 text-2xl font-extrabold">
                  {formatMoney(pick.cost.totalUsd)}
                </div>
                <div className="mt-1 text-xs text-white/70">{pick.weather.summary}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
