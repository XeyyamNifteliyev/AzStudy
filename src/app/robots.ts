import type { MetadataRoute } from "next";
// SEO: derive the base URL from the single site-config source of truth
// (NEXT_PUBLIC_SITE_URL env) — a hard-coded domain here drifted from
// siteConfig/sitemap and would point the sitemap reference at the wrong host.
// Domain not registered yet: set NEXT_PUBLIC_SITE_URL when it lands.
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Allow AI search bots (critical for AI SEO — these cite content in answers)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
        ],
        allow: "/",
      },
      // Block training-only crawlers (they scrape data, never cite back)
      {
        userAgent: ["CCBot", "omgili", "Bytespider"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
