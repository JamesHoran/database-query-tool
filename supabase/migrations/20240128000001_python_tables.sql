-- Python Learning App Tables
-- These tables track Python challenge progress and learning metrics

-- Python modules (weekly structure)
CREATE TABLE IF NOT EXISTS python_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  estimated_hours DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Python challenges (daily lessons)
CREATE TABLE IF NOT EXISTS python_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES python_modules(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT NOT NULL,
  test_code JSONB NOT NULL,
  hints TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  concepts TEXT[],
  day_number INTEGER NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Python progress tracking
CREATE TABLE IF NOT EXISTS python_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES python_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  code_submission TEXT,
  UNIQUE(user_id, challenge_id)
);

-- Learning streaks (simplified)
CREATE TABLE IF NOT EXISTS learning_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0
);

-- Daily activity tracking
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE UNIQUE,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_python_progress_user ON python_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_python_progress_completed ON python_progress(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_python_challenges_module ON python_challenges(module_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- Enable Row Level Security
ALTER TABLE python_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE python_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE python_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Modules and challenges are publicly readable
CREATE POLICY "Modules are publicly viewable" ON python_modules
  FOR SELECT USING (true);

CREATE POLICY "Challenges are publicly viewable" ON python_challenges
  FOR SELECT USING (true);

-- Users can only see their own progress
CREATE POLICY "Users can view own progress" ON python_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON python_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON python_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own streaks
CREATE POLICY "Users can view own streaks" ON learning_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON learning_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON learning_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own daily activity
CREATE POLICY "Users can view own activity" ON daily_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON daily_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON daily_activity
  FOR UPDATE USING (auth.uid() = user_id);
