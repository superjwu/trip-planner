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
 * Phase B: Google Flights multi-city search URL for routes with 2+ stops.
 * The Skyscanner deep-link format doesn't cleanly support multi-city
 * search; Google Flights accepts a free-form natural-language search
 * query that surfaces multi-city results in the existing UI.
 *
 * `segments[i]` is { fromIata, toIata, on } in trip order. The caller
 * supplies the inter-segment dates (origin → stops[0], stop[0] → stop[1],
 * ..., stop[N-1] → origin) so this function doesn't have to allocate
 * days itself.
 */
export function googleFlightsMultiCityUrl(args: {
  segments: { fromIata: string; toIata: string; on: string }[];
}): string {
  if (args.segments.length === 0) {
    return "https://www.google.com/travel/flights";
  }
  const parts = args.segments.map(
    (s) => `${s.fromIata.toUpperCase()}+to+${s.toIata.toUpperCase()}+on+${s.on}`,
  );
  return `https://www.google.com/travel/flights?q=Flights+${parts.join("+then+")}`;
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
