import { siteConfig } from "@/config/site";
import { seedUniversities } from "@/lib/seed/universities";
import { seedUniversityPrograms } from "@/lib/seed/university-programs";

export const dynamic = "force-static";

export function GET() {
  const base = siteConfig.url;

  // Build university → min tuition mapping
  const uniTuition = new Map<string, { name: string; minFee: number; maxFee: number; currency: string }>();
  for (const prog of seedUniversityPrograms) {
    if (prog.tuitionFee <= 0) continue;
    const uni = seedUniversities.find((u) => u.id === prog.universityId);
    if (!uni) continue;
    const existing = uniTuition.get(prog.universityId);
    if (existing) {
      existing.minFee = Math.min(existing.minFee, prog.tuitionFee);
      existing.maxFee = Math.max(existing.maxFee, prog.tuitionFee);
    } else {
      uniTuition.set(prog.universityId, {
        name: uni.name,
        minFee: prog.tuitionFee,
        maxFee: prog.tuitionFee,
        currency: prog.currency,
      });
    }
  }

  const lines: string[] = [
    "# AzStudy — Tuition & Program Pricing",
    "",
    "> Machine-readable tuition data for AI agents evaluating Azerbaijani universities.",
    "",
    "## Summary",
    "",
    `- ${seedUniversities.length} accredited universities`,
    `- Tuition range: $500 – $15,000/year (USD)`,
    `- Programs available in English, Azerbaijani, Russian, and Turkish`,
    `- Scholarships available at most institutions`,
    "",
    "## University Tuition",
    "",
    "| University | City | Type | Min Tuition (USD/year) | Max Tuition (USD/year) |",
    "|-----------|------|------|----------------------|----------------------|",
  ];

  const sortedUnis = [...seedUniversities].sort((a, b) => {
    const aFee = uniTuition.get(a.id)?.minFee ?? 99999;
    const bFee = uniTuition.get(b.id)?.minFee ?? 99999;
    return aFee - bFee;
  });

  for (const uni of sortedUnis) {
    const t = uniTuition.get(uni.id);
    if (!t) continue;
    lines.push(
      `| ${uni.name} | ${uni.cityId} | ${uni.isState ? "State" : "Private"} | $${t.minFee.toLocaleString()} | $${t.maxFee.toLocaleString()} |`
    );
  }

  lines.push(
    "",
    "## Key Facts",
    "",
    "- State universities: $500 – $2,500/year",
    "- Private universities: $1,000 – $15,000/year",
    "- Living costs in Baku: $270 – $600/month",
    "- Scholarships: 25% – 100% tuition coverage available",
    "",
    "## Links",
    "",
    `- [All universities](${base}/en/universities)`,
    `- [Compare universities](${base}/en/compare)`,
    `- [Apply now](${base}/en/apply)`,
    `- [Blog guides](${base}/en/blog)`,
    "",
    `Last updated: ${new Date().toISOString().split("T")[0]}`,
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
