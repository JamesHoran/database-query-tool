'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import initSqlJs, { Database } from 'sql.js';

export interface QueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
}

export type CheckpointState =
  | 'idle'
  | 'module_loading'
  | 'db_creation'
  | 'seed_processing'
  | 'db_seeding'
  | 'ready'
  | 'query_executing'
  | 'query_failed'
  | 'failed';

export interface CheckpointStatus {
  state: CheckpointState;
  checkpoint: number; // 1-5
  message: string;
  timestamp: number;
}

// Console log prefix for easy filtering
const LOG_PREFIX = '[DB Checkpoint]';

function logCheckpoint(checkpoint: number, state: CheckpointState, message: string, success = true): CheckpointStatus {
  const status: CheckpointStatus = {
    state,
    checkpoint,
    message,
    timestamp: Date.now(),
  };
  const emoji = success ? '✓' : '✗';
  console.log(`${LOG_PREFIX} [${checkpoint}/5] ${state}: ${emoji} ${message}`);
  return status;
}

// List of CDN fallbacks for SQL.js WASM files
const SQLJS_CDN_FALLBACKS = [
  'https://sql.js.org/dist/', // Official CDN
  'https://cdn.jsdelivr.net/npm/sql.js/dist/', // jsDelivr CDN
  'https://unpkg.com/sql.js/dist/', // unpkg CDN
];

/**
 * Unescapes SQL string that was serialized by JSON
 * JSON serialization converts actual newlines to \n escape sequences
 */
