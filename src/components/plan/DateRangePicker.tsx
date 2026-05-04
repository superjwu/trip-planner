"use client";
import { useMemo, useState } from "react";

interface Props {
  /** ISO date strings, e.g. "2026-06-27". */
  start: string;
  end: string;
  onChange: (range: { start: string; end: string }) => void;
  /** Earliest selectable date as ISO; defaults to today. */
  min?: string;
  /** Hard cap on length in days; defaults to 14. */
  maxLengthDays?: number;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfMonthUTC(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
}

function addMonthsUTC(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

function daysInMonthUTC(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function isBetween(d: Date, a: Date, b: Date): boolean {
  const t = d.getTime();
  return t > a.getTime() && t < b.getTime();
}

export function DateRangePicker({
  start,
  end,
  onChange,
  min,
  maxLengthDays = 14,
}: Props) {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const minDate = useMemo(() => {
    if (min) return parseISO(min);
    const t = new Date();
    return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
  }, [min]);

  // Two-month visible window. Anchored on the month of `start`.
  const [anchor, setAnchor] = useState<Date>(() =>
    startOfMonthUTC(startDate.getUTCFullYear(), startDate.getUTCMonth()),
  );
  const [hover, setHover] = useState<Date | null>(null);
  // Tracks which side of the range the next click sets. After picking
  // an end, the next click resets to a new start.
  const [pickingStart, setPickingStart] = useState(false);

  const tripDays = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / 86400_000),
  );

  function handleDayClick(d: Date) {
    if (d.getTime() < minDate.getTime()) return;

    if (pickingStart || d.getTime() < startDate.getTime()) {
      // Start a new range — clamp end to start + 1 if needed
      const newStart = d;
      const candidateEnd = endDate.getTime() <= newStart.getTime()
        ? new Date(newStart.getTime() + 86400_000)
        : endDate;
      const lengthDays = Math.round(
        (candidateEnd.getTime() - newStart.getTime()) / 86400_000,
      );
      const cappedEnd = lengthDays > maxLengthDays
        ? new Date(newStart.getTime() + maxLengthDays * 86400_000)
        : candidateEnd;
      onChange({ start: toISO(newStart), end: toISO(cappedEnd) });
      setPickingStart(false);
    } else {
      // Set end of range
      const lengthDays = Math.round((d.getTime() - startDate.getTime()) / 86400_000);
      if (lengthDays === 0) return; // same as start — ignore
      const capped = lengthDays > maxLengthDays
        ? new Date(startDate.getTime() + maxLengthDays * 86400_000)
        : d;
      onChange({ start, end: toISO(capped) });
      setPickingStart(true);
    }
  }

  const previewEnd = !pickingStart && hover && hover.getTime() > startDate.getTime()
    ? hover
    : null;
  const rangeEnd = previewEnd ?? endDate;

  return (
    <div
      className="rounded-2xl border px-4 py-4 sm:px-6 sm:py-5"
      style={{ backgroundColor: "#ffffff", borderColor: "var(--hairline)" }}
    >
      {/* Month nav header */}
      <div className="mb-4 flex items-center justify-between">
        <NavButton
          dir="prev"
          onClick={() => setAnchor((a) => addMonthsUTC(a, -1))}
          disabled={anchor <= startOfMonthUTC(minDate.getUTCFullYear(), minDate.getUTCMonth())}
        />
        <p
          className="text-xs font-semibold tracking-[0.20em] uppercase"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {MONTH_NAMES[anchor.getUTCMonth()]} {anchor.getUTCFullYear()} –{" "}
          {MONTH_NAMES[addMonthsUTC(anchor, 1).getUTCMonth()]}{" "}
          {addMonthsUTC(anchor, 1).getUTCFullYear()}
        </p>
        <NavButton dir="next" onClick={() => setAnchor((a) => addMonthsUTC(a, 1))} />
      </div>

      {/* Two-month grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <MonthGrid
          year={anchor.getUTCFullYear()}
          month={anchor.getUTCMonth()}
          start={startDate}
          end={rangeEnd}
          minDate={minDate}
          hover={hover}
          onHover={setHover}
          onClick={handleDayClick}
        />
        <MonthGrid
          year={addMonthsUTC(anchor, 1).getUTCFullYear()}
          month={addMonthsUTC(anchor, 1).getUTCMonth()}
          start={startDate}
          end={rangeEnd}
          minDate={minDate}
          hover={hover}
          onHover={setHover}
          onClick={handleDayClick}
        />
      </div>

      {/* Date summary row */}
      <div
        className="mt-5 flex items-center justify-between text-sm"
        style={{ borderTop: "1px solid var(--hairline)", paddingTop: "1rem" }}
      >
        <div className="flex gap-3">
          <span style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}>
            <span
              className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span style={{ color: "var(--ink)" }}>{toISO(startDate)}</span>
            <span className="mx-2">→</span>
            <span style={{ color: "var(--ink)" }}>{toISO(endDate)}</span>
          </span>
        </div>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {tripDays} {tripDays === 1 ? "day" : "days"}
          {tripDays > maxLengthDays && (
            <span
              className="ml-2 rounded px-1.5 py-0.5"
              style={{
                backgroundColor: "var(--butter)",
                color: "#7a6638",
              }}
            >
              max {maxLengthDays}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function MonthGrid(props: {
  year: number;
  month: number;
  start: Date;
  end: Date;
  minDate: Date;
  hover: Date | null;
  onHover: (d: Date | null) => void;
  onClick: (d: Date) => void;
}) {
  const { year, month, start, end, minDate, hover, onHover, onClick } = props;
  const firstOfMonth = startOfMonthUTC(year, month);
  const offset = firstOfMonth.getUTCDay();
  const totalDays = daysInMonthUTC(year, month);
  const cells: { day: number | null; date: Date | null }[] = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null, date: null });
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, date: new Date(Date.UTC(year, month, d)) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, date: null });

