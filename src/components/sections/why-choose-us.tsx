import { getTranslations } from "next-intl/server";
import { GraduationCap, FileCheck, Award, Coins, CheckCircle, Gift } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";

interface WhyChooseUsProps {
  locale: AppLocale;
}

const cards = [
  {
    icon: Award,
    gradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    titleKey: "scholarshipsTitle",
    bodyKey: "scholarshipsBody",
  },
  {
    icon: FileCheck,
    gradient: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    titleKey: "freeApplicationTitle",
    bodyKey: "freeApplicationBody",
  },
  {
    icon: GraduationCap,
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    titleKey: "admissionTitle",
    bodyKey: "admissionBody",
  },
  {
    icon: Coins,
    gradient: "from-rose-500/10 to-rose-600/5",
    iconColor: "text-rose-600",
    titleKey: "cheapestTitle",
    bodyKey: "cheapestBody",
  },
  {
    icon: CheckCircle,
    gradient: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600",
    titleKey: "acceptanceTitle",
    bodyKey: "acceptanceBody",
  },
  {
    icon: Gift,
    gradient: "from-cyan-500/10 to-cyan-600/5",
    iconColor: "text-cyan-600",
    titleKey: "freeTitle",
    bodyKey: "freeBody",
  },
] as const;

export async function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const t = await getTranslations({ locale, namespace: "HomePage.whyUs" });

  return (
    <section className="section-padding bg-surface-low">
      <div className="container-page">
        <p className="text-center font-display text-sm font-semibold uppercase tracking-wide text-cta">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-center font-display text-headline-xl text-foreground">
          {t("title")}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {cards.map((card) => {
            const title = t(card.titleKey);
            const Icon = card.icon;
            return (
              <article
                key={title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                
                <div className="relative">
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-3`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(card.bodyKey)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
