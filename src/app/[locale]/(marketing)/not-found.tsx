import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import { Home, Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  // Next.js does not pass params to not-found; resolve the locale from the
  // request context instead.
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations('NotFound');

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-section-lg text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-headline-xl text-foreground">
        {t('title')}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t('body')}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="cta" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            {t('home')}
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/universities">
            <Compass className="h-4 w-4" />
            {t('explore')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
