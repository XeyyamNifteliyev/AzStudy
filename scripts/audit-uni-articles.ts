import { generateUniversityArticles } from "../src/lib/seo/university-articles";
import { seedUniversities } from "../src/lib/seed/universities";
import { seedBlog } from "../src/lib/seed/blog";

const LOCALES = ["en","tr","az","ru","de","fr","fa","ar","tk","kk","ky","zh","bg","ur","uz","sw","so","id"] as const;

const arts = generateUniversityArticles();
console.log("university articles:", arts.length);

for (const l of LOCALES) {
  const title = arts.filter((a: any) => (a.title?.[l] || "").length >= 5).length;
  const exc = arts.filter((a: any) => (a.excerpt?.[l] || "").length >= 40).length;
  const full = arts.filter((a: any) => (a.content?.[l] || "").length >= 400).length;
  const meta = arts.filter((a: any) => (a.metaTitle?.[l] || "").length >= 5).length;
  console.log(l.padEnd(4), "title:", String(title).padStart(2), "excerpt:", String(exc).padStart(2), "content400+:", String(full).padStart(2), "metaTitle:", String(meta).padStart(2));
}

const unis = seedUniversities as any[];
const lens = unis.map((u) => (u.description?.en || "").length);
console.log("\nuni desc EN lengths: min", Math.min(...lens), "max", Math.max(...lens), "avg", Math.round(lens.reduce((a, b) => a + b, 0) / lens.length));
console.log("sample EN:", JSON.stringify(unis[0].description.en?.slice(0, 120)));
console.log("sample AZ:", JSON.stringify(unis[0].description.az?.slice(0, 120)));
console.log("zh tagline:", JSON.stringify(unis[0].tagline.zh));

// seedBlog post slugs + per-locale content lengths (quick view)
console.log("\nseedBlog content length per locale (posts with <400 in en):");
for (const p of seedBlog as any[]) {
  const enLen = (p.content?.en || "").length;
  if (enLen < 400) console.log("  THIN-EN:", p.slug, enLen);
}
