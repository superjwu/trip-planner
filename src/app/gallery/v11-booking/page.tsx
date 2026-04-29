import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney, miscSpend } from "../_helpers";

const AMENITIES = ["Breakfast nearby", "Walkable stay", "No resort fees", "Pay later"];
const SEARCH_FIELDS = [
  ["Where are you going?", PICKS.map((p) => p.name).join(", ")],
  ["Dates", formatDateRange(TRIP)],
  ["Travel style", TRIP.vibes.join(" + ")],
  ["Budget", TRIP.budgetBand],
] as const;
const FILTER_GROUPS = [
  ["Your priorities", TRIP.vibes],
  ["Popular filters", ["Walkable", "Food scene", "Shoulder season"]],
  ["Avoid", TRIP.dislikes.split(", ")],
] as const;

function ScoreChip({ pick }: { pick: GalleryPick }) {
  const score = (9.6 - pick.rank * 0.2).toFixed(1);
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-tl-md rounded-tr-md rounded-br-md bg-[#003B95] px-2 py-1 text-sm font-bold text-white">
        {score}
      </span>
      <span className="text-sm font-semibold text-[#1a1a1a]">Excellent</span>
      <span className="text-xs text-[#595959]">{280 + pick.rank * 47} reviews</span>
    </div>
  );
}

function ResultCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="grid gap-4 rounded-lg border border-[#d9d9d9] bg-white p-3 shadow-sm transition hover:border-[#0071c2] md:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
      <div className="relative h-56 overflow-hidden rounded-md bg-[#eef3fb] md:h-full md:min-h-[220px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded bg-[#febb02] px-2 py-1 text-xs font-bold text-[#1a1a1a]">
          Top match #{pick.rank}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-[#0071c2]">
                {pick.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#1a1a1a]">
                {pick.region}
              </p>
            </div>
            <ScoreChip pick={pick} />
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#333]">
            {pick.blurb}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {AMENITIES.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#008234]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e7f5ec] text-xs font-bold">
                  &#10003;
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md bg-[#f2f7ff] p-3">
            <div className="text-xs font-bold uppercase tracking-wide text-[#003B95]">
              Why it fits
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[#1a1a1a]">
              {pick.reasoning}
            </p>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-md border border-[#e6e6e6] bg-[#fafafa] p-3 text-left md:text-right">
          <div>
            <div className="text-xs font-semibold uppercase text-[#595959]">
              4-day estimate
            </div>
            <div className="mt-1 text-2xl font-bold text-[#1a1a1a]">
              {formatMoney(pick.cost.totalUsd)}
            </div>
            <div className="text-xs text-[#595959]">
              Includes flight + lodging + {formatMoney(miscSpend(pick))} on trip
            </div>
          </div>

          <div className="mt-4 space-y-2 text-left text-xs text-[#595959]">
            <div className="flex justify-between">
              <span>Flight</span>
              <strong>{formatMoney(pick.cost.flightUsd)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Lodging</span>
              <strong>{formatMoney(pick.cost.lodgingUsd)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Forecast</span>
              <strong>
                {pick.weather.highF}&deg; / {pick.weather.lowF}&deg;
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 rounded-md bg-[#0071c2] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#005999]"
          >
            See itinerary
          </button>
        </aside>
      </div>
    </article>
  );
}

export default function V11BookingPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a]">
      <div className="bg-[#003B95] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/gallery" className="text-sm font-semibold hover:underline">
            Back to gallery
          </Link>
          <div className="text-sm font-bold">v11 - Booking Utility</div>
        </div>

        <header className="mx-auto max-w-7xl px-5 pb-9 pt-5">
          <p className="text-sm font-semibold text-[#febb02]">Trip Planner</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Compare fall getaways from New York
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            Dense, utility-first results with price, rating, cancellation, and
            itinerary details visible before opening a destination.
          </p>
        </header>
      </div>

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5">
        <div className="grid gap-2 rounded-md border-4 border-[#febb02] bg-[#febb02] shadow-lg md:grid-cols-[1.4fr_1fr_1fr_.8fr_auto]">
          {SEARCH_FIELDS.map(([label, value]) => (
            <div key={label} className="rounded-sm bg-white p-3">
              <span className="block text-xs font-semibold text-[#595959]">{label}</span>
              <span className="mt-1 block truncate text-sm font-bold text-[#1a1a1a]">
                {value}
              </span>
            </div>
          ))}
          <button
            type="button"
            className="rounded-sm bg-[#0071c2] px-6 py-3 text-sm font-bold text-white hover:bg-[#005999]"
          >
            Search
          </button>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-[#d9d9d9] bg-white p-4">
          <h2 className="text-lg font-bold">Filter by</h2>
          <div className="mt-4 space-y-5">
            {FILTER_GROUPS.map(([label, items]) => (
              <section key={label}>
                <h3 className="border-b border-[#e6e6e6] pb-2 text-sm font-bold">
                  {label}
                </h3>
                <div className="mt-3 space-y-2">
                  {items.map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      {item}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d9d9d9] bg-white p-4">
            <div>
              <h2 className="text-xl font-bold">4 destinations found</h2>
              <p className="text-sm text-[#595959]">
                Sorted by best fit for {TRIP.pace} pace, {TRIP.seasonHint} travel.
              </p>
            </div>
            <button
              type="button"
              className="rounded-md border border-[#0071c2] px-4 py-2 text-sm font-bold text-[#0071c2]"
            >
              Show on map
            </button>
          </div>
          {PICKS.map((pick) => (
            <ResultCard key={pick.slug} pick={pick} />
          ))}
        </section>
      </div>
    </main>
  );
}
