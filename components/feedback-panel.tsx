'use client';

import { useState } from 'react';
import type { GradeResult } from '@/types';

interface FeedbackPanelProps {
  gradeResult: GradeResult | null;
  hints: string[];
}

export function FeedbackPanel({ gradeResult, hints }: FeedbackPanelProps) {
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);

  if (!gradeResult) {
    return (
      <div className="border border-zinc-700 rounded-lg bg-zinc-900 p-6">
        <p className="text-zinc-500 text-center">
          Run your query to get feedback
        </p>
      </div>
    );
  }

  const allHints = [...(gradeResult.hints || []), ...hints];
  const displayHints = gradeResult.passed ? [] : allHints;

  return (
    <div
      className={`border rounded-lg p-6 ${
        gradeResult.passed
          ? 'bg-green-950/30 border-green-900'
          : 'bg-amber-950/30 border-amber-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {gradeResult.passed ? (
            <svg
              className="w-8 h-8 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-amber-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          <div className="ml-3 flex-1">
            <h3
              className={`font-semibold ${
                gradeResult.passed ? 'text-green-400' : 'text-amber-400'
              }`}
            >
              {gradeResult.feedback}
            </h3>
            {!gradeResult.passed && displayHints.length > 0 && (
              <p className="mt-1 text-zinc-400 text-sm">
                {displayHints.length} hint{displayHints.length !== 1 ? 's' : ''}{' '}
                available
              </p>
            )}
          </div>
          {gradeResult.passed && (
            <div className="text-right">
              <span className="text-3xl font-bold text-green-400">
                {gradeResult.score}%
              </span>
            </div>
          )}
        </div>
      </div>

      {!gradeResult.passed && displayHints.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
          >
            {showHints ? (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Hide hints
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show hints
              </>
            )}
          </button>

          {showHints && (
            <div className="mt-4 space-y-3">
              {displayHints.slice(0, currentHint + 1).map((hint, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700"
                >
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="ml-3 text-zinc-300 text-sm">{hint}</p>
                  </div>
                </div>
              ))}
              {currentHint < displayHints.length - 1 && (
                <button
                  onClick={() => setCurrentHint(currentHint + 1)}
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  Show next hint →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
