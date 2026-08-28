import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/alternates";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Terms" });
  return buildPageMetadata({
    locale,
    path: "/terms",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Terms" });

  // s7 is "Contact" — rendered in the highlighted box below with the real
  // email substituted, so it is not duplicated in the section list.
  const sections = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: t(`s${n}Title`),
    body: t(`s${n}Body`),
  }));

  return (
    <div className="container-page py-section-md">
      <header className="mx-auto max-w-3xl">
        <h1 className="font-display text-headline-xl text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </header>

      <div className="mx-auto mt-section-md max-w-3xl space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-headline-md text-foreground">
              {s.title}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </section>
        ))}

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-headline-md text-foreground">
            <Mail className="h-5 w-5 text-primary" aria-hidden />
            {t("contactTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {t("s7Body").replace("{email}", siteConfig.contact.email)}
          </p>
        </section>
      </div>
    </div>
  );
}
