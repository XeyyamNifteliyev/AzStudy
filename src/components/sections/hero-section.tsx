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
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-low via-background to-background">
      {/* Texture: dot grid + soft static glows (GPU-cheap, no blur on scroll) */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid bg-[length:28px_28px] opacity-40"
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-32 start-[-10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 end-[-5%] h-80 w-80 rounded-full bg-cta/10 blur-3xl" aria-hidden />

      <div className="container-page relative grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        {/* Editorial left column — staggered entry (skill §5A/§5C) */}
        <div>
          <span
            className="eyebrow animate-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {t('badge')}
          </span>

          <h1
            className="mt-6 animate-fade-in-up font-display text-display-xl text-foreground text-balance"
            style={{ animationDelay: '90ms' }}
          >
            {t('title')}
          </h1>

          <p
            className="mt-5 max-w-xl animate-fade-in-up text-body-lg text-on-surface-variant"
            style={{ animationDelay: '180ms' }}
          >
            {t('subtitle')}
          </p>

          {/* Client island — only the search form is hydrated */}
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '270ms' }}>
            <HeroSearchForm />
          </div>

          <div
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: '360ms' }}
          >
            <Trust>{t('trust1')}</Trust>
            <Trust>{t('trust2')}</Trust>
            <Trust>{t('trust3')}</Trust>
          </div>
        </div>

        {/* Right: Double-Bezel hero image (skill §4A) with Z-axis cascade */}
        <div className="relative hidden lg:block">
          <div
            className="animate-fade-in-blur"
            style={{ animationDelay: '160ms' }}
          >
            <div className="bezel rotate-[1.2deg] transition-transform duration-700 ease-fluid hover:rotate-0">
              <div className="bezel-inner aspect-[4/5]">
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
            </div>

            {/* Floating stat chip — nested island architecture (§4B) */}
            <div className="absolute -bottom-6 -start-6 rounded-2xl bg-card p-4 px-5 shadow-ambient ring-1 ring-foreground/[0.06]">
              <p className="font-display text-3xl font-bold tabular-nums text-primary">
                {universityCount}+
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t('universities')}</p>
            </div>
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
