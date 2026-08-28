import type { AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Section } from "./section";

export interface ProgramRow {
  id: string;
  name: string;
  degreeLabel: string;
  language: string;
  durationYears: number;
  tuitionFee: number;
  currency: "USD" | "AZN";
}

export function ProgramsSection({
  title,
  programNameLabel,
  degreeLabel,
  languageLabel,
  durationLabel,
  tuitionLabel,
  yearLabel,
  yearsLabel,
  emptyLabel,
  programs,
  locale,
}: {
  title: string;
  programNameLabel: string;
  degreeLabel: string;
  languageLabel: string;
  durationLabel: string;
  tuitionLabel: string;
  yearLabel: string;
  yearsLabel: string;
  emptyLabel: string;
  programs: ProgramRow[];
  locale: AppLocale;
}) {
  return (
    <Section title={title}>
      {programs.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{programNameLabel}</TableHead>
                <TableHead>{degreeLabel}</TableHead>
                <TableHead>{languageLabel}</TableHead>
                <TableHead>{durationLabel}</TableHead>
                <TableHead className="text-right">{tuitionLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.degreeLabel}</Badge>
                  </TableCell>
                  <TableCell className="uppercase">{p.language}</TableCell>
                  <TableCell>
                    {p.durationYears} {yearsLabel}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatCurrency(p.tuitionFee, p.currency, locale)}
                    <span className="block text-xs font-normal text-muted-foreground">
                      /{yearLabel}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </Section>
  );
}
