'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import initSqlJs, { Database } from 'sql.js';

export interface QueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
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
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        const database = new SQL.Database();
        setDb(database);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load database');
        setLoading(false);
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
