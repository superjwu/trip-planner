import { MainNav } from "@/components/nav/MainNav";

export default function Loading() {
  return (
    <>
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="glass-strong mb-8 px-7 py-6">
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-7 w-1/2 animate-pulse rounded bg-white/10" />
        </section>

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
      </main>
    </>
  );
}
