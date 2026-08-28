import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import type { AppLocale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { buildPageMetadata } from '@/lib/seo/alternates';
import { contactPageJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const tc = await getTranslations('Footer');
  const appLocale = locale as AppLocale;

  const wa = `https://wa.me/${siteConfig.contact.whatsapp.number}`;

  const channels = [
    {
      icon: MessageCircle,
      title: t('whatsapp'),
      value: siteConfig.contact.whatsapp.display,
      href: wa,
    },
    {
      icon: Mail,
      title: t('email'),
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Phone,
      title: t('phone'),
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`,
    },
  ];

  return (
    <div className="container-page py-section-md">
      <JsonLd data={contactPageJsonLd(appLocale)} />
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-headline-xl text-foreground">
          {t('title')}
        </h1>
        <p className="mt-4 text-muted-foreground">{t('subtitle')}</p>
      </header>

      <div className="mx-auto mt-section-md grid max-w-4xl gap-6 sm:grid-cols-3">
        {channels.map((c) => (
          <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer">
            <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover">
              <CardContent className="space-y-2 p-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-5 w-5" />
                </div>
                <p className="font-display font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                  {c.title}
                </p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="mx-auto mt-section-md max-w-4xl grid gap-6 sm:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-flat-hover">
          <CardContent className="space-y-3 p-6">
            <p className="flex items-center gap-2 font-display font-semibold text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              {t('address')}
            </p>
            <p className="text-sm text-muted-foreground">{tc('address')}</p>
            <p className="flex items-center gap-2 pt-2 font-display font-semibold text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              {t('hours')}
            </p>
            <p className="text-sm text-muted-foreground">{t('hoursValue')}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-cta/5 to-cta/10 p-6 text-center transition-all duration-300 hover:shadow-flat-hover">
          <p className="font-display text-headline-md text-foreground">
            {t('ctaTitle')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t('ctaBody')}</p>
          <Button asChild variant="cta" className="mt-4">
            <Link href="/apply">{t('ctaButton')}</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
