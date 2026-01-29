'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePythonRuntime } from '@/hooks/use-python-runtime';
import { usePythonExecution } from '@/hooks/use-python-execution';
import { usePythonProgress } from '@/hooks/use-python-progress';
import { gradePythonSubmission, generateHintFromError } from '@/lib/python/grader';
import { PythonEditor, PythonConsole, PythonGrader, MobileCodeEditor } from '@/components/python';
import type { PythonChallenge, GradingResult } from '@/types/python';

interface PythonPlayerProps {
  challenge: PythonChallenge;
  nextId?: string;
  previousId?: string;
  allChallenges: PythonChallenge[];
}

export function PythonPlayer({
  challenge,
  nextId,
  previousId,
  allChallenges,
}: PythonPlayerProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isLoading: runtimeLoading, error: runtimeError, isInitialized } = usePythonRuntime();
  const { isRunning, output, error: execError, execute, clear } = usePythonExecution();
  const { isCompleted, markComplete, getCompletedCount } = usePythonProgress();

  const challengeCompleted = isCompleted(challenge.id);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset state when challenge changes
  useEffect(() => {
    setCode(challenge.starterCode);
    setShowSolution(false);
    setGradeResult(null);
    clear();
  }, [challenge.id, challenge.starterCode, clear]);

  const handleRun = async () => {
    clear();
    await execute(code);
  };

  const handleGrade = async () => {
    if (!isInitialized) {
      return;
    }

    setIsGrading(true);
    try {
      const result = await gradePythonSubmission(code, challenge.tests, true);
      setGradeResult(result);

      // Mark complete if passed and not already completed
      if (result.passed && !challengeCompleted) {
        await markComplete(challenge.id);
      }
    } finally {
      setIsGrading(false);
    }
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setShowSolution(false);
    setGradeResult(null);
    clear();
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setCode(challenge.solutionCode);
  };

  const weekColors: Record<number, string> = {
    1: 'bg-blue-600',
    2: 'bg-purple-600',
    3: 'bg-emerald-600',
  };

  const weekNumber = Math.ceil(challenge.dayNumber / 7);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Challenge Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Link href="/python" className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Python
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${weekColors[weekNumber] || 'bg-zinc-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-base sm:text-lg font-bold text-white">D{challenge.dayNumber}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1">
                <span className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Day {challenge.dayNumber}
                </span>
                {challengeCompleted && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-green-900/30 border border-green-800 rounded-[10px] text-[10px] sm:text-xs text-green-400 font-medium">
                    ✓ Completed
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
                <span className="px-1.5 sm:px-2 py-0.5 bg-blue-900/20 border border-blue-800 rounded-[10px] text-[10px] sm:text-xs text-blue-400 font-medium">
                  {challenge.points} XP
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">{challenge.title}</h1>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-zinc-500 flex-shrink-0 sm:text-right">
            <div>Progress: {getCompletedCount()} / {allChallenges.length}</div>
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
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line">
              {challenge.instructions}
            </p>
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

          {/* Hints Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between text-base sm:text-lg font-semibold text-zinc-100 mb-2 sm:mb-3"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Hints
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${showHints ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showHints && (
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
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors"
            >
              Reset Code
            </button>
            {!showSolution && (
              <button
                onClick={handleShowSolution}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors"
              >
                Show Solution
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Editor and Output */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Runtime Status */}
          {runtimeLoading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading Python runtime...</span>
              </div>
            </div>
          )}

          {runtimeError && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-300">{runtimeError}</p>
            </div>
          )}

          {/* Mobile Editor or Desktop Editor */}
          {isMobile ? (
            <MobileCodeEditor
              value={code}
              onChange={setCode}
              output={output}
              error={execError || (gradeResult && !gradeResult.passed ? gradeResult.feedback : null)}
              isRunning={isRunning || isGrading}
              executionTime={0}
              onRun={handleRun}
              onReset={handleReset}
              placeholder="# Write your Python code here"
            />
          ) : (
            <>
              {/* Editor */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <h2 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Python Editor
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRun}
                      disabled={isRunning || !isInitialized}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs sm:text-sm rounded-md font-medium transition-colors flex items-center gap-1.5"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Running
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Run
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleGrade}
                      disabled={isGrading || !isInitialized}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs sm:text-sm rounded-md font-medium transition-colors"
                    >
                      {isGrading ? 'Testing...' : 'Submit'}
                    </button>
                  </div>
                </div>
                <PythonEditor
                  value={code}
                  onChange={setCode}
                  onSubmit={handleRun}
                  disabled={!isInitialized}
                  placeholder="# Write your Python code here"
                  minHeight={300}
                  maxHeight={500}
                  showMobileToolbar={false}
                />
              </div>

              {/* Console */}
              <PythonConsole
                output={output}
                error={execError}
                isRunning={isRunning}
              />

              {/* Grader */}
              <PythonGrader
                result={gradeResult}
                isRunning={isGrading}
              />
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {previousId ? (
          <Link
            href={`/python-challenge/${previousId}`}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Challenge
          </Link>
        ) : (
          <div />
        )}

        {nextId && gradeResult?.passed && (
          <Link
            href={`/python-challenge/${nextId}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            Next Challenge
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </main>
  );
}