function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

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
  const [currentSeedData, setCurrentSeedData] = useState<string>(seedData);
  const [initStep, setInitStep] = useState<string>('not started');
  const [checkpointStatus, setCheckpointStatus] = useState<CheckpointStatus | null>(null);
  const sqlModuleRef = useRef<any>(null);
  const isSeedingRef = useRef(false);

  // Initialize sql.js (only once per session)
  useEffect(() => {
    if (sqlModuleRef.current) return;

    (async () => {
      try {
        // === CHECKPOINT 1: Module Loading ===
        setCheckpointStatus(logCheckpoint(1, 'module_loading', 'Loading SQL.js WASM module...'));
        const SQL = await loadSqlJsWithRetry();
        sqlModuleRef.current = SQL;
        setCheckpointStatus(logCheckpoint(1, 'module_loading', 'Module loaded from CDN'));

        // === CHECKPOINT 2: Database Creation ===
        setCheckpointStatus(logCheckpoint(2, 'db_creation', 'Creating database object...'));
        const database = new SQL.Database();
        logCheckpoint(2, 'db_creation', 'Database object created');
        setDb(database);

        // === CHECKPOINT 3: Seed Data Processing ===
        setCheckpointStatus(logCheckpoint(3, 'seed_processing', `Processing seed data (${seedData.length} chars)...`));
        console.log(`${LOG_PREFIX} Raw seedData (first 100 chars):`, seedData.substring(0, 100));
        console.log(`${LOG_PREFIX} Raw seedData contains escaped newlines (\\\\n):`, seedData.includes('\\n'));

        const unescapedSeedData = unescapeSqlString(seedData);
        const processingStatus = logCheckpoint(3, 'seed_processing', `Seed data processed (${unescapedSeedData.length} chars)`);
        setCheckpointStatus(processingStatus);
        console.log(`${LOG_PREFIX} Unescaped seedData (first 100 chars):`, unescapedSeedData.substring(0, 100));
        console.log(`${LOG_PREFIX} Unescaped seedData contains actual newlines (\\n):`, unescapedSeedData.includes('\n'));

        // === CHECKPOINT 4: Database Seeding ===
        setCheckpointStatus(logCheckpoint(4, 'db_seeding', 'Seeding database with CREATE TABLE and INSERT...'));
        database.exec(unescapedSeedData);

        // Verify tables were created
        const tablesResult = database.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
        const tableCount = tablesResult.length > 0 ? tablesResult[0].values.length : 0;
        const tableNames = tablesResult.length > 0 ? tablesResult[0].values.map((row: any[]) => row[0]).join(', ') : 'none';
        logCheckpoint(4, 'db_seeding', `Database seeded: ${tableCount} tables (${tableNames})`);

        // === READY STATE ===
        setCheckpointStatus(logCheckpoint(5, 'ready', 'Database ready for queries'));
        setCurrentSeedData(seedData);
        setLoading(false);
        setInitStep('done');
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load database. Please refresh the page.';
        console.error(`${LOG_PREFIX} Initialization failed at checkpoint:`, checkpointStatus?.checkpoint);
        console.error(`${LOG_PREFIX} Error details:`, err);
        setError(`[${checkpointStatus?.state}] ${errorMessage}`);
        setCheckpointStatus({
          state: 'failed',
          checkpoint: checkpointStatus?.checkpoint ?? 0,
          message: errorMessage,
          timestamp: Date.now(),
        });
        setLoading(false);
        setInitStep('failed');
      }
    })();

    return () => {
      // Cleanup database on unmount
      if (db) {
        try {
          db.close();
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-initialize database when seedData changes (different challenge)
  useEffect(() => {
    if (!sqlModuleRef.current || seedData === currentSeedData) return;

    console.log(`${LOG_PREFIX} Seed data changed, re-initializing database...`);

    const newDb = new (sqlModuleRef.current as any).Database();
    try {
      logCheckpoint(3, 'seed_processing', `Processing new seed data (${seedData.length} chars)`);
      const unescapedSeedData = unescapeSqlString(seedData);
      logCheckpoint(4, 'db_seeding', 'Seeding database with new data...');
      newDb.exec(unescapedSeedData);

      // Verify tables
      const tablesResult = newDb.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
      const tableCount = tablesResult.length > 0 ? tablesResult[0].values.length : 0;
      logCheckpoint(5, 'ready', `Database ready with ${tableCount} table(s)`);

      setDb(newDb);
      setCurrentSeedData(seedData);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load seed data';
      console.error(`${LOG_PREFIX} Seed data change FAILED:`, errorMsg);
      setError(errorMsg);
    }
  }, [seedData, currentSeedData]);

  const executeQuery = useCallback((sql: string): QueryResult | null => {
    if (!db) {
      console.error(`${LOG_PREFIX} Cannot execute query - database not ready`);
      setError('Database not initialized. Please wait...');
      return null;
    }

    try {
      // === CHECKPOINT 5: Query Execution ===
      setCheckpointStatus(logCheckpoint(5, 'query_executing', `Executing: "${sql.trim()}"`));
      console.log(`${LOG_PREFIX} Query length: ${sql.length} chars`);
      console.log(`${LOG_PREFIX} Query contains escaped newline (\\\\n):`, sql.includes('\\n'));
      console.log(`${LOG_PREFIX} Query contains actual newline (\\n):`, sql.includes('\n'));
      console.log(`${LOG_PREFIX} Query char codes:`, Array.from(sql).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));

      const results = db.exec(sql);

      if (results.length === 0) {
        logCheckpoint(5, 'query_executing', 'Query executed (no results)');
        return { columns: [], values: [], rowCount: 0 };
      }

      const rowCount = results[0].values.length;
      const columnCount = results[0].columns.length;
      logCheckpoint(5, 'query_executing', `Query returned ${rowCount} row(s), ${columnCount} column(s)`);

      // Clear any previous query errors
      setError(null);

      return {
        columns: results[0].columns,
        values: results[0].values,
        rowCount,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Query execution failed';
      console.error(`${LOG_PREFIX} Query execution FAILED`);
      console.error(`${LOG_PREFIX} Query that failed:`, JSON.stringify(sql));
      console.error(`${LOG_PREFIX} Query that failed (char codes):`, Array.from(sql).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
      console.error(`${LOG_PREFIX} Error:`, errorMsg);
      setError(errorMsg);
      setCheckpointStatus({
        state: 'query_failed',
        checkpoint: 5,
        message: `FAILED: "${sql.trim()}" - ${errorMsg}`,
        timestamp: Date.now(),
      });
      return null;
    }
  }, [db]);

  const resetDatabase = useCallback(() => {
    if (!sqlModuleRef.current) {
      console.error(`${LOG_PREFIX} Cannot reset - SQL module not loaded`);
      return;
    }

    try {
      console.log(`${LOG_PREFIX} Resetting database...`);

      // Close old database
      if (db) {
        db.close();
        logCheckpoint(2, 'db_creation', 'Old database closed');
      }

      // === CHECKPOINT 2: Create new database ===
      const newDb = new (sqlModuleRef.current as any).Database();
      logCheckpoint(2, 'db_creation', 'New database object created');

      // === CHECKPOINT 3: Process seed data ===
      const unescapedSeedData = unescapeSqlString(currentSeedData);
      logCheckpoint(3, 'seed_processing', `Seed data processed (${unescapedSeedData.length} chars)`);

      // === CHECKPOINT 4: Seed database ===
      newDb.exec(unescapedSeedData);
      const tablesResult = newDb.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
      const tableCount = tablesResult.length > 0 ? tablesResult[0].values.length : 0;
      logCheckpoint(4, 'db_seeding', `Database seeded: ${tableCount} table(s)`);

      // === READY STATE ===
      logCheckpoint(5, 'ready', 'Database reset and ready');

      setDb(newDb);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset database';
      console.error(`${LOG_PREFIX} Reset FAILED:`, errorMsg);
      setError(errorMsg);
    }
  }, [db, currentSeedData]);

  return {
    db,
    loading,
    error,
    initStep,
    checkpointStatus,
    executeQuery,
    resetDatabase,
  };
}
