import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('page has main heading in DOM', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: /Master SQL From/i });
    await expect(heading).toBeAttached();
  });

  test('page displays stats', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('125').first()).toBeAttached();
    await expect(page.getByText('Challenges').first()).toBeAttached();
    await expect(page.getByText('5').first()).toBeAttached();
    await expect(page.getByText('Weeks').first()).toBeAttached();
  });

  test('has course navigation link', async ({ page }) => {
    await page.goto('/');
    const courseLink = page.getByRole('link', { name: /Start Learning/i }).first();
    await expect(courseLink).toBeAttached();
    await courseLink.click();
    await expect(page).toHaveURL(/\/sql/);
  });

  test('has curriculum anchor link', async ({ page }) => {
    await page.goto('/');
    const curriculumLink = page.getByRole('link', { name: /View Curriculum/i });
    await expect(curriculumLink).toBeAttached();
  });

  test('displays week curriculum cards', async ({ page }) => {
    await page.goto('/');
    // Check for curriculum section anchor
    await expect(page.locator('#curriculum')).toBeAttached();
    // Check for week links (there are multiple, so just check at least one exists)
    const weekLinks = page.locator('a[href*="/sql#w"]');
    await expect(weekLinks.first()).toBeAttached();
  });
});
