# Plan: Fix Console Errors (Revised)

## Overview
Multiple interconnected issues need to be fixed:
1. **SQL Parse Error:** `unrecognized token: "\"` in `hooks/use-grader.ts:41`
2. **React State Error:** "Can't perform a React state update on a component that hasn't mounted yet"
3. **Cascading failure:** "Database not initialized" → queries don't run → no results displayed

### Why Queries Don't Show Results
The JSON escaping error causes SQL.js to fail during database initialization. This means:
- `initializeDatabase()` throws an error
- `db` stays `null` in `use-sql-js.ts`
- `useQueryExecutor` checks `if (!db)` and returns "Database not initialized"
- No queries execute, no results display

---

## Issue 1: SQL Parse Error - Escaped Newlines in JSON

### Root Cause
The JSON file contains `\\n` sequences. When `JSON.parse()` processes this, it converts `\\n` to a literal `\n` (two characters: backslash + n), **NOT** an actual newline character.

**What's in the JSON:**
```json
"seedData": "DROP TABLE IF EXISTS employees;\\nCREATE TABLE employees (\\n  id INTEGER PRIMARY KEY,\\n..."
```

**What SQL.js receives after JSON.parse():**
```
DROP TABLE IF EXISTS employees;\nCREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  ...
```
(The `\n` here is **two characters**: `\` and `n`)

**Why SQL.js fails:**
SQL.js sees `\n` as an unrecognized escape sequence token, causing the parse error.

### Why `db.run()` vs `db.exec()` Doesn't Fix This
Changing from `db.run()` to `db.exec()` does **NOT** solve the problem. Both methods receive the same malformed input string containing literal `\n` sequences. The error occurs **before** SQL.js begins parsing — the string itself contains invalid escape sequences that SQL doesn't understand.

### Solution: Unescape String in Code
Add a utility function to convert escaped sequences to actual characters when processing challenge data.

### Implementation Steps

1. **Create unescape utility** in `lib/challenges.ts`
2. **Process seedData** when loading challenges to convert `\n` → newline, `\t` → tab

**New code:**
```typescript
// In lib/challenges.ts
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

export async function getAllChallenges(): Promise<Challenge[]> {
  const week1 = (await import('@/data/challenges/week-1.json')).default as any[];
  return week1.map(c => ({
    ...c,
    seedData: unescapeSqlString(c.seedData),
    difficulty: c.difficulty as Challenge['difficulty'],
  })) as Challenge[];
}
```

---

## Issue 2: React State Update During Render

### Root Cause
In `hooks/use-sql-js.ts:52-54`, initialization happens during the render phase:

```tsx
// This runs DURING render (not in useEffect)
if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
  initSqlJs();  // Async function that calls setLoading(false)
}
```

When `initSqlJs()` completes asynchronously, it may call `setLoading(false)` after the component has unmounted, violating React's rules.

### Solution: Move Initialization to `useEffect`
Side effects must occur in `useEffect`, not during render.

### Implementation Steps

1. Remove lines 52-54 (render-phase initialization check)
2. Add `useEffect` hook for safe async initialization

**New code structure in `use-sql-js.ts`:**
```tsx
// Remove this block (lines 52-54):
// if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
//   initSqlJs();
// }

// Add after line 49:
useEffect(() => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return;
  if (sqlJsRef.current || initPromise.current) return;

  initSqlJs();
}, [initSqlJs]);
```

Also need to add `useEffect` to the imports:
```tsx
import { useState, useCallback, useRef, useEffect } from 'react';
```

---

## Issue 3: No Visual Database Status Indicator

### Problem
Users can't tell if the database is:
- Still loading SQL.js
- Ready to query
- Failed to initialize

This leads to confusion when queries don't work - is it a syntax error or is the DB not ready?

### Solution: Add Connection Status Badge

Expose database loading state through `use-sql-js.ts` and display a visual indicator in the UI.

### Implementation Steps

1. **Update `hooks/use-sql-js.ts`**
   - Export the `loading` state and `db` status
   - Optionally add an `error` state for initialization failures

2. **Create `components/db-status-badge.tsx`**
   - Display loading/yellow badge when SQL.js is initializing
   - Display ready/green badge when database is connected
   - Display error/red badge if initialization fails

3. **Add badge to SQL editor**
   - Place near the "Run Query" button
   - Position for visibility but not obtrusive

**Component structure:**
```tsx
// components/db-status-badge.tsx
export function DbStatusBadge({ status, error }: { status: 'loading' | 'ready' | 'error', error?: string }) {
  const styles = {
    loading: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  const labels = {
    loading: 'Initializing database...',
    ready: 'Database ready',
    error: error || 'Database error',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
```

**Usage in page:**
```tsx
const { db, loading } = useSqlJs(challenge.seedData);

<DbStatusBadge
  status={loading ? 'loading' : db ? 'ready' : 'error'}
/>
```

---

## File Changes Summary

| File | Change | Lines |
|------|--------|-------|
| `lib/challenges.ts` | Add `unescapeSqlString()` function | New function |
| `lib/challenges.ts` | Process seedData in `getAllChallenges()` | Modify map function |
| `hooks/use-sql-js.ts` | Add `useEffect` to imports | Line 3 |
| `hooks/use-sql-js.ts` | Remove lines 52-54 | Delete 3 lines |
| `hooks/use-sql-js.ts` | Add useEffect after line 49 | Insert useEffect |
| `components/db-status-badge.tsx` | Create new status badge component | New file |
| Page components | Add `<DbStatusBadge />` near SQL editor | Insert component |

---

## Implementation Order

1. **Fix Issue 1** (`lib/challenges.ts`)
   - Add `unescapeSqlString()` function
   - Process `seedData` when loading challenges
   - This is the **root cause** of the SQL error

2. **Fix Issue 2** (`hooks/use-sql-js.ts`)
   - Add `useEffect` import
   - Remove render-phase initialization
   - Add `useEffect`-based initialization

3. **Fix Issue 3** (UX improvement)
   - Create `components/db-status-badge.tsx`
   - Add badge to challenge page(s)

4. **Test end-to-end**
   - Verify SQL queries execute without errors
   - Verify results display in the UI
   - Verify no React warnings
   - Verify status badge shows correct state

---

## Testing Checklist

- [ ] No "unrecognized token" errors when running queries
- [ ] No "Database not initialized" errors
- [ ] SQL queries **show results** in the UI
- [ ] No React state update warnings in console
- [ ] All challenges load and execute correctly
- [ ] Database schema displays properly
- [ ] Grading system works end-to-end
- [ ] Quick navigation between challenges works
- [ ] **Status badge shows "Initializing"** when page first loads
- [ ] **Status badge turns green "Database ready"** after SQL.js loads
- [ ] **Status badge shows red on error** if initialization fails
