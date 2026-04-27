import type { SeedDestination } from "./types";

/**
 * Returns the destination's hero photo URL.
 * Order of preference:
 *   1. `heroPhotoUrl` written by `scripts/prefetch-place-photos.ts`
 *      (Google Places, requires GOOGLE_PLACES_API_KEY).
 *   2. Lorem Picsum, deterministic seed per slug — stable, real photos,
 *      but not travel-themed. Acceptable until prefetch runs.
 */
export function destinationPhotoUrl(
  dest: Pick<SeedDestination, "slug" | "name" | "state" | "heroPhotoUrl">,
): string {
  if (dest.heroPhotoUrl) return dest.heroPhotoUrl;
  return `https://picsum.photos/seed/${encodeURIComponent(dest.slug)}/1200/800`;
}
