import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney } from "../_helpers";

const CALENDAR: ReadonlyArray<readonly [day: string, price: number]> = [
  ["S", 178],
  ["M", 192],
  ["T", 161],
  ["W", 144],
  ["T", 155],
  ["F", 221],
  ["S", 236],
  ["S", 190],
  ["M", 166],
  ["T", 149],
  ["W", 138],
  ["T", 147],
  ["F", 205],
  ["S", 218],
];

function dealHeatClass(price: number) {
  const cheap = price < 155;
  const mid = price < 190;
  return cheap
    ? "bg-[#34D399] text-[#073126]"
    : mid
      ? "bg-[#FDE68A] text-[#422006]"
      : "bg-[#FB7185] text-white";
}

function PhoneCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="rounded-[28px] bg-white p-4 text-[#111827] shadow-[0_24px_80px_-36px_rgba(17,24,39,0.55)]">
      <div className="overflow-hidden rounded-[22px] border border-[#e5e7eb]">
        <div className="relative h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name}, ${pick.region}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-white">
            <div className="text-xs font-bold uppercase tracking-[0.18em]">
              Watch trip #{pick.rank}
            </div>
            <h2 className="mt-1 text-2xl font-black leading-tight">{pick.name}</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-2xl bg-[#F3F4F6] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#6B7280]">
                Price prediction
              </span>
              <span className="rounded-full bg-[#34D399] px-3 py-1 text-xs font-black text-[#073126]">
                Book soon
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-4xl font-black tracking-tight">
                  {formatMoney(pick.cost.flightUsd)}
                </div>
                <div className="text-xs font-bold text-[#6B7280]">Round trip flight</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black">{formatMoney(pick.cost.totalUsd)}</div>
                <div className="text-xs font-bold text-[#6B7280]">Total plan</div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#374151]">{pick.blurb}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {pick.matchTags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-[#ECFEFF] px-3 py-2 text-center text-xs font-black text-[#155E75]">
                {tag}
              </span>
            ))}
          </div>

          <button type="button" className="mt-4 w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white">
            Watch destination
          </button>
        </div>
      </div>
    </article>
  );
}

export default function V14HopperPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <section className="relative overflow-hidden bg-[#00A6A6]">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 0 42%, #FDE68A 42% 46%, transparent 46%), linear-gradient(45deg, transparent 0 58%, #FB7185 58% 62%, transparent 62%), repeating-linear-gradient(90deg, transparent 0 26px, rgba(255,255,255,0.35) 26px 28px)",
            backgroundSize: "280px 220px, 320px 240px, 56px 56px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-white">
            <Link href="/gallery" className="text-sm font-black hover:underline">
              Back to gallery
            </Link>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-black">
              v14 - Mobile Deal Watch
            </span>
          </div>

          <header className="grid items-end gap-8 py-10 lg:grid-cols-[1fr_420px]">
            <div className="text-white">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#FDE68A]">
                Trip Planner price watch
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl md:text-7xl">
                Swipeable getaways with clear buy signals.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-white/85">
                A playful mobile-first direction with deal colors, large tap
                targets, price confidence, and a calendar that makes timing obvious.
              </p>
            </div>

            <aside className="rounded-[28px] bg-white p-5 shadow-[0_24px_80px_-40px_rgba(17,24,39,0.65)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-[#6B7280]">
                    Cheapest dates
                  </div>
                  <div className="mt-1 text-xl font-black">{formatDateRange(TRIP)}</div>
                </div>
                <div className="rounded-full bg-[#FDE68A] px-3 py-2 text-xs font-black">
                  NYC
                </div>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-2">
                {CALENDAR.map(([day, price], index) => (
                  <div
                    key={`${day}-${index}`}
                    className={`rounded-2xl p-2 text-center text-xs font-black ${dealHeatClass(price)}`}
                  >
                    <div>{day}</div>
                    <div className="mt-1">${price}</div>
                  </div>
                ))}
              </div>
            </aside>
          </header>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 md:grid-cols-2 xl:grid-cols-4">
        {PICKS.map((pick) => (
          <PhoneCard key={pick.slug} pick={pick} />
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-4 rounded-[28px] bg-[#111827] p-5 text-white md:grid-cols-4">
          {["Watch prices", "Pick dates", "Reserve stay", "Share plan"].map((step, i) => (
            <div key={step} className="rounded-2xl bg-white/[0.08] p-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#FDE68A] text-sm font-black text-[#422006]">
                {i + 1}
              </div>
              <div className="mt-3 text-lg font-black">{step}</div>
              <div className="mt-1 text-sm text-white/70">
                {i === 0
                  ? "Track fare shifts before locking the trip."
                  : i === 1
                    ? "Use the calendar heat map to avoid expensive weekends."
                    : i === 2
                      ? "Keep lodging and activity costs in the same flow."
                      : "Send the short list to whoever is coming."}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
