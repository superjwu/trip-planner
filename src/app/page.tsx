import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { HeroCarousel } from "@/components/hero/HeroCarousel";

// Curated National-Park / scenic photos for the landing carousel. Unsplash
// hosts are stable and these specific photo IDs resolve. Kept inline rather
// than going through the seed/picsum fallback so the landing has real,
// recognizable park imagery instead of random nature stock.
const HERO_SLIDES = [
  {
    name: "Yosemite",
    region: "Sierra Nevada · CA",
    imageUrl:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Grand Canyon",
    region: "Colorado Plateau · AZ",
    imageUrl:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Zion",
    region: "Southern Utah",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Acadia",
    region: "Mount Desert Island · ME",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Olympic",
    region: "Pacific Northwest · WA",
    imageUrl:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Glacier",
    region: "Northern Rockies · MT",
    imageUrl:
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function Home() {
  const slides = HERO_SLIDES;

  return (
    <>
      <MainNav />
      <HeroCarousel slides={slides} />

      {/* ── How it works section ── */}
      <section
        className="mx-auto w-full max-w-5xl px-6 py-20"
        style={{ backgroundColor: "var(--paper)" }}
      >
        {/* Kicker */}
        <p
          className="mb-3 text-xs font-semibold tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
        >
          How it works
        </p>

        {/* Section headline — DM Sans display, italic accent word */}
        <h2
          className="text-3xl font-light leading-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          Tell us a few things, get{" "}
          <em style={{ fontStyle: "italic" }}>four destinations</em>{" "}
          that actually fit.
        </h2>

        {/* Step cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Step
            n="01"
            title="Tell us your shape"
            body="Origin city, dates, vibes (scenic, foodie, chill), budget band, pace. Two minutes, no account guesswork."
          />
          <Step
            n="02"
            title="See four destinations"
            body="A model ranks our curated U.S. seed list against your priorities. Each pick comes with a why and a tradeoff matrix."
          />
          <Step
            n="03"
            title="Refine + book"
            body="Keep, pass, or ask for cheaper / less crowded — round 2 lands in seconds. Day-by-day itinerary, cost, weather, booking links."
          />
        </div>

        {/* Single coral CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/plan"
            className="btn-accent inline-block px-10 py-4 text-base"
            style={{ fontFamily: "var(--font-body-stack)" }}
          >
            Plan a trip →
          </Link>
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-display-stack)", fontStyle: "italic", color: "var(--ink-soft)" }}
          >
            Browse the{" "}
            <Link
              href="/trips/demo"
              className="underline hover:opacity-70"
              style={{ color: "var(--slate-primary)" }}
            >
              demo result
            </Link>{" "}
            without signing up.
          </p>
        </div>
      </section>
    </>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-3xl border px-7 py-7 shadow-[0_20px_40px_-20px_rgba(31,41,55,0.10)]"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "var(--hairline)",
      }}
    >
      {/* Step number — slate-primary italic display */}
      <p
        className="text-3xl font-light"
        style={{ fontFamily: "var(--font-display-stack)", fontStyle: "italic", color: "var(--slate-primary)" }}
      >
        {n}
      </p>
      {/* Step title */}
      <h3
        className="mt-3 text-lg font-medium"
        style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
      >
        {title}
      </h3>
      {/* Step body */}
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {body}
      </p>
    </div>
  );
}
