"use server";
import { revalidatePath } from "next/cache";
import { ENRICHED_DESTINATIONS as DESTINATIONS } from "@/lib/seed/enrich-destinations";
import { getVisitedSlugs, setVisitedSlugs } from "@/lib/visited";
import { getFavoriteSlugs, setFavoriteSlugs } from "@/lib/favorites";

const KNOWN = new Set(DESTINATIONS.map((d) => d.slug));

export async function toggleVisitedAction(slug: string): Promise<void> {
  if (!KNOWN.has(slug)) return;
  const cur = await getVisitedSlugs();
  await setVisitedSlugs(
    cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
  );
  revalidatePath("/destinations");
  revalidatePath("/settings");
}

export async function toggleFavoriteAction(slug: string): Promise<void> {
  if (!KNOWN.has(slug)) return;
  const cur = await getFavoriteSlugs();
  await setFavoriteSlugs(
    cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
  );
  revalidatePath("/destinations");
}
