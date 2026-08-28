export default function CompareLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mb-8">
        <div className="h-9 w-56 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      {/* Selector skeletons */}
      <div className="mb-8 flex flex-wrap gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 w-48 animate-pulse rounded-lg border border-border bg-card" />
        ))}
      </div>

      {/* Comparison table skeleton */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="h-12 bg-surface-dim" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-5">
            <div className="h-4 w-32 animate-pulse rounded bg-surface-high" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-4 w-24 animate-pulse rounded bg-surface-dim" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
