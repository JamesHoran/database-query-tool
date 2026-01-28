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
    <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
      <div>
        {hasPrevious && (
          previousId ? (
            <Link
              href={`/challenge/${previousId}`}
              className="inline-flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Previous
            </Link>
          ) : (
            <button
              onClick={onPrevious}
              className="inline-flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Previous
            </button>
          )
        )}
      </div>

      <span className="text-zinc-500 text-sm font-mono">{currentId}</span>

      <div>
        {hasNext && (
          nextId ? (
            <Link
              href={`/challenge/${nextId}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Next
              <svg
                className="w-5 h-5 ml-2"
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Next
              <svg
                className="w-5 h-5 ml-2"
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
