/**
 * Deterministic enrichment pipeline. Given the raw `DESTINATIONS` array
 * (which optionally has v3 fields), this module:
 *
 *   1. Applies any explicit `META_OVERRIDES` entry first.
 *   2. Fills in missing v3 fields algorithmically from existing tags +
 *      region + state + name + attractions.
 *   3. Validates the final shape.
 *
 * All downstream code (browse page, rec engine prompts, audit script) should
 * import `ENRICHED_DESTINATIONS` from here — not the raw `DESTINATIONS`.
 */
import type {
  EnrichedDestination,
  Experience,
  Landscape,
  ScenicSignal,
  SceneryScore,
  SeedDestination,
  Vibe,
} from "../types";
import { DESTINATIONS } from "./destinations";
import { META_OVERRIDES, type MetaOverride } from "./destinations-meta";

// ─────────────────────────────────────────────────────────────────
// Inference helpers
// ─────────────────────────────────────────────────────────────────

const HAWAII_STATES = new Set(["HI"]);
const TERRITORY_ISLAND_STATES = new Set(["VI", "PR", "GU", "MP", "AS"]);

function inferLandscape(d: SeedDestination): Landscape {
  const name = d.name.toLowerCase();
  const slug = d.slug.toLowerCase();
  const tags = new Set<Vibe>(d.tags);

  // Pacific islands and territories — almost always island.
  if (HAWAII_STATES.has(d.state) || TERRITORY_ISLAND_STATES.has(d.state)) {
    return "island";
  }

  // Explicit name signals.
  if (/\bisland(s)?\b|\bcay(s)?\b|atoll|key\b/.test(name)) return "island";
  if (/\bcanyon\b|\bgorge\b|\bgulch\b/.test(name)) return "canyon";
  if (/\bdesert\b|\bbasin\b|sand dunes|joshua tree|death valley|saguaro/.test(name)) return "desert";
  if (/\blake\b|\bpond\b|\breservoir\b/.test(name)) return "lake";
  if (/\bforest\b|\bredwoods?\b|\bwoodlands?\b/.test(name)) return "forest";
  if (/\bcoast\b|\bbeach(es)?\b|\bcape\b|\bshore(line)?\b|\bbay\b|\bharbor\b|seashore/.test(name)) return "coast";
  if (/\bmountain(s)?\b|\bpeak(s)?\b|\bridge\b|\brange\b|\bsummit\b|alpine|alps/.test(name)) return "mountain";

  // Slug signals.
  if (slug.endsWith("-np")) {
    // National park — without name signal, fall to mountain (most common).
    return "mountain";
  }
  if (slug.includes("national-historic") || slug.includes("national-monument") || slug.includes("national-historical")) {
    // Cultural sites without strong terrain — default city for now.
    return "city";
  }

  // Tag signals.
  if (tags.has("city")) return "city";
  if (tags.has("nature") && !tags.has("city")) {
    // Generic nature destination — default forest.
    return "forest";
  }

  // Region signals.
  const region = d.region.toLowerCase();
  if (region.includes("desert") || region.includes("colorado plateau")) return "desert";
  if (region.includes("rockies") || region.includes("rocky") || region.includes("sierra") || region.includes("cascades") || region.includes("alps") || region.includes("teton") || region.includes("yellowstone")) return "mountain";
  if (region.includes("coast") || region.includes("lowcountry") || region.includes("pacific northwest") || region.includes("new england") || region.includes("gulf")) return "coast";
  if (region.includes("forest") || region.includes("redwood") || region.includes("woods")) return "forest";
  if (region.includes("great lakes") || region.includes("finger lakes")) return "lake";
  if (region.includes("hawaiian") || region.includes("island")) return "island";

  // Last resort.
  return "city";
}

