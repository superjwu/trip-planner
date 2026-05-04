import type { SeedDestination } from "./types";
import photoManifestRaw from "../../scripts/_photos.json";

interface PhotoEntry {
  url: string;
  attribution: { author: string; source: string; license: string };
}

const photoManifest = photoManifestRaw as Record<string, PhotoEntry>;

/**
 * Returns the destination's hero photo URL.
 *
 * Resolution order:
 *   1. `scripts/_photos.json` manifest, populated by `npm run seed:wiki-photos`
 *      (Wikipedia REST API → Wikimedia Commons CDN; free, no API key).
 *   2. `heroPhotoUrl` written by `scripts/prefetch-place-photos.ts` (Google
 *      Places, requires GOOGLE_PLACES_API_KEY) — kept as a manual override
 *      path so a future re-run with GCP billing on can selectively replace
 *      Wikipedia photos.
 *   3. Lorem Picsum fallback — deterministic per slug, semantically wrong
 *      (Big Sur → Flatiron) but stable.
 */
export function destinationPhotoUrl(
  dest: Pick<SeedDestination, "slug" | "name" | "state" | "heroPhotoUrl">,
): string {
  const fromManifest = photoManifest[dest.slug]?.url;
  if (fromManifest) return fromManifest;
  if (dest.heroPhotoUrl) return dest.heroPhotoUrl;
  return `https://picsum.photos/seed/${encodeURIComponent(dest.slug)}/1200/800`;
}

/**
 * Returns the photo's attribution metadata if it came from the Wikipedia/
 * Commons manifest. Returns `null` for photos that came from `heroPhotoUrl`
 * (manual override — caller has its own attribution) or the picsum fallback
 * (no credit needed).
 *
 * Used by `<PhotoCredit>` to render a hover overlay on the destination cards.
 */
export function destinationPhotoCredit(
  dest: Pick<SeedDestination, "slug" | "heroPhotoUrl">,
): { author: string; source: string; license: string } | null {
  // If the live photo is the manual override, we don't have credit metadata.
  if (dest.heroPhotoUrl && !photoManifest[dest.slug]) return null;
  return photoManifest[dest.slug]?.attribution ?? null;
}
