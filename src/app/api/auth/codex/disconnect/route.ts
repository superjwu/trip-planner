import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireUserId } from "@/lib/auth";
import { deleteCodexAuth } from "@/lib/llm/codex-token";
import { isCodexOAuthEnabled } from "@/lib/llm/codex-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  await deleteCodexAuth(userId);
  const jar = await cookies();
  jar.delete("codex_device_auth");
  return NextResponse.json({ status: "disconnected" });
}
