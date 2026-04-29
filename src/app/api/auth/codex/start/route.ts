import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireUserId } from "@/lib/auth";
import { isCodexOAuthEnabled, requestDeviceCode, CodexOAuthError } from "@/lib/llm/codex-auth";
import { signCookie } from "@/lib/cookie-sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/codex/start
 *
 * Body: none. Auth: Clerk.
 * Returns: { userCode, verificationUrl, intervalSeconds }
 *
 * Side effect: writes a signed HTTP-only cookie `codex_device_auth` containing
 * { deviceAuthId, userCode } so the subsequent /poll route can finalize without
 * the client knowing the deviceAuthId.
 */
export async function POST() {
  if (!isCodexOAuthEnabled()) {
    return NextResponse.json(
      { error: "ChatGPT integration is temporarily disabled.", code: "feature_disabled" },
      { status: 503 },
    );
  }

  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: "Sign in first.", code: "not_authed" }, { status: 401 });
  }

  try {
    const dc = await requestDeviceCode();

    const jar = await cookies();
    const signedValue = await signCookie({
      deviceAuthId: dc.deviceAuthId,
      userCode: dc.userCode,
      clerkUserId: userId,
      startedAt: Date.now(),
    });
    jar.set({
      name: "codex_device_auth",
      value: signedValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // device codes expire in 15 minutes
    });

    return NextResponse.json({
      userCode: dc.userCode,
      verificationUrl: dc.verificationUrl,
      intervalSeconds: dc.intervalSeconds,
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof CodexOAuthError && err.code === "device_code_disabled") {
      return NextResponse.json(
        {
          error:
            "Device-code login isn't enabled on your ChatGPT account. Visit https://chatgpt.com/settings/security to enable it, then try again.",
          code: "device_code_disabled",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: err.message, code: "request_failed" }, { status: 500 });
  }
}
