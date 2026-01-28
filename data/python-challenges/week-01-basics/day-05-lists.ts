// Week 1, Day 5: Lists
// 5 challenges covering list methods, slicing, and comprehensions

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-21',
    moduleId: 'week-01',
    slug: 'list-basics',
    title: 'List Basics',
    description: 'Create, access, and modify lists.',
    instructions: `Given \`fruits\` list:
1. Get the first fruit
2. Get the last fruit
3. Add "orange" to the end
4. Change the second fruit to "grape"`,
    starterCode: `fruits = ["apple", "banana", "cherry"]

first = ""    # Get first fruit
last = ""     # Get last fruit

# Add "orange" to the end

# Change second fruit to "grape"`,
    solutionCode: `fruits = ["apple", "banana", "cherry"]

first = fruits[0]
last = fruits[-1]
fruits.append("orange")
fruits[1] = "grape"`,
    tests: [
      {
        name: 'test_first_last',
        code: `fruits = ["apple", "banana", "cherry"]
first = fruits[0]
last = fruits[-1]
assert first == "apple"
assert last == "cherry"`,
      },
      {
        name: 'test_append',
        code: `fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
assert "orange" in fruits
assert len(fruits) == 4`,
      },
      {
        name: 'test_modify',
        code: `fruits = ["apple", "banana", "cherry"]
fruits[1] = "grape"
assert fruits[1] == "grape"`,
      },
    ],
    hints: [
      'Use [0] for first element, [-1] for last',
      'Use .append() to add to the end',
      'Use [index] = value to modify',
    ],
    difficulty: 'beginner',
    concepts: ['lists', 'data_structures'],
    dayNumber: 5,
    points: 10,
  },
  {
    id: 'py-1-22',
    moduleId: 'week-01',
    slug: 'list-slicing',
    title: 'List Slicing',
    description: 'Extract portions of lists using slices.',
    instructions: `From \`numbers\` list:
1. Get first 3 elements
2. Get elements from index 2 to 4
3. Get last 2 elements
4. Get every other element`,
    starterCode: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

first_three = []      # First 3 elements
middle = []           # Index 2 to 4
last_two = []         # Last 2 elements
every_other = []      # Every other element`,
    solutionCode: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

first_three = numbers[:3]
middle = numbers[2:5]
last_two = numbers[-2:]
every_other = numbers[::2]`,
    tests: [
      {
        name: 'test_slices',
        code: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
first_three = numbers[:3]
middle = numbers[2:5]
last_two = numbers[-2:]
every_other = numbers[::2]
assert first_three == [0, 1, 2]
assert middle == [2, 3, 4]
assert last_two == [8, 9]
assert every_other == [0, 2, 4, 6, 8]`,
      },
    ],
    hints: [
      'list[start:stop] - from start to stop-1',
      'list[:stop] - from beginning to stop-1',
      'list[start:] - from start to end',
      'list[start:stop:step] - with step',
      'Negative indices count from the end',
    ],
    difficulty: 'beginner',
    concepts: ['lists', 'data_structures'],
    dayNumber: 5,
    points: 10,
  },
  {
    id: 'py-1-23',
    moduleId: 'week-01',
    slug: 'list-methods',
    title: 'List Methods',
    description: 'Use built-in list methods.',
    instructions: `Using \`numbers\` list:
1. Append 10
2. Insert 0 at the beginning
3. Remove the value 5
4. Find the index of value 7
5. Count how many times 3 appears`,
    starterCode: `numbers = [1, 2, 3, 4, 5, 3, 6, 7, 8, 9]

# Append 10
# Insert 0 at beginning
# Remove 5
# Find index of 7
# Count occurrences of 3

value_at_start = numbers[0]
index_of_7 = -1
count_of_3 = 0`,
    solutionCode: `numbers = [1, 2, 3, 4, 5, 3, 6, 7, 8, 9]

numbers.append(10)
numbers.insert(0, 0)
numbers.remove(5)
index_of_7 = numbers.index(7)
count_of_3 = numbers.count(3)`,
    tests: [
      {
        name: 'test_list_methods',
        code: `numbers = [1, 2, 3, 4, 5, 3, 6, 7, 8, 9]
numbers.append(10)
numbers.insert(0, 0)
numbers.remove(5)
index_of_7 = numbers.index(7)
count_of_3 = numbers.count(3)
assert numbers[0] == 0
assert 5 not in numbers
assert index_of_7 == 7
assert count_of_3 == 2`,
      },
    ],
    hints: [
      '.append(x) - add to end',
      '.insert(i, x) - insert at index',
      '.remove(x) - remove first occurrence',
      '.index(x) - get index of value',
      '.count(x) - count occurrences',
    ],
    difficulty: 'beginner',
    concepts: ['lists', 'data_structures'],
    dayNumber: 5,
    points: 10,
  },
  {
    id: 'py-1-24',
    moduleId: 'week-01',
    slug: 'list-comprehensions',
    title: 'List Comprehensions',
    description: 'Create lists concisely with comprehensions.',
    instructions: `Use list comprehensions to:
1. Create squares of numbers 1-5
2. Filter even numbers from nums
3. Convert words in list to uppercase`,
    starterCode: `# Squares of 1-5
squares = []

# Even numbers from nums
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = []

# Uppercase words
words = ["hello", "world"]
upper_words = []`,
    solutionCode: `# Squares of 1-5
squares = [x**2 for x in range(1, 6)]

# Even numbers from nums
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [x for x in nums if x % 2 == 0]

# Uppercase words
words = ["hello", "world"]
upper_words = [word.upper() for word in words]`,
    tests: [
      {
        name: 'test_squares',
        code: `squares = [x**2 for x in range(1, 6)]
assert squares == [1, 4, 9, 16, 25]`,
      },
      {
        name: 'test_evens',
        code: `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [x for x in nums if x % 2 == 0]
assert evens == [2, 4, 6, 8, 10]`,
      },
      {
        name: 'test_upper',
        code: `words = ["hello", "world"]
upper_words = [word.upper() for word in words]
assert upper_words == ["HELLO", "WORLD"]`,
      },
    ],
    hints: [
      '[expression for item in sequence]',
      '[expression for item in sequence if condition]',
      'Use .upper() to convert to uppercase',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'comprehensions'],
    dayNumber: 5,
    points: 10,
  },
  {
    id: 'py-1-25',
    moduleId: 'week-01',
    slug: 'sorting-lists',
    title: 'Sorting Lists',
    description: 'Sort lists in place or create sorted copies.',
    instructions: `Given \`names\` list:
1. Create a sorted copy (alphabetical)
2. Sort the original list in reverse
3. Use a key to sort by name length`,
    starterCode: `names = ["Zoe", "Bob", "Alice", "Charlie", "David"]

sorted_copy = []      # Sorted copy, don't modify original
reverse_sorted = []   # Original sorted in reverse
by_length = []        # Sorted by name length`,
    solutionCode: `names = ["Zoe", "Bob", "Alice", "Charlie", "David"]

sorted_copy = sorted(names)
reverse_sorted = sorted(names, reverse=True)
by_length = sorted(names, key=len)`,
    tests: [
      {
        name: 'test_sorted',
        code: `names = ["Zoe", "Bob", "Alice", "Charlie", "David"]
sorted_copy = sorted(names)
reverse_sorted = sorted(names, reverse=True)
by_length = sorted(names, key=len)
assert sorted_copy == ["Alice", "Bob", "Charlie", "David", "Zoe"]
assert reverse_sorted == ["Zoe", "David", "Charlie", "Bob", "Alice"]
assert by_length == ["Bob", "Zoe", "Alice", "David", "Charlie"]`,
      },
    ],
    hints: [
      'sorted(list) - returns new sorted list',
      'sorted(list, reverse=True) - descending',
      'sorted(list, key=function) - sort by key',
      'list.sort() - sorts in place',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'data_structures'],
    dayNumber: 5,
    points: 10,
  },
];
