import { Home as HomeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Section } from "./section";

export interface DormitoryRow {
  id: string;
  pricePerMonth: number;
  currency: "USD" | "AZN";
  capacity: number;
}

export function DormitoriesSection({
  title,
  emptyLabel,
  monthLabel,
  capacityLabel,
  dormitories,
  locale,
}: {
  title: string;
  emptyLabel: string;
  monthLabel: string;
  capacityLabel: string;
  dormitories: DormitoryRow[];
  locale: string;
}) {
  return (
    <Section title={title}>
      {dormitories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {dormitories.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
                  <HomeIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {formatCurrency(d.pricePerMonth, d.currency, locale)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {monthLabel}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {capacityLabel}: {formatNumber(d.capacity, locale)}
                  </p>
                </div>
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
