-- =====================================================
-- SQL Mastery - Supabase Schema Rollback
-- =====================================================
-- Run this to remove all Supabase objects
-- WARNING: This will delete all user data!
-- =====================================================

-- -----------------------------------------------------
-- 1. DROP TRIGGERS
-- -----------------------------------------------------
-- Drop auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop profiles updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- -----------------------------------------------------
-- 2. DROP FUNCTIONS
-- -----------------------------------------------------
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

-- -----------------------------------------------------
-- 3. DROP POLICIES
-- -----------------------------------------------------
-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop user_progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

-- -----------------------------------------------------
-- 4. DROP TABLES
-- -----------------------------------------------------
-- Drop user_progress table (depends on profiles)
DROP TABLE IF EXISTS public.user_progress CASCADE;

-- Drop profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- -----------------------------------------------------
-- VERIFICATION
-- -----------------------------------------------------
-- Verify tables are gone
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE WARNING 'Table "profiles" still exists';
  ELSE
    RAISE NOTICE 'Table "profiles" dropped successfully';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    RAISE WARNING 'Table "user_progress" still exists';
  ELSE
    RAISE NOTICE 'Table "user_progress" dropped successfully';
  END IF;
END $$;
