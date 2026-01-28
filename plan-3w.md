# Python Learning Mobile App - 3-Week Implementation Plan

## Executive Summary

Build a mobile-first Python learning application with a **condensed 3-week curriculum** focusing on high-yield concepts for rapid skill acquisition. Interactive coding challenges, progress tracking, and a mobile-optimized interface.

**Philosophy:** "Minimum Effective Dose" — focus on concepts that appear most frequently in technical interviews and production code.

**Scope Reduction:** Cut from 6-week plan by removing SQL integration, spaced repetition system, advanced OOP patterns, and gamification features.

## Technical Architecture

### Core Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 19 | Full-stack framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Auth | Supabase | User management |
| Database | Supabase PostgreSQL | Progress, user data |
| Python Runtime | Pyodide + Web Worker | Python in browser (non-blocking) |
| Code Editor | CodeMirror 6 | Python syntax, **best mobile support** |
| PWA | @ducanh2912/next-pwa | Offline capability, installable |
| Worker IPC | Comlink | Web Worker communication |
| Testing | Playwright | E2E tests |
| Deployment | PM2 | Process management |

### Key Technology Decisions

**CodeMirror 6 vs Monaco:**
> "If you want a code editor that **supports mobile**, you should use **CodeMirror 6**"
> — Replit Blog comparison

**Pyodide for Python Execution:**
- CPython compiled to WebAssembly
- Works on mobile browsers
- No backend server required
- ~6-10 MB initial load (one-time)

**PWA Benefits:**
- No app store approval needed
- Install to home screen
- Offline lesson access
- Cross-platform (single codebase)

### Dependencies Required

```json
{
  "pyodide": "^0.26.0",
  "@codemirror/lang-python": "^6.1.0",
  "@codemirror/theme-one-dark": "^6.1.2",
  "@uiw/react-codemirror": "^4.21.21",
  "comlink": "^4.4.1",
  "@ducanh2912/next-pwa": "^9.0.0",
  "zustand": "^5.0.0"
}
```

### Directory Structure

```
app/
├── python/                                  # Python learning section
│   ├── page.tsx                             # Python course overview
│   ├── layout.tsx                           # Python section layout
│   └── [week]/
│       └── page.tsx                         # Weekly module view
├── python-challenge/
│   └── [id]/
│       ├── page.tsx                         # Python challenge wrapper
│       └── python-player.tsx                # Interactive Python runner
│
components/
├── python/
│   ├── python-editor.tsx                    # CodeMirror Python editor
│   ├── python-console.tsx                   # Output display
│   ├── python-grader.tsx                    # Test result display
│   └── mobile-code-editor.tsx               # Mobile-optimized editor
│
lib/
├── python/
│   ├── runner.ts                            # Pyodide execution engine
│   ├── grader.ts                            # pytest-based grading
│   ├── webworker.ts                         # Pyodide worker wrapper
│   ├── errors.ts                            # Error types and parsing
│   └── challenges.ts                        # Challenge data loader
│
hooks/
├── use-python-runtime.ts                    # Pyodide lifecycle management
├── use-python-execution.ts                  # Code execution state
├── use-mobile-keyboard.ts                   # Mobile keyboard handling
└── use-python-progress.ts                   # Progress tracking
│
data/
└── python-challenges/                       # Python curriculum data
    ├── week-01-basics/
    ├── week-02-data-structures/
    └── week-03-project/
```

## Data Model Design

### Database Schema (Simplified)

```sql
-- Python modules (weekly structure)
CREATE TABLE python_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  estimated_hours DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Python challenges (daily lessons)
CREATE TABLE python_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES python_modules(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT NOT NULL,
  test_code JSONB NOT NULL,
  hints TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  concepts TEXT[],
  day_number INTEGER NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Python progress tracking
CREATE TABLE python_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES python_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  code_submission TEXT,
  UNIQUE(user_id, challenge_id)
);

-- Learning streaks (simplified)
CREATE TABLE learning_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0
);

-- Daily activity tracking
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE UNIQUE,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_python_progress_user ON python_progress(user_id);
CREATE INDEX idx_python_progress_completed ON python_progress(completed_at DESC);
CREATE INDEX idx_python_challenges_module ON python_challenges(module_id);
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);
```

