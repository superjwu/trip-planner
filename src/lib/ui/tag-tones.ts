// Tag → background+text color mapping for the v2 pastel palette.
// Mirrored in src/app/globals.css (.tag-foodie etc.) so plain CSS classes
// also work; this object is for inline JSX where you want one-shot Tailwind
// arbitrary values.

// Inline bg/text values mirror the coastal-slate CSS vars in globals.css:
// --rose:#fad2c9  --sage:#c4d4cc  --lavender:#d4dde6  --butter:#fdf2e5
export const TAG_TONES: Record<string, { bg: string; text: string; cls: string }> = {
  foodie:            { bg: "#fad2c9", text: "#8a3a26", cls: "tag-foodie" },
  scenic:            { bg: "#c4d4cc", text: "#3d5a45", cls: "tag-scenic" },
  chill:             { bg: "#d4dde6", text: "#324a64", cls: "tag-chill" },
  cultural:          { bg: "#fdf2e5", text: "#80552c", cls: "tag-cultural" },
  city:              { bg: "#dde4ea", text: "#4b5563", cls: "tag-default" },
  nature:            { bg: "#c4d4cc", text: "#3d5a45", cls: "tag-scenic" },
  adventure:         { bg: "#fad2c9", text: "#8a3a26", cls: "tag-foodie" },
  nightlife:         { bg: "#d4dde6", text: "#324a64", cls: "tag-chill" },
  walkable:          { bg: "#fad2c9", text: "#8a3a26", cls: "tag-foodie" },
  "short flight":    { bg: "#dde4ea", text: "#4b5563", cls: "tag-default" },
  "shoulder season": { bg: "#fdf2e5", text: "#80552c", cls: "tag-cultural" },
  "small crowds":    { bg: "#d4dde6", text: "#324a64", cls: "tag-chill" },
  "mountain views":  { bg: "#c4d4cc", text: "#3d5a45", cls: "tag-scenic" },
  "shoulder-season": { bg: "#fdf2e5", text: "#80552c", cls: "tag-cultural" },
};

const FALLBACK = { bg: "#dde4ea", text: "#4b5563", cls: "tag-default" } as const;

export function tagTone(tag: string): { bg: string; text: string; cls: string } {
  return TAG_TONES[tag.toLowerCase().trim()] ?? FALLBACK;
}

export function tagClass(tag: string): string {
  return tagTone(tag).cls;
}
