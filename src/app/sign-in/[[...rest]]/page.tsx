import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24 text-center">
        <div className="glass-strong max-w-md p-8">
          <h1 className="hero-title mb-3 text-3xl">Auth not configured</h1>
          <p className="text-[var(--text-muted)]">
            Add real <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> +{" "}
            <code>CLERK_SECRET_KEY</code> to <code>.env.local</code> to enable
            sign-in.
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <SignIn />
    </main>
  );
}
