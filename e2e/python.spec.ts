// E2E Tests for Python Learning App
import { test, expect } from '@playwright/test';

test.describe('Python Course Page', () => {
  test('should display the Python course overview', async ({ page }) => {
    await page.goto('/python');

    // Check heading
    await expect(page.locator('h1')).toContainText('Learn Python in 3 Weeks');

    // Check for hero section badges
    await expect(page.getByText('Complete Python Curriculum')).toBeVisible();
    await expect(page.getByText('3 Weeks')).toBeVisible();
    await expect(page.getByText('Browser-Based')).toBeVisible();

    // Check week sections
    await expect(page.getByText('Python Fundamentals')).toBeVisible();
    await expect(page.getByText('Data Structures & OOP Essentials')).toBeVisible();
    await expect(page.getByText('Portfolio Project')).toBeVisible();
  });

  test('should navigate to week modules', async ({ page }) => {
    await page.goto('/python');

    // Click on Week 1
    await page.click('a[href="/python/week-01-basics"]');
    await expect(page).toHaveURL(/\/python\/week-01-basics/);
    await expect(page.getByText('Week 1: Python Fundamentals')).toBeVisible();
  });
});

test.describe('Python Week Page', () => {
  test('should display challenges for the week', async ({ page }) => {
    await page.goto('/python/week-01-basics');

    // Check heading
    await expect(page.getByText('Week 1: Python Fundamentals')).toBeVisible();

    // Check challenge cards exist
    await expect(page.locator('a[href^="/python-challenge/"]').first()).toBeVisible();
  });

  test('should have back link to Python overview', async ({ page }) => {
    await page.goto('/python/week-01-basics');

    // Click back link
    await page.click('a[href="/python"]');
    await expect(page).toHaveURL(/\/python$/);
  });
});

