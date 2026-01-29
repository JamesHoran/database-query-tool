-- =====================================================
-- SQL Mastery - Supabase Schema Setup
-- =====================================================
-- Run this in your Supabase SQL Editor
-- This creates tables, RLS policies, and triggers
-- =====================================================

-- -----------------------------------------------------
-- 1. PROFILES TABLE (extends auth.users)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (for cases where trigger doesn't run)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- -----------------------------------------------------
-- 2. USER_PROGRESS TABLE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  completed_challenges TEXT[] DEFAULT '{}',
  current_challenge TEXT DEFAULT 'w1-d1-c1',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- -----------------------------------------------------
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);

  -- Create initial progress
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------
-- 4. HELPER FUNCTION TO UPDATE UPDATED_AT
-- -----------------------------------------------------
-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------------
-- VERIFICATION
-- -----------------------------------------------------
-- Verify tables exist
SELECT
  'profiles' as table_name,
  COUNT(*) as row_count
FROM public.profiles
UNION ALL
SELECT
  'user_progress' as table_name,
  COUNT(*) as row_count
FROM public.user_progress;

-- Verify functions exist
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'update_updated_at');

-- Verify triggers exist
SELECT
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('profiles', 'user_progress');
