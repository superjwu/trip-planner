import Link from "next/link";

export function MainNav() {
  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center border-b border-[var(--hairline)] bg-[var(--paper)]/85 px-6 backdrop-blur-md"
      style={{ height: "var(--nav-h)" }}
    >
      <Link
        href="/"
        className="flex-1 font-serif text-lg font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        <span className="text-[var(--accent)]">·</span> Trip Planner
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/trips"
          className="rounded-full border border-[var(--hairline)] bg-white/60 px-4 py-1.5 text-[var(--ink-soft)] transition hover:border-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          My trips
        </Link>
        <Link
          href="/settings"
          className="rounded-full border border-[var(--hairline)] bg-white/60 px-4 py-1.5 text-[var(--ink-soft)] transition hover:border-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          Settings
        </Link>
        <Link
          href="/plan"
          className="rounded-full bg-[var(--accent)] px-4 py-1.5 font-semibold text-white transition hover:bg-[var(--accent-soft)]"
        >
          New trip
        </Link>
      </nav>
    </header>
  );
}
