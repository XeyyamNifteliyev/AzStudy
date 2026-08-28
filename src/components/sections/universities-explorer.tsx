"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import type { City } from "@/types";
import type { UniversityListingItem } from "@/lib/data/repositories";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { itemListJsonLd } from "@/lib/seo/json-ld";
import { lx } from "@/lib/i18n/lx";
import { JsonLd } from "@/components/seo/json-ld";
import {
  filterUniversityItems,
  parseListingParams,
  sortUniversities,
} from "@/lib/universities/listing-query";
import { UniversityFilters } from "@/components/sections/university-filters";
import { UniversitySortSelect } from "@/components/sections/university-sort-select";
import {
  UniversityCardView,
  type UniversityCardLabels,
} from "@/components/sections/university-card-view";

interface UniversitiesExplorerProps {
  locale: AppLocale;
  /** Full listing payload (all universities + card metadata) — filtered client-side. */
  items: UniversityListingItem[];
  cities: City[];
}

/**
 * Phase 2: the universities listing is a static page shell that ships the full
 * dataset once; this client component reads the URL (useSearchParams) and does
 * all filtering/sorting with useMemo — filter changes never hit the server.
 * Must stay inside a <Suspense> boundary (see page) so the page can be
 * statically rendered.
 */
export function UniversitiesExplorer({
  locale,
  items,
  cities,
}: UniversitiesExplorerProps) {
  const t = useTranslations("UniversitiesPage");
  const searchParams = useSearchParams();

  const { filters, sort } = useMemo(
    () => parseListingParams(searchParams),
    [searchParams],
  );

  const cityIdBySlug = useMemo(
    () => Object.fromEntries(cities.map((c) => [c.slug, c.id])),
    [cities],
  );

  const tuitionByUniversity = useMemo(
    () =>
      new Map(
        items
          .filter((item) => item.metadata.minTuitionUSD !== undefined)
          .map(
            (item) =>
              [item.university.id, item.metadata.minTuitionUSD!] as const,
          ),
      ),
    [items],
  );

  const listedItems = useMemo(() => {
    const filtered = filterUniversityItems(items, filters, cityIdBySlug, locale);
    const order = sortUniversities(
      filtered.map((item) => item.university),
      sort,
      tuitionByUniversity,
      locale,
    );
    const byId = new Map(
      filtered.map((item) => [item.university.id, item] as const),
    );
    return order
      .map((university) => byId.get(university.id))
      .filter((item): item is UniversityListingItem => item !== undefined);
  }, [items, filters, sort, cityIdBySlug, tuitionByUniversity, locale]);

  const filterLabels = {
    filtersTitle: t("filters"),
    search: t("searchPlaceholder"),
    city: t("city"),
    allCities: t("allCities"),
    degree: t("degree"),
    allDegrees: t("allDegrees"),
    language: t("language"),
    allLanguages: t("allLanguages"),
    english: t("english"),
    turkish: t("turkish"),
    type: t("type"),
    allTypes: t("allTypes"),
    state: t("state"),
    private: t("private"),
    bachelor: t("bachelor"),
    master: t("master"),
    phd: t("phd"),
    associate: t("associate"),
    reset: t("reset"),
    close: t("close"),
    clearAll: t("clearAll"),
    maxTuition: t("maxTuition"),
    activeFilters: t("activeFilters"),
  };
  const sortLabels = {
    sort: t("sort"),
    relevance: t("sortRelevance"),
    name: t("sortName"),
    tuition: t("sortTuition"),
    ranking: t("sortRanking"),
  };
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

  const listUrl = `${siteConfig.url}/${locale}/universities${
    searchParams.size ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
      {/* ItemList mirrors the currently visible (filtered/sorted) set so
          filtered URLs carry accurate structured data after hydration. */}
      <JsonLd
        data={itemListJsonLd(
          listedItems.map(({ university }) => ({
            name: lx(university.nameI18n, locale),
            url: `${siteConfig.url}/${locale}/universities/${university.slug}`,
          })),
          listUrl,
        )}
      />
      <UniversityFilters
        locale={locale}
        cities={cities}
        labels={filterLabels}
      />

      <main>
        <div className="text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{t("results", { count: listedItems.length })}</span>
            <UniversitySortSelect
              locale={locale}
              value={sort}
              labels={sortLabels}
            />
          </div>
        </div>

        {listedItems.length > 0 ? (
          <UniversityCardGrid
            items={listedItems}
            locale={locale}
            labels={cardLabels}
            className="mt-4"
          />
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {t("emptySubtitle")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Static university card grid — rendered as the Suspense fallback during
 * prerender so the cached HTML contains the full list (no-JS/SEO safe) and
 * reused by the explorer after hydration.
 */
export function UniversityCardGrid({
  items,
  locale,
  labels,
  className,
}: {
  items: UniversityListingItem[];
  locale: AppLocale;
  labels: UniversityCardLabels;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className ?? ""}`}>
      {items.map((item) => (
        <UniversityCardView
          key={item.university.id}
          university={item.university}
          locale={locale}
          city={item.metadata.city}
          minTuition={item.metadata.minTuitionUSD}
          originalFee={item.metadata.originalFeeUSD}
          rating={item.metadata.rating}
          count={item.metadata.count}
          labels={labels}
        />
      ))}
    </div>
  );
}
