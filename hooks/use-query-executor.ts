'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSqlJs } from './use-sql-js';
import type { QueryResult } from '@/types';

interface UseQueryExecutorResult {
  results: QueryResult | null;
  error: string | null;
  executing: boolean;
  dbLoading: boolean;
  dbReady: boolean;
  executeQuery: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useQueryExecutor(
  seedData: string,
  autoInitialize = true
): UseQueryExecutorResult {
  const { db, loading, error: sqlError, initializeDatabase, runQuery } = useSqlJs();
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (!loading && !initialized && !sqlError) {
      await initializeDatabase(seedData);
      setInitialized(true);
    }
  }, [loading, initialized, sqlError, seedData, initializeDatabase]);

  // Auto-initialize if enabled
  useEffect(() => {
    if (autoInitialize && !initialized && !loading) {
      initialize();
    }
  }, [autoInitialize, initialized, loading, initialize]);

  const executeQuery = useCallback(async (query: string) => {
    if (!db) {
      setError('Database not initialized');
      return;
    }

    setExecuting(true);
    setError(null);

    try {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setResults({ columns: [], values: [], rowCount: 0 });
        return;
      }

      const result = runQuery(trimmedQuery);

      if (!result) {
        setError('Query executed but returned no results');
        setResults(null);
        return;
      }

      setResults({
        columns: result.columns,
        values: result.values,
        rowCount: result.values.length,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setResults(null);
    } finally {
      setExecuting(false);
    }
  }, [db, runQuery]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    error,
    executing,
    dbLoading: loading,
    dbReady: !!db && !loading && !sqlError,
    executeQuery,
    clearResults,
  };
}
