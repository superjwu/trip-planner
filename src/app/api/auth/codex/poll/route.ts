import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireUserId } from "@/lib/auth";
import {
  CodexOAuthError,
  decodeChatgptAccountId,
  exchangeAuthorizationCode,
  isCodexOAuthEnabled,
  pollDeviceAuth,
} from "@/lib/llm/codex-auth";
import { persistCodexAuth } from "@/lib/llm/codex-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DeviceAuthCookie {
  deviceAuthId: string;
  userCode: string;
  clerkUserId: string;
  startedAt: number;
}

/**
 * POST /api/auth/codex/poll
 *
 * Returns:
 *  - { status: "pending" } while OpenAI hasn't seen the user enter the code
 *  - { status: "ready", chatgptAccountId } once we've exchanged + persisted
 *  - { status: "expired" } if 15 minutes passed without success
 *  - 4xx if the cookie is missing or the user isn't signed in
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

  const jar = await cookies();
  const raw = jar.get("codex_device_auth")?.value;
  if (!raw) {
    return NextResponse.json(
      { error: "No device-auth flow in progress.", code: "no_flow" },
      { status: 400 },
    );
  }

  let parsed: DeviceAuthCookie;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Cookie unreadable.", code: "bad_cookie" },
      { status: 400 },
    );
  }

  if (parsed.clerkUserId !== userId) {
    return NextResponse.json(
      { error: "Cookie/user mismatch.", code: "cookie_mismatch" },
      { status: 400 },
    );
  }

  if (Date.now() - parsed.startedAt > 15 * 60 * 1000) {
    jar.delete("codex_device_auth");
    return NextResponse.json({ status: "expired" });
  }

  try {
    const codeResp = await pollDeviceAuth({
      deviceAuthId: parsed.deviceAuthId,
      userCode: parsed.userCode,
    });
    if (!codeResp) {
      return NextResponse.json({ status: "pending" });
    }

    // User entered the code — exchange, decode, persist.
    const tokens = await exchangeAuthorizationCode({
      authorizationCode: codeResp.authorizationCode,
      codeVerifier: codeResp.codeVerifier,
    });
    const chatgptAccountId = decodeChatgptAccountId(tokens.accessToken);
    await persistCodexAuth({
      clerkUserId: userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      chatgptAccountId,
    });
    jar.delete("codex_device_auth");
    return NextResponse.json({ status: "ready", chatgptAccountId });
  } catch (e) {
    const err = e as Error;
    if (err instanceof CodexOAuthError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: err.message, code: "poll_failed" }, { status: 500 });
  }
}
