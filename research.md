# Research: Building a 2-Week SQL Mastery Course in Next.js/React

## Executive Summary

This research document outlines how to create an interactive SQL learning platform using Next.js 16, React 19, and TypeScript that prepares learners for SQL interviews within 2 weeks. The platform follows the FreeCodeCamp model—browser-based, interactive, challenge-driven, and completely free.

---

## Part I: Technical Architecture

### 1. Core Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript | Latest features, App Router, Server Components |
| SQL Engine | **sql.js** (SQLite via WebAssembly) | Zero backend, runs entirely in browser, offline capable |
| Code Editor | **CodeMirror 6** with `@codemirror/lang-sql` | Lightweight, modular, excellent SQL syntax highlighting |
| Styling | Tailwind CSS 4 | Already configured, rapid UI development |
| State Management | React Hooks + Context | Built-in useState/useContext sufficient for scope |
| Progress Storage | localStorage | Simple persistence, no backend required for MVP |

### 2. SQL Execution Strategy

#### Recommended: sql.js for MVP

**sql.js** is a complete SQLite database compiled to WebAssembly. This is ideal for a learning platform because:

- Zero infrastructure costs
- True offline functionality
- Complete data isolation per session
- Fast enough for learning datasets (thousands of rows)
- Supports standard SQL: SELECT, JOIN, GROUP BY, CTEs, Window Functions

```typescript
// hooks/useSqlJs.ts
import { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';

export function useSqlJs() {
  const [db, setDb] = useState<SQL.Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const SQL = await initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        const database = new SQL.Database();
        setDb(database);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return { db, loading, error };
}
```

**Alternative for Advanced Analytics**: DuckDB-WASM
- Superior for window functions and large datasets
- Better performance for analytical queries
- Supports CSV/Parquet import
- Consider for "Advanced Analytics" module

### 3. Code Editor Integration

**CodeMirror 6** is recommended over Monaco Editor for this use case:

```typescript
// components/SQLEditor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';

export function SQLEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <CodeMirror
      value={value}
      height="300px"
      extensions={[sql()]}
      theme={oneDark}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        searchKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
    />
  );
}
```

### 4. Data Models

```typescript
// types/challenge.ts
export interface Challenge {
  id: string;
  module: string;
  day: number;
  order: number;
  title: string;
  description: string;
  instructions: string;
  seedData: string;           // SQL to set up tables
  seedDataDisplay?: string;    // Optional: show data to user
  starterCode: string;         // Initial query in editor
  solution: string;            // For validation
  hints: string[];
  tests: QueryTest[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QueryTest {
  description: string;
  mustContain?: string[];      // Required SQL keywords
  forbidden?: string[];        // Anti-patterns to catch
  expectedColumns: string[];
  expectedRowCount?: number;   // Exact count or min/max
  validationQuery?: string;    // Run against user result
  assertExactOrder?: boolean;
}

export interface QueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
}

export interface GradeResult {
  passed: boolean;
  score: number;
  feedback: string;
  hints: string[];
  userResults?: QueryResult;
  expectedResults?: QueryResult;
}
```

```typescript
// types/progress.ts
export interface UserProgress {
  completedChallenges: string[];
  currentModule: string;
  currentDay: number;
  startedAt: string;
  lastActivityAt: string;
  attempts: Record<string, number>;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  days: number;
  challenges: Challenge[];
}
```

---

## Part II: 2-Week Curriculum Design

### Curriculum Philosophy

Based on research from FreeCodeCamp, Mode Analytics, Stanford, and SQLZoo, the optimal 2-week curriculum follows these principles:

1. **Progressive Complexity**: Each challenge builds on the previous
2. **Single Concept per Challenge**: 2-minute rule—each challenge solvable within 120 seconds
3. **Immediate Feedback**: Instant validation with specific, actionable feedback
4. **Real-World Context**: Use realistic datasets (e-commerce, analytics)
5. **Interview-Focused**: Include common interview patterns and gotchas

### The 2-Week Schedule (14 Days)

#### Week 1: Foundation (Days 1-7)
**Goal**: Master SQL basics and be able to write queries for common interview questions

