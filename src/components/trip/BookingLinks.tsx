import type { BookingLinks as BookingLinksT } from "@/lib/types";

export function BookingLinks({ links }: { links: BookingLinksT }) {
  return (
    <div className="paper px-5 py-4">
      <h4
        className="font-serif text-lg font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        🎟 Book it
      </h4>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        Opens an outbound search with your origin + dates pre-filled.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <BookingButton href={links.flights} label="Search flights" sub="Skyscanner" primary />
        <BookingButton href={links.lodging} label="Find lodging" sub="Booking.com" />
      </div>
    </div>
  );
}

function BookingButton({
  href,
  label,
  sub,
  primary,
}: {
  href: string;
  label: string;
  sub: string;
  primary?: boolean;
}) {
  if (primary) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between rounded-2xl bg-[var(--accent)] px-4 py-3 text-white shadow-sm transition hover:bg-[var(--accent-soft)]"
      >
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-white/80">{sub}</p>
        </div>
        <span className="text-white transition group-hover:translate-x-0.5">→</span>
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-2xl border border-[var(--hairline)] bg-white px-4 py-3 transition hover:border-[var(--ink-soft)]"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
        <p className="text-xs text-[var(--ink-soft)]">{sub}</p>
      </div>
      <span className="text-[var(--accent)] transition group-hover:translate-x-0.5">→</span>
    </a>
  );
}
