import Link from "next/link";

export interface RoundSummary {
  id: string;
  roundNumber: number;
  feedbackPresets: string[];
  feedbackText: string | null;
  isActive: boolean;
}

/**
 * Round chips above the matrix. Clicking a non-active chip switches the
 * trip page to view that round's recs (read-only). The active chip is
 * always the latest round; round 1 is the initial compute.
 */
export function RoundSwitcher({
  tripId,
  rounds,
  activeRoundId,
}: {
  tripId: string;
  rounds: RoundSummary[];
  activeRoundId: string | null;
}) {
  if (rounds.length <= 1) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">
        Rounds
      </span>
      {rounds
        .slice()
        .sort((a, b) => a.roundNumber - b.roundNumber)
        .map((r) => {
          const isActive = r.id === activeRoundId;
          const presetLabel = r.feedbackPresets.length
            ? r.feedbackPresets.slice(0, 2).join(", ")
            : null;
          return (
            <Link
              key={r.id}
              href={`/trips/${tripId}?round=${r.roundNumber}`}
              className={`group inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--hairline)] bg-white text-[var(--ink)] hover:border-[var(--ink-soft)]"
              }`}
            >
              <span className="font-semibold">Round {r.roundNumber}</span>
              {presetLabel && (
                <span className={isActive ? "text-white/85" : "text-[var(--ink-soft)]"}>
                  · {presetLabel}
                </span>
              )}
            </Link>
          );
        })}
    </div>
  );
}
