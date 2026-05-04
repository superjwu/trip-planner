/**
 * import-tourist-plan-extras.ts
 *
 * One-time import script: pulls ~300 US tourist destinations from the public
 * github repo superjwu/tourist-plan (shared/data*.js files) and transforms
 * them into our SeedDestination[] schema, then writes to
 * src/lib/seed/destinations-extras.ts
 *
 * Usage:
 *   npx tsx scripts/import-tourist-plan-extras.ts [--limit=N]
 */

import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

// ─── Constants ───────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");
const GEOCODE_CACHE_PATH = path.join(ROOT, "scripts/_geocodes.json");
const EXTRAS_OUT_PATH = path.join(ROOT, "src/lib/seed/destinations-extras.ts");
const DESTINATIONS_PATH = path.join(ROOT, "src/lib/seed/destinations.ts");

const WIKI_USER_AGENT =
  "TripPlanner/1.0 (educational; contact: wujackson03@gmail.com)";

const DATA_URLS = [
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page2.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page3.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page4.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page5.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page6.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page7.js",
  "https://raw.githubusercontent.com/superjwu/tourist-plan/main/shared/data_page8.js",
];

// ─── State abbreviations ─────────────────────────────────────────────────────
const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
  California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
  Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
  Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC",
};

// ─── Origin coordinates ───────────────────────────────────────────────────────
const ORIGINS = {
  NYC: [40.71, -74.01] as [number, number],
  CHI: [41.88, -87.63] as [number, number],
  LAX: [33.94, -118.41] as [number, number],
  SFO: [37.62, -122.38] as [number, number],
  SEA: [47.45, -122.31] as [number, number],
};

type OriginCode = keyof typeof ORIGINS;
type Vibe = "city" | "nature" | "foodie" | "chill" | "adventure" | "scenic" | "cultural" | "nightlife";

// ─── Haversine ───────────────────────────────────────────────────────────────
function haversineMiles(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Tag mapping ─────────────────────────────────────────────────────────────
const CATEGORY_VIBES: Record<string, Vibe[]> = {
  "National Park": ["nature", "scenic"],
  "State Park": ["nature", "chill"],
  City: ["city"],
  Town: ["chill", "scenic"],
  Beach: ["chill", "scenic"],
  Mountain: ["nature", "adventure"],
  Cultural: ["cultural"],
  Foodie: ["foodie", "city"],
  "National Monument": ["cultural", "scenic"],
  "Historic Site": ["cultural"],
  "National Seashore": ["nature", "chill"],
  "Recreation Area": ["nature", "adventure"],
  "National Forest": ["nature", "scenic"],
};

const TAG_WORD_VIBES: Array<[RegExp, Vibe]> = [
  [/food|culinary|cuisine|dining|restaurant/i, "foodie"],
  [/art|museum|history|historic|heritage|culture|UNESCO/i, "cultural"],
  [/hiking|trail|wildlife|forest|wilderness|nature/i, "nature"],
  [/nightlife|bars|clubs|entertainment/i, "nightlife"],
  [/scenic|view|panorama|vista|landscape/i, "scenic"],
  [/adventure|extreme|climbing|rafting|kayak/i, "adventure"],
  [/relaxing|calm|peaceful|serene|tranquil/i, "chill"],
  [/beach|coast|shore|ocean|lake|water/i, "chill"],
  [/city|urban|downtown|metro/i, "city"],
];

function mapToVibes(category: string, tags: string[], activities: string[]): Vibe[] {
  const vibes = new Set<Vibe>();

  // Category mapping
  const catVibes = CATEGORY_VIBES[category] ?? [];
  catVibes.forEach((v) => vibes.add(v));

  // Tag word mapping
  const allWords = [...tags, ...activities].join(" ");
  for (const [pattern, vibe] of TAG_WORD_VIBES) {
    if (pattern.test(allWords)) vibes.add(vibe);
  }

  // Also test the category itself
  for (const [pattern, vibe] of TAG_WORD_VIBES) {
    if (pattern.test(category)) vibes.add(vibe);
  }

  let result = Array.from(vibes).slice(0, 4);
  if (result.length === 0) result = ["scenic"];
  return result;
}

// ─── Cost computation ─────────────────────────────────────────────────────────
function computeFlightCost(miles: number): number {
  const raw = Math.round((150 + miles * 0.18) / 10) * 10;
  return Math.max(80, Math.min(700, raw));
}

const LODGING_COST_MAP: Record<string, number> = {
  $: 130,
  $$: 200,
  $$$: 280,
  $$$$: 380,
};

// ─── Best seasons mapping ─────────────────────────────────────────────────────
type Season = "spring" | "summer" | "fall" | "winter";

function mapBestSeasons(bestTime?: string): Season[] {
  if (!bestTime) return ["spring", "summer", "fall"];
  const t = bestTime.toLowerCase();
  if (/year.round|all year|anytime/i.test(t))
    return ["spring", "summer", "fall", "winter"];
  if (/summer|june|july|august/i.test(t)) return ["summer"];
  if (/winter|december|january|february/i.test(t)) return ["winter"];
  if (/spring.fall|fall.spring|spring|fall/i.test(t)) return ["spring", "fall"];
  if (/april|may/i.test(t)) return ["spring"];
  if (/october|november/i.test(t)) return ["fall"];
  if (/september/i.test(t)) return ["fall", "summer"];
  return ["spring", "summer", "fall"];
}

// ─── Proper noun extraction ───────────────────────────────────────────────────
function extractProperNouns(
  description: string
): Array<{ name: string; description: string }> {
  // Match capitalized 2–4 word phrases that aren't at sentence start
  // We look for patterns like "Xyz Abc" that appear mid-sentence
  const sentences = description.split(/\. +/);
  const results: Array<{ name: string; description: string }> = [];

  for (const sent of sentences) {
    if (results.length >= 3) break;
    // Find capitalized phrase NOT at start of sentence
    const inner = sent.replace(/^[A-Z][a-z]+ /, ""); // strip first word
    const matches = inner.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+){1,3}\b/g);
    if (matches) {
      for (const m of matches) {
        if (results.length >= 3) break;
        if (m.split(" ").length >= 2) {
          results.push({ name: m, description: sent.trim() + "." });
        }
      }
    }
  }
  return results.slice(0, 3);
}

