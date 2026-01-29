// Week 1, Day 1: Variables and Types
// 5 challenges covering variables, strings, numbers, and booleans

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-01',
    moduleId: 'week-01',
    slug: 'variables-strings',
    title: 'Variables and Strings',
    description: 'Learn to create variables and work with strings in Python.',
    instructions: `Create a variable called \`name\` with your name (as a string).
Create a variable called \`greeting\` that uses an f-string to say "Hello, {name}!"`,
    starterCode: `# Create your variables here
name = ""

greeting = ""`,
    solutionCode: `name = "Alice"
greeting = f"Hello, {name}!"`,
    tests: [
      {
        name: 'test_name_exists',
        code: 'assert isinstance(name, str), "name should be a string"',
      },
      {
        name: 'test_greeting_format',
        code: 'assert "Hello" in greeting and name in greeting, "greeting should contain Hello and the name"',
      },
    ],
    hints: [
      'Use the = sign to assign values to variables: name = "Alice"',
      'Use f-strings to include variables: f"Hello, {name}!"',
    ],
    difficulty: 'beginner',
    concepts: ['variables'],
    dayNumber: 1,
    points: 10,
  },
  {
    id: 'py-1-02',
    moduleId: 'week-01',
    slug: 'variables-numbers',
    title: 'Numbers and Arithmetic',
    description: 'Work with integers and floats in Python.',
    instructions: `Create a variable \`age\` with your age as an integer.
Create a variable \`height\` with your height in meters as a float (e.g., 1.75).
Create a variable \`year_born\` by subtracting \`age\` from 2024.`,
    starterCode: `age = 0
height = 0.0
year_born = 0`,
    solutionCode: `age = 25
height = 1.75
year_born = 2024 - age`,
    tests: [
      {
        name: 'test_age_type',
        code: 'assert isinstance(age, int), "age should be an integer"',
      },
      {
        name: 'test_height_type',
        code: 'assert isinstance(height, float), "height should be a float"',
      },
      {
        name: 'test_year_born_calculation',
        code: 'assert year_born == 2024 - age, "year_born should be 2024 minus age"',
      },
    ],
    hints: [
      'Integers are whole numbers: 42, -7, 0',
      'Floats have decimal points: 3.14, -0.5, 1.0',
      'You can do math with variables: 2024 - age',
    ],
    difficulty: 'beginner',
    concepts: ['variables'],
    dayNumber: 1,
    points: 10,
  },
  {
    id: 'py-1-03',
    moduleId: 'week-01',
    slug: 'variables-booleans',
    title: 'Boolean Values',
    description: 'Understand True and False in Python.',
    instructions: `Create a variable \`is_student\` set to \`True\`.
Create a variable \`is_graduated\` set to \`False\`.
Create a variable \`is_learning\` that checks if \`is_student\` is True.`,
    starterCode: `is_student = False
is_graduated = True
is_learning = False`,
    solutionCode: `is_student = True
is_graduated = False
is_learning = is_student`,
    tests: [
      {
        name: 'test_is_student_true',
        code: 'assert is_student == True, "is_student should be True"',
      },
      {
        name: 'test_is_graduated_false',
        code: 'assert is_graduated == False, "is_graduated should be False"',
      },
      {
        name: 'test_is_learning',
        code: 'assert is_learning == True, "is_learning should be True (equal to is_student)"',
      },
    ],
    hints: [
      'Booleans in Python are True and False (capitalized)',
      'You can assign one variable to another: is_learning = is_student',
    ],
    difficulty: 'beginner',
    concepts: ['variables'],
    dayNumber: 1,
    points: 10,
  },
  {
    id: 'py-1-04',
    moduleId: 'week-01',
    slug: 'string-concatenation',
    title: 'String Concatenation',
    description: 'Combine strings using the + operator.',
    instructions: `Create variables \`first_name\` and \`last_name\` with your name.
Create a variable \`full_name\` that combines them with a space in between.
Create a variable \`introduction\` that says "My name is {full_name}."`,
    starterCode: `first_name = ""
last_name = ""
full_name = ""
introduction = ""`,
    solutionCode: `first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
introduction = f"My name is {full_name}."`,
    tests: [
      {
        name: 'test_full_name',
        code: 'assert " " in full_name, "full_name should contain a space"',
      },
      {
        name: 'test_first_name_in_full',
        code: 'assert first_name in full_name, "full_name should contain first_name"',
      },
      {
        name: 'test_last_name_in_full',
        code: 'assert last_name in full_name, "full_name should contain last_name"',
      },
      {
        name: 'test_introduction',
        code: 'assert "My name is" in introduction and full_name in introduction',
      },
    ],
    hints: [
      'Use + to join strings: "Hello" + " " + "World"',
      'You can also use f-strings for cleaner code',
    ],
    difficulty: 'beginner',
    concepts: ['variables', 'string_manipulation'],
    dayNumber: 1,
    points: 10,
  },
  {
    id: 'py-1-05',
    slug: 'type-conversion',
    moduleId: 'week-01',
    title: 'Type Conversion',
    description: 'Convert between different data types.',
    instructions: `Given the string \`num_str = "42"\`, convert it to an integer called \`num_int\`.
Convert \`num_int\` to a float called \`num_float\`.
Convert \`num_float\` back to a string called \`num_again\`.`,
    starterCode: `num_str = "42"
num_int = 0
num_float = 0.0
num_again = ""`,
    solutionCode: `num_str = "42"
num_int = int(num_str)
num_float = float(num_int)
num_again = str(num_float)`,
    tests: [
      {
        name: 'test_num_int_type',
        code: 'assert isinstance(num_int, int), "num_int should be an integer"',
      },
      {
        name: 'test_num_int_value',
        code: 'assert num_int == 42, "num_int should equal 42"',
      },
      {
        name: 'test_num_float_type',
        code: 'assert isinstance(num_float, float), "num_float should be a float"',
      },
      {
        name: 'test_num_again_type',
        code: 'assert isinstance(num_again, str), "num_again should be a string"',
      },
    ],
    hints: [
      'Use int() to convert to integer: int("42")',
      'Use float() to convert to float: float(42)',
      'Use str() to convert to string: str(3.14)',
    ],
    difficulty: 'beginner',
    concepts: ['variables'],
    dayNumber: 1,
    points: 10,
  },
];
