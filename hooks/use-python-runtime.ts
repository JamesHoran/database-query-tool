// use-python-runtime.ts - Pyodide Lifecycle Management

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializePythonRuntime,
  checkWebAssemblySupport,
  isPythonRuntimeInitialized,
} from '@/lib/python/runner';
import type { PythonRuntimeState } from '@/types/python';

export function usePythonRuntime() {
  const [state, setState] = useState<PythonRuntimeState>({
    pyodide: null,
    isLoading: true,
    error: null,
    supported: true,
  });

  const initializationRef = useRef(false);

  useEffect(() => {
    // Check WebAssembly support
    checkWebAssemblySupport().then((supported) => {
      if (!supported) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'WebAssembly is not supported in this browser. Please use a modern browser.',
          supported: false,
        }));
        return;
      }

      // Initialize Pyodide
      if (!initializationRef.current) {
        initializationRef.current = true;

        initializePythonRuntime()
          .then(() => {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              pyodide: {}, // We don't expose the actual pyodide instance
            }));
          })
          .catch((error) => {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: error.message || 'Failed to initialize Python runtime',
            }));
          });
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const reinitialize = useCallback(() => {
    initializationRef.current = false;
    setState({
      pyodide: null,
      isLoading: true,
      error: null,
      supported: true,
    });
  }, []);

  return {
    ...state,
    isInitialized: isPythonRuntimeInitialized(),
    reinitialize,
  };
}