function synthesizeAttractions(
  name: string,
  description: string
): Array<{ name: string; description: string }> {
  const extracted = extractProperNouns(description);
  if (extracted.length >= 3) return extracted;

  return [
    {
      name: `${name} center`,
      description: `Walking tour through the heart of ${name}.`,
    },
    {
      name: "Surrounding scenery",
      description: `Drive or walk through the natural setting around ${name}.`,
    },
    {
      name: "Local food and dining",
      description: `Explore the regional cuisine ${name} is known for.`,
    },
  ];
}

// ─── Blurb synthesis ─────────────────────────────────────────────────────────
function makeBlurb(
  description: string,
  name: string,
  region: string,
  state: string
): string {
  if (description) {
    const first = description.split(". ")[0];
    const trimmed = first.length > 200 ? first.slice(0, 197) + "..." : first;
    if (trimmed.length > 10) return trimmed.endsWith(".") ? trimmed : trimmed + ".";
  }
  return `${name} is a destination in ${region}, ${state} worth visiting for its scenic beauty and cultural offerings.`;
}

// ─── Source entry type ───────────────────────────────────────────────────────
interface SourceEntry {
  id: number;
  name: string;
  slug: string;
  state: string;
  region: string;
  category: string;
  description: string;
  rating?: number;
  reviews?: number;
  fee?: string;
  bestTime?: string;
  duration?: string;
  activities?: string[];
  difficulty?: string;
  accessibility?: boolean;
  image?: string;
  tags?: string[];
  lodgingCost?: string;
  travelTime?: Record<string, number>;
}

// ─── Parse JS array from file text ───────────────────────────────────────────
function parseJsArray(text: string): SourceEntry[] {
  // Find the opening bracket of the array
  const eqIdx = text.indexOf("=");
  if (eqIdx === -1) {
    // maybe it's just `const x = [...]` without an assignment visible, or `const attractions = [`
    // Try finding `[` directly
    const bracketIdx = text.indexOf("[");
    if (bracketIdx === -1) throw new Error("No array found in file");
    const arrayText = text.slice(bracketIdx).trimEnd();
    // Remove trailing semicolons
    const clean = arrayText.replace(/;?\s*$/, "");
    const sandbox: Record<string, unknown> = {};
    vm.runInNewContext(`result = ${clean}`, sandbox);
    return sandbox.result as SourceEntry[];
  }

  const bracketIdx = text.indexOf("[", eqIdx);
  if (bracketIdx === -1) throw new Error("No array after = in file");
  const arrayText = text.slice(bracketIdx).trimEnd();
  const clean = arrayText.replace(/;?\s*$/, "");

  const sandbox: Record<string, unknown> = {};
  vm.runInNewContext(`result = ${clean}`, sandbox);
  return sandbox.result as SourceEntry[];
}

// ─── Geocoding ───────────────────────────────────────────────────────────────
type GeoCache = Record<string, { lat: number; lng: number } | null>;

