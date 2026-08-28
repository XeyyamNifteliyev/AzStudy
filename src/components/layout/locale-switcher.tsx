'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Check, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, localeLabels, type AppLocale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Common');

  function onSelect(next: AppLocale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{localeLabels[locale].native}</span>
          <span className="sm:hidden">
            {locale.toUpperCase()}
          </span>
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onSelect(l)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{localeLabels[l].flag}</span>
              {localeLabels[l].native}
            </span>
            <Check
              className={cn(
                'h-4 w-4',
                l === locale ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
