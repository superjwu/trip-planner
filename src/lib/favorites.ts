import { cookies } from "next/headers";

/**
 * Cookie-backed "liked" destination list. Identical shape to visited.ts —
 * different cookie name so the two lists stay independent. No recommender
 * impact (favorites are a soft "save for later" signal, not a filter); the
 * /destinations browse grid surfaces them as filled hearts.
 */

const COOKIE_NAME = "tp-favorites";
const MAX_ENTRIES = 200;
const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2;
const SLUG_RE = /^[a-z0-9-]+$/;

export async function getFavoriteSlugs(): Promise<string[]> {
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

export async function setFavoriteSlugs(slugs: string[]): Promise<void> {
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
