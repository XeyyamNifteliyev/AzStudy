import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// FS-3: derived from the same knob the pg pool uses (src/lib/db.ts). Static
// generation workers each hold a pool connection during a page build, so the
// concurrency must never exceed PGPOOL_MAX — otherwise the pool starves and
// builds hang. Defaults mirror src/lib/db.ts (1 during build).
const pgpoolMax = Number(process.env.PGPOOL_MAX ?? 1);
const staticGenerationMaxConcurrency = Math.max(
  1,
  Math.min(
    Number(process.env.NEXT_STATIC_GENERATION_MAX_CONCURRENCY ?? 1),
    pgpoolMax,
  ),
);
const staticGenerationMinPagesPerWorker = Number(
  process.env.NEXT_STATIC_GENERATION_MIN_PAGES_PER_WORKER ?? 25,
);

// Fail fast at BUILD time so a misconfigured production deploy throws here
// instead of 500-ing on the first request at runtime. Gated on production so
// `next dev` / `next lint` in CI stay lenient without a DB.
//
// D4: DATABASE_URL is deliberately NOT required at build time — all dynamic
// pages are on-demand (ISR), so `next build` runs without a reachable DB
// (Vercel's build environment has none). The app falls back to the in-memory
// seed layer until the first request hits the real DB.
function assertEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const missing = [];
  // SEO canonical/hreflang/sitemap all depend on the public site URL — a
  // placeholder here silently emits wrong canonicals.
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push("NEXT_PUBLIC_SITE_URL");
  // Supabase keys — always required (CRM always uses PgCrmRepository)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Copy .env.example to .env.local and fill in the values.",
    );
  }

  // SEC-2: format-validate the site URL. A placeholder or trailing-slash value
  // silently emits wrong canonicals/hreflang/sitemap URLs across every page.
  // On Vercel (real production) a bare https origin is mandatory. Local
  // production-mode builds may still point at http://localhost:<port> while
  // the domain is not registered yet.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const validHttpsOrigin = /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(
    siteUrl,
  );
  const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
    siteUrl,
  );
  const onVercel = !!process.env.VERCEL;
  if (onVercel && !validHttpsOrigin) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a bare https origin like https://azstudy.az (no path, no trailing slash).",
    );
  }
  if (!onVercel && !validHttpsOrigin && !localOrigin) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a bare https origin (e.g. https://azstudy.az) or, until the domain is registered, a local origin like http://localhost:3000.",
    );
  }

  // SEC-3: the dev-auth cookie is a demo affordance — if it ships to production
  // the coarse middleware gate accepts any cookie matching the signed format.
  // Fail the build instead of relying on a launch-checklist item.
  if (process.env.DEV_AUTH_ENABLED === "1") {
    throw new Error(
      "DEV_AUTH_ENABLED=1 is not allowed in production builds. Remove it before deploying.",
    );
  }

  // SEC-4: rate-limit keys come from client IP — without a trusted proxy every
  // visitor shares the "unknown" bucket and one user can rate-limit the whole
  // site (self-DoS). On Vercel the platform overwrites the forwarded headers,
  // so VERCEL=1 is implicitly trusted; elsewhere TRUST_PROXY=1 is required.
  if (!process.env.TRUST_PROXY && !process.env.VERCEL) {
    console.warn(
      "[config] TRUST_PROXY is not set in production. Rate limiting will key all " +
        "visitors to one bucket. Set TRUST_PROXY=1 (or deploy on Vercel).",
    );
  }
}
assertEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  experimental: {
    staticGenerationMaxConcurrency,
    staticGenerationMinPagesPerWorker,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // PERF: source images (seeded covers, Unsplash/Pexels refs) rarely change —
    // cache optimized derivatives for a day instead of the 60s default so ISR
    // revalidations don't re-run the optimizer for the same URL.
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // next/script inline + GA gtag + Clarity + GA collect.
          // Dev mode requires 'unsafe-eval' (webpack source maps + HMR use eval);
          // production builds don't, so it stays strict there.
          `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms${
            process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
          }`,
          "style-src 'self' 'unsafe-inline'",
          // next/image öz originindən xidmət edir; uzaq şəkillər yalnız məlum
          // mənbələrdən (Unsplash/Pexels/Supabase) + data/blob URI-lar.
          "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.supabase.co",
          "font-src 'self' data:",
          // Supabase client (auth/realtime/storage) + GA/Clarity
          "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
          "frame-src 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
