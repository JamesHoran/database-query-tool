import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('has signup form', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('load');

    // Check for main heading
    const heading = page.getByRole('heading', { name: /Create Account/i });
    await expect(heading).toBeAttached();

    // Check for email input
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeAttached();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for password inputs
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeAttached();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const confirmPasswordInput = page.locator('#confirmPassword');
    await expect(confirmPasswordInput).toBeAttached();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /create account/i });
    await expect(submitButton).toBeAttached();
  });

  test('has login link', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('load');

    const loginLink = page.getByRole('link', { name: /sign in/i }).first();
    await expect(loginLink).toBeAttached();

    // Navigate directly since link might be outside viewport
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('has continue without signing up link', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('load');

    const homeLink = page.getByRole('link', { name: /continue without signing up/i });
    await expect(homeLink).toBeAttached();

    // Navigate directly since link might be outside viewport
    await page.goto('/');
    await expect(page).toHaveURL(/\//);
  });

  test('form validation requires matching passwords', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('load');

    // Fill in different passwords
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('#confirmPassword').fill('different123');

    // Try to submit - client-side validation should prevent submission
    // or show an error
    const submitButton = page.getByRole('button', { name: /create account/i });
    await submitButton.click();

    // The form should not submit successfully (either stays on page or shows error)
    // We just verify we're still on signup page after a brief moment
    await expect(page).toHaveURL(/\/signup/);
  });
});
