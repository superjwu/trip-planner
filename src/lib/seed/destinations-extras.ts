import type { SeedDestination } from "../types";

/**
 * Auto-imported destinations from superjwu/tourist-plan repo, transformed to
 * our schema. Geocoded via Wikipedia REST API, cost bands heuristic.
 *
 * To regenerate: npm run import:extras (or tsx scripts/import-tourist-plan-extras.ts)
 */
export const EXTRA_DESTINATIONS: SeedDestination[] = [
  {
    slug: "yellowstone",
    name: "Yellowstone National Park",
    region: "Rocky Mountains",
    state: "WY",
    lat: 44.6,
    lng: -110.5,
    tags: ["nature","scenic","cultural"],
    blurb: "The world's first national park, Yellowstone sits atop a massive volcanic hotspot and features more geysers and hot springs than anywhere else on Earth.",
    attractions: [
          {
                "name": "Yellowstone National Park center",
                "description": "Walking tour through the heart of Yellowstone National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Yellowstone National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Yellowstone National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 300, SFO: 290, SEA: 260 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "yosemite",
    name: "Yosemite National Park",
    region: "Pacific West",
    state: "CA",
    lat: 37.85,
    lng: -119.51666667,
    tags: ["nature","scenic","cultural","adventure"],
    blurb: "Yosemite's glacier-carved valley is one of the most iconic landscapes in North America.",
    attractions: [
          {
                "name": "North America",
                "description": "Yosemite's glacier-carved valley is one of the most iconic landscapes in North America."
          },
          {
                "name": "Half Dome",
                "description": "Sheer granite walls—Half Dome and El Capitan—rise thousands of feet above meadows threaded with rivers."
          },
          {
                "name": "El Capitan",
                "description": "Sheer granite walls—Half Dome and El Capitan—rise thousands of feet above meadows threaded with rivers."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 460, LAX: 200, SFO: 180, SEA: 270 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "grand-canyon",
    name: "Grand Canyon National Park",
    region: "Southwest",
    state: "AZ",
    lat: 36.0552608,
    lng: -112.1218355,
    tags: ["nature","scenic","cultural","adventure"],
    blurb: "Carved over millions of years by the Colorado River, the Grand Canyon stretches 277 miles long and descends over a mile deep.",
    attractions: [
          {
                "name": "Grand Canyon National Park center",
                "description": "Walking tour through the heart of Grand Canyon National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Grand Canyon National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Grand Canyon National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 220, SFO: 250, SEA: 320 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "zion",
    name: "Zion National Park",
    region: "Southwest",
    state: "UT",
    lat: 37.3,
    lng: -113,
    tags: ["nature","scenic","adventure"],
    blurb: "Zion's towering sandstone cliffs glow in shades of red, orange, and cream.",
    attractions: [
          {
                "name": "Zion National Park center",
                "description": "Walking tour through the heart of Zion National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Zion National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Zion National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 220, SFO: 240, SEA: 300 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "olympic",
    name: "Olympic National Park",
    region: "Pacific West",
    state: "WA",
    lat: 47.96935,
    lng: -123.49856,
    tags: ["nature","scenic","cultural","chill"],
    blurb: "Olympic is three parks in one: temperate rainforest draped in luminous moss, rugged Pacific coastline with sea stacks and tide pools, and glacier-capped mountain peaks.",
    attractions: [
          {
                "name": "Olympic National Park center",
                "description": "Walking tour through the heart of Olympic National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Olympic National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Olympic National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 470, LAX: 330, SFO: 280, SEA: 160 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "acadia",
    name: "Acadia National Park",
    region: "Northeast",
    state: "ME",
    lat: 44.35,
    lng: -68.21666667,
    tags: ["nature","scenic","chill"],
    blurb: "Acadia preserves the rugged Atlantic coastline of Mount Desert Island, the highest point on the U.S.",
    attractions: [
          {
                "name": "Acadia National Park center",
                "description": "Walking tour through the heart of Acadia National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Acadia National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Acadia National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 330, LAX: 640, SFO: 660, SEA: 610 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "great-smoky",
    name: "Great Smoky Mountains National Park",
    region: "Southeast",
    state: "Tennessee / North Carolina",
    lat: 35.61111111,
    lng: -83.425,
    tags: ["nature","scenic","cultural"],
    blurb: "The most visited national park in the U.S.",
    attractions: [
          {
                "name": "Great Smoky Mountains National Park center",
                "description": "Walking tour through the heart of Great Smoky Mountains National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Great Smoky Mountains National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Great Smoky Mountains National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 240, LAX: 510, SFO: 540, SEA: 540 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "rocky-mountain",
    name: "Rocky Mountain National Park",
    region: "Rocky Mountains",
    state: "CO",
    lat: 40.3466,
    lng: -105.7364,
    tags: ["nature","scenic"],
    blurb: "Rocky Mountain National Park offers some of the most accessible alpine scenery in the country.",
    attractions: [
          {
                "name": "Rocky Mountain National Park center",
                "description": "Walking tour through the heart of Rocky Mountain National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Rocky Mountain National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Rocky Mountain National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 320, LAX: 300, SFO: 310, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "joshua-tree",
    name: "Joshua Tree National Park",
    region: "Southwest",
    state: "CA",
    lat: 34.1,
    lng: -116.27,
    tags: ["nature","scenic","adventure"],
    blurb: "Where two deserts meet—the high Mojave and low Colorado—Joshua Tree's namesake trees twist against impossibly blue skies among massive boulder formations.",
    attractions: [
          {
                "name": "Joshua Tree National Park center",
                "description": "Walking tour through the heart of Joshua Tree National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Joshua Tree National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Joshua Tree National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 570, CHI: 450, LAX: 170, SFO: 230, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "arches",
    name: "Arches National Park",
    region: "Southwest",
    state: "UT",
    lat: 38.72805556,
    lng: -109.54,
    tags: ["nature","scenic"],
    blurb: "Arches contains the world's greatest concentration of natural stone arches—over 2,000—sculpted from red sandstone by millions of years of erosion.",
    attractions: [
          {
                "name": "Arches National Park center",
                "description": "Walking tour through the heart of Arches National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Arches National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Arches National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 260, SFO: 280, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "bryce-canyon",
    name: "Bryce Canyon National Park",
    region: "Southwest",
    state: "UT",
    lat: 37.64,
    lng: -112.17,
    tags: ["nature","scenic"],
    blurb: "Bryce Canyon is not actually a canyon but a series of natural amphitheaters filled with thousands of spire-shaped hoodoos—pillar-like rock formations that glow orange and red.",
    attractions: [
          {
                "name": "Bryce Canyon National Park center",
                "description": "Walking tour through the heart of Bryce Canyon National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Bryce Canyon National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Bryce Canyon National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 390, LAX: 230, SFO: 250, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "crater-lake",
    name: "Crater Lake National Park",
    region: "Pacific West",
    state: "OR",
    lat: 42.91183,
    lng: -122.14807,
    tags: ["nature","scenic","chill"],
    blurb: "Crater Lake is the deepest lake in the United States, formed inside the collapsed caldera of ancient Mount Mazama.",
    attractions: [
          {
                "name": "United States",
                "description": "Crater Lake is the deepest lake in the United States, formed inside the collapsed caldera of ancient Mount Mazama."
          },
          {
                "name": "Mount Mazama",
                "description": "Crater Lake is the deepest lake in the United States, formed inside the collapsed caldera of ancient Mount Mazama."
          },
          {
                "name": "Rim Drive",
                "description": "Wizard Island rises from the lake's surface as a cinder cone volcano, and the 33-mile Rim Drive offers uninterrupted panoramas.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 470, LAX: 270, SFO: 220, SEA: 210 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "badlands",
    name: "Badlands National Park",
    region: "Great Plains",
    state: "SD",
    lat: 43.75,
    lng: -102.5,
    tags: ["nature","scenic"],
    blurb: "The Badlands' sharply eroded buttes, pinnacles, and spires rise dramatically from the flat prairie.",
    attractions: [
          {
                "name": "Badlands National Park center",
                "description": "Walking tour through the heart of Badlands National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Badlands National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Badlands National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 410, CHI: 290, LAX: 350, SFO: 350, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "everglades",
    name: "Everglades National Park",
    region: "Southeast",
    state: "FL",
    lat: 25.3125,
    lng: -80.6875,
    tags: ["nature","scenic","cultural","adventure"],
    blurb: "The largest subtropical wilderness in the United States, the Everglades is a vast, slow-moving river of grass flowing from Lake Okeechobee to Florida Bay.",
    attractions: [
          {
                "name": "United States",
                "description": "The largest subtropical wilderness in the United States, the Everglades is a vast, slow-moving river of grass flowing from Lake Okeechobee to Florida Bay."
          },
          {
                "name": "Lake Okeechobee",
                "description": "The largest subtropical wilderness in the United States, the Everglades is a vast, slow-moving river of grass flowing from Lake Okeechobee to Florida Bay."
          },
          {
                "name": "Florida Bay",
                "description": "The largest subtropical wilderness in the United States, the Everglades is a vast, slow-moving river of grass flowing from Lake Okeechobee to Florida Bay."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 370, LAX: 570, SFO: 610, SEA: 640 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["winter"],
  },
  {
    slug: "grand-teton",
    name: "Grand Teton National Park",
    region: "Rocky Mountains",
    state: "WY",
    lat: 43.83333333,
    lng: -110.70083333,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "The Teton Range rises abruptly without foothills, making its jagged peaks appear impossibly dramatic against Wyoming's big sky.",
    attractions: [
          {
                "name": "Grand Teton National Park center",
                "description": "Walking tour through the heart of Grand Teton National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Grand Teton National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Grand Teton National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 290, SFO: 280, SEA: 260 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "hawaii-volcanoes",
    name: "Hawaii Volcanoes National Park",
    region: "Hawaii",
    state: "HI",
    lat: 19.38333333,
    lng: -155.2,
    tags: ["nature","scenic","cultural"],
    blurb: "One of the most dynamic places on Earth, this park encompasses Kīlauea—one of the world's most active volcanoes—and the massive Mauna Loa.",
    attractions: [
          {
                "name": "Hawaii Volcanoes National Park center",
                "description": "Walking tour through the heart of Hawaii Volcanoes National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Hawaii Volcanoes National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Hawaii Volcanoes National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 590, SFO: 570, SEA: 630 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "mount-rainier",
    name: "Mount Rainier National Park",
    region: "Pacific West",
    state: "WA",
    lat: 46.85,
    lng: -121.75,
    tags: ["nature","scenic"],
    blurb: "An active stratovolcano rising to 14,411 feet, Mount Rainier dominates the skyline of the Pacific Northwest.",
    attractions: [
          {
                "name": "Mount Rainier National Park center",
                "description": "Walking tour through the heart of Mount Rainier National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Mount Rainier National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Mount Rainier National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 460, LAX: 310, SFO: 260, SEA: 160 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "shenandoah",
    name: "Shenandoah National Park",
    region: "Southeast",
    state: "VA",
    lat: 38.53333333,
    lng: -78.35,
    tags: ["nature","scenic"],
    blurb: "Stretching 105 miles along the Blue Ridge Mountains of Virginia, Shenandoah is the closest national park to Washington, D.C.",
    attractions: [
          {
                "name": "Shenandoah National Park center",
                "description": "Walking tour through the heart of Shenandoah National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Shenandoah National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Shenandoah National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 200, CHI: 250, LAX: 550, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring","fall"],
  },
  {
    slug: "sequoia",
    name: "Sequoia National Park",
    region: "Pacific West",
    state: "CA",
    lat: 36.56472222,
    lng: -118.77277778,
    tags: ["nature","scenic"],
    blurb: "Home to the largest trees on Earth by volume, Sequoia's ancient giants have stood for over 3,000 years.",
    attractions: [
          {
                "name": "Sequoia National Park center",
                "description": "Walking tour through the heart of Sequoia National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Sequoia National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Sequoia National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 460, LAX: 180, SFO: 190, SEA: 290 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "niagara-falls",
    name: "Niagara Falls State Park",
    region: "Northeast",
    state: "NY",
    lat: 43.08,
    lng: -79.07,
    tags: ["cultural","scenic","chill"],
    blurb: "The oldest state park in the U.S., Niagara Falls State Park provides up-close access to three waterfalls—Horseshoe Falls, American Falls, and Bridal Veil Falls—that collectively form one of the wor...",
    attractions: [
          {
                "name": "Niagara Falls State Park",
                "description": "The oldest state park in the U.S., Niagara Falls State Park provides up-close access to three waterfalls—Horseshoe Falls, American Falls, and Bridal Veil Falls—that collectively form one of the world's most powerful waterfalls."
          },
          {
                "name": "Horseshoe Falls",
                "description": "The oldest state park in the U.S., Niagara Falls State Park provides up-close access to three waterfalls—Horseshoe Falls, American Falls, and Bridal Veil Falls—that collectively form one of the world's most powerful waterfalls."
          },
          {
                "name": "American Falls",
                "description": "The oldest state park in the U.S., Niagara Falls State Park provides up-close access to three waterfalls—Horseshoe Falls, American Falls, and Bridal Veil Falls—that collectively form one of the world's most powerful waterfalls."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 210, CHI: 230, LAX: 550, SFO: 560, SEA: 530 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "statue-of-liberty",
    name: "Statue of Liberty National Monument",
    region: "Northeast",
    state: "NY",
    lat: 40.69416667,
    lng: -74.04305556,
    tags: ["cultural","scenic"],
    blurb: "A gift from France dedicated in 1886, Lady Liberty has welcomed millions of immigrants to American shores and remains one of the world's most recognized symbols of freedom.",
    attractions: [
          {
                "name": "Lady Liberty",
                "description": "A gift from France dedicated in 1886, Lady Liberty has welcomed millions of immigrants to American shores and remains one of the world's most recognized symbols of freedom."
          },
          {
                "name": "New York Harbor",
                "description": "The ferry journey across New York Harbor is stunning, with views of lower Manhattan."
          },
          {
                "name": "New York City",
                "description": "The crown offers a panoramic view of New York City.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "antelope-canyon",
    name: "Antelope Canyon",
    region: "Southwest",
    state: "AZ",
    lat: 36.861964,
    lng: -111.374342,
    tags: ["scenic"],
    blurb: "The most photographed slot canyon in the American Southwest, Antelope Canyon was carved by centuries of flash floods through Navajo sandstone.",
    attractions: [
          {
                "name": "Antelope Canyon center",
                "description": "Walking tour through the heart of Antelope Canyon."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Antelope Canyon."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Antelope Canyon is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 230, SFO: 260, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "death-valley",
    name: "Death Valley National Park",
    region: "Southwest",
    state: "California / Nevada",
    lat: 36.45,
    lng: -116.85,
    tags: ["nature","scenic","adventure"],
    blurb: "Death Valley holds world records: hottest air temperature (134°F), lowest elevation in North America (Badwater Basin, −282 ft), and driest national park.",
    attractions: [
          {
                "name": "Death Valley National Park center",
                "description": "Walking tour through the heart of Death Valley National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Death Valley National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Death Valley National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 570, CHI: 440, LAX: 190, SFO: 210, SEA: 300 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "denali",
    name: "Denali National Park",
    region: "Alaska",
    state: "AK",
    lat: 63.43,
    lng: -150.32,
    tags: ["nature","scenic"],
    blurb: "Denali (formerly Mount McKinley) is the tallest peak in North America at 20,310 feet, and its base-to-summit rise is greater than that of Everest.",
    attractions: [
          {
                "name": "Denali National Park center",
                "description": "Walking tour through the heart of Denali National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Denali National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Denali National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 670, LAX: 590, SFO: 530, SEA: 430 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "canyonlands-ut",
    name: "Canyonlands National Park",
    region: "Southwest",
    state: "UT",
    lat: 38.16691,
    lng: -109.75966,
    tags: ["nature","scenic"],
    blurb: "Canyonlands is Utah's largest national park, where the Colorado and Green rivers carve the high desert plateau into three distinct districts of dramatic canyons, mesas, and buttes.",
    attractions: [
          {
                "name": "Canyonlands National Park center",
                "description": "Walking tour through the heart of Canyonlands National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Canyonlands National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Canyonlands National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 370, LAX: 250, SFO: 270, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "capitol-reef-ut",
    name: "Capitol Reef National Park",
    region: "Southwest",
    state: "UT",
    lat: 38.2,
    lng: -111.16666667,
    tags: ["nature","scenic","cultural"],
    blurb: "Capitol Reef is one of Utah's least-visited but most rewarding parks, centered on the Waterpocket Fold—a 100-mile-long buckle in the Earth's crust exposing layers of brilliantly colored rock.",
    attractions: [
          {
                "name": "Waterpocket Fold",
                "description": "Capitol Reef is one of Utah's least-visited but most rewarding parks, centered on the Waterpocket Fold—a 100-mile-long buckle in the Earth's crust exposing layers of brilliantly colored rock."
          },
          {
                "name": "Grand Wash",
                "description": "Narrow slot canyons like Grand Wash and Capitol Gorge offer intimate desert hiking experiences.."
          },
          {
                "name": "Capitol Gorge",
                "description": "Narrow slot canyons like Grand Wash and Capitol Gorge offer intimate desert hiking experiences.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 380, LAX: 240, SFO: 260, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "mesa-verde-cliff",
    name: "Mesa Verde National Park",
    region: "Rocky Mountains",
    state: "CO",
    lat: 37.1838,
    lng: -108.4887,
    tags: ["nature","scenic","cultural"],
    blurb: "Mesa Verde preserves over 5,000 archaeological sites, including the awe-inspiring Cliff Palace—the largest cliff dwelling in North America, built by the Ancestral Pueblo people around 1200 CE.",
    attractions: [
          {
                "name": "Cliff Palace",
                "description": "Mesa Verde preserves over 5,000 archaeological sites, including the awe-inspiring Cliff Palace—the largest cliff dwelling in North America, built by the Ancestral Pueblo people around 1200 CE."
          },
          {
                "name": "North America",
                "description": "Mesa Verde preserves over 5,000 archaeological sites, including the awe-inspiring Cliff Palace—the largest cliff dwelling in North America, built by the Ancestral Pueblo people around 1200 CE."
          },
          {
                "name": "Ancestral Pueblo",
                "description": "Mesa Verde preserves over 5,000 archaeological sites, including the awe-inspiring Cliff Palace—the largest cliff dwelling in North America, built by the Ancestral Pueblo people around 1200 CE."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 260, SFO: 290, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "white-sands-nm",
    name: "White Sands National Park",
    region: "Southwest",
    state: "NM",
    lat: 32.77916667,
    lng: -106.17194444,
    tags: ["nature","scenic"],
    blurb: "White Sands is the world's largest gypsum dunefield, covering 275 square miles of brilliant white sand that never heats up the way quartz sand does, making it comfortable to walk barefoot even in s...",
    attractions: [
          {
                "name": "White Sands National Park center",
                "description": "Walking tour through the heart of White Sands National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around White Sands National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine White Sands National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 280, SFO: 330, SEA: 390 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "guadalupe-mountains-tx",
    name: "Guadalupe Mountains National Park",
    region: "Southwest",
    state: "TX",
    lat: 31.91666667,
    lng: -104.86666667,
    tags: ["nature","scenic"],
    blurb: "The Guadalupe Mountains contain the highest peak in Texas—Guadalupe Peak at 8,751 feet—and represent one of the world's finest examples of an ancient marine fossil reef, the Permian Reef, once subm...",
    attractions: [
          {
                "name": "Guadalupe Mountains",
                "description": "The Guadalupe Mountains contain the highest peak in Texas—Guadalupe Peak at 8,751 feet—and represent one of the world's finest examples of an ancient marine fossil reef, the Permian Reef, once submerged beneath a shallow tropical sea."
          },
          {
                "name": "Guadalupe Peak",
                "description": "The Guadalupe Mountains contain the highest peak in Texas—Guadalupe Peak at 8,751 feet—and represent one of the world's finest examples of an ancient marine fossil reef, the Permian Reef, once submerged beneath a shallow tropical sea."
          },
          {
                "name": "Permian Reef",
                "description": "The Guadalupe Mountains contain the highest peak in Texas—Guadalupe Peak at 8,751 feet—and represent one of the world's finest examples of an ancient marine fossil reef, the Permian Reef, once submerged beneath a shallow tropical sea."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 290, SFO: 340, SEA: 400 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "big-bend-tx",
    name: "Big Bend National Park",
    region: "Southwest",
    state: "TX",
    lat: 29.25,
    lng: -103.25,
    tags: ["nature","scenic","adventure"],
    blurb: "Big Bend occupies a remote bend of the Rio Grande along the U.S.-Mexico border, encompassing the rugged Chisos Mountains, vast Chihuahuan Desert, and stunning river canyons including Santa Elena Ca...",
    attractions: [
          {
                "name": "Rio Grande",
                "description": "Big Bend occupies a remote bend of the Rio Grande along the U.S.-Mexico border, encompassing the rugged Chisos Mountains, vast Chihuahuan Desert, and stunning river canyons including Santa Elena Canyon with its 1,500-foot limestone walls."
          },
          {
                "name": "Chisos Mountains",
                "description": "Big Bend occupies a remote bend of the Rio Grande along the U.S.-Mexico border, encompassing the rugged Chisos Mountains, vast Chihuahuan Desert, and stunning river canyons including Santa Elena Canyon with its 1,500-foot limestone walls."
          },
          {
                "name": "Chihuahuan Desert",
                "description": "Big Bend occupies a remote bend of the Rio Grande along the U.S.-Mexico border, encompassing the rugged Chisos Mountains, vast Chihuahuan Desert, and stunning river canyons including Santa Elena Canyon with its 1,500-foot limestone walls."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 370, LAX: 320, SFO: 370, SEA: 440 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "carlsbad-caverns-nm",
    name: "Carlsbad Caverns National Park",
    region: "Southwest",
    state: "NM",
    lat: 32.17527778,
    lng: -104.44388889,
    tags: ["nature","scenic"],
    blurb: "Carlsbad Caverns contains one of the largest cave chambers in North America—the Big Room, a single cave chamber covering 8.2 acres with a ceiling 255 feet high.",
    attractions: [
          {
                "name": "Carlsbad Caverns National Park center",
                "description": "Walking tour through the heart of Carlsbad Caverns National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Carlsbad Caverns National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Carlsbad Caverns National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 470, CHI: 360, LAX: 300, SFO: 340, SEA: 400 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "petrified-forest-az",
    name: "Petrified Forest National Park",
    region: "Southwest",
    state: "AZ",
    lat: 35.08805556,
    lng: -109.80638889,
    tags: ["nature","scenic"],
    blurb: "Petrified Forest preserves one of the world's largest and most colorful concentrations of petrified wood, where 225-million-year-old logs have been replaced atom by atom with quartz crystals creati...",
    attractions: [
          {
                "name": "Petrified Forest National Park center",
                "description": "Walking tour through the heart of Petrified Forest National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Petrified Forest National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Petrified Forest National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 380, LAX: 240, SFO: 280, SEA: 340 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "pinnacles-ca",
    name: "Pinnacles National Park",
    region: "Pacific West",
    state: "CA",
    lat: 36.48694444,
    lng: -121.16694444,
    tags: ["nature","scenic","adventure"],
    blurb: "Pinnacles is the remnant of an ancient volcano that moved 200 miles north along the San Andreas Fault, leaving behind dramatic spires and rock formations rising above chaparral-covered hills east o...",
    attractions: [
          {
                "name": "Pinnacles National Park center",
                "description": "Walking tour through the heart of Pinnacles National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Pinnacles National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Pinnacles National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 190, SFO: 170, SEA: 290 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["winter"],
  },
  {
    slug: "channel-islands-ca",
    name: "Channel Islands National Park",
    region: "Pacific West",
    state: "CA",
    lat: 34.00833333,
    lng: -119.41666667,
    tags: ["nature","scenic","adventure"],
    blurb: "Five islands off the Southern California coast—often called the 'North American Galápagos'—harbor species found nowhere else on Earth, including the island fox and island scrub-jay.",
    attractions: [
          {
                "name": "Southern California",
                "description": "Five islands off the Southern California coast—often called the 'North American Galápagos'—harbor species found nowhere else on Earth, including the island fox and island scrub-jay."
          },
          {
                "name": "North American Gal",
                "description": "Five islands off the Southern California coast—often called the 'North American Galápagos'—harbor species found nowhere else on Earth, including the island fox and island scrub-jay."
          },
          {
                "name": "Channel Islands",
                "description": "Giant kelp forests make Channel Islands one of the world's premier scuba diving and snorkeling destinations."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 600, CHI: 470, LAX: 160, SFO: 200, SEA: 320 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "redwood-np-ca",
    name: "Redwood National and State Parks",
    region: "Pacific West",
    state: "CA",
    lat: 41.3,
    lng: -124,
    tags: ["nature","scenic","cultural","adventure"],
    blurb: "Home to the tallest trees on Earth—coast redwoods that soar above 350 feet and live for over 2,000 years—Redwood's ancient groves create a cathedral atmosphere of filtered green light and hushed awe.",
    attractions: [
          {
                "name": "Redwood National and State Parks center",
                "description": "Walking tour through the heart of Redwood National and State Parks."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Redwood National and State Parks."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Redwood National and State Parks is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 490, LAX: 260, SFO: 200, SEA: 230 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lassen-volcanic-ca",
    name: "Lassen Volcanic National Park",
    region: "Pacific West",
    state: "CA",
    lat: 40.49805556,
    lng: -121.4275,
    tags: ["nature","scenic"],
    blurb: "Lassen Peak is one of the largest plug-dome volcanoes in the world and the southernmost active peak of the Cascade Range, having last erupted between 1914 and 1917.",
    attractions: [
          {
                "name": "Lassen Volcanic National Park center",
                "description": "Walking tour through the heart of Lassen Volcanic National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Lassen Volcanic National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Lassen Volcanic National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 460, LAX: 240, SFO: 190, SEA: 240 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "north-cascades-wa",
    name: "North Cascades National Park",
    region: "Pacific West",
    state: "WA",
    lat: 48.83277778,
    lng: -121.3475,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Known as the 'American Alps,' North Cascades contains more glaciers than any other area in the contiguous United States outside of Alaska—over 300—draped across jagged peaks that rise steeply from ...",
    attractions: [
          {
                "name": "American Alps",
                "description": "Known as the 'American Alps,' North Cascades contains more glaciers than any other area in the contiguous United States outside of Alaska—over 300—draped across jagged peaks that rise steeply from deep emerald valleys."
          },
          {
                "name": "North Cascades",
                "description": "Known as the 'American Alps,' North Cascades contains more glaciers than any other area in the contiguous United States outside of Alaska—over 300—draped across jagged peaks that rise steeply from deep emerald valleys."
          },
          {
                "name": "United States",
                "description": "Known as the 'American Alps,' North Cascades contains more glaciers than any other area in the contiguous United States outside of Alaska—over 300—draped across jagged peaks that rise steeply from deep emerald valleys."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 570, CHI: 450, LAX: 340, SFO: 290, SEA: 170 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "kenai-fjords-ak",
    name: "Kenai Fjords National Park",
    region: "Alaska",
    state: "AK",
    lat: 59.91777778,
    lng: -149.9875,
    tags: ["nature","scenic","adventure"],
    blurb: "Kenai Fjords showcases the raw, dramatic meeting of land and sea along Alaska's Kenai Peninsula, where massive glaciers calve thunderously into the Pacific Ocean and fjords cut deep into a rugged c...",
    attractions: [
          {
                "name": "Kenai Peninsula",
                "description": "Kenai Fjords showcases the raw, dramatic meeting of land and sea along Alaska's Kenai Peninsula, where massive glaciers calve thunderously into the Pacific Ocean and fjords cut deep into a rugged coastline."
          },
          {
                "name": "Pacific Ocean",
                "description": "Kenai Fjords showcases the raw, dramatic meeting of land and sea along Alaska's Kenai Peninsula, where massive glaciers calve thunderously into the Pacific Ocean and fjords cut deep into a rugged coastline."
          },
          {
                "name": "Harding Icefield",
                "description": "The Harding Icefield—one of the largest icefields in the U.S.—feeds over 40 glaciers, and day cruises reveal abundant wildlife: orcas, humpback whales, sea otters, puffins, and Steller sea lions."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 660, LAX: 560, SFO: 500, SEA: 400 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "gates-of-the-arctic-ak",
    name: "Gates of the Arctic National Park",
    region: "Alaska",
    state: "AK",
    lat: 67.78333333,
    lng: -153.3,
    tags: ["nature","scenic"],
    blurb: "Entirely above the Arctic Circle, Gates of the Arctic is the northernmost and one of the wildest national parks in the United States—with no roads, no trails, and no services.",
    attractions: [
          {
                "name": "Arctic Circle",
                "description": "Entirely above the Arctic Circle, Gates of the Arctic is the northernmost and one of the wildest national parks in the United States—with no roads, no trails, and no services."
          },
          {
                "name": "United States",
                "description": "Entirely above the Arctic Circle, Gates of the Arctic is the northernmost and one of the wildest national parks in the United States—with no roads, no trails, and no services."
          },
          {
                "name": "Robert Marshall",
                "description": "Named by explorer Robert Marshall for two peaks he called the 'gates' to the Arctic wilderness, the park preserves six wild rivers, the Brooks Range peaks, and one of North America's great caribou migrations."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 680, LAX: 640, SFO: 580, SEA: 470 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "biscayne-np-fl",
    name: "Biscayne National Park",
    region: "Southeast",
    state: "FL",
    lat: 25.46944444,
    lng: -80.18611111,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Biscayne is 95% water—a remarkable underwater park protecting the northernmost Florida Keys, a living coral reef, and Biscayne Bay just south of Miami.",
    attractions: [
          {
                "name": "Biscayne National Park center",
                "description": "Walking tour through the heart of Biscayne National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Biscayne National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Biscayne National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 370, LAX: 570, SFO: 620, SEA: 640 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["winter"],
  },
  {
    slug: "dry-tortugas-fl",
    name: "Dry Tortugas National Park",
    region: "Southeast",
    state: "FL",
    lat: 24.62861111,
    lng: -82.87333333,
    tags: ["nature","scenic","cultural"],
    blurb: "Accessible only by ferry or seaplane 70 miles west of Key West, Dry Tortugas is one of the most remote national parks in the country—and one of the most magical.",
    attractions: [
          {
                "name": "Key West",
                "description": "Accessible only by ferry or seaplane 70 miles west of Key West, Dry Tortugas is one of the most remote national parks in the country—and one of the most magical."
          },
          {
                "name": "Dry Tortugas",
                "description": "Accessible only by ferry or seaplane 70 miles west of Key West, Dry Tortugas is one of the most remote national parks in the country—and one of the most magical."
          },
          {
                "name": "Fort Jefferson",
                "description": "The hexagonal Fort Jefferson, a 19th-century military fort with 16 million bricks surrounded by electric-blue Caribbean water, anchors an archipelago of seven small islands."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 370, CHI: 370, LAX: 550, SFO: 600, SEA: 630 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "congaree-np-sc",
    name: "Congaree National Park",
    region: "Southeast",
    state: "SC",
    lat: 33.78333333,
    lng: -80.78333333,
    tags: ["nature","scenic","adventure"],
    blurb: "Congaree protects the largest intact expanse of old-growth bottomland hardwood forest in the United States, sheltering trees of record-breaking height—a phenomenon created by the extremely fertile ...",
    attractions: [
          {
                "name": "Congaree National Park center",
                "description": "Walking tour through the heart of Congaree National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Congaree National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Congaree National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 270, LAX: 540, SFO: 570, SEA: 570 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "new-river-gorge-wv",
    name: "New River Gorge National Park",
    region: "Southeast",
    state: "WV",
    lat: 37.96083333,
    lng: -81.08166667,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "America's newest national park, designated in 2020, protects the stunning gorge carved by the ancient New River—one of the oldest rivers in the world—through the Appalachian Mountains of West Virginia.",
    attractions: [
          {
                "name": "New River",
                "description": "America's newest national park, designated in 2020, protects the stunning gorge carved by the ancient New River—one of the oldest rivers in the world—through the Appalachian Mountains of West Virginia."
          },
          {
                "name": "Appalachian Mountains",
                "description": "America's newest national park, designated in 2020, protects the stunning gorge carved by the ancient New River—one of the oldest rivers in the world—through the Appalachian Mountains of West Virginia."
          },
          {
                "name": "West Virginia",
                "description": "America's newest national park, designated in 2020, protects the stunning gorge carved by the ancient New River—one of the oldest rivers in the world—through the Appalachian Mountains of West Virginia."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 230, CHI: 230, LAX: 530, SFO: 550, SEA: 540 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cuyahoga-valley-oh",
    name: "Cuyahoga Valley National Park",
    region: "Great Plains",
    state: "OH",
    lat: 41.24166667,
    lng: -81.54972222,
    tags: ["nature","scenic","cultural","chill"],
    blurb: "Nestled between Cleveland and Akron, Cuyahoga Valley is a surprising green sanctuary along the Cuyahoga River that tells the story of American industrial history and ecological recovery.",
    attractions: [
          {
                "name": "Cuyahoga Valley",
                "description": "Nestled between Cleveland and Akron, Cuyahoga Valley is a surprising green sanctuary along the Cuyahoga River that tells the story of American industrial history and ecological recovery."
          },
          {
                "name": "Cuyahoga River",
                "description": "Nestled between Cleveland and Akron, Cuyahoga Valley is a surprising green sanctuary along the Cuyahoga River that tells the story of American industrial history and ecological recovery."
          },
          {
                "name": "Towpath Trail",
                "description": "The Towpath Trail follows a historic canal route, and the Cuyahoga Valley Scenic Railroad offers leisurely journeys past covered bridges, waterfalls, and wildlife.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 210, LAX: 520, SFO: 540, SEA: 520 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "isle-royale-mi",
    name: "Isle Royale National Park",
    region: "Great Plains",
    state: "MI",
    lat: 48.01,
    lng: -88.85,
    tags: ["nature","scenic","adventure"],
    blurb: "Isle Royale is an island wilderness in Lake Superior, accessible only by ferry or floatplane, offering one of the most pristine backcountry experiences in the eastern United States.",
    attractions: [
          {
                "name": "Lake Superior",
                "description": "Isle Royale is an island wilderness in Lake Superior, accessible only by ferry or floatplane, offering one of the most pristine backcountry experiences in the eastern United States."
          },
          {
                "name": "United States",
                "description": "Isle Royale is an island wilderness in Lake Superior, accessible only by ferry or floatplane, offering one of the most pristine backcountry experiences in the eastern United States."
          },
          {
                "name": "Milky Way",
                "description": "No roads cross the interior wilderness, and the park closes entirely in winter, preserving an authentically remote experience beneath skies dark enough to show the Milky Way in stunning detail.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 230, LAX: 480, SFO: 480, SEA: 430 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "voyageurs-np-mn",
    name: "Voyageurs National Park",
    region: "Great Plains",
    state: "MN",
    lat: 48.5,
    lng: -92.88333333,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Voyageurs is a water-based park on the border of Minnesota and Canada, where the only way to explore the heart of the park is by boat—canoe, kayak, houseboat, or motorcraft.",
    attractions: [
          {
                "name": "Voyageurs National Park center",
                "description": "Walking tour through the heart of Voyageurs National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Voyageurs National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Voyageurs National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 340, CHI: 240, LAX: 450, SFO: 450, SEA: 390 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "theodore-roosevelt-nd",
    name: "Theodore Roosevelt National Park",
    region: "Great Plains",
    state: "ND",
    lat: 46.96666667,
    lng: -103.45,
    tags: ["nature","scenic"],
    blurb: "Theodore Roosevelt National Park honors the President who credited the North Dakota Badlands with inspiring his conservation ethic, protecting the rugged painted badlands along the Little Missouri ...",
    attractions: [
          {
                "name": "Roosevelt National Park",
                "description": "Theodore Roosevelt National Park honors the President who credited the North Dakota Badlands with inspiring his conservation ethic, protecting the rugged painted badlands along the Little Missouri River where he ranched in the 1880s."
          },
          {
                "name": "North Dakota Badlands",
                "description": "Theodore Roosevelt National Park honors the President who credited the North Dakota Badlands with inspiring his conservation ethic, protecting the rugged painted badlands along the Little Missouri River where he ranched in the 1880s."
          },
          {
                "name": "Little Missouri River",
                "description": "Theodore Roosevelt National Park honors the President who credited the North Dakota Badlands with inspiring his conservation ethic, protecting the rugged painted badlands along the Little Missouri River where he ranched in the 1880s."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 360, SFO: 360, SEA: 310 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "wind-cave-sd",
    name: "Wind Cave National Park",
    region: "Great Plains",
    state: "SD",
    lat: 43.55635,
    lng: -103.47865,
    tags: ["nature","scenic"],
    blurb: "Wind Cave is one of the longest and most complex caves in the world, famous for rare 'boxwork' cave formations—thin calcite fins resembling a honeycomb that cover 95% of all known boxwork on Earth.",
    attractions: [
          {
                "name": "Wind Cave National Park center",
                "description": "Walking tour through the heart of Wind Cave National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Wind Cave National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Wind Cave National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 340, SFO: 340, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "hot-springs-np-ar",
    name: "Hot Springs National Park",
    region: "Southeast",
    state: "AR",
    lat: 34.51361111,
    lng: -93.05361111,
    tags: ["nature","scenic","cultural","chill"],
    blurb: "Hot Springs is the smallest and one of the oldest protected areas in the National Park System, established as a federal reservation in 1832—40 years before Yellowstone.",
    attractions: [
          {
                "name": "National Park System",
                "description": "Hot Springs is the smallest and one of the oldest protected areas in the National Park System, established as a federal reservation in 1832—40 years before Yellowstone."
          },
          {
                "name": "Hot Springs Mountain",
                "description": "Forty-seven naturally hot springs (143°F) emerge from the western slope of Hot Springs Mountain, and the elegant bathhouses along Bathhouse Row on Central Avenue once drew presidents, gangsters, and celebrities for their healing waters."
          },
          {
                "name": "Bathhouse Row",
                "description": "Forty-seven naturally hot springs (143°F) emerge from the western slope of Hot Springs Mountain, and the elegant bathhouses along Bathhouse Row on Central Avenue once drew presidents, gangsters, and celebrities for their healing waters."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 260, LAX: 410, SFO: 450, SEA: 470 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "mount-rushmore-sd",
    name: "Mount Rushmore National Memorial",
    region: "Great Plains",
    state: "SD",
    lat: 43.87888889,
    lng: -103.45916667,
    tags: ["cultural","nature"],
    blurb: "Carved into the granite face of the Black Hills, Mount Rushmore features the 60-foot-tall portraits of Presidents Washington, Jefferson, Roosevelt, and Lincoln—a monumental achievement of American ...",
    attractions: [
          {
                "name": "Black Hills",
                "description": "Carved into the granite face of the Black Hills, Mount Rushmore features the 60-foot-tall portraits of Presidents Washington, Jefferson, Roosevelt, and Lincoln—a monumental achievement of American ambition completed between 1927 and 1941."
          },
          {
                "name": "Mount Rushmore",
                "description": "Carved into the granite face of the Black Hills, Mount Rushmore features the 60-foot-tall portraits of Presidents Washington, Jefferson, Roosevelt, and Lincoln—a monumental achievement of American ambition completed between 1927 and 1941."
          },
          {
                "name": "Presidents Washington",
                "description": "Carved into the granite face of the Black Hills, Mount Rushmore features the 60-foot-tall portraits of Presidents Washington, Jefferson, Roosevelt, and Lincoln—a monumental achievement of American ambition completed between 1927 and 1941."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 340, SFO: 340, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "crazy-horse-memorial-sd",
    name: "Crazy Horse Memorial",
    region: "Great Plains",
    state: "SD",
    lat: 43.83540278,
    lng: -103.62129722,
    tags: ["cultural"],
    blurb: "The world's largest mountain carving in progress, Crazy Horse Memorial honors the legendary Oglala Lakota leader and the spirit of the North American Indian people.",
    attractions: [
          {
                "name": "Crazy Horse Memorial",
                "description": "The world's largest mountain carving in progress, Crazy Horse Memorial honors the legendary Oglala Lakota leader and the spirit of the North American Indian people."
          },
          {
                "name": "Oglala Lakota",
                "description": "The world's largest mountain carving in progress, Crazy Horse Memorial honors the legendary Oglala Lakota leader and the spirit of the North American Indian people."
          },
          {
                "name": "North American Indian",
                "description": "The world's largest mountain carving in progress, Crazy Horse Memorial honors the legendary Oglala Lakota leader and the spirit of the North American Indian people."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 340, SFO: 340, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "independence-hall-pa",
    name: "Independence Hall",
    region: "Northeast",
    state: "PA",
    lat: 39.94888889,
    lng: -75.15,
    tags: ["cultural"],
    blurb: "Independence Hall is the birthplace of American democracy—the red-brick Georgian building where the Declaration of Independence was adopted in 1776 and the U.S.",
    attractions: [
          {
                "name": "Independence Hall center",
                "description": "Walking tour through the heart of Independence Hall."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Independence Hall."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Independence Hall is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "liberty-bell-center-pa",
    name: "Liberty Bell Center",
    region: "Northeast",
    state: "PA",
    lat: 39.94944444,
    lng: -75.15027778,
    tags: ["cultural"],
    blurb: "The Liberty Bell, with its famous crack and inscription from Leviticus, has been an enduring symbol of freedom and civil rights since it rang to call colonists to hear the first reading of the Decl...",
    attractions: [
          {
                "name": "Liberty Bell Center center",
                "description": "Walking tour through the heart of Liberty Bell Center."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Liberty Bell Center."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Liberty Bell Center is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "gettysburg-nmp-pa",
    name: "Gettysburg National Military Park",
    region: "Northeast",
    state: "PA",
    lat: 39.80861111,
    lng: -77.23666667,
    tags: ["cultural","nature"],
    blurb: "The three-day Battle of Gettysburg in July 1863 was the bloodiest engagement of the Civil War, and the hallowed fields, ridges, and peach orchards where it unfolded are preserved in haunting detail.",
    attractions: [
          {
                "name": "Civil War",
                "description": "The three-day Battle of Gettysburg in July 1863 was the bloodiest engagement of the Civil War, and the hallowed fields, ridges, and peach orchards where it unfolded are preserved in haunting detail."
          },
          {
                "name": "Gettysburg Address",
                "description": "Over 1,300 monuments and markers dot the 6,000-acre battlefield, and the Gettysburg Address—delivered by Lincoln four months after the battle—still resonates from Little Round Top to Cemetery Ridge."
          },
          {
                "name": "Little Round Top",
                "description": "Over 1,300 monuments and markers dot the 6,000-acre battlefield, and the Gettysburg Address—delivered by Lincoln four months after the battle—still resonates from Little Round Top to Cemetery Ridge."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 250, LAX: 560, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "little-bighorn-battlefield-mt",
    name: "Little Bighorn Battlefield National Monument",
    region: "Rocky Mountains",
    state: "MT",
    lat: 45.57027778,
    lng: -107.4275,
    tags: ["cultural","scenic","nature"],
    blurb: "On June 25–26, 1876, Lt.",
    attractions: [
          {
                "name": "Armstrong Custer",
                "description": "George Armstrong Custer and the 7th Cavalry suffered a catastrophic defeat at the hands of Lakota Sioux and Northern Cheyenne warriors led by Crazy Horse and Sitting Bull—a battle that became the most famous clash of the American Indian Wars."
          },
          {
                "name": "Lakota Sioux",
                "description": "George Armstrong Custer and the 7th Cavalry suffered a catastrophic defeat at the hands of Lakota Sioux and Northern Cheyenne warriors led by Crazy Horse and Sitting Bull—a battle that became the most famous clash of the American Indian Wars."
          },
          {
                "name": "Northern Cheyenne",
                "description": "George Armstrong Custer and the 7th Cavalry suffered a catastrophic defeat at the hands of Lakota Sioux and Northern Cheyenne warriors led by Crazy Horse and Sitting Bull—a battle that became the most famous clash of the American Indian Wars."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 460, CHI: 330, LAX: 330, SFO: 320, SEA: 280 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chaco-culture-nhp-nm",
    name: "Chaco Culture National Historical Park",
    region: "Southwest",
    state: "NM",
    lat: 36.06,
    lng: -107.96,
    tags: ["cultural","nature"],
    blurb: "Between 850 and 1150 CE, the Chacoan people constructed massive multi-storied stone great houses—including the extraordinary Pueblo Bonito with its 600-plus rooms—that served as ceremonial, astrono...",
    attractions: [
          {
                "name": "Pueblo Bonito",
                "description": "Between 850 and 1150 CE, the Chacoan people constructed massive multi-storied stone great houses—including the extraordinary Pueblo Bonito with its 600-plus rooms—that served as ceremonial, astronomical, and trade centers for a vast road network spanning the Four Corners region."
          },
          {
                "name": "Four Corners",
                "description": "Between 850 and 1150 CE, the Chacoan people constructed massive multi-storied stone great houses—including the extraordinary Pueblo Bonito with its 600-plus rooms—that served as ceremonial, astronomical, and trade centers for a vast road network spanning the Four Corners region."
          },
          {
                "name": "American West",
                "description": "Chaco Canyon's remote high-desert setting preserves both the ancient architecture and some of the darkest night skies in the American West."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 260, SFO: 290, SEA: 340 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "devils-tower-wy",
    name: "Devils Tower National Monument",
    region: "Rocky Mountains",
    state: "WY",
    lat: 44.59055556,
    lng: -104.71527778,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Rising 867 feet above the Belle Fourche River, Devils Tower is a stunning igneous monolith of vertically fluted columns that has been sacred to Northern Plains tribes for thousands of years and is ...",
    attractions: [
          {
                "name": "Belle Fourche River",
                "description": "Rising 867 feet above the Belle Fourche River, Devils Tower is a stunning igneous monolith of vertically fluted columns that has been sacred to Northern Plains tribes for thousands of years and is America's first national monument, designated in 1906."
          },
          {
                "name": "Devils Tower",
                "description": "Rising 867 feet above the Belle Fourche River, Devils Tower is a stunning igneous monolith of vertically fluted columns that has been sacred to Northern Plains tribes for thousands of years and is America's first national monument, designated in 1906."
          },
          {
                "name": "Northern Plains",
                "description": "Rising 867 feet above the Belle Fourche River, Devils Tower is a stunning igneous monolith of vertically fluted columns that has been sacred to Northern Plains tribes for thousands of years and is America's first national monument, designated in 1906."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 340, SFO: 340, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "muir-woods-nm-ca",
    name: "Muir Woods National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 37.89194444,
    lng: -122.57083333,
    tags: ["cultural","scenic","nature"],
    blurb: "Just 12 miles north of San Francisco's Golden Gate Bridge, Muir Woods shelters one of the last old-growth coastal redwood forests in the Bay Area, where giants over 1,000 years old soar 250 feet in...",
    attractions: [
          {
                "name": "San Francisco",
                "description": "Just 12 miles north of San Francisco's Golden Gate Bridge, Muir Woods shelters one of the last old-growth coastal redwood forests in the Bay Area, where giants over 1,000 years old soar 250 feet into a cathedral canopy."
          },
          {
                "name": "Golden Gate Bridge",
                "description": "Just 12 miles north of San Francisco's Golden Gate Bridge, Muir Woods shelters one of the last old-growth coastal redwood forests in the Bay Area, where giants over 1,000 years old soar 250 feet into a cathedral canopy."
          },
          {
                "name": "Muir Woods",
                "description": "Just 12 miles north of San Francisco's Golden Gate Bridge, Muir Woods shelters one of the last old-growth coastal redwood forests in the Bay Area, where giants over 1,000 years old soar 250 feet into a cathedral canopy."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 210, SFO: 150, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "golden-gate-nra-ca",
    name: "Golden Gate National Recreation Area",
    region: "Pacific West",
    state: "CA",
    lat: 37.8,
    lng: -122.48,
    tags: ["nature","chill","city"],
    blurb: "Stretching from the Marin Headlands to the San Francisco Peninsula, Golden Gate National Recreation Area is one of the most visited units of the National Park System, wrapping the iconic Golden Gat...",
    attractions: [
          {
                "name": "Marin Headlands",
                "description": "Stretching from the Marin Headlands to the San Francisco Peninsula, Golden Gate National Recreation Area is one of the most visited units of the National Park System, wrapping the iconic Golden Gate Bridge in a mosaic of rugged coastline, rolling hills, historic forts, and sandy beaches."
          },
          {
                "name": "San Francisco Peninsula",
                "description": "Stretching from the Marin Headlands to the San Francisco Peninsula, Golden Gate National Recreation Area is one of the most visited units of the National Park System, wrapping the iconic Golden Gate Bridge in a mosaic of rugged coastline, rolling hills, historic forts, and sandy beaches."
          },
          {
                "name": "Golden Gate National Recreation",
                "description": "Stretching from the Marin Headlands to the San Francisco Peninsula, Golden Gate National Recreation Area is one of the most visited units of the National Park System, wrapping the iconic Golden Gate Bridge in a mosaic of rugged coastline, rolling hills, historic forts, and sandy beaches."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 210, SFO: 150, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "alcatraz-island-ca",
    name: "Alcatraz Island",
    region: "Pacific West",
    state: "CA",
    lat: 37.82666667,
    lng: -122.42277778,
    tags: ["cultural","scenic"],
    blurb: "Sitting in the fog-swept waters of San Francisco Bay, Alcatraz served as a forbidding federal penitentiary from 1934 to 1963, housing notorious criminals including Al Capone and Robert 'Birdman' St...",
    attractions: [
          {
                "name": "San Francisco Bay",
                "description": "Sitting in the fog-swept waters of San Francisco Bay, Alcatraz served as a forbidding federal penitentiary from 1934 to 1963, housing notorious criminals including Al Capone and Robert 'Birdman' Stroud—no inmate ever successfully escaped its cold-water isolation."
          },
          {
                "name": "Al Capone",
                "description": "Sitting in the fog-swept waters of San Francisco Bay, Alcatraz served as a forbidding federal penitentiary from 1934 to 1963, housing notorious criminals including Al Capone and Robert 'Birdman' Stroud—no inmate ever successfully escaped its cold-water isolation."
          },
          {
                "name": "Bay Bridge",
                "description": "The island also offers sweeping views of the Bay Bridge and San Francisco skyline, and its rocky shores are home to nesting seabird colonies.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 210, SFO: 150, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "monument-valley-navajo-az",
    name: "Monument Valley Navajo Tribal Park",
    region: "Southwest",
    state: "AZ",
    lat: 36.98333333,
    lng: -110.1,
    tags: ["scenic"],
    blurb: "Rising from a vast rust-colored desert plain, the sandstone buttes and mesas of Monument Valley—The Mittens, Merrick Butte, and the iconic John Ford's Point—are among the most photographed landscap...",
    attractions: [
          {
                "name": "Monument Valley",
                "description": "Rising from a vast rust-colored desert plain, the sandstone buttes and mesas of Monument Valley—The Mittens, Merrick Butte, and the iconic John Ford's Point—are among the most photographed landscapes on Earth, immortalized in countless Westerns and road-trip photographs."
          },
          {
                "name": "The Mittens",
                "description": "Rising from a vast rust-colored desert plain, the sandstone buttes and mesas of Monument Valley—The Mittens, Merrick Butte, and the iconic John Ford's Point—are among the most photographed landscapes on Earth, immortalized in countless Westerns and road-trip photographs."
          },
          {
                "name": "Merrick Butte",
                "description": "Rising from a vast rust-colored desert plain, the sandstone buttes and mesas of Monument Valley—The Mittens, Merrick Butte, and the iconic John Ford's Point—are among the most photographed landscapes on Earth, immortalized in countless Westerns and road-trip photographs."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 370, LAX: 240, SFO: 270, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "rainbow-bridge-nm-ut",
    name: "Rainbow Bridge National Monument",
    region: "Southwest",
    state: "UT",
    lat: 37.07722222,
    lng: -110.96416667,
    tags: ["cultural","scenic","nature","chill"],
    blurb: "Rainbow Bridge is the world's largest known natural bridge, spanning 275 feet across a canyon with a height of 290 feet—tall enough to encompass the U.S.",
    attractions: [
          {
                "name": "San Juan Southern Paiute",
                "description": "Sacred to Navajo, Hopi, San Juan Southern Paiute, and Ute Mountain peoples, the site lies within Glen Canyon National Recreation Area and is most easily reached by boat across Lake Powell."
          },
          {
                "name": "Ute Mountain",
                "description": "Sacred to Navajo, Hopi, San Juan Southern Paiute, and Ute Mountain peoples, the site lies within Glen Canyon National Recreation Area and is most easily reached by boat across Lake Powell."
          },
          {
                "name": "Glen Canyon National Recreation",
                "description": "Sacred to Navajo, Hopi, San Juan Southern Paiute, and Ute Mountain peoples, the site lies within Glen Canyon National Recreation Area and is most easily reached by boat across Lake Powell."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 380, LAX: 230, SFO: 260, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "natural-bridges-nm-ut",
    name: "Natural Bridges National Monument",
    region: "Southwest",
    state: "UT",
    lat: 37.6013829,
    lng: -110.0137437,
    tags: ["cultural","scenic","nature"],
    blurb: "Natural Bridges contains three of the world's largest natural bridges—Sipapu, Kachina, and Owachomo—carved by White Canyon's meandering stream through cream-colored Cedar Mesa Sandstone over millio...",
    attractions: [
          {
                "name": "White Canyon",
                "description": "Natural Bridges contains three of the world's largest natural bridges—Sipapu, Kachina, and Owachomo—carved by White Canyon's meandering stream through cream-colored Cedar Mesa Sandstone over millions of years."
          },
          {
                "name": "Cedar Mesa Sandstone",
                "description": "Natural Bridges contains three of the world's largest natural bridges—Sipapu, Kachina, and Owachomo—carved by White Canyon's meandering stream through cream-colored Cedar Mesa Sandstone over millions of years."
          },
          {
                "name": "Bridge View Drive",
                "description": "The 9-mile Bridge View Drive connects overlooks above each span, while a challenging trail links all three bridges in a rewarding backcountry loop through ancient Ancestral Puebloan ruins."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 370, LAX: 250, SFO: 270, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "craters-of-the-moon-nm-id",
    name: "Craters of the Moon National Monument",
    region: "Rocky Mountains",
    state: "ID",
    lat: 43.46167,
    lng: -113.56271,
    tags: ["cultural","scenic","nature"],
    blurb: "Craters of the Moon preserves one of the best-preserved and most geologically recent basaltic lava fields in the continental United States—a surreal black moonscape of cinder cones, lava tubes, spa...",
    attractions: [
          {
                "name": "Craters of the Moon National Monument center",
                "description": "Walking tour through the heart of Craters of the Moon National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Craters of the Moon National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Craters of the Moon National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 280, SFO: 260, SEA: 240 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lava-beds-nm-ca",
    name: "Lava Beds National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 41.71388889,
    lng: -121.50833333,
    tags: ["cultural","scenic","nature"],
    blurb: "Lava Beds offers one of the highest concentrations of lava tube caves in North America—over 800 known caves formed when the outer crust of lava flows cooled and solidified while molten rock drained...",
    attractions: [
          {
                "name": "North America",
                "description": "Lava Beds offers one of the highest concentrations of lava tube caves in North America—over 800 known caves formed when the outer crust of lava flows cooled and solidified while molten rock drained away inside."
          },
          {
                "name": "Mushpot Cave",
                "description": "Visitors can explore more than two dozen caves independently, from the strolling-easy Mushpot Cave to wild crawls through tight squeeze passages."
          },
          {
                "name": "Modoc War",
                "description": "The monument is also the site of the Modoc War of 1872–73, where a small band of Modoc warriors held off the U.S."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 460, LAX: 250, SFO: 200, SEA: 220 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "dinosaur-nm-co",
    name: "Dinosaur National Monument",
    region: "Rocky Mountains",
    state: "CO",
    lat: 40.53333333,
    lng: -108.98333333,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Dinosaur National Monument straddles the Colorado-Utah border where the Green and Yampa Rivers carve deep canyons through colorful rock layers—and where paleontologists discovered one of the world'...",
    attractions: [
          {
                "name": "National Monument",
                "description": "Dinosaur National Monument straddles the Colorado-Utah border where the Green and Yampa Rivers carve deep canyons through colorful rock layers—and where paleontologists discovered one of the world's richest dinosaur bone quarries in 1909."
          },
          {
                "name": "Yampa Rivers",
                "description": "Dinosaur National Monument straddles the Colorado-Utah border where the Green and Yampa Rivers carve deep canyons through colorful rock layers—and where paleontologists discovered one of the world's richest dinosaur bone quarries in 1909."
          },
          {
                "name": "Quarry Exhibit Hall",
                "description": "The Quarry Exhibit Hall is built directly over an exposed rock face containing over 1,500 fossilized dinosaur bones in their original positions, providing a visceral window into the Jurassic period."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 350, LAX: 270, SFO: 280, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "jewel-cave-nm-sd",
    name: "Jewel Cave National Monument",
    region: "Great Plains",
    state: "SD",
    lat: 43.72944444,
    lng: -103.82944444,
    tags: ["cultural","scenic","nature"],
    blurb: "With over 220 miles of surveyed passages, Jewel Cave is the third-longest known cave in the world, and explorers continue to map new sections each year in the limestone beneath the Black Hills.",
    attractions: [
          {
                "name": "Jewel Cave",
                "description": "With over 220 miles of surveyed passages, Jewel Cave is the third-longest known cave in the world, and explorers continue to map new sections each year in the limestone beneath the Black Hills."
          },
          {
                "name": "Black Hills",
                "description": "With over 220 miles of surveyed passages, Jewel Cave is the third-longest known cave in the world, and explorers continue to map new sections each year in the limestone beneath the Black Hills."
          },
          {
                "name": "Wild Caving Tour",
                "description": "Ranger-guided tours range from a 30-minute scenic walk to the historic candlelight tour and the demanding half-mile spelunking Wild Caving Tour.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 300, LAX: 340, SFO: 340, SEA: 320 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "timpanogos-cave-nm-ut",
    name: "Timpanogos Cave National Monument",
    region: "Rocky Mountains",
    state: "UT",
    lat: 40.44055556,
    lng: -111.70944444,
    tags: ["cultural","scenic","nature"],
    blurb: "Timpanogos Cave is a system of three interconnected caverns high on the flanks of 11,749-foot Mount Timpanogos, reached by a steep 1.5-mile trail that climbs 1,065 feet above American Fork Canyon.",
    attractions: [
          {
                "name": "Mount Timpanogos",
                "description": "Timpanogos Cave is a system of three interconnected caverns high on the flanks of 11,749-foot Mount Timpanogos, reached by a steep 1.5-mile trail that climbs 1,065 feet above American Fork Canyon."
          },
          {
                "name": "American Fork Canyon",
                "description": "Timpanogos Cave is a system of three interconnected caverns high on the flanks of 11,749-foot Mount Timpanogos, reached by a steep 1.5-mile trail that climbs 1,065 feet above American Fork Canyon."
          },
          {
                "name": "Rocky Mountain",
                "description": "The 3-mile round-trip trail through Rocky Mountain foliage, combined with the cave tour, makes for an unforgettable day in Utah's Wasatch Range.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 380, LAX: 250, SFO: 260, SEA: 280 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "sunset-crater-volcano-nm-az",
    name: "Sunset Crater Volcano National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 35.36444444,
    lng: -111.50361111,
    tags: ["cultural","scenic","nature"],
    blurb: "Sunset Crater, which last erupted around 1085 CE, is the youngest volcanic feature in the San Francisco volcanic field, its black cinder cone summit dusted in red and orange oxidized rock that appe...",
    attractions: [
          {
                "name": "Sunset Crater Volcano National Monument center",
                "description": "Walking tour through the heart of Sunset Crater Volcano National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Sunset Crater Volcano National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Sunset Crater Volcano National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 390, LAX: 220, SFO: 260, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "wupatki-nm-az",
    name: "Wupatki National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 35.5575,
    lng: -111.39583333,
    tags: ["cultural","scenic","nature"],
    blurb: "Wupatki preserves hundreds of ancestral Puebloan sites scattered across the red-rock Painted Desert north of Flagstaff, most spectacularly the four-story, 100-room Wupatki Pueblo that was one of th...",
    attractions: [
          {
                "name": "Wupatki National Monument center",
                "description": "Walking tour through the heart of Wupatki National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Wupatki National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Wupatki National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 390, LAX: 220, SFO: 260, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "na-pali-coast",
    name: "Na Pali Coast",
    region: "Hawaii",
    state: "HI",
    lat: 22.17552,
    lng: -159.64362,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Na Pali Coast's impossibly dramatic sea cliffs soar 4,000 feet above the Pacific on Kauai's northwest shore.",
    attractions: [
          {
                "name": "Na Pali Coast center",
                "description": "Walking tour through the heart of Na Pali Coast."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Na Pali Coast."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Na Pali Coast is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 620, SFO: 590, SEA: 640 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "horseshoe-bend",
    name: "Horseshoe Bend",
    region: "Southwest",
    state: "AZ",
    lat: 36.87944444,
    lng: -111.51388889,
    tags: ["nature","scenic"],
    blurb: "The Colorado River makes an almost perfect 270-degree oxbow loop around a massive sandstone peninsula, creating one of the American Southwest's most iconic vistas.",
    attractions: [
          {
                "name": "Horseshoe Bend center",
                "description": "Walking tour through the heart of Horseshoe Bend."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Horseshoe Bend."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Horseshoe Bend is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 230, SFO: 260, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "the-wave",
    name: "The Wave",
    region: "Southwest",
    state: "AZ",
    lat: 36.9961,
    lng: -112.0061,
    tags: ["nature"],
    blurb: "Hidden in the Coyote Buttes of the Vermilion Cliffs Wilderness, The Wave is a swirling sandstone formation of undulating red and orange layers that look sculpted by a master artist.",
    attractions: [
          {
                "name": "Coyote Buttes",
                "description": "Hidden in the Coyote Buttes of the Vermilion Cliffs Wilderness, The Wave is a swirling sandstone formation of undulating red and orange layers that look sculpted by a master artist."
          },
          {
                "name": "Vermilion Cliffs Wilderness",
                "description": "Hidden in the Coyote Buttes of the Vermilion Cliffs Wilderness, The Wave is a swirling sandstone formation of undulating red and orange layers that look sculpted by a master artist."
          },
          {
                "name": "The Wave",
                "description": "Hidden in the Coyote Buttes of the Vermilion Cliffs Wilderness, The Wave is a swirling sandstone formation of undulating red and orange layers that look sculpted by a master artist."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 390, LAX: 230, SFO: 250, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "havasu-falls",
    name: "Havasu Falls",
    region: "Southwest",
    state: "AZ",
    lat: 36.25527778,
    lng: -112.69805556,
    tags: ["nature","chill"],
    blurb: "Deep within the Grand Canyon on Havasupai tribal land, Havasu Falls cascades 100 feet into a vivid turquoise pool—its otherworldly blue-green color created by high calcium carbonate content.",
    attractions: [
          {
                "name": "Havasu Falls center",
                "description": "Walking tour through the heart of Havasu Falls."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Havasu Falls."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Havasu Falls is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 210, SFO: 250, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "going-to-the-sun-road",
    name: "Going-to-the-Sun Road",
    region: "Rocky Mountains",
    state: "MT",
    lat: 48.695,
    lng: -113.817,
    tags: ["nature","scenic"],
    blurb: "Carved into the face of the Continental Divide in Glacier National Park, this 50-mile road is an engineering marvel and a breathtaking journey through alpine wilderness.",
    attractions: [
          {
                "name": "Continental Divide",
                "description": "Carved into the face of the Continental Divide in Glacier National Park, this 50-mile road is an engineering marvel and a breathtaking journey through alpine wilderness."
          },
          {
                "name": "Glacier National Park",
                "description": "Carved into the face of the Continental Divide in Glacier National Park, this 50-mile road is an engineering marvel and a breathtaking journey through alpine wilderness."
          },
          {
                "name": "Logan Pass",
                "description": "Crossing Logan Pass at 6,646 feet, the route traverses hanging gardens of wildflowers, sheer cliff faces, and panoramic vistas of glacially carved valleys.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 340, SFO: 310, SEA: 220 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "cape-hatteras",
    name: "Cape Hatteras National Seashore",
    region: "Southeast",
    state: "NC",
    lat: 35.30361111,
    lng: -75.51138889,
    tags: ["nature","chill"],
    blurb: "The Outer Banks of North Carolina form a slender barrier island chain stretching 70 miles, home to America's first national seashore and the iconic black-and-white spiral Cape Hatteras Lighthouse—t...",
    attractions: [
          {
                "name": "Outer Banks",
                "description": "The Outer Banks of North Carolina form a slender barrier island chain stretching 70 miles, home to America's first national seashore and the iconic black-and-white spiral Cape Hatteras Lighthouse—the tallest brick lighthouse in the US at 198 feet."
          },
          {
                "name": "North Carolina",
                "description": "The Outer Banks of North Carolina form a slender barrier island chain stretching 70 miles, home to America's first national seashore and the iconic black-and-white spiral Cape Hatteras Lighthouse—the tallest brick lighthouse in the US at 198 feet."
          },
          {
                "name": "Cape Hatteras Lighthouse",
                "description": "The Outer Banks of North Carolina form a slender barrier island chain stretching 70 miles, home to America's first national seashore and the iconic black-and-white spiral Cape Hatteras Lighthouse—the tallest brick lighthouse in the US at 198 feet."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 290, LAX: 590, SFO: 610, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "assateague-island",
    name: "Assateague Island",
    region: "Northeast",
    state: "Maryland / Virginia",
    lat: 37.97640833,
    lng: -75.30475556,
    tags: ["nature","chill"],
    blurb: "A 37-mile barrier island straddling Maryland and Virginia, Assateague is most famous for its herds of feral Chincoteague ponies that have roamed free for centuries.",
    attractions: [
          {
                "name": "Assateague Island center",
                "description": "Walking tour through the heart of Assateague Island."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Assateague Island."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Assateague Island is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 280, LAX: 580, SFO: 610, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "indiana-dunes",
    name: "Indiana Dunes National Park",
    region: "Great Plains",
    state: "IN",
    lat: 41.64805556,
    lng: -87.10805556,
    tags: ["nature","scenic","chill"],
    blurb: "Surprisingly close to Chicago, Indiana Dunes National Park protects 15 miles of Lake Michigan shoreline featuring massive sand dunes, rare oak savannas, and bogs harboring over 1,100 plant species—...",
    attractions: [
          {
                "name": "Indiana Dunes National Park center",
                "description": "Walking tour through the heart of Indiana Dunes National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Indiana Dunes National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Indiana Dunes National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 270, CHI: 160, LAX: 470, SFO: 490, SEA: 470 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "pictured-rocks",
    name: "Pictured Rocks National Lakeshore",
    region: "Great Plains",
    state: "MI",
    lat: 46.56222222,
    lng: -86.3125,
    tags: ["nature","adventure","chill"],
    blurb: "Multicolored sandstone cliffs streaked with mineral stains—iron red, copper green, manganese black—rise 200 feet above Lake Superior along Michigan's Upper Peninsula.",
    attractions: [
          {
                "name": "Pictured Rocks National Lakeshore center",
                "description": "Walking tour through the heart of Pictured Rocks National Lakeshore."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Pictured Rocks National Lakeshore."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Pictured Rocks National Lakeshore is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 210, LAX: 490, SFO: 500, SEA: 450 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "great-sand-dunes",
    name: "Great Sand Dunes National Park",
    region: "Rocky Mountains",
    state: "CO",
    lat: 37.7329,
    lng: -105.5121,
    tags: ["nature","scenic"],
    blurb: "North America's tallest sand dunes rise 750 feet against the backdrop of Colorado's snow-capped Sangre de Cristo Mountains, creating a surreal landscape where desert meets alpine.",
    attractions: [
          {
                "name": "Great Sand Dunes National Park center",
                "description": "Walking tour through the heart of Great Sand Dunes National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Great Sand Dunes National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Great Sand Dunes National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 330, LAX: 290, SFO: 320, SEA: 340 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "apostle-islands",
    name: "Apostle Islands National Lakeshore",
    region: "Great Plains",
    state: "WI",
    lat: 46.96527778,
    lng: -90.66416667,
    tags: ["nature","adventure","chill"],
    blurb: "Twenty-one islands dot Lake Superior's Chequamegon Bay, harboring the largest collection of historic lighthouses in the national park system.",
    attractions: [
          {
                "name": "Apostle Islands National Lakeshore center",
                "description": "Walking tour through the heart of Apostle Islands National Lakeshore."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Apostle Islands National Lakeshore."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Apostle Islands National Lakeshore is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 320, CHI: 220, LAX: 460, SFO: 460, SEA: 420 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "mammoth-cave",
    name: "Mammoth Cave National Park",
    region: "Southeast",
    state: "KY",
    lat: 37.18694444,
    lng: -86.10111111,
    tags: ["nature","scenic","cultural"],
    blurb: "With over 400 miles of surveyed passages, Mammoth Cave is the world's longest known cave system—and explorers keep finding more.",
    attractions: [
          {
                "name": "Mammoth Cave National Park center",
                "description": "Walking tour through the heart of Mammoth Cave National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Mammoth Cave National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Mammoth Cave National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 270, CHI: 210, LAX: 480, SFO: 510, SEA: 500 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "sleeping-bear-dunes",
    name: "Sleeping Bear Dunes National Lakeshore",
    region: "Great Plains",
    state: "MI",
    lat: 44.85,
    lng: -86.05,
    tags: ["nature","adventure","chill"],
    blurb: "Towering up to 450 feet above Lake Michigan, the Sleeping Bear Dunes are among the tallest freshwater dunes in the world and were voted Most Beautiful Place in America.",
    attractions: [
          {
                "name": "Lake Michigan",
                "description": "Towering up to 450 feet above Lake Michigan, the Sleeping Bear Dunes are among the tallest freshwater dunes in the world and were voted Most Beautiful Place in America."
          },
          {
                "name": "Sleeping Bear Dunes",
                "description": "Towering up to 450 feet above Lake Michigan, the Sleeping Bear Dunes are among the tallest freshwater dunes in the world and were voted Most Beautiful Place in America."
          },
          {
                "name": "Most Beautiful Place",
                "description": "Towering up to 450 feet above Lake Michigan, the Sleeping Bear Dunes are among the tallest freshwater dunes in the world and were voted Most Beautiful Place in America."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 270, CHI: 190, LAX: 490, SFO: 500, SEA: 460 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "wrangell-st-elias",
    name: "Wrangell-St. Elias National Park",
    region: "Pacific West",
    state: "AK",
    lat: 61.435,
    lng: -142.95361111,
    tags: ["nature","scenic","cultural"],
    blurb: "America's largest national park at 13.2 million acres—larger than Switzerland—encompasses four major mountain ranges, nine of North America's sixteen highest peaks, and the world's largest concentr...",
    attractions: [
          {
                "name": "Wrangell-St. Elias National Park center",
                "description": "Walking tour through the heart of Wrangell-St. Elias National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Wrangell-St. Elias National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Wrangell-St. Elias National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 620, LAX: 540, SFO: 490, SEA: 380 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "valley-of-fire",
    name: "Valley of Fire State Park",
    region: "Southwest",
    state: "NV",
    lat: 36.47222222,
    lng: -114.5375,
    tags: ["nature","chill","adventure"],
    blurb: "Nevada's oldest and largest state park earns its fiery name from vivid red Aztec sandstone formations that seem to ignite at sunrise and sunset.",
    attractions: [
          {
                "name": "Valley of Fire State Park center",
                "description": "Walking tour through the heart of Valley of Fire State Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Valley of Fire State Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Valley of Fire State Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 540, CHI: 420, LAX: 200, SFO: 230, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "garden-of-the-gods",
    name: "Garden of the Gods",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.867769,
    lng: -104.8910877,
    tags: ["nature","adventure"],
    blurb: "Jagged fins of deep-red sandstone jut 300 feet skyward against a snow-capped Pikes Peak backdrop at Garden of the Gods, one of Colorado's most photographed landscapes.",
    attractions: [
          {
                "name": "Garden of the Gods center",
                "description": "Walking tour through the heart of Garden of the Gods."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Garden of the Gods."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Garden of the Gods is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 440, CHI: 320, LAX: 300, SFO: 320, SEA: 340 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "waimea-canyon",
    name: "Waimea Canyon State Park",
    region: "Hawaii",
    state: "HI",
    lat: 22.05611111,
    lng: -159.66527778,
    tags: ["nature","chill","scenic"],
    blurb: "Called the Grand Canyon of the Pacific, Waimea Canyon stretches 14 miles long and more than 3,600 feet deep, its walls streaked with reds, browns, and greens from centuries of erosion and tropical ...",
    attractions: [
          {
                "name": "Waimea Canyon State Park center",
                "description": "Walking tour through the heart of Waimea Canyon State Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Waimea Canyon State Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Waimea Canyon State Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 620, SFO: 590, SEA: 640 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "painted-hills",
    name: "Painted Hills",
    region: "Pacific West",
    state: "OR",
    lat: 44.661,
    lng: -120.273,
    tags: ["cultural","scenic","nature"],
    blurb: "Part of John Day Fossil Beds National Monument, the Painted Hills are a geological time machine—layers of gold, black, red, and bronze mineral deposits reveal 35 million years of volcanic history.",
    attractions: [
          {
                "name": "John Day Fossil Beds",
                "description": "Part of John Day Fossil Beds National Monument, the Painted Hills are a geological time machine—layers of gold, black, red, and bronze mineral deposits reveal 35 million years of volcanic history."
          },
          {
                "name": "National Monument",
                "description": "Part of John Day Fossil Beds National Monument, the Painted Hills are a geological time machine—layers of gold, black, red, and bronze mineral deposits reveal 35 million years of volcanic history."
          },
          {
                "name": "Painted Hills",
                "description": "Part of John Day Fossil Beds National Monument, the Painted Hills are a geological time machine—layers of gold, black, red, and bronze mineral deposits reveal 35 million years of volcanic history."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 570, CHI: 450, LAX: 280, SFO: 240, SEA: 190 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "kobuk-valley",
    name: "Kobuk Valley National Park",
    region: "Pacific West",
    state: "AK",
    lat: 67.55,
    lng: -159.28333333,
    tags: ["nature","scenic"],
    blurb: "Kobuk Valley lies above the Arctic Circle in Alaska's Brooks Range, reachable only by small aircraft or river, where 25 square miles of towering Arctic sand dunes rise unexpectedly from the tundra.",
    attractions: [
          {
                "name": "Arctic Circle",
                "description": "Kobuk Valley lies above the Arctic Circle in Alaska's Brooks Range, reachable only by small aircraft or river, where 25 square miles of towering Arctic sand dunes rise unexpectedly from the tundra."
          },
          {
                "name": "Brooks Range",
                "description": "Kobuk Valley lies above the Arctic Circle in Alaska's Brooks Range, reachable only by small aircraft or river, where 25 square miles of towering Arctic sand dunes rise unexpectedly from the tundra."
          },
          {
                "name": "Great Kobuk Sand Dunes",
                "description": "The Great Kobuk Sand Dunes can reach 90°F in summer even as permafrost persists below, and half a million caribou migrate through the valley each year.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 660, SFO: 600, SEA: 490 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "saguaro",
    name: "Saguaro National Park",
    region: "Southwest",
    state: "AZ",
    lat: 32.17916667,
    lng: -110.73694444,
    tags: ["nature","scenic"],
    blurb: "Surrounding Tucson in two districts east and west, Saguaro National Park protects the symbol of the American West—the giant saguaro cactus.",
    attractions: [
          {
                "name": "Saguaro National Park center",
                "description": "Walking tour through the heart of Saguaro National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Saguaro National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Saguaro National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 410, LAX: 230, SFO: 290, SEA: 370 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "columbia-river-gorge",
    name: "Columbia River Gorge National Scenic Area",
    region: "Pacific West",
    state: "Oregon/Washington",
    lat: 45.70472222,
    lng: -121.79166667,
    tags: ["nature","scenic","chill"],
    blurb: "An 80-mile canyon carved through the Cascade Mountains where the Pacific Northwest meets high desert, the Columbia River Gorge hosts over 90 waterfalls—including Multnomah Falls, Oregon's tallest a...",
    attractions: [
          {
                "name": "Cascade Mountains",
                "description": "An 80-mile canyon carved through the Cascade Mountains where the Pacific Northwest meets high desert, the Columbia River Gorge hosts over 90 waterfalls—including Multnomah Falls, Oregon's tallest at 620 feet."
          },
          {
                "name": "Pacific Northwest",
                "description": "An 80-mile canyon carved through the Cascade Mountains where the Pacific Northwest meets high desert, the Columbia River Gorge hosts over 90 waterfalls—including Multnomah Falls, Oregon's tallest at 620 feet."
          },
          {
                "name": "Columbia River Gorge",
                "description": "An 80-mile canyon carved through the Cascade Mountains where the Pacific Northwest meets high desert, the Columbia River Gorge hosts over 90 waterfalls—including Multnomah Falls, Oregon's tallest at 620 feet."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 460, LAX: 300, SFO: 250, SEA: 170 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "congaree",
    name: "Congaree National Park",
    region: "Southeast",
    state: "SC",
    lat: 33.78333333,
    lng: -80.78333333,
    tags: ["nature","scenic"],
    blurb: "Congaree protects the largest intact expanse of old-growth bottomland hardwood forest in the United States, where cypress and tupelo trees rise from flooded floodplains to create a cathedral-like c...",
    attractions: [
          {
                "name": "Congaree National Park center",
                "description": "Walking tour through the heart of Congaree National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Congaree National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Congaree National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 270, LAX: 540, SFO: 570, SEA: 570 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "theodore-roosevelt",
    name: "Theodore Roosevelt National Park",
    region: "Great Plains",
    state: "ND",
    lat: 46.96666667,
    lng: -103.45,
    tags: ["nature","scenic","cultural"],
    blurb: "The rugged North Dakota Badlands inspired a young Theodore Roosevelt's conservation ethic when he came here to grieve his mother and wife and found solace in the untamed wilderness.",
    attractions: [
          {
                "name": "Theodore Roosevelt National Park center",
                "description": "Walking tour through the heart of Theodore Roosevelt National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Theodore Roosevelt National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Theodore Roosevelt National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 360, SFO: 360, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "kenai-fjords",
    name: "Kenai Fjords National Park",
    region: "Pacific West",
    state: "AK",
    lat: 59.91777778,
    lng: -149.9875,
    tags: ["nature","scenic","adventure"],
    blurb: "Where the Harding Icefield—one of the largest in North America—calves glaciers into icy fjords teeming with Steller sea lions, orca pods, and puffin colonies, Kenai Fjords delivers Alaska's most ac...",
    attractions: [
          {
                "name": "Harding Icefield",
                "description": "Where the Harding Icefield—one of the largest in North America—calves glaciers into icy fjords teeming with Steller sea lions, orca pods, and puffin colonies, Kenai Fjords delivers Alaska's most accessible wilderness spectacle."
          },
          {
                "name": "North America",
                "description": "Where the Harding Icefield—one of the largest in North America—calves glaciers into icy fjords teeming with Steller sea lions, orca pods, and puffin colonies, Kenai Fjords delivers Alaska's most accessible wilderness spectacle."
          },
          {
                "name": "Kenai Fjords",
                "description": "Where the Harding Icefield—one of the largest in North America—calves glaciers into icy fjords teeming with Steller sea lions, orca pods, and puffin colonies, Kenai Fjords delivers Alaska's most accessible wilderness spectacle."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 660, LAX: 560, SFO: 500, SEA: 400 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "mesa-verde-cliff-dwellings",
    name: "Mesa Verde National Park",
    region: "Southwest",
    state: "CO",
    lat: 37.1838,
    lng: -108.4887,
    tags: ["nature","scenic","cultural"],
    blurb: "Perched in the canyon alcoves of a 15-mile mesa in southwest Colorado, the ancestral Puebloan cliff dwellings of Mesa Verde are among the most remarkable archaeological sites in North America.",
    attractions: [
          {
                "name": "Mesa Verde National Park center",
                "description": "Walking tour through the heart of Mesa Verde National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Mesa Verde National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Mesa Verde National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 260, SFO: 290, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "biscayne",
    name: "Biscayne National Park",
    region: "Southeast",
    state: "FL",
    lat: 25.46944444,
    lng: -80.18611111,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Just south of Miami, Biscayne protects the northernmost Florida Keys and the largest maritime mangrove forest in the national park system—yet 95% of its 172,000 acres is water.",
    attractions: [
          {
                "name": "Biscayne National Park center",
                "description": "Walking tour through the heart of Biscayne National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Biscayne National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Biscayne National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 370, LAX: 570, SFO: 620, SEA: 640 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["winter"],
  },
  {
    slug: "cuyahoga-valley",
    name: "Cuyahoga Valley National Park",
    region: "Great Plains",
    state: "OH",
    lat: 41.24166667,
    lng: -81.54972222,
    tags: ["nature","scenic","chill","city"],
    blurb: "Nestled between Cleveland and Akron, Cuyahoga Valley protects a forested river valley that represents a remarkable comeback story—from a heavily polluted industrial river to a thriving natural corr...",
    attractions: [
          {
                "name": "Cuyahoga Valley",
                "description": "Nestled between Cleveland and Akron, Cuyahoga Valley protects a forested river valley that represents a remarkable comeback story—from a heavily polluted industrial river to a thriving natural corridor."
          },
          {
                "name": "Erie Canal",
                "description": "The historic Ohio & Erie Canal towpath follows the river for 20 miles, and Brandywine Falls drops 65 feet through a sandstone gorge draped in ferns.."
          },
          {
                "name": "Brandywine Falls",
                "description": "The historic Ohio & Erie Canal towpath follows the river for 20 miles, and Brandywine Falls drops 65 feet through a sandstone gorge draped in ferns.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 210, LAX: 520, SFO: 540, SEA: 520 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "guadalupe-mountains",
    name: "Guadalupe Mountains National Park",
    region: "Southwest",
    state: "TX",
    lat: 31.91666667,
    lng: -104.86666667,
    tags: ["nature","scenic"],
    blurb: "The Guadalupe Mountains contain the highest peaks in Texas and one of the world's greatest fossil reef complexes—the Capitan Reef, formed 265 million years ago in a vast inland sea.",
    attractions: [
          {
                "name": "Guadalupe Mountains",
                "description": "The Guadalupe Mountains contain the highest peaks in Texas and one of the world's greatest fossil reef complexes—the Capitan Reef, formed 265 million years ago in a vast inland sea."
          },
          {
                "name": "Capitan Reef",
                "description": "The Guadalupe Mountains contain the highest peaks in Texas and one of the world's greatest fossil reef complexes—the Capitan Reef, formed 265 million years ago in a vast inland sea."
          },
          {
                "name": "Chihuahuan Desert",
                "description": "El Capitan's sheer limestone escarpment towers 1,000 feet above the Chihuahuan Desert, and the annual fall foliage in McKittrick Canyon rivals New England for color despite Texas's desert setting.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 290, SFO: 340, SEA: 400 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "channel-islands",
    name: "Channel Islands National Park",
    region: "Pacific West",
    state: "CA",
    lat: 34.00833333,
    lng: -119.41666667,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Just 14 miles off the Southern California coast yet receiving fewer than 400,000 visitors a year, the five Channel Islands are a wildlife paradise often called the 'Galapagos of North America.' Isl...",
    attractions: [
          {
                "name": "Southern California",
                "description": "Just 14 miles off the Southern California coast yet receiving fewer than 400,000 visitors a year, the five Channel Islands are a wildlife paradise often called the 'Galapagos of North America.' Island foxes found nowhere else on Earth, 2,000 breeding elephant seals, and kelp forests sheltering giant sea bass make this one of the most ecologically unique parks in the country.."
          },
          {
                "name": "Channel Islands",
                "description": "Just 14 miles off the Southern California coast yet receiving fewer than 400,000 visitors a year, the five Channel Islands are a wildlife paradise often called the 'Galapagos of North America.' Island foxes found nowhere else on Earth, 2,000 breeding elephant seals, and kelp forests sheltering giant sea bass make this one of the most ecologically unique parks in the country.."
          },
          {
                "name": "North America",
                "description": "Just 14 miles off the Southern California coast yet receiving fewer than 400,000 visitors a year, the five Channel Islands are a wildlife paradise often called the 'Galapagos of North America.' Island foxes found nowhere else on Earth, 2,000 breeding elephant seals, and kelp forests sheltering giant sea bass make this one of the most ecologically unique parks in the country.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 600, CHI: 470, LAX: 160, SFO: 200, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "haleakala",
    name: "Haleakalā National Park",
    region: "Hawaii",
    state: "HI",
    lat: 20.71666667,
    lng: -156.16666667,
    tags: ["nature","scenic"],
    blurb: "Haleakalā—'House of the Sun' in Hawaiian—encompasses the world's largest dormant volcano, whose 10,023-foot summit crater stretches seven miles wide and two miles deep, a surreal alien landscape of...",
    attractions: [
          {
                "name": "Haleakalā National Park center",
                "description": "Walking tour through the heart of Haleakalā National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Haleakalā National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Haleakalā National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 600, SFO: 570, SEA: 630 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "great-basin",
    name: "Great Basin National Park",
    region: "Rocky Mountains",
    state: "NV",
    lat: 39.006,
    lng: -114.22,
    tags: ["nature","scenic"],
    blurb: "One of the least-visited and most underrated parks in the lower 48, Great Basin rises dramatically from Nevada's high desert to the 13,063-foot summit of Wheeler Peak, where a remnant glacier—the s...",
    attractions: [
          {
                "name": "Great Basin",
                "description": "One of the least-visited and most underrated parks in the lower 48, Great Basin rises dramatically from Nevada's high desert to the 13,063-foot summit of Wheeler Peak, where a remnant glacier—the southernmost in the United States—persists beneath the rocky cirque."
          },
          {
                "name": "Wheeler Peak",
                "description": "One of the least-visited and most underrated parks in the lower 48, Great Basin rises dramatically from Nevada's high desert to the 13,063-foot summit of Wheeler Peak, where a remnant glacier—the southernmost in the United States—persists beneath the rocky cirque."
          },
          {
                "name": "United States",
                "description": "One of the least-visited and most underrated parks in the lower 48, Great Basin rises dramatically from Nevada's high desert to the 13,063-foot summit of Wheeler Peak, where a remnant glacier—the southernmost in the United States—persists beneath the rocky cirque."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 230, SFO: 230, SEA: 280 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "black-canyon-gunnison",
    name: "Black Canyon of the Gunnison National Park",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.58,
    lng: -107.7275,
    tags: ["nature","scenic","adventure"],
    blurb: "Few canyons on Earth are as sheer, dark, or dramatic as Black Canyon of the Gunnison, where the Gunnison River has carved walls of ancient 1.7-billion-year-old Precambrian schist and gneiss droppin...",
    attractions: [
          {
                "name": "Black Canyon",
                "description": "Few canyons on Earth are as sheer, dark, or dramatic as Black Canyon of the Gunnison, where the Gunnison River has carved walls of ancient 1.7-billion-year-old Precambrian schist and gneiss dropping 2,722 feet in just 48 miles—some walls so narrow that sunlight reaches the canyon floor for only minutes a day."
          },
          {
                "name": "Gunnison River",
                "description": "Few canyons on Earth are as sheer, dark, or dramatic as Black Canyon of the Gunnison, where the Gunnison River has carved walls of ancient 1.7-billion-year-old Precambrian schist and gneiss dropping 2,722 feet in just 48 miles—some walls so narrow that sunlight reaches the canyon floor for only minutes a day."
          },
          {
                "name": "South Rim Drive",
                "description": "The South Rim Drive delivers a series of vertiginous overlooks, each more startling than the last, while the Painted Wall is the tallest cliff face in Colorado at 2,250 feet."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 470, CHI: 340, LAX: 270, SFO: 290, SEA: 320 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "virgin-islands",
    name: "Virgin Islands National Park",
    region: "Southeast",
    state: "U.S. Virgin Islands",
    lat: 18.33333333,
    lng: -64.73333333,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Covering nearly two-thirds of the island of St.",
    attractions: [
          {
                "name": "Virgin Islands National Park center",
                "description": "Walking tour through the heart of Virgin Islands National Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Virgin Islands National Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Virgin Islands National Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 530, LAX: 700, SFO: 700, SEA: 700 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["winter"],
  },
  {
    slug: "american-samoa",
    name: "National Park of American Samoa",
    region: "Pacific West",
    state: "American Samoa",
    lat: -14.25833333,
    lng: -170.68333333,
    tags: ["nature","scenic"],
    blurb: "The only national park south of the equator, American Samoa protects some of the most pristine tropical rainforest and coral reef ecosystems remaining in the Pacific, spread across the rugged volca...",
    attractions: [
          {
                "name": "National Park of American Samoa center",
                "description": "Walking tour through the heart of National Park of American Samoa."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around National Park of American Samoa."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine National Park of American Samoa is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 700, SFO: 700, SEA: 700 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "grand-staircase-escalante",
    name: "Grand Staircase-Escalante National Monument",
    region: "Southwest",
    state: "UT",
    lat: 37.4,
    lng: -111.68333333,
    tags: ["cultural","scenic","nature"],
    blurb: "One of the largest national monuments in the continental United States, Grand Staircase-Escalante encompasses nearly 1.9 million acres of remote Utah canyon country—a labyrinthine wilderness of slo...",
    attractions: [
          {
                "name": "United States",
                "description": "One of the largest national monuments in the continental United States, Grand Staircase-Escalante encompasses nearly 1.9 million acres of remote Utah canyon country—a labyrinthine wilderness of slot canyons, ancient petrified forests, sweeping vermilion cliffs, and some of the world's most productive dinosaur fossil beds."
          },
          {
                "name": "Grand Staircase",
                "description": "One of the largest national monuments in the continental United States, Grand Staircase-Escalante encompasses nearly 1.9 million acres of remote Utah canyon country—a labyrinthine wilderness of slot canyons, ancient petrified forests, sweeping vermilion cliffs, and some of the world's most productive dinosaur fossil beds."
          },
          {
                "name": "Lower Calf Creek Falls",
                "description": "Coyote Gulch, Peek-a-Boo and Spooky slot canyons, and the luminous Lower Calf Creek Falls waterfall are crown jewels of an area so vast and complex that decades of exploration wouldn't exhaust its wonders."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 230, SFO: 260, SEA: 310 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "bears-ears",
    name: "Bears Ears National Monument",
    region: "Southwest",
    state: "UT",
    lat: 37.62961,
    lng: -109.8676,
    tags: ["cultural","scenic","nature"],
    blurb: "Named for two distinctive buttes that rise like twin ears above Cedar Mesa, Bears Ears is one of the most culturally significant landscapes in North America, containing an estimated 100,000 archaeo...",
    attractions: [
          {
                "name": "Cedar Mesa",
                "description": "Named for two distinctive buttes that rise like twin ears above Cedar Mesa, Bears Ears is one of the most culturally significant landscapes in North America, containing an estimated 100,000 archaeological sites including cliff dwellings, kivas, rock art panels, and sacred sites of the Navajo, Hopi, Ute, and Zuni peoples."
          },
          {
                "name": "Bears Ears",
                "description": "Named for two distinctive buttes that rise like twin ears above Cedar Mesa, Bears Ears is one of the most culturally significant landscapes in North America, containing an estimated 100,000 archaeological sites including cliff dwellings, kivas, rock art panels, and sacred sites of the Navajo, Hopi, Ute, and Zuni peoples."
          },
          {
                "name": "North America",
                "description": "Named for two distinctive buttes that rise like twin ears above Cedar Mesa, Bears Ears is one of the most culturally significant landscapes in North America, containing an estimated 100,000 archaeological sites including cliff dwellings, kivas, rock art panels, and sacred sites of the Navajo, Hopi, Ute, and Zuni peoples."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 370, LAX: 250, SFO: 270, SEA: 320 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cascade-siskiyou",
    name: "Cascade-Siskiyou National Monument",
    region: "Pacific West",
    state: "OR",
    lat: 42.07777778,
    lng: -122.46111111,
    tags: ["cultural","scenic","nature"],
    blurb: "The world's first national monument designated specifically to protect a unique biological crossroads, Cascade-Siskiyou sits at the intersection of three major mountain ranges—the Cascade, Siskiyou...",
    attractions: [
          {
                "name": "Great Basin",
                "description": "The world's first national monument designated specifically to protect a unique biological crossroads, Cascade-Siskiyou sits at the intersection of three major mountain ranges—the Cascade, Siskiyou, and Great Basin—creating a biological hotspot of extraordinary plant and animal diversity."
          },
          {
                "name": "Great Basin",
                "description": "The meeting of these ranges produces microclimates where species from the Pacific rainforest, the Great Basin desert, and the Klamath Mountains intermingle in an ecological tapestry found nowhere else."
          },
          {
                "name": "Klamath Mountains",
                "description": "The meeting of these ranges produces microclimates where species from the Pacific rainforest, the Great Basin desert, and the Klamath Mountains intermingle in an ecological tapestry found nowhere else."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 600, CHI: 470, LAX: 260, SFO: 210, SEA: 220 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "organ-pipe-cactus",
    name: "Organ Pipe Cactus National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 31.954,
    lng: -112.801,
    tags: ["cultural","scenic","nature"],
    blurb: "On the U.S.-Mexico border in Arizona's Sonoran Desert, Organ Pipe Cactus National Monument is the only place in the United States where the majestic organ pipe cactus grows wild—its multi-armed col...",
    attractions: [
          {
                "name": "Sonoran Desert",
                "description": "On the U.S.-Mexico border in Arizona's Sonoran Desert, Organ Pipe Cactus National Monument is the only place in the United States where the majestic organ pipe cactus grows wild—its multi-armed columns clustering in dense forests across the sun-scorched bajadas."
          },
          {
                "name": "Organ Pipe Cactus National",
                "description": "On the U.S.-Mexico border in Arizona's Sonoran Desert, Organ Pipe Cactus National Monument is the only place in the United States where the majestic organ pipe cactus grows wild—its multi-armed columns clustering in dense forests across the sun-scorched bajadas."
          },
          {
                "name": "United States",
                "description": "On the U.S.-Mexico border in Arizona's Sonoran Desert, Organ Pipe Cactus National Monument is the only place in the United States where the majestic organ pipe cactus grows wild—its multi-armed columns clustering in dense forests across the sun-scorched bajadas."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 550, CHI: 430, LAX: 210, SFO: 270, SEA: 360 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chiricahua",
    name: "Chiricahua National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 32.00569,
    lng: -109.35672,
    tags: ["cultural","scenic","nature"],
    blurb: "A 'Wonderland of Rocks' hidden in southeastern Arizona's sky island mountains, Chiricahua's volcanic rhyolite has been sculpted over 27 million years of erosion into thousands of soaring balanced r...",
    attractions: [
          {
                "name": "Chiricahua Apache",
                "description": "Known as the homeland of the Chiricahua Apache and the stronghold of Cochise, the area carries deep historical weight alongside its geological spectacle."
          },
          {
                "name": "Rhyolite Canyon",
                "description": "The Rhyolite Canyon trail network winds through hoodoo forests where elegant trogons, rare coatimundis, and white-tailed deer share this ecological crossroads between the Rocky Mountains and the Sierra Madre.."
          },
          {
                "name": "Rocky Mountains",
                "description": "The Rhyolite Canyon trail network winds through hoodoo forests where elegant trogons, rare coatimundis, and white-tailed deer share this ecological crossroads between the Rocky Mountains and the Sierra Madre.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 250, SFO: 300, SEA: 380 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "colorado-national-monument",
    name: "Colorado National Monument",
    region: "Rocky Mountains",
    state: "CO",
    lat: 39.0425,
    lng: -108.68611111,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Just outside of Grand Junction, Colorado National Monument is one of the American West's hidden gems—a landscape of sheer-walled canyons, towering monoliths, and sweeping desert plateaus carved fro...",
    attractions: [
          {
                "name": "Grand Junction",
                "description": "Just outside of Grand Junction, Colorado National Monument is one of the American West's hidden gems—a landscape of sheer-walled canyons, towering monoliths, and sweeping desert plateaus carved from dark red Precambrian granite and rose-colored Entrada sandstone."
          },
          {
                "name": "Colorado National Monument",
                "description": "Just outside of Grand Junction, Colorado National Monument is one of the American West's hidden gems—a landscape of sheer-walled canyons, towering monoliths, and sweeping desert plateaus carved from dark red Precambrian granite and rose-colored Entrada sandstone."
          },
          {
                "name": "American West",
                "description": "Just outside of Grand Junction, Colorado National Monument is one of the American West's hidden gems—a landscape of sheer-walled canyons, towering monoliths, and sweeping desert plateaus carved from dark red Precambrian granite and rose-colored Entrada sandstone."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 350, LAX: 270, SFO: 280, SEA: 310 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "bandelier",
    name: "Bandelier National Monument",
    region: "Southwest",
    state: "NM",
    lat: 35.77888889,
    lng: -106.32111111,
    tags: ["cultural","scenic","nature"],
    blurb: "Carved into the soft volcanic tuff of Frijoles Canyon in New Mexico's Pajarito Plateau, Bandelier protects the ancient cave dwellings, cliff rooms, and great kiva of the Ancestral Puebloan people w...",
    attractions: [
          {
                "name": "Frijoles Canyon",
                "description": "Carved into the soft volcanic tuff of Frijoles Canyon in New Mexico's Pajarito Plateau, Bandelier protects the ancient cave dwellings, cliff rooms, and great kiva of the Ancestral Puebloan people who lived here from the 12th through 16th centuries."
          },
          {
                "name": "New Mexico",
                "description": "Carved into the soft volcanic tuff of Frijoles Canyon in New Mexico's Pajarito Plateau, Bandelier protects the ancient cave dwellings, cliff rooms, and great kiva of the Ancestral Puebloan people who lived here from the 12th through 16th centuries."
          },
          {
                "name": "Pajarito Plateau",
                "description": "Carved into the soft volcanic tuff of Frijoles Canyon in New Mexico's Pajarito Plateau, Bandelier protects the ancient cave dwellings, cliff rooms, and great kiva of the Ancestral Puebloan people who lived here from the 12th through 16th centuries."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 470, CHI: 350, LAX: 280, SFO: 310, SEA: 360 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "ocmulgee-mounds",
    name: "Ocmulgee Mounds National Historical Park",
    region: "Southeast",
    state: "GA",
    lat: 32.83666667,
    lng: -83.60833333,
    tags: ["cultural","scenic","nature"],
    blurb: "One of the most significant archaeological sites in the American Southeast, Ocmulgee preserves the earthwork mounds built by the Mississippian culture between 900 and 1600 CE—including a reconstruc...",
    attractions: [
          {
                "name": "American Southeast",
                "description": "One of the most significant archaeological sites in the American Southeast, Ocmulgee preserves the earthwork mounds built by the Mississippian culture between 900 and 1600 CE—including a reconstructed earth lodge whose original clay floor is over a thousand years old and still intact."
          },
          {
                "name": "Great Temple Mound",
                "description": "The Great Temple Mound rises 55 feet above a plateau above the Ocmulgee River, offering sweeping views of central Georgia."
          },
          {
                "name": "Ocmulgee River",
                "description": "The Great Temple Mound rises 55 feet above a plateau above the Ocmulgee River, offering sweeping views of central Georgia."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 270, LAX: 510, SFO: 550, SEA: 550 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "watkins-glen",
    name: "Watkins Glen State Park",
    region: "Northeast",
    state: "NY",
    lat: 42.377059,
    lng: -76.871687,
    tags: ["nature","chill","scenic"],
    blurb: "A narrow gorge carved by Glen Creek drops 200 feet over two miles through 19 waterfalls in the Finger Lakes region.",
    attractions: [
          {
                "name": "Glen Creek",
                "description": "A narrow gorge carved by Glen Creek drops 200 feet over two miles through 19 waterfalls in the Finger Lakes region."
          },
          {
                "name": "Finger Lakes",
                "description": "A narrow gorge carved by Glen Creek drops 200 feet over two miles through 19 waterfalls in the Finger Lakes region."
          },
          {
                "name": "Gorge Trail",
                "description": "The Gorge Trail passes behind curtains of falling water and through tunnels cut into 200-million-year-old shale and sandstone."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 250, LAX: 570, SFO: 580, SEA: 550 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "aztec-ruins",
    name: "Aztec Ruins National Monument",
    region: "Southwest",
    state: "NM",
    lat: 36.835837,
    lng: -107.9981235,
    tags: ["cultural","scenic"],
    blurb: "Despite its misleading name—the site was built by Ancestral Puebloans, not Aztecs—Aztec Ruins preserves one of the best-preserved great houses in the American Southwest, a 500-room masonry structur...",
    attractions: [
          {
                "name": "Ancestral Puebloans",
                "description": "Despite its misleading name—the site was built by Ancestral Puebloans, not Aztecs—Aztec Ruins preserves one of the best-preserved great houses in the American Southwest, a 500-room masonry structure built around 1100 CE that served as a ceremonial and trade center for the broader Chacoan world."
          },
          {
                "name": "Aztec Ruins",
                "description": "Despite its misleading name—the site was built by Ancestral Puebloans, not Aztecs—Aztec Ruins preserves one of the best-preserved great houses in the American Southwest, a 500-room masonry structure built around 1100 CE that served as a ceremonial and trade center for the broader Chacoan world."
          },
          {
                "name": "American Southwest",
                "description": "Despite its misleading name—the site was built by Ancestral Puebloans, not Aztecs—Aztec Ruins preserves one of the best-preserved great houses in the American Southwest, a 500-room masonry structure built around 1100 CE that served as a ceremonial and trade center for the broader Chacoan world."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 260, SFO: 290, SEA: 340 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "florissant-fossil-beds",
    name: "Florissant Fossil Beds National Monument",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.914,
    lng: -105.287,
    tags: ["cultural","scenic","nature"],
    blurb: "Thirty-four million years ago, a series of volcanic eruptions buried an Eocene-era lake in ash, entombing insects, leaves, fish, birds, and mammals with extraordinary fidelity—creating what may be ...",
    attractions: [
          {
                "name": "Florissant Fossil Beds National Monument center",
                "description": "Walking tour through the heart of Florissant Fossil Beds National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Florissant Fossil Beds National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Florissant Fossil Beds National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 320, LAX: 290, SFO: 320, SEA: 340 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "scotts-bluff",
    name: "Scotts Bluff National Monument",
    region: "Great Plains",
    state: "NE",
    lat: 41.83472222,
    lng: -103.70722222,
    tags: ["cultural","scenic","nature"],
    blurb: "Rising 800 feet above the North Platte River valley, Scotts Bluff was the most recognizable landmark along the Oregon Trail—a massive geological sentinel that 500,000 emigrant pioneers used to orie...",
    attractions: [
          {
                "name": "North Platte River",
                "description": "Rising 800 feet above the North Platte River valley, Scotts Bluff was the most recognizable landmark along the Oregon Trail—a massive geological sentinel that 500,000 emigrant pioneers used to orient themselves as they crossed the Great Plains in the 1840s through 1860s."
          },
          {
                "name": "Scotts Bluff",
                "description": "Rising 800 feet above the North Platte River valley, Scotts Bluff was the most recognizable landmark along the Oregon Trail—a massive geological sentinel that 500,000 emigrant pioneers used to orient themselves as they crossed the Great Plains in the 1840s through 1860s."
          },
          {
                "name": "Oregon Trail",
                "description": "Rising 800 feet above the North Platte River valley, Scotts Bluff was the most recognizable landmark along the Oregon Trail—a massive geological sentinel that 500,000 emigrant pioneers used to orient themselves as they crossed the Great Plains in the 1840s through 1860s."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 300, LAX: 320, SFO: 340, SEA: 330 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "effigy-mounds",
    name: "Effigy Mounds National Monument",
    region: "Great Plains",
    state: "IA",
    lat: 43.0888,
    lng: -91.1856,
    tags: ["cultural","scenic","nature"],
    blurb: "Effigy Mounds preserves 206 prehistoric earthen mounds built by Indigenous peoples between 500 BCE and 1200 CE along the bluffs above the Mississippi River in northeastern Iowa—including 31 in the ...",
    attractions: [
          {
                "name": "Effigy Mounds National Monument center",
                "description": "Walking tour through the heart of Effigy Mounds National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Effigy Mounds National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Effigy Mounds National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 190, LAX: 440, SFO: 450, SEA: 430 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cabrillo",
    name: "Cabrillo National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 32.67305556,
    lng: -117.23861111,
    tags: ["cultural","scenic","nature"],
    blurb: "Perched at the tip of the Point Loma peninsula in San Diego, Cabrillo National Monument commemorates the 1542 landing of Portuguese explorer Juan Rodríguez Cabrillo—the first European to set foot o...",
    attractions: [
          {
                "name": "Point Loma",
                "description": "Perched at the tip of the Point Loma peninsula in San Diego, Cabrillo National Monument commemorates the 1542 landing of Portuguese explorer Juan Rodríguez Cabrillo—the first European to set foot on the West Coast of the United States."
          },
          {
                "name": "San Diego",
                "description": "Perched at the tip of the Point Loma peninsula in San Diego, Cabrillo National Monument commemorates the 1542 landing of Portuguese explorer Juan Rodríguez Cabrillo—the first European to set foot on the West Coast of the United States."
          },
          {
                "name": "Cabrillo National Monument",
                "description": "Perched at the tip of the Point Loma peninsula in San Diego, Cabrillo National Monument commemorates the 1542 landing of Portuguese explorer Juan Rodríguez Cabrillo—the first European to set foot on the West Coast of the United States."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 460, LAX: 170, SFO: 230, SEA: 340 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "alibates-flint-quarries",
    name: "Alibates Flint Quarries National Monument",
    region: "Southwest",
    state: "TX",
    lat: 35.575045,
    lng: -101.6837868,
    tags: ["cultural","scenic","nature"],
    blurb: "For at least 13,000 years, Indigenous peoples traveled hundreds of miles to the Canadian River breaks of the Texas Panhandle to quarry the brilliant agatized dolomite—Alibates flint—whose rainbow h...",
    attractions: [
          {
                "name": "Canadian River",
                "description": "For at least 13,000 years, Indigenous peoples traveled hundreds of miles to the Canadian River breaks of the Texas Panhandle to quarry the brilliant agatized dolomite—Alibates flint—whose rainbow hues of red, purple, orange, and white made it the most prized tool stone on the southern Great Plains."
          },
          {
                "name": "Texas Panhandle",
                "description": "For at least 13,000 years, Indigenous peoples traveled hundreds of miles to the Canadian River breaks of the Texas Panhandle to quarry the brilliant agatized dolomite—Alibates flint—whose rainbow hues of red, purple, orange, and white made it the most prized tool stone on the southern Great Plains."
          },
          {
                "name": "Great Plains",
                "description": "For at least 13,000 years, Indigenous peoples traveled hundreds of miles to the Canadian River breaks of the Texas Panhandle to quarry the brilliant agatized dolomite—Alibates flint—whose rainbow hues of red, purple, orange, and white made it the most prized tool stone on the southern Great Plains."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 320, SFO: 360, SEA: 390 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "petroglyph",
    name: "Petroglyph National Monument",
    region: "Southwest",
    state: "NM",
    lat: 35.13583333,
    lng: -106.76194444,
    tags: ["cultural","scenic","nature"],
    blurb: "On the West Mesa escarpment at Albuquerque's western edge, Petroglyph National Monument protects one of the largest petroglyph sites in North America—over 24,000 images carved into the dark basalt ...",
    attractions: [
          {
                "name": "West Mesa",
                "description": "On the West Mesa escarpment at Albuquerque's western edge, Petroglyph National Monument protects one of the largest petroglyph sites in North America—over 24,000 images carved into the dark basalt boulders by ancestral Pueblo peoples and early Spanish settlers over a span of 700 years."
          },
          {
                "name": "Petroglyph National Monument",
                "description": "On the West Mesa escarpment at Albuquerque's western edge, Petroglyph National Monument protects one of the largest petroglyph sites in North America—over 24,000 images carved into the dark basalt boulders by ancestral Pueblo peoples and early Spanish settlers over a span of 700 years."
          },
          {
                "name": "North America",
                "description": "On the West Mesa escarpment at Albuquerque's western edge, Petroglyph National Monument protects one of the largest petroglyph sites in North America—over 24,000 images carved into the dark basalt boulders by ancestral Pueblo peoples and early Spanish settlers over a span of 700 years."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 350, LAX: 270, SFO: 310, SEA: 360 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["fall"],
  },
  {
    slug: "tonto",
    name: "Tonto National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 33.65694444,
    lng: -111.09444444,
    tags: ["cultural","scenic","nature","chill"],
    blurb: "Tucked into the rugged Superstition Mountains above the shores of Roosevelt Lake, Tonto National Monument preserves two remarkably well-preserved cliff dwellings occupied by the Salado people betwe...",
    attractions: [
          {
                "name": "Superstition Mountains",
                "description": "Tucked into the rugged Superstition Mountains above the shores of Roosevelt Lake, Tonto National Monument preserves two remarkably well-preserved cliff dwellings occupied by the Salado people between 1250 and 1450 CE."
          },
          {
                "name": "Roosevelt Lake",
                "description": "Tucked into the rugged Superstition Mountains above the shores of Roosevelt Lake, Tonto National Monument preserves two remarkably well-preserved cliff dwellings occupied by the Salado people between 1250 and 1450 CE."
          },
          {
                "name": "Tonto National Monument",
                "description": "Tucked into the rugged Superstition Mountains above the shores of Roosevelt Lake, Tonto National Monument preserves two remarkably well-preserved cliff dwellings occupied by the Salado people between 1250 and 1450 CE."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 230, SFO: 270, SEA: 350 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "montezuma-castle",
    name: "Montezuma Castle National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 34.61111111,
    lng: -111.83666667,
    tags: ["cultural","scenic","nature"],
    blurb: "One of the best-preserved cliff dwellings in North America, Montezuma Castle is a five-story, 20-room limestone and mortar structure built into a natural limestone alcove 100 feet above Beaver Cree...",
    attractions: [
          {
                "name": "North America",
                "description": "One of the best-preserved cliff dwellings in North America, Montezuma Castle is a five-story, 20-room limestone and mortar structure built into a natural limestone alcove 100 feet above Beaver Creek by the Sinagua people around 1100 CE—it was mistakenly named after the Aztec emperor by early European explorers who assumed it must be of Mexican origin."
          },
          {
                "name": "Montezuma Castle",
                "description": "One of the best-preserved cliff dwellings in North America, Montezuma Castle is a five-story, 20-room limestone and mortar structure built into a natural limestone alcove 100 feet above Beaver Creek by the Sinagua people around 1100 CE—it was mistakenly named after the Aztec emperor by early European explorers who assumed it must be of Mexican origin."
          },
          {
                "name": "Beaver Creek",
                "description": "One of the best-preserved cliff dwellings in North America, Montezuma Castle is a five-story, 20-room limestone and mortar structure built into a natural limestone alcove 100 feet above Beaver Creek by the Sinagua people around 1100 CE—it was mistakenly named after the Aztec emperor by early European explorers who assumed it must be of Mexican origin."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 220, SFO: 260, SEA: 340 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "canyons-of-the-ancients",
    name: "Canyons of the Ancients National Monument",
    region: "Rocky Mountains",
    state: "CO",
    lat: 37.370556,
    lng: -109,
    tags: ["cultural","scenic","nature"],
    blurb: "Canyons of the Ancients contains the highest known density of archaeological sites of any area managed by the Bureau of Land Management in the United States—over 6,000 recorded sites per square mil...",
    attractions: [
          {
                "name": "Land Management",
                "description": "Canyons of the Ancients contains the highest known density of archaeological sites of any area managed by the Bureau of Land Management in the United States—over 6,000 recorded sites per square mile in some areas, including cliff dwellings, great houses, kiva complexes, reservoirs, towers, and shrines built by the Ancestral Pueblo, Fremont, and Ute peoples over a span of 10,000 years."
          },
          {
                "name": "United States",
                "description": "Canyons of the Ancients contains the highest known density of archaeological sites of any area managed by the Bureau of Land Management in the United States—over 6,000 recorded sites per square mile in some areas, including cliff dwellings, great houses, kiva complexes, reservoirs, towers, and shrines built by the Ancestral Pueblo, Fremont, and Ute peoples over a span of 10,000 years."
          },
          {
                "name": "Ancestral Pueblo",
                "description": "Canyons of the Ancients contains the highest known density of archaeological sites of any area managed by the Bureau of Land Management in the United States—over 6,000 recorded sites per square mile in some areas, including cliff dwellings, great houses, kiva complexes, reservoirs, towers, and shrines built by the Ancestral Pueblo, Fremont, and Ute peoples over a span of 10,000 years."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 250, SFO: 280, SEA: 320 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cape-cod",
    name: "Cape Cod National Seashore",
    region: "Northeast",
    state: "MA",
    lat: 41.83722222,
    lng: -69.97277778,
    tags: ["nature","chill"],
    blurb: "Stretching 40 miles along the outer arm of Cape Cod, this national seashore protects some of the finest barrier beach and dune landscapes in the Northeast—a glacially sculpted coastline of towering...",
    attractions: [
          {
                "name": "Cape Cod",
                "description": "Stretching 40 miles along the outer arm of Cape Cod, this national seashore protects some of the finest barrier beach and dune landscapes in the Northeast—a glacially sculpted coastline of towering clay bluffs, freshwater kettle ponds, pitch pine forests, and legendary Atlantic surf beaches."
          },
          {
                "name": "Highland Light",
                "description": "Nauset Light and Highland Light stand guard over eroding clay headlands that have claimed hundreds of ships; the marshes and tidal flats are critical habitat for piping plovers, terns, and migrating shorebirds."
          },
          {
                "name": "Cape Cod Rail Trail",
                "description": "The Cape Cod Rail Trail offers a perfect cycling route through the maritime landscape between the ocean and bay.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 310, LAX: 630, SFO: 650, SEA: 610 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "point-reyes",
    name: "Point Reyes National Seashore",
    region: "Pacific West",
    state: "CA",
    lat: 38.06666667,
    lng: -122.88333333,
    tags: ["nature","chill"],
    blurb: "A triangular peninsula jutting 10 miles into the Pacific north of San Francisco, Point Reyes is one of the windiest spots in North America and among the most ecologically remarkable protected areas...",
    attractions: [
          {
                "name": "San Francisco",
                "description": "A triangular peninsula jutting 10 miles into the Pacific north of San Francisco, Point Reyes is one of the windiest spots in North America and among the most ecologically remarkable protected areas on the West Coast."
          },
          {
                "name": "Point Reyes",
                "description": "A triangular peninsula jutting 10 miles into the Pacific north of San Francisco, Point Reyes is one of the windiest spots in North America and among the most ecologically remarkable protected areas on the West Coast."
          },
          {
                "name": "North America",
                "description": "A triangular peninsula jutting 10 miles into the Pacific north of San Francisco, Point Reyes is one of the windiest spots in North America and among the most ecologically remarkable protected areas on the West Coast."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 490, LAX: 220, SFO: 160, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "padre-island",
    name: "Padre Island National Seashore",
    region: "Southwest",
    state: "TX",
    lat: 26.98444444,
    lng: -97.38055556,
    tags: ["nature","chill"],
    blurb: "The longest stretch of undeveloped barrier island in the world at 70 miles, Padre Island National Seashore protects a raw, windswept coast along the Texas Gulf that serves as critical nesting habit...",
    attractions: [
          {
                "name": "Padre Island National Seashore",
                "description": "The longest stretch of undeveloped barrier island in the world at 70 miles, Padre Island National Seashore protects a raw, windswept coast along the Texas Gulf that serves as critical nesting habitat for the critically endangered Kemp's ridley sea turtle—the rarest sea turtle on Earth."
          },
          {
                "name": "Texas Gulf",
                "description": "The longest stretch of undeveloped barrier island in the world at 70 miles, Padre Island National Seashore protects a raw, windswept coast along the Texas Gulf that serves as critical nesting habitat for the critically endangered Kemp's ridley sea turtle—the rarest sea turtle on Earth."
          },
          {
                "name": "United States",
                "description": "The wild, undeveloped southern portion of the island, accessible only to high-clearance four-wheel-drive vehicles on the beach, delivers a genuinely remote coastal experience in the continental United States.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 440, CHI: 360, LAX: 390, SFO: 440, SEA: 500 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cumberland-island",
    name: "Cumberland Island National Seashore",
    region: "Southeast",
    state: "GA",
    lat: 30.83333333,
    lng: -81.45,
    tags: ["nature","chill","cultural"],
    blurb: "Georgia's largest and southernmost barrier island is accessible only by ferry and strictly limits visitors to 300 per day, making it one of the most exclusive beach experiences in America despite b...",
    attractions: [
          {
                "name": "Cumberland Island National Seashore center",
                "description": "Walking tour through the heart of Cumberland Island National Seashore."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Cumberland Island National Seashore."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Cumberland Island National Seashore is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 300, LAX: 540, SFO: 580, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "fire-island",
    name: "Fire Island National Seashore",
    region: "Northeast",
    state: "NY",
    lat: 40.69638889,
    lng: -72.98277778,
    tags: ["nature","chill"],
    blurb: "Just 26 miles from Manhattan, Fire Island National Seashore protects a slender barrier island of remarkable wildness where cars are banned (in most areas), communities cluster around ferries, and t...",
    attractions: [
          {
                "name": "Fire Island National Seashore",
                "description": "Just 26 miles from Manhattan, Fire Island National Seashore protects a slender barrier island of remarkable wildness where cars are banned (in most areas), communities cluster around ferries, and the Sunken Forest—a magical grove of holly, sassafras, and shadblow sheltered below sea level—creates a fairytale landscape just yards from the Atlantic surf."
          },
          {
                "name": "Sunken Forest",
                "description": "Just 26 miles from Manhattan, Fire Island National Seashore protects a slender barrier island of remarkable wildness where cars are banned (in most areas), communities cluster around ferries, and the Sunken Forest—a magical grove of holly, sassafras, and shadblow sheltered below sea level—creates a fairytale landscape just yards from the Atlantic surf."
          },
          {
                "name": "Island Lighthouse",
                "description": "Fire Island Lighthouse, its 1858 tower restored to full operation, marks the western end of the park."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 290, LAX: 600, SFO: 620, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "gulf-islands",
    name: "Gulf Islands National Seashore",
    region: "Southeast",
    state: "Florida / Mississippi",
    lat: 30.36444444,
    lng: -86.9675,
    tags: ["nature","chill","cultural"],
    blurb: "Stretching 160 miles across two states along the Gulf of Mexico, Gulf Islands National Seashore protects some of the most brilliant white-quartz-sand beaches in the world—powdery, sugar-fine shores...",
    attractions: [
          {
                "name": "Gulf Islands National Seashore",
                "description": "Stretching 160 miles across two states along the Gulf of Mexico, Gulf Islands National Seashore protects some of the most brilliant white-quartz-sand beaches in the world—powdery, sugar-fine shores that stay cool to the touch even in summer heat because of the unique silica composition."
          },
          {
                "name": "Gulf Coast",
                "description": "The barrier islands harbor rich sea grass beds, nesting sea turtles, and one of the highest concentrations of shorebirds on the Gulf Coast."
          },
          {
                "name": "Fort Pickens",
                "description": "Historic Fort Pickens on Santa Rosa Island, a massive 19th-century masonry fortification, guarded Pensacola Bay and briefly imprisoned the Apache leader Geronimo in 1886.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 330, CHI: 290, LAX: 480, SFO: 520, SEA: 550 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "pictured-rocks-mi",
    name: "Pictured Rocks National Lakeshore",
    region: "Great Plains",
    state: "MI",
    lat: 46.56222222,
    lng: -86.3125,
    tags: ["nature","chill","adventure"],
    blurb: "Multicolored sandstone cliffs streaked with mineral deposits—iron red, copper green, manganese black—rise 200 feet above Lake Superior along Michigan's Upper Peninsula in one of the most visually s...",
    attractions: [
          {
                "name": "Lake Superior",
                "description": "Multicolored sandstone cliffs streaked with mineral deposits—iron red, copper green, manganese black—rise 200 feet above Lake Superior along Michigan's Upper Peninsula in one of the most visually spectacular lakeshore settings in North America."
          },
          {
                "name": "Upper Peninsula",
                "description": "Multicolored sandstone cliffs streaked with mineral deposits—iron red, copper green, manganese black—rise 200 feet above Lake Superior along Michigan's Upper Peninsula in one of the most visually spectacular lakeshore settings in North America."
          },
          {
                "name": "North America",
                "description": "Multicolored sandstone cliffs streaked with mineral deposits—iron red, copper green, manganese black—rise 200 feet above Lake Superior along Michigan's Upper Peninsula in one of the most visually spectacular lakeshore settings in North America."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 210, LAX: 490, SFO: 500, SEA: 450 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "canaveral",
    name: "Canaveral National Seashore",
    region: "Southeast",
    state: "FL",
    lat: 28.7675,
    lng: -80.77694444,
    tags: ["nature","chill"],
    blurb: "Adjacent to Kennedy Space Center, Canaveral National Seashore preserves 24 miles of completely undeveloped Florida Atlantic coast—the longest stretch of undisturbed beach on Florida's east coast—wh...",
    attractions: [
          {
                "name": "Kennedy Space Center",
                "description": "Adjacent to Kennedy Space Center, Canaveral National Seashore preserves 24 miles of completely undeveloped Florida Atlantic coast—the longest stretch of undisturbed beach on Florida's east coast—where sea turtles nest in extraordinary numbers (over 15,000 nests recorded in a single season), manatees shelter in Mosquito Lagoon, and American alligators sunbathe in the saw grass."
          },
          {
                "name": "Canaveral National Seashore",
                "description": "Adjacent to Kennedy Space Center, Canaveral National Seashore preserves 24 miles of completely undeveloped Florida Atlantic coast—the longest stretch of undisturbed beach on Florida's east coast—where sea turtles nest in extraordinary numbers (over 15,000 nests recorded in a single season), manatees shelter in Mosquito Lagoon, and American alligators sunbathe in the saw grass."
          },
          {
                "name": "Florida Atlantic",
                "description": "Adjacent to Kennedy Space Center, Canaveral National Seashore preserves 24 miles of completely undeveloped Florida Atlantic coast—the longest stretch of undisturbed beach on Florida's east coast—where sea turtles nest in extraordinary numbers (over 15,000 nests recorded in a single season), manatees shelter in Mosquito Lagoon, and American alligators sunbathe in the saw grass."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 330, LAX: 550, SFO: 590, SEA: 610 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "olympic-coast-marine",
    name: "Olympic Coast National Marine Sanctuary",
    region: "Pacific West",
    state: "WA",
    lat: 48,
    lng: -124.8,
    tags: ["nature","chill","adventure"],
    blurb: "Extending from the jagged sea stacks of the Olympic Peninsula coast 40 miles offshore, Olympic Coast National Marine Sanctuary is one of the nation's largest marine protected areas, harboring some ...",
    attractions: [
          {
                "name": "Olympic Peninsula",
                "description": "Extending from the jagged sea stacks of the Olympic Peninsula coast 40 miles offshore, Olympic Coast National Marine Sanctuary is one of the nation's largest marine protected areas, harboring some of the most productive cold-water upwelling zones on the West Coast."
          },
          {
                "name": "Olympic Coast National Marine",
                "description": "Extending from the jagged sea stacks of the Olympic Peninsula coast 40 miles offshore, Olympic Coast National Marine Sanctuary is one of the nation's largest marine protected areas, harboring some of the most productive cold-water upwelling zones on the West Coast."
          },
          {
                "name": "West Coast",
                "description": "Extending from the jagged sea stacks of the Olympic Peninsula coast 40 miles offshore, Olympic Coast National Marine Sanctuary is one of the nation's largest marine protected areas, harboring some of the most productive cold-water upwelling zones on the West Coast."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 600, CHI: 480, LAX: 330, SFO: 280, SEA: 170 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "glen-canyon",
    name: "Glen Canyon National Recreation Area",
    region: "Southwest",
    state: "Utah / Arizona",
    lat: 36.99361111,
    lng: -111.48694444,
    tags: ["nature","chill"],
    blurb: "Glen Canyon NRA encompasses 1.25 million acres centered on Lake Powell—America's second-largest reservoir, formed behind Glen Canyon Dam in 1966—whose 2,000 miles of shoreline weave through some of...",
    attractions: [
          {
                "name": "Glen Canyon National Recreation Area center",
                "description": "Walking tour through the heart of Glen Canyon National Recreation Area."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Glen Canyon National Recreation Area."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Glen Canyon National Recreation Area is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 230, SFO: 260, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lake-mead",
    name: "Lake Mead National Recreation Area",
    region: "Southwest",
    state: "Nevada / Arizona",
    lat: 36.00972222,
    lng: -114.79666667,
    tags: ["nature","chill"],
    blurb: "Straddling the Nevada-Arizona border just 30 miles from Las Vegas, Lake Mead is the largest reservoir in the United States by volume when full—formed by Hoover Dam on the Colorado River, one of the...",
    attractions: [
          {
                "name": "Las Vegas",
                "description": "Straddling the Nevada-Arizona border just 30 miles from Las Vegas, Lake Mead is the largest reservoir in the United States by volume when full—formed by Hoover Dam on the Colorado River, one of the engineering marvels of the 20th century."
          },
          {
                "name": "Lake Mead",
                "description": "Straddling the Nevada-Arizona border just 30 miles from Las Vegas, Lake Mead is the largest reservoir in the United States by volume when full—formed by Hoover Dam on the Colorado River, one of the engineering marvels of the 20th century."
          },
          {
                "name": "United States",
                "description": "Straddling the Nevada-Arizona border just 30 miles from Las Vegas, Lake Mead is the largest reservoir in the United States by volume when full—formed by Hoover Dam on the Colorado River, one of the engineering marvels of the 20th century."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 550, CHI: 420, LAX: 190, SFO: 230, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "whiskeytown",
    name: "Whiskeytown National Recreation Area",
    region: "Pacific West",
    state: "CA",
    lat: 40.62527778,
    lng: -122.55944444,
    tags: ["nature","scenic","adventure","chill"],
    blurb: "Tucked in the foothills of the Trinity Alps in Northern California, Whiskeytown is a hidden gem surrounding a clear blue reservoir ringed by forested mountains—a startlingly beautiful setting just ...",
    attractions: [
          {
                "name": "Trinity Alps",
                "description": "Tucked in the foothills of the Trinity Alps in Northern California, Whiskeytown is a hidden gem surrounding a clear blue reservoir ringed by forested mountains—a startlingly beautiful setting just 8 miles west of Redding."
          },
          {
                "name": "Northern California",
                "description": "Tucked in the foothills of the Trinity Alps in Northern California, Whiskeytown is a hidden gem surrounding a clear blue reservoir ringed by forested mountains—a startlingly beautiful setting just 8 miles west of Redding."
          },
          {
                "name": "Whiskeytown Falls",
                "description": "The park's 39 miles of trails lead to four major waterfalls including Whiskeytown Falls, a 220-foot plunge hidden in a shaded canyon whose existence was unknown to park officials until 2004."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 600, CHI: 470, LAX: 240, SFO: 190, SEA: 230 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "delaware-water-gap",
    name: "Delaware Water Gap National Recreation Area",
    region: "Northeast",
    state: "New Jersey / Pennsylvania",
    lat: 41.15381,
    lng: -74.91388,
    tags: ["nature","scenic","chill"],
    blurb: "Where the Delaware River cuts through the Kittatinny Ridge of the Appalachian Mountains in a 70,000-acre stretch of forested river valley, Delaware Water Gap National Recreation Area offers remarka...",
    attractions: [
          {
                "name": "Delaware River",
                "description": "Where the Delaware River cuts through the Kittatinny Ridge of the Appalachian Mountains in a 70,000-acre stretch of forested river valley, Delaware Water Gap National Recreation Area offers remarkable wilderness just 70 miles from New York City."
          },
          {
                "name": "Kittatinny Ridge",
                "description": "Where the Delaware River cuts through the Kittatinny Ridge of the Appalachian Mountains in a 70,000-acre stretch of forested river valley, Delaware Water Gap National Recreation Area offers remarkable wilderness just 70 miles from New York City."
          },
          {
                "name": "Appalachian Mountains",
                "description": "Where the Delaware River cuts through the Kittatinny Ridge of the Appalachian Mountains in a 70,000-acre stretch of forested river valley, Delaware Water Gap National Recreation Area offers remarkable wilderness just 70 miles from New York City."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 570 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "curecanti",
    name: "Curecanti National Recreation Area",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.45472222,
    lng: -107.32694444,
    tags: ["nature","scenic"],
    blurb: "A series of three reservoirs on the Gunnison River in the heart of the Colorado Rockies, Curecanti is best known for its dramatic Blue Mesa Reservoir—the largest body of water in Colorado—whose dee...",
    attractions: [
          {
                "name": "Gunnison River",
                "description": "A series of three reservoirs on the Gunnison River in the heart of the Colorado Rockies, Curecanti is best known for its dramatic Blue Mesa Reservoir—the largest body of water in Colorado—whose deep blue waters contrast magnificently with the surrounding sagebrush mesas and volcanic Black Canyon cliffs."
          },
          {
                "name": "Colorado Rockies",
                "description": "A series of three reservoirs on the Gunnison River in the heart of the Colorado Rockies, Curecanti is best known for its dramatic Blue Mesa Reservoir—the largest body of water in Colorado—whose deep blue waters contrast magnificently with the surrounding sagebrush mesas and volcanic Black Canyon cliffs."
          },
          {
                "name": "Blue Mesa Reservoir",
                "description": "A series of three reservoirs on the Gunnison River in the heart of the Colorado Rockies, Curecanti is best known for its dramatic Blue Mesa Reservoir—the largest body of water in Colorado—whose deep blue waters contrast magnificently with the surrounding sagebrush mesas and volcanic Black Canyon cliffs."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 470, CHI: 340, LAX: 270, SFO: 300, SEA: 330 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "flaming-gorge",
    name: "Flaming Gorge National Recreation Area",
    region: "Rocky Mountains",
    state: "Utah / Wyoming",
    lat: 40.91444444,
    lng: -109.42138889,
    tags: ["nature","scenic"],
    blurb: "Where Flaming Gorge Reservoir fills a dramatic red-walled canyon carved by the Green River through the Uinta Mountains, this recreation area delivers some of the most spectacular desert-canyon-lake...",
    attractions: [
          {
                "name": "Flaming Gorge Reservoir",
                "description": "Where Flaming Gorge Reservoir fills a dramatic red-walled canyon carved by the Green River through the Uinta Mountains, this recreation area delivers some of the most spectacular desert-canyon-lake scenery in the American West."
          },
          {
                "name": "Green River",
                "description": "Where Flaming Gorge Reservoir fills a dramatic red-walled canyon carved by the Green River through the Uinta Mountains, this recreation area delivers some of the most spectacular desert-canyon-lake scenery in the American West."
          },
          {
                "name": "Uinta Mountains",
                "description": "Where Flaming Gorge Reservoir fills a dramatic red-walled canyon carved by the Green River through the Uinta Mountains, this recreation area delivers some of the most spectacular desert-canyon-lake scenery in the American West."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 350, LAX: 270, SFO: 280, SEA: 290 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chattahoochee-river",
    name: "Chattahoochee River National Recreation Area",
    region: "Southeast",
    state: "GA",
    lat: 33.98722222,
    lng: -84.32472222,
    tags: ["nature","adventure","city"],
    blurb: "One of the most visited units of the national park system, Chattahoochee River National Recreation Area strings together 48 miles of protected river corridor north of Atlanta, offering urban dwelle...",
    attractions: [
          {
                "name": "Chattahoochee River National Recreation",
                "description": "One of the most visited units of the national park system, Chattahoochee River National Recreation Area strings together 48 miles of protected river corridor north of Atlanta, offering urban dwellers world-class whitewater tubing, kayaking, and trout fishing within minutes of one of the South's largest cities."
          },
          {
                "name": "Buford Dam",
                "description": "The cold, clear tailwaters released from Buford Dam maintain temperatures that support a thriving brown and rainbow trout fishery year-round—an extraordinary resource in the Deep South."
          },
          {
                "name": "Deep South",
                "description": "The cold, clear tailwaters released from Buford Dam maintain temperatures that support a thriving brown and rainbow trout fishery year-round—an extraordinary resource in the Deep South."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 250, LAX: 500, SFO: 530, SEA: 540 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lake-roosevelt",
    name: "Lake Roosevelt National Recreation Area",
    region: "Pacific West",
    state: "WA",
    lat: 48.10743,
    lng: -118.21289,
    tags: ["cultural","chill"],
    blurb: "Lake Roosevelt National Recreation Area is a destination in Pacific West, WA worth visiting for its scenic beauty and cultural offerings.",
    attractions: [
          {
                "name": "Columbia River Plateau",
                "description": "Roosevelt Lake stretches 150 miles across the Columbia River Plateau behind Grand Coulee Dam, the largest hydroelectric facility in the United States, cutting through a landscape of basalt coulees and ponderosa pine forest in northeastern Washington."
          },
          {
                "name": "Grand Coulee Dam",
                "description": "Roosevelt Lake stretches 150 miles across the Columbia River Plateau behind Grand Coulee Dam, the largest hydroelectric facility in the United States, cutting through a landscape of basalt coulees and ponderosa pine forest in northeastern Washington."
          },
          {
                "name": "United States",
                "description": "Roosevelt Lake stretches 150 miles across the Columbia River Plateau behind Grand Coulee Dam, the largest hydroelectric facility in the United States, cutting through a landscape of basalt coulees and ponderosa pine forest in northeastern Washington."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 550, CHI: 430, LAX: 330, SFO: 290, SEA: 190 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "gateway-nra",
    name: "Gateway National Recreation Area",
    region: "Northeast",
    state: "New York / New Jersey",
    lat: 40.454,
    lng: -73.99699,
    tags: ["cultural","nature","chill","city"],
    blurb: "Gateway is one of the most visited national park units in the country, wrapping the entrance to New York Harbor across three units—Jamaica Bay, Staten Island, and Sandy Hook—and offering beaches, w...",
    attractions: [
          {
                "name": "New York Harbor",
                "description": "Gateway is one of the most visited national park units in the country, wrapping the entrance to New York Harbor across three units—Jamaica Bay, Staten Island, and Sandy Hook—and offering beaches, wildlife refuges, and historic military forts just minutes from one of the world's most densely populated urban areas."
          },
          {
                "name": "Jamaica Bay",
                "description": "Gateway is one of the most visited national park units in the country, wrapping the entrance to New York Harbor across three units—Jamaica Bay, Staten Island, and Sandy Hook—and offering beaches, wildlife refuges, and historic military forts just minutes from one of the world's most densely populated urban areas."
          },
          {
                "name": "Staten Island",
                "description": "Gateway is one of the most visited national park units in the country, wrapping the entrance to New York Harbor across three units—Jamaica Bay, Staten Island, and Sandy Hook—and offering beaches, wildlife refuges, and historic military forts just minutes from one of the world's most densely populated urban areas."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "santa-monica-mountains",
    name: "Santa Monica Mountains National Recreation Area",
    region: "Pacific West",
    state: "CA",
    lat: 34.10388889,
    lng: -118.6025,
    tags: ["nature","chill","city"],
    blurb: "The Santa Monica Mountains NRA is the world's largest urban national park, protecting 153,000 acres of the only Mediterranean ecosystem in the U.S.",
    attractions: [
          {
                "name": "Santa Monica Mountains",
                "description": "The Santa Monica Mountains NRA is the world's largest urban national park, protecting 153,000 acres of the only Mediterranean ecosystem in the U.S."
          },
          {
                "name": "Griffith Park",
                "description": "national park system—a chaparral-covered mountain range stretching from Griffith Park in Los Angeles to Point Mugu on the Pacific coast."
          },
          {
                "name": "Los Angeles",
                "description": "national park system—a chaparral-covered mountain range stretching from Griffith Park in Los Angeles to Point Mugu on the Pacific coast."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 470, LAX: 150, SFO: 210, SEA: 320 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "martin-luther-king-jr",
    name: "Martin Luther King Jr. National Historical Park",
    region: "Southeast",
    state: "GA",
    lat: 33.755,
    lng: -84.37222222,
    tags: ["cultural"],
    blurb: "In Atlanta's Sweet Auburn neighborhood, this national historical park preserves the birthplace, church, and burial site of the Reverend Dr.",
    attractions: [
          {
                "name": "Sweet Auburn",
                "description": "In Atlanta's Sweet Auburn neighborhood, this national historical park preserves the birthplace, church, and burial site of the Reverend Dr."
          },
          {
                "name": "Reverend Dr",
                "description": "In Atlanta's Sweet Auburn neighborhood, this national historical park preserves the birthplace, church, and burial site of the Reverend Dr."
          },
          {
                "name": "Luther King Jr",
                "description": "Martin Luther King Jr.—the most celebrated leader of the American civil rights movement and recipient of the 1964 Nobel Peace Prize."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 260, LAX: 500, SFO: 530, SEA: 540 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "harpers-ferry",
    name: "Harpers Ferry National Historical Park",
    region: "Southeast",
    state: "WV",
    lat: 39.32277778,
    lng: -77.72972222,
    tags: ["cultural","nature","adventure"],
    blurb: "At the dramatic confluence of the Potomac and Shenandoah Rivers, Harpers Ferry is one of the most scenically situated historic sites in America—Thomas Jefferson called the view here 'perhaps one of...",
    attractions: [
          {
                "name": "Shenandoah Rivers",
                "description": "At the dramatic confluence of the Potomac and Shenandoah Rivers, Harpers Ferry is one of the most scenically situated historic sites in America—Thomas Jefferson called the view here 'perhaps one of the most stupendous scenes in Nature.' John Brown's 1859 raid on the federal armory here, intended to spark a slave rebellion, became a catalytic event leading directly to the Civil War."
          },
          {
                "name": "Harpers Ferry",
                "description": "At the dramatic confluence of the Potomac and Shenandoah Rivers, Harpers Ferry is one of the most scenically situated historic sites in America—Thomas Jefferson called the view here 'perhaps one of the most stupendous scenes in Nature.' John Brown's 1859 raid on the federal armory here, intended to spark a slave rebellion, became a catalytic event leading directly to the Civil War."
          },
          {
                "name": "Thomas Jefferson",
                "description": "At the dramatic confluence of the Potomac and Shenandoah Rivers, Harpers Ferry is one of the most scenically situated historic sites in America—Thomas Jefferson called the view here 'perhaps one of the most stupendous scenes in Nature.' John Brown's 1859 raid on the federal armory here, intended to spark a slave rebellion, became a catalytic event leading directly to the Civil War."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 250, LAX: 560, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "minute-man",
    name: "Minute Man National Historical Park",
    region: "Northeast",
    state: "MA",
    lat: 42.45305556,
    lng: -71.29861111,
    tags: ["cultural","nature"],
    blurb: "On April 19, 1775, the first shots of the American Revolution rang out along the 22-mile Battle Road between Concord and Lexington—and Minute Man National Historical Park preserves the landscape wh...",
    attractions: [
          {
                "name": "American Revolution",
                "description": "On April 19, 1775, the first shots of the American Revolution rang out along the 22-mile Battle Road between Concord and Lexington—and Minute Man National Historical Park preserves the landscape where colonists stood against British Regulars and lit what Emerson called 'the shot heard round the world.' The North Bridge in Concord, where the first British regulars fell, stands in the exact location of that pivotal confrontation, while the Battle Road Trail connects the engagement sites through a remarkably intact 18th-century agricultural landscape."
          },
          {
                "name": "Battle Road",
                "description": "On April 19, 1775, the first shots of the American Revolution rang out along the 22-mile Battle Road between Concord and Lexington—and Minute Man National Historical Park preserves the landscape where colonists stood against British Regulars and lit what Emerson called 'the shot heard round the world.' The North Bridge in Concord, where the first British regulars fell, stands in the exact location of that pivotal confrontation, while the Battle Road Trail connects the engagement sites through a remarkably intact 18th-century agricultural landscape."
          },
          {
                "name": "Minute Man National Historical",
                "description": "On April 19, 1775, the first shots of the American Revolution rang out along the 22-mile Battle Road between Concord and Lexington—and Minute Man National Historical Park preserves the landscape where colonists stood against British Regulars and lit what Emerson called 'the shot heard round the world.' The North Bridge in Concord, where the first British regulars fell, stands in the exact location of that pivotal confrontation, while the Battle Road Trail connects the engagement sites through a remarkably intact 18th-century agricultural landscape."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 630, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "boston-nhp",
    name: "Boston National Historical Park",
    region: "Northeast",
    state: "MA",
    lat: 42.36,
    lng: -71.05638889,
    tags: ["cultural","nature"],
    blurb: "The 2.5-mile Freedom Trail is the spine of Boston National Historical Park, threading through 16 Revolutionary-era sites including Paul Revere's House, the Old South Meeting House, Bunker Hill Monu...",
    attractions: [
          {
                "name": "Freedom Trail",
                "description": "The 2.5-mile Freedom Trail is the spine of Boston National Historical Park, threading through 16 Revolutionary-era sites including Paul Revere's House, the Old South Meeting House, Bunker Hill Monument, and the USS Constitution—'Old Ironsides'—the oldest commissioned naval vessel still afloat in the world."
          },
          {
                "name": "Boston National Historical Park",
                "description": "The 2.5-mile Freedom Trail is the spine of Boston National Historical Park, threading through 16 Revolutionary-era sites including Paul Revere's House, the Old South Meeting House, Bunker Hill Monument, and the USS Constitution—'Old Ironsides'—the oldest commissioned naval vessel still afloat in the world."
          },
          {
                "name": "Paul Revere",
                "description": "The 2.5-mile Freedom Trail is the spine of Boston National Historical Park, threading through 16 Revolutionary-era sites including Paul Revere's House, the Old South Meeting House, Bunker Hill Monument, and the USS Constitution—'Old Ironsides'—the oldest commissioned naval vessel still afloat in the world."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "abraham-lincoln-birthplace",
    name: "Abraham Lincoln Birthplace National Historical Park",
    region: "Southeast",
    state: "KY",
    lat: 37.5311,
    lng: -85.7375,
    tags: ["cultural","nature"],
    blurb: "In the gently rolling knob country of central Kentucky, this national historical park preserves the farm where Abraham Lincoln was born on February 12, 1809—a log cabin symbolic of the frontier ori...",
    attractions: [
          {
                "name": "Abraham Lincoln",
                "description": "In the gently rolling knob country of central Kentucky, this national historical park preserves the farm where Abraham Lincoln was born on February 12, 1809—a log cabin symbolic of the frontier origins of America's 16th president and most revered national figure."
          },
          {
                "name": "Memorial Building",
                "description": "The Memorial Building, a neoclassical granite structure completed in 1911, houses a symbolic log cabin of the period; 56 steps lead to its entrance, one for each year of Lincoln's life."
          },
          {
                "name": "Knob Creek Farm",
                "description": "The nearby Knob Creek Farm, where Lincoln spent his earliest childhood years, is preserved as a second unit of the park just a few miles away.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 270, CHI: 210, LAX: 480, SFO: 510, SEA: 500 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "tuskegee-airmen",
    name: "Tuskegee Airmen National Historic Site",
    region: "Southeast",
    state: "AL",
    lat: 32.45916667,
    lng: -85.68,
    tags: ["cultural"],
    blurb: "Moton Field in Tuskegee, Alabama is where the first African American military aviators in U.S.",
    attractions: [
          {
                "name": "African American",
                "description": "Moton Field in Tuskegee, Alabama is where the first African American military aviators in U.S."
          },
          {
                "name": "Tuskegee Airmen",
                "description": "history—the legendary Tuskegee Airmen—trained, flew, and proved definitively that Black Americans were equal to any challenge the nation could present."
          },
          {
                "name": "Black Americans",
                "description": "history—the legendary Tuskegee Airmen—trained, flew, and proved definitively that Black Americans were equal to any challenge the nation could present."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 270, LAX: 490, SFO: 530, SEA: 540 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "palo-duro-canyon",
    name: "Palo Duro Canyon State Park",
    region: "Southwest",
    state: "TX",
    lat: 34.98472222,
    lng: -101.70194444,
    tags: ["nature","chill","scenic"],
    blurb: "The second-largest canyon in the United States stretches 120 miles across the Texas Panhandle, its red, orange, and white sedimentary layers revealing 250 million years of geological history.",
    attractions: [
          {
                "name": "United States",
                "description": "The second-largest canyon in the United States stretches 120 miles across the Texas Panhandle, its red, orange, and white sedimentary layers revealing 250 million years of geological history."
          },
          {
                "name": "Texas Panhandle",
                "description": "The second-largest canyon in the United States stretches 120 miles across the Texas Panhandle, its red, orange, and white sedimentary layers revealing 250 million years of geological history."
          },
          {
                "name": "Grand Canyon",
                "description": "Often called the 'Grand Canyon of Texas,' Palo Duro drops 800 feet from the surrounding flat plains into a hidden world of hoodoos, mesas, and juniper-lined trails."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 320, SFO: 360, SEA: 400 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fords-theatre",
    name: "Ford's Theatre National Historic Site",
    region: "Northeast",
    state: "DC",
    lat: 38.89666667,
    lng: -77.02583333,
    tags: ["cultural"],
    blurb: "On the evening of April 14, 1865—just days after the Civil War effectively ended—President Abraham Lincoln was shot by John Wilkes Booth in the presidential box of Ford's Theatre, changing the cour...",
    attractions: [
          {
                "name": "Civil War",
                "description": "On the evening of April 14, 1865—just days after the Civil War effectively ended—President Abraham Lincoln was shot by John Wilkes Booth in the presidential box of Ford's Theatre, changing the course of American history."
          },
          {
                "name": "President Abraham Lincoln",
                "description": "On the evening of April 14, 1865—just days after the Civil War effectively ended—President Abraham Lincoln was shot by John Wilkes Booth in the presidential box of Ford's Theatre, changing the course of American history."
          },
          {
                "name": "John Wilkes Booth",
                "description": "On the evening of April 14, 1865—just days after the Civil War effectively ended—President Abraham Lincoln was shot by John Wilkes Booth in the presidential box of Ford's Theatre, changing the course of American history."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "san-antonio-missions",
    name: "San Antonio Missions National Historical Park",
    region: "Southwest",
    state: "TX",
    lat: 29.36166667,
    lng: -98.48027778,
    tags: ["cultural","nature"],
    blurb: "San Antonio Missions preserves four Spanish colonial missions—Mission Concepción, Mission San José, Mission San Juan, and Mission Espada—built in the 18th century along the San Antonio River to con...",
    attractions: [
          {
                "name": "Antonio Missions",
                "description": "San Antonio Missions preserves four Spanish colonial missions—Mission Concepción, Mission San José, Mission San Juan, and Mission Espada—built in the 18th century along the San Antonio River to convert Indigenous peoples of the region to Christianity and Spanish colonial culture."
          },
          {
                "name": "Mission Concepci",
                "description": "San Antonio Missions preserves four Spanish colonial missions—Mission Concepción, Mission San José, Mission San Juan, and Mission Espada—built in the 18th century along the San Antonio River to convert Indigenous peoples of the region to Christianity and Spanish colonial culture."
          },
          {
                "name": "Mission San Jos",
                "description": "San Antonio Missions preserves four Spanish colonial missions—Mission Concepción, Mission San José, Mission San Juan, and Mission Espada—built in the 18th century along the San Antonio River to convert Indigenous peoples of the region to Christianity and Spanish colonial culture."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 340, LAX: 370, SFO: 420, SEA: 470 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "salem-maritime",
    name: "Salem Maritime National Historic Site",
    region: "Northeast",
    state: "MA",
    lat: 42.52055556,
    lng: -70.88722222,
    tags: ["cultural"],
    blurb: "Salem's Derby Street waterfront preserves the historic core of one of early America's most prosperous seaports, where merchant ships returned laden with spices, silks, and exotic goods from Asia, t...",
    attractions: [
          {
                "name": "Derby Street",
                "description": "Salem's Derby Street waterfront preserves the historic core of one of early America's most prosperous seaports, where merchant ships returned laden with spices, silks, and exotic goods from Asia, the Pacific, and Africa in the late 18th and early 19th centuries."
          },
          {
                "name": "Custom House",
                "description": "The Custom House—where Nathaniel Hawthorne worked as a surveyor and found the source material for The Scarlet Letter—anchors a district of restored counting houses, warehouses, and wharves."
          },
          {
                "name": "Nathaniel Hawthorne",
                "description": "The Custom House—where Nathaniel Hawthorne worked as a surveyor and found the source material for The Scarlet Letter—anchors a district of restored counting houses, warehouses, and wharves."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 300, LAX: 620, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "national-mall",
    name: "National Mall and Memorial Parks",
    region: "Northeast",
    state: "DC",
    lat: 38.89,
    lng: -77.02277778,
    tags: ["cultural","scenic"],
    blurb: "The 2-mile green corridor stretching from the Capitol to the Lincoln Memorial is America's front yard and the greatest concentration of national monuments and memorials in the world—the Washington ...",
    attractions: [
          {
                "name": "Lincoln Memorial",
                "description": "The 2-mile green corridor stretching from the Capitol to the Lincoln Memorial is America's front yard and the greatest concentration of national monuments and memorials in the world—the Washington Monument, the Lincoln, Jefferson, FDR, Martin Luther King Jr., and World War II memorials are all here, plus the Vietnam Veterans Memorial Wall bearing 58,000 names and the Korean War Veterans Memorial."
          },
          {
                "name": "Washington Monument",
                "description": "The 2-mile green corridor stretching from the Capitol to the Lincoln Memorial is America's front yard and the greatest concentration of national monuments and memorials in the world—the Washington Monument, the Lincoln, Jefferson, FDR, Martin Luther King Jr., and World War II memorials are all here, plus the Vietnam Veterans Memorial Wall bearing 58,000 names and the Korean War Veterans Memorial."
          },
          {
                "name": "Martin Luther King Jr",
                "description": "The 2-mile green corridor stretching from the Capitol to the Lincoln Memorial is America's front yard and the greatest concentration of national monuments and memorials in the world—the Washington Monument, the Lincoln, Jefferson, FDR, Martin Luther King Jr., and World War II memorials are all here, plus the Vietnam Veterans Memorial Wall bearing 58,000 names and the Korean War Veterans Memorial."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "antietam",
    name: "Antietam National Battlefield",
    region: "Northeast",
    state: "MD",
    lat: 39.47027778,
    lng: -77.73805556,
    tags: ["cultural","nature"],
    blurb: "September 17, 1862, was the bloodiest single day in American military history: over 22,700 soldiers were killed, wounded, or missing in 12 hours of savage fighting along Antietam Creek in western M...",
    attractions: [
          {
                "name": "Antietam National Battlefield center",
                "description": "Walking tour through the heart of Antietam National Battlefield."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Antietam National Battlefield."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Antietam National Battlefield is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 250, LAX: 560, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "kings-canyon",
    name: "Kings Canyon National Park",
    region: "Pacific West",
    state: "CA",
    lat: 36.78928,
    lng: -118.67286,
    tags: ["nature","scenic"],
    blurb: "Kings Canyon National Park protects granite peaks, deep glacial canyons, and roaring Sierra rivers in the wilder half of the Sequoia and Kings Canyon park complex.",
    attractions: [
          {
                "name": "Canyon National Park",
                "description": "Kings Canyon National Park protects granite peaks, deep glacial canyons, and roaring Sierra rivers in the wilder half of the Sequoia and Kings Canyon park complex."
          },
          {
                "name": "Kings Canyon",
                "description": "Kings Canyon National Park protects granite peaks, deep glacial canyons, and roaring Sierra rivers in the wilder half of the Sequoia and Kings Canyon park complex."
          },
          {
                "name": "Zumwalt Meadow",
                "description": "Cedar Grove, Zumwalt Meadow, and the Kings River corridor deliver dramatic alpine scenery with fewer crowds than nearby giant-tree groves."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 450, LAX: 190, SFO: 190, SEA: 290 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 50,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "katmai-national-park-and-preserve",
    name: "Katmai National Park & Preserve",
    region: "Alaska",
    state: "AK",
    lat: 58.5,
    lng: -155,
    tags: ["nature"],
    blurb: "A landscape is alive underneath our feet, filled with creatures that remind us what it is to be wild.",
    attractions: [
          {
                "name": "Katmai National Park & Preserve center",
                "description": "Walking tour through the heart of Katmai National Park & Preserve."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Katmai National Park & Preserve."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Katmai National Park & Preserve is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 580, SFO: 520, SEA: 430 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "lake-clark-national-park-and-preserve",
    name: "Lake Clark National Park & Preserve",
    region: "Alaska",
    state: "AK",
    lat: 60.96666667,
    lng: -153.41666667,
    tags: ["cultural","adventure"],
    blurb: "Lake Clark National Park and Preserve is a land of stunning beauty.",
    attractions: [
          {
                "name": "Lake Clark National Park & Preserve center",
                "description": "Walking tour through the heart of Lake Clark National Park & Preserve."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Lake Clark National Park & Preserve."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Lake Clark National Park & Preserve is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 680, LAX: 590, SFO: 530, SEA: 430 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "african-burial-ground-national-monument",
    name: "African Burial Ground National Monument",
    region: "Northeast",
    state: "NY",
    lat: 40.71444444,
    lng: -74.00444444,
    tags: ["cultural","scenic","nature"],
    blurb: "The African Burial Ground stands as the oldest and largest known excavated burial site in North America for both free and enslaved Africans.",
    attractions: [
          {
                "name": "African Burial Ground",
                "description": "The African Burial Ground stands as the oldest and largest known excavated burial site in North America for both free and enslaved Africans."
          },
          {
                "name": "North America",
                "description": "The African Burial Ground stands as the oldest and largest known excavated burial site in North America for both free and enslaved Africans."
          },
          {
                "name": "New York",
                "description": "It offers a profound testament to the enduring legacy of African communities whose labor, resilience, and cultural contributions were fundamental in shaping the development of New York.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "agate-fossil-beds-national-monument",
    name: "Agate Fossil Beds National Monument",
    region: "Great Plains",
    state: "NE",
    lat: 42.421703,
    lng: -103.75388,
    tags: ["cultural","scenic","nature"],
    blurb: "In the early 1900s, paleontologists unearthed the Age of Mammals when they found full skeletons of extinct Miocene mammals in the hills of Nebraska -- species previously only known through fragments.",
    attractions: [
          {
                "name": "James Cook",
                "description": "At the same time, an age of friendship began between rancher James Cook and Chief Red Cloud of the Lakota."
          },
          {
                "name": "Chief Red Cloud",
                "description": "At the same time, an age of friendship began between rancher James Cook and Chief Red Cloud of the Lakota."
          },
          {
                "name": "Agate Fossil Beds",
                "description": "at Agate Fossil Beds.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 300, LAX: 330, SFO: 340, SEA: 320 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "belmont-paul-womens-equality-national-monument",
    name: "Belmont-Paul Women's Equality National Monument",
    region: "Northeast",
    state: "DC",
    lat: 38.89194444,
    lng: -77.00361111,
    tags: ["cultural","scenic","nature"],
    blurb: "Home to the National Woman's Party for more than 90 years, this was the epicenter of the struggle for women's rights.",
    attractions: [
          {
                "name": "National Woman",
                "description": "Home to the National Woman's Party for more than 90 years, this was the epicenter of the struggle for women's rights."
          },
          {
                "name": "Supreme Court",
                "description": "Capitol and Supreme Court, Alice Paul and the NWP developed innovative strategies and tactics to advocate for the Equal Rights Amendment and equality for women."
          },
          {
                "name": "Alice Paul",
                "description": "Capitol and Supreme Court, Alice Paul and the NWP developed innovative strategies and tactics to advocate for the Equal Rights Amendment and equality for women."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "booker-t-washington-national-monument",
    name: "Booker T Washington National Monument",
    region: "Southeast",
    state: "VA",
    lat: 37.11960556,
    lng: -79.73151389,
    tags: ["cultural","scenic","nature"],
    blurb: "Booker T Washington National Monument is a destination in Southeast, VA worth visiting for its scenic beauty and cultural offerings.",
    attractions: [
          {
                "name": "James Burroughs",
                "description": "Washington was born a slave in April 1856 on the 207-acre farm of James Burroughs."
          },
          {
                "name": "Civil War",
                "description": "After the Civil War, Washington became the first principal of Tuskegee Normal and Industrial School."
          },
          {
                "name": "Tuskegee Normal",
                "description": "After the Civil War, Washington became the first principal of Tuskegee Normal and Industrial School."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 250, LAX: 540, SFO: 570, SEA: 560 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "buck-island-reef-national-monument",
    name: "Buck Island Reef National Monument",
    region: "Southeast",
    state: "U.S. Virgin Islands",
    lat: 17.78694,
    lng: -64.61916,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Welcome to Buck Island Reef National Monument, called \"the finest marine garden in the Caribbean Sea\" by President John F.",
    attractions: [
          {
                "name": "Buck Island Reef National",
                "description": "Welcome to Buck Island Reef National Monument, called \"the finest marine garden in the Caribbean Sea\" by President John F."
          },
          {
                "name": "Caribbean Sea",
                "description": "Welcome to Buck Island Reef National Monument, called \"the finest marine garden in the Caribbean Sea\" by President John F."
          },
          {
                "name": "President John",
                "description": "Welcome to Buck Island Reef National Monument, called \"the finest marine garden in the Caribbean Sea\" by President John F."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 540, LAX: 700, SFO: 700, SEA: 700 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "camp-nelson-national-monument",
    name: "Camp Nelson National Monument",
    region: "Southeast",
    state: "KY",
    lat: 37.78777778,
    lng: -84.59805556,
    tags: ["cultural","scenic","nature"],
    blurb: "The US Army established Camp Nelson as a fortified supply depot in April 1863.",
    attractions: [
          {
                "name": "Camp Nelson National Monument center",
                "description": "Walking tour through the heart of Camp Nelson National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Camp Nelson National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Camp Nelson National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 210, LAX: 490, SFO: 520, SEA: 510 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "canyon-de-chelly-national-monument",
    name: "Canyon de Chelly National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 36.155281,
    lng: -109.508995,
    tags: ["cultural","scenic","nature"],
    blurb: "This canyon is home to Dine families who raise livestock, grow crops and live here.",
    attractions: [
          {
                "name": "Canyon de Chelly National Monument center",
                "description": "Walking tour through the heart of Canyon de Chelly National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Canyon de Chelly National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Canyon de Chelly National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 370, LAX: 240, SFO: 280, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cape-krusenstern-national-monument",
    name: "Cape Krusenstern National Monument",
    region: "Alaska",
    state: "AK",
    lat: 67.33333333,
    lng: -163.58333333,
    tags: ["cultural","scenic","nature"],
    blurb: "A bridge to the past and a land for the future, Cape Krusenstern National Monument protects approximately 560,000 acres of diverse Arctic coastal, and upland ecosystems.",
    attractions: [
          {
                "name": "Cape Krusenstern National Monument center",
                "description": "Walking tour through the heart of Cape Krusenstern National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Cape Krusenstern National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Cape Krusenstern National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 700, CHI: 700, LAX: 680, SFO: 620, SEA: 510 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "capulin-volcano-national-monument",
    name: "Capulin Volcano National Monument",
    region: "Southwest",
    state: "NM",
    lat: 36.78222222,
    lng: -103.97,
    tags: ["cultural","scenic","nature"],
    blurb: "Part of the 8,000 square mile Raton-Clayton Volcanic Field, Capulin Volcano showcases the volcanic geology of northeastern New Mexico.",
    attractions: [
          {
                "name": "Clayton Volcanic Field",
                "description": "Part of the 8,000 square mile Raton-Clayton Volcanic Field, Capulin Volcano showcases the volcanic geology of northeastern New Mexico."
          },
          {
                "name": "Capulin Volcano",
                "description": "Part of the 8,000 square mile Raton-Clayton Volcanic Field, Capulin Volcano showcases the volcanic geology of northeastern New Mexico."
          },
          {
                "name": "New Mexico",
                "description": "Part of the 8,000 square mile Raton-Clayton Volcanic Field, Capulin Volcano showcases the volcanic geology of northeastern New Mexico."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 440, CHI: 320, LAX: 300, SFO: 330, SEA: 360 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "carlisle-federal-indian-boarding-school-national-monument",
    name: "Carlisle Federal Indian Boarding School National Monument",
    region: "Northeast",
    state: "PA",
    lat: 40.209,
    lng: -77.178,
    tags: ["cultural","scenic","nature"],
    blurb: "More than 7,800 children from 140 Tribes went to the Carlisle School from 1879 to 1918.",
    attractions: [
          {
                "name": "Carlisle School",
                "description": "More than 7,800 children from 140 Tribes went to the Carlisle School from 1879 to 1918."
          },
          {
                "name": "National Park Service",
                "description": "The National Park Service will collaborate with families, affiliated Tribal Nations, the US Army, historians, and partners to develop resources and share the story of the children, families, and communities impacted by Carlisle Federal Indian Boarding School.."
          },
          {
                "name": "Tribal Nations",
                "description": "The National Park Service will collaborate with families, affiliated Tribal Nations, the US Army, historians, and partners to develop resources and share the story of the children, families, and communities impacted by Carlisle Federal Indian Boarding School.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 250, LAX: 560, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "casa-grande-ruins-national-monument",
    name: "Casa Grande Ruins National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 32.9970051,
    lng: -111.5320692,
    tags: ["cultural","scenic","nature"],
    blurb: "An Ancestral Sonoran Desert People's farming community and \"Great House\" are preserved at Casa Grande Ruins.",
    attractions: [
          {
                "name": "Ancestral Sonoran Desert People",
                "description": "An Ancestral Sonoran Desert People's farming community and \"Great House\" are preserved at Casa Grande Ruins."
          },
          {
                "name": "Great House",
                "description": "An Ancestral Sonoran Desert People's farming community and \"Great House\" are preserved at Casa Grande Ruins."
          },
          {
                "name": "Casa Grande Ruins",
                "description": "An Ancestral Sonoran Desert People's farming community and \"Great House\" are preserved at Casa Grande Ruins."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 410, LAX: 220, SFO: 270, SEA: 360 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "castillo-de-san-marcos-national-monument",
    name: "Castillo de San Marcos National Monument",
    region: "Southeast",
    state: "FL",
    lat: 29.89777778,
    lng: -81.31138889,
    tags: ["cultural","scenic","nature"],
    blurb: "Built by the Spanish in St.",
    attractions: [
          {
                "name": "Castillo de San Marcos National Monument center",
                "description": "Walking tour through the heart of Castillo de San Marcos National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Castillo de San Marcos National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Castillo de San Marcos National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 300, CHI: 310, LAX: 540, SFO: 580, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "castle-clinton-national-monument",
    name: "Castle Clinton National Monument",
    region: "Northeast",
    state: "NY",
    lat: 40.7035,
    lng: -74.0168,
    tags: ["cultural","scenic","nature"],
    blurb: "Located at the southern tip of Manhattan, Castle Clinton marks the place where New York City began and reflects the growth of both the city and the nation.",
    attractions: [
          {
                "name": "Castle Clinton",
                "description": "Located at the southern tip of Manhattan, Castle Clinton marks the place where New York City began and reflects the growth of both the city and the nation."
          },
          {
                "name": "New York City",
                "description": "Located at the southern tip of Manhattan, Castle Clinton marks the place where New York City began and reflects the growth of both the city and the nation."
          },
          {
                "name": "New York Harbor",
                "description": "Built to defend the harbor during the War of 1812, it has since welcomed theatergoers, immigrants, and sightseers-and today continues to greet millions of visitors to New York Harbor.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "castle-mountains-national-monument",
    name: "Castle Mountains National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 35.25,
    lng: -115.11,
    tags: ["cultural","scenic","nature"],
    blurb: "Castle Mountains represents some of the most unique elements of the Mojave Desert.",
    attractions: [
          {
                "name": "Mojave Desert",
                "description": "Castle Mountains represents some of the most unique elements of the Mojave Desert."
          },
          {
                "name": "Mojave National Preserve",
                "description": "Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history."
          },
          {
                "name": "Castle Mountains",
                "description": "Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 550, CHI: 430, LAX: 190, SFO: 230, SEA: 320 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cedar-breaks-national-monument",
    name: "Cedar Breaks National Monument",
    region: "Southwest",
    state: "UT",
    lat: 37.6424776,
    lng: -112.8488318,
    tags: ["cultural","scenic","nature"],
    blurb: "Crowning the Grand Staircase, Cedar Breaks sits at over 10,000 feet and looks down into a half-mile deep geologic amphitheater.",
    attractions: [
          {
                "name": "Cedar Breaks National Monument center",
                "description": "Walking tour through the heart of Cedar Breaks National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Cedar Breaks National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Cedar Breaks National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 220, SFO: 240, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cesar-e-chavez-national-monument",
    name: "Cesar E. Chavez National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 35.2273,
    lng: -118.5614,
    tags: ["cultural","scenic","nature"],
    blurb: "Yes, we can! Widely recognized as the most important Latino leader in the United States during the twentieth century, Cesar Chavez led farm workers and supporters in the establishment of the countr...",
    attractions: [
          {
                "name": "Cesar E. Chavez National Monument center",
                "description": "Walking tour through the heart of Cesar E. Chavez National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Cesar E. Chavez National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Cesar E. Chavez National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 460, LAX: 170, SFO: 200, SEA: 310 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "devils-postpile-national-monument",
    name: "Devils Postpile National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 37.62444444,
    lng: -119.08444444,
    tags: ["cultural","scenic","nature"],
    blurb: "Established in 1911 by presidential proclamation, Devils Postpile National Monument protects and preserves the Devils Postpile formation, the 101-foot high Rainbow Falls, and pristine mountain scenery.",
    attractions: [
          {
                "name": "Devils Postpile National Monument",
                "description": "Established in 1911 by presidential proclamation, Devils Postpile National Monument protects and preserves the Devils Postpile formation, the 101-foot high Rainbow Falls, and pristine mountain scenery."
          },
          {
                "name": "Devils Postpile",
                "description": "Established in 1911 by presidential proclamation, Devils Postpile National Monument protects and preserves the Devils Postpile formation, the 101-foot high Rainbow Falls, and pristine mountain scenery."
          },
          {
                "name": "Rainbow Falls",
                "description": "Established in 1911 by presidential proclamation, Devils Postpile National Monument protects and preserves the Devils Postpile formation, the 101-foot high Rainbow Falls, and pristine mountain scenery."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 450, LAX: 200, SFO: 180, SEA: 280 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "el-malpais-national-monument",
    name: "El Malpais National Monument",
    region: "Southwest",
    state: "NM",
    lat: 34.87722222,
    lng: -108.05083333,
    tags: ["cultural","scenic","nature"],
    blurb: "The richly diverse volcanic landscape of El Malpais (el-mal-pie-EES) offers solitude, recreation, and adventure.",
    attractions: [
          {
                "name": "El Malpais National Monument center",
                "description": "Walking tour through the heart of El Malpais National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around El Malpais National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine El Malpais National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 370, LAX: 260, SFO: 300, SEA: 350 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "el-morro-national-monument",
    name: "El Morro National Monument",
    region: "Southwest",
    state: "NM",
    lat: 35.03833333,
    lng: -108.35333333,
    tags: ["cultural","scenic","nature"],
    blurb: "Imagine the refreshment of finding water after days of dusty travel.",
    attractions: [
          {
                "name": "El Morro National Monument center",
                "description": "Walking tour through the heart of El Morro National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around El Morro National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine El Morro National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 370, LAX: 250, SFO: 290, SEA: 350 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "emmett-till-and-mamie-till-mobley-national-monument",
    name: "Emmett Till and Mamie Till-Mobley National Monument",
    region: "Great Plains",
    state: "Illinois / Mississippi",
    lat: 33.86055556,
    lng: -90.27472222,
    tags: ["cultural","scenic","nature"],
    blurb: "In 1955, 14-year-old Emmett Till traveled to Money, Mississippi, to visit relatives.",
    attractions: [
          {
                "name": "Emmett Till",
                "description": "In 1955, 14-year-old Emmett Till traveled to Money, Mississippi, to visit relatives."
          },
          {
                "name": "Mamie Till",
                "description": "His mother, Mamie Till-Mobley, insisted on an open-casket funeral near their hometown of Chicago."
          },
          {
                "name": "Civil Rights Movement",
                "description": "Her brave decision let the world see the racist violence inflicted upon her son and set the Civil Rights Movement into motion.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 330, CHI: 250, LAX: 440, SFO: 480, SEA: 490 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-frederica-national-monument",
    name: "Fort Frederica National Monument",
    region: "Southeast",
    state: "GA",
    lat: 31.22384,
    lng: -81.39324,
    tags: ["cultural","scenic","nature"],
    blurb: "War was imminent as James Oglethorpe established Fort Frederica in 1736, to help protect the British colonies from the Spanish in Florida.",
    attractions: [
          {
                "name": "James Oglethorpe",
                "description": "War was imminent as James Oglethorpe established Fort Frederica in 1736, to help protect the British colonies from the Spanish in Florida."
          },
          {
                "name": "Fort Frederica",
                "description": "War was imminent as James Oglethorpe established Fort Frederica in 1736, to help protect the British colonies from the Spanish in Florida."
          },
          {
                "name": "Jenkins Ear",
                "description": "Fort Frederica illustrates the story of the War of Jenkins Ear (1739-1748) and how its British defenders fought off the Spanish Army."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 300, LAX: 540, SFO: 570, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-matanzas-national-monument",
    name: "Fort Matanzas National Monument",
    region: "Southeast",
    state: "FL",
    lat: 29.71527778,
    lng: -81.23916667,
    tags: ["cultural","scenic","nature"],
    blurb: "Fort Matanzas National Monument preserves the fortified coquina watchtower, completed in 1742, which defended the southern approach to the Spanish military settlement of St.",
    attractions: [
          {
                "name": "Fort Matanzas National Monument center",
                "description": "Walking tour through the heart of Fort Matanzas National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort Matanzas National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort Matanzas National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 310, LAX: 540, SFO: 580, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-mchenry-national-monument-and-historic-shrine",
    name: "Fort McHenry National Monument and Historic Shrine",
    region: "Northeast",
    state: "MD",
    lat: 39.2633,
    lng: -76.5799,
    tags: ["cultural","nature","adventure"],
    blurb: "by the dawn's early light, a large red, white and blue banner? Whose broad stripes and bright stars..",
    attractions: [
          {
                "name": "Fort McHenry National Monument and Historic Shrine center",
                "description": "Walking tour through the heart of Fort McHenry National Monument and Historic Shrine."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort McHenry National Monument and Historic Shrine."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort McHenry National Monument and Historic Shrine is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-monroe-national-monument",
    name: "Fort Monroe National Monument",
    region: "Southeast",
    state: "VA",
    lat: 37.00361111,
    lng: -76.3075,
    tags: ["cultural","scenic","nature"],
    blurb: "Fort Monroe's story spans from prehistory to the 2000s.",
    attractions: [
          {
                "name": "Fort Monroe National Monument center",
                "description": "Walking tour through the heart of Fort Monroe National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort Monroe National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort Monroe National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 200, CHI: 270, LAX: 570, SFO: 600, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-pulaski-national-monument",
    name: "Fort Pulaski National Monument",
    region: "Southeast",
    state: "GA",
    lat: 32.02722222,
    lng: -80.89027778,
    tags: ["cultural","scenic","nature"],
    blurb: "For much of the 19th century, masonry fortifications were the United States' main defense against overseas enemies.",
    attractions: [
          {
                "name": "United States",
                "description": "For much of the 19th century, masonry fortifications were the United States' main defense against overseas enemies."
          },
          {
                "name": "Civil War",
                "description": "However, during the Civil War, new technology proved its superiority over these forts."
          },
          {
                "name": "Fort Pulaski",
                "description": "Army compelled the Confederate garrison inside Fort Pulaski to surrender."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 290, LAX: 540, SFO: 580, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-stanwix-national-monument",
    name: "Fort Stanwix National Monument",
    region: "Northeast",
    state: "NY",
    lat: 43.21055556,
    lng: -75.45527778,
    tags: ["cultural","scenic","nature"],
    blurb: "For centuries, the Oneida Carrying Place, a six-mile portage connecting the Mohawk River and Wood Creek, served as a vital link for those traveling by water from the ocean to the Great Lakes.",
    attractions: [
          {
                "name": "Oneida Carrying Place",
                "description": "For centuries, the Oneida Carrying Place, a six-mile portage connecting the Mohawk River and Wood Creek, served as a vital link for those traveling by water from the ocean to the Great Lakes."
          },
          {
                "name": "Mohawk River",
                "description": "For centuries, the Oneida Carrying Place, a six-mile portage connecting the Mohawk River and Wood Creek, served as a vital link for those traveling by water from the ocean to the Great Lakes."
          },
          {
                "name": "Wood Creek",
                "description": "For centuries, the Oneida Carrying Place, a six-mile portage connecting the Mohawk River and Wood Creek, served as a vital link for those traveling by water from the ocean to the Great Lakes."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 260, LAX: 580, SFO: 590, SEA: 560 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-union-national-monument",
    name: "Fort Union National Monument",
    region: "Southwest",
    state: "NM",
    lat: 35.907,
    lng: -105.015,
    tags: ["cultural","scenic","nature"],
    blurb: "Exposed to the wind, within a sweeping valley of short grass prairie, and along the eroded Santa Fe Trail, lie the adobe walled ruins of the largest 19th century military fort in the region.",
    attractions: [
          {
                "name": "Santa Fe Trail",
                "description": "Exposed to the wind, within a sweeping valley of short grass prairie, and along the eroded Santa Fe Trail, lie the adobe walled ruins of the largest 19th century military fort in the region."
          },
          {
                "name": "Fort Union",
                "description": "From 1851 to 1891, Fort Union functioned as an agent of change, desired or not, in the New Mexico Territory and throughout the Southwest.."
          },
          {
                "name": "New Mexico Territory",
                "description": "From 1851 to 1891, Fort Union functioned as an agent of change, desired or not, in the New Mexico Territory and throughout the Southwest.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 460, CHI: 330, LAX: 290, SFO: 320, SEA: 360 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fossil-butte-national-monument",
    name: "Fossil Butte National Monument",
    region: "Rocky Mountains",
    state: "WY",
    lat: 41.86444444,
    lng: -110.77583333,
    tags: ["cultural","scenic","nature"],
    blurb: "In the ridges of southwest Wyoming are some of the best-preserved fossils in the world.",
    attractions: [
          {
                "name": "Fossil Butte National Monument center",
                "description": "Walking tour through the heart of Fossil Butte National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fossil Butte National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fossil Butte National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 270, SFO: 270, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "frances-perkins-national-monument",
    name: "Frances Perkins National Monument",
    region: "Northeast",
    state: "ME",
    lat: 44.00527778,
    lng: -69.5575,
    tags: ["cultural","scenic","nature"],
    blurb: "Known as the first woman to hold a presidential cabinet position and the \"Woman behind the New Deal,\" Frances Perkins championed many labor rights that Americans enjoy today, including safety stand...",
    attractions: [
          {
                "name": "New Deal",
                "description": "Known as the first woman to hold a presidential cabinet position and the \"Woman behind the New Deal,\" Frances Perkins championed many labor rights that Americans enjoy today, including safety standards, Social Security, and shorter workweeks."
          },
          {
                "name": "Frances Perkins",
                "description": "Known as the first woman to hold a presidential cabinet position and the \"Woman behind the New Deal,\" Frances Perkins championed many labor rights that Americans enjoy today, including safety standards, Social Security, and shorter workweeks."
          },
          {
                "name": "Social Security",
                "description": "Known as the first woman to hold a presidential cabinet position and the \"Woman behind the New Deal,\" Frances Perkins championed many labor rights that Americans enjoy today, including safety standards, Social Security, and shorter workweeks."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 210, CHI: 320, LAX: 630, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "freedom-riders-national-monument",
    name: "Freedom Riders National Monument",
    region: "Southeast",
    state: "AL",
    lat: 33.635,
    lng: -85.90833333,
    tags: ["cultural","scenic","nature"],
    blurb: "In 1961, a small interracial band of \"Freedom Riders\" challenged discriminatory laws requiring separation of the races in interstate travel.",
    attractions: [
          {
                "name": "Freedom Riders National Monument center",
                "description": "Walking tour through the heart of Freedom Riders National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Freedom Riders National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Freedom Riders National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 300, CHI: 250, LAX: 480, SFO: 520, SEA: 530 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "george-washington-birthplace-national-monument",
    name: "George Washington Birthplace National Monument",
    region: "Southeast",
    state: "VA",
    lat: 38.18555556,
    lng: -76.91638889,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "George Washington Birthplace National Monument is located in the Northern Neck of Virginia.",
    attractions: [
          {
                "name": "Washington Birthplace National Monument",
                "description": "George Washington Birthplace National Monument is located in the Northern Neck of Virginia."
          },
          {
                "name": "Northern Neck",
                "description": "George Washington Birthplace National Monument is located in the Northern Neck of Virginia."
          },
          {
                "name": "George Washington",
                "description": "It encompasses 551 acres of land where seven generations of the Washington family lived and where George Washington was born in 1732."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "george-washington-carver-national-monument",
    name: "George Washington Carver National Monument",
    region: "Great Plains",
    state: "MO",
    lat: 36.986361,
    lng: -94.354191,
    tags: ["cultural","scenic","nature"],
    blurb: "The young child known as the \"Plant Doctor\" tended his secret garden while observing the day-to-day operations of a 19th century farm.",
    attractions: [
          {
                "name": "George Washington Carver National Monument center",
                "description": "Walking tour through the heart of George Washington Carver National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around George Washington Carver National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine George Washington Carver National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 240, LAX: 400, SFO: 430, SEA: 440 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "gila-cliff-dwellings-national-monument",
    name: "Gila Cliff Dwellings National Monument",
    region: "Southwest",
    state: "NM",
    lat: 33.22722222,
    lng: -108.27222222,
    tags: ["cultural","scenic","nature"],
    blurb: "For thousands of years, groups of nomads used the caves above Cliff Dweller Creek as temporary shelter.",
    attractions: [
          {
                "name": "Gila Cliff Dwellings National Monument center",
                "description": "Walking tour through the heart of Gila Cliff Dwellings National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Gila Cliff Dwellings National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Gila Cliff Dwellings National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 500, CHI: 380, LAX: 260, SFO: 300, SEA: 370 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "governors-island-national-monument",
    name: "Governors Island National Monument",
    region: "Northeast",
    state: "NY",
    lat: 40.69138889,
    lng: -74.01611111,
    tags: ["cultural","scenic","nature"],
    blurb: "From 1794 to 1966, the U.S.",
    attractions: [
          {
                "name": "Governors Island",
                "description": "Army presence on Governors Island played a vital role in the social, political, and economic life of New York City."
          },
          {
                "name": "New York City",
                "description": "Army presence on Governors Island played a vital role in the social, political, and economic life of New York City."
          },
          {
                "name": "Governors Island",
                "description": "Today, Governors Island has transformed into a destination for art, culture, and public programs.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "grand-canyon-parashant-national-monument",
    name: "Grand Canyon-Parashant National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 36.4,
    lng: -113.7,
    tags: ["cultural","scenic","nature"],
    blurb: "Despite the hardships created by rugged isolation and the lack of natural waters, Parashant has a long human history spanning more than 11,000 years, and an equally rich geologic history spanning a...",
    attractions: [
          {
                "name": "Grand Canyon-Parashant National Monument center",
                "description": "Walking tour through the heart of Grand Canyon-Parashant National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Grand Canyon-Parashant National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Grand Canyon-Parashant National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 540, CHI: 410, LAX: 210, SFO: 240, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "grand-portage-national-monument",
    name: "Grand Portage National Monument",
    region: "Great Plains",
    state: "MN",
    lat: 47.99638889,
    lng: -89.73416667,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Travel into the past to discover the present.",
    attractions: [
          {
                "name": "Grand Portage Anishinaabe",
                "description": "Explore the partnership between the Grand Portage Anishinaabe and the North West Company during the North American fur trade."
          },
          {
                "name": "North West Company",
                "description": "Explore the partnership between the Grand Portage Anishinaabe and the North West Company during the North American fur trade."
          },
          {
                "name": "North American",
                "description": "Explore the partnership between the Grand Portage Anishinaabe and the North West Company during the North American fur trade."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 320, CHI: 230, LAX: 470, SFO: 470, SEA: 420 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "hagerman-fossil-beds-national-monument",
    name: "Hagerman Fossil Beds National Monument",
    region: "Rocky Mountains",
    state: "ID",
    lat: 42.79027778,
    lng: -114.94527778,
    tags: ["cultural","scenic","nature"],
    blurb: "During the Pliocene, this place looked quite different.",
    attractions: [
          {
                "name": "Hagerman Fossil Beds National Monument center",
                "description": "Walking tour through the heart of Hagerman Fossil Beds National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Hagerman Fossil Beds National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Hagerman Fossil Beds National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 270, SFO: 250, SEA: 240 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "hovenweep-national-monument",
    name: "Hovenweep National Monument",
    region: "Rocky Mountains",
    state: "Colorado / Utah",
    lat: 37.38388889,
    lng: -109.07722222,
    tags: ["cultural","scenic","nature"],
    blurb: "Hovenweep preserves six prehistoric sites built between 1200 and 1300 CE which may have served as ceremonial centers.",
    attractions: [
          {
                "name": "Hovenweep National Monument center",
                "description": "Walking tour through the heart of Hovenweep National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Hovenweep National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Hovenweep National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 250, SFO: 280, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "john-day-fossil-beds-national-monument",
    name: "John Day Fossil Beds National Monument",
    region: "Pacific West",
    state: "OR",
    lat: 44.55583333,
    lng: -119.64527778,
    tags: ["cultural","scenic","nature"],
    blurb: "Large rhino-like brontotheres roam a semitropical forest.",
    attractions: [
          {
                "name": "John Day Fossil Beds National Monument center",
                "description": "Walking tour through the heart of John Day Fossil Beds National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around John Day Fossil Beds National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine John Day Fossil Beds National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 560, CHI: 440, LAX: 280, SFO: 240, SEA: 190 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "katahdin-woods-and-waters-national-monument",
    name: "Katahdin Woods and Waters National Monument",
    region: "Northeast",
    state: "ME",
    lat: 45.970362,
    lng: -68.619336,
    tags: ["cultural","scenic","nature"],
    blurb: "Spread across a wild landscape offering spectacular views of Katahdin, Katahdin Woods and Waters invites discovery of its rivers, streams, woods, flora, fauna, geology, and the night skies that hav...",
    attractions: [
          {
                "name": "Katahdin Woods and Waters National Monument center",
                "description": "Walking tour through the heart of Katahdin Woods and Waters National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Katahdin Woods and Waters National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Katahdin Woods and Waters National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 230, CHI: 330, LAX: 640, SFO: 650, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "medgar-and-myrlie-evers-home-national-monument",
    name: "Medgar and Myrlie Evers Home National Monument",
    region: "Southeast",
    state: "MS",
    lat: 32.34097,
    lng: -90.21265,
    tags: ["cultural","scenic","nature"],
    blurb: "Medgar and Myrlie Evers were partners in the civil rights struggle.",
    attractions: [
          {
                "name": "Myrlie Evers",
                "description": "Medgar and Myrlie Evers were partners in the civil rights struggle."
          },
          {
                "name": "Medgar Evers",
                "description": "The assassination of Medgar Evers in the carport of their home on June 12, 1963, was the first murder of a nationally significant leader of the American Civil Rights Movement, and it became a catalyst for passage of the Civil Rights Act of 1964."
          },
          {
                "name": "American Civil Rights Movement",
                "description": "The assassination of Medgar Evers in the carport of their home on June 12, 1963, was the first murder of a nationally significant leader of the American Civil Rights Movement, and it became a catalyst for passage of the Civil Rights Act of 1964."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 340, CHI: 270, LAX: 440, SFO: 480, SEA: 510 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "mill-springs-battlefield-national-monument",
    name: "Mill Springs Battlefield National Monument",
    region: "Southeast",
    state: "KY",
    lat: 37.06888889,
    lng: -84.73611111,
    tags: ["cultural","scenic","nature"],
    blurb: "The US won a significant victory early in the Civil War at the Battle of Mill Springs.",
    attractions: [
          {
                "name": "Mill Springs Battlefield National Monument center",
                "description": "Walking tour through the heart of Mill Springs Battlefield National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Mill Springs Battlefield National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Mill Springs Battlefield National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 220, LAX: 490, SFO: 520, SEA: 510 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "navajo-national-monument",
    name: "Navajo National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 36.6783318,
    lng: -110.540972,
    tags: ["cultural","scenic","nature"],
    blurb: "For centuries, the Hopi, San Juan Southern Paiute, Zuni, and Navajo people have lived in the canyons.",
    attractions: [
          {
                "name": "San Juan Southern Paiute",
                "description": "For centuries, the Hopi, San Juan Southern Paiute, Zuni, and Navajo people have lived in the canyons."
          },
          {
                "name": "Keet Seel",
                "description": "The cliff dwellings of Betatakin, Keet Seel, and Inscription House were last physically occupied around 1300 AD but the villages have a spiritual presence that can still be felt today.."
          },
          {
                "name": "Inscription House",
                "description": "The cliff dwellings of Betatakin, Keet Seel, and Inscription House were last physically occupied around 1300 AD but the villages have a spiritual presence that can still be felt today.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 380, LAX: 240, SFO: 270, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "pipe-spring-national-monument",
    name: "Pipe Spring National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 36.8625,
    lng: -112.7375,
    tags: ["cultural","scenic","nature"],
    blurb: "The rich history of Pipe Spring and its flowing water comes alive as you explore the traditions of the Kaibab Paiute and the Mormon settlers through the museum, historic fort, cabins, and garden.",
    attractions: [
          {
                "name": "Pipe Spring",
                "description": "The rich history of Pipe Spring and its flowing water comes alive as you explore the traditions of the Kaibab Paiute and the Mormon settlers through the museum, historic fort, cabins, and garden."
          },
          {
                "name": "Kaibab Paiute",
                "description": "The rich history of Pipe Spring and its flowing water comes alive as you explore the traditions of the Kaibab Paiute and the Mormon settlers through the museum, historic fort, cabins, and garden."
          },
          {
                "name": "Ridge Trail",
                "description": "Hike the Ridge Trail to enjoy geologic wonders, plants, and wildlife."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 220, SFO: 250, SEA: 310 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "pipestone-national-monument",
    name: "Pipestone National Monument",
    region: "Great Plains",
    state: "MN",
    lat: 44.01333333,
    lng: -96.325,
    tags: ["cultural","scenic","nature"],
    blurb: "For over 3,000 years, Indigenous people have quarried the red stone at this site to make pipes used in prayer and ceremony - a tradition that continues to this day and makes this site sacred to man...",
    attractions: [
          {
                "name": "Pipestone National Monument center",
                "description": "Walking tour through the heart of Pipestone National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Pipestone National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Pipestone National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 360, CHI: 230, LAX: 400, SFO: 410, SEA: 380 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "poverty-point-national-monument",
    name: "Poverty Point National Monument",
    region: "Southeast",
    state: "LA",
    lat: 32.63666667,
    lng: -91.41138889,
    tags: ["cultural","scenic","nature"],
    blurb: "Now a nearly forgotten culture, Poverty Point at its peak 3,000 years ago was part of an enormous trading network that stretched for hundreds of miles across the continent.",
    attractions: [
          {
                "name": "Poverty Point National Monument center",
                "description": "Walking tour through the heart of Poverty Point National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Poverty Point National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Poverty Point National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 270, LAX: 430, SFO: 470, SEA: 490 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "russell-cave-national-monument",
    name: "Russell Cave National Monument",
    region: "Southeast",
    state: "AL",
    lat: 34.97662,
    lng: -85.81425,
    tags: ["cultural","scenic","nature"],
    blurb: "Russell Cave National Monument is an archeological site with one of the most complete records of prehistoric cultures in the Southeast.",
    attractions: [
          {
                "name": "Russell Cave National Monument center",
                "description": "Walking tour through the heart of Russell Cave National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Russell Cave National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Russell Cave National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 240, LAX: 480, SFO: 520, SEA: 520 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "salinas-pueblo-missions-national-monument",
    name: "Salinas Pueblo Missions National Monument",
    region: "Southwest",
    state: "NM",
    lat: 34.25972222,
    lng: -106.09027778,
    tags: ["cultural","scenic","nature"],
    blurb: "Tucked away in the middle of New Mexico you'll find Salinas Pueblo Missions National Monument.",
    attractions: [
          {
                "name": "Salinas Pueblo Missions National Monument center",
                "description": "Walking tour through the heart of Salinas Pueblo Missions National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Salinas Pueblo Missions National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Salinas Pueblo Missions National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 470, CHI: 350, LAX: 280, SFO: 320, SEA: 370 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "starved-rock",
    name: "Starved Rock State Park",
    region: "Great Plains",
    state: "IL",
    lat: 41.32138889,
    lng: -88.99027778,
    tags: ["nature","chill","adventure"],
    blurb: "Eighteen canyons carved by glacial meltwater cut into sandstone bluffs along the Illinois River, each ending in a seasonal waterfall framed by moss-covered walls.",
    attractions: [
          {
                "name": "Starved Rock State Park center",
                "description": "Walking tour through the heart of Starved Rock State Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Starved Rock State Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Starved Rock State Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 160, LAX: 450, SFO: 470, SEA: 450 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring","summer","fall","winter"],
  },
  {
    slug: "stonewall-national-monument",
    name: "Stonewall National Monument",
    region: "Northeast",
    state: "NY",
    lat: 40.73387194,
    lng: -74.002175,
    tags: ["cultural","scenic","nature"],
    blurb: "Before the 1960s, almost everything about living authentically as a lesbian, a bisexual person or a gay man was illegal.",
    attractions: [
          {
                "name": "Stonewall National Monument center",
                "description": "Walking tour through the heart of Stonewall National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Stonewall National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Stonewall National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "tule-lake-national-monument",
    name: "Tule Lake National Monument",
    region: "Pacific West",
    state: "CA",
    lat: 41.88944444,
    lng: -121.37472222,
    tags: ["cultural","scenic","nature"],
    blurb: "Tule Lake National Monument includes both Tule Lake Segregation Center, the largest and most controversial of the sites where Japanese Americans were incarcerated during World War II, and Camp Tule...",
    attractions: [
          {
                "name": "Lake National Monument",
                "description": "Tule Lake National Monument includes both Tule Lake Segregation Center, the largest and most controversial of the sites where Japanese Americans were incarcerated during World War II, and Camp Tulelake, which was first a Civilian Conservation Corps camp, then an additional facility to detain Japanese Americans, and finally a prisoner of war camp.."
          },
          {
                "name": "Tule Lake Segregation Center",
                "description": "Tule Lake National Monument includes both Tule Lake Segregation Center, the largest and most controversial of the sites where Japanese Americans were incarcerated during World War II, and Camp Tulelake, which was first a Civilian Conservation Corps camp, then an additional facility to detain Japanese Americans, and finally a prisoner of war camp.."
          },
          {
                "name": "Japanese Americans",
                "description": "Tule Lake National Monument includes both Tule Lake Segregation Center, the largest and most controversial of the sites where Japanese Americans were incarcerated during World War II, and Camp Tulelake, which was first a Civilian Conservation Corps camp, then an additional facility to detain Japanese Americans, and finally a prisoner of war camp.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 460, LAX: 250, SFO: 200, SEA: 220 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "tule-springs-fossil-beds-national-monument",
    name: "Tule Springs Fossil Beds National Monument",
    region: "Southwest",
    state: "NV",
    lat: 36.371,
    lng: -115.306,
    tags: ["cultural","scenic","nature"],
    blurb: "Over the last ~570,000 years, water has transformed the Upper Las Vegas Valley.",
    attractions: [
          {
                "name": "Tule Springs Fossil Beds National Monument center",
                "description": "Walking tour through the heart of Tule Springs Fossil Beds National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Tule Springs Fossil Beds National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Tule Springs Fossil Beds National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 550, CHI: 420, LAX: 190, SFO: 220, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "tuzigoot-national-monument",
    name: "Tuzigoot National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 34.7708537,
    lng: -112.0259912,
    tags: ["cultural","scenic","nature"],
    blurb: "Water flows under and through this landscape, feeding the growth of people and towns.",
    attractions: [
          {
                "name": "Tuzigoot National Monument center",
                "description": "Walking tour through the heart of Tuzigoot National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Tuzigoot National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Tuzigoot National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 400, LAX: 220, SFO: 260, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "virgin-islands-coral-reef-national-monument",
    name: "Virgin Islands Coral Reef National Monument",
    region: "Southeast",
    state: "U.S. Virgin Islands",
    lat: 18.30611111,
    lng: -64.72694444,
    tags: ["cultural","scenic","nature","adventure"],
    blurb: "Virgin Islands Coral Reef National Monument includes federal submerged lands within the 3-mile belt off the island of St.",
    attractions: [
          {
                "name": "Virgin Islands Coral Reef National Monument center",
                "description": "Walking tour through the heart of Virgin Islands Coral Reef National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Virgin Islands Coral Reef National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Virgin Islands Coral Reef National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 530, LAX: 700, SFO: 700, SEA: 700 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "waco-mammoth-national-monument",
    name: "Waco Mammoth National Monument",
    region: "Southwest",
    state: "TX",
    lat: 31.606,
    lng: -97.175,
    tags: ["cultural","scenic","nature"],
    blurb: "Standing as tall as 14 feet and weighing 20,000 pounds, Columbian mammoths roamed across what is present-day Texas thousands of years ago.",
    attractions: [
          {
                "name": "Waco Mammoth National Monument center",
                "description": "Walking tour through the heart of Waco Mammoth National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Waco Mammoth National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Waco Mammoth National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 410, CHI: 310, LAX: 370, SFO: 420, SEA: 460 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "walnut-canyon-national-monument",
    name: "Walnut Canyon National Monument",
    region: "Southwest",
    state: "AZ",
    lat: 35.16583333,
    lng: -111.50194444,
    tags: ["cultural","scenic","nature"],
    blurb: "Since time immemorial, Indigenous Peoples have lived and traveled throughout Walnut Canyon's dynamic landscape.",
    attractions: [
          {
                "name": "Walnut Canyon National Monument center",
                "description": "Walking tour through the heart of Walnut Canyon National Monument."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Walnut Canyon National Monument."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Walnut Canyon National Monument is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 220, SFO: 260, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "yucca-house-national-monument",
    name: "Yucca House National Monument",
    region: "Rocky Mountains",
    state: "CO",
    lat: 37.25027778,
    lng: -108.68638889,
    tags: ["cultural","scenic","nature"],
    blurb: "Yucca House National Monument preserves a large unexcavated pueblo with a stunning setting in Montezuma Valley, nestled between Mesa Verde and Ute Mountain.",
    attractions: [
          {
                "name": "House National Monument",
                "description": "Yucca House National Monument preserves a large unexcavated pueblo with a stunning setting in Montezuma Valley, nestled between Mesa Verde and Ute Mountain."
          },
          {
                "name": "Montezuma Valley",
                "description": "Yucca House National Monument preserves a large unexcavated pueblo with a stunning setting in Montezuma Valley, nestled between Mesa Verde and Ute Mountain."
          },
          {
                "name": "Mesa Verde",
                "description": "Yucca House National Monument preserves a large unexcavated pueblo with a stunning setting in Montezuma Valley, nestled between Mesa Verde and Ute Mountain."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 360, LAX: 260, SFO: 290, SEA: 330 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "cape-lookout-national-seashore",
    name: "Cape Lookout National Seashore",
    region: "Southeast",
    state: "NC",
    lat: 34.6125,
    lng: -76.5306,
    tags: ["nature","chill","adventure"],
    blurb: "A boat ride three miles off-shore brings you to the barrier islands of Cape Lookout National Seashore.",
    attractions: [
          {
                "name": "Cape Lookout National Seashore center",
                "description": "Walking tour through the heart of Cape Lookout National Seashore."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Cape Lookout National Seashore."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Cape Lookout National Seashore is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 230, CHI: 290, LAX: 580, SFO: 610, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "amistad-national-recreation-area",
    name: "Amistad National Recreation Area",
    region: "Southwest",
    state: "TX",
    lat: 29.43666667,
    lng: -101.05,
    tags: ["cultural","nature","adventure"],
    blurb: "An oasis in the desert, Amistad National Recreation Area consists of the US portion of the International Amistad Reservoir.",
    attractions: [
          {
                "name": "Amistad National Recreation Area center",
                "description": "Walking tour through the heart of Amistad National Recreation Area."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Amistad National Recreation Area."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Amistad National Recreation Area is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 460, CHI: 360, LAX: 340, SFO: 390, SEA: 450 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "bighorn-canyon-national-recreation-area",
    name: "Bighorn Canyon National Recreation Area",
    region: "Rocky Mountains",
    state: "Montana / Wyoming",
    lat: 45.19444444,
    lng: -108.13055556,
    tags: ["scenic"],
    blurb: "The vast, wild landscape of Bighorn Canyon National Recreation Area offers visitors unparalleled opportunities to immerse themselves in the natural world, and experience the wonders of this extraor...",
    attractions: [
          {
                "name": "Bighorn Canyon National Recreation Area center",
                "description": "Walking tour through the heart of Bighorn Canyon National Recreation Area."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Bighorn Canyon National Recreation Area."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Bighorn Canyon National Recreation Area is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 460, CHI: 340, LAX: 320, SFO: 310, SEA: 270 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "bluestone-national-scenic-river",
    name: "Bluestone National Scenic River",
    region: "Southeast",
    state: "WV",
    lat: 37.54166667,
    lng: -80.99916667,
    tags: ["cultural","nature","scenic"],
    blurb: "The Bluestone River and the rugged and ancient gorge it has carved is a richly diverse and scenic area of the southern Appalachians.",
    attractions: [
          {
                "name": "Bluestone River",
                "description": "The Bluestone River and the rugged and ancient gorge it has carved is a richly diverse and scenic area of the southern Appalachians."
          },
          {
                "name": "National Scenic River",
                "description": "Bluestone National Scenic River is preserved as a living landscape that provides an unspoiled experience for visitors and a haven for a variety of plants and animals."
          },
          {
                "name": "Bluestone River",
                "description": "The park protects a 10.5-mile section of the Bluestone River in southern West Virginia.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 230, CHI: 230, LAX: 530, SFO: 550, SEA: 540 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "boston-harbor-islands-national-recreation-area",
    name: "Boston Harbor Islands National Recreation Area",
    region: "Northeast",
    state: "MA",
    lat: 42.31861111,
    lng: -70.94583333,
    tags: ["nature"],
    blurb: "Boston Harbor Islands National Recreation Area is a destination in Northeast, MA worth visiting for its scenic beauty and cultural offerings.",
    attractions: [
          {
                "name": "Boston Harbor Islands National Recreation Area center",
                "description": "Walking tour through the heart of Boston Harbor Islands National Recreation Area."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Boston Harbor Islands National Recreation Area."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Boston Harbor Islands National Recreation Area is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chickasaw-national-recreation-area",
    name: "Chickasaw National Recreation Area",
    region: "Pacific West",
    state: "OK",
    lat: 34.50055556,
    lng: -96.97222222,
    tags: ["cultural"],
    blurb: "Springs, streams, lakes - whatever its form, water is the attraction at Chickasaw National Recreation Area.",
    attractions: [
          {
                "name": "Chickasaw National Recreation Area center",
                "description": "Walking tour through the heart of Chickasaw National Recreation Area."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Chickasaw National Recreation Area."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Chickasaw National Recreation Area is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 390, CHI: 280, LAX: 370, SFO: 410, SEA: 440 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "gauley-river-national-recreation-area",
    name: "Gauley River National Recreation Area",
    region: "Southeast",
    state: "WV",
    lat: 38.22,
    lng: -80.89,
    tags: ["nature","adventure"],
    blurb: "The 25 miles of free-flowing Gauley River and the six miles of the Meadow River pass through scenic gorges and valleys containing a wide variety of natural and cultural features.",
    attractions: [
          {
                "name": "Gauley River",
                "description": "The 25 miles of free-flowing Gauley River and the six miles of the Meadow River pass through scenic gorges and valleys containing a wide variety of natural and cultural features."
          },
          {
                "name": "Meadow River",
                "description": "The 25 miles of free-flowing Gauley River and the six miles of the Meadow River pass through scenic gorges and valleys containing a wide variety of natural and cultural features."
          },
          {
                "name": "Gauley River",
                "description": "The Gauley River contains several class V+ rapids, making it one of the most adventurous white water boating rivers in the east.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 230, LAX: 530, SFO: 550, SEA: 540 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "ice-age-national-scenic-trail",
    name: "Ice Age National Scenic Trail",
    region: "Great Plains",
    state: "WI",
    lat: 43.43383333,
    lng: -89.72247222,
    tags: ["nature","scenic"],
    blurb: "The Ice Age National Scenic Trail spans 1,200 miles, traverses some of Wisconsin's finest geologic and glacial features, and passes through the ancestral lands of 15 Tribes.",
    attractions: [
          {
                "name": "Ice Age National Scenic",
                "description": "The Ice Age National Scenic Trail spans 1,200 miles, traverses some of Wisconsin's finest geologic and glacial features, and passes through the ancestral lands of 15 Tribes."
          },
          {
                "name": "Ice Age Trail Alliance",
                "description": "The Trail is built, managed and maintained by dedicated volunteers, Ice Age Trail Alliance, Wisconsin Department of Natural Resources, local partners, and the National Park Service.."
          },
          {
                "name": "Wisconsin Department",
                "description": "The Trail is built, managed and maintained by dedicated volunteers, Ice Age Trail Alliance, Wisconsin Department of Natural Resources, local partners, and the National Park Service.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 300, CHI: 180, LAX: 450, SFO: 460, SEA: 440 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lake-meredith-national-recreation-area",
    name: "Lake Meredith National Recreation Area",
    region: "Southwest",
    state: "TX",
    lat: 35.71472222,
    lng: -101.55277778,
    tags: ["scenic"],
    blurb: "Set within the wideopen Texas Plains, Lake Meredith National Recreation Area offers a peaceful retreat in the heart of rugged grasslands.",
    attractions: [
          {
                "name": "Texas Plains",
                "description": "Set within the wideopen Texas Plains, Lake Meredith National Recreation Area offers a peaceful retreat in the heart of rugged grasslands."
          },
          {
                "name": "Lake Meredith National Recreation",
                "description": "Set within the wideopen Texas Plains, Lake Meredith National Recreation Area offers a peaceful retreat in the heart of rugged grasslands."
          },
          {
                "name": "Canadian River",
                "description": "Over thousands of years, the Canadian River carved dramatic 200foot canyons-known as breaks-that now frame the lake in striking layers of color and texture."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 300, LAX: 320, SFO: 360, SEA: 390 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lower-delaware-national-wild-and-scenic-river",
    name: "Lower Delaware National Wild and Scenic River",
    region: "Northeast",
    state: "Pennsylvania / New Jersey",
    lat: 40.5029,
    lng: -75.065,
    tags: ["nature","scenic"],
    blurb: "The Delaware River, the largest free-flowing river in the eastern United States, runs past forests, farmlands and villages.",
    attractions: [
          {
                "name": "Delaware River",
                "description": "The Delaware River, the largest free-flowing river in the eastern United States, runs past forests, farmlands and villages."
          },
          {
                "name": "United States",
                "description": "The Delaware River, the largest free-flowing river in the eastern United States, runs past forests, farmlands and villages."
          },
          {
                "name": "National Wild",
                "description": "In 2000, the National Wild and Scenic River System incorporated key segments of the lower Delaware River to form this unit of the National Park System.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "niobrara-national-scenic-river",
    name: "Niobrara National Scenic River",
    region: "Great Plains",
    state: "NE",
    lat: 42.88333333,
    lng: -100.31666667,
    tags: ["cultural","scenic"],
    blurb: "With a little something for everyone, the Niobrara National Scenic River is a destination for crossing adventures off your bucket list.",
    attractions: [
          {
                "name": "Niobrara National Scenic River center",
                "description": "Walking tour through the heart of Niobrara National Scenic River."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Niobrara National Scenic River."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Niobrara National Scenic River is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 390, CHI: 270, LAX: 360, SFO: 370, SEA: 350 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "ozark-national-scenic-riverways",
    name: "Ozark National Scenic Riverways",
    region: "Great Plains",
    state: "MO",
    lat: 37.1907,
    lng: -91.2763,
    tags: ["scenic"],
    blurb: "Ozark National Scenic Riverways is the first national park area to protect a river system.",
    attractions: [
          {
                "name": "National Scenic Riverways",
                "description": "Ozark National Scenic Riverways is the first national park area to protect a river system."
          },
          {
                "name": "Jacks Fork",
                "description": "The Current and Jacks Fork rivers are two of the finest floating rivers found anywhere."
          },
          {
                "name": "Alley Mill",
                "description": "Besides these two famous rivers, the park is home to hundreds of freshwater springs, caves, trails, and historic sites such as Alley Mill.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 320, CHI: 220, LAX: 430, SFO: 460, SEA: 460 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "saint-croix-national-scenic-riverway",
    name: "Saint Croix National Scenic Riverway",
    region: "Great Plains",
    state: "Wisconsin / Minnesota",
    lat: 45.41591667,
    lng: -92.64655556,
    tags: ["nature","scenic","adventure"],
    blurb: "Grab your paddle and your longing for adventure and head to the St.",
    attractions: [
          {
                "name": "Saint Croix National Scenic Riverway center",
                "description": "Walking tour through the heart of Saint Croix National Scenic Riverway."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Saint Croix National Scenic Riverway."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Saint Croix National Scenic Riverway is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 330, CHI: 210, LAX: 430, SFO: 440, SEA: 400 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "adams-national-historical-park",
    name: "Adams National Historical Park",
    region: "Northeast",
    state: "MA",
    lat: 42.25638889,
    lng: -71.01138889,
    tags: ["cultural"],
    blurb: "From the sweet little farm at the foot of Penn's Hill to the gentleman's country estate at Peace field, Adams National Historical Park is the story of \"heroes, statesmen, philosophers...and learned...",
    attractions: [
          {
                "name": "Adams National Historical Park center",
                "description": "Walking tour through the heart of Adams National Historical Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Adams National Historical Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Adams National Historical Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "allegheny-portage-railroad-national-historic-site",
    name: "Allegheny Portage Railroad National Historic Site",
    region: "Northeast",
    state: "PA",
    lat: 40.45416667,
    lng: -78.54027778,
    tags: ["cultural","nature"],
    blurb: "The first railroad to cross the Allegheny Mountains, the Allegheny Portage Railroad was the final piece of the Pennsylvania Main Line Canal.",
    attractions: [
          {
                "name": "Allegheny Mountains",
                "description": "The first railroad to cross the Allegheny Mountains, the Allegheny Portage Railroad was the final piece of the Pennsylvania Main Line Canal."
          },
          {
                "name": "Allegheny Portage Railroad",
                "description": "The first railroad to cross the Allegheny Mountains, the Allegheny Portage Railroad was the final piece of the Pennsylvania Main Line Canal."
          },
          {
                "name": "Pennsylvania Main Line Canal",
                "description": "The first railroad to cross the Allegheny Mountains, the Allegheny Portage Railroad was the final piece of the Pennsylvania Main Line Canal."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 240, LAX: 550, SFO: 570, SEA: 550 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "amache-national-historic-site",
    name: "Amache National Historic Site",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.04962,
    lng: -102.3286,
    tags: ["cultural"],
    blurb: "Amache, also known as the Granada Relocation Center, near Granada, Colorado was one of ten incarceration sites established by the War Relocation Authority during World War II to unjustly incarcerat...",
    attractions: [
          {
                "name": "Granada Relocation Center",
                "description": "Amache, also known as the Granada Relocation Center, near Granada, Colorado was one of ten incarceration sites established by the War Relocation Authority during World War II to unjustly incarcerate Japanese Americans."
          },
          {
                "name": "War Relocation Authority",
                "description": "Amache, also known as the Granada Relocation Center, near Granada, Colorado was one of ten incarceration sites established by the War Relocation Authority during World War II to unjustly incarcerate Japanese Americans."
          },
          {
                "name": "World War",
                "description": "Amache, also known as the Granada Relocation Center, near Granada, Colorado was one of ten incarceration sites established by the War Relocation Authority during World War II to unjustly incarcerate Japanese Americans."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 420, CHI: 300, LAX: 320, SFO: 350, SEA: 370 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "andersonville-national-historic-site",
    name: "Andersonville National Historic Site",
    region: "Southeast",
    state: "GA",
    lat: 32.19472222,
    lng: -84.12888889,
    tags: ["cultural","scenic"],
    blurb: "Nearly 13,000 men died on these grounds, a site that became infamous even before the Civil War ended.",
    attractions: [
          {
                "name": "Civil War",
                "description": "Nearly 13,000 men died on these grounds, a site that became infamous even before the Civil War ended."
          },
          {
                "name": "Andersonville National Cemetery",
                "description": "Their burial grounds became Andersonville National Cemetery, where veterans continue to be buried today."
          },
          {
                "name": "National Prisoner",
                "description": "This place, where tens of thousands suffered captivity so others could be free, is also home to the National Prisoner of War Museum and serves as a memorial to all American prisoners of war.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 300, CHI: 280, LAX: 510, SFO: 540, SEA: 560 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "andrew-johnson-national-historic-site",
    name: "Andrew Johnson National Historic Site",
    region: "Southeast",
    state: "TN",
    lat: 36.15833333,
    lng: -82.835,
    tags: ["cultural"],
    blurb: "Andrew Johnson's complex presidency (1865-69) illustrates the Constitution at work following the Civil War.",
    attractions: [
          {
                "name": "Andrew Johnson National Historic Site center",
                "description": "Walking tour through the heart of Andrew Johnson National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Andrew Johnson National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Andrew Johnson National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 250, CHI: 230, LAX: 510, SFO: 540, SEA: 540 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "appomattox-court-house-national-historical-park",
    name: "Appomattox Court House National Historical Park",
    region: "Southeast",
    state: "VA",
    lat: 37.3775,
    lng: -78.796,
    tags: ["cultural","nature","scenic"],
    blurb: "On April 9, 1865, the surrender of the Army of Northern Virginia in the McLean House in the village of Appomattox Court House, Virginia signaled the effective end of the nation's largest war.",
    attractions: [
          {
                "name": "Appomattox Court House National Historical Park center",
                "description": "Walking tour through the heart of Appomattox Court House National Historical Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Appomattox Court House National Historical Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Appomattox Court House National Historical Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 210, CHI: 250, LAX: 550, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "arkansas-post-national-memorial",
    name: "Arkansas Post National Memorial",
    region: "Southeast",
    state: "AR",
    lat: 34.01666667,
    lng: -91.34527778,
    tags: ["cultural","nature"],
    blurb: "Located at the confluence of two rivers, Arkansas Post has served as a gathering place for many cultures throughout human history - it represents cultural cooperation, conflict, synthesis, and dive...",
    attractions: [
          {
                "name": "Arkansas Post National Memorial center",
                "description": "Walking tour through the heart of Arkansas Post National Memorial."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Arkansas Post National Memorial."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Arkansas Post National Memorial is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 340, CHI: 250, LAX: 430, SFO: 460, SEA: 480 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "bents-old-fort-national-historic-site",
    name: "Bent's Old Fort National Historic Site",
    region: "Rocky Mountains",
    state: "CO",
    lat: 38.0406,
    lng: -103.4294,
    tags: ["cultural","nature"],
    blurb: "In the 1840s the Arkansas River was the border between territory claimed by the United States and Mexico.",
    attractions: [
          {
                "name": "Arkansas River",
                "description": "In the 1840s the Arkansas River was the border between territory claimed by the United States and Mexico."
          },
          {
                "name": "United States",
                "description": "In the 1840s the Arkansas River was the border between territory claimed by the United States and Mexico."
          },
          {
                "name": "Santa Fe Trail",
                "description": "Located along the river, Bent's Fort was an adobe trading post on the Santa Fe Trail, where traders, trappers, travelers, and the Cheyenne and Arapaho tribes came together in peaceful terms for trade."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 310, SFO: 340, SEA: 360 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "big-hole-national-battlefield",
    name: "Big Hole National Battlefield",
    region: "Rocky Mountains",
    state: "MT",
    lat: 45.6375,
    lng: -113.64361111,
    tags: ["nature"],
    blurb: "On August 9, 1877, gunshots shattered a chilly dawn on a sleeping camp of nmipu (Nez Perce).",
    attractions: [
          {
                "name": "Big Hole National Battlefield center",
                "description": "Walking tour through the heart of Big Hole National Battlefield."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Big Hole National Battlefield."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Big Hole National Battlefield is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 510, CHI: 390, LAX: 300, SFO: 280, SEA: 230 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "blackstone-river-valley-national-historical-park",
    name: "Blackstone River Valley National Historical Park",
    region: "Northeast",
    state: "Rhode Island / Massachusetts",
    lat: 41.8775,
    lng: -71.3825,
    tags: ["cultural","nature","adventure"],
    blurb: "The Blackstone River powered America's entry into the Age of Industry.",
    attractions: [
          {
                "name": "Blackstone River",
                "description": "The Blackstone River powered America's entry into the Age of Industry."
          },
          {
                "name": "Samuel Slater",
                "description": "The success of Samuel Slater's cotton spinning mill in Pawtucket, RI touched off a chain reaction that changed how people worked and where they lived."
          },
          {
                "name": "Blackstone Valley",
                "description": "Learn how this revolution transformed the landscape of the Blackstone Valley and the United States."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 630, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "blackwell-school-national-historic-site",
    name: "Blackwell School National Historic Site",
    region: "Southwest",
    state: "TX",
    lat: 30.3059,
    lng: -104.0221,
    tags: ["cultural"],
    blurb: "Written by prejudice rather than law, the story of the Blackwell School is one of \"separate but equal\" education for Mexican and Mexican American citizens of Marfa, Texas.",
    attractions: [
          {
                "name": "Blackwell School",
                "description": "Written by prejudice rather than law, the story of the Blackwell School is one of \"separate but equal\" education for Mexican and Mexican American citizens of Marfa, Texas."
          },
          {
                "name": "Mexican American",
                "description": "Written by prejudice rather than law, the story of the Blackwell School is one of \"separate but equal\" education for Mexican and Mexican American citizens of Marfa, Texas."
          },
          {
                "name": "United States",
                "description": "Built in 1909, the school serves as a significant example of how racism and cultural disparity dominated education and social systems in the United States during this period of de facto segregation from 1889-1965.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 370, LAX: 310, SFO: 360, SEA: 430 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "boston-african-american-national-historic-site",
    name: "Boston African American National Historic Site",
    region: "Northeast",
    state: "MA",
    lat: 42.36,
    lng: -71.06472222,
    tags: ["cultural"],
    blurb: "Centered on the north slope of Beacon Hill, the African American community of 1800s Boston led the city and the nation in the fight against slavery and injustice.",
    attractions: [
          {
                "name": "Beacon Hill",
                "description": "Centered on the north slope of Beacon Hill, the African American community of 1800s Boston led the city and the nation in the fight against slavery and injustice."
          },
          {
                "name": "African American",
                "description": "Centered on the north slope of Beacon Hill, the African American community of 1800s Boston led the city and the nation in the fight against slavery and injustice."
          },
          {
                "name": "Abolition Movement",
                "description": "These remarkable men and women, together with their allies, were leaders in the Abolition Movement, the Underground Railroad, the Civil War, and the early struggle for equal rights and education.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 640, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "brices-cross-roads-national-battlefield-site",
    name: "Brices Cross Roads National Battlefield Site",
    region: "Southeast",
    state: "MS",
    lat: 34.50611111,
    lng: -88.72888889,
    tags: ["nature"],
    blurb: "The Confederate victory at Brices Cross Roads was a significant victory for Major General Nathan Bedford Forrest, but its long-term effect on the war proved costly for the Confederates.",
    attractions: [
          {
                "name": "Brices Cross Roads National Battlefield Site center",
                "description": "Walking tour through the heart of Brices Cross Roads National Battlefield Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Brices Cross Roads National Battlefield Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Brices Cross Roads National Battlefield Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 310, CHI: 240, LAX: 450, SFO: 490, SEA: 500 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "brown-v-board-of-education-national-historical-park",
    name: "Brown v. Board of Education National Historical Park",
    region: "Great Plains",
    state: "KS",
    lat: 39.03805556,
    lng: -95.67638889,
    tags: ["cultural"],
    blurb: "The path to equality has been anything but smooth.",
    attractions: [
          {
                "name": "Brown v. Board of Education National Historical Park center",
                "description": "Walking tour through the heart of Brown v. Board of Education National Historical Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Brown v. Board of Education National Historical Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Brown v. Board of Education National Historical Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 360, CHI: 230, LAX: 390, SFO: 410, SEA: 410 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cane-river-creole-national-historical-park",
    name: "Cane River Creole National Historical Park",
    region: "Southeast",
    state: "LA",
    lat: 31.66555556,
    lng: -93.00277778,
    tags: ["cultural"],
    blurb: "The Cane River region is home to a unique culture; the Creoles.",
    attractions: [
          {
                "name": "Cane River",
                "description": "The Cane River region is home to a unique culture; the Creoles."
          },
          {
                "name": "Magnolia Plantations",
                "description": "The park tells their stories and preserves the cultural landscape of Oakland and Magnolia Plantations, two of the most intact Creole cotton plantations in the United States.."
          },
          {
                "name": "United States",
                "description": "The park tells their stories and preserves the cultural landscape of Oakland and Magnolia Plantations, two of the most intact Creole cotton plantations in the United States.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 370, CHI: 290, LAX: 420, SFO: 460, SEA: 490 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "carl-sandburg-home-national-historic-site",
    name: "Carl Sandburg Home National Historic Site",
    region: "Southeast",
    state: "NC",
    lat: 35.27145,
    lng: -82.44723,
    tags: ["cultural"],
    blurb: "Post Helene Status: Pedestrian detour in place from main parking lot.",
    attractions: [
          {
                "name": "Helene Status",
                "description": "Post Helene Status: Pedestrian detour in place from main parking lot."
          },
          {
                "name": "Visitor Center",
                "description": "Bookstore / Visitor Center open Wed, Thurs, Fri, Sat and Sun 10-4."
          },
          {
                "name": "Visitor Center",
                "description": "Interagency passes can be purchased at Visitor Center.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 250, LAX: 520, SFO: 550, SEA: 550 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "carter-g-woodson-home-national-historic-site",
    name: "Carter G. Woodson Home National Historic Site",
    region: "Northeast",
    state: "DC",
    lat: 38.91,
    lng: -77.02416667,
    tags: ["cultural"],
    blurb: "Carter G. Woodson Home National Historic Site is a destination in Northeast, DC worth visiting for its scenic beauty and cultural offerings.",
    attractions: [
          {
                "name": "National Historic Site",
                "description": "Today a National Historic Site, Dr."
          },
          {
                "name": "African American Life",
                "description": "Woodson's home served as the headquarters for the Association for the Study of African American Life and History."
          },
          {
                "name": "Negro History Week",
                "description": "Woodson established Negro History Week here in 1926, which we celebrate today as Black History Month.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chamizal-national-memorial",
    name: "Chamizal National Memorial",
    region: "Southwest",
    state: "TX",
    lat: 31.76777778,
    lng: -106.45416667,
    tags: ["cultural","nature"],
    blurb: "Chamizal is more than just an urban park to recreate or enjoy a quiet afternoon.",
    attractions: [
          {
                "name": "Chamizal National Memorial center",
                "description": "Walking tour through the heart of Chamizal National Memorial."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Chamizal National Memorial."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Chamizal National Memorial is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 490, CHI: 370, LAX: 280, SFO: 330, SEA: 400 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "charles-pinckney-national-historic-site",
    name: "Charles Pinckney National Historic Site",
    region: "Southeast",
    state: "SC",
    lat: 32.84611111,
    lng: -79.82472222,
    tags: ["cultural","nature"],
    blurb: "Charles Pinckney was a principal author and signer of the United States Constitution and went on to be a political leader in South Carolina for over 40 years.",
    attractions: [
          {
                "name": "United States Constitution",
                "description": "Charles Pinckney was a principal author and signer of the United States Constitution and went on to be a political leader in South Carolina for over 40 years."
          },
          {
                "name": "South Carolina",
                "description": "Charles Pinckney was a principal author and signer of the United States Constitution and went on to be a political leader in South Carolina for over 40 years."
          },
          {
                "name": "Snee Farm",
                "description": "The park preserves Snee Farm, one of his plantation properties, where visitors can learn about the politician's influences on Charleston, the African people he enslaved, plantation operations, and the legacy of Pinckney's life.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 290, LAX: 550, SFO: 580, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chesapeake-and-ohio-canal-national-historical-park",
    name: "Chesapeake & Ohio Canal National Historical Park",
    region: "Northeast",
    state: "District of Columbia / Maryland / West Virginia",
    lat: 38.89972222,
    lng: -77.05777778,
    tags: ["cultural"],
    blurb: "Preserving America's early transportation history, the C&O Canal began as a dream of passage to Western wealth.",
    attractions: [
          {
                "name": "Chesapeake & Ohio Canal National Historical Park center",
                "description": "Walking tour through the heart of Chesapeake & Ohio Canal National Historical Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Chesapeake & Ohio Canal National Historical Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Chesapeake & Ohio Canal National Historical Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 560, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "chickamauga-and-chattanooga-national-military-park",
    name: "Chickamauga & Chattanooga National Military Park",
    region: "Southeast",
    state: "Georgia / Tennessee",
    lat: 34.94,
    lng: -85.26,
    tags: ["nature","scenic","adventure"],
    blurb: "In 1863, Union and Confederate forces fought for control of Chattanooga - a gateway to the Confederacy.",
    attractions: [
          {
                "name": "Chickamauga & Chattanooga National Military Park center",
                "description": "Walking tour through the heart of Chickamauga & Chattanooga National Military Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Chickamauga & Chattanooga National Military Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Chickamauga & Chattanooga National Military Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 240, LAX: 490, SFO: 520, SEA: 530 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "christiansted-national-historic-site",
    name: "Christiansted National Historic Site",
    region: "Southeast",
    state: "U.S. Virgin Islands",
    lat: 17.74694444,
    lng: -64.70222222,
    tags: ["cultural"],
    blurb: "Christiansted National Historic Site was established in 1952 as the first unit of the National Park Service in the Virgin Islands of the United States.",
    attractions: [
          {
                "name": "National Historic Site",
                "description": "Christiansted National Historic Site was established in 1952 as the first unit of the National Park Service in the Virgin Islands of the United States."
          },
          {
                "name": "National Park Service",
                "description": "Christiansted National Historic Site was established in 1952 as the first unit of the National Park Service in the Virgin Islands of the United States."
          },
          {
                "name": "Virgin Islands",
                "description": "Christiansted National Historic Site was established in 1952 as the first unit of the National Park Service in the Virgin Islands of the United States."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 450, CHI: 540, LAX: 700, SFO: 700, SEA: 700 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "clara-barton-national-historic-site",
    name: "Clara Barton National Historic Site",
    region: "Northeast",
    state: "MD",
    lat: 38.96694444,
    lng: -77.14083333,
    tags: ["cultural"],
    blurb: "Clara Barton dedicated her life and energies to help others in times of need - both home and abroad, in peacetime as well as during military emergencies.",
    attractions: [
          {
                "name": "Clara Barton National Historic Site center",
                "description": "Walking tour through the heart of Clara Barton National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Clara Barton National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Clara Barton National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 560, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "colonial-national-historical-park",
    name: "Colonial National Historical Park",
    region: "Southeast",
    state: "VA",
    lat: 37.21916667,
    lng: -76.51722222,
    tags: ["cultural","scenic"],
    blurb: "On May 13, 1607, Jamestown was established as the first permanent English settlement in North America.",
    attractions: [
          {
                "name": "North America",
                "description": "On May 13, 1607, Jamestown was established as the first permanent English settlement in North America."
          },
          {
                "name": "Virginia Indian",
                "description": "Three cultures came together - European, Virginia Indian and African-to create a new society that would eventually seek independence from Great Britain."
          },
          {
                "name": "Great Britain",
                "description": "Three cultures came together - European, Virginia Indian and African-to create a new society that would eventually seek independence from Great Britain."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 200, CHI: 270, LAX: 570, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "coltsville-national-historical-park",
    name: "Coltsville National Historical Park",
    region: "Northeast",
    state: "CT",
    lat: 41.75385833,
    lng: -72.67473056,
    tags: ["cultural"],
    blurb: "When Samuel Colt started his Hartford factory on the banks of the Connecticut River in 1847, it followed years of mismanagement and failure.",
    attractions: [
          {
                "name": "Samuel Colt",
                "description": "When Samuel Colt started his Hartford factory on the banks of the Connecticut River in 1847, it followed years of mismanagement and failure."
          },
          {
                "name": "Connecticut River",
                "description": "When Samuel Colt started his Hartford factory on the banks of the Connecticut River in 1847, it followed years of mismanagement and failure."
          },
          {
                "name": "Elizabeth Colt",
                "description": "Following Colt's untimely death in 1862, his wife, Elizabeth Colt, would lead the company to its legendary status, and influence Hartford for over 40 years.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 170, CHI: 290, LAX: 600, SFO: 620, SEA: 590 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "coronado-national-memorial",
    name: "Coronado National Memorial",
    region: "Southwest",
    state: "AZ",
    lat: 31.34833333,
    lng: -110.27166667,
    tags: ["nature","scenic"],
    blurb: "It was a journey of conquest filled with exploration, wonder - and cruelty.",
    attractions: [
          {
                "name": "Coronado National Memorial center",
                "description": "Walking tour through the heart of Coronado National Memorial."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Coronado National Memorial."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Coronado National Memorial is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 530, CHI: 410, LAX: 240, SFO: 300, SEA: 380 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cowpens-national-battlefield",
    name: "Cowpens National Battlefield",
    region: "Southeast",
    state: "SC",
    lat: 35.13666667,
    lng: -81.81805556,
    tags: ["cultural","nature"],
    blurb: "A pasturing area at the time of the battle, this Revolutionary War site commemorates the place where Daniel Morgan and his army turned the flanks of Banastre Tarleton's British army.",
    attractions: [
          {
                "name": "Revolutionary War",
                "description": "A pasturing area at the time of the battle, this Revolutionary War site commemorates the place where Daniel Morgan and his army turned the flanks of Banastre Tarleton's British army."
          },
          {
                "name": "Daniel Morgan",
                "description": "A pasturing area at the time of the battle, this Revolutionary War site commemorates the place where Daniel Morgan and his army turned the flanks of Banastre Tarleton's British army."
          },
          {
                "name": "Banastre Tarleton",
                "description": "A pasturing area at the time of the battle, this Revolutionary War site commemorates the place where Daniel Morgan and his army turned the flanks of Banastre Tarleton's British army."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 250, CHI: 250, LAX: 520, SFO: 550, SEA: 550 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "cumberland-gap-national-historical-park",
    name: "Cumberland Gap National Historical Park",
    region: "Southeast",
    state: "Kentucky / Tennessee / Virginia",
    lat: 36.60416667,
    lng: -83.68722222,
    tags: ["cultural","nature"],
    blurb: "Cumberland Gap was the first great gateway to the west.",
    attractions: [
          {
                "name": "Native Americans",
                "description": "Come follow the path of bison, Native Americans, longhunters, and pioneers."
          },
          {
                "name": "Hensley Settlement",
                "description": "Explore a cave, see Hensley Settlement, or camp under the stars."
          },
          {
                "name": "Cumberland Gap",
                "description": "Come find your connection to Cumberland Gap.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 230, LAX: 500, SFO: 530, SEA: 530 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "dayton-aviation-heritage-national-historical-park",
    name: "Dayton Aviation Heritage National Historical Park",
    region: "Great Plains",
    state: "OH",
    lat: 39.79472222,
    lng: -84.08888889,
    tags: ["cultural"],
    blurb: "Dayton Aviation Heritage National Historical Park was established to honor the lives and achievements of poet and author Paul Laurence Dunbar and aviation pioneers Wilbur and Orville Wright.",
    attractions: [
          {
                "name": "Aviation Heritage National Historical",
                "description": "Dayton Aviation Heritage National Historical Park was established to honor the lives and achievements of poet and author Paul Laurence Dunbar and aviation pioneers Wilbur and Orville Wright."
          },
          {
                "name": "Paul Laurence Dunbar",
                "description": "Dayton Aviation Heritage National Historical Park was established to honor the lives and achievements of poet and author Paul Laurence Dunbar and aviation pioneers Wilbur and Orville Wright."
          },
          {
                "name": "Orville Wright",
                "description": "Dayton Aviation Heritage National Historical Park was established to honor the lives and achievements of poet and author Paul Laurence Dunbar and aviation pioneers Wilbur and Orville Wright."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 250, CHI: 190, LAX: 500, SFO: 520, SEA: 500 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "de-soto-national-memorial",
    name: "De Soto National Memorial",
    region: "Southeast",
    state: "FL",
    lat: 27.52388889,
    lng: -82.64444444,
    tags: ["cultural","adventure"],
    blurb: "In May 1539, Conquistador Hernando de Soto's army of soldiers, hired mercenaries, craftsmen, and clergy made landfall in Tampa Bay.",
    attractions: [
          {
                "name": "Conquistador Hernando",
                "description": "In May 1539, Conquistador Hernando de Soto's army of soldiers, hired mercenaries, craftsmen, and clergy made landfall in Tampa Bay."
          },
          {
                "name": "Tampa Bay",
                "description": "In May 1539, Conquistador Hernando de Soto's army of soldiers, hired mercenaries, craftsmen, and clergy made landfall in Tampa Bay."
          },
          {
                "name": "United States",
                "description": "De Soto's quest for glory and gold would be a four year, four thousand mile odyssey of intrigue, warfare, disease, and discovery that would form the history of the United States.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 340, CHI: 340, LAX: 540, SFO: 580, SEA: 610 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "dwight-d-eisenhower-memorial",
    name: "Dwight D. Eisenhower Memorial",
    region: "Northeast",
    state: "DC",
    lat: 38.887182,
    lng: -77.018771,
    tags: ["nature"],
    blurb: "The Dwight D.",
    attractions: [
          {
                "name": "Dwight D. Eisenhower Memorial center",
                "description": "Walking tour through the heart of Dwight D. Eisenhower Memorial."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Dwight D. Eisenhower Memorial."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Dwight D. Eisenhower Memorial is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "edgar-allan-poe-national-historic-site",
    name: "Edgar Allan Poe National Historic Site",
    region: "Northeast",
    state: "PA",
    lat: 39.96166667,
    lng: -75.15027778,
    tags: ["cultural"],
    blurb: "Described as horrifying, mystifying, and brilliant, Poe's writing has engaged readers all over the world.",
    attractions: [
          {
                "name": "Edgar Allan Poe National Historic Site center",
                "description": "Walking tour through the heart of Edgar Allan Poe National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Edgar Allan Poe National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Edgar Allan Poe National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "eisenhower-national-historic-site",
    name: "Eisenhower National Historic Site",
    region: "Northeast",
    state: "PA",
    lat: 39.79333333,
    lng: -77.26333333,
    tags: ["cultural"],
    blurb: "Eisenhower National Historic Site preserves the farm of General and 34th President Dwight D.",
    attractions: [
          {
                "name": "National Historic Site",
                "description": "Eisenhower National Historic Site preserves the farm of General and 34th President Dwight D."
          },
          {
                "name": "President Dwight",
                "description": "Eisenhower National Historic Site preserves the farm of General and 34th President Dwight D."
          },
          {
                "name": "South Mountain",
                "description": "With its peaceful setting and view of South Mountain, it was a respite from Washington, DC, and a backdrop for efforts to reduce Cold War tensions.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 250, LAX: 560, SFO: 580, SEA: 560 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "eleanor-roosevelt-national-historic-site",
    name: "Eleanor Roosevelt National Historic Site",
    region: "Northeast",
    state: "NY",
    lat: 41.76305556,
    lng: -73.89888889,
    tags: ["cultural","nature"],
    blurb: "Visit the home of Eleanor Roosevelt.",
    attractions: [
          {
                "name": "Eleanor Roosevelt",
                "description": "Visit the home of Eleanor Roosevelt."
          },
          {
                "name": "Eleanor Roosevelt",
                "description": "Explore the Roosevelt saga in the homes of Franklin and Eleanor Roosevelt, the exhibits at the nation's first Presidential Library, and over a thousand acres of gardens and trails.."
          },
          {
                "name": "Presidential Library",
                "description": "Explore the Roosevelt saga in the homes of Franklin and Eleanor Roosevelt, the exhibits at the nation's first Presidential Library, and over a thousand acres of gardens and trails.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "eugene-oneill-national-historic-site",
    name: "Eugene O'Neill National Historic Site",
    region: "Pacific West",
    state: "CA",
    lat: 37.82444444,
    lng: -122.02972222,
    tags: ["cultural","scenic"],
    blurb: "America's only Nobel Prize-winning playwright, Eugene O'Neill, chose Northern California as his sanctuary at the pinnacle of his writing career.",
    attractions: [
          {
                "name": "Nobel Prize",
                "description": "America's only Nobel Prize-winning playwright, Eugene O'Neill, chose Northern California as his sanctuary at the pinnacle of his writing career."
          },
          {
                "name": "Northern California",
                "description": "America's only Nobel Prize-winning playwright, Eugene O'Neill, chose Northern California as his sanctuary at the pinnacle of his writing career."
          },
          {
                "name": "Tao House",
                "description": "Secluded from the outside world within the serene walls of his Tao House, O'Neill crafted his final and most memorable masterpieces: The Iceman Cometh, Long Day's Journey Into Night, and A Moon for the Misbegotten.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 210, SFO: 150, SEA: 270 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "federal-hall-national-memorial",
    name: "Federal Hall National Memorial",
    region: "Northeast",
    state: "NY",
    lat: 40.70722222,
    lng: -74.01027778,
    tags: ["cultural"],
    blurb: "Here at Federal Hall, George Washington took the oath of office as the first President of the United States, marking the beginning of the American constitutional republic.",
    attractions: [
          {
                "name": "Federal Hall",
                "description": "Here at Federal Hall, George Washington took the oath of office as the first President of the United States, marking the beginning of the American constitutional republic."
          },
          {
                "name": "George Washington",
                "description": "Here at Federal Hall, George Washington took the oath of office as the first President of the United States, marking the beginning of the American constitutional republic."
          },
          {
                "name": "United States",
                "description": "Here at Federal Hall, George Washington took the oath of office as the first President of the United States, marking the beginning of the American constitutional republic."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "first-ladies-national-historic-site",
    name: "First Ladies National Historic Site",
    region: "Great Plains",
    state: "OH",
    lat: 40.79666667,
    lng: -81.37527778,
    tags: ["cultural"],
    blurb: "First Ladies National Historic Site consists of two properties in downtown Canton, Ohio - the home of First Lady Ida Saxton-McKinley and our Visitor Center.",
    attractions: [
          {
                "name": "Ladies National Historic Site",
                "description": "First Ladies National Historic Site consists of two properties in downtown Canton, Ohio - the home of First Lady Ida Saxton-McKinley and our Visitor Center."
          },
          {
                "name": "First Lady Ida Saxton",
                "description": "First Ladies National Historic Site consists of two properties in downtown Canton, Ohio - the home of First Lady Ida Saxton-McKinley and our Visitor Center."
          },
          {
                "name": "Visitor Center",
                "description": "First Ladies National Historic Site consists of two properties in downtown Canton, Ohio - the home of First Lady Ida Saxton-McKinley and our Visitor Center."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 220, CHI: 210, LAX: 520, SFO: 540, SEA: 520 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "first-state-national-historical-park",
    name: "First State National Historical Park",
    region: "Northeast",
    state: "Delaware / Pennsylvania",
    lat: 39.66472222,
    lng: -75.56527778,
    tags: ["cultural","nature"],
    blurb: "Famous as the First State to ratify the Constitution, Delaware was born out of a conflict among three world powers for dominance of the Delaware Valley.",
    attractions: [
          {
                "name": "First State National Historical Park center",
                "description": "Walking tour through the heart of First State National Historical Park."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around First State National Historical Park."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine First State National Historical Park is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 170, CHI: 270, LAX: 580, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "flight-93-national-memorial",
    name: "Flight 93 National Memorial",
    region: "Northeast",
    state: "PA",
    lat: 40.05666667,
    lng: -78.90583333,
    tags: ["cultural","nature","scenic"],
    blurb: "On Tuesday morning, September 11, 2001, the U.S.",
    attractions: [
          {
                "name": "Flight 93 National Memorial center",
                "description": "Walking tour through the heart of Flight 93 National Memorial."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Flight 93 National Memorial."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Flight 93 National Memorial is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 200, CHI: 230, LAX: 550, SFO: 570, SEA: 550 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-bowie-national-historic-site",
    name: "Fort Bowie National Historic Site",
    region: "Southwest",
    state: "AZ",
    lat: 32.14611111,
    lng: -109.43555556,
    tags: ["cultural","nature"],
    blurb: "For nearly 25 years, Fort Bowie stood at the crossroads of the Chiricahua Apache's fight to defend their ancestral homeland and the U.S.",
    attractions: [
          {
                "name": "Fort Bowie National Historic Site center",
                "description": "Walking tour through the heart of Fort Bowie National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort Bowie National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort Bowie National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 520, CHI: 400, LAX: 250, SFO: 300, SEA: 380 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-davis-national-historic-site",
    name: "Fort Davis National Historic Site",
    region: "Southwest",
    state: "TX",
    lat: 30.59916667,
    lng: -103.89277778,
    tags: ["cultural","nature"],
    blurb: "Fort Davis is one of the best surviving examples of an Indian Wars' frontier military post in the Southwest.",
    attractions: [
          {
                "name": "Indian Wars",
                "description": "Fort Davis is one of the best surviving examples of an Indian Wars' frontier military post in the Southwest."
          },
          {
                "name": "Fort Davis",
                "description": "From 1854 to 1891, Fort Davis was strategically located to protect emigrants, mail coaches, and freight wagons on the Trans-Pecos portion of the San Antonio-El Paso Road and on the Chihuahua Trail.."
          },
          {
                "name": "San Antonio",
                "description": "From 1854 to 1891, Fort Davis was strategically located to protect emigrants, mail coaches, and freight wagons on the Trans-Pecos portion of the San Antonio-El Paso Road and on the Chihuahua Trail.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 480, CHI: 360, LAX: 310, SFO: 360, SEA: 420 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-donelson-national-battlefield",
    name: "Fort Donelson National Battlefield",
    region: "Southeast",
    state: "Kentucky / Tennessee",
    lat: 36.48722222,
    lng: -87.86083333,
    tags: ["cultural","nature","scenic"],
    blurb: "Brigadier General Ulysses S.",
    attractions: [
          {
                "name": "General Ulysses",
                "description": "Brigadier General Ulysses S."
          },
          {
                "name": "Confederate Fort Donelson",
                "description": "Grant was becoming quite famous as he wrote these words following the surrender of Confederate Fort Donelson on Sunday, February 16, 1862."
          },
          {
                "name": "Fort Donelson",
                "description": "The Union victory at Fort Donelson elated the North, and stunned the South."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 290, CHI: 220, LAX: 460, SFO: 490, SEA: 490 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-laramie-national-historic-site",
    name: "Fort Laramie National Historic Site",
    region: "Rocky Mountains",
    state: "WY",
    lat: 42.20916667,
    lng: -104.53586111,
    tags: ["cultural"],
    blurb: "Originally established as a private fur trading fort in 1834, Fort Laramie evolved into the largest and best-known military post on the Northern Plains before its abandonment in 1890.",
    attractions: [
          {
                "name": "Fort Laramie",
                "description": "Originally established as a private fur trading fort in 1834, Fort Laramie evolved into the largest and best-known military post on the Northern Plains before its abandonment in 1890."
          },
          {
                "name": "Northern Plains",
                "description": "Originally established as a private fur trading fort in 1834, Fort Laramie evolved into the largest and best-known military post on the Northern Plains before its abandonment in 1890."
          },
          {
                "name": "Grand Old Post",
                "description": "Nicknamed the \"Grand Old Post,\" Fort Laramie witnessed the entire sweeping saga of America's western expansion and Indian resistance to encroachment on their territories.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 320, SFO: 330, SEA: 320 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "fort-larned-national-historic-site",
    name: "Fort Larned National Historic Site",
    region: "Great Plains",
    state: "KS",
    lat: 38.18305556,
    lng: -99.21805556,
    tags: ["cultural"],
    blurb: "Discover a complete and authentic army post from the 1860s -1870s! This well-preserved fort on the Santa Fe Trail shares a tumultuous history of the Indian Wars era.",
    attractions: [
          {
                "name": "Santa Fe Trail",
                "description": "Discover a complete and authentic army post from the 1860s -1870s! This well-preserved fort on the Santa Fe Trail shares a tumultuous history of the Indian Wars era."
          },
          {
                "name": "Indian Wars",
                "description": "Discover a complete and authentic army post from the 1860s -1870s! This well-preserved fort on the Santa Fe Trail shares a tumultuous history of the Indian Wars era."
          },
          {
                "name": "Santa Fe Trail",
                "description": "The sandstone constructed buildings sheltered troops who were known as the Guardians of the Santa Fe Trail.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 390, CHI: 270, LAX: 350, SFO: 380, SEA: 390 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-necessity-national-battlefield",
    name: "Fort Necessity National Battlefield",
    region: "Northeast",
    state: "PA",
    lat: 39.81527778,
    lng: -79.58944444,
    tags: ["cultural","nature"],
    blurb: "The battle at Fort Necessity in the summer of 1754 was the opening action of the French and Indian War.",
    attractions: [
          {
                "name": "Fort Necessity",
                "description": "The battle at Fort Necessity in the summer of 1754 was the opening action of the French and Indian War."
          },
          {
                "name": "Indian War",
                "description": "The battle at Fort Necessity in the summer of 1754 was the opening action of the French and Indian War."
          },
          {
                "name": "American Indian",
                "description": "This war was a clash of British, French and American Indian cultures."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 200, CHI: 230, LAX: 540, SFO: 560, SEA: 540 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-point-national-historic-site",
    name: "Fort Point National Historic Site",
    region: "Pacific West",
    state: "CA",
    lat: 37.81055556,
    lng: -122.47722222,
    tags: ["cultural"],
    blurb: "From its vantage point overlooking the spectacular Golden Gate, Fort Point defended the San Francisco Bay following California's Gold Rush through World War II.",
    attractions: [
          {
                "name": "Golden Gate",
                "description": "From its vantage point overlooking the spectacular Golden Gate, Fort Point defended the San Francisco Bay following California's Gold Rush through World War II."
          },
          {
                "name": "Fort Point",
                "description": "From its vantage point overlooking the spectacular Golden Gate, Fort Point defended the San Francisco Bay following California's Gold Rush through World War II."
          },
          {
                "name": "San Francisco Bay",
                "description": "From its vantage point overlooking the spectacular Golden Gate, Fort Point defended the San Francisco Bay following California's Gold Rush through World War II."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 610, CHI: 480, LAX: 210, SFO: 150, SEA: 270 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-raleigh-national-historic-site",
    name: "Fort Raleigh National Historic Site",
    region: "Southeast",
    state: "NC",
    lat: 35.93861111,
    lng: -75.71,
    tags: ["cultural"],
    blurb: "Amongst the shallow blue waters of the Outer Banks lies Fort Raleigh on Roanoke Island.",
    attractions: [
          {
                "name": "Outer Banks",
                "description": "Amongst the shallow blue waters of the Outer Banks lies Fort Raleigh on Roanoke Island."
          },
          {
                "name": "Fort Raleigh",
                "description": "Amongst the shallow blue waters of the Outer Banks lies Fort Raleigh on Roanoke Island."
          },
          {
                "name": "Roanoke Island",
                "description": "Amongst the shallow blue waters of the Outer Banks lies Fort Raleigh on Roanoke Island."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 210, CHI: 290, LAX: 580, SFO: 610, SEA: 600 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-scott-national-historic-site",
    name: "Fort Scott National Historic Site",
    region: "Great Plains",
    state: "KS",
    lat: 37.84388889,
    lng: -94.70472222,
    tags: ["cultural"],
    blurb: "Promises made and broken! Who deserves to be free? The fight for freedom! Soldiers fighting settlers! Each of these stories is a link in the chain of events that encircled Fort Scott from 1842-1873.",
    attractions: [
          {
                "name": "Fort Scott National Historic Site center",
                "description": "Walking tour through the heart of Fort Scott National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort Scott National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort Scott National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 350, CHI: 230, LAX: 390, SFO: 420, SEA: 430 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-smith-national-historic-site",
    name: "Fort Smith National Historic Site",
    region: "Southeast",
    state: "Arkansas / Oklahoma",
    lat: 35.38821,
    lng: -94.429834,
    tags: ["cultural"],
    blurb: "Explore life on the edge of frontier and Indian Territory through the stories of soldiers, the Trail of Tears, scandals, outlaws, and lawmen who pursued them.",
    attractions: [
          {
                "name": "Indian Territory",
                "description": "Explore life on the edge of frontier and Indian Territory through the stories of soldiers, the Trail of Tears, scandals, outlaws, and lawmen who pursued them."
          },
          {
                "name": "Fort Smith",
                "description": "From the establishment of the first Fort Smith on December 25, 1817, to the final days of Judge Isaac C."
          },
          {
                "name": "Judge Isaac",
                "description": "From the establishment of the first Fort Smith on December 25, 1817, to the final days of Judge Isaac C."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 360, CHI: 250, LAX: 400, SFO: 430, SEA: 450 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-sumter-and-fort-moultrie-national-historical-park",
    name: "Fort Sumter and Fort Moultrie National Historical Park",
    region: "Southeast",
    state: "SC",
    lat: 32.75222222,
    lng: -79.87472222,
    tags: ["cultural"],
    blurb: "Two forts stand at the entrance of Charleston Harbor.",
    attractions: [
          {
                "name": "Charleston Harbor",
                "description": "Two forts stand at the entrance of Charleston Harbor."
          },
          {
                "name": "Fort Moultrie",
                "description": "Patriots inside a palmetto log fort, later named Fort Moultrie, defeated the Royal Navy in 1776."
          },
          {
                "name": "Royal Navy",
                "description": "Patriots inside a palmetto log fort, later named Fort Moultrie, defeated the Royal Navy in 1776."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 260, CHI: 290, LAX: 550, SFO: 580, SEA: 590 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "fort-union-trading-post-national-historic-site",
    name: "Fort Union Trading Post National Historic Site",
    region: "Rocky Mountains",
    state: "Montana / North Dakota",
    lat: 47.99944444,
    lng: -104.04055556,
    tags: ["cultural"],
    blurb: "Between 1828 and 1867, Fort Union was the most important fur trade post on the Upper Missouri River.",
    attractions: [
          {
                "name": "Fort Union",
                "description": "Between 1828 and 1867, Fort Union was the most important fur trade post on the Upper Missouri River."
          },
          {
                "name": "Upper Missouri River",
                "description": "Between 1828 and 1867, Fort Union was the most important fur trade post on the Upper Missouri River."
          },
          {
                "name": "Northern Plains Tribes",
                "description": "Here, the Assiniboine and six other Northern Plains Tribes exchanged buffalo robes and smaller furs for goods from around the world, including cloth, guns, blankets, and beads."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 430, CHI: 310, LAX: 370, SFO: 360, SEA: 300 },
      lodgingPerNightUsd: 200,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["summer"],
  },
  {
    slug: "fort-vancouver-national-historic-site",
    name: "Fort Vancouver National Historic Site",
    region: "Pacific West",
    state: "Oregon / Washington",
    lat: 45.625395,
    lng: -122.6581525,
    tags: ["cultural","nature"],
    blurb: "Located on the north bank of the Columbia River, in sight of snowy mountain peaks and a vibrant urban landscape, this park has a rich cultural past.",
    attractions: [
          {
                "name": "Fort Vancouver National Historic Site center",
                "description": "Walking tour through the heart of Fort Vancouver National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Fort Vancouver National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Fort Vancouver National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 590, CHI: 470, LAX: 300, SFO: 250, SEA: 170 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "frederick-douglass-national-historic-site",
    name: "Frederick Douglass National Historic Site",
    region: "Northeast",
    state: "DC",
    lat: 38.86333333,
    lng: -76.98527778,
    tags: ["cultural"],
    blurb: "Frederick Douglass spent his life fighting for justice and equality.",
    attractions: [
          {
                "name": "Frederick Douglass National Historic Site center",
                "description": "Walking tour through the heart of Frederick Douglass National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Frederick Douglass National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Frederick Douglass National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 190, CHI: 260, LAX: 570, SFO: 590, SEA: 570 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "frederick-law-olmsted-national-historic-site",
    name: "Frederick Law Olmsted National Historic Site",
    region: "Northeast",
    state: "MA",
    lat: 42.325,
    lng: -71.13222222,
    tags: ["cultural","scenic"],
    blurb: "Frederick Law Olmsted (1822-1903) is recognized as the founder of American landscape architecture and the nation's foremost parkmaker.",
    attractions: [
          {
                "name": "Frederick Law Olmsted National Historic Site center",
                "description": "Walking tour through the heart of Frederick Law Olmsted National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Frederick Law Olmsted National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Frederick Law Olmsted National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 180, CHI: 300, LAX: 620, SFO: 630, SEA: 600 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "friendship-hill-national-historic-site",
    name: "Friendship Hill National Historic Site",
    region: "Northeast",
    state: "PA",
    lat: 39.77777778,
    lng: -79.92916667,
    tags: ["cultural","nature"],
    blurb: "Albert Gallatin is best remembered for his thirteen year tenure as Secretary of the Treasury during the Jefferson and Madison administrations.",
    attractions: [
          {
                "name": "Friendship Hill National Historic Site center",
                "description": "Walking tour through the heart of Friendship Hill National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Friendship Hill National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Friendship Hill National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 210, CHI: 230, LAX: 540, SFO: 560, SEA: 540 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "general-grant-national-memorial",
    name: "General Grant National Memorial",
    region: "Northeast",
    state: "NY",
    lat: 40.81333333,
    lng: -73.96305556,
    tags: ["cultural"],
    blurb: "The final resting place of President Ulysses S.",
    attractions: [
          {
                "name": "President Ulysses",
                "description": "The final resting place of President Ulysses S."
          },
          {
                "name": "North America",
                "description": "Grant and his wife, Julia, is the largest mausoleum in North America."
          },
          {
                "name": "Commanding General",
                "description": "It testifies to a people's gratitude for the man who ended the bloodiest conflict in American history as Commanding General of the Union Army and then, as President of the United States, strove to heal a nation after a civil war and make rights for all citizens a reality.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 150, CHI: 280, LAX: 590, SFO: 610, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "george-rogers-clark-national-historical-park",
    name: "George Rogers Clark National Historical Park",
    region: "Great Plains",
    state: "IN",
    lat: 38.67919444,
    lng: -87.53559444,
    tags: ["cultural"],
    blurb: "The British flag would not be raised above Fort Sackville Feb.",
    attractions: [
          {
                "name": "Fort Sackville Feb",
                "description": "The British flag would not be raised above Fort Sackville Feb."
          },
          {
                "name": "American Colonel George Rogers",
                "description": "At 10 A.M., the garrison surrendered to American Colonel George Rogers Clark."
          },
          {
                "name": "United States",
                "description": "The fort's capture assured United States claims to the frontier, an area nearly as large as the original 13 states.."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 280, CHI: 190, LAX: 460, SFO: 490, SEA: 480 },
      lodgingPerNightUsd: 130,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "gloria-dei-church-national-historic-site",
    name: "Gloria Dei Church National Historic Site",
    region: "Northeast",
    state: "PA",
    lat: 39.9345,
    lng: -75.1435,
    tags: ["cultural"],
    blurb: "Before Pennsylvania there was New Sweden.",
    attractions: [
          {
                "name": "Gloria Dei Church National Historic Site center",
                "description": "Walking tour through the heart of Gloria Dei Church National Historic Site."
          },
          {
                "name": "Surrounding scenery",
                "description": "Drive or walk through the natural setting around Gloria Dei Church National Historic Site."
          },
          {
                "name": "Local food and dining",
                "description": "Explore the regional cuisine Gloria Dei Church National Historic Site is known for."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 160, CHI: 270, LAX: 580, SFO: 600, SEA: 580 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 70,
      activitiesPerDayUsd: 30,
    },
    bestSeasons: ["spring"],
  },
  {
    slug: "lake-tahoe",
    name: "Lake Tahoe",
    region: "Pacific West",
    state: "California / Nevada",
    lat: 39,
    lng: -120,
    tags: ["nature","adventure","chill"],
    blurb: "Straddling the California-Nevada border at 6,225 feet, Lake Tahoe is the largest alpine lake in North America and one of the clearest bodies of water on Earth — you can see down 70 feet on a calm day.",
    attractions: [
          {
                "name": "Lake Tahoe",
                "description": "Straddling the California-Nevada border at 6,225 feet, Lake Tahoe is the largest alpine lake in North America and one of the clearest bodies of water on Earth — you can see down 70 feet on a calm day."
          },
          {
                "name": "North America",
                "description": "Straddling the California-Nevada border at 6,225 feet, Lake Tahoe is the largest alpine lake in North America and one of the clearest bodies of water on Earth — you can see down 70 feet on a calm day."
          },
          {
                "name": "Sierra Nevada",
                "description": "Ringed by granite peaks of the Sierra Nevada, the lake's cobalt-blue color shifts from emerald to sapphire with the light."
          }
    ],
    typicalCostBands: {
      flightFromOrigin: { NYC: 580, CHI: 460, LAX: 210, SFO: 180, SEA: 260 },
      lodgingPerNightUsd: 280,
      foodPerDayUsd: 60,
      activitiesPerDayUsd: 40,
    },
    bestSeasons: ["summer"],
  }
];
