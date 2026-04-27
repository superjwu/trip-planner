import { getCheapestFlightOffer, getCheapestHotelOffer } from "./apis/amadeus";
import { getWeather } from "./apis/weather";
import { bookingComLodgingUrl, skyscannerFlightsUrl } from "./apis/booking-links";
import { DESTINATION_AIRPORTS } from "./seed/airports";
import { ORIGIN_CITIES, type BookingLinks, type CostBreakdown, type NormalizedTripInput, type SeedDestination, type WeatherForecast } from "./types";

export interface HydrationBundle {
  weather: WeatherForecast;
  cost: CostBreakdown;
  bookingLinks: BookingLinks;
}

/**
 * Pulls weather (Open-Meteo, always succeeds) and best-effort live flight +
 * hotel quotes from Amadeus. Falls back to seed cost bands when Amadeus is
 * not configured or returns nothing useful. Builds outbound booking links
 * deterministically so they're always present.
 */
export async function hydrateRecommendation(args: {
  input: NormalizedTripInput;
  destination: SeedDestination;
}): Promise<HydrationBundle> {
  const { input, destination } = args;
  const airport = DESTINATION_AIRPORTS[destination.slug];
  const originAirport = ORIGIN_CITIES.find((c) => c.code === input.originCode)!.airport;

  // Weather + Amadeus calls in parallel
  const [weather, amadeusFlight, amadeusHotel] = await Promise.all([
    getWeather({
      lat: destination.lat,
      lng: destination.lng,
      departOn: input.departOn,
      returnOn: input.returnOn,
      seasonHint: input.seasonHint,
    }),
    airport
      ? getCheapestFlightOffer({
          originIata: originAirport,
          destinationIata: airport.airportIata,
          departOn: input.departOn,
          returnOn: input.returnOn,
        })
      : Promise.resolve(null),
    airport?.hotelCityCode
      ? getCheapestHotelOffer({
          cityIata: airport.hotelCityCode,
          checkIn: input.departOn,
          checkOut: input.returnOn,
          adults: 2,
        })
      : Promise.resolve(null),
  ]);

  const cost = buildCost(input, destination, amadeusFlight, amadeusHotel);
  const bookingLinks = buildBookingLinks(input, destination, airport?.airportIata);

  return { weather, cost, bookingLinks };
}

function buildCost(
  input: NormalizedTripInput,
  destination: SeedDestination,
  amadeusFlight: { totalUsd: number } | null,
  amadeusHotel: { perNightUsd: number } | null,
): CostBreakdown {
  const days = input.tripLengthDays;
  const seedFlight =
    destination.typicalCostBands.flightFromOrigin[input.originCode] ?? 350;
  const seedLodgingPerNight = destination.typicalCostBands.lodgingPerNightUsd;

  const flightUsd = amadeusFlight?.totalUsd ?? seedFlight;
  const lodgingPerNight = amadeusHotel?.perNightUsd ?? seedLodgingPerNight;
  const lodgingUsd = lodgingPerNight * days;
  const foodUsd = destination.typicalCostBands.foodPerDayUsd * days;
  const activitiesUsd = destination.typicalCostBands.activitiesPerDayUsd * days;

  const source: CostBreakdown["source"] =
    amadeusFlight || amadeusHotel ? "amadeus" : "estimate";

  return {
    flightUsd,
    lodgingUsd,
    foodUsd,
    activitiesUsd,
    totalUsd: flightUsd + lodgingUsd + foodUsd + activitiesUsd,
    source,
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
