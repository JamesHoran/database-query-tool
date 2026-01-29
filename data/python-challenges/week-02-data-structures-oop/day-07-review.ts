// Week 2, Day 7: Review Challenge
// 5 cumulative practice problems for Week 2

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-31',
    moduleId: 'week-02',
    slug: 'review-queue-class',
    title: 'Review: Queue Class',
    description: 'Implement a queue using a list (FIFO).',
    instructions: `Create a \`Queue\` class with:
- enqueue(item) - add to back
- dequeue() - remove and return from front
- is_empty() - returns True if empty
- __len__() - returns number of items`,
    starterCode: `class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        pass

    def dequeue(self):
        pass

    def is_empty(self):
        pass

    def __len__(self):
        pass`,
    solutionCode: `class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if self.is_empty():
            return None
        return self.items.pop(0)

    def is_empty(self):
        return len(self.items) == 0

    def __len__(self):
        return len(self.items)`,
    tests: [
      {
        name: 'test_queue_class',
        code: `q = Queue()
q.enqueue("first")
q.enqueue("second")
assert len(q) == 2, "Queue should have 2 items"
assert q.dequeue() == "first", "Should dequeue first item (FIFO)"
assert len(q) == 1, "Queue should have 1 item after dequeue"`,
      },
    ],
    hints: [
      'FIFO = First In, First Out',
      'enqueue adds to the end (append)',
      'dequeue removes from the front (pop(0))',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'lists', 'oop'],
    dayNumber: 14,
    points: 10,
  },
  {
    id: 'py-2-32',
    moduleId: 'week-02',
    slug: 'review-stack-class',
    title: 'Review: Stack Class',
    description: 'Implement a stack using a list (LIFO).',
    instructions: `Create a \`Stack\` class with:
- push(item) - add to top
- pop() - remove and return from top
- peek() - return top item without removing
- is_empty() - returns True if empty`,
    starterCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def is_empty(self):
        pass`,
    solutionCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`,
    tests: [
      {
        name: 'test_stack_class',
        code: `s = Stack()
s.push("a")
s.push("b")
assert s.peek() == "b", "Peek should return top item"
assert s.pop() == "b", "Pop should return top item (LIFO)"
assert s.peek() == "a", "Peek should return next item"`,
      },
    ],
    hints: [
      'LIFO = Last In, First Out',
      'push adds to the end (append)',
      'pop removes from the end (pop)',
      'peek looks at last item without removing',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'lists', 'oop'],
    dayNumber: 14,
    points: 10,
  },
  {
    id: 'py-2-33',
    moduleId: 'week-02',
    slug: 'review-anagram-checker',
    title: 'Review: Anagram Checker',
    description: 'Check if two strings are anagrams.',
    instructions: `Write a function \`is_anagram(str1, str2)\` that:
- Returns True if strings contain same characters (different order)
- Ignores case and spaces
- Use Counter approach or sorting`,
    starterCode: `def is_anagram(str1, str2):
    # Return True if anagrams
    return False`,
    solutionCode: `def is_anagram(str1, str2):
    # Normalize: lowercase and remove spaces
    s1 = str1.lower().replace(" ", "")
    s2 = str2.lower().replace(" ", "")

    # Count characters
    from collections import Counter
    return Counter(s1) == Counter(s2)`,
    tests: [
      {
        name: 'test_anagram_true',
        code: `assert is_anagram("listen", "silent") == True, "listen and silent are anagrams"
assert is_anagram("race car", "car race") == True, "Should ignore spaces"`,
      },
      {
        name: 'test_anagram_false',
        code: `assert is_anagram("hello", "world") == False, "hello and world are not anagrams"`,
      },
    ],
    hints: [
      'Normalize strings first (lowercase, remove spaces)',
      'Use Counter from collections to count characters',
      'Compare Counter objects for equality',
    ],
    difficulty: 'intermediate',
    concepts: ['string_manipulation', 'dictionaries'],
    dayNumber: 14,
    points: 10,
  },
  {
    id: 'py-2-34',
    moduleId: 'week-02',
    slug: 'review-binary-search',
    title: 'Review: Binary Search',
    description: 'Implement binary search on a sorted list.',
    instructions: `Write a function \`binary_search(lst, target)\` that:
- Returns index of target in sorted list
- Returns -1 if not found
- Use binary search algorithm (O(log n))`,
    starterCode: `def binary_search(lst, target):
    # Return index of target using binary search
    return -1`,
    solutionCode: `def binary_search(lst, target):
    left, right = 0, len(lst) - 1

    while left <= right:
        mid = (left + right) // 2
        if lst[mid] == target:
            return mid
        elif lst[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
    tests: [
      {
        name: 'test_binary_search_found',
        code: `assert binary_search([1, 3, 5, 7, 9], 5) == 2, "Should find target at index 2"`,
      },
      {
        name: 'test_binary_search_not_found',
        code: `assert binary_search([1, 3, 5, 7, 9], 4) == -1, "Should return -1 when target not found"`,
      },
    ],
    hints: [
      'Use two pointers: left and right',
      'Find middle index: (left + right) // 2',
      'Compare middle value to target',
      'Adjust pointers based on comparison',
      'Loop while left <= right',
    ],
    difficulty: 'intermediate',
    concepts: ['algorithms', 'lists'],
    dayNumber: 14,
    points: 10,
  },
  {
    id: 'py-2-35',
    moduleId: 'week-02',
    slug: 'review-to-do-list',
    title: 'Review: To-Do List Manager',
    description: 'Create a class to manage a to-do list.',
    instructions: `Create a \`TodoList\` class with:
- Add task (string)
- Complete task (by index)
- Get pending tasks (list of incomplete)
- Get completed tasks (list of complete)
- Each task is a dict with "task" and "done" keys`,
    starterCode: `class TodoList:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        pass

    def complete_task(self, index):
        pass

    def get_pending(self):
        pass

    def get_completed(self):
        pass`,
    solutionCode: `class TodoList:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append({"task": task, "done": False})

    def complete_task(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["done"] = True

    def get_pending(self):
        return [t["task"] for t in self.tasks if not t["done"]]

    def get_completed(self):
        return [t["task"] for t in self.tasks if t["done"]]`,
    tests: [
      {
        name: 'test_todo_list',
        code: `todo = TodoList()
todo.add_task("Buy groceries")
todo.add_task("Code")
todo.complete_task(0)
assert todo.get_pending() == ["Code"], "Only Code should be pending"
assert todo.get_completed() == ["Buy groceries"], "Buy groceries should be completed"`,
      },
    ],
    hints: [
      'Store tasks as list of dicts',
      'Each dict: {"task": string, "done": bool}',
      'Use list comprehension to filter by done status',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'lists', 'dicts', 'oop'],
    dayNumber: 14,
    points: 10,
  },
];
