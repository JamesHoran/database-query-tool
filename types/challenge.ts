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
  week: number;
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
  xp: number;
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

// Supabase Auth types
export interface SupabaseUser {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
}

export interface AuthState {
  session: SupabaseSession | null;
  user: SupabaseUser | null;
  loading: boolean;
}