| Day | Module | Topics | Challenges |
|-----|--------|--------|------------|
| 1 | SQL Fundamentals | SELECT, FROM, basic syntax, data types | 5 challenges |
| 2 | Filtering & Sorting | WHERE, AND/OR/NOT, IN, BETWEEN, ORDER BY, LIMIT | 6 challenges |
| 3 | Aggregation I | COUNT, SUM, AVG, MIN, MAX, GROUP BY basics | 6 challenges |
| 4 | Aggregation II | HAVING, multiple grouping, filtering groups | 5 challenges |
| 5 | Pattern Matching | LIKE, ILIKE, wildcards, NULL handling | 5 challenges |
| 6 | **Practice Day** | Mixed challenges, review, mini-project | 8 challenges |
| 7 | **Assessment** | Week 1 quiz, interview-style questions | 10 challenges |

#### Week 2: Advanced Concepts (Days 8-14)
**Goal**: Master JOINs, CTEs, Window Functions—the interview differentiators

| Day | Module | Topics | Challenges |
|-----|--------|--------|------------|
| 8 | INNER JOIN | Basic joins, join conditions, table aliases | 6 challenges |
| 9 | OUTER JOIN | LEFT/RIGHT/FULL joins, NULL handling in joins | 6 challenges |
| 10 | Complex JOINs | Self-joins, multi-table joins, join performance | 6 challenges |
| 11 | CTEs | WITH clause, query readability, multiple CTEs | 5 challenges |
| 12 | Window Functions | OVER, PARTITION BY, ranking functions | 6 challenges |
| 13 | Advanced Windows | LAG/LEAD, window frames, running totals | 5 challenges |
| 14 | **Final Assessment** | Comprehensive interview simulation | 12 challenges |

**Total: ~97 challenges across 14 days (~7 challenges/day average)**

### Module Breakdown

#### Module 1: SQL Fundamentals (Day 1)

**Dataset**: `employees` table

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  department TEXT,
  salary INTEGER,
  hire_date TEXT
);

INSERT INTO employees VALUES
  (1, 'John', 'Doe', 'john@company.com', 'Engineering', 95000, '2022-01-15'),
  (2, 'Jane', 'Smith', 'jane@company.com', 'Marketing', 75000, '2021-06-01'),
  (3, 'Bob', 'Johnson', 'bob@company.com', 'Engineering', 110000, '2020-03-20'),
  (4, 'Alice', 'Williams', 'alice@company.com', 'Sales', 85000, '2023-02-10');
```

**Challenge 1.1**: "Select All Columns"
```markdown
## Instructions
Write a query to select all columns from the employees table.

## Solution
```sql
SELECT * FROM employees;
```

## Tests
- Must contain: SELECT, FROM
```

**Challenge 1.2**: "Select Specific Columns"
```markdown
## Instructions
Select only the first_name and last_name columns from the employees table.

## Solution
```sql
SELECT first_name, last_name FROM employees;
```

## Tests
- Must contain: SELECT, FROM
- Must NOT contain: *
- Expected columns: first_name, last_name
```

#### Module 2: Filtering & Sorting (Day 2)

**Challenge 2.3**: "Multiple Conditions with OR"
```markdown
## Instructions
Find all employees in either 'Engineering' OR 'Marketing' departments.

## Solution
```sql
SELECT * FROM employees WHERE department = 'Engineering' OR department = 'Marketing';
```

## Tests
- Must contain: WHERE, OR
- Expected rows: 3
```

**Challenge 2.5**: "IN Operator"
```markdown
## Instructions
Rewrite the previous query using the IN operator.

## Solution
```sql
SELECT * FROM employees WHERE department IN ('Engineering', 'Marketing');
```

## Tests
- Must contain: IN
- Expected rows: 3
```

#### Module 3: Aggregation I (Day 3)

**Dataset**: Expanded `orders` table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  total_amount DECIMAL(10,2),
  status TEXT, -- 'pending', 'completed', 'cancelled'
  order_date TEXT
);
```

**Challenge 3.4**: "GROUP BY Single Column"
```markdown
## Instructions
Count the number of orders for each status.

## Expected Output
| status | count |
|--------|-------|
| completed | 45 |
| pending | 12 |
| cancelled | 5 |

## Solution
```sql
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
```
```

#### Module 8: INNER JOIN (Day 8)

**Dataset**: Multiple related tables
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  country TEXT
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  total DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Challenge 8.1**: "Basic Inner Join"
```markdown
## Instructions
Write a query that shows customer names alongside their order dates and totals.

## Solution
```sql
SELECT c.name, o.order_date, o.total
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
```
```

