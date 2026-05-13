import type { CostBreakdown as CostBreakdownT, ParsedStop } from "@/lib/types";

export function CostBreakdown({
  cost,
  stops,
}: {
  cost: CostBreakdownT;
  /**
   * Phase B: when supplied alongside `cost.perStopCosts`, the breakdown
   * renders per-stop rows labeled with each stop's name + days. Without
   * `stops` (e.g. legacy callers) the per-stop block falls back to slug.
   */
  stops?: ParsedStop[];
}) {
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

  // Phase B: multi-stop trips get a per-stop breakdown block + transit row.
  // Single-stop trips (perStopCosts undefined) render exactly as before.
  const isMultiStop =
    Array.isArray(cost.perStopCosts) && cost.perStopCosts.length > 1;
  const stopNameBySlug = new Map(
    (stops ?? []).map((s) => [s.slug, s.destination.name] as const),
  );

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

      {/* Phase B: per-stop breakdown — only for multi-stop routes. */}
      {isMultiStop && cost.perStopCosts ? (
        <div className="mt-4 rounded-2xl bg-[var(--paper-deep)] px-4 py-3">
          <p
            className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slate-primary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            By stop
          </p>
          <div className="space-y-1.5">
            {cost.perStopCosts.map((s) => {
              const subtotal = s.lodgingUsd + s.foodUsd + s.activitiesUsd;
              const name = stopNameBySlug.get(s.slug) ?? s.slug;
              return (
                <div
                  key={s.slug}
                  className="flex items-baseline justify-between text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <p className="text-[var(--ink)]">
                    <span className="font-medium">{name}</span>
                    <span className="ml-2 text-xs text-[var(--ink-soft)]">
                      · {s.days} {s.days === 1 ? "day" : "days"}
                    </span>
                  </p>
                  <p className="tabular-nums font-medium text-[var(--ink)]">
                    ${subtotal.toLocaleString()}
                  </p>
                </div>
              );
            })}
            {typeof cost.interStopDriveUsd === "number" && cost.interStopDriveUsd > 0 ? (
              <div
                className="mt-1 flex items-baseline justify-between border-t border-[var(--hairline)] pt-1.5 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <p className="text-[var(--ink-soft)]">Inter-stop drive</p>
                <p className="tabular-nums text-[var(--ink-soft)]">
                  ${cost.interStopDriveUsd.toLocaleString()}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

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
