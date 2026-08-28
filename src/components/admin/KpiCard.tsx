// src/components/admin/KpiCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function KpiCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'cta' | 'tertiary' | 'verified';
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            'mt-2 font-display text-3xl font-bold tabular-nums',
            tone === 'cta' && 'text-cta-container',
            tone === 'tertiary' && 'text-tertiary-container',
            tone === 'verified' && 'text-verified',
            tone === 'default' && 'text-foreground',
          )}
        >
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
