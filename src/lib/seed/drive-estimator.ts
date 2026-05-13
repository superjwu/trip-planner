/**
 * Deterministic inter-stop drive cost + time estimator for Phase B
 * multi-stop combos. Used by `rankAndPersist` to add a transit row to a
 * route's cost breakdown ("Drive Charleston → Savannah: ~$30, 2hr") and
 * by the itinerary writer to budget transition days.
 *
 * Model is intentionally crude: a per-mile proxy for gas + wear + tolls
 * on a one-way drive (one direction — multi-stop routes are typically
 * one-way and the user flies home from the final stop). Rounded for
 * card-level display.
 */

/** Per-mile cost: gas at ~$3.50/gal & 30mpg ≈ $0.12, plus wear, tolls,
 *  parking. $0.30/mi matches the IRS-style figure travelers see in apps
 *  like Wanderlog. */
const COST_PER_MILE_USD = 0.3;

/** Average highway speed in the US for a leisure road trip with rest
 *  stops. Conservative — the LLM uses this number to decide whether
 *  pairing two stops is realistic. */
const AVG_MPH = 55;

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

export interface InterStopDriveEstimate {
  miles: number;
  usd: number;
  hours: number;
}

/**
 * Inter-stop drive cost + time from (fromLat, fromLng) to (toLat, toLng).
 * Returns rounded values suitable for card-level display.
 * - `miles`: haversine — straight-line, an under-estimate of real road
 *           miles (typically by 15-25%). For combos within 250mi this is
 *           good enough for a budgetary signal.
 * - `usd`:   per-mile cost rounded to nearest $5.
 * - `hours`: miles / 55mph rounded to nearest 0.5 hour.
 */
export function estimateInterStopDrive(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): InterStopDriveEstimate {
  const miles = haversineMi(fromLat, fromLng, toLat, toLng);
  const usdRaw = miles * COST_PER_MILE_USD;
  const hoursRaw = miles / AVG_MPH;
  return {
    miles: Math.round(miles),
    usd: Math.max(0, Math.round(usdRaw / 5) * 5),
    hours: Math.round(hoursRaw * 2) / 2,
  };
}
