import type { AppLocale } from "@/i18n/routing";
import { GeoBlock } from "@/components/seo/geo-block";

export interface GeoBlocksProps {
  locale: AppLocale;
  shortAnswer: string;
  whatIsQuestion: string;
  summary: Array<{ label: string; value: string }>;
  pros: string[];
  cons: string[];
}

/**
 * AI-extractable blocks: the GEO short answer (with fact summary, pros/cons)
 * and the "What is…?" definition paragraph. Both render only when the active
 * locale has GEO content (gated by the caller).
 */
export function UniversityGeoBlocks({
  locale,
  shortAnswer,
  whatIsQuestion,
  summary,
  pros,
  cons,
}: GeoBlocksProps) {
  return (
    <>
      <GeoBlock
        locale={locale}
        shortAnswer={shortAnswer}
        summary={summary}
        pros={pros}
        cons={cons}
      />
      <section className="rounded-lg border border-border bg-surface-low p-5 sm:p-6">
        <h2 className="mb-2 font-display text-headline-md text-foreground">
          {whatIsQuestion}
        </h2>
        <p className="text-sm leading-relaxed text-foreground sm:text-[15px]">
          {shortAnswer}
        </p>
      </section>
    </>
  );
}
