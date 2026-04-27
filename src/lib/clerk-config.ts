// Lets the project build without real Clerk keys (placeholder = bypass).
// Once a real publishable key is set, ClerkProvider + middleware activate.

const PLACEHOLDER_PREFIX = "pk_test_placeholder";

export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (key.startsWith(PLACEHOLDER_PREFIX)) return false;
  // Real Clerk publishable keys are pk_test_<base64> or pk_live_<base64>
  return /^pk_(test|live)_[A-Za-z0-9_=]+$/.test(key) && key.length > 30;
}
