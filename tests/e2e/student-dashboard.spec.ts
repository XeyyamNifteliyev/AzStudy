import { test, expect } from '@playwright/test';

test('student dev-login → overview → messages', async ({ page }) => {
  await page.goto('/en/dashboard/login');
  // dev fallback (NODE_ENV=development): pick the demo student Ali Veli
  await page.getByRole('button', { name: /Ali Veli/ }).click();
  await expect(page).toHaveURL(/\/en\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'My dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Messages' }).click();
  await expect(page).toHaveURL(/\/en\/dashboard\/messages/);
});
