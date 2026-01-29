'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/use-progress';
import { useSQLDatabase } from '@/hooks/use-sql-database';
import { gradeQuery, executeSolution } from '@/lib/grader';
import { SQLEditor } from '@/components/sql-editor';
import { Navigation } from '@/components/navigation';
import type { Challenge } from '@/types';

interface ChallengePlayerProps {
  challenge: Challenge;
  nextId?: string;
  previousId?: string;
  allChallenges: Challenge[];
}

// ============================================================================
// Progress Status Banner Component
// ============================================================================

interface ProgressStatusProps {
  isCompleted: boolean;
  justCompleted: boolean;
  error: string | null;
  syncing: boolean;
  syncingMessage: string | null;
}

function ProgressStatus({ isCompleted, justCompleted, error, syncing, syncingMessage }: ProgressStatusProps) {
  if (justCompleted) {
    return (
      <div className="mb-4 px-4 py-3 bg-green-900/20 border border-green-800 rounded-xl flex items-center gap-3">
        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-green-400">Challenge completed! Progress saved.</span>
      </div>
    );
  }

  if (syncing || syncingMessage) {
    return (
      <div className="mb-4 px-4 py-3 bg-blue-900/20 border border-blue-800 rounded-xl flex items-center gap-3">
        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm text-blue-400">{syncingMessage || 'Saving progress...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 px-4 py-3 bg-amber-900/20 border border-amber-800 rounded-xl flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm text-amber-400">{error}</span>
      </div>
    );
  }

  return null;
}

// ============================================================================
// Main Challenge Player Component
// ============================================================================

