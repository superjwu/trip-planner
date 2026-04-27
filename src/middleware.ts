import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isAuthBypassEnabled, isClerkConfigured } from "@/lib/clerk-config";

// /trips/demo is intentionally public (static layout preview, no DB).
function pathIsProtected(pathname: string): boolean {
  if (pathname.startsWith("/trips/demo")) return false;
  return pathname.startsWith("/plan") || pathname.startsWith("/trips");
}

const isProtectedRoute = createRouteMatcher([
  "/plan(.*)",
  "/trips",
  "/trips/((?!demo).+)",
]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Closed by default: only pass through unauthenticated traffic when the
// operator has explicitly opted into DEV_BYPASS_AUTH=1. Misconfigured prod
// (Clerk unset) hits the explicit error response below instead of running
// against the admin client.
export default function middleware(req: NextRequest) {
  if (isAuthBypassEnabled()) {
    return NextResponse.next();
  }
  if (!isClerkConfigured()) {
    if (pathIsProtected(req.nextUrl.pathname)) {
      return new NextResponse(
        "Auth is not configured. Set Clerk env vars or DEV_BYPASS_AUTH=1.",
        { status: 503, headers: { "content-type": "text/plain" } },
      );
    }
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
