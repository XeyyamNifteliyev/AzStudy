// src/app/sitemap.ts — single sitemap index (auto-splits when chunks exceed the 50k limit).
//
// For now we emit the unified /sitemap.xml since url count (<50k) fits. When
// routing + content grows (Phase 3C-full), this file should split into multiple
// `sitemap-{group}.xml` routes and have /sitemap.xml act as an index file.

import type { MetadataRoute } from "next";
import { data } from "@/lib/data";
import { siteConfig, fullyTranslatedLocales } from "@/config/site";
import { buildAlternates } from "@/lib/seo/alternates";

// PERF/Cache: the sitemap re-resolves thousands of URLs from the data layer on
// every request; ISR keeps a cached copy between revalidations. Crawlers hit
// it rarely (per crawl budget), so a longer window is safe.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [universities, posts, combinations, countries, categories] =
    await Promise.all([
      data.universities.list(),
      data.blog.list(),
      data.programs.getCombinations(),
      data.countries.list(),
      data.programs.getCategories(),
    ]);

  const staticPaths = [
    { path: "/", priority: 1.0, change: "weekly" as const },
    { path: "/universities", priority: 0.9, change: "weekly" as const },
    { path: "/programs", priority: 0.8, change: "weekly" as const },
    { path: "/compare", priority: 0.6, change: "monthly" as const },
    { path: "/about", priority: 0.5, change: "monthly" as const },
    { path: "/blog", priority: 0.7, change: "weekly" as const },
    { path: "/contact", priority: 0.5, change: "monthly" as const },
    { path: "/apply", priority: 0.8, change: "monthly" as const },
    // Hub for the country-landing cluster — links every country page, so it
    // strengthens the "study in Azerbaijan from {country}" internal-link graph.
    {
      path: "/study-in-azerbaijan-from",
      priority: 0.8,
      change: "monthly" as const,
    },
    // Trust pages — indexable so users can verify the site's legal footing.
    { path: "/privacy", priority: 0.3, change: "yearly" as const },
    { path: "/terms", priority: 0.3, change: "yearly" as const },
  ];

  // `lastModified` is intentionally omitted for content without a real
  // `updatedAt` column (universities/categories/combinations/countries/static
  // paths). Emitting `new Date()` makes every deploy look like a full-site
  // change; Google ignores such churn and may devalue the field. Only blog
  // posts carry a real publish date.
  // International SEO: every sitemap URL must carry <xhtml:link> alternates
  // for ALL locales (including itself) + x-default. Next.js does NOT add the
  // self-referencing entry automatically from alternates.languages — it emits
  // exactly what the map contains, so buildAlternates(path) (all complete
  // locales + x-default) is spread onto every entry. HTML <link> hreflang and
  // these sitemap annotations agree because they share the same builder.
  const urls: MetadataRoute.Sitemap = [];
  const locPrefix = (loc: string, path: string) =>
    `/${loc}${path === "/" ? "" : path}`;

  // Only emit URLs for fully-translated locales (see fullyTranslatedLocales).
  // Indexing stub/partial locales would flag the site for "thin content" and
  // hurt the ranking of complete locales too.
  for (const locale of fullyTranslatedLocales) {
    // `path` is UNLOCALIZED (e.g. "/universities"): makeEntry prefixes the
    // current locale for the <loc>, and buildAlternates expands the same path
    // into the full hreflang set (12 complete locales + x-default) so the
    // sitemap's <xhtml:link> annotations match the HTML hreflang exactly.
    const makeEntry = (
      path: string,
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: number,
      lastModified?: Date,
    ): MetadataRoute.Sitemap[number] => ({
      url: `${base}${locPrefix(locale, path)}`,
      // buildAlternates returns { alternates: { languages } } — spread the WHOLE
      // object so the entry carries `alternates` (the sitemap serializer reads
      // item.alternates.languages). Spreading `.alternates` alone would hoist
      // `languages` to the top level, where the serializer silently ignores it.
      ...buildAlternates(path),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    });
    for (const { path, priority, change } of staticPaths) {
      urls.push(makeEntry(path, change, priority));
    }

    for (const u of universities) {
      // SE-7: advertise hero + gallery images so Google Images can crawl them
      // without discovering them through the (JS-heavy) page HTML.
      const images = [u.heroImage, ...u.gallery].filter(Boolean);
      urls.push({
        url: `${base}${locPrefix(locale, `/universities/${u.slug}`)}`,
        ...buildAlternates(`/universities/${u.slug}`),
        ...(images.length ? { images } : {}),
        changeFrequency: "monthly",
        priority: 0.85,
        ...(u.updatedAt ? { lastModified: new Date(u.updatedAt) } : {}),
      });
    }

    for (const cat of categories) {
      urls.push(makeEntry(`/programs/${cat.slug}`, "monthly", 0.7));
    }

    for (const c of combinations) {
      urls.push(
        makeEntry(`/programs/${c.categorySlug}/${c.citySlug}`, "monthly", 0.65),
      );
    }

    // "Study in Azerbaijan from {country}" landing pages — high-intent geo funnels.
    for (const c of countries) {
      urls.push(makeEntry(`/study-in-azerbaijan-from/${c.slug}`, "monthly", 0.7));
    }

    // Blog category pages — high-intent internal linking hubs.
    const blogCategories = [...new Set(posts.map((p) => {
      return p.category.en?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }).filter(Boolean))];
    for (const cat of blogCategories) {
      urls.push(makeEntry(`/blog/${cat}`, "weekly", 0.65));
    }

    for (const post of posts) {
      urls.push(
        makeEntry(
          `/blog/${post.slug}`,
          "monthly",
          0.7,
          post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
        ),
      );
    }
  }

  // AEO: machine-readable files AI agents fetch directly (see src/lib/seo/llms.ts
  // and src/app/pricing.md/route.ts). Listed so crawlers/agents discover them.
  urls.push({
    url: `${base}/llms.txt`,
    changeFrequency: "weekly",
    priority: 0.3,
  });
  urls.push({
    url: `${base}/llms-full.txt`,
    changeFrequency: "weekly",
    priority: 0.2,
  });
  urls.push({
    url: `${base}/pricing.md`,
    changeFrequency: "weekly",
    priority: 0.4,
  });

  // With <50k URLs we can emit a single file. When this grows, switch to the
  // index-file pattern documented in Next's `sitemaps` extension API.
  return urls;
}
