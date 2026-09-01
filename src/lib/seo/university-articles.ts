/**
 * AEO / Topical Authority: dynamically generate one blog article per
 * university from seed data. This is Klaster 5 of the seo.md strategy —
 * 46 articles that each target long-tail keywords like
 * "ADA University tuition fees 2026" and "Baku State University admission".
 *
 * Articles are NOT stored in the blog seed file. They're generated on
 * demand and merged into the blog list, so adding/removing a university
 * automatically keeps the article count in sync.
 *
 * i18n: all copy comes from UNI_ARTICLE_TEMPLATES (18 locales), so every
 * article renders fully translated long-form content in each locale —
 * 46 articles × 18 languages of citable, structured content.
 */

import { seedUniversities } from "@/lib/seed/universities";
import { seedCities } from "@/lib/seed/cities";
import { UNI_ARTICLE_TEMPLATES } from "@/lib/seo/university-article-i18n";
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

/** Get the EN city name (used for the fee-context helpers below). */
/** Get the EN city name (used for the fee-context helpers below). */
function getCityName(cityId: string): string {
  const city = seedCities.find((c) => c.id === cityId);
  return city?.name.en ?? "Azerbaijan";
}

/** Localized "<Name> — Admission, Fees & Programs 2026" title tails. */
const TITLE_TAILS: Record<string, string> = {
  en: "Admission, Fees & Programs",
  tr: "Başvuru, Ücretler ve Programlar",
  az: "Qəbul, Qiymətlər və Proqramlar",
  ru: "Поступление, стоимость и программы",
  de: "Zulassung, Gebühren & Programme",
  fr: "Admission, frais et programmes",
  zh: "入学、费用与课程",
  ar: "القبول والرسوم والبرامج",
  fa: "پذیرش، شهریه و برنامه‌ها",
  ur: "داخلہ، فیس اور پروگرام",
  uz: "Qabul, to'lovlar va dasturlar",
  kk: "Қабылдау, ақы және бағдарламалар",
  ky: "Кабыл алу, акы жана программалар",
  tk: "Kabul, tölegler we programmalar",
  bg: "Прием, такси и програми",
  id: "Pendaftaran, Biaya & Program",
  sw: "Kujiandikisha, Ada na Programu",
  so: "Gelitaan, Kharash iyo Barnaamijyo",
};

function generateTitle(name: string, year: number): LocalizedString {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    out[locale] = `${name} — ${TITLE_TAILS[locale] ?? TITLE_TAILS.en} ${year}`;
  }
  return out as LocalizedString;
}

/** Simple {placeholder} interpolation. */
function fmt(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

/** Resolve a string template field from every locale and interpolate vars. */
function localized(
  key: "excerpt" | "metaTitle" | "metaDescription" | "category",
  vars: Record<string, string>,
): LocalizedString {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const tpl = UNI_ARTICLE_TEMPLATES[locale];
    const raw = tpl?.[key];
    if (typeof raw === "string") out[locale] = fmt(raw, vars);
  }
  return out as LocalizedString;
}

