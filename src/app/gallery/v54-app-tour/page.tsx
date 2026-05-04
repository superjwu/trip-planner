import { TRIP, PICKS, type GalleryPick } from "../_mock";
import { formatDateRange, formatMoney } from "../_helpers";
import { DM_Sans, Manrope } from "next/font/google";
import { feature } from "topojson-client";
import { geoAlbersUsa, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import statesTopoRaw from "us-atlas/states-10m.json";

// ─── Fonts ─────────────────────────────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = { title: "App Tour (Coastal Slate) — Trip Planner" };

// ─── Real US geography ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATES_FC = feature(statesTopoRaw as any, (statesTopoRaw as any).objects.states) as unknown as FeatureCollection;

const NYC_LL: [number, number] = [-74.006, 40.7128];
const PICK_LL: Record<string, [number, number]> = {
  "charleston-sc": [-79.9311, 32.7765],
  "acadia-np": [-68.2733, 44.3386],
  "asheville-nc": [-82.5515, 35.5951],
  "savannah-ga": [-81.0998, 32.0809],
};

const PICK_HUE: Record<string, string> = {
  "charleston-sc": "#2C5474",
  "acadia-np": "#84A98C",
  "asheville-nc": "#E76F51",
  "savannah-ga": "#C0875F",
};

function buildAtlas(width: number, height: number) {
  const projection = geoAlbersUsa().fitSize([width, height], STATES_FC);
  const pathGen = geoPath(projection);
  const statePaths = STATES_FC.features
    .map((f) => ({ id: String(f.id ?? Math.random()), d: pathGen(f) ?? "" }))
    .filter((s) => s.d.length > 0);
  const nyc = (projection(NYC_LL) as [number, number] | null) ?? [0, 0];
  const picks: Record<string, [number, number]> = {};
  for (const [slug, ll] of Object.entries(PICK_LL)) {
    picks[slug] = (projection(ll) as [number, number] | null) ?? [0, 0];
  }
  return { width, height, statePaths, nyc, picks };
}

const HERO_ATLAS = buildAtlas(720, 440);

// ─── Palette tokens ────────────────────────────────────────────────────────
// bg #F4F6F8 · surface #E8EDF2 · fg #1F2937 · soft-ink #4B5563
// border #CBD5E1 · terracotta #2C5474 · sun-yellow #E76F51
// fresh-green #84A98C · olive #C0875F

// ─── Shared ornament components ───────────────────────────────────────────

function LeafDot({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "inline-block w-1.5 h-1.5 rounded-full bg-[#2C5474]"}
      aria-hidden="true"
    />
  );
}

function ScreenPill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span
        className="rounded-full border border-[#2C5474] bg-[#E8EDF2] px-4 py-1.5 text-xs tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: "#CBD5E1" }} />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-8 mt-32">
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #2C5474 30%, #E76F51 70%, transparent)" }} />
    </div>
  );
}

// ─── Atlas component (same as v54) ────────────────────────────────────────
function WellnessAtlas() {
  const { width, height, statePaths, nyc, picks } = HERO_ATLAS;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="US map showing trip routes from NYC to four destinations"
      style={{ width: "100%", height: "auto" }}
    >
      <g>
        {statePaths.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="#E8EDF2"
            stroke="rgba(154,52,18,0.22)"
            strokeWidth={0.55}
            strokeLinejoin="round"
          />
        ))}
      </g>
      {PICKS.map((pick) => {
        const coord = picks[pick.slug];
        const color = PICK_HUE[pick.slug] ?? "#2C5474";
        if (!coord) return null;
        return (
          <line
            key={pick.slug}
            x1={nyc[0]} y1={nyc[1]}
            x2={coord[0]} y2={coord[1]}
            stroke={color}
            strokeWidth={1.6}
            strokeOpacity={0.7}
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
        );
      })}
      {PICKS.map((pick) => {
        const coord = picks[pick.slug];
        const color = PICK_HUE[pick.slug] ?? "#2C5474";
        if (!coord) return null;
        const [x, y] = coord;
        const labelOffset = x > nyc[0] ? 14 : -14;
        const anchor = x > nyc[0] ? "start" : "end";
        return (
          <g key={pick.slug}>
            <circle cx={x} cy={y} r={9} fill="#F4F6F8" stroke={color} strokeWidth={2.5} />
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text x={x + labelOffset} y={y + 4.5} textAnchor={anchor} fontSize={11} fill="#1F2937" fontFamily="var(--font-display)" fontWeight={500}>
              {pick.name}
            </text>
            <text x={x + labelOffset} y={y + 18} textAnchor={anchor} fontSize={9} fill="#4B5563" fontFamily="var(--font-body)" letterSpacing="0.10em" style={{ textTransform: "uppercase" }}>
              {pick.state}
            </text>
          </g>
        );
      })}
      <circle cx={nyc[0]} cy={nyc[1]} r={14} fill="rgba(154,52,18,0.10)" />
      <circle cx={nyc[0]} cy={nyc[1]} r={9} fill="rgba(154,52,18,0.18)" />
      <circle cx={nyc[0]} cy={nyc[1]} r={5} fill="#2C5474" />
      <text x={nyc[0] + 14} y={nyc[1] - 6} textAnchor="start" fontSize={11} fill="#1F2937" fontFamily="var(--font-display)" fontWeight={600}>New York City</text>
      <text x={nyc[0] + 14} y={nyc[1] + 8} textAnchor="start" fontSize={9} fill="#4B5563" fontFamily="var(--font-body)" letterSpacing="0.10em" style={{ textTransform: "uppercase" }}>Origin · NYC</text>
    </svg>
  );
}

