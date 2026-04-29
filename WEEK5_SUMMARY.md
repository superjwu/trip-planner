# Trip Planner — Week 5 build

**Repo:** <https://github.com/superjwu/trip-planner>

I built a trip-planning copilot that turns vague preferences ("scenic,
foodie, not too far") into 4 curated U.S. destinations with a "why" for
the set, a tradeoff matrix across the picks, day-by-day itineraries,
and outbound booking links. Stack is Next.js 16, Tailwind v4, Supabase,
Clerk for app auth — and the LLM call routes through each user's own
ChatGPT subscription via the Codex CLI's OAuth backend, so end users
pay $0 for compute.

I shipped two passes. **v1** got the full proposal scope working:
wizard → one rank call → 4 cards with reasoning + match tags → live
weather / cost estimate / Skyscanner+Booking deep-links → lazy
itinerary on card expand. Once that ran end-to-end I asked Codex
(gpt-5.5) to audit it and worked through a 15-item punch list
(HMAC-signed OAuth cookies, SSE hardening, token-refresh
compare-and-swap, stale compute-lock recovery, etc.).

The real lesson came after I re-read the proposal: the app I'd built
was a one-shot generator, but the proposal describes a *decision
conversation*. So I built **v2**: a `recommendation_rounds` table, a
refine panel where you can Keep/Pass cards or click presets like
"Cheaper" / "Less crowded", and a tradeoff matrix that replaces the
hollow "Why these 4" header with a 4×5 dot grid the LLM scores per
pick. Past rounds stay navigable; the latest is the editable one.

Visually I explored 15 different directions in a `/gallery` route
(built by 10 parallel subagents) before picking the soft-pastel
direction and porting the whole live flow to it.

It's deployed on Vercel and demoable.