### TypeScript Types

```typescript
// types/python.ts

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Concept =
  | 'variables'
  | 'functions'
  | 'loops'
  | 'classes'
  | 'data_structures'
  | 'string_manipulation';

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

export interface ProjectChallenge extends PythonChallenge {
  files: ProjectFile[];
  requirements: string[];
  resumeTemplate: string;
  estimatedHours: number;
}

export interface ProjectFile {
  name: string;
  starterContent: string;
  editable: boolean;
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
```

## Curriculum Structure (3-Week Roadmap)

### Week 1: Python Fundamentals (Days 1-7)

**Learning Objectives:**
- Variables, expressions, conditionals
- Dynamic typing and "truthy/falsy" values
- Basic I/O operations
- Loops and iteration
- Functions basics
- Lists and dictionaries introduction

**Daily Challenges:**
| Day | Topic | Challenges | Key Concepts |
|-----|-------|------------|--------------|
| 1 | Variables & Types | 5 | Dynamic typing, strings, numbers, booleans |
| 2 | Conditionals & Logic | 5 | if/elif/else, comparisons, logical operators |
| 3 | Loops & Iteration | 5 | for, while, range(), break/continue, enumerate |
| 4 | Functions Basics | 5 | def, parameters, return, default args |
| 5 | Lists | 5 | List methods, slicing, comprehensions |
| 6 | Dictionaries | 5 | Dict methods, .get(), .items() |
| 7 | Review Challenge | 5 | Cumulative practice problems |

**Total Week 1:** 35 challenges

**Key Interview Questions:**
- What is the difference between `==` and `is`?
- Which values evaluate to `False` in Python?
- What is duck typing?

### Week 2: Data Structures & OOP Essentials (Days 8-14)

**Learning Objectives:**
- **Lists advanced**: methods, algorithms
- **Dictionaries advanced**: nesting, counting/grouping
- **Tuples & Sets**: immutability, uniqueness
- **Classes & Objects**: basics, __init__, self
- **Methods**: instance methods, __str__, properties

**Daily Challenges:**
| Day | Topic | Challenges | Key Concepts |
|-----|-------|------------|--------------|
| 8 | Lists Deep Dive | 5 | Algorithms, searching, sorting |
| 9 | Dictionaries Deep Dive | 5 | Nesting, counting, grouping |
| 10 | Tuples & Sets | 5 | Immutability, set operations |
| 11 | Classes Basics | 5 | class definition, __init__, self |
| 12 | Methods | 5 | Instance methods, __str__, @property |
| 13 | OOP Practice | 5 | Class design, basic interactions |
| 14 | Review Challenge | 5 | Cumulative problems |

**Total Week 2:** 35 challenges

**Key Interview Questions:**
- What is the difference between a list and a tuple?
- What are *args and **kwargs?
- What is the difference between __str__ and __repr__?

### Week 3: Portfolio Project (Days 15-21)

**Learning Objectives:**
- Apply all learned concepts
- Build a complete, resume-worthy project
- Multi-file project structure
- Real-world problem solving

**Main Project: Arithmetic Formatter**

```
Description: Format arithmetic problems vertically
Skills: String manipulation, loops, conditionals, exception handling
Resume: "Engineered a CLI-based text parser for mathematical notation,
        implementing strict input validation and dynamic formatting protocols."

Requirements:
- Format up to 5 problems
- Handle addition and subtraction
- Display proper spacing and alignment
- Validate input (only digits and +, -)
- Display optional answers

Progressive Challenges (15 total):
1. Basic formatting (2 problems)
2. Add spacing rules
3. Handle 4 problems
4. Handle 5 problems
5. Add subtraction support
6. Add answer display option
7. Input validation basics
8. Error handling for operators
9. Error handling for operands
10. Edge case: single digit
11. Edge case: multi-digit
12. Edge case: no answers
13. Edge case: with answers
14. Full integration
15. Final polish and testing
```

**Total Week 3:** 15 project challenges

---

**Total Challenges:** 85 (35 + 35 + 15)
**Estimated Time:** 3 weeks for students
**Total XP:** 850 points

## Implementation Phases

### Phase 0: PWA Setup

