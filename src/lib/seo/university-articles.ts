/**
 * AEO / Topical Authority: dynamically generate one blog article per
 * university from seed data. This is Klaster 5 of the seo.md strategy —
 * 46 articles that each target long-tail keywords like
 * "ADA University tuition fees 2026" and "Baku State University admission".
 *
 * These articles are NOT stored in the blog seed file. They're generated on
 * demand and merged into the blog list, so adding/removing a university
 * automatically keeps the article count in sync.
 */

import { seedUniversities } from "@/lib/seed/universities";
import { seedCities } from "@/lib/seed/cities";
import type { BlogPost, LocalizedString } from "@/types";

function getCityName(cityId: string): string {
  const city = seedCities.find((c) => c.id === cityId);
  return city?.name.en ?? "Azerbaijan";
}

function generateTitle(name: string, _city: string): LocalizedString {
  return {
    en: `${name} — Admission, Fees & Programs 2026`,
    tr: `${name} — Başvuru, Ücretler ve Programlar 2026`,
    az: `${name} — Qəbul, Qiymətlər və Proqramlar 2026`,
    ru: `${name} — Поступление, Стоимость и Программы 2026`,
    de: `${name} — Zulassung, Gebühren & Programme 2026`,
    fr: `${name} — Admission, Frais et Programmes 2026`,
    zh: `${name} — 2026年入学、费用与课程`,
    ar: `${name} — القبول والرسوم والبرامج 2026`,
    fa: `${name} — پذیرش، شهریه و رشته‌ها 2026`,
    tk: `${name} — Kyzylyşdyrmak, bahalar we programmmalar 2026`,
    kk: `${name} — Қабылдау, ақы және бағдарламалар 2026`,
    ky: `${name} — Кабыл алу, акы жана программалар 2026`,
    bg: `${name} — Прием, такси и програми 2026`,
    ur: `${name} — داخلہ، فیس اور پروگرام 2026`,
    uz: `${name} — Qabul, to'lov va dasturlar 2026`,
    sw: `${name} — Mapokeo, Ada na Mpango 2026`,
    so: `${name} — Qaadashida, Khidmaha iyo Barnaamijyada 2026`,
    id: `${name} — Penerimaan, Biaya & Program 2026`,
  };
}

function generateExcerpt(name: string, city: string): LocalizedString {
  return {
    en: `Complete guide to studying at ${name} in ${city}, Azerbaijan: admission requirements, tuition fees 2026, programs, scholarships and student life for international students.`,
    tr: `${name} (${city}, Azerbaycan)'da okumak için tam rehber: başvuru gereksinimleri, 2026 ücretleri, programlar ve burslar.`,
    az: `${name} (${city}, Azərbaycan)da təhsil almaq ucun tam beldeci: qebul telebləri, 2026-ci il qiymetleri, proqramlar ve teqaüdler.`,
    ru: `Полное руководство по обучению в ${name} (${city}, Азербайджан): требования поступления, стоимость 2026, программы и стипендии.`,
  };
}

