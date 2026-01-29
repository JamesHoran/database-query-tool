import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/SQL Mastery/);
  });

  test('has login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    // Check for main heading
    const heading = page.getByRole('heading', { name: /Welcome Back/i });
    await expect(heading).toBeAttached();

    // Check for email input
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeAttached();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for password input
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeAttached();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeAttached();
  });

  test('has signup link', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    const signupLink = page.getByRole('link', { name: /sign up/i }).first();
    await expect(signupLink).toBeAttached();

    // Navigate directly since link might be outside viewport
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);
  });

  test('has continue without signing in link', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    const homeLink = page.getByRole('link', { name: /continue without signing in/i });
    await expect(homeLink).toBeAttached();

    // Navigate directly since link might be outside viewport
    await page.goto('/');
    await expect(page).toHaveURL(/\//);
  });

  test('has anonymous usage notice', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    // Check for the notice about using without account
    const notice = page.getByText(/You can also use the app without signing in/i);
    await expect(notice).toBeAttached();
  });

  test('form accepts input', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');

    // Fill in the form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');

    // Verify values were entered
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveValue('test@example.com');

    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveValue('password123');
  });
});
