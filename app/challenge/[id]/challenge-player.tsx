'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { useQueryExecutor } from '@/hooks/use-query-executor';
import { DbStatusBadge } from '@/components/db-status-badge';
import { useGrader } from '@/hooks/use-grader';
import { SQLEditor } from '@/components/sql-editor';
import { ResultsDisplay } from '@/components/results-display';
import { FeedbackPanel } from '@/components/feedback-panel';
import { ProgressBar } from '@/components/progress-bar';
import { Navigation } from '@/components/navigation';
import type { Challenge, GradeResult } from '@/types';

interface ChallengePlayerProps {
  challenge: Challenge;
  nextId?: string;
  previousId?: string;
  allChallenges: Challenge[];
}

export function ChallengePlayer({
  challenge,
  nextId,
  previousId,
  allChallenges,
}: ChallengePlayerProps) {
  const [query, setQuery] = useState(challenge.starterCode);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const { results, error, executing, dbLoading, dbReady, executeQuery, clearResults } =
    useQueryExecutor(challenge.seedData);

  const { grade } = useGrader();
  const {
    progress,
    isCompleted,
    markComplete,
    getCompletionRate,
    getCompletedCount,
  } = useProgress();

  const challengeCompleted = isCompleted(challenge.id);

  useEffect(() => {
    setQuery(challenge.starterCode);
    setGradeResult(null);
    setShowSolution(false);
    clearResults();
  }, [challenge.id, challenge.starterCode, clearResults]);

  const handleSubmit = useCallback(async () => {
    await executeQuery(query);

    // Auto-grade after execution
    const result = await grade(query, results, challenge.tests, challenge.solution, challenge.seedData);
    setGradeResult(result);

    // Mark as complete if passed
    if (result.passed && !challengeCompleted) {
      markComplete(challenge.id);
    }
  }, [query, executeQuery, grade, challenge, results, challengeCompleted, markComplete]);

  const handleReset = () => {
    setQuery(challenge.starterCode);
    setGradeResult(null);
    setShowSolution(false);
    clearResults();
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setQuery(challenge.solution);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Week {Math.ceil(challenge.day / 7)} • Day {challenge.day % 7 || 7}
                </span>
                {challengeCompleted && (
                  <span className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs text-green-400 font-medium">
                    Completed
                  </span>
                )}
              </div>
              <h1 className="text-xl font-semibold text-zinc-100">{challenge.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-zinc-500 mb-1">Progress</div>
                <div className="text-sm font-medium text-zinc-300">
                  {getCompletedCount()}/{allChallenges.length}
                </div>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <ProgressBar completed={getCompletedCount()} total={allChallenges.length} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-3">Instructions</h2>
              <p className="text-zinc-300 leading-relaxed">{challenge.instructions}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-3">Description</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-3">Hints</h2>
              <div className="space-y-2">
                {challenge.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-zinc-400"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium text-zinc-500">
                      {index + 1}
                    </span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            </div>

            {gradeResult && (
              <FeedbackPanel gradeResult={gradeResult} hints={challenge.hints} />
            )}
          </div>

          {/* Right Column - Editor */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-zinc-100">SQL Editor</h2>
                  <DbStatusBadge
                    status={dbLoading ? 'loading' : dbReady ? 'ready' : 'error'}
                    error={error ?? undefined}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                  >
                    Reset
                  </button>
                  {!gradeResult?.passed && (
                    <button
                      onClick={handleShowSolution}
                      className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                    >
                      Show Solution
                    </button>
                  )}
                </div>
              </div>
              <SQLEditor
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                disabled={executing}
                placeholder="-- Write your SQL query here"
              />
            </div>

            <ResultsDisplay results={results} error={error} executing={executing} />

            {/* Database Schema */}
            {challenge.seedData && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Database Schema</h3>
                <pre className="text-sm text-zinc-400 overflow-x-auto bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                  <code>{extractSchema(challenge.seedData)}</code>
                </pre>
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
    </div>
  );
}

function extractSchema(seedData: string): string {
  // Extract CREATE TABLE statements from seed data
  const lines = seedData.split('\n');
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
