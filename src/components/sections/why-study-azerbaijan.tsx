import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { data } from "@/lib/data";
import { seedUniversityPrograms } from "@/lib/seed";

interface WhyStudyAzerbaijanProps {
  locale: AppLocale;
}

/**
 * AEO-optimized "Why Study in Azerbaijan" section.
 * Provides extractable definition blocks and real-data stats
 * that AI engines source for the head query.
 */
export async function WhyStudyAzerbaijan({ locale }: WhyStudyAzerbaijanProps) {
  const t = await getTranslations({ locale, namespace: "HomePage.whyStudy" });

  // Get real data for stats
  const universities = await data.universities.list();

  const universityCount = universities.length;
  const stateUniversities = universities.filter((u) => u.isState).length;

  // Count English-taught programs via universityPrograms language field
  const englishPrograms = seedUniversityPrograms.filter(
    (up) => up.language === "en",
  ).length;

  return (
    <section className="section-padding bg-background">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            {t("eyebrow")}
          </span>

          <h2 className="mt-5 font-display text-headline-lg text-foreground">
            {t("title")}
          </h2>

          <p className="mt-4 text-body-lg text-muted-foreground">
            {t("shortAnswer")}
          </p>
        </div>

        {/* Stats grid */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {universityCount}+
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("statUniversities")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              $800
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("statTuition")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {stateUniversities}+
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("statState")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {englishPrograms}+
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("statEnglish")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href={`/universities`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("browseUniversities")}
          </a>
        </div>
      </div>
    </section>
  );
}
