import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigate from home to course', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Start Learning/i }).first().click();
    await expect(page).toHaveURL('/sql');
  });

  test('course page loads', async ({ page }) => {
    await page.goto('/sql');
    await expect(page).toHaveURL('/sql');
  });

  test('progress page loads', async ({ page }) => {
    await page.goto('/progress');
    await expect(page).toHaveURL('/progress');
  });

  test('challenge page loads', async ({ page }) => {
    await page.goto('/challenge/w1-d1-c1');
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBeTruthy();
  });
});