**Tasks:**
- [ ] Configure next-pwa for offline support
- [ ] Create manifest.json with icons
- [ ] Set up service worker for caching
- [ ] Add install prompt UI
- [ ] Configure IndexedDB for offline progress

**PWA Configuration:**

```javascript
// next.config.js
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'pyodide-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30
        }
      }
    }
  ]
});

module.exports = withPWA({});
```

```json
// public/manifest.json
{
  "name": "Python Mastery - Learn Python in 3 Weeks",
  "short_name": "Python Mastery",
  "description": "Mobile-first Python learning with interactive challenges",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Phase 1: Core Python Runtime

**Tasks:**
- [ ] Install and configure Pyodide
- [ ] Set up Web Worker with Comlink
- [ ] Create `usePythonRuntime` hook
- [ ] Implement CodeMirror 6 editor with Python syntax
- [ ] Create console output component
- [ ] Add mobile keyboard handling

**Technical Specification:**

```typescript
// hooks/use-python-runtime.ts
export function usePythonRuntime() {
  const [state, setState] = useState({
    pyodide: null,
    isLoading: true,
    error: null,
    supported: checkWebAssemblySupport()
  });

  useEffect(() => {
    if (!state.supported) {
      setState(prev => ({ ...prev, isLoading: false, error: 'WebAssembly not supported' }));
      return;
    }
    initializePyodide();
  }, []);

  return state;
}

// lib/python/webworker.ts
import { expose } from 'comlink';
import { loadPyodide } from 'pyodide';

const API = {
  async initialize() {
    this.pyodide = await loadPyodide();
  },

  async execute(code: string) {
    try {
      this.pyodide.runPython(code);
      const output = this.pyodide.runPython('print(_)');
      return { success: true, output };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

expose(API);
```

### Phase 2: Grading System

**Tasks:**
- [ ] Implement pytest-style test runner
- [ ] Create test result display
- [ ] Add progress tracking with Supabase
- [ ] Build hint system
- [ ] Implement XP and streak tracking

**Grading Architecture:**

```typescript
// lib/python/grader.ts
export async function gradePythonSubmission(
  code: string,
  tests: TestCase[],
  pyodide: any
): Promise<GradingResult> {
  const results: TestResult[] = [];

  for (const test of tests) {
    try {
      pyodide.runPython(code);
      pyodide.runPython(test.code);
      results.push({ name: test.name, passed: true, error: null, output: '' });
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        error: error.message,
        output: error.traceback
      });
    }
  }

  const passed = results.every(r => r.passed);
  return {
    passed,
    tests: results,
    feedback: generateFeedback(results),
    xpEarned: passed ? 10 : 0
  };
}
```

**Challenge Data Format:**

```typescript
// data/python-challenges/week-01/01.ts
export const challenge: PythonChallenge = {
  id: "py-1-01",
  moduleId: "week-01",
  slug: "variables-basics",
  title: "Variables and Strings",
  difficulty: "beginner",
  concepts: ["variables"],

  description: "Learn to create variables and work with strings",

  instructions: `Create a variable called name with your name
Create a variable called greeting that says "Hello, {name}!"`,

  starterCode: `# Create your variables here
name = ""

greeting = ""`,

  solutionCode: `name = "Alice"
greeting = f"Hello, {name}!"`,

  tests: [
    {
      name: "test_name_exists",
      code: `assert isinstance(name, str)`
    },
    {
      name: "test_greeting_format",
      code: `assert "Hello" in greeting and name in greeting`
    }
  ],

  hints: [
    "Use the = sign to assign values to variables",
    "Use f-strings to include variables: f'Hello, {name}!'"
  ],

  dayNumber: 1,
  points: 10
};
```

### Phase 3: Challenge Content

**Tasks:**
- [ ] Create all 85 challenges
- [ ] Build Arithmetic Formatter project (15 progressive challenges)
- [ ] Create challenge navigation system

**Content Organization:**

```
data/python-challenges/
├── week-01-basics/
│   ├── day-01-variables.ts
│   ├── day-02-conditionals.ts
│   ├── day-03-loops.ts
│   ├── day-04-functions.ts
│   ├── day-05-lists.ts
│   ├── day-06-dictionaries.ts
│   └── day-07-review.ts
├── week-02-data-structures-oop/
│   ├── day-01-lists-advanced.ts
│   ├── day-02-dicts-advanced.ts
│   ├── day-03-tuples-sets.ts
│   ├── day-04-classes.ts
│   ├── day-05-methods.ts
│   ├── day-06-oop-practice.ts
│   └── day-07-review.ts
└── week-03-project/
    └── arithmetic-formatter.ts
```

**Challenge Count:**
| Module | Daily Challenges | Project | Total Points |
|--------|------------------|---------|--------------|
| Week 1: Fundamentals | 35 | 0 | 350 |
| Week 2: Data Structures & OOP | 35 | 0 | 350 |
| Week 3: Project | 0 | 1 (Arithmetic) | 150 |
| **Total** | **70** | **1** | **850** |

### Phase 4: Mobile Optimization

**Tasks:**
- [ ] Implement responsive code editor
- [ ] Add swipe gestures for navigation
- [ ] Optimize touch targets (48×48px minimum)
- [ ] Add floating Run button
- [ ] Offline support with service worker

**Mobile UX Guidelines:**

```typescript
// components/mobile-code-editor.tsx
export function MobileCodeEditor({ value, onChange }: Props) {
  return (
    <div className="mobile-editor-container">
      {/* Quick-access toolbar for Python symbols */}
      <EditorToolbar className="flex gap-2 p-2 bg-gray-100">
        <TabButton onClick={() => insertChar('@')}>@</TabButton>
        <TabButton onClick={() => insertChar('#')}>#</TabButton>
        <TabButton onClick={() => insertChar('_')}>_</TabButton>
      </EditorToolbar>

      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[python()]}
        fontSize={14}
        minHeight={200}
      />

      {/* Floating Run button in thumb zone */}
      <FloatingRunButton className="fixed bottom-20 right-4 w-14 h-14">
        <PlayIcon size={28} />
      </FloatingRunButton>
    </div>
  );
}
```

**Mobile Best Practices:**
- 48×48px minimum tap targets
- 16px minimum font size (prevents zoom on input)
- Swipe gestures for next/prev challenge
- Floating Run button in thumb zone (bottom right)
- Offline lesson caching

## Best Practices

### Code Organization

```
components/    # Presentational UI only
lib/           # Business logic and utilities
data/          # Static content and configurations
hooks/         # State management and side effects
```

### Security

- Pyodide runs in WebAssembly (sandboxed)
- Execution timeout (5s default)
- Code size limit (10,000 characters)
- Input validation on all endpoints

### Testing Strategy

```typescript
// Unit test example
describe('PythonRunner', () => {
  it('should execute simple Python code', async () => {
    const result = await execute('print("Hello")');
    expect(result.stdout).toContain('Hello');
  });
});

