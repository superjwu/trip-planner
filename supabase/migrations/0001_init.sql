-- Trip Planning Copilot — initial schema
-- Auth: Clerk via Supabase Third-Party Auth.
-- RLS predicates use the Clerk session token's `sub` claim.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- destinations_seed: hand-curated US destinations.
-- Public read; writes only via service role.
-- ─────────────────────────────────────────────────────────────
create table public.destinations_seed (
  slug              text primary key,
  name              text not null,
  region            text not null,
  state             text not null,
  lat               double precision not null,
  lng               double precision not null,
  tags              text[] not null default '{}',
  blurb             text not null,
  hero_photo_url    text,
  attractions       jsonb not null default '[]'::jsonb,
  typical_cost_bands jsonb not null,
  best_seasons      text[] not null default '{}',
  max_flight_hours_from_origin jsonb,
  created_at        timestamptz not null default now()
);

alter table public.destinations_seed enable row level security;

create policy "destinations_seed: public read"
  on public.destinations_seed for select
  to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────
-- trips: a user's planning session.
-- ─────────────────────────────────────────────────────────────
create table public.trips (
  id                uuid primary key default gen_random_uuid(),
  clerk_user_id     text not null,
  name              text,
  origin_city       text,
  depart_on         date,
  return_on         date,
  raw_input         jsonb,
  normalized_input  jsonb,
  compute_status    text not null default 'pending'
                    check (compute_status in ('pending','computing','ready','failed')),
  compute_error     text,
  seed_version      int,
  prompt_version    text,
  user_status       text not null default 'draft'
                    check (user_status in ('draft','saved','archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index trips_clerk_user_id_idx on public.trips(clerk_user_id);
create index trips_created_at_idx   on public.trips(created_at desc);

alter table public.trips enable row level security;

create policy "trips: owner read"
  on public.trips for select
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner insert"
  on public.trips for insert
  to authenticated
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner update"
  on public.trips for update
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'))
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner delete"
  on public.trips for delete
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────────────────────
-- recommendations: 4 per trip.
-- ─────────────────────────────────────────────────────────────
create table public.recommendations (
  id                    uuid primary key default gen_random_uuid(),
  trip_id               uuid not null references public.trips(id) on delete cascade,
  rank                  int not null check (rank between 1 and 4),
  destination_slug      text not null,
  reasoning             text not null,
  match_tags            text[] not null default '{}',
  destination_snapshot  jsonb not null,
  hydration             jsonb,
  booking_links         jsonb,
  itinerary             jsonb,
  llm_meta              jsonb,
  hydration_status      text not null default 'pending'
                        check (hydration_status in ('pending','ready','failed')),
  created_at            timestamptz not null default now(),
  unique(trip_id, rank)
);

create index recommendations_trip_id_idx on public.recommendations(trip_id);

alter table public.recommendations enable row level security;

create policy "recommendations: owner read"
  on public.recommendations for select
  to authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendations: owner insert"
  on public.recommendations for insert
  to authenticated
  with check (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendations: owner update"
  on public.recommendations for update
  to authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  )
  with check (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendations: owner delete"
  on public.recommendations for delete
  to authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- ─────────────────────────────────────────────────────────────
-- rec_cache: dedupe LLM ranking calls across users.
-- Public-ish; writes only via service role.
-- ─────────────────────────────────────────────────────────────
create table public.rec_cache (
  key         text primary key,
  response    jsonb not null,
  created_at  timestamptz not null default now()
);

alter table public.rec_cache enable row level security;

create policy "rec_cache: public read"
  on public.rec_cache for select
  to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────
create or replace function public.tg_set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger trips_updated_at
  before update on public.trips
  for each row execute function public.tg_set_updated_at();
