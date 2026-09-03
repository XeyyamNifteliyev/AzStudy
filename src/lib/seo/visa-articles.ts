/**
 * AEO / Topical Authority: dynamically generate one blog article per key
 * source market on "student visa for Azerbaijan from {country}". This is the
 * fully-localized replacement for the old EN-only `b-v1..b-v15` seed stubs
 * (removed — they shipped thin content in 17 of 18 locales and pointed at a
 * missing cover image).
 *
 * Articles are generated on demand from VISA_ARTICLE_TEMPLATES (18 locales)
 * and merged into the blog list by the repository layer, so every visa page
 * renders fully translated long-form content — 15 articles × 18 languages.
 */

import { seedCountries } from "@/lib/seed/countries";
import { getVisaArticleTemplate } from "@/lib/seo/visa-article-i18n";
import type { BlogPost, LocalizedString } from "@/types";
import type { AppLocale } from "@/i18n/routing";

const LOCALES: AppLocale[] = [
  "en",
  "tr",
  "az",
  "ru",
  "de",
  "fr",
  "fa",
  "ar",
  "tk",
  "kk",
  "ky",
  "zh",
  "bg",
  "ur",
  "uz",
  "sw",
  "so",
  "id",
];

/** Simple {placeholder} interpolation. */
function fmt(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

/**
 * Resolve a string template field from every locale, interpolating the
 * {country} token with that locale's own country name (e.g. "Пакистан",
 * "باكستان") so titles/metas stay correct per script.
 */
function localized(
  key: "title" | "excerpt" | "metaTitle" | "metaDescription" | "category",
  countrySlug: string,
  replaceYear: boolean,
): LocalizedString {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const tpl = getVisaArticleTemplate(locale)[key];
    let raw = typeof tpl === "string" ? tpl : "";
    if (replaceYear)
      raw = raw.replace("2026", String(new Date().getFullYear()));
    out[locale] = fmt(raw, {
      country: countryLocalizedName(countrySlug, locale),
    });
  }
  return out as LocalizedString;
}

function generateContent(countrySlug: string): LocalizedString {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const countryName = countryLocalizedName(countrySlug, locale);
    const t = getVisaArticleTemplate(locale);
    out[locale] = t.content
      .map((p) => fmt(p, { country: countryName }))
      .join("\n\n");
  }
  return out as LocalizedString;
}

function generateFaqs(countrySlug: string): BlogPost["faqs"] {
  const enFaqs = getVisaArticleTemplate("en").faqs;
  return enFaqs.map(([q, a], i) => {
    const qI18n: Record<string, string> = {};
    const aI18n: Record<string, string> = {};
    for (const locale of LOCALES) {
      const faq = getVisaArticleTemplate(locale).faqs[i];
      if (!faq) continue;
      const countryName = countryLocalizedName(countrySlug, locale);
      qI18n[locale] = fmt(faq[0], { country: countryName });
      aI18n[locale] = fmt(faq[1], { country: countryName });
    }
    return { q, a, qI18n, aI18n };
  });
}

/** Country localized name helper (cache for hot paths). */
const nameCache = new Map<string, LocalizedString>();
function countryLocalizedName(countrySlug: string, locale: string): string {
  let name = nameCache.get(countrySlug);
  if (!name) {
    const c = seedCountries.find((x) => x.slug === countrySlug);
    name = (c?.name ?? { en: countrySlug }) as LocalizedString;
    nameCache.set(countrySlug, name);
  }
  return (name as Record<string, string>)[locale] ?? name.en ?? countrySlug;
}

/**
 * Key source markets for the per-country visa articles (matches the markets
 * the old seed stubs covered — the 15 most active study-abroad corridors).
 */
export const VISA_MARKETS = [
  "pakistan",
  "nigeria",
  "uzbekistan",
  "kazakhstan",
  "egypt",
  "india",
  "bangladesh",
  "iran",
  "iraq",
  "afghanistan",
  "turkey",
  "russia",
  "syria",
  "yemen",
  "algeria",
];

/**
 * Generate the 15 localized student-visa articles. Merged into the blog list
 * by the repository layer (same pattern as university-articles.ts).
 */
export function generateVisaArticles(): BlogPost[] {
  return VISA_MARKETS.map((countrySlug) => {
    return {
      id: `visa-article-${countrySlug}`,
      slug: `student-visa-azerbaijan-from-${countrySlug}`,
      title: localized("title", countrySlug, true),
      excerpt: localized("excerpt", countrySlug, false),
      content: generateContent(countrySlug),
      author: "AzStudy Visa Team",
      publishedAt: "2025-09-01",
      coverImage: "/images/blog/apply-azerbaijan.webp",
      category: localized("category", countrySlug, false),
      readingMinutes: 7,
      updatedAt: "2025-09-01",
      metaTitle: localized("metaTitle", countrySlug, true),
      metaDescription: localized("metaDescription", countrySlug, false),
      faqs: generateFaqs(countrySlug),
    };
  });
}

/** Check if a blog slug is a dynamically generated per-country visa article. */
export function isVisaArticle(slug: string): boolean {
  return slug.startsWith("student-visa-azerbaijan-from-");
}
