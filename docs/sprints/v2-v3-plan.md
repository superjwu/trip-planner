# Trip Planner — v2 Sprint: Multi-Stop + Suggestion Refit + Browse Grid + i18n

## Context

v1 ships a single-destination, four-pick rec engine in coastal-slate language. User feedback for v2 (locked):

1. **Picks should be multi-stop combos** for trips ≥4 days — single anchor today undersells the proposal's "decision conversation" promise.
2. **Suggestion engine has 3 concrete gaps** (codex-confirmed): shallow reasoning, arbitrary tradeoff scores, weak refine-round impact (the kept/avoided slug filter actually never reaches `rankAndPersist` — real bug).
3. **No browse-by-destination flow** — user wants a grid of all 40 destinations as a discovery alternative to the wizard, modeled on `superjwu/tourist-plan v25-immersive` (Ken Burns hero, chip filters, rich cards) but in our coastal-slate language.
4. **No i18n** — needs zh/en toggle. UI strings only for v2; LLM content stays English (translate-on-demand defers to v3).

Codex review (gpt-5.5, xhigh) consulted on the highest-risk decisions: schema for multi-stop, tradeoff coherence approach, refine bug location. Codex flagged additional architectural watch-outs (e.g. `maxOutputTokens` is silently ignored by the Codex backend — already in CLAUDE.md but easy to forget).

---

## Phase A — Suggestion Engine Refit (foundation)

Ships first because Phase B's combo ranker should already use these improvements.

### A.1 — Compute tradeoffs in code, not LLM
**File:** new `src/lib/llm/tradeoffs.ts`
- New helper `computeTradeoffs(input: NormalizedTripInput, destination: SeedDestination): Tradeoffs` returning the same `{flight, budget, crowd, vibeFit, seasonFit}` shape (1-3 scale).
- Algorithm: `flight` = bucket by `flightCostFromOrigin[input.originCode]`; `budget` = bucket by `(estimateTripCostUsd / input.budgetCeilingUsd)` — ratio < 0.7 → 3, < 0.95 → 2, else 1; `vibeFit` = count of `input.vibes` overlapping `destination.tags` mapped to 1-3; `seasonFit` = `input.seasonHint ∈ destination.bestSeasons` → 3, adjacent season → 2, else 1; `crowd` = default 2 (3 for parks in shoulder season, 1 for tagged "popular" + summer).
- Reuse `estimateTripCostUsd` from `src/lib/llm/recommend.ts:55`.

**File:** `src/lib/llm/recommend.ts`
- After ranking, replace `rec.tradeoffs` with `computeTradeoffs(input, destination)` for every pick before persisting. The LLM's tradeoff field becomes advisory only (or removed from the schema in A.4).

### A.2 — Fix the refine-round candidate-pool bug
**File:** `src/app/trips/[id]/actions.ts:461` (`createRefineRound`)
- Currently builds `candidatesAfterAvoid` then calls `rankAndPersist(...)` which re-runs `preFilter` from scratch — the avoided list is **discarded**. Confirmed by codex.
- Refactor: change `rankAndPersist`'s signature to optionally accept `candidatePoolOverride: SeedDestination[]`. When `createRefineRound` calls it, pass the filtered list directly.
- New unit-style sanity check: assert that for a refine round with `avoidedSlugs=['charleston-sc']`, no rec has `destination_slug === 'charleston-sc'`.

### A.3 — Preset chips → code-side filters & boosts
**File:** `src/app/trips/[id]/actions.ts` (`createRefineRound`), `src/components/recs/RefinePanel.tsx`
- Each preset (`cheaper`, `less-crowded`, `shorter-flight`, `more-food`, `more-nature`, `drop-passed`) maps to a deterministic transform on the candidate pool BEFORE the LLM call:
  - `cheaper`: filter to candidates whose `estimateTripCostUsd ≤ 0.85 * round1.medianCost`
  - `shorter-flight`: filter to `flightCostFromOrigin ≤ round1.medianFlight`
  - `more-food`: boost candidates with `tags.includes('foodie')` to top of candidates list
  - `more-nature`: boost `tags.includes('nature') || slug.endsWith('-np')`
  - `less-crowded`: filter to `tags.includes('chill')` OR small-town categories OR shoulder-season-only matches
  - `drop-passed`: union with `avoidedSlugs` from RefinePanel
- Pass filtered/boosted candidates to `rankAndPersist` per A.2.

