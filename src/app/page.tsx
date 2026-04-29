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

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="hero-eyebrow mb-3 text-[var(--accent)]">How it works</p>
        <h2
          className="font-serif text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          Tell us a few things, get four destinations that actually fit.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Step
            n="01"
            tone="butter"
            title="Tell us your shape"
            body="Origin city, dates, vibes (scenic, foodie, chill), budget band, pace. Two minutes, no account guesswork."
          />
          <Step
            n="02"
            tone="sage"
            title="See four destinations"
            body="A model ranks our curated U.S. seed list against your priorities. Each pick comes with a why and a tradeoff matrix."
          />
          <Step
            n="03"
            tone="rose"
            title="Refine + book"
            body="Keep, pass, or ask for cheaper / less crowded — round 2 lands in seconds. Day-by-day itinerary, cost, weather, booking links."
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/plan"
            className="rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[var(--accent-soft)]"
          >
            Plan a trip →
          </Link>
          <p className="text-xs text-[var(--ink-soft)]">
            Browse the <Link href="/trips/demo" className="underline hover:text-[var(--ink)]">demo result</Link>{" "}
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
  tone,
}: {
  n: string;
  title: string;
  body: string;
  tone: "butter" | "sage" | "rose";
}) {
  const bg =
    tone === "butter" ? "bg-[var(--butter)]" : tone === "sage" ? "bg-[var(--sage)]" : "bg-[var(--rose)]";
  return (
    <div className={`px-6 py-6 ${bg}`} style={{ borderRadius: "var(--radius-lg)" }}>
      <p
        className="font-serif text-3xl font-semibold text-[var(--accent)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        {n}
      </p>
      <h3
        className="mt-3 font-serif text-lg font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/85">
        {body}
      </p>
    </div>
  );
}
