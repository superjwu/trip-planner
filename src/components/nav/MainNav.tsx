import Link from "next/link";

export function MainNav() {
  return (
    <header
      className="sticky top-0 z-50 flex h-14 items-center border-b border-white/10 bg-black/60 px-6 backdrop-blur-md"
      style={{ height: "var(--nav-h)" }}
    >
      <Link
        href="/"
        className="flex-1 font-serif text-lg font-bold text-[var(--primary)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Trip Planner
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/trips"
          className="rounded-full border border-white/15 px-4 py-1.5 text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-white"
        >
          My trips
        </Link>
        <Link
          href="/settings"
          className="rounded-full border border-white/15 px-4 py-1.5 text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-white"
        >
          Settings
        </Link>
        <Link
          href="/plan"
          className="rounded-full bg-[var(--primary)] px-4 py-1.5 font-semibold text-[var(--primary-text)] transition hover:opacity-90"
        >
          New trip
        </Link>
      </nav>
    </header>
  );
}
