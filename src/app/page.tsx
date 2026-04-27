import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="hero-eyebrow mb-4">Trip Planning Copilot</p>
      <h1 className="hero-title mb-4">Find your next getaway.</h1>
      <p className="hero-tagline mb-10 max-w-xl">
        Turn vague preferences into a curated short-list of destinations, with
        itinerary previews and booking links — in seconds.
      </p>
      <Link
        href="/plan"
        className="rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-semibold text-[var(--primary-text)] shadow-[0_0_24px_var(--primary-glow)] transition hover:opacity-90"
      >
        Start planning →
      </Link>
      <p className="mt-12 text-xs text-[var(--text-muted)]">
        Polish stub — full landing in Phase 8.
      </p>
    </main>
  );
}