#### Module 11: CTEs (Day 11)

**Challenge 11.3**: "Multiple CTEs"
```markdown
## Instructions
Find customers who have spent more than $1000 total.
Use TWO CTEs: one to calculate customer totals, another to filter.

## Solution
```sql
WITH customer_totals AS (
  SELECT customer_id, SUM(total) as total_spent
  FROM orders
  GROUP BY customer_id
),
high_value_customers AS (
  SELECT customer_id
  FROM customer_totals
  WHERE total_spent > 1000
)
SELECT c.name, ct.total_spent
FROM customers c
INNER JOIN customer_totals ct ON c.id = ct.customer_id
WHERE ct.customer_id IN (SELECT customer_id FROM high_value_customers);
```
```

#### Module 12: Window Functions (Day 12)

**Challenge 12.2**: "RANK vs DENSE_RANK"
```markdown
## Instructions
Rank employees by salary within their department.
Use DENSE_RANK() so that ties don't skip numbers.

## Teaching Point
- RANK(): 1, 2, 2, 4 (skips 3)
- DENSE_RANK(): 1, 2, 2, 3 (no skip)

## Solution
```sql
SELECT
  first_name,
  department,
  salary,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank
FROM employees;
```
```

#### Module 13: Advanced Window Functions (Day 13)

**Challenge 13.3**: "Running Total"
```markdown
## Instructions
Calculate a running total of orders by date.
Show cumulative revenue for each day.

## Solution
```sql
SELECT
  order_date,
  total,
  SUM(total) OVER (ORDER BY order_date) as running_total
FROM orders
ORDER BY order_date;
```
```

**Challenge 13.5**: "Year-over-Year Comparison"
```markdown
## Instructions
Show each month's revenue compared to the same month last year.

## Solution
```sql
WITH monthly_sales AS (
  SELECT
    strftime('%Y-%m', order_date) as month,
    SUM(total) as revenue
  FROM orders
  GROUP BY 1
)
SELECT
  month,
  revenue,
  LAG(revenue, 12) OVER (ORDER BY month) as same_month_last_year,
  revenue - LAG(revenue, 12) OVER (ORDER BY month) as yoy_growth
FROM monthly_sales;
```
```

---

## Part III: Auto-Grading System

### Grading Strategy

The auto-grader uses multiple validation approaches:

```typescript
// lib/grader.ts
export interface GradeResult {
  passed: boolean;
  score: number;
  feedback: string;
  hints: string[];
}

export function gradeQuery(
  userQuery: string,
  userResults: QueryResult | null,
  errorMessage: string | null,
  tests: QueryTest[]
): GradeResult {
  // 1. Check for syntax errors
  if (errorMessage) {
    return {
      passed: false,
      score: 0,
      feedback: `Syntax Error: ${parseSQLError(errorMessage)}`,
      hints: getSyntaxHint(errorMessage)
    };
  }

  // 2. Run all tests
  const results = tests.map(test => runTest(userQuery, userResults, test));

  // 3. Aggregate results
  const passed = results.every(r => r.passed);
  const score = Math.round((results.filter(r => r.passed).length / results.length) * 100);

  return {
    passed,
    score,
    feedback: generateFeedback(results),
    hints: results.filter(r => !r.passed).flatMap(r => r.hints)
  };
}

function runTest(
  userQuery: string,
  userResults: QueryResult | null,
  test: QueryTest
): { passed: boolean; hints: string[] } {
  const hints: string[] = [];

  // Test 1: Required keywords
  if (test.mustContain) {
    for (const keyword of test.mustContain) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (!regex.test(userQuery)) {
        hints.push(`Your query should use ${keyword}`);
      }
    }
  }

  // Test 2: Forbidden patterns
  if (test.forbidden) {
    for (const pattern of test.forbidden) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(userQuery)) {
        hints.push(`Don't use ${pattern} for this problem`);
      }
    }
  }

  // Test 3: Column names
  if (test.expectedColumns && userResults) {
    const normalizedUserCols = userResults.columns.map(c => c.toLowerCase().trim());
    const normalizedExpectedCols = test.expectedColumns.map(c => c.toLowerCase().trim());

    for (const expected of normalizedExpectedCols) {
      if (!normalizedUserCols.includes(expected)) {
        hints.push(`Missing column: ${expected}`);
      }
    }

    if (normalizedUserCols.length !== normalizedExpectedCols.length) {
      hints.push(`Expected ${test.expectedColumns.length} columns, got ${userResults.columns.length}`);
    }
  }

  // Test 4: Row count
  if (test.expectedRowCount !== undefined && userResults) {
    if (userResults.rowCount !== test.expectedRowCount) {
      hints.push(`Expected ${test.expectedRowCount} rows, got ${userResults.rowCount}`);
    }
  }

  return {
    passed: hints.length === 0,
    hints
  };
}

