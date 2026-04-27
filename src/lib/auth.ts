import { auth } from "@clerk/nextjs/server";
import { isAuthBypassEnabled, isClerkConfigured } from "./clerk-config";

export interface AuthContext {
  userId: string | null;
  getToken: () => Promise<string | null>;
  /** True when we're running in the explicit DEV_BYPASS_AUTH=1 mode. */
  isDevBypass: boolean;
}

const DEV_USER_ID = "dev-user-no-clerk";

/**
 * Server-side auth resolver.
 * - When Clerk is configured: returns the real Clerk userId + token getter.
 * - When NOT configured AND DEV_BYPASS_AUTH=1: returns a stable dev user so
 *   the app remains explorable locally without keys.
 * - Otherwise (Clerk unset and no explicit bypass): returns a NULL userId so
 *   protected routes fail closed.
 */
export async function getAuthContext(): Promise<AuthContext> {
  if (!isClerkConfigured()) {
    if (isAuthBypassEnabled()) {
      return {
        userId: DEV_USER_ID,
        getToken: async () => null,
        isDevBypass: true,
      };
    }
    return { userId: null, getToken: async () => null, isDevBypass: false };
  }
  const a = await auth();
  return {
    userId: a.userId,
    getToken: async () => (await a.getToken()) ?? null,
    isDevBypass: false,
  };
}

export async function requireUserId(): Promise<string> {
  const { userId } = await getAuthContext();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}
