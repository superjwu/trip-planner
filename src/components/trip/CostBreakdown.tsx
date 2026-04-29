import type { CostBreakdown as CostBreakdownT } from "@/lib/types";

export function CostBreakdown({ cost }: { cost: CostBreakdownT }) {
  const rows: { icon: string; label: string; value: number; source?: "amadeus" | "estimate" }[] = [
    { icon: "✈️", label: "Flight", value: cost.flightUsd, source: cost.flightSource },
    { icon: "🛏️", label: "Lodging", value: cost.lodgingUsd, source: cost.lodgingSource },
    { icon: "🍽️", label: "Food", value: cost.foodUsd },
    { icon: "🎟️", label: "Activities", value: cost.activitiesUsd },
  ];
  const overallLabel =
    cost.source === "amadeus"
      ? "Live"
      : cost.source === "mixed"
        ? "Partial live"
        : "Estimate";
  return (
    <div className="paper px-5 py-4">
      <div className="flex items-baseline justify-between">
        <h4
          className="font-serif text-lg font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          💰 Cost breakdown
        </h4>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            cost.source === "amadeus"
              ? "bg-[var(--sage)] text-[#4f5e3f]"
              : cost.source === "mixed"
                ? "bg-[var(--butter)] text-[#7a6638]"
                : "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
          }`}
        >
          {overallLabel}
        </span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 last:border-b-0"
          >
            <span className="text-[var(--ink-soft)]">
              <span className="mr-2">{row.icon}</span>
              {row.label}
              {row.source && (
                <span
                  className={`ml-2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    row.source === "amadeus"
                      ? "bg-[var(--sage)] text-[#4f5e3f]"
                      : "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
                  }`}
                >
                  {row.source === "amadeus" ? "Live" : "Est"}
                </span>
              )}
            </span>
            <span className="font-semibold text-[var(--ink)]">
              ${row.value.toLocaleString()}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between pt-1">
          <span
            className="font-serif font-semibold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            Total
          </span>
          <span
            className="font-serif text-xl font-semibold text-[var(--accent)]"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            ${cost.totalUsd.toLocaleString()}
          </span>
        </li>
      </ul>
      {cost.source !== "amadeus" && (
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
          {cost.source === "mixed"
            ? "Some lines are live quotes, others are estimates from typical costs. The booking links use real fares."
            : "All lines are estimates from typical costs for this destination + your dates. The booking links use real fares."}
        </p>
      )}
    </div>
  );
}
