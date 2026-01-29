// Progress Types - Re-exports from the progress system with XP support
export type { UserProgress, ProgressState, ProgressAction } from '@/lib/progress/types';

// Additional types for UI components
export interface DayProgress {
  day: number;
  week: number;
  totalChallenges: number;
  completedChallenges: number;
}

export interface WeekProgress {
  week: number;
  totalDays: number;
  totalChallenges: number;
  completedChallenges: number;
}