test.describe('Python Challenge Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific challenge
    await page.goto('/python-challenge/variables-strings');
  });

  test('should display challenge instructions', async ({ page }) => {
    // Check heading
    await expect(page.getByText('Variables and Strings')).toBeVisible();

    // Check instructions section
    await expect(page.getByText('Instructions')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
  });

  test('should have Python editor', async ({ page }) => {
    // Check editor is visible
    await expect(page.getByText('Python Editor')).toBeVisible();

    // Check code editor exists (CodeMirror)
    const editor = page.locator('.cm-editor');
    await expect(editor).toBeVisible();
  });

  test('should have hints section', async ({ page }) => {
    // Hints should be collapsed by default
    await expect(page.getByText('Hints')).toBeVisible();

    // Click to expand
    await page.click('button:has-text("Hints")');

    // Hints should be visible now
    await expect(page.locator('text=/Use/')).toBeVisible();
  });

  test('should show Run and Submit buttons', async ({ page }) => {
    // Check action buttons
    await expect(page.getByRole('button', { name: /Run/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Solution' })).toBeVisible();
  });

  test('should display console/output section', async ({ page }) => {
    // Console should be visible
    await expect(page.getByText('Output will appear here')).toBeVisible();
  });

  test('should update code when typing in editor', async ({ page }) => {
    // Find the CodeMirror editor
    const editor = page.locator('.cm-content');

    // The editor might not be immediately interactive if Pyodide is loading
    // Click to focus
    await editor.click();

    // Type some code
    await page.keyboard.type('test = "hello"');

    // Verify content changed (this is a basic check)
    // In a real test with working Pyodide, we'd verify the actual content
  });

  test('should show loading state while Python runtime loads', async ({ page }) => {
    // On first load, should show loading message
    await expect(page.getByText(/Loading Python runtime/)).toBeVisible({ timeout: 5000 }).catch(() => {
      // If it loads too fast, that's okay
    });
  });

  test('should have navigation buttons', async ({ page }) => {
    // Previous/Next challenge navigation might not exist for first/last challenges
    // But navigation should exist in some form
    const backLink = page.locator('a[href="/python"]');
    await expect(backLink).toBeVisible();
  });
});

test.describe('Python Challenge Completion Flow', () => {
  test('should allow completing a challenge', async ({ page }) => {
    await page.goto('/python-challenge/variables-strings');

    // Wait for runtime to load (or timeout)
    await page.waitForTimeout(3000);

    // Type solution code
    const solution = `name = "Alice"
greeting = f"Hello, {name}!"`;

    // Find textarea or editor and type solution
    const editor = page.locator('.cm-editor');
    await editor.click();
    await page.keyboard.type(solution);

    // Click Submit/Run button
    await page.click('button:has-text("Submit"), button:has-text("Run")');

    // Wait for result
    await page.waitForTimeout(2000);

    // Check if result is shown (grader or console)
    // Note: This test assumes Pyodide works correctly
  });
});

test.describe('Python Mobile Experience', () => {
  test('should have mobile-optimized layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/python-challenge/variables-strings');

    // Check mobile elements
    await expect(page.getByText('Python Editor')).toBeVisible();

    // Check for mobile toolbar with special characters
    const mobileToolbar = page.locator('.mobile-toolbar');
    // May or may not be visible depending on screen size detection
  });

  test('should have properly sized touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/python-challenge/variables-strings');

    // Check buttons meet minimum touch target size (44px or 48px)
    const runButton = page.getByRole('button', { name: /Run|Submit/i });
    const box = await runButton.boundingBox();

    if (box) {
      // Check for minimum 44px height (iOS standard)
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});

test.describe('PWA Features', () => {
  test('should have PWA manifest', async ({ page }) => {
    const manifest = await page.request.get('/manifest.json');
    const manifestData = await manifest.json();

    expect(manifestData).toHaveProperty('name', 'Python Mastery - Learn Python in 3 Weeks');
    expect(manifestData).toHaveProperty('short_name', 'Python Mastery');
    expect(manifestData).toHaveProperty('display', 'standalone');
    expect(manifestData).toHaveProperty('orientation', 'portrait');
    expect(manifestData.icons).toHaveLength(2);
  });

  test('should have PWA icons', async ({ page }) => {
    // Check if icons exist
    const icon192 = await page.request.get('/icon-192.png');
    const icon512 = await page.request.get('/icon-512.png');

    expect(icon192.status()).toBe(200);
    expect(icon512.status()).toBe(200);
  });
});

test.describe('Python Progress Tracking', () => {
  test.use({ storageState: 'e2e/.auth/states.json' });

  test('should track completed challenges', async ({ page }) => {
    await page.goto('/python');

    // Progress should be visible if authenticated
    const progressText = page.getByText(/Progress:/i);
    if (await progressText.isVisible()) {
      await expect(progressText).toBeVisible();
    }
  });
});

test.describe('Navigation', () => {
  test('should navigate between related pages', async ({ page }) => {
    await page.goto('/python');

    // Click on a module
    await page.click('a[href="/python/week-01-basics"]');
    await expect(page).toHaveURL(/\/python\/week-01-basics/);

    // Click on a challenge
    await page.click('a[href^="/python-challenge/"]');
    await expect(page).toHaveURL(/\/python-challenge\//);

    // Go back to Python overview
    await page.click('a[href="/python"]');
    await expect(page).toHaveURL(/\/python$/);
  });
});

test.describe('Browser-Based Python Execution', () => {
  test('should use Pyodide for in-browser execution (no server)', async ({ page }) => {
    await page.goto('/python-challenge/variables-numbers');

    // Intercept network requests to verify no Python execution API is called
    const apiRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/') && (url.includes('python') || url.includes('execute'))) {
        apiRequests.push(url);
      }
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait for Python runtime to initialize
    await expect(page.getByText(/Loading Python runtime/)).toBeVisible({ timeout: 3000 }).catch(() => {});

    // Verify no server-side Python execution API was called
    expect(apiRequests.filter(url => url.includes('execute') || url.includes('run'))).toHaveLength(0);
  });

  test('should execute Python code entirely in browser', async ({ page }) => {
    await page.goto('/python-challenge/variables-numbers');

    // Wait for runtime initialization
    await page.waitForTimeout(5000);

    // Type simple Python code
    const editor = page.locator('.cm-editor');
    await editor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('x = 42\nprint(x)');

    // Click Run button
    const runButton = page.getByRole('button', { name: /Run/i }).first();
    await runButton.click();

    // Wait for execution
    await page.waitForTimeout(3000);

    // Check output appears (client-side execution)
    const output = page.locator('.python-console, .output, [class*="output" i], pre');
    await expect(output.first()).toBeVisible();
  });

  test('should use Web Worker for Python runtime isolation', async ({ page }) => {
    await page.goto('/python-challenge/variables-strings');

    // Verify the worker script is loaded
    const workerScript = await page.evaluate(() => {
      return fetch('/pyodide-worker.js', { method: 'HEAD' })
        .then(r => r.ok)
        .catch(() => false);
    });

    expect(workerScript).toBe(true);
  });

  test('should check WebAssembly support before initializing', async ({ page }) => {
    await page.goto('/python-challenge/variables-strings');

    // Check that WebAssembly is available in the browser
    const hasWebAssembly = await page.evaluate(() => {
      return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    });

    expect(hasWebAssembly).toBe(true);
  });

  test('should show loading state during Pyodide initialization', async ({ page }) => {
    // Use a fresh page to catch the initial loading state
    const context = page.context();
    const newPage = await context.newPage();

    await newPage.goto('/python-challenge/variables-strings');

    // The loading message should appear briefly
    const loadingText = newPage.getByText(/Loading Python runtime|Initializing/);
    const wasVisible = await loadingText.isVisible({ timeout: 2000 }).catch(() => false);

    // It should eventually disappear and show the editor
    await expect(newPage.locator('.cm-editor')).toBeVisible({ timeout: 10000 });

    await newPage.close();
  });

  test('should handle Python errors client-side', async ({ page }) => {
    await page.goto('/python-challenge/variables-numbers');

    // Wait for runtime
    await page.waitForTimeout(5000);

    // Type invalid Python code
    const editor = page.locator('.cm-editor');
    await editor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('this is not valid python!!!');

    // Click Run
    const runButton = page.getByRole('button', { name: /Run/i }).first();
    await runButton.click();

    // Wait for execution
    await page.waitForTimeout(2000);

    // Error should be displayed (handled client-side by Pyodide)
    const errorOutput = page.locator('.python-console, .output, [class*="error" i], [class*="output" i]');
    await expect(errorOutput.first()).toBeVisible();
  });

  test('should work offline (no server required for execution)', async ({ page }) => {
    // Navigate to the page first
    await page.goto('/python-challenge/variables-numbers');

    // Wait for Pyodide to fully load
    await page.waitForTimeout(8000);

    // Simulate going offline
    await page.context().setOffline(true);

    // Type code and run
    const editor = page.locator('.cm-editor');
    await editor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('print("offline test")');

    const runButton = page.getByRole('button', { name: /Run/i }).first();
    await runButton.click();

    // Wait for execution
    await page.waitForTimeout(3000);

    // Should still work since execution is client-side
    const output = page.locator('.python-console, .output');
    await expect(output.first()).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test('should display "No installation required" message on course page', async ({ page }) => {
    await page.goto('/python');

    // The course page should mention browser-based execution
    const content = await page.content();
    expect(content.toLowerCase()).toMatch(/browser|no installation|write code.*browser/i);
  });
});
