"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Analytics } from "@/components/seo/analytics";

/**
 * GDPR / ePrivacy consent manager (xeyyam.md §4.4).
 *
 * Analytics (GA4 + Clarity) only ever loads AFTER the visitor opts in, so
 * nothing is collected pre-consent — no Consent-Mode bookkeeping needed for
 * correctness. The choice persists in localStorage and the banner never
 * reappears once answered.
 *
 * SSR renders null (status "loading") — analytics and the banner are
 * purely client-side, so there is no hydration mismatch and no analytics
 * payload in the initial HTML for crawlers.
 */
export type ConsentStatus = "granted" | "denied";

const STORAGE_KEY = "azstudy-consent";

function readStored(): ConsentStatus | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function ConsentManager() {
  const t = useTranslations("Consent");
  const [status, setStatus] = useState<ConsentStatus | null | "loading">(
    "loading",
  );

  useEffect(() => {
    setStatus(readStored());
  }, []);

  if (status === "loading") return null;
  if (status === "granted") return <Analytics />;

  // Denied or undecided → no analytics.
  if (status === "denied") return null;

  return (
    <div
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div className="container-page flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-1 items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden
          />
          <div className="text-xs leading-relaxed text-muted-foreground">
            <p className="font-display text-sm font-semibold text-foreground">
              {t("title")}
            </p>
            <p className="mt-1 max-w-3xl">{t("description")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "denied");
              } catch {
                /* private mode */
              }
              setStatus("denied");
            }}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "granted");
              } catch {
                /* private mode */
              }
              setStatus("granted");
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
