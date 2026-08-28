export default function SearchLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Search box skeleton */}
      <div className="mx-auto max-w-2xl">
        <div className="h-12 w-full animate-pulse rounded-lg border border-border bg-card" />
      </div>

      {/* Results skeleton */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-surface-dim" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 animate-pulse rounded bg-surface-high" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-surface-dim" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded bg-surface-dim" />
          </div>
        ))}
      </div>
    </div>
  );
}
