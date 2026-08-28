import { test, expect } from "@playwright/test";

test.describe("Apply form", () => {
  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/apply");
    await expect(
      page.getByRole("heading", { name: /apply/i }).first(),
    ).toBeVisible();

    await page.getByRole("button", { name: /submit/i }).click();

    // Zod + RHF validation surfaces field errors.
    await expect(page.getByText(/first name/i).first()).toBeVisible();
  });

  test("submits a valid application and shows success", async ({ page }) => {
    await page.goto("/en/apply");

    // University is a Radix Select (combobox) — required by leadSchema.
    const universityTrigger = page.getByRole("combobox", {
      name: /university/i,
    });
    await universityTrigger.click();
    await page
      .getByRole("option", { name: /university/i })
      .first()
      .click();

    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill(`e2e-${Date.now()}@example.com`);
    await page.getByLabel(/phone/i).fill("+905001112233");

    // Country is a Radix Select — pick the first real country (skip placeholders).
    const countryTrigger = page.getByRole("combobox", { name: /country/i });
    await countryTrigger.click();
    await page
      .locator('[role="option"]:not([data-placeholder])')
      .first()
      .click();

    await page.getByRole("button", { name: /submit/i }).click();

    // Successful submit shows the success panel (localized text).
    await expect(page.getByText(/thanks|success/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
