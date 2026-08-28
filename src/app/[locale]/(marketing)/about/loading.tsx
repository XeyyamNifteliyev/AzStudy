export default function AboutLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-9 w-64 animate-pulse rounded bg-surface-high" />
        <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-surface-high" />
      </header>

      {/* Content skeleton */}
      <section className="mx-auto mt-section-md max-w-3xl space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-dim" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-dim" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-dim" />
      </section>

      {/* Values skeleton */}
      <section className="mt-section-lg">
        <div className="mb-8 flex justify-center">
          <div className="h-7 w-48 animate-pulse rounded bg-surface-high" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-11 w-11 animate-pulse rounded-md bg-surface-dim" />
              <div className="mt-4 h-5 w-32 animate-pulse rounded bg-surface-high" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-surface-dim" />
              <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-surface-dim" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
