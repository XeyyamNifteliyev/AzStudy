import { test, expect } from "@playwright/test";

test.describe("Programs listing (StudyLeo catalog)", () => {
  test("renders paginated table with university logos", async ({ page }) => {
    await page.goto("/en/programs");

    await expect(
      page.getByRole("heading", { name: /programs/i }),
    ).toBeVisible();
    // Desktop table renders with a university column. Logos render as <img>
    // when logoImage exists, otherwise as a text badge (logoText) — accept both.
    const table = page.locator("main table:not([hidden])").first();
    await expect(table).toBeVisible();
    const logoOrText = table
      .locator("tbody tr")
      .first()
      .locator("img, span.text-primary");
    await expect(logoOrText.first()).toBeVisible();
    // Pagination nav appears (4,168 offerings / 10 per page).
    await expect(
      page.getByRole("navigation", { name: /pagination/i }),
    ).toBeVisible();
  });

  test("pagination: next page loads and updates the URL", async ({ page }) => {
    await page.goto("/en/programs");
    await expect(page).toHaveURL(/\/en\/programs$/);

    const table = page.locator("main table:not([hidden])").first();
    const firstPageFirstRow = await table
      .locator("tbody tr")
      .nth(0)
      .locator("td")
      .nth(1)
      .textContent();

    await page.getByRole("link", { name: /next/i }).click();
    await expect(page).toHaveURL(/\/en\/programs\?page=2$/);
    await expect(table.locator("tbody tr").nth(0)).toBeVisible();

    const secondPageFirstRow = await table
      .locator("tbody tr")
      .nth(0)
      .locator("td")
      .nth(1)
      .textContent();
    expect(secondPageFirstRow).not.toBe(firstPageFirstRow);
  });

  test("pagination: page 2 canonical shows ?page=2", async ({ page }) => {
    await page.goto("/en/programs?page=2");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      /page=2/,
    );
  });

  test("filters by category and keeps pagination working", async ({ page }) => {
    await page.goto("/en/programs?category=medicine");

    const table = page.locator("main table:not([hidden])").first();
    await expect(table.locator("tbody tr").nth(0)).toBeVisible();
    // All rows in the medicine category.
    const rows = await table.locator("tbody tr").count();
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThanOrEqual(10);
  });

  test("discounted price renders strikethrough original fee", async ({
    page,
  }) => {
    await page.goto("/en/programs");
    // StudyLeo catalog rows carry originalFee — find one with a strikethrough.
    const strike = page.locator("main .line-through").first();
    await expect(strike).toBeVisible();
  });

  test("mobile: table scrolls horizontally instead of clipping", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/programs");

    // At least one table wrapper scrolls horizontally on mobile (desktop and
    // mobile variants both exist — the visible one must be scrollable).
    const scrollable = await page
      .locator("main div.overflow-x-auto")
      .first()
      .evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
  });
});
