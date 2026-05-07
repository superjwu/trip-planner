"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ensureItinerary } from "@/app/trips/[id]/actions";

/**
 * Client-side trigger that asks the server to generate the day-by-day
 * itinerary for a focused pick, then refreshes the route so the
 * server-rendered ExpandedDestination picks up the new data.
 *
 * Mounted only when the focused rec has no itinerary yet. The server
 * page renders instantly with `itineraryLoading=true`, this component
 * fires in the background, and when `ensureItinerary` resolves the
 * `router.refresh()` swaps the skeleton for the real days.
 *
 * Why client-side: the LLM call is 6-15s on gpt-5.5. Awaiting it on the
 * server blocks the entire page render — clicking a pick used to feel
 * laggy. Lazy + refresh gives instant click feedback.
 */
export function ItineraryAutoFetch({ tripId, recId }: { tripId: string; recId: string }) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    let cancelled = false;
    (async () => {
      const res = await ensureItinerary({ tripId, recId });
      if (cancelled) return;
      if (res.ok) router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [tripId, recId, router]);

  return null;
}
