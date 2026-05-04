import Link from "next/link";
import { getTranslations } from "next-intl/server";

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
export async function RoundSwitcher({
  tripId,
  rounds,
  activeRoundId,
}: {
  tripId: string;
  rounds: RoundSummary[];
  activeRoundId: string | null;
}) {
  const t = await getTranslations("trip");

  if (rounds.length <= 1) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {t("rounds")}
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
              className="group inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition"
              style={
                isActive
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
              <span className="font-semibold">{t("round", { num: r.roundNumber })}</span>
              {presetLabel && (
                <span style={{ color: isActive ? "rgba(255,255,255,0.85)" : "var(--ink-soft)" }}>
                  · {presetLabel}
                </span>
              )}
            </Link>
          );
        })}
    </div>
  );
}
