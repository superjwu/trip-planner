"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Mimicked progress bar for the rec compute phase. The real backend doesn't
 * stream progress events back, so this is a paced fake — but the phases line
 * up with what's actually happening on the server (preFilter → rank → score
 * → hydrate). Caps at 92 % until the page re-renders post-compute.
 *
 * Also polls via router.refresh() every 2.5 s. If the trip's compute_status
 * has flipped to 'ready' on the server, the parent page re-renders without
 * this component and the user sees the results without manually refreshing.
 *
 * `pollEnabled` defaults to true. Pass false from contexts where polling
 * would be wrong (e.g. failed-state).
 */
const PHASES: { upTo: number; label: string }[] = [
  { upTo: 8,  label: "Filtering candidates against your constraints…" },
  { upTo: 38, label: "Asking ChatGPT to rank the shortlist…" },
  { upTo: 64, label: "Scoring tradeoffs (flight, budget, crowd, vibe)…" },
  { upTo: 86, label: "Hydrating weather and cost estimates…" },
  { upTo: 100, label: "Finalizing your four picks…" },
];

export function GeneratingProgress({ pollEnabled = true }: { pollEnabled?: boolean }) {
  const [pct, setPct] = useState(2);
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / 10000);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setPct(2 + Math.round(eased * 90));
      if (t >= 1) window.clearInterval(id);
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!pollEnabled) return;
    const id = window.setInterval(() => {
      router.refresh();
    }, 2500);
    return () => window.clearInterval(id);
  }, [pollEnabled, router]);

  const phase = PHASES.find((p) => pct <= p.upTo) ?? PHASES[PHASES.length - 1];

  return (
    <>
      {/* Keyframes for pulse animation — respects prefers-reduced-motion */}
      <style>{`
        @keyframes slateRulePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .slate-rule-pulse {
            animation: slateRulePulse 2s ease-in-out infinite;
          }
        }
      `}</style>

      <section
        className="mb-8 px-6 py-7 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(44,84,116,0.07), transparent 60%), radial-gradient(circle at 80% 20%, rgba(44,84,116,0.05), transparent 50%), #ffffff",
          borderRadius: "1.5rem",
          border: "1px solid var(--hairline)",
          boxShadow: "0 30px 60px -20px rgba(31,41,55,0.15)",
        }}
      >
        <div className="flex items-baseline justify-between">
          <p
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
          >
            Generating
          </p>
          <span
            className="font-mono text-sm font-semibold tabular-nums"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display-stack)" }}
          >
            {pct}%
          </span>
        </div>

        <h2
          className="mt-2 text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          Picking 4 destinations for you.
        </h2>

        {/* Italic Manrope status line in soft ink */}
        <p
          className="mt-2 text-sm leading-relaxed italic"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {phase.label}
        </p>

        {/* Pulsing slate-primary rule */}
        <div
          aria-hidden="true"
          className="slate-rule-pulse mt-4 h-0.5 w-12 rounded-full"
          style={{ background: "var(--slate-primary)" }}
        />

        {/* Progress bar */}
        <div
          aria-hidden="true"
          className="mt-4 h-2 w-full overflow-hidden rounded-full"
          style={{ background: "var(--paper-deep)" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%`, background: "var(--accent)" }}
          />
        </div>

        {/* Phase checklist */}
        <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {PHASES.map((p, i) => {
            const reached = pct >= p.upTo - 6;
            return (
              <li key={p.label} className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: reached ? "var(--slate-primary)" : "var(--hairline)" }}
                />
                <span
                  className="text-[11px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body-stack)",
                    color: reached ? "var(--ink)" : "var(--ink-soft)",
                  }}
                >
                  {i + 1}. {p.label.replace("…", "")}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
