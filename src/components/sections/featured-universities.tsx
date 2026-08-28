import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { data } from "@/lib/data";
import { lx } from "@/lib/i18n/lx";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  FeaturedUniversitiesCarousel,
  type FeaturedUniversityCardData,
} from "./featured-universities-carousel";

interface FeaturedUniversitiesProps {
  locale: AppLocale;
}

export async function FeaturedUniversities({
  locale,
}: FeaturedUniversitiesProps) {
  const t = await getTranslations("HomePage.featured");

  // The exact set of state universities the site highlights — in this order.
  const FEATURED_SLUGS = [
    "baku-state-university",
    "azerbaijan-diplomatic-academy",
    "azerbaijan-medical-university",
    "ganja-state-university",
    "nakhchivan-medical-university",
    "azerbaijan-state-university-economics",
    "khazar-university",
    "baku-engineering-university",
    "azerbaijan-state-pedagogical-university",
    "western-university",
    "lankaran-state-university",
    "mingachevir-state-university",
  ];

  const all = await data.universities.list();
  const metadata = await data.universities.getListingMetadata(
    all.map((u) => u.id),
  );
  const bySlug = new Map(all.map((u) => [u.slug, u]));
  const featured = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (u): u is NonNullable<typeof u> => Boolean(u),
  );

  const cards: FeaturedUniversityCardData[] = featured.map((u) => {
    const meta = metadata.get(u.id);
    return {
      id: u.id,
      slug: u.slug,
      name: lx(u.nameI18n, locale),
      nameI18n: u.nameI18n,
      logoText: u.logoText,
      heroImage: u.heroImage,
      cityName: meta?.city?.name[locale] ?? "",
      rating: meta?.rating ?? 0,
      reviewCount: meta?.count ?? 0,
      foundedYear: u.foundedYear,
      studentCount: u.studentCount,
      isState: u.isState,
    };
  });

  return (
    <section className="section-padding bg-surface-low">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
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
            href="/universities"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <FeaturedUniversitiesCarousel
          cards={cards}
          labels={{
            applyNow: t("applyNow"),
            state: t("state"),
            private: t("private"),
            verified: t("verified"),
            prev: t("prev"),
            next: t("next"),
            azerbaijan: t("azerbaijan"),
            students: t("students"),
          }}
        />
      </div>
    </section>
  );
}
