import type { AppLocale } from "@/i18n/routing";
import { data } from "@/lib/data";
import { RelatedUniversities } from "./related";

/**
 * Async server component that loads related universities inside a Suspense
 * boundary. Related listings are the last section on the page — streaming
 * them means the rest of the page (reviews, FAQ) can render while these
 * resolve.
 */
export async function RelatedUniversitiesLoader({
  slug,
  locale,
  title,
}: {
  slug: string;
  locale: AppLocale;
  title: string;
}) {
  const related = await data.universities.getRelated(slug, 3);
  const listingMetadata = await data.universities.getListingMetadata(
    related.map((r) => r.id),
  );

  return (
    <RelatedUniversities
      title={title}
      locale={locale}
      universities={related}
      listingMetadata={listingMetadata}
    />
  );
}
