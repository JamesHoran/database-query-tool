// Week 1, Day 7: Review Challenge
// 5 cumulative practice problems for Week 1

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-31',
    moduleId: 'week-01',
    slug: 'review-fizzbuzz',
    title: 'Review: FizzBuzz',
    description: 'Classic FizzBuzz problem combining loops, conditionals, and modulo.',
    instructions: `Write code that prints numbers 1-20:
- Print "Fizz" for multiples of 3
- Print "Buzz" for multiples of 5
- Print "FizzBuzz" for multiples of both 3 and 5
- Otherwise, print the number

Build a list called \`result\` with the output.`,
    starterCode: `result = []

for i in range(1, 21):
    # Your code here
    pass`,
    solutionCode: `result = []

for i in range(1, 21):
    if i % 3 == 0 and i % 5 == 0:
        result.append("FizzBuzz")
    elif i % 3 == 0:
        result.append("Fizz")
    elif i % 5 == 0:
        result.append("Buzz")
    else:
        result.append(str(i))`,
    tests: [
      {
        name: 'test_fizzbuzz_output',
        code: `result = []
for i in range(1, 21):
    if i % 3 == 0 and i % 5 == 0:
        result.append("FizzBuzz")
    elif i % 3 == 0:
        result.append("Fizz")
    elif i % 5 == 0:
        result.append("Buzz")
    else:
        result.append(str(i))
expected = ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz"]
assert result == expected`,
      },
    ],
    hints: [
      'Use % (modulo) to check divisibility: i % 3 == 0',
      'Check "FizzBuzz" condition first (both 3 and 5)',
      'Use elif for the other conditions',
    ],
    difficulty: 'intermediate',
    concepts: ['loops', 'conditionals'],
    dayNumber: 7,
    points: 10,
  },
  {
    id: 'py-1-32',
    moduleId: 'week-01',
    slug: 'review-factorial',
    title: 'Review: Factorial Function',
    description: 'Write a function to calculate factorial.',
    instructions: `Write a function \`factorial(n)\` that:
- Takes an integer n >= 0
- Returns n! (factorial of n)
- 0! = 1, 5! = 5 × 4 × 3 × 2 × 1 = 120`,
    starterCode: `def factorial(n):
    # Your code here
    pass

# Test
result = factorial(5)  # Should be 120`,
    solutionCode: `def factorial(n):
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

result = factorial(5)`,
    tests: [
      {
        name: 'test_factorial_zero',
        code: `def factorial(n):
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
assert factorial(0) == 1`,
      },
      {
        name: 'test_factorial_five',
        code: `def factorial(n):
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
assert factorial(5) == 120`,
      },
      {
        name: 'test_factorial_three',
        code: `def factorial(n):
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
assert factorial(3) == 6`,
      },
    ],
    hints: [
      'Handle n=0 as a special case (0! = 1)',
      'Use a loop from 1 to n',
      'Use *= to multiply and assign: result *= i',
    ],
    difficulty: 'intermediate',
    concepts: ['functions', 'loops'],
    dayNumber: 7,
    points: 10,
  },
  {
    id: 'py-1-33',
    moduleId: 'week-01',
    slug: 'review-palindrome',
    title: 'Review: Palindrome Checker',
    description: 'Check if a word is a palindrome.',
    instructions: `Write a function \`is_palindrome(word)\` that:
- Returns True if the word reads the same forwards and backwards
- Returns False otherwise
- Ignore case (racecar = RACECAR)`,
    starterCode: `def is_palindrome(word):
    # Your code here
    pass

# Tests
result1 = is_palindrome("racecar")  # True
result2 = is_palindrome("hello")    # False`,
    solutionCode: `def is_palindrome(word):
    word_lower = word.lower()
    return word_lower == word_lower[::-1]

result1 = is_palindrome("racecar")
result2 = is_palindrome("hello")`,
    tests: [
      {
        name: 'test_palindrome_true',
        code: `def is_palindrome(word):
    word_lower = word.lower()
    return word_lower == word_lower[::-1]
assert is_palindrome("racecar") == True
assert is_palindrome("madam") == True`,
      },
      {
        name: 'test_palindrome_false',
        code: `def is_palindrome(word):
    word_lower = word.lower()
    return word_lower == word_lower[::-1]
assert is_palindrome("hello") == False
assert is_palindrome("python") == False`,
      },
      {
        name: 'test_palindrome_case',
        code: `def is_palindrome(word):
    word_lower = word.lower()
    return word_lower == word_lower[::-1]
assert is_palindrome("RaceCar") == True`,
      },
    ],
    hints: [
      'Use .lower() to convert to lowercase',
      'Use [::-1] to reverse a string',
      'Compare the original and reversed strings',
    ],
    difficulty: 'intermediate',
    concepts: ['functions', 'string_manipulation'],
    dayNumber: 7,
    points: 10,
  },
  {
    id: 'py-1-34',
    moduleId: 'week-01',
    slug: 'review-list-stats',
    title: 'Review: List Statistics',
    description: 'Calculate statistics from a list of numbers.',
    instructions: `Write a function \`list_stats(numbers)\` that:
- Returns a dict with: sum, min, max, average
- Use built-in functions where possible`,
    starterCode: `def list_stats(numbers):
    # Return a dict with sum, min, max, average
    return {
        "sum": 0,
        "min": 0,
        "max": 0,
        "avg": 0.0
    }

# Test
result = list_stats([3, 7, 2, 9, 1])`,
    solutionCode: `def list_stats(numbers):
    return {
        "sum": sum(numbers),
        "min": min(numbers),
        "max": max(numbers),
        "avg": sum(numbers) / len(numbers)
    }

result = list_stats([3, 7, 2, 9, 1])`,
    tests: [
      {
        name: 'test_list_stats',
        code: `def list_stats(numbers):
    return {
        "sum": sum(numbers),
        "min": min(numbers),
        "max": max(numbers),
        "avg": sum(numbers) / len(numbers)
    }
result = list_stats([3, 7, 2, 9, 1])
assert result["sum"] == 22
assert result["min"] == 1
assert result["max"] == 9
assert result["avg"] == 22 / 5`,
      },
    ],
    hints: [
      'sum() - calculate sum',
      'min() - find minimum',
      'max() - find maximum',
      'len() - get length',
      'Average = sum / len',
    ],
    difficulty: 'intermediate',
    concepts: ['functions', 'lists', 'data_structures'],
    dayNumber: 7,
    points: 10,
  },
  {
    id: 'py-1-35',
    moduleId: 'week-01',
    slug: 'review-word-count',
    title: 'Review: Word Frequency Counter',
    description: 'Count how many times each word appears.',
    instructions: `Write a function \`word_count(text)\` that:
- Splits text into words (by space)
- Returns a dict with word counts
- Ignores case (Hello = hello)`,
    starterCode: `def word_count(text):
    # Return a dict with word counts
    return {}

# Test
result = word_count("hello world hello python world")`,
    solutionCode: `def word_count(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

result = word_count("hello world hello python world")`,
    tests: [
      {
        name: 'test_word_count',
        code: `def word_count(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
result = word_count("hello world hello python world")
assert result["hello"] == 2
assert result["world"] == 2
assert result["python"] == 1`,
      },
      {
        name: 'test_word_count_case',
        code: `def word_count(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
result = word_count("Hello HELLO hello")
assert result["hello"] == 3`,
      },
    ],
    hints: [
      '.lower() - convert to lowercase',
      '.split() - split text into words by spaces',
      '.get(key, 0) - get value or default 0',
      'counts[word] = counts.get(word, 0) + 1 - increment count',
    ],
    difficulty: 'intermediate',
    concepts: ['functions', 'dictionaries', 'string_manipulation'],
    dayNumber: 7,
    points: 10,
  },
];
