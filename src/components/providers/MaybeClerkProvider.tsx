"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

/**
 * Wraps children in <ClerkProvider> only when a real Clerk publishable key is
 * configured. Lets the project build/run with placeholder env vars.
 */
export function MaybeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return <>{children}</>;
  }
  return <ClerkProvider>{children}</ClerkProvider>;
}
