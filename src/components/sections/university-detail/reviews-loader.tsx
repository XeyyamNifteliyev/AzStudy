import type { AppLocale } from "@/i18n/routing";
import { data } from "@/lib/data";
import { reviewJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { ReviewsSection } from "./reviews";

/**
 * Async server component that loads reviews for a university inside a
 * Suspense boundary. Keeping this fetch here lets the hero + above-the-fold
 * sections stream to the client first while reviews resolve.
 */
export async function ReviewsLoader({
  universityId,
  universityName,
  locale,
  title,
  emptyLabel,
}: {
  universityId: string;
  universityName: string;
  locale: AppLocale;
  title: string;
  emptyLabel: string;
}) {
  const [reviews, rating] = await Promise.all([
    data.reviews.byUniversity(universityId),
    data.universities.getRating(universityId),
  ]);

  return (
    <>
      {/* S2: self-serving Review markup is against Google guidelines — emit
          only when an independent review source is explicitly enabled. */}
      {process.env.NEXT_PUBLIC_ENABLE_REVIEW_JSONLD === "true" &&
      reviews.length > 0 ? (
        <JsonLd
          data={reviewJsonLd(reviews.slice(0, 5), locale, universityName)}
        />
      ) : null}
      <ReviewsSection
        title={title}
        emptyLabel={emptyLabel}
        rating={rating}
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          text: r.text[locale] ?? "",
          authorName: r.authorName,
          authorInitials: r.authorInitials,
          verified: r.verified,
          authorCountry: r.authorCountry,
          programStudied: r.programStudied[locale] ?? "",
        }))}
      />
    </>
  );
}
