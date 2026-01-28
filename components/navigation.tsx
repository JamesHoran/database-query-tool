'use client';

import Link from 'next/link';

interface NavigationProps {
  currentId: string;
  hasNext: boolean;
  hasPrevious: boolean;
  nextId?: string;
  previousId?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Navigation({
  currentId,
  hasNext,
  hasPrevious,
  nextId,
  previousId,
  onNext,
  onPrevious,
}: NavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-zinc-800">
      <div className="flex-1">
        {hasPrevious && (
          previousId ? (
            <Link
              href={`/challenge/${previousId}`}
              className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm">Previous</span>
            </Link>
          ) : (
            <button
              onClick={onPrevious}
              className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm">Previous</span>
            </button>
          )
        )}
      </div>

      <div className="hidden sm:block text-zinc-500 text-xs sm:text-sm font-mono px-2">
        {currentId}
      </div>

      <div className="flex-1">
        {hasNext && (
          nextId ? (
            <Link
              href={`/challenge/${nextId}`}
              className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <span className="text-sm">Next</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <span className="text-sm">Next</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )
        )}
      </div>
    </div>
  );
}
