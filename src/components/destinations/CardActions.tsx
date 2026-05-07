"use client";
import { useState, useTransition, type MouseEvent } from "react";
import { toggleFavoriteAction, toggleVisitedAction } from "@/app/destinations/actions";

/**
 * Floating action toggles for a browse-grid card: heart (favorite) and
 * checkmark (visited). Sits inside the card's <Link> wrapper, so each
 * button stops propagation + prevents default on click — otherwise the
 * surrounding link would navigate to /plan?anchor=… every time.
 *
 * Visibility tweaks:
 * - Solid white background + a stronger drop shadow so they pop off
 *   bright photos (forests, beaches) without needing a tint overlay.
 * - 36×36 hit area (was 32) — easier to tap on mobile, more visible.
 * - Hover preview: heart turns coral / checkmark turns slate before the
 *   user commits, so the action's eventual color is obvious at a glance.
 */
export function CardActions({
  slug,
  isFavorite,
  isVisited,
  labels,
}: {
  slug: string;
  isFavorite: boolean;
  isVisited: boolean;
  labels: {
    favoriteOn: string;
    favoriteOff: string;
    visitedOn: string;
    visitedOff: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [favHover, setFavHover] = useState(false);
  const [visHover, setVisHover] = useState(false);

  function intercept(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Heart: filled coral when active, outlined coral on hover, neutral white otherwise.
  const favActive = isFavorite || favHover;
  const visActive = isVisited || visHover;

  return (
    <div
      className="absolute right-3 top-3 z-20 flex items-center gap-2"
      onClick={intercept}
    >
      <button
        type="button"
        aria-label={isFavorite ? labels.favoriteOn : labels.favoriteOff}
        title={isFavorite ? labels.favoriteOn : labels.favoriteOff}
        disabled={pending}
        onClick={(e) => {
          intercept(e);
          startTransition(() => toggleFavoriteAction(slug));
        }}
        onMouseEnter={() => setFavHover(true)}
        onMouseLeave={() => setFavHover(false)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 disabled:opacity-60 hover:scale-110"
        style={{
          background: isFavorite
            ? "var(--accent)"
            : favHover
              ? "#ffffff"
              : "rgba(255,255,255,0.96)",
          color: isFavorite
            ? "#ffffff"
            : favHover
              ? "var(--accent)"
              : "var(--ink-soft)",
          border: `1.5px solid ${favActive ? "var(--accent)" : "var(--hairline)"}`,
          boxShadow: favActive
            ? "0 6px 16px -4px rgba(231,111,81,0.45)"
            : "0 2px 8px -2px rgba(31,41,55,0.25)",
        }}
      >
        {/* Heart glyph */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label={isVisited ? labels.visitedOn : labels.visitedOff}
        title={isVisited ? labels.visitedOn : labels.visitedOff}
        disabled={pending}
        onClick={(e) => {
          intercept(e);
          startTransition(() => toggleVisitedAction(slug));
        }}
        onMouseEnter={() => setVisHover(true)}
        onMouseLeave={() => setVisHover(false)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 disabled:opacity-60 hover:scale-110"
        style={{
          background: isVisited
            ? "var(--slate-primary)"
            : visHover
              ? "#ffffff"
              : "rgba(255,255,255,0.96)",
          color: isVisited
            ? "#ffffff"
            : visHover
              ? "var(--slate-primary)"
              : "var(--ink-soft)",
          border: `1.5px solid ${visActive ? "var(--slate-primary)" : "var(--hairline)"}`,
          boxShadow: visActive
            ? "0 6px 16px -4px rgba(44,84,116,0.45)"
            : "0 2px 8px -2px rgba(31,41,55,0.25)",
        }}
      >
        {/* Checkmark glyph */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}
