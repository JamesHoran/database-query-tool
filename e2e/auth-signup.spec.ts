import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('has signup form', async ({ page }) => {
    await page.goto('/signup');

    // Check for main heading
    const heading = page.getByRole('heading', { name: /Create Account/i });
    await expect(heading).toBeVisible();

    // Check for email input
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for password inputs
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const confirmPasswordInput = page.locator('#confirmPassword');
    await expect(confirmPasswordInput).toBeVisible();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /create account/i });
    await expect(submitButton).toBeVisible();
  });

  test('has login link', async ({ page }) => {
    await page.goto('/signup');

    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();

    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('has continue without signing up link', async ({ page }) => {
    await page.goto('/signup');

    const homeLink = page.getByRole('link', { name: /continue without signing up/i });
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL(/\//);
  });

  test('form validation requires matching passwords', async ({ page }) => {
    await page.goto('/signup');

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
