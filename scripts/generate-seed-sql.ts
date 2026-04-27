/**
 * Regenerates supabase/seed/destinations.sql from the typed seed in
 * src/lib/seed/destinations.ts. Run with: npm run seed:sql
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { DESTINATIONS } from "../src/lib/seed/destinations";

function sqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function sqlArray(arr: string[]): string {
  return `ARRAY[${arr.map(sqlString).join(", ")}]::text[]`;
}

function sqlJson(obj: unknown): string {
  return `${sqlString(JSON.stringify(obj))}::jsonb`;
}

function rowSql(): string {
  const lines = DESTINATIONS.map((d) => {
    const cols = [
      sqlString(d.slug),
      sqlString(d.name),
      sqlString(d.region),
      sqlString(d.state),
      String(d.lat),
      String(d.lng),
      sqlArray(d.tags),
      sqlString(d.blurb),
      d.heroPhotoUrl ? sqlString(d.heroPhotoUrl) : "NULL",
      sqlJson(d.attractions),
      sqlJson(d.typicalCostBands),
      sqlArray(d.bestSeasons),
      d.maxFlightHoursFromOrigin ? sqlJson(d.maxFlightHoursFromOrigin) : "NULL",
    ];
    return `  (${cols.join(", ")})`;
  });
  return lines.join(",\n");
}

const sql = `-- Auto-generated from src/lib/seed/destinations.ts. DO NOT HAND-EDIT.
-- Regenerate with: npm run seed:sql

insert into public.destinations_seed (
  slug, name, region, state, lat, lng, tags, blurb, hero_photo_url,
  attractions, typical_cost_bands, best_seasons, max_flight_hours_from_origin
) values
${rowSql()}
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  state = excluded.state,
  lat = excluded.lat,
  lng = excluded.lng,
  tags = excluded.tags,
  blurb = excluded.blurb,
  hero_photo_url = excluded.hero_photo_url,
  attractions = excluded.attractions,
  typical_cost_bands = excluded.typical_cost_bands,
  best_seasons = excluded.best_seasons,
  max_flight_hours_from_origin = excluded.max_flight_hours_from_origin;
`;

const outPath = resolve(__dirname, "..", "supabase", "seed", "destinations.sql");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, sql);
// eslint-disable-next-line no-console
console.log(`Wrote ${DESTINATIONS.length} rows to ${outPath}`);
