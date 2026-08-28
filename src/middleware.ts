import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Hard-coded cookie name instead of importing from lib/crm/session: that module
// pulls in `pg`, which is Node-only and breaks the edge-runtime middleware
// ("Code generation from strings disallowed for this context").
const SESSION_COOKIE = "admin_session";

// Structural shape of a signed dev-auth cookie:
// `${base64url(payload)}.${base64url(hmac)}`. The full HMAC verification runs
// in the admin layout (requireStaff — Node runtime); here we only reject
// obviously-forged values (defense-in-depth for the coarse middleware gate).
const SIGNED_COOKIE_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const intlMiddleware = createMiddleware(routing);

/**
 * Refresh the Supabase session inside the middleware and propagate it BOTH
 * ways (the Supabase-documented pattern):
 *   - response: Set-Cookie so the browser persists the rotated tokens
 *   - request: req.cookies.set so the downstream page/RSC render sees the
 *     fresh access token instead of the stale one the browser sent.
 *
 * Without the request-side forward, the page render performs a SECOND refresh
 * with the already-rotated refresh token; once that loses the rotation race
 * (Supabase refresh-token reuse detection), the whole token family is revoked
 * and protected pages bounce the user to a login page — the "admin panel
 * randomly logs me out" class of bugs.
 *
 * Returns the resolved user (null when anonymous / refresh failed), so callers
 * can gate on it without a second network round-trip.
 */
async function refreshSupabaseSession(
  req: NextRequest,
  res: NextResponse,
): Promise<{ user: unknown | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { user: null };
  const supabase = createServerClient(url, anon, {
    auth: { flowType: "pkce" },
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
        toSet.forEach(({ name, value }) => req.cookies.set(name, value));
      },
    },
  });
  // getUser() validates the JWT server-side (preferred over getSession()) and
  // transparently refreshes an expired access token.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user };
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes are locale-less (src/app/admin), so they must never reach the
  // next-intl middleware — `localePrefix: 'always'` would rewrite /admin/* to
  // /en/admin/* and 404. Handle auth here, then short-circuit.
  if (pathname.startsWith("/admin")) {
    // Central admin gate (defense-in-depth): block anonymous access to /admin/*
    // before the route renders. Fine-grained staff/role checks still happen in
    // the admin layout via requireStaff(). /admin/login is exempt. The dev-auth
    // cookie is accepted here so demo logins (DEV_AUTH_ENABLED) keep working —
    // the layout re-validates the actual profile/role.
    if (!pathname.startsWith("/admin/login")) {
      const res = NextResponse.next();
      // PERF(P0): skip the Supabase round-trip when no auth cookie is present.
      const hasAuthCookie = req.cookies
        .getAll()
        .some((c) => /^sb[-.]/.test(c.name));
      let authenticated = false;
      if (hasAuthCookie) {
        // Same persist+forward refresh as the intl branch below: previously
        // this client was read-only (setAll: noop), so rotated tokens never
        // reached the browser — every /admin pageview after the first hour
        // raced the refresh-token rotation and eventually revoked the whole
        // token family (random logouts inside the admin panel).
        const { user } = await refreshSupabaseSession(req, res);
        authenticated = !!user;
      }
      const devCookie = req.cookies.get(SESSION_COOKIE)?.value;
      if (devCookie && SIGNED_COOKIE_RE.test(devCookie)) {
        authenticated = true;
      } else if (devCookie) {
        // Garbage/forged value: drop it instead of letting any non-empty
        // string pass the coarse gate. requireStaff() still does the real
        // signature + role validation downstream.
        res.cookies.delete(SESSION_COOKIE);
      }
      if (!authenticated) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
      }
      return res;
    }
    // /admin/* never passes through the intl middleware (locale-less routes).
    return NextResponse.next();
  }

  // i18n locale handling for public + dashboard routes.
  const res = intlMiddleware(req);

  // Refresh the Supabase access token on each request. After the marketing
  // layout stopped reading the session (ISR), this is the single place that
  // keeps the cookie fresh for public routes.
  // PERF(P0): only run the cross-network getUser() round-trip when an auth
  // cookie is actually present — anonymous visitors otherwise pay a Supabase
  // hop on every marketing pageview. Supabase ssr cookies are named
  // `sb-<ref>-auth-token` / `sb.<ref>.auth.token*`.
  const hasAuthCookie = req.cookies
    .getAll()
    .some((c) => /^sb[-.]/.test(c.name));
  if (hasAuthCookie) {
    await refreshSupabaseSession(req, res);
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
