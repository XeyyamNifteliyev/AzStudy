import { seedBlog } from "../src/lib/seed/blog";

const L = ["en","tr","az","ru","de","fr","fa","ar","tk","kk","ky","zh","bg","ur","uz","sw","so","id"] as const;

for (const p of seedBlog as any[]) {
  const parts: string[] = [];
  for (const l of L) {
    const t = (p.title?.[l] || "").length;
    const e = (p.excerpt?.[l] || "").length;
    const c = (p.content?.[l] || "").length;
    const mt = (p.metaTitle?.[l] || "").length;
    const md = (p.metaDescription?.[l] || "").length;
    if (t || e || c || mt || md) parts.push(`${l}:t${t}e${e}c${c}m${mt}d${md}`);
  }
  console.log(p.slug.padEnd(44), parts.join(" "));
}
