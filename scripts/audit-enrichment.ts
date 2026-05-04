/**
 * v3 enrichment invariants check. Run via `npm run audit:meta`. Exits non-zero
 * with a slug list when any destination has missing or invalid v3 fields, or
 * when there are duplicate names / colliding slugs.
 */
import { ENRICHED_DESTINATIONS } from "../src/lib/seed/enrich-destinations";

const VALID_LANDSCAPES = new Set([
  "mountain",
  "coast",
  "desert",
  "forest",
  "lake",
  "canyon",
  "island",
  "city",
]);
const VALID_EXPERIENCES = new Set([
  "hiking",
  "foodie",
  "museums",
  "scenic-drives",
  "beaches",
  "hot-springs",
  "wildlife",
]);
const VALID_SIGNALS = new Set([
  "iconic-vista",
  "wildlife",
  "geological-feature",
  "water-feature",
  "dark-sky",
  "fall-color",
  "wildflower-bloom",
  "coastal-cliffs",
  "alpine",
  "redwood",
]);

const errors: string[] = [];
const warnings: string[] = [];
const seenSlugs = new Set<string>();
const nameToSlugs = new Map<string, string[]>();

for (const d of ENRICHED_DESTINATIONS) {
  if (seenSlugs.has(d.slug)) errors.push(`duplicate slug: ${d.slug}`);
  seenSlugs.add(d.slug);

  // Surface duplicate names so we can resolve the yellowstone vs yellowstone-np
  // collision codex flagged.
  const nameKey = `${d.name}|${d.state}`;
  if (!nameToSlugs.has(nameKey)) nameToSlugs.set(nameKey, []);
  nameToSlugs.get(nameKey)!.push(d.slug);

  if (!VALID_LANDSCAPES.has(d.landscape)) {
    errors.push(`${d.slug}: invalid landscape "${d.landscape}"`);
  }
  if (d.secondaryLandscapes) {
    for (const s of d.secondaryLandscapes) {
      if (!VALID_LANDSCAPES.has(s)) errors.push(`${d.slug}: invalid secondaryLandscape "${s}"`);
      if (s === d.landscape) warnings.push(`${d.slug}: secondaryLandscapes duplicates primary "${d.landscape}"`);
    }
  }
  if (!Array.isArray(d.experiences) || d.experiences.length === 0) {
    errors.push(`${d.slug}: experiences must have at least one entry`);
  } else {
    for (const e of d.experiences) {
      if (!VALID_EXPERIENCES.has(e)) errors.push(`${d.slug}: invalid experience "${e}"`);
    }
  }
  if (![1, 2, 3, 4, 5].includes(d.sceneryScore)) {
    errors.push(`${d.slug}: sceneryScore ${d.sceneryScore} not in 1..5`);
  }
  if (d.scenicSignals) {
    for (const sig of d.scenicSignals) {
      if (!VALID_SIGNALS.has(sig)) errors.push(`${d.slug}: invalid scenicSignal "${sig}"`);
    }
  }
}

for (const [name, slugs] of nameToSlugs) {
  if (slugs.length > 1) {
    warnings.push(`duplicate display name "${name}": ${slugs.join(" + ")}`);
  }
}

console.log(`Audited ${ENRICHED_DESTINATIONS.length} enriched destinations.`);
if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// Distribution summary.
const landscapeDist: Record<string, number> = {};
const sceneryDist: Record<string, number> = {};
for (const d of ENRICHED_DESTINATIONS) {
  landscapeDist[d.landscape] = (landscapeDist[d.landscape] ?? 0) + 1;
  sceneryDist[String(d.sceneryScore)] = (sceneryDist[String(d.sceneryScore)] ?? 0) + 1;
}
console.log("\nLandscape distribution:");
for (const [k, v] of Object.entries(landscapeDist).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${v.toString().padStart(4)}  ${k}`);
}
console.log("\nScenery score distribution:");
for (const k of ["5", "4", "3", "2", "1"]) {
  console.log(`  ${(sceneryDist[k] ?? 0).toString().padStart(4)}  ★ ${k}`);
}
console.log("\n✓ Enrichment audit clean.");
