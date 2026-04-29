import Link from "next/link";

export const metadata = { title: "Gallery — Trip Planner" };

interface Variant {
  slug: string;
  name: string;
  vibe: string;
  description: string;
}

const VARIANTS: Variant[] = [
  { slug: "v1-editorial", name: "01 — Editorial Magazine", vibe: "Vogue / NYT travel", description: "Big serifs, asymmetric grids, generous whitespace. Print-feel." },
  { slug: "v2-brutalist", name: "02 — Brutalist", vibe: "Raw / monospace", description: "Hard edges, exposed grid, mono type, black + sharp accent." },
  { slug: "v3-pastel", name: "03 — Soft Pastel", vibe: "Notion / Linear", description: "Rounded, pastel gradients, friendly sans, micro-illustrations." },
  { slug: "v4-map", name: "04 — Map-Centric", vibe: "Atlas overlay", description: "Stylized US map with pins; cards anchored to destinations." },
  { slug: "v5-polaroid", name: "05 — Polaroid Scrapbook", vibe: "Travel journal", description: "Taped photos, handwritten labels, paper texture." },
  { slug: "v6-y2k", name: "06 — Y2K Maximalist", vibe: "Chrome / retro-future", description: "Gradient meshes, chrome text, glassy + reflective." },
  { slug: "v7-swiss", name: "07 — Swiss Minimal", vibe: "Helvetica grid", description: "Pure typographic hierarchy, ratios, almost no color." },
  { slug: "v8-premium", name: "08 — Travel Brand Premium", vibe: "Airbnb meets Apple", description: "Photography-first, full-bleed hero, tight metadata." },
  { slug: "v9-terminal", name: "09 — Terminal CLI", vibe: "Hacker green-on-black", description: "ASCII frames, monospace, prompt-style interactions." },
  { slug: "v10-boarding", name: "10 — Boarding Pass", vibe: "Ticket stub", description: "Perforated edges, departure/arrival, stamps and barcodes." },
  { slug: "v11-booking", name: "11 — Booking.com", vibe: "Utility · dense info", description: "Blue + yellow urgency, rating chip, deal banners, reservation list." },
  { slug: "v12-tripadvisor", name: "12 — TripAdvisor", vibe: "Reviews · owl-green", description: "Big rating bubbles, traveler reviews, Travelers' Choice badges." },
  { slug: "v13-atlas-obscura", name: "13 — Atlas Obscura", vibe: "Discovery editorial", description: "Sepia + dark teal, vintage cartographic flourishes, secret-knowledge tone." },
  { slug: "v14-hopper", name: "14 — Hopper", vibe: "Playful mobile-first", description: "Bright purples & pinks, big rounded buttons, mascot energy." },
  { slug: "v15-apple-guides", name: "15 — Apple Maps Guides", vibe: "System glass cards", description: "Clean SF Pro, blurred glass, soft Apple-system aesthetic." },
];

export default function GalleryIndex() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-3">Design Exploration</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Fifteen directions for the trip planner</h1>
          <p className="text-neutral-400 mt-4 max-w-2xl text-sm leading-relaxed">
            Same trip, same four destinations, fifteen different visual languages. Click in to see how each variant
            renders the cards. None are wired to real data — this is purely about picking a direction.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/gallery/${v.slug}`}
                className="block p-5 rounded-lg border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-colors h-full"
              >
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">{v.vibe}</div>
                <div className="text-lg font-medium mb-2">{v.name}</div>
                <div className="text-sm text-neutral-400 leading-relaxed">{v.description}</div>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-16 text-xs text-neutral-600 border-t border-neutral-900 pt-6">
          Mock data only. The 4 picks shown in every variant are: Charleston, Acadia, Asheville, Savannah —
          for a 4-day fall trip from NYC, scenic + foodie + chill, $1–2k budget.
        </footer>
      </div>
    </main>
  );
}
