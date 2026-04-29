-- Stale compute lock recovery.
--
-- computeRecommendations grabs the lock by flipping pending → computing in
-- a single conditional UPDATE. If the worker dies after the flip (crash,
-- deploy, function timeout), the row stays computing forever — the trip
-- page only re-triggers compute on `pending`, so stuck rows are invisible.
--
-- Fix: track when the lock was acquired. The lock-acquire UPDATE matches
-- `pending OR (computing AND computing_started_at < now() - 5 minutes)`,
-- which auto-recovers stuck rows on the next request without a cron job.

alter table public.trips
  add column if not exists computing_started_at timestamptz;

comment on column public.trips.computing_started_at is
  'Set when compute_status flips to ''computing''. Used by '
  'computeRecommendations to detect + recover stale locks (>5 minutes old).';
