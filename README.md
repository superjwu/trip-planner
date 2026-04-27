# Trip Planning Copilot

A web app that turns vague trip preferences into 3–4 curated destination
recommendations with explanations, itinerary previews, rough cost estimates,
and outbound booking links.

UI language adapted from
[`superjwu/tourist-plan`](https://github.com/superjwu/tourist-plan)
(`v25-immersive`): dark editorial palette, glass cards, mesh background,
Merriweather + Inter + Cormorant Garamond typography.

See `PROJECT_PROPOSAL.md` for the full spec and
`/root/.claude/plans/start-building-trip-planner-delegated-comet.md`
for the build plan.

## Stack

- Next.js 16 (App Router), TypeScript
- Tailwind CSS v4
- Clerk (auth) + Supabase (DB) via Third-Party Auth
- Anthropic SDK (Claude Sonnet) for ranking + itinerary generation
- Open-Meteo (weather, no key)
- Google Places (one-time photo prefetch into seed)
- Amadeus Self-Service test env (best-effort, falls back to estimated cost bands)

## Local development

```bash
cp .env.local.example .env.local
# fill in real keys
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build phases

| Phase | Status |
|-------|--------|
| 0 — Project init | done |
| 1 — Schema + Auth | pending |
| 2 — Seed data + static results UI | pending |
| 3 — Preference wizard + persistence | pending |
| 4 — One-call recommender | pending |
| 5 — Live hydration | pending |
| 6 — Lazy itinerary | pending |
| 7 — Saved trips + bucket panel | pending |
| 8 — Landing polish + smoke | pending |
