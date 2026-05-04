import type { NormalizedTripInput } from "@/lib/types";
import { getTranslations } from "next-intl/server";

/**
 * Compact trip-metadata strip rendered above the TradeoffMatrix. Replaces
 * the v1 "Why these 4" body — that's now the LLM-written paragraph the
 * matrix renders. This component is just the inputs-at-a-glance band.
 */
export async function CompareHeader({
  input,
}: {
  input: NormalizedTripInput;
  /** Legacy prop, no longer rendered (kept for back-compat). */
  destinationCount?: number;
}) {
  const t = await getTranslations("trip");
  const lengthLabel = `${input.tripLengthDays} days`;

  return (
    <section
      className="mb-6 flex flex-wrap items-center gap-2 px-5 py-3 text-xs"
      style={{
        background: "var(--paper-deep)",
        borderRadius: "1.5rem",
        border: "1px solid var(--hairline)",
      }}
    >
      <span
        className="mr-1 text-[10px] uppercase tracking-[0.22em]"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
      >
        {t("trip")}
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
    <span
      className="rounded-full border px-3 py-1"
      style={{
        borderColor: "var(--hairline)",
        background: "#ffffff",
        color: "var(--ink)",
        fontFamily: "var(--font-body-stack)",
      }}
    >
      {children}
    </span>
  );
}
