import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main
        className="flex flex-1 items-center justify-center px-6 py-24 text-center"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <div className="rounded-3xl border border-[var(--hairline)] bg-white max-w-md p-8 shadow-[0_20px_40px_-16px_rgba(31,41,55,0.10)]">
          <h1
            className="mb-3 text-3xl font-medium text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display-stack)" }}
          >
            Auth not configured
          </h1>
          <p className="text-sm text-[var(--ink-soft)]">
            Add real <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> +{" "}
            <code>CLERK_SECRET_KEY</code> to <code>.env.local</code> to enable
            sign-up.
          </p>
        </div>
      </main>
    );
  }
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* Brand wordmark + tagline above the Clerk widget */}
      <div className="mb-8 text-center">
        <p
          className="text-3xl font-medium text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display-stack)" }}
        >
          <em style={{ color: "var(--slate-primary)" }}>Trip</em> Planner
        </p>
        <p
          className="mt-1 text-sm text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-body-stack)", fontStyle: "italic" }}
        >
          Your next adventure starts here.
        </p>
      </div>

      {/* Clerk component on a coastal-slate card */}
      <div className="rounded-3xl border border-[var(--hairline)] bg-white p-8 shadow-[0_20px_40px_-16px_rgba(31,41,55,0.10)]">
        <SignUp />
      </div>
    </main>
  );
}
