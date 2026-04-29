// Tag → background+text color mapping for the v2 pastel palette.
// Mirrored in src/app/globals.css (.tag-foodie etc.) so plain CSS classes
// also work; this object is for inline JSX where you want one-shot Tailwind
// arbitrary values.

export const TAG_TONES: Record<string, { bg: string; text: string; cls: string }> = {
  foodie:            { bg: "#EBD3CF", text: "#7A3F3F", cls: "tag-foodie" },
  scenic:            { bg: "#D7E0CB", text: "#4F5E3F", cls: "tag-scenic" },
  chill:             { bg: "#DCD6E8", text: "#564B7A", cls: "tag-chill" },
  cultural:          { bg: "#F4E7C5", text: "#7A6638", cls: "tag-cultural" },
  city:              { bg: "#E8DDD0", text: "#6B5A47", cls: "tag-default" },
  nature:            { bg: "#D7E0CB", text: "#4F5E3F", cls: "tag-scenic" },
  adventure:         { bg: "#EBD3CF", text: "#7A3F3F", cls: "tag-foodie" },
  nightlife:         { bg: "#DCD6E8", text: "#564B7A", cls: "tag-chill" },
  walkable:          { bg: "#EBD3CF", text: "#7A3F3F", cls: "tag-foodie" },
  "short flight":    { bg: "#E8DDD0", text: "#6B5A47", cls: "tag-default" },
  "shoulder season": { bg: "#F4E7C5", text: "#7A6638", cls: "tag-cultural" },
  "small crowds":    { bg: "#DCD6E8", text: "#564B7A", cls: "tag-chill" },
  "mountain views":  { bg: "#D7E0CB", text: "#4F5E3F", cls: "tag-scenic" },
  "shoulder-season": { bg: "#F4E7C5", text: "#7A6638", cls: "tag-cultural" },
};

const FALLBACK = { bg: "#E8DDD0", text: "#6B5A47", cls: "tag-default" } as const;

export function tagTone(tag: string): { bg: string; text: string; cls: string } {
  return TAG_TONES[tag.toLowerCase().trim()] ?? FALLBACK;
}

export function tagClass(tag: string): string {
  return tagTone(tag).cls;
}
