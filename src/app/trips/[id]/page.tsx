import { notFound } from "next/navigation";
import { MainNav } from "@/components/nav/MainNav";
import { CompareHeader } from "@/components/recs/CompareHeader";
import { isClerkConfigured } from "@/lib/clerk-config";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import type { NormalizedTripInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your trip — Trip Planner",
};

interface TripRow {
  id: string;
  clerk_user_id: string;
  origin_city: string | null;
  depart_on: string | null;
  return_on: string | null;
  normalized_input: NormalizedTripInput | null;
  compute_status: "pending" | "computing" | "ready" | "failed";
  compute_error: string | null;
  user_status: string;
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sb = isClerkConfigured() ? await createServerSupabase() : createAdminSupabase();
  const { data, error } = await sb
    .from("trips")
    .select(
      "id, clerk_user_id, origin_city, depart_on, return_on, normalized_input, compute_status, compute_error, user_status",
    )
    .eq("id", id)
    .maybeSingle<TripRow>();

  if (error || !data) {
    notFound();
  }

  const normalized = data.normalized_input;
  const computing =
    data.compute_status === "pending" || data.compute_status === "computing";

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {normalized && <CompareHeader input={normalized} destinationCount={4} />}

        {computing && <ComputingState />}

        {data.compute_status === "failed" && (
          <ErrorState message={data.compute_error ?? "Something went wrong."} />
        )}

        {data.compute_status === "ready" && (
          <ReadyStub message="Recommendations land in Phase 4." />
        )}
      </main>
    </>
  );
}

function ComputingState() {
  return (
    <section className="mt-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <article
            key={i}
            className="glass-strong relative overflow-hidden"
            style={{ minHeight: 420 }}
          >
            <div className="h-56 w-full animate-pulse bg-white/5" />
            <div className="space-y-3 px-5 py-4">
              <div className="h-5 w-3/5 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-white/10" />
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-white/10" />
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-5 w-16 animate-pulse rounded-full bg-white/10"
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p
        className="mt-8 text-center text-sm italic text-[var(--text-muted)]"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Picking 4 destinations for you…
      </p>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass-strong mt-6 px-7 py-6 text-center">
      <p className="text-base font-semibold text-red-300">
        Couldn't generate recommendations
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

function ReadyStub({ message }: { message: string }) {
  return (
    <div className="glass-strong mt-6 px-7 py-6 text-center">
      <p className="text-base font-semibold text-white">{message}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        See <a className="underline" href="/trips/demo">/trips/demo</a> for the
        layout preview while the rec engine is being built.
      </p>
    </div>
  );
}