let geoCache: GeoCache = {};

function loadGeoCache(): void {
  if (fs.existsSync(GEOCODE_CACHE_PATH)) {
    try {
      geoCache = JSON.parse(fs.readFileSync(GEOCODE_CACHE_PATH, "utf-8"));
      console.log(`[geocache] Loaded ${Object.keys(geoCache).length} cached entries`);
    } catch {
      geoCache = {};
    }
  }
}

function saveGeoCache(): void {
  fs.writeFileSync(GEOCODE_CACHE_PATH, JSON.stringify(geoCache, null, 2));
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeEntry(
  name: string,
  state: string
): Promise<{ lat: number; lng: number } | null> {
  const cacheKey = `${name}|${state}`;
  if (cacheKey in geoCache) return geoCache[cacheKey];

  const attempts = [
    `${name}, ${state}`,
    name,
  ];

  for (const title of attempts) {
    await sleep(200);
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const resp = await fetch(url, {
        headers: { "User-Agent": WIKI_USER_AGENT },
      });
      if (!resp.ok) continue;
      const data = (await resp.json()) as {
        coordinates?: { lat: number; lon: number };
      };
      if (data.coordinates) {
        const result = { lat: data.coordinates.lat, lng: data.coordinates.lon };
        geoCache[cacheKey] = result;
        saveGeoCache();
        return result;
      }
    } catch (err) {
      console.warn(`[geocode] Error for "${title}": ${err}`);
    }
  }

  geoCache[cacheKey] = null;
  saveGeoCache();
  return null;
}

