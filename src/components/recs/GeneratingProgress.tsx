"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Mimicked progress bar for the rec compute phase. The real backend doesn't
 * stream progress events back, so this is a paced fake — but the phases line
 * up with what's actually happening on the server (preFilter → rank → score
 * → hydrate). The fill asymptotes toward ~96% so the bar never visually
 * freezes during long Phase-B LLM calls (multi-stop trips can take 20–45s).
 *
 * Visual moves on top of the raw width:
 * - A coral→slate gradient *flows* L→R inside the bar via CSS keyframes
 *   (background-position animation, GPU-accelerated). Makes the bar feel
 *   alive even when the % counter is asymptoting.
 * - A glowing dot sits at the leading edge, pulsing 1.5s.
 * - The active phase line shimmers; completed phases fade in their pip.
 *
 * Also polls via router.refresh() every 2.5s. If trip.compute_status flips
 * to 'ready' on the server, the parent page re-renders without this
 * component and the user sees their picks.
 */
const PHASES: { upTo: number; label: string }[] = [
  { upTo: 12, label: "Filtering candidates against your constraints…" },
  { upTo: 42, label: "Asking ChatGPT to rank routes (single + multi-stop)…" },
  { upTo: 68, label: "Scoring tradeoffs (flight, budget, crowd, vibe)…" },
  { upTo: 88, label: "Hydrating weather and inter-stop drive estimates…" },
  { upTo: 100, label: "Finalizing your four picks…" },
];

export function GeneratingProgress({ pollEnabled = true }: { pollEnabled?: boolean }) {
  const [pct, setPct] = useState(2);
  const [elapsedS, setElapsedS] = useState(0);
  const router = useRouter();

  // Easing: log-style asymptote that approaches ~96% over ~60s.
  // Replaces the prior 10-second ease-out that hit 92% then froze for
  // another 20–35s of real LLM work. Math: pct = 96 * (1 - exp(-t/τ))
  // with τ ≈ 18s — gets to ~50% by 12s, ~80% by 28s, ~93% by 48s.
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsedMs = Date.now() - start;
      const elapsedSec = elapsedMs / 1000;
      const tau = 18;
      const target = 96 * (1 - Math.exp(-elapsedSec / tau));
      setPct(Math.min(96, Math.max(2, target)));
      setElapsedS(Math.floor(elapsedSec));
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!pollEnabled) return;
    const id = window.setInterval(() => router.refresh(), 2500);
    return () => window.clearInterval(id);
  }, [pollEnabled, router]);

  const phase = PHASES.find((p) => pct <= p.upTo) ?? PHASES[PHASES.length - 1];

  return (
    <>
      {/* Keyframes for the flowing gradient + leading-edge pulse. Tied to
          prefers-reduced-motion — when set, the bar is static. */}
      <style>{`
        @keyframes vipFlow {
          0%   { background-position:   0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes edgePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.55; }
        }
        @keyframes slateRulePulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .progress-flow {
            background-size: 200% 100%;
            animation: vipFlow 2.5s linear infinite;
          }
          .progress-edge {
            animation: edgePulse 1.4s ease-in-out infinite;
          }
          .slate-rule-pulse {
            animation: slateRulePulse 2s ease-in-out infinite;
          }
        }
      `}</style>

      <section
        className="mb-8 relative overflow-hidden px-6 py-7"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(44,84,116,0.07), transparent 60%), radial-gradient(circle at 80% 20%, rgba(231,111,81,0.05), transparent 50%), #ffffff",
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
            Generating · {elapsedS}s
          </p>
          <span
            className="font-mono text-sm font-semibold tabular-nums"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display-stack)" }}
          >
            {Math.round(pct)}%
          </span>
        </div>

        <h2
          className="mt-2 text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          Picking 4 destinations for you.
        </h2>

        <p
          className="mt-2 text-sm leading-relaxed italic"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {phase.label}
        </p>

        {/* Expected duration hint — swaps to a reassurance line once we
            cross the typical 50s envelope so the user doesn't think the
            page is stuck. */}
        <p
          className="mt-1 text-[11px] leading-relaxed"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {elapsedS > 50
            ? "Still working — large prompts can take a moment. We'll show your picks the instant the model finishes."
            : "Most trips finish in 20–40s. Multi-stop combos can run to ~50s."}
        </p>

        <div
          aria-hidden="true"
          className="slate-rule-pulse mt-4 h-0.5 w-12 rounded-full"
          style={{ background: "var(--slate-primary)" }}
        />

        {/* Progress bar — flowing gradient + glowing leading edge */}
        <div
          aria-hidden="true"
          className="relative mt-4 h-2.5 w-full overflow-visible rounded-full"
          style={{ background: "var(--paper-deep)" }}
        >
          <div
            className="progress-flow relative h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--slate-primary) 0%, var(--accent) 50%, var(--slate-primary) 100%)",
              boxShadow:
                "0 0 12px -2px rgba(231,111,81,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            {/* Leading-edge pulsing dot */}
            <span
              className="progress-edge absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 inline-block h-3.5 w-3.5 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow:
                  "0 0 0 3px rgba(231,111,81,0.20), 0 0 14px rgba(231,111,81,0.65)",
              }}
            />
          </div>
        </div>

        {/* Phase checklist with subtle active-phase highlight */}
        <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {PHASES.map((p, i) => {
            const reached = pct >= p.upTo - 6;
            const isCurrent = phase.upTo === p.upTo;
            return (
              <li key={p.label} className="flex items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${isCurrent ? "slate-rule-pulse" : ""}`}
                  style={{
                    background: reached
                      ? isCurrent
                        ? "var(--accent)"
                        : "var(--slate-primary)"
                      : "var(--hairline)",
                  }}
                />
                <span
                  className="text-[11px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body-stack)",
                    color: reached ? "var(--ink)" : "var(--ink-soft)",
                    fontWeight: isCurrent ? 600 : 400,
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
