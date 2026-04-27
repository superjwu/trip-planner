"use client";
import { useEffect, useState } from "react";

interface HeroSlide {
  imageUrl: string;
  name: string;
  region: string;
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
}

export function HeroCarousel({ slides, intervalMs = 5500 }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <section
      className="relative isolate flex min-h-[88vh] flex-col items-center justify-center overflow-hidden text-center"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <div
            key={slide.name}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <div
              className="ken-burns absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/85" />
          </div>
        ))}
      </div>

      <p className="hero-eyebrow mb-4 z-10">Trip Planning Copilot</p>
      <h1 className="hero-title mb-4 z-10">Find your next getaway.</h1>
      <p className="hero-tagline mb-10 max-w-xl px-6 z-10">
        Turn vague preferences into a curated short-list of destinations,
        with itinerary previews and booking links — in seconds.
      </p>

      <a
        href="/plan"
        className="z-10 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-[var(--primary-text)] shadow-[0_0_24px_var(--primary-glow)] transition hover:opacity-90"
      >
        Start planning →
      </a>

      <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-6 px-6">
        {slides[active] && (
          <p className="text-xs uppercase tracking-[0.25em] text-white/65">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            {slides[active].name} · {slides[active].region}
          </p>
        )}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 w-6 rounded-full transition ${
                i === active ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
