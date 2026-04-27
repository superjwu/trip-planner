import { WeatherDailySchema } from "../schemas";
import type { WeatherForecast } from "../types";

const OPEN_METEO_FORECAST_HORIZON_DAYS = 16;

const SEASON_TYPICAL: Record<string, { highF: number; lowF: number; precipMm: number; summary: string }> = {
  spring: { highF: 68, lowF: 50, precipMm: 8, summary: "Cool to mild, occasional showers" },
  summer: { highF: 84, lowF: 65, precipMm: 6, summary: "Warm, mostly clear, scattered storms" },
  fall:   { highF: 70, lowF: 50, precipMm: 7, summary: "Mild, crisp mornings" },
  winter: { highF: 50, lowF: 32, precipMm: 9, summary: "Cool, variable" },
};

function celsiusToF(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

function withinForecastWindow(departOn: string): boolean {
  const dep = Date.parse(departOn);
  const today = Date.now();
  const days = (dep - today) / 86400_000;
  return days >= -1 && days <= OPEN_METEO_FORECAST_HORIZON_DAYS;
}

/**
 * Best-effort weather lookup. Returns Open-Meteo forecast if dates are within
 * the 16-day window; otherwise returns a typical seasonal stub. Always returns
 * a usable WeatherForecast — never throws upward.
 */
export async function getWeather(args: {
  lat: number;
  lng: number;
  departOn: string;
  returnOn: string;
  seasonHint: "spring" | "summer" | "fall" | "winter";
}): Promise<WeatherForecast> {
  if (!withinForecastWindow(args.departOn)) {
    return SEASON_TYPICAL[args.seasonHint] ?? SEASON_TYPICAL.summer;
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(args.lat));
    url.searchParams.set("longitude", String(args.lng));
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
    url.searchParams.set("temperature_unit", "celsius");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("start_date", args.departOn);
    url.searchParams.set("end_date", args.returnOn);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(3500),
      next: { revalidate: 60 * 60 * 6 }, // 6h server cache
    });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const json = await res.json();
    const parsed = WeatherDailySchema.parse(json);

    const highs = parsed.daily.temperature_2m_max;
    const lows = parsed.daily.temperature_2m_min;
    const precip = parsed.daily.precipitation_sum;

    if (highs.length === 0) {
      return SEASON_TYPICAL[args.seasonHint] ?? SEASON_TYPICAL.summer;
    }

    const avgHigh = highs.reduce((a, b) => a + b, 0) / highs.length;
    const avgLow = lows.reduce((a, b) => a + b, 0) / lows.length;
    const totalPrecip = precip.reduce((a, b) => a + b, 0);

    return {
      highF: celsiusToF(avgHigh),
      lowF: celsiusToF(avgLow),
      precipMm: Math.round(totalPrecip),
      summary: weatherSummary(avgHigh, totalPrecip),
    };
  } catch {
    return SEASON_TYPICAL[args.seasonHint] ?? SEASON_TYPICAL.summer;
  }
}

function weatherSummary(avgHighC: number, totalPrecipMm: number): string {
  const high = celsiusToF(avgHighC);
  const wet = totalPrecipMm > 12;
  if (high >= 85) return wet ? "Hot, humid, scattered rain" : "Hot and clear";
  if (high >= 70) return wet ? "Warm with some rain" : "Warm and pleasant";
  if (high >= 55) return wet ? "Mild with showers likely" : "Mild and crisp";
  return wet ? "Cool and rainy" : "Cool and clear";
}
