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
      <main className="flex-1">
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
      <div className="paper-strong bg-white px-8 py-10">
        <p className="hero-eyebrow mb-3 text-[var(--accent)]">Temporarily unavailable</p>
        <h1
          className="font-serif text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          ChatGPT integration is paused.
        </h1>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          The site operator has disabled trip planning. Check back later or browse the{" "}
          <Link className="underline hover:text-[var(--ink)]" href="/trips/demo">
            demo result
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
