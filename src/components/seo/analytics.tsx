"use client";

import { useEffect } from "react";

/**
 * Analytics integration — env-based, no-op when IDs are absent.
 *
 * - Google Analytics 4 (NEXT_PUBLIC_GA_ID)
 * - Microsoft Clarity (NEXT_PUBLIC_CLARITY_ID)
 *
 * GDPR (xeyyam.md §4.4): this component is rendered by <ConsentManager> ONLY
 * after the visitor opts in. Because that happens after initial hydration
 * (next/script's afterInteractive/lazyOnload strategies have already fired by
 * then and would silently drop these tags), the tags are injected imperatively
 * in an effect. A module-level guard makes double-mounts idempotent.
 */
declare global {
  interface Window {
    // dataLayer/gtag are declared in src/types/analytics.d.ts (GtagCommand).
    clarity?: (...args: unknown[]) => void;
  }
}

let injected = false;

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    if (injected || (!gaId && !clarityId)) return;
    injected = true;

    if (gaId) {
      // dataLayer + gtag loader first (so events queued before the snippet
      // resolves are buffered), then the remote loader.
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId, { send_page_view: true });

      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
    }

    if (clarityId) {
      const clarity = document.createElement("script");
      clarity.async = true;
      clarity.type = "text/javascript";
      clarity.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
      document.head.appendChild(clarity);
    }
  }, [gaId, clarityId]);

  return null;
}
