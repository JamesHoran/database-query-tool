import Link from 'next/link';
import { getAllModules, getAllChallenges } from '@/lib/python/challenges';
import { PythonEditor } from '@/components/python';

export default function PythonPage() {
  const modules = getAllModules();
  const allChallenges = getAllChallenges();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-2">
          Learn Python in 3 Weeks
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Master Python programming fundamentals through interactive challenges.
          Build real projects and develop skills that matter for technical interviews.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-2xl sm:text-3xl font-bold text-blue-400">{allChallenges.length}</div>
          <div className="text-xs sm:text-sm text-zinc-500">Challenges</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-">{modules.length}</div>
          <div className="text-xs sm:text-sm text-zinc-500">Weekly Modules</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">850</div>
          <div className="text-xs sm:text-sm text-zinc-500">Total XP</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">21</div>
          <div className="text-xs sm:text-sm text-zinc-500">Days</div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-100">Course Modules</h2>

        {modules.map((module, index) => {
          const moduleChallenges = allChallenges.filter((c) => c.moduleId === module.id);
          const weekColors = [
            'bg-blue-600',
            'bg-purple-600',
            'bg-emerald-600',
          ];

          return (
            <Link
              key={module.id}
              href={`/python/${module.slug}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${weekColors[index] || 'bg-zinc-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl font-bold text-white">W{module.weekNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>{moduleChallenges.length} challenges</span>
                    <span>~{module.estimatedHours} hours</span>
                    <span>{moduleChallenges.length * 10} XP</span>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-zinc-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-zinc-100 mb-2">
          Ready to start coding?
        </h3>
        <p className="text-zinc-400 mb-4 max-w-xl">
          Join thousands of learners mastering Python through hands-on practice.
          No installation required - write code directly in your browser.
        </p>
        <Link
          href="/python/week-01-basics"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Start Week 1
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
