import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

export default function Y2KGalleryPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0420] text-white">
      {/* Mesh gradient background — multiple radial layers for that early-2000s desktop wallpaper feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(at 12% 8%, #ff5fd2 0px, transparent 45%)",
            "radial-gradient(at 88% 12%, #21d7ff 0px, transparent 50%)",
            "radial-gradient(at 78% 92%, #b86bff 0px, transparent 55%)",
            "radial-gradient(at 18% 78%, #ff8a3d 0px, transparent 45%)",
            "radial-gradient(at 50% 50%, #6e2bff 0px, transparent 60%)",
            "linear-gradient(135deg, #1a063a 0%, #2a0b5c 50%, #0a0420 100%)",
          ].join(","),
        }}
      />
      {/* Subtle scanline / sparkle field */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Floating sparkles */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <span className="absolute left-[6%] top-[14%] text-4xl text-white/70 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">✦</span>
        <span className="absolute right-[10%] top-[8%] text-2xl text-cyan-200 drop-shadow-[0_0_8px_#22d3ee]">✧</span>
        <span className="absolute left-[18%] top-[42%] text-xl text-pink-200 drop-shadow-[0_0_8px_#ec4899]">⋆</span>
        <span className="absolute right-[6%] top-[36%] text-3xl text-fuchsia-200 drop-shadow-[0_0_10px_#d946ef]">✦</span>
        <span className="absolute left-[40%] top-[64%] text-2xl text-white/60 drop-shadow-[0_0_8px_#fff]">✧</span>
        <span className="absolute right-[24%] bottom-[8%] text-4xl text-purple-200 drop-shadow-[0_0_12px_#a855f7]">✦</span>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 py-10">
        <BackLink />
        <TitleBar />
        <TripMetaStrip trip={TRIP} />

        <div className="mt-10 grid grid-cols-1 gap-10">
          {PICKS.map((pick) => (
            <PickCard key={pick.slug} pick={pick} />
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/gallery"
      className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-b from-white/30 to-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_18px_rgba(168,85,247,0.5)] backdrop-blur-md transition hover:from-white/40"
    >
      <span className="text-cyan-200 drop-shadow-[0_0_4px_#22d3ee]">◄◄</span>
      <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
        Back to Gallery
      </span>
    </Link>
  );
}

function TitleBar() {
  return (
    <div className="relative mt-6">
      {/* Chrome plaque behind title */}
      <div className="absolute inset-x-0 top-1/2 -z-0 h-[140%] -translate-y-1/2 rounded-[40px] bg-gradient-to-b from-white/15 via-white/5 to-transparent blur-2xl" />
      <h1 className="relative text-center text-[clamp(48px,11vw,160px)] font-black leading-[0.85] tracking-tight">
        <span
          className="block bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #ffffff 0%, #e0e7ff 18%, #b8c6ff 32%, #6f7fff 48%, #1a1f4a 50%, #6f7fff 52%, #b8c6ff 68%, #ffffff 100%)",
            WebkitTextStroke: "1px rgba(255,255,255,0.25)",
          }}
        >
          DESTINATIONS
        </span>
        <span className="relative -mt-2 block text-[clamp(28px,5vw,72px)]">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ff5fd2 0%, #b86bff 35%, #21d7ff 70%, #ffffff 100%)",
            }}
          >
            ／／&nbsp;2026&nbsp;✦
          </span>
        </span>
      </h1>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.45em] text-white/70">
        ★ trip planner v6 ★ y2k edition ★ ultra-glossy ★
      </p>
    </div>
  );
}

function TripMetaStrip({ trip }: { trip: GalleryTrip }) {
  const items = [
    { label: "Origin", value: `${trip.origin} (${trip.originCode})` },
    { label: "Depart", value: trip.departOn },
    { label: "Return", value: trip.returnOn },
    { label: "Length", value: `${trip.tripLengthDays} days` },
    { label: "Vibes", value: trip.vibes.join(" · ") },
    { label: "Budget", value: trip.budgetBand },
    { label: "Pace", value: trip.pace },
    { label: "Season", value: trip.seasonHint },
  ];
  return (
    <div className="relative mt-10 overflow-hidden rounded-[32px] border border-white/30 p-[1px] shadow-[0_20px_80px_-10px_rgba(168,85,247,0.6)]">
      {/* Iridescent border via gradient ring */}
      <div
        className="absolute inset-0 rounded-[32px] opacity-90"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #ff5fd2, #ffd166, #21d7ff, #b86bff, #ff5fd2)",
        }}
      />
      <div className="relative rounded-[31px] bg-gradient-to-b from-white/25 via-white/10 to-white/5 p-6 backdrop-blur-xl">
        {/* Top gloss highlight */}
        <div className="pointer-events-none absolute inset-x-2 top-1 h-1/2 rounded-t-[28px] bg-gradient-to-b from-white/50 to-transparent" />
        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]">
                {it.label}
              </div>
              <div className="mt-1 truncate text-sm font-bold text-white">{it.value}</div>
            </div>
          ))}
        </div>
        <div className="relative mt-3 text-[11px] uppercase tracking-[0.25em] text-white/70">
          <span className="text-pink-200">avoid:</span>{" "}
          <span className="text-white/85">{trip.dislikes}</span>
        </div>
      </div>
    </div>
  );
}

