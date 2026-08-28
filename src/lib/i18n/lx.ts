import type { AppLocale } from '@/i18n/routing';
import type { LocalizedString } from '@/types';

/**
 * Resolve a localized string by locale, falling back to English (then empty)
 * when the requested locale is absent. Seed content is authored only for a
 * subset of locales until it moves to the DB translations layer; this helper
 * keeps UI safely non-undefined across all supported languages.
 */
export function lx(value: LocalizedString | undefined, _locale: AppLocale | string): string {
  if (!value) return '';
  const v = value as Record<string, string | undefined>;
  return v[_locale] ?? v.en ?? Object.values(v)[0] ?? '';
}