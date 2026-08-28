import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "./section";

export interface ScholarshipRow {
  id: string;
  name: string;
  percentage: number;
  requirements: string;
}

export function ScholarshipsSection({
  title,
  emptyLabel,
  scholarships,
}: {
  title: string;
  emptyLabel: string;
  scholarships: ScholarshipRow[];
}) {
  return (
    <Section title={title}>
      {scholarships.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {scholarships.map((s) => (
            <Card key={s.id}>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">
                    {s.name}
                  </h3>
                  <Badge variant="cta">{s.percentage}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {s.requirements}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </Section>
  );
}
