// Shared mock data for /gallery variants. All variants render the same trip
// + 4 picks so the user can compare aesthetics apples-to-apples.

export interface GalleryPick {
  slug: string;
  name: string;
  region: string; // e.g. "Lowcountry, South Carolina"
  state: string;
  tags: string[];
  blurb: string;
  reasoning: string;
  matchTags: string[];
  rank: number;
  heroPhotoUrl: string;
  weather: { highF: number; lowF: number; summary: string };
  cost: { totalUsd: number; flightUsd: number; lodgingUsd: number };
  attractions: { name: string; description: string }[];
  itinerary: { day: number; title: string; description: string }[];
}

export interface GalleryTrip {
  origin: string; // "New York City"
  originCode: string; // "NYC"
  departOn: string; // "2026-09-12"
  returnOn: string; // "2026-09-16"
  tripLengthDays: number;
  vibes: string[];
  budgetBand: string; // "$1,000 – $2,000"
  pace: string;
  seasonHint: string;
  dislikes: string;
}

export const TRIP: GalleryTrip = {
  origin: "New York City",
  originCode: "NYC",
  departOn: "2026-09-12",
  returnOn: "2026-09-16",
  tripLengthDays: 4,
  vibes: ["scenic", "foodie", "chill"],
  budgetBand: "$1,000 – $2,000",
  pace: "balanced",
  seasonHint: "fall",
  dislikes: "crowds, big resorts",
};

