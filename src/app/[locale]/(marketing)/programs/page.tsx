import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GraduationCap, MapPin, SearchX } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { formatCurrency } from "@/lib/utils";
import { isSvgUrl } from "@/lib/images/is-svg";
import { lx } from "@/lib/i18n/lx";
import { ProgramFilters } from "@/components/sections/program-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseProgramListingQuery } from "@/lib/programs/listing-query";
import {
  getCachedCities,
  getCachedProgramCategories,
  getCachedProgramListingPage,
} from "@/lib/programs/listing-data";

const PER_PAGE = 10;

// ISR — catalog content rarely changes; rebuild hourly. No generateStaticParams:
// pages render on-demand (first visit) and are cached, so `next build` works
// without a reachable DB (Vercel build has none). Pagination count is resolved
// at request time via listPage.
export const revalidate = 3600;

function buildPageHref(
  targetPage: number,
  query: { search?: string; category?: string; city?: string; sort?: string },
) {
  const params = new URLSearchParams();
  if (targetPage > 1) params.set("page", String(targetPage));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.city) params.set("city", query.city);
  if (query.sort && query.sort !== "relevance") params.set("sort", query.sort);
  const qs = params.toString();
  return qs ? `/programs?${qs}` : "/programs";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ProgramsIndex" });
  const page = Math.max(1, Number(sp.page) || 1);
  return buildPageMetadata({
    locale,
    path: page > 1 ? `/programs?page=${page}` : "/programs",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "ProgramsIndex" });

  const query = parseProgramListingQuery(sp);
  const page = Math.max(1, Number(sp.page) || 1);
  const filters = {
    ...(query.category ? { category: query.category } : {}),
    ...(query.city ? { city: query.city } : {}),
    ...(query.search ? { search: query.search } : {}),
  };

  // PERF: categories/cities/listing are data-cached (unstable_cache) — repeat
  // requests render without Postgres round-trips. Same pattern as universities.
  const [categories, cities, listing] = await Promise.all([
    getCachedProgramCategories(),
    getCachedCities(),
    getCachedProgramListingPage(page, PER_PAGE, filters),
  ]);
  const listedPrograms = listing.programs;

  return (
    <div className="container-page py-section-md">
      <header className="mb-8">
        <h1 className="font-display text-headline-xl text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
        <Suspense
          fallback={
            <div className="hidden h-[28rem] animate-pulse rounded-lg border border-border bg-card p-5 lg:block" />
          }
        >
          <ProgramFilters
            locale={appLocale}
            categories={categories}
            cities={cities}
            labels={{
              filtersTitle: t("filters"),
              search: t("searchPlaceholder"),
              category: t("category"),
              allCategories: t("allCategories"),
              city: t("city"),
              allCities: t("allCities"),
              reset: t("reset"),
              close: t("close"),
              activeFilters: t("activeFilters"),
            }}
          />
        </Suspense>
        <main>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("results", { count: listing.total })}</span>
          </div>

          {listedPrograms.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("university")}</TableHead>
                    <TableHead>{t("programName")}</TableHead>
                    <TableHead>{t("degree")}</TableHead>
                    <TableHead>{t("city")}</TableHead>
                    <TableHead>{t("language")}</TableHead>
                    <TableHead className="text-right">{t("tuition")}</TableHead>
                    <TableHead className="text-right">
                      <span className="sr-only">Apply</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listedPrograms.map((p) => (
                    <TableRow
                      key={`${p.id}-${p.university.id}`}
                      className="hover:bg-surface-low/60"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
                            {p.university.logoImage ? (
                              <Image
                                src={p.university.logoImage}
                                alt={`${lx(p.university.nameI18n, appLocale)} logo`}
                                width={32}
                                height={32}
                                unoptimized={isSvgUrl(p.university.logoImage)}
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-xs font-bold text-primary">
                                {p.university.logoText}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/universities/${p.university.slug}`}
                            className="max-w-[12rem] font-medium text-foreground hover:underline"
                          >
                            {lx(p.university.nameI18n, appLocale)}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {p.name[appLocale] ?? p.slug}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {t(`degrees.${p.degreeLevel}`)}
                        </Badge>
                        <span className="ms-1 text-xs text-muted-foreground">
                          · {p.durationYears}y
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {p.city.name[appLocale] ?? p.city.slug}
                        </span>
                      </TableCell>
                      <TableCell className="uppercase">{p.language}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(p.tuitionFee, "USD", locale)}
                        </span>
                        {p.originalFee && p.originalFee > p.tuitionFee && (
                          <span className="ms-1.5 text-xs text-muted-foreground line-through">
                            {formatCurrency(p.originalFee, "USD", locale)}
                          </span>
                        )}
                        <span className="block text-xs font-normal text-muted-foreground">
                          / year
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="cta">
                          <Link href="/apply">Apply now</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" />
              <GraduationCap className="mt-2 h-6 w-6 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold text-foreground">
                {t("emptyTitle")}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {t("emptySubtitle")}
              </p>
            </div>
          )}

          {listing.totalPages > 1 && (
            <nav
              className="mt-6 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {page > 1 && (
                <Link
                  href={buildPageHref(page - 1, query)}
                  className="rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-low"
                >
                  ← {t("prev")}
                </Link>
              )}
              <span className="px-3 py-2 text-sm text-muted-foreground">
                {t("pageOf", { page, total: listing.totalPages })}
              </span>
              {page < listing.totalPages && (
                <Link
                  href={buildPageHref(page + 1, query)}
                  className="rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-low"
                >
                  {t("next")} →
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
