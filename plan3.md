# Plan 3: Fix Console Errors (Revised)

## Issues to Fix

### 1. SQL Token Error (`hooks/use-grader.ts:41`, `hooks/use-sql-js.ts:69`)
**Error**: `unrecognized token: "\"`

**Root Cause**: The JSON file contains `\\n` sequences. After `JSON.parse()`, this becomes a literal `\n` (two characters: backslash + "n"), **NOT** an actual newline character. SQL.js cannot parse these literal escape sequences.

**Example:**
```json
"seedData": "DROP TABLE IF EXISTS employees;\\nCREATE TABLE..."
```
After parsing: `"DROP TABLE IF EXISTS employees;\nCREATE TABLE..."` (where `\n` is two chars)

**Solution**: Add an `unescapeSqlString()` utility in `lib/challenges.ts` to convert escaped sequences to actual characters.

### 2. React State Update Error (`hooks/use-sql-js.ts:41`)
**Error**: `Can't perform a React state update on a component that hasn't mounted yet`

**Root Cause**: `initSqlJs()` is called synchronously during render (lines 52-54). When the promise resolves, it calls `setLoading(false)` outside of React's effect phase.

**Solution**: Move initialization to a `useEffect` hook.

### 3. Cascading Failures
The JSON escaping error causes:
- Database initialization fails → `db` stays `null`
- Queries throw "Database not initialized"
- No results displayed

---

## Implementation Plan

### File: `lib/challenges.ts`

Add `unescapeSqlString()` helper and apply it to seedData:

```typescript
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const week1 = (await import('@/data/challenges/week-1.json')).default as any[];
    return week1.map(c => ({
      ...c,
      seedData: unescapeSqlString(c.seedData),
      difficulty: c.difficulty as Challenge['difficulty'],
    })) as Challenge[];
  } catch (err) {
    console.error('Error loading challenges:', err);
    return [];
  }
}
```

### File: `hooks/use-sql-js.ts`

1. Import `useEffect` from React
2. Change `newDb.run(seedData)` to `newDb.exec(seedData)` (line 69)
3. Remove render-phase initialization (lines 52-54)
4. Add `useEffect` for safe initialization

### File: `hooks/use-grader.ts`

Change `db.run(seedData)` to `db.exec(seedData)` (line 41)

---

## Code Changes

### `lib/challenges.ts`

```typescript
// Add this function before getAllChallenges()
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

// In getAllChallenges(), add seedData processing:
return week1.map(c => ({
  ...c,
  seedData: unescapeSqlString(c.seedData),  // ADD THIS
  difficulty: c.difficulty as Challenge['difficulty'],
})) as Challenge[];
```

### `hooks/use-sql-js.ts`

Add import:
```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
```

Remove lines 52-54 and replace with:
```typescript
// Initialize on mount - moved to useEffect
useEffect(() => {
  if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
    initSqlJs();
  }
}, [initSqlJs]);
```

Change line 69 from `newDb.run(seedData)` to `newDb.exec(seedData)`.

### `hooks/use-grader.ts`

Change line 41 from `db.run(seedData)` to `db.exec(seedData)`.

---

## File Changes Summary

| File | Lines | Change | Reason |
|------|-------|--------|--------|
| `lib/challenges.ts` | N/A | Add `unescapeSqlString()` | Convert `\n` to newlines |
| `lib/challenges.ts` | 9 | Add seedData processing | Apply unescaping |
| `hooks/use-sql-js.ts` | 3 | Add `useEffect` to imports | Needed for hook |
| `hooks/use-sql-js.ts` | 52-54 | Remove render-phase init | Fix React error |
| `hooks/use-sql-js.ts` | after 49 | Add useEffect | Safe initialization |
| `hooks/use-sql-js.ts` | 69 | `run()` → `exec()` | Multi-statement SQL |
| `hooks/use-grader.ts` | 41 | `run()` → `exec()` | Multi-statement SQL |

---

## Implementation Order

1. **Fix Issue 1 first** (`lib/challenges.ts`)
   - Root cause of the SQL parse error
   - Unblocks database initialization

2. **Fix Issue 2** (`hooks/use-sql-js.ts`)
   - Add useEffect
   - Change `run()` to `exec()`

3. **Fix use-grader.ts**
   - Change `run()` to `exec()`

4. **Test end-to-end**

---

## Testing Checklist

- [ ] No "unrecognized token" errors
- [ ] No "Database not initialized" errors
- [ ] SQL queries show results in UI
- [ ] No React state update warnings
- [ ] Database initialization completes
- [ ] Grading system works
