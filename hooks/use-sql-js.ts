'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Dynamically import sql.js to avoid server-side bundling issues
type Database = any;
type SqlJsModule = any;

interface UseSqlJsResult {
  db: Database | null;
  loading: boolean;
  error: Error | null;
  initializeDatabase: (seedData: string) => Promise<Database | null>;
  runQuery: (query: string) => { columns: string[]; values: any[][] } | null;
}

export function useSqlJs(): UseSqlJsResult {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const sqlJsRef = useRef<SqlJsModule | null>(null);
  const initPromise = useRef<Promise<void> | null>(null);

  // Initialize SQL.js on mount (client-side only)
  const initSqlJs = useCallback(async () => {
    if (initPromise.current) {
      return initPromise.current;
    }

    initPromise.current = (async () => {
      try {
        setLoading(true);

        // Dynamic import to avoid server-side bundling
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });

        sqlJsRef.current = SQL;
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load SQL.js'));
        setLoading(false);
      }
    })();

    return initPromise.current;
  }, []);

  // Initialize on mount with proper cleanup
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      await initSqlJs();
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [initSqlJs]);

  const initializeDatabase = useCallback(async (seedData: string): Promise<Database | null> => {
    // Wait for SQL.js to initialize
    await initSqlJs();

    if (!sqlJsRef.current) {
      setError(new Error('SQL.js not initialized'));
      return null;
    }

    try {
      const newDb = new sqlJsRef.current.Database();

      if (seedData) {
        newDb.exec(seedData);
      }

      setDb(newDb);
      return newDb;
    } catch (err) {
      console.error('Failed to initialize database:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      return null;
    }
  }, [initSqlJs]);

  const runQuery = useCallback((query: string): { columns: string[]; values: any[][] } | null => {
    if (!db) {
      return null;
    }

    try {
      const results = db.exec(query);

      if (results.length === 0) {
        return { columns: [], values: [] };
      }

      return {
        columns: results[0].columns,
        values: results[0].values,
      };
    } catch (err) {
      console.error('SQL query error:', {
        query: query.trim(),
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }, [db]);

  return {
    db,
    loading,
    error,
    initializeDatabase,
    runQuery,
  };
}
