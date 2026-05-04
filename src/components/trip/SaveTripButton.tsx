"use client";
import { useTransition } from "react";
import { setTripStatus } from "@/app/trips/[id]/actions";

interface Props {
  tripId: string;
  initialStatus: "draft" | "saved" | "archived";
}

export function SaveTripButton({ tripId, initialStatus }: Props) {
  const [pending, startTransition] = useTransition();
  const saved = initialStatus === "saved";

  function onClick() {
    startTransition(async () => {
      await setTripStatus({
        tripId,
        status: saved ? "draft" : "saved",
      });
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
        saved
          ? "border border-[var(--slate-primary)] bg-transparent text-[var(--slate-primary)] hover:bg-[var(--slate-tint)]"
          : "bg-[var(--accent)] text-white shadow-[0_8px_20px_-8px_rgba(231,111,81,0.40)] hover:opacity-90"
      }`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {pending ? "…" : saved ? "✦ Saved" : "✦ Save this trip"}
    </button>
  );
}
