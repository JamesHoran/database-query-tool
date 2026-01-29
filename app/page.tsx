import Link from 'next/link';

const courseInfo = [
  {
    id: 'sql',
    title: 'SQL Mastery',
    description: 'Master SQL from SELECT statements to complex window functions through 125 interactive challenges.',
    stats: { challenges: 125, weeks: 5, xp: 1250 },
    color: 'blue',
    gradient: 'from-blue-400 to-purple-400',
    path: '/sql',
    topics: ['SELECT & WHERE', 'GROUP BY & Aggregation', 'JOINs', 'CTEs', 'Window Functions'],
  },
  {
    id: 'python',
    title: 'Python Mastery',
    description: 'Learn Python programming from basics to OOP through 85+ interactive challenges and a portfolio project.',
    stats: { challenges: 85, weeks: 3, xp: 850 },
    color: 'emerald',
    gradient: 'from-emerald-400 to-teal-400',
    path: '/python',
    topics: ['Variables & Functions', 'Data Structures', 'OOP & Classes', 'File I/O', 'Portfolio Project'],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden sm:inline">FreeCodeCamp-style Interactive Learning</span>
            <span className="sm:hidden">Interactive Learning</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 mb-4 sm:mb-6 leading-tight tracking-tight">
            Master{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              In-Demand Skills
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2">
            200+ interactive challenges in SQL and Python. Browser-based, instant feedback, zero setup.
            Build real skills for technical interviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <a href="#courses" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-base sm:text-lg transition-colors shadow-lg shadow-blue-500/20 text-center">
              Choose Your Path
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20 text-center">
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">200+</div>
            <div className="text-xs sm:text-sm text-zinc-500">Challenges</div>
          </div>
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">2</div>
            <div className="text-xs sm:text-sm text-zinc-500">Courses</div>
          </div>
          <div className="px-2 sm:px-0">
            <div className="text-3xl sm:text-4xl font-bold text-zinc-100">2100</div>
            <div className="text-xs sm:text-sm text-zinc-500">XP to Earn</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Browser-Based SQL</h3>
            <p className="text-sm sm:text-base text-zinc-400">Write and run real SQL queries in your browser. No installation required using sql.js.</p>
          </div>
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Browser-Based Python</h3>
            <p className="text-sm sm:text-base text-zinc-400">Run Python code directly in your browser using Pyodide. Full Python 3 runtime.</p>
          </div>
          <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5 sm:mb-2">Instant Feedback</h3>
            <p className="text-sm sm:text-base text-zinc-400">Auto-graded challenges with progressive hints. Know immediately if your answer is correct.</p>
          </div>
        </div>

        {/* Course Cards */}
        <div id="courses" className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 text-center mb-3 sm:mb-4">Choose Your Learning Path</h2>
          <p className="text-sm sm:text-base text-zinc-400 text-center mb-8 sm:mb-12 max-w-xl mx-auto px-4">
            Master the skills that matter for technical interviews and real-world development
          </p>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {courseInfo.map((course) => (
              <Link
                key={course.id}
                href={course.path}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 sm:p-8 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${course.id === 'sql' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-700'}`}>
                    {course.id === 'sql' ? (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold text-zinc-100 transition-colors ${course.id === 'sql' ? 'group-hover:text-blue-400' : 'group-hover:text-emerald-400'}`}>
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500">{course.stats.weeks} Weeks • {course.stats.challenges} Challenges</p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 mb-4 sm:mb-6 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4 sm:mb-6">
                  {course.topics.slice(0, 3).map((topic) => (
                    <div key={topic} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${course.id === 'sql' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                      {topic}
                    </div>
                  ))}
                </div>

                <div className={`px-4 py-2 sm:py-2.5 rounded-lg text-white font-semibold text-sm sm:text-base text-center transition-colors ${course.id === 'sql' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  Start Learning
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-emerald-900/30 border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
          <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8 max-w-xl mx-auto px-4">
            Join thousands of learners mastering in-demand skills through interactive practice. No signup required.
          </p>
          <a href="#courses" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-base sm:text-lg transition-colors shadow-lg shadow-blue-500/20">
            Get Started Now — It's Free
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center text-zinc-500 text-xs sm:text-sm">
          CodeMastery — Interactive SQL & Python Learning Platform
        </div>
      </footer>
    </>
  );
}
