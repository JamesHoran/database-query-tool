-- Rollback: Remove the INSERT policy from profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
