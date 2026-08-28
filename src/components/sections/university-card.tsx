import type { University } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import type { UniversityListingMetadata } from "@/lib/data/repositories";
import { data } from "@/lib/data";
import {
  UniversityCardView,
  type UniversityCardLabels,
} from "@/components/sections/university-card-view";

interface UniversityCardProps {
  university: University;
  locale: AppLocale;
  priority?: boolean;
  minTuition?: number;
  /** List price — when > minTuition, render it strikethrough next to the fee. */
  originalFee?: number;
  listingMetadata?: UniversityListingMetadata;
  labels?: UniversityCardLabels;
  footer?: React.ReactNode;
}

/**
 * Server wrapper for the university card. Resolves card metadata from the
 * batched `listingMetadata` map when provided, otherwise falls back to a
 * per-card lookup (C7). Client components that already hold resolved metadata
 * should render `UniversityCardView` directly instead (Phase 2).
 */
export async function UniversityCard({
  university,
  locale,
  priority,
  minTuition: suppliedMinTuition,
  originalFee: suppliedOriginalFee,
  listingMetadata,
  labels,
  footer,
}: UniversityCardProps) {
  const [city, minTuition, originalFee, rating, count] = listingMetadata
    ? [
        listingMetadata.city,
        suppliedMinTuition ?? listingMetadata.minTuitionUSD,
        suppliedOriginalFee ?? listingMetadata.originalFeeUSD,
        listingMetadata.rating,
        listingMetadata.count,
      ]
    : // C7: batch the per-card metadata into one query (getListingMetadata)
      // instead of three separate calls (city + minTuition + rating).
      await data.universities.getListingMetadata([university.id]).then((m) => {
        const meta = m.get(university.id);
        return [
          meta?.city ?? null,
          suppliedMinTuition ?? meta?.minTuitionUSD,
          suppliedOriginalFee ?? meta?.originalFeeUSD,
          meta?.rating ?? 0,
          meta?.count ?? 0,
        ] as const;
      });

  return (
    <UniversityCardView
      university={university}
      locale={locale}
      priority={priority}
      city={city}
      minTuition={minTuition}
      originalFee={originalFee}
      rating={rating}
      count={count}
      labels={labels}
      footer={footer}
    />
  );
}
