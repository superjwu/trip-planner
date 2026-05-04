import type { SeedDestination } from "@/lib/types";
import { destinationPhotoCredit } from "@/lib/photo";

/**
 * Tiny photo-credit overlay. Renders only when the photo came from the
 * Wikipedia/Commons manifest (otherwise no credit metadata is available).
 *
 * The parent `<img>`'s wrapper must have `class="group relative"` for the
 * `group-hover:opacity-100` reveal to work. CSS-only — no client JS.
 */
export function PhotoCredit({
  destination,
}: {
  destination: Pick<SeedDestination, "slug" | "heroPhotoUrl">;
}) {
  const credit = destinationPhotoCredit(destination);
  if (!credit) return null;
  return (
    <span
      className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-[var(--ink)]/65 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.10em] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
      style={{ fontFamily: "var(--font-body)" }}
    >
      Photo · {credit.author} · {credit.source}
    </span>
  );
}
