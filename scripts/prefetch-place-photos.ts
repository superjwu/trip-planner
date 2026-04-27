/**
 * One-time photo prefetch via Google Places (New) API.
 *
 * For each destination in src/lib/seed/destinations.ts that lacks a
 * heroPhotoUrl, looks up the Place ID via Text Search, fetches the first
 * photo's name, and constructs the maxHeightPx=1200 photo URL. Writes the
 * URLs back into a JSON file at scripts/_photos.json (so destinations.ts
 * can stay clean and the photos are diffable separately).
 *
 * Run with: GOOGLE_PLACES_API_KEY=... npm run seed:photos
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { DESTINATIONS } from "../src/lib/seed/destinations";

const KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY in your env.");
  process.exit(1);
}

const OUT = resolve(__dirname, "_photos.json");
const existing: Record<string, string> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : {};

async function findPhoto(query: string): Promise<string | null> {
  const searchRes = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY!,
        "X-Goog-FieldMask": "places.id,places.photos",
      },
      body: JSON.stringify({ textQuery: query, pageSize: 1 }),
    },
  );
  if (!searchRes.ok) {
    console.warn(`  search failed: HTTP ${searchRes.status}`);
    return null;
  }
  const json = (await searchRes.json()) as {
    places?: { id: string; photos?: { name: string }[] }[];
  };
  const place = json.places?.[0];
  const photoName = place?.photos?.[0]?.name;
  if (!photoName) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1200&key=${KEY!}`;
}

(async () => {
  for (const d of DESTINATIONS) {
    if (existing[d.slug]) {
      console.log(`✓ ${d.slug} (cached)`);
      continue;
    }
    const query = `${d.name}, ${d.state}, USA`;
    const url = await findPhoto(query);
    if (url) {
      existing[d.slug] = url;
      console.log(`✓ ${d.slug}`);
    } else {
      console.log(`✗ ${d.slug} — no photo`);
    }
    writeFileSync(OUT, JSON.stringify(existing, null, 2));
    // Throttle to be polite to Places quota
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`\nDone. ${Object.keys(existing).length} photos saved to ${OUT}`);
  console.log("Now copy these into destinations.ts heroPhotoUrl fields, or import the JSON at runtime.");
})();
