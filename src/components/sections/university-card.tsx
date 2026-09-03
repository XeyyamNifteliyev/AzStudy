import type { AppLocale } from "@/i18n/routing";
import type { UniversityListingMetadata } from "@/lib/data/repositories";
import { data } from "@/lib/data";
import { toUniversityCardVMFromParts } from "@/lib/universities/view-model";
import {
  UniversityCardView,
  type UniversityCardLabels,
} from "@/components/sections/university-card-view";

interface UniversityCardProps {
  university: import("@/types").University;
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
 * per-card lookup (C7). Projects the full university + metadata into the
 * per-locale card view-model before rendering (PERF §6.1).
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

  const vm = toUniversityCardVMFromParts(
    university,
    city
      ? {
          city,
          minTuitionUSD: minTuition,
          originalFeeUSD: originalFee,
          rating,
          count,
          degreeLevels: listingMetadata?.degreeLevels ?? [],
        }
      : null,
    { minTuitionUSD: minTuition, originalFeeUSD: originalFee },
    locale,
  );

  return (
    <UniversityCardView
      vm={vm}
      locale={locale}
      priority={priority}
      labels={labels}
      footer={footer}
    />
  );
}
