import Link from 'next/link';
import { getAllChallenges } from '@/lib/challenges';

export default async function CoursePage() {
  const challenges = await getAllChallenges();

  // Group challenges by week and day
  const weeks = [1, 2, 3, 4, 5].map(weekNum => {
    const weekChallenges = challenges.filter(c => c.week === weekNum);
    const days = Array.from({ length: 5 }, (_, i) => i + 1).map(day => ({
      day,
      challenges: weekChallenges.filter(c => c.day === day),
      title: getDayTitle(weekNum, day),
    }));
    return {
      week: weekNum,
      title: getWeekTitle(weekNum),
      description: getWeekDescription(weekNum),
      color: getWeekColor(weekNum),
      days,
      totalChallenges: weekChallenges.length,
    };
  });

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="px-2.5 sm:px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-xs sm:text-sm font-semibold text-blue-400">Complete SQL Curriculum</span>
              </div>
              <div className="px-2.5 sm:px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full">
                <span className="text-xs sm:text-sm font-medium text-zinc-300">5 Weeks</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-100 mb-3 sm:mb-4 tracking-tight">
              Master SQL From <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Basics to Advanced</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 mb-6 sm:mb-8 leading-relaxed">
              125 interactive challenges taking you from SELECT statements to complex window functions and real-world scenarios.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>125 Challenges</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>5 Modules</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Browser-Based</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {weeks.map((week) => (
          <section key={week.week} id={`w${week.week}`} className="mb-10 sm:mb-12 lg:mb-16 scroll-mt-20">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${week.color.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">W{week.week}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-zinc-100">{week.title}</h2>
                <p className="text-sm sm:text-base text-zinc-400 line-clamp-2 sm:line-clamp-1">{week.description}</p>
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 flex-shrink-0">
                {week.totalChallenges} <span className="hidden sm:inline">challenges</span><span className="sm:hidden">challs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {week.days.map((dayInfo) => {
                const firstChallenge = dayInfo.challenges[0];
                return (
                  <Link
                    key={dayInfo.day}
                    href={firstChallenge ? `/challenge/${firstChallenge.id}` : '#'}
                    className="group"
                  >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all h-full">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${week.color.badge}`}>
                          <span className="text-xs sm:text-sm font-bold text-white">{dayInfo.day}</span>
                        </div>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors mb-1.5 sm:mb-2 line-clamp-2">
                        {dayInfo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500">
                        {dayInfo.challenges.length} challenge{dayInfo.challenges.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
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

function getWeekDescription(week: number): string {
  const descriptions: Record<number, string> = {
    1: 'Master SELECT, WHERE, ORDER BY, and basic aggregation',
    2: 'Learn GROUP BY, HAVING, and advanced aggregate functions',
    3: 'Work with multiple tables using INNER, LEFT, and SELF JOINs',
    4: 'CTEs, Window Functions, and data manipulation',
    5: 'Real-world scenarios and comprehensive challenges',
  };
  return descriptions[week] || '';
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
