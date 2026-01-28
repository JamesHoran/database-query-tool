# Simple Auth Plan - Username-Based Progress Persistence

## Goal: Simplest possible auth for cross-browser progress sync

### The Absolute Simplest Approach: Username + Optional Password

**No email verification. No magic links. Just pick a username and go.**

---

## Why This Is Simplest

| Feature | Complexity | Decision |
|---------|-----------|----------|
| Email verification | High | ❌ Skip |
| Password requirements | Medium | ❌ Optional |
| Magic links | Medium | ❌ Skip |
| OAuth (Google/GitHub) | High | ❌ Skip |
| **Username only** | **Low** | ✅ **YES** |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  USER FLOW                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User visits app                                         │
│  2. Sees "Pick a username to save progress" prompt         │
│  3. Enters username (e.g., "sql-learner-123")              │
│  4. Progress is now saved to that username                 │
│  5. On another device: enter same username → progress syncs │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Storage: Simple SQLite File

Since the app already uses SQLite concepts, we'll use a simple `users.db` file:

```sql
-- Single table for everything
CREATE TABLE users (
  username TEXT PRIMARY KEY,
  completed_challenges TEXT DEFAULT '[]',  -- JSON array
  current_challenge TEXT DEFAULT 'w1-d1-c1',
  started_at TEXT DEFAULT (datetime('now')),
  last_activity TEXT DEFAULT (datetime('now')),
  optional_password TEXT,  -- Optional: hashed password for protection
  created_at TEXT DEFAULT (datetime('now'))
);
```

### API Routes (Next.js App Router)

```
app/api/
├── auth/
│   ├── login/route.ts      # POST { username, password? }
│   └── exists/route.ts     # GET ?username=x
└── progress/
    ├── route.ts            # GET, PUT for current user
    └── sync/route.ts       # Merge local + server progress
```

---

## Step-by-Step Implementation

### Step 1: Database Setup (15 minutes)

Install better-sqlite3 for server-side SQLite:

```bash
pnpm add better-sqlite3
pnpm add -D @types/better-sqlite3
```

Create `lib/db.ts`:

```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'users.db');
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    completed_challenges TEXT DEFAULT '[]',
    current_challenge TEXT DEFAULT 'w1-d1-c1',
    started_at TEXT DEFAULT (datetime('now')),
    last_activity TEXT DEFAULT (datetime('now')),
    optional_password TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export interface User {
  username: string;
  completed_challenges: string;
  current_challenge: string;
  started_at: string;
  last_activity: string;
  optional_password?: string;
  created_at: string;
}

export function getUser(username: string): User | null {
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  return row as User | null;
}

export function createUser(username: string, password?: string): boolean {
  try {
    const hashedPassword = password ? hashPassword(password) : null;
    db.prepare(
      'INSERT INTO users (username, optional_password) VALUES (?, ?)'
    ).run(username, hashedPassword);
    return true;
  } catch (e) {
    return false; // Username exists
  }
}

export function updateUserProgress(username: string, progress: {
  completed_challenges: string[];
  current_challenge: string;
}) {
  db.prepare(`
    UPDATE users
    SET completed_challenges = ?,
        current_challenge = ?,
        last_activity = datetime('now')
    WHERE username = ?
  `).run(
    JSON.stringify(progress.completed_challenges),
    progress.current_challenge,
    username
  );
}

function hashPassword(password: string): string {
  // Simple hash - in production use bcrypt
  return Bun.password.hash(password);
}
```

---

### Step 2: Auth API Routes (20 minutes)

**`app/api/auth/login/route.ts`**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getUser, createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { username, password, createNew } = await request.json();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { error: 'Username must be at least 3 characters' },
      { status: 400 }
    );
  }

  if (createNew) {
    // Check if username exists
    const existing = getUser(username);
    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }
    // Create new user
    const created = createUser(username, password);
    if (!created) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } else {
    // Login existing user
    const user = getUser(username);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    // Check password if set
    if (user.optional_password) {
      if (!password || !Bun.password.verify(password, user.optional_password)) {
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 401 }
        );
      }
    }
  }

  // Set session cookie (simple JWT or just username)
  const response = NextResponse.json({ success: true, username });
  response.cookies.set('sql-mastery-user', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}
```

**`app/api/auth/logout/route.ts`**:

```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('sql-mastery-user');
  return response;
}
```

**`app/api/auth/me/route.ts`**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  const username = request.cookies.get('sql-mastery-user')?.value;

  if (!username) {
    return NextResponse.json({ user: null });
  }

  const user = getUser(username);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      username: user.username,
      completedChallenges: JSON.parse(user.completed_challenges),
      currentChallenge: user.current_challenge,
      startedAt: user.started_at,
      lastActivity: user.last_activity,
    }
  });
}
```

---

### Step 3: Progress API Routes (15 minutes)

**`app/api/progress/route.ts`**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUserProgress } from '@/lib/db';

export async function GET(request: NextRequest) {
  const username = request.cookies.get('sql-mastery-user')?.value;
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = getUser(username);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    completedChallenges: JSON.parse(user.completed_challenges),
    currentChallenge: user.current_challenge,
    startedAt: user.started_at,
    lastActivity: user.last_activity,
  });
}

