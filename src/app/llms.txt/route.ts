import { siteConfig } from "@/config/site";
import { buildLlmsTxt } from "@/lib/seo/llms";

// /llms.txt — AEO standard file (llmstxt.org v2) that AI crawlers
// (OpenAI, Anthropic, Gemini, Perplexity) fetch to learn what the site is
// about and where the high-value pages are. Static so it costs nothing at
// runtime and is always available.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt({ base: siteConfig.url });
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
