import Link from "next/link";
import { TRIP, PICKS, type GalleryPick } from "../_mock";

const handwriting = {
  fontFamily: "'Caveat', 'Patrick Hand', 'Bradley Hand', cursive",
};

const handwritingTight = {
  fontFamily: "'Patrick Hand', 'Caveat', 'Bradley Hand', cursive",
};

// Slight per-card variation so it doesn't feel templated.
const layouts: {
  polaroidRotate: string;
  polaroidPad: string;
  tapeColor: string;
  tapes: { className: string; rotate: string }[];
  nameRotate: string;
  align: "left" | "right";
  cardRotate: string;
  paperTint: string;
}[] = [
  {
    polaroidRotate: "rotate-[-3deg]",
    polaroidPad: "p-3 pb-14",
    tapeColor: "bg-yellow-200/70",
    tapes: [
      { className: "-top-3 left-6 w-20 h-6 bg-yellow-200/70", rotate: "rotate-[-8deg]" },
      { className: "-bottom-2 right-4 w-16 h-5 bg-amber-200/60", rotate: "rotate-[6deg]" },
    ],
    nameRotate: "rotate-[-2deg]",
    align: "left",
    cardRotate: "rotate-[0.4deg]",
    paperTint: "bg-[#fbf6e8]",
  },
  {
    polaroidRotate: "rotate-[4deg]",
    polaroidPad: "p-3 pb-12",
    tapeColor: "bg-amber-100/70",
    tapes: [
      { className: "-top-2 -right-3 w-20 h-5 bg-rose-200/60", rotate: "rotate-[12deg]" },
      { className: "top-1/2 -left-3 w-14 h-5 bg-yellow-200/70", rotate: "rotate-[-3deg]" },
    ],
    nameRotate: "rotate-[1.5deg]",
    align: "right",
    cardRotate: "rotate-[-0.6deg]",
    paperTint: "bg-[#f7efde]",
  },
  {
    polaroidRotate: "rotate-[-2deg]",
    polaroidPad: "p-3 pb-16",
    tapeColor: "bg-yellow-200/60",
    tapes: [
      { className: "-top-3 right-10 w-24 h-6 bg-yellow-200/70", rotate: "rotate-[5deg]" },
      { className: "-bottom-3 left-10 w-16 h-5 bg-amber-200/60", rotate: "rotate-[-9deg]" },
    ],
    nameRotate: "rotate-[-3deg]",
    align: "left",
    cardRotate: "rotate-[0.8deg]",
    paperTint: "bg-[#fcf4e0]",
  },
  {
    polaroidRotate: "rotate-[3deg]",
    polaroidPad: "p-3 pb-12",
    tapeColor: "bg-rose-200/60",
    tapes: [
      { className: "-top-2 left-1/2 w-20 h-5 bg-yellow-200/70", rotate: "rotate-[-14deg]" },
      { className: "-bottom-2 -right-2 w-14 h-5 bg-amber-200/60", rotate: "rotate-[8deg]" },
    ],
    nameRotate: "rotate-[2deg]",
    align: "right",
    cardRotate: "rotate-[-0.5deg]",
    paperTint: "bg-[#f8efd9]",
  },
];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StickerChip({ children, tint }: { children: React.ReactNode; tint: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 mr-1.5 mb-1.5 text-[13px] rounded-full border border-stone-700/30 ${tint} shadow-sm`}
      style={handwritingTight}
    >
      {children}
    </span>
  );
}

function Tape({ className, rotate }: { className: string; rotate: string }) {
  return (
    <div
      aria-hidden
      className={`absolute ${className} ${rotate} shadow-sm`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, rgba(0,0,0,0.04) 4px 8px)",
      }}
    />
  );
}

function TicketStub({ pick }: { pick: GalleryPick }) {
  return (
    <div
      className="relative inline-flex items-stretch border border-stone-700/40 bg-[#fffaf0] shadow-md"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(120,80,40,0.04) 0%, rgba(120,80,40,0) 60%)",
      }}
    >
      <div className="px-3 py-2 border-r border-dashed border-stone-700/40">
        <div className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-mono">
          Boarding
        </div>
        <div className="text-stone-900 font-mono text-sm">NYC → {pick.state}</div>
      </div>
      <div className="px-3 py-2">
        <div className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-mono">
          Est. Total
        </div>
        <div className="text-stone-900 font-mono text-sm">${pick.cost.totalUsd}</div>
      </div>
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f4ead2] border border-stone-700/40" />
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f4ead2] border border-stone-700/40" />
    </div>
  );
}

function ScrapEntry({ pick, idx }: { pick: GalleryPick; idx: number }) {
  const layout = layouts[idx % layouts.length];
  const polaroidOnLeft = layout.align === "left";

  const polaroid = (
    <div className="relative shrink-0 mx-auto md:mx-0">
      <div
        className={`relative bg-white ${layout.polaroidPad} ${layout.polaroidRotate} shadow-2xl`}
        style={{
          boxShadow:
            "0 18px 30px -12px rgba(60,40,20,0.35), 0 4px 10px rgba(60,40,20,0.15)",
        }}
      >
        {layout.tapes.map((t, i) => (
          <Tape key={i} className={t.className} rotate={t.rotate} />
        ))}
        <img
          src={pick.heroPhotoUrl}
          alt={pick.name}
          className="block w-[260px] h-[260px] md:w-[300px] md:h-[300px] object-cover bg-stone-200"
        />
        <div
          className="absolute left-0 right-0 bottom-3 text-center text-stone-700 text-xl"
          style={handwriting}
        >
          {pick.name}, {pick.state} — {TRIP.seasonHint} &apos;26
        </div>
      </div>
      {/* corner doodle */}
      <div
        className="absolute -bottom-6 left-2 text-stone-500 text-sm rotate-[-6deg] select-none"
        style={handwriting}
      >
        ★ rank #{pick.rank}
      </div>
    </div>
  );

  const text = (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2
          className={`text-5xl md:text-6xl text-stone-900 ${layout.nameRotate}`}
          style={handwriting}
        >
          {pick.name}
        </h2>
        <span
          className="text-stone-600 text-lg"
          style={handwritingTight}
        >
          — {pick.region}
        </span>
      </div>

      <p className="mt-3 text-stone-800 font-serif text-[15px] leading-relaxed italic border-l-2 border-stone-400/50 pl-3">
        {pick.blurb}
      </p>

      <div className="mt-4">
        <div
          className="text-stone-500 text-sm uppercase tracking-[0.2em] font-mono mb-1"
        >
          why it fits
        </div>
        <p className="text-stone-800 font-serif text-[14px] leading-relaxed">
          {pick.reasoning}
        </p>
      </div>

      <div className="mt-4">
        {pick.matchTags.map((t, i) => {
          const tints = [
            "bg-yellow-100",
            "bg-rose-100",
            "bg-emerald-100",
            "bg-sky-100",
            "bg-amber-100",
          ];
          return (
            <StickerChip key={t} tint={tints[i % tints.length]}>
              #{t}
            </StickerChip>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 items-center">
        <TicketStub pick={pick} />
        <div
          className="px-3 py-2 bg-[#fffaf0] border border-stone-700/40 shadow-sm"
          style={handwritingTight}
        >
          <span className="text-stone-500 text-xs uppercase tracking-widest font-mono mr-2">
            wx
          </span>
          <span className="text-stone-800 text-base">
            {pick.weather.highF}° / {pick.weather.lowF}° · {pick.weather.summary}
          </span>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div>
          <div
            className="text-stone-700 text-2xl mb-1"
            style={handwriting}
          >
            must-see
          </div>
          <ul className="space-y-2">
            {pick.attractions.slice(0, 3).map((a) => (
              <li key={a.name} className="font-serif text-[14px] text-stone-800">
                <span
                  className="text-stone-900 text-lg mr-1"
                  style={handwritingTight}
                >
                  ◇ {a.name}
                </span>
                <span className="block text-stone-700 text-[13px] leading-snug">
                  {a.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div
            className="text-stone-700 text-2xl mb-1"
            style={handwriting}
          >
            the plan
          </div>
          <ol className="space-y-2 relative">
            {pick.itinerary.map((it) => (
              <li
                key={it.day}
                className="font-serif text-[13px] text-stone-800 pl-7 relative"
              >
                <span
                  className="absolute left-0 top-0 w-6 h-6 rounded-full bg-amber-200/80 border border-stone-700/40 text-center text-stone-900 text-sm shadow-sm"
                  style={handwritingTight}
                >
                  {it.day}
                </span>
                <span
                  className="text-stone-900 text-base"
                  style={handwritingTight}
                >
                  {it.title}
                </span>
                <span className="block text-stone-700 leading-snug">
                  {it.description}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`relative ${layout.paperTint} ${layout.cardRotate} border border-stone-700/15 shadow-[0_8px_24px_-12px_rgba(60,40,20,0.35)] p-6 md:p-8 mb-16`}
      style={{
        backgroundImage:
          "radial-gradient(rgba(120,80,40,0.06) 1px, transparent 1px), radial-gradient(rgba(120,80,40,0.04) 1px, transparent 1px)",
        backgroundSize: "12px 12px, 22px 22px",
        backgroundPosition: "0 0, 6px 6px",
      }}
    >
      {/* page-level tape */}
      <div
        aria-hidden
        className="absolute -top-3 left-10 w-28 h-6 bg-yellow-200/70 rotate-[-6deg] shadow-sm"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, rgba(0,0,0,0.04) 4px 8px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-3 right-12 w-20 h-5 bg-rose-200/60 rotate-[8deg] shadow-sm"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, rgba(0,0,0,0.04) 4px 8px)",
        }}
      />

      <div
        className={`flex flex-col ${
          polaroidOnLeft ? "md:flex-row" : "md:flex-row-reverse"
        } gap-8 md:gap-10 items-start`}
      >
        {polaroid}
        {text}
      </div>
    </article>
  );
}

export default function PolaroidGalleryPage() {
  return (
    <main
      className="min-h-screen text-stone-900"
      style={{
        backgroundColor: "#f4ead2",
        backgroundImage: [
          "radial-gradient(at 20% 10%, rgba(212,170,90,0.18), transparent 50%)",
          "radial-gradient(at 80% 80%, rgba(160,110,60,0.14), transparent 55%)",
          "repeating-linear-gradient(0deg, rgba(120,80,40,0.04) 0 1px, transparent 1px 3px)",
          "repeating-linear-gradient(90deg, rgba(120,80,40,0.03) 0 1px, transparent 1px 3px)",
        ].join(", "),
      }}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <Link
          href="/gallery"
          className="inline-block text-stone-700 hover:text-stone-900 text-xl"
          style={handwriting}
        >
          ← back to the gallery
        </Link>

        {/* Cover header */}
        <header className="relative mt-6 mb-12">
          <div
            aria-hidden
            className="absolute -top-3 left-16 w-32 h-7 bg-yellow-200/70 rotate-[-4deg] shadow-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 4px, rgba(0,0,0,0.04) 4px 8px)",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-3 right-20 w-24 h-6 bg-rose-200/60 rotate-[6deg] shadow-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 4px, rgba(0,0,0,0.04) 4px 8px)",
            }}
          />

          <div
            className="bg-[#fffaf0] border border-stone-700/20 shadow-[0_10px_30px_-12px_rgba(60,40,20,0.35)] px-7 py-8 rotate-[-0.6deg]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0 30px, rgba(80,120,160,0.18) 30px 31px)",
            }}
          >
            <div
              className="text-stone-500 text-xs uppercase tracking-[0.4em] font-mono"
            >
              field journal · vol. 5
            </div>
            <h1
              className="mt-1 text-6xl md:text-7xl text-stone-900 leading-[0.95]"
              style={handwriting}
            >
              Where to in {TRIP.seasonHint}?
            </h1>
            <p
              className="mt-3 text-2xl text-stone-700"
              style={handwritingTight}
            >
              {TRIP.tripLengthDays} days, leaving {TRIP.origin} ({TRIP.originCode}) on{" "}
              {formatDate(TRIP.departOn)} — back {formatDate(TRIP.returnOn)}.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div
                className="px-3 py-1.5 bg-amber-100 border border-stone-700/30 shadow-sm rotate-[-2deg]"
                style={handwritingTight}
              >
                budget · {TRIP.budgetBand}
              </div>
              <div
                className="px-3 py-1.5 bg-emerald-100 border border-stone-700/30 shadow-sm rotate-[1.5deg]"
                style={handwritingTight}
              >
                pace · {TRIP.pace}
              </div>
              <div
                className="px-3 py-1.5 bg-sky-100 border border-stone-700/30 shadow-sm rotate-[-1deg]"
                style={handwritingTight}
              >
                vibes · {TRIP.vibes.join(" + ")}
              </div>
              <div
                className="px-3 py-1.5 bg-rose-100 border border-stone-700/30 shadow-sm rotate-[2deg]"
                style={handwritingTight}
              >
                no thx · {TRIP.dislikes}
              </div>
            </div>

            <div
              className="mt-5 text-stone-600 text-lg"
              style={handwriting}
            >
              ✈ four contenders, taped &amp; pasted below ↓
            </div>
          </div>
        </header>

        {/* Entries */}
        <section>
          {PICKS.map((pick, i) => (
            <ScrapEntry key={pick.slug} pick={pick} idx={i} />
          ))}
        </section>

        {/* Footer note */}
        <footer className="relative mt-10 mb-6">
          <div
            className="bg-[#fffaf0] border border-stone-700/20 shadow-md p-5 rotate-[0.6deg] max-w-xl mx-auto text-center"
          >
            <div
              className="text-stone-700 text-xl"
              style={handwriting}
            >
              p.s. — pick one &amp; book it before fares move ♥
            </div>
            <Link
              href="/gallery"
              className="mt-2 inline-block text-stone-600 underline-offset-4 hover:underline"
              style={handwritingTight}
            >
              ← back to the gallery
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
