# Persistent Storage Plan for SQL Mastery App

## Current State Analysis

### Existing Implementation
- **Storage**: LocalStorage (browser-specific)
- **Progress Key**: `sql-mastery-progress`
- **Data Structure**:
  ```typescript
  interface UserProgress {
    completedChallenges: string[];
    currentChallenge: string;
    startedAt: string;
    lastActivity: string;
  }
  ```
- **Limitations**:
  - Progress is tied to a single browser/device
  - No user accounts or authentication
  - No server-side storage or API
  - Lost when clearing browser data

### Architecture
- **Framework**: Next.js 16 (App Router)
- **Database**: sql.js (in-browser SQLite for challenges only)
- **Deployment**: Currently using pm2
- **No existing backend API**

---

## Proposed Solutions

### Option 1: Supabase (Recommended)

**Overview**: Backend-as-a-Service providing auth + database in one platform.

**Pros**:
- Fastest implementation (2-3 hours)
- Built-in authentication (email, OAuth, magic links)
- Real-time sync capabilities
- Free tier available (500MB database, 50K MAU)
- PostgreSQL database (full SQL capabilities)
- Row-level security built-in
- Dashboard UI for managing data

**Cons**:
- Vendor dependency
- Free tier limits on concurrent connections

**Implementation Steps**:

1. **Setup Supabase Project** (10 min)
   - Create account at supabase.com
   - Create new project
   - Get API keys

2. **Database Schema** (15 min)
   ```sql
   -- Users table (managed by Supabase Auth)
   -- profiles table (extends auth.users)
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Progress tracking
   CREATE TABLE user_progress (
     user_id UUID REFERENCES profiles(id) PRIMARY KEY,
     completed_challenges TEXT[] DEFAULT '{}',
     current_challenge TEXT DEFAULT 'w1-d1-c1',
     started_at TIMESTAMPTZ DEFAULT NOW(),
     last_activity TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users can view own progress"
     ON user_progress FOR SELECT
     USING (auth.uid() = user_id);
   CREATE POLICY "Users can update own progress"
     ON user_progress FOR UPDATE
     USING (auth.uid() = user_id);
   ```

3. **Install Dependencies** (5 min)
   ```bash
   pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```

4. **Create Supabase Client** (20 min)
   - Create `lib/supabase/client.ts` (browser client)
   - Create `lib/supabase/server.ts` (server client)
   - Create `lib/supabase/middleware.ts` (auth refresh)

5. **Authentication Pages** (30 min)
   - `/login` page with email/password + OAuth options
   - `/signup` page
   - Add auth state to navigation (show login/logout)

6. **Modify useProgress Hook** (30 min)
   - Replace localStorage with Supabase queries
   - Add optimistic updates (local + sync)
   - Handle loading/error states

7. **API Layer** (30 min)
   - Create `app/api/progress/route.ts` for progress CRUD
   - Implement sync endpoint for offline capability

**Files to Create/Modify**:
```
lib/supabase/
  ├── client.ts          # Browser Supabase client
  ├── server.ts          # Server Supabase client
  └── middleware.ts      # Auth middleware

app/
  ├── login/page.tsx     # Login page
  ├── signup/page.tsx    # Signup page
  └── api/progress/
      └── route.ts       # Progress API endpoint

hooks/
  └── use-progress.ts    # Modify to use Supabase

components/
  └── navigation.tsx     # Add auth state UI
```

**Estimated Time**: 3-4 hours

---

### Option 2: NextAuth.js + Vercel Postgres

**Overview**: Native Next.js solution using Auth.js for authentication and Vercel Postgres for storage.

**Pros**:
- Native Next.js integration
- More control over infrastructure
- Can deploy to Vercel seamlessly
- No external BaaS vendor

**Cons**:
- More setup required (4-6 hours)
- Need to manage database migrations
- Email delivery for auth requires setup (SendGrid, Resend, etc.)

**Implementation Steps**:

1. **Setup Vercel Postgres** (15 min)
   - Install `@vercel/postgres` package
   - Create database project
   - Get connection string

