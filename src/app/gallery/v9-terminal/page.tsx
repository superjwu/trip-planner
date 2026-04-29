import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// ─── width helpers ────────────────────────────────────────────────────────
const BOX_W = 76; // total inner width incl. side pipes
const INNER_W = BOX_W - 2; // chars between the two `│`
const LABEL_W = 12;

function pad(s: string, w: number): string {
  if (s.length >= w) return s.slice(0, w);
  return s + " ".repeat(w - s.length);
}

function row(label: string, value: string): string {
  // wrap value if it's wider than available space
  const valueW = INNER_W - 1 /* leading space */ - LABEL_W - 1 /* trailing space */;
  const lines = wrap(value, valueW);
  return lines
    .map((line, i) =>
      `│ ${pad(i === 0 ? label : "", LABEL_W)}${pad(line, valueW)} │`
    )
    .join("\n");
}

function wrap(text: string, w: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = "";
  for (const word of words) {
    if (!cur.length) {
      cur = word;
    } else if (cur.length + 1 + word.length <= w) {
      cur += " " + word;
    } else {
      out.push(cur);
      cur = word;
    }
  }
  if (cur) out.push(cur);
  // hard-break any single token that's too long
  return out.flatMap((l) => {
    if (l.length <= w) return [l];
    const chunks: string[] = [];
    for (let i = 0; i < l.length; i += w) chunks.push(l.slice(i, i + w));
    return chunks;
  });
}

function divider(): string {
  return `├${"─".repeat(INNER_W)}┤`;
}

function blank(): string {
  return `│${" ".repeat(INNER_W)}│`;
}

function header(rank: number, slug: string): string {
  // ┌─ rec/01 ──── slug ───────────────────────┐
  const left = `┌─ rec/${String(rank).padStart(2, "0")} ──── ${slug} `;
  const fill = "─".repeat(Math.max(0, BOX_W - left.length - 1));
  return left + fill + "┐";
}

function footer(): string {
  return `└${"─".repeat(INNER_W)}┘`;
}

// ─── trip metadata table ──────────────────────────────────────────────────
function tripTable(trip: GalleryTrip): string {
  const W = BOX_W;
  const inner = W - 2;
  const colA = 16;
  const colB = inner - 1 - colA - 1;

  const rows: [string, string][] = [
    ["origin",        `${trip.origin}  (${trip.originCode})`],
    ["depart",        trip.departOn],
    ["return",        trip.returnOn],
    ["length",        `${trip.tripLengthDays} days`],
    ["vibes",         trip.vibes.join(", ")],
    ["budget",        trip.budgetBand],
    ["pace",          trip.pace],
    ["season-hint",   trip.seasonHint],
    ["dislikes",      trip.dislikes],
  ];

  const top = `┌${"─".repeat(inner)}┐`;
  const bot = `└${"─".repeat(inner)}┘`;
  const sep = `├${"─".repeat(colA + 2)}┬${"─".repeat(inner - colA - 3)}┤`;
  const head = `│ ${pad("field", colA)}│ ${pad("value", colB)} │`;
  const mid = `├${"─".repeat(colA + 2)}┼${"─".repeat(inner - colA - 3)}┤`;
  const body = rows
    .map(([k, v]) => `│ ${pad(k, colA)}│ ${pad(v, colB)} │`)
    .join("\n");

  return [top, head, sep.replace(/┬/, "┬"), body, bot].join("\n").replace(sep, mid);
}

// ─── pick card ────────────────────────────────────────────────────────────
function pickCard(p: GalleryPick, opts: { withItinerary: boolean }): string {
  const lines: string[] = [];
  lines.push(header(p.rank, p.slug));
  lines.push(blank());

  // ASCII placeholder photo
  const photoLabel = `[${"█".repeat(28)} jpg ]`;
  const photoLine = `│ ${pad(photoLabel, INNER_W - 2)} │`;
  lines.push(photoLine);
  lines.push(blank());

  lines.push(row("name",        p.name));
  lines.push(row("region",      p.region));
  lines.push(row("state",       p.state));
  lines.push(row("rank",        `#${p.rank}`));
  lines.push(row("tags",        p.tags.join(", ")));
  lines.push(row("match",       p.matchTags.join(", ")));
  lines.push(divider());
  lines.push(row("weather",     `${p.weather.highF}/${p.weather.lowF}F  ${p.weather.summary}`));
  lines.push(row("cost.total",  `$${p.cost.totalUsd}`));
  lines.push(row("cost.flight", `$${p.cost.flightUsd}`));
  lines.push(row("cost.lodge",  `$${p.cost.lodgingUsd}`));
  lines.push(divider());
  lines.push(row("blurb",       p.blurb));
  lines.push(blank());
  lines.push(row("reasoning",   p.reasoning));
  lines.push(divider());
  lines.push(row("attractions", ""));
  for (const a of p.attractions) {
    lines.push(row(`  • ${a.name}`, a.description));
  }

  if (opts.withItinerary) {
    lines.push(divider());
    lines.push(row("itinerary", `${p.itinerary.length}-day plan`));
    for (const d of p.itinerary) {
      lines.push(row(`  day ${d.day}`, `${d.title} — ${d.description}`));
    }
  }

  lines.push(footer());
  return lines.join("\n");
}

