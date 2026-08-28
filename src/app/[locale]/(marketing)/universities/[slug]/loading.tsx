export default function UniversityDetailLoading() {
  return (
    <article className="pb-28 md:pb-0" aria-busy="true" aria-live="polite">
      {/* Hero skeleton */}
      <div className="relative h-[28rem] w-full animate-pulse bg-surface-dim">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="container-page relative flex h-full items-end pb-10">
          <div className="space-y-3">
            <div className="h-12 w-72 max-w-full animate-pulse rounded-lg bg-surface-high" />
            <div className="h-5 w-48 animate-pulse rounded bg-surface-high" />
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-surface-high" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface-high" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page layout-sticky-sidebar py-section-md">
        <div className="space-y-12">
          {/* Quick facts skeleton */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-surface-high" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 h-8 w-8 animate-pulse rounded bg-surface-dim" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-high" />
                  <div className="mt-1 h-5 w-20 animate-pulse rounded bg-surface-high" />
                </div>
              ))}
            </div>
          </div>

          {/* About skeleton */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-surface-high" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-dim" />
            </div>
          </div>

          {/* Programs skeleton */}
          <div>
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-surface-high" />
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="h-10 bg-surface-dim" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-4">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-high" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-high" />
                  <div className="h-4 w-12 animate-pulse rounded bg-surface-high" />
                  <div className="ms-auto h-6 w-20 animate-pulse rounded bg-surface-high" />
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships skeleton */}
          <div>
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-surface-high" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="h-5 w-1/3 animate-pulse rounded bg-surface-high" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-dim" />
                </div>
              ))}
            </div>
          </div>

          {/* Dormitories skeleton */}
          <div>
            <div className="mb-4 h-6 w-36 animate-pulse rounded bg-surface-high" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          </div>

          {/* Gallery skeleton */}
          <div>
            <div className="mb-4 h-6 w-28 animate-pulse rounded bg-surface-high" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-video animate-pulse rounded-xl bg-surface-dim" />
              ))}
            </div>
          </div>

          {/* Reviews skeleton */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-surface-high" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-surface-dim" />
              ))}
            </div>
          </div>

          {/* FAQ skeleton */}
          <div>
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-surface-high" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-dim" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-surface-high" />
            <div className="h-5 w-24 animate-pulse rounded bg-surface-dim" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-primary/20" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-surface-dim" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
          </div>
        </aside>
      </div>
    </article>
  );
}
