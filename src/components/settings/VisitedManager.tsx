"use client";
import { useMemo, useState, useTransition, useId } from "react";
import { addVisitedAction, removeVisitedAction } from "@/app/settings/visited-actions";

interface BareDestination {
  slug: string;
  name: string;
  state: string;
  region: string;
}

interface Props {
  visited: BareDestination[];
  catalog: BareDestination[];
}

/**
 * Settings UI for the "places you've been" exclude list. The user types
 * a destination name (autocomplete via <datalist>), submits → server
 * action writes the cookie. Below: the current list as removable chips.
 *
 * Server-side, the recommender's preFilter excludes any matching slug.
 */
export function VisitedManager({ visited, catalog }: Props) {
  const datalistId = useId();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const visitedSlugs = useMemo(
    () => new Set(visited.map((d) => d.slug)),
    [visited],
  );

  // Catalog options excluded if already visited so the autocomplete doesn't
  // suggest something the user already added.
  const options = useMemo(
    () => catalog.filter((d) => !visitedSlugs.has(d.slug)),
    [catalog, visitedSlugs],
  );

  function handleAdd() {
    const q = query.trim().toLowerCase();
    if (!q) return;
    // Match the typed value against our `Name, ST` label; fall back to slug.
    const match =
      options.find((d) => labelFor(d).toLowerCase() === q) ??
      options.find((d) => d.slug === q) ??
      options.find((d) => d.name.toLowerCase() === q);
    if (!match) return;
    const fd = new FormData();
    fd.set("slug", match.slug);
    startTransition(async () => {
      await addVisitedAction(fd);
      setQuery("");
    });
  }

  function handleRemove(slug: string) {
    const fd = new FormData();
    fd.set("slug", slug);
    startTransition(async () => {
      await removeVisitedAction(fd);
    });
  }

  return (
    <div>
      {/* Add row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            list={datalistId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Search a destination — e.g. Big Sur, CA"
            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm focus:outline-none"
            style={{
              borderColor: "var(--hairline)",
              color: "var(--ink)",
              fontFamily: "var(--font-body-stack)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
          />
          <datalist id={datalistId}>
            {options.map((d) => (
              <option key={d.slug} value={labelFor(d)} />
            ))}
          </datalist>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={pending || !query.trim()}
          className="btn-accent rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{ fontFamily: "var(--font-body-stack)" }}
        >
          {pending ? "…" : "Add"}
        </button>
      </div>

      {/* Visited list — chips with × */}
      <div className="mt-5">
        {visited.length === 0 ? (
          <p
            className="text-sm italic"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            Nothing here yet. Recommendations include the full catalog.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visited.map((d) => (
              <span
                key={d.slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs"
                style={{
                  border: "1px solid var(--hairline)",
                  fontFamily: "var(--font-body-stack)",
                  color: "var(--ink)",
                }}
              >
                <span className="font-semibold">{d.name}</span>
                <span style={{ color: "var(--ink-soft)" }}>· {d.state}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(d.slug)}
                  disabled={pending}
                  aria-label={`Remove ${d.name}`}
                  className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full transition hover:bg-[var(--paper-deep)] disabled:opacity-50"
                  style={{ color: "var(--ink-soft)" }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function labelFor(d: BareDestination): string {
  return `${d.name}, ${d.state}`;
}
