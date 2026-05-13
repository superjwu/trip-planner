import { z } from "zod";

// Hard cap: keep tripLengthDays compatible with ItineraryDaySchema.day (max 14).
// The product targets 3-7 day trips; allow up to 14 for slack. Declared up
// here (not near NormalizedTripInputSchema) because Phase B's StopSchema also
// references it and Zod schemas are constructed eagerly at module-load time.
export const MAX_TRIP_DAYS = 14;

// ─────────────────────────────────────────────────────────────
// LLM output schemas — every Claude response is validated before persist.
// ─────────────────────────────────────────────────────────────

export const TradeoffsSchema = z.object({
  flight: z.number().int().min(1).max(3),
  budget: z.number().int().min(1).max(3),
  crowd: z.number().int().min(1).max(3),
  vibeFit: z.number().int().min(1).max(3),
  seasonFit: z.number().int().min(1).max(3),
});
export type Tradeoffs = z.infer<typeof TradeoffsSchema>;

// Phase B: a single stop in a 1–3 stop combo. `order` is 1-indexed; `days`
// is the user-facing day allocation for this stop (null when unspecified —
// the itinerary writer fills it in). Stop slugs must be valid destination
// slugs; that's enforced post-parse against the candidate pool because Zod
// has no access to that list.
export const StopSchema = z.object({
  slug: z.string().min(1),
  order: z.number().int().min(1).max(3),
  days: z.number().int().min(1).max(MAX_TRIP_DAYS).nullable(),
});
export type Stop = z.infer<typeof StopSchema>;

// Transition helper: until B.3 updates the ranker prompt to emit `stops`,
// the LLM keeps returning the old single-slug shape. Synthesize a 1-stop
// combo from the top-level slug so legacy responses still validate. After
// B.3 lands and the LLM emits real `stops`, this is a no-op for new picks.
function synthesizeStopsFromLegacyPick(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const r = raw as { slug?: unknown; stops?: unknown };
  if (r.stops === undefined && typeof r.slug === "string") {
    return { ...r, stops: [{ slug: r.slug, order: 1, days: null }] };
  }
  return raw;
}

export const RecommendationPickSchema = z
  .preprocess(synthesizeStopsFromLegacyPick, z.object({
    slug: z.string().min(1),
    rank: z.number().int().min(1).max(4),
    reasoning: z.string().min(20).max(400),
    match_tags: z.array(z.string()).min(1).max(6),
    tradeoffs: TradeoffsSchema,
    // Phase B: 1–3 ordered stops. Single-stop combos are the default; the
    // top-level `slug` stays the anchor and must equal stops[0].slug.
    stops: z.array(StopSchema).min(1).max(3),
  }))
  .superRefine((value, ctx) => {
    // stops[0].slug is the structural anchor; the top-level slug mirrors it
    // for back-compat with parseRec / persistence.
    if (value.stops[0]?.slug !== value.slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stops", 0, "slug"],
        message: `stops[0].slug (${value.stops[0]?.slug}) must equal pick.slug (${value.slug})`,
      });
    }
    // `order` must be 1..stops.length, no gaps, no duplicates.
    const seenOrders = new Set<number>();
    const seenSlugs = new Set<string>();
    for (const [i, stop] of value.stops.entries()) {
      if (stop.order !== i + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stops", i, "order"],
          message: `stop order must be sequential 1..${value.stops.length}; got ${stop.order} at index ${i}`,
        });
      }
      if (seenOrders.has(stop.order)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stops", i, "order"],
          message: `duplicate stop order ${stop.order}`,
        });
      }
      if (seenSlugs.has(stop.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stops", i, "slug"],
          message: `duplicate stop slug ${stop.slug} within a single pick`,
        });
      }
      seenOrders.add(stop.order);
      seenSlugs.add(stop.slug);
    }
  });

export const RecommendationResponseSchema = z
  .object({
    picks: z.array(RecommendationPickSchema).length(4),
    why_these_four: z.string().min(40).max(500),
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
  // Phase F (codex blocking fix): without this, parseNormalizedInput strips
  // the anchor on every DB read and refine round, so even brand-new trips
  // behave anchor-less after the first reload.
  anchorSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  // Phase J: visited slug list — same DB-read concern as anchorSlug. Each
  // entry is regex-checked here; existence in DESTINATIONS is enforced by
  // normalize() (filters unknown slugs out before persisting).
  visitedSlugs: z
    .array(z.string().regex(/^[a-z0-9-]+$/))
    .max(100)
    .optional(),
});
export type NormalizedTripInputT = z.infer<typeof NormalizedTripInputSchema>;

