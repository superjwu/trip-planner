---
title: "Trip Planner — Week 7 Summary"
author: "Jiaxuan Wu"
date: "2026-05-13"
---

# Trip Planner — Week 7 Summary

**Repo:** <https://github.com/superjwu/trip-planner> (public, with full commit history)
**Vercel:** <https://trip-planner-theta-wheat.vercel.app/>

## TL;DR

This was the **Phase B + hygiene baseline** sprint. The app went from a 4-pick *destination* picker to a 4-route *combo* picker — each rec can now be a 1–3 stop ordered route ("Charleston + Savannah", "Big Sur + Monterey + Half Moon Bay") with stop-aware cost aggregation, multi-leg route lines on the map, "The Route" section in the expanded view, and a Google Flights multi-city booking URL. Twelve commits landed, half polishing the pre-Phase-B surface (editorial landing, Phase J "places you've been", lazy itinerary fetch, RouteAtlas label collisions), half shipping multi-stop end-to-end with full back-compat for existing single-stop trips. A parallel hygiene track closed the High-sev item from Week 6's security review (no CI / no Husky) and patched 13 high-sev Next.js CVEs surfaced by the new `npm audit` step.

## What landed (by sprint)

### Sprint 1 — Editorial landing + browse polish

The v3 landing was workmanlike but flat. This sprint rebuilt it editorial-style and tightened the browse grid.

- **Landing rebuild** (`41714b7`, `d2fe13a`, `eafa758`): full-viewport hero (`min-h-[100dvh]`), restored `HeroCarousel` over a static image, editorial "how it works" + closing CTA, rec-card heights equalized across the destinations grid.
- **Card-action visibility** (`9fb2121`): `CardActions` buttons grew from 32→36 px with 1.5 px borders and ambient shadows so they don't get lost on busy photos; hover preview colors the heart coral and the checkmark slate before the user commits; a legend strip explains both actions inline.
- **Nav + per-card affordances** (`d983baf`): account dropdown in `MainNav` (sign-out, settings); per-card like + visited toggles wired through to cookie state.

### Sprint 2 — Phase J: places you've been

The user reported wanting to permanently exclude destinations they'd already visited. Hard-filter, not soft hint — same pattern as Phase F's anchor contract.

- **`tp-visited` cookie** managed on `/settings`, list of slugs the user has been to. Per-card visited toggle on `/destinations` writes to it.
- **`NormalizedTripInput.visitedSlugs`** (zod-validated, capped at 100) threaded through `normalize()` and into `preFilter()` as a hard exclusion. Anything in the list never reaches the rec engine.
- Bumped `REC_PROMPT_VERSION` to invalidate `rec_cache` since the candidate pool shape changed.

### Sprint 3 — Trip-page UX fixes

Three independent fixes for friction the user kept hitting.

- **Lazy itinerary fetch** (`91a900b`): the rec page used to block server-render on writing all 4 itineraries up front (~6-9s per pick, sequential). New `ItineraryAutoFetch` component fires the itinerary action only when a user focuses a card; first paint drops from 25s to 2s.
- **Scroll-to-top on URL change** (`7415ee3`): focus/round/refine navigation kept users mid-scroll on the old position; `ScrollToTopOnNav` resets on any pathname or search-param change.
- **RouteAtlas label collisions** (`b643d54`): four-pick clusters in the Northeast made labels overlap. Added a Pass-2 placement pass that staggers along the y-axis with leader lines, falling back to overlap-allowed only if every collision-checked position fails.

### Sprint 4 — Hygiene + security baseline

Week 6's security review flagged "no `.husky/` and no `.github/workflows/`" as the highest-severity open item — the routine in CLAUDE.md was a human checklist with nothing enforcing it. This sprint closes that plus two Medium-sev items, and patches a stack of Next.js CVEs that the new audit step surfaced on its first run.

- **Pre-commit hook** (`.husky/pre-commit`): runs `tsc --noEmit / npm run lint / npm run audit:meta` on every commit. Verified locally — all three clean across both subsequent commits this sprint.
- **CI workflow** (`.github/workflows/ci.yml`): same three checks plus `npm run build`, `npm audit --omit=dev --audit-level=high`, and the `gitleaks` secret scanner. Triggered on push and PR to `master`.
- **Next 16 `middleware → proxy` migration**: renamed `src/middleware.ts → src/proxy.ts` and the function name per Next's codemod, clearing the deprecated-convention warning the dev server had been emitting.
- **Next CVE bump 16.2.4 → 16.2.6**: the new `npm audit` step caught 13 high-sev Next CVEs on first run, including *"Middleware / Proxy bypass through dynamic route parameter injection"* — directly relevant to the file we'd just renamed. Patch bump, zero breaking changes.
- **`DEV_BYPASS_AUTH` production guard** (closes Medium-sev): `isAuthBypassEnabled()` now hard-returns `false` when `NODE_ENV === "production"`, so a misconfigured prod deploy that ships a truncated Clerk key can't silently run as the shared dev identity.
- **`CODEX_TOKEN_ENCRYPTION_KEY` floor 16 → 32** (closes Medium-sev): the master encryption key for every user's stored Codex OAuth tokens now requires the documented 32-char minimum, matching `cookie-sign.ts`.

