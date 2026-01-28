import type { GradeResult, QueryResult, QueryTest } from '@/types';

export function gradeQuery(
  userQuery: string,
  userResults: QueryResult | null,
  tests: QueryTest[],
  solutionResults?: QueryResult
): GradeResult {
  const hints: string[] = [];
  let passed = true;

  // Normalize user query for checking
  const normalizedQuery = userQuery.trim().toUpperCase();

  for (const test of tests) {
    // Check required keywords
    if (test.mustContain) {
      for (const keyword of test.mustContain) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (!regex.test(userQuery)) {
          hints.push(`Your query should use ${keyword}`);
          passed = false;
        }
      }
    }

    // Check forbidden patterns
    if (test.forbidden) {
      for (const pattern of test.forbidden) {
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        if (regex.test(userQuery)) {
          hints.push(`Don't use ${pattern} for this problem`);
          passed = false;
        }
      }
    }

    // Check columns
    if (test.expectedColumns && userResults) {
      const userCols = userResults.columns.map((c) => c.toLowerCase());
      const expectedCols = test.expectedColumns.map((c) => c.toLowerCase());

      // Check if all expected columns are present
      for (const col of expectedCols) {
        if (!userCols.includes(col)) {
          hints.push(`Missing column: ${col}`);
          passed = false;
        }
      }

      // Check if column count matches (exact match for select queries)
      if (userCols.length !== expectedCols.length) {
        hints.push(
          `Expected ${expectedCols.length} column(s), got ${userCols.length}`
        );
        passed = false;
      }
    }

    // Check row count
    if (test.expectedRowCount !== undefined && userResults) {
      if (userResults.rowCount !== test.expectedRowCount) {
        hints.push(
          `Expected ${test.expectedRowCount} row(s), got ${userResults.rowCount}`
        );
        passed = false;
      }
    }

    // Compare with solution results if available
    if (solutionResults && userResults && test.assertExactOrder !== false) {
      if (!compareResults(userResults, solutionResults)) {
        hints.push('Your results do not match the expected output');
        passed = false;
      }
    }
  }

  return {
    passed,
    score: passed ? 100 : Math.max(0, 100 - hints.length * 25),
    feedback: passed ? 'Correct!' : 'Not quite right. Check the hints below.',
    hints,
    userResults: userResults || undefined,
    expectedResults: solutionResults || undefined,
  };
}

function compareResults(
  userResults: QueryResult,
  expectedResults: QueryResult
): boolean {
  // Check column count
  if (userResults.columns.length !== expectedResults.columns.length) {
    return false;
  }

  // Check row count
  if (userResults.rowCount !== expectedResults.rowCount) {
    return false;
  }

  // Sort both results for comparison (unless order matters)
  const userValues = sortValues(userResults.values);
  const expectedValues = sortValues(expectedResults.values);

  // Compare values
  for (let i = 0; i < userValues.length; i++) {
    for (let j = 0; j < userValues[i].length; j++) {
      if (String(userValues[i][j]) !== String(expectedValues[i][j])) {
        return false;
      }
    }
  }

  return true;
}

function sortValues(values: any[][]): any[][] {
  return [...values].sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const aVal = a[i];
      const bVal = b[i];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        if (aVal !== bVal) return aVal - bVal;
      } else {
        const aStr = String(aVal);
        const bStr = String(bVal);
        if (aStr !== bStr) return aStr.localeCompare(bStr);
      }
    }
    return a.length - b.length;
  });
}

export function executeSolution(
  db: any,
  solution: string
): QueryResult | null {
  try {
    const results = db.exec(solution);

    if (results.length === 0) {
      return { columns: [], values: [], rowCount: 0 };
    }

    return {
      columns: results[0].columns,
      values: results[0].values,
      rowCount: results[0].values.length,
    };
  } catch (err) {
    console.error('Error executing solution:', err);
    return null;
  }
}
