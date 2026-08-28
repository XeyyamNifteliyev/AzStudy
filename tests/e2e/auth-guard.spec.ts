// tests/e2e/auth-guard.spec.ts
import { test, expect } from "@playwright/test";

// Unauthenticated access to protected areas must redirect to login.
// These tests don't need a DB — the middleware redirect happens first.

test("unauthenticated /admin redirects to /admin/login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("unauthenticated /dashboard redirects to login", async ({ page }) => {
  await page.goto("/en/dashboard");
  await expect(page).toHaveURL(/\/dashboard\/login/);
});

test("login pages render (admin + student)", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading")).toBeVisible();

  await page.goto("/en/dashboard/login");
  await expect(page.getByRole("heading")).toBeVisible();
});

test("auth callback rejects external next param (open redirect guard)", async ({
  page,
}) => {
  // A malicious next=//evil.com must NOT leave the origin — it falls back to
  // the dashboard path. Use error= so the callback short-circuits before any
  // Supabase exchange (works with or without Supabase envs locally).
  await page.goto(
    "/auth/callback?error=access_denied&error_description=x&next=https%3A%2F%2Fevil.example.com%2Fphish",
  );
  await expect(page).toHaveURL(/\/en\/dashboard\/login\?error=auth/);
});

test("auth callback with protocol-relative next stays on origin", async ({
  page,
}) => {
  await page.goto("/auth/callback?error=access_denied&next=//evil.example.com");
  await expect(page).toHaveURL(/\/en\/dashboard\/login\?error=auth/);
});
