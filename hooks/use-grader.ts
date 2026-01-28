'use client';

import { useState, useCallback } from 'react';
import { gradeQuery } from '@/lib/grader';
import type { GradeResult, QueryResult, QueryTest } from '@/types';

interface UseGraderResult {
  grade: (
    userQuery: string,
    userResults: QueryResult | null,
    tests: QueryTest[],
    solution: string,
    seedData: string
  ) => Promise<GradeResult>;
  loading: boolean;
}

export function useGrader(): UseGraderResult {
  const [loading, setLoading] = useState(false);

  const grade = useCallback(
    async (
      userQuery: string,
      userResults: QueryResult | null,
      tests: QueryTest[],
      solution: string,
      seedData: string
    ): Promise<GradeResult> => {
      // Execute solution to get expected results
      let solutionResults: QueryResult | null = null;

      if (solution && seedData) {
        try {
          // Dynamic import to avoid server-side bundling
          const initSqlJs = (await import('sql.js')).default;
          const SQL = await initSqlJs({
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
          });

          const db = new SQL.Database();
          db.exec(seedData);
          const results = db.exec(solution);

          if (results.length > 0) {
            solutionResults = {
              columns: results[0].columns,
              values: results[0].values,
              rowCount: results[0].values.length,
            };
          }

          db.close();
        } catch (err) {
          console.error('Error executing solution:', err);
        }
      }

      return gradeQuery(userQuery, userResults, tests, solutionResults || undefined);
    },
    []
  );

  return {
    grade,
    loading,
  };
}
