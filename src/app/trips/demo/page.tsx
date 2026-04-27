import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { DestinationCard } from "@/components/recs/DestinationCard";
import { ExpandedDestination } from "@/components/recs/ExpandedDestination";
import { skyscannerFlightsUrl, bookingComLodgingUrl } from "@/lib/apis/booking-links";
import { DESTINATIONS } from "@/lib/seed/destinations";
import type {
  BookingLinks,
  CostBreakdown,
  ItineraryDay,
  NormalizedTripInput,
  RecommendationPick,
  SeedDestination,
  WeatherForecast,
} from "@/lib/types";

export const metadata = {
  title: "Demo trip — Trip Planner",
};

const MOCK_INPUT: NormalizedTripInput = {
  originCode: "NYC",
  originAirport: "JFK",
  departOn: "2026-09-12",
  returnOn: "2026-09-16",
  tripLengthDays: 4,
  vibes: ["scenic", "foodie", "chill"],
  budgetBand: "1000-2000",
  budgetCeilingUsd: 2000,
  pace: "balanced",
  seasonHint: "fall",
  dislikes: "crowds, big resorts",
};

interface MockSlot {
  pick: RecommendationPick;
  weather: WeatherForecast;
  itinerary?: ItineraryDay[];
}

const SLUGS = ["charleston-sc", "acadia-np", "asheville-nc", "big-sur-ca"] as const;

const MOCK_SLOTS: Record<(typeof SLUGS)[number], MockSlot> = {
  "charleston-sc": {
    pick: {
      slug: "charleston-sc",
      rank: 1,
      reasoning: "Hits all three of your priorities: foodie credentials with Husk and the oyster scene, scenic in a uniquely Southern way along the Battery and Rainbow Row, and chill enough to be walkable end to end. September is also Charleston's shoulder-season sweet spot — humidity drops, tourists thin out.",
      matchTags: ["foodie", "scenic", "chill", "short flight", "shoulder season"],
    },
    weather: { highF: 82, lowF: 68, precipMm: 12, summary: "Warm, humid, occasional showers" },
    itinerary: [
      { day: 1, title: "Land + Battery walk", description: "Drop bags downtown; stroll the Battery and White Point Garden as the light gets good. Dinner at Husk." },
      { day: 2, title: "King Street + cooking", description: "Morning walking tour, antiques on lower King, oyster lunch at Leon's. Afternoon hands-on Lowcountry cooking class." },
      { day: 3, title: "Sullivan's Island", description: "10-minute drive to wide, uncrowded beach. Lunch at The Obstinate Daughter. Sunset cocktails back in town at The Gin Joint." },
      { day: 4, title: "Brunch + fly", description: "Brunch at Hominy Grill, last walk through the French Quarter, afternoon flight." },
    ],
  },
  "acadia-np": {
    pick: {
      slug: "acadia-np",
      rank: 2,
      reasoning: "September in Acadia is the rare combination of crisp-not-cold weather, just-pre-foliage colors, and the Atlantic at its calmest. Pink granite and lobster rolls without the August crowds — exactly the chill scenic-foodie balance you're after.",
      matchTags: ["scenic", "foodie", "shoulder season", "small crowds"],
    },
    weather: { highF: 67, lowF: 52, precipMm: 7, summary: "Cool, crisp, mostly clear" },
    itinerary: [
      { day: 1, title: "Bar Harbor arrival", description: "Fly to BHB, pick up rental car, settle in. Sunset drive up Cadillac Mountain." },
      { day: 2, title: "Park loop + Jordan Pond", description: "Drive the Park Loop Road. Walk Jordan Pond Path; popovers at the Jordan Pond House for tea." },
      { day: 3, title: "Schoodic + lobster", description: "Drive across to the quieter Schoodic Peninsula. Lobster shack lunch at Beals." },
      { day: 4, title: "Acadia tide pools, fly home", description: "Morning at Thunder Hole and Otter Cliffs. Afternoon flight from Bangor." },
    ],
  },
  "asheville-nc": {
    pick: {
      slug: "asheville-nc",
      rank: 3,
      reasoning: "Mountain town with dense food + craft-brewery scene plus the Blue Ridge Parkway out the back door. September in the Smokies hits early color in the highest elevations — scenic without feeling on display.",
      matchTags: ["foodie", "scenic", "mountain views"],
    },
    weather: { highF: 75, lowF: 55, precipMm: 9, summary: "Mild, crisp mornings" },
    itinerary: [
      { day: 1, title: "Downtown + South Slope", description: "Walk downtown; brewery hop in South Slope; dinner at Cúrate." },
      { day: 2, title: "Blue Ridge Parkway drive", description: "Drive south to Craggy Gardens and Mount Pisgah; picnic at an overlook." },
      { day: 3, title: "River Arts + Biltmore", description: "Morning at Biltmore Estate; afternoon studio-hop the River Arts District." },
      { day: 4, title: "Brunch + fly", description: "Brunch at Sunny Point Café in West Asheville; afternoon flight." },
    ],
  },
  "big-sur-ca": {
    pick: {
      slug: "big-sur-ca",
      rank: 4,
      reasoning: "Closer for a West-Coast-bias trip but still a 5-hour-flight pick from NYC. Edges your budget unless you stay inland — but the Highway 1 cliff drive plus McWay Falls is one of the most scenic 90 miles in North America, and Nepenthe alone qualifies on the food axis.",
      matchTags: ["scenic", "iconic drive", "luxury food"],
    },
    weather: { highF: 70, lowF: 55, precipMm: 0, summary: "Sunny, clear, marine layer mornings" },
    itinerary: [
      { day: 1, title: "Fly + Carmel", description: "Fly into Monterey, drive 30 min south to Carmel-by-the-Sea. Sunset at Carmel Beach." },
      { day: 2, title: "Highway 1 south", description: "Drive Bixby Bridge, McWay Falls, Pfeiffer Beach. Lunch at Nepenthe." },
      { day: 3, title: "Hike + redwoods", description: "Pfeiffer Big Sur SP redwood loop in the morning; relaxed afternoon at Treebones." },
      { day: 4, title: "Drive back + fly", description: "Northbound back to Monterey via Point Lobos. Afternoon flight home." },
    ],
  },
};

