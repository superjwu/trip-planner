# Project Proposal: Trip Planning Copilot

## One-Line Description
A web app for travelers departing from U.S. cities like NYC or Chicago that turns vague trip preferences into curated destination options, itinerary previews, and booking links.

## The Problem
Planning a short leisure trip takes too much time because travelers have to search flights, hotels, and activities across many different sites while also figuring out where they should go in the first place. The harder problem is not just booking, but turning fuzzy preferences like "scenic," "good food," and "not too far" into a small set of meaningful options. This matters to me because I have personally run into the friction of comparing destinations, deciding which place is actually worth visiting, and then making the next location decisions for the trip without opening endless tabs.

## Target User
Version 1 is for users like me and my friends who are departing from major U.S. cities and planning 3-5 day leisure trips. They want help narrowing destination choices quickly, understanding tradeoffs, and getting enough structure to move from browsing to an actual decision.

## Core Features (v1)
- User accounts with saved trips and reusable travel preferences
- A guided preference flow that converts vague inputs into structured trip constraints
- 3-4 curated destination recommendations with clear explanations of why each matches the user's priorities
- A preview itinerary and rough cost estimate for each recommended destination
- Outbound booking links for flights and lodging so users can act on a recommendation

## Tech Stack
- Frontend: Next.js, because this project needs a presentable web interface with fast iteration and easy deployment
- Styling: Tailwind CSS, because it is fast for building and iterating on a polished product UI
- Database: Supabase Postgres, because I need simple persistence for users, saved trips, preferences, and recommendation results
- Auth: Clerk, because it provides a fast path to production-ready login so I can focus on product behavior instead of auth plumbing
- APIs: Amadeus for flight and hotel search, Google Places for place details and travel context, and a weather API such as OpenWeather for lightweight forecast context
- Deployment: Vercel, because it is the simplest deployment path for a Next.js product demo
- MCP Servers: Playwright MCP for UI testing and iteration, Supabase MCP for database workflows, and any relevant browser/dev MCP tools to speed up debugging and product iteration

Note: I am choosing a standard web stack because my Week 1 priority is a usable product experience, not just a backend prototype. The architecture is centered on presenting strong recommendations and saving planning context, not on supporting direct booking transactions.

## Stretch Goals
If the core experience is solid, I want to expand from destination recommendations into a fuller planning copilot. That could include follow-up recommendation rounds after user feedback, better trip-style personalization, richer itinerary generation, more polished shareable trip pages, and support for comparing multiple saved trips side by side. A more ambitious stretch would be a multi-step agent workflow that helps the user move from destination choice to neighborhood choice to lodging choice while keeping the tradeoffs visible.

## Biggest Risk
The biggest risk is that the recommendations feel shallow or generic. Even if I can connect travel APIs and produce options, the product will fail if the options do not feel meaningfully different, if the explanations do not reflect the user's actual priorities, or if the results are not helpful enough to guide the user's next decision.

## Week 5 Goal
By the end of the first project week, I will demo a working web app where a logged-in user can enter origin city, trip length, and vague preferences, and receive 3-4 visually polished destination recommendations with explanations, rough cost estimates, itinerary previews, and saved results.