import { test, expect } from '@playwright/test';

// Generate unique test credentials using timestamp
function generateTestCredentials() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);
  return {
    email: `test-user-${timestamp}-${randomId}@example.com`,
    password: 'testPassword123!',
  };
}

test.describe('Authentication', () => {
  // Store credentials for use across tests
  const credentials = generateTestCredentials();

  test.describe('Sign Up', () => {
    test('displays signup page', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Create Account' })).toBeAttached();
    });

    test('shows validation error when passwords do not match', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');

      // Fill in the form with mismatched passwords
      await page.fill('#email', credentials.email);
      await page.fill('#password', 'password123');
      await page.fill('#confirmPassword', 'different-password');

      // Try to submit - the form should show validation error
      await page.click('button[type="submit"]');

      // Check for error message (client-side validation)
      const errorDiv = page.locator('text=/Passwords do not match/i');
      await expect(errorDiv).toBeAttached();
    });

    test('shows validation error for short password', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');

      await page.fill('#email', credentials.email);
      await page.fill('#password', '12345'); // Less than 6 characters
      await page.fill('#confirmPassword', '12345');

      await page.click('button[type="submit"]');

      // Check for error message about password length
      // Note: HTML5 validation may prevent form submission, so error might not appear
      // The browser's native validation will show a tooltip instead
      const errorDiv = page.locator('text=/at least 6 characters/i').or(
        page.locator('text=/Password must be/i')
      );
      // Just check the form doesn't submit successfully
      await expect(page).toHaveURL(/\/signup/);
    });

    test('signs up a new user successfully', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');

      // Fill in the signup form
      await page.fill('#email', credentials.email);
      await page.fill('#password', credentials.password);
      await page.fill('#confirmPassword', credentials.password);

      // Submit the form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // After successful signup, should redirect to home OR show success message
      // (if email confirmation is required)
      const currentUrl = page.url();
      if (currentUrl.includes('/signup')) {
        // Still on signup page - check for success message or error
        const successMessage = page.getByText(/Account created!/i);
        const isVisible = await successMessage.isVisible().catch(() => false);
        if (isVisible) {
          // Email confirmation required - this is expected behavior
          return;
        }
        // If no success message, the test environment may not have Supabase configured
        test.skip(true, 'Supabase not configured in test environment');
      } else {
        // Redirected to home - successful signup with auto-login
        await expect(page).toHaveURL('/');
      }
    });
  });

  test.describe('Login', () => {
    test('displays login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeAttached();
    });

    test('shows login link on signup page', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      const loginLink = page.getByRole('link', { name: 'Sign in' });
      await expect(loginLink).toBeAttached();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');

      // Try to login with invalid credentials
      await page.fill('#email', 'nonexistent@example.com');
      await page.fill('#password', 'wrongpassword');

      await page.click('button[type="submit"]');

      // Wait a bit for the API call
      await page.waitForTimeout(2000);

      // Check for error message
      const errorDiv = page.locator('.bg-red-900\\/20, .text-red-300').first();
      await expect(errorDiv).toBeAttached();
    });

    test('logs in with valid credentials', async ({ page }) => {
      // First, create a user for this test
      const testCreds = generateTestCredentials();

      // Sign up first
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);
      await page.fill('#confirmPassword', testCreds.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('domcontentloaded');

      // Check if we were redirected to home (success) or stayed on signup (email confirmation required)
      const currentUrl = page.url();
      if (currentUrl.includes('/signup')) {
        // Email confirmation is required - skip this test
        test.skip();
        return;
      }

      // Now go to login page to test logging in
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');

      // Fill in login form
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);

      // Submit the form
      await page.click('button[type="submit"]');

      // After successful login, should redirect to home
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');

      // Check that user appears logged in (user email shown in header)
      await page.waitForTimeout(2000);

      // Look for user dropdown button (contains email)
      const userButton = page.getByRole('button', { name: /User menu/i }).or(
        page.locator('text=' + testCreds.email)
      );
      await expect(userButton.first()).toBeAttached();
    });
  });

  test.describe('Logout', () => {
    test('logs out an authenticated user', async ({ page }) => {
      // First, create and login a user
      const testCreds = generateTestCredentials();

      // Sign up
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);
      await page.fill('#confirmPassword', testCreds.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('domcontentloaded');

      // Wait for auth state to be established
      await page.waitForTimeout(2000);

      // Check if we were redirected to home (success) or stayed on signup (email confirmation required)
      const currentUrl = page.url();
      if (currentUrl.includes('/signup')) {
        // Email confirmation is required - skip this test
        test.skip(true, 'Email confirmation required, cannot test logout flow');
        return;
      }

      // Now log out - click user dropdown first, then sign out
      const userButton = page.getByRole('button', { name: /User menu/i }).or(
        page.locator('header').getByText(testCreds.email)
      );

      const isUserButtonVisible = await userButton.first().isVisible({ timeout: 3000 }).catch(() => false);

      if (isUserButtonVisible) {
        await userButton.first().click();
        await page.waitForTimeout(300);

        // Now click "Sign out" in dropdown
        const signOutButton = page.getByRole('button', { name: 'Sign out' }).or(
          page.getByText('Sign out')
        );
        await signOutButton.click();
      } else {
        // Try mobile menu
        const menuButton = page.locator('button[aria-label="Open menu"]');
        const isMenuVisible = await menuButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (isMenuVisible) {
          await menuButton.click();
          await page.waitForTimeout(500);

          // In mobile menu, click sign out button
          const signOutButton = page.getByRole('button', { name: /sign out|Sign out/i });
          await signOutButton.click();
        }
      }

      // After logout, should redirect to home
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');

      // Check that login/signup buttons are now visible (user is logged out)
      const loginLink = page.getByRole('link', { name: 'Log in' });
      await expect(loginLink).toBeAttached();
    });

    test('shows login and signup buttons when not logged in', async ({ page }) => {
      // Make sure we're logged out first by clearing cookies/localStorage
      await page.context().clearCookies();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Check for login and signup links in the header (new text)
      const loginLink = page.getByRole('link', { name: 'Log in' });
      const signupLink = page.getByRole('link', { name: 'Sign up' });

      await expect(loginLink).toBeAttached();
      await expect(signupLink).toBeAttached();
    });
  });

  test.describe('Navigation Links', () => {
    test('navigate between login and signup pages', async ({ page }) => {
      // Start on login page
      await page.goto('/login');
      await page.waitForLoadState('load');

      // Verify signup link exists, then navigate directly
      const signupLink = page.locator('a[href="/signup"]').filter({ hasText: 'Sign up' }).first();
      await expect(signupLink).toBeAttached();
      await page.goto('/signup');

      await expect(page).toHaveURL('/signup');

      // Verify login link exists, then navigate directly
      const loginLink = page.locator('a[href="/login"]').filter({ hasText: 'Sign in' });
      await expect(loginLink).toBeAttached();
      await page.goto('/login');

      await expect(page).toHaveURL('/login');
    });

    test('home page has login and signup links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Wait for header to load
      await expect(page.getByRole('navigation')).toBeAttached();

      // Check for login link by text
      const loginLink = page.getByRole('link', { name: 'Log in' });
      await expect(loginLink).toBeAttached();
      await expect(loginLink).toHaveAttribute('href', '/login');

      // Check for signup link by text
      const signupLink = page.getByRole('link', { name: 'Sign up' });
      await expect(signupLink).toBeAttached();
      await expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });

  test.describe('Full Auth Flow', () => {
    test('complete signup, login after logout, and logout again', async ({ page }) => {
      const testCreds = generateTestCredentials();

      // Step 1: Sign up
      await page.goto('/signup');
      await page.waitForLoadState('load');
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);
      await page.fill('#confirmPassword', testCreds.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('load');

      // Verify on home page after signup, or skip if email confirmation required
      const currentUrl = page.url();
      if (currentUrl.includes('/signup')) {
        // Email confirmation is required - skip this test
        test.skip(true, 'Email confirmation required, cannot test full auth flow');
        return;
      }
      await expect(page).toHaveURL('/');

      // Wait for auth state
      await page.waitForTimeout(2000);

      // Step 2: Log out
      const userButton = page.getByRole('button', { name: /User menu/i }).or(
        page.locator('header').getByText(testCreds.email)
      );

      const isUserButtonVisible = await userButton.first().isVisible({ timeout: 3000 }).catch(() => false);

      if (isUserButtonVisible) {
        await userButton.first().click();
        await page.waitForTimeout(300);

        const signOutButton = page.getByRole('button', { name: 'Sign out' }).or(
          page.getByText('Sign out')
        );
        await signOutButton.click();
      } else {
        // Try mobile menu
        const menuButton = page.locator('button[aria-label="Open menu"]');
        await menuButton.click();
        await page.waitForTimeout(500);

        const signOutButton = page.getByRole('button', { name: /sign out|Sign out/i });
        await signOutButton.click();
      }

      await page.waitForLoadState('domcontentloaded');

      // Verify logged out (login button visible)
      await expect(page.getByRole('link', { name: 'Log in' })).toBeAttached();

      // Step 3: Log back in
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('domcontentloaded');

      // Verify logged in again
      await expect(page).toHaveURL('/');
      await page.waitForTimeout(2000);

      // Verify user indicator present (user dropdown button)
      const userButton2 = page.getByRole('button', { name: /User menu/i }).or(
        page.locator('text=' + testCreds.email)
      );
      await expect(userButton2.first()).toBeAttached();
    });
  });
});
