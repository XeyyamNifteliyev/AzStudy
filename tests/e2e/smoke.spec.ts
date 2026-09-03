import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads with hero heading", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("can navigate to universities listing", async ({ page }) => {
    await page.goto("/en");
    await page
      .getByRole("link", { name: /universities/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/universities$/);
  });

  test("university detail page renders", async ({ page }) => {
    await page.goto("/en/universities/baku-state-university");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Baku State/i,
    );
  });

  test("programmatic page renders", async ({ page }) => {
    await page.goto("/en/programs/medicine/baku");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  // SEO: unknown slugs must return a REAL 404 (not a 200 soft-404) so Google
  // drops the removed stub URLs. Requires dynamicParams=false on the dynamic
  // marketing routes (blog/[slug], universities/[slug], countries).
  test("removed/unknown slugs return HTTP 404", async ({ page }) => {
    const cases = [
      "/en/blog/studying-at-baku-state-university", // removed stub family
      "/en/universities/azerbaijan-aviation-university", // removed (merged) uni
      "/az/study-in-azerbaijan-from/not-a-real-country",
    ];
    for (const url of cases) {
      const res = await page.request.get(url);
      expect(res.status(), `expected 404 for ${url}, got ${res.status()}`).toBe(
        404,
      );
    }
  });

  test("valid localized URLs still return 200", async ({ page }) => {
    const res = await page.request.get(
      "/az/blog/student-visa-azerbaijan-from-turkey",
    );
    expect(res.status()).toBe(200);
  });

  test("apply form rejects invalid input", async ({ page }) => {
    await page.goto("/en/apply");
    await page.getByRole("button", { name: /submit application/i }).click();
    await expect(page.getByText(/email/i).first()).toBeVisible();
  });
});
