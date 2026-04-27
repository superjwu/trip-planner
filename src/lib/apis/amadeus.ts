import {
  AmadeusFlightOffersSchema,
  AmadeusHotelOffersSchema,
} from "../schemas";

const AMADEUS_TIMEOUT_MS = 4000;

interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenCacheEntry | null = null;

function envEndpoint(): string {
  const env = (process.env.AMADEUS_ENV ?? "test").toLowerCase();
  return env === "production"
    ? "https://api.amadeus.com"
    : "https://test.api.amadeus.com";
}

async function getAmadeusToken(): Promise<string | null> {
  const id = process.env.AMADEUS_CLIENT_ID;
  const secret = process.env.AMADEUS_CLIENT_SECRET;
  if (!id || !secret || id.startsWith("placeholder")) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }
  try {
    const res = await fetch(`${envEndpoint()}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: id,
        client_secret: secret,
      }),
      signal: AbortSignal.timeout(AMADEUS_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string; expires_in: number };
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 1800) * 1000,
    };
    return cachedToken.token;
  } catch {
    return null;
  }
}

export interface AmadeusFlightQuote {
  totalUsd: number;
}

export async function getCheapestFlightOffer(args: {
  originIata: string;
  destinationIata: string;
  departOn: string;
  returnOn: string;
  adults?: number;
}): Promise<AmadeusFlightQuote | null> {
  const token = await getAmadeusToken();
  if (!token) return null;
  try {
    const url = new URL(`${envEndpoint()}/v2/shopping/flight-offers`);
    url.searchParams.set("originLocationCode", args.originIata);
    url.searchParams.set("destinationLocationCode", args.destinationIata);
    url.searchParams.set("departureDate", args.departOn);
    url.searchParams.set("returnDate", args.returnOn);
    url.searchParams.set("adults", String(args.adults ?? 1));
    url.searchParams.set("currencyCode", "USD");
    url.searchParams.set("max", "5");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(AMADEUS_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const parsed = AmadeusFlightOffersSchema.safeParse(json);
    if (!parsed.success) return null;

    const offers = parsed.data.data ?? [];
    if (offers.length === 0) return null;
    const cheapest = offers.reduce((min, o) => {
      const total = Number(o.price.total);
      return total < min ? total : min;
    }, Infinity);
    if (!Number.isFinite(cheapest)) return null;
    return { totalUsd: Math.round(cheapest) };
  } catch {
    return null;
  }
}

export interface AmadeusHotelQuote {
  perNightUsd: number;
}

export async function getCheapestHotelOffer(args: {
  cityIata: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
}): Promise<AmadeusHotelQuote | null> {
  const token = await getAmadeusToken();
  if (!token) return null;
  try {
    // Step 1: list hotels in the city
    const listUrl = new URL(
      `${envEndpoint()}/v1/reference-data/locations/hotels/by-city`,
    );
    listUrl.searchParams.set("cityCode", args.cityIata);
    listUrl.searchParams.set("radius", "20");
    const listRes = await fetch(listUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(AMADEUS_TIMEOUT_MS),
    });
    if (!listRes.ok) return null;
    const listJson = (await listRes.json()) as { data?: { hotelId: string }[] };
    const hotelIds = (listJson.data ?? []).slice(0, 8).map((h) => h.hotelId);
    if (hotelIds.length === 0) return null;

    // Step 2: fetch offers for those hotels
    const offersUrl = new URL(`${envEndpoint()}/v3/shopping/hotel-offers`);
    offersUrl.searchParams.set("hotelIds", hotelIds.join(","));
    offersUrl.searchParams.set("checkInDate", args.checkIn);
    offersUrl.searchParams.set("checkOutDate", args.checkOut);
    offersUrl.searchParams.set("adults", String(args.adults ?? 2));
    offersUrl.searchParams.set("currency", "USD");

    const offersRes = await fetch(offersUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(AMADEUS_TIMEOUT_MS),
    });
    if (!offersRes.ok) return null;
    const offersJson = await offersRes.json();
    const parsed = AmadeusHotelOffersSchema.safeParse(offersJson);
    if (!parsed.success) return null;

    const totals: number[] = [];
    for (const hotel of parsed.data.data ?? []) {
      for (const offer of hotel.offers ?? []) {
        const t = Number(offer.price.total);
        if (Number.isFinite(t)) totals.push(t);
      }
    }
    if (totals.length === 0) return null;
    const nights = Math.max(
      1,
      Math.round(
        (Date.parse(args.checkOut) - Date.parse(args.checkIn)) / 86400_000,
      ),
    );
    const cheapestTotal = Math.min(...totals);
    return { perNightUsd: Math.round(cheapestTotal / nights) };
  } catch {
    return null;
  }
}
