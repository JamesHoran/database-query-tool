import Link from 'next/link';
import { getAllChallenges, getChallengeById } from '@/lib/challenges';

export default async function CoursePage() {
  const challenges = await getAllChallenges();

  // Group challenges by day
  const week1Days = Array.from({ length: 7 }, (_, i) => i + 1).map(day => ({
    day,
    week: 1,
    challenges: challenges.filter(c => c.day === day),
    title: getDayTitle(day),
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <span className="font-semibold text-zinc-100">SQL Interview Mastery</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">{challenges.length}</span> challenges
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">Course Overview</h1>
          <p className="text-lg text-zinc-400">
            Master SQL for technical interviews through 97 interactive challenges organized over 2 weeks.
          </p>
        </div>

        {/* Week 1 */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">W1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Week 1: Foundations</h2>
              <p className="text-zinc-400">Master SQL basics and common interview patterns</p>
            </div>
          </div>

          <div className="space-y-4">
            {week1Days.map((dayInfo) => (
              <Link
                key={dayInfo.day}
                href={`/challenge/${dayInfo.challenges[0]?.id || '#'}`}
                className="block group"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                        <span className="font-semibold text-zinc-300">{dayInfo.day}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                          {dayInfo.title}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {dayInfo.challenges.length} challenge{dayInfo.challenges.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Week 2 Preview */}
        <section className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">Week 2: Advanced Concepts</h3>
          <p className="text-zinc-400 mb-6">
            Coming soon: JOINs, CTEs, Window Functions, and interview patterns
          </p>
          <p className="text-sm text-zinc-500">
            Complete Week 1 to unlock advanced topics
          </p>
        </section>
      </main>
    </div>
  );
}

function getDayTitle(day: number): string {
  const titles: Record<number, string> = {
    1: 'SQL Fundamentals',
    2: 'Filtering & Sorting',
    3: 'Aggregation I',
    4: 'Aggregation II',
    5: 'Pattern Matching',
    6: 'Practice Day',
    7: 'Week 1 Assessment',
  };
  return titles[day] || `Day ${day}`;
}
