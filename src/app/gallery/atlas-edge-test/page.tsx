import { RouteAtlas } from "@/components/recs/RouteAtlas";

const SCENARIOS: { title: string; originCode: string; picks: { slug: string; name: string; state: string; lat: number; lng: number; rank: number }[] }[] = [
  {
    title: "Edge-of-CONUS picks (the cases user reported)",
    originCode: "NYC",
    picks: [
      { slug: "acadia-me", name: "Acadia NP", state: "ME", lat: 44.35, lng: -68.21, rank: 1 },
      { slug: "key-west-fl", name: "Key West", state: "FL", lat: 24.555, lng: -81.78, rank: 2 },
      { slug: "olympic-np-wa", name: "Olympic NP", state: "WA", lat: 47.97, lng: -123.5, rank: 3 },
      { slug: "san-diego-ca", name: "San Diego", state: "CA", lat: 32.715, lng: -117.16, rank: 4 },
    ],
  },
  {
    title: "Non-CONUS — territories + AK + HI",
    originCode: "NYC",
    picks: [
      { slug: "denali-ak", name: "Denali NP", state: "AK", lat: 63.07, lng: -151.0, rank: 1 },
      { slug: "haleakala-hi", name: "Haleakalā", state: "HI", lat: 20.71, lng: -156.17, rank: 2 },
      { slug: "san-juan-pr", name: "San Juan", state: "PR", lat: 18.47, lng: -66.11, rank: 3 },
      { slug: "st-john-vi", name: "St. John", state: "VI", lat: 18.34, lng: -64.73, rank: 4 },
    ],
  },
  {
    title: "Long names near right edge (label-overflow stress)",
    originCode: "NYC",
    picks: [
      { slug: "outer-banks-nc", name: "Outer Banks Cape Hatteras", state: "NC", lat: 35.25, lng: -75.55, rank: 1 },
      { slug: "cape-cod-ma", name: "Cape Cod National Seashore", state: "MA", lat: 41.83, lng: -69.96, rank: 2 },
      { slug: "key-largo-fl", name: "Key Largo Reefs", state: "FL", lat: 25.08, lng: -80.45, rank: 3 },
      { slug: "bar-harbor-me", name: "Bar Harbor + Mt Desert", state: "ME", lat: 44.39, lng: -68.20, rank: 4 },
    ],
  },
  {
    title: "Realistic demo trip — Charleston, Acadia, Asheville, Big Sur",
    originCode: "NYC",
    picks: [
      { slug: "charleston-sc", name: "Charleston", state: "SC", lat: 32.78, lng: -79.93, rank: 1 },
      { slug: "acadia-np-me", name: "Acadia National Park", state: "ME", lat: 44.35, lng: -68.21, rank: 2 },
      { slug: "asheville-nc", name: "Asheville", state: "NC", lat: 35.59, lng: -82.55, rank: 3 },
      { slug: "big-sur-ca", name: "Big Sur", state: "CA", lat: 36.27, lng: -121.81, rank: 4 },
    ],
  },
  {
    title: "Northeast cluster — Boston, Cape Cod, Newport, Hudson Valley",
    originCode: "NYC",
    picks: [
      { slug: "boston-ma", name: "Boston", state: "MA", lat: 42.36, lng: -71.06, rank: 1 },
      { slug: "cape-cod-ma", name: "Cape Cod", state: "MA", lat: 41.83, lng: -69.96, rank: 2 },
      { slug: "newport-ri", name: "Newport", state: "RI", lat: 41.49, lng: -71.31, rank: 3 },
      { slug: "hudson-valley-ny", name: "Hudson Valley", state: "NY", lat: 41.78, lng: -74.0, rank: 4 },
    ],
  },
];

export default function AtlasEdgeTestPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12" style={{ background: "var(--paper)" }}>
      <h1 className="mb-2 text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        RouteAtlas — edge-case visual test
      </h1>
      <p className="mb-10 text-sm text-[var(--ink-soft)]">
        Confirms picks near map edges + territories outside Albers-USA render visibly.
      </p>
      {SCENARIOS.map((s) => (
        <section key={s.title} className="mb-14">
          <h2 className="mb-3 text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
            {s.title}
          </h2>
          <div
            className="rounded-3xl border border-[var(--hairline)] bg-white p-6 md:p-10"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <RouteAtlas originCode={s.originCode} picks={s.picks} />
          </div>
        </section>
      ))}
    </main>
  );
}
