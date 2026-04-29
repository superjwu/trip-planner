# Trip Planner — guidance for Claude

This file is loaded automatically when Claude Code works in this repo.
Keep it short and load-bearing — anything aspirational belongs in the README.

## What this is

A Next.js 16 web app that turns vague trip preferences into a *decision
conversation*: 4 curated U.S. destinations with reasoning, a tradeoff
matrix, and round-by-round refinement. Spec is in `PROJECT_PROPOSAL.md`.
The current sprint plan is at
`/root/.claude/plans/start-building-trip-planner-delegated-comet.md`.

The proposal's core promise is iteration, not generation. v1 was a
one-shot generator; v2 introduced `recommendation_rounds` so the user can
say "drop #3, find me alternates cheaper". When designing or reviewing
changes, ask: **does this strengthen the decision conversation, or just
add features around the side?**

## Always do this before reporting a task complete

This is the routine. Skipping it is the most common way work has broken
in this project.

1. **`npx tsc --noEmit`** — must be empty.
2. **`npm run lint`** — 0 errors. (Existing `<img>` warnings in
   `src/app/gallery/v*` are intentional; don't touch them.)
3. **`npm run build`** — must finish; the route table at the end is the
   ground truth of what the app exposes.
4. **Visual check via Playwright MCP** when a UI surface is touched.
   Don't trust that a TS-clean change *looks* right.
5. **Codex review** for anything non-trivial — see "Code review with
   Codex" below.
6. **Confirm the dev server reflects the change.** Tailwind v4 + Next
   Turbopack sometimes serve stale CSS after a tokens edit; if a style
   change doesn't render, kill `next dev`, `rm -rf .next/cache`, restart.

If a step fails, fix the underlying cause; don't suppress / `--no-verify`
/ delete tests to make it pass.

## Code review with Codex (routine, not optional)

`mcp__codex__codex` is a separate model with no context from this
session. Its second opinion has caught real bugs at multiple checkpoints
(token-refresh race, sparse candidate block, broken cache key). **Treat
it as part of the workflow, not a luxury.**

When to invoke it:

- Before finalizing any plan that touches the LLM call path, the rec
  schema, the OAuth flow, or the trips/recommendations DB schema.
- After a sprint of changes, before committing — point Codex at the
  diff and ask for the 2-3 most important issues, not a comprehensive
  list.
- When you've made a non-obvious tradeoff (e.g. cache-key shape,
  reasoning effort, ranking prompt) and want a sanity check.

Settings (durable preference):

```
mcp__codex__codex(
  model: "gpt-5.5",
  config: { model_reasoning_effort: "xhigh" },
  sandbox: "read-only",
  approval-policy: "never",
  cwd: "/root/claude/trip_planner",
  prompt: "<concrete question + the file paths or diff to look at>",
)
```

Good prompts:

- "Read `src/lib/llm/recommend.ts` and `src/app/trips/[id]/actions.ts`.
  I just added round-based recs. Tell me the 2 most important things I
  got wrong or left undone. Be specific, file:line."
- "I changed the rec prompt to also send tradeoff scores. Diff: <paste>.
  What's the smallest experiment that would catch the most likely
  regression?"

Bad prompts (waste of tokens):