  return (
    <div>
      {/* Month name — DM Sans medium */}
      <p
        className="mb-2 text-center text-base font-medium"
        style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
      >
        {MONTH_NAMES[month]} {year}
      </p>

      {/* Weekday letters — Manrope tracked-caps */}
      <div
        className="grid grid-cols-7 gap-1 text-[10px] font-semibold uppercase tracking-widest"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i} className="py-1 text-center">{w}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1" onMouseLeave={() => onHover(null)}>
        {cells.map((cell, i) => {
          if (!cell.date || cell.day === null) {
            return <span key={i} className="aspect-square" />;
          }
          const date = cell.date;
          const beforeMin = date.getTime() < minDate.getTime();
          const isStart = isSameDay(date, start);
          const isEnd = isSameDay(date, end);
          const inRange = !isStart && !isEnd && isBetween(date, start, end);
          const isHover = hover && isSameDay(date, hover);

          // Build inline styles for the coastal-slate look:
          // endpoints: coral border + coral fill
          // in-range: slate-tint bg
          // hover: paper-deep bg
          let cellStyle: React.CSSProperties = {};
          let cellClass = "relative aspect-square text-sm rounded-lg transition select-none ";

          if (beforeMin) {
            cellClass += "cursor-not-allowed";
            cellStyle = {
              color: "rgba(31,41,55,0.25)",
              fontFamily: "var(--font-body-stack)",
            };
          } else if (isStart || isEnd) {
            cellClass += "cursor-pointer font-semibold";
            cellStyle = {
              backgroundColor: "var(--accent)",
              border: "2px solid var(--accent)",
              color: "#ffffff",
              fontFamily: "var(--font-display-stack)",
            };
          } else if (inRange) {
            cellClass += "cursor-pointer";
            cellStyle = {
              backgroundColor: "var(--slate-tint)",
              color: "var(--ink)",
              fontFamily: "var(--font-body-stack)",
            };
          } else if (isHover) {
            cellClass += "cursor-pointer";
            cellStyle = {
              backgroundColor: "var(--paper-deep)",
              color: "var(--ink)",
              fontFamily: "var(--font-body-stack)",
            };
          } else {
            cellClass += "cursor-pointer";
            cellStyle = {
              color: "var(--ink)",
              fontFamily: "var(--font-body-stack)",
            };
          }

          return (
            <button
              type="button"
              key={i}
              disabled={beforeMin}
              onMouseEnter={() => onHover(date)}
              onClick={() => onClick(date)}
              className={cellClass}
              style={cellStyle}
            >
              <span className="absolute inset-0 flex items-center justify-center">
                {cell.day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous month" : "Next month"}
      className="flex h-8 w-8 items-center justify-center rounded-full border text-sm transition disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        fontFamily: "var(--font-body-stack)",
        borderColor: "var(--hairline)",
        backgroundColor: "#ffffff",
        color: "var(--ink-soft)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "var(--slate-primary)";
          e.currentTarget.style.color = "var(--slate-primary)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--hairline)";
        e.currentTarget.style.color = "var(--ink-soft)";
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
