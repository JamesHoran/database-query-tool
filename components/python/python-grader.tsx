'use client';

import type { GradingResult } from '@/types/python';

interface PythonGraderProps {
  result: GradingResult | null;
  isRunning?: boolean;
}

export function PythonGrader({ result, isRunning = false }: PythonGraderProps) {
  if (isRunning) {
    return (
      <div className="python-grader bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Running tests...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="python-grader bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <p className="text-sm text-zinc-500 italic">
          Run your code to see test results...
        </p>
      </div>
    );
  }

  const passedCount = result.tests.filter((t) => t.passed).length;
  const totalCount = result.tests.length;
  const percentage = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  return (
    <div
      className={`python-grader rounded-lg border overflow-hidden ${
        result.passed
          ? 'bg-green-950/20 border-green-900/50'
          : 'bg-amber-950/20 border-amber-900/50'
      }`}
    >
      {/* Summary Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {result.passed ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <h3 className={`font-semibold ${result.passed ? 'text-green-400' : 'text-amber-400'}`}>
              {result.feedback}
            </h3>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${result.passed ? 'text-green-400' : 'text-amber-400'}`}>
              {passedCount}/{totalCount}
            </div>
            <div className="text-xs text-zinc-600">{Math.round(percentage)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              result.passed ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {result.xpEarned > 0 && (
          <div className="mt-2 text-xs text-zinc-400">
            +{result.xpEarned} XP earned
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="max-h-[200px] overflow-y-auto">
        {result.tests.map((test, index) => (
          <div
            key={index}
            className={`p-3 border-b border-zinc-800 last:border-b-0 ${
              test.passed ? 'bg-green-950/10' : 'bg-red-950/10'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {test.passed ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {test.name}
                </div>
                {test.error && (
                  <div className="mt-1 text-xs text-red-300 font-mono bg-red-950/30 p-2 rounded">
                    {test.error}
                  </div>
                )}
                {test.output && !test.passed && (
                  <div className="mt-1 text-xs text-zinc-400 font-mono">
                    {test.output}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Challenge Link */}
      {result.nextChallenge && result.passed && (
        <div className="p-3 bg-green-950/30 border-t border-green-900/50">
          <a
            href={`/python-challenge/${result.nextChallenge}`}
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            Next Challenge
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