- "What do you think of my changes?" (no scope)
- "Review everything" (won't fit + low signal)

When Codex flags something, **either fix it or write down why you're
not** — e.g. add a follow-up task, surface it to the user, or note it in
the commit. Don't silently dismiss.

## Architecture rules of thumb

- **The rec engine returns 4 picks per round, scoped to a `round_id`.**
  Never insert recs with a null `round_id`. The unique constraint is
  `(round_id, rank)`, not `(trip_id, rank)`.
- **`active_round_id` on `trips` drives the page render.** Past rounds
  are kept and navigable via `?round=N`; only the active one is
  refinable.
- **`rec_cache.key` = `sha256(input + seed_version + prompt_version +
  model + refine_context)`.** Changes to the prompt MUST bump
  `REC_PROMPT_VERSION` in `src/lib/types.ts`; changes to the seed list
  MUST bump `SEED_VERSION`. Both are sources of cache-key drift if
  forgotten.
- **All token reads/writes for `user_codex_auth` go through the
  service-role client.** RLS owners can SELECT their row but the
  encryption key never reaches RLS-scoped queries. See
  `src/lib/llm/codex-token.ts`.
- **Never call `revalidatePath` from inside a server action that runs
  during a Next 16 server-render.** It throws. Use explicit re-fetch
  after the action returns instead.
- **Pre-filter is a hard guarantee, the prompt is a soft one.** Anything
  in `avoidedSlugs` must be excluded by `preFilter()` before rank, not
  trusted to the LLM alone.
- **Tradeoff scores should be deterministic** per `(destination,
  normalized input)`. The prompt instructs this; if scores swing wildly
  between rounds for the same destination, treat it as a bug, not noise.

## Stack quick reference

- Next.js 16 (App Router) · TypeScript · Tailwind v4
- Supabase (Third-Party Auth via Clerk's session token) · pgcrypto in
  the `extensions` schema (qualify calls as `extensions.pgp_sym_*`)
- Per-user OAuth to OpenAI's Codex backend (NOT the public OpenAI API).
  Disable with `CODEX_OAUTH_ENABLED=0`.
- Open-Meteo (weather, no key) · Amadeus best-effort (flight/hotel) ·
  Skyscanner / Booking.com deep-links

`npm run dev` is `next dev` (Turbopack). `npm run seed:sql` regenerates
`supabase/seed/destinations.sql` from `src/lib/seed/destinations.ts` —
treat the TS file as source of truth and never hand-edit the SQL.

Migrations live in `supabase/migrations/000N_*.sql`. Apply them via the
Supabase MCP `apply_migration`, not `supabase db push` (this project's
local CLI isn't wired up to the remote project).

## Compliance note (don't lose this)

The "Connect ChatGPT" feature uses the OpenAI Codex CLI's OAuth client
and the chatgpt.com Codex backend. Reference implementations
(`numman-ali/opencode-openai-codex-auth`, `tumf/opencode-openai-device-auth`)
explicitly label this *personal use only* — running it as a multi-tenant
hosted service is off-script. The kill switch is `CODEX_OAUTH_ENABLED=0`.
Keep an Anthropic-API fallback path on `feature/anthropic-fallback` so
re-deploying with a paid key inside an hour is realistic if the OAuth
path goes dark.

## Things that will surprise you

- `pgp_sym_encrypt` lives in `extensions` schema, not `public`. SECURITY
  DEFINER functions need `set search_path = public, extensions`.
- Supabase Third-Party Auth delivers Clerk's JWT with the `anon` role,
  not `authenticated`. RLS policies on user tables are widened to
  `to anon, authenticated`.
- Codex backend rejects `max_output_tokens` and `reasoning: minimal`.
  Valid reasoning values: `none | low | medium | high | xhigh`.
- Codex backend returns `output: []` on `response.completed` and ships
  the actual content via `function_call_arguments.delta` events. The
  SSE assembler in `src/lib/llm/codex-client.ts` reconstructs from
  deltas; trust the local assembly when the snapshot is empty.
- JSONB doesn't preserve key order across round-trips. Use
  `stableStringify` (sorted keys) for any cache key derived from a
  parsed JSONB value.
- Picsum hero photo URLs are deterministic per slug but not curated;
  some destinations get unrelated images (Big Sur → Flatiron). Acceptable
  until the Places prefetch runs — `npm run seed:photos` once GCP billing
  is on.

## When you're stuck

- Look at `/root/.claude/plans/start-building-trip-planner-delegated-comet.md` first.
- Check the most recent commits with `git log --oneline -15` for context.
- For a UI surface, peek at `src/app/gallery/v*-pastel/page.tsx` — the
  live styling was lifted from there and stays close to its conventions.
- Ask Codex (per "Code review with Codex" above) before making structural
  changes you're unsure about.
