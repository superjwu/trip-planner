# Trip Planning Copilot

A web app that turns vague trip preferences into four curated destination
recommendations with one-paragraph reasoning each, day-by-day itinerary,
rough cost estimates, weather forecast, and outbound booking links.

UI language adapted from
[`superjwu/tourist-plan`](https://github.com/superjwu/tourist-plan)
(`v25-immersive`): dark editorial palette, glass cards, mesh background,
Merriweather + Inter + Cormorant Garamond typography, Ken Burns hero.

See `PROJECT_PROPOSAL.md` for the product spec and
`/root/.claude/plans/start-building-trip-planner-delegated-comet.md`
for the build plan.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with theme tokens ported from v25-immersive
- **Clerk** for app sign-in, **Supabase** (Third-Party Auth) for storage
- **OpenAI Codex backend via per-user OAuth** for ranking + itinerary —
  every end-user connects their own ChatGPT Plus/Pro account, and trip
  generation uses GPT-5.x routed through their subscription. No shared
  Anthropic / OpenAI API key on the server.
- **Open-Meteo** (weather, no API key needed)
- **Google Places** (one-time photo prefetch into seed)
- **Amadeus Self-Service** test env (best-effort flight/hotel quotes; falls
  back to seed cost bands when the test env returns nothing useful)
- Booking deep-links to Skyscanner, Google Flights, and Booking.com

## Important compliance note

The "Connect ChatGPT" feature uses the same OAuth client and Codex backend
that OpenAI's official Codex CLI uses. The reference implementations
(`numman-ali/opencode-openai-codex-auth`, `tumf/opencode-openai-device-auth`)
are local CLI tools intended for personal use. Running this pattern as a
multi-tenant hosted service is **not what those projects are for**. The
integration is provided here for personal demo use, depends on OpenAI
keeping the protocol available, and inherits each user's own ChatGPT
account rate limits. `CODEX_OAUTH_ENABLED=0` is the kill-switch.

## Local development

```bash
cp .env.local.example .env.local
# fill in real keys (see env vars below)
npm install
npm run dev
```

Open <http://localhost:3000>. The home page (`/`), static layout demo
(`/trips/demo`), and sign-in pages work without external services
configured. Planning a trip requires Clerk + Supabase + a Codex token
(via the in-app Connect ChatGPT flow).

### Required env vars

| Variable | Purpose | Required for |
|----------|---------|--------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | App identity | Sign in / up |
| `NEXT_PUBLIC_SUPABASE_URL` + `_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | DB | Saving trips |
| `CODEX_OAUTH_ENABLED` | Kill-switch (set to `1` to enable) | The Connect-ChatGPT flow |
| `CODEX_TOKEN_ENCRYPTION_KEY` | 32+ char random — pgp_sym_encrypt master key | Storing OAuth tokens |
| `GOOGLE_PLACES_API_KEY` | One-time photo prefetch | `npm run seed:photos` |
| `AMADEUS_CLIENT_ID` + `_SECRET` (+ `AMADEUS_ENV=test`) | Live flight/hotel quotes | Otherwise cost bands are used |

Without real Clerk keys, auth pages render a friendly stub and middleware
no-ops so the rest of the app remains explorable. Without
`CODEX_OAUTH_ENABLED=1`, `/plan` shows the disabled banner.

Each end user must enable **device-code login** on their ChatGPT account
(<https://chatgpt.com/settings/security>) before they can connect — this is
an OpenAI account setting, not something the app can flip for them.

### How "Connect ChatGPT" works

1. User clicks **Connect ChatGPT** in the wizard.
2. Server hits `https://auth.openai.com/api/accounts/deviceauth/usercode` and
   gets back a one-time user code.
3. Server stores `device_auth_id` in a 15-minute HTTP-only cookie; client
   shows the user code + opens `https://auth.openai.com/codex/device` in a
   new tab.
4. User signs in to ChatGPT and types the user code on OpenAI's page.
5. Client polls `/api/auth/codex/poll` every 5s; once OpenAI confirms, server
   exchanges the device-auth response for access/refresh tokens, decodes the
   `chatgpt_account_id` from the JWT, encrypts both tokens with
   `pgp_sym_encrypt(CODEX_TOKEN_ENCRYPTION_KEY)`, and persists to
   `user_codex_auth`.
6. Trip generation calls `https://chatgpt.com/backend-api/codex/responses`
   with `Authorization: Bearer <access>` and the user's
   `chatgpt-account-id` header. Tokens auto-refresh 60s before expiry.

### Database setup

```bash
# 1. Create a Supabase project and run the migration
supabase db push   # or paste supabase/migrations/0001_init.sql into the SQL editor

# 2. (Re)generate seed SQL from the typed seed
npm run seed:sql

# 3. Apply seed
psql "$SUPABASE_DB_URL" -f supabase/seed/destinations.sql
```

Configure Clerk as a Supabase Third-Party Auth provider following
<https://supabase.com/docs/guides/auth/third-party/clerk>.

### Seeding hero photos (optional)

`scripts/prefetch-place-photos.ts` uses Google Places (New) to find and cache
a hero photo URL per destination into `scripts/_photos.json`. Run with
`GOOGLE_PLACES_API_KEY=... npm run seed:photos`. Until you do, hero images
fall back to deterministic Lorem Picsum URLs.

## Build phases

| Phase | Status | Notes |
|-------|--------|-------|
| 0 — Project init | ✅ | Next.js scaffold, design tokens, font loaders |
| 1 — Schema + Clerk/Supabase auth | ✅ | RLS via `auth.jwt()->>'sub'` |
| 2 — Seed (25 dests) + static demo UI | ✅ | `/trips/demo` previews layout |
| 3 — Preference wizard + persistence | ✅ | `/plan` → server action |
| 4 — One-call recommender | ✅ | Pre-filter + Claude rank, zod-validated, retry once |
| 5 — Live hydration | ✅ | Open-Meteo + best-effort Amadeus |
| 6 — Lazy itinerary on expand | ✅ | `?focus=N` triggers per-destination LLM call |
| 7 — Saved trips + listing | ✅ | `/trips` page; save toggles `user_status` |
| 8 — Landing polish + smoke | ✅ | Ken Burns hero, "How it works", Playwright smoke |

## Routes

- `/` — landing with rotating hero + "how it works"
- `/plan` — preference wizard
- `/trips` — saved + draft trips
- `/trips/[id]` — 4 cards; `?focus=N` opens expanded view with itinerary
- `/trips/demo` — static layout preview, no auth needed
- `/sign-in`, `/sign-up` — Clerk-managed
- `/api/weather` — Open-Meteo proxy

## Source layout

```
src/
├── app/                        # Next.js routes
│   ├── plan/                   # Wizard
│   ├── trips/[id]/             # Detail + actions
│   ├── trips/demo/             # Static preview
│   └── api/weather/            # Open-Meteo proxy
├── components/
│   ├── hero/HeroCarousel.tsx
│   ├── nav/MainNav.tsx
│   ├── plan/PreferenceWizard.tsx
│   ├── recs/{CompareHeader,DestinationCard,ExpandedDestination}.tsx
│   ├── trip/{CostBreakdown,BookingLinks,SaveTripButton}.tsx
│   └── providers/MaybeClerkProvider.tsx
└── lib/
    ├── llm/{prompts,recommend,itinerary}.ts
    ├── apis/{weather,amadeus,booking-links,places}.ts
    ├── seed/{destinations,airports}.ts
    ├── supabase/{server,client}.ts
    ├── auth.ts, clerk-config.ts, hydrate.ts, normalize.ts,
    └── photo.ts, schemas.ts, types.ts
```