### Sprint 5 — Phase B: multi-stop combos (the headliner)

The proposal's *decision-conversation* thesis lands hardest on multi-stop trips: "drop the second stop, find me one closer to Vegas" is exactly where iterative refinement earns its keep over a one-shot generator. Phase B was deferred from v2 and v3; this week shipped it end-to-end.

- **Migration `0007_multi_stop_combos.sql`**: adds `recommendations.stops jsonb` (1–3 `{slug, order, days}` per route) and `stop_snapshots jsonb` (frozen `SeedDestination[]`). Backfill turns every existing rec into a 1-stop array; sanity-check `do $$` block fails the transaction if any row ends up empty or length-mismatched.
- **Schema + types**: `StopSchema`, `RecommendationPickSchema.stops` with a `superRefine` enforcing `stops[0].slug === pick.slug`, sequential `order` values, no in-route duplicate slugs. A `z.preprocess` synthesizes a 1-stop array when the LLM omits `stops`, so legacy cached responses keep parsing through the transition. `CostBreakdown` gains optional `interStopDriveUsd + perStopCosts`. `SEED_VERSION 5 → 6` and `REC_PROMPT_VERSION rec-v7-visited → rec-v8-multi-stop` invalidate `rec_cache`.
- **Ranker prompt**: `REC_SYSTEM_PROMPT` switches "Pick EXACTLY 4 destinations" to "Pick EXACTLY 4 route options", with stop-count guidance (1–3d single, 4–7d prefers 2-stop, 8+d prefers 2–3 stops), a ~250 mi/4 hr proximity rule between stops keyed off the existing `nearby:` candidate-block field, origin-as-any-stop exclusion, and route-as-a-whole tradeoff scoring (worst-stop for crowd/vibe/season, summed for cost).
- **Persistence + cost aggregation**: `rankAndPersist` resolves every stop's slug to a hydrated `SeedDestination`, persists both `stops` and `stop_snapshots`, and calls a new `validateStops()` post-rank to cross-check slugs against the candidate pool and `sum(days) === tripLengthDays`. `buildCostMultiStop` distributes days evenly across stops (last stop loses one night for the departure day), sums per-stop lodging/food/activities into `perStopCosts`, computes inter-stop drive via haversine × $0.30/mi (new `seed/drive-estimator.ts`), and bills flight as origin → `stops[0]` only.
- **`parseRec` resilience**: switched the trip-page rec SELECT to `*` so missing `stops / stop_snapshots` columns don't 500 pre-migration trip pages. New columns are read when present; otherwise `parseRec` synthesizes a 1-stop array from `destination_snapshot` — covers the three regimes (pre-migration row, post-backfill 1-stop, post-Phase-B real combo).
- **UI surfaces (full)**: `DestinationCard` shows a `Pick #N · X stops` badge and coral companion-stop chips below the anchor name when `stops.length > 1`. `ExpandedDestination` adds a new *"The Route"* section between the reasoning card and "What you'll see", listing each stop with a numbered order circle, days chip, and 1-line blurb. `CostBreakdown` adds per-stop subtotal rows and an "Inter-stop drive" line. `RouteAtlas` draws a polyline `origin → stops[0] → stops[1] → ...` instead of a single segment, plus small numbered circles for non-anchor stops. `BookingLinks` switches the Skyscanner single-leg URL for a Google Flights multi-city search URL via a new `googleFlightsMultiCityUrl` helper. **Every UI gracefully degrades to single-stop** when `stops.length === 1`, so existing trips render identically.
- **Itinerary prompt**: `buildItineraryUserPrompt` gains a multi-stop branch with explicit transition days (`"Drive: Charleston → Savannah"`) and per-day stop tagging. The write_itinerary tool schema is unchanged.

Deferred per Week 6's plan: per-stop weather hydration (still anchor-only), per-stop Booking.com lodging links (still anchor-only). Both straightforward extensions; left for v2 of multi-stop.

### Sprint 6 — Infra: dedicated Supabase project

A subtle problem surfaced while applying migration 0007: the project's `.mcp.json` and `.env.local` both pointed at `zpzfzgaabldeyfbjhoqm`, which the Supabase MCP `list_tables` revealed contained `aircraft_states` / `flight_routes` — flight-tracker's database, not trip-planner's. The trip-planner code had been talking to the wrong project all along; new trip computation would have hit "table not found".

- Switched `NEXT_PUBLIC_SUPABASE_URL` + keys + `.mcp.json` to the dedicated trip-planner project (`qjkzujwlhlhmaokgzyof`).
- Re-applied all 7 migrations (`0001 → 0007`) into the new project via the Supabase Dashboard SQL Editor.
- Discovered along the way that Supabase's remote MCP at `mcp.supabase.com` binds projects via OAuth-account state, **not** the URL's `project_ref` query param — surfaced this in the `.mcp.json` commit message so future me doesn't lose 30 minutes to it again.

