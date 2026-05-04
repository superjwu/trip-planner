import type { SeedDestination } from "@/lib/types";
// Path from src/lib/i18n/ up to scripts/ is ../../../scripts/
import zhManifestRaw from "../../../scripts/_destinations_zh.json";

interface ZhEntry {
  name: string;
  blurb: string;
}

const zhManifest = zhManifestRaw as Record<string, ZhEntry>;

/**
 * Returns localized name + blurb for a destination.
 *
 * - locale !== "zh": returns English name/blurb, nameEn is null.
 * - locale === "zh" + manifest hit: returns Chinese name/blurb, nameEn holds
 *   the original English name as subtitle.
 * - locale === "zh" + no manifest entry: falls back gracefully to English.
 */
export function localizeDestination(
  dest: Pick<SeedDestination, "slug" | "name" | "blurb">,
  locale: string,
): { name: string; nameEn: string | null; blurb: string } {
  if (locale !== "zh") {
    return { name: dest.name, nameEn: null, blurb: dest.blurb };
  }
  const zh = zhManifest[dest.slug];
  if (!zh) {
    return { name: dest.name, nameEn: null, blurb: dest.blurb };
  }
  return { name: zh.name, nameEn: dest.name, blurb: zh.blurb };
}
