// Temporary audit: content translation completeness across 18 locales.
import { seedBlog } from "../src/lib/seed/blog";
import { seedUniversities } from "../src/lib/seed/universities";
import { seedReviews } from "../src/lib/seed/reviews";
import { seedFaqs } from "../src/lib/seed/faqs";
import { seedScholarships } from "../src/lib/seed/scholarships";
import { readFileSync } from "node:fs";

const LOCALES = [
  "en", "tr", "az", "ru", "de", "fr", "fa", "ar", "tk",
  "kk", "ky", "zh", "bg", "ur", "uz", "sw", "so", "id",
] as const;
type L = (typeof LOCALES)[number];

function coverage(items: Array<Record<string, any>>, field: string, minLen = 1) {
  const per: Record<string, { total: number; ok: number; thin: number; missing: number }> = {};
  for (const l of LOCALES) per[l] = { total: items.length, ok: 0, thin: 0, missing: 0 };
  for (const item of items) {
    const val = item[field];
    for (const l of LOCALES) {
      const s = val?.[l];
      if (typeof s !== "string" || s.length === 0) per[l].missing++;
      else if (s.length < minLen) per[l].thin++;
      else per[l].ok++;
    }
  }
  return per;
}

function printTable(name: string, fields: Array<{ field: string; minLen: number }>, items: any[]) {
  console.log(`\n=== ${name} (${items.length} items) ===`);
  const rows: string[] = [];
  for (const { field, minLen } of fields) {
    const cov = coverage(items, field, minLen);
    const bad = LOCALES.filter((l) => cov[l].ok < items.length).map(
      (l) => `${l}:${cov[l].ok}/${items.length}${cov[l].missing ? `(-${cov[l].missing})` : ""}`,
    );
    console.log(`  ${field}: ${bad.length ? bad.join(" ") : "ALL OK"}`);
  }
}

printTable("BLOG posts", [
  { field: "title", minLen: 5 },
  { field: "excerpt", minLen: 40 },
  { field: "content", minLen: 400 },
  { field: "metaTitle", minLen: 5 },
  { field: "metaDescription", minLen: 50 },
], seedBlog as any[]);

printTable("UNIVERSITIES", [
  { field: "nameI18n", minLen: 3 },
  { field: "tagline", minLen: 10 },
  { field: "description", minLen: 120 },
], seedUniversities as any[]);

printTable("REVIEWS", [
  { field: "text", minLen: 40 },
  { field: "programStudied", minLen: 2 },
], seedReviews as any[]);

printTable("FAQs", [
  { field: "question", minLen: 10 },
  { field: "answer", minLen: 30 },
], seedFaqs as any[]);

printTable("SCHOLARSHIPS", [
  { field: "name", minLen: 3 },
  { field: "requirements", minLen: 10 },
], seedScholarships as any[]);

// Blog FAQ coverage (locale-agnostic shape: {q,a}[] in EN only?)
const withFaqs = seedBlog.filter((p: any) => Array.isArray(p.faqs) && p.faqs.length > 0);
console.log(`\nBlog posts with faqs[]: ${withFaqs.length}/${seedBlog.length}`);
const withUpdatedAt = seedBlog.filter((p: any) => p.updatedAt).length;
console.log(`Blog posts with updatedAt: ${withUpdatedAt}/${seedBlog.length}`);

// UI messages: count values identical to EN (likely untranslated) per locale
const en = JSON.parse(readFileSync("src/messages/en.json", "utf8"));
function flatten(obj: any, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(out, flatten(v, key));
    else out[key] = v as string;
  }
  return out;
}
const enFlat = flatten(en);
console.log(`\n=== UI messages identical-to-EN (candidate untranslated) ===`);
for (const l of LOCALES) {
  if (l === "en") continue;
  const flat = flatten(JSON.parse(readFileSync(`src/messages/${l}.json`, "utf8")));
  const same = Object.keys(enFlat).filter((k) => k in flat && flat[k] === enFlat[k] && enFlat[k].length > 3);
  console.log(`  ${l}: ${same.length}/${Object.keys(enFlat).length} identical`);
}