// ─── Read existing slugs ─────────────────────────────────────────────────────
function readExistingSlugs(): Set<string> {
  const content = fs.readFileSync(DESTINATIONS_PATH, "utf-8");
  const slugs = new Set<string>();
  const regex = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.add(match[1]);
  }
  return slugs;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== import-tourist-plan-extras ===");
  console.log(`Limit: ${LIMIT === Infinity ? "none" : LIMIT}`);

  loadGeoCache();

  // 1. Fetch all 8 files in parallel
  console.log("\n[1] Fetching source files...");
  const texts = await Promise.all(
    DATA_URLS.map(async (url) => {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      return resp.text();
    })
  );
  console.log(`    Fetched ${texts.length} files`);

  // 2. Parse each file
  console.log("[2] Parsing JS arrays...");
  const allEntries: SourceEntry[] = [];
  for (let i = 0; i < texts.length; i++) {
    try {
      const entries = parseJsArray(texts[i]);
      console.log(`    Page ${i + 1}: ${entries.length} entries`);
      allEntries.push(...entries);
    } catch (err) {
      console.error(`    Page ${i + 1}: PARSE ERROR — ${err}`);
    }
  }
  console.log(`    Total raw entries: ${allEntries.length}`);

  // 3. Load existing slugs and deduplicate
  console.log("[3] Loading existing slugs...");
  const existingSlugs = readExistingSlugs();
  console.log(`    Existing slugs: ${existingSlugs.size}`);

  // 4. Apply limit and dedup
  const seenSlugs = new Set<string>(existingSlugs);
  const toProcess: SourceEntry[] = [];

  for (const entry of allEntries) {
    if (toProcess.length >= LIMIT) break;
    if (!entry.slug) continue;
    if (seenSlugs.has(entry.slug)) {
      console.log(`    [dup] ${entry.slug}`);
      continue;
    }
    seenSlugs.add(entry.slug);
    toProcess.push(entry);
  }

  console.log(`    Entries to process (after dedup + limit): ${toProcess.length}`);

  // 5. Geocode + transform
  console.log("[5] Geocoding + transforming...");
  const results: string[] = [];
  let skipCount = 0;
  const dupCount = allEntries.length - toProcess.length;

  for (let i = 0; i < toProcess.length; i++) {
    const entry = toProcess[i];
    process.stdout.write(`\r    Processing ${i + 1}/${toProcess.length}: ${entry.slug.padEnd(40)}`);

    // Geocode
    const coords = await geocodeEntry(entry.name, entry.state);
    if (!coords) {
      console.log(`\n    [skip] ${entry.slug} — no coords`);
      skipCount++;
      continue;
    }

    // State abbr
    const stateAbbr = STATE_ABBR[entry.state] ?? entry.state;

    // Tags/vibes
    const tags = mapToVibes(
      entry.category ?? "",
      entry.tags ?? [],
      entry.activities ?? []
    );

    // Cost bands
    const flightFromOrigin: Partial<Record<OriginCode, number>> = {};
    for (const [code, originCoords] of Object.entries(ORIGINS) as Array<[OriginCode, [number, number]]>) {
      const miles = haversineMiles(originCoords, [coords.lat, coords.lng]);
      flightFromOrigin[code] = computeFlightCost(miles);
    }

    const lodgingPerNightUsd = LODGING_COST_MAP[entry.lodgingCost ?? "$$"] ?? 200;

    const foodPerDayUsd = tags.includes("foodie") ? 90 : tags.includes("chill") ? 60 : 70;
    const activitiesPerDayUsd =
      entry.category === "National Park"
        ? 50
        : tags.includes("adventure")
        ? 40
        : 30;

    // Attractions
    const attractions = synthesizeAttractions(entry.name, entry.description ?? "");

    // Blurb
    const blurb = makeBlurb(
      entry.description ?? "",
      entry.name,
      entry.region ?? "",
      stateAbbr
    );

    // Best seasons
    const bestSeasons = mapBestSeasons(entry.bestTime);

    // Format as TS object literal
    const obj = `  {
    slug: ${JSON.stringify(entry.slug)},
    name: ${JSON.stringify(entry.name)},
    region: ${JSON.stringify(entry.region ?? "")},
    state: ${JSON.stringify(stateAbbr)},
    lat: ${coords.lat},
    lng: ${coords.lng},
    tags: ${JSON.stringify(tags)},
    blurb: ${JSON.stringify(blurb)},
    attractions: ${JSON.stringify(attractions, null, 6).replace(/\n/g, "\n    ")},
    typicalCostBands: {
      flightFromOrigin: { ${Object.entries(flightFromOrigin)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")} },
      lodgingPerNightUsd: ${lodgingPerNightUsd},
      foodPerDayUsd: ${foodPerDayUsd},
      activitiesPerDayUsd: ${activitiesPerDayUsd},
    },
    bestSeasons: ${JSON.stringify(bestSeasons)},
  }`;

    results.push(obj);
  }

  console.log(`\n\n[6] Results: ${results.length} mapped, ${skipCount} skipped, ${dupCount} duplicates`);

  // 7. Write output file
  console.log("[7] Writing destinations-extras.ts...");
  const fileContent = `import type { SeedDestination } from "../types";

/**
 * Auto-imported destinations from superjwu/tourist-plan repo, transformed to
 * our schema. Geocoded via Wikipedia REST API, cost bands heuristic.
 *
 * To regenerate: npm run import:extras (or tsx scripts/import-tourist-plan-extras.ts)
 */
export const EXTRA_DESTINATIONS: SeedDestination[] = [
${results.join(",\n")}
];
`;

  fs.writeFileSync(EXTRAS_OUT_PATH, fileContent);
  console.log(`    Written: ${EXTRAS_OUT_PATH}`);
  console.log(`    EXTRA_DESTINATIONS count: ${results.length}`);

  // 8. Modify destinations.ts to merge
  console.log("[8] Updating destinations.ts to merge extras...");
  let destContent = fs.readFileSync(DESTINATIONS_PATH, "utf-8");

  // Check if already modified
  if (destContent.includes("HAND_CURATED_DESTINATIONS")) {
    console.log("    Already modified — skipping.");
  } else {
    // Rename DESTINATIONS → HAND_CURATED_DESTINATIONS
    destContent = destContent.replace(
      "export const DESTINATIONS: SeedDestination[] = [",
      "const HAND_CURATED_DESTINATIONS: SeedDestination[] = ["
    );

    // Add import at top (after the existing import line)
    destContent = destContent.replace(
      'import type { SeedDestination } from "../types";',
      'import type { SeedDestination } from "../types";\nimport { EXTRA_DESTINATIONS } from "./destinations-extras";'
    );

    // Append merged export at end
    destContent = destContent.trimEnd() + "\n\nexport const DESTINATIONS: SeedDestination[] = [...HAND_CURATED_DESTINATIONS, ...EXTRA_DESTINATIONS];\n";

    fs.writeFileSync(DESTINATIONS_PATH, destContent);
    console.log("    destinations.ts updated.");
  }

  // 9. Update package.json
  console.log("[9] Adding npm script...");
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  if (!pkg.scripts["import:extras"]) {
    pkg.scripts["import:extras"] = "tsx scripts/import-tourist-plan-extras.ts";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log("    Added import:extras script.");
  } else {
    console.log("    Script already exists.");
  }

  console.log("\n=== DONE ===");
  console.log(`Total raw entries fetched: ${allEntries.length}`);
  console.log(`Duplicates skipped:        ${dupCount}`);
  console.log(`Geocoding failures:        ${skipCount}`);
  console.log(`EXTRA_DESTINATIONS count:  ${results.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
