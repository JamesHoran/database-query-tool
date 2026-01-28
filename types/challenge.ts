export interface QueryTest {
  description: string;
  mustContain?: string[];
  forbidden?: string[];
  expectedColumns: string[];
  expectedRowCount?: number;
  assertExactOrder?: boolean;
}

export interface Challenge {
  id: string;
  module: string;
  day: number;
  order: number;
  title: string;
  description: string;
  instructions: string;
  seedData: string;
  starterCode: string;
  solution: string;
  hints: string[];
  tests: QueryTest[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QueryResult {
  columns: string[];
  values: any[][];
  rowCount: number;
}

export interface GradeResult {
  passed: boolean;
  score: number;
  feedback: string;
  hints: string[];
  userResults?: QueryResult;
  expectedResults?: QueryResult;
}
