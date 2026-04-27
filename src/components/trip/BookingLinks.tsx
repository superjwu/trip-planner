import type { BookingLinks as BookingLinksT } from "@/lib/types";

export function BookingLinks({ links }: { links: BookingLinksT }) {
  return (
    <div className="glass px-5 py-4">
      <h4
        className="font-serif text-lg font-bold text-white"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        🎟 Book it
      </h4>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Opens an outbound search with your origin + dates pre-filled.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <BookingButton href={links.flights} label="Search flights" sub="Skyscanner" />
        <BookingButton href={links.lodging} label="Find lodging" sub="Booking.com" />
      </div>
    </div>
  );
}

function BookingButton({
  href,
  label,
  sub,
}: {
  href: string;
  label: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
    >
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-[var(--text-muted)]">{sub}</p>
      </div>
      <span className="text-[var(--primary)] transition group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
