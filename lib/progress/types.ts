/**
 * Progress System Types
 * Professional progress tracking with type safety
 */

export interface UserProgress {
  completedChallenges: string[];
  currentChallenge: string;
  startedAt: string;
  lastActivity: string;
  totalXp: number;
}

export interface ProgressState {
  progress: UserProgress | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type ProgressAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_SUCCESS'; progress: UserProgress }
  | { type: 'LOADING_ERROR'; error: string }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; progress: UserProgress }
  | { type: 'SYNC_ERROR'; error: string }
  | { type: 'SET_AUTH'; authenticated: boolean }
  | { type: 'MARK_COMPLETE'; challengeId: string }
  | { type: 'UPDATE_CHALLENGE'; challengeId: string };

export interface ProgressStore {
  state: ProgressState;
  actions: {
    loadProgress: () => Promise<void>;
    markComplete: (challengeId: string) => Promise<void>;
    isCompleted: (challengeId: string) => boolean;
    getCompletionRate: () => number;
    getCompletedCount: () => number;
    resetProgress: () => Promise<void>;
  };
}

export const INITIAL_PROGRESS: UserProgress = {
  completedChallenges: [],
  currentChallenge: 'w1-d1-c1',
  startedAt: new Date().toISOString(),
  lastActivity: new Date().toISOString(),
  totalXp: 0,
};

export const INITIAL_STATE: ProgressState = {
  progress: null,
  isLoading: true,
  isSyncing: false,
  error: null,
  isAuthenticated: false,
};
