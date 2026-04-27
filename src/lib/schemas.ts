import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// LLM output schemas — every Claude response is validated before persist.
// ─────────────────────────────────────────────────────────────

export const RecommendationPickSchema = z.object({
  slug: z.string().min(1),
  rank: z.number().int().min(1).max(4),
  reasoning: z.string().min(20).max(400),
  match_tags: z.array(z.string()).min(1).max(6),
});

export const RecommendationResponseSchema = z
  .object({
    picks: z.array(RecommendationPickSchema).length(4),
  })
  .superRefine((value, ctx) => {
    const slugs = new Set<string>();
    const ranks = new Set<number>();
    for (const [i, pick] of value.picks.entries()) {
      if (slugs.has(pick.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["picks", i, "slug"],
          message: `Duplicate slug ${pick.slug}`,
        });
      }
      if (ranks.has(pick.rank)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["picks", i, "rank"],
          message: `Duplicate rank ${pick.rank}`,
        });
      }
      slugs.add(pick.slug);
      ranks.add(pick.rank);
    }
    if (ranks.size === 4) {
      const want = new Set([1, 2, 3, 4]);
      for (const r of ranks) want.delete(r);
      if (want.size > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["picks"],
          message: "Ranks must be exactly 1, 2, 3, 4",
        });
      }
    }
  });

export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

export const ItineraryDaySchema = z.object({
  day: z.number().int().min(1).max(14),
  title: z.string().min(3).max(80),
  description: z.string().min(20).max(600),
});

/**
 * Pass `tripLengthDays` so we can enforce the exact day count + sequential
 * day numbers. Zod doesn't carry runtime parameters, so we expose a builder.
 */
export function buildItineraryResponseSchema(tripLengthDays: number) {
  return z
    .object({
      days: z
        .array(ItineraryDaySchema)
        .length(tripLengthDays, `Itinerary must have exactly ${tripLengthDays} days`),
    })
    .superRefine((value, ctx) => {
      for (const [i, d] of value.days.entries()) {
        if (d.day !== i + 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["days", i, "day"],
            message: `Day numbers must be sequential 1..${tripLengthDays}; got ${d.day} at index ${i}`,
          });
        }
      }
    });
}

export type ItineraryResponse = z.infer<ReturnType<typeof buildItineraryResponseSchema>>;

// ─────────────────────────────────────────────────────────────
// External API response schemas (Open-Meteo, Amadeus best-effort).
// ─────────────────────────────────────────────────────────────

export const WeatherDailySchema = z.object({
  daily: z.object({
    time: z.array(z.string()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
  }),
});
export type WeatherDaily = z.infer<typeof WeatherDailySchema>;

export const AmadeusFlightOffersSchema = z.object({
  data: z
    .array(
      z.object({
        price: z.object({ total: z.string(), currency: z.string() }),
      }),
    )
    .optional(),
});

export const AmadeusHotelOffersSchema = z.object({
  data: z
    .array(
      z.object({
        offers: z
          .array(
            z.object({
              price: z.object({ total: z.string(), currency: z.string() }),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

// ─────────────────────────────────────────────────────────────
// DB JSONB schemas — parse before treating as typed application state.
// ─────────────────────────────────────────────────────────────

export const OriginCityCodeSchema = z.enum(["NYC", "CHI", "LAX", "SFO", "SEA"]);

export const VibeSchema = z.enum([
  "city",
  "nature",
  "foodie",
  "chill",
  "adventure",
  "scenic",
  "cultural",
  "nightlife",
]);

export const BudgetBandSchema = z.enum([
  "under-500",
  "500-1000",
  "1000-2000",
  "2000-plus",
]);

export const PaceSchema = z.enum(["relaxed", "balanced", "packed"]);

export const SeasonSchema = z.enum(["spring", "summer", "fall", "winter"]);

export const UserStatusSchema = z.enum(["draft", "saved", "archived"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// Hard cap: keep tripLengthDays compatible with ItineraryDaySchema.day (max 14).
// The product targets 3-7 day trips; allow up to 14 for slack.
export const MAX_TRIP_DAYS = 14;

export const NormalizedTripInputSchema = z.object({
  originCode: OriginCityCodeSchema,
  originAirport: z.string(),
  departOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tripLengthDays: z.number().int().min(1).max(MAX_TRIP_DAYS),
  vibes: z.array(VibeSchema).min(1),
  budgetBand: BudgetBandSchema,
  budgetCeilingUsd: z.number().nullable(),
  pace: PaceSchema,
  seasonHint: SeasonSchema,
  dislikes: z.string(),
  notes: z.string().optional(),
});
export type NormalizedTripInputT = z.infer<typeof NormalizedTripInputSchema>;

export const WeatherForecastSchema = z.object({
  highF: z.number(),
  lowF: z.number(),
  precipMm: z.number(),
  summary: z.string(),
});

export const CostBreakdownSchema = z.object({
  flightUsd: z.number(),
  lodgingUsd: z.number(),
  foodUsd: z.number(),
  activitiesUsd: z.number(),
  totalUsd: z.number(),
  source: z.enum(["amadeus", "estimate", "mixed"]),
  flightSource: z.enum(["amadeus", "estimate"]).optional(),
  lodgingSource: z.enum(["amadeus", "estimate"]).optional(),
});

export const HydrationSchema = z.object({
  weather: WeatherForecastSchema,
  cost: CostBreakdownSchema,
});

export const BookingLinksSchema = z.object({
  flights: z.string().url(),
  lodging: z.string().url(),
});

export const SeedDestinationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  region: z.string(),
  state: z.string(),
  lat: z.number(),
  lng: z.number(),
  tags: z.array(VibeSchema),
  blurb: z.string(),
  heroPhotoUrl: z.string().optional(),
  attractions: z.array(z.object({ name: z.string(), description: z.string() })),
  typicalCostBands: z.object({
    flightFromOrigin: z.record(z.string(), z.number()),
    lodgingPerNightUsd: z.number(),
    foodPerDayUsd: z.number(),
    activitiesPerDayUsd: z.number(),
  }),
  bestSeasons: z.array(SeasonSchema),
  maxFlightHoursFromOrigin: z.record(z.string(), z.number()).optional(),
});
