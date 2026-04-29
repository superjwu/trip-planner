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
    <section
      className="mb-8 bg-white px-6 py-7"
      style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)" }}
    >
      <div className="flex items-baseline justify-between">
        <p className="hero-eyebrow text-[var(--accent)]">Generating</p>
        <span className="font-mono text-sm font-semibold text-[var(--ink)]">
          {pct}%
        </span>
      </div>

      <h2
        className="mt-2 font-serif text-2xl font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Picking 4 destinations for you.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        {phase.label}
      </p>

      <div
        aria-hidden="true"
        className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[var(--paper-deep)]"
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-1 text-[11px] leading-relaxed text-[var(--ink-soft)] sm:grid-cols-2">
        {PHASES.map((p, i) => {
          const reached = pct >= p.upTo - 6;
          return (
            <li key={p.label} className="flex items-center gap-2">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  reached ? "bg-[var(--accent)]" : "bg-[var(--hairline)]"
                }`}
              />
              <span className={reached ? "text-[var(--ink)]" : ""}>
                {i + 1}. {p.label.replace("…", "")}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
