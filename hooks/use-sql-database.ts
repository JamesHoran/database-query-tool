'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import initSqlJs, { Database } from 'sql.js';

export interface QueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
}

// List of CDN fallbacks for SQL.js WASM files
const SQLJS_CDN_FALLBACKS = [
  'https://sql.js.org/dist/', // Official CDN
  'https://cdn.jsdelivr.net/npm/sql.js/dist/', // jsDelivr CDN
  'https://unpkg.com/sql.js/dist/', // unpkg CDN
];

/**
 * Attempts to load SQL.js from multiple CDN sources with retry logic
 */
async function loadSqlJsWithRetry(): Promise<any> {
  const maxRetries = 2; // Retries per CDN

  for (const cdnBase of SQLJS_CDN_FALLBACKS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `${cdnBase}${file}`,
        });
        return SQL;
      } catch (err) {
        const isLastAttempt = attempt === maxRetries;
        if (isLastAttempt) {
          console.warn(
            `Failed to load SQL.js from ${cdnBase} after ${maxRetries + 1} attempts. Trying next CDN...`
          );
        } else {
          console.warn(
            `Attempt ${attempt + 1} failed for ${cdnBase}. Retrying...`
          );
        }
      }
    }
  }

  throw new Error(
    'Failed to load SQL.js from all CDN sources. Please check your internet connection or try again later.'
  );
}

export function useSQLDatabase(seedData: string) {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initPromise = useRef<Promise<void> | null>(null);

  // Initialize sql.js (only once)
  useEffect(() => {
    if (initPromise.current) return;

    initPromise.current = (async () => {
      try {
        const SQL = await loadSqlJsWithRetry();
        const database = new SQL.Database();
        setDb(database);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load database. Please refresh the page.';
        setError(errorMessage);
        setLoading(false);
        console.error('SQL.js initialization error:', err);
      }
    })();

    return () => {
      // Cleanup database on unmount
      if (db) db.close();
    };
  }, []);

  // Load seed data when db is ready
  useEffect(() => {
    if (db && seedData) {
      try {
        db.run(seedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load seed data');
      }
    }
  }, [db, seedData]);

  const executeQuery = useCallback((sql: string): QueryResult | null => {
    if (!db) return null;

    try {
      const results = db.exec(sql);

      if (results.length === 0) {
        return { columns: [], values: [], rowCount: 0 };
      }

      return {
        columns: results[0].columns,
        values: results[0].values,
        rowCount: results[0].values.length,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
      return null;
    }
  }, [db]);

  const resetDatabase = useCallback(() => {
    if (!db) return;

    try {
      // Close and recreate database
      db.close();
      const newDb = new (db.constructor as new () => Database)();
      setDb(newDb);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset database');
    }
  }, [db]);

  return {
    db,
    loading,
    error,
    executeQuery,
    resetDatabase,
  };
}
