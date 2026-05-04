/**
 * One-time photo prefetch via Wikipedia REST API + Wikimedia Commons API.
 *
 * Free, no API key, no GCP billing. For each destination missing a photo,
 * resolves the Wikipedia article title, fetches the article summary's lead
 * image URL, then queries Commons for the file's author + license metadata.
 *
 * Writes `{ url, attribution: { author, source, license } }` per slug to
 * `scripts/_photos.json`. Idempotent — re-runs skip already-fetched slugs.
 *
 * Run with: npm run seed:wiki-photos
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { DESTINATIONS } from "../src/lib/seed/destinations";

interface PhotoEntry {
  url: string;
  attribution: { author: string; source: string; license: string };
}

const OUT = resolve(__dirname, "_photos.json");
const existing: Record<string, PhotoEntry> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : {};

// Wikimedia requires identifying User-Agent on automated requests.
const UA = "TripPlanner/1.0 (educational; contact: wujackson03@gmail.com)";

/**
 * Slug → Wikipedia article title overrides. Slugs that resolve cleanly via
 * "title-cased name" don't need entries here.
 */
const TITLE_OVERRIDES: Record<string, string> = {
  // National parks
  "acadia-np": "Acadia National Park",
  "yellowstone-np": "Yellowstone National Park",
  "yosemite-np": "Yosemite National Park",
  "zion-np": "Zion National Park",
  "joshua-tree-np": "Joshua Tree National Park",
  "smoky-mountains-np": "Great Smoky Mountains National Park",
  "glacier-np": "Glacier National Park (U.S.)",
  "olympic-np": "Olympic National Park",
  "grand-canyon-np": "Grand Canyon National Park",
  "rocky-mountain-np": "Rocky Mountain National Park",
  "arches-np": "Arches National Park",
  "death-valley-np": "Death Valley National Park",
  "rainier-np": "Mount Rainier National Park",
  // Cities — disambiguated
  "boston-ma": "Boston",
  "charleston-sc": "Charleston, South Carolina",
  "savannah-ga": "Savannah, Georgia",
  "new-orleans-la": "New Orleans",
  "nashville-tn": "Nashville, Tennessee",
  "austin-tx": "Austin, Texas",
  "asheville-nc": "Asheville, North Carolina",
  "santa-fe-nm": "Santa Fe, New Mexico",
  "philadelphia-pa": "Philadelphia",
  "portland-or": "Portland, Oregon",
  "san-diego-ca": "San Diego",
  // Mountain / small towns
  "aspen-co": "Aspen, Colorado",
  "jackson-hole-wy": "Jackson Hole",
  "sedona-az": "Sedona, Arizona",
  "big-sur-ca": "Big Sur",
  "lake-tahoe-ca": "Lake Tahoe",
  "bend-or": "Bend, Oregon",
  "taos-nm": "Taos, New Mexico",
  "marfa-tx": "Marfa, Texas",
  // Mixed (islands, coastal, regions)
  "maui-hi": "Maui",
  "kauai-hi": "Kauai",
  "key-west-fl": "Key West",
  "hudson-valley-ny": "Hudson Valley",
  "cape-cod-ma": "Cape Cod",
  "outer-banks-nc": "Outer Banks",
  "niagara-falls": "Niagara Falls",
};

interface WikipediaSummary {
  type?: string;
  title?: string;
  originalimage?: { source: string; width: number; height: number };
  thumbnail?: { source: string; width: number; height: number };
}

interface CommonsImageInfo {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        imageinfo?: Array<{
          extmetadata?: {
            Artist?: { value: string };
            LicenseShortName?: { value: string };
            Credit?: { value: string };
          };
        }>;
      }
    >;
  };
}

/** Strip HTML tags from a Commons-returned metadata field. */
function stripHtml(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract the file title (e.g. "File:Charleston_skyline.jpg") from a Commons CDN URL. */
function extractFileTitleFromUrl(url: string): string | null {
  // URL shape: https://upload.wikimedia.org/wikipedia/commons/thumb/X/YY/filename.ext/...
  // or: https://upload.wikimedia.org/wikipedia/commons/X/YY/filename.ext
  const match = url.match(/\/commons(?:\/thumb)?\/[a-f0-9]\/[a-f0-9]{2}\/([^/]+\.[a-zA-Z]+)/);
  if (!match) return null;
  return `File:${decodeURIComponent(match[1])}`;
}

async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) {
    console.warn(`  wiki summary HTTP ${res.status} for "${title}"`);
    return null;
  }
  return (await res.json()) as WikipediaSummary;
}

async function fetchCommonsAttribution(
  fileTitle: string,
): Promise<{ author: string; license: string } | null> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("titles", fileTitle);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "extmetadata");
  url.searchParams.set("origin", "*");
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return null;
  const json = (await res.json()) as CommonsImageInfo;
  const pages = json.query?.pages;
  if (!pages) return null;
  const firstPage = Object.values(pages)[0];
  const meta = firstPage?.imageinfo?.[0]?.extmetadata;
  if (!meta) return null;
  const author = stripHtml(meta.Artist?.value) || stripHtml(meta.Credit?.value) || "Unknown";
  const license = stripHtml(meta.LicenseShortName?.value) || "Wikimedia Commons";
  // Trim hugely-long author strings (some include full HTML user pages)
  const trimmedAuthor = author.length > 60 ? author.slice(0, 60).trim() + "…" : author;
  return { author: trimmedAuthor, license };
}

async function findPhoto(slug: string, fallbackQuery: string): Promise<PhotoEntry | null> {
  const title = TITLE_OVERRIDES[slug] ?? fallbackQuery;
  const summary = await fetchWikipediaSummary(title);
  if (!summary) return null;
  const photoUrl = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (!photoUrl) return null;

  let attribution = { author: "Unknown", source: "Wikimedia Commons", license: "Wikimedia Commons" };
  const fileTitle = extractFileTitleFromUrl(photoUrl);
  if (fileTitle) {
    const commons = await fetchCommonsAttribution(fileTitle);
    if (commons) attribution = { ...commons, source: "Wikimedia Commons" };
  }

  return { url: photoUrl, attribution };
}

(async () => {
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (const d of DESTINATIONS) {
    if (existing[d.slug]) {
      console.log(`✓ ${d.slug} (cached)`);
      succeeded.push(d.slug);
      continue;
    }
    const fallbackTitle = d.name; // e.g. "Charleston" — works as fallback
    process.stdout.write(`… ${d.slug} `);
    const entry = await findPhoto(d.slug, fallbackTitle);
    if (entry) {
      existing[d.slug] = entry;
      succeeded.push(d.slug);
      console.log(`✓ → ${entry.url.slice(entry.url.lastIndexOf("/") + 1).slice(0, 50)}`);
    } else {
      failed.push(d.slug);
      console.log(`✗ no photo`);
    }
    writeFileSync(OUT, JSON.stringify(existing, null, 2));
    // Throttle 200ms — be polite to Wikimedia
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. ${succeeded.length} succeeded, ${failed.length} failed.`);
  if (failed.length > 0) {
    console.log(`Failed slugs (need manual override in ${OUT}):`);
    for (const slug of failed) console.log(`  - ${slug}`);
  }
})();
