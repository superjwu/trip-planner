import { MainNav } from "@/components/nav/MainNav";
import { GeneratingProgress } from "@/components/recs/GeneratingProgress";

/**
 * Shown by Next while /trips/[id] is rendering its first compute. The page's
 * own server action is synchronous (~10s), so this is what the user looks at
 * during the wait. Auto-poll handled inside GeneratingProgress.
 */
export default function Loading() {
  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <GeneratingProgress />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <article
              key={i}
              className="paper relative overflow-hidden bg-white"
              style={{ minHeight: 420, borderRadius: "var(--radius-lg)" }}
            >
              <div className="h-56 w-full animate-pulse bg-[var(--paper-deep)]" />
              <div className="space-y-3 px-5 py-4">
                <div className="h-5 w-3/5 animate-pulse rounded bg-[var(--paper-deep)]" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-[var(--paper-deep)]" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-[var(--paper-deep)]" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--paper-deep)]" />
                  <div className="h-3 w-4/6 animate-pulse rounded bg-[var(--paper-deep)]" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