// E2E test example
test('complete Python challenge', async ({ page }) => {
  await page.goto('/python-challenge/py-1-1');
  await page.locator('[data-testid="code-editor"]').fill('name = "Alice"');
  await page.getByRole('button', { name: 'Run' }).click();
  await expect(page.getByText('All tests passed!')).toBeVisible();
});
```

## Implementation Timeline

| Week | Phase | Deliverable | Key Features |
|------|-------|-------------|--------------|
| 1 | PWA + Runtime | Offline foundation + Pyodide | Service worker, Python execution |
| 2 | Grading + Content | Test runner + Week 1 challenges | pytest-style tests, 35 challenges |
| 3 | Content + Mobile | Week 2-3 challenges + Mobile | 50 more challenges, responsive UI |

**Total Development Time:** 3 weeks
**Total Challenges:** 85 (70 daily + 1 project)
**Total XP:** 850 points
**Mobile-First:** Yes (48×48px tap targets)
**Offline Capable:** Yes

---

**Document Version:** 1.0
**Created:** 2026-01-28
**Status:** Ready for Implementation

**Changelog:**
- v1.0: Initial 3-week streamlined plan, reduced from 6-week version

**Removed from 6-week plan:**
- SQL Integration track
- Spaced repetition/SM-2 algorithm
- Flashcards system
- Advanced OOP patterns (multiple inheritance, ABC)
- Regex, file I/O, random module
- Multiple portfolio projects (kept only Arithmetic Formatter)
- Achievements/badges system
- Interview prep tracking
- Complex gamification
