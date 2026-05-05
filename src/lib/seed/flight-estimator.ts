/**
 * Deterministic direct-flight roundtrip estimator. Replaces the Amadeus API
 * call (which required paid credentials and produced synthetic test-env
 * prices anyway). Pre-computed at module evaluation; no network, no keys,
 * no failure modes.
 *
 * Model: piecewise-linear in haversine miles, calibrated against typical
 * direct (non-stop) economy roundtrip fares observed on Google Flights for
 * NYC / CHI / LAX / SFO / SEA in 2025. Specifically biased toward DIRECT
 * pricing — 1-stop bargains can be ~30% cheaper but mislead users about
 * actual travel time.
 *
 * Inputs are (origin city code, destination lat, destination lng). Output
 * is a USD integer rounded to the nearest $10.
 */
import type { OriginCityCode } from "../types";

/** Primary airport coordinates for each supported origin city. */
const ORIGIN_AIRPORT_COORDS: Record<OriginCityCode, [number, number]> = {
  NYC: [40.6413, -73.7781], // JFK
  CHI: [41.9742, -87.9073], // ORD
  LAX: [33.9416, -118.4085],
  SFO: [37.6213, -122.379],
  SEA: [47.4502, -122.3088],
};

/** Below this many miles, no flight needed — drive instead. */
const DRIVABLE_MI = 200;

/** Hard ceiling so transcontinental + Hawaii routes don't run away. */
const MAX_FARE_USD = 850;

function haversineMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Piecewise-linear fare curve. Each segment is `base + miles * perMile`.
 * Calibration notes (direct economy roundtrip, midweek shoulder season):
 *   - 200-600 mi  (regional jet, expensive per mile):   ~$240-280
 *   - 600-1500 mi (narrowbody, sweet spot):              ~$280-370
 *   - 1500-2800 mi (transcon-ish):                       ~$390-560
 *   - 2800+ mi (transcon + Hawaii direct):               ~$580-850
 */
function fareCurve(miles: number): number {
  if (miles < DRIVABLE_MI) return 0;
  let raw: number;
  if (miles < 600) {
    raw = 230 + miles * 0.07;
  } else if (miles < 1500) {
    raw = 220 + miles * 0.1;
  } else if (miles < 2800) {
    raw = 180 + miles * 0.14;
  } else {
    raw = 220 + miles * 0.13;
  }
  if (raw > MAX_FARE_USD) raw = MAX_FARE_USD;
  // Round to nearest $10 for visual cleanliness on the card.
  return Math.round(raw / 10) * 10;
}

/**
 * Direct-flight roundtrip estimate from origin city to a destination's
 * (lat, lng). Same return shape as the old Amadeus call.
 */
export function estimateDirectFlightUsd(
  origin: OriginCityCode,
  destLat: number,
  destLng: number,
): number {
  const [olat, olng] = ORIGIN_AIRPORT_COORDS[origin];
  const miles = haversineMi(olat, olng, destLat, destLng);
  return fareCurve(miles);
}

/**
 * Build the full {NYC, CHI, LAX, SFO, SEA} flight-cost map for a destination.
 * Used by the enrichment pipeline to overwrite the seed's hand-curated /
 * heuristic values with a single deterministic curve, so all routes use
 * the same direct-flight pricing model.
 */
export function buildFlightFromOriginMap(
  destLat: number,
  destLng: number,
): Record<OriginCityCode, number> {
  return {
    NYC: estimateDirectFlightUsd("NYC", destLat, destLng),
    CHI: estimateDirectFlightUsd("CHI", destLat, destLng),
    LAX: estimateDirectFlightUsd("LAX", destLat, destLng),
    SFO: estimateDirectFlightUsd("SFO", destLat, destLng),
    SEA: estimateDirectFlightUsd("SEA", destLat, destLng),
  };
}
