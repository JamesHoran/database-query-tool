'use client';

import type { ExecutionResult } from '@/types/python';

interface PythonConsoleProps {
  output: string;
  error: string | null;
  executionTime?: number;
  isRunning?: boolean;
}

export function PythonConsole({
  output,
  error,
  executionTime = 0,
  isRunning = false,
}: PythonConsoleProps) {
  return (
    <div className="python-console bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-zinc-400 ml-2">Python Console</span>
        </div>
        {executionTime > 0 && (
          <span className="text-xs text-zinc-600">
            {executionTime.toFixed(2)}ms
          </span>
        )}
      </div>

      {/* Console Output */}
      <div className="p-4 min-h-[100px] max-h-[300px] overflow-y-auto">
        {isRunning ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Running...</span>
          </div>
        ) : error ? (
          <div className="space-y-2">
            <div className="text-red-400 font-mono text-sm whitespace-pre-wrap bg-red-950/30 p-3 rounded border border-red-900/50">
              {formatError(error)}
            </div>
            {output && (
              <div className="text-zinc-400 font-mono text-sm whitespace-pre-wrap">
                {output}
              </div>
            )}
          </div>
        ) : output ? (
          <div className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">
            {output}
          </div>
        ) : (
          <div className="text-zinc-600 text-sm italic">
            Output will appear here...
          </div>
        )}
      </div>

      {/* Console Footer */}
      {executionTime > 0 && !isRunning && (
        <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center">
          <span className="text-xs text-zinc-600">
            {error ? '❌ Error' : '✓ Success'}
          </span>
          <span className="text-xs text-zinc-600">
            {executionTime.toFixed(2)}ms
          </span>
        </div>
      )}
    </div>
  );
}

function formatError(error: string): string {
  // Extract the main error message from Python traceback
  const lines = error.split('\n');

  // Find the last meaningful line (usually the actual error)
  const errorLine = lines.reverse().find((line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith('File ') && !trimmed.startsWith('Traceback');
  });

  // Format traceback
  const traceback = lines
    .filter((line) => line.includes('File "<exec>"') || line.includes('line'))
    .join('\n');

  if (errorLine) {
    return traceback ? `${traceback}\n${errorLine}` : errorLine;
  }

  return error;
}
