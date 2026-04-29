"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface StartResponse {
  userCode?: string;
  verificationUrl?: string;
  intervalSeconds?: number;
  error?: string;
  code?: string;
}

interface PollResponse {
  status?: "pending" | "ready" | "expired";
  chatgptAccountId?: string;
  error?: string;
  code?: string;
}

type Phase = "idle" | "starting" | "awaiting_code" | "polling" | "ready" | "expired" | "error";

const POLL_INTERVAL_MS = 5000;

export function ConnectChatGPTGate() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [userCode, setUserCode] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  async function start() {
    setPhase("starting");
    setError(null);
    try {
      const res = await fetch("/api/auth/codex/start", { method: "POST" });
      const data: StartResponse = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to start.");
        setPhase("error");
        return;
      }
      if (!data.userCode || !data.verificationUrl) {
        setError("Bad response from server.");
        setPhase("error");
        return;
      }
      setUserCode(data.userCode);
      setVerificationUrl(data.verificationUrl);
      setPhase("awaiting_code");
      // Open the verification URL in a new tab so the user can paste the code there.
      window.open(data.verificationUrl, "_blank", "noopener,noreferrer");
      // Start polling
      setPhase("polling");
      pollTimer.current = setInterval(poll, POLL_INTERVAL_MS);
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }

  async function poll() {
    try {
      const res = await fetch("/api/auth/codex/poll", { method: "POST" });
      const data: PollResponse = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Polling failed.");
        setPhase("error");
        if (pollTimer.current) clearInterval(pollTimer.current);
        return;
      }
      if (data.status === "ready") {
        if (pollTimer.current) clearInterval(pollTimer.current);
        setPhase("ready");
        // Reload so the page sees the connected state.
        router.refresh();
      } else if (data.status === "expired") {
        if (pollTimer.current) clearInterval(pollTimer.current);
        setPhase("expired");
      }
      // pending → keep waiting
    } catch (e) {
      // Transient error — keep polling.
      console.warn("[connect] poll error", e);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="paper-strong bg-[var(--butter)] px-8 py-10 text-center">
        <p className="hero-eyebrow mb-3 text-[var(--accent)]">Connect ChatGPT</p>
        <h1
          className="font-serif text-3xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
        >
          Bring your ChatGPT subscription.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">
          Trip Planner uses your ChatGPT Plus or Pro account to generate
          recommendations. We never see your password — you authorize us at
          OpenAI directly.
        </p>

        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="mt-8 rounded-full bg-[var(--accent)] px-7 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[var(--accent-soft)]"
          >
            Connect ChatGPT →
          </button>
        )}

        {phase === "starting" && (
          <p className="mt-8 animate-pulse text-sm text-[var(--ink-soft)]">
            Requesting a one-time code from OpenAI…
          </p>
        )}

        {(phase === "awaiting_code" || phase === "polling") && userCode && (
          <div className="mt-8 space-y-4 text-left">
            <ol className="space-y-3 text-sm leading-relaxed text-[var(--ink)]/90">
              <li>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white">
                  1
                </span>
                A new tab opened to{" "}
                <a
                  href={verificationUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline"
                >
                  auth.openai.com/codex/device
                </a>
                . Sign in there with your ChatGPT account.
              </li>
              <li>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white">
                  2
                </span>
                Enter this one-time code:
              </li>
            </ol>
            <div
              className="select-all rounded-2xl border border-[var(--accent)]/40 bg-white py-4 text-center font-mono text-2xl font-semibold tracking-widest text-[var(--ink)]"
              aria-label="One-time code"
            >
              {userCode}
            </div>
            <p className="text-center text-xs italic text-[var(--ink-soft)]">
              Waiting for OpenAI to confirm… this page updates automatically.
            </p>
          </div>
        )}

        {phase === "ready" && (
          <p className="mt-8 text-base font-semibold text-[#4f5e3f]">
            Connected. Reloading…
          </p>
        )}

        {phase === "expired" && (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-[#7a6638]">
              That code expired. Try again with a fresh one.
            </p>
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-soft)]"
            >
              Restart
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="mt-8 space-y-4">
            <p className="rounded-2xl border border-[#c97373]/40 bg-[#c97373]/10 px-4 py-3 text-sm text-[#7a3f3f]">
              {error}
            </p>
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-soft)]"
            >
              Retry
            </button>
          </div>
        )}

        <p className="mt-10 text-[11px] leading-relaxed text-[var(--ink-soft)]">
          We use the same OpenAI device-code OAuth flow that the Codex CLI uses.
          This integration is provided for personal demo use; it depends on
          OpenAI&apos;s Codex backend remaining available and your ChatGPT account&apos;s
          rate limits. You can disconnect any time from Settings.
        </p>
      </div>
    </div>
  );
}