// ─── command echo / log feel ──────────────────────────────────────────────
const COMMAND =
  `$ trip-planner rank --origin=${TRIP.originCode} ` +
  `--vibes=${TRIP.vibes.join(",")} --budget=1000-2000 ` +
  `--depart=${TRIP.departOn} --return=${TRIP.returnOn}`;

const LOG_LINES = [
  "[ 0.001s] boot   :: trip-planner v0.1.0 (codex-cli)",
  "[ 0.014s] config :: read ~/.trip-planner/profile.toml ........... ok",
  "[ 0.027s] geo    :: resolve origin NYC → 40.71N, -74.00W ........ ok",
  "[ 0.084s] flights:: scan EWR/JFK/LGA depart=2026-09-12 ........... ok",
  "[ 0.142s] filter :: pre-filter candidates (n=128) ................ 24",
  "[ 0.231s] rank   :: ranking with codex (model=opus-4.7) .......... ok",
  "[ 0.612s] score  :: compute fit-score(vibes ⊗ season ⊗ budget) ... ok",
  "[ 0.704s] cost   :: estimate flight+lodging+food .................. ok",
  "[ 0.811s] write  :: 4 picks → ./.trip-planner/cache/2026-09-12.json",
  "[ 0.812s] DONE   :: 4 results in 0.812s",
];

// ─────────────────────────────────────────────────────────────────────────
export default function V9TerminalPage() {
  return (
    <main className="min-h-screen bg-black text-[#33FF33] font-mono p-6 sm:p-10">
      {/* faux scanlines via repeating linear-gradient — single inline style, no global CSS */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, #33FF33 3px)",
        }}
      />
      <div className="relative z-10 max-w-[860px] mx-auto">

        {/* top bar */}
        <div className="text-[#33CCFF] text-xs sm:text-sm">
          <span className="text-[#33FF33]/70">[</span>
          <span>trip-planner v0.1.0</span>
          <span className="text-[#33FF33]/70">]</span>
          <span className="text-[#33FF33]/70"> tty/2 · </span>
          <span className="text-[#33FF33]/70">user@codex</span>
          <span className="text-[#33FF33]/70"> · </span>
          <span className="text-[#33FF33]/70">/work/trips</span>
        </div>

        <pre className="whitespace-pre-wrap break-words text-[#33CCFF] mt-3 text-sm sm:text-base">
          {COMMAND}
          <span className="inline-block w-2 h-4 bg-[#33FF33] align-[-2px] ml-1" />
        </pre>

        {/* run log */}
        <pre className="whitespace-pre-wrap text-[#33FF33]/80 text-xs sm:text-sm mt-3 leading-snug">
          {LOG_LINES.join("\n")}
        </pre>

        {/* trip summary table */}
        <div className="mt-8">
          <div className="text-[#33CCFF] text-sm">$ cat ./trip.summary</div>
          <pre className="whitespace-pre text-[#33FF33] text-[11px] sm:text-[13px] leading-tight mt-2 overflow-x-auto">
            {tripTable(TRIP)}
          </pre>
        </div>

        {/* picks */}
        <div className="mt-10">
          <div className="text-[#33CCFF] text-sm">$ ls -la ./picks/</div>
          <pre className="whitespace-pre text-[#33FF33]/80 text-xs sm:text-sm mt-2">
{`total 4
drwxr-xr-x  user  staff  -  charleston-sc/   # rank 1
drwxr-xr-x  user  staff  -  acadia-np/       # rank 2
drwxr-xr-x  user  staff  -  asheville-nc/    # rank 3
drwxr-xr-x  user  staff  -  savannah-ga/     # rank 4`}
          </pre>
        </div>

        <div className="mt-6 space-y-8">
          {PICKS.map((p, i) => (
            <section key={p.slug}>
              <div className="text-[#33CCFF] text-sm mb-2">
                $ trip-planner show --slug={p.slug}
                {i === 0 ? " --with-itinerary" : ""}
              </div>
              <pre className="whitespace-pre text-[#33FF33] text-[11px] sm:text-[13px] leading-tight overflow-x-auto">
                {pickCard(p, { withItinerary: i === 0 })}
              </pre>
            </section>
          ))}
        </div>

        {/* footer */}
        <div className="mt-12 border-t border-[#33FF33]/30 pt-4 text-xs sm:text-sm">
          <pre className="whitespace-pre text-[#33FF33]/70 mb-3">
{`-- end of stream --
4 results · exit 0 · 0.812s · cached at ./.trip-planner/cache/2026-09-12.json`}
          </pre>
          <Link
            href="/gallery"
            className="inline-block text-[#33CCFF] hover:text-[#33FF33] hover:bg-[#33FF33]/10 px-2 py-1 border border-[#33CCFF]/60 hover:border-[#33FF33]"
          >
            [ENTER] ../gallery
          </Link>
          <span className="inline-block w-2 h-4 bg-[#33FF33] align-[-2px] ml-2" />
        </div>
      </div>
    </main>
  );
}
