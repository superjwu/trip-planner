# Vercel Deployment

Step-by-step for shipping `trip-planner` to Vercel for the first time.
After the initial deploy, every push to `master` triggers a re-deploy
automatically.

## 0. Prerequisites

You already have:
- A Supabase project with all migrations through `0006_recommendation_rounds`
  applied. Verify with `select max(round_number) from public.recommendation_rounds;`
  — should return at least 1.
- A Clerk application with sign-in URLs `/sign-in` and `/sign-up`.
- Generated values for `CODEX_TOKEN_ENCRYPTION_KEY` and
  `OAUTH_COOKIE_SIGNING_KEY` (both 32-byte hex). Generate with:
  `openssl rand -hex 32`.
- This repo pushed to GitHub (currently `superjwu/trip-planner`).

## 1. Connect the repo to Vercel

1. Go to <https://vercel.com/new>.
2. **Import Git Repository** → pick `superjwu/trip-planner`.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: leave blank (repo root).
5. Build & Output settings: defaults are correct (`npm run build`, `.next`).
6. **Don't deploy yet** — click *Environment Variables* and configure
   the ones below, then click **Deploy**.

## 2. Environment variables

Source of truth is `.env.local.example` in this repo. Every variable
listed there needs a value in the Vercel dashboard
(Settings → Environment Variables). Set them for **Production, Preview,
Development** unless noted otherwise.

| Var | Where it comes from | Notes |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | `pk_test_...` or `pk_live_...`. Public — safe in client bundle. |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | `sk_test_...` or `sk_live_...`. Server only. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | static | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | static | `/sign-up` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Anon key (the JWT, not the publishable key). |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Server only. Treat as a god-mode secret. |
| `CODEX_OAUTH_ENABLED` | static | `1` for normal operation. Flip to `0` to instantly disable trip planning if OpenAI breaks the protocol. |
| `CODEX_TOKEN_ENCRYPTION_KEY` | `openssl rand -hex 32` | Encrypts every user's stored OAuth tokens via pgcrypto. **Don't rotate without a re-encryption migration.** |
| `OAUTH_COOKIE_SIGNING_KEY` | `openssl rand -hex 32` | HMAC-signs the device-code OAuth flow cookie. Rotating logs everyone mid-flow out (recoverable — they just retry Connect). |
| `GOOGLE_PLACES_API_KEY` | GCP → Credentials | Optional — only needed if you re-run `npm run seed:photos`. Not used at runtime. |
| `AMADEUS_CLIENT_ID` / `AMADEUS_CLIENT_SECRET` / `AMADEUS_ENV` | <https://developers.amadeus.com> | Optional. With placeholder values, hydration falls back to seed cost bands; everything still works. Set `AMADEUS_ENV=test`. |

## 3. Clerk: enable Supabase Third-Party Auth

This is Clerk-side, NOT a Vercel env var.

1. Clerk Dashboard → **JWT Templates** → look for the *Supabase* template.
   If absent, follow Clerk's "Connect Supabase" guide. The template's
   default name is `supabase`.
2. Supabase Dashboard → **Authentication → Providers → Third-Party Auth**
   → enable Clerk and paste the JWKS URL Clerk provides.
3. Verify by signing in to Vercel-hosted app and confirming a query like
   `select clerk_user_id from public.trips;` runs as your `sub` claim
   (RLS won't return rows otherwise).

## 4. First deploy

Click **Deploy** in the Vercel UI. The build will:

1. `npm install`
2. `npm run build` (Next 16 with Turbopack) — should finish in ~20-30s.
3. Generate edge + serverless functions; the route table mirrors what
   `npm run build` shows locally.

If the build fails with a TS error you didn't see locally, run
`npx tsc --noEmit` locally and fix before re-pushing.

## 5. Function-timeout sanity

`/trips/[id]` and `/api/auth/codex/poll` already export `maxDuration`
(60s and 30s respectively). Vercel Hobby tier **caps at 60s** so we're
inside the budget. If you want more headroom (or hit the 60s limit on
Codex slow days), upgrade to Pro and bump those values to ≥120.

## 6. Post-deploy smoke test

Visit your production URL and run through:

1. `/` — pastel landing, NP carousel scrolls.
2. `/sign-up` → create account → redirected to `/`.
3. `/plan` — should show the **Connect ChatGPT** gate. Click it; the
   OAuth device-code flow opens auth.openai.com in a new tab.
4. Approve there. Tab closes; `/plan` flips to the wizard.
5. Submit a trip (NYC, fall, scenic+foodie+chill, $1-2k).
6. `/trips/[id]` should show the GeneratingProgress bar; in 6–10s it
   should auto-render the **TradeoffMatrix** + 4 cards + RefinePanel.
   If it hangs at the progress bar past ~15s, the Codex backend may be
   slow — refresh once. If it still hangs after a refresh, check
   Vercel function logs for a timeout / Codex 429 / token expiry.
7. Click `Pass` on rank #3, click `Cheaper`, click `Refine →`. New
   "Round 2" chip should appear in 6–10s.
8. Open `/settings` — the connection status should reflect the linked
   ChatGPT account.

## 7. Things to watch in Vercel logs

- `[codex] rank latency=...ms` — should be 6-12s typical.
- `Codex did not invoke pick_destinations` — model occasionally returns
  a text response instead of a tool call. The retry helper handles it
  on the second attempt; if it shows up frequently, bump
  `REC_REASONING` to `medium`.
- `codex_auth_upsert_cas failed` — concurrent token refreshes raced.
  Compare-and-swap logic should re-read and proceed; if you see a user
  legitimately stuck, manually `delete from public.user_codex_auth
  where clerk_user_id = '<sub>'` and have them reconnect.
- `Failed to revalidate path` — should NOT appear; we don't call
  `revalidatePath` from inside server actions during render. If it
  surfaces, that's a regression.

## 8. Compliance / kill-switch reminders

This integration uses OpenAI's Codex CLI OAuth flow as a backend; the
reference implementations explicitly label it personal-use-only. Going
public is off-script. Defenses-in-place:

- **Kill switch**: set `CODEX_OAUTH_ENABLED=0` in Vercel env vars.
  `/plan` instantly renders the *Temporarily unavailable* banner; no
  user-facing behavior touches the Codex backend until you flip it back.
- **Anthropic fallback**: keep an `ANTHROPIC_API_KEY` ready (uncomment
  in `.env.local.example`) and the `feature/anthropic-fallback` branch
  if it exists. Re-deploying with the key flipped should be ≤1 hour.
- **OpenAI rotation risk**: protocol is reverse-engineered. If OpenAI
  rotates the OAuth client_id, every user gets `CodexNotConnectedError`
  after their next access-token expiry. Surface it via the kill-switch
  banner and post a Disconnect-and-reconnect note.

## 9. Subsequent deploys

Once the project is wired up:
- `git push origin master` triggers a Production deploy.
- Branch pushes get a Preview deploy with its own URL.
- Schema changes: apply migrations to Supabase **before** the deploy
  completes, otherwise the new code may try to write to columns that
  don't exist. (Vercel doesn't run Supabase migrations for you.)

That's it.
