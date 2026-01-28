import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModuleBySlug, getChallengesByModule, getAllModules } from '@/lib/python/challenges';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ week: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { week } = await params;
  const module = getModuleBySlug(week);

  if (!module) {
    return {
      title: 'Module Not Found',
    };
  }

  return {
    title: `${module.title} | Python Mastery`,
    description: module.description,
  };
}

export async function generateStaticParams() {
  const modules = getAllModules();
  return modules.map((module) => ({
    week: module.slug,
  }));
}

export default async function WeekPage({ params }: PageProps) {
  const { week } = await params;
  const module = getModuleBySlug(week);

  if (!module) {
    notFound();
  }

  const challenges = getChallengesByModule(module.id);
  const weekColors: Record<number, string> = {
    1: 'bg-blue-600',
    2: 'bg-purple-600',
    3: 'bg-emerald-600',
  };

  // Group challenges by day
  const challengesByDay = challenges.reduce((acc, challenge) => {
    const day = Math.ceil(challenge.dayNumber / 5); // Approximate day grouping
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(challenge);
    return acc;
  }, {} as Record<number, typeof challenges>);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/python"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Python
        </Link>

        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 ${weekColors[module.weekNumber] || 'bg-zinc-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className="text-2xl font-bold text-white">W{module.weekNumber}</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2">
              {module.title}
            </h1>
            <p className="text-zinc-400 max-w-2xl">
              {module.description}
            </p>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-8">
        {Object.entries(challengesByDay).map(([day, dayChallenges]) => (
          <div key={day}>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              Day {day}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/python-challenge/${challenge.slug}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        challenge.difficulty === 'beginner'
                          ? 'bg-green-900/30 text-green-400'
                          : challenge.difficulty === 'intermediate'
                          ? 'bg-amber-900/30 text-amber-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                      {challenge.points} XP
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-blue-400 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {challenge.concepts.slice(0, 3).map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-500 rounded"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
