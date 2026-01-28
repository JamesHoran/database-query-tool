'use client';

import type { QueryResult } from '@/types';

interface ResultsDisplayProps {
  results: QueryResult | null;
  error: string | null;
  executing?: boolean;
}

export function ResultsDisplay({
  results,
  error,
  executing = false,
}: ResultsDisplayProps) {
  if (executing) {
    return (
      <div className="border border-zinc-700 rounded-lg bg-zinc-900 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <span className="ml-3 text-zinc-400">Executing query...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-900 rounded-lg bg-red-950/50 p-6">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-red-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-red-400 font-semibold">SQL Error</h3>
            <p className="mt-1 text-red-300 text-sm font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="border border-zinc-700 rounded-lg bg-zinc-900 p-8">
        <div className="text-center text-zinc-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Run a query to see results here</p>
        </div>
      </div>
    );
  }

  if (results.columns.length === 0) {
    return (
      <div className="border border-zinc-700 rounded-lg bg-zinc-900 p-6">
        <p className="text-zinc-400 text-center">
          Query executed successfully. No results returned.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
      <div className="px-4 py-3 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
        <h3 className="text-zinc-300 font-medium">Query Results</h3>
        <span className="text-zinc-500 text-sm">
          {results.rowCount} row{results.rowCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800">
              {results.columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-zinc-300 font-semibold text-sm border-b border-zinc-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.values.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-zinc-800/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-zinc-300 text-sm border-b border-zinc-800"
                  >
                    {cell === null ? (
                      <span className="text-zinc-600 italic">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
