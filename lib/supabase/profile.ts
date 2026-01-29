'use client';

import { getSupabaseClient } from './client';
import type { UserProgress } from '@/types';

/**
 * Ensures a profile exists for the current user.
 * Creates one if it doesn't exist. (Lazy initialization)
 */
export async function ensureProfileExists(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('ensureProfileExists: No user logged in');
      return false;
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      return false;
    }

    // Create profile if it doesn't exist
    if (!profile) {
      console.log('Creating profile for user:', user.id);

      const { error: insertError } = await (supabase
        .from('profiles') as any)
        .insert({
          id: user.id,
          email: user.email,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        // Check if it was a concurrent insert (profile exists now)
        if (insertError.code !== '23505') { // 23505 = unique violation
          return false;
        }
      }
    }

    // Check if progress exists
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error checking progress:', progressError);
      return false;
    }

    // Create progress if it doesn't exist
    if (!progress) {
      console.log('Creating progress for user:', user.id);

      const { error: insertProgressError } = await (supabase
        .from('user_progress') as any)
        .insert({
          user_id: user.id,
          completed_challenges: [],
          current_challenge: 'w1-d1-c1',
        });

      if (insertProgressError) {
        console.error('Error creating progress:', insertProgressError);
        if (insertProgressError.code !== '23505') {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in ensureProfileExists:', error);
    return false;
  }
}

/**
 * Fetches the current user's profile
 */
export async function getUserProfile() {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

/**
 * Fetches the current user's progress
 */
export async function getUserProgress(): Promise<UserProgress | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // First ensure profile/progress exist
    await ensureProfileExists();

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching progress:', error);
      return null;
    }

    // Convert from snake_case to camelCase
    const progressData = data as any;
    return {
      completedChallenges: progressData.completed_challenges || [],
      currentChallenge: progressData.current_challenge || 'w1-d1-c1',
      startedAt: progressData.started_at || new Date().toISOString(),
      lastActivity: progressData.last_activity || new Date().toISOString(),
      totalXp: 0, // TODO: Calculate from completed challenges
    };
  } catch (error) {
    console.error('Unexpected error fetching progress:', error);
    return null;
  }
}

/**
 * Saves the user's progress
 */
export async function saveUserProgress(progress: UserProgress): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user logged in');
      return false;
    }

    // Ensure profile exists first
    await ensureProfileExists();

    const { error } = await (supabase
      .from('user_progress') as any)
      .upsert({
        user_id: user.id,
        completed_challenges: progress.completedChallenges,
        current_challenge: progress.currentChallenge,
        started_at: progress.startedAt,
        last_activity: progress.lastActivity,
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Error saving progress:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error saving progress:', error);
    return false;
  }
}
