// AEO (Answer-Engine Optimization): llms.txt / llms-full.txt content builders.
//
// Follows the llmstxt.org v2 spec: H1 site name (required), a blockquote
// summary, detail sections, then H2 "file list" sections of markdown links.
// AI crawlers (OpenAI, Anthropic, Gemini, Perplexity) fetch /llms.txt to
// understand what the site is about before following links — this is the file
// that makes the platform quotable by LLMs answering "best way to study in
// Azerbaijan" style questions.

import { seedCountries } from "@/lib/seed/countries";
import { seedUniversities } from "@/lib/seed/universities";
import { seedBlog } from "@/lib/seed/blog";

interface LlmsContext {
  base: string;
}

const UNIVERSITY_COUNT = seedUniversities.length;
const COUNTRY_COUNT = seedCountries.length;

// AEO: dynamically derive top universities from seed data (ranked by ranking field)
// instead of hardcoded list — keeps llms.txt accurate as universities are added/removed.
const TOP_UNIVERSITIES_DYNAMIC = seedUniversities
  .filter((u) => u.ranking <= 10)
  .sort((a, b) => a.ranking - b.ranking)
  .slice(0, 10)
  .map((u) => ({
    slug: u.slug,
    name: u.name,
    note: `${u.isState ? "State" : "Private"} university founded in ${u.foundedYear}, ${u.studentCount.toLocaleString()} students`,
  }));

const KEY_FACTS = [
  "Free to use — applications, consultation and guidance are 100% free.",
  "Scholarships up to 100% available at partner universities.",
  "Hundreds of programs taught fully in English (Azerbaijani is not required).",
  "State universities from roughly USD 600/year; private universities USD 3,000–15,000/year.",
  "Visa and residence-permit support included after acceptance.",
  `${UNIVERSITY_COUNT} accredited (Ministry of Education) universities represented — the most comprehensive database of Azerbaijani universities.`,
  `Country-specific guides for ${COUNTRY_COUNT} countries.`,
  "Available in 18 languages: en, tr, az, ru, de, fr, fa, ar, tk, kk, ky, zh, bg, ur, uz, sw, so, id.",
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Do I need to know Azerbaijani to study in Azerbaijan?",
    a: "No. Hundreds of programs are taught fully in English. Azerbaijani is helpful for daily life but not required for English-medium programs.",
  },
  {
    q: "How much does it cost to study in Azerbaijan?",
    a: "State universities cost roughly USD 600–2,000 per year; private universities USD 3,000–15,000. Living costs are around USD 270–600 per month.",
  },
  {
    q: "Do I need a student visa?",
    a: "Yes. After acceptance you apply for a student visa at the Azerbaijani consulate, then convert it to a residence permit after arrival.",
  },
  {
    q: "Are scholarships available for international students?",
    a: "Yes. The Azerbaijan Government Scholarship program offers full scholarships, and most private universities offer merit discounts of 25–100%.",
  },
  {
    q: "What documents do I need to apply?",
    a: "Typically: passport, high-school diploma and transcript (translated & notarised), passport photo, motivational letter and language certificate.",
  },
  {
    q: "Can I study in Azerbaijan without IELTS?",
    a: "Yes. Many universities accept an internal English exam, a preparatory year or alternative certificates like TOEFL, and some programs are taught in Azerbaijani, Russian or Turkish. Check each university's language requirements before applying.",
  },
  {
    q: "Is studying in Azerbaijan worth it?",
    a: "For most international students, yes. You get Ministry-accredited degrees, tuition far below Western Europe or the US, scholarships up to 100% and a low cost of living, with strong engineering, medicine and business programs.",
  },
  {
    q: "Is an Azerbaijani university degree recognized internationally?",
    a: "Yes. Degrees from Ministry-accredited Azerbaijani universities are recognized across Europe, the Middle East, Africa and Asia, and many programs hold international accreditations.",
  },
  {
    q: "How long does an Azerbaijani student visa take?",
    a: "Most student visas are processed within 2 to 4 weeks after your appointment at the Azerbaijani consulate, though it varies by country. Apply as soon as you receive your acceptance letter.",
  },
];



const APPLY_STEPS = [
  "1. Choose a university and program — compare tuition, language and scholarships on the site.",
  "2. Prepare documents: passport, high-school diploma and transcript (translated & notarised), photo, motivational letter, language certificate.",
  "3. Submit the free application — the team reviews it and handles follow-ups with the university.",
  "4. Receive the acceptance letter, then apply for a student visa at the Azerbaijani consulate.",
  "5. Arrive in Azerbaijan and convert the visa into a residence permit with the team's support.",
];

