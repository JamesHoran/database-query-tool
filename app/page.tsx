import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-900/30 border border-blue-800 rounded-full text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="hidden sm:inline">FreeCodeCamp-style Interactive Learning</span>
            <span className="sm:hidden">Interactive Learning</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 mb-4 sm:mb-6 leading-tight tracking-tight">
            Master SQL From{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Basics to Advanced
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2">
            125 interactive challenges taking you from SELECT statements to complex window functions.
            Browser-based, instant feedback, zero setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/course" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-base sm:text-lg transition-colors shadow-lg shadow-blue-500/20 text-center">
              Start Learning Free
            </Link>
            <a href="#curriculum" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 font-semibold text-base sm:text-lg transition-colors text-center">
              View Curriculum
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20 text-center">
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">125</div>
            <div className="text-xs sm:text-sm text-zinc-500">Challenges</div>
          </div>
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">5</div>
            <div className="text-xs sm:text-sm text-zinc-500">Weeks</div>
          </div>
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">100%</div>
            <div className="text-xs sm:text-sm text-zinc-500">Browser-Based</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Browser-Based SQL</h3>
            <p className="text-sm sm:text-base text-zinc-400">Write and run real SQL queries in your browser. No installation required using sql.js.</p>
          </div>
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Instant Feedback</h3>
            <p className="text-sm sm:text-base text-zinc-400">Auto-graded challenges with progressive hints. Know immediately if your answer is correct.</p>
          </div>
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Complete Curriculum</h3>
            <p className="text-sm sm:text-base text-zinc-400">From SELECT basics to window functions and CTEs. Comprehensive coverage for interviews.</p>
          </div>
        </div>

        {/* Curriculum Preview */}
        <div id="curriculum" className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 text-center mb-3 sm:mb-4">The 5-Week Curriculum</h2>
          <p className="text-sm sm:text-base text-zinc-400 text-center mb-8 sm:mb-12 max-w-xl mx-auto px-4">
            A structured path from absolute beginner to advanced SQL practitioner
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { week: 1, title: 'SQL Fundamentals', color: 'blue', topics: ['SELECT', 'WHERE', 'ORDER BY', 'Aggregates'] },
              { week: 2, title: 'GROUP BY', color: 'purple', topics: ['GROUP BY', 'HAVING', 'Advanced Aggregates'] },
              { week: 3, title: 'JOINs', color: 'emerald', topics: ['INNER', 'LEFT/RIGHT', 'Self-Join', 'UNION'] },
              { week: 4, title: 'Advanced SQL', color: 'amber', topics: ['CTEs', 'Window Functions', 'INSERT/UPDATE'] },
              { week: 5, title: 'Real World', color: 'rose', topics: ['Business Reports', 'Analytics', 'Complex Queries'] },
            ].map((w) => (
              <Link key={w.week} href={`/course#w${w.week}`} className="group">
                <div className="p-3 sm:p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/70 transition-all h-full">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${w.color}-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-sm sm:text-lg font-bold text-white">W{w.week}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-100 mb-2">{w.title}</h3>
                  <ul className="text-xs sm:text-sm text-zinc-500 space-y-0.5 sm:space-y-1">
                    {w.topics.map((t) => (
                      <li key={t} className="flex items-center">
                        <span className="w-1 h-1 bg-zinc-600 rounded-full mr-1.5 sm:mr-2" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 sm:mb-4">Ready to Master SQL?</h2>
          <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8 max-w-xl mx-auto px-4">
            Join thousands learning SQL through interactive practice. No signup required.
          </p>
          <Link href="/course" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-base sm:text-lg transition-colors shadow-lg shadow-blue-500/20">
            Start Learning Now — It's Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center text-zinc-500 text-xs sm:text-sm">
          SQL Mastery — Interactive SQL Learning Platform
        </div>
      </footer>
    </>
  );
}
