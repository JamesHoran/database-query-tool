// use-python-progress.ts - Progress Tracking for Python Challenges
// Simplified version to avoid TypeScript issues with new tables

import { useState, useEffect, useCallback } from 'react';
import type { PythonChallenge } from '@/types/python';

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

  // Load progress from localStorage for now
  // TODO: Integrate with Supabase when python_progress table is set up
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('python_progress');
      if (saved) {
        const completed = JSON.parse(saved) as string[];
        setState((prev) => ({
          ...prev,
          completedChallenges: new Set(completed),
          totalXp: completed.length * 10,
          loading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Mark a challenge as complete
  const markComplete = useCallback(
    async (challengeId: string) => {
      // Check if already completed
      if (state.completedChallenges.has(challengeId)) {
        return;
      }

      // Add to completed set
      const newCompleted = new Set(state.completedChallenges);
      newCompleted.add(challengeId);

      // Save to localStorage
      localStorage.setItem('python_progress', JSON.stringify([...newCompleted]));

      setState({
        ...state,
        completedChallenges: newCompleted,
        totalXp: newCompleted.size * 10,
      });
    },
    [state]
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
