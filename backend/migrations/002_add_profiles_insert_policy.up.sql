-- =====================================================
-- Fix: Add missing INSERT policy on profiles table
-- =====================================================
-- This migration fixes the foreign key constraint error
-- where user_progress cannot be inserted because profiles
-- cannot be created by the app (missing INSERT policy)
-- =====================================================

-- Drop existing INSERT policy if it exists (to make this idempotent)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Add the missing INSERT policy on profiles table
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT
  policy_name,
  table_name
FROM pg_policies
WHERE table_name = 'profiles'
  AND policy_name = 'Users can insert own profile';
