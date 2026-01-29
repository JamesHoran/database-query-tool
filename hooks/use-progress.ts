'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, DayProgress, WeekProgress } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

const PROGRESS_KEY = 'sql-mastery-progress';
const SYNCED_USER_ID_KEY = 'sql-mastery-synced-user-id';
const TOTAL_CHALLENGES = 125;

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load progress from localStorage or Supabase on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const supabase = getSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authenticated = !!session?.user;
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // User logged in, load from Supabase
        loadProgressFromSupabase(session.user.id);
      } else {
        // User logged out, load from localStorage
        loadProgressFromLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProgressFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      } else {
        const initial: UserProgress = {
          completedChallenges: [],
          currentChallenge: 'w1-d1-c1',
          startedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          totalXp: 0,
        };
        setProgress(initial);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
      }
    } catch (err) {
      console.error('Error loading progress from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProgressFromSupabase = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      // Check if we've already synced for this user
      const syncedUserId = localStorage.getItem(SYNCED_USER_ID_KEY);

      // First time logging in - sync localStorage progress to Supabase
      if (syncedUserId !== userId) {
        await syncLocalStorageToSupabase(userId);
        localStorage.setItem(SYNCED_USER_ID_KEY, userId);
      }

      // Fetch progress from Supabase
      const response = await fetch('/api/progress');
      if (response.ok) {
        const serverProgress = await response.json();
        setProgress(serverProgress);
      } else {
        // If fetch fails, fall back to localStorage
        console.error('Failed to fetch progress from server');
        loadProgressFromLocalStorage();
      }
    } catch (err) {
      console.error('Error loading progress from Supabase:', err);
      // Fall back to localStorage on error
      loadProgressFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [loadProgressFromLocalStorage]);

  const syncLocalStorageToSupabase = useCallback(async (userId: string) => {
    try {
      setSyncing(true);
      const localProgressStr = localStorage.getItem(PROGRESS_KEY);

      if (localProgressStr) {
        const localProgress = JSON.parse(localProgressStr);

        // Sync to Supabase
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localProgress),
        });

        if (!response.ok) {
          console.error('Failed to sync progress to Supabase');
        }
      }
    } catch (err) {
      console.error('Error syncing progress:', err);
    } finally {
      setSyncing(false);
    }
  }, []);

  const loadProgress = useCallback(() => {
    // Check initial auth state
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        loadProgressFromSupabase(session.user.id);
      } else {
        setIsAuthenticated(false);
        loadProgressFromLocalStorage();
      }
    });
  }, [loadProgressFromLocalStorage, loadProgressFromSupabase]);

  const saveProgress = useCallback(async (updated: UserProgress) => {
    setProgress(updated);

    // Always save to localStorage as backup
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving progress to localStorage:', err);
    }

    // If authenticated, also save to Supabase
    if (isAuthenticated) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error('Error saving progress to Supabase:', err);
        // Don't throw - localStorage is our backup
      }
    }
  }, [isAuthenticated]);

  const markComplete = useCallback((challengeId: string, xp: number = 10) => {
    if (!progress) return;

    // Check if already completed
    if (progress.completedChallenges.includes(challengeId)) {
      return;
    }

    const updated: UserProgress = {
      ...progress,
      completedChallenges: [
        ...new Set([...progress.completedChallenges, challengeId]),
      ],
      totalXp: progress.totalXp + xp,
      lastActivity: new Date().toISOString(),
    };

    saveProgress(updated);
  }, [progress, saveProgress]);

  const setCurrentChallenge = useCallback((challengeId: string) => {
    if (!progress) return;

    const updated: UserProgress = {
      ...progress,
      currentChallenge: challengeId,
      lastActivity: new Date().toISOString(),
    };

    saveProgress(updated);
  }, [progress, saveProgress]);

  const isCompleted = useCallback((challengeId: string): boolean => {
    return progress?.completedChallenges.includes(challengeId) ?? false;
  }, [progress]);

  const getCompletionRate = useCallback((): number => {
    if (!progress) return 0;
    return Math.round(
      (progress.completedChallenges.length / TOTAL_CHALLENGES) * 100
    );
  }, [progress]);

  const getCompletedCount = useCallback((): number => {
    return progress?.completedChallenges.length ?? 0;
  }, [progress]);

  const getTotalXp = useCallback((): number => {
    return progress?.totalXp ?? 0;
  }, [progress]);

  const resetProgress = useCallback(async () => {
    const initial: UserProgress = {
      completedChallenges: [],
      currentChallenge: 'w1-d1-c1',
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalXp: 0,
    };

    // Clear sync tracking on reset
    localStorage.removeItem(SYNCED_USER_ID_KEY);

    saveProgress(initial);
  }, [saveProgress]);

  // Get progress for a specific day
  const getDayProgress = useCallback((week: number, day: number): DayProgress => {
    // This will be calculated based on challenge data
    // For now, return placeholder
    return {
      week,
      day,
      totalChallenges: 0,
      completedChallenges: 0,
    };
  }, []);

  // Get progress for a specific week
  const getWeekProgress = useCallback((week: number): WeekProgress => {
    // This will be calculated based on challenge data
    // For now, return placeholder
    return {
      week,
      totalDays: week === 1 ? 7 : 7,
      totalChallenges: 0,
      completedChallenges: 0,
    };
  }, []);

  return {
    progress,
    loading,
    syncing,
    isAuthenticated,
    markComplete,
    setCurrentChallenge,
    isCompleted,
    getCompletionRate,
    getCompletedCount,
    getTotalXp,
    resetProgress,
    getDayProgress,
    getWeekProgress,
  };
}
