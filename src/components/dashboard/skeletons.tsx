// Shared dashboard loading skeletons. Used by loading.tsx route segments so
// every dashboard navigation shows instant feedback (title bar + content
// blocks pulsing) instead of a frozen screen while the server renders.

/** Generic dashboard page: heading + a stack of card-like blocks. */
export function DashboardPageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-8 w-56 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface-high" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-44 animate-pulse rounded bg-surface-high" />
                <div className="h-3 w-28 animate-pulse rounded bg-surface-high" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-surface-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** KPI grid + rows (admin overview style). */
export function DashboardStatsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-8 w-56 max-w-full animate-pulse rounded bg-surface-high" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-surface-high" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-high" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-surface-high" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-high" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-36 animate-pulse rounded bg-surface-high" />
              <div className="h-3 flex-1 animate-pulse rounded-full bg-surface-high" />
              <div className="h-4 w-8 animate-pulse rounded bg-surface-high" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Table pages (admin users/applications style). */
export function DashboardTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-8 w-56 max-w-full animate-pulse rounded bg-surface-high" />
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-4 border-b border-border px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-3 flex-1 animate-pulse rounded bg-surface-high"
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="h-4 flex-1 animate-pulse rounded bg-surface-high" />
            <div className="h-4 flex-1 animate-pulse rounded bg-surface-high" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-surface-high" />
            <div className="h-8 w-24 animate-pulse rounded bg-surface-high" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Chat/messages thread. */
export function DashboardMessagesSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="h-8 w-48 max-w-full animate-pulse rounded bg-surface-high" />
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-5 w-40 animate-pulse rounded bg-surface-high" />
        </div>
        <div className="space-y-3 p-4">
          <div className="max-w-[80%] space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-high" />
            <div className="h-14 animate-pulse rounded-lg bg-surface-high" />
          </div>
          <div className="ml-auto max-w-[70%] space-y-2">
            <div className="ml-auto h-3 w-16 animate-pulse rounded bg-surface-high" />
            <div className="ml-auto h-10 w-3/4 animate-pulse rounded-lg bg-surface-high" />
          </div>
          <div className="max-w-[75%] space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-high" />
            <div className="h-12 animate-pulse rounded-lg bg-surface-high" />
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-surface-high" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-surface-high" />
          </div>
        </div>
      </div>
    </div>
  );
}
