# Trip Planner Gallery Handoff

Date: 2026-04-29

## Current state

- Latest implementation commit: `552d5c4 gallery: 15 UI direction explorations`
- Working tree was clean after that commit.
- A follow-up documentation commit should include this handoff file.

## What was built

Added a mock design gallery at `/gallery` with 15 visual directions for the same trip-planning data set.

Core shared files:

- `src/app/gallery/page.tsx` - gallery index linking all variants.
- `src/app/gallery/_mock.ts` - shared trip and destination mock data.
- `src/app/gallery/_helpers.ts` - shared formatting helpers.

Variant routes:

- `/gallery/v1-editorial`
- `/gallery/v2-brutalist`
- `/gallery/v3-pastel`
- `/gallery/v4-map`
- `/gallery/v5-polaroid`
- `/gallery/v6-y2k`
- `/gallery/v7-swiss`
- `/gallery/v8-premium`
- `/gallery/v9-terminal`
- `/gallery/v10-boarding`
- `/gallery/v11-booking`
- `/gallery/v12-tripadvisor`
- `/gallery/v13-atlas-obscura`
- `/gallery/v14-hopper`
- `/gallery/v15-apple-guides`

## v10-v15 details

- `v10-boarding`: boarding-pass/ticket-stub layout with route fields, fare breakdown, weather, barcodes, and a fold-out itinerary card.
- `v11-booking`: dense Booking-style results page with a yellow search strip, left filters, rating chips, price summary, and utility-first destination cards.
- `v12-tripadvisor`: review-led discovery page with rating bubbles, traveler summary cards, attraction snippets, and social-proof framing.
- `v13-atlas-obscura`: editorial discovery/field-notes layout with sepia imagery, compass motif, curiosity index, and atlas-like metadata.
- `v14-hopper`: mobile-first deal-watch UI with price prediction cards, color-coded fare calendar, and large rounded controls.
- `v15-apple-guides`: map-native guide sheet with translucent panels, saved-place rows, map pins, and Apple Maps-style guide framing.

Two subagents helped polish the later variants:

- Worker 1 owned `v11-booking` and `v12-tripadvisor`, tightening TypeScript inference, responsive image/card sizing, JSX escaping, accessibility on rating bubbles, and explicit button types.
- Worker 2 owned `v13-atlas-obscura`, `v14-hopper`, and `v15-apple-guides`, tightening mobile layouts, explicit Tailwind alpha classes, calendar tuple typing, and button types.

## Online UI references used

The later variants were informed by current travel-planning/product UI patterns from:

- Wanderlog: itinerary builder, day/category map layers, route optimization, reservations, collaboration, budgeting.
- Roadtrippers: route-first road-trip planning, map waypoints, AI/autopilot recommendations, draggable/customizable routes.
- Booking.com: dense search results, filters, top-pick sorting, review scores, deals, price/policy summaries.
- Tripadvisor: rating/review-led discovery, Things to Do, Travelers' Choice framing, save/share planning patterns.
- Hopper: price prediction, deal confidence, color-coded price calendars, price-watch interaction model.
- Apple Maps Guides: curated guides, saved places, shareable guides, translucent map sheets, place rows.

Useful reference URLs:

- `https://app.wanderlog.com/plan-a-trip`
- `https://app.wanderlog.com/travel-maps`
- `https://roadtrippers.com/`
- `https://www.booking.com/content/how_we_work.html`
- `https://www.tripadvisor.com/`
- `https://media.hopper.com/articles/why-we-do-what-we-do-at-hopper`
- `https://www.apple.com/maps/`
- `https://support.apple.com/guide/iphone/explore-new-places-with-guides-iph4c213d62d/ios`

## Verification

Commands run:

- `npm run lint`
  - Result: passed with 0 errors.
  - Remaining warnings are existing gallery mock `<img>` warnings from `@next/next/no-img-element`.
- `npx tsc --noEmit --pretty false`
  - Result: passed.
- `npm run build`
  - First run inside sandbox failed due Turbopack needing to bind a local port.
  - Re-run outside sandbox passed.

Build output included static pages for `/gallery` and all `/gallery/v1-*` through `/gallery/v15-*` routes.

## Preview server note

The initial preview URL on port `3000` was not reachable because Next had a stale dev-server lock pointing at dead PID `24671` and port `3030`.

Fix applied:

- Removed generated stale lock file: `.next/dev/lock`
- Started fresh dev server on port `3031`:
  - `npm run dev -- --hostname 0.0.0.0 --port 3031`

Verified from the same execution context:

- `curl -I http://127.0.0.1:3031/gallery`
- Result: `HTTP/1.1 200 OK`

Use this preview URL:

- `http://localhost:3031/gallery`

If the browser cannot reach it from the host UI, restart the dev server in the host-visible terminal with:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3031
```

## Notes for next work

- The gallery is mock-only and intentionally not wired to real trip data.
- The variants use normal `<img>` tags to stay consistent with the existing mock gallery files; converting to `next/image` would remove warnings but requires remote image config or loaders.
- The root layout was simplified away from `next/font/google` and fallback font stacks were moved into `src/app/globals.css`; this avoids font/network friction in the gallery exploration context.
- Existing middleware warning remains: Next says the `middleware` convention is deprecated in favor of `proxy`.
