import { data } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { lx } from "@/lib/i18n/lx";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;

export async function GET() {
  const posts = await data.blog.list();

  const items = posts
    .map((post) => {
      const title = lx(post.title, "en" as AppLocale);
      const excerpt = lx(post.excerpt, "en" as AppLocale);
      const url = `${siteConfig.url}/en/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const modDate = post.updatedAt
        ? new Date(post.updatedAt).toUTCString()
        : pubDate;

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <lastBuildDate>${modDate}</lastBuildDate>
      <category>${lx(post.category, "en" as AppLocale)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AzStudy Blog — Study in Azerbaijan</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>Guides on how to study in Azerbaijan: costs, scholarships, visas, university rankings and student life for international students.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteConfig.url}/icon.svg</url>
      <title>AzStudy</title>
      <link>${siteConfig.url}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