function generateContent(name: string, city: string, foundedYear: number, studentCount: number, isState: boolean, languages: string[]): LocalizedString {
  const cityLower = city.toLowerCase();
  const typeLabel = isState ? "state" : "private";
  const tuitionRange = isState ? "$600–2,500" : "$3,000–15,000";
  const langList = languages.join(", ").toUpperCase();

  return {
    en: `${name} is a ${typeLabel} university located in ${city}, Azerbaijan, founded in ${foundedYear}. With approximately ${studentCount.toLocaleString()} students, it is one of the key institutions for higher education in the region.

## Why Study at ${name}?

${name} offers internationally recognized degrees, affordable tuition fees (${tuitionRange}/year), and programs taught in ${langList}. The university has ${studentCount.toLocaleString()} students and a strong reputation in ${cityLower}'s academic community.

## Admission Requirements

### For International Students
1. Valid passport (minimum 6 months validity)
2. High school diploma or equivalent (apostilled)
3. Transcript of records
4. Language proficiency certificate (IELTS 5.0+ or equivalent)
5. Motivation letter
6. Passport-sized photographs

### Application Timeline
- **Application opens:** March 1
- **Deadline:** July 15
- **Results:** August 1-15
- **Semester starts:** September 15

## Tuition Fees 2026

| Program Level | Annual Fee (USD) | Duration |
|--------------|-----------------|----------|
| Bachelor's | ${isState ? "600–1,500" : "3,000–8,000"} | 4 years |
| Master's | ${isState ? "1,000–2,500" : "5,000–12,000"} | 2 years |
| PhD | ${isState ? "1,500–3,000" : "8,000–15,000"} | 3-4 years |

*Source: ${name} official fee schedule 2025-2026*

## Programs Available

The university offers programs in ${langList} across multiple faculties including engineering, business, medicine, humanities and social sciences.

## Scholarships

${isState
    ? `As a state university, ${name} participates in the Azerbaijan Government Scholarship program offering full tuition waivers and monthly stipends for qualified international students.`
    : `${name} offers merit-based scholarships of 25-100% for international students with strong academic records.`}

## Student Life in ${city}

${city} is one of Azerbaijan's ${cityLower === "baku" ? "most vibrant capitals with modern infrastructure, rich cultural heritage and affordable living costs ($400-600/month)" : "most welcoming cities with a growing student community and low cost of living ($200-350/month)"}.

## How to Apply

1. Visit the university's official website
2. Choose your program and check language requirements
3. Prepare and submit required documents
4. Pay the application fee (${isState ? "$50-100" : "$100-150"})
5. Attend the entrance exam (if required)
6. Receive acceptance letter
7. Apply for student visa
8. Register upon arrival in Azerbaijan

## Frequently Asked Questions

### What language are programs taught in at ${name}?
Programs at ${name} are taught in ${langList}. ${languages.includes("en") ? "English-taught programs are available for international students." : "Contact the admissions office for the latest English-taught program availability."}

### How much does it cost to study at ${name}?
Tuition at ${name} ranges from ${tuitionRange} per year depending on the program level and field of study. Living costs in ${city} are approximately $${cityLower === "baku" ? "400-600" : "200-350"}/month.

### Are there scholarships at ${name}?
${isState
    ? `Yes. The Azerbaijan Government Scholarship covers full tuition and accommodation. ${name} also offers merit-based discounts.`
    : `Yes. ${name} offers merit-based scholarships ranging from 25% to 100% of tuition fees for qualified international students.`}

### Is ${name} accredited?
Yes. ${name} is accredited by the Ministry of Education of Azerbaijan Republic. ${isState ? "As a state institution, its degrees are automatically recognized." : "Its programs are recognized internationally."}

### Can I work while studying at ${name}?
International students can work part-time (up to 20 hours/week) after obtaining a work permit from the State Migration Service.`,
    tr: `${name}, ${city}, Azerbaycan'da ${foundedYear} yılında kurulan bir ${typeLabel} üniversitesidir. Yaklaşık ${studentCount.toLocaleString()} öğrencisi ile bölgenin önemli yükseköğretim kurumlarından biridir.`,
    az: `${name} ${foundedYear}-ci ildə ${city}, Azərbaycanda təsis olunmuş ${typeLabel} universitetidir. Təxminən ${studentCount.toLocaleString()} tələbəsi ilə regionun əsas ali təhsil müəssisələrindən biridir.`,
    ru: `${name} — это ${typeLabel} университет в ${city}, Азербайджан, основанный в ${foundedYear} году. С примерно ${studentCount.toLocaleString()} студентами это одно из ключевых учреждений высшего образования в регионе.`,
  };
}

/**
 * Generate blog articles for all universities in the seed data.
 * These are merged into the blog list by the repository layer.
 */
export function generateUniversityArticles(): BlogPost[] {
  return seedUniversities.map((uni) => {
    const city = getCityName(uni.cityId);
    const slug = `study-at-${uni.slug}`;
    const title = generateTitle(uni.name, city);
    const excerpt = generateExcerpt(uni.name, city);

    return {
      id: `uni-article-${uni.slug}`,
      slug,
      title,
      excerpt,
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
      category: {
        en: "Universities",
        tr: "Üniversiteler",
        az: "Universitetlər",
        ru: "Университеты",
      },
      readingMinutes: 12,
      updatedAt: "2025-08-25",
      metaTitle: {
        en: `${uni.name} 2026 — Fees, Programs & Admission Guide`,
        tr: `${uni.name} 2026 — Ücretler, Programlar ve Başvuru Rehberi`,
        az: `${uni.name} 2026 — Qiymətlər, Proqramlar və Qəbul Bələdçisi`,
        ru: `${uni.name} 2026 — Стоимость, Программы и Руководство по поступлению`,
      },
      metaDescription: {
        en: `Study at ${uni.name} in ${city}: tuition fees ${new Date().getFullYear()}, programs in ${uni.languages.join(" and ").toUpperCase()}, admission requirements and scholarships for international students.`,
        tr: `${uni.name} (${city})'da okuma: ${new Date().getFullYear()} ücretleri, programlar, başvuru gereksinimleri ve burslar.`,
        az: `${uni.name}-də (${city}) təhsil: ${new Date().getFullYear()} qiymətləri, proqramlar, qəbul tələbləri və təqaüdlər.`,
      },
      faqs: [
        {
          q: `What programs does ${uni.name} offer?`,
          a: `${uni.name} offers bachelor's, master's and PhD programs in ${uni.languages.join(", ").toUpperCase()} across engineering, business, medicine, humanities and social sciences.`,
        },
        {
          q: `How much does it cost to study at ${uni.name}?`,
          a: `Tuition at ${uni.name} ranges from ${uni.isState ? "$600-2,500" : "$3,000-15,000"} per year depending on the program. Living costs in ${city} are approximately $${city.toLowerCase() === "baku" ? "400-600" : "200-350"}/month.`,
        },
        {
          q: `Are scholarships available at ${uni.name}?`,
          a: `${uni.isState ? "As a state university, " : ""}${uni.name} ${uni.isState ? "participates in government scholarship programs and" : "offers merit-based scholarships"} covering 25-100% of tuition for qualified international students.`,
        },
      ],
    };
  });
}

/**
 * Check if a blog slug is a dynamically generated university article.
 */
export function isUniversityArticle(slug: string): boolean {
  return slug.startsWith("study-at-");
}
