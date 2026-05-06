---
title: "Trip Planner — Week 6 Summary"
author: "Jiaxuan Wu"
date: "2026-05-05"
---

# Trip Planner — Week 6 Summary

**Repo:** <https://github.com/superjwu/trip-planner> (public, with full commit history)
**Vercel:** <https://trip-planner-theta-wheat.vercel.app/>

## TL;DR

This was the v2 → v3 → Phase F → G → H sprint. The app went from "1-shot 4-pick generator over 40 destinations" to a real **decision-conversation tool** over **326 enriched destinations** with browse-by-destination, anchor pinning, deterministic flight pricing, and a refine-round flow that no longer gets stuck after round 2. Two LLM flows now run on `gpt-5.5`. Codex (gpt-5.5, xhigh) reviewed every non-trivial change and caught three blocking bugs that shipped fixes inline.

## What landed (by sprint)

### Sprint v2 — refine rounds + visual rebuild
The proposal's core promise was iteration, not generation. v1 was a 1-shot generator; v2 turned it into a multi-round decision conversation.

- `recommendation_rounds` table + `active_round_id` on trips (migration `0006`).
- `RefinePanel` (per-pick keep/pass + preset deltas + free text) and `RoundSwitcher` chips for navigating past rounds read-only.
- Tradeoff matrix scored deterministically in code (`src/lib/llm/tradeoffs.ts`), not by the LLM.
- Pre-filter is the hard guarantee, prompt is soft — `avoidedSlugs` honored before rank.
- Live UI migrated to **v54d Coastal Slate** (paper, ink, accent #E76F51, slate-primary #2C5474).
- Codex P1/P2/P3 audit: signed OAuth cookie (`OAUTH_COOKIE_SIGNING_KEY`), token-refresh CAS to fix the rotation race, stale-lock recovery on `trips.computing_started_at`, lodging-night math fix, cache-key edge cases.

### Sprint v3 — browse grid, i18n, scenery
User feedback: filters felt "boring," nature beauty wasn't surfaced, 40 destinations was thin.

- **Destinations grew 40 → 326**, photos prefetched from Wikipedia REST/Commons (`scripts/_photos.json`, 318/326 covered).
- **Browse grid at `/destinations`** — landscape chips (8: 🏔🌊🏜🌲🏞⛰🏝🏙) + experience multi-select + scenery filter (★3+/4+/5) + Most Scenic sort.
- **Three-tier Chinese translation** (Wikipedia langlinks → Wikidata → suffix translator) via `npm run seed:zh`. zh/en flips via cookie-based `next-intl` (`tp-locale`).
- **Single-source enrichment** (`src/lib/seed/enrich-destinations.ts`) merges curated overrides + deterministic inference + 3-pass dedup. `ENRICHED_DESTINATIONS` is the only export anything outside `src/lib/seed/` should touch.
- `npm run audit:meta` invariants check — fails on missing landscape / experiences / sceneryScore / duplicate slugs.
- Codex review caught: `secondaryLandscapes` needed for Tahoe (mountain primary, lake secondary) and Mackinac (island primary, lake secondary); scenery as descriptive text in the prompt, **never** a numeric score (would re-anchor city/foodie users on scenic places).

### Sprint Phase F — anchor contract fix
Codex flagged a shipped trust break: `/destinations` cards link to `/plan?anchor=…` and the wizard renders a "Planning around Big Sur" pill, but the anchor never reached the rec engine. Net effect: user clicked Big Sur, page told them they're planning around Big Sur, recs returned 4 unrelated places.

- Anchor threaded end-to-end: `RawTripInput.anchorSlug` (zod validated, regex + DESTINATIONS membership) → `NormalizedTripInput` → cache key.
- `preFilter()` gives the anchor + its 3 nearest neighbors (≤350 mi) immunity from soft filters (season / budget / vibe-overlap).
- System prompt: anchor MUST appear at rank 1 or 2.
- Post-rank assertion + 1 retry + last-resort force-include at rank 1 with deterministic reasoning template (logged as `meta.anchorForced`).
- Refine rounds restore the anchor if presets like "cheaper" would have dropped it (unless user explicitly avoided).
- Codex F.4 review caught 3 blockers, all fixed inline:
  1. `NormalizedTripInputSchema` was stripping `anchorSlug` on every DB read.
  2. `applyRefinePresets` ran AFTER preFilter and could drop expensive/distant anchors.
  3. Post-rank check only verified anchor presence, not rank ≤ 2.

### Sprint Phase G — kill Amadeus, precompute prices
Amadeus Self-Service had placeholder credentials and the user only needed direct-flight pricing.

- `src/lib/seed/flight-estimator.ts` — piecewise-linear curve keyed on (origin city, destination lat/lng), rounded to nearest $10. NYC/CHI/LAX/SFO/SEA airports hardcoded.
- `src/lib/apis/amadeus.ts` deleted; `src/lib/hydrate.ts` simplified (no live calls except weather).
- Card UI permanently shows "(estimate)" — no "(live)" path remains.

### Sprint Phase H — refine UX
User-reported: "after round 2, there's no choice (round 3) for me to keep trying."

- Root cause: a user who'd clicked into `?focus=N` or a historical `?round=N` chip would land back in that view after refining and never see the RefinePanel.
- `RefinePanel.submit()` now does `router.replace('/trips/${tripId}')` BEFORE `router.refresh()` to strip stale query params.
- Historical-round banner upgraded to a coral CTA with a "Back to current round →" button.

### `gpt-5.5` switch
Both LLM flows moved to `gpt-5.5`:
- Recommendation engine: `medium` reasoning.
- Itinerary writer: `low` reasoning.

`REC_PROMPT_VERSION` and `ITIN_PROMPT_VERSION` bumped to invalidate `rec_cache`.

## Commits this week

| Hash | Subject |
|---|---|
| `d3082ba` | Phase G + H: deterministic flight pricing + refine UX fix |
| `4d6c011` | amadeus: filter to direct (nonStop) flights only |
| `a0f47c0` | config: switch both LLM flows to gpt-5.5, bump reasoning effort |
| `62d726d` | Phase F: anchor contract — `/destinations` → `/plan?anchor=…` actually pins the destination |
| `0908a17` | docs(claude.md): align with v2 + v3 reality |
| `084f465` | v2 + v3: browse grid, i18n, multi-stop deferred, landscape filters, scenery scoring |
| `2918f02` | gallery: add 10 Figma-palette variants v16–v25 |
| `b6e6a40` | deploy: Vercel prep — maxDuration for slow routes + DEPLOYMENT.md |
| `076e806` | ux: progress bar + auto-poll while computing, real NP hero photos |
| `6017931` | v2 Track A+B: TradeoffMatrix, RefinePanel, RoundSwitcher (UI) |
| `13f244f` | v2 Track A+B: refine rounds + tradeoff scoring (server-side) |
| `a5284c3` | v2 Track C: migrate live flow to v3-pastel visual language |
| `1497018` | v2 Track D: enrich rank candidates + bump reasoning none→low |
| `5687fcf` | P2: correctness — token-refresh CAS, stale lock recovery, cache-key edges |
| `72404e4` | P1: security — sign OAuth cookie, harden SSE, drop debug route |
| `e838da8` | P1.2: SSE assembler — track terminal events, surface failures |
| `b22a074` | preFilter: budget gate now checks total trip cost, not just flight |
| `a403498` | wizard: replace dual date inputs with two-month range calendar |
| `e345101` | expand seed: 26 → 40 destinations, bump SEED_VERSION |

(Plus ~12 smaller commits for gallery variants, photo prefetch wiring, and CLAUDE.md updates.)

## Stats

- **326** destinations enriched (landscape, experiences, scenery score 1–5, scenic signals).
- **318/326** Wikipedia photos cached locally; 8 fall back to Picsum.
- **326/326** Chinese names + blurbs (3-tier translation pipeline).
- **2** LLM flows on `gpt-5.5` (rec engine medium, itinerary low).
- **6** Supabase migrations applied (`0001` init → `0006` recommendation rounds).
- **0** live committed secrets — verified via `git log --all -p` regex scan today.

## Security review

Wrote a layered security audit covering secrets, RLS, AI inputs, env separation, CI/pre-commit gates, monitoring, and supply chain.

- **Critical: 0** — the SECURITY DEFINER + service-role + pgp_sym_encrypt + signed-cookie design holds up.
- **High: 1** — no `.github/workflows/` and no `.husky/`, so the CLAUDE.md "always do this" routine is a human checklist with nothing enforcing it.
- **Medium: 6**, **Low: 7** — full report in `SECURITY_REVIEW.txt` at the repo root.

## Still pending

- **Phase B — multi-stop combos** (planned, deferred). Schema + ranker prompt + UI sketched in `docs/sprints/v2-v3-plan.md`. Biggest remaining feature.
- **Codex MCP review of v40-v51** (gallery variants).
- **8 photo gaps** still on Picsum fallback.
- **CI workflow + Husky pre-commit** (the "high" item from the security review).

## How to run locally

```bash
npm install
cp .env.local.example .env.local       # fill in Clerk, Supabase, Codex keys
npm run dev                             # http://localhost:3000
```

Verification routine before committing:

```bash
npx tsc --noEmit
npm run lint
npm run audit:meta
npm run build
```

---

*Generated 2026-05-05. See `CLAUDE.md` for the full project guide and `docs/sprints/v2-v3-plan.md` for sprint plans + codex review notes.*
