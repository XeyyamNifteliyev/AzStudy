// QA-7: Core Web Vitals smoke test. Catches regressions before they ship:
// homepage LCP < 2.5s and CLS < 0.1 (Google's "good" thresholds). The e2e job
// runs against a production build on CI, so these are real numbers.
import { test, expect } from "@playwright/test";

test("homepage Core Web Vitals (LCP < 2.5s, CLS < 0.1)", async ({ page }) => {
  // Register the observers before any navigation so the LCP entry is captured
  // (buffered:true can miss LCP if the entry fired before the observer was
  // attached). Expose the result on window for the evaluate below.
  await page.addInitScript(() => {
    (window as unknown as Record<string, unknown>).__vitals = new Promise<{
      lcp: number;
      cls: number;
    }>((resolve) => {
      const report: { lcp?: number; cls?: number } = {};
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve({ lcp: report.lcp ?? 1e9, cls: report.cls ?? 0 });
      };
      const tryFinish = () => {
        if (report.lcp !== undefined) finish();
      };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            report.lcp = entry.startTime;
            tryFinish();
          }
        }
      }).observe({ type: "largest-contentful-paint" });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as unknown as {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (entry.entryType === "layout-shift" && !shift.hadRecentInput) {
            report.cls = (report.cls ?? 0) + (shift.value ?? 0);
            tryFinish();
          }
        }
      }).observe({ type: "layout-shift" });
      setTimeout(finish, 15_000);
    });
  });

  await page.goto("/en");

  const vitals = (await page.evaluate(
    () =>
      (
        window as unknown as Record<
          string,
          Promise<{ lcp: number; cls: number }>
        >
      ).__vitals,
  )) as { lcp: number; cls: number };

  console.log(`LCP=${vitals.lcp.toFixed(0)}ms CLS=${vitals.cls.toFixed(3)}`);
  expect(vitals.lcp, "LCP must be under 2500ms").toBeLessThan(2500);
  expect(vitals.cls, "CLS must be under 0.1").toBeLessThan(0.1);
});
