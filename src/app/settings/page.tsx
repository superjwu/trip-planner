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
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <header className="mb-8">
          <p className="hero-eyebrow mb-2 text-[var(--accent)]">Settings</p>
          <h1
            className="font-serif text-3xl font-semibold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            Account
          </h1>
        </header>

        <section className="paper-strong bg-white px-7 py-6">
          <h2
            className="font-serif text-xl font-bold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            ChatGPT integration
          </h2>
          {!isCodexOAuthEnabled() ? (
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              ChatGPT integration is currently disabled at the server.
            </p>
          ) : status.connected ? (
            <div className="mt-4 flex items-center justify-between gap-6">
              <div>
                <p className="text-sm text-[var(--ink)]">
                  Connected ·{" "}
                  <span className="font-mono text-[var(--accent)]">
                    {status.chatgptAccountId?.slice(0, 12) ?? "…"}…
                  </span>
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Recommendations and itineraries route through your ChatGPT
                  subscription. Token expires {" "}
                  {status.expiresAt
                    ? new Date(status.expiresAt).toLocaleString()
                    : "unknown"}{" "}
                  and refreshes automatically.
                </p>
              </div>
              <DisconnectChatGPTButton />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[var(--text-muted)]">
                Not connected. Plan a trip to start the connection flow, or:
              </p>
              <Link
                href="/plan"
                className="inline-block rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-soft)]"
              >
                Connect ChatGPT
              </Link>
            </div>
          )}
        </section>

        <p className="mt-8 text-[11px] leading-relaxed text-[var(--text-muted)]">
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
