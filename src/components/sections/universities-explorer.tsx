"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import type {
  UniversityCardVM,
  CityOptionVM,
} from "@/lib/universities/view-model";
import { siteConfig } from "@/config/site";
import { itemListJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import {
  filterUniversityVMs,
  parseListingParams,
  sortUniversityVMs,
} from "@/lib/universities/listing-query";
import { UniversityFilters } from "@/components/sections/university-filters";
import { UniversitySortSelect } from "@/components/sections/university-sort-select";
import {
  UniversityCardView,
  type UniversityCardLabels,
} from "@/components/sections/university-card-view";

interface UniversitiesExplorerProps {
  locale: AppLocale;
  /** Projected per-locale card VMs (PERF §6.1) — filtered client-side. */
  items: UniversityCardVM[];
  /** Slim city options for the filter UI (id/slug/localized name). */
  cities: CityOptionVM[];
}

/**
 * The universities listing is a static page shell that ships the projected
 * view-models once; this client component reads the URL (useSearchParams) and
 * does all filtering/sorting with useMemo — filter changes never hit the
 * server. Must stay inside a <Suspense> boundary (see page) so the page can
 * be statically rendered.
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

  const listedItems = useMemo(
    () =>
      sortUniversityVMs(
        filterUniversityVMs(items, filters, cityIdBySlug),
        sort,
      ),
    [items, filters, sort, cityIdBySlug],
  );

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
          listedItems.map((vm) => ({
            name: vm.localName || vm.name,
            url: `${siteConfig.url}/${locale}/universities/${vm.slug}`,
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
 * reused by the explorer after hydration. Renders from projected VMs (§6.1).
 */
export function UniversityCardGrid({
  items,
  locale,
  labels,
  className,
}: {
  items: UniversityCardVM[];
  locale: AppLocale;
  labels: UniversityCardLabels;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className ?? ""}`}>
      {items.map((vm) => (
        <UniversityCardView
          key={vm.id}
          vm={vm}
          locale={locale}
          labels={labels}
        />
      ))}
    </div>
  );
}
