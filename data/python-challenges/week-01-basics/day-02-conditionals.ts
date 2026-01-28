// Week 1, Day 2: Conditionals and Logic
// 5 challenges covering if/elif/else, comparisons, and logical operators

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-06',
    moduleId: 'week-01',
    slug: 'if-statements',
    title: 'If Statements',
    description: 'Learn to make decisions with if statements.',
    instructions: `Write an if statement that checks if \`age\` is 18 or older.
If so, set \`can_vote\` to \`True\`.
Otherwise, set \`can_vote\` to \`False\`.`,
    starterCode: `age = 20
can_vote = False

# Write your if statement here`,
    solutionCode: `age = 20
can_vote = False

if age >= 18:
    can_vote = True`,
    tests: [
      {
        name: 'test_can_vote_with_age_20',
        code: `age = 20
can_vote = False
if age >= 18:
    can_vote = True
assert can_vote == True, "With age=20, can_vote should be True"`,
      },
      {
        name: 'test_can_vote_with_age_15',
        code: `age = 15
can_vote = False
if age >= 18:
    can_vote = True
assert can_vote == False, "With age=15, can_vote should be False"`,
      },
    ],
    hints: [
      'Use if followed by a condition and a colon:',
      'if condition:',
      '    # indented code runs if condition is True',
      'Don\'t forget the indentation (4 spaces or a tab)!',
    ],
    difficulty: 'beginner',
    concepts: ['conditionals'],
    dayNumber: 2,
    points: 10,
  },
  {
    id: 'py-1-07',
    moduleId: 'week-01',
    slug: 'if-else-statements',
    title: 'If-Else Statements',
    description: 'Handle two outcomes with if-else.',
    instructions: `Use if-else to set \`message\` based on \`score\`:
- If score >= 60: message = "You passed!"
- Else: message = "You failed. Try again."`,
    starterCode: `score = 75
message = ""

# Write your if-else statement here`,
    solutionCode: `score = 75
message = ""

if score >= 60:
    message = "You passed!"
else:
    message = "You failed. Try again."`,
    tests: [
      {
        name: 'test_passing_score',
        code: `score = 75
message = ""
if score >= 60:
    message = "You passed!"
else:
    message = "You failed. Try again."
assert message == "You passed!"`,
      },
      {
        name: 'test_failing_score',
        code: `score = 45
message = ""
if score >= 60:
    message = "You passed!"
else:
    message = "You failed. Try again."
assert message == "You failed. Try again."`,
      },
    ],
    hints: [
      'if-else structure:',
      'if condition:',
      '    # code if True',
      'else:',
      '    # code if False',
    ],
    difficulty: 'beginner',
    concepts: ['conditionals'],
    dayNumber: 2,
    points: 10,
  },
  {
    id: 'py-1-08',
    moduleId: 'week-01',
    slug: 'if-elif-else',
    title: 'If-Elif-Else Chains',
    description: 'Handle multiple conditions with elif.',
    instructions: `Set \`grade\` based on \`score\`:
- 90+: "A"
- 80-89: "B"
- 70-79: "C"
- 60-69: "D"
- Below 60: "F"`,
    starterCode: `score = 85
grade = ""

# Write your if-elif-else chain here`,
    solutionCode: `score = 85
grade = ""

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"`,
    tests: [
      {
        name: 'test_grade_A',
        code: `score = 92
grade = ""
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
assert grade == "A"`,
      },
      {
        name: 'test_grade_B',
        code: `score = 85
grade = ""
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
assert grade == "B"`,
      },
      {
        name: 'test_grade_F',
        code: `score = 45
grade = ""
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
assert grade == "F"`,
      },
    ],
    hints: [
      'Use elif (else if) for additional conditions:',
      'if condition1:',
      '    # code',
      'elif condition2:',
      '    # code',
      'else:',
      '    # code',
    ],
    difficulty: 'beginner',
    concepts: ['conditionals'],
    dayNumber: 2,
    points: 10,
  },
  {
    id: 'py-1-09',
    moduleId: 'week-01',
    slug: 'comparison-operators',
    title: 'Comparison Operators',
    description: 'Use ==, !=, <, >, <=, >= for comparisons.',
    instructions: `Create variables that check:
- \`is_equal\`: 10 == 10
- \`is_not_equal\`: 5 != 3
- \`is_less\`: 3 < 5
- \`is_greater\`: 7 > 4
- \`is_less_or_equal\`: 5 <= 5
- \`is_greater_or_equal\`: 8 >= 8`,
    starterCode: `is_equal = False
is_not_equal = False
is_less = False
is_greater = False
is_less_or_equal = False
is_greater_or_equal = False

# Set the variables based on the comparisons`,
    solutionCode: `is_equal = 10 == 10
is_not_equal = 5 != 3
is_less = 3 < 5
is_greater = 7 > 4
is_less_or_equal = 5 <= 5
is_greater_or_equal = 8 >= 8`,
    tests: [
      {
        name: 'test_all_comparisons',
        code: `assert is_equal == True
assert is_not_equal == True
assert is_less == True
assert is_greater == True
assert is_less_or_equal == True
assert is_greater_or_equal == True`,
      },
    ],
    hints: [
      '== means "equal to"',
      '!= means "not equal to"',
      '< means "less than", > means "greater than"',
      '<= means "less than or equal", >= means "greater than or equal"',
    ],
    difficulty: 'beginner',
    concepts: ['conditionals'],
    dayNumber: 2,
    points: 10,
  },
  {
    id: 'py-1-10',
    moduleId: 'week-01',
    slug: 'logical-operators',
    title: 'Logical Operators (and, or, not)',
    description: 'Combine conditions with and, or, not.',
    instructions: `Set variables using logical operators:
- \`both_true\`: True and True
- \`either_true\`: True or False
- \`not_false\`: not False
- \`complex_and\`: (5 > 3) and (10 < 20)
- \`complex_or\`: (1 == 2) or (3 == 3)`,
    starterCode: `both_true = False
either_true = False
not_false = False
complex_and = False
complex_or = False

# Set variables using and, or, not`,
    solutionCode: `both_true = True and True
either_true = True or False
not_false = not False
complex_and = (5 > 3) and (10 < 20)
complex_or = (1 == 2) or (3 == 3)`,
    tests: [
      {
        name: 'test_logical_operators',
        code: `assert both_true == True
assert either_true == True
assert not_false == True
assert complex_and == True
assert complex_or == True`,
      },
    ],
    hints: [
      'and: Both conditions must be True',
      'or: At least one condition must be True',
      'not: Reverses the boolean value (not True = False)',
    ],
    difficulty: 'beginner',
    concepts: ['conditionals'],
    dayNumber: 2,
    points: 10,
  },
];
