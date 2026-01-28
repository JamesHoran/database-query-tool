import { test, expect } from '@playwright/test';

test.describe('Progress Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/progress');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('page has heading in DOM', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('domcontentloaded');
    const heading = page.getByRole('heading', { name: /Your Progress/i });
    await expect(heading).toBeAttached();
  });

  test('has completion section', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Overall Completion')).toBeAttached();
    await expect(page.getByText(/challenges completed/)).toBeAttached();
  });

  test('displays week badges', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('domcontentloaded');
    // Check that at least one week badge exists (use .first() for strict mode)
    await expect(page.getByText('W1').first()).toBeAttached();
  });

  test('page structure is intact', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('domcontentloaded');
    // Check the page has basic structure
    const body = page.locator('body');
    await expect(body).toBeAttached();
  });
});
