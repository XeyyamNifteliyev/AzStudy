export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-low to-background">
        <div className="container-page relative grid items-center gap-10 py-section-md lg:grid-cols-2 lg:py-section-lg">
          <div className="space-y-5">
            <div className="h-6 w-40 animate-pulse rounded-full bg-surface-high" />
            <div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-surface-high" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-surface-high" />
            <div className="h-5 w-full max-w-lg animate-pulse rounded bg-surface-dim" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface-dim" />
            <div className="mt-4 flex max-w-lg gap-2">
              <div className="h-12 flex-1 animate-pulse rounded-lg border border-border bg-card" />
              <div className="h-12 w-28 animate-pulse rounded-lg bg-primary/20" />
            </div>
            <div className="mt-6 flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-28 animate-pulse rounded bg-surface-dim" />
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-[4/5] animate-pulse rounded-xl bg-surface-dim" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <div className="section-padding h-40" />

      {/* Why Study skeleton */}
      <div className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto h-8 w-72 animate-pulse rounded bg-surface-high" />
            <div className="mx-auto mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-surface-dim" />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-dim" />
                <div className="mt-4 h-5 w-32 animate-pulse rounded bg-surface-high" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-surface-dim" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="section-padding">
        <div className="container-page">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mx-auto h-8 w-56 animate-pulse rounded bg-surface-high" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        </div>
      </div>

      {/* Featured universities skeleton */}
      <div className="section-padding">
        <div className="container-page">
          <div className="mb-8">
            <div className="h-8 w-56 animate-pulse rounded bg-surface-high" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        </div>
      </div>

      {/* Blog skeleton */}
      <div className="section-padding">
        <div className="container-page">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-surface-high" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[16/9] animate-pulse bg-surface-dim" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-full animate-pulse rounded bg-surface-high" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-dim" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="section-padding">
        <div className="container-page">
          <div className="h-48 animate-pulse rounded-xl bg-surface-dim" />
        </div>
      </div>
    </div>
  );
}
