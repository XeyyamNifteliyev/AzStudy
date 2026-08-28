export const siteConfig = {
  name: 'AzStudy',
  shortName: 'AzStudy',
  legalName: 'AzStudy',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azstudy.az').replace(/\/$/, ''),
  tagline: {
    en: 'Study in Azerbaijan — Your guided path from application to arrival',
    tr: 'Azerbaycan\u2019da E\u011fitim \u2014 Ba\u015fvurudan var\u0131\u015fa kadar rehberlik edilen yol',
    az: 'Az\u0259rbaycanda T\u0259hsil \u2014 M\u00fcraci\u0259td\u0259n g\u0259li\u015f\u0259 q\u0259d\u0259r r\u0259hb\u0259rlik olunan yol',
    ru: '\u0423\u0447\u0435\u0431\u0430 \u0432 \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0435 \u2014 \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c\u044b\u0439 \u043f\u0443\u0442\u044c \u043e\u0442 \u043f\u043e\u0434\u0430\u0447\u0438 \u0437\u0430\u044f\u0432\u043a\u0438 \u0434\u043e \u043f\u0440\u0438\u0435\u0437\u0434\u0430',
  },
  description: {
    en: 'Compare accredited Azerbaijani universities, programs, tuition and scholarships. Apply with expert guidance \u2014 visa support included.',
    tr: 'Azerbaycan\u2019\u0131n akrediteniversitelerini, b\u00f6l\u00fcmlerini, \u00fccretlerini ve burslar\u0131n\u0131 kar\u015f\u0131la\u015ft\u0131r\u0131n. Uzman rehberlikle ba\u015fvurun \u2014 vize deste\u011fi dahil.',
    az: 'Akredit\u0259 olunmu\u015f Az\u0259rbaycan universitetl\u0259rini, proqramlar\u0131, t\u0259dris haqq\u0131n\u0131 v\u0259 t\u0259qa\u00fdl\u0259ri m\u00fcqayis\u0259 edin. Ekspert r\u0259hb\u0259rliyi il\u0259 m\u00fcraci\u0259t edin \u2014 viza d\u0259st\u0259yi daxil.',
    ru: '\u0421\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0439\u0442\u0435 \u0430\u043a\u043a\u0440\u0435\u0434\u0438\u0442\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0430\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0441\u043a\u0438\u0435 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u044b, \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b, \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0438 \u0441\u0442\u0438\u043f\u0435\u043d\u0434\u0438\u0438. \u041f\u043e\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443 \u0441 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043d\u044b\u043c \u0441\u043e\u043f\u0440\u043e\u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435\u043c \u2014 \u0432\u043a\u043b\u044e\u0447\u0430\u044f \u0432\u0438\u0437\u043e\u0432\u0443\u044e \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443.',
  },
  locale: {
    default: 'en',
    locales: ['en', 'tr', 'az', 'ru', 'de', 'fr', 'fa', 'ar', 'tk', 'kk', 'ky', 'zh', 'bg', 'ur', 'uz', 'sw', 'so', 'id'] as const,
  },
  contact: {
    email: 'hello@azstudy.az',
    phone: '+994 12 000 00 00',
    whatsapp: {
      number: '994500000000',
      display: '+994 50 000 00 00',
      message: "Hello! I'd like to learn about studying in Azerbaijan.",
    },
    telegram: {
      handle: 'azstudy',
      url: 'https://t.me/azstudy',
    },
    address: {
      en: 'Baku, Azerbaijan',
      tr: 'Bak\u00fc, Azerbaycan',
      az: 'Bak\u0131, Az\u0259rbaycan',
      ru: '\u0411\u0430\u043a\u0443, \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d',
    },
  },
  social: {
    instagram: 'https://instagram.com/azstudy.az',
    youtube: 'https://youtube.com/@azstudy',
    telegram: 'https://t.me/azstudy',
    tiktok: 'https://tiktok.com/@azstudy',
  },
} as const;

export type Locale = (typeof siteConfig.locale.locales)[number];

export const locales = siteConfig.locale.locales as readonly Locale[];
export const defaultLocale = siteConfig.locale.default as Locale;

/**
 * Locales with a complete message file. All 18 locales are now fully
 * translated and included in the sitemap + hreflang alternates.
 */
const INCOMPLETE_LOCALES: ReadonlySet<string> = new Set([]);

/**
 * Locales that have full university descriptions in seed data.
 * Pages for other locales fall back to EN description and are marked
 * noindex to avoid thin-content penalties (s.md 3.2).
 */
export const UNIVERSITY_DESCRIPTION_LOCALES: ReadonlySet<string> = new Set([
  'en', 'tr', 'az', 'ru', 'de', 'fr', 'zh', 'ar', 'fa',
  'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id',
]);

/** True if the locale lacks a native university description. */
export function isThinUniversityLocale(locale: string): boolean {
  return !UNIVERSITY_DESCRIPTION_LOCALES.has(locale);
}

/** Locales that have a complete message file (used by sitemap + hreflang). */
export const fullyTranslatedLocales: readonly Locale[] = locales.filter(
  (l) => !INCOMPLETE_LOCALES.has(l),
);

/** True for the near-empty stub locales. Such pages render if visited directly
 *  but must be marked noindex so they aren't flagged as thin content. */
export function isIncompleteLocale(locale: string): boolean {
  return INCOMPLETE_LOCALES.has(locale);
}