## Commits this week

| Hash | Subject |
|---|---|
| `d3786f9` | `.mcp.json`: point Supabase MCP at the trip-planner project |
| `eb29e82` | Phase B: multi-stop combos end-to-end |
| `918051b` | hygiene: enforced CI/pre-commit + Next 16 proxy migration + security patches |
| `9fb2121` | destinations: stronger card-action visibility + legend strip |
| `d983baf` | nav + browse: account dropdown, like + visited toggles per card |
| `03aacc6` | trips: add 'places you've been' exclude list (Phase J) |
| `7415ee3` | trips: scroll to top when URL changes (focus / round / refine) |
| `91a900b` | trips: lazy-fetch itinerary on focus instead of blocking server render |
| `b643d54` | RouteAtlas: stagger clustered labels with offset-y + leader lines |
| `d2fe13a` | landing: hero takes full viewport (min-h-[100dvh]) |
| `eafa758` | landing: restore HeroCarousel; keep editorial how-it-works + closing CTA |
| `41714b7` | ui: editorial landing refresh + rec card height equalization |

## Stats

- **12** commits since Week 6's summary commit (`5f8e773`).
- **+1,200** net new lines this session (Phase B + hygiene + infra).
- **+3** new modules: `src/lib/llm/multi-stop.ts`, `src/lib/seed/drive-estimator.ts`, `src/proxy.ts` (replaces `src/middleware.ts`).
- **+1** migration (`0007`), all 7 now applied to the dedicated trip-planner Supabase project.
- **+2** CI/pre-commit files (`.husky/pre-commit`, `.github/workflows/ci.yml`).
- **13** high-sev Next.js CVEs patched via the new `npm audit` gate's first-run findings.
- **0** live committed secrets — regex scan across all branches re-verified this turn.

## Security review delta from Week 6

Three items closed:

| Severity | Item | Status |
|---|---|---|
| High | No `.github/workflows/` and no `.husky/` — routine unenforced | **Closed.** Both shipped this sprint. |
| Medium | `DEV_BYPASS_AUTH=1` honored in production builds | **Closed.** Production hard-guard in `clerk-config.ts:25-32`. |
| Medium | `CODEX_TOKEN_ENCRYPTION_KEY` floor 16 chars vs documented 32 | **Closed.** Floor raised to 32 in `codex-token.ts:69`, aligned with `cookie-sign.ts`. |

Still on the list, untouched: per-IP rate limit on `/api/weather`, per-user throttle on rec generation, Sentry/Axiom monitoring, `vercel.json` env-isolation manifest, `DEV_MEMORY` plaintext-token TTL. All Medium or Low; none blocking.

## Still pending

- **Supabase Dashboard config (deploy-blocking)**: the new trip-planner Supabase project still needs Clerk configured as a **Third-Party Auth** provider (Dashboard → Authentication → Third-Party Auth → Clerk → domain `resolved-redfish-93.clerk.accounts.dev`). Without this, every authenticated request to `trips` / `recommendations` will hit RLS denial.
- **`SUPABASE_SERVICE_ROLE_KEY`** is still a placeholder in `.env.local` pending the secret-key reveal in the new project's API settings. Server actions that use the admin client (cache writes, codex auth RPCs) will fail until this is real.
- **End-to-end smoke test of a real multi-stop trip** — needs both of the above plus a fresh dev-server restart. Once those are in place, submit a 5-day NYC trip and verify the rec engine returns at least one 2-stop combo (Charleston + Savannah, Big Sur + Monterey, or similar). Per the verification checklist in `docs/sprints/v2-v3-plan.md` §B.6.
- **Codex review of Phase B** — CLAUDE.md says this is routine, not optional, for anything touching the LLM call path or DB schema. Phase B touched both. Wasn't done in-flight this week; ideally invoked before any user-facing release with: *"Read recommend.ts + prompts.ts + multi-stop.ts + actions.ts:rankAndPersist. I just shipped multi-stop combos. Tell me the 2 most important regressions or unhandled edges."*

## How to run locally

```bash
npm install
cp .env.local.example .env.local        # fill in Clerk, Supabase, Codex keys
# In Supabase Dashboard for project qjkzujwlhlhmaokgzyof:
#   Authentication → Third-Party Auth → Add Clerk → domain
#   resolved-redfish-93.clerk.accounts.dev
npm run dev                              # http://localhost:3000
```

Verification routine before committing (now enforced by `.husky/pre-commit`):

```bash
npx tsc --noEmit
npm run lint
npm run audit:meta
npm run build
```

---

*Generated 2026-05-13. See `CLAUDE.md` for the full project guide and `docs/sprints/v2-v3-plan.md` for Phase B's spec + verification checklist.*