function inferExperiences(d: SeedDestination, landscape: Landscape): Experience[] {
  const out = new Set<Experience>();
  const tags = new Set<Vibe>(d.tags);
  const slug = d.slug.toLowerCase();
  const name = d.name.toLowerCase();
  const attractionText = d.attractions.map((a) => `${a.name} ${a.description}`).join(" ").toLowerCase();

  // Tag-based.
  if (tags.has("foodie")) out.add("foodie");
  if (tags.has("cultural")) out.add("museums");
  if (tags.has("nature") || tags.has("adventure") || tags.has("scenic")) out.add("hiking");

  // Slug + name patterns.
  if (slug.endsWith("-np") || slug.includes("national-forest") || slug.includes("national-preserve")) {
    out.add("hiking");
    out.add("wildlife");
  }
  if (slug.includes("national-historic") || slug.includes("national-monument") || slug.includes("national-historical") || slug.includes("national-memorial")) {
    out.add("museums");
  }

  // Attraction text patterns.
  if (/\bhik(e|ing)\b|\btrail(s)?\b|\bbackpack\b/.test(attractionText)) out.add("hiking");
  if (/\bmuseum\b|\bgaller(y|ies)\b|\bhistoric\b|\bheritage\b/.test(attractionText)) out.add("museums");
  if (/\brestaurant\b|\bfood\b|\bcuisine\b|\bdining\b|\boyster\b|\bbarbecue\b|\btasting\b/.test(attractionText)) out.add("foodie");
  if (/\bscenic drive\b|\bbyway\b|\bhighway\b|\bparkway\b/.test(attractionText) || slug.includes("highway") || slug.includes("byway") || slug.includes("parkway")) out.add("scenic-drives");
  if (/\bbeach(es)?\b|\bshore\b|\bsand\b|\bsurf\b|\bswim\b/.test(attractionText)) out.add("beaches");
  if (/\bhot spring(s)?\b|\bgeyser\b|\bthermal\b/.test(attractionText) || name.includes("hot springs")) out.add("hot-springs");
  if (/\bwildlife\b|\banimals?\b|\bbear(s)?\b|\belk\b|\bbison\b|\bwhale(s)?\b|\bsea otter\b|\bbirding\b/.test(attractionText)) out.add("wildlife");

  // Landscape-based fallbacks.
  if (landscape === "coast" || landscape === "island") out.add("beaches");
  if (landscape === "mountain" || landscape === "forest" || landscape === "canyon") out.add("hiking");
  if (landscape === "city" && out.size === 0) out.add("museums");

  // Always at least one experience.
  if (out.size === 0) out.add("hiking");
  return [...out];
}

function inferSceneryScore(d: SeedDestination, landscape: Landscape): SceneryScore {
  const tags = new Set<Vibe>(d.tags);
  const slug = d.slug.toLowerCase();
  const name = d.name.toLowerCase();

  // Baseline by category.
  let score = 3;
  if (slug.endsWith("-np")) score = 4;
  if (slug.includes("scenic-byway") || slug.includes("scenic-drive") || slug.includes("parkway") || name.includes("highway 1") || name.includes("blue ridge")) score = 5;
  if (slug.includes("national-historic") || slug.includes("national-historical") || slug.includes("national-monument") || slug.includes("national-memorial")) score = 2;
  if (slug.includes("state-park")) score = 3;
  if (landscape === "city") score = 2;

  // Tag boosts.
  if (tags.has("scenic")) score += 1;
  if (tags.has("nature") && (landscape === "mountain" || landscape === "canyon" || landscape === "coast" || landscape === "island")) score += 1;

  // Name signals.
  if (/\bgrand\b|\bicon(ic)?\b|\bmajestic\b|\bspectacular\b|\bworld[- ]famous\b/.test(name)) score += 1;

  // Clamp.
  if (score > 5) score = 5;
  if (score < 1) score = 1;
  return score as SceneryScore;
}

function inferScenicSignals(d: SeedDestination, landscape: Landscape, score: SceneryScore): ScenicSignal[] {
  const out = new Set<ScenicSignal>();
  const name = d.name.toLowerCase();
  const tags = new Set<Vibe>(d.tags);

  if (/\bredwoods?\b|\bsequoia(s)?\b/.test(name)) out.add("redwood");
  if (/\bcanyon\b|\barches\b|\bbadlands\b|\bmonument\b/.test(name)) out.add("geological-feature");
  if (landscape === "coast" || landscape === "island") out.add("coastal-cliffs");
  if (landscape === "mountain" && score >= 4) out.add("alpine");
  if (landscape === "lake") out.add("water-feature");
  if (/\bfall\b|\bautumn\b|\bnew england\b/.test(name) || d.region.toLowerCase().includes("new england")) {
    if (landscape === "forest" || landscape === "mountain") out.add("fall-color");
  }
  if (landscape === "desert" && score >= 4) out.add("dark-sky");
  if (tags.has("nature") && (landscape === "forest" || landscape === "mountain")) out.add("wildlife");

  return [...out];
}

