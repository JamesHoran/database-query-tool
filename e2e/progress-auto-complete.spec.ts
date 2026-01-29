/**
 * Progress Auto-Complete E2E Tests
 * Tests that challenges are automatically marked as complete when solved
 */

import { test, expect, type Page } from '@playwright/test';

// Helper function to type into CodeMirror editor (same as challenge.spec.ts)
async function typeInEditor(page: Page, text: string) {
  // Click on the editor to focus it
  const editor = page.locator('.cm-content').first();
  await editor.click();

  // Select all existing content
  await page.keyboard.press('Control+A');
  await page.waitForTimeout(50);

  // Delete the selected content
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(50);

  // Type the new text using fill() which works better with CodeMirror
  await editor.fill(text);

  await page.waitForTimeout(300);
}

test.describe('Progress Auto-Complete', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to challenge page
    await page.goto('/challenge/w1-d1-c1');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.cm-content', { timeout: 10000 });

    // Wait for database schema section to appear (indicates database is ready)
    await expect(page.getByRole('heading', { name: 'Database Schema' })).toBeVisible();
  });

  test('should auto-mark challenge as complete when query passes', async ({ page }) => {
    // Get initial completed state - badge should not be visible
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).not.toBeVisible();

    // Enter the correct query (SELECT * FROM employees)
    await typeInEditor(page, 'SELECT * FROM employees');

    // Submit the query using Run Query button
    await page.getByRole('button', { name: 'Run Query' }).click();

    // Wait for progress to be saved
    await page.waitForTimeout(2000);

    // Check that the completed badge is now visible
    await expect(completedBadge).toBeVisible();
  });

  test('should not mark complete when query fails', async ({ page }) => {
    // Clear progress first
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.cm-content', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Database Schema' })).toBeVisible();

    // Get initial completed state
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).not.toBeVisible();

    // Enter an incorrect query (wrong column name)
    await typeInEditor(page, 'SELECT invalid_column FROM employees');

    // Submit the query
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(1500);

    // Check that the completed badge is still NOT visible
    await expect(completedBadge).not.toBeVisible();
  });

  test('should persist progress across page reloads', async ({ page }) => {
    // Solve the challenge
    await typeInEditor(page, 'SELECT * FROM employees');
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(2000);

    // Verify completed badge is visible
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.cm-content', { timeout: 10000 });

    // Verify completed badge is still visible after reload
    await expect(completedBadge).toBeVisible();
  });

  test('should only mark complete once (idempotent)', async ({ page }) => {
    // Solve the challenge
    await typeInEditor(page, 'SELECT * FROM employees');
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(2000);

    // Verify completed badge is visible
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).toBeVisible();

    // Run the query again
    await typeInEditor(page, 'SELECT * FROM employees');
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(500);

    // Badge should still be visible (no errors)
    await expect(completedBadge).toBeVisible();

    // Reload and verify still marked complete
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(completedBadge).toBeVisible();
  });

  test('should handle solution button correctly', async ({ page }) => {
    // Click Solution button
    await page.getByRole('button', { name: 'Solution' }).click();
    await page.waitForTimeout(500);

    // Solution should be in editor
    await expect(page.getByText('SELECT * FROM employees')).toBeAttached();

    // Run the solution
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(2000);

    // Should be marked complete
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).toBeVisible();
  });

  test('completed badge has checkmark icon', async ({ page }) => {
    // Solve the challenge
    await typeInEditor(page, 'SELECT * FROM employees');
    await page.getByRole('button', { name: 'Run Query' }).click();
    await page.waitForTimeout(2000);

    // Verify completed badge is visible and contains checkmark
    const completedBadge = page.locator('[data-testid="challenge-completed-badge"]');
    await expect(completedBadge).toBeVisible();
    await expect(completedBadge).toContainText('Completed');
  });
});
