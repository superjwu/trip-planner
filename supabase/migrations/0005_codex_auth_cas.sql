-- Compare-and-swap variant of codex_auth_upsert for the refresh path.
--
-- Without CAS, two concurrent requests for the same user can both observe
-- a near-expired access token, both call OpenAI's /oauth/token refresh
-- endpoint with the same refresh_token, and both write back. OpenAI
-- invalidates the refresh_token on use, so the second writer's tokens may
-- already be invalid by the time they land. The user appears to have a
-- valid session that breaks within seconds.
--
-- The CAS version of upsert only writes if the row's
-- access_token_expires_at still matches what the caller observed before
-- starting the refresh. If 0 rows are updated, someone else refreshed
-- first; the caller should re-read and use that fresher token.

create or replace function public.codex_auth_upsert_cas(
  p_clerk_user_id           text,
  p_access_token            text,
  p_refresh_token           text,
  p_access_token_expires_at timestamptz,
  p_chatgpt_account_id      text,
  p_key                     text,
  p_expected_old_expires    timestamptz
) returns int
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  rows_updated int;
begin
  -- Compare-and-swap on access_token_expires_at: only update if the row's
  -- current expiry matches what the caller saw. If a parallel refresh
  -- already advanced it, the predicate fails and rows_updated = 0.
  update public.user_codex_auth set
    encrypted_access_token  = extensions.pgp_sym_encrypt(p_access_token, p_key),
    encrypted_refresh_token = extensions.pgp_sym_encrypt(p_refresh_token, p_key),
    access_token_expires_at = p_access_token_expires_at,
    chatgpt_account_id      = p_chatgpt_account_id,
    updated_at              = now()
  where clerk_user_id = p_clerk_user_id
    and access_token_expires_at = p_expected_old_expires;
  get diagnostics rows_updated = row_count;
  return rows_updated;
end;
$$;

revoke all on function public.codex_auth_upsert_cas(text, text, text, timestamptz, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.codex_auth_upsert_cas(text, text, text, timestamptz, text, text, timestamptz) to service_role;
