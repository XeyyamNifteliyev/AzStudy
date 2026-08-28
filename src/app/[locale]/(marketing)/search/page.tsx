import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { SearchClient } from "@/components/sections/search-client";

// ISR — search results come from the live DB via the client; rebuild sparingly.
export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const [{ locale }, _sp] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "Search" });
  // Canonical/hreflang always point at the bare /search URL — every query
  // string would otherwise create its own canonical (duplicate content and a
  // crawl-budget sink). The query still drives the client-side results.
  return buildPageMetadata({
    locale,
    path: "/search",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const sp = await searchParams;

  return (
    <>
      <SearchClient initialQuery={(sp.q ?? "").trim()} />

      {/* StudyLeo-style Why Choose Us right above the footer. */}
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <WhyChooseUs locale={appLocale} />
      </Suspense>
    </>
  );
}
