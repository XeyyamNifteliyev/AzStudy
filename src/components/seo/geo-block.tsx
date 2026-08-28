import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { isGeoLocale } from "@/lib/seo/geo";
import type { AppLocale } from "@/i18n/routing";

/**
 * GEO (Generative Engine Optimization) block — the "extractable" section that
 * AI answer engines (ChatGPT, Gemini, Perplexity) source when answering
 * questions like "How much does it cost to study medicine in Istanbul?".
 *
 * Three parts (all optional so callers pick what fits):
 * 1. Short-answer paragraph (40-60 words, direct answer to the page's core question).
 * 2. Quick-glance summary table (key facts in a scannable grid).
 * 3. Pros & cons list (balanced, builds trust + gives the AI model structured data).
 *
 * The `Geo` i18n namespace backing this block is translated into 4 locales
 * (en/tr/az/ru). In any other locale the component renders nothing so no
 * `MISSING_MESSAGE` error is raised.
 */
export function GeoBlock({
  locale,
  shortAnswer,
  summary,
  pros,
  cons,
  className,
}: {
  locale: AppLocale;
  shortAnswer?: string;
  summary?: Array<{ label: string; value: string }>;
  pros?: string[];
  cons?: string[];
  className?: string;
}) {
  // Guard: Geo content is only available for a subset of locales.
  if (!isGeoLocale(locale)) return null;

  const hasProsCons = (pros?.length ?? 0) > 0 || (cons?.length ?? 0) > 0;
  if (!shortAnswer && !summary?.length && !hasProsCons) return null;

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface-low p-5 sm:p-6",
        className,
      )}
      aria-label="Quick summary"
    >
      {shortAnswer && (
        <p className="text-sm leading-relaxed text-foreground sm:text-base">
          {shortAnswer}
        </p>
      )}

      {summary && summary.length > 0 && (
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline justify-between gap-2 border-b border-border/50 py-1"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {hasProsCons && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pros && pros.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-verified">
                Pros
              </p>
              <ul className="space-y-1.5">
                {pros.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verified" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons && cons.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-destructive">
                Cons
              </p>
              <ul className="space-y-1.5">
                {cons.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
