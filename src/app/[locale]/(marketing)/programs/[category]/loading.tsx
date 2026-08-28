export default function ProgramsCategoryLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mb-8">
        <div className="h-9 w-72 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      {/* City filter skeleton */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full border border-border bg-card" />
        ))}
      </div>

      {/* Program cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface-high" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-surface-dim" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-surface-dim" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-surface-dim" />
              <div className="h-6 w-24 animate-pulse rounded bg-primary/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
