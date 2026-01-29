/**
 * Progress Hook
 * Professional progress tracking with optimistic updates
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { UserProgress, ProgressState } from './types';
import {
  localStorageStorage,
  serverStorage,
  syncTracking,
  ServerStorageError,
} from './storage';
import { INITIAL_PROGRESS, INITIAL_STATE } from './types';

export interface UseProgressReturn {
  // State
  progress: UserProgress | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  isAuthenticated: boolean;
  syncingMessage: string | null;

  // Actions
  markComplete: (challengeId: string) => Promise<void>;
  isCompleted: (challengeId: string) => boolean;
  getCompletionRate: () => number;
  getCompletedCount: () => number;
  resetProgress: () => Promise<void>;
  retry: () => void;
}

export function useProgress(): UseProgressReturn {
  // Core state
  const [state, setState] = useState<ProgressState>(INITIAL_STATE);
  const [syncingMessage, setSyncingMessage] = useState<string | null>(null);

  // Track mount to prevent double-fetch
  const isMounted = useRef(true);
  const syncInProgress = useRef(false);

  // ============================================================================
  // Auth Management
  // ============================================================================

  const handleAuthChange = useCallback(async (authenticated: boolean, userId?: string) => {
    if (!isMounted.current) return;

    setState((prev) => ({ ...prev, isAuthenticated: authenticated }));

    if (authenticated && userId) {
      await loadFromServer(userId);
    } else {
      await loadFromLocal();
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(!!session, session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(!!session, session?.user?.id);
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  // ============================================================================
  // Loading Functions
  // ============================================================================

  const loadFromLocal = useCallback(async () => {
    if (!isMounted.current) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      let progress = localStorageStorage.get();

      if (!progress) {
        progress = INITIAL_PROGRESS;
        localStorageStorage.set(progress);
      }

      if (isMounted.current) {
        setState({
          progress,
          isLoading: false,
          isSyncing: false,
          error: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      if (isMounted.current) {
        setState({
          progress: INITIAL_PROGRESS,
          isLoading: false,
          isSyncing: false,
          error: 'Failed to load progress from local storage',
          isAuthenticated: false,
        });
      }
    }
  }, []);

  const loadFromServer = useCallback(async (userId: string) => {
    if (!isMounted.current || syncInProgress.current) return;

    syncInProgress.current = true;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // First time logging in - sync local to server
      if (!syncTracking.hasSynced(userId)) {
        const localProgress = localStorageStorage.get();
        if (localProgress) {
          try {
            await serverStorage.save(localProgress);
            syncTracking.setUserId(userId);
          } catch {
            // Ignore sync errors, continue to load from server
          }
        }
      }

      // Load from server
      const serverProgress = await serverStorage.get();

      // Update local cache
      localStorageStorage.set(serverProgress);
      syncTracking.setUserId(userId);

      if (isMounted.current) {
        setState({
          progress: serverProgress,
          isLoading: false,
          isSyncing: false,
          error: null,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      const message = error instanceof ServerStorageError
        ? error.message
        : 'Failed to load progress from server';

      // Fall back to local on server error
      const localProgress = localStorageStorage.get() || INITIAL_PROGRESS;

      if (isMounted.current) {
        setState({
          progress: localProgress,
          isLoading: false,
          isSyncing: false,
          error: message,
          isAuthenticated: true,
        });
      }
    } finally {
      syncInProgress.current = false;
    }
  }, []);

  // ============================================================================
  // Actions
  // ============================================================================

  const markComplete = useCallback(async (challengeId: string) => {
    const currentProgress = state.progress;
    if (!currentProgress) return;

    // Already completed
    if (currentProgress.completedChallenges.includes(challengeId)) {
      return;
    }

    // Optimistic update
    const updated: UserProgress = {
      ...currentProgress,
      completedChallenges: [...new Set([...currentProgress.completedChallenges, challengeId])],
      lastActivity: new Date().toISOString(),
    };

    // Update UI immediately
    setState((prev) => ({ ...prev, progress: updated, error: null }));

    // Save to local storage
    localStorageStorage.set(updated);

    // Sync to server if authenticated
    if (state.isAuthenticated) {
      try {
        setSyncingMessage('Saving progress...');
        await serverStorage.save(updated);
        setSyncingMessage(null);
      } catch (error) {
        // Server sync failed - keep optimistic update
        const message = error instanceof ServerStorageError
          ? 'Saved locally (sync failed)'
          : 'Saved locally (offline)';

        setState((prev) => ({ ...prev, error: message }));

        // Clear error message after 3 seconds
        setTimeout(() => {
          setState((prev) => ({ ...prev, error: null }));
        }, 3000);
      } finally {
        setSyncingMessage(null);
      }
    }
  }, [state.progress, state.isAuthenticated]);

  const resetProgress = useCallback(async () => {
    const reset = INITIAL_PROGRESS;

    // Update local
    localStorageStorage.set(reset);
    syncTracking.clearUserId();

    // Update state
    setState((prev) => ({ ...prev, progress: reset }));

    // Sync to server if authenticated
    if (state.isAuthenticated) {
      try {
        await serverStorage.save(reset);
      } catch {
        // Keep local reset
      }
    }
  }, [state.isAuthenticated]);

  // ============================================================================
  // Queries
  // ============================================================================

  const isCompleted = useCallback((challengeId: string): boolean => {
    return state.progress?.completedChallenges.includes(challengeId) ?? false;
  }, [state.progress]);

  const getCompletionRate = useCallback((): number => {
    if (!state.progress) return 0;
    return Math.round((state.progress.completedChallenges.length / 125) * 100);
  }, [state.progress]);

  const getCompletedCount = useCallback((): number => {
    return state.progress?.completedChallenges.length ?? 0;
  }, [state.progress]);

  const retry = useCallback(() => {
    if (state.isAuthenticated) {
      const supabase = getSupabaseClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          loadFromServer(session.user.id);
        }
      });
    } else {
      loadFromLocal();
    }
  }, [state.isAuthenticated, loadFromServer, loadFromLocal]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    progress: state.progress,
    isLoading: state.isLoading,
    isSyncing: state.isSyncing,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    syncingMessage,

    markComplete,
    isCompleted,
    getCompletionRate,
    getCompletedCount,
    resetProgress,
    retry,
  };
}
