import { test, expect } from '@playwright/test';

test.describe('Course Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/course');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('page has heading in DOM', async ({ page }) => {
    await page.goto('/course');
    await page.waitForLoadState('domcontentloaded');
    const heading = page.getByRole('heading', { name: /Master SQL From/i });
    await expect(heading).toBeAttached();
  });

  test('shows 5 week sections', async ({ page }) => {
    await page.goto('/course');
    await page.waitForLoadState('domcontentloaded');
    const weekSections = page.locator('section[id^="w"]');
    await expect(weekSections).toHaveCount(5);
  });

  test('week 1 content exists', async ({ page }) => {
    await page.goto('/course');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('SQL Fundamentals')).toBeAttached();
  });

  test('has challenge links', async ({ page }) => {
    await page.goto('/course');
    await page.waitForLoadState('domcontentloaded');
    const dayCards = page.locator('a[href^="/challenge/"]');
    await expect(dayCards.first()).toBeAttached();
  });

  test('challenge links navigate correctly', async ({ page }) => {
    await page.goto('/course');
    await page.waitForLoadState('domcontentloaded');
    const firstChallenge = page.locator('a[href^="/challenge/"]').first();
    await expect(firstChallenge).toBeAttached();
    // Get the href to verify it points to a challenge
    const href = await firstChallenge.getAttribute('href');
    expect(href).toMatch(/\/challenge\/[\w-]+/);
  });
});
