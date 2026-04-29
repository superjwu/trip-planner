-- Widens owner RLS policies from `to authenticated` to `to anon, authenticated`.
--
-- Why: Supabase + Clerk Third-Party Auth delivers a valid JWT but the
-- session is mapped to the `anon` Postgres role, NOT `authenticated`. Our
-- original policies only applied to `authenticated`, so RLS was denying
-- every authenticated request with the misleading error
--   "new row violates row-level security policy".
--
-- The predicate `clerk_user_id = auth.jwt() ->> 'sub'` is what actually
-- enforces ownership, and `auth.jwt()->>'sub'` is null for unauthenticated
-- traffic — so widening to `anon, authenticated` doesn't loosen security,
-- it just makes the policy reachable by Clerk-authenticated sessions.
--
-- Applied directly to the live DB during initial bring-up. This file
-- captures the change so fresh installs match.

-- ── trips ─────────────────────────────────────────────────
drop policy if exists "trips: owner read"   on public.trips;
drop policy if exists "trips: owner insert" on public.trips;
drop policy if exists "trips: owner update" on public.trips;
drop policy if exists "trips: owner delete" on public.trips;

create policy "trips: owner read"
  on public.trips for select
  to anon, authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner insert"
  on public.trips for insert
  to anon, authenticated
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner update"
  on public.trips for update
  to anon, authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'))
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "trips: owner delete"
  on public.trips for delete
  to anon, authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- ── recommendations ──────────────────────────────────────
drop policy if exists "recommendations: owner read"   on public.recommendations;
drop policy if exists "recommendations: owner insert" on public.recommendations;
drop policy if exists "recommendations: owner update" on public.recommendations;
drop policy if exists "recommendations: owner delete" on public.recommendations;

create policy "recommendations: owner read"
  on public.recommendations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendations: owner insert"
  on public.recommendations for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "recommendations: owner update"
  on public.recommendations for update
  to anon, authenticated
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
  to anon, authenticated
  using (
    exists (
      select 1 from public.trips t
      where t.id = recommendations.trip_id
        and t.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- ── user_codex_auth ──────────────────────────────────────
drop policy if exists "user_codex_auth: owner read"   on public.user_codex_auth;
drop policy if exists "user_codex_auth: owner delete" on public.user_codex_auth;

create policy "user_codex_auth: owner read"
  on public.user_codex_auth for select
  to anon, authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "user_codex_auth: owner delete"
  on public.user_codex_auth for delete
  to anon, authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));
