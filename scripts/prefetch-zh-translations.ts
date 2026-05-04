/**
 * Prefetch Chinese names + blurbs for every destination.
 *
 * Two-tier strategy (broader coverage than Wikipedia langlinks alone):
 *
 * Tier 1 — Wikipedia langlinks → zh REST summary
 *   Best result: full Chinese name + a real Chinese-language blurb sentence.
 *   ~38% hit rate (well-known places).
 *
 * Tier 2 — Wikidata fallback (when no zh.wikipedia article exists)
 *   Resolves the Wikidata Q-ID via Wikipedia pageprops, then pulls zh labels +
 *   descriptions via `wbgetentities`. Wikidata covers ~80%+ of US destinations
 *   because Chinese contributors maintain labels there even without writing
 *   full articles.
 *
 * Idempotent — re-runs skip slugs already in the manifest. Pass `--refetch`
 * (or set REFETCH=1) to force re-pull.
 *
 * Run with: npm run seed:zh
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { DESTINATIONS } from "../src/lib/seed/destinations";

interface ZhEntry {
  name: string;
  blurb: string;
}

const OUT = resolve(__dirname, "_destinations_zh.json");
const existing: Record<string, ZhEntry> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : {};

const UA = "TripPlanner/1.0 (educational; contact: wujackson03@gmail.com)";

/**
 * Slug → Wikipedia article title overrides.
 * Copied from prefetch-wikipedia-photos.ts + extended.
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

interface ZhSummaryResponse {
  title?: string;
  displaytitle?: string;
  extract?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Truncate to first sentence, but cap at 120 chars. */
function truncateBlurb(extract: string): string {
  if (!extract) return "";
  // First sentence end — period/exclamation/question followed by space or end
  const sentenceMatch = extract.match(/^.+?[。！？.!?](?:\s|$)/);
  const firstSentence = sentenceMatch ? sentenceMatch[0].trim() : extract;
  return firstSentence.length > 120
    ? firstSentence.slice(0, 117) + "…"
    : firstSentence;
}

/** Fetch zh langlink + Wikidata Q-ID for an English Wikipedia title in one call. */
async function fetchEnPageMeta(
  enTitle: string,
): Promise<{ zhTitle: string | null; qid: string | null }> {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "langlinks|pageprops");
  url.searchParams.set("lllang", "zh");
  url.searchParams.set("ppprop", "wikibase_item");
  url.searchParams.set("titles", enTitle);
  url.searchParams.set("redirects", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`  meta HTTP ${res.status} for "${enTitle}"`);
      return { zhTitle: null, qid: null };
    }
    const json = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            langlinks?: Array<{ lang: string; "*": string }>;
            pageprops?: { wikibase_item?: string };
          }
        >;
      };
    };
    const pages = json.query?.pages;
    if (!pages) return { zhTitle: null, qid: null };
    const firstPage = Object.values(pages)[0];
    const zhLink = firstPage?.langlinks?.find((l) => l.lang === "zh");
    return {
      zhTitle: zhLink ? zhLink["*"] : null,
      qid: firstPage?.pageprops?.wikibase_item ?? null,
    };
  } catch (err) {
    console.warn(`  meta error for "${enTitle}": ${err}`);
    return { zhTitle: null, qid: null };
  }
}

/** Wikidata fallback: pull zh label + description for a Q-ID. */
/**
 * Tier-3 deterministic fallback: translate just the NPS-style suffix while
 * keeping the proper-noun part in English. e.g. "Antietam National Battlefield"
 * → "Antietam 国家战场". Used when neither zh.wikipedia nor Wikidata has a
 * label.
 */
const SUFFIX_MAP: Array<[RegExp, string]> = [
  [/\s*National Historical Park$/i, " 国家历史公园"],
  [/\s*National Historic Site$/i, " 国家历史遗址"],
  [/\s*National Battlefield Site$/i, " 国家战场遗址"],
  [/\s*National Battlefield$/i, " 国家战场"],
  [/\s*National Monument$/i, " 国家纪念地"],
  [/\s*National Recreation Area$/i, " 国家游憩区"],
  [/\s*National Seashore$/i, " 国家海岸"],
  [/\s*National Lakeshore$/i, " 国家湖岸"],
  [/\s*National Scenic Riverway[s]?$/i, " 国家风景河道"],
  [/\s*National Wild and Scenic River$/i, " 国家野生风景河"],
  [/\s*National Scenic River$/i, " 国家风景河"],
  [/\s*National Marine Sanctuary$/i, " 国家海洋保护区"],
  [/\s*National Memorial$/i, " 国家纪念碑"],
  [/\s*National Preserve$/i, " 国家保护区"],
  [/\s*National Reserve$/i, " 国家保留地"],
  [/\s*National Forest$/i, " 国家森林"],
  [/\s*National Trail$/i, " 国家步道"],
  [/\s*National Parkway$/i, " 国家公园路"],
  [/\s*National Heritage Area$/i, " 国家遗产区"],
  [/\s*State Park$/i, " 州立公园"],
];

