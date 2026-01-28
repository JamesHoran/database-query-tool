# Research: Console Errors Fix Plan (Revised)

## Executive Summary

The console errors stem from **JSON escaping** in the challenge data. The `seedData` field contains escaped sequences (`\\n`, `\\t`) that are not being converted to actual characters before being passed to SQL.js.

---

## The Core Problem: JSON String Escaping

### What's in the JSON File

Looking at `data/challenges/week-1.json`:

```json
"seedData": "DROP TABLE IF EXISTS employees;\\nCREATE TABLE employees (\\n  id INTEGER PRIMARY KEY,\\n..."
```

### What JavaScript Receives After `JSON.parse()`

```javascript
"DROP TABLE IF EXISTS employees;\nCREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n..."
```

**Important**: The `\n` above is **two characters** (`\` + `n`), NOT a newline character.

### Why SQL.js Fails

SQL.js parses the SQL string and encounters `\n` (backslash-n) which is not a valid SQL escape sequence. It throws:

```
unrecognized token: "\"
```

---

## Cascade of Failures

1. **SQL.js fails to parse seedData** → `db.exec()` throws
2. **Database initialization fails** → `db` stays `null`
3. **User queries fail** → "Database not initialized"
4. **No results display** → User sees nothing

---

## The Fix: Unescape SQL Strings

Add an unescape function to convert escape sequences to actual characters:

| Escaped | Becomes | Description |
|---------|---------|-------------|
| `\n` | Newline (`\n`) | Line break |
| `\t` | Tab (`\t`) | Tab character |
| `\"` | Quote (`"`) | Double quote |
| `\\` | Backslash (`\`) | Literal backslash |

### Implementation Location

**File**: `lib/challenges.ts`

**Function**:
```typescript
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')    // \n → newline
    .replace(/\\t/g, '\t')    // \t → tab
    .replace(/\\"/g, '"')     // \" → quote
    .replace(/\\\\/g, '\\');  // \\ → single backslash
}
```

### Update `getAllChallenges()`

```typescript
export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const week1 = (await import('@/data/challenges/week-1.json')).default as any[];
    return week1.map(c => ({
      ...c,
      seedData: unescapeSqlString(c.seedData), // ← Add this
      difficulty: c.difficulty as Challenge['difficulty'],
    })) as Challenge[];
  } catch (err) {
    console.error('Error loading challenges:', err);
    return [];
  }
}
```

---

## Secondary Issue: React State Update Warning

### Location
- **File**: `hooks/use-sql-js.ts`
- **Lines**: 52-54
- **Issue**: Side effect runs during render, not in `useEffect`

### Current Code (Problematic)
```tsx
// Lines 52-54 - Runs DURING render
if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
  initSqlJs();  // Async function that calls setLoading(false)
}
```

### The Fix

1. **Remove lines 52-54** (the render-phase check)
2. **Add `useEffect` import** to existing imports
3. **Add `useEffect` hook** after line 49

```tsx
import { useState, useCallback, useRef, useEffect } from 'react';
//                                    ^^^^^^^^^^ ADD THIS

// ... existing code ...

// REMOVE lines 52-54:
// if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
//   initSqlJs();
// }

// ADD after line 49:
useEffect(() => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return;
  if (sqlJsRef.current || initPromise.current) return;

  initSqlJs();
}, [initSqlJs]);
```

---

## File Changes Summary

| File | Change | Lines |
|------|--------|-------|
| `lib/challenges.ts` | Add `unescapeSqlString()` function | New function |
| `lib/challenges.ts` | Apply unescape to `seedData` in `getAllChallenges()` | Modify line 8 |
| `hooks/use-sql-js.ts` | Add `useEffect` to imports | Line 3 |
| `hooks/use-sql-js.ts` | Remove render-phase init (lines 52-54) | Delete 3 lines |
| `hooks/use-sql-js.ts` | Add `useEffect` for initialization | Insert after line 49 |

---

## Implementation Order

1. **Fix the JSON escaping** (`lib/challenges.ts`)
   - Add `unescapeSqlString()` function
   - Process `seedData` when loading challenges
   - This is the **root cause** of the SQL error

2. **Fix the React warning** (`hooks/use-sql-js.ts`)
   - Add `useEffect` import
   - Remove render-phase initialization
   - Add `useEffect`-based initialization

3. **Test end-to-end**
   - Verify SQL queries execute without errors
   - Verify results display in the UI
   - Verify no React warnings

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

---

## Why This Is the Correct Fix

### Not `db.run()` vs `db.exec()`

Changing from `db.run()` to `db.exec()` does NOT fix this issue because both methods receive the same malformed input. The problem occurs **before** SQL.js even begins parsing - the string contains literal `\n` sequences that SQL doesn't understand.

### Alternative: Change JSON Format

We could store actual newlines in the JSON file instead of `\\n`, but:
- JSON files with embedded newlines are harder to read and maintain
- Requires changing the data format
- The unescape approach keeps the JSON clean and readable

### Chosen Approach: Unescape in Code

- Keeps JSON format clean (single-line strings)
- Centralized fix in one place (`lib/challenges.ts`)
- Easy to maintain and extend if more escape sequences are needed
