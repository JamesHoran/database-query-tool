// Week 2, Day 1: Lists Advanced
// 5 challenges covering algorithms, searching, and sorting

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-01',
    moduleId: 'week-02',
    slug: 'finding-maximum',
    title: 'Finding Maximum Value',
    description: 'Find the maximum value in a list without using max().',
    instructions: `Write a function \`find_max(numbers)\` that:
- Returns the largest number in the list
- Works with any list of numbers
- Do NOT use the built-in max() function`,
    starterCode: `def find_max(numbers):
    # Your code here
    pass`,
    solutionCode: `def find_max(numbers):
    if not numbers:
        return None
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum`,
    tests: [
      {
        name: 'test_find_max_positive',
        code: `def find_max(numbers):
    if not numbers:
        return None
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum
assert find_max([3, 7, 2, 9, 1]) == 9`,
      },
      {
        name: 'test_find_max_negative',
        code: `def find_max(numbers):
    if not numbers:
        return None
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum
assert find_max([-5, -2, -8, -1]) == -1`,
      },
      {
        name: 'test_find_max_single',
        code: `def find_max(numbers):
    if not numbers:
        return None
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum
assert find_max([42]) == 42`,
      },
    ],
    hints: [
      'Start by assuming the first element is the maximum',
      'Loop through the list and update maximum if you find a larger value',
      'Return the final maximum value',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'algorithms'],
    dayNumber: 8,
    points: 10,
  },
  {
    id: 'py-2-02',
    moduleId: 'week-02',
    slug: 'linear-search',
    title: 'Linear Search',
    description: 'Search for a value in a list.',
    instructions: `Write a function \`linear_search(lst, target)\` that:
- Returns the index of \`target\` in \`lst\`
- Returns -1 if not found
- Do NOT use list.index()`,
    starterCode: `def linear_search(lst, target):
    # Return index of target, or -1 if not found
    return -1`,
    solutionCode: `def linear_search(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1`,
    tests: [
      {
        name: 'test_search_found',
        code: `def linear_search(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1
assert linear_search([1, 5, 3, 7, 9], 3) == 2`,
      },
      {
        name: 'test_search_not_found',
        code: `def linear_search(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1
assert linear_search([1, 5, 3, 7, 9], 4) == -1`,
      },
      {
        name: 'test_search_first_occurrence',
        code: `def linear_search(lst, target):
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1
assert linear_search([1, 2, 2, 3], 2) == 1`,
      },
    ],
    hints: [
      'Use enumerate() to get both index and value',
      'Return the index when you find a match',
      'Return -1 after the loop if not found',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'algorithms'],
    dayNumber: 8,
    points: 10,
  },
  {
    id: 'py-2-03',
    moduleId: 'week-02',
    slug: 'reversing-list',
    title: 'Reversing a List',
    description: 'Reverse a list in place without using reverse().',
    instructions: `Write a function \`reverse_list(lst)\` that:
- Reverses the list in place (modifies original)
- Returns the reversed list
- Do NOT use lst.reverse() or lst[::-1]`,
    starterCode: `def reverse_list(lst):
    # Reverse the list in place
    return lst`,
    solutionCode: `def reverse_list(lst):
    left = 0
    right = len(lst) - 1
    while left < right:
        lst[left], lst[right] = lst[right], lst[left]
        left += 1
        right -= 1
    return lst`,
    tests: [
      {
        name: 'test_reverse_even',
        code: `def reverse_list(lst):
    left = 0
    right = len(lst) - 1
    while left < right:
        lst[left], lst[right] = lst[right], lst[left]
        left += 1
        right -= 1
    return lst
test = [1, 2, 3, 4]
assert reverse_list(test) == [4, 3, 2, 1]`,
      },
      {
        name: 'test_reverse_odd',
        code: `def reverse_list(lst):
    left = 0
    right = len(lst) - 1
    while left < right:
        lst[left], lst[right] = lst[right], lst[left]
        left += 1
        right -= 1
    return lst
test = [1, 2, 3, 4, 5]
assert reverse_list(test) == [5, 4, 3, 2, 1]`,
      },
    ],
    hints: [
      'Use two pointers: one at start, one at end',
      'Swap elements and move pointers toward center',
      'Stop when pointers meet or cross',
      'Swap using: a, b = b, a',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'algorithms'],
    dayNumber: 8,
    points: 10,
  },
  {
    id: 'py-2-04',
    moduleId: 'week-02',
    slug: 'removing-duplicates',
    title: 'Removing Duplicates',
    description: 'Remove duplicates while preserving order.',
    instructions: `Write a function \`remove_duplicates(lst)\` that:
- Returns a new list with duplicates removed
- Preserves the original order of first occurrences
- Do NOT use set() or dict.fromkeys()`,
    starterCode: `def remove_duplicates(lst):
    # Return new list with duplicates removed
    return []`,
    solutionCode: `def remove_duplicates(lst):
    result = []
    seen = set()
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.add(item)
    return result`,
    tests: [
      {
        name: 'test_remove_duplicates',
        code: `def remove_duplicates(lst):
    result = []
    seen = set()
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.add(item)
    return result
assert remove_duplicates([1, 2, 2, 3, 1, 4]) == [1, 2, 3, 4]`,
      },
      {
        name: 'test_remove_duplicates_strings',
        code: `def remove_duplicates(lst):
    result = []
    seen = set()
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.add(item)
    return result
assert remove_duplicates(["a", "b", "a", "c", "b"]) == ["a", "b", "c"]`,
      },
    ],
    hints: [
      'Create an empty result list',
      'Use a set to track seen items',
      'Only add items not yet seen to result',
    ],
    difficulty: 'intermediate',
    concepts: ['lists'],
    dayNumber: 8,
    points: 10,
  },
  {
    id: 'py-2-05',
    moduleId: 'week-02',
    slug: 'merge-two-lists',
    title: 'Merging Two Sorted Lists',
    description: 'Merge two sorted lists into one sorted list.',
    instructions: `Write a function \`merge_sorted(list1, list2)\` that:
- Merges two already-sorted lists
- Returns a new sorted list
- Both input lists are sorted in ascending order`,
    starterCode: `def merge_sorted(list1, list2):
    # Merge two sorted lists into one sorted list
    return []`,
    solutionCode: `def merge_sorted(list1, list2):
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result`,
    tests: [
      {
        name: 'test_merge_basic',
        code: `def merge_sorted(list1, list2):
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result
assert merge_sorted([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6]`,
      },
      {
        name: 'test_merge_different_lengths',
        code: `def merge_sorted(list1, list2):
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result
assert merge_sorted([1, 2, 5], [3, 4]) == [1, 2, 3, 4, 5]`,
      },
    ],
    hints: [
      'Use two indices to track positions in both lists',
      'Compare elements at current indices',
      'Add the smaller one to result and advance that index',
      'After one list is exhausted, add remaining elements',
    ],
    difficulty: 'intermediate',
    concepts: ['lists', 'algorithms'],
    dayNumber: 8,
    points: 10,
  },
];
