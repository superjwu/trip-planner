import type { Tradeoffs } from "@/lib/types";

interface MatrixRow {
  rank: number;
  name: string;
  state: string;
  tradeoffs: Tradeoffs | null;
}

const AXES: { key: keyof Tradeoffs; label: string; hint: string }[] = [
  { key: "flight", label: "Flight", hint: "How short / easy from your origin" },
  { key: "budget", label: "Budget", hint: "Headroom under your ceiling" },
  { key: "crowd", label: "Crowd", hint: "How quiet for these dates" },
  { key: "vibeFit", label: "Vibe", hint: "Match against your priorities" },
  { key: "seasonFit", label: "Season", hint: "Right time of year" },
];

/**
 * Replaces the v1 hollow `CompareHeader` "Why these 4" body. Renders the
 * LLM-written paragraph above a 4-pick × 5-axis dot grid showing tradeoffs.
 *
 * Each cell = three dots; filled count = score 1..3. Empty dots are still
 * drawn so the eye can scan the grid as a matrix, not as a sparse heatmap.
 */
export function TradeoffMatrix({
  whyTheseFour,
  rows,
}: {
  whyTheseFour?: string | null;
  rows: MatrixRow[];
}) {
  return (
    <section
      className="mb-8 bg-white px-6 py-6"
      style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)" }}
    >
      <p className="hero-eyebrow mb-2 text-[var(--accent)]">Why these 4</p>
      <p className="text-base leading-relaxed text-[var(--ink)]">
        {whyTheseFour || (
          <span className="italic text-[var(--ink-soft)]">
            (no overall summary — try refreshing.)
          </span>
        )}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                Tradeoffs
              </th>
              {AXES.map((axis) => (
                <th
                  key={axis.key}
                  scope="col"
                  className="pb-2 pl-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]"
                  title={axis.hint}
                >
                  {axis.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows
              .slice()
              .sort((a, b) => a.rank - b.rank)
              .map((row) => (
                <tr key={row.rank} className="border-t border-[var(--hairline)]">
                  <th
                    scope="row"
                    className="border-t border-[var(--hairline)] py-3 pr-3 text-left align-middle"
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--paper-deep)] text-[11px] font-semibold text-[var(--ink)]">
                      {row.rank}
                    </span>
                    <span className="font-serif text-sm font-semibold text-[var(--ink)]">
                      {row.name}
                    </span>
                    <span className="ml-1 text-xs text-[var(--ink-soft)]">{row.state}</span>
                  </th>
                  {AXES.map((axis) => {
                    const score = row.tradeoffs?.[axis.key] ?? 0;
                    return (
                      <td
                        key={axis.key}
                        className="border-t border-[var(--hairline)] py-3 pl-3 align-middle"
                      >
                        <DotScale score={score} />
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
        ●●● = strong on this axis · ●○○ = a real trade. Hover the column header for what each axis means.
      </p>
    </section>
  );
}

function DotScale({ score }: { score: number }) {
  return (
    <span aria-label={`${score} out of 3`} className="inline-flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            i <= score ? "bg-[var(--accent)]" : "bg-[var(--paper-deep)]"
          }`}
        />
      ))}
    </span>
  );
}
