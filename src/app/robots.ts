import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// AI-bot policy (ai-seo skill): every AI answer engine must be able to crawl
// and cite the site — blocking GPTBot/PerplexityBot/ClaudeBot/Google-Extended
// would remove the platform from AI-generated answers entirely. All are
// explicitly allowed with the same admin/api exclusions as the wildcard rule.
// CCBot (Common Crawl, training-only) is intentionally left unblocked too;
// block it separately if you want to opt out of training crawls.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
];

const PUBLIC_DISALLOW = [
  "/api/",
  "/dashboard/",
  "/admin/",
  "/*/dashboard/",
  "/auth/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/pricing.md"],
        disallow: PUBLIC_DISALLOW,
      },
      // Explicit per-bot allow so the citation path can never be accidentally
      // blocked by a future wildcard change. llms.txt / llms-full.txt are
      // announced so AI crawlers find the LLM-readable site overview (see
      // src/lib/seo/llms.ts).
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/pricing.md"],
        disallow: PUBLIC_DISALLOW,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
