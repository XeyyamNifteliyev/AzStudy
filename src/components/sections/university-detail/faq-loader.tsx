import type { AppLocale } from "@/i18n/routing";
import { data } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { faqPageJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { UniversityFaqSection } from "./faq";

/**
 * Async server component that loads the FAQ pairs for a university inside a
 * Suspense boundary. FAQ answers are the most-cited AEO/GEO content on the
 * page, but they are below the fold — streaming them lets the page paint
 * faster without delaying above-the-fold content.
 */
export async function UniversityFaqLoader({
  universityId,
  slug,
  locale,
  title,
  definitionFaq = [],
}: {
  universityId: string;
  slug: string;
  locale: AppLocale;
  title: string;
  // GEO "what is…?" definition pair emitted on GEO locales — folded into the
  // FAQPage markup so the definition stays citable.
  definitionFaq?: import("@/types").Faq[];
}) {
  const [uniFaqs, generalFaqs] = await Promise.all([
    data.faqs.byUniversity(universityId),
    data.faqs.general(),
  ]);
  const faqs = [...uniFaqs, ...generalFaqs].slice(0, 8);

  return (
    <>
      <JsonLd
        data={faqPageJsonLd(
          [...definitionFaq, ...faqs],
          locale,
          `${siteConfig.url}/${locale}/universities/${slug}`,
        )}
      />
      <UniversityFaqSection
        title={title}
        faqs={faqs.map((f) => ({
          id: f.id,
          question: f.question[locale] ?? "",
          answer: f.answer[locale] ?? "",
        }))}
      />
    </>
  );
}
