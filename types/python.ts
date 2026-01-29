// Python Learning App Types

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Concept =
  | 'variables'
  | 'functions'
  | 'loops'
  | 'classes'
  | 'data_structures'
  | 'string_manipulation'
  | 'conditionals'
  | 'lists'
  | 'dictionaries'
  | 'dicts'
  | 'tuples'
  | 'sets'
  | 'methods'
  | 'oop'
  | 'file_io'
  | 'exceptions'
  | 'comprehensions'
  | 'algorithms';

export interface PythonModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  weekNumber: number;
  estimatedHours: number;
}

export interface TestCase {
  name: string;
  code: string;
}

export interface PythonChallenge {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  tests: TestCase[];
  hints: string[];
  difficulty: Difficulty;
  concepts: Concept[];
  dayNumber: number;
  points: number;
}

export interface ProjectFile {
  name: string;
  starterContent: string;
  editable: boolean;
}

export interface ProjectChallenge extends PythonChallenge {
  files: ProjectFile[];
  requirements: string[];
  resumeTemplate: string;
  estimatedHours: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error: string | null;
  output: string;
}

export interface GradingResult {
  passed: boolean;
  tests: TestResult[];
  feedback: string;
  nextChallenge?: string;
  xpEarned: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: string;
  executionTime: number;
}

// Python Runtime Types
export interface PyodideAPI {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  setStdout: (batched: (str: string) => void) => void;
  setStderr: (batched: (str: string) => void) => void;
  toPy: (js: any) => any;
  toJs: (py: any) => any;
  PythonError: Error;
}

export interface PythonRuntimeState {
  pyodide: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
  supported: boolean;
}

export interface PythonExecutionState {
  isRunning: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

// Progress Types
export interface PythonProgress {
  id: string;
  userId: string;
  challengeId: string;
  completedAt: Date;
  attempts: number;
  codeSubmission: string;
}

export interface LearningStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  totalXp: number;
}

export interface DailyActivity {
  id: string;
  userId: string;
  activityDate: Date;
  lessonsCompleted: number;
  xpEarned: number;
}
