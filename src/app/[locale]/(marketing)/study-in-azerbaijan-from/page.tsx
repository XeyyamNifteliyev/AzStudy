import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Globe2 } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig, fullyTranslatedLocales } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { seedCountries } from "@/lib/seed/countries";
import { lx } from "@/lib/i18n/lx";
import { CTASection } from "@/components/sections/cta-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600;

export function generateStaticParams() {
  return fullyTranslatedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CountryHub" });

  return buildPageMetadata({
    locale,
    path: "/study-in-azerbaijan-from",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function StudyInAzerbaijanFromHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "CountryHub" });

  const countries = [...seedCountries].sort((a, b) =>
    lx(a.name, appLocale).localeCompare(lx(b.name, appLocale)),
  );

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("home"), url: `${siteConfig.url}/${locale}` },
          {
            name: t("breadcrumbLabel"),
            url: `${siteConfig.url}/${locale}/study-in-azerbaijan-from`,
          },
        ])}
      />

      <section className="relative bg-gradient-to-b from-primary/5 to-background py-section-md">
        <div className="container-page">
          <Badge variant="tertiary" className="mb-4">
            <Globe2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {t("breadcrumbLabel")}
          </Badge>
          <h1 className="font-display text-headline-xl text-foreground">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-page">
          <p className="mb-8 max-w-3xl text-body-md text-muted-foreground">
            {t("intro")}
          </p>
          <h2 className="font-display text-headline-lg text-foreground mb-8">
            {t("countriesHeading")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/${locale}/study-in-azerbaijan-from/${country.slug}`}
                className="group"
              >
                <Card className="h-full transition-shadow hover:shadow-flat-hover">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="text-2xl" aria-hidden>
                      {country.flag}
                    </span>
                    <span className="font-medium text-foreground group-hover:text-primary">
                      {t("breadcrumbLabel")} {lx(country.name, appLocale)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
