export interface UserProgress {
  completedChallenges: string[];
  currentChallenge: string;
  startedAt: string;
  lastActivity: string;
}

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