function keyPages(base: string): string {
  return [
    "- [Universities](BASE/en/universities): Browse and compare all accredited Azerbaijani universities by city, program, language and tuition.",
    "- [Programs](BASE/en/programs): Medicine, engineering, computer science, business, law, architecture and more.",
    "- [Pricing](BASE/pricing.md): Machine-readable tuition, scholarship and living-cost data for international students.",
    "- [Blog](BASE/en/blog): Guides on costs, scholarships, visas, applications and student life.",
    "- [Apply](BASE/en/apply): Start a free application with expert guidance.",
    "- [Compare](BASE/en/compare): Side-by-side comparison of universities.",
    "- [About](BASE/en/about): Who we are and how the platform works.",
    "- [Contact](BASE/en/contact): WhatsApp, email and phone support.",
  ]
    .join("\n")
    .replaceAll("BASE", base);
}

function countryLinks(base: string): string {
  return seedCountries
    .map(
      (c) =>
        `- [Study in Azerbaijan from ${c.name.en}](${base}/en/study-in-azerbaijan-from/${c.slug})`,
    )
    .join("\n");
}

export function buildLlmsTxt({ base }: LlmsContext): string {
  return [
    "# AzStudy — Study in Azerbaijan",
    "",
    "> Compare accredited Azerbaijani universities, programs, tuition and scholarships, then apply with expert guidance — visa and residence support included.",
    "",
    `AzStudy is a free study-in-Azerbaijan platform that represents ${UNIVERSITY_COUNT} Azerbaijani universities and helps international students compare programs, tuition fees, scholarships and living costs in 18 languages, with country-specific guides for ${COUNTRY_COUNT} countries. Applications, consultation and guidance are 100% free.`,
    "",
    "Key facts:",
    ...KEY_FACTS.map((f) => `- ${f}`),
    "",
    "## Key pages",
    keyPages(base),
    "",
    "## Country guides",
    `- [All countries](BASE/en/study-in-azerbaijan-from)`.replaceAll("BASE", base),
    countryLinks(base),
    "",
    "## Optional",
    "- [llms-full.txt](BASE/llms-full.txt): Extended version of this file with FAQ answers, top universities and the application process.".replaceAll(
      "BASE",
      base,
    ),
    "",
  ].join("\n");
}

export function buildLlmsFullTxt({ base }: LlmsContext): string {
  // AEO: collect FAQs from blog posts dynamically
  const blogFaqs = seedBlog
    .filter((p) => p.faqs && p.faqs.length > 0)
    .flatMap((p) => (p.faqs ?? []).map((f) => ({ q: f.q, a: f.a })))
    .slice(0, 30);

  // AEO: recent blog articles for freshness signal
  const recentPosts = [...seedBlog]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  return [
    "# AzStudy — Study in Azerbaijan (full)",
    "",
    "> Compare accredited Azerbaijani universities, programs, tuition and scholarships, then apply with expert guidance — visa and residence support included.",
    "",
    `AzStudy is a free study-in-Azerbaijan platform that represents ${UNIVERSITY_COUNT} Azerbaijani universities and helps international students compare programs, tuition fees, scholarships and living costs in 18 languages, with country-specific guides for ${COUNTRY_COUNT} countries. Applications, consultation and guidance are 100% free.`,
    "",
    "## Key pages",
    keyPages(base),
    "",
    "## Frequently asked questions",
    ...FAQS.map((f) => `### ${f.q}\n${f.a}`),
    "",
    "## Blog questions and answers",
    ...blogFaqs.map((f) => `### ${f.q}\n${f.a}`),
    "",
    "## How to apply to an Azerbaijani university",
    ...APPLY_STEPS.map((s) => `- ${s}`),
    "",
    "## Top universities",
    ...TOP_UNIVERSITIES_DYNAMIC.map(
      (u) => `- [${u.name}](${base}/en/universities/${u.slug}): ${u.note}`,
    ),
    "",
    "## All universities",
    ...seedUniversities.map(
      (u) => `- [${u.name}](${base}/en/universities/${u.slug})`,
    ),
    "",
    "## Recent articles",
    ...recentPosts.map(
      (p) => `- [${p.title.en}](${base}/en/blog/${p.slug})`,
    ),
    "",
    "## Country guides",
    countryLinks(base),
    "",
  ].join("\n");
}
