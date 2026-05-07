"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Scrolls to the top of the page on every URL change. App Router does NOT
 * scroll to top when only searchParams change (e.g. clicking a pick that
 * navigates to `?focus=N`, or refining and landing back on the bare trip
 * URL). The user ends up looking at whatever they were reading before
 * instead of the freshly-rendered focused view, which feels confusing.
 */
export function ScrollToTopOnNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // `instant` (rather than smooth) — when the page just changed there's
    // no spatial continuity to preserve; smooth scrolling would feel like
    // a slow rollback to the top.
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, searchParams]);

  return null;
}