// ─── Tradeoff matrix data ─────────────────────────────────────────────────
const MATRIX_AXES = ["Flight ease", "Budget headroom", "Crowd", "Vibe match", "Season fit"];
type DotScore = [number, number, number, number, number]; // 1–3 per axis
const MATRIX_SCORES: Record<string, DotScore> = {
  "charleston-sc": [2, 2, 3, 3, 3],
  "acadia-np":     [2, 2, 3, 3, 3],
  "asheville-nc":  [3, 3, 3, 2, 2],
  "savannah-ga":   [2, 2, 3, 3, 3],
};

function DotScale({ score, max = 3 }: { score: number; max?: number }) {
  return (
    <span className="inline-flex gap-1 items-center tabular-nums">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: i < score ? "#2C5474" : "#CBD5E1" }}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

// ─── Screen 01: Landing ────────────────────────────────────────────────────
function Screen01Landing() {
  const valuePropCards = [
    { num: "01", title: "Real reasoning", body: "Every pick comes with a paragraph explaining why it fits your vibes — not a star rating or a score." },
    { num: "02", title: "Round-by-round refinement", body: "Didn't like #3? Say so. We find alternates and keep every round so you can compare side by side." },
    { num: "03", title: "No infinite scroll", body: "Four destinations. Full stop. We chose scarcity on purpose — more options is not always more helpful." },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at 12% 18%, rgba(154,52,18,0.11), transparent 52%), radial-gradient(circle at 88% 78%, rgba(217,119,6,0.09), transparent 52%), linear-gradient(180deg,#F4F6F8 0%,#E8EDF2 100%)",
        minHeight: "600px",
      }}
    >
      {/* Organic blob accents */}
      <svg className="absolute top-0 right-0 w-[480px] pointer-events-none" viewBox="0 0 520 520" fill="none" aria-hidden="true">
        <path d="M380 55 C450 100 490 185 470 280 C450 375 350 430 250 410 C150 390 70 310 85 210 C100 110 190 35 290 25 C335 18 355 35 380 55Z" fill="#2C5474" opacity="0.10" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-[360px] pointer-events-none" viewBox="0 0 420 420" fill="none" aria-hidden="true">
        <path d="M70 340 C25 295 -15 205 18 130 C52 55 145 18 225 42 C305 65 355 158 330 245 C305 332 215 385 145 375 C112 370 90 362 70 340Z" fill="#E76F51" opacity="0.09" />
      </svg>

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-8 pt-8">
        <span className="text-2xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}>
          Wander
        </span>
        <div className="flex items-center gap-3">
          {["How it works", "Past trips", "Sign in"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
            >
              {item}
            </a>
          ))}
          <a
            href="#"
            className="ml-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-body)", backgroundColor: "#2C5474" }}
          >
            Begin planning →
          </a>
        </div>
      </nav>

      {/* Hero center */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-32 text-center">
        <p
          className="text-xs tracking-[0.22em] uppercase mb-8"
          style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
        >
          ❦ A travel copilot, gentler than a search engine ❦
        </p>
        <h1
          className="text-7xl font-medium tracking-tight leading-[0.95] mb-8"
          style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
        >
          Tell us how you want to feel.{" "}
          <em>We&#39;ll find the four places.</em>
        </h1>
        <p
          className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
        >
          No sponsored listings. No infinite scroll. Just four destinations the algorithm thinks fit your vibe — with reasoning, not engagement bait.
        </p>
        <a
          href="#"
          className="inline-block rounded-full px-10 py-5 font-medium text-white shadow-[0_20px_40px_-12px_rgba(217,119,6,0.35)] transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-body)", backgroundColor: "#E76F51" }}
        >
          Begin planning →
        </a>
      </div>

      {/* Value prop cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valuePropCards.map((card) => (
            <div
              key={card.num}
              className="rounded-[3rem] bg-white p-8 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]"
            >
              <p
                className="text-3xl font-medium tabular-nums mb-4"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#2C5474" }}
              >
                {card.num}
              </p>
              <p
                className="text-lg font-medium mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {card.title}
              </p>
              <p
                className="text-sm leading-[1.6]"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Screen 02: Planner (Wizard) ──────────────────────────────────────────
function Screen02Planner() {
  const vibes = [
    { label: "scenic", selected: true },
    { label: "foodie", selected: true },
    { label: "chill", selected: true },
    { label: "cultural", selected: false },
    { label: "nature", selected: false },
    { label: "nightlife", selected: false },
    { label: "shopping", selected: false },
    { label: "wellness", selected: false },
    { label: "adventure", selected: false },
  ];

  const calDays = [
    { label: "S", days: [null, null, null, null, null, null, 1] },
    { label: "M", days: [2, 9, 16, 23, 30] },
    { label: "T", days: [3, 10, 17, 24] },
    { label: "W", days: [4, 11, 18, 25] },
    { label: "T", days: [5, 12, 19, 26] },
    { label: "F", days: [6, 13, 20, 27] },
    { label: "S", days: [7, 14, 21, 28] },
  ];

  const calGrid: (number | null)[][] = [];
  for (let row = 0; row < 5; row++) {
    const week: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const d = calDays[col]?.days[row] ?? null;
      week.push(d ?? null);
    }
    calGrid.push(week);
  }

  const budgetTicks = ["<$1k", "$1k–$2k", "$2k–$3k", "$3k–$5k", "$5k+"];

  const fieldCard = (children: React.ReactNode) => (
    <div className="rounded-[3rem] bg-white p-8 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]">
      {children}
    </div>
  );

  const fieldLabel = (text: string) => (
    <p
      className="text-xs tracking-[0.18em] uppercase mb-4"
      style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
    >
      {text}
    </p>
  );

  return (
    <section className="max-w-6xl mx-auto px-8" style={{ minHeight: "1200px" }}>
      <ScreenPill label="Screen 02 · PLANNER" />
      <h2
        className="text-4xl font-medium mb-12"
        style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
      >
        Tell us about the trip.
      </h2>

      <div className="grid grid-cols-12 gap-10">
        {/* ── Left: Wizard form ── */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

          {/* Field 1 — Origin */}
          {fieldCard(
            <>
              {fieldLabel("Where from?")}
              <div
                className="rounded-2xl border px-5 py-4 flex items-center gap-3"
                style={{ borderColor: "#CBD5E1", backgroundColor: "#F4F6F8" }}
              >
                <LeafDot />
                <span className="text-lg" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>
                  New York City — NYC
                </span>
              </div>
              <p className="mt-3 text-sm" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>
                Most US cities supported.
              </p>
            </>
          )}

          {/* Field 2 — Dates */}
          {fieldCard(
            <>
              {fieldLabel("When?")}
              {/* Mini calendar */}
              <div className="rounded-2xl border p-4 mb-3" style={{ borderColor: "#CBD5E1", backgroundColor: "#F4F6F8" }}>
                <p
                  className="text-sm font-medium text-center mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "#4B5563" }}
                >
                  September 2026
                </p>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="text-xs tracking-wide py-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>{d}</div>
                  ))}
                  {calGrid.map((week, wi) =>
                    week.map((day, di) => {
                      const inRange = day !== null && day >= 12 && day <= 16;
                      const isStart = day === 12;
                      const isEnd = day === 16;
                      return (
                        <div
                          key={`${wi}-${di}`}
                          className={`text-sm py-1 rounded-full tabular-nums ${inRange ? "font-medium" : ""} ${isStart || isEnd ? "text-white" : inRange ? "text-white" : ""}`}
                          style={{
                            fontFamily: "var(--font-body)",
                            backgroundColor: isStart || isEnd ? "#2C5474" : inRange ? "rgba(154,52,18,0.18)" : "transparent",
                            color: inRange ? (isStart || isEnd ? "white" : "#2C5474") : day ? "#1F2937" : "transparent",
                          }}
                        >
                          {day ?? "·"}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <p
                className="text-sm tabular-nums"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563", fontVariantNumeric: "tabular-nums" }}
              >
                4 days · Friday → Tuesday
              </p>
            </>
          )}

          {/* Field 3 — Vibes */}
          {fieldCard(
            <>
              {fieldLabel("What kind of trip?")}
              <div className="flex flex-wrap gap-2 mb-4">
                {vibes.map((v) => (
                  <span
                    key={v.label}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border"
                    style={{
                      fontFamily: "var(--font-body)",
                      backgroundColor: v.selected ? "#2C5474" : "white",
                      color: v.selected ? "#F4F6F8" : "#4B5563",
                      borderColor: v.selected ? "#2C5474" : "#CBD5E1",
                    }}
                  >
                    <LeafDot className={`inline-block w-1.5 h-1.5 rounded-full ${v.selected ? "bg-[#E8EDF2]" : "bg-[#2C5474]"}`} />
                    {v.label}
                  </span>
                ))}
              </div>
              <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>
                Pick up to 3. We&#39;ll prioritize destinations that hit all of them.
              </p>
            </>
          )}

          {/* Field 4 — Budget */}
          {fieldCard(
            <>
              {fieldLabel("Budget band?")}
              <div className="flex items-center gap-0 mb-3">
                {budgetTicks.map((tick, i) => {
                  const active = i === 1;
                  return (
                    <div key={tick} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full h-2.5 rounded-full"
                        style={{ backgroundColor: active ? "#2C5474" : "#CBD5E1" }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: active ? "#2C5474" : "white",
                          borderColor: active ? "#2C5474" : "#CBD5E1",
                        }}
                      />
                      <span
                        className="text-xs tabular-nums"
                        style={{ fontFamily: "var(--font-body)", color: active ? "#2C5474" : "#6B7280", fontWeight: active ? 600 : 400 }}
                      >
                        {tick}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>
                Per person, including flight + lodging.
              </p>
            </>
          )}

          {/* Field 5 — Pace + Avoidances */}
          {fieldCard(
            <>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  {fieldLabel("Pace?")}
                  <div className="flex flex-col gap-3">
                    {["Slow", "Balanced", "Packed"].map((pace) => {
                      const sel = pace === "Balanced";
                      return (
                        <div key={pace} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: sel ? "#2C5474" : "#CBD5E1" }}
                          >
                            {sel && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2C5474" }} />}
                          </div>
                          <span
                            className="text-base"
                            style={{ fontFamily: "var(--font-body)", color: sel ? "#1F2937" : "#4B5563", fontWeight: sel ? 500 : 400 }}
                          >
                            {pace}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  {fieldLabel("What to avoid?")}
                  <div
                    className="rounded-2xl border p-4 h-28"
                    style={{ borderColor: "#CBD5E1", backgroundColor: "#F4F6F8" }}
                  >
                    <span
                      className="text-base"
                      style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#6B7280" }}
                    >
                      crowds, big resorts
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <a
            href="#"
            className="w-full text-center rounded-full py-5 font-medium text-white shadow-[0_20px_40px_-12px_rgba(217,119,6,0.35)] transition-opacity hover:opacity-80 block"
            style={{ fontFamily: "var(--font-body)", backgroundColor: "#E76F51" }}
          >
            Find my four destinations →
          </a>
          <p
            className="text-sm text-center"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#6B7280" }}
          >
            Takes about 6–9 seconds. We&#39;ll show you our reasoning.
          </p>
        </div>

        {/* ── Right: Sidebar gate ── */}
        <div className="col-span-12 lg:col-span-5">
          <div
            className="rounded-[3rem] p-10 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)] sticky top-8"
            style={{ backgroundColor: "#E8EDF2", border: "1px solid #CBD5E1" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <LeafDot />
              <p
                className="text-xs tracking-[0.18em] uppercase"
                style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
              >
                Why we need this
              </p>
            </div>
            <h3
              className="text-2xl font-medium mb-4 leading-snug"
              style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
            >
              Connect your ChatGPT to use Wander free.
            </h3>
            <p
              className="text-base leading-[1.7] mb-8"
              style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
            >
              We don&#39;t sell tokens. Wander uses your ChatGPT subscription via Codex OAuth — the same login flow you use for ChatGPT Desktop. The token stays in our database encrypted; only your trips read it.
            </p>

            {/* ChatGPT-style geometric icon (4-petal flower, no real logo) */}
            <a
              href="#"
              className="w-full flex items-center justify-center gap-3 rounded-full border-2 py-4 font-medium transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "#2C5474",
                color: "#2C5474",
                backgroundColor: "white",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <ellipse cx="9" cy="5" rx="3" ry="4.5" fill="#2C5474" opacity="0.8" />
                <ellipse cx="9" cy="13" rx="3" ry="4.5" fill="#2C5474" opacity="0.8" />
                <ellipse cx="5" cy="9" rx="4.5" ry="3" fill="#2C5474" opacity="0.8" />
                <ellipse cx="13" cy="9" rx="4.5" ry="3" fill="#2C5474" opacity="0.8" />
                <circle cx="9" cy="9" r="2.5" fill="#F4F6F8" />
              </svg>
              Connect ChatGPT →
            </a>
            <p
              className="mt-4 text-sm text-center"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#6B7280" }}
            >
              Or use a paid Anthropic key — Settings ▸ API.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Screen 03: Trip Results ───────────────────────────────────────────────
function Screen03Results({ picks }: { picks: GalleryPick[] }) {
  const trip = TRIP;

  return (
    <section className="max-w-6xl mx-auto px-8" style={{ minHeight: "1800px" }}>
      <ScreenPill label="Screen 03 · TRIP RESULTS" />
      <h2
        className="text-4xl font-medium mb-4"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
      >
        Here are your four. <em>With our reasoning.</em>
      </h2>

      {/* Trip metadata strip */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {[
          `${trip.origin}`,
          `${trip.tripLengthDays} days`,
          formatDateRange(trip),
          "scenic + foodie + chill",
          "$1–2k",
        ].map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className="text-sm tabular-nums"
              style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
            >
              {item}
            </span>
            {i < 4 && <LeafDot />}
          </span>
        ))}
      </div>

      {/* Round chips */}
      <div className="flex items-center gap-3 mb-2">
        {["Round 1", "Round 2", "Round 3"].map((round, i) => (
          <span
            key={round}
            className="rounded-full px-5 py-2 text-sm font-medium"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: i === 0 ? "#2C5474" : "#E8EDF2",
              color: i === 0 ? "#F4F6F8" : "#6B7280",
              border: `1px solid ${i === 0 ? "#2C5474" : "#CBD5E1"}`,
            }}
          >
            {round}
          </span>
        ))}
      </div>
      <p className="text-xs mb-12" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>
        You can refine. We keep every round so you can compare.
      </p>

      {/* Tradeoff matrix card */}
      <div className="rounded-[3rem] p-10 mb-12 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]" style={{ backgroundColor: "#E8EDF2", border: "1px solid #CBD5E1" }}>
        <h3
          className="text-2xl font-medium mb-4"
          style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
        >
          Why these four
        </h3>
        <p
          className="text-base leading-[1.7] mb-8 max-w-3xl"
          style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
        >
          All four destinations hit your scenic + foodie + chill brief in September — the shoulder season you asked for. Charleston and Savannah give you the Lowcountry warmth with genuine food scenes; Acadia delivers dramatic Atlantic coast scenery with zero crowds after Labor Day; Asheville adds mountain foliage and the South&#39;s best brewery corridor. None of them require a resort or a tourist trap.
        </p>

        {/* Matrix table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-4 text-left w-36">
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#6B7280", textTransform: "uppercase" }}>
                    Destination
                  </span>
                </th>
                {MATRIX_AXES.map((axis) => (
                  <th key={axis} className="pb-4 text-center">
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "#6B7280", textTransform: "uppercase" }}>
                      {axis}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {picks.map((pick, pi) => {
                const scores = MATRIX_SCORES[pick.slug] ?? [2, 2, 2, 2, 2];
                return (
                  <tr
                    key={pick.slug}
                    style={{ borderTop: "1px solid #CBD5E1" }}
                  >
                    <td className="py-4 pr-4">
                      <span
                        className="font-medium"
                        style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
                      >
                        {pick.name}
                      </span>
                      <span
                        className="block text-xs mt-0.5"
                        style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
                      >
                        {pick.state}
                      </span>
                    </td>
                    {scores.map((score, si) => (
                      <td key={si} className="py-4 text-center">
                        <DotScale score={score} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Atlas card */}
      <div className="rounded-[3rem] bg-white p-10 mb-12 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]">
        <div className="flex items-center gap-2 mb-2">
          <LeafDot />
          <p
            className="text-xs tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
          >
            The Routes
          </p>
        </div>
        <h3
          className="text-2xl font-medium mb-8"
          style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
        >
          Four routes from New York.
        </h3>
        <WellnessAtlas />
      </div>

      {/* 4 destination cards — 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {picks.map((pick, i) => {
          const isFirst = i === 0;
          return (
            <div
              key={pick.slug}
              className="rounded-[3rem] bg-white overflow-hidden shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]"
              style={{ border: isFirst ? "2px solid #2C5474" : "1px solid #CBD5E1" }}
            >
              <img
                src={pick.heroPhotoUrl}
                alt={pick.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p
                      className="text-xs tracking-[0.14em] uppercase mb-1"
                      style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
                    >
                      {pick.region}
                    </p>
                    <h4
                      className="text-2xl font-medium"
                      style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
                    >
                      {pick.name}
                    </h4>
                  </div>
                  <span
                    className="text-2xl tabular-nums"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#2C5474", opacity: 0.5 }}
                  >
                    0{pick.rank}
                  </span>
                </div>
                <p
                  className="text-sm leading-[1.6] mb-5"
                  style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
                >
                  {pick.blurb}
                </p>

                {/* 2×2 mini specs */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-2xl bg-[#F4F6F8] p-3">
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>Weather</p>
                    <p className="text-base font-medium tabular-nums" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>{pick.weather.highF}°/{pick.weather.lowF}°F</p>
                  </div>
                  <div className="rounded-2xl bg-[#F4F6F8] p-3">
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>Budget</p>
                    <p className="text-base font-medium tabular-nums" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>{formatMoney(pick.cost.totalUsd)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F4F6F8] p-3">
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>Flight</p>
                    <p className="text-base font-medium tabular-nums" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>{formatMoney(pick.cost.flightUsd)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F4F6F8] p-3">
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>Lodging</p>
                    <p className="text-base font-medium tabular-nums" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>{formatMoney(pick.cost.lodgingUsd)}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {pick.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{ fontFamily: "var(--font-body)", borderColor: "#CBD5E1", color: "#4B5563" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Keep / Pass toggle */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{
                      fontFamily: "var(--font-body)",
                      backgroundColor: isFirst ? "#2C5474" : "white",
                      color: isFirst ? "#F4F6F8" : "#4B5563",
                      border: `1px solid ${isFirst ? "#2C5474" : "#CBD5E1"}`,
                    }}
                  >
                    {isFirst && <LeafDot className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8EDF2]" />}
                    {isFirst ? "Keeping →" : "Keep →"}
                  </a>
                  <a
                    href="#"
                    className="rounded-full px-5 py-2.5 text-sm font-medium border transition-opacity hover:opacity-70"
                    style={{ fontFamily: "var(--font-body)", borderColor: "#CBD5E1", color: "#6B7280" }}
                  >
                    Pass
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Screen 04: Refine ─────────────────────────────────────────────────────
function Screen04Refine() {
  const presets = [
    { label: "Cheaper", selected: false },
    { label: "Less crowded", selected: true },
    { label: "Shorter flight", selected: false },
    { label: "More food", selected: true },
    { label: "More nature", selected: false },
    { label: "Drop the picks I passed", selected: false },
  ];

  return (
    <section className="max-w-6xl mx-auto px-8" style={{ minHeight: "600px" }}>
      <ScreenPill label="Screen 04 · REFINE" />
      <h2
        className="text-4xl font-medium mb-12"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
      >
        Want something else?
      </h2>

      <div className="max-w-4xl mx-auto rounded-[3rem] p-12 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]" style={{ backgroundColor: "#E8EDF2", border: "1px solid #CBD5E1" }}>
        <p
          className="text-xs tracking-[0.22em] uppercase mb-6 text-center"
          style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
        >
          ❦ TELL US WHAT TO CHANGE ❦
        </p>
        <h3
          className="text-2xl font-medium mb-6"
          style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
        >
          What didn&#39;t quite fit?
        </h3>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          {presets.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium border cursor-default"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: chip.selected ? "#2C5474" : "white",
                color: chip.selected ? "#F4F6F8" : "#4B5563",
                borderColor: chip.selected ? "#2C5474" : "#CBD5E1",
              }}
            >
              <LeafDot className={`inline-block w-1.5 h-1.5 rounded-full ${chip.selected ? "bg-[#E8EDF2]" : "bg-[#2C5474]"}`} />
              {chip.label}
            </span>
          ))}
        </div>

        {/* Textarea mockup */}
        <div
          className="rounded-2xl border p-6 mb-8 min-h-[100px]"
          style={{ borderColor: "#CBD5E1", backgroundColor: "white" }}
        >
          <span
            style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#6B7280" }}
          >
            Or describe in your own words. We can do &#34;more like Acadia but cheaper&#34; or &#34;I want one with a really good food scene.&#34;
          </span>
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="rounded-full px-10 py-4 font-medium text-white shadow-[0_20px_40px_-12px_rgba(217,119,6,0.35)] transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-body)", backgroundColor: "#E76F51" }}
          >
            Refine →
          </a>
          <p
            className="text-sm max-w-xs text-right"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Round 2 will appear above. Keeps Round 1 navigable.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Screen 05: Pick Detail + Booking ─────────────────────────────────────
function Screen05PickDetail({ pick }: { pick: GalleryPick }) {
  const otherCost = pick.cost.totalUsd - pick.cost.flightUsd - pick.cost.lodgingUsd;

  const bookingCards = [
    {
      label: "Flights",
      service: "Skyscanner",
      desc: "Compare across airlines, dates pre-filled",
    },
    {
      label: "Lodging",
      service: "Booking.com",
      desc: "Hotels + Vrbo near downtown",
    },
    {
      label: "Trains/buses",
      service: "Amtrak",
      desc: "Rail connections and coach routes",
    },
    {
      label: "Restaurants",
      service: "OpenTable",
      desc: "Reservations at the spots we mentioned",
    },
  ];

  const reasoningRaw = pick.reasoning;
  const maxLen = 200;
  const reasoning = reasoningRaw.length > maxLen ? reasoningRaw.slice(0, maxLen) + "…" : reasoningRaw;

  return (
    <section className="max-w-6xl mx-auto px-8" style={{ minHeight: "1200px" }}>
      <ScreenPill label="Screen 05 · PICK DETAIL" />
      <h2
        className="text-4xl font-medium mb-12"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
      >
        {pick.name} — <em>{pick.region}.</em>
      </h2>

      {/* Hero + Story grid */}
      <div className="grid grid-cols-12 gap-12 items-start mb-20">
        {/* Left: Hero photo */}
        <div className="col-span-12 lg:col-span-7">
          <img
            src={pick.heroPhotoUrl}
            alt={pick.name}
            className="w-full rounded-[3rem] object-cover aspect-[4/5]"
          />
          <p
            className="mt-4 text-sm text-center"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#6B7280" }}
          >
            Photographed in {pick.region}.
          </p>
        </div>

        {/* Right: Pick story */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
          <p
            className="text-xs tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-body)", color: "#2C5474" }}
          >
            Keeping this pick · Chapter 01
          </p>
          <h3
            className="text-5xl font-medium"
            style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
          >
            {pick.name}
          </h3>
          <p
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#4B5563" }}
          >
            {pick.region}
          </p>
          <p
            className="text-base leading-[1.7]"
            style={{ fontFamily: "var(--font-body)", color: "#1F2937" }}
          >
            {pick.blurb}
          </p>

          {/* Reasoning card */}
          <div
            className="rounded-3xl p-6"
            style={{ backgroundColor: "#E8EDF2", borderLeft: "4px solid #2C5474" }}
          >
            <p
              className="text-base"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
            >
              {reasoning}
            </p>
          </div>

          {/* 2×2 specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Weather", value: `${pick.weather.highF}°/${pick.weather.lowF}°F`, sub: pick.weather.summary },
              { label: "Budget", value: formatMoney(pick.cost.totalUsd), sub: "total est." },
              { label: "Flight", value: formatMoney(pick.cost.flightUsd), sub: "round-trip est." },
              { label: "Lodging", value: formatMoney(pick.cost.lodgingUsd), sub: "4 nights est." },
            ].map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_-8px_rgba(31,22,18,0.08)]"
              >
                <p className="text-xs tracking-[0.14em] uppercase mb-1" style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}>{spec.label}</p>
                <p className="text-lg font-medium tabular-nums leading-tight" style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}>{spec.value}</p>
                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}>{spec.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlighted moments */}
      <div className="mb-20">
        <p
          className="text-xs tracking-[0.18em] uppercase mb-6"
          style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
        >
          Three Highlighted Moments
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pick.attractions.map((attr, i) => (
            <div
              key={attr.name}
              className="rounded-[3rem] bg-white p-8 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]"
            >
              <p
                className="text-[#2C5474] mb-3 text-2xl tabular-nums"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </p>
              <h4
                className="text-lg font-medium mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {attr.name}
              </h4>
              <p
                className="text-sm leading-[1.6]"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {attr.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-day itinerary */}
      <div className="mb-20">
        <p
          className="text-xs tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
        >
          The Four Days
        </p>
        <h3
          className="text-3xl font-light mb-10"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
        >
          Day by day in {pick.name}.
        </h3>
        <div>
          {pick.itinerary.map((day, di) => (
            <div key={day.day}>
              <div className="flex gap-6 items-start py-8">
                <div
                  className="shrink-0 w-12 h-12 rounded-full bg-[#2C5474] text-white flex items-center justify-center tabular-nums shadow-[0_10px_20px_-8px_rgba(154,52,18,0.4)]"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem" }}
                >
                  {day.day}
                </div>
                <div className="flex-1 pt-1 ml-4">
                  <p
                    className="text-xl mb-2"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#1F2937" }}
                  >
                    {day.title}
                  </p>
                  <p
                    className="text-base leading-[1.7]"
                    style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
                  >
                    {day.description}
                  </p>
                </div>
              </div>
              {di < pick.itinerary.length - 1 && (
                <div className="border-t border-[#CBD5E1] ml-16" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost breakdown */}
      <div
        className="rounded-[3rem] overflow-hidden mb-12 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]"
        style={{ border: "1px solid #CBD5E1" }}
      >
        <div className="grid grid-cols-4">
          {[
            { label: "Flight", value: formatMoney(pick.cost.flightUsd), highlight: false },
            { label: "Lodging", value: formatMoney(pick.cost.lodgingUsd), highlight: false },
            { label: "Other", value: formatMoney(otherCost), highlight: false },
            { label: "Total", value: formatMoney(pick.cost.totalUsd), highlight: true },
          ].map((cell) => (
            <div
              key={cell.label}
              className="p-8"
              style={{
                backgroundColor: cell.highlight ? "#2C5474" : "white",
                borderRight: "1px solid #CBD5E1",
              }}
            >
              <p
                className="text-xs tracking-[0.18em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)", color: cell.highlight ? "rgba(255,251,235,0.7)" : "#6B7280" }}
              >
                {cell.label}
              </p>
              <p
                className="text-3xl font-medium tabular-nums"
                style={{ fontFamily: "var(--font-display)", color: cell.highlight ? "#F4F6F8" : "#1F2937" }}
              >
                {cell.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking handoff row */}
      <div className="mb-12">
        <p
          className="text-xs tracking-[0.18em] uppercase mb-6"
          style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
        >
          Book the trip
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bookingCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[3rem] bg-white p-6 shadow-[0_20px_40px_-20px_rgba(31,22,18,0.10)]"
              style={{ border: "1px solid #CBD5E1" }}
            >
              {/* Simple geometric icon */}
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center mb-4"
                style={{ borderColor: "#CBD5E1" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="7" stroke="#2C5474" strokeWidth="1.5" />
                  <line x1="9" y1="2" x2="9" y2="16" stroke="#2C5474" strokeWidth="1.2" />
                  <line x1="2" y1="9" x2="16" y2="9" stroke="#2C5474" strokeWidth="1.2" />
                </svg>
              </div>
              <p
                className="text-base font-medium mb-1"
                style={{ fontFamily: "var(--font-display)", color: "#1F2937" }}
              >
                {card.label}
              </p>
              <p
                className="text-xs mb-1"
                style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
              >
                {card.service}
              </p>
              <p
                className="text-sm mb-4 leading-[1.5]"
                style={{ fontFamily: "var(--font-body)", color: "#4B5563" }}
              >
                {card.desc}
              </p>
              <a
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium border transition-opacity hover:opacity-70 inline-block"
                style={{ fontFamily: "var(--font-body)", borderColor: "#2C5474", color: "#2C5474" }}
              >
                Open →
              </a>
            </div>
          ))}
        </div>
      </div>

      <p
        className="text-sm text-center"
        style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#6B7280" }}
      >
        We hand off, we don&#39;t lock you in. Cancel any time, anywhere.
      </p>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Page() {
  const picks = PICKS;

  return (
    <main
      className={`${dmSans.variable} ${manrope.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#F4F6F8", color: "#1F2937" }}
    >
      {/* ══ Screen 01 · Landing ══ */}
      <Screen01Landing />

      <SectionDivider />

      {/* ══ Screen 02 · Planner ══ */}
      <div className="mt-32 pb-16" style={{ backgroundColor: "#F4F6F8" }}>
        <Screen02Planner />
      </div>

      <SectionDivider />

      {/* ══ Screen 03 · Trip Results ══ */}
      <div className="mt-32 pb-16" style={{ backgroundColor: "#F4F6F8" }}>
        <Screen03Results picks={picks} />
      </div>

      <SectionDivider />

      {/* ══ Screen 04 · Refine ══ */}
      <div className="mt-32 pb-16" style={{ backgroundColor: "#F4F6F8" }}>
        <Screen04Refine />
      </div>

      <SectionDivider />

      {/* ══ Screen 05 · Pick Detail ══ */}
      <div className="mt-32 pb-24" style={{ backgroundColor: "#F4F6F8" }}>
        <Screen05PickDetail pick={picks[0]} />
      </div>

      {/* ══ Footer ══ */}
      <footer
        className="border-t"
        style={{ borderColor: "#CBD5E1", backgroundColor: "#F4F6F8" }}
      >
        <div className="max-w-6xl mx-auto px-8 py-12 flex items-center justify-between">
          <p
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#4B5563" }}
          >
            Wander · A travel copilot, gentler than a search engine.
          </p>
          <p
            className="text-xs tracking-[0.18em] uppercase tabular-nums"
            style={{ fontFamily: "var(--font-body)", color: "#6B7280" }}
          >
            Mock Preview · Design Language Exploration · 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
