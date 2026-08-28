export default function ContactLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-9 w-56 animate-pulse rounded bg-surface-high" />
        <div className="mx-auto mt-4 h-5 w-72 animate-pulse rounded bg-surface-high" />
      </header>

      {/* Contact cards skeleton */}
      <div className="mx-auto mt-section-md grid max-w-4xl gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto h-11 w-11 animate-pulse rounded-md bg-surface-dim" />
            <div className="mt-4 mx-auto h-5 w-24 animate-pulse rounded bg-surface-high" />
            <div className="mt-2 mx-auto h-4 w-32 animate-pulse rounded bg-surface-dim" />
          </div>
        ))}
      </div>

      {/* Info cards skeleton */}
      <div className="mx-auto mt-section-md max-w-4xl grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="h-5 w-24 animate-pulse rounded bg-surface-high" />
          <div className="h-4 w-48 animate-pulse rounded bg-surface-dim" />
          <div className="h-5 w-20 animate-pulse rounded bg-surface-high" />
          <div className="h-4 w-32 animate-pulse rounded bg-surface-dim" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-7 w-48 animate-pulse rounded bg-surface-high" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface-dim" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
