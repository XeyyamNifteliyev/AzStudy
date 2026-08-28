import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  CalendarDays,
  Users,
  Trophy,
  ShieldCheck,
  Languages,
  GraduationCap,
} from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { siteConfig, isThinUniversityLocale } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { collegeOrUniversityJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { isGeoLocale } from "@/lib/seo/geo";
import { lx } from "@/lib/i18n/lx";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { UniversityHero } from "@/components/sections/university-detail/hero";
import { UniversityGeoBlocks } from "@/components/sections/university-detail/geo-blocks";
import { QuickFacts } from "@/components/sections/university-detail/quick-facts";
import { AboutSection } from "@/components/sections/university-detail/about";
import { ProgramsSection } from "@/components/sections/university-detail/programs";
import { ScholarshipsSection } from "@/components/sections/university-detail/scholarships";
import { DormitoriesSection } from "@/components/sections/university-detail/dormitories";
import { GallerySection } from "@/components/sections/university-detail/gallery";
import { ReviewsLoader } from "@/components/sections/university-detail/reviews-loader";
import { UniversityFaqLoader } from "@/components/sections/university-detail/faq-loader";
import { RelatedUniversitiesLoader } from "@/components/sections/university-detail/related-loader";
import {
  ApplySidebar,
  MobileApplyCta,
} from "@/components/sections/university-detail/apply-cta";

// Streaming fallbacks for the below-the-fold Suspense boundaries. Each keeps
// the section's vertical space so the page does not reflow when content lands.
function ReviewsFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-hidden>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-2xl bg-surface-dim"
        />
      ))}
    </div>
  );
}

function FaqFallback() {
  return (
    <div className="space-y-3" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-dim" />
      ))}
    </div>
  );
}

function RelatedFallback() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-2xl bg-surface-dim"
        />
      ))}
    </div>
  );
}

// ISR — content rarely changes; rebuild only every hour (or on-demand revalidation).
// SE-5/P2: pre-render the featured universities at build time so their first
// visit (and Google's first crawl) is a static cache hit instead of a cold SSR
// + DB round-trip. Non-featured slugs still render on-demand and are cached.
export const revalidate = 3600;

