import { getWeather } from "./apis/weather";
import {
  bookingComLodgingUrl,
  googleFlightsMultiCityUrl,
  skyscannerFlightsUrl,
} from "./apis/booking-links";
import { DESTINATION_AIRPORTS } from "./seed/airports";
import { lodgingNights } from "./normalize";
import { estimateInterStopDrive } from "./seed/drive-estimator";
import type {
  BookingLinks,
  CostBreakdown,
  NormalizedTripInput,
  PerStopCost,
  SeedDestination,
  WeatherForecast,
} from "./types";

export interface HydrationBundle {
  weather: WeatherForecast;
  cost: CostBreakdown;
  bookingLinks: BookingLinks;
}

/**
 * Pulls live weather (Open-Meteo, free, always succeeds) and builds
 * deterministic cost + outbound booking links. Phase G: removed the
 * Amadeus flight + hotel API calls — pricing is now precomputed by the
 * direct-flight estimator in `seed/flight-estimator.ts` and lives in
 * `dest.typicalCostBands.flightFromOrigin` after enrichment. No paid API,
 * no test-env synthetic data, no failure modes to worry about.
 *
 * Phase B: optional `stops` parameter enables multi-stop cost aggregation.
 * When omitted (single-stop callers), behavior is identical to v3.
 * When provided, lodging+food+activities are summed across stops, an
 * inter-stop drive cost row is added, and the flight is origin → stops[0]
 * only (one-way leg cost; the user flies home from the final stop). The
 * weather forecast is for `destination` (the anchor) — per-stop weather is
 * deferred to v3 of multi-stop.
 */
export async function hydrateRecommendation(args: {
  input: NormalizedTripInput;
  destination: SeedDestination;
  /** Phase B. When length > 1, triggers multi-stop cost aggregation. */
  stops?: SeedDestination[];
}): Promise<HydrationBundle> {
  const { input, destination, stops } = args;
  const airport = DESTINATION_AIRPORTS[destination.slug];

  const weather = await getWeather({
    lat: destination.lat,
    lng: destination.lng,
    departOn: input.departOn,
    returnOn: input.returnOn,
    seasonHint: input.seasonHint,
  });

  const cost =
    stops && stops.length > 1
      ? buildCostMultiStop(input, stops)
      : buildCost(input, destination);
  const bookingLinks =
    stops && stops.length > 1
      ? buildBookingLinksMultiStop(input, stops)
      : buildBookingLinks(input, destination, airport?.airportIata);

  return { weather, cost, bookingLinks };
}

function buildCost(
  input: NormalizedTripInput,
  destination: SeedDestination,
): CostBreakdown {
  const days = input.tripLengthDays;
  const nights = lodgingNights(days);
  // flightFromOrigin is now populated by the deterministic curve in
  // flight-estimator.ts (via enrich-destinations.ts), keyed off the user's
  // origin city code. Fall back to $350 only if the destination came from
  // some path that bypassed enrichment — should never happen in practice.
  const flightUsd =
    destination.typicalCostBands.flightFromOrigin[input.originCode] ?? 350;
  const lodgingPerNight = destination.typicalCostBands.lodgingPerNightUsd;
  const lodgingUsd = lodgingPerNight * nights;
  const foodUsd = destination.typicalCostBands.foodPerDayUsd * days;
  const activitiesUsd = destination.typicalCostBands.activitiesPerDayUsd * days;

  return {
    flightUsd,
    lodgingUsd,
    foodUsd,
    activitiesUsd,
    totalUsd: flightUsd + lodgingUsd + foodUsd + activitiesUsd,
    source: "estimate",
    flightSource: "estimate",
    lodgingSource: "estimate",
  };
}

/**
 * Phase B multi-stop cost aggregation.
 *
 * Day allocation: even distribution across stops, with the remainder
 * applied to the first stop. (We don't trust the LLM's per-stop `days`
 * for the cost model — that's a presentation hint to the itinerary
 * writer, not a structural commitment.)
 *
 * Lodging nights per stop: equal to that stop's days; the final stop's
 * last "night" is the travel-home day, so we trim one night from the
 * last stop to mirror the single-stop `lodgingNights()` math.
 *
 * Flight is origin → stops[0] only (one-way leg). Inter-stop transit is
 * summed across consecutive stops via the haversine-based drive
 * estimator. Booking links are still single-leg (origin → anchor) here —
 * the multi-city URL is built in BookingLinks.tsx, not in this layer.
 */
