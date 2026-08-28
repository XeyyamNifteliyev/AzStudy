// src/components/ui/stat-card.tsx
// Shared 3-column stat block used on listing headers (programs category/city).
// Consolidates the previously-duplicated StatCard definitions (M16).
export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 font-display text-2xl font-bold text-foreground tabular-nums">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
