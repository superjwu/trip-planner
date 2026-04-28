"use client";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function DisconnectChatGPTButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/codex/disconnect", { method: "POST" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error ?? "Disconnect failed.");
          return;
        }
        router.refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:border-red-400/60 hover:text-red-300 disabled:opacity-60"
      >
        {pending ? "Disconnecting…" : "Disconnect"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-300">{error}</p>
      )}
    </div>
  );
}