export const WeatherForecastSchema = z.object({
  highF: z.number(),
  lowF: z.number(),
  precipMm: z.number(),
  summary: z.string(),
});

export const PerStopCostSchema = z.object({
  slug: z.string(),
  days: z.number(),
  lodgingUsd: z.number(),
  foodUsd: z.number(),
  activitiesUsd: z.number(),
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
  // Phase B: optional multi-stop fields. Both undefined on single-stop
  // costs persisted by the v3 path, so back-compat with older trips is
  // automatic via Zod's strip-on-parse semantics for optional fields.
  interStopDriveUsd: z.number().optional(),
  perStopCosts: z.array(PerStopCostSchema).optional(),
});

export const HydrationSchema = z.object({
  weather: WeatherForecastSchema,
  cost: CostBreakdownSchema,
});

export const BookingLinksSchema = z.object({
  flights: z.string().url(),
  lodging: z.string().url(),
});

// ─────────────────────────────────────────────────────────────
// JSON Schema mirrors for OpenAI tool-call parameters.
// Hand-rolled (not zod-to-json-schema) so the wire shape is explicit and
// reviewable. Keep these in lock-step with the zod schemas above.
// ─────────────────────────────────────────────────────────────

export const REC_TOOL_PARAMETERS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["picks", "why_these_four"],
  properties: {
    why_these_four: {
      type: "string",
      minLength: 40,
      maxLength: 500,
      description:
        "ONE paragraph explaining why this set of 4 (as a group) is the right shortlist for this user — the tradeoffs you traded against to arrive at it. Cite at least one specific user preference. Do NOT just restate the input.",
    },
    picks: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slug", "rank", "reasoning", "match_tags", "tradeoffs", "stops"],
        properties: {
          slug: { type: "string", minLength: 1 },
          rank: { type: "integer", minimum: 1, maximum: 4 },
          reasoning: { type: "string", minLength: 20, maxLength: 400 },
          match_tags: {
            type: "array",
            minItems: 1,
            maxItems: 6,
            items: { type: "string" },
          },
          stops: {
            type: "array",
            minItems: 1,
            maxItems: 3,
            description:
              "Ordered stops for this route (1–3). stops[0].slug MUST equal pick.slug. Single-stop routes are valid for short trips; 2–3 stops are encouraged for 4+ day trips when the stops are geographically close. `days` is the user-facing day allocation per stop; null is acceptable when the LLM defers to the itinerary writer.",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["slug", "order", "days"],
              properties: {
                slug: { type: "string", minLength: 1 },
                order: { type: "integer", minimum: 1, maximum: 3 },
                days: {
                  type: ["integer", "null"],
                  minimum: 1,
                  maximum: 14,
                },
              },
            },
          },
          tradeoffs: {
            type: "object",
            additionalProperties: false,
            required: ["flight", "budget", "crowd", "vibeFit", "seasonFit"],
            description:
              "1..3 dot scores. 3 = best on this axis for THIS user; 1 = significant downside.",
            properties: {
              flight: { type: "integer", minimum: 1, maximum: 3, description: "How short/easy the flight is from the user's origin. 3 = very short / direct." },
              budget: { type: "integer", minimum: 1, maximum: 3, description: "How much budget headroom under the user's ceiling. 3 = comfortably under." },
              crowd: { type: "integer", minimum: 1, maximum: 3, description: "How uncrowded for the user's dates. 3 = quiet, off-peak." },
              vibeFit: { type: "integer", minimum: 1, maximum: 3, description: "Match against the user's vibes (in priority order). 3 = perfect fit." },
              seasonFit: { type: "integer", minimum: 1, maximum: 3, description: "How well the destination is in season for the trip dates. 3 = ideal season." },
            },
          },
        },
      },
    },
  },
} as const;

export function buildItineraryToolParametersSchema(tripLengthDays: number) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["days"],
    properties: {
      days: {
        type: "array",
        minItems: tripLengthDays,
        maxItems: tripLengthDays,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["day", "title", "description"],
          properties: {
            day: { type: "integer", minimum: 1, maximum: 14 },
            title: { type: "string", minLength: 3, maxLength: 80 },
            description: { type: "string", minLength: 20, maxLength: 600 },
          },
        },
      },
    },
  } as const;
}

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
