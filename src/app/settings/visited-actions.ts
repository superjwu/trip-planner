"use server";
import { revalidatePath } from "next/cache";
import { ENRICHED_DESTINATIONS as DESTINATIONS } from "@/lib/seed/enrich-destinations";
import { getVisitedSlugs, setVisitedSlugs } from "@/lib/visited";

const KNOWN_SLUGS = new Set(DESTINATIONS.map((d) => d.slug));

export async function addVisitedAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!KNOWN_SLUGS.has(slug)) return;
  const cur = await getVisitedSlugs();
  if (cur.includes(slug)) return;
  await setVisitedSlugs([...cur, slug]);
  revalidatePath("/settings");
}

export async function removeVisitedAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const cur = await getVisitedSlugs();
  await setVisitedSlugs(cur.filter((s) => s !== slug));
  revalidatePath("/settings");
}