### A.4 — Enrich candidate context + structured output
**File:** `src/lib/llm/prompts.ts:43` (`buildCandidatesBlock`)
- Add per-candidate fields: full `attractions[].description` (top 3, joined), `lat`, `lng`, computed `flightCostFromOrigin[input.originCode]`, computed `estimatedTotalUsd`, computed `headroomVsBudget`, season-fit boolean, `nearby:` precomputed list of 3 closest other candidates by haversine (used in Phase B for combos).

**File:** `src/lib/schemas.ts:16` (`RecommendationPickSchema`)
- Add fields: `season_signal: string` (one-sentence why-this-season), `vibe_signal: string` (which vibes match concretely), `cost_signal: string` (where the budget headroom is spent), `tradeoff_note: string` (single-sentence narrative tying the 3 signals together).
- The free-text `reasoning` field becomes auto-composed from these structured signals at render time (UI helper, not LLM-emitted).
- Drop or de-prioritize `tradeoffs` in the LLM output since A.1 computes them in code.

### A.5 — Diversity post-rank validator
**File:** new helper in `src/lib/llm/recommend.ts`
- After ranking, check: `≤ 2 picks share the same region`, `≤ 2 picks share the same primary tag`, `at most 2 picks within 200mi of each other` (proximity from lat/lng).
- If diversity check fails, log a warning and re-rank with an instruction to diversify (one retry max). For combos, the proximity rule is INVERTED — within a combo, stops should be close.

---

## Phase B — Multi-Stop Combos

### B.1 — Schema migration
**File:** new `supabase/migrations/0007_multi_stop_combos.sql`
```sql
alter table public.recommendations
  add column stops jsonb not null default '[]'::jsonb,
  add column stop_snapshots jsonb;

-- Backfill: existing rows get a single-stop array
update public.recommendations
set stops = jsonb_build_array(
  jsonb_build_object('slug', destination_slug, 'order', 1, 'days', null)
),
stop_snapshots = jsonb_build_array(destination_snapshot)
where stops = '[]'::jsonb;
```
- Apply via Supabase MCP `apply_migration` (per CLAUDE.md).
- Bump `SEED_VERSION` and `REC_PROMPT_VERSION` in `src/lib/types.ts` so `rec_cache` invalidates.

### B.2 — Schema & validation
**File:** `src/lib/schemas.ts:16` and `:241`
- Add `StopSchema = z.object({ slug, order, days: z.number().nullable() })`.
- `RecommendationPickSchema` gains `stops: z.array(StopSchema).min(1).max(3)`.
- The strict tool schema mirrors this.

**File:** `src/lib/llm/recommend.ts:235`
- Validate every stop's slug exists in candidates; enforce `stops.length` between 1-3; enforce `sum(days) === tripLengthDays`.
- Top-level `slug` (kept for compat) must equal `stops[0].slug`.

### B.3 — Ranker prompt
**File:** `src/lib/llm/prompts.ts:8`
- Replace "Pick EXACTLY 4 destinations" → "Pick EXACTLY 4 route options. Each route is 1–3 ordered stops."
- Add stop-count guidance:
  - 1-3 days → single stop
  - 4-7 days → mostly 2-stop combos
  - 8+ days → 2-3 stops
- Add proximity rule: "Stops within a route should be within ~250 miles or a 4-hour drive of each other. Use the `nearby:` list for each candidate."
- Output JSON shape: `{ rank, stops: [{slug, order, days}], season_signal, vibe_signal, cost_signal, tradeoff_note, match_tags }`.

