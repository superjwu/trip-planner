"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("plan.connectChatGPT");
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
    <div
      className="mx-auto max-w-2xl px-6 py-16"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* Coastal-cream card */}
      <div
        className="rounded-[3rem] border px-8 py-10 text-center shadow-[0_30px_60px_-20px_rgba(31,41,55,0.15)]"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--hairline)" }}
      >
        {/* 4-petal flower icon — slate-primary stroke */}
        <div className="mb-5 flex justify-center" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="12" rx="5" ry="10" fill="none" stroke="#2C5474" strokeWidth="1.8" />
            <ellipse cx="20" cy="28" rx="5" ry="10" fill="none" stroke="#2C5474" strokeWidth="1.8" />
            <ellipse cx="12" cy="20" rx="10" ry="5" fill="none" stroke="#2C5474" strokeWidth="1.8" />
            <ellipse cx="28" cy="20" rx="10" ry="5" fill="none" stroke="#2C5474" strokeWidth="1.8" />
            <circle cx="20" cy="20" r="3" fill="#2C5474" />
          </svg>
        </div>

        {/* Kicker */}
        <p
          className="mb-3 text-xs font-semibold tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
        >
          {t("kicker")}
        </p>

        {/* Headline — DM Sans light */}
        <h1
          className="text-3xl font-light"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
        >
          {t("headline")}
        </h1>

        {/* Body — Manrope */}
        <p
          className="mt-3 text-base leading-relaxed"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {t("body")}
        </p>

        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="btn-accent mt-8 px-8 py-3.5 text-base"
            style={{ fontFamily: "var(--font-body-stack)" }}
          >
            {t("cta")}
          </button>
        )}

        {phase === "starting" && (
          <p
            className="mt-8 animate-pulse text-sm"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            {t("starting")}
          </p>
        )}

        {(phase === "awaiting_code" || phase === "polling") && userCode && (
          <div className="mt-8 space-y-4 text-left">
            <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
              <li style={{ fontFamily: "var(--font-body-stack)" }}>
                <span
                  className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  1
                </span>
                {t("step1", { url: "auth.openai.com/codex/device" })}{" "}
                <a
                  href={verificationUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                  style={{ color: "var(--slate-primary)" }}
                >
                  auth.openai.com/codex/device
                </a>
              </li>
              <li style={{ fontFamily: "var(--font-body-stack)" }}>
                <span
                  className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  2
                </span>
                {t("step2")}
              </li>
            </ol>
            {/* Code display cell */}
            <div
              className="select-all rounded-2xl border py-4 text-center font-mono text-2xl font-semibold tracking-widest"
              style={{
                borderColor: "rgba(44,84,116,0.30)",
                backgroundColor: "var(--paper-deep)",
                color: "var(--ink)",
              }}
              aria-label="One-time code"
            >
              {userCode}
            </div>
            <p
              className="text-center text-xs italic"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
            >
              {t("waiting")}
            </p>
          </div>
        )}

        {phase === "ready" && (
          <p
            className="mt-8 text-base font-semibold"
            style={{ fontFamily: "var(--font-body-stack)", color: "#4f5e3f" }}
          >
            {t("connected")}
          </p>
        )}

        {phase === "expired" && (
          <div className="mt-8 space-y-4">
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body-stack)", color: "#7a6638" }}
            >
              {t("expired")}
            </p>
            <button
              type="button"
              onClick={start}
              className="btn-accent px-6 py-2.5 text-sm"
              style={{ fontFamily: "var(--font-body-stack)" }}
            >
              {t("restart")}
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="mt-8 space-y-4">
            <p
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(201,115,115,0.40)",
                backgroundColor: "rgba(201,115,115,0.10)",
                color: "#7a3f3f",
                fontFamily: "var(--font-body-stack)",
              }}
            >
              {error}
            </p>
            <button
              type="button"
              onClick={start}
              className="btn-accent px-6 py-2.5 text-sm"
              style={{ fontFamily: "var(--font-body-stack)" }}
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* Alt key line */}
        <p
          className="mt-6 text-sm italic"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
        >
          {t("altKey")}
        </p>

        {/* Fine print */}
        <p
          className="mt-4 text-[11px] leading-relaxed"
          style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
        >
          {t("finePrint")}
        </p>
      </div>
    </div>
  );
}
