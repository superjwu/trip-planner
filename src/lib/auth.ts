import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "./clerk-config";

export interface AuthContext {
  userId: string | null;
  getToken: () => Promise<string | null>;
}

const DEV_USER_ID = "dev-user-no-clerk";

/**
 * Server-side helper: returns Clerk userId + token getter when Clerk is wired.
 * When Clerk is not configured (placeholder env), returns a stable dev user
 * so the app can be exercised end-to-end before keys are provisioned.
 */
export async function getAuthContext(): Promise<AuthContext> {
  if (!isClerkConfigured()) {
    return {
      userId: DEV_USER_ID,
      getToken: async () => null,
    };
  }
  const a = await auth();
  return {
    userId: a.userId,
    getToken: async () => {
      // Use the default Clerk session token — Supabase Third-Party Auth
      // accepts the unbranded session token directly.
      const t = await a.getToken();
      return t ?? null;
    },
  };
}

export async function requireUserId(): Promise<string> {
  const { userId } = await getAuthContext();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}
