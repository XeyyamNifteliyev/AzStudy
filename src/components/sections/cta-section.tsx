import { getTranslations } from 'next-intl/server';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { FadeIn } from '@/components/motion/fade-in';

export async function CTASection() {
  const t = await getTranslations('HomePage.cta');
  const wa = `https://wa.me/${siteConfig.contact.whatsapp.number}`;

  return (
    <section className="section-padding">
      <FadeIn className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-cta px-6 py-12 text-center text-white shadow-flat-plus sm:px-12 sm:py-16">
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cta/30 blur-3xl" />
          
          <div className="relative">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {t('badge') || 'Free Application'}
            </div>
            
            <h2 className="mx-auto max-w-2xl font-display text-headline-xl text-balance">
              {t('title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              {t('subtitle')}
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="cta" size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                <Link href="/apply">
                  {t('primary')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="glass"
                className="gap-2"
              >
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {t('whatsapp')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
