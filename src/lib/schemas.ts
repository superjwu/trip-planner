import { z } from "zod";

// LLM output schemas — validate every Claude response before persisting.

export const RecommendationPickSchema = z.object({
  slug: z.string().min(1),
  rank: z.number().int().min(1).max(4),
  reasoning: z.string().min(20).max(400),
  match_tags: z.array(z.string()).min(1).max(6),
});

export const RecommendationResponseSchema = z.object({
  picks: z.array(RecommendationPickSchema).length(4),
});

export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

export const ItineraryDaySchema = z.object({
  day: z.number().int().min(1).max(14),
  title: z.string().min(3).max(80),
  description: z.string().min(20).max(600),
});

export const ItineraryResponseSchema = z.object({
  days: z.array(ItineraryDaySchema).min(1).max(10),
});

export type ItineraryResponse = z.infer<typeof ItineraryResponseSchema>;

// Open-Meteo subset we care about
export const WeatherDailySchema = z.object({
  daily: z.object({
    time: z.array(z.string()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
  }),
});
export type WeatherDaily = z.infer<typeof WeatherDailySchema>;

// Amadeus subset (best-effort)
export const AmadeusFlightOffersSchema = z.object({
  data: z
    .array(
      z.object({
        price: z.object({
          total: z.string(),
          currency: z.string(),
        }),
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
              price: z.object({
                total: z.string(),
                currency: z.string(),
              }),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});
