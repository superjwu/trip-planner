import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { DisconnectChatGPTButton } from "@/components/settings/DisconnectChatGPTButton";
import { isCodexOAuthEnabled } from "@/lib/llm/codex-auth";
import { hasCodexAuth } from "@/lib/llm/codex-token";
import { requireUserId } from "@/lib/auth";

export const metadata = {
  title: "Settings — Trip Planner",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let userId: string | null = null;
  try {
    userId = await requireUserId();
  } catch {
    userId = null;
  }
  let status: { connected: boolean; chatgptAccountId?: string; expiresAt?: string } = {
    connected: false,
  };
  if (userId && isCodexOAuthEnabled()) {
    try {
      status = await hasCodexAuth(userId);
    } catch {
      // Supabase unreachable etc. — render as not-connected rather than 500ing.
      status = { connected: false };
    }
  }

  return (
    <>
      <MainNav />
      <main
        className="mx-auto w-full max-w-3xl flex-1 px-6 py-12"
        style={{ backgroundColor: "var(--paper)" }}
      >
        {/* Page header */}
        <header className="mb-10">
          <p
            className="mb-1 text-xs tracking-[0.18em] uppercase"
            style={{
              fontFamily: "var(--font-body-stack)",
              color: "var(--slate-primary)",
            }}
          >
            Account
          </p>
          <h1
            className="text-3xl font-medium text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display-stack)" }}
          >
            Settings
          </h1>
        </header>

        {/* ChatGPT integration card */}
        <section
          className="rounded-3xl border border-[var(--hairline)] bg-white px-7 py-6 shadow-[0_8px_24px_-8px_rgba(31,41,55,0.08)]"
        >
          {/* Section kicker + header */}
          <p
            className="mb-1 text-xs tracking-[0.16em] uppercase"
            style={{
              fontFamily: "var(--font-body-stack)",
              color: "var(--slate-primary)",
            }}
          >
            Integrations
          </p>
          <h2
            className="text-xl font-medium text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display-stack)" }}
          >
            ChatGPT integration
          </h2>

          {!isCodexOAuthEnabled() ? (
            <p className="mt-3 text-sm text-[var(--ink-soft)]">
              ChatGPT integration is currently disabled at the server.
            </p>
          ) : status.connected ? (
            <div className="mt-5 flex items-center justify-between gap-6">
              <div>
                <p className="text-sm text-[var(--ink)]">
                  Connected ·{" "}
                  <span className="font-mono text-[var(--accent)]">
                    {status.chatgptAccountId?.slice(0, 12) ?? "…"}…
                  </span>
                </p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  Recommendations and itineraries route through your ChatGPT
                  subscription. Token expires{" "}
                  {status.expiresAt
                    ? new Date(status.expiresAt).toLocaleString()
                    : "unknown"}{" "}
                  and refreshes automatically.
                </p>
              </div>
              {/* Destructive action — coral btn-accent */}
              <DisconnectChatGPTButton />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-[var(--ink-soft)]">
                Not connected. Plan a trip to start the connection flow, or:
              </p>
              <Link href="/plan" className="btn-slate inline-block px-5 py-2.5 text-sm font-semibold">
                Connect ChatGPT
              </Link>
            </div>
          )}
        </section>

        <p className="mt-8 text-[11px] leading-relaxed text-[var(--ink-soft)]">
          The ChatGPT integration uses OpenAI&apos;s Codex device-code OAuth flow,
          the same one their official Codex CLI uses. We store an encrypted
          refresh token and call the Codex backend on your behalf using the
          access token. This is provided for personal demo use and depends on
          OpenAI keeping the flow available.
        </p>
      </main>
    </>
  );
}
