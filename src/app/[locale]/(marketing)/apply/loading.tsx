export default function ApplyLoading() {
  return (
    <div className="container-page py-section-md" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <header className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-9 w-56 animate-pulse rounded bg-surface-high" />
        <div className="mx-auto mt-4 h-5 w-80 animate-pulse rounded bg-surface-high" />
      </header>

      {/* Form skeleton */}
      <div className="mx-auto mt-section-md max-w-2xl rounded-xl border border-border bg-card p-8">
        <div className="space-y-6">
          {/* Form fields */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-surface-high" />
              <div className="h-11 w-full animate-pulse rounded-lg border border-border bg-surface-dim" />
            </div>
          ))}
          {/* Select field */}
          <div>
            <div className="mb-2 h-4 w-32 animate-pulse rounded bg-surface-high" />
            <div className="h-11 w-full animate-pulse rounded-lg border border-border bg-surface-dim" />
          </div>
          {/* Textarea */}
          <div>
            <div className="mb-2 h-4 w-20 animate-pulse rounded bg-surface-high" />
            <div className="h-28 w-full animate-pulse rounded-lg border border-border bg-surface-dim" />
          </div>
          {/* Submit button */}
          <div className="h-12 w-full animate-pulse rounded-lg bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
