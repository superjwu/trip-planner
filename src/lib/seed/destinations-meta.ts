/**
 * v3 enrichment overrides — explicit hand-curated landscape / experiences /
 * sceneryScore / scenicSignals for marquee destinations. Anything not in this
 * map is enriched algorithmically by `enrich-destinations.ts`. This map is
 * the single source of truth for cases where inference would get it wrong.
 *
 * Each entry is `Partial<...>` so you can override one field and let the rest
 * fall back to inference. `secondaryLandscapes` is the codex-flagged escape
 * hatch for places that genuinely span two terrains (Tahoe = mountain + lake).
 */
import type { Experience, Landscape, ScenicSignal, SceneryScore } from "../types";

export type MetaOverride = Partial<{
  landscape: Landscape;
  secondaryLandscapes: Landscape[];
  experiences: Experience[];
  sceneryScore: SceneryScore;
  scenicSignals: ScenicSignal[];
}>;

export const META_OVERRIDES: Record<string, MetaOverride> = {
  // ───── Hand-curated cities ──────────────────────────────────────
  "boston-ma": {
    landscape: "city",
    experiences: ["museums", "foodie"],
    sceneryScore: 3,
  },
  "charleston-sc": {
    landscape: "city",
    secondaryLandscapes: ["coast"],
    experiences: ["foodie", "museums", "beaches"],
    sceneryScore: 3,
  },
  "savannah-ga": {
    landscape: "city",
    secondaryLandscapes: ["coast"],
    experiences: ["foodie", "museums"],
    sceneryScore: 3,
  },
  "new-orleans-la": {
    landscape: "city",
    experiences: ["foodie", "museums"],
    sceneryScore: 3,
  },
  "nashville-tn": {
    landscape: "city",
    experiences: ["foodie", "museums"],
    sceneryScore: 2,
  },
  "austin-tx": {
    landscape: "city",
    experiences: ["foodie", "museums"],
    sceneryScore: 2,
  },
  "asheville-nc": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["foodie", "hiking", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["fall-color"],
  },
  "santa-fe-nm": {
    landscape: "desert",
    secondaryLandscapes: ["mountain", "city"],
    experiences: ["museums", "foodie", "scenic-drives"],
    sceneryScore: 4,
  },
  "philadelphia-pa": {
    landscape: "city",
    experiences: ["museums", "foodie"],
    sceneryScore: 2,
  },
  "portland-or": {
    landscape: "city",
    secondaryLandscapes: ["forest"],
    experiences: ["foodie", "museums"],
    sceneryScore: 3,
  },
  "san-diego-ca": {
    landscape: "coast",
    secondaryLandscapes: ["city"],
    experiences: ["beaches", "foodie", "museums"],
    sceneryScore: 4,
    scenicSignals: ["coastal-cliffs"],
  },

  // ───── National parks ───────────────────────────────────────────
  "acadia-np": {
    landscape: "coast",
    secondaryLandscapes: ["forest", "island"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["coastal-cliffs", "fall-color", "wildlife"],
  },
  "yellowstone-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "wildlife", "hot-springs", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["wildlife", "geological-feature", "alpine"],
  },
  "yosemite-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "alpine", "redwood", "geological-feature"],
  },
  "zion-np": {
    landscape: "canyon",
    secondaryLandscapes: ["desert"],
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "geological-feature"],
  },
  "joshua-tree-np": {
    landscape: "desert",
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["dark-sky", "geological-feature", "wildflower-bloom"],
  },
  "smoky-mountains-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["fall-color", "wildlife"],
  },
  "glacier-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest", "lake"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "alpine", "wildlife", "water-feature"],
  },
  "olympic-np": {
    landscape: "forest",
    secondaryLandscapes: ["coast", "mountain"],
    experiences: ["hiking", "scenic-drives", "wildlife", "beaches"],
    sceneryScore: 5,
    scenicSignals: ["redwood", "coastal-cliffs", "wildlife"],
  },
  "grand-canyon-np": {
    landscape: "canyon",
    secondaryLandscapes: ["desert"],
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "geological-feature", "dark-sky"],
  },
  "rocky-mountain-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest", "lake"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["alpine", "wildlife", "wildflower-bloom"],
  },
  "bryce-canyon-np": {
    landscape: "canyon",
    secondaryLandscapes: ["desert"],
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "geological-feature", "dark-sky"],
  },
  "arches-np": {
    landscape: "desert",
    secondaryLandscapes: ["canyon"],
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "geological-feature", "dark-sky"],
  },
  "death-valley-np": {
    landscape: "desert",
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["geological-feature", "dark-sky", "wildflower-bloom"],
  },
  "mt-rainier-np": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["alpine", "iconic-vista", "wildflower-bloom"],
  },

  // ───── Mountain towns ──────────────────────────────────────────
  "aspen-co": {
    landscape: "mountain",
    experiences: ["hiking", "scenic-drives", "foodie"],
    sceneryScore: 5,
    scenicSignals: ["alpine", "fall-color"],
  },
  "jackson-hole-wy": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "wildlife", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["alpine", "wildlife"],
  },
  "sedona-az": {
    landscape: "desert",
    secondaryLandscapes: ["canyon"],
    experiences: ["hiking", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "geological-feature"],
  },
  "lake-tahoe-ca": {
    landscape: "lake",
    secondaryLandscapes: ["mountain"],
    experiences: ["hiking", "beaches", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["alpine", "water-feature"],
  },
  "bend-or": {
    landscape: "mountain",
    secondaryLandscapes: ["forest"],
    experiences: ["hiking", "foodie", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["alpine"],
  },
  "taos-nm": {
    landscape: "mountain",
    secondaryLandscapes: ["desert"],
    experiences: ["hiking", "museums", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["alpine"],
  },
  "marfa-tx": {
    landscape: "desert",
    experiences: ["museums", "scenic-drives"],
    sceneryScore: 3,
    scenicSignals: ["dark-sky"],
  },

  // ───── Coast / island ──────────────────────────────────────────
  "big-sur-ca": {
    landscape: "coast",
    experiences: ["scenic-drives", "hiking", "beaches"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "coastal-cliffs", "redwood"],
  },
  "maui-hi": {
    landscape: "island",
    secondaryLandscapes: ["coast"],
    experiences: ["beaches", "scenic-drives", "hiking"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "coastal-cliffs", "water-feature"],
  },
  "kauai-hi": {
    landscape: "island",
    secondaryLandscapes: ["coast"],
    experiences: ["hiking", "beaches", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "coastal-cliffs", "water-feature"],
  },
  "key-west-fl": {
    landscape: "island",
    secondaryLandscapes: ["coast"],
    experiences: ["beaches", "foodie"],
    sceneryScore: 4,
    scenicSignals: ["water-feature"],
  },
  "cape-cod-ma": {
    landscape: "coast",
    secondaryLandscapes: ["island"],
    experiences: ["beaches", "foodie", "scenic-drives"],
    sceneryScore: 4,
    scenicSignals: ["coastal-cliffs"],
  },
  "outer-banks-nc": {
    landscape: "coast",
    secondaryLandscapes: ["island"],
    experiences: ["beaches", "scenic-drives", "wildlife"],
    sceneryScore: 4,
    scenicSignals: ["coastal-cliffs"],
  },

  // ───── Misc hand-curated ───────────────────────────────────────
  "hudson-valley-ny": {
    landscape: "forest",
    secondaryLandscapes: ["lake"],
    experiences: ["foodie", "museums", "scenic-drives", "hiking"],
    sceneryScore: 4,
    scenicSignals: ["fall-color"],
  },
  "niagara-falls-ny": {
    landscape: "lake",
    secondaryLandscapes: ["city"],
    experiences: ["scenic-drives", "wildlife"],
    sceneryScore: 5,
    scenicSignals: ["iconic-vista", "water-feature"],
  },

  // ───── Selected imports needing override ───────────────────────
  // The auto-imported `yellowstone` slug duplicates `yellowstone-np`. Override
  // to keep them visually distinguishable until dedup happens.
  yellowstone: {
    landscape: "mountain",
    experiences: ["hiking", "wildlife", "hot-springs", "scenic-drives"],
    sceneryScore: 5,
    scenicSignals: ["wildlife", "geological-feature"],
  },
};
