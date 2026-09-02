import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Building2, GraduationCap, Wallet, ArrowRight } from "lucide-react";
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
import { JsonLd } from "@/components/seo/json-ld";
import { GeoBlock } from "@/components/seo/geo-block";
import { isGeoLocale } from "@/lib/seo/geo";
import { lx } from "@/lib/i18n/lx";
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

// ISR — content rarely changes; rebuild only every hour (or on-demand revalidation).
// No generateStaticParams: pages render on-demand (first visit) and are cached.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; city: string }>;
}): Promise<Metadata> {
  const { locale, category, city } = await params;
  setRequestLocale(locale);
  const result = await data.programs.getByCategoryAndCity(category, city);
  if (!result.category || !result.city) return {};
  const t = await getTranslations({ locale, namespace: "ProgramCombination" });
  const title = t("metaTitle", {
    category: result.category.name[locale as AppLocale] ?? "",
    city: result.city.name[locale as AppLocale] ?? "",
  });
  return buildPageMetadata({
    locale,
    path: `/programs/${category}/${city}`,
    title,
    description: t("metaDescription", {
      category: result.category.name[locale as AppLocale] ?? "",
      city: result.city.name[locale as AppLocale] ?? "",
    }),
  });
}

export default async function ProgramCombinationPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; city: string }>;
}) {
  const { locale, category, city } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "ProgramCombination" });
  const showGeo = isGeoLocale(locale);
  // Only load the Geo translator for supported locales — the Geo namespace
  // doesn't exist in the other 14 message files and getTranslations throws.
  const tg = showGeo
    ? await getTranslations({ locale, namespace: "Geo" })
    : null;

  const result = await data.programs.getByCategoryAndCity(category, city);
  if (!result.category || !result.city || result.programs.length === 0)
    notFound();

  const { category: cat, city: cityObj, programs } = result;
  const universities = Array.from(
    new Map(programs.map((p) => [p.university.id, p.university])).values(),
  );
  const universitiesMetadata = await data.universities.getListingMetadata(
    universities.map((u) => u.id),
  );
  const uniqueLanguages = [...new Set(programs.map((p) => p.language))]
    .map((l) => l.toUpperCase())
    .join(", ");
  const programShortAnswer = tg
    ? tg("programShortAnswer", {
        category: cat.name[appLocale] ?? "",
        city: cityObj.name[appLocale] ?? "",
      })
    : "";
  const whatIsQuestion = tg
    ? tg("whatIsProgramTitle", {
        category: cat.name[appLocale] ?? "",
        city: cityObj.name[appLocale] ?? "",
      })
    : "";
  const definitionFaq = tg
    ? [
        {
          id: "what-is-definition",
          entityType: "general" as const,
          entityId: `${category}-${city}`,
          question: {
            [appLocale]: whatIsQuestion,
          } as import("@/types").LocalizedString,
          answer: {
            [appLocale]: programShortAnswer,
          } as import("@/types").LocalizedString,
        },
      ]
    : [];

  const path = `/programs/${category}/${city}`;
  const title = t("title", {
    category: cat.name[appLocale] ?? "",
    city: cityObj.name[appLocale] ?? "",
  });

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
            programs.map((p) => ({
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
              city: cityObj.name[appLocale] ?? "",
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
              value={String(universities.length)}
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
            shortAnswer={tg("programShortAnswer", {
              category: cat.name[appLocale] ?? "",
              city: cityObj.name[appLocale] ?? "",
            })}
            summary={[
              { label: t("categoryLabel"), value: cat.name[appLocale] ?? "" },
              { label: t("cityLabel"), value: cityObj.name[appLocale] ?? "" },
              { label: t("programsLabel"), value: String(programs.length) },
              {
                label: t("universitiesLabel"),
                value: String(universities.length),
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
            {universities.map((u) => (
              <UniversityCard
                key={u.id}
                university={u}
                locale={appLocale}
                listingMetadata={universitiesMetadata.get(u.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <FaqSection locale={appLocale} />
      <CTASection />
    </div>
  );
}
