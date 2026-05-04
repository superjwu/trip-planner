import type { BookingLinks as BookingLinksT } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export async function BookingLinks({ links }: { links: BookingLinksT }) {
  const t = await getTranslations("trip");

  return (
    <div className="rounded-3xl border border-[var(--hairline)] bg-white p-6 shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]">
      <p
        className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slate-primary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {t("bookIt")}
      </p>
      <h4
        className="text-lg font-medium text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("bookingHandoff")}
      </h4>
      <p
        className="mt-1 text-xs text-[var(--ink-soft)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {t("bookingSubhead")}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <BookingButton href={links.flights} label={t("searchFlights")} sub="Skyscanner" primary openLabel={t("open")} />
        <BookingButton href={links.lodging} label={t("findLodging")} sub="Booking.com" openLabel={t("open")} />
      </div>
    </div>
  );
}

function BookingButton({
  href,
  label,
  sub,
  primary,
  openLabel,
}: {
  href: string;
  label: string;
  sub: string;
  primary?: boolean;
  openLabel: string;
}) {
  if (primary) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between rounded-3xl bg-[var(--accent)] px-5 py-4 text-white shadow-[0_8px_20px_-8px_rgba(231,111,81,0.40)] transition hover:opacity-90"
      >
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {sub}
          </p>
          <p
            className="mt-0.5 text-sm font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {label}
          </p>
        </div>
        <span className="transition group-hover:translate-x-0.5">{openLabel}</span>
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-3xl border border-[var(--slate-primary)] px-5 py-4 transition hover:bg-[var(--slate-tint)]"
    >
      <div>
        <p
          className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--slate-primary)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {sub}
        </p>
        <p
          className="mt-0.5 text-sm font-medium text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </p>
      </div>
      <span
        className="text-[var(--slate-primary)] transition group-hover:translate-x-0.5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {openLabel}
      </span>
    </a>
  );
}
