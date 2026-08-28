'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function FloatingApplyButton() {
  const pathname = usePathname();
  const t = useTranslations('Common');
  const locale = useLocale();

  if (pathname.startsWith('/admin') || pathname.includes('/apply')) {
    return null;
  }

  return (
    <Link
      href={`/${locale}/apply`}
      className="fixed bottom-6 end-6 z-50 inline-flex items-center gap-2 rounded-full bg-cta px-5 py-3 text-sm font-semibold font-display text-cta-foreground shadow-flat-plus transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {t('applyNow')}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
