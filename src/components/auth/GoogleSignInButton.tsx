"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getSupabaseBrowser,
  clearStalePkceCookies,
} from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * Google OAuth button.
 *
 * The redirect target is built from `window.location.origin` — the origin the
 * user is ACTUALLY on — instead of NEXT_PUBLIC_SITE_URL. Building it from the
 * env var sent localhost logins to the production domain (or vice versa),
 * stranding the OAuth code on the wrong origin where the PKCE verifier cookie
 * doesn't exist, so the first exchange always failed. Origin-based redirect
 * keeps the whole flow (cookies + code) on one origin, on every environment:
 * localhost:3000, *.vercel.app previews, and the production domain.
 */
export function GoogleSignInButton({ next }: { next: string }) {
  const t = useTranslations("Auth");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // DEBUG: surface why the OAuth return landed on this page instead of
  // completing. Google/Supabase append error details to the URL when the flow
  // fails before our /auth/callback ever sees a code.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const oauthError = p.get("error");
    const oauthDesc = p.get("error_description");
    const errorCode = p.get("code");
    const reason = p.get("reason");
    const verifier = p.get("verifier");
    if (oauthError || oauthDesc) {
      console.error(
        "[OAuth return] login page reached with an OAuth error in the URL:",
        { error: oauthError, error_description: oauthDesc, code: errorCode },
      );
    }
    if (reason) {
      console.error(
        "[OAuth return] /auth/callback FAILED and redirected here. Exchange reason:",
        { reason, verifierCookiePresent: verifier === "true" },
      );
    }
    if (errorCode && !oauthError && !reason) {
      console.warn(
        "[OAuth return] reached login WITHOUT completing — a `code` was present but the page is not /auth/callback (redirect misroute). URL:",
        window.location.href,
      );
    }
  }, []);

  async function signIn() {
    setPending(true);
    setErr(null);
    // Drop verifier cookies from any earlier incomplete OAuth flow — a stale
    // one makes the first token exchange fail (bad_code_verifier) while a
    // second attempt succeeds. Clearing here makes every attempt start clean.
    clearStalePkceCookies();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
    console.log("[OAuth] starting Google sign-in:", {
      origin,
      redirectTo,
      cookiesBefore: document.cookie
        .split(";")
        .map((c) => c.split("=")[0].trim())
        .filter(Boolean),
    });
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      console.error("[OAuth] signInWithOAuth returned an error:", error);
      setErr(error.message);
    } else {
      console.log(
        "[OAuth] signInWithOAuth OK — browser should redirect to Google. data.url:",
        data?.url,
      );
    }
    setPending(false);
  }

  return (
    <>
      <Button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="w-full gap-2"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
          />
        </svg>
        {pending ? "..." : t("googleLogin")}
      </Button>
      {err && <p className="text-sm text-destructive">{err}</p>}
    </>
  );
}
