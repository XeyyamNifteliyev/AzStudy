// src/lib/security/origin.ts
// Cross-origin request protection for state-changing endpoints (chat, upload,
// lead submission). Server actions in Next.js are already CSRF-guarded by
// origin checks, but these are plain POST route handlers / actions that accept
// requests from any origin — a malicious site could drive them (e.g. burn the
// OpenAI budget, spam leads). We reject requests whose Origin header is not one
// of our own origins.

/** Allowed origins: the site URL from env, plus localhost for local dev. */
function allowedOrigins(): string[] {
  const origins = new Set<string>();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) origins.add(site.replace(/\/$/, ""));
  // Local dev / preview servers hit the app from http://localhost:* (next dev
  // picks whatever port is free, so the list can't be hardcoded) and the LAN
  // IP used by `next dev` for phone testing. SEC: loopback + LAN origins are
  // only registered outside production — leaving them in the production
  // allowlist would be an unnecessary attack surface.
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost");
    origins.add("http://127.0.0.1");
    // LAN hostnames printed by `next dev` (e.g. http://192.168.x.x:3100).
    origins.add("http://192.168");
    origins.add("http://10.");
  }
  return [...origins];
}

/**
 * Returns true when the request is same-origin (or origin is absent — e.g.
 * curl / server-to-server calls). Rejects cross-site calls from browsers.
 * Vercel preview deployments run with NODE_ENV=production but serve from
 * ephemeral *.vercel.app URLs — those are allowed for previews only.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return true; // non-browser clients have no Origin header
  const allow = allowedOrigins();
  if (allow.some((o) => origin === o || origin.startsWith(`${o}:`)))
    return true;
  if (
    process.env.VERCEL_ENV === "preview" &&
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)
  ) {
    return true;
  }
  return false;
}
