import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// Soft Pastel / Playful — Notion / Linear / Stripe Atlas vibes.
// Restrained palette: cream #FAF6EE, butter #F4E7C5, sage #D7E0CB,
// dusty rose #EBD3CF, lavender #DCD6E8, ink #3F3A33, accent #B85C5C.
// Big rounded corners, soft shadows, friendly tone.

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const TAG_TONES: Record<string, string> = {
  foodie: "bg-[#EBD3CF] text-[#7A3F3F]",
  scenic: "bg-[#D7E0CB] text-[#4F5E3F]",
  chill: "bg-[#DCD6E8] text-[#564B7A]",
  cultural: "bg-[#F4E7C5] text-[#7A6638]",
  "short flight": "bg-[#E8DDD0] text-[#6B5A47]",
  "shoulder season": "bg-[#F4E7C5] text-[#7A6638]",
  "small crowds": "bg-[#DCD6E8] text-[#564B7A]",
  "mountain views": "bg-[#D7E0CB] text-[#4F5E3F]",
  walkable: "bg-[#EBD3CF] text-[#7A3F3F]",
};

function tagClass(tag: string) {
  return TAG_TONES[tag] ?? "bg-[#E8DDD0] text-[#6B5A47]";
}

function vibeEmoji(vibe: string) {
  switch (vibe) {
    case "foodie":
      return "🍽️";
    case "scenic":
      return "🌅";
    case "chill":
      return "🌿";
    case "cultural":
      return "🎭";
    default:
      return "✨";
  }
}

function weatherEmoji(summary: string) {
  const s = summary.toLowerCase();
  if (s.includes("storm") || s.includes("shower") || s.includes("rain")) return "🌦️";
  if (s.includes("clear") || s.includes("crisp")) return "☀️";
  if (s.includes("mild") || s.includes("cool")) return "⛅";
  return "🌤️";
}

export default function PastelGalleryPage() {
  return (
    <main
      className="min-h-screen text-[#3F3A33]"
      style={{
        background:
          "linear-gradient(160deg, #FAF6EE 0%, #F4E7C5 35%, #EBD3CF 70%, #DCD6E8 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
        <BackLink />
        <TripBanner trip={TRIP} />

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B5A47]">
                Your four picks
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Hand-picked, ranked, ready to compare
              </h2>
            </div>
            <span className="hidden text-3xl sm:inline">🗺️</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {PICKS.map((pick) => (
              <PickCard key={pick.slug} pick={pick} />
            ))}
          </div>
        </section>

        <footer className="mt-16 flex items-center justify-between rounded-3xl bg-white/50 px-6 py-5 text-sm text-[#6B5A47] shadow-[0_4px_24px_-12px_rgba(63,58,51,0.18)] backdrop-blur-sm">
          <span className="flex items-center gap-2">
            <span>✨</span>
            <span>That&apos;s the shortlist. Pack light.</span>
          </span>
          <BackLink compact />
        </footer>
      </div>
    </main>
  );
}

function BackLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/gallery"
      className={
        compact
          ? "inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-[#3F3A33] shadow-sm hover:bg-white"
          : "inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-[#3F3A33] shadow-sm transition hover:bg-white"
      }
    >
      <span aria-hidden>←</span>
      <span>Back to gallery</span>
    </Link>
  );
}

function TripBanner({ trip }: { trip: GalleryTrip }) {
  return (
    <section className="mt-8 overflow-hidden rounded-[28px] bg-[#FAF6EE]/85 p-8 shadow-[0_20px_60px_-30px_rgba(63,58,51,0.35)] backdrop-blur-sm sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F4E7C5] px-3 py-1 text-xs font-medium tracking-wide text-[#7A6638]">
            <span>✈️</span>
            <span>Trip from {trip.originCode}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            A long weekend, {trip.tripLengthDays} days, made for{" "}
            <span className="text-[#B85C5C]">you</span>.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B5A47]">
            Leaving {trip.origin} on{" "}
            <span className="font-medium text-[#3F3A33]">{formatDate(trip.departOn)}</span>, back by{" "}
            <span className="font-medium text-[#3F3A33]">{formatDate(trip.returnOn)}</span>. We picked
            four spots that lean into your {trip.seasonHint} mood — no crowds, no big resorts.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 px-5 py-4 text-sm shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B5A47]">Budget band</p>
          <p className="mt-1 text-xl font-semibold text-[#3F3A33]">{trip.budgetBand}</p>
          <p className="mt-1 text-xs text-[#6B5A47]">{trip.pace} pace</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <BannerStat label="Vibes" value={
          <div className="flex flex-wrap gap-1.5">
            {trip.vibes.map((v) => (
              <span
                key={v}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tagClass(v)}`}
              >
                <span aria-hidden>{vibeEmoji(v)}</span>
                <span>{v}</span>
              </span>
            ))}
          </div>
        } tone="sage" />
        <BannerStat label="Avoiding" value={<span className="text-sm text-[#3F3A33]">{trip.dislikes}</span>} tone="rose" />
        <BannerStat label="Season" value={<span className="text-sm text-[#3F3A33] capitalize">{trip.seasonHint} · shoulder</span>} tone="lavender" />
      </div>
    </section>
  );
}

function BannerStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone: "sage" | "rose" | "lavender";
}) {
  const bg =
    tone === "sage"
      ? "bg-[#D7E0CB]/60"
      : tone === "rose"
      ? "bg-[#EBD3CF]/60"
      : "bg-[#DCD6E8]/60";
  return (
    <div className={`rounded-2xl ${bg} p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B5A47]">{label}</p>
      <div className="mt-2">{value}</div>
    </div>
  );
}

function PickCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-[#FAF6EE]/90 shadow-[0_24px_60px_-32px_rgba(63,58,51,0.4)] backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr]">
        {/* Hero */}
        <div className="relative p-5 md:p-6">
          <img
            src={pick.heroPhotoUrl}
            alt={`${pick.name} hero`}
            className="h-56 w-full rounded-2xl object-cover shadow-md md:h-full md:min-h-[320px]"
          />
          <div className="absolute left-7 top-7 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3F3A33] shadow-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#B85C5C] text-[10px] font-bold text-white">
              {pick.rank}
            </span>
            <span>Pick {pick.rank}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-7 md:pl-2">
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#3F3A33]">
                {pick.name}
              </h3>
              <p className="text-sm text-[#6B5A47]">{pick.region}</p>
            </div>
            <p className="text-sm font-medium text-[#B85C5C]">
              {formatMoney(pick.cost.totalUsd)} all-in
            </p>
          </header>

          <p className="mt-4 text-[15px] leading-relaxed text-[#3F3A33]">{pick.blurb}</p>

          {/* Match tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pick.matchTags.map((t) => (
              <span
                key={t}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tagClass(t)}`}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Why this pick */}
          <div className="mt-5 rounded-2xl bg-[#F4E7C5]/55 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6638]">
              Why we picked it
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#3F3A33]">{pick.reasoning}</p>
          </div>

          {/* Quick facts row: cost + weather */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#D7E0CB]/55 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4F5E3F]">
                Est. cost breakdown
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#3F3A33]">
                <li className="flex justify-between">
                  <span className="text-[#6B5A47]">✈️ Flights</span>
                  <span className="font-medium">{formatMoney(pick.cost.flightUsd)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#6B5A47]">🛏️ Lodging</span>
                  <span className="font-medium">{formatMoney(pick.cost.lodgingUsd)}</span>
                </li>
                <li className="mt-1 flex justify-between border-t border-[#3F3A33]/10 pt-1.5 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(pick.cost.totalUsd)}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#DCD6E8]/55 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#564B7A]">
                Weather in September
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl" aria-hidden>{weatherEmoji(pick.weather.summary)}</span>
                <div>
                  <p className="text-base font-semibold text-[#3F3A33]">
                    {pick.weather.highF}° / {pick.weather.lowF}°
                  </p>
                  <p className="text-xs text-[#6B5A47]">{pick.weather.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attractions */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B5A47]">
              Don&apos;t miss
            </p>
            <ul className="mt-2 space-y-2">
              {pick.attractions.slice(0, 3).map((a) => (
                <li key={a.name} className="flex gap-3 rounded-xl bg-white/60 px-3 py-2">
                  <span className="mt-0.5 text-base" aria-hidden>📍</span>
                  <div className="text-sm">
                    <p className="font-semibold text-[#3F3A33]">{a.name}</p>
                    <p className="text-[#6B5A47]">{a.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary preview */}
          <div className="mt-5 rounded-2xl bg-[#EBD3CF]/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A3F3F]">
              {pick.itinerary.length}-day shape
            </p>
            <ol className="mt-2 space-y-1.5">
              {pick.itinerary.map((d) => (
                <li key={d.day} className="flex gap-3 text-sm">
                  <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-[#7A3F3F]">
                    {d.day}
                  </span>
                  <span className="text-[#3F3A33]">
                    <span className="font-medium">{d.title}</span>
                    <span className="text-[#6B5A47]"> — {d.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </article>
  );
}