2. **Database Schema** (15 min)
   ```sql
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE accounts (
     id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(id),
     type TEXT NOT NULL,
     provider TEXT NOT NULL,
     provider_account_id TEXT NOT NULL,
     refresh_token TEXT,
     access_token TEXT,
     expires_at BIGINT
   );

   CREATE TABLE sessions (
     id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(id),
     expires TIMESTAMPTZ NOT NULL
   );

   CREATE TABLE user_progress (
     user_id TEXT REFERENCES users(id) PRIMARY KEY,
     completed_challenges TEXT[] DEFAULT '{}',
     current_challenge TEXT DEFAULT 'w1-d1-c1',
     started_at TIMESTAMPTZ DEFAULT NOW(),
     last_activity TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Install Dependencies** (5 min)
   ```bash
   pnpm add next-auth @auth/core @vercel/postgres
   ```

4. **Auth Configuration** (45 min)
   - Create `auth.ts` config
   - Configure providers (GitHub, Google, Email)
   - Setup email provider (Resend recommended)

5. **API Routes** (30 min)
   - `/api/auth/[...nextauth]` route handler
   - `/api/progress` endpoints

6. **Modify useProgress Hook** (30 min)
   - Fetch from API instead of localStorage
   - Implement sync logic

**Estimated Time**: 5-6 hours

---

### Option 3: Firebase Authentication + Firestore

**Overview**: Google's BaaS with real-time capabilities.

**Pros**:
- Real-time sync out of the box
- Easy setup
- Good free tier
- Authentication built-in

**Cons**:
- NoSQL database (less suited for SQL learning app theme)
- Vendor lock-in
- Query complexity for relationships

**Estimated Time**: 3-4 hours

---

### Option 4: Custom Backend with SQLite/PostgreSQL

**Overview**: Build a custom Express/Fastify backend with traditional database.

**Pros**:
- Full control
- Can use same database type as app teaches (SQLite/PostgreSQL)
- No vendor dependencies

**Cons**:
- Most complex (8-10 hours)
- Need to manage servers
- Authentication from scratch or use Passport.js
- Deployment complexity

**Estimated Time**: 8-10 hours

---

## Recommended Approach: Supabase

Given the requirements and current state, **Supabase is recommended** because:

1. **Fastest to implement** - Can be working in 3-4 hours
2. **PostgreSQL database** - Aligns with SQL learning theme
3. **Built-in auth** - Email, Google, GitHub login ready
4. **Row-level security** - Data isolation between users
5. **Real-time sync** - Future capability for collaborative features
6. **Free tier** - No cost for development/low usage

---

## Implementation Plan (Supabase)

### Phase 1: Setup & Configuration
- [ ] Create Supabase project
- [ ] Run database schema migration
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Create Supabase client utilities

### Phase 2: Authentication
- [ ] Create login page
- [ ] Create signup page
- [ ] Add auth providers (email, GitHub, Google)
- [ ] Implement logout functionality
- [ ] Add auth state to navigation
- [ ] Protect routes (redirect to login if needed)

### Phase 3: Progress Storage
- [ ] Create progress API routes
- [ ] Modify useProgress hook to use API
- [ ] Implement optimistic updates
- [ ] Add error handling and retry logic
- [ ] Handle offline scenarios (localStorage fallback)

### Phase 4: User Profile
- [ ] Create profile page
- [ ] Show progress statistics
- [ ] Display achievements/streaks
- [ ] Allow account deletion

### Phase 5: Testing & Polish
- [ ] Test across multiple browsers
- [ ] Test mobile experience
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Update documentation

---

## Data Schema (Final)

```sql
-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE user_progress (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  completed_challenges TEXT[] DEFAULT '{}',
  current_challenge TEXT DEFAULT 'w1-d1-c1',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge attempts (for analytics, optional)
CREATE TABLE challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  challenge_id TEXT NOT NULL,
  query TEXT NOT NULL,
  was_successful BOOLEAN DEFAULT false,
  attempts_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_attempts_user_chapter ON challenge_attempts(user_id, challenge_id);
CREATE INDEX idx_progress_activity ON user_progress(last_activity DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress"
  ON user_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts"
  ON challenge_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts"
  ON challenge_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Migration Strategy

### For Existing Users (LocalStorage)

When implementing, include a migration script:

1. Check for existing localStorage progress
2. If user has existing progress and creates account:
   - Offer to import existing progress
   - Merge with server progress (take max of both)
   - Clear localStorage after successful sync

```typescript
// Migration function
async function migrateLocalStorage(userId: string) {
  const local = localStorage.getItem('sql-mastery-progress');
  if (!local) return;

  const localProgress: UserProgress = JSON.parse(local);

  // Fetch server progress
  const { data: serverProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Merge progress
  const merged = {
    completed_challenges: [
      ...new Set([
        ...(serverProgress?.completed_challenges || []),
        ...localProgress.completedChallenges
      ])
    ],
    current_challenge: serverProgress?.current_challenge || localProgress.currentChallenge,
    // Keep earliest start date
    started_at: serverProgress?.started_at < localProgress.startedAt
      ? serverProgress.started_at
      : localProgress.startedAt,
    // Keep latest activity
    last_activity: serverProgress?.last_activity > localProgress.lastActivity
      ? serverProgress.last_activity
      : localProgress.lastActivity
  };

  // Update server
  await supabase
    .from('user_progress')
    .update(merged)
    .eq('user_id', userId);

  // Clear local
  localStorage.removeItem('sql-mastery-progress');
}
```

---

## Future Enhancements

Once persistent storage is implemented:

1. **Leaderboards** - Compare progress with other users
2. **Achievements** - Badges for milestones
3. **Streaks** - Daily activity tracking
4. **Social Features** - Share progress, friend challenges
5. **Offline Mode** - Service worker with background sync
6. **Analytics Dashboard** - User learning insights
7. **Certificates** - Generate completion certificates
