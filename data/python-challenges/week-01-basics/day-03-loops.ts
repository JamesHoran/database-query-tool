// Week 1, Day 3: Loops and Iteration
// 5 challenges covering for, while, range(), break, continue, and enumerate

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-11',
    moduleId: 'week-01',
    slug: 'for-loops',
    title: 'For Loops',
    description: 'Iterate over sequences with for loops.',
    instructions: `Use a for loop to iterate over \`numbers\` and add each number to \`total\`.`,
    starterCode: `numbers = [1, 2, 3, 4, 5]
total = 0

# Write your for loop here`,
    solutionCode: `numbers = [1, 2, 3, 4, 5]
total = 0

for num in numbers:
    total += num`,
    tests: [
      {
        name: 'test_total_sum',
        code: `numbers = [1, 2, 3, 4, 5]
total = 0
for num in numbers:
    total += num
assert total == 15, f"Expected 15, got {total}"`,
      },
      {
        name: 'test_different_list',
        code: `numbers = [10, 20, 30]
total = 0
for num in numbers:
    total += num
assert total == 60, f"Expected 60, got {total}"`,
      },
    ],
    hints: [
      'for loop syntax: for item in sequence:',
      '    # do something with item',
      'Use += to add to a variable: total += num',
    ],
    difficulty: 'beginner',
    concepts: ['loops'],
    dayNumber: 3,
    points: 10,
  },
  {
    id: 'py-1-12',
    moduleId: 'week-01',
    slug: 'range-function',
    title: 'The range() Function',
    description: 'Generate sequences of numbers with range().',
    instructions: `Use a for loop with range() to:
- Count from 0 to 4 (inclusive)
- Add each number to \`sum_range\`
Result should be 0 + 1 + 2 + 3 + 4 = 10`,
    starterCode: `sum_range = 0

# Use for loop with range() here`,
    solutionCode: `sum_range = 0

for i in range(5):
    sum_range += i`,
    tests: [
      {
        name: 'test_range_sum',
        code: `sum_range = 0
for i in range(5):
    sum_range += i
assert sum_range == 10, f"Expected 10, got {sum_range}"`,
      },
      {
        name: 'test_range_values',
        code: `values = []
for i in range(5):
    values.append(i)
assert values == [0, 1, 2, 3, 4]`,
      },
    ],
    hints: [
      'range(5) generates: 0, 1, 2, 3, 4',
      'range(n) generates numbers from 0 to n-1',
      'range(start, stop) generates from start to stop-1',
      'range(start, stop, step) with a step value',
    ],
    difficulty: 'beginner',
    concepts: ['loops'],
    dayNumber: 3,
    points: 10,
  },
  {
    id: 'py-1-13',
    moduleId: 'week-01',
    slug: 'while-loops',
    title: 'While Loops',
    description: 'Repeat code while a condition is True.',
    instructions: `Use a while loop to count down from \`count\` to 0.
Append each number to \`countdown\` list.
Stop when count reaches 0 (don\'t include 0).`,
    starterCode: `count = 5
countdown = []

# Write your while loop here`,
    solutionCode: `count = 5
countdown = []

while count > 0:
    countdown.append(count)
    count -= 1`,
    tests: [
      {
        name: 'test_countdown_values',
        code: `count = 5
countdown = []
while count > 0:
    countdown.append(count)
    count -= 1
assert countdown == [5, 4, 3, 2, 1]`,
      },
      {
        name: 'test_countdown_with_different_start',
        code: `count = 3
countdown = []
while count > 0:
    countdown.append(count)
    count -= 1
assert countdown == [3, 2, 1]`,
      },
    ],
    hints: [
      'while loop: while condition:',
      '    # code runs while condition is True',
      'Make sure to modify the variable in the loop, or it will run forever!',
      'Use -= to subtract: count -= 1',
    ],
    difficulty: 'beginner',
    concepts: ['loops'],
    dayNumber: 3,
    points: 10,
  },
  {
    id: 'py-1-14',
    moduleId: 'week-01',
    slug: 'break-and-continue',
    title: 'Break and Continue',
    description: 'Control loop flow with break and continue.',
    instructions: `Iterate through \`numbers\`:
- Use \`continue\` to skip negative numbers
- Use \`break\` when you find a number greater than 100
- Add valid numbers to \`result\``,
    starterCode: `numbers = [5, -2, 10, -5, 50, 150, 20]
result = []

# Use for loop with break and continue`,
    solutionCode: `numbers = [5, -2, 10, -5, 50, 150, 20]
result = []

for num in numbers:
    if num < 0:
        continue
    if num > 100:
        break
    result.append(num)`,
    tests: [
      {
        name: 'test_break_continue_result',
        code: `numbers = [5, -2, 10, -5, 50, 150, 20]
result = []
for num in numbers:
    if num < 0:
        continue
    if num > 100:
        break
    result.append(num)
assert result == [5, 10, 50]`,
      },
    ],
    hints: [
      'continue skips to the next iteration',
      'break exits the loop entirely',
      'Order matters - check conditions in the right order',
    ],
    difficulty: 'beginner',
    concepts: ['loops'],
    dayNumber: 3,
    points: 10,
  },
  {
    id: 'py-1-15',
    moduleId: 'week-01',
    slug: 'enumerate',
    title: 'Loop with Index using enumerate()',
    description: 'Get both index and value when looping.',
    instructions: `Use \`enumerate()\` to loop through \`fruits\` with both index and value.
Add each fruit to \`result\` as "index: fruit".`,
    starterCode: `fruits = ["apple", "banana", "cherry"]
result = []

# Use enumerate in your for loop`,
    solutionCode: `fruits = ["apple", "banana", "cherry"]
result = []

for index, fruit in enumerate(fruits):
    result.append(f"{index}: {fruit}")`,
    tests: [
      {
        name: 'test_enumerate_result',
        code: `fruits = ["apple", "banana", "cherry"]
result = []
for index, fruit in enumerate(fruits):
    result.append(f"{index}: {fruit}")
assert result == ["0: apple", "1: banana", "2: cherry"]`,
      },
    ],
    hints: [
      'enumerate(sequence) gives you (index, value) pairs',
      'for i, item in enumerate(items):',
      '    # i is the index, item is the value',
    ],
    difficulty: 'beginner',
    concepts: ['loops'],
    dayNumber: 3,
    points: 10,
  },
];
