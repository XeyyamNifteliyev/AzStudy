import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BlogCarousel } from "./blog-carousel";

interface BlogCarouselSectionProps {
  locale: AppLocale;
}

// The DB holds some shared/mismatched cover images, so every post that appears
// in the carousel is mapped to its own unique local cover file.
const UNIQUE_COVERS: Record<string, string> = {
  "how-to-apply-to-azerbaijani-universities":
    "/images/blog/apply-azerbaijan.webp",
  "top-universities-in-baku": "/images/blog/baku-universities.webp",
  "education-in-azerbaijan-language": "/images/blog/azerbaijani-language.webp",
  "cost-of-living-in-azerbaijan": "/images/blog/cost-of-living.webp",
  "scholarships-in-azerbaijan": "/images/blog/scholarships.webp",
  "why-study-in-azerbaijan": "/images/blog/why-azerbaijan.webp",
  "top-10-must-visit-places-in-azerbaijan": "/images/blog/why-azerbaijan.webp",
  "student-life-in-baku-azerbaijan": "/images/blog/baku-universities.webp",
  "best-universities-medicine-azerbaijan": "/images/blog/apply-azerbaijan.webp",
  "azerbaijan-best-budget-study-destination":
    "/images/blog/cost-of-living.webp",
  "azerbaijani-culture-traditions-guide":
    "/images/blog/azerbaijani-language.webp",
  "azerbaijan-weather-climate-students": "/images/blog/why-azerbaijan.webp",
  "best-day-trips-from-baku": "/images/blog/why-azerbaijan.webp",
  "azerbaijan-vs-turkey-study-abroad": "/images/blog/baku-universities.webp",
  "student-visa-azerbaijan-complete-guide":
    "/images/blog/apply-azerbaijan.webp",
  "top-engineering-programs-azerbaijan":
    "/images/blog/azerbaijani-language.webp",
};

export async function BlogCarouselSection({
  locale,
}: BlogCarouselSectionProps) {
  const t = await getTranslations({ locale, namespace: "HomePage.blog" });

  const posts = await data.blog.listSummaries();
  if (posts.length === 0) return null;

  // Only show posts that have their own unique cover (8 curated posts) so no
  // two cards share the same image.
  const items = posts
    .filter((p) => UNIQUE_COVERS[p.slug])
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      coverImage: UNIQUE_COVERS[p.slug],
      readingMinutes: p.readingMinutes,
    }));

  return (
    <section className="section-padding bg-surface-low">
      <div className="container-page">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-cta">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-display text-headline-xl text-foreground">
              {t("title")}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <BlogCarousel
          items={items}
          locale={locale}
          labels={{
            // minRead is intentionally NOT passed here: it is an ICU message
            // (`{min} min read`) that must be formatted with the variable, so
            // the client carousel reads it via useTranslations. Calling
            // `t("minRead")` server-side without `{ min }` throws a
            // FORMATTING_ERROR on every render.
            readMore: t("readMore"),
            prev: t("prev"),
            next: t("next"),
          }}
        />
      </div>
    </section>
  );
}
