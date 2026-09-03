import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plane, Banknote, MapPin } from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig, fullyTranslatedLocales } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { UniversityCard } from "@/components/sections/university-card";
import { CTASection } from "@/components/sections/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { seedCountries } from "@/lib/seed/countries";
import { lx } from "@/lib/i18n/lx";
import { getCountryFaqTemplate, fillFaq } from "@/lib/seo/country-faq";
import { faqPageJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 3600;

const countryBySlug = new Map(seedCountries.map((c) => [c.slug, c] as const));

// Every valid slug is pre-rendered once per locale. Unknown slugs are
// rejected at the routing layer with a real 404 (dynamicParams = false) —
// notFound() in a streamed render would otherwise return HTTP 200 (soft-404).
export const dynamicParams = false;

export function generateStaticParams() {
  return fullyTranslatedLocales.flatMap((locale) =>
    seedCountries.map((c) => ({ locale, country: c.slug })),
  );
}

/**
 * Deterministic per-country selection of universities.
 *
 * All 140+ country pages previously rendered the SAME first 6 universities,
 * which is a doorway pattern (near-duplicate pages differing only by the
 * country token). Instead we rotate a stable, ranking-first ordering by a
 * hash of the country slug, so every page surfaces a different subset while
 * each individual page keeps a sensible, deterministic set (featured schools
 * always come first). Hand-curating 143 markets isn't maintainable; this
 * removes the exact-duplicate risk with one small function.
 */
function universitySubset<T>(
  universities: T[],
  country: string,
  count = 6,
): T[] {
  let hash = 0;
  for (let i = 0; i < country.length; i++) {
    hash = (hash * 31 + country.charCodeAt(i)) >>> 0;
  }
  if (universities.length <= count) return universities.slice(0, count);
  const start = hash % universities.length;
  const rotated = [
    ...universities.slice(start),
    ...universities.slice(0, start),
  ];
  return rotated.slice(0, count);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  const countryData = countryBySlug.get(country);
  if (!countryData) return {};
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CountryLanding" });
  const countryName = lx(countryData.name, locale as AppLocale);

  return buildPageMetadata({
    locale,
    path: `/study-in-azerbaijan-from/${country}`,
    title: t("metaTitle", { country: countryName }),
    description: t("metaDescription", { country: countryName }),
  });
}

export default async function StudyInAzerbaijanFromCountry({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const countryData = countryBySlug.get(country);
  if (!countryData) notFound();
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "CountryLanding" });

  const universities = await data.universities.list();

  const countryName = lx(countryData.name, appLocale);

  const pageUrl = `${siteConfig.url}/${locale}/study-in-azerbaijan-from/${country}`;

  const subset = universitySubset(universities, country);
  const uniNames = subset
    .slice(0, 3)
    .map((u) => lx(u.nameI18n ?? {}, appLocale) || u.name)
    .join(", ");

  // AEO: FAQ block built from the same data as the FAQPage JSON-LD below,
  // so what AI engines extract always matches the visible content.
  const faqT = getCountryFaqTemplate(appLocale);
  const faqVars = { country: countryName, unis: uniNames };
  // Visible copy (rendered in the details blocks)…
  const faqItems = [
    { question: fillFaq(faqT.q1, faqVars), answer: fillFaq(faqT.a1, faqVars) },
    { question: fillFaq(faqT.q2, faqVars), answer: fillFaq(faqT.a2, faqVars) },
    { question: fillFaq(faqT.q3, faqVars), answer: fillFaq(faqT.a3, faqVars) },
  ];
  // …and the FAQPage JSON-LD mirrors it exactly.
  const faqs = faqItems.map((f, i) => ({
    id: `country-${country}-faq-${i + 1}`,
    entityType: "general" as const,
    entityId: country,
    question: { [appLocale]: f.question },
    answer: { [appLocale]: f.answer },
  }));

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("home"), url: `${siteConfig.url}/${locale}` },
            { name: t("title"), url: pageUrl },
          ]),
          faqPageJsonLd(faqs, appLocale, pageUrl),
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-section-md">
        <div className="container-page">
          <Badge variant="tertiary" className="mb-4">
            {t("hubLabel")} {countryName}
          </Badge>
          <h1 className="font-display text-headline-xl text-foreground">
            {t("title", { country: countryName })}
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            {t("subtitle", { country: countryName })}
          </p>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("visaTitle")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {t("visaBody", { country: countryName })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("currencyTitle")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {t("currencyBody", { country: countryName })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("languageTitle")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {t("languageBody")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="section-padding bg-surface-low">
        <div className="container-page">
          <h2 className="font-display text-headline-lg text-foreground mb-8">
            {t("popularTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subset.map((uni) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                locale={appLocale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — extractable answer blocks for AI engines (matches JSON-LD). */}
      <section className="section-padding bg-background">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="font-display text-headline-lg text-foreground mb-8 text-center">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details
                key={f.question}
                className="group rounded-lg border border-border bg-card p-5 open:shadow-flat-hover"
              >
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span
                      aria-hidden
                      className="text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
