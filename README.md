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
- **Clerk** auth + **Supabase** (Third-Party Auth — Clerk session token →
  `accessToken` callback on the Supabase client; RLS on `auth.jwt()->>'sub'`)
- **Anthropic SDK** (Claude Sonnet 4.6) for ranking + itinerary
- **Open-Meteo** (weather, no API key needed)
- **Google Places** (one-time photo prefetch into seed)
- **Amadeus Self-Service** test env (best-effort flight/hotel quotes; falls
  back to seed cost bands when the test env returns nothing useful)
- Booking deep-links to Skyscanner, Google Flights, and Booking.com

## Local development

```bash
cp .env.local.example .env.local
# fill in real keys (see env vars below)
npm install
npm run dev
```

Open <http://localhost:3000>. The home page (`/`), wizard (`/plan`), and
static layout demo (`/trips/demo`) work without any external services
configured.

To exercise the full flow (sign in → submit prefs → see real LLM picks)
you need `NEXT_PUBLIC_CLERK_*`, `*_SUPABASE_*`, and `ANTHROPIC_API_KEY`.

### Required env vars

| Variable | Purpose | Required to test |
|----------|---------|------------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | Auth | Sign in/up |
| `NEXT_PUBLIC_SUPABASE_URL` + `_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | DB | Saving trips |
| `ANTHROPIC_API_KEY` | Claude ranking + itinerary | Real recommendations |
| `GOOGLE_PLACES_API_KEY` | One-time photo prefetch | `npm run seed:photos` |
| `AMADEUS_CLIENT_ID` + `_SECRET` (+ `AMADEUS_ENV=test`) | Live flight/hotel quotes | Otherwise we use cost bands |

Without real Clerk keys, auth pages render a friendly stub and middleware
no-ops so the rest of the app remains explorable.

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
