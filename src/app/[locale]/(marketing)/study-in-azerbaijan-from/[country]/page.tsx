import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plane, Banknote, MapPin } from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { UniversityCard } from "@/components/sections/university-card";
import { CTASection } from "@/components/sections/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CountryLanding" });

  return buildPageMetadata({
    locale,
    path: `/study-in-azerbaijan-from/${country}`,
    title: t("metaTitle", { country: country.charAt(0).toUpperCase() + country.slice(1) }),
    description: t("metaDescription", { country: country.charAt(0).toUpperCase() + country.slice(1) }),
  });
}

export default async function StudyInAzerbaijanFromCountry({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "CountryLanding" });

  const universities = await data.universities.list();

  const countryName = country.charAt(0).toUpperCase() + country.slice(1);

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("home"), url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/study-in-azerbaijan-from/${country}` },
        ])}
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
                  <p className="text-sm text-muted-foreground">{t("visaTitle")}</p>
                  <p className="font-semibold text-foreground">{t("visaBody", { country: countryName })}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("currencyTitle")}</p>
                  <p className="font-semibold text-foreground">{t("currencyBody", { country: countryName })}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("languageTitle")}</p>
                  <p className="font-semibold text-foreground">{t("languageBody")}</p>
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
            {universities.slice(0, 6).map((uni) => (
              <UniversityCard key={uni.id} university={uni} locale={appLocale} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
