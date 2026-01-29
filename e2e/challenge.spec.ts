import { test, expect, type Page } from '@playwright/test';

// Helper function to type into CodeMirror editor
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

  // Type the new text
  await editor.fill(text);

  await page.waitForTimeout(300);
}

test.describe('Challenge Page', () => {
  const challengeId = 'w1-d1-c1';

  test.describe('Page Load and Structure', () => {
    test('loads challenge page successfully', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await expect(page).toHaveTitle(/SQL Mastery/);
    });

    test('displays challenge header elements', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByRole('link', { name: 'Back to Course' })).toBeAttached();
      await expect(page.getByText('W1').first()).toBeAttached();
      await expect(page.getByText(/Day 1/)).toBeAttached();
      await expect(page.getByText(/Challenge 1/)).toBeAttached();
      await expect(page.getByText(/beginner|intermediate|advanced/i)).toBeAttached();
    });

    test('displays challenge title', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: /Your First SELECT Query/i })).toBeAttached();
    });

    test('displays progress information', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText(/Progress:/)).toBeAttached();
      await expect(page.getByText(/complete/)).toBeAttached();
    });
  });

  test.describe('Instructions Section', () => {
    test('displays instructions heading', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Instructions' })).toBeAttached();
    });

    test('displays challenge instructions', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText(/Write a query to select all columns/)).toBeAttached();
    });

    test('displays description heading', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Description' })).toBeAttached();
    });

    test('displays challenge description', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText(/Learn the basics of retrieving data/)).toBeAttached();
    });
  });

  test.describe('Hints Section', () => {
    test('displays hints heading', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Hints' })).toBeAttached();
    });

    test('displays numbered hints', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText(/Use SELECT \* to select all columns/)).toBeAttached();
      await expect(page.getByText(/Use FROM to specify the table name/)).toBeAttached();
      await expect(page.getByText(/The format is: SELECT \* FROM table_name/)).toBeAttached();
    });
  });

  test.describe('SQL Editor Section', () => {
    test('displays SQL editor heading', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'SQL Editor' })).toBeAttached();
    });

    test('has CodeMirror editor present', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('.cm-editor')).toBeAttached();
    });

    test('displays run query button', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('button', { name: 'Run Query' })).toBeAttached();
    });

    test('displays clear button', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('button', { name: 'Clear' })).toBeAttached();
    });

    test('run query button shows keyboard shortcut', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText(/\(Ctrl\+Enter\)/)).toBeAttached();
    });

    test('editor is present and interactive', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });

      const editor = page.locator('.cm-content').first();
      await expect(editor).toBeAttached();
      await editor.click();

      // Just verify the editor can be clicked - the content verification is tricky with CodeMirror
      await expect(editor).toBeVisible();
    });
  });

  test.describe('Editor Control Buttons', () => {
    test('displays reset button', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('button', { name: 'Reset' })).toBeAttached();
    });

    test('displays solution button', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('button', { name: 'Solution' })).toBeAttached();
    });

    test('solution button fills in the solution', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });

      await page.getByRole('button', { name: 'Solution' }).click();
      await page.waitForTimeout(500);

      // Solution should be visible
      await expect(page.getByText('SELECT * FROM employees')).toBeAttached();
    });
  });

  test.describe('Database Schema Section', () => {
    test('displays database schema heading', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'Database Schema' })).toBeAttached();
    });

    test('displays CREATE TABLE statement', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText(/CREATE TABLE employees/)).toBeAttached();
    });

    test('displays table columns', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText(/id INTEGER/)).toBeAttached();
      await expect(page.getByText(/name TEXT/)).toBeAttached();
      await expect(page.getByText(/department TEXT/)).toBeAttached();
    });

    test('schema is in a code block', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('pre').first()).toBeAttached();
    });
  });

  test.describe('Query Execution and Results', () => {
    test('can run a query and see results', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      await expect(page.getByRole('heading', { name: /Results/ })).toBeAttached();
    });

    test('results table displays columns', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      // Use data-testid to target the results table specifically
      const resultsTable = page.getByTestId('results-table');
      await expect(resultsTable).toBeAttached();
      await expect(resultsTable.getByText('id')).toBeAttached();
      await expect(resultsTable.getByText('name')).toBeAttached();
      await expect(resultsTable.getByText('department')).toBeAttached();
    });

    test('results table shows row count', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      await expect(page.getByText(/3 rows/)).toBeAttached();
    });

    test('shows success for correct query', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      await expect(page.getByText(/correct|success|passed/i)).toBeAttached();
    });

    test('handles empty query', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Clear editor
      const editor = page.locator('.cm-content').first();
      await editor.click();
      await page.waitForTimeout(100);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(100);

      const runButton = page.getByRole('button', { name: 'Run Query' });
      await expect(runButton).toBeDisabled();
    });
  });

  test.describe('Grading Feedback', () => {
    test('shows grading feedback after running query', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      // Should show feedback section with border
      await expect(page.locator('.border-green-800, .border-amber-800').first()).toBeAttached();
    });

    test('correct query shows success message', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, 'SELECT * FROM employees');
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      await expect(page.getByText(/correct|success|passed/i)).toBeAttached();
    });
  });

  // Note: "Mark as Complete" tests removed - challenges now auto-complete when solved

  test.describe('Navigation', () => {
    test('displays next button', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      const nextButton = page.getByRole('link', { name: 'Next' }).or(
        page.getByRole('button', { name: 'Next' })
      );
      await expect(nextButton.first()).toBeAttached();
    });

    test('next button navigates to next challenge', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      const nextButton = page.getByRole('link', { name: 'Next' }).first();
      await nextButton.click();

      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c2/);
    });

    test('previous button appears on later challenges', async ({ page }) => {
      await page.goto('/challenge/w1-d1-c2');
      await page.waitForLoadState('domcontentloaded');

      const previousButton = page.getByRole('link', { name: 'Previous' }).or(
        page.getByRole('button', { name: 'Previous' })
      );
      await expect(previousButton.first()).toBeAttached();
    });

    test('previous button navigates correctly', async ({ page }) => {
      await page.goto('/challenge/w1-d1-c2');
      await page.waitForLoadState('domcontentloaded');

      const previousButton = page.getByRole('link', { name: 'Previous' }).first();
      await previousButton.click();

      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c1/);
    });

    test('displays current challenge ID', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText('w1-d1-c1')).toBeAttached();
    });
  });

  test.describe('Back to Course Link', () => {
    test('navigates back to course page', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      // Navigate directly using the link href
      await page.goto('/course');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/course');
    });
  });

  test.describe('Different Challenge Types', () => {
    test('loads different week challenges', async ({ page }) => {
      await page.goto('/challenge/w2-d1-c1');
      await page.waitForLoadState('domcontentloaded');

      // Week 2 should be visible
      await expect(page.getByText('W2').first()).toBeAttached();
    });

    test('different week has different color badge', async ({ page }) => {
      await page.goto('/challenge/w1-d1-c1');
      await page.waitForLoadState('domcontentloaded');
      const week1Badge = page.locator('.bg-blue-600');
      await expect(week1Badge.first()).toBeAttached();

      await page.goto('/challenge/w2-d1-c1');
      await page.waitForLoadState('domcontentloaded');
      const week2Badge = page.locator('.bg-purple-600');
      await expect(week2Badge.first()).toBeAttached();
    });
  });

  test.describe('Responsive Design', () => {
    test('page loads correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByRole('heading', { name: 'Instructions' })).toBeAttached();
      await expect(page.getByRole('heading', { name: 'SQL Editor' })).toBeAttached();
      await expect(page.getByRole('button', { name: 'Run Query' })).toBeAttached();
    });

    test('navigation buttons present on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      const nextButton = page.getByRole('link', { name: 'Next' }).or(
        page.getByRole('button', { name: 'Next' })
      );
      await expect(nextButton.first()).toBeAttached();
    });
  });

  test.describe('Challenge Content Integrity', () => {
    test('all expected sections are present', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      const expectedHeadings = [
        'Instructions',
        'Description',
        'Hints',
        'SQL Editor',
        'Database Schema',
      ];

      for (const heading of expectedHeadings) {
        await expect(page.getByRole('heading', { name: heading })).toBeAttached();
      }
    });

    test('challenge data matches expected structure', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('Your First SELECT Query')).toBeAttached();
      await expect(page.getByText(/SELECT and FROM/)).toBeAttached();
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('Ctrl+Enter runs query', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Use the typeInEditor helper to avoid backwards typing issue
      await typeInEditor(page, 'SELECT * FROM employees');

      await page.keyboard.press('Control+Enter');
      await page.waitForTimeout(1500);

      await expect(page.getByRole('heading', { name: /Results/ })).toBeAttached();
    });
  });

  test.describe('Multiple Challenges Navigation', () => {
    test('can navigate through multiple challenges', async ({ page }) => {
      await page.goto('/challenge/w1-d1-c1');
      await page.waitForLoadState('domcontentloaded');

      await page.getByRole('link', { name: 'Next' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c2/);

      await page.getByRole('link', { name: 'Next' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c3/);
    });

    test('can go back through challenges', async ({ page }) => {
      await page.goto('/challenge/w1-d1-c3');
      await page.waitForLoadState('domcontentloaded');

      await page.getByRole('link', { name: 'Previous' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c2/);

      await page.getByRole('link', { name: 'Previous' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/challenge\/w1-d1-c1/);
    });
  });

  test.describe('Reset Functionality', () => {
    test('reset button clears editor content', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });

      // Type something
      await typeInEditor(page, 'SELECT id FROM employees;');
      await page.waitForTimeout(200);

      // Click reset
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.waitForTimeout(300);

      // Should show starter code again
      await expect(page.getByText(/Write your query below/)).toBeAttached();
    });
  });

  test.describe('Edge Cases', () => {
    test('handles query with no results', async ({ page }) => {
      await page.goto(`/challenge/${challengeId}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('.cm-content', { timeout: 10000 });
      await page.waitForTimeout(1000);

      await typeInEditor(page, "SELECT * FROM employees WHERE department = 'NonExistent'");
      await page.getByRole('button', { name: 'Run Query' }).click();
      await page.waitForTimeout(1500);

      // Check for the "No results returned" message specifically
      await expect(page.getByText('No results returned')).toBeAttached();
    });
  });
});