export async function generateStaticParams() {
  const universities = await data.universities.list();
  const featured = universities.filter((u) => u.featured).slice(0, 30);
  return routing.locales.flatMap((locale) =>
    featured.map((u) => ({ locale, slug: u.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const university = await data.universities.getBySlug(slug);
  if (!university) return {};
  const t = await getTranslations({ locale, namespace: "UniversityDetail" });
  // s.md 3.2: thin-content locale-lar üçün noindex — hreflang-a zərər
  // vurmadan, axtarış motorlarını bu səhifələri indeksləməməyə çağırırıq.
  const hasDescription = !!university.description[locale as keyof typeof university.description];
  const thinLocale = isThinUniversityLocale(locale);

  return buildPageMetadata({
    locale,
    path: `/universities/${slug}`,
    title: t("metaTitle", { name: lx(university.nameI18n, locale) }),
    description: t("metaDescription", { name: lx(university.nameI18n, locale) }),
    image: university.heroImage,
    // Thin locale: noindex, follow (sitemap/hreflang poisoned deyil,
    // amma bu səhifələr indekslənməməlidir)
    noIndex: thinLocale && !hasDescription,
  });
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "UniversityDetail" });
  const showGeo = isGeoLocale(locale);
  const tg = showGeo
    ? await getTranslations({ locale, namespace: "Geo" })
    : null;

  const detail = await data.universities.getDetail(slug);
  if (!detail) notFound();

  // PERF: only above-the-fold data (rating for the hero, tuition for the
  // apply sidebar) is awaited here. Reviews, FAQ and related universities load
  // inside Suspense boundaries below (reviews-loader / faq-loader /
  // related-loader) so the page streams instead of blocking on all of them.
  const [rating, minTuition] = await Promise.all([
    data.universities.getRating(detail.id),
    data.universities.getMinTuitionUSD(detail.id),
  ]);

  const city = detail.city;
  const languagesLabel = detail.languages
    .map((l) => l.toUpperCase())
    .join(" / ");
  const tuitionLabel = minTuition
    ? formatCurrency(minTuition, "USD", locale)
    : "—";
  const typeLabel = detail.isState ? t("typeState") : t("typePrivate");

  const uniShortAnswer = tg
    ? tg("universityShortAnswer", {
        name: lx(detail.nameI18n, appLocale),
        type: typeLabel,
        city: city?.name[appLocale] ?? "",
        year: detail.foundedYear,
        languages: detail.languages.map((l) => l.toUpperCase()).join(", "),
        tuition: tuitionLabel,
        accreditation: detail.accreditation,
        students: formatNumber(detail.studentCount, locale),
      })
    : "";
  const whatIsQuestion = tg
    ? tg("whatIsUniversityTitle", { name: lx(detail.nameI18n, appLocale) })
    : "";
  const definitionFaq = tg
    ? [
        {
          id: "what-is-definition",
          entityType: "general" as const,
          entityId: detail.id,
          question: {
            [appLocale]: whatIsQuestion,
          } as import("@/types").LocalizedString,
          answer: {
            [appLocale]: uniShortAnswer,
          } as import("@/types").LocalizedString,
        },
      ]
    : [];

  const wa = `https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(
    `Hello, I'm interested in ${lx(detail.nameI18n, appLocale)}`,
  )}`;

  const facts = [
    {
      icon: CalendarDays,
      label: t("founded"),
      value: String(detail.foundedYear),
    },
    {
      icon: Users,
      label: t("students"),
      value: formatNumber(detail.studentCount, locale),
    },
    { icon: Trophy, label: t("ranking"), value: `#${detail.ranking}` },
    {
      icon: ShieldCheck,
      label: t("accreditation"),
      value: detail.accreditation,
    },
    { icon: Languages, label: t("languages"), value: languagesLabel },
    { icon: GraduationCap, label: t("type"), value: typeLabel },
  ];

  return (
    <article className="pb-28 md:pb-0">
      <JsonLd
        data={[
          collegeOrUniversityJsonLd(detail, appLocale, rating),
          breadcrumbJsonLd([
            { name: t("home"), url: `${siteConfig.url}/${locale}` },
            {
              name: t("universities"),
              url: `${siteConfig.url}/${locale}/universities`,
            },
            {
              name: lx(detail.nameI18n, appLocale),
              url: `${siteConfig.url}/${locale}/universities/${slug}`,
            },
          ]),
        ]}
      />

      {/* 1. Hero */}
      <UniversityHero
        name={lx(detail.nameI18n, appLocale)}
        heroImage={detail.heroImage}
        logoImage={detail.logoImage}
        logoText={detail.logoText}
        isState={detail.isState}
        accreditation={detail.accreditation}
        cityName={city?.name[appLocale]}
        rating={rating}
        typeState={t("typeState")}
        typePrivate={t("typePrivate")}
        reviewsLabel={t("reviews")}
        homeLabel={t("home")}
        universitiesLabel={t("universities")}
      />

      <div className="container-page layout-sticky-sidebar pb-section-lg">
        <div className="space-y-12">
          {/* 1b+1c. GEO short answer + "What is…?" definition (GEO locales) */}
          {showGeo && tg && (
            <UniversityGeoBlocks
              locale={appLocale}
              shortAnswer={uniShortAnswer}
              whatIsQuestion={whatIsQuestion}
              summary={[
                { label: t("founded"), value: String(detail.foundedYear) },
                {
                  label: t("students"),
                  value: formatNumber(detail.studentCount, locale),
                },
                ...(city
                  ? [{ label: t("city"), value: city.name[appLocale] ?? "" }]
                  : []),
                { label: t("type"), value: typeLabel },
                { label: t("languages"), value: languagesLabel },
                ...(minTuition
                  ? [{ label: t("tuitionFrom"), value: tuitionLabel }]
                  : []),
                { label: t("accreditation"), value: detail.accreditation },
              ]}
              pros={[tg("pros1"), tg("pros2"), tg("pros3"), tg("pros4")]}
              cons={[tg("cons1"), tg("cons2")]}
            />
          )}

          {/* 2. Quick facts */}
          <QuickFacts title={t("factsTitle")} facts={facts} />

          {/* About */}
          <AboutSection
            title={t("aboutTitle")}
            description={
              // s.md 3.2: thin locale → EN fallback
              detail.description[appLocale] ?? detail.description["en"] ?? ""
            }
          />

          {/* 3+5. Programs & tuition */}
          <ProgramsSection
            title={t("programsTitle")}
            programNameLabel={t("programName")}
            degreeLabel={t("degree")}
            languageLabel={t("language")}
            durationLabel={t("duration")}
            tuitionLabel={t("tuition")}
            yearLabel={t("year")}
            yearsLabel={t("years")}
            emptyLabel={t("programsNone")}
            locale={appLocale}
            programs={detail.programs.map((up) => ({
              id: up.id,
              name: up.program.name[appLocale] ?? "",
              degreeLabel: t(`degrees.${up.program.degreeLevel}`),
              language: up.language,
              durationYears: up.program.durationYears,
              tuitionFee: up.tuitionFee,
              currency: up.currency,
            }))}
          />

          {/* 4. Scholarships */}
          <ScholarshipsSection
            title={t("scholarshipsTitle")}
            emptyLabel={t("scholarshipsNone")}
            scholarships={detail.scholarships.map((s) => ({
              id: s.id,
              name: s.name[appLocale] ?? "",
              percentage: s.percentage,
              requirements: s.requirements[appLocale] ?? "",
            }))}
          />

          {/* 6. Dormitory */}
          <DormitoriesSection
            title={t("dormitoryTitle")}
            emptyLabel={t("dormitoryNone")}
            monthLabel={t("month")}
            capacityLabel={t("capacity")}
            locale={locale}
            dormitories={detail.dormitories.map((d) => ({
              id: d.id,
              pricePerMonth: d.pricePerMonth,
              currency: d.currency,
              capacity: d.capacity,
            }))}
          />

          {/* 7. Gallery */}
          <GallerySection
            title={t("galleryTitle")}
            name={lx(detail.nameI18n, appLocale)}
            images={detail.gallery}
          />

          {/* 8. Reviews — streamed */}
          <Suspense fallback={<ReviewsFallback />}>
            <ReviewsLoader
              universityId={detail.id}
              universityName={lx(detail.nameI18n, appLocale)}
              locale={appLocale}
              title={t("reviewsTitle")}
              emptyLabel={t("reviewsNone")}
            />
          </Suspense>

          {/* 9. FAQ — streamed */}
          <Suspense fallback={<FaqFallback />}>
            <UniversityFaqLoader
              universityId={detail.id}
              slug={slug}
              locale={appLocale}
              title={t("faqTitle")}
              definitionFaq={definitionFaq}
            />
          </Suspense>

          {/* 10. Related — streamed */}
          <Suspense fallback={<RelatedFallback />}>
            <RelatedUniversitiesLoader
              slug={slug}
              locale={appLocale}
              title={t("relatedTitle")}
            />
          </Suspense>
        </div>

        {/* Sticky apply sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <ApplySidebar
            slug={slug}
            minTuition={minTuition}
            wa={wa}
            applyTitle={t("applyTitle")}
            tuitionFromLabel={t("tuitionFrom")}
            yearLabel={t("year")}
            applyCtaLabel={t("applyCta")}
            whatsappCtaLabel={t("whatsappCta")}
            applyNote={t("applyNote")}
            locale={locale}
          />
        </aside>
      </div>

      {/* 11. Sticky mobile CTA */}
      <MobileApplyCta
        slug={slug}
        minTuition={minTuition}
        tuitionFromLabel={t("tuitionFrom")}
        yearLabel={t("year")}
        applyCtaLabel={t("applyCta")}
        locale={locale}
      />
    </article>
  );
}