function parseSQLError(error: string): string {
  // SQLite error messages to friendly hints
  const errorMap: Record<string, string> = {
    'near "SELECT": syntax error': 'Check your SELECT statement syntax',
    'no such table': 'Make sure you\'re using the correct table name',
    'no such column': 'Check your column names for typos',
    'ambiguous column name': 'Use table aliases (e.g., table.column) for columns with the same name',
  };

  for (const [pattern, hint] of Object.entries(errorMap)) {
    if (error.includes(pattern)) {
      return hint;
    }
  }

  return error;
}
```

### Validation Query Approach

For more complex validation, run a comparison query:

```typescript
function compareResults(
  db: SQL.Database,
  userQuery: string,
  expectedQuery: string
): { passed: boolean; feedback: string } {
  const userResults = db.exec(userQuery);
  const expectedResults = db.exec(expectedQuery);

  // Compare column names (order-insensitive)
  const userCols = userResults[0].columns.map(c => c.toLowerCase());
  const expectedCols = expectedResults[0].columns.map(c => c.toLowerCase());

  if (!arraysEqual(userCols, expectedCols)) {
    return {
      passed: false,
      feedback: `Column mismatch. Expected: ${expectedCols.join(', ')}`
    };
  }

  // Compare row counts
  if (userResults[0].values.length !== expectedResults[0].values.length) {
    return {
      passed: false,
      feedback: `Row count mismatch. Expected ${expectedResults[0].values.length}, got ${userResults[0].values.length}`
    };
  }

  // Compare values (order-insensitive for rows without ORDER BY)
  // ... more complex comparison logic

  return { passed: true, feedback: 'Correct!' };
}
```

---

## Part IV: UI/UX Design

### Main Layout

```
┌─────────────────────────────────────────────────────────────┐
│  SQL Mastery                    [Progress: Day 3/14]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Module: Aggregation I - Challenge 3.4                  │ │
│  │                                                         │ │
│  │ Count the number of orders for each status.            │ │
│  │                                                         │ │
│  │ Expected output:                                        │ │
│  │ │ status     │ count │                                │ │
│  │ │ completed  │ 45    │                                │ │
│  │ │ pending    │ 12    │                                │ │
│  │ │ cancelled  │ 5     │                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ SELECT   FROM orders                                    │ │
│  │                                                          │ │
│  │ [▶ Run Query]  [Reset]  [Show Hint]                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Results                                                 │ │
│  │ ┌─────────────────────────────┐                        │ │
│  │ │ status     │ count │        │                        │ │
│  │ │ completed  │ 45    │        │                        │ │
│  │ └─────────────────────────────┘                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [← Previous]          [Next Challenge →]                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```typescript
// app/challenges/[moduleId]/[day]/[challengeId]/page.tsx
export default function ChallengePage({ params }: { params: ChallengeParams }) {
  const challenge = getChallenge(params.challengeId);
  const { db } = useSqlJs();
  const { query, setQuery, results, error, runQuery } = useQueryExecutor(db);
  const { gradeResult, submitQuery } = useGrader(challenge, db);
  const { progress, saveProgress } = useProgress();

  return (
    <div className="flex h-screen">
      <Sidebar progress={progress} />
      <main className="flex-1 p-6">
        <ChallengeHeader challenge={challenge} />
        <ChallengeDescription challenge={challenge} />
        <SQLEditor value={query} onChange={setQuery} />
        <QueryActions onRun={runQuery} onSubmit={submitQuery} />
        <ResultsDisplay results={results} error={error} />
        <FeedbackPanel result={gradeResult} />
      </main>
    </div>
  );
}
```

---

## Part V: Progress Tracking

