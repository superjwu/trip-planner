import Link from "next/link";

export const metadata = { title: "Design Reference — Trip Planner" };

interface Variant {
  slug: string;
  name: string;
  vibe: string;
  description: string;
  swatches: string[];
}

const VARIANTS: Variant[] = [
  {
    slug: "v54d-coastal-slate",
    name: "Coastal Slate · Reference",
    vibe: "The shipped design language",
    description:
      "Cool slate paper with a warm coral CTA, deep slate-blue display ink, biophilic curves, real US map (d3-geo + us-atlas), DM Sans / Manrope. This is the language /plan and /trips/[id] now run.",
    swatches: ["#F4F6F8", "#2C5474", "#E76F51", "#84A98C"],
  },
  {
    slug: "v54-app-tour",
    name: "App Tour",
    vibe: "5 screens · full-app preview",
    description:
      "The same coastal-slate language across landing → planner wizard → trip results (matrix + map + cards) → refine round → expanded pick + booking handoff. Static mockup — proves the language holds across every surface.",
    swatches: ["#F4F6F8", "#2C5474", "#E76F51", "#C0875F"],
  },
];

const ACCENT = "#2C5474"; // slate-primary, matching the live tokens

export default function GalleryIndex() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 25%, rgba(231,111,81,0.10), transparent 65%), radial-gradient(ellipse 50% 35% at 80% 75%, rgba(44,84,116,0.10), transparent 60%), var(--paper)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <p
            className="text-[10px] uppercase tracking-[0.32em] mb-6"
            style={{ color: ACCENT, fontFamily: "var(--font-body)" }}
          >
            DESIGN REFERENCE · COASTAL SLATE
          </p>
          <h1
            className="text-5xl md:text-7xl tracking-tight leading-[0.95] mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ink)" }}
          >
            The <em className="italic" style={{ color: ACCENT }}>language</em> we ship.
          </h1>
          <p
            className="max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
          >
            After several rounds of exploration, the trip planner ships in the coastal-slate
            language: cool slate paper, a single warm coral CTA, deep slate-blue display ink,
            biophilic curves, real US-map cartography. This page is the canonical reference —
            the live app surfaces (<Link href="/plan" className="underline transition hover:opacity-70" style={{ color: ACCENT }}>/plan</Link>{" "}
            and <Link href="/trips" className="underline transition hover:opacity-70" style={{ color: ACCENT }}>/trips</Link>) inherit
            from it.
          </p>
        </div>
      </section>

      {/* ── Variants ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VARIANTS.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/gallery/${v.slug}`}
                className="group block p-8 rounded-3xl border bg-white transition-all duration-200 h-full hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--hairline)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {/* Swatch strip */}
                <div className="flex gap-1.5 mb-6">
                  {v.swatches.map((hex, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="block w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: hex,
                        boxShadow: "inset 0 0 0 1px rgba(31,41,55,0.08)",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] mb-3"
                  style={{ color: ACCENT, fontFamily: "var(--font-body)" }}
                >
                  {v.vibe}
                </p>
                <h2
                  className="text-2xl tracking-tight mb-3 transition-colors"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ink)" }}
                >
                  {v.name}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
                >
                  {v.description}
                </p>
                <div
                  className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.22em]"
                  style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
                >
                  <span
                    className="block h-px"
                    style={{ width: "1.5rem", backgroundColor: ACCENT, opacity: 0.6 }}
                  />
                  Open →
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Footer ── */}
        <footer
          className="mt-20 pt-10 border-t flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          style={{ borderColor: "var(--hairline)" }}
        >
          <p
            className="italic text-base leading-relaxed max-w-md"
            style={{ color: "var(--ink-soft)", fontFamily: "var(--font-display)" }}
          >
            Mock data only. Every variant renders the same trip — Charleston, Acadia, Asheville,
            Savannah — for a 4-day fall trip from NYC.
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
          >
            TRIP PLANNER · 2026 · COASTAL SLATE
          </p>
        </footer>
      </div>
    </main>
  );
}
