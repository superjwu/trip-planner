"use client";
import { useTransition, type MouseEvent } from "react";
import { toggleFavoriteAction, toggleVisitedAction } from "@/app/destinations/actions";

/**
 * Floating action toggles for a browse-grid card: heart (favorite) and
 * checkmark (visited). Sits inside the card's <Link> wrapper, so each
 * button stops propagation + prevents default on click — otherwise the
 * surrounding link would navigate to /plan?anchor=… every time.
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

  function intercept(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className="absolute right-3 top-3 z-20 flex items-center gap-1.5"
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
        className="inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition disabled:opacity-60"
        style={{
          background: isFavorite ? "var(--accent)" : "rgba(255,255,255,0.92)",
          color: isFavorite ? "#ffffff" : "var(--ink)",
          border: "1px solid var(--hairline)",
        }}
      >
        {/* Heart glyph */}
        <svg
          width="14"
          height="14"
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
        className="inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition disabled:opacity-60"
        style={{
          background: isVisited ? "var(--slate-primary)" : "rgba(255,255,255,0.92)",
          color: isVisited ? "#ffffff" : "var(--ink)",
          border: "1px solid var(--hairline)",
        }}
      >
        {/* Checkmark glyph */}
        <svg
          width="14"
          height="14"
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
