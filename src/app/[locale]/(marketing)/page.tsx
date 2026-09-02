import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { data } from "@/lib/data";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WhyStudyAzerbaijan } from "@/components/sections/why-study-azerbaijan";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CategorySection } from "@/components/sections/category-section";
import { FeaturedUniversities } from "@/components/sections/featured-universities";
import { UniversityLogoMarquee } from "@/components/sections/university-logo-marquee";
import { BlogCarouselSection } from "@/components/sections/blog-carousel-section";
import { SuccessStories } from "@/components/sections/success-stories";
import { FaqSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

// P1: the calculator is below the fold and client-only (Radix Select) — split
// it out so its JS only loads when the section hydrates.
const CostCalculator = dynamic(() =>
  import("@/components/sections/cost-calculator").then((m) => m.CostCalculator),
);

// PERF/SEO: rebuild the homepage on an interval so new universities/programs/
// stats appear without a redeploy, while keeping it ISR-cached (fast TTFB +
// freshness signal for crawlers). Shorter than detail pages — highest traffic.
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.home" });
  return buildPageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;

  // Real university count for the hero stat badge (kept out of the featured
  // section's own fetch; the page is ISR-cached so this runs once per revalidate).
  const universityCount = (await data.universities.list()).length;

  return (
    <>
      <HeroSection universityCount={universityCount} locale={appLocale} />
      {/* PERF(P2): stream below-the-fold async sections so a slow DB read on
          one section never blocks the Hero (LCP) from flushing to the browser. */}
      <Suspense fallback={<div className="h-40" aria-hidden />}>
        <StatsSection locale={appLocale} />
      </Suspense>
      {/* AEO: extractable "why study in Azerbaijan" definition + real-data stats —
          the self-contained answer block AI engines source for the head query. */}
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <WhyStudyAzerbaijan locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-64" aria-hidden />}>
        <CategorySection locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="h-40" aria-hidden />}>
        <UniversityLogoMarquee locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <FeaturedUniversities locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <CostCalculator />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-64" aria-hidden />}>
        <SuccessStories locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <BlogCarouselSection locale={appLocale} />
      </Suspense>
      <Suspense fallback={<div className="section-padding h-64" aria-hidden />}>
        <FaqSection locale={appLocale} />
      </Suspense>
      {/* "Why Choose Us" sits right above the final CTA. */}
      <Suspense fallback={<div className="section-padding h-96" aria-hidden />}>
        <WhyChooseUs locale={appLocale} />
      </Suspense>
      <CTASection />
    </>
  );
}