### B.4 — Persistence + render
**File:** `src/app/trips/[id]/actions.ts` (`rankAndPersist`)
- Persist `stops` array and `stop_snapshots` (frozen `SeedDestination[]` ordered same as stops).
- Aggregate cost across stops (sum each stop's prorated lodging + food + activities + one set of flight costs origin → first stop, plus inter-stop drive estimate).
- Fetch `hydration` (weather, cost) per anchor; v2.1 will hydrate per stop.

**File:** `src/app/trips/[id]/page.tsx` (`parseRec`)
- Read `stops` and `stop_snapshots`, expose as `rec.stops: ParsedStop[]` to children.

### B.5 — UI surfaces
**File:** `src/components/recs/DestinationCard.tsx`
- Anchor stop is the hero photo + name (current).
- Below name, render companion-stop chips: `+ Savannah · 2 days` etc., terracotta-bordered pills.
- "Pick #N · 5 days · 2 stops" badge replaces the simpler rank chip.

**File:** `src/components/recs/ExpandedDestination.tsx`
- New section "The Route" listing each stop with: stop number, name, days allocated, region, 1-line reasoning (from a per-stop short blurb in the prompt's stop schema OR composed from the stop's tags + the combo's `tradeoff_note`).
- Itinerary section already handles per-day; the new combo itinerary prompt (B.6) tags each day with its stop.

**File:** `src/components/recs/RouteAtlas.tsx`
- Multi-leg route lines: origin → stop[0] → stop[1] → ... rather than separate origin → each.
- Per-stop circles with the stop number inside (1, 2, 3).

**File:** `src/components/trip/CostBreakdown.tsx`
- Per-stop cost rows when stops > 1, plus an inter-stop transit row.

**File:** `src/components/trip/BookingLinks.tsx`
- For multi-stop, generate one Skyscanner link with multi-city flights (or a Google Flights "MIA → CHS · CHS → SAV · SAV → MIA" multi-segment URL). Booking.com link per stop.

### B.6 — Itinerary prompt for combos
**File:** `src/lib/llm/itinerary.ts`
- Receive stops + day allocation. Generate `tripLengthDays` total days, with each day tagged `stop: slug`. Transition days (driving between stops) are explicit.

---

## Phase C — Destinations Browse Grid

Independent of A/B; can run in parallel via subagent.

### C.1 — New route `/destinations`
**File:** new `src/app/destinations/page.tsx` (server component)
- Server-renders all 40 destinations from `src/lib/seed/destinations.ts`.
- Hero: smaller version of the v25-immersive moves — Ken Burns of a featured photo (rotated weekly via `Math.floor(Date.now() / 7d) % len`), italic display headline, coral CTA "Plan a trip with this destination."
- Filter chips (URL-param backed, server-rendered): `tag`, `region`, `season`, `costMax`. Each chip toggles a query param.
- Sort dropdown: `name | rating | distance from NYC`.
- Grid of destination cards (uses real photos from `_photos.json` manifest).
- Click a card → `/plan?anchor={slug}` to start a trip with that anchor pre-filled.

### C.2 — Card design
**File:** new `src/components/destinations/DestinationBrowseCard.tsx`
- 3:2 photo with category badge (top-left in slate-tint pill: "Park" / "City" / "Town"), favorite heart (bottom-right, toggles a cookie for v2 — no user-account persistence).
- Name in DM Sans medium, region in italic Manrope.
- Info chips row: best season, est. cost band, vibe tags.
- Hover lift + slate-primary border.

### C.3 — Plan flow integration
**File:** `src/components/plan/PreferenceWizard.tsx`
- Accept optional `?anchor={slug}` query param. When present, render a small "Planning with **Acadia** as anchor" pill at the top of the form, and pre-select `tags` matching that destination's tags.
- Server action `startTrip` accepts `anchorSlug` and threads it into `NormalizedTripInput.anchorSlug` (new optional field). Ranker biases candidate pool to include the anchor + nearby destinations.

### C.4 — Navigation
**File:** `src/components/nav/MainNav.tsx`
- Add "Browse destinations" link between "Plan" and "Trips".

---

## Phase D — zh/en i18n

Independent of A/B/C; subagent dispatch.

### D.1 — Library + setup
- Install `next-intl` (canonical Next.js App Router i18n).
- Cookie-based locale (not route-based) — simpler for v2, doesn't break existing URLs. Cookie name `tp-locale`, values `en` | `zh`.

**Files (new):**
- `src/i18n/request.ts` — server config that reads cookie and loads messages
- `src/i18n/messages/en.json`
- `src/i18n/messages/zh.json`

**File:** `src/app/layout.tsx`
- Wrap `<MaybeClerkProvider>` in `<NextIntlClientProvider>`.

### D.2 — Translation namespaces
Cover (English first, then translated to Mandarin):
- `nav`: nav links, brand wordmark, sign-in/out
- `plan`: wizard labels, vibe names, pace options, budget bands, CTAs
- `trip`: round labels, "Why these 4", refine presets, booking labels
- `dest`: browse-grid filters, sort options, card chips
- `common`: shared CTAs, errors, empty states

LLM-generated content (`reasoning`, `season_signal`, `vibe_signal`, `cost_signal`, blurbs) stays English in v2. v3 gets `?lang=zh` thread-through to the LLM prompt or a translate-on-demand step.

### D.3 — Locale switcher
**File:** `src/components/nav/MainNav.tsx`
- Small `EN | 中` toggle in the top-right of the nav, before the Sign-in button. Click sets the cookie + `router.refresh()`.

### D.4 — Surface coverage
- Replace hardcoded English strings in: `MainNav`, `PreferenceWizard`, `DateRangePicker`, `ConnectChatGPTGate`, `CompareHeader`, `DestinationCard`, `ExpandedDestination`, `RefinePanel`, `RoundSwitcher`, `BookingLinks`, `CostBreakdown`, `GeneratingProgress`, plus the destination browse pages from Phase C.

---

## Codex review checkpoints

Per CLAUDE.md routine:
- **After Phase A:** `mcp__codex__codex` review of `recommend.ts`, `prompts.ts`, `tradeoffs.ts`, `actions.ts:createRefineRound`. Ask for 2 most important regressions / unhandled edges.
- **After Phase B:** review of `0007_multi_stop_combos.sql`, schema changes, `parseRec`, the ranker prompt, the combo-itinerary prompt. Specifically ask "do existing trips still render after migration without the page throwing on `stops`?"
- **After Phase D:** review of i18n setup. Ask "what fails if the user hard-refreshes between locales / what fails if the cookie is missing?"

---

## Build order

1. **Phase A** (~3 hr, main thread) — foundation. Codex review at end.
2. **Phase B** (~5 hr, main thread) — schema + ranker rewrite + UI multi-stop. Codex review at end.
3. **Phase C** (~2 hr, dispatched sonnet subagent) — runs in parallel with end of Phase B. Browse grid + card + plan-anchor integration.
4. **Phase D** (~2 hr, dispatched sonnet subagent) — runs in parallel with C. i18n setup + translation files + switcher.
5. **Final integration** (~1 hr, main thread) — wire C's anchor into B's combo ranker; verify D's switcher doesn't break C's filter URL params; full smoke test.
6. **Final codex review** — full diff review, 5 most important issues to fix before merge.

Total estimated: **~13 hours** wall-clock; subagent parallelism saves ~2hr.

---

## Critical files

**New:**
- `src/lib/llm/tradeoffs.ts` — code-side tradeoff computation
- `supabase/migrations/0007_multi_stop_combos.sql`
- `src/app/destinations/page.tsx` — browse grid
- `src/components/destinations/DestinationBrowseCard.tsx`
- `src/i18n/request.ts`, `src/i18n/messages/en.json`, `src/i18n/messages/zh.json`

**Modify (Phase A):**
- `src/lib/llm/recommend.ts` — diversity validator, tradeoff replacement, candidate pool override
- `src/lib/llm/prompts.ts` — enriched candidates block, structured output fields
- `src/lib/schemas.ts` — RecommendationPickSchema additions
- `src/app/trips/[id]/actions.ts` — refine bug fix, preset filters/boosts

**Modify (Phase B):**
- All A files plus:
- `src/lib/types.ts` — bump versions, add Stop type
- `src/components/recs/DestinationCard.tsx`, `ExpandedDestination.tsx`, `RouteAtlas.tsx`, `CompareHeader.tsx`
- `src/components/trip/CostBreakdown.tsx`, `BookingLinks.tsx`
- `src/lib/llm/itinerary.ts` — combo prompt
- `src/app/trips/[id]/page.tsx` — `parseRec` for stops

**Modify (Phase C):**
- `src/components/plan/PreferenceWizard.tsx` — accept anchor query param
- `src/components/nav/MainNav.tsx` — add browse link

**Modify (Phase D):**
- `src/app/layout.tsx` — wrap provider
- All UI surfaces with hardcoded English strings

**Reuse without changes:**
- `scripts/_photos.json` — Wikipedia photo manifest (Phase C uses it directly)
- `src/lib/seed/destinations.ts` — 40-destination data, lat/lng, tags
- `src/components/recs/RouteAtlas.tsx` — already supports multi-pick rendering, just needs combo extension in B.5
- Auth, OAuth, RLS — untouched

---

## Verification

After each phase, run:
1. `npx tsc --noEmit` — clean
2. `npm run lint` — 0 errors
3. `npm run build` — clean, all routes generate

End-to-end:
1. Open `/destinations` — see grid of 40, filter by `tag=foodie&season=fall`, sort by name. Click a card → `/plan?anchor={slug}`.
2. Submit `/plan` for 5-day NYC trip, scenic+foodie+chill. Land on `/trips/[id]`.
3. Verify `/trips/[id]` renders 4 picks, **at least 2 of which are 2-stop combos** with day allocation visible. RouteAtlas shows multi-leg routes for combos.
4. Tradeoff matrix dot scores are coherent (cheap places get 3 dots on budget; near-NYC picks get 3 dots on flight).
5. Reasoning text reads concretely (not "matches your scenic+foodie preferences").
6. Click "Cheaper" preset + "Refine" — round 2 picks have **measurably lower estimated total cost** than round 1.
7. Toggle the `EN | 中` switch in nav — UI strings flip to Mandarin while LLM-generated reasoning stays English.
8. Existing trips (created before migration 0007) still render without errors — `parseRec` synthesizes a 1-stop array from `destination_snapshot`.
9. SQL: `select stops from recommendations where round_id = '<id>' limit 4;` — every row has a non-empty `stops` array.

---

## Risks + watch-outs

- **Refine prompt cache key must extend** to include `feedback_presets` and `kept_slugs` / `avoided_slugs` (already does per `0006_recommendation_rounds.sql` design). Verify Phase A.3's preset-filter logic doesn't accidentally produce identical pools across rounds.
- **`maxOutputTokens` is silently ignored** by Codex backend (codex flagged again). Don't tune quality with this knob.
- **Migration 0007 must not run while a trip is computing** — Supabase MCP `apply_migration` doesn't lock; do this off-peak.
- **`destination_snapshot` JSONB stays as anchor snapshot** for backward-compat per codex recommendation. Don't repurpose it as the combo-snapshot.
- **i18n cookie SSR**: cookie reads happen in `middleware.ts` (or via Next 16 `cookies()` in server component). Make sure the locale is resolved BEFORE the page renders, not after, or the user gets a flicker.
- **Browse grid filters must be URL-param-backed** (not React state) so links are shareable and SEO-indexable. Server component re-renders on query change.
- **Out of scope for v2 (defer to v3):**
  - Per-stop hydration (weather/cost API per stop) — v2 hydrates anchor only
  - LLM content translation
  - Per-user favorites in DB (browse grid uses cookie only)
  - Multi-city flight pricing accuracy (Skyscanner deep-link is best-effort)
  - Trip sharing / public links

---

# Trip Planner — v3 Sprint: Browse Filters Refit + Natural-Beauty Surfacing + Targeted Growth

## Context

v2 shipped the browse grid with 326 destinations and chip filters (`cat / tag / season`), but the user reported the filter system feels "boring and not that useful" — and that natural beauty isn't surfaced. The wizard input dimensions (vibes + budget + pace) are working well and stay locked. All v3 changes are scoped to the **browse experience and destination dataset**; the rec engine sees richer per-candidate metadata but the user-facing wizard inputs are unchanged.

Codex (gpt-5.5, xhigh) reviewed the locked direction and flagged three risks now baked into the plan:
1. A single `landscape` field will exclude obvious matches (Mackinac is island AND lake; Tahoe is lake AND mountain). Mitigation: add `secondaryLandscapes?: Landscape[]` and treat filter match as `primary OR any-secondary`.
2. Curated overrides + algorithmic inference will drift unless materialized through one enrichment module with assertions. Mitigation: single `enrich-destinations.ts` builder + `audit:meta` script that fails on missing/invalid fields.
3. Adding `sceneryScore: 5` directly to the candidate block will bias the LLM toward scenic places even when the user wants city/foodie. Mitigation: phrase scenery as descriptive evidence in the prompt + add a system-prompt rule that scenery is a tiebreaker, not a primary axis, unless user vibes include `scenic`/`nature`/`adventure`.

User-locked direction (decided via interview):
- **Browse filters**: replace `cat` / `tag` chip rows with `landscape` (single primary + secondary array) + `experiences` (multi-value).
- **Natural beauty**: 1–5 `sceneryScore` + `scenicSignals[]` curated per destination.
- **Growth**: targeted hand-curated +100 destinations to reach ~425.
- **Wizard input**: untouched.

---

## Phase E.1 — Schema additions

**File:** `src/lib/types.ts`
- Add type aliases:
  - `Landscape = 'mountain' | 'coast' | 'desert' | 'forest' | 'lake' | 'canyon' | 'island' | 'city'`
  - `Experience = 'hiking' | 'foodie' | 'museums' | 'scenic-drives' | 'beaches' | 'hot-springs' | 'wildlife'`
  - `ScenicSignal = 'iconic-vista' | 'wildlife' | 'geological-feature' | 'water-feature' | 'dark-sky' | 'fall-color' | 'wildflower-bloom' | 'coastal-cliffs' | 'alpine' | 'redwood'`
- Extend `SeedDestination`:
  - `landscape: Landscape` (required, primary terrain — drives display icon)
  - `secondaryLandscapes?: Landscape[]` (optional — used by filter logic, NOT shown as primary icon; codex fix #1)
  - `experiences: Experience[]` (required, ≥1)
  - `sceneryScore: 1 | 2 | 3 | 4 | 5` (required)
  - `scenicSignals?: ScenicSignal[]` (optional)
- Bump `SEED_VERSION` 4 → 5 (invalidates `rec_cache` rows).
- Bump `REC_PROMPT_VERSION` (codex fix #3 — candidate block shape changes).

## Phase E.2 — Enrichment module (overrides + inference)

**New file:** `src/lib/seed/destinations-meta.ts`
- Exports `META_OVERRIDES: Record<string, Partial<{ landscape, secondaryLandscapes, experiences, sceneryScore, scenicSignals }>>`.
- Hand-curate ~80 marquee slugs explicitly (Big Sur=5, Yosemite=5, Yellowstone=5, Charleston=3, NYC=2, Las Vegas=2, etc.).
- Group by category for readability (parks, cities, coast, mountain towns, deserts).

**New file:** `src/lib/seed/enrich-destinations.ts`
- Exports `ENRICHED_DESTINATIONS: SeedDestination[]` — the only thing the rest of the app should import going forward.
- `enrichOne(d, override?) → SeedDestination`: applies override first, then deterministic inference for missing fields:
  - `landscape`: from existing `tags` + region/state + `name` patterns (e.g. `name.includes('Lake')` → `lake`; `state === 'HI'` → `island`; `tags.includes('city')` → `city`; fall back to most common region landscape).
  - `experiences`: derive from `tags` (foodie tag → 'foodie' experience), attraction descriptions (regex for "hiking trails", "scenic drive", "museum", "hot spring"), and slug patterns (`-np` → 'hiking', 'wildlife').
  - `sceneryScore`: baseline by category (NPs → 4, scenic byways → 5, cities → 2, state parks → 3, towns → 3) + bumps for tagged 'scenic' (+1) capped at 5.
  - `scenicSignals`: derive from existing tags + name (e.g. `'redwood'` if name contains "redwood"; `'coastal-cliffs'` if landscape='coast' AND scenicSignals not set; etc.)
- Reuse this module in `src/app/destinations/page.tsx` AND `src/lib/llm/recommend.ts:preFilter` so browse + recs see identical enriched data (codex fix #2).

**New file:** `scripts/_audit-enrichment.ts` (read-only)
- Asserts: every slug has valid `landscape`, `experiences.length >= 1`, `sceneryScore ∈ [1,5]`, no duplicate names across hand-curated + extras + curated-extras (codex flagged `yellowstone` vs `yellowstone-np` collision in the existing seed — surface and resolve).
- Run as `npm run audit:meta` (added to package.json scripts).
- Fails CI-style with non-zero exit + slug list on any violation.

## Phase E.3 — +100 curated destinations

**New file:** `src/lib/seed/destinations-curated-extras.ts`
- 100 hand-written entries fully populated (no inference fallback).
- Coverage:
  - **Lake towns** (~12): Lake George NY, Mackinac Island MI, Lake Placid NY, Door County WI, Lake Geneva WI, Lake Chelan WA, Lake of the Ozarks MO, Finger Lakes NY, Lake Coeur d'Alene ID, Lake Powell area, Lake Champlain VT, Flathead Lake MT.
  - **Beach/coastal** (~15): Sanibel FL, St. Augustine FL, Hilton Head SC, Ogunquit ME, Newport RI, Rehoboth Beach DE, Tybee Island GA, 30A FL, La Jolla CA, Half Moon Bay CA, Santa Cruz CA, Cannon Beach OR, Long Beach Island NJ, Hampton Beach NH, Pacific Grove CA.
  - **Islands** (~8): Block Island RI, Catalina CA, San Juan Islands WA, Whidbey WA, Bainbridge WA, Kiawah SC, Madeline Island WI, Shelter Island NY.
  - **Scenic byways** (~8): Highway 1 (CA), Blue Ridge Parkway (NC/VA), Going-to-the-Sun Rd (MT), Pacific Coast Highway (OR), Million Dollar Highway (CO), Beartooth Highway (MT/WY), Skyline Drive (VA), Natchez Trace (MS/TN).
  - **Missing major cities** (~12): Pittsburgh PA, Memphis TN, Detroit MI, Milwaukee WI, Indianapolis IN, Cincinnati OH, Cleveland OH, Minneapolis MN, Madison WI, Louisville KY, Buffalo NY, Richmond VA.
  - **Mountain towns** (~10): Park City UT, Telluride CO, Stowe VT, Mt Hood OR, Lake Tahoe area expansions (north/south), Steamboat Springs CO, Vail CO, Whitefish MT, Killington VT, Big Sky MT.
  - **Desert + canyon** (~6): White Sands NM, Mesa Verde area CO, Canyon de Chelly AZ, Petrified Forest AZ, Painted Desert AZ, Capitol Reef-area UT.
  - **Hot springs / wellness** (~5): Hot Springs AR, Glenwood Springs CO, Pagosa Springs CO, Calistoga CA, Saratoga Springs NY.
  - **Other gaps** (~24): Asbury Park NJ, Galveston TX, Galena IL, Stowe-Smugglers Notch VT, Mt. Washington NH, Acadia outliers (Schoodic), Olympic Peninsula towns, Door County offshoots, etc.
- Each entry has all required `SeedDestination` fields + new `landscape/experiences/sceneryScore/scenicSignals`.
- Merged into `DESTINATIONS` export in `src/lib/seed/destinations.ts`.

## Phase E.4 — Browse page UI

**File:** `src/app/destinations/page.tsx`
- Filter logic for landscape: `dest.landscape === filter || dest.secondaryLandscapes?.includes(filter)` (codex fix #1).
- Replace `cat` chip row → `landscape` chip row (8 chips with emoji icons: 🏔 Mountain, 🌊 Coast, 🏜 Desert, 🌲 Forest, 🏞 Lake, ⛰ Canyon, 🏝 Island, 🏙 City). URL param `landscape=`.
- Replace `tag` chip row → `experiences` chip row (7 chips: Hiking, Foodie, Museums, Scenic Drives, Beaches, Hot Springs, Wildlife). URL param `exp=` (comma-separated, multi-select).
- Add scenery filter chip: `★ 3+` / `★ 4+` / `★ 5` (URL param `minScenery=`).
- Sort dropdown adds `Most scenic` (orders by `sceneryScore` desc, ties broken by name).
- Hero featured rotation: same weekly logic but only choose from `sceneryScore >= 4` so the splash photo is always strong.
- All filters URL-param-backed (already a v2 invariant per CLAUDE.md).

**File:** `src/components/destinations/DestinationBrowseCard.tsx`
- Replace category badge top-left with **landscape icon + label** (🌊 Coast, etc.) — driven by `dest.landscape` (primary only, not secondary, to keep card visually clean).
- Add scenery indicator: small `★ N` next to the rating chip bottom-right (or replace the deterministic rating with `sceneryScore` since deterministic-rating is fake).
- Update `TAG_TONE` map for the new experience values.

## Phase E.5 — Rec engine integration (codex's anchoring fix)

**File:** `src/lib/llm/prompts.ts:50` (`buildCandidatesBlock`)
- Per candidate, append a new line:
  - `landscape: ${landscape}${secondaryLandscapes ? ` (also ${secondaryLandscapes.join('/')})` : ''}`
  - `experiences: ${experiences.join(', ')}`
  - `scenic profile: ${scenicSignals?.join(', ') || '(none specified)'}` — phrased descriptively, NOT as a numeric score (codex fix #3).
- Do NOT include the raw `sceneryScore: N` integer in the candidate block.

**File:** `src/lib/llm/prompts.ts:3` (`REC_SYSTEM_PROMPT`)
- Add new hard rule:
  > **Scenery as tiebreaker, not primary axis.** A destination's scenic profile is descriptive metadata. Use it to break ties between similarly-fitting candidates, OR when the user's vibes include `scenic`, `nature`, or `adventure`. For users prioritizing `city`, `foodie`, `cultural`, or `nightlife`, do NOT downweight a candidate just because its scenic profile is sparse.

**File:** `src/lib/llm/tradeoffs.ts`
- No change. Scenery does not become a tradeoff axis (would over-reward scenic for city-focused users).

## Phase E.6 — Verification

1. `npm run audit:meta` — clean (every slug enriched, no duplicates).
2. `npx tsc --noEmit` — clean.
3. `npm run lint` — 0 errors.
4. `npm run build` — clean, all routes generate.
5. **Browse — landscape secondary match**: `/destinations?landscape=lake` includes Lake Tahoe (primary mountain, secondary lake) and Mackinac (primary island, secondary lake). Confirms codex fix #1.
6. **Browse — scenery sort**: top 8 results of `?sort=scenery` are obvious 5★ places (Big Sur, Yosemite, Yellowstone, Glacier, Sedona, Zion, Olympic, Acadia or similar).
7. **Browse — filter combo**: `?landscape=desert&exp=hiking,scenic-drives&minScenery=4` returns Joshua Tree, Death Valley, Sedona, Grand Canyon area, etc.
8. **Rec engine — anchoring check**: submit a "city + foodie + nightlife" 4-day trip from NYC. Verify recs include cities (NYC excluded as origin) — Charleston, New Orleans, Nashville, etc. — NOT skewed toward 5★ scenic places. Confirms codex fix #3.
9. **Rec engine — scenic vibe**: submit "scenic + nature + adventure" trip. Verify all 4 picks have `sceneryScore >= 4`.
10. **Existing trips render**: Trips created before SEED_VERSION 5 still render — `parseRec` reads from `destination_snapshot` JSONB, not live DESTINATIONS, so existing rows aren't affected.

## Codex review checkpoints

- **After Phase E.2** (schema + enrichment): codex reviews `enrich-destinations.ts` + the audit script. Ask "what's the worst-case inference miss for the 246 auto-imported destinations?".
- **After Phase E.5** (rec engine touch): codex reviews `prompts.ts` diff. Ask "does the new scenery-as-tiebreaker rule actually constrain the model, or is it cosmetic?".
- **End of sprint**: full diff review — 5 most important issues to fix before merge.

## Critical files

**New:**
- `src/lib/seed/destinations-meta.ts` — curated overrides
- `src/lib/seed/enrich-destinations.ts` — single materialized enrichment module
- `src/lib/seed/destinations-curated-extras.ts` — +100 hand-curated
- `scripts/_audit-enrichment.ts` — invariants check

**Modify:**
- `src/lib/types.ts` — Landscape/Experience/ScenicSignal types, SeedDestination extension, SEED_VERSION + REC_PROMPT_VERSION bumps
- `src/lib/seed/destinations.ts` — merge curated-extras, re-export ENRICHED_DESTINATIONS
- `src/app/destinations/page.tsx` — filter rows + scenery filter + sort option
- `src/components/destinations/DestinationBrowseCard.tsx` — landscape icon + scenery badge
- `src/lib/llm/prompts.ts` — candidate block adds landscape/experiences/scenic profile, system prompt adds scenery-tiebreaker rule
- `package.json` — add `audit:meta` script

**Untouched (per user lock):**
- `src/components/plan/PreferenceWizard.tsx` — wizard inputs
- `NormalizedTripInput`, `Vibe`, all rec input shapes
- `src/lib/llm/tradeoffs.ts` — scenery is NOT a tradeoff axis
- `src/lib/llm/recommend.ts:rankAndPersist` — only via the prompt change
- Auth, OAuth, RLS

## Risks + watch-outs

- **LLM anchoring on sceneryScore (codex fix #3)** — mitigated by descriptive phrasing in candidate block + system-prompt rule. Verification step #8 is the test that confirms the mitigation works.
- **Inference vs override drift (codex fix #2)** — mitigated by single `enrich-destinations.ts` + `audit:meta` script that runs before any commit.
- **Mackinac/Tahoe edge cases (codex fix #1)** — mitigated by `secondaryLandscapes` + filter union logic.
- **Duplicate slug collision** — codex flagged `yellowstone` (extras) vs `yellowstone-np` (hand-curated). The audit script must catch and surface; resolution = drop the auto-imported duplicate or rename.
- **Cache key drift** — bump both `SEED_VERSION` and `REC_PROMPT_VERSION`.
- **No DB migration needed** — all changes are TS-only; the rec engine reads `DESTINATIONS` from TS at server-boot, not from `supabase/seed/destinations.sql`. (Optional follow-up: regenerate the SQL file via `npm run seed:sql` for parity, but it's not on the critical path.)
- **Existing trips are safe** — `destination_snapshot` JSONB in the `recommendations` table is a frozen copy from creation time, so v2 trips render unchanged after v3 ships.

## Build order (~6 hours)

1. **E.1** (~30 min) — type extensions + version bumps.
2. **E.2** (~2 hr) — meta overrides for ~80 marquee slugs + inference function + audit script. Codex review at end.
3. **E.3** (~2 hr, parallelizable subagent) — write 100 curated extras with all fields populated.
4. **E.4** (~1 hr) — browse page filter UI + card icon/scenery badge.
5. **E.5** (~30 min) — prompt changes + scenery tiebreaker rule. Codex review at end.
6. **E.6** (~30 min) — full verification suite.

Phases E.1, E.2, and E.3 can land before E.4–E.6 even start (E.4 needs the new fields populated).
