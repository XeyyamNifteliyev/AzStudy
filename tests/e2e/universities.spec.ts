import { test, expect } from "@playwright/test";

test.describe("University filters", () => {
  test("renders the filter rail on desktop", async ({ page }) => {
    await page.goto("/en/universities");

    await expect(
      page.getByRole("complementary", { name: /filters/i }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("complementary", { name: /filters/i })
        .getByRole("searchbox", { name: /search/i }),
    ).toBeVisible();
  });

  test("updates the filter URL without dropping other query parameters", async ({
    page,
  }) => {
    await page.goto("/en/universities?sort=name&city=istanbul");

    const sidebar = page.getByRole("complementary", { name: /filters/i });
    await sidebar
      .getByRole("searchbox", { name: /search/i })
      .fill("Bahcesehir");

    await expect
      .poll(() => new URL(page.url()).searchParams.get("sort"))
      .toBe("name");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("city"))
      .toBe("istanbul");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("search"))
      .toBe("Bahcesehir");
  });

  test("changes sort through the URL and reorders the listing", async ({
    page,
  }) => {
    await page.goto("/en/universities?sort=relevance");

    await page.getByRole("combobox", { name: /sort/i }).click();
    await page.getByRole("option", { name: /^name$/i }).click();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("sort"))
      .toBe("name");

    const names = await page
      .locator("main a[href*='/universities/'] h3")
      .allTextContents();
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test("filters the rendered results by maximum tuition", async ({ page }) => {
    await page.goto("/en/universities");

    const sidebar = page.getByRole("complementary", { name: /filters/i });
    await sidebar.getByRole("spinbutton", { name: /tuition/i }).fill("1500");

    await expect
      .poll(() => new URL(page.url()).searchParams.get("maxTuition"))
      .toBe("1500");
    const resultCards = page.locator("main a[href*='/universities/']");
    await expect.poll(() => resultCards.count()).toBeGreaterThan(0);
    await expect(
      page.locator("main a[href*='/universities/bahcesehir-university']"),
    ).toHaveCount(0);
    const cardTexts = await resultCards.allTextContents();
    expect(cardTexts.length).toBeGreaterThan(0);
    for (const cardText of cardTexts) {
      const amount = cardText.match(/\$\s*([\d,.]+)[\s\S]*Tuition/)?.[1];
      expect(amount, `missing tuition amount in ${cardText}`).toBeTruthy();
      expect(Number(amount!.replace(/,/g, ""))).toBeLessThanOrEqual(1500);
    }
  });

  test("clear all removes listing filters but preserves unrelated query parameters", async ({
    page,
  }) => {
    await page.goto(
      "/en/universities?sort=name&maxTuition=12500&city=istanbul&ref=campaign",
    );

    await page
      .getByRole("complementary", { name: /filters/i })
      .getByRole("button", { name: /clear all/i })
      .click();

    await expect.poll(() => new URL(page.url()).search).toBe("?ref=campaign");
  });

  test("clear all cancels a pending search update", async ({ page }) => {
    await page.goto("/en/universities?search=Bahcesehir&ref=campaign");

    const sidebar = page.getByRole("complementary", { name: /filters/i });
    await sidebar.getByRole("searchbox", { name: /search/i }).fill("Istanbul");
    await sidebar.getByRole("button", { name: /clear all/i }).click();

    await expect.poll(() => new URL(page.url()).search).toBe("?ref=campaign");
    await expect(page).toHaveURL(/\/en\/universities\?ref=campaign$/);
    await expect(
      page.getByRole("complementary", { name: /filters/i }).getByRole("searchbox", { name: /search/i }),
    ).toHaveValue("");
  });

  test("opens and closes the filter drawer on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/universities");

    await page.getByRole("button", { name: /filters/i }).click();
    await expect(page.getByRole("dialog", { name: /filters/i })).toBeVisible();

    await page.getByRole("button", { name: /close/i }).click();
    await expect(page.getByRole("dialog", { name: /filters/i })).toBeHidden();
  });

  test("keeps the filter drawer open while typing a mobile search", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/universities");

    await page.getByRole("button", { name: /filters/i }).click();
    const dialog = page.getByRole("dialog", { name: /filters/i });
    await dialog.getByRole("searchbox", { name: /search/i }).fill("Bahcesehir");

    await expect(dialog).toBeVisible();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("search"))
      .toBe("Bahcesehir");
  });
});
