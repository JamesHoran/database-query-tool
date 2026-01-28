// Week 1, Day 4: Functions Basics
// 5 challenges covering def, parameters, return, default args

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-16',
    moduleId: 'week-01',
    slug: 'defining-functions',
    title: 'Defining Functions',
    description: 'Create reusable code blocks with def.',
    instructions: `Write a function called \`greet\` that takes a \`name\` parameter
and returns a greeting string "Hello, {name}!"`,
    starterCode: `# Define your function here
def greet(name):
    # Your code here
    pass

# Test
result = greet("Alice")`,
    solutionCode: `def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")`,
    tests: [
      {
        name: 'test_greet_alice',
        code: `def greet(name):
    return f"Hello, {name}!"
assert greet("Alice") == "Hello, Alice!"`,
      },
      {
        name: 'test_greet_bob',
        code: `def greet(name):
    return f"Hello, {name}!"
assert greet("Bob") == "Hello, Bob!"`,
      },
    ],
    hints: [
      'Use def to define a function: def function_name(parameters):',
      'Use return to send a value back',
      'Use f-strings for formatting: f"Hello, {name}!"',
    ],
    difficulty: 'beginner',
    concepts: ['functions'],
    dayNumber: 4,
    points: 10,
  },
  {
    id: 'py-1-17',
    moduleId: 'week-01',
    slug: 'multiple-parameters',
    title: 'Multiple Parameters',
    description: 'Functions can take multiple parameters.',
    instructions: `Write a function \`add\` that takes two numbers \`a\` and \`b\`
and returns their sum.`,
    starterCode: `def add(a, b):
    # Your code here
    pass`,
    solutionCode: `def add(a, b):
    return a + b`,
    tests: [
      {
        name: 'test_add_positive',
        code: `def add(a, b):
    return a + b
assert add(3, 5) == 8`,
      },
      {
        name: 'test_add_negative',
        code: `def add(a, b):
    return a + b
assert add(-2, 7) == 5`,
      },
      {
        name: 'test_add_zero',
        code: `def add(a, b):
    return a + b
assert add(0, 0) == 0`,
      },
    ],
    hints: [
      'Separate multiple parameters with commas: def func(a, b):',
      'You can use the + operator to add numbers',
    ],
    difficulty: 'beginner',
    concepts: ['functions'],
    dayNumber: 4,
    points: 10,
  },
  {
    id: 'py-1-18',
    moduleId: 'week-01',
    slug: 'return-values',
    title: 'Return Values',
    description: 'Functions can return values to be used later.',
    instructions: `Write a function \`calculate\` that takes three parameters:
- num1, num2, and operation ("add", "sub", "mul", "div")
- Return the result of the arithmetic operation`,
    starterCode: `def calculate(num1, num2, operation):
    # Your code here
    pass`,
    solutionCode: `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    elif operation == "sub":
        return num1 - num2
    elif operation == "mul":
        return num1 * num2
    elif operation == "div":
        return num1 / num2`,
    tests: [
      {
        name: 'test_add',
        code: `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    elif operation == "sub":
        return num1 - num2
    elif operation == "mul":
        return num1 * num2
    elif operation == "div":
        return num1 / num2
assert calculate(10, 5, "add") == 15`,
      },
      {
        name: 'test_sub',
        code: `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    elif operation == "sub":
        return num1 - num2
    elif operation == "mul":
        return num1 * num2
    elif operation == "div":
        return num1 / num2
assert calculate(10, 5, "sub") == 5`,
      },
      {
        name: 'test_mul',
        code: `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    elif operation == "sub":
        return num1 - num2
    elif operation == "mul":
        return num1 * num2
    elif operation == "div":
        return num1 / num2
assert calculate(10, 5, "mul") == 50`,
      },
      {
        name: 'test_div',
        code: `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    elif operation == "sub":
        return num1 - num2
    elif operation == "mul":
        return num1 * num2
    elif operation == "div":
        return num1 / num2
assert calculate(10, 5, "div") == 2`,
      },
    ],
    hints: [
      'Use if-elif-else to handle different operations',
      'Return the result of each calculation',
      'Use +, -, *, / for the operations',
    ],
    difficulty: 'beginner',
    concepts: ['functions', 'conditionals'],
    dayNumber: 4,
    points: 10,
  },
  {
    id: 'py-1-19',
    moduleId: 'week-01',
    slug: 'default-parameters',
    title: 'Default Parameters',
    description: 'Set default values for function parameters.',
    instructions: `Write a function \`power\` that:
- Takes \`base\` and \`exponent\` parameters
- Has a default exponent of 2
- Returns base raised to the exponent power (use ** operator)`,
    starterCode: `def power(base, exponent):
    # Your code here
    pass`,
    solutionCode: `def power(base, exponent=2):
    return base ** exponent`,
    tests: [
      {
        name: 'test_default_exponent',
        code: `def power(base, exponent=2):
    return base ** exponent
assert power(5) == 25`,
      },
      {
        name: 'test_custom_exponent',
        code: `def power(base, exponent=2):
    return base ** exponent
assert power(2, 3) == 8`,
      },
      {
        name: 'test_exponent_one',
        code: `def power(base, exponent=2):
    return base ** exponent
assert power(10, 1) == 10`,
      },
    ],
    hints: [
      'Set default values in the parameter list: def func(param=default):',
      'Use ** for exponentiation: 2 ** 3 = 8',
    ],
    difficulty: 'beginner',
    concepts: ['functions'],
    dayNumber: 4,
    points: 10,
  },
  {
    id: 'py-1-20',
    moduleId: 'week-01',
    slug: 'function-practice',
    title: 'Function Practice',
    description: 'Combine concepts to write a useful function.',
    instructions: `Write a function \`get_grade\` that:
- Takes a \`score\` parameter (0-100)
- Returns the letter grade:
  - 90+: "A"
  - 80-89: "B"
  - 70-79: "C"
  - 60-69: "D"
  - Below 60: "F"`,
    starterCode: `def get_grade(score):
    # Your code here
    pass`,
    solutionCode: `def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"`,
    tests: [
      {
        name: 'test_grade_A',
        code: `def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
assert get_grade(95) == "A"`,
      },
      {
        name: 'test_grade_B',
        code: `def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
assert get_grade(85) == "B"`,
      },
      {
        name: 'test_grade_F',
        code: `def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
assert get_grade(45) == "F"`,
      },
    ],
    hints: [
      'Use if-elif-else for multiple conditions',
      'Remember to return the grade letter',
    ],
    difficulty: 'beginner',
    concepts: ['functions', 'conditionals'],
    dayNumber: 4,
    points: 10,
  },
];
