"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createRefineRound } from "@/app/trips/[id]/actions";

interface PickRow {
  rank: number;
  slug: string;
  name: string;
}

const PRESET_CODES = [
  { code: "cheaper",       emoji: "💸" },
  { code: "less-crowded",  emoji: "🌿" },
  { code: "shorter-flight",emoji: "✈️" },
  { code: "more-food",     emoji: "🍽️" },
  { code: "more-nature",   emoji: "🏞️" },
  { code: "more-cultural", emoji: "🏛️" },
] as const;

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
  const t = useTranslations("refine");
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
      className="mt-10 px-6 py-6"
      style={{
        background: "var(--paper-deep)",
        borderRadius: "1.5rem",
        border: "1px solid var(--hairline)",
      }}
    >
      {/* Coral kicker */}
      <p
        className="text-[10px] uppercase tracking-[0.22em] mb-2"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--accent)" }}
      >
        {t("kicker")}
      </p>
      <h3
        className="text-2xl font-semibold"
        style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
      >
        {t("dontLoveFour")}
      </h3>
      <p
        className="mt-2 text-sm"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {t("subhead")}
      </p>

      {/* Per-pick keep/pass toggles */}
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
                style={{ border: "1px solid var(--hairline)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{
                      background: "var(--slate-tint)",
                      color: "var(--slate-primary)",
                      fontFamily: "var(--font-display-stack)",
                    }}
                  >
                    {p.rank}
                  </span>
                  <span
                    className="truncate text-sm font-semibold"
                    style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                  >
                    {p.name}
                  </span>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <ToggleBtn
                    active={decision === "keep"}
                    onClick={() => flip(p.slug, "keep")}
                    tone="keep"
                    label={t("keep")}
                  />
                  <ToggleBtn
                    active={decision === "pass"}
                    onClick={() => flip(p.slug, "pass")}
                    tone="pass"
                    label={t("pass")}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Preset chips */}
      <div className="mt-5">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {t("orApplyDelta")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_CODES.map((p) => {
            const on = presets.includes(p.code);
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => togglePreset(p.code)}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition"
                style={
                  on
                    ? {
                        background: "var(--slate-primary)",
                        color: "#ffffff",
                        border: "1px solid var(--slate-primary)",
                        fontFamily: "var(--font-body-stack)",
                      }
                    : {
                        background: "#ffffff",
                        color: "var(--ink)",
                        border: "1px solid var(--hairline)",
                        fontFamily: "var(--font-body-stack)",
                      }
                }
              >
                <span className="mr-1">{p.emoji}</span>
                {t(`presets.${p.code}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Free-text textarea */}
      <div className="mt-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("moreSpecific")}
          rows={2}
          maxLength={400}
          className="w-full rounded-2xl border bg-white px-4 py-3 text-sm placeholder:text-[var(--ink-soft)] focus:outline-none"
          style={{
            borderColor: "var(--hairline)",
            color: "var(--ink)",
            fontFamily: "var(--font-body-stack)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
      </div>

      {error && (
        <p
          className="mt-3 rounded-2xl border px-4 py-2 text-sm"
          style={{
            borderColor: "rgba(201,115,115,0.40)",
            background: "rgba(201,115,115,0.10)",
            color: "#7a3f3f",
            fontFamily: "var(--font-body-stack)",
          }}
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {empty ? t("pickAtLeastOne") : summarize({ kept, avoided, presets, text })}
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={pending || empty}
          className="btn-accent rounded-full px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{ fontFamily: "var(--font-body-stack)" }}
        >
          {pending ? t("refining") : t("submit")}
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
  tone: "keep" | "pass";
  label: string;
}) {
  const activeStyle =
    tone === "keep"
      ? { background: "var(--slate-primary)", color: "#ffffff", border: "1px solid var(--slate-primary)" }
      : { background: "var(--accent)", color: "#ffffff", border: "1px solid var(--accent)" };

  const inactiveStyle = {
    background: "#ffffff",
    color: "var(--ink-soft)",
    border: "1px solid var(--hairline)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1 text-xs font-medium transition"
      style={{
        ...(active ? activeStyle : inactiveStyle),
        fontFamily: "var(--font-body-stack)",
      }}
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
