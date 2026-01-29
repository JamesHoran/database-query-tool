// Debug test for Python Challenge - isolates each stage
import { test, expect } from '@playwright/test';

test.describe('Python Challenge Debug Test', () => {
  test('debug variables-strings challenge with detailed logging', async ({ page }) => {
    // Enable console log capture
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      console.log(`[Browser Console ${msg.type()}]`, text);
    });

    // Enable error tracking
    const errors: string[] = [];
    page.on('pageerror', error => {
      const errText = error.message || String(error);
      errors.push(errText);
      console.error('[Browser Error]', errText);
    });

    // Enable request/response tracking
    page.on('request', request => {
      console.log('[Request]', request.method(), request.url());
    });

    page.on('response', response => {
      const status = response.status();
      if (status >= 400) {
        console.error('[Response Error]', status, response.url());
      }
    });

    // STEP 1: Navigate to challenge page
    console.log('\n=== STEP 1: Navigating to challenge page ===');
    try {
      const response = await page.goto('/python-challenge/variables-strings', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      console.log('[Navigation] Status:', response?.status());
      expect(response?.status()).toBe(200);
    } catch (error) {
      console.error('[Navigation FAILED]', error);
      throw error;
    }

    // STEP 2: Check page loaded
    console.log('\n=== STEP 2: Checking page elements ===');
    try {
      const title = await page.locator('h1').textContent({ timeout: 5000 });
      console.log('[Page] Title:', title);
      expect(title).toContain('Variables and Strings');
    } catch (error) {
      console.error('[Page Title Check FAILED]', error);
      throw error;
    }

    // STEP 3: Check for Python runtime loading
    console.log('\n=== STEP 3: Checking Python runtime status ===');
    try {
      // Wait for either loading message or runtime ready
      const loadingSelector = page.locator('text=/Loading Python runtime/i');
      const isLoaded = await loadingSelector.isVisible().catch(() => false);
      console.log('[Runtime] Loading indicator visible:', isLoaded);

      // Wait for loading to complete (timeout after 15 seconds)
      console.log('[Runtime] Waiting for initialization...');
      await page.waitForSelector('text=/Loading Python runtime/i', { state: 'detached', timeout: 15000 }).catch(() => {
        console.log('[Runtime] Loading indicator detached or never appeared');
      });

      // Additional wait for worker to be ready
      await page.waitForTimeout(2000);
      console.log('[Runtime] Wait complete');
    } catch (error) {
      console.error('[Runtime Check FAILED]', error);
    }

    // STEP 4: Check for runtime errors
    console.log('\n=== STEP 4: Checking for runtime errors ===');
    const errorBox = page.locator('.bg-red-900\\/20, [class*="red"]').first();
    const hasRuntimeError = await errorBox.isVisible().catch(() => false);
    if (hasRuntimeError) {
      const errorText = await errorBox.textContent();
      console.error('[Runtime Error Found]', errorText);
    } else {
      console.log('[Runtime] No visible runtime errors');
    }

    // STEP 5: Check if editor is available
    console.log('\n=== STEP 5: Checking editor availability ===');
    try {
      // Use .cm-editor which is the main container
      const editor = page.locator('.cm-editor').first();
      await expect(editor).toBeVisible({ timeout: 5000 });
      console.log('[Editor] CodeMirror editor is visible');

      // Check if editor is disabled (runtime not ready)
      const runButton = page.locator('button:has-text("Run")').first();
      const isDisabled = await runButton.isDisabled();
      console.log('[Editor] Run button disabled (runtime not ready):', isDisabled);
    } catch (error) {
      console.error('[Editor Check FAILED]', error);
    }

    // STEP 6: Check console output area
    console.log('\n=== STEP 6: Checking console output area ===');
    try {
      const outputArea = page.locator('text=/Output will appear here/i, .python-console, [class*="console"]');
      const isVisible = await outputArea.first().isVisible().catch(() => false);
      console.log('[Console] Output area visible:', isVisible);
    } catch (error) {
      console.error('[Console Check FAILED]', error);
    }

    // STEP 7: Test code execution
    console.log('\n=== STEP 7: Testing code execution ===');
    try {
      // Use a simpler approach: inject code directly via CodeMirror's API
      const testCode = 'print("Hello from Pyodide!")';
      console.log('[Execution] Setting test code:', testCode);

      // Set the editor content by evaluating JavaScript that accesses CodeMirror
      await page.evaluate((code) => {
        // Find the CodeMirror editor and set its content
        const editor = document.querySelector('.cm-editor');
        if (editor && (editor as any).cmView) {
          const cm = (editor as any).cmView;
          if (cm.dispatch) {
            cm.dispatch({
              changes: { from: 0, to: cm.state.doc.length, insert: code },
            });
          }
        }
      }, testCode);
      await page.waitForTimeout(500);

      // Click Run button
      console.log('[Execution] Clicking Run button...');
      const runButton = page.locator('button:has-text("Run")').first();
      await runButton.click();

      // Wait for execution
      await page.waitForTimeout(3000);

      // Check for output
      const outputText = await page.locator('.python-console, [class*="console"], [class*="output"]').first().textContent();
      console.log('[Execution] Output:', outputText?.substring(0, 200));

      if (outputText?.includes('Hello from Pyodide!')) {
        console.log('[Execution] SUCCESS: Code executed correctly');
      } else if (outputText?.includes('error') || outputText?.includes('Error')) {
        console.error('[Execution] FAILED: Error in output:', outputText);
      } else {
        console.warn('[Execution] WARNING: Expected output not found');
      }
    } catch (error) {
      console.error('[Execution Test FAILED]', error);
    }

    // STEP 8: Summary
    console.log('\n=== DEBUG SUMMARY ===');
    console.log('[Logs] Total console messages:', logs.length);
    console.log('[Errors] Total errors caught:', errors.length);
    if (errors.length > 0) {
      console.error('[Errors] All errors:', errors);
    }

    // Check for Pyodide worker logs
    const pyodideLogs = logs.filter(log =>
      log.includes('PyodideWorker') ||
      log.includes('pyodide') ||
      log.includes('Python')
    );
    console.log('[Pyodide] Worker logs:', pyodideLogs.length);
    pyodideLogs.forEach(log => console.log('  -', log));

    // Screenshot for visual debugging
    await page.screenshot({ path: 'test-results/python-debug-screenshot.png' });
    console.log('[Screenshot] Saved to test-results/python-debug-screenshot.png');
  });

  test('check pyodide worker availability', async ({ page }) => {
    console.log('\n=== Testing Pyodide Worker File ===');
    const response = await page.request.get('/pyodide-worker.js');
    console.log('[Worker File] Status:', response.status());
    console.log('[Worker File] Content-Type:', response.headers()['content-type']);
    expect(response.status()).toBe(200);

    const text = await response.text();
    console.log('[Worker File] Size:', text.length, 'bytes');
    console.log('[Worker File] Contains PyodideWorker:', text.includes('PyodideWorker'));
    console.log('[Worker File] Contains initialize:', text.includes('initialize'));
  });

  test('check CDN availability', async ({ page }) => {
    console.log('\n=== Testing Pyodide CDN ===');
    const cdnUrl = 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js';
    try {
      const response = await page.request.get(cdnUrl);
      console.log('[CDN] Status:', response.status());
      expect(response.status()).toBe(200);
    } catch (error) {
      console.error('[CDN] Request FAILED:', error);
      throw error;
    }
  });
});
