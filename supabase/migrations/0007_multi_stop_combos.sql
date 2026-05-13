-- Phase B: multi-stop combos.
--
-- v3 treats a recommendation as a single destination. The proposal's
-- "decision conversation" thesis lands hardest on multi-stop trips
-- ("drop the second stop, find me one closer to Vegas"), so Phase B
-- introduces 1–3 ordered stops per rec. The top-level `destination_slug`
-- stays as the anchor (= stops[0].slug) for back-compat — `parseRec` will
-- continue to render pre-migration trips that way.
--
-- - recommendations.stops:           jsonb array of {slug, order, days}
--                                     Single-stop today; 2–3 stops after B.3.
-- - recommendations.stop_snapshots:  jsonb array of frozen SeedDestination
--                                     objects, ordered to match `stops`.
--                                     Mirrors `destination_snapshot` (which
--                                     stays as anchor snapshot per the plan).

-- ─────────────────────────────────────────────────────────────
-- recommendations: stops + stop_snapshots
-- ─────────────────────────────────────────────────────────────
alter table public.recommendations
  add column if not exists stops jsonb not null default '[]'::jsonb,
  add column if not exists stop_snapshots jsonb;

-- ─────────────────────────────────────────────────────────────
-- Backfill: every existing rec is a 1-stop combo. Use the existing
-- `destination_slug` + `destination_snapshot` as the single stop so
-- `parseRec` keeps rendering historical trips identically.
-- ─────────────────────────────────────────────────────────────
update public.recommendations
set
  stops = jsonb_build_array(
    jsonb_build_object('slug', destination_slug, 'order', 1, 'days', null)
  ),
  stop_snapshots = jsonb_build_array(destination_snapshot)
where jsonb_array_length(stops) = 0;

-- Sanity: every existing recommendation should now have a non-empty `stops`
-- array and a matching `stop_snapshots` array of the same length.
do $$
declare
  empty_count int;
  mismatch_count int;
begin
  select count(*) into empty_count
    from public.recommendations
    where jsonb_array_length(stops) = 0;
  if empty_count > 0 then
    raise exception 'Backfill left % recommendation rows with empty stops', empty_count;
  end if;

  select count(*) into mismatch_count
    from public.recommendations
    where stop_snapshots is null
       or jsonb_array_length(stops) <> jsonb_array_length(stop_snapshots);
  if mismatch_count > 0 then
    raise exception
      'Backfill left % rows where stops and stop_snapshots disagree in length',
      mismatch_count;
  end if;
end $$;
