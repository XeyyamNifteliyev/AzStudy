export default function BlogPostLoading() {
  return (
    <article aria-busy="true" aria-live="polite">
      <div className="container-page max-w-3xl py-section-md">
        {/* Back link skeleton */}
        <div className="h-5 w-24 animate-pulse rounded bg-surface-high" />

        {/* Title skeleton */}
        <div className="mt-6">
          <div className="h-5 w-20 animate-pulse rounded-full bg-surface-high" />
          <div className="mt-4 h-10 w-full max-w-lg animate-pulse rounded bg-surface-high" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-surface-high" />
          <div className="mt-4 flex gap-4">
            <div className="h-4 w-24 animate-pulse rounded bg-surface-dim" />
            <div className="h-4 w-32 animate-pulse rounded bg-surface-dim" />
            <div className="h-4 w-20 animate-pulse rounded bg-surface-dim" />
          </div>
        </div>

        {/* Cover image skeleton */}
        <div className="mt-8 aspect-[16/9] animate-pulse overflow-hidden rounded-lg border border-border bg-surface-dim" />

        {/* Content skeleton */}
        <div className="mt-8 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`animate-pulse rounded bg-surface-dim ${
                i % 5 === 0 ? "h-6 w-2/3" : "h-4 w-full"
              }`}
              style={{ width: i % 3 === 0 ? "85%" : undefined }}
            />
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="mt-12 h-32 animate-pulse rounded-lg border border-border bg-surface-dim" />
      </div>
    </article>
  );
}