export const PICKS: GalleryPick[] = [
  {
    slug: "charleston-sc",
    name: "Charleston",
    region: "Lowcountry, South Carolina",
    state: "SC",
    tags: ["foodie", "scenic", "chill", "cultural"],
    blurb:
      "Antebellum row houses, oyster bars, and the Battery at golden hour. A walkable Southern food capital that quiets down after Labor Day.",
    reasoning:
      "Hits all three priorities: foodie credentials with Husk and the oyster scene, scenic in a uniquely Southern way along the Battery, and chill enough to be walkable end to end. September is Charleston's shoulder-season sweet spot — humidity drops, tourists thin out.",
    matchTags: ["foodie", "scenic", "chill", "short flight", "shoulder season"],
    rank: 1,
    heroPhotoUrl: "https://picsum.photos/seed/charleston-sc/1600/900",
    weather: { highF: 82, lowF: 68, summary: "Warm, humid, occasional showers" },
    cost: { totalUsd: 1240, flightUsd: 280, lodgingUsd: 560 },
    attractions: [
      { name: "The Battery", description: "Waterfront promenade lined with antebellum mansions and live oaks." },
      { name: "Husk", description: "Sean Brock's flagship restaurant — defining modern Southern cuisine." },
      { name: "Sullivan's Island", description: "Wide, uncrowded barrier-island beach 15 minutes from downtown." },
    ],
    itinerary: [
      { day: 1, title: "Land + Battery walk", description: "Drop bags downtown; stroll the Battery and White Point Garden as the light gets good. Dinner at Husk." },
      { day: 2, title: "King Street + cooking class", description: "Morning walking tour, antiques on lower King, oyster lunch at Leon's. Afternoon Lowcountry cooking class." },
      { day: 3, title: "Sullivan's Island", description: "10-minute drive to wide, uncrowded beach. Lunch at The Obstinate Daughter. Sunset cocktails at The Gin Joint." },
      { day: 4, title: "Brunch + fly", description: "Brunch at Hominy Grill, last walk through the French Quarter, afternoon flight." },
    ],
  },
  {
    slug: "acadia-np",
    name: "Acadia",
    region: "Mount Desert Island, Maine",
    state: "ME",
    tags: ["nature", "scenic", "chill"],
    blurb:
      "Pink granite cliffs meet the Atlantic. Lobster rolls, popovers at Jordan Pond, and Cadillac Mountain sunrise — quiet after Labor Day.",
    reasoning:
      "September in Acadia is the rare combination of crisp-not-cold weather, just-pre-foliage colors, and the Atlantic at its calmest. Pink granite and lobster rolls without the August crowds.",
    matchTags: ["scenic", "foodie", "shoulder season", "small crowds"],
    rank: 2,
    heroPhotoUrl: "https://picsum.photos/seed/acadia-np/1600/900",
    weather: { highF: 67, lowF: 52, summary: "Cool, crisp, mostly clear" },
    cost: { totalUsd: 1380, flightUsd: 320, lodgingUsd: 600 },
    attractions: [
      { name: "Cadillac Mountain", description: "First place in the U.S. to see the sunrise from October through March." },
      { name: "Jordan Pond House", description: "Tea and popovers tradition since 1893, with views of the Bubbles." },
      { name: "Schoodic Peninsula", description: "Acadia's quieter mainland section across Frenchman Bay." },
    ],
    itinerary: [
      { day: 1, title: "Bar Harbor arrival", description: "Fly to BHB, pick up rental car, settle in. Sunset drive up Cadillac Mountain." },
      { day: 2, title: "Park Loop + Jordan Pond", description: "Drive the Park Loop Road. Walk Jordan Pond Path; popovers at the Jordan Pond House for tea." },
      { day: 3, title: "Schoodic + lobster", description: "Drive across to the quieter Schoodic Peninsula. Lobster shack lunch at Beals." },
      { day: 4, title: "Tide pools, fly home", description: "Morning at Thunder Hole and Otter Cliffs. Afternoon flight from Bangor." },
    ],
  },
  {
    slug: "asheville-nc",
    name: "Asheville",
    region: "Blue Ridge Mountains, North Carolina",
    state: "NC",
    tags: ["foodie", "scenic", "cultural"],
    blurb:
      "Mountain town wrapped in the Blue Ridge Parkway, with one of the densest food + craft-brewery scenes in the South.",
    reasoning:
      "Mountain town with a dense food + craft-brewery scene plus the Blue Ridge Parkway out the back door. September hits early color in the highest elevations — scenic without feeling on display.",
    matchTags: ["foodie", "scenic", "mountain views"],
    rank: 3,
    heroPhotoUrl: "https://picsum.photos/seed/asheville-nc/1600/900",
    weather: { highF: 76, lowF: 56, summary: "Mild days, cool evenings" },
    cost: { totalUsd: 1090, flightUsd: 240, lodgingUsd: 480 },
    attractions: [
      { name: "Blue Ridge Parkway", description: "America's most-visited national park unit, mile after mile of overlooks." },
      { name: "Biltmore Estate", description: "Vanderbilt's 250-room mansion and 8,000-acre grounds." },
      { name: "South Slope", description: "Walkable strip of 15+ craft breweries and barbecue joints." },
    ],
    itinerary: [
      { day: 1, title: "Drive in via Parkway", description: "Fly to AVL, pick up car, take the scenic spur of the Parkway in. Dinner on the South Slope." },
      { day: 2, title: "Biltmore + dinner", description: "Spend the day at Biltmore Estate. Tasting menu at Cucina 24 in the evening." },
      { day: 3, title: "Hiking + breweries", description: "Morning hike at Craggy Gardens. Afternoon brewery crawl through downtown." },
      { day: 4, title: "Brunch + fly", description: "Sunday brunch at Sunny Point Café in West Asheville, then flight home." },
    ],
  },
  {
    slug: "savannah-ga",
    name: "Savannah",
    region: "Coastal Georgia",
    state: "GA",
    tags: ["scenic", "cultural", "foodie", "chill"],
    blurb:
      "Spanish moss draped over 22 historic squares, oak-lined streets, and a slow Southern pace that puts Charleston's bustle to shame.",
    reasoning:
      "If Charleston feels too high-traffic for you, Savannah is the quieter cousin: same Lowcountry food DNA, more atmospheric squares, and a smaller historic district that you can wander aimlessly for three days.",
    matchTags: ["scenic", "chill", "walkable", "shoulder season"],
    rank: 4,
    heroPhotoUrl: "https://picsum.photos/seed/savannah-ga/1600/900",
    weather: { highF: 84, lowF: 70, summary: "Warm, humid, scattered storms" },
    cost: { totalUsd: 1150, flightUsd: 260, lodgingUsd: 520 },
    attractions: [
      { name: "Forsyth Park", description: "30-acre centerpiece of the historic district with the iconic white fountain." },
      { name: "Bonaventure Cemetery", description: "Ethereal cemetery on the Wilmington River, draped in Spanish moss." },
      { name: "Tybee Island", description: "Wide beach + lighthouse, 20 minutes east of downtown." },
    ],
    itinerary: [
      { day: 1, title: "Squares walk", description: "Land midday, settle into a B&B near Forsyth, walk a slow loop through the squares at dusk." },
      { day: 2, title: "Cemetery + River St", description: "Morning at Bonaventure Cemetery. Afternoon along River Street; dinner at The Grey." },
      { day: 3, title: "Tybee day trip", description: "Drive 20 min to Tybee Island; lighthouse, beach, fish-shack lunch." },
      { day: 4, title: "Brunch + depart", description: "Brunch at The Collins Quarter, last walk through Forsyth, afternoon flight." },
    ],
  },
];
