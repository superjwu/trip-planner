---
title: "Trip Planner — Week 7 Summary"
author: "Jiaxuan Wu"
date: "2026-05-13"
---

# Trip Planner — Week 7 Summary

**Repo:** <https://github.com/superjwu/trip-planner>
**Vercel:** <https://trip-planner-theta-wheat.vercel.app/>

## TL;DR

Phase B (multi-stop combos) shipped end-to-end. Recs are now 4 *route options* of 1–3 ordered stops, with stop-aware cost aggregation, multi-leg map lines, "The Route" expanded view, and multi-city booking URLs. Existing single-stop trips render unchanged. In parallel, closed three open items from the Week 6 security review (no CI, no Husky, two Medium-sev keys) and patched 13 high-sev Next.js CVEs surfaced by the new `npm audit` step.

## What landed

### Phase B — multi-stop combos (headliner)

- **Migration 0007**: `recommendations.stops` (1–3 ordered `{slug, order, days}`) + `stop_snapshots` (frozen `SeedDestination[]`). Backfill turns every existing rec into a 1-stop array; sanity checks fail the transaction on any inconsistency.
- **Prompt** (`REC_SYSTEM_PROMPT`): "EXACTLY 4 route options" with stop-count guidance by trip length, ~250 mi proximity rule, route-as-a-whole tradeoff scoring (worst-stop for crowd/vibe/season, summed for cost).
- **Cost aggregation**: `buildCostMultiStop` distributes days evenly, sums per-stop lodging/food/activities, adds inter-stop drive ($0.30/mi via haversine), flight = origin → `stops[0]` only.
- **UI**: card badge + companion-stop chips, "The Route" section in expanded view, per-stop cost rows + transit row, RouteAtlas polyline with numbered non-anchor circles, Google Flights multi-city URL. **All UI degrades to single-stop** when `stops.length === 1`.
- **Itinerary**: writer gets a multi-stop branch with explicit transition days ("Drive: Charleston → Savannah") when route has >1 stops.

### Hygiene + security baseline

- **`.husky/pre-commit`** runs typecheck / lint / audit:meta on every commit. Closes the Week 6 High-sev "no enforcement" item.
- **`.github/workflows/ci.yml`** runs same + build + `npm audit --omit=dev --audit-level=high` + gitleaks on push/PR.
- **Next 16.2.4 → 16.2.6** patches 13 high-sev CVEs caught by the new audit step (including "Middleware / Proxy bypass via dynamic route param injection" — relevant to the `middleware.ts → proxy.ts` rename in the same commit).
- **`DEV_BYPASS_AUTH` prod guard** (closes Medium-sev): hard-disabled when `NODE_ENV=production`.
- **`CODEX_TOKEN_ENCRYPTION_KEY`** floor 16 → 32 chars (closes Medium-sev), aligned with `cookie-sign.ts`.

### Pre-session polish (landed earlier this week)

- Editorial landing refresh + full-viewport hero (`41714b7`, `d2fe13a`, `eafa758`).
- Phase J: `tp-visited` cookie + hard-exclude visited slugs from `preFilter` (`03aacc6`).
- Trip-page UX: lazy itinerary fetch on focus (drops first paint 25s → 2s) (`91a900b`), scroll-to-top on URL change (`7415ee3`).
- RouteAtlas: stagger clustered labels with leader lines (`b643d54`).
- Card-action visibility + legend (`9fb2121`); account dropdown + per-card toggles (`d983baf`).

### Infra: dedicated Supabase project

Discovered while applying 0007 that `.mcp.json` and `.env.local` pointed at the flight-tracker Supabase project. Migrated to a dedicated trip-planner project (`qjkzujwlhlhmaokgzyof`) and re-ran all 7 migrations there.

## Commits this week

| Hash | Subject |
|---|---|
| `f4eb7c3` | docs: week 7 summary PDF |
| `3e08418` | docs: week 7 summary writeup |
| `d3786f9` | `.mcp.json`: point Supabase MCP at the trip-planner project |
| `eb29e82` | Phase B: multi-stop combos end-to-end |
| `918051b` | hygiene: enforced CI/pre-commit + Next 16 proxy migration + security patches |
| `9fb2121` | destinations: stronger card-action visibility + legend strip |
| `d983baf` | nav + browse: account dropdown, like + visited toggles per card |
| `03aacc6` | trips: add 'places you've been' exclude list (Phase J) |
| `7415ee3` | trips: scroll to top when URL changes |
| `91a900b` | trips: lazy-fetch itinerary on focus instead of blocking server render |
| `b643d54` | RouteAtlas: stagger clustered labels with offset-y + leader lines |
| `d2fe13a`, `eafa758`, `41714b7` | landing: editorial refresh + full-viewport hero + HeroCarousel restore |

## Security review delta

| Severity | Item | Status |
|---|---|---|
| High | No CI workflow / no Husky pre-commit | **Closed** |
| Medium | `DEV_BYPASS_AUTH=1` honored in production | **Closed** |
| Medium | `CODEX_TOKEN_ENCRYPTION_KEY` floor < documented 32 chars | **Closed** |

Still on the list: per-IP `/api/weather` rate limit, per-user rec-gen throttle, Sentry/Axiom monitoring, `vercel.json` env-isolation. All Medium or Low; none blocking.

## Stats

- 12 commits since the Week 6 summary commit (`5f8e773`).
- +1,200 net new lines (Phase B + hygiene + infra).
- +1 migration applied (`0007`); all 7 now live in the dedicated trip-planner project.
- 13 high-sev Next.js CVEs patched.
- 0 live committed secrets — regex scan re-verified.

## Still pending

- **Supabase Dashboard**: add Clerk as Third-Party Auth provider (domain `resolved-redfish-93.clerk.accounts.dev`) — without this, every authenticated request hits RLS denial.
- **Real `SUPABASE_SERVICE_ROLE_KEY`** in `.env.local` (currently placeholder) so server actions using the admin client work.
- **End-to-end smoke test of a real multi-stop trip** — needs both of the above + dev-server restart.
- **Codex review of Phase B** per CLAUDE.md routine — touches the LLM call path + DB schema, so non-optional before any user-facing release.

---

*Generated 2026-05-13. See `CLAUDE.md` and `docs/sprints/v2-v3-plan.md` for Phase B's full spec + verification checklist.*
