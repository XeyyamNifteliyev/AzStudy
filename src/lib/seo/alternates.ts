import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig, fullyTranslatedLocales } from "@/config/site";

/**
 * Map a bare language code to an RFC 5646/BCP-47 language-region tag for
 * `og:locale` (e.g. `en` → `en_US`). Facebook/OG consumers expect the region
 * suffix; a bare code is treated as invalid by some scrapers.
 */
const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  tr: "tr_TR",
  az: "az_AZ",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
  fa: "fa_IR",
  ar: "ar_SA",
  tk: "tk_TM",
  kk: "kk_KZ",
  ky: "ky_KG",
  zh: "zh_CN",
  bg: "bg_BG",
  ur: "ur_PK",
  uz: "uz_UZ",
  sw: "sw_TZ",
  so: "so_SO",
  id: "id_ID",
};

function ogLocale(locale: string): string {
  return OG_LOCALE_MAP[locale] ?? `${locale}_${locale.toUpperCase()}`;
}

// SE-1: hreflang needs BCP-47 language-region tags with a hyphen (en-US).
// The OG map uses underscores (en_US) because Facebook's scrapers require
// that legacy format — the two must stay separate.
function hreflangTag(locale: string): string {
  return (OG_LOCALE_MAP[locale] ?? locale).replace("_", "-");
}

/**
 * Path is the URL path WITHOUT the locale prefix, always starting with '/'.
 * e.g. '/', '/universities', '/universities/bahcesehir-university'
 */
function localizedUrl(locale: string, path: string): string {
  const suffix = path === "/" ? "" : path;
  return `${siteConfig.url}/${locale}${suffix}`;
}

export function buildAlternates(path: string): {
  alternates: { languages: Record<string, string> };
} {
  const languages: Record<string, string> = {};
  // Announce hreflang for every locale that ships a complete message file
  // (see fullyTranslatedLocales in config/site.ts).
  for (const locale of fullyTranslatedLocales) {
    languages[hreflangTag(locale)] = localizedUrl(locale, path);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { alternates: { languages } };
}

export function canonical(locale: string, path: string): string {
  return localizedUrl(locale, path);
}

export interface PageMetaInput {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex,
  keywords,
}: PageMetaInput): Metadata {
  const url = canonical(locale, path);

  const defaultKeywords = [
    "study in azerbaijan",
    "azerbaijani universities",
    "study abroad",
    "university admission azerbaijan",
    "scholarships azerbaijan",
  ];

  // og:image must ALWAYS be present — shares without one render as a bare
  // link card and it is a weak entity/trust signal.
  //
  // When a real per-page image is supplied, use it. Otherwise fall back to the
  // localized file-based generator (src/app/[locale]/opengraph-image.tsx),
  // which serves a branded 1200×630 PNG. The explicit `images` entry is
  // required: if openGraph is returned without `images`, Next treats it as
  // authoritative and never merges the file-based og:image (observed: home
  // pages shipped no og:image while the 404 page — which skips buildPage-
  // Metadata — picked the file one up).
  const ogImage = image
    ? { images: [{ url: image, width: 1200, height: 630, alt: title }] }
    : {
        images: [
          {
            url: `${siteConfig.url}/${locale}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      };

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : defaultKeywords,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: url,
      languages: buildAlternates(path).alternates?.languages,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: ogLocale(locale),
      ...ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // Mirrors the og:image fallback above (file-based generator route).
      ...(image
        ? { images: [image] }
        : { images: [`${siteConfig.url}/${locale}/opengraph-image`] }),
    },
  };
}
