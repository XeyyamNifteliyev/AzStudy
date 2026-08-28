import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck } from 'lucide-react';
import { HeroSearchForm } from './hero-search-form';
import type { AppLocale } from '@/i18n/routing';

interface HeroSectionProps {
  universityCount: number;
  locale: AppLocale;
}

export async function HeroSection({ universityCount, locale }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: 'HomePage.hero' });

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-low to-background">
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid bg-[length:28px_28px] opacity-[0.4]"
        aria-hidden
      />
      <div className="container-page relative grid items-center gap-10 py-section-md lg:grid-cols-2 lg:py-section-lg">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('badge')}
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-muted-foreground">
            {t('subtitle')}
          </p>

          {/* Client island — only the search form is hydrated */}
          <HeroSearchForm />

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <Trust>{t('trust1')}</Trust>
            <Trust>{t('trust2')}</Trust>
            <Trust>{t('trust3')}</Trust>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border shadow-flat-hover">
            <Image
              src="/images/hero-graduation.webp"
              alt={t('imageAlt')}
              fill
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDQwIDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTNlOGY4Ii8+PC9zdmc+"
              sizes="(max-width: 1200px) 50vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -start-5 rounded-lg border border-border bg-card p-4 shadow-flat-hover">
            <p className="font-display text-2xl font-bold text-primary">
              {universityCount}+
            </p>
            <p className="text-xs text-muted-foreground">{t('universities')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-verified" aria-hidden />
      {children}
    </span>
  );
}
