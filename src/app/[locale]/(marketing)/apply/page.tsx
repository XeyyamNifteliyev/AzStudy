import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, Clock, Headset } from "lucide-react";
import { data } from "@/lib/data";
import { siteConfig } from "@/config/site";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { serviceJsonLd, howToJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { isGeoLocale } from "@/lib/seo/geo";

// P2: split react-hook-form + zod out of the initial bundle — the form is the
// only consumer of those deps, so lazy-loading it keeps them off the critical
// path while SSR still renders the form HTML (default ssr:true).
const ApplyForm = dynamic(() =>
  import("@/components/sections/apply-form").then((m) => m.ApplyForm),
);

// PERF/SEO: ISR so the university/program options stay current.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Apply" });
  return buildPageMetadata({
    locale,
    path: "/apply",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Apply" });
  const sp = await searchParams;
  const universitySlug =
    typeof sp.university === "string" ? sp.university : undefined;
  const showGeo = isGeoLocale(locale);
  // Only load the Geo translator for supported locales — the Geo namespace
  // doesn't exist in the other 14 message files and getTranslations throws.
  const tg = showGeo
    ? await getTranslations({ locale, namespace: "Geo" })
    : null;
  const [countries, universities, programs] = await Promise.all([
    data.countries.list(),
    data.universities.list(),
    data.programs.list(),
  ]);

  // F3: minimize the payload sent to the client — the form only needs
  // id/slug/name (+ degreeLevel/universityId for the program select).
  const universityOptions = universities.map((u) => ({
    id: u.id,
    slug: u.slug,
    name: u.name,
    nameI18n: u.nameI18n,
  }));
  const programOptions = programs.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    degreeLevel: p.degreeLevel,
  }));

  const howToSteps = tg
    ? [
        { name: tg("step1Name"), text: tg("step1Text") },
        { name: tg("step2Name"), text: tg("step2Text") },
        { name: tg("step3Name"), text: tg("step3Text") },
        { name: tg("step4Name"), text: tg("step4Text") },
        { name: tg("step5Name"), text: tg("step5Text") },
      ]
    : [];

  const trust = [
    { icon: ShieldCheck, label: t("trust1") },
    { icon: Clock, label: t("trust2") },
    { icon: Headset, label: t("trust3") },
  ];

  return (
    <div className="container-page py-section-md">
      <JsonLd
        data={[
          serviceJsonLd(appLocale),
          ...(showGeo && tg
            ? [
                howToJsonLd(howToSteps, {
                  name: tg("howToApplyTitle"),
                  pageUrl: `${siteConfig.url}/${locale}/apply`,
                }),
              ]
            : []),
        ]}
      />
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="font-display text-headline-xl text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {trust.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* AEO: How to apply — step-by-step guide (4 GEO locales only) */}
        {showGeo && tg && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-headline-md text-foreground">
              {tg("howToApplyTitle")}
            </h2>
            <ol className="space-y-4">
              {howToSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.name}</p>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <ApplyForm
          locale={appLocale}
          countries={countries}
          universities={universityOptions}
          programs={programOptions}
          universitySlug={universitySlug}
        />
      </div>
    </div>
  );
}
