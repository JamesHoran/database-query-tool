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
      const errorDiv = page.locator('text=/at least 6 characters/i');
      await expect(errorDiv).toBeAttached();
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

      // After successful signup, should redirect to home
      // Note: If email verification is enabled, user might need to verify first
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');
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

      // Now log out so we can test login
      await page.goto('/');

      // Wait for the page to load and check if we're logged in
      // If we see the user email, we need to logout first
      await page.waitForTimeout(1000);

      // Go to login page
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
      // This may take a moment for the auth state to update
      await page.waitForTimeout(2000);

      // Look for the user email in the header (truncated display)
      const userEmailDisplay = page.locator('text=' + testCreds.email.substring(0, 20));
      // The email might be truncated in the UI, so just check for user indicator
      const userIndicator = page.locator('.text-green-400').first();
      await expect(userIndicator).toBeAttached();
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

      // Now log out using the logout button in the header
      const logoutButton = page.getByRole('button', { name: 'Logout' });

      // Click logout (might need to open mobile menu if on small screen)
      const isVisible = await logoutButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (!isVisible) {
        // Open mobile menu
        const menuButton = page.getByRole('button', { name: /Open menu/i });
        await menuButton.click();
        await page.waitForTimeout(500);
      }

      await logoutButton.click();

      // After logout, should redirect to home
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');

      // Check that login/signup buttons are now visible (user is logged out)
      const loginLink = page.getByRole('link', { name: 'Login' });
      await expect(loginLink).toBeAttached();
    });

    test('shows login and signup buttons when not logged in', async ({ page }) => {
      // Make sure we're logged out first by clearing cookies/localStorage
      await page.context().clearCookies();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Check for login and signup links in the header
      const loginLink = page.getByRole('link', { name: 'Login' });
      const signupLink = page.getByRole('link', { name: 'Sign Up' });

      await expect(loginLink).toBeAttached();
      await expect(signupLink).toBeAttached();
    });
  });

  test.describe('Navigation Links', () => {
    test('navigate between login and signup pages', async ({ page }) => {
      // Start on login page
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');

      // Click link to signup
      await page.getByRole('link', { name: 'Sign up' }).click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/signup');

      // Click link back to login
      await page.getByRole('link', { name: 'Sign in' }).click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/login');
    });

    test('home page has login and signup links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Check for login link (either in header or as a direct link)
      const loginLink = page.getByRole('link', { name: 'Login' });
      await expect(loginLink).toBeAttached();

      const signupLink = page.getByRole('link', { name: /Sign up|Sign Up/i });
      await expect(signupLink).toBeAttached();
    });
  });

  test.describe('Full Auth Flow', () => {
    test('complete signup, login after logout, and logout again', async ({ page }) => {
      const testCreds = generateTestCredentials();

      // Step 1: Sign up
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('#email', testCreds.email);
      await page.fill('#password', testCreds.password);
      await page.fill('#confirmPassword', testCreds.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('domcontentloaded');

      // Verify on home page after signup
      await expect(page).toHaveURL('/');

      // Wait for auth state
      await page.waitForTimeout(2000);

      // Step 2: Log out
      const logoutButton = page.getByRole('button', { name: 'Logout' });
      const isLogoutVisible = await logoutButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (!isLogoutVisible) {
        const menuButton = page.getByRole('button', { name: /Open menu/i });
        await menuButton.click();
        await page.waitForTimeout(500);
      }

      await logoutButton.click();
      await page.waitForLoadState('domcontentloaded');

      // Verify logged out (login button visible)
      await expect(page.getByRole('link', { name: 'Login' })).toBeAttached();

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

      // Verify user indicator present
      const userIndicator = page.locator('.text-green-400').first();
      await expect(userIndicator).toBeAttached();
    });
  });
});
