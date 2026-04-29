-- v2 alignment: recommendation rounds + tradeoffs.
--
-- v1 treated /trips/[id] as a one-shot generator: one set of 4
-- recommendations, no way to refine. The proposal asks for a decision
-- conversation: "drop #3, find me 3 alternates", "more like #2 but cheaper".
-- This migration introduces round-scoped recommendations:
--
-- - recommendation_rounds: one row per refine cycle. Round 1 is the initial
--   compute; round N has feedback (presets + free text) plus kept/avoided slugs.
-- - recommendations.round_id: scopes the 4 picks to a specific round.
-- - trips.active_round_id: which round the trip page renders by default.
-- - recommendations.tradeoffs: the per-pick 1..3 dot scores
--   (flight, budget, crowd, vibeFit, seasonFit) used by the new TradeoffMatrix.

-- ─────────────────────────────────────────────────────────────
-- recommendation_rounds
-- ─────────────────────────────────────────────────────────────
create table public.recommendation_rounds (
  id                     uuid primary key default gen_random_uuid(),
  trip_id                uuid not null references public.trips(id) on delete cascade,
  parent_round_id        uuid references public.recommendation_rounds(id),
  round_number           int  not null,
  feedback_text          text,
  feedback_presets       text[] not null default '{}',
  kept_slugs             text[] not null default '{}',
  avoided_slugs          text[] not null default '{}',
  compute_status         text not null default 'pending'
                         check (compute_status in ('pending','computing','ready','failed')),
  compute_error          text,
  computing_started_at   timestamptz,
  llm_meta               jsonb,
  why_these_four         text,
  created_at             timestamptz not null default now(),
  unique(trip_id, round_number)
);

create index recommendation_rounds_trip_id_idx
  on public.recommendation_rounds(trip_id, round_number);

alter table public.recommendation_rounds enable row level security;

create policy "recommendation_rounds: owner read"
  on public.recommendation_rounds for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendation_rounds.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendation_rounds: owner insert"
  on public.recommendation_rounds for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.trips t
      where t.id = recommendation_rounds.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendation_rounds: owner update"
  on public.recommendation_rounds for update
  to anon, authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendation_rounds.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  )
  with check (
    exists (
      select 1 from public.trips t
      where t.id = recommendation_rounds.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendation_rounds: owner delete"
  on public.recommendation_rounds for delete
  to anon, authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendation_rounds.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- ─────────────────────────────────────────────────────────────
-- recommendations: round_id (FK), tradeoffs (jsonb)
-- ─────────────────────────────────────────────────────────────
alter table public.recommendations
  add column if not exists round_id uuid references public.recommendation_rounds(id) on delete cascade,
  add column if not exists tradeoffs jsonb;

create index if not exists recommendations_round_id_idx
  on public.recommendations(round_id);

-- ─────────────────────────────────────────────────────────────
-- trips: active_round_id (FK)
-- ─────────────────────────────────────────────────────────────
alter table public.trips
  add column if not exists active_round_id uuid references public.recommendation_rounds(id);

-- ─────────────────────────────────────────────────────────────
-- Backfill: every existing trip gets a round_number=1 row with the same
-- compute_status as the trip itself; existing recommendations get scoped
-- to that round; trips.active_round_id points at it.
-- ─────────────────────────────────────────────────────────────
do $$
declare
  t record;
  new_round_id uuid;
begin
  for t in select id, compute_status, compute_error, computing_started_at from public.trips loop
    insert into public.recommendation_rounds(
      trip_id, round_number, compute_status, compute_error, computing_started_at
    )
    values (t.id, 1, t.compute_status, t.compute_error, t.computing_started_at)
    returning id into new_round_id;

    update public.recommendations
      set round_id = new_round_id
      where trip_id = t.id and round_id is null;

    update public.trips
      set active_round_id = new_round_id
      where id = t.id;
  end loop;
end $$;

-- Sanity: every existing recommendation should now have a round_id.
do $$
declare
  orphan_count int;
begin
  select count(*) into orphan_count from public.recommendations where round_id is null;
  if orphan_count > 0 then
    raise exception 'Backfill left % recommendation rows without round_id', orphan_count;
  end if;
end $$;

-- Now that backfill is complete and every row has a round_id, swap the
-- unique constraint from (trip_id, rank) to (round_id, rank). The old one
-- would prevent round 2 from inserting its own ranks 1..4 alongside round 1's.
alter table public.recommendations
  drop constraint if exists recommendations_trip_id_rank_key;
alter table public.recommendations
  add constraint recommendations_round_id_rank_key unique (round_id, rank);