// ─────────────────────────────────────────────────────────────────
// Top-level pipeline
// ─────────────────────────────────────────────────────────────────

export function enrichOne(
  d: SeedDestination,
  override?: MetaOverride,
): EnrichedDestination {
  const o = override ?? {};

  const landscape = o.landscape ?? d.landscape ?? inferLandscape(d);
  const secondaryLandscapes = o.secondaryLandscapes ?? d.secondaryLandscapes;
  const experiences = o.experiences ?? d.experiences ?? inferExperiences(d, landscape);
  const sceneryScore = o.sceneryScore ?? d.sceneryScore ?? inferSceneryScore(d, landscape);
  const scenicSignals = o.scenicSignals ?? d.scenicSignals ?? inferScenicSignals(d, landscape, sceneryScore);

  return {
    ...d,
    landscape,
    secondaryLandscapes,
    experiences,
    sceneryScore,
    scenicSignals: scenicSignals.length > 0 ? scenicSignals : undefined,
  };
}

/**
 * Normalize destination names for dedup. Strips type suffixes ("National Park",
 * "National Lakeshore", etc.) and abbreviations ("Mt." → "Mount") so variants
 * like "Great Smoky Mountains" and "Great Smoky Mountains National Park"
 * compare equal. Codex flagged this as the most likely missed-dupe path.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bmt\.\s+/g, "mount ")
    .replace(/\bst\.\s+/g, "saint ")
    .replace(
      /\s+(national park|national lakeshore|national seashore|national monument|national historical park|national historic site|national battlefield( site)?|national recreation area|national memorial|national preserve|national reserve|national forest|national parkway|national heritage area|national marine sanctuary|national wild and scenic river|national scenic riverway[s]?|national scenic river|state park|preserve)$/g,
      "",
    )
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/**
 * Deduplicate auto-imported entries that duplicate hand-curated ones. Three
 * passes (each tighter than the last):
 *   1. Exact `(name, state)` match (catches `acadia-np` vs `acadia`, both
 *      named "Acadia National Park" / state "ME").
 *   2. Same-name + lat/lng within 0.5° (catches "Lake Tahoe" / "CA" vs "Lake
 *      Tahoe" / "California / Nevada" — same place, different state strings).
 *   3. Normalized-name + lat/lng within 0.5° (catches "Great Smoky Mountains"
 *      vs "Great Smoky Mountains National Park" — codex's variant-name miss).
 *
 * Hand-curated entries come first in `DESTINATIONS` so they win every dedupe.
 */
function dedupeByName<T extends SeedDestination>(arr: T[]): T[] {
  const seenKey = new Set<string>();
  const seenByGeo: { name: string; norm: string; lat: number; lng: number }[] = [];
  const out: T[] = [];
  for (const d of arr) {
    const exactKey = `${d.name}|${d.state}`;
    if (seenKey.has(exactKey)) continue;
    const norm = normalizeName(d.name);
    const collision = seenByGeo.find(
      (s) =>
        Math.abs(s.lat - d.lat) < 0.5 &&
        Math.abs(s.lng - d.lng) < 0.5 &&
        (s.name === d.name || s.norm === norm),
    );
    if (collision) continue;
    seenKey.add(exactKey);
    seenByGeo.push({ name: d.name, norm, lat: d.lat, lng: d.lng });
    out.push(d);
  }
  return out;
}

export const ENRICHED_DESTINATIONS: EnrichedDestination[] = dedupeByName(DESTINATIONS).map((d) =>
  enrichOne(d, META_OVERRIDES[d.slug]),
);