export async function PUT(request: NextRequest) {
  const username = request.cookies.get('sql-mastery-user')?.value;
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const progress = await request.json();

  updateUserProgress(username, {
    completed_challenges: progress.completedChallenges,
    current_challenge: progress.currentChallenge,
  });

  return NextResponse.json({ success: true });
}
```

---

### Step 4: Update useProgress Hook (20 minutes)

**`hooks/use-progress.ts`** - Modify to sync with server:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '@/types';

const PROGRESS_KEY = 'sql-mastery-progress';
const TOTAL_CHALLENGES = 97;

export function useProgress(username: string | null) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      try {
        if (username) {
          // Load from server
          const res = await fetch('/api/progress');
          if (res.ok) {
            const serverProgress = await res.json();
            setProgress(serverProgress);

            // Update localStorage as cache
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(serverProgress));
            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem(PROGRESS_KEY);
        if (saved) {
          setProgress(JSON.parse(saved));
        } else {
          const initial: UserProgress = {
            completedChallenges: [],
            currentChallenge: 'w1-d1-c1',
            startedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          };
          setProgress(initial);
        }
      } catch (err) {
        console.error('Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [username]);

  const saveProgress = useCallback(async (updated: UserProgress) => {
    setProgress(updated);

    // Save to localStorage immediately (optimistic)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));

    // Sync to server if logged in
    if (username) {
      setSyncing(true);
      try {
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error('Error syncing progress:', err);
      } finally {
        setSyncing(false);
      }
    }
  }, [username]);

  // ... rest of the hook methods remain the same
  // (markComplete, setCurrentChallenge, etc.)

  return {
    progress,
    loading,
    syncing,  // New: shows if sync is in progress
    markComplete,
    setCurrentChallenge,
    // ... other methods
  };
}
```

---

### Step 5: Auth UI Components (30 minutes)

**`components/auth-modal.tsx`**:

```typescript
'use client';

import { useState } from 'react';

interface Props {
  onLogin: (username: string) => void;
}

export function AuthModal({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'create'>('create');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        password: usePassword ? password : undefined,
        createNew: mode === 'create',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    onLogin(data.username);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Choose a Username' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., sql-learner-123"
              minLength={3}
              required
            />
          </div>

          {mode === 'create' && (
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                />
                Add password protection (optional)
              </label>
            </div>
          )}

          {usePassword && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                minLength={usePassword ? 4 : 0}
                required={usePassword}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : mode === 'create' ? 'Create' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === 'create' ? 'login' : 'create')}
              className="px-4 py-2 border rounded"
            >
              {mode === 'create' ? 'Login' : 'Create'}
            </button>
          </div>
        </form>

        {mode === 'create' && (
          <p className="text-xs text-gray-500 mt-4">
            No email needed. Your username lets you access your progress from any device.
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### Step 6: Root Layout Integration (10 minutes)

**`app/layout.tsx`** - Add auth context:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { AuthModal } from '@/components/auth-modal';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUsername(data.user.username);
        } else {
          // Check if they have local progress
          const local = localStorage.getItem('sql-mastery-progress');
          if (local) {
            setShowAuth(true); // Offer to save their progress
          }
        }
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="min-h-screen" />;

  return (
    <>
      <AuthContext.Provider value={{ username, setUsername, setShowAuth }}>
        {children}
      </AuthContext.Provider>

      {showAuth && (
        <AuthModal
          onLogin={(u) => {
            setUsername(u);
            setShowAuth(false);
          }}
        />
      )}
    </>
  );
}
```

---

## Summary

### Files to Create

| File | Lines | Purpose |
|------|-------|---------|
| `lib/db.ts` | ~80 | SQLite database connection and queries |
| `app/api/auth/login/route.ts` | ~50 | Login/create endpoint |
| `app/api/auth/logout/route.ts` | ~10 | Logout endpoint |
| `app/api/auth/me/route.ts` | ~25 | Current user endpoint |
| `app/api/progress/route.ts` | ~40 | Progress save/load |
| `components/auth-modal.tsx` | ~120 | Login UI |
| Update `hooks/use-progress.ts` | ~30 | Add server sync |
| Update `app/layout.tsx` | ~40 | Add auth context |

**Total: ~400 lines of code**

### Time Estimate

| Step | Time |
|------|------|
| Database setup | 15 min |
| API routes | 35 min |
| Update hooks | 20 min |
| Auth UI | 30 min |
| Testing | 20 min |
| **Total** | **~2 hours** |

---

## Security Considerations

This simple approach has trade-offs:

| Aspect | Status | Notes |
|--------|--------|-------|
| Password hashing | ✅ | Use bcrypt/bun.password |
| Session cookie | ✅ | httpOnly, secure in production |
| SQL injection | ✅ | Prepared statements |
| Username enumeration | ⚠️ | Public whether username exists (acceptable for this use case) |
| Password reset | ❌ | Not available (users can create new account) |
| Rate limiting | ⚠️ | Add later if needed |

---

## Migration Path

Start simple (username only). Later enhancements:

1. Add password hashing (optional)
2. Add rate limiting on API routes
3. Add password reset (requires email)
4. Add OAuth login (Google/GitHub)

---

## Database Location

```
data/users.db  # SQLite file (gitignore this)
```

Add to `.gitignore`:
```
data/*.db
data/*.db-shm
data/*.db-wal
```
