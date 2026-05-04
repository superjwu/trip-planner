import type { CostBreakdown as CostBreakdownT } from "@/lib/types";

export function CostBreakdown({ cost }: { cost: CostBreakdownT }) {
  const rows: { label: string; value: number; source?: "amadeus" | "estimate" }[] = [
    { label: "Flight", value: cost.flightUsd, source: cost.flightSource },
    { label: "Lodging", value: cost.lodgingUsd, source: cost.lodgingSource },
    { label: "Food", value: cost.foodUsd },
    { label: "Activities", value: cost.activitiesUsd },
  ];
  const overallLabel =
    cost.source === "amadeus"
      ? "Live"
      : cost.source === "mixed"
        ? "Partial live"
        : "Estimate";

  return (
    <div className="rounded-3xl border border-[var(--hairline)] bg-white p-6 shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]">
      {/* Header */}
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <p
            className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slate-primary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Costs
          </p>
          <h4
            className="text-lg font-medium text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cost breakdown
          </h4>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
            cost.source === "amadeus"
              ? "bg-[var(--slate-tint)] text-[var(--slate-primary)]"
              : cost.source === "mixed"
                ? "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
                : "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {overallLabel}
        </span>
      </div>

      {/* 4-column strip with hairline dividers */}
      <div className="grid grid-cols-4 gap-px rounded-2xl bg-[var(--hairline)] overflow-hidden">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1.5 bg-[var(--paper)] px-3 py-3"
          >
            <p
              className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {row.label}
              {row.source && (
                <span
                  className={`ml-1.5 rounded px-1 py-0.5 text-[8px] font-medium uppercase tracking-wider ${
                    row.source === "amadeus"
                      ? "bg-[var(--slate-tint)] text-[var(--slate-primary)]"
                      : "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
                  }`}
                >
                  {row.source === "amadeus" ? "Live" : "Est"}
                </span>
              )}
            </p>
            <p
              className="tabular-nums text-sm font-medium text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}
            >
              ${row.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Total row */}
      <div className="mt-px rounded-2xl bg-[var(--slate-tint)] px-4 py-3 flex items-baseline justify-between">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slate-primary)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Total
        </p>
        <p
          className="tabular-nums text-xl font-medium text-[var(--slate-primary)]"
          style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}
        >
          ${cost.totalUsd.toLocaleString()}
        </p>
      </div>

      {cost.source !== "amadeus" && (
        <p
          className="mt-4 text-[11px] leading-relaxed text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {cost.source === "mixed"
            ? "Some lines are live quotes, others are estimates from typical costs. The booking links use real fares."
            : "All lines are estimates from typical costs for this destination + your dates. The booking links use real fares."}
        </p>
      )}
    </div>
  );
}
