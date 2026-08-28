import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('home page loads with hero heading', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('can navigate to universities listing', async ({ page }) => {
    await page.goto('/en');
    await page
      .getByRole('link', { name: /universities/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/universities$/);
  });

  test('university detail page renders', async ({ page }) => {
    await page.goto('/en/universities/bahcesehir-university');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Bahçeşehir/,
    );
  });

  test('programmatic page renders', async ({ page }) => {
    await page.goto('/en/programs/computer-science/istanbul');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('apply form rejects invalid input', async ({ page }) => {
    await page.goto('/en/apply');
    await page.getByRole('button', { name: /submit application/i }).click();
    await expect(page.getByText(/email/i).first()).toBeVisible();
  });
});
