import { NextResponse } from "next/server";
import { getWeather } from "@/lib/apis/weather";

const ALLOWED_SEASONS = new Set(["spring", "summer", "fall", "winter"]);

/**
 * Server-side proxy so client components can fetch weather without exposing
 * any keys (Open-Meteo doesn't actually need one, but we keep this consistent).
 *
 * GET /api/weather?lat=...&lng=...&departOn=YYYY-MM-DD&returnOn=YYYY-MM-DD&season=fall
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const departOn = url.searchParams.get("departOn") ?? "";
  const returnOn = url.searchParams.get("returnOn") ?? "";
  const seasonRaw = url.searchParams.get("season") ?? "summer";

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(departOn) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(returnOn)
  ) {
    return NextResponse.json({ error: "Bad parameters" }, { status: 400 });
  }

  const season = ALLOWED_SEASONS.has(seasonRaw)
    ? (seasonRaw as "spring" | "summer" | "fall" | "winter")
    : "summer";

  const weather = await getWeather({ lat, lng, departOn, returnOn, seasonHint: season });
  return NextResponse.json(weather);
}
