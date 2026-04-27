import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk-config";

const isProtectedRoute = createRouteMatcher(["/plan(.*)", "/trips(.*)"]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// When Clerk isn't configured (dev/placeholder env), allow all traffic
// through so the project remains explorable without keys.
export default function middleware(req: NextRequest) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  // @ts-expect-error — clerkMiddleware returns a NextRequest handler shape.
  return clerkHandler(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
