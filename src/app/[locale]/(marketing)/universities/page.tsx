import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { collectionPageJsonLd } from "@/lib/seo/json-ld";
import { lx } from "@/lib/i18n/lx";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getCachedCities,
  getCachedUniversityListing,
} from "@/lib/universities/listing-data";
import {
  UniversitiesExplorer,
  UniversityCardGrid,
} from "@/components/sections/universities-explorer";
import type { UniversityCardLabels } from "@/components/sections/university-card-view";

// PERF (Phase 2): the page shell is statically rendered — it no longer reads
// searchParams. The full dataset ships once in the RSC payload and the client
// explorer filters/sorts instantly (useMemo). ISR rebuilds the shell hourly.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "UniversitiesPage" });
  return buildPageMetadata({
    locale,
    path: "/universities",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "UniversitiesPage" });

  // Full listing in one round trip (listWithMetadata) — every filter/sort
  // combination is derived client-side from this payload.
  const [items, cities] = await Promise.all([
    getCachedUniversityListing({}),
    getCachedCities(),
  ]);

  const cardLabels: UniversityCardLabels = {
    verified: t("verified"),
    state: t("state"),
    private: t("private"),
    azerbaijan: t("azerbaijan"),
    from: t("from"),
    tuition: t("tuition"),
    rank: t("rank"),
    founded: t("founded"),
  };

  return (
    <div className="container-page py-section-md">
      {/* CollectionPage describes the listing itself; the ItemList for the
          currently visible (filtered) set is rendered by the explorer so it
          stays accurate per URL. */}
      <JsonLd
        data={collectionPageJsonLd(
          t("title"),
          `${siteConfig.url}/${locale}/universities`,
          items.map(({ university }) => ({
            name: lx(university.nameI18n, appLocale),
            url: `${siteConfig.url}/${locale}/universities/${university.slug}`,
          })),
        )}
      />
      <header className="mb-8">
        <h1 className="font-display text-headline-xl text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* The explorer uses useSearchParams, so it must sit behind a Suspense
          boundary for the page to stay static. The fallback renders the FULL
          card grid, so the cached HTML contains the complete listing (SEO /
          no-JS safe) instead of a skeleton. */}
      <Suspense
        fallback={
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
            <div className="hidden h-[28rem] animate-pulse rounded-lg border border-border bg-card p-5 lg:block" />
            <main>
              <div className="text-sm text-muted-foreground">
                <span>{t("results", { count: items.length })}</span>
              </div>
              <UniversityCardGrid
                items={items}
                locale={appLocale}
                labels={cardLabels}
                className="mt-4"
              />
            </main>
          </div>
        }
      >
        <UniversitiesExplorer
          locale={appLocale}
          items={items}
          cities={cities}
        />
      </Suspense>
    </div>
  );
}
