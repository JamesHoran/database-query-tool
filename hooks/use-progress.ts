'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, DayProgress, WeekProgress } from '@/types';

const PROGRESS_KEY = 'sql-mastery-progress';
const TOTAL_CHALLENGES = 97;

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
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
        };
        setProgress(initial);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProgress = useCallback((updated: UserProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, []);

  const markComplete = useCallback((challengeId: string) => {
    if (!progress) return;

    const updated: UserProgress = {
      ...progress,
      completedChallenges: [
        ...new Set([...progress.completedChallenges, challengeId]),
      ],
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

  const resetProgress = useCallback(() => {
    const initial: UserProgress = {
      completedChallenges: [],
      currentChallenge: 'w1-d1-c1',
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
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
    markComplete,
    setCurrentChallenge,
    isCompleted,
    getCompletionRate,
    getCompletedCount,
    resetProgress,
    getDayProgress,
    getWeekProgress,
  };
}
