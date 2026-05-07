import { cookies } from "next/headers";

/**
 * Cookie-backed "places I've been" list. Server-only (uses next/headers
 * cookies()). The recommender's preFilter excludes any slug in this list
 * from the candidate pool, and the /settings page is the management UI.
 *
 * Storage: `tp-visited` cookie, comma-separated slug list. ~7 chars per
 * slug × 100 cap = under 1KB, well within cookie limits. Persists for
 * two years; clearing the cookie wipes the list.
 *
 * Why cookie over DB: matches the v3 favorites pattern, no migration,
 * no auth dependency, survives sign-out, syncs nothing across devices
 * — fine for a personal-use demo.
 */

const COOKIE_NAME = "tp-visited";
const MAX_ENTRIES = 100;
const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2;

const SLUG_RE = /^[a-z0-9-]+$/;

export async function getVisitedSlugs(): Promise<string[]> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const slug = part.trim();
    if (!slug || !SLUG_RE.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= MAX_ENTRIES) break;
  }
  return out;
}

export async function setVisitedSlugs(slugs: string[]): Promise<void> {
  const c = await cookies();
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of slugs) {
    if (!s || !SLUG_RE.test(s) || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= MAX_ENTRIES) break;
  }
  c.set(COOKIE_NAME, out.join(","), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: TWO_YEARS_SECONDS,
  });
}
