'use client';

import { useProgress } from '@/hooks/use-progress';
import { getAllChallenges } from '@/lib/challenges';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/progress-bar';

export default function ProgressPage() {
  const { progress, getCompletedCount, resetProgress, isAuthenticated, syncing } = useProgress();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    getAllChallenges().then(setChallenges).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-zinc-800 rounded w-1/3 mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 bg-zinc-800 rounded w-1/4 mb-6 sm:mb-8"></div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 sm:h-24 bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Group challenges by week and day
  const weeks = [1, 2, 3, 4, 5].map(weekNum => {
    const weekChallenges = challenges.filter(c => c.week === weekNum);
    const days = Array.from({ length: 5 }, (_, i) => i + 1).map(day => {
      const dayChallenges = weekChallenges.filter(c => c.day === day);
      const completedCount = dayChallenges.filter(c => progress?.completedChallenges.includes(c.id)).length;
      return {
        day,
        challenges: dayChallenges,
        completedCount,
        title: getDayTitle(weekNum, day),
      };
    }).filter(d => d.challenges.length > 0);
    return {
      week: weekNum,
      title: getWeekTitle(weekNum),
      color: getWeekColor(weekNum),
      days,
      totalChallenges: weekChallenges.length,
      completedChallenges: weekChallenges.filter(c => progress?.completedChallenges.includes(c.id)).length,
    };
  });

  const totalCompleted = getCompletedCount();
  const totalChallenges = challenges.length;
  const completionRate = Math.round((totalCompleted / totalChallenges) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">Your Progress</h1>
            {/* Sync Status */}
            <div className="mt-2 flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-900/20 border border-green-800/50 rounded-md">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-green-400">Synced to cloud</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md">
                  <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-xs text-zinc-500">Local storage only</span>
                </div>
              )}
              {syncing && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs text-blue-400">Syncing...</span>
                </div>
              )}
            </div>
          </div>
          {progress && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs sm:text-sm text-zinc-500 hover:text-red-400 transition-colors self-start sm:self-auto"
            >
              Reset Progress
            </button>
          )}
        </div>
        <p className="text-sm sm:text-base text-zinc-400 mb-4 sm:mb-6">Track your SQL mastery journey</p>

        {/* Overall Progress */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">Overall Completion</h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                {totalCompleted} of {totalChallenges} challenges completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-zinc-100">{completionRate}%</div>
            </div>
          </div>
          <ProgressBar completed={totalCompleted} total={totalChallenges} />
        </div>
      </div>

      {/* Week Progress */}
      <div className="space-y-6 sm:space-y-8">
        {weeks.map((week) => {
          const weekCompletionRate = Math.round(
            (week.completedChallenges / week.totalChallenges) * 100
          );

          return (
            <div key={week.week} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-3 sm:p-4 lg:p-5 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${week.color.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm sm:text-lg lg:text-xl font-bold text-white">W{week.week}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-zinc-100">{week.title}</h3>
                      <p className="text-[10px] sm:text-xs text-zinc-500">
                        {week.completedChallenges}/{week.totalChallenges} challenges
                      </p>
                    </div>
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${weekCompletionRate === 100 ? 'text-green-400' : 'text-zinc-100'}`}>
                    {weekCompletionRate}%
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4">
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${week.color.gradient} transition-all duration-500 ease-out`}
                      style={{ width: `${weekCompletionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {week.days.map((dayInfo) => {
                  const dayCompletionRate = dayInfo.challenges.length > 0
                    ? Math.round((dayInfo.completedCount / dayInfo.challenges.length) * 100)
                    : 0;
                  const isComplete = dayCompletionRate === 100;

                  return (
                    <Link
                      key={dayInfo.day}
                      href={dayInfo.challenges[0] ? `/challenge/${dayInfo.challenges[0].id}` : '#'}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-zinc-800/50 transition-all group"
                      style={{
                        borderColor: isComplete ? week.color.badge.replace('bg-', 'border-') + '/50' : 'rgb(39 39 42)',
                        backgroundColor: isComplete ? `${week.color.badge}/5` : undefined
                      }}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isComplete ? week.color.badge : 'bg-zinc-800'}`}>
                        {isComplete ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs sm:text-sm font-medium text-zinc-400">{dayInfo.day}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium truncate ${isComplete ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                          {dayInfo.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-zinc-500">
                          {dayInfo.completedCount}/{dayInfo.challenges.length}
                        </p>
                      </div>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2">Reset Progress?</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">
              This will clear all your completed challenges and reset you to the beginning. This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-3 sm:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No progress state */}
      {totalCompleted === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2">Start Your Journey</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">Complete your first challenge to see your progress here.</p>
          <Link
            href="/course"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
          >
            Start Learning
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

function getWeekTitle(week: number): string {
  const titles: Record<number, string> = {
    1: 'SQL Fundamentals',
    2: 'GROUP BY & Aggregation',
    3: 'JOINs & Multiple Tables',
    4: 'Advanced SQL (CTEs & Window Functions)',
    5: 'Advanced Practice & Real-World Scenarios',
  };
  return titles[week] || `Week ${week}`;
}

function getWeekColor(week: number) {
  const colors: Record<number, { gradient: string; badge: string }> = {
    1: { gradient: 'from-blue-500 to-blue-700', badge: 'bg-blue-600' },
    2: { gradient: 'from-purple-500 to-purple-700', badge: 'bg-purple-600' },
    3: { gradient: 'from-emerald-500 to-emerald-700', badge: 'bg-emerald-600' },
    4: { gradient: 'from-amber-500 to-amber-700', badge: 'bg-amber-600' },
    5: { gradient: 'from-rose-500 to-rose-700', badge: 'bg-rose-600' },
  };
  return colors[week] || { gradient: 'from-zinc-500 to-zinc-700', badge: 'bg-zinc-600' };
}

function getDayTitle(week: number, day: number): string {
  const titles: Record<string, string> = {
    '1-1': 'Basic SELECT Queries',
    '1-2': 'Filtering with WHERE',
    '1-3': 'Pattern Matching & NULL Values',
    '1-4': 'Sorting Results',
    '1-5': 'Basic Aggregation',

    '2-1': 'Introduction to GROUP BY',
    '2-2': 'Filtering Groups with HAVING',
    '2-3': 'Advanced GROUP BY Techniques',
    '2-4': 'String & Numeric Functions',
    '2-5': 'Advanced Aggregation Patterns',

    '3-1': 'INNER JOIN Basics',
    '3-2': 'LEFT & RIGHT JOINs',
    '3-3': 'Advanced JOIN Patterns',
    '3-4': 'Subqueries',
    '3-5': 'Set Operations (UNION, INTERSECT)',

    '4-1': 'Common Table Expressions (CTEs)',
    '4-2': 'Window Functions Basics',
    '4-3': 'Advanced Window Functions',
    '4-4': 'SQL Functions & NULL Handling',
    '4-5': 'Data Manipulation (INSERT, UPDATE, DELETE)',

    '5-1': 'Business Reports & Summaries',
    '5-2': 'Customer Analytics',
    '5-3': 'Data Analysis Patterns',
    '5-4': 'Advanced Query Techniques',
    '5-5': 'Comprehensive Challenges',
  };
  return titles[`${week}-${day}`] || `Day ${day}`;
}
