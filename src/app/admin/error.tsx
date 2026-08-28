'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-headline-xl text-foreground">{t('title')}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t('body')}</p>
      <Button onClick={reset} variant="cta" className="mt-8 gap-2">
        <RotateCcw className="h-4 w-4" />
        {t('retry')}
      </Button>
    </div>
  );
}
