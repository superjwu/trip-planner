"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRefineRound } from "@/app/trips/[id]/actions";

interface PickRow {
  rank: number;
  slug: string;
  name: string;
}

const PRESETS: { code: string; label: string; emoji: string }[] = [
  { code: "cheaper", label: "Cheaper", emoji: "💸" },
  { code: "less-crowded", label: "Less crowded", emoji: "🌿" },
  { code: "shorter-flight", label: "Shorter flight", emoji: "✈️" },
  { code: "more-food", label: "More food", emoji: "🍽️" },
  { code: "more-nature", label: "More nature", emoji: "🏞️" },
  { code: "more-cultural", label: "More cultural", emoji: "🏛️" },
];

/**
 * Refine round UI. Per-pick keep/pass toggles + preset deltas + free-text
 * feedback + Refine →. On submit calls createRefineRound() and navigates to
 * the new round (router.refresh() picks up the new active_round_id).
 */
export function RefinePanel({
  tripId,
  picks,
}: {
  tripId: string;
  picks: PickRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [decisions, setDecisions] = useState<Record<string, "keep" | "pass" | null>>({});
  const [presets, setPresets] = useState<string[]>([]);
  const [text, setText] = useState("");

  function flip(slug: string, choice: "keep" | "pass") {
    setDecisions((prev) => ({
      ...prev,
      [slug]: prev[slug] === choice ? null : choice,
    }));
  }

  function togglePreset(code: string) {
    setPresets((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code],
    );
  }

  const kept = Object.entries(decisions).filter(([, v]) => v === "keep").map(([s]) => s);
  const avoided = Object.entries(decisions).filter(([, v]) => v === "pass").map(([s]) => s);
  const empty = presets.length === 0 && text.trim() === "" && kept.length === 0 && avoided.length === 0;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createRefineRound({
        tripId,
        feedbackText: text.trim(),
        feedbackPresets: presets,
        keptSlugs: kept,
        avoidedSlugs: avoided,
      });
      if (!res.ok) {
        setError(res.error ?? "Refine failed");
        return;
      }
      // Reset local state; navigate to the new round.
      setDecisions({});
      setPresets([]);
      setText("");
      router.refresh();
    });
  }

  return (
    <section
      className="mt-10 bg-[var(--lavender)] px-6 py-6"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <p className="hero-eyebrow mb-2 text-[var(--accent)]">Refine</p>
      <h3
        className="font-serif text-2xl font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Don&apos;t love the four? Tell us what to change.
      </h3>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Keep what you liked, pass on what you don&apos;t, or click a preset. We&apos;ll re-rank in 6–10s.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {picks
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((p) => {
            const decision = decisions[p.slug] ?? null;
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--paper-deep)] text-[11px] font-semibold text-[var(--ink)]">
                    {p.rank}
                  </span>
                  <span className="truncate text-sm font-semibold text-[var(--ink)]">
                    {p.name}
                  </span>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <ToggleBtn
                    active={decision === "keep"}
                    onClick={() => flip(p.slug, "keep")}
                    tone="sage"
                    label="Keep"
                  />
                  <ToggleBtn
                    active={decision === "pass"}
                    onClick={() => flip(p.slug, "pass")}
                    tone="rose"
                    label="Pass"
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">
          Or apply a delta
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const on = presets.includes(p.code);
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => togglePreset(p.code)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  on
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--hairline)] bg-white text-[var(--ink)] hover:border-[var(--ink-soft)]"
                }`}
              >
                <span className="mr-1">{p.emoji}</span>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="More specific? e.g. 'somewhere with more hiking, max $1500 total'"
          rows={2}
          maxLength={400}
          className="w-full rounded-2xl border border-[var(--hairline)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-[#c97373]/40 bg-[#c97373]/10 px-4 py-2 text-sm text-[#7a3f3f]">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--ink-soft)]">
          {empty ? "Pick at least one signal." : summarize({ kept, avoided, presets, text })}
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={pending || empty}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Refining…" : "Refine →"}
        </button>
      </div>
    </section>
  );
}

function ToggleBtn({
  active,
  onClick,
  tone,
  label,
}: {
  active: boolean;
  onClick: () => void;
  tone: "sage" | "rose";
  label: string;
}) {
  const onClass =
    tone === "sage"
      ? "bg-[var(--sage)] text-[#4f5e3f] border-transparent"
      : "bg-[var(--rose)] text-[#7a3f3f] border-transparent";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? onClass
          : "border-[var(--hairline)] bg-white text-[var(--ink-soft)] hover:border-[var(--ink-soft)]"
      }`}
    >
      {label}
    </button>
  );
}

function summarize(args: {
  kept: string[];
  avoided: string[];
  presets: string[];
  text: string;
}): string {
  const bits: string[] = [];
  if (args.kept.length) bits.push(`keep ${args.kept.length}`);
  if (args.avoided.length) bits.push(`pass ${args.avoided.length}`);
  if (args.presets.length) bits.push(`${args.presets.length} preset${args.presets.length === 1 ? "" : "s"}`);
  if (args.text.trim()) bits.push("free-text");
  return bits.join(" · ");
}
