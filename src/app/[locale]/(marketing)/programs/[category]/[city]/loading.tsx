export default function ProgramCityLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mb-8">
        <div className="h-9 w-80 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      {/* Results skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-surface-dim" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 animate-pulse rounded bg-surface-high" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-surface-dim" />
            </div>
            <div className="h-6 w-24 animate-pulse rounded bg-primary/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
