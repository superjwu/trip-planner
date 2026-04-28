-- Per-user ChatGPT OAuth state for the Codex backend integration.
-- One row per Clerk user. Tokens are encrypted at rest with pgp_sym_encrypt
-- keyed off CODEX_TOKEN_ENCRYPTION_KEY (server-only env var).

create extension if not exists pgcrypto;

create table public.user_codex_auth (
  clerk_user_id              text primary key,
  encrypted_access_token     bytea not null,
  encrypted_refresh_token    bytea not null,
  access_token_expires_at    timestamptz not null,
  chatgpt_account_id         text not null,
  encryption_key_version     int not null default 1,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

alter table public.user_codex_auth enable row level security;

-- Owner can SELECT to render "Connected as ..." in the UI.
-- Tokens themselves are encrypted, so even a leaky read can't grant API access
-- without the master key.
create policy "user_codex_auth: owner read"
  on public.user_codex_auth for select
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Owner can DELETE so disconnect-from-client also works under RLS.
create policy "user_codex_auth: owner delete"
  on public.user_codex_auth for delete
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Inserts and updates happen via the service role (server-only) so the
-- encryption keying material never leaves the server.

create trigger user_codex_auth_updated_at
  before update on public.user_codex_auth
  for each row execute function public.tg_set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RPC helpers — keep encryption inside Postgres so the app server
-- only sees plaintext tokens transiently in memory while making
-- the outbound Codex backend call.
-- Service-role only: SECURITY DEFINER + revoke from anon/auth.
-- ─────────────────────────────────────────────────────────────

create or replace function public.codex_auth_read(
  p_clerk_user_id text,
  p_key text
)
returns table (
  access_token text,
  refresh_token text,
  access_token_expires_at timestamptz,
  chatgpt_account_id text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    pgp_sym_decrypt(u.encrypted_access_token, p_key)::text  as access_token,
    pgp_sym_decrypt(u.encrypted_refresh_token, p_key)::text as refresh_token,
    u.access_token_expires_at,
    u.chatgpt_account_id
  from public.user_codex_auth u
  where u.clerk_user_id = p_clerk_user_id;
end;
$$;

create or replace function public.codex_auth_upsert(
  p_clerk_user_id           text,
  p_access_token            text,
  p_refresh_token           text,
  p_access_token_expires_at timestamptz,
  p_chatgpt_account_id      text,
  p_key                     text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_codex_auth (
    clerk_user_id,
    encrypted_access_token,
    encrypted_refresh_token,
    access_token_expires_at,
    chatgpt_account_id
  ) values (
    p_clerk_user_id,
    pgp_sym_encrypt(p_access_token, p_key),
    pgp_sym_encrypt(p_refresh_token, p_key),
    p_access_token_expires_at,
    p_chatgpt_account_id
  )
  on conflict (clerk_user_id) do update set
    encrypted_access_token  = excluded.encrypted_access_token,
    encrypted_refresh_token = excluded.encrypted_refresh_token,
    access_token_expires_at = excluded.access_token_expires_at,
    chatgpt_account_id      = excluded.chatgpt_account_id,
    updated_at              = now();
end;
$$;

revoke all on function public.codex_auth_read(text, text) from public, anon, authenticated;
revoke all on function public.codex_auth_upsert(text, text, text, timestamptz, text, text) from public, anon, authenticated;
grant execute on function public.codex_auth_read(text, text) to service_role;
grant execute on function public.codex_auth_upsert(text, text, text, timestamptz, text, text) to service_role;