function PickCard({ pick }: { pick: GalleryPick }) {
  return (
    <article className="relative overflow-hidden rounded-[36px] p-[2px] shadow-[0_30px_120px_-20px_rgba(236,72,153,0.55)]">
      {/* Iridescent rim */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{
          backgroundImage:
            "conic-gradient(from 140deg at 50% 50%, #ff5fd2, #ffd166, #21d7ff, #b86bff, #ff5fd2, #ffffff, #ff5fd2)",
        }}
      />
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#1c0742]/95 via-[#2a0b5c]/95 to-[#0a0420]/95">
        {/* Bubble gloss top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent" />
        {/* Corner color blooms */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.1fr_1fr] lg:p-8">
          {/* LEFT — name, hero, blurb */}
          <div className="flex flex-col gap-5">
            <RankBadge rank={pick.rank} />
            <h2 className="leading-[0.85]">
              <span
                className="block text-[clamp(56px,8vw,120px)] font-black tracking-tight bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(255,95,210,0.4)]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #ffffff 0%, #ffd6f3 25%, #ff8af0 45%, #6b25b8 55%, #ff8af0 65%, #ffd6f3 85%, #ffffff 100%)",
                  WebkitTextStroke: "1px rgba(255,255,255,0.35)",
                }}
              >
                {pick.name}
              </span>
              <span className="mt-2 block text-xs font-bold uppercase tracking-[0.4em] text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]">
                ✧ {pick.region} ✧
              </span>
            </h2>

            {/* Hero photo with iridescent border */}
            <div className="relative rounded-[28px] p-[3px]"
              style={{
                backgroundImage:
                  "conic-gradient(from 0deg, #ff5fd2, #ffd166, #21d7ff, #b86bff, #ff5fd2)",
              }}
            >
              <div className="relative overflow-hidden rounded-[25px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pick.heroPhotoUrl}
                  alt={pick.name}
                  className="aspect-[16/10] w-full object-cover"
                />
                {/* Glossy overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/40" />
                {/* Holographic tint */}
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(255,95,210,0.5), rgba(33,215,255,0.5), rgba(184,107,255,0.5))",
                  }}
                />
                <div className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  ✦ {pick.state}
                </div>
              </div>
            </div>

            {/* Blurb in bubble glass */}
            <BubbleBox>
              <p className="text-sm leading-relaxed text-white/90">{pick.blurb}</p>
            </BubbleBox>

            {/* Reasoning */}
            <BubbleBox tint="cyan">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-100 drop-shadow-[0_0_6px_#22d3ee]">
                ⋆ why this pick
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/90">{pick.reasoning}</p>
            </BubbleBox>

            {/* Match tag chips */}
            <div className="flex flex-wrap gap-2">
              {pick.matchTags.map((t, i) => (
                <Chip key={t} idx={i}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          {/* RIGHT — chrome readouts + attractions + itinerary */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <CostReadout cost={pick.cost} />
              <WeatherWidget weather={pick.weather} />
            </div>

            {/* Attractions */}
            <BubbleBox>
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-pink-200 drop-shadow-[0_0_6px_#ec4899]">
                ✦ attractions
              </div>
              <ul className="mt-3 space-y-3">
                {pick.attractions.slice(0, 3).map((a) => (
                  <li key={a.name} className="rounded-2xl border border-white/15 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-cyan-200 drop-shadow-[0_0_5px_#22d3ee]">✧</span>
                      <span className="text-sm font-bold text-white">{a.name}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">{a.description}</p>
                  </li>
                ))}
              </ul>
            </BubbleBox>

            {/* Itinerary */}
            <BubbleBox tint="violet">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-fuchsia-200 drop-shadow-[0_0_6px_#d946ef]">
                ⋆ itinerary preview
              </div>
              <ol className="mt-3 space-y-2">
                {pick.itinerary.map((d) => (
                  <li
                    key={d.day}
                    className="flex gap-3 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/0 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  >
                    <DayChip n={d.day} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white">{d.title}</div>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/75">{d.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </BubbleBox>
          </div>
        </div>
      </div>
    </article>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="inline-flex w-fit items-center gap-2">
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-black shadow-[0_8px_24px_rgba(236,72,153,0.7)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, #ffffff 0%, #ffd1f4 18%, #ff5fd2 45%, #b86bff 75%, #2a0b5c 100%)",
        }}
      >
        <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          #{rank}
        </span>
        <span className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-white/60 to-transparent" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/70">rank in playlist</span>
    </div>
  );
}

function BubbleBox({
  children,
  tint = "purple",
}: {
  children: React.ReactNode;
  tint?: "purple" | "cyan" | "violet";
}) {
  const ring =
    tint === "cyan"
      ? "from-cyan-300/70 via-white/30 to-fuchsia-400/60"
      : tint === "violet"
      ? "from-fuchsia-400/70 via-white/30 to-purple-500/70"
      : "from-white/40 via-pink-300/40 to-purple-400/50";
  return (
    <div className={`relative rounded-[24px] bg-gradient-to-br ${ring} p-[1.5px]`}>
      <div className="relative overflow-hidden rounded-[22px] bg-black/45 p-4 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-1 top-1 h-1/2 rounded-t-[20px] bg-gradient-to-b from-white/25 to-transparent" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

function Chip({ children, idx }: { children: React.ReactNode; idx: number }) {
  const palettes = [
    "from-[#ff5fd2] via-[#ffb3e8] to-[#b86bff]",
    "from-[#21d7ff] via-[#a4f0ff] to-[#6e2bff]",
    "from-[#ffd166] via-[#fff3b0] to-[#ff5fd2]",
    "from-[#b86bff] via-[#e0c2ff] to-[#21d7ff]",
    "from-[#ff8a3d] via-[#ffd1a8] to-[#ff5fd2]",
  ];
  const grad = palettes[idx % palettes.length];
  return (
    <span className={`relative inline-flex items-center gap-1 rounded-full bg-gradient-to-br ${grad} p-[1.5px] shadow-[0_4px_14px_rgba(168,85,247,0.45)]`}>
      <span className="relative flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
        <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-full bg-gradient-to-b from-white/40 to-transparent" />
        <span className="relative text-cyan-100">✦</span>
        <span className="relative">{children}</span>
      </span>
    </span>
  );
}

function CostReadout({ cost }: { cost: GalleryPick["cost"] }) {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] p-[1.5px]"
      style={{
        backgroundImage: "linear-gradient(160deg, #f5f7ff, #94a3b8 30%, #1e293b 50%, #94a3b8 70%, #f5f7ff)",
      }}
    >
      <div className="relative rounded-[20px] bg-gradient-to-b from-[#0a0f24] to-[#050816] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <div className="pointer-events-none absolute inset-x-1 top-1 h-2/5 rounded-t-[18px] bg-gradient-to-b from-white/20 to-transparent" />
        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-200 drop-shadow-[0_0_5px_#22d3ee]">
            ⋆ total cost
          </div>
          <div
            className="mt-1 font-mono text-[34px] font-black leading-none tracking-tight"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #c5fcff 0%, #5dd8ff 25%, #1c4d8f 50%, #5dd8ff 75%, #c5fcff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 8px rgba(34,211,238,0.45))",
            }}
          >
            ${cost.totalUsd.toLocaleString()}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.2em]">
            <div className="rounded-md border border-cyan-300/30 bg-black/50 px-2 py-1">
              <div className="text-cyan-200/70">flight</div>
              <div className="font-mono text-sm font-bold text-white">${cost.flightUsd}</div>
            </div>
            <div className="rounded-md border border-cyan-300/30 bg-black/50 px-2 py-1">
              <div className="text-cyan-200/70">lodging</div>
              <div className="font-mono text-sm font-bold text-white">${cost.lodgingUsd}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherWidget({ weather }: { weather: GalleryPick["weather"] }) {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] p-[1.5px]"
      style={{
        backgroundImage: "linear-gradient(160deg, #ffffff, #c2c8d6 30%, #4b5670 50%, #c2c8d6 70%, #ffffff)",
      }}
    >
      <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a1340] to-[#0a0420] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
        <div className="pointer-events-none absolute inset-x-1 top-1 h-2/5 rounded-t-[18px] bg-gradient-to-b from-white/20 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-200 drop-shadow-[0_0_5px_#ec4899]">
              ✦ weather
            </div>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm shadow-[0_2px_8px_rgba(255,200,80,0.7)]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 25%, #ffffff 0%, #fff3b0 25%, #ffd166 55%, #ff8a3d 100%)",
              }}
            >
              ☼
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="font-mono text-[34px] font-black leading-none"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #ffd6f3 30%, #ff5fd2 55%, #ffd6f3 80%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {weather.highF}°
            </span>
            <span className="font-mono text-base text-white/60">/ {weather.lowF}°F</span>
          </div>
          <div className="mt-2 text-[11px] leading-snug text-white/80">{weather.summary}</div>
        </div>
      </div>
    </div>
  );
}

function DayChip({ n }: { n: number }) {
  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-[0_4px_12px_rgba(34,211,238,0.6)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 25%, #ffffff 0%, #c2efff 25%, #21d7ff 55%, #2a0b5c 100%)",
      }}
    >
      <span className="relative text-[#0a0420] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">D{n}</span>
      <span className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-white/70 to-transparent" />
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-14 flex flex-col items-center gap-3 pb-10 text-center">
      <div
        className="text-[clamp(20px,3vw,36px)] font-black uppercase tracking-[0.2em]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #ffffff 0%, #c2efff 25%, #21d7ff 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        ✦ end of selection ✦
      </div>
      <Link
        href="/gallery"
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-b from-white/35 to-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_rgba(168,85,247,0.55)] backdrop-blur-md"
      >
        <span className="text-pink-200 drop-shadow-[0_0_5px_#ec4899]">◄◄</span>
        back to gallery
      </Link>
      <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">
        © 2026 ★ trip planner ★ y2k build
      </div>
    </div>
  );
}
