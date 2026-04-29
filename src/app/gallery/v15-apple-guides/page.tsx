import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney, rankLabel } from "../_helpers";

function MapPin({ pick, left, top }: { pick: GalleryPick; left: string; top: string }) {
  return (
    <div className="absolute" style={{ left, top }} aria-label={`${pick.name} map marker`}>
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#007AFF] text-sm font-bold text-white shadow-lg ring-4 ring-white">
          {pick.rank}
        </div>
        <div className="absolute left-1/2 top-9 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#007AFF]" />
      </div>
    </div>
  );
}

function GuideRow({ pick }: { pick: GalleryPick }) {
  return (
    <article className="grid grid-cols-[76px_1fr] gap-3 border-b border-[#E5E5EA] py-4 last:border-b-0 sm:grid-cols-[88px_1fr] sm:gap-4">
      <div className="relative h-20 overflow-hidden rounded-2xl bg-[#F2F2F7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1C1C1E]">
              {pick.name}
            </h2>
            <p className="truncate text-sm text-[#636366]">{pick.region}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#F2F2F7] px-2 py-1 text-xs font-semibold text-[#636366]">
            {rankLabel(pick.rank)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#3A3A3C]">
          {pick.blurb}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#EAF4FF] px-2 py-1 text-xs font-semibold text-[#007AFF]">
            {formatMoney(pick.cost.totalUsd)}
          </span>
          <span className="rounded-full bg-[#F2F2F7] px-2 py-1 text-xs font-semibold text-[#636366]">
            {pick.weather.highF}&deg; / {pick.weather.lowF}&deg;
          </span>
        </div>
      </div>
    </article>
  );
}

function PlaceSheet({ pick }: { pick: GalleryPick }) {
  return (
    <aside className="rounded-[30px] border border-white/70 bg-white/[0.85] p-5 shadow-[0_30px_80px_-42px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#D1D1D6]" />
      <div className="relative h-56 overflow-hidden rounded-[24px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pick.heroPhotoUrl}
          alt={`${pick.name}, ${pick.region}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#007AFF]">
          Featured guide
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1C1C1E] sm:text-3xl">
          {pick.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#3A3A3C]">
          {pick.reasoning}
        </p>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {pick.attractions.map((item) => (
          <div key={item.name} className="rounded-2xl bg-[#F2F2F7] p-3">
            <div className="text-xs font-semibold leading-snug text-[#1C1C1E]">{item.name}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function V15AppleGuidesPage() {
  const featured = PICKS[0];
  return (
    <main className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E]">
      <section className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(130deg, rgba(191,219,254,0.7), rgba(240,253,250,0.85)), radial-gradient(circle at 20% 30%, #fff 0 90px, transparent 92px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(35deg, transparent 0 44%, rgba(52,199,89,0.35) 45% 47%, transparent 48%), linear-gradient(115deg, transparent 0 50%, rgba(0,122,255,0.25) 51% 53%, transparent 54%), linear-gradient(10deg, transparent 0 58%, rgba(255,149,0,0.25) 59% 61%, transparent 62%)",
            backgroundSize: "520px 360px, 440px 300px, 600px 420px",
          }}
        />

        <MapPin pick={PICKS[0]} left="14%" top="28%" />
        <MapPin pick={PICKS[1]} left="58%" top="18%" />
        <MapPin pick={PICKS[2]} left="38%" top="54%" />
        <MapPin pick={PICKS[3]} left="76%" top="62%" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1fr_430px]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl">
              <Link href="/gallery" className="text-sm font-semibold text-[#007AFF]">
                Back to gallery
              </Link>
              <span className="text-sm font-semibold text-[#636366]">
                v15 - Guide Sheet
              </span>
            </div>

            <header className="max-w-2xl rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <p className="text-sm font-semibold text-[#007AFF]">Trip Planner Guides</p>
              <h1 className="mt-2 text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl md:text-6xl">
                Saved places for a quieter fall escape.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#3A3A3C]">
                A map-native direction using translucent sheets, saved guides,
                clean place rows, and calm system controls.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[formatDateRange(TRIP), TRIP.budgetBand, TRIP.vibes.join(" + ")].map((item) => (
                  <span key={item} className="rounded-full bg-[#F2F2F7] px-3 py-2 text-sm font-semibold text-[#3A3A3C]">
                    {item}
                  </span>
                ))}
              </div>
            </header>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <PlaceSheet pick={featured} />
            <section className="rounded-[30px] border border-white/70 bg-white/[0.88] p-5 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Fall shortlist</h2>
                  <p className="text-sm text-[#636366]">4 places - {TRIP.originCode} origin</p>
                </div>
                <button type="button" className="shrink-0 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white">
                  Add
                </button>
              </div>
              <div className="mt-2">
                {PICKS.map((pick) => (
                  <GuideRow key={pick.slug} pick={pick} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
