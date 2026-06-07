import { test, expect } from '@playwright/test';

test.describe('Resume page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Adrian Go Militante/);
  });

  test('shows name and role', async ({ page }) => {
    await expect(page.getByText('Adrian Go Militante').first()).toBeVisible();
    await expect(page.getByText('Senior Test Automation Engineer').first()).toBeVisible();
  });

  test('has Profile section', async ({ page }) => {
    await expect(page.getByText('Profile')).toBeVisible();
  });

  test('has Technical Skills section', async ({ page }) => {
    await expect(page.getByText('Technical Skills')).toBeVisible();
  });

  test('has Professional Experience section', async ({ page }) => {
    await expect(page.getByText('Professional Experience')).toBeVisible();
  });

  test('shows Singapore location', async ({ page }) => {
    await expect(page.getByText('Singapore').first()).toBeVisible();
  });

  test('has no broken layout (body renders content)', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
    const text = await body.innerText();
    expect(text.length).toBeGreaterThan(500);
  });
});
