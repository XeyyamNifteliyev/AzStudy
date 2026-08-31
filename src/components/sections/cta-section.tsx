import { getTranslations } from 'next-intl/server';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { FadeIn } from '@/components/motion/fade-in';

export async function CTASection() {
  const t = await getTranslations('HomePage.cta');
  const wa = `https://wa.me/${siteConfig.contact.whatsapp.number}`;

  return (
    <section className="py-24 lg:py-28">
      <FadeIn className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-container to-cta px-6 py-16 text-center text-white shadow-ambient sm:px-16 sm:py-20">
          {/* Decorative glows */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cta/30 blur-3xl" aria-hidden />

          <div className="relative">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {t('badge') || 'Free Application'}
            </div>

            <h2 className="mx-auto max-w-2xl font-display text-display-lg text-balance">
              {t('title')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-white/80">
              {t('subtitle')}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {/* Primary: pill with nested arrow island (skill §4B) */}
              <Link
                href="/apply"
                className="group inline-flex h-14 items-center gap-4 rounded-full bg-white ps-7 pe-2 font-display text-base font-semibold text-primary shadow-ambient transition-[background-color,transform] duration-300 ease-fluid hover:bg-white/95 active:scale-[0.98]"
              >
                {t('primary')}
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-px">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
              </Link>

              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-white/10 px-7 font-display text-base font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-[background-color,transform] duration-300 ease-fluid hover:bg-white/20 active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                {t('whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
