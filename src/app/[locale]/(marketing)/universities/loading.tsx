export default function UniversitiesLoading() {
  return (
    <div className="container-page py-section-md">
      <header className="mb-8">
        <div className="h-9 w-64 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
        {/* Filters skeleton — mirrors the in-page Suspense fallback. */}
        <div className="hidden h-[28rem] rounded-lg border border-border bg-card p-5 lg:block">
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-high" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded bg-surface-high"
              />
            ))}
          </div>
        </div>

        {/* Card grid skeleton */}
        <main>
          <div className="h-5 w-40 animate-pulse rounded bg-surface-high" />
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
