import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";
import { logger } from "@/lib/logger";
import { crm } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  let next =
    requestUrl.searchParams.get("next") ??
    `/${routing.defaultLocale}/dashboard`;
  // 3.1: Open redirect protection — reject non-relative paths and protocol-relative URLs.
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = `/${routing.defaultLocale}/dashboard`;
  }
  // 3.1: Additional origin-equality check — resolve against request origin
  // and verify the redirect target's origin matches.
  const redirectTarget = new URL(next, requestUrl.origin);
  if (redirectTarget.origin !== requestUrl.origin) {
    next = `/${routing.defaultLocale}/dashboard`;
  }

  // Supabase auth error redirect (e.g. from email link)
  if (errorParam) {
    logger.error(
      "auth callback: Supabase error",
      { code: errorParam },
      new Error(errorDescription ?? errorParam),
    );
    return NextResponse.redirect(
      new URL(
        `/${routing.defaultLocale}/dashboard/login?error=auth`,
        requestUrl.origin,
      ),
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    logger.error("auth callback: missing Supabase env vars");
    return NextResponse.redirect(redirectTarget);
  }
  const res = NextResponse.redirect(redirectTarget);
  const supabase = createServerClient(url, anon, {
    auth: { flowType: "pkce" },
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  if (code) {
    // Instrumentation: cookie NAMES only (never values — they hold secrets).
    // A missing verifier at this point pinpoints the stale/mis-set
    // code-verifier class of bugs instantly in the logs.
    const cookieNames = req.cookies.getAll().map((c) => c.name);
    const hasVerifierCookie = cookieNames.some((n) =>
      n.endsWith("-code-verifier"),
    );
    logger.info("auth callback: exchange attempt", {
      hasVerifierCookie,
      sbCookieCount: cookieNames.filter((n) => /^sb[-.]/.test(n)).length,
    });
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      logger.error(
        "auth callback: exchangeCodeForSession failed",
        {
          code: error.code,
          status: error.status,
          hasVerifierCookie,
        },
        error,
      );
      // Generic error — details only in server log, not in URL
      return NextResponse.redirect(
        new URL(
          `/${routing.defaultLocale}/dashboard/login?error=auth`,
          requestUrl.origin,
        ),
      );
    }
    // QA-1 / SEC-10: log WITHOUT the email (PII). A boolean is all operators need.
    logger.info("auth callback: session established", { hasUser: !!data.user });
    // If the signed-in email is admin-allowlisted, route straight to the admin
    // panel regardless of the originating `next` (student Google button or admin
    // OTP form). The allowlist gate in getStaffSession() is the real security
    // boundary; this is the UX redirect that lands them on /admin.
    if (data.user?.email) {
      try {
        // Bootstrap first so the INITIAL_ADMIN_EMAIL self-registers into the
        // allowlist on the very first login (before any /admin visit).
        await crm.bootstrapInitialAdmin({
          authUid: data.user.id,
          email: data.user.email,
          fullName:
            (data.user.user_metadata?.full_name as string | undefined) ?? "",
        });
        const isAdmin = await crm.isAdminAllowlisted(data.user.email);
        if (isAdmin) {
          res.headers.set(
            "location",
            new URL("/admin", requestUrl.origin).toString(),
          );
          return res;
        }
      } catch {
        // Swallow — getStaffSession() re-checks the allowlist authoritatively.
      }
    }
    redirectTarget.searchParams.set("auth", "success");
    res.headers.set("location", redirectTarget.toString());
    // Link the student profile server-side at login so the header avatar
    // resolves immediately on the next page (no /api/me race). Best-effort —
    // a failure just means /api/me's read-mostly path links it later. Safe for
    // staff too: upsertStudentByAuthUid returns null when the email belongs to
    // a staff/admin profile (no privilege escalation).
    if (data.user) {
      try {
        await crm.upsertStudentByAuthUid({
          authUid: data.user.id,
          email: data.user.email ?? "",
          fullName:
            (data.user.user_metadata?.full_name as string | undefined) ?? "",
        });
      } catch {
        // Swallow — linking also happens lazily via /api/me.
      }
    }
  }
  return res;
}