```typescript
// hooks/useProgress.ts
import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sql-mastery-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      // Initialize new progress
      const initialProgress: UserProgress = {
        completedChallenges: [],
        currentModule: 'sql-fundamentals',
        currentDay: 1,
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        attempts: {}
      };
      setProgress(initialProgress);
      localStorage.setItem('sql-mastery-progress', JSON.stringify(initialProgress));
    }
  }, []);

  const markComplete = (challengeId: string) => {
    if (!progress) return;

    const updated: UserProgress = {
      ...progress,
      completedChallenges: [...progress.completedChallenges, challengeId],
      lastActivityAt: new Date().toISOString(),
      attempts: {
        ...progress.attempts,
        [challengeId]: (progress.attempts[challengeId] || 0) + 1
      }
    };

    setProgress(updated);
    localStorage.setItem('sql-mastery-progress', JSON.stringify(updated));
  };

  const getModuleProgress = (moduleId: string, totalChallenges: number) => {
    if (!progress) return 0;
    const moduleChallenges = getChallengesByModule(moduleId);
    const completed = moduleChallenges.filter(c => progress.completedChallenges.includes(c.id)).length;
    return Math.round((completed / totalChallenges) * 100);
  };

  return { progress, markComplete, getModuleProgress };
}
```

---

## Part VI: Interview-Prep Additions

### Day 14: Final Interview Simulation

On the final day, present 12 real interview questions sourced from LeetCode, HackerRank, and actual interviews:

1. **Second Highest Salary** (Classic)
   ```sql
   -- Find the employee with the second highest salary
   -- Solution: Use DENSE_RANK() or LIMIT/OFFSET
   ```

2. **Duplicate Emails** (EASY)
   ```sql
   -- Find all duplicate email addresses
   -- Tests: GROUP BY, HAVING
   ```

3. **Customers Who Never Order** (MEDIUM)
   ```sql
   -- Find customers who have never placed an order
   -- Tests: LEFT JOIN, IS NULL
   ```

4. **Department Highest Salary** (MEDIUM)
   ```sql
   -- Find the highest-paid employee in each department
   -- Tests: Window Functions, CTEs
   ```

5. **Consecutive Numbers** (HARD)
   ```sql
   -- Find all numbers that appear at least 3 times consecutively
   -- Tests: Self-join, window functions, or CTEs
   ```

### Interview Tips Sidebar

Add a "Why This Matters" tip to each challenge explaining the interview relevance:

```markdown
### 💡 Interview Insight

This pattern (LEFT JOIN + IS NULL) is a common interview question. Interviewers often ask:
- "Find X that doesn't have Y"
- "List customers without orders"
- "Show employees who haven't completed training"

**Remember**: When you need to find "missing" relationships, use LEFT JOIN and check for NULL on the right table.
```

---

## Part VII: Implementation Checklist

### Phase 1: Foundation (Week 1 of Development)
- [ ] Set up Next.js 16 project with TypeScript
- [ ] Install dependencies: `sql.js`, `@uiw/react-codemirror`, `@codemirror/lang-sql`
- [ ] Create TypeScript types (Challenge, QueryResult, GradeResult)
- [ ] Build `useSqlJs` hook for database initialization
- [ ] Build `useQueryExecutor` hook for running queries
- [ ] Create basic `SQLEditor` component with CodeMirror
- [ ] Create `ResultsDisplay` component for query output
- [ ] Implement localStorage progress tracking
- [ ] Design and build basic layout with Tailwind

### Phase 2: Curriculum (Week 2 of Development)
- [ ] Create challenge data structure (JSON or MD files)
- [ ] Build Days 1-3 challenges (SQL Basics, Filtering, Aggregation)
- [ ] Implement basic auto-grader (keyword checking, result comparison)
- [ ] Build Days 4-7 challenges (HAVING, Pattern Matching, Practice)
- [ ] Build Days 8-10 challenges (JOINS)
- [ ] Build Days 11-14 challenges (CTEs, Window Functions)
- [ ] Create comprehensive hints and solutions

### Phase 3: Polish & Launch (Week 3 of Development)
- [ ] Add progress dashboard
- [ ] Implement "Next Challenge" navigation
- [ ] Add dark mode support
- [ ] Mobile responsiveness
- [ ] Performance optimization (lazy loading modules)
- [ ] Add celebratory animations on completion
- [ ] Create README and deployment instructions

---

## Part VIII: Recommended Dependencies

