import type { LucideIcon } from "lucide-react";
import { Section } from "./section";

export interface QuickFact {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function QuickFacts({
  title,
  facts,
}: {
  title: string;
  facts: QuickFact[];
}) {
  return (
    <Section title={title}>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="bg-card p-4">
            <f.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
              {f.label}
            </p>
            <p className="font-display font-semibold text-foreground">
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
