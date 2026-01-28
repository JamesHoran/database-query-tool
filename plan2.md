# Plan to Fix Console Errors

## Issue 1: SQL Parse Error - `unrecognized token: "\"`

### Root Cause
The seed data in `data/challenges/week-1.json` contains escaped newlines (`\\n`) which is correct JSON format. However, when the JSON is parsed, these become literal backslash-n characters (`\n` as two characters) rather than actual newline characters.

SQL.js expects actual newline characters to properly parse multi-line SQL statements. When receiving `\n` literals, it interprets the backslash as an unrecognized token.

### Fix Approach
Add a helper function to unescape the seed data string after loading from JSON. This converts escaped sequences like `\\n` to actual newline characters.

**File to modify:** `lib/challenges.ts`

Add a `unescapeSQL` function that:
- Converts `\\n` to actual newlines
- Converts `\\t` to tabs
- Handles any other escaped characters

Apply this transformation when loading challenges from JSON.

---

## Issue 2: React State Update on Unmounted Component

### Root Cause
In `hooks/use-sql-js.ts` lines 52-54, the initialization happens during render:

```javascript
if (typeof window !== 'undefined' && !sqlJsRef.current && !initPromise.current) {
  initSqlJs();
}
```

This causes an async function (`initSqlJs`) to be called during render, which eventually calls `setLoading(false)`. Since this is not wrapped in `useEffect`, the state update can occur before the component has mounted, triggering React's warning.

### Fix Approach
Move the initialization logic into a proper `useEffect` hook:

**File to modify:** `hooks/use-sql-js.ts`

1. Remove the render-phase initialization (lines 52-54)
2. Add a `useEffect` that calls `initSqlJs()` on mount
3. The effect should only run when `sqlJsRef.current` and `initPromise.current` are both null

This ensures the async operation and state updates happen in the correct React lifecycle phase.

---

## Implementation Steps

1. **Fix SQL unescaping in `lib/challenges.ts`**
   - Add `unescapeSQL()` helper function
   - Apply transformation in `getAllChallenges()`

2. **Fix React lifecycle in `hooks/use-sql-js.ts`**
   - Remove render-phase initialization
   - Add proper `useEffect` for initialization

3. **Test the fixes**
   - Verify seed data loads correctly in SQL.js
   - Verify no React state update warnings
   - Confirm challenges still work as expected

---

## Best Practices Being Follow

1. **Data transformation at the boundary** - Unescape SQL data when loading from JSON, keeping the source format valid
2. **Proper React lifecycle** - Use `useEffect` for side effects, not render-phase code
3. **Minimal changes** - Fix the root causes without refactoring unrelated code
4. **Type safety** - Maintain existing TypeScript types
