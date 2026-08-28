export default function BlogLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mb-10">
        <div className="h-9 w-48 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      {/* Blog cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[16/9] animate-pulse bg-surface-dim" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-20 animate-pulse rounded-full bg-surface-high" />
              <div className="h-5 w-full animate-pulse rounded bg-surface-high" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-dim" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-20 animate-pulse rounded bg-surface-dim" />
                <div className="h-4 w-16 animate-pulse rounded bg-surface-high" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
