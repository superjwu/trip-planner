import type { OriginCityCode } from "../types";

const ORIGIN_AIRPORT: Record<OriginCityCode, string> = {
  NYC: "JFK",
  CHI: "ORD",
  LAX: "LAX",
  SFO: "SFO",
  SEA: "SEA",
};

/**
 * Skyscanner deep-link search URL.
 * Format: /transport/flights/{from}/{to}/{depart YYMMDD}/{return YYMMDD}
 */
export function skyscannerFlightsUrl(args: {
  origin: OriginCityCode;
  destinationIata: string;
  departOn: string; // YYYY-MM-DD
  returnOn: string; // YYYY-MM-DD
  passengers?: number;
}): string {
  const fromCode = ORIGIN_AIRPORT[args.origin].toLowerCase();
  const toCode = args.destinationIata.toLowerCase();
  const dep = args.departOn.slice(2).replace(/-/g, "");
  const ret = args.returnOn.slice(2).replace(/-/g, "");
  const adults = args.passengers ?? 1;
  return `https://www.skyscanner.com/transport/flights/${fromCode}/${toCode}/${dep}/${ret}/?adults=${adults}`;
}

/**
 * Google Flights URL with pre-filled origin / destination / dates.
 */
export function googleFlightsUrl(args: {
  origin: OriginCityCode;
  destinationIata: string;
  departOn: string;
  returnOn: string;
}): string {
  const from = ORIGIN_AIRPORT[args.origin];
  const to = args.destinationIata.toUpperCase();
  return `https://www.google.com/travel/flights?q=Flights+from+${from}+to+${to}+on+${args.departOn}+through+${args.returnOn}`;
}

/**
 * Booking.com search URL with destination + dates pre-filled.
 */
export function bookingComLodgingUrl(args: {
  destinationName: string;
  destinationState: string;
  departOn: string;
  returnOn: string;
  adults?: number;
}): string {
  const ss = encodeURIComponent(`${args.destinationName}, ${args.destinationState}, USA`);
  const adults = args.adults ?? 2;
  const params = new URLSearchParams({
    ss,
    checkin: args.departOn,
    checkout: args.returnOn,
    group_adults: String(adults),
    no_rooms: "1",
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}
