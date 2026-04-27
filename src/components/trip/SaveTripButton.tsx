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
      className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-[0_0_24px_var(--primary-glow)] transition disabled:opacity-60 ${
        saved
          ? "border border-[var(--primary)] bg-transparent text-white hover:bg-[var(--primary)]/10"
          : "bg-[var(--primary)] text-[var(--primary-text)] hover:opacity-90"
      }`}
    >
      {pending ? "…" : saved ? "✦ Saved" : "✦ Save this trip"}
    </button>
  );
}
