import { siteConfig } from "@/config/site";
import { buildLlmsFullTxt } from "@/lib/seo/llms";

// /llms-full.txt — the extended llms.txt (per llmstxt.org convention):
// same header, plus FAQ answers, the application process and top
// universities. Agents that want the full context read this instead of
// following many links.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsFullTxt({ base: siteConfig.url });
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
