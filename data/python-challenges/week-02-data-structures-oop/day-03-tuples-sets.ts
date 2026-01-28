// Week 2, Day 3: Tuples & Sets
// 5 challenges covering immutability and set operations

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-11',
    moduleId: 'week-02',
    slug: 'tuple-basics',
    title: 'Tuple Basics',
    description: 'Work with immutable tuples.',
    instructions: `Given a tuple \`coordinates\`:
1. Unpack into x, y, z variables
2. Create a new tuple with y as first element
3. Access the second element`,
    starterCode: `coordinates = (3, 5, 7)

x = y = z = 0        # Unpack the tuple
new_tuple = ()       # New tuple with y first
second_element = 0   # Get second element`,
    solutionCode: `coordinates = (3, 5, 7)

x, y, z = coordinates
new_tuple = (y, x, z)
second_element = coordinates[1]`,
    tests: [
      {
        name: 'test_tuple_operations',
        code: `coordinates = (3, 5, 7)
x, y, z = coordinates
new_tuple = (y, x, z)
second_element = coordinates[1]
assert x == 3 and y == 5 and z == 7
assert new_tuple == (5, 3, 7)
assert second_element == 5`,
      },
    ],
    hints: [
      'Unpack: a, b, c = tuple',
      'Access by index: tuple[0], tuple[1]',
      'Tuples are immutable - you cannot modify them',
      'Create new tuples by combining values',
    ],
    difficulty: 'beginner',
    concepts: ['tuples', 'data_structures'],
    dayNumber: 10,
    points: 10,
  },
  {
    id: 'py-2-12',
    moduleId: 'week-02',
    slug: 'set-basics',
    title: 'Set Basics',
    description: 'Work with sets for unique values.',
    instructions: `Given list \`numbers\` with duplicates:
1. Create a set of unique numbers
2. Check if 5 is in the set
3. Add 10 to the set
4. Remove 3 from the set`,
    starterCode: `numbers = [1, 2, 2, 3, 4, 4, 5]

unique_set = set()    # Create set of unique numbers
has_five = False     # Check if 5 is in set
# Add 10 to set
# Remove 3 from set`,
    solutionCode: `numbers = [1, 2, 2, 3, 4, 4, 5]

unique_set = set(numbers)
has_five = 5 in unique_set
unique_set.add(10)
unique_set.remove(3)`,
    tests: [
      {
        name: 'test_set_operations',
        code: `numbers = [1, 2, 2, 3, 4, 4, 5]
unique_set = set(numbers)
has_five = 5 in unique_set
unique_set.add(10)
unique_set.remove(3)
assert unique_set == {1, 2, 4, 5, 10}
assert has_five == True
assert 3 not in unique_set`,
      },
    ],
    hints: [
      'set(list) - creates set from list (removes duplicates)',
      'item in set - check membership',
      '.add(item) - add item to set',
      '.remove(item) - remove item (raises error if not found)',
      '.discard(item) - remove item (no error if not found)',
    ],
    difficulty: 'beginner',
    concepts: ['sets', 'data_structures'],
    dayNumber: 10,
    points: 10,
  },
  {
    id: 'py-2-13',
    moduleId: 'week-02',
    slug: 'set-operations',
    title: 'Set Operations',
    description: 'Use union, intersection, and difference.',
    instructions: `Given sets A and B:
1. Find elements in A or B (union)
2. Find elements in both A and B (intersection)
3. Find elements in A but not B (difference)`,
    starterCode: `A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

union_set = set()       # A or B
intersection_set = set() # A and B
difference_set = set()  # A but not B`,
    solutionCode: `A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

union_set = A | B
intersection_set = A & B
difference_set = A - B`,
    tests: [
      {
        name: 'test_set_operations',
        code: `A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}
union_set = A | B
intersection_set = A & B
difference_set = A - B
assert union_set == {1, 2, 3, 4, 5, 6, 7, 8}
assert intersection_set == {4, 5}
assert difference_set == {1, 2, 3}`,
      },
    ],
    hints: [
      'A | B or A.union(B) - union',
      'A & B or A.intersection(B) - intersection',
      'A - B or A.difference(B) - difference',
      'A ^ B or A.symmetric_difference(B) - elements in either but not both',
    ],
    difficulty: 'intermediate',
    concepts: ['sets', 'data_structures'],
    dayNumber: 10,
    points: 10,
  },
  {
    id: 'py-2-14',
    moduleId: 'week-02',
    slug: 'find-duplicates',
    title: 'Find Duplicates Using Sets',
    description: 'Find items that appear more than once.',
    instructions: `Write a function \`find_duplicates(items)\` that:
- Returns a set of items that appear more than once`,
    starterCode: `def find_duplicates(items):
    # Return set of items that appear multiple times
    return set()`,
    solutionCode: `def find_duplicates(items):
    seen = set()
    duplicates = set()
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    return duplicates`,
    tests: [
      {
        name: 'test_find_duplicates',
        code: `def find_duplicates(items):
    seen = set()
    duplicates = set()
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    return duplicates
assert find_duplicates([1, 2, 2, 3, 1, 4]) == {1, 2}`,
      },
    ],
    hints: [
      'Use one set to track seen items',
      'Use another set for duplicates',
      'If item is already in seen, add to duplicates',
    ],
    difficulty: 'intermediate',
    concepts: ['sets'],
    dayNumber: 10,
    points: 10,
  },
  {
    id: 'py-2-15',
    moduleId: 'week-02',
    slug: 'set-comprehensions',
    title: 'Set Comprehensions',
    description: 'Create sets with comprehensions.',
    instructions: `Use set comprehensions to:
1. Create set of squares from 1-10
2. Create set of unique vowels in a string
3. Create set of words longer than 3 chars`,
    starterCode: `# Squares from 1-10
squares = set()

# Unique vowels in text
text = "hello world"
vowels = set()

# Words longer than 3 chars
words = ["cat", "dog", "elephant", "ant"]
long_words = set()`,
    solutionCode: `# Squares from 1-10
squares = {x**2 for x in range(1, 11)}

# Unique vowels in text
text = "hello world"
vowels = {char for char in text if char in "aeiou"}

# Words longer than 3 chars
words = ["cat", "dog", "elephant", "ant"]
long_words = {word for word in words if len(word) > 3}`,
    tests: [
      {
        name: 'test_set_comprehensions',
        code: `squares = {x**2 for x in range(1, 11)}
text = "hello world"
vowels = {char for char in text if char in "aeiou"}
words = ["cat", "dog", "elephant", "ant"]
long_words = {word for word in words if len(word) > 3}
assert squares == {1, 4, 9, 16, 25, 36, 49, 64, 81, 100}
assert vowels == {"e", "o"}
assert long_words == {"elephant"}`,
      },
    ],
    hints: [
      '{expression for item in sequence}',
      '{expression for item in sequence if condition}',
      'Similar to list comprehensions but with {}',
      'Automatically removes duplicates',
    ],
    difficulty: 'intermediate',
    concepts: ['sets', 'comprehensions'],
    dayNumber: 10,
    points: 10,
  },
];
