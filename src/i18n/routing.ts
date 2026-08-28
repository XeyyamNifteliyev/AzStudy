import { defineRouting } from 'next-intl/routing';
import { siteConfig } from '@/config/site';

export const routing = defineRouting({
  locales: [...siteConfig.locale.locales],
  defaultLocale: siteConfig.locale.default,
  localePrefix: 'always',
});

export type AppLocale = (typeof routing.locales)[number];

export const localeLabels: Record<AppLocale, { native: string; flag: string }> = {
  en: { native: 'English', flag: '🇬🇧' },
  tr: { native: 'Türkçe', flag: '🇹🇷' },
  az: { native: 'Azərbaycan', flag: '🇦🇿' },
  ru: { native: 'Русский', flag: '🇷🇺' },
  de: { native: 'Deutsch', flag: '🇩🇪' },
  fr: { native: 'Français', flag: '🇫🇷' },
  fa: { native: 'فارسی', flag: '🇮🇷' },
  ar: { native: 'العربية', flag: '🇸🇦' },
  tk: { native: 'Türkmen', flag: '🇹🇲' },
  kk: { native: 'Қазақша', flag: '🇰🇿' },
  ky: { native: 'Кыргызча', flag: '🇰🇬' },
  zh: { native: '中文', flag: '🇨🇳' },
  bg: { native: 'Български', flag: '🇧🇬' },
  ur: { native: 'اردو', flag: '🇵🇰' },
  uz: { native: 'Oʻzbek', flag: '🇺🇿' },
  sw: { native: 'Kiswahili', flag: '🇹🇿' },
  so: { native: 'Soomaali', flag: '🇸🇴' },
  id: { native: 'Indonesia', flag: '🇮🇩' },
};

export const isRtl = (locale: string): boolean =>
  locale === 'ar' || locale === 'fa' || locale === 'ur';

export const isLocale = (locale: string): locale is AppLocale =>
  (routing.locales as readonly string[]).includes(locale);
