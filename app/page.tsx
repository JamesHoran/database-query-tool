import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-100">SQL Interview Mastery</h1>
          </div>
          <Link href="/course" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors text-sm font-medium">
            View Course
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-800 rounded-full text-blue-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            FreeCodeCamp-style Interactive Learning
          </div>
          <h2 className="text-5xl font-bold text-zinc-100 mb-6 leading-tight">
            Master SQL for Interviews<br />
            <span className="text-blue-500">in Just 2 Weeks</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            97 interactive challenges, instant feedback, zero setup. Learn the patterns that
            appear in 80%+ of SQL interviews.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/course" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-lg transition-colors">
              Start Learning Free
            </Link>
            <a href="#curriculum" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 font-semibold text-lg transition-colors">
              View Curriculum
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Browser-Based SQL</h3>
            <p className="text-zinc-400">Write and run real SQL queries in your browser. No installation required using sql.js.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Instant Feedback</h3>
            <p className="text-zinc-400">Auto-graded challenges with progressive hints. Know immediately if your answer is correct.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Interview Focused</h3>
            <p className="text-zinc-400">Learn the 6 essential patterns that appear in 80%+ of SQL interviews.</p>
          </div>
        </div>

        {/* Curriculum */}
        <div id="curriculum" className="mb-20">
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-12">The 2-Week Curriculum</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Week 1 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-blue-500">Week 1</span>
                <span className="text-zinc-400">Foundations</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 1: SQL Fundamentals (SELECT, FROM, basic syntax)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 2: Filtering & Sorting (WHERE, ORDER BY, NULL)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 3: Aggregation I (GROUP BY, COUNT, SUM, AVG)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 4: Aggregation II (HAVING, filtering groups)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 5: Pattern Matching (LIKE, IN, BETWEEN)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 6: Practice Day (mixed challenges)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 7: Week 1 Assessment
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <span className="text-sm text-zinc-500">45 challenges</span>
              </div>
            </div>

            {/* Week 2 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-purple-500">Week 2</span>
                <span className="text-zinc-400">Advanced Concepts</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 8: INNER JOIN (basics)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 9: OUTER JOIN (LEFT/RIGHT/FULL, NULL handling)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 10: Complex JOINs (self-join, multi-table)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 11: CTEs (WITH clause, readability)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 12: Window Functions (OVER, PARTITION BY, RANK)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 13: Advanced Windows (LAG/LEAD, running totals)
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-2 h-2 bg-zinc-600 rounded-full mr-3" />
                  Day 14: Final Assessment (interview simulation)
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <span className="text-sm text-zinc-500">52 challenges</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">Ready to Ace Your SQL Interview?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Join thousands of developers who have mastered SQL through interactive practice.
          </p>
          <Link href="/course" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-lg transition-colors">
            Start Learning Now
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-zinc-500 text-sm">
          SQL Interview Mastery — Interactive SQL Learning Platform
        </div>
      </footer>
    </div>
  );
}