function generateContent(
  name: string,
  city: string,
  foundedYear: number,
  studentCount: number,
  isState: boolean,
  languages: string[],
): LocalizedString {
  const tuitionRange = isState ? "$600–2,500" : "$3,000–15,000";
  const langList = languages.join(", ").toUpperCase();
  const bachelorFee = isState ? "600–1,500" : "3,000–8,000";
  const masterFee = isState ? "1,000–2,500" : "5,000–12,000";
  const phdFee = isState ? "1,500–3,000" : "8,000–15,000";
  const isBaku = city.toLowerCase() === "baku";

  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const t = UNI_ARTICLE_TEMPLATES[locale];
    if (!t) continue;
    const typeLabel = isState ? t.typeState : t.typePrivate;
    const vars: Record<string, string> = {
      name,
      city,
      founded: String(foundedYear),
      students: studentCount.toLocaleString("en-US"),
      type: typeLabel,
      tuitionRange,
      langList,
      appFee: isState ? "$50-100" : "$100-150",
    };
    const f = (s: string) => fmt(s, vars);
    const scholarship = f(
      isState ? t.scholarshipsState : t.scholarshipsPrivate,
    );
    const life = f(isBaku ? t.lifeBaku : t.lifeOther);

    out[locale] = [
      f(t.intro),
      "",
      `## ${f(t.whyTitle)}`,
      "",
      f(t.whyBody),
      "",
      `## ${f(t.admTitle)}`,
      "",
      `### ${f(t.admIntlTitle)}`,
      "",
      ...t.docs.map((d, i) => `${i + 1}. ${f(d)}`),
      "",
      `### ${f(t.tlTitle)}`,
      "",
      ...t.tl.map((x) => `- ${f(x)}`),
      "",
      `## ${f(t.feesTitle)}`,
      "",
      `| ${f(t.tbl[0])} | ${f(t.tbl[1])} | ${f(t.tbl[2])} |`,
      "|---|---|---|",
      `| ${t.tblRows[0]} | ${bachelorFee} | ${t.tblDurations[0]} |`,
      `| ${t.tblRows[1]} | ${masterFee} | ${t.tblDurations[1]} |`,
      `| ${t.tblRows[2]} | ${phdFee} | ${t.tblDurations[2]} |`,
      "",
      f(t.feesSource),
      "",
      `## ${f(t.programsTitle)}`,
      "",
      f(t.programsBody),
      "",
      `## ${f(t.scholarshipsTitle)}`,
      "",
      scholarship,
      "",
      `## ${f(t.lifeTitle)}`,
      "",
      life,
      "",
      `## ${f(t.howTitle)}`,
      "",
      ...t.steps.map((s, i) => `${i + 1}. ${f(s)}`),
      "",
      `## ${f(t.faqTitle)}`,
      "",
      ...t.faqs.flatMap(([q, a]) => [`### ${f(q)}`, "", f(a), ""]),
    ].join("\n");
  }
  return out;
}

/**
 * Generate blog articles for all universities in the seed data.
 * These are merged into the blog list by the repository layer.
 */
export function generateUniversityArticles(): BlogPost[] {
  const year = new Date().getFullYear();
  return seedUniversities.map((uni) => {
    const city = getCityName(uni.cityId);
    const slug = `study-at-${uni.slug}`;
    const baseVars: Record<string, string> = {
      name: uni.name,
      city,
      founded: String(uni.foundedYear),
      students: uni.studentCount.toLocaleString("en-US"),
    };

    return {
      id: `uni-article-${uni.slug}`,
      slug,
      title: generateTitle(uni.name, year),
      excerpt: localized("excerpt", baseVars),
      content: generateContent(
        uni.name,
        city,
        uni.foundedYear,
        uni.studentCount,
        uni.isState,
        uni.languages,
      ),
      author: "AzStudy Team",
      publishedAt: "2025-08-25",
      coverImage: uni.heroImage,
      category: localized("category", baseVars),
      readingMinutes: 12,
      updatedAt: "2025-08-25",
      metaTitle: localized("metaTitle", baseVars),
      metaDescription: localized("metaDescription", baseVars),
      faqs: buildFaqs(uni.name, city, uni.isState),
    };
  });
}

/** Locale-aware FAQ pairs (qI18n/aI18n override the EN fallback). */
function buildFaqs(name: string, city: string, isState: boolean) {
  const tuitionRange = isState ? "$600-2,500" : "$3,000-15,000";
  const vars = { name, city, tuitionRange, langList: "" };
  // Build per-locale FAQ translations using the template faqs.
  const qI18nList: LocalizedString[] = [];
  const aI18nList: LocalizedString[] = [];
  const enFaqs = UNI_ARTICLE_TEMPLATES.en.faqs;
  for (let i = 0; i < enFaqs.length; i++) {
    const qLs: Record<string, string> = {};
    const aLs: Record<string, string> = {};
    for (const locale of LOCALES) {
      const t = UNI_ARTICLE_TEMPLATES[locale];
      const faq = t?.faqs?.[i];
      if (!faq) continue;
      qLs[locale] = fmt(faq[0], vars);
      aLs[locale] = fmt(faq[1], vars);
    }
    qI18nList.push(qLs as LocalizedString);
    aI18nList.push(aLs as LocalizedString);
  }
  return enFaqs.map(([q, a], i) => ({
    q,
    a,
    qI18n: qI18nList[i],
    aI18n: aI18nList[i],
  }));
}

/**
 * Check if a blog slug is a dynamically generated university article.
 */
export function isUniversityArticle(slug: string): boolean {
  return slug.startsWith("study-at-");
}