function suffixTranslate(name: string): ZhEntry | null {
  for (const [re, zhSuffix] of SUFFIX_MAP) {
    if (re.test(name)) {
      const proper = name.replace(re, "").trim();
      if (!proper) return null;
      return { name: `${proper}${zhSuffix}`, blurb: "" };
    }
  }
  return null;
}

async function fetchWikidataZh(qid: string): Promise<ZhEntry | null> {
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbgetentities");
  url.searchParams.set("ids", qid);
  url.searchParams.set("props", "labels|descriptions");
  url.searchParams.set("languages", "zh|zh-cn|zh-hans|zh-hant|zh-tw|zh-hk");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      entities?: Record<
        string,
        {
          labels?: Record<string, { value: string }>;
          descriptions?: Record<string, { value: string }>;
        }
      >;
    };
    const entity = json.entities?.[qid];
    if (!entity) return null;
    // Prefer simplified Chinese variants in this order
    const langPriority = ["zh-cn", "zh-hans", "zh", "zh-hant", "zh-tw", "zh-hk"];
    const label = langPriority
      .map((l) => entity.labels?.[l]?.value)
      .find((v): v is string => typeof v === "string" && v.length > 0);
    const desc = langPriority
      .map((l) => entity.descriptions?.[l]?.value)
      .find((v): v is string => typeof v === "string" && v.length > 0);
    if (!label) return null;
    return {
      name: label,
      blurb: desc ? truncateBlurb(desc) : "",
    };
  } catch (err) {
    console.warn(`  wikidata error for ${qid}: ${err}`);
    return null;
  }
}

async function fetchZhSummary(zhTitle: string): Promise<ZhEntry | null> {
  const url = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(zhTitle)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`  zh summary HTTP ${res.status} for "${zhTitle}"`);
      return null;
    }
    const json = (await res.json()) as ZhSummaryResponse;
    const name = json.title ?? zhTitle;
    const extract = json.extract ?? "";
    if (!extract) return null;
    const blurb = truncateBlurb(extract);
    if (!blurb) return null;
    return { name, blurb };
  } catch (err) {
    console.warn(`  zh summary error for "${zhTitle}": ${err}`);
    return null;
  }
}

(async () => {
  const refetch = process.argv.includes("--refetch") || process.env.REFETCH === "1";
  const succeeded: string[] = [];
  const viaWikidata: string[] = [];
  const skipped: string[] = [];

  for (const d of DESTINATIONS) {
    if (existing[d.slug] && !refetch) {
      process.stdout.write(`✓ ${d.slug} (cached)\n`);
      succeeded.push(d.slug);
      continue;
    }

    const enTitle = TITLE_OVERRIDES[d.slug] ?? d.name;
    process.stdout.write(`… ${d.slug} (${enTitle}) `);

    // Step 1: get zh article title + wikidata Q-ID in one call
    const meta = await fetchEnPageMeta(enTitle);
    await sleep(150);

    // Tier 1 — zh.wikipedia article exists → full blurb
    if (meta.zhTitle) {
      const entry = await fetchZhSummary(meta.zhTitle);
      await sleep(150);
      if (entry) {
        existing[d.slug] = entry;
        succeeded.push(d.slug);
        process.stdout.write(`✓ → ${entry.name} (zh-wiki)\n`);
        writeFileSync(OUT, JSON.stringify(existing, null, 2));
        continue;
      }
    }

    // Tier 2 — Wikidata fallback for the Q-ID
    if (meta.qid) {
      const entry = await fetchWikidataZh(meta.qid);
      await sleep(150);
      if (entry) {
        existing[d.slug] = entry;
        succeeded.push(d.slug);
        viaWikidata.push(d.slug);
        process.stdout.write(`✓ → ${entry.name} (wikidata ${meta.qid})\n`);
        writeFileSync(OUT, JSON.stringify(existing, null, 2));
        continue;
      }
    }

    // Tier 3 — deterministic suffix translation (proper noun stays English)
    const suffixEntry = suffixTranslate(d.name);
    if (suffixEntry) {
      existing[d.slug] = suffixEntry;
      succeeded.push(d.slug);
      process.stdout.write(`✓ → ${suffixEntry.name} (suffix-translated)\n`);
      writeFileSync(OUT, JSON.stringify(existing, null, 2));
      continue;
    }

    skipped.push(d.slug);
    process.stdout.write(`✗ no zh data (qid=${meta.qid ?? "—"})\n`);
  }

  console.log(
    `\nDone. ${succeeded.length} succeeded (${viaWikidata.length} via Wikidata), ${skipped.length} skipped / ${DESTINATIONS.length} total.`,
  );
  if (skipped.length > 0) {
    console.log(`Still missing zh data:`);
    for (const slug of skipped) console.log(`  - ${slug}`);
  }
})();
