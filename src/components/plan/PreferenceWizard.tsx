"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

const VIBES: { code: Vibe; label: string; hint: string }[] = [
  { code: "city",      label: "City",      hint: "neighborhoods, museums, urban energy" },
  { code: "nature",    label: "Nature",    hint: "national parks, forests, lakes" },
  { code: "foodie",    label: "Foodie",    hint: "iconic restaurants, food scenes" },
  { code: "scenic",    label: "Scenic",    hint: "iconic drives, viewpoints" },
  { code: "chill",     label: "Chill",     hint: "low-key, slow pace, rest" },
  { code: "adventure", label: "Adventure", hint: "hiking, climbing, water sports" },
  { code: "cultural",  label: "Cultural",  hint: "history, art, architecture" },
  { code: "nightlife", label: "Nightlife", hint: "live music, bars, late dinners" },
];

const PACES: { code: Pace; label: string; hint: string }[] = [
  { code: "relaxed",  label: "Relaxed",  hint: "1–2 things per day" },
  { code: "balanced", label: "Balanced", hint: "a few highlights + downtime" },
  { code: "packed",   label: "Packed",   hint: "see as much as possible" },
];

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function PreferenceWizard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<OriginCityCode>("NYC");
  const [departOn, setDepartOn] = useState(todayPlus(60));
  const [returnOn, setReturnOn] = useState(todayPlus(64));
  const [vibes, setVibes] = useState<Vibe[]>(["scenic", "foodie"]);
  const [budget, setBudget] = useState<BudgetBand>("1000-2000");
  const [pace, setPace] = useState<Pace>("balanced");
  const [dislikes, setDislikes] = useState("");
  const [notes, setNotes] = useState("");

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

    const raw: RawTripInput = {
      origin,
      departOn,
      returnOn,
      vibes,
      budget,
      pace,
      dislikes: dislikes.trim() || undefined,
      notes: notes.trim() || undefined,
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
      className="mx-auto max-w-3xl space-y-8 px-6 py-10"
    >
      <header className="mb-2 text-center">
        <p className="hero-eyebrow mb-3 text-[var(--accent)]">Plan a trip</p>
        <h1
          className="font-serif text-4xl font-semibold leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          Tell us a few things.
        </h1>
        <p
          className="mt-2 text-base italic text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          We&apos;ll turn it into 4 destinations with reasoning and itineraries.
        </p>
      </header>

      <Section title="Where are you flying from?" eyebrow="Origin">
        <div className="flex flex-wrap gap-2">
          {ORIGIN_CITIES.map((c) => (
            <Chip
              key={c.code}
              active={origin === c.code}
              onClick={() => setOrigin(c.code)}
            >
              {c.label}
              <span className="ml-1.5 text-xs opacity-70">({c.airport})</span>
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="When?" eyebrow="Dates" hint="Pick a range">
        <DateRangePicker
          start={departOn}
          end={returnOn}
          onChange={({ start, end }) => {
            setDepartOn(start);
            setReturnOn(end);
          }}
          maxLengthDays={14}
        />
        <p className="mt-2 text-xs text-[var(--ink-soft)]">
          Season: {seasonHint(departOn)}
        </p>
      </Section>

      <Section title="What's the vibe?" eyebrow="Vibes" hint="Pick 1+">
        <div className="grid gap-2 sm:grid-cols-2">
          {VIBES.map((v) => {
            const active = vibes.includes(v.code);
            return (
              <button
                type="button"
                key={v.code}
                onClick={() => toggleVibe(v.code)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[var(--accent)] bg-[var(--rose)]"
                    : "border-[var(--hairline)] bg-white hover:border-[var(--ink-soft)]"
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      active ? "text-[var(--ink)]" : "text-[var(--ink)]"
                    }`}
                  >
                    {v.label}
                  </p>
                  <p className="text-xs text-[var(--ink-soft)]">{v.hint}</p>
                </div>
                <span
                  className={`text-lg ${
                    active ? "text-[var(--accent)]" : "text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Total budget" eyebrow="Budget" hint="Per person, all-in">
        <div className="grid gap-2 sm:grid-cols-2">
          {BUDGET_BANDS.map((b) => (
            <button
              type="button"
              key={b.code}
              onClick={() => setBudget(b.code)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                budget === b.code
                  ? "border-[var(--accent)] bg-[var(--butter)] text-[var(--ink)]"
                  : "border-[var(--hairline)] bg-white text-[var(--ink-soft)] hover:border-[var(--ink-soft)]"
              }`}
            >
              <span className="text-sm font-semibold">{b.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Pace" eyebrow="Pace">
        <div className="grid gap-2 sm:grid-cols-3">
          {PACES.map((p) => (
            <button
              type="button"
              key={p.code}
              onClick={() => setPace(p.code)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                pace === p.code
                  ? "border-[var(--accent)] bg-[var(--sage)]"
                  : "border-[var(--hairline)] bg-white hover:border-[var(--ink-soft)]"
              }`}
            >
              <p
                className={`text-sm font-semibold text-[var(--ink)]`}
              >
                {p.label}
              </p>
              <p className="text-xs text-[var(--ink-soft)]">{p.hint}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Anything to avoid?" eyebrow="Dislikes" hint="Optional">
        <textarea
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          placeholder="e.g. crowds, big resorts, long flights"
          rows={2}
          className="w-full rounded-2xl border border-[var(--hairline)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none"
        />
      </Section>

      <Section title="Anything else?" eyebrow="Notes" hint="Optional">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. anniversary trip, traveling with toddler, dietary needs"
          rows={2}
          className="w-full rounded-2xl border border-[var(--hairline)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none"
        />
      </Section>

      {error && (
        <p className="rounded-2xl border border-[#c97373]/40 bg-[#c97373]/10 px-4 py-3 text-sm text-[#7a3f3f]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--accent)] py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating trip…" : "Show me 4 destinations →"}
      </button>
    </form>
  );
}

function Section({
  title,
  eyebrow,
  hint,
  children,
}: {
  title: string;
  eyebrow: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-3">
        <p className="hero-eyebrow text-[var(--accent)]">{eyebrow}</p>
        {hint && (
          <span className="text-xs text-[var(--ink-soft)]">{hint}</span>
        )}
      </div>
      <h2
        className="mb-3 font-serif text-xl font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        {title}
      </h2>
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
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-[var(--hairline)] bg-white text-[var(--ink-soft)] hover:border-[var(--ink-soft)] hover:text-[var(--ink)]"
      }`}
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
