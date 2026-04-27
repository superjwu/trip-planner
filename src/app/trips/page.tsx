import Link from "next/link";
import { z } from "zod";
import { MainNav } from "@/components/nav/MainNav";
import { requireUserId } from "@/lib/auth";
import { createOwnerScopedSupabase } from "@/lib/supabase/server";
import { NormalizedTripInputSchema } from "@/lib/schemas";
import type { NormalizedTripInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My trips — Trip Planner",
};

interface TripRowRaw {
  id: string;
  origin_city: string | null;
  depart_on: string | null;
  return_on: string | null;
  normalized_input: unknown;
  compute_status: string;
  user_status: "draft" | "saved" | "archived";
  created_at: string;
}

interface RecPreviewRowRaw {
  trip_id: string;
  rank: number;
  destination_slug: string;
  destination_snapshot: unknown;
}

interface ParsedTrip {
  id: string;
  origin_city: string | null;
  depart_on: string | null;
  return_on: string | null;
  normalized_input: NormalizedTripInput | null;
  compute_status: string;
  user_status: "draft" | "saved" | "archived";
}

interface ParsedRecPreview {
  trip_id: string;
  rank: number;
  destination_slug: string;
  destination_name: string | null;
  destination_state: string | null;
}

const RecPreviewSnapshotSchema = z.object({
  name: z.string(),
  state: z.string(),
});

function parseTrip(raw: TripRowRaw): ParsedTrip {
  const norm = NormalizedTripInputSchema.safeParse(raw.normalized_input);
  return {
    id: raw.id,
    origin_city: raw.origin_city,
    depart_on: raw.depart_on,
    return_on: raw.return_on,
    normalized_input: norm.success ? norm.data : null,
    compute_status: raw.compute_status,
    user_status: raw.user_status,
  };
}

function parseRecPreview(raw: RecPreviewRowRaw): ParsedRecPreview {
  const snap = RecPreviewSnapshotSchema.safeParse(raw.destination_snapshot);
  return {
    trip_id: raw.trip_id,
    rank: raw.rank,
    destination_slug: raw.destination_slug,
    destination_name: snap.success ? snap.data.name : null,
    destination_state: snap.success ? snap.data.state : null,
  };
}

async function fetchTrips() {
  try {
    const userId = await requireUserId();
    const sb = await createOwnerScopedSupabase();
    const { data: tripsRaw } = await sb
      .from("trips")
      .select(
        "id, origin_city, depart_on, return_on, normalized_input, compute_status, user_status, created_at",
      )
      .eq("clerk_user_id", userId)
      .neq("user_status", "archived")
      .order("created_at", { ascending: false })
      .limit(50);

    const trips = ((tripsRaw as TripRowRaw[]) ?? []).map(parseTrip);

    const tripIds = trips.map((t) => t.id);
    let recs: ParsedRecPreview[] = [];
    if (tripIds.length) {
      const { data } = await sb
        .from("recommendations")
        .select("trip_id, rank, destination_slug, destination_snapshot")
        .in("trip_id", tripIds);
      recs = ((data as RecPreviewRowRaw[]) ?? []).map(parseRecPreview);
    }

    return { trips, recs };
  } catch {
    // Supabase not reachable (placeholder env) or auth not configured.
    return { trips: [] as ParsedTrip[], recs: [] as ParsedRecPreview[] };
  }
}

export default async function TripsPage() {
  const { trips, recs } = await fetchTrips();

  const recsByTrip = new Map<string, ParsedRecPreview[]>();
  for (const r of recs) {
    if (!recsByTrip.has(r.trip_id)) recsByTrip.set(r.trip_id, []);
    recsByTrip.get(r.trip_id)!.push(r);
  }

  const saved = trips.filter((t) => t.user_status === "saved");
  const drafts = trips.filter((t) => t.user_status !== "saved");

  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <header className="mb-8">
          <p className="hero-eyebrow mb-2 text-[var(--accent)]">Bucket</p>
          <h1
            className="font-serif text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
          >
            My trips
          </h1>
        </header>

        {trips.length === 0 && <EmptyState />}

        {saved.length > 0 && (
          <Section title={`Saved (${saved.length})`}>
            <TripList trips={saved} recsByTrip={recsByTrip} />
          </Section>
        )}

        {drafts.length > 0 && (
          <Section title={`Drafts (${drafts.length})`}>
            <TripList trips={drafts} recsByTrip={recsByTrip} />
          </Section>
        )}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass-strong px-7 py-12 text-center">
      <p className="text-base text-[var(--text-muted)]">
        No trips yet. Plan one to get started.
      </p>
      <Link
        href="/plan"
        className="mt-5 inline-block rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-text)] shadow-[0_0_24px_var(--primary-glow)] transition hover:opacity-90"
      >
        Plan a trip →
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="hero-eyebrow mb-3 text-[var(--accent)]">{title}</h2>
      {children}
    </section>
  );
}

function TripList({
  trips,
  recsByTrip,
}: {
  trips: ParsedTrip[];
  recsByTrip: Map<string, ParsedRecPreview[]>;
}) {
  return (
    <div className="space-y-3">
      {trips.map((t) => {
        const tripRecs = (recsByTrip.get(t.id) ?? []).sort(
          (a, b) => a.rank - b.rank,
        );
        const top = tripRecs[0];
        const summary =
          tripRecs.length > 0
            ? tripRecs
                .map((r) => r.destination_name ?? r.destination_slug)
                .join(" · ")
            : t.compute_status === "computing"
              ? "Picking destinations…"
              : "Not yet computed";
        const title =
          top?.destination_name ??
          (t.normalized_input
            ? `${t.normalized_input.tripLengthDays}-day trip from ${t.normalized_input.originCode}`
            : "Trip");
        return (
          <Link
            key={t.id}
            href={`/trips/${t.id}`}
            className="glass glass-hover flex items-center justify-between gap-5 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <p
                className="font-serif text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
              >
                {title}
              </p>
              <p className="truncate text-sm text-[var(--text-muted)]">
                {summary}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {t.depart_on ? `${t.depart_on} → ${t.return_on}` : "—"} ·
                {" "}from {t.origin_city ?? "—"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                t.user_status === "saved"
                  ? "bg-[var(--primary)]/20 text-[var(--accent)]"
                  : "bg-white/10 text-[var(--text-muted)]"
              }`}
            >
              {t.user_status}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