function buildCostMultiStop(
  input: NormalizedTripInput,
  stops: SeedDestination[],
): CostBreakdown {
  const totalDays = input.tripLengthDays;
  const n = stops.length;
  // Even distribution; first stop absorbs the remainder.
  const base = Math.floor(totalDays / n);
  const daysPerStop = stops.map((_, i) => base + (i === 0 ? totalDays - base * n : 0));

  const perStopCosts: PerStopCost[] = stops.map((stop, i) => {
    const days = daysPerStop[i];
    // Last stop loses one night (departure day). Earlier stops contribute
    // their full nights since the user transitions to the next stop.
    const nights = i === n - 1 ? Math.max(0, days - 1) : days;
    return {
      slug: stop.slug,
      days,
      lodgingUsd: stop.typicalCostBands.lodgingPerNightUsd * nights,
      foodUsd: stop.typicalCostBands.foodPerDayUsd * days,
      activitiesUsd: stop.typicalCostBands.activitiesPerDayUsd * days,
    };
  });

  const lodgingUsd = perStopCosts.reduce((acc, s) => acc + s.lodgingUsd, 0);
  const foodUsd = perStopCosts.reduce((acc, s) => acc + s.foodUsd, 0);
  const activitiesUsd = perStopCosts.reduce((acc, s) => acc + s.activitiesUsd, 0);

  // Flight: origin → stops[0] only.
  const flightUsd =
    stops[0].typicalCostBands.flightFromOrigin[input.originCode] ?? 350;

  // Inter-stop drive cost: sum over consecutive pairs.
  let interStopDriveUsd = 0;
  for (let i = 0; i < n - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const est = estimateInterStopDrive(a.lat, a.lng, b.lat, b.lng);
    interStopDriveUsd += est.usd;
  }

  return {
    flightUsd,
    lodgingUsd,
    foodUsd,
    activitiesUsd,
    interStopDriveUsd,
    totalUsd:
      flightUsd + lodgingUsd + foodUsd + activitiesUsd + interStopDriveUsd,
    perStopCosts,
    source: "estimate",
    flightSource: "estimate",
    lodgingSource: "estimate",
  };
}

function buildBookingLinks(
  input: NormalizedTripInput,
  destination: SeedDestination,
  destinationIata: string | undefined,
): BookingLinks {
  return {
    flights: skyscannerFlightsUrl({
      origin: input.originCode,
      destinationIata: destinationIata ?? "JFK",
      departOn: input.departOn,
      returnOn: input.returnOn,
    }),
    lodging: bookingComLodgingUrl({
      destinationName: destination.name,
      destinationState: destination.state,
      departOn: input.departOn,
      returnOn: input.returnOn,
    }),
  };
}

/**
 * Phase B: multi-stop booking links. Flights becomes a Google Flights
 * multi-city URL covering the full route (origin → stops[0] → ... →
 * stops[N-1] → origin). Lodging stays the anchor-only Booking.com search
 * for v1; per-stop lodging is a polish item for later.
 *
 * Date allocation between segments: even distribution. Same heuristic as
 * the cost path — the real per-stop date split comes from the itinerary
 * writer downstream.
 */
function buildBookingLinksMultiStop(
  input: NormalizedTripInput,
  stops: SeedDestination[],
): BookingLinks {
  const originIata =
    DESTINATION_AIRPORTS[stops[0].slug]?.airportIata ?? "JFK";

  const totalDays = input.tripLengthDays;
  const n = stops.length;
  const base = Math.floor(totalDays / n);
  const daysPerStop = stops.map((_, i) => base + (i === 0 ? totalDays - base * n : 0));

  // Compute transition dates: depart on input.departOn, then each
  // subsequent transition is offset by sum(daysPerStop[0..i-1]). Final
  // segment is the return leg on input.returnOn.
  const segments: { fromIata: string; toIata: string; on: string }[] = [];
  let cursor = input.departOn;
  const addDays = (date: string, days: number): string => {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  // Origin → stops[0] (the flight leg).
  segments.push({
    fromIata: originIata, // will be patched below using ORIGIN_AIRPORT
    toIata: DESTINATION_AIRPORTS[stops[0].slug]?.airportIata ?? "JFK",
    on: cursor,
  });
  // Override fromIata to the user's origin airport, not the anchor's.
  segments[0].fromIata = (
    {
      NYC: "JFK",
      CHI: "ORD",
      LAX: "LAX",
      SFO: "SFO",
      SEA: "SEA",
    } as const
  )[input.originCode];

  for (let i = 1; i < n; i++) {
    cursor = addDays(cursor, daysPerStop[i - 1]);
    segments.push({
      fromIata: DESTINATION_AIRPORTS[stops[i - 1].slug]?.airportIata ?? "JFK",
      toIata: DESTINATION_AIRPORTS[stops[i].slug]?.airportIata ?? "JFK",
      on: cursor,
    });
  }
  // Final return leg: last stop → origin on input.returnOn.
  segments.push({
    fromIata: DESTINATION_AIRPORTS[stops[n - 1].slug]?.airportIata ?? "JFK",
    toIata: segments[0].fromIata,
    on: input.returnOn,
  });

  return {
    flights: googleFlightsMultiCityUrl({ segments }),
    // v1 of multi-stop: anchor lodging only. Per-stop lodging will need
    // a BookingLinks shape extension.
    lodging: bookingComLodgingUrl({
      destinationName: stops[0].name,
      destinationState: stops[0].state,
      departOn: input.departOn,
      returnOn: input.returnOn,
    }),
  };
}
