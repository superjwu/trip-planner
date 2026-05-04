import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { PreferenceWizard } from "@/components/plan/PreferenceWizard";
import { ConnectChatGPTGate } from "@/components/plan/ConnectChatGPTGate";
import { isCodexOAuthEnabled } from "@/lib/llm/codex-auth";
import { hasCodexAuth } from "@/lib/llm/codex-token";
import { requireUserId } from "@/lib/auth";

export const metadata = {
  title: "Plan a trip — Trip Planner",
};

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  // If the OAuth flow is killed, drop straight into the wizard with a banner.
  // The ranker will throw CodexNotConnectedError if anyone actually submits.
  let connected = false;
  if (isCodexOAuthEnabled()) {
    try {
      const userId = await requireUserId();
      const status = await hasCodexAuth(userId);
      connected = status.connected;
    } catch {
      connected = false;
    }
  }

  return (
    <>
      <MainNav />
      <main
        className="flex-1 min-h-screen"
        style={{ backgroundColor: "var(--paper)" }}
      >
        {!isCodexOAuthEnabled() ? (
          <DisabledBanner />
        ) : connected ? (
          <PreferenceWizard />
        ) : (
          <ConnectChatGPTGate />
        )}
      </main>
    </>
  );
}

function DisabledBanner() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div
        className="rounded-[3rem] border px-8 py-10 shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--hairline)" }}
      >
        {/* Kicker */}
        <p
          className="mb-3 text-xs font-semibold tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
        >
          Temporarily unavailable
        </p>
        {/* Headline */}
        <h1
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          ChatGPT integration is paused.
        </h1>
        {/* Body */}
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          The site operator has disabled trip planning. Check back later or browse the{" "}
          <Link
            className="underline hover:opacity-70"
            href="/trips/demo"
            style={{ color: "var(--slate-primary)" }}
          >
            demo result
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
