import type { NormalizedTripInput } from "@/lib/types";

const VIBE_LABELS: Record<string, string> = {
  city: "city",
  nature: "nature",
  foodie: "foodie",
  chill: "chill",
  adventure: "adventure",
  scenic: "scenic",
  cultural: "cultural",
  nightlife: "nightlife",
};

export function CompareHeader({
  input,
  destinationCount = 4,
}: {
  input: NormalizedTripInput;
  destinationCount?: number;
}) {
  const vibes = input.vibes.map((v) => VIBE_LABELS[v] ?? v).join(", ");
  const lengthLabel = `${input.tripLengthDays} days`;

  return (
    <section className="glass-strong mb-8 px-7 py-6">
      <p className="hero-eyebrow mb-2 text-[var(--accent)]">
        Why these {destinationCount}
      </p>
      <p
        className="font-serif text-2xl leading-tight text-white"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Curated for a <span className="italic text-[var(--accent)]">{vibes}</span> {lengthLabel} trip from {input.originCode}, ranked by fit and feasibility within your budget.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Pill>From {input.originCode}</Pill>
        <Pill>{input.departOn} → {input.returnOn}</Pill>
        <Pill>{lengthLabel}</Pill>
        <Pill>{input.budgetBand} budget</Pill>
        <Pill>{input.pace} pace</Pill>
        <Pill>{input.seasonHint}</Pill>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[var(--text-muted)]">
      {children}
    </span>
  );
}
