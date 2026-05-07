"use client";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { VipBadge } from "./VipBadge";

/**
 * Right-aligned account slot in the nav. Shows Clerk's UserButton
 * (avatar with sign-out + manage-account dropdown) when signed in,
 * a "Sign in" link when signed out. Wrapped in dynamic-render Clerk
 * components so the Server Component nav can stay async.
 *
 * Mounted only inside MainNav, which is only rendered on Clerk-configured
 * deployments (see MaybeClerkProvider) — in dev-bypass mode this never
 * renders, matching the rest of the auth surface.
 */
export function NavUserSlot({ signInLabel }: { signInLabel: string }) {
  return (
    <div className="ml-2 flex items-center gap-2">
      <SignedIn>
        <VipBadge />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80"
            style={{
              background: "transparent",
              color: "var(--ink-soft)",
              border: "1px solid var(--hairline)",
              fontFamily: "var(--font-body-stack)",
            }}
          >
            {signInLabel}
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
