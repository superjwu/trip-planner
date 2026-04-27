import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { destinationPhotoUrl } from "@/lib/photo";
import { DESTINATIONS } from "@/lib/seed/destinations";

const HERO_SLUGS = [
  "big-sur-ca",
  "acadia-np",
  "charleston-sc",
  "yellowstone-np",
  "maui-hi",
  "santa-fe-nm",
];

export default function Home() {
  const slides = HERO_SLUGS.map((slug) => {
    const dest = DESTINATIONS.find((d) => d.slug === slug)!;
    return {
      imageUrl: destinationPhotoUrl(dest),
      name: dest.name,
      region: `${dest.region} · ${dest.state}`,
    };
  });

  return (
    <>
      <MainNav />
      <HeroCarousel slides={slides} />

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="hero-eyebrow mb-3 text-[var(--accent)]">How it works</p>
        <h2
          className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          Tell us a few things, get four destinations that actually fit.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Step
            n="01"
            title="Tell us your shape"
            body="Origin city, dates, vibes (scenic, foodie, chill), budget band, pace. Two minutes, no account guesswork."
          />
          <Step
            n="02"
            title="See four destinations"
            body="A model ranks our curated U.S. seed list against your priorities. Each pick comes with a one-paragraph why."
          />
          <Step
            n="03"
            title="Drill in + book"
            body="Click any pick for a day-by-day itinerary, weather forecast, cost breakdown, and outbound flight + lodging links."
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/plan"
            className="rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-[var(--primary-text)] shadow-[0_0_24px_var(--primary-glow)] transition hover:opacity-90"
          >
            Plan a trip →
          </Link>
          <p className="text-xs text-[var(--text-muted)]">
            Browse the <Link href="/trips/demo" className="underline hover:text-white">demo result</Link>{" "}
            without signing up.
          </p>
        </div>
      </section>
    </>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="glass-strong px-6 py-6">
      <p
        className="font-serif text-3xl font-bold text-[var(--primary)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        {n}
      </p>
      <h3
        className="mt-3 font-serif text-lg font-bold text-white"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {body}
      </p>
    </div>
  );
}