export function ChallengePlayer({
  challenge,
  nextId,
  previousId,
  allChallenges,
}: ChallengePlayerProps) {
  // Query state
  const [query, setQuery] = useState(challenge.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [grade, setGrade] = useState<any>(null);

  // Completion state for UI feedback
  const [justCompleted, setJustCompleted] = useState(false);

  // Database
  const {
    db,
    loading: dbLoading,
    error: dbError,
    initStep,
    checkpointStatus,
    executeQuery,
    resetDatabase,
  } = useSQLDatabase(challenge.seedData);

  // Progress
  const {
    progress,
    isCompleted,
    markComplete,
    getCompletionRate,
    getCompletedCount,
    isLoading: progressLoading,
    isSyncing: syncing,
    error: progressError,
    syncingMessage,
  } = useProgress();

  const challengeCompleted = isCompleted(challenge.id);

  // Reset form when challenge changes
  useEffect(() => {
    setQuery(challenge.starterCode);
    setShowSolution(false);
    setResults(null);
    setGrade(null);
    setJustCompleted(false);
  }, [challenge.id, challenge.starterCode]);

  // Week colors
  const weekColors: Record<number, string> = {
    1: 'bg-blue-600',
    2: 'bg-purple-600',
    3: 'bg-emerald-600',
    4: 'bg-amber-600',
    5: 'bg-rose-600',
  };

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleReset = useCallback(() => {
    setQuery(challenge.starterCode);
    setShowSolution(false);
    setResults(null);
    setGrade(null);
    resetDatabase();
  }, [challenge.starterCode, resetDatabase]);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;

    const userResults = executeQuery(query);
    setResults(userResults);

    if (db && userResults) {
      const solutionResults = executeSolution(db, challenge.solution);
      const gradeResult = gradeQuery(
        query,
        userResults,
        challenge.tests,
        solutionResults || undefined
      );
      setGrade(gradeResult);

      // Auto-mark as complete when the challenge is solved
      if (gradeResult.passed && !challengeCompleted && !justCompleted) {
        markComplete(challenge.id);
        setJustCompleted(true);
      }
    }
  }, [query, db, executeQuery, challenge, challengeCompleted, justCompleted, markComplete]);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setQuery(challenge.solution);
  }, [challenge.solution]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Progress Status Banner */}
      <ProgressStatus
        isCompleted={challengeCompleted}
        justCompleted={justCompleted}
        error={progressError}
        syncing={syncing}
        syncingMessage={syncingMessage}
      />

      {/* Challenge Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Link href="/course" className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Course
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${weekColors[challenge.week] || 'bg-zinc-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-base sm:text-lg font-bold text-white">W{challenge.week}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1">
                <span className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Day {challenge.day} • Challenge {challenge.order}
                </span>
                {challengeCompleted && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-green-900/30 border border-green-800 rounded-[10px] text-[10px] sm:text-xs text-green-400 font-medium flex items-center gap-1" data-testid="challenge-completed-badge">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                )}
                <span className={`px-1.5 sm:px-2 py-0.5 border rounded-[10px] text-[10px] sm:text-xs font-medium ${
                  challenge.difficulty === 'beginner'
                    ? 'bg-green-900/20 border-green-800 text-green-400'
                    : challenge.difficulty === 'intermediate'
                    ? 'bg-amber-900/20 border-amber-800 text-amber-400'
                    : 'bg-red-900/20 border-red-800 text-red-400'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">{challenge.title}</h1>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-zinc-500 flex-shrink-0 sm:text-right">
            <div>Progress: {getCompletedCount()} / {allChallenges.length}</div>
            <div className="text-zinc-600">{getCompletionRate()}% complete</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Instructions */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2 sm:mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Instructions
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{challenge.instructions}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2 sm:mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Description
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {challenge.description}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2 sm:mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Hints
            </h2>
            <div className="space-y-1.5 sm:space-y-2">
              {challenge.hints.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium text-zinc-500">
                    {index + 1}
                  </span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Editor */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  SQL Editor
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                >
                  Reset
                </button>
                {!showSolution && (
                  <button
                    onClick={handleShowSolution}
                    className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                  >
                    Solution
                  </button>
                )}
              </div>
            </div>
            <SQLEditor
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              disabled={dbLoading}
              placeholder="-- Write your SQL query here"
            />
          </div>

          {/* Database Schema */}
          {challenge.seedData && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Database Schema
              </h3>
              <pre className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-zinc-400 overflow-x-auto bg-zinc-950 rounded-lg p-2 sm:p-3 lg:p-4 border border-zinc-800">
                <code>{extractSchema(challenge.seedData)}</code>
              </pre>
            </div>
          )}

          {/* Database Status */}
          {dbError && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-300">Database Error: {dbError}</p>
            </div>
          )}

          {dbLoading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400">Loading database engine... ({initStep})</p>
            </div>
          )}

          {/* Debug: Show checkpoint status (always visible in dev) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-xs space-y-1">
              <p className="font-semibold text-zinc-300">Database Checkpoint Status:</p>
              <p>State: <span className="text-blue-400">{checkpointStatus?.state || 'unknown'}</span></p>
              <p>Checkpoint: <span className="text-blue-400">{checkpointStatus?.checkpoint ?? '?'}/5</span></p>
              <p>Message: <span className="text-zinc-300">{checkpointStatus?.message || 'no message'}</span></p>
              {dbError && <p className="text-red-400">Error: {dbError}</p>}
            </div>
          )}

          {/* Debug: Show seed data info */}
          {process.env.NODE_ENV === 'development' && !dbLoading && !dbError && (
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-2 text-xs text-blue-300">
              <p>Seed data length: {challenge.seedData.length} chars</p>
              <p>Contains \\n: {challenge.seedData.includes('\\n') ? 'YES' : 'NO'}</p>
              <p>Contains actual newline: {challenge.seedData.includes('\n') ? 'YES' : 'NO'}</p>
            </div>
          )}

          {/* Results Display */}
          {results && !dbError && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Results ({results.rowCount} rows)
              </h3>

              {grade && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  grade.passed
                    ? 'bg-green-900/20 border-green-800'
                    : 'bg-amber-900/20 border-amber-800'
                }`}>
                  <p className={`text-sm font-medium ${
                    grade.passed ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {grade.feedback}
                  </p>
                  {!grade.passed && grade.hints.length > 0 && (
                    <ul className="mt-2 text-xs text-amber-300 list-disc list-inside">
                      {grade.hints.map((hint: string, i: number) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {results.rowCount === 0 ? (
                <p className="text-sm text-zinc-500 italic">No results returned</p>
              ) : (
                <div className="overflow-x-auto" data-testid="results-table">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        {results.columns.map((col: string) => (
                          <th key={col} className="px-3 py-2 text-left font-medium text-zinc-300">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.values.map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex} className="border-b border-zinc-800">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 text-zinc-400">
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        currentId={challenge.id}
        hasNext={!!nextId}
        hasPrevious={!!previousId}
        nextId={nextId}
        previousId={previousId}
      />
    </main>
  );
}

// ============================================================================
// Utilities
// ============================================================================

// Helper function to unescape SQL string that was serialized by JSON
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function extractSchema(seedData: string): string {
  // Unescape first - JSON serialization converts newlines to \n
  const unescaped = unescapeSqlString(seedData);
  const lines = unescaped.split('\n');
  const schemaLines: string[] = [];

  let capturing = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toUpperCase().startsWith('CREATE TABLE')) {
      capturing = true;
    }
    if (capturing) {
      schemaLines.push(line);
      if (trimmed.includes(')')) {
        break;
      }
    }
  }

  return schemaLines.join('\n');
}
