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
  if (site) origins.add(site.replace(/\/$/, ''));
  // Local dev / preview servers hit the app from http://localhost:* and the
  // LAN IP used by `next dev` (see dev log: http://172.x.x.x:3100).
  origins.add('http://localhost:3000');
  origins.add('http://localhost:3100');
  return [...origins];
}

/**
 * Returns true when the request is same-origin (or origin is absent — e.g.
 * curl / server-to-server calls). Rejects cross-site calls from browsers.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return true; // non-browser clients have no Origin header
  const allow = allowedOrigins();
  return allow.some((o) => origin === o || origin.startsWith(`${o}:`));
}
