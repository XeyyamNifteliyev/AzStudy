import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export interface ApplyCtaProps {
  slug: string;
  minTuition: number | null;
  wa: string;
  applyTitle: string;
  tuitionFromLabel: string;
  yearLabel: string;
  applyCtaLabel: string;
  whatsappCtaLabel: string;
  applyNote: string;
  locale: string;
}

/** Sticky "apply now" sidebar on desktop. */
export function ApplySidebar({
  slug,
  minTuition,
  wa,
  applyTitle,
  tuitionFromLabel,
  yearLabel,
  applyCtaLabel,
  whatsappCtaLabel,
  applyNote,
  locale,
}: ApplyCtaProps) {
  return (
    <Card className="shadow-flat-hover">
      <CardHeader>
        <CardTitle className="text-base">{applyTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-surface-low p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {tuitionFromLabel}
          </p>
          <p className="font-display text-2xl font-bold text-primary tabular-nums">
            {minTuition ? formatCurrency(minTuition, "USD", locale) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">/ {yearLabel}</p>
        </div>
        <Button asChild variant="cta" className="w-full gap-2">
          <Link href={`/apply?university=${slug}`}>
            {applyCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {whatsappCtaLabel}
          </a>
        </Button>
        <p className="text-center text-xs text-muted-foreground">{applyNote}</p>
      </CardContent>
    </Card>
  );
}

/** Sticky bottom CTA on mobile. */
export function MobileApplyCta({
  slug,
  minTuition,
  tuitionFromLabel,
  yearLabel,
  applyCtaLabel,
  locale,
}: Omit<
  ApplyCtaProps,
  "wa" | "applyTitle" | "whatsappCtaLabel" | "applyNote"
>) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
      <div className="container-page flex items-center gap-3 pe-20">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{tuitionFromLabel}</p>
          <p className="font-display text-sm font-bold text-primary">
            {minTuition ? formatCurrency(minTuition, "USD", locale) : "—"}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / {yearLabel}
            </span>
          </p>
        </div>
        <Button asChild variant="cta" className="gap-2">
          <Link href={`/apply?university=${slug}`}>
            {applyCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