function buildCost(dest: SeedDestination, input: NormalizedTripInput): CostBreakdown {
  const flight = dest.typicalCostBands.flightFromOrigin[input.originCode] ?? 350;
  const lodging = dest.typicalCostBands.lodgingPerNightUsd * input.tripLengthDays;
  const food = dest.typicalCostBands.foodPerDayUsd * input.tripLengthDays;
  const activities = dest.typicalCostBands.activitiesPerDayUsd * input.tripLengthDays;
  return {
    flightUsd: flight,
    lodgingUsd: lodging,
    foodUsd: food,
    activitiesUsd: activities,
    totalUsd: flight + lodging + food + activities,
    source: "estimate",
  };
}

function buildBookingLinks(dest: SeedDestination, input: NormalizedTripInput): BookingLinks {
  const iata = DEST_IATA[dest.slug] ?? "JFK";
  return {
    flights: skyscannerFlightsUrl({
      origin: input.originCode,
      destinationIata: iata,
      departOn: input.departOn,
      returnOn: input.returnOn,
    }),
    lodging: bookingComLodgingUrl({
      destinationName: dest.name,
      destinationState: dest.state,
      departOn: input.departOn,
      returnOn: input.returnOn,
    }),
  };
}

const DEST_IATA: Record<string, string> = {
  "charleston-sc": "CHS",
  "acadia-np": "BGR",
  "asheville-nc": "AVL",
  "big-sur-ca": "MRY",
};

export default function DemoTripPage() {
  const destinations = SLUGS.map((slug) => DESTINATIONS.find((d) => d.slug === slug)!);
  const featured = destinations[0];
  const featuredSlot = MOCK_SLOTS[SLUGS[0]];

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <CompareHeader input={MOCK_INPUT} destinationCount={4} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {destinations.map((dest, i) => {
            const slot = MOCK_SLOTS[SLUGS[i]];
            return (
              <DestinationCard
                key={dest.slug}
                pick={slot.pick}
                destination={dest}
                cost={buildCost(dest, MOCK_INPUT)}
                weather={slot.weather}
              />
            );
          })}
        </div>

        <div className="mt-12">
          <p className="hero-eyebrow mb-3 text-[var(--accent)]">Top pick · expanded view</p>
          <ExpandedDestination
            pick={featuredSlot.pick}
            destination={featured}
            cost={buildCost(featured, MOCK_INPUT)}
            weather={featuredSlot.weather}
            bookingLinks={buildBookingLinks(featured, MOCK_INPUT)}
            itinerary={featuredSlot.itinerary}
          />
        </div>

        <p className="mt-10 text-center text-xs text-[var(--text-muted)]">
          Demo data — preview of the v1 layout. Real recommendations land in Phase 4.
        </p>
      </main>
    </>
  );
}
