import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Target, HeartHandshake, Globe2, Award } from 'lucide-react';
import type { AppLocale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/alternates';
import { aboutPageJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'About' });
  return buildPageMetadata({
    locale,
    path: '/about',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'About' });
  const appLocale = locale as AppLocale;

  const values = [
    { icon: Target, title: t('v1Title'), body: t('v1Body') },
    { icon: HeartHandshake, title: t('v2Title'), body: t('v2Body') },
    { icon: Globe2, title: t('v3Title'), body: t('v3Body') },
    { icon: Award, title: t('v4Title'), body: t('v4Body') },
  ];

  return (
    <div className="container-page py-section-md">
      <JsonLd data={aboutPageJsonLd(appLocale)} />
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-headline-xl text-foreground">
          {t('title')}
        </h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </header>

      <section className="mx-auto mt-section-md max-w-3xl space-y-6">
        <p className="leading-relaxed text-foreground">{t('p1')}</p>
        <p className="leading-relaxed text-foreground">{t('p2')}</p>
      </section>

      <section className="mt-section-lg">
        <h2 className="mb-8 text-center font-display text-headline-lg text-foreground">
          {t('valuesTitle')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
