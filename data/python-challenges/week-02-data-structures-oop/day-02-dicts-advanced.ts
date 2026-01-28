// Week 2, Day 2: Dictionaries Advanced
// 5 challenges covering nesting, counting, and grouping

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-06',
    moduleId: 'week-02',
    slug: 'group-by-category',
    title: 'Group By Category',
    description: 'Group items by category using dictionaries.',
    instructions: `Write a function \`group_by_category(items)\` that:
- Takes a list of dicts with "name" and "category" keys
- Returns a dict with category as key and list of names as values`,
    starterCode: `def group_by_category(items):
    # Group items by category
    return {}`,
    solutionCode: `def group_by_category(items):
    grouped = {}
    for item in items:
        category = item["category"]
        name = item["name"]
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(name)
    return grouped`,
    tests: [
      {
        name: 'test_group_by_category',
        code: `def group_by_category(items):
    grouped = {}
    for item in items:
        category = item["category"]
        name = item["name"]
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(name)
    return grouped
items = [
    {"name": "apple", "category": "fruit"},
    {"name": "carrot", "category": "vegetable"},
    {"name": "banana", "category": "fruit"}
]
result = group_by_category(items)
assert result["fruit"] == ["apple", "banana"]
assert result["vegetable"] == ["carrot"]`,
      },
    ],
    hints: [
      'Create an empty dict for grouped results',
      'For each item, get the category',
      'Create a new list if category doesn\'t exist',
      'Append the name to the appropriate list',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries'],
    dayNumber: 9,
    points: 10,
  },
  {
    id: 'py-2-07',
    moduleId: 'week-02',
    slug: 'frequency-counter',
    title: 'Frequency Counter',
    description: 'Count occurrences of each item.',
    instructions: `Write a function \`count_frequency(items)\` that:
- Takes a list of items (strings or numbers)
- Returns a dict with items as keys and counts as values`,
    starterCode: `def count_frequency(items):
    # Count how many times each item appears
    return {}`,
    solutionCode: `def count_frequency(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts`,
    tests: [
      {
        name: 'test_count_frequency',
        code: `def count_frequency(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts
assert count_frequency(["a", "b", "a", "c", "b", "a"]) == {"a": 3, "b": 2, "c": 1}`,
      },
      {
        name: 'test_count_frequency_numbers',
        code: `def count_frequency(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts
assert count_frequency([1, 2, 1, 3, 2, 1]) == {1: 3, 2: 2, 3: 1}`,
      },
    ],
    hints: [
      'Use .get(key, 0) to get current count or default to 0',
      'Increment the count by 1',
      'counts[item] = counts.get(item, 0) + 1',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries'],
    dayNumber: 9,
    points: 10,
  },
  {
    id: 'py-2-08',
    moduleId: 'week-02',
    slug: 'dict-merge',
    title: 'Merging Dictionaries',
    description: 'Combine multiple dictionaries with summing values.',
    instructions: `Write a function \`merge_dicts(dicts)\` that:
- Takes a list of dictionaries
- Merges them, summing values for matching keys
- Returns a single merged dictionary`,
    starterCode: `def merge_dicts(dicts):
    # Merge all dicts, summing values for same keys
    return {}`,
    solutionCode: `def merge_dicts(dicts):
    merged = {}
    for d in dicts:
        for key, value in d.items():
            merged[key] = merged.get(key, 0) + value
    return merged`,
    tests: [
      {
        name: 'test_merge_dicts',
        code: `def merge_dicts(dicts):
    merged = {}
    for d in dicts:
        for key, value in d.items():
            merged[key] = merged.get(key, 0) + value
    return merged
dicts_list = [{"a": 1, "b": 2}, {"b": 3, "c": 4}, {"a": 2}]
assert merge_dicts(dicts_list) == {"a": 3, "b": 5, "c": 4}`,
      },
    ],
    hints: [
      'Create an empty dict for merged results',
      'Loop through each dict in the list',
      'Loop through each key-value pair in each dict',
      'Add values for matching keys',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries'],
    dayNumber: 9,
    points: 10,
  },
  {
    id: 'py-2-09',
    moduleId: 'week-02',
    slug: 'sort-dict-by-value',
    title: 'Sort Dictionary by Value',
    description: 'Return dictionary sorted by values (descending).',
    instructions: `Write a function \`sort_by_value(d)\` that:
- Takes a dictionary
- Returns a list of (key, value) tuples sorted by value descending`,
    starterCode: `def sort_by_value(d):
    # Return list of (key, value) sorted by value descending
    return []`,
    solutionCode: `def sort_by_value(d):
    return sorted(d.items(), key=lambda x: x[1], reverse=True)`,
    tests: [
      {
        name: 'test_sort_by_value',
        code: `def sort_by_value(d):
    return sorted(d.items(), key=lambda x: x[1], reverse=True)
result = sort_by_value({"a": 3, "b": 1, "c": 2})
assert result == [("a", 3), ("c", 2), ("b", 1)]`,
      },
    ],
    hints: [
      'Use .items() to get (key, value) pairs',
      'Use sorted() with a key function',
      'lambda x: x[1] sorts by the value (index 1)',
      'reverse=True for descending order',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries', 'comprehensions'],
    dayNumber: 9,
    points: 10,
  },
  {
    id: 'py-2-10',
    moduleId: 'week-02',
    slug: 'invert-dict',
    title: 'Invert a Dictionary',
    description: 'Swap keys and values in a dictionary.',
    instructions: `Write a function \`invert_dict(d)\` that:
- Returns a new dict with values as keys and keys as values
- Assume all values are unique (no collisions)`,
    starterCode: `def invert_dict(d):
    # Return new dict with keys and values swapped
    return {}`,
    solutionCode: `def invert_dict(d):
    return {value: key for key, value in d.items()}`,
    tests: [
      {
        name: 'test_invert_dict',
        code: `def invert_dict(d):
    return {value: key for key, value in d.items()}
assert invert_dict({"a": 1, "b": 2, "c": 3}) == {1: "a", 2: "b", 3: "c"}`,
      },
    ],
    hints: [
      'Use dict comprehension',
      'Iterate over d.items() to get (key, value) pairs',
      '{value: key for key, value in d.items()}',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries', 'comprehensions'],
    dayNumber: 9,
    points: 10,
  },
];
