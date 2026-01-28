// use-python-execution.ts - Code Execution State Management

import { useState, useCallback } from 'react';
import { executePython } from '@/lib/python/runner';
import type { ExecutionResult } from '@/types/python';

interface UsePythonExecutionOptions {
  onError?: (error: string) => void;
  onSuccess?: (result: ExecutionResult) => void;
}

export function usePythonExecution(options: UsePythonExecutionOptions = {}) {
  const [state, setState] = useState<{
    isRunning: boolean;
    output: string;
    error: string | null;
    executionTime: number;
  }>({
    isRunning: false,
    output: '',
    error: null,
    executionTime: 0,
  });

  const execute = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        return;
      }

      setState({
        isRunning: true,
        output: '',
        error: null,
        executionTime: 0,
      });

      try {
        const result = await executePython(code);

        if (result.success) {
          setState({
            isRunning: false,
            output: result.output || 'Code executed successfully (no output)',
            error: null,
            executionTime: result.executionTime,
          });
          options.onSuccess?.({
            stdout: result.output,
            stderr: '',
            executionTime: result.executionTime,
          });
        } else {
          const errorMessage = result.error || 'An unknown error occurred';
          setState({
            isRunning: false,
            output: result.output,
            error: errorMessage,
            executionTime: result.executionTime,
          });
          options.onError?.(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || String(error);
        setState({
          isRunning: false,
          output: '',
          error: errorMessage,
          executionTime: 0,
        });
        options.onError?.(errorMessage);
      }
    },
    [options]
  );

  const clear = useCallback(() => {
    setState({
      isRunning: false,
      output: '',
      error: null,
      executionTime: 0,
    });
  }, []);

  const setOutput = useCallback((output: string) => {
    setState((prev) => ({ ...prev, output }));
  }, []);

  return {
    ...state,
    execute,
    clear,
    setOutput,
  };
}
