import { getWeather } from "./apis/weather";
import { bookingComLodgingUrl, skyscannerFlightsUrl } from "./apis/booking-links";
import { DESTINATION_AIRPORTS } from "./seed/airports";
import { lodgingNights } from "./normalize";
import type { BookingLinks, CostBreakdown, NormalizedTripInput, SeedDestination, WeatherForecast } from "./types";

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
 */
export async function hydrateRecommendation(args: {
  input: NormalizedTripInput;
  destination: SeedDestination;
}): Promise<HydrationBundle> {
  const { input, destination } = args;
  const airport = DESTINATION_AIRPORTS[destination.slug];

  const weather = await getWeather({
    lat: destination.lat,
    lng: destination.lng,
    departOn: input.departOn,
    returnOn: input.returnOn,
    seasonHint: input.seasonHint,
  });

  const cost = buildCost(input, destination);
  const bookingLinks = buildBookingLinks(input, destination, airport?.airportIata);

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
