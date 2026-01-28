// Python Grading System - pytest-style test runner

import type { TestCase, TestResult, GradingResult } from '@/types/python';
import { executePython } from './runner';
import { parsePythonError, getHelpfulMessage } from './errors';

export async function gradePythonSubmission(
  code: string,
  tests: TestCase[],
  pyodideInitialized: boolean
): Promise<GradingResult> {
  if (!pyodideInitialized) {
    return {
      passed: false,
      tests: [],
      feedback: 'Python runtime is not initialized. Please wait for it to load.',
      xpEarned: 0,
    };
  }

  const results: TestResult[] = [];

  // Run each test
  for (const test of tests) {
    try {
      // First run user code
      await executePython(code);

      // Then run the test code
      const testResult = await executePython(test.code);

      if (testResult.success) {
        results.push({
          name: test.name,
          passed: true,
          error: null,
          output: testResult.output,
        });
      } else {
        results.push({
          name: test.name,
          passed: false,
          error: testResult.error || 'Test failed',
          output: testResult.traceback || '',
        });
      }
    } catch (error: any) {
      const parsedError = parsePythonError(error);
      results.push({
        name: test.name,
        passed: false,
        error: parsedError.message,
        output: parsedError.traceback.join('\n'),
      });
    }
  }

  const passed = results.every((r) => r.passed);
  const passedCount = results.filter((r) => r.passed).length;

  return {
    passed,
    tests: results,
    feedback: generateFeedback(results, passedCount, tests.length),
    xpEarned: passed ? 10 : 0,
  };
}

function generateFeedback(
  results: TestResult[],
  passedCount: number,
  totalTests: number
): string {
  if (results.every((r) => r.passed)) {
    return `All tests passed! (${totalTests}/${totalTests})`;
  }

  const failed = results.filter((r) => !r.passed);
  const failedNames = failed.map((f) => f.name).join(', ');

  let feedback = `${passedCount}/${totalTests} tests passed. `;

  if (failed.length === 1) {
    feedback += `Failed test: ${failedNames}`;
  } else {
    feedback += `Failed tests: ${failedNames}`;
  }

  return feedback;
}

export function generateHintFromError(testResult: TestResult): string {
  if (!testResult.error) {
    return 'Check your solution and try again.';
  }

  // Parse error for helpful hints
  const errorLower = testResult.error.toLowerCase();

  if (errorLower.includes('assertionerror')) {
    // Extract assertion details
    const assertionMatch = testResult.error.match(/assert (.+)/);
    if (assertionMatch) {
      return `Assertion failed: ${assertionMatch[1]}. Make sure your solution meets this requirement.`;
    }
  }

  if (errorLower.includes('nameerror')) {
    const nameMatch = testResult.error.match(/name '(\w+)'/);
    if (nameMatch) {
      return `The variable or function "${nameMatch[1]}" is not defined. Check for typos.`;
    }
  }

  if (errorLower.includes('typeerror')) {
    return 'There is a type error. Check that you are using the correct data types.';
  }

  if (errorLower.includes('attributeerror')) {
    return 'An object does not have the attribute or method you are trying to access.';
  }

  if (errorLower.includes('indexerror')) {
    return 'You are trying to access an index that is out of range. Check your list bounds.';
  }

  return 'Review the error message and check your logic.';
}

export function getNextChallengeSlug(
  currentSlug: string,
  allSlugs: string[]
): string | undefined {
  const currentIndex = allSlugs.indexOf(currentSlug);
  if (currentIndex >= 0 && currentIndex < allSlugs.length - 1) {
    return allSlugs[currentIndex + 1];
  }
  return undefined;
}

export function getPreviousChallengeSlug(
  currentSlug: string,
  allSlugs: string[]
): string | undefined {
  const currentIndex = allSlugs.indexOf(currentSlug);
  if (currentIndex > 0) {
    return allSlugs[currentIndex - 1];
  }
  return undefined;
}
