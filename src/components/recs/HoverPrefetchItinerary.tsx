"use client";
import { useRef, useTransition } from "react";
import { ensureItinerary } from "@/app/trips/[id]/actions";

/**
 * Wrap a pick card with this on the 4-up grid so that the itinerary LLM
 * call (typically 6–12s on gpt-5.5 reasoning=low) gets kicked off the
 * moment the user shows intent — hovering or focusing the card — instead
 * of waiting until the click. ensureItinerary is idempotent at the DB
 * level (returns immediately if rec.itinerary already exists), so calling
 * it eagerly is safe.
 *
 * Fires once per mount per recId via a ref guard. No router.refresh() —
 * the focused page's ItineraryAutoFetch handles re-rendering once the
 * draft lands.
 */
export function HoverPrefetchItinerary({
  tripId,
  recId,
  children,
}: {
  tripId: string;
  recId: string;
  children: React.ReactNode;
}) {
  const fired = useRef(false);
  const [, startTransition] = useTransition();

  function trigger() {
    if (fired.current) return;
    fired.current = true;
    startTransition(() => {
      ensureItinerary({ tripId, recId });
    });
  }

  return (
    <div onMouseEnter={trigger} onFocus={trigger} className="h-full">
      {children}
    </div>
  );
}
