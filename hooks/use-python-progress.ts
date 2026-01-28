// use-python-progress.ts - Progress Tracking for Python Challenges

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { PythonProgress, PythonChallenge } from '@/types/python';

interface ProgressState {
  completedChallenges: Set<string>;
  totalXp: number;
  currentStreak: number;
  lastActivityDate: Date | null;
  loading: boolean;
}

export function usePythonProgress() {
  const [state, setState] = useState<ProgressState>({
    completedChallenges: new Set(),
    totalXp: 0,
    currentStreak: 0,
    lastActivityDate: null,
    loading: true,
  });

  const supabase = getSupabaseClient();

  // Load progress from Supabase
  const loadProgress = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Fetch completed challenges
      const { data: progressData } = await supabase
        .from('python_progress')
        .select('challenge_id, completed_at')
        .eq('user_id', user.id);

      // Fetch learning streaks
      const { data: streakData } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const completedSet = new Set(progressData?.map((p: any) => p.challenge_id) || []);
      const totalXp = completedSet.size * 10; // 10 XP per challenge

      setState({
        completedChallenges: completedSet,
        totalXp,
        currentStreak: streakData?.current_streak || 0,
        lastActivityDate: streakData?.last_activity_date ? new Date(streakData.last_activity_date) : null,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load progress:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [supabase]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Mark a challenge as complete
  const markComplete = useCallback(
    async (challengeId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        // Check if already completed
        if (state.completedChallenges.has(challengeId)) {
          return;
        }

        // Add to progress
        await supabase.from('python_progress').insert({
          user_id: user.id,
          challenge_id: challengeId,
          completed_at: new Date().toISOString(),
          attempts: 1,
        });

        // Update daily activity
        const today = new Date().toISOString().split('T')[0];
        const { data: existingActivity } = await supabase
          .from('daily_activity')
          .select('*')
          .eq('user_id', user.id)
          .eq('activity_date', today)
          .single();

        if (existingActivity) {
          await supabase
            .from('daily_activity')
            .update({
              lessons_completed: existingActivity.lessons_completed + 1,
              xp_earned: existingActivity.xp_earned + 10,
            })
            .eq('id', existingActivity.id);
        } else {
          await supabase.from('daily_activity').insert({
            user_id: user.id,
            activity_date: today,
            lessons_completed: 1,
            xp_earned: 10,
          });
        }

        // Update streak
        const { data: currentStreak } = await supabase
          .from('learning_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (currentStreak) {
          const lastDate = currentStreak.last_activity_date
            ? new Date(currentStreak.last_activity_date)
            : null;
          const todayDate = new Date(today);
          const yesterdayDate = new Date(Date.now() - 86400000);
          const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

          let newStreak = currentStreak.current_streak;

          if (!lastDate) {
            newStreak = 1;
          } else if (lastDate.toISOString().split('T')[0] === yesterdayStr) {
            newStreak += 1;
          } else if (lastDate.toISOString().split('T')[0] !== today) {
            newStreak = 1;
          }

          await supabase
            .from('learning_streaks')
            .update({
              current_streak: newStreak,
              longest_streak: Math.max(currentStreak.longest_streak, newStreak),
              last_activity_date: todayDate.toISOString(),
              total_xp: currentStreak.total_xp + 10,
            })
            .eq('user_id', user.id);
        } else {
          await supabase.from('learning_streaks').insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: new Date().toISOString(),
            total_xp: 10,
          });
        }

        // Reload progress
        await loadProgress();
      } catch (error) {
        console.error('Failed to mark complete:', error);
      }
    },
    [supabase, state.completedChallenges, loadProgress]
  );

  // Check if a challenge is completed
  const isCompleted = useCallback(
    (challengeId: string): boolean => {
      return state.completedChallenges.has(challengeId);
    },
    [state.completedChallenges]
  );

  // Get completion rate for a set of challenges
  const getCompletionRate = useCallback(
    (challenges: PythonChallenge[]): number => {
      if (challenges.length === 0) return 0;
      const completedCount = challenges.filter((c) => state.completedChallenges.has(c.id)).length;
      return Math.round((completedCount / challenges.length) * 100);
    },
    [state.completedChallenges]
  );

  // Get completed count
  const getCompletedCount = useCallback(
    (): number => {
      return state.completedChallenges.size;
    },
    [state.completedChallenges]
  );

  return {
    ...state,
    loadProgress,
    markComplete,
    isCompleted,
    getCompletionRate,
    getCompletedCount,
  };
}
