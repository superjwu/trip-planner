import type { NormalizedTripInput } from "@/lib/types";

/**
 * Compact trip-metadata strip rendered above the TradeoffMatrix. Replaces
 * the v1 "Why these 4" body — that's now the LLM-written paragraph the
 * matrix renders. This component is just the inputs-at-a-glance band.
 */
export function CompareHeader({
  input,
}: {
  input: NormalizedTripInput;
  /** Legacy prop, no longer rendered (kept for back-compat). */
  destinationCount?: number;
}) {
  const lengthLabel = `${input.tripLengthDays} days`;

  return (
    <section className="surface-deep mb-6 flex flex-wrap items-center gap-2 px-5 py-3 text-xs">
      <span className="mr-1 text-[10px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
        Trip
      </span>
      <Pill>{input.originCode}</Pill>
      <Pill>
        {input.departOn} → {input.returnOn}
      </Pill>
      <Pill>{lengthLabel}</Pill>
      <Pill>{input.vibes.join(" + ")}</Pill>
      <Pill>{input.budgetBand}</Pill>
      <Pill>{input.pace}</Pill>
      <Pill>{input.seasonHint}</Pill>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--hairline)] bg-white/70 px-3 py-1 text-[var(--ink)]">
      {children}
    </span>
  );
}
