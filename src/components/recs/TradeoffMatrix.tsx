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
      className="mb-8 px-6 py-6"
      style={{
        background: "#ffffff",
        borderRadius: "1.5rem",
        border: "1px solid var(--hairline)",
        boxShadow: "0 30px 60px -20px rgba(31,41,55,0.15)",
      }}
    >
      {/* Title with slate-primary underline */}
      <div className="mb-4">
        <p
          className="text-[10px] uppercase tracking-[0.22em] mb-1"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
        >
          Why these 4
        </p>
        <div
          className="h-0.5 w-8 rounded-full"
          style={{ background: "var(--slate-primary)" }}
          aria-hidden="true"
        />
      </div>

      <p
        className="text-base leading-relaxed"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink)" }}
      >
        {whyTheseFour || (
          <span className="italic" style={{ color: "var(--ink-soft)" }}>
            (no overall summary — try refreshing.)
          </span>
        )}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th
                className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
              >
                Tradeoffs
              </th>
              {AXES.map((axis) => (
                <th
                  key={axis.key}
                  scope="col"
                  className="pb-2 pl-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
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
                <tr key={row.rank} style={{ borderTop: "1px solid var(--hairline)" }}>
                  <th
                    scope="row"
                    className="py-3 pr-3 text-left align-middle"
                    style={{ borderTop: "1px solid var(--hairline)" }}
                  >
                    <span
                      className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{
                        background: "var(--slate-tint)",
                        color: "var(--slate-primary)",
                        fontFamily: "var(--font-display-stack)",
                      }}
                    >
                      {row.rank}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                    >
                      {row.name}
                    </span>
                    <span
                      className="ml-1 text-xs"
                      style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body-stack)" }}
                    >
                      {row.state}
                    </span>
                  </th>
                  {AXES.map((axis) => {
                    const score = row.tradeoffs?.[axis.key] ?? 0;
                    return (
                      <td
                        key={axis.key}
                        className="py-3 pl-3 align-middle"
                        style={{ borderTop: "1px solid var(--hairline)" }}
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

      <p
        className="mt-3 text-[11px] leading-relaxed"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
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
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{
            background: i <= score ? "var(--slate-primary)" : "var(--hairline)",
          }}
        />
      ))}
    </span>
  );
}