```json
{
  "dependencies": {
    "next": "16.1.5",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "sql.js": "^1.8.0",
    "@uiw/react-codemirror": "^4.21.21",
    "@codemirror/lang-sql": "^6.5.5",
    "@codemirror/theme-one-dark": "^6.1.2"
  },
  "devDependencies": {
    "@types/sql.js": "^1.4.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## Part IX: File Structure

```
database-query-tool/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home/Landing
│   ├── curriculum/
│   │   └── page.tsx                # Course overview
│   ├── challenges/
│   │   └── [moduleId]/
│   │       └── [day]/
│   │           └── [challengeId]/
│   │               └── page.tsx    # Dynamic challenge page
│   └── api/
│       └── progress/
│           └── route.ts            # Optional: backend progress sync
├── components/
│   ├── SQLEditor.tsx
│   ├── ResultsDisplay.tsx
│   ├── FeedbackPanel.tsx
│   ├── ProgressSidebar.tsx
│   └── ChallengeDescription.tsx
├── hooks/
│   ├── useSqlJs.ts
│   ├── useQueryExecutor.ts
│   ├── useGrader.ts
│   └── useProgress.ts
├── lib/
│   ├── grader.ts
│   ├── db.ts
│   └── challenges.ts               # Challenge data
├── data/
│   ├── seed-data/
│   │   ├── day1.sql
│   │   ├── day2.sql
│   │   └── ...
│   └── challenges/
│       ├── module1.json
│       ├── module2.json
│       └── ...
├── types/
│   ├── challenge.ts
│   ├── progress.ts
│   └── index.ts
├── research.md
└── package.json
```

---

## Part X: Sources & References

### SQL Execution in Browser
- [sql.js GitHub](https://github.com/sql-js/sql.js) - SQLite to WebAssembly
- [Building Interactive SQL Platform](https://blog.seancoughlin.me/building-an-interactive-sql-learning-platform-with-react-nextjs-and-sqljs)
- [DuckDB-WASM](https://duckdb.org/2021/10/29/duckdb-wasm.html) - Alternative for analytics

### Code Editor Integration
- [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/)
- [CodeMirror SQL Extension](https://codemirror.net/docs/ref/#lang-sql)
- [Monaco vs CodeMirror Comparison](https://blog.replit.com/code-editors)

### Curriculum Design
- [FreeCodeCamp Challenge Structure](https://contribute.freecodecamp.org/how-to-work-on-coding-challenges/)
- [SQLZoo](https://sqlzoo.net/) - Progressive tutorial design
- [Mode Analytics SQL Tutorial](https://mode.com/sql-tutorial/) - Real-world analytics focus

### Auto-Grading
- [MySQL Auto-Grading Tool](https://github.com/ehgh/MySQL-auto-grading-tool)
- [SQLiteAutograder](https://github.com/scotpatti/SQLiteAutograder)
- [Automated SQL Query Grading System](https://arxiv.org/html/2406.15936v1)

### SQL Education Research
- [Learning SQL Programming with Interactive Tools](https://www.researchgate.net/publication/269923437_Learning_SQL_Programming_with_Interactive_Tools)
- [Designing SQL Tutorials for Scalable Online Teaching](http://www.vldb.org/pvldb/vol13/p2989-roehm.pdf)
- [Enhancing SQL Learning: Gamified Tutorials](https://www.sciencedirect.com/science/article/pii/S2590291125004905)

### Window Functions & CTEs
- [SQL Window Functions Guide](https://sql-academy.org/en/guide/windows-functions)
- [Crunchy Data CTEs and Window Functions](https://www.crunchydata.com/developers/playground/ctes-and-window-functions)
- [Master Joins, Window Functions, Subqueries, CTEs](https://www.youtube.com/watch?v=D2xUEYR-GIY)

---

## Conclusion

This research provides a complete roadmap for building a FreeCodeCamp-style SQL learning platform using Next.js and React. The 2-week curriculum is designed to take learners from zero to interview-ready through:

1. **97 bite-sized challenges** following the 2-minute rule
2. **Progressive complexity** from SELECT to Window Functions
3. **Real-world datasets** (employees, orders, e-commerce)
4. **Immediate feedback** via intelligent auto-grading
5. **Interview focus** with common patterns and gotchas
6. **Zero infrastructure** using sql.js for browser-based execution

The platform can be built entirely client-side with no backend required, making it free to host and accessible to anyone with a web browser.
