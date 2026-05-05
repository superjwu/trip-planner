"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BUDGET_BANDS,
  ORIGIN_CITIES,
  type BudgetBand,
  type OriginCityCode,
  type Pace,
  type RawTripInput,
  type Vibe,
} from "@/lib/types";
import { createTrip } from "@/app/plan/actions";
import { DateRangePicker } from "@/components/plan/DateRangePicker";
import { ENRICHED_DESTINATIONS as DESTINATIONS } from "@/lib/seed/enrich-destinations";

const VIBE_CODES: { code: Vibe; hint: string }[] = [
  { code: "city",      hint: "neighborhoods, museums, urban energy" },
  { code: "nature",    hint: "national parks, forests, lakes" },
  { code: "foodie",    hint: "iconic restaurants, food scenes" },
  { code: "scenic",    hint: "iconic drives, viewpoints" },
  { code: "chill",     hint: "low-key, slow pace, rest" },
  { code: "adventure", hint: "hiking, climbing, water sports" },
  { code: "cultural",  hint: "history, art, architecture" },
  { code: "nightlife", hint: "live music, bars, late dinners" },
];

const PACE_CODES: { code: Pace; hint: string }[] = [
  { code: "relaxed",  hint: "1–2 things per day" },
  { code: "balanced", hint: "a few highlights + downtime" },
  { code: "packed",   hint: "see as much as possible" },
];

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function PreferenceWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const anchorSlug = searchParams.get("anchor");
  const anchorDest = anchorSlug ? DESTINATIONS.find((d) => d.slug === anchorSlug) : null;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("plan");

  const [origin, setOrigin] = useState<OriginCityCode>("NYC");
  const [departOn, setDepartOn] = useState(todayPlus(60));
  const [returnOn, setReturnOn] = useState(todayPlus(64));
  // Lazy initializer so the anchor's primary tag is folded in at construction
  // time (avoids setState-in-effect cascading-render warning).
  const [vibes, setVibes] = useState<Vibe[]>(() => {
    const base: Vibe[] = ["scenic", "foodie"];
    if (anchorDest && anchorDest.tags.length > 0) {
      const firstTag = anchorDest.tags[0];
      if (!base.includes(firstTag)) return [firstTag, ...base];
    }
    return base;
  });
  const [budget, setBudget] = useState<BudgetBand>("1000-2000");
  const [pace, setPace] = useState<Pace>("balanced");
  const [dislikes, setDislikes] = useState("");
  const [notes, setNotes] = useState("");

  // Anchor tag is folded into initial vibes via lazy useState above; no
  // effect-based setState needed.

  const tripDays = Math.max(
    1,
    Math.round((Date.parse(returnOn) - Date.parse(departOn)) / 86400_000),
  );

  function toggleVibe(v: Vibe) {
    setVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (vibes.length === 0) {
      setError("Pick at least one vibe.");
      return;
    }
    if (Date.parse(returnOn) <= Date.parse(departOn)) {
      setError("Return date must be after departure.");
      return;
    }
    if (tripDays > 14) {
      setError("Trips longer than 14 days aren't supported yet — try a shorter window.");
      return;
    }

    // If the user navigated from /destinations?anchor={slug}, surface that
    // hint in the user notes so the ranker can bias toward the anchor +
    // nearby destinations. Soft signal — the candidate pool isn't restricted.
    const anchorHint = anchorDest
      ? `Anchor preference: trip should center on ${anchorDest.name} (${anchorDest.region}). Prioritize the anchor and nearby destinations.`
      : "";
    const userNotes = notes.trim();
    const combinedNotes = [anchorHint, userNotes].filter(Boolean).join("\n\n");

    const raw: RawTripInput = {
      origin,
      departOn,
      returnOn,
      vibes,
      budget,
      pace,
      dislikes: dislikes.trim() || undefined,
      notes: combinedNotes || undefined,
      // Phase F: anchor is now a structural commitment, not just a soft hint
      // in `notes`. The rec engine treats it as "must include at rank 1 or 2".
      anchorSlug: anchorDest?.slug,
    };

    startTransition(async () => {
      const res = await createTrip(raw);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/trips/${res.tripId}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl space-y-8 px-6 py-12"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* ── Anchor pill ── */}
      {anchorDest && (
        <div
          className="flex items-center justify-between rounded-2xl border px-5 py-3"
          style={{ borderColor: "var(--slate-primary)", backgroundColor: "var(--slate-tint)" }}
        >
          <p className="text-sm" style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}>
            Planning around <strong style={{ fontFamily: "var(--font-display-stack)" }}>{anchorDest.name}</strong>
          </p>
          <button
            type="button"
            onClick={() => router.replace("/plan")}
            className="ml-4 text-lg font-semibold leading-none transition-opacity hover:opacity-60"
            style={{ color: "var(--slate-primary)" }}
            aria-label="Clear anchor destination"
          >
            ×
          </button>
        </div>
      )}
      {/* Phase F: hidden input removed — anchor is submitted via the typed
          `RawTripInput` object in onSubmit, not as form data. */}

      {/* ── Page header ── */}
      <header className="mb-2 text-center">
        <p
          className="mb-3 text-xs font-semibold tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
        >
          {t("planATrip")}
        </p>
        <h1
          className="text-4xl font-light leading-tight"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          {t("tellUsFewThings")}
        </h1>
        <p
          className="mt-2 text-base italic"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
        >
          {t("subheadFull")}
        </p>
      </header>

      {/* ── Step 01 · Where from? ── */}
      <Section step="01" stepLabel="WHERE FROM?" title={t("whereFlying")}>
        <div className="flex flex-wrap gap-2">
          {ORIGIN_CITIES.map((c) => (
            <Chip
              key={c.code}
              active={origin === c.code}
              onClick={() => setOrigin(c.code)}
            >
              {c.label}
              <span className="ml-1.5 text-xs opacity-60">({c.airport})</span>
            </Chip>
          ))}
        </div>
      </Section>

      {/* ── Step 02 · Dates ── */}
      <Section step="02" stepLabel="WHEN?" title={t("whenPickRange")} hint={t("whenHint")}>
        <DateRangePicker
          start={departOn}
          end={returnOn}
          onChange={({ start, end }) => {
            setDepartOn(start);
            setReturnOn(end);
          }}
          maxLengthDays={14}
        />
        <p
          className="mt-2 text-xs"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          Season: {seasonHint(departOn)}
        </p>
      </Section>

      {/* ── Step 03 · Vibes ── */}
      <Section step="03" stepLabel="THE VIBE" title={t("vibeLabel")} hint={t("vibeHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {VIBE_CODES.map((v) => {
            const active = vibes.includes(v.code);
            return (
              <button
                type="button"
                key={v.code}
                onClick={() => toggleVibe(v.code)}
                className="flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--hairline)",
                  backgroundColor: active ? "rgba(231,111,81,0.08)" : "#ffffff",
                }}
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
                  >
                    {t(`vibe.${v.code}`)}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
                  >
                    {v.hint}
                  </p>
                </div>
                <span
                  className="text-lg"
                  style={{ color: active ? "var(--accent)" : "transparent" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Step 04 · Budget ── */}
      <Section step="04" stepLabel="BUDGET" title={t("totalBudget")} hint={t("budgetHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {BUDGET_BANDS.map((b) => (
            <button
              type="button"
              key={b.code}
              onClick={() => setBudget(b.code)}
              className="rounded-2xl border px-4 py-3 text-left transition"
              style={{
                borderColor: budget === b.code ? "var(--accent)" : "var(--hairline)",
                backgroundColor: budget === b.code ? "rgba(231,111,81,0.08)" : "#ffffff",
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: "var(--font-display-stack)",
                  color: budget === b.code ? "var(--ink)" : "var(--ink-soft)",
                }}
              >
                {b.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Step 05 · Pace ── */}
      <Section step="05" stepLabel="PACE" title={t("paceLabel")}>
        <div className="grid gap-2 sm:grid-cols-3">
          {PACE_CODES.map((p) => (
            <button
              type="button"
              key={p.code}
              onClick={() => setPace(p.code)}
              className="rounded-2xl border px-4 py-3 text-left transition"
              style={{
                borderColor: pace === p.code ? "var(--slate-primary)" : "var(--hairline)",
                backgroundColor: pace === p.code ? "var(--slate-tint)" : "#ffffff",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
              >
                {t(`pacePicked.${p.code}`)}
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
              >
                {p.hint}
              </p>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Step 06 · Dislikes ── */}
      <Section step="06" stepLabel="AVOID" title={t("avoidLabel")} hint={t("avoidHint")}>
        <textarea
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          placeholder={t("avoidLongPlaceholder")}
          rows={2}
          className="w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none"
          style={{
            fontFamily: "var(--font-body-stack)",
            borderColor: "var(--hairline)",
            backgroundColor: "#ffffff",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
      </Section>

      {/* ── Step 07 · Notes ── */}
      <Section step="07" stepLabel="NOTES" title={t("notesLabel")} hint={t("notesHint")}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
          rows={2}
          className="w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none"
          style={{
            fontFamily: "var(--font-body-stack)",
            borderColor: "var(--hairline)",
            backgroundColor: "#ffffff",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
      </Section>

      {/* ── Validation error ── */}
      {error && (
        <p
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(201,115,115,0.40)",
            backgroundColor: "rgba(201,115,115,0.10)",
            color: "#7a3f3f",
            fontFamily: "var(--font-body-stack)",
          }}
        >
          {error}
        </p>
      )}

      {/* ── Submit — single coral CTA ── */}
      <button
        type="submit"
        disabled={pending}
        className="btn-accent w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
        style={{ fontFamily: "var(--font-body-stack)" }}
      >
        {pending ? t("creating") : t("show4")}
      </button>
    </form>
  );
}

function Section({
  step,
  stepLabel,
  title,
  hint,
  children,
}: {
  step: string;
  stepLabel: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl border px-7 py-7 shadow-[0_12px_32px_-16px_rgba(31,41,55,0.10)]"
      style={{ backgroundColor: "#ffffff", borderColor: "var(--hairline)" }}
    >
      {/* Tiny tracked-caps kicker */}
      <p
        className="mb-1 text-[10px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
      >
        STEP {step} · {stepLabel}
      </p>

      {/* Section headline */}
      <div className="mb-4 flex items-baseline gap-3">
        <h2
          className="text-xl font-medium"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          {title}
        </h2>
        {hint && (
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-4 py-1.5 text-sm font-medium transition"
      style={{
        fontFamily: "var(--font-body-stack)",
        borderColor: active ? "var(--accent)" : "var(--hairline)",
        backgroundColor: active ? "var(--accent)" : "#ffffff",
        color: active ? "#ffffff" : "var(--ink-soft)",
      }}
    >
      {children}
    </button>
  );
}

function seasonHint(iso: string): string {
  const m = new Date(iso).getUTCMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}
