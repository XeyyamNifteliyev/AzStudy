import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  // Pin PKCE explicitly: the OAuth code flow then always carries a
  // code-verifier cookie that our server callback (/auth/callback) exchanges.
  // Relying on library defaults has proven fragile across versions.
  return createBrowserClient(url, anon, {
    auth: { flowType: "pkce" },
  });
}

/**
 * Remove leftover PKCE code-verifier cookies from an earlier, incomplete OAuth
 * attempt (e.g. user aborted at the Google chooser, or a previous exchange
 * failed). A stale verifier makes the NEXT login's token exchange fail with
 * `bad_code_verifier` — the classic "first attempt bounces back to the login
 * page, second attempt works" bug. Safe: these cookies only ever hold
 * short-lived flow state, never a session.
 */
export function clearStalePkceCookies(): void {
  if (typeof document === "undefined") return;
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (name && /^sb[-.].*-code-verifier$/.test(name)) {
      document.cookie = `${name}=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}
