"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Email OTP form (staff login).
 *
 * `redirectTo` is derived from `window.location.origin` — the origin the user
 * is actually on — never from NEXT_PUBLIC_SITE_URL, so the magic link always
 * lands back on the same origin where it was requested (localhost / preview /
 * production). A mismatched origin strands the OAuth code where the session
 * cookies don't exist.
 */
export function EmailOtpForm({ next }: { next: string }) {
  const t = useTranslations("Student.auth");
  const [mode, setMode] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setErr(t("error"));
      return;
    }
    setMsg(t("linkSent"));
    setMode("verify");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) {
      setErr(t("error"));
      return;
    }
    window.location.href = next;
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={mode === "request" ? requestCode : verifyCode}
        className="space-y-3"
      >
        <div className="space-y-1">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mode === "verify"}
          />
        </div>
        {mode === "verify" && (
          <div className="space-y-1">
            <Label htmlFor="code">{t("code")}</Label>
            <Input
              id="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
        {err && <p className="text-sm text-destructive">{err}</p>}
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full">
          {mode === "request" ? t("sendLink") : t("verify")}
        </Button>
      </form>
      {mode === "verify" && (
        <button
          type="button"
          onClick={() => setMode("request")}
          className="text-xs text-muted-foreground hover:underline"
        >
          {t("back")}
        </button>
      )}
    </div>
  );
}
