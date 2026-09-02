import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Building2,
  GraduationCap,
  Wallet,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import {
  breadcrumbJsonLd,
  courseListJsonLd,
  faqPageJsonLd,
} from "@/lib/seo/json-ld";
import { lx } from "@/lib/i18n/lx";
import { JsonLd } from "@/components/seo/json-ld";
import { GeoBlock } from "@/components/seo/geo-block";
import { isGeoLocale } from "@/lib/seo/geo";
import { UniversityCard } from "@/components/sections/university-card";
import { FaqSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";
import { annualTotalCost } from "@/lib/programs/costs";

// ISR — content rarely changes; rebuild every hour (or on-demand revalidation).
// No generateStaticParams: pages render on-demand (first visit) and are cached.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const result = await data.programs.getByCategory(category);
  if (!result.category || result.programs.length === 0) return {};
  const t = await getTranslations({ locale, namespace: "ProgramCategory" });
  const categoryName = result.category.name[locale as AppLocale] ?? "";
  return buildPageMetadata({
    locale,
    path: `/programs/${category}`,
    title: t("metaTitle", { category: categoryName }),
    description: t("metaDescription", {
      category: categoryName,
      count: String(result.universityCount),
    }),
  });
}

export default async function ProgramCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "ProgramCategory" });
  const showGeo = isGeoLocale(locale);
  const tg = showGeo
    ? await getTranslations({ locale, namespace: "Geo" })
    : null;

  const result = await data.programs.getByCategory(category);
  if (!result.category || result.programs.length === 0) notFound();

  const { category: cat, programs } = result;
  const universities = Array.from(
    new Map(programs.map((p) => [p.university.id, p.university])).values(),
  );
  const uniqueLanguages = result.uniqueLanguages
    .map((l) => l.toUpperCase())
    .join(", ");

  // Group programs by city for the "study in..." sections.
  const citiesById = new Map(programs.map((p) => [p.city.id, p.city]));
  const programsByCity = new Map<string, typeof programs>();
  for (const p of programs) {
    const list = programsByCity.get(p.city.id) ?? [];
    list.push(p);
    programsByCity.set(p.city.id, list);
  }

  const whatIsQuestion = tg
    ? tg("whatIsCategoryTitle", {
        category: cat.name[appLocale] ?? "",
      })
    : "";
  const programShortAnswer = tg
    ? tg("programShortAnswerNoCity", {
        category: cat.name[appLocale] ?? "",
      })
    : "";
  const definitionFaq = tg
    ? [
        {
          id: `what-is-${category}`,
          entityType: "general" as const,
          entityId: category,
          question: {
            [appLocale]: whatIsQuestion,
          } as import("@/types").LocalizedString,
          answer: {
            [appLocale]: programShortAnswer,
          } as import("@/types").LocalizedString,
        },
      ]
    : [];

  const path = `/programs/${category}`;
  const title = t("title", { category: cat.name[appLocale] ?? "" });

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("home"), url: `${siteConfig.url}/${locale}` },
            {
              name: t("programs"),
              url: `${siteConfig.url}/${locale}/programs`,
            },
            { name: title, url: `${siteConfig.url}/${locale}${path}` },
          ]),
          courseListJsonLd(
            programs.slice(0, 30).map((p) => ({
              name: `${p.name[appLocale]} â€” ${lx(p.university.nameI18n, appLocale)}`,
              url: `${siteConfig.url}/${locale}/universities/${p.university.slug}`,
              fee: p.tuitionFee,
              providerName: lx(p.university.nameI18n, appLocale),
            })),
            `${siteConfig.url}/${locale}${path}`,
          ),
          ...(showGeo
            ? [
                faqPageJsonLd(
                  definitionFaq,
                  appLocale,
                  `${siteConfig.url}/${locale}${path}`,
                ),
              ]
            : []),
        ]}
      />

      {/* Hero */}
      <section className="border-b border-border bg-surface-low">
        <div className="container-page py-section-md">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">
              {t("home")}
            </Link>
            <span>/</span>
            <Link href="/programs" className="hover:underline">
              {t("programs")}
            </Link>
          </div>
          <h1 className="mt-3 font-display text-headline-xl text-foreground">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("subtitle", {
              category: cat.name[appLocale] ?? "",
              count: String(programs.length),
            })}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={GraduationCap}
              label={t("programsLabel")}
              value={String(programs.length)}
            />
            <StatCard
              icon={Building2}
              label={t("universitiesLabel")}
              value={String(result.universityCount)}
            />
            <StatCard
              icon={Wallet}
              label={t("fromLabel")}
              value={formatCurrency(result.minTuitionUSD, "USD", locale)}
            />
          </div>
        </div>
      </section>

      <div className="container-page py-section-md">
        {/* GEO block — extractable short answer for AI engines (4 locales only) */}
        {showGeo && tg && (
          <GeoBlock
            locale={appLocale}
            shortAnswer={tg("programShortAnswerNoCity", {
              category: cat.name[appLocale] ?? "",
            })}
            summary={[
              { label: t("categoryLabel"), value: cat.name[appLocale] ?? "" },
              { label: t("programsLabel"), value: String(programs.length) },
              {
                label: t("universitiesLabel"),
                value: String(result.universityCount),
              },
              {
                label: t("fromLabel"),
                value: formatCurrency(result.minTuitionUSD, "USD", locale),
              },
              { label: t("language"), value: uniqueLanguages },
            ]}
            pros={[tg("pros1"), tg("pros2"), tg("pros3"), tg("pros4")]}
            cons={[tg("cons1"), tg("cons2")]}
            className="mb-section-md"
          />
        )}

        {/* AEO: "What is...?" definition block (4 GEO locales only) */}
        {showGeo && (
          <section className="mb-section-md rounded-lg border border-border bg-surface-low p-5 sm:p-6">
            <h2 className="mb-2 font-display text-headline-md text-foreground">
              {whatIsQuestion}
            </h2>
            <p className="text-sm leading-relaxed text-foreground sm:text-[15px]">
              {programShortAnswer}
            </p>
          </section>
        )}

        {/* City sections — each city has its own combination page */}
        <section className="mb-section-md">
          <h2 className="mb-4 font-display text-headline-md text-foreground">
            {t("citiesTitle", { category: cat.name[appLocale] ?? "" })}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...programsByCity.entries()].map(([cityId, cityPrograms]) => {
              const city = citiesById.get(cityId)!;
              const cityUniversities = new Set(
                cityPrograms.map((p) => p.university.id),
              ).size;
              const cityMin = Math.min(
                ...cityPrograms.map((p) => p.tuitionFee),
              );
              return (
                <Link
                  key={cityId}
                  href={`/programs/${category}/${city.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-flat-hover"
                >
                  <div>
                    <p className="flex items-center gap-1.5 font-display font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {city.name[appLocale] ?? city.slug}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("universitiesInCity", {
                        count: String(cityUniversities),
                      })}
                      {" · "}
                      {t("from")} {formatCurrency(cityMin, "USD", locale)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Programs table */}
        <section className="mb-section-md">
          <h2 className="mb-4 font-display text-headline-md text-foreground">
            {t("programsTitle")}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("programName")}</TableHead>
                  <TableHead>{t("university")}</TableHead>
                  <TableHead>{t("city")}</TableHead>
                  <TableHead>{t("degree")}</TableHead>
                  <TableHead>{t("language")}</TableHead>
                  <TableHead className="text-right">{t("tuition")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((p) => (
                  <TableRow key={`${p.id}-${p.university.id}`}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/universities/${p.university.slug}`}
                        className="text-primary hover:underline"
                      >
                        {p.name[appLocale]}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lx(p.university.nameI18n, appLocale)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.city.name[appLocale] ?? p.city.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {t(`degrees.${p.degreeLevel}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="uppercase">{p.language}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-foreground">
                      {formatCurrency(p.tuitionFee, "USD", locale)}
                      {p.originalFee && p.originalFee > p.tuitionFee && (
                        <span className="ms-1.5 text-xs font-normal text-muted-foreground line-through">
                          {formatCurrency(p.originalFee, "USD", locale)}
                        </span>
                      )}
                      <span className="block text-xs font-normal text-muted-foreground">
                        / year
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Universities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-headline-md text-foreground">
              {t("universitiesTitle")}
            </h2>
            <Link
              href="/universities"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => {
              const uniPrograms = programs.filter(
                (p) => p.university.id === u.id,
              );
              const uniMinTuition = uniPrograms.length
                ? Math.min(...uniPrograms.map((p) => p.tuitionFee))
                : 0;
              const uniCity = uniPrograms[0]?.city;
              const annualCost =
                uniCity?.monthlyLivingCostUSD != null
                  ? annualTotalCost(uniMinTuition, uniCity.monthlyLivingCostUSD)
                  : null;
              return (
                <UniversityCard
                  key={u.id}
                  university={u}
                  locale={appLocale}
                  minTuition={uniMinTuition || undefined}
                  footer={
                    annualCost != null ? (
                      <div className="mt-3 flex items-center justify-between rounded-md bg-surface-low px-3 py-2 text-xs">
                        <span className="text-muted-foreground">
                          {t("annualCost")}
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(annualCost, "USD", locale)}
                        </span>
                      </div>
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      </div>

      <FaqSection locale={appLocale} />
      <CTASection />
    </div>
  );
}
