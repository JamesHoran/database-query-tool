// Week 1, Day 6: Dictionaries
// 5 challenges covering dict methods, .get(), .items()

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-1-26',
    moduleId: 'week-01',
    slug: 'dict-basics',
    title: 'Dictionary Basics',
    description: 'Create, access, and modify dictionaries.',
    instructions: `Given \`person\` dict:
1. Get the name value
2. Add a new key "email" with value "test@example.com"
3. Update age to 31
4. Check if "city" key exists`,
    starterCode: `person = {
    "name": "Alice",
    "age": 30,
    "city": "NYC"
}

name_value = ""       # Get name
is_city_in_dict = False  # Check if city exists

# Add email key
# Update age to 31`,
    solutionCode: `person = {
    "name": "Alice",
    "age": 30,
    "city": "NYC"
}

name_value = person["name"]
is_city_in_dict = "city" in person
person["email"] = "test@example.com"
person["age"] = 31`,
    tests: [
      {
        name: 'test_dict_access',
        code: `person = {"name": "Alice", "age": 30, "city": "NYC"}
name_value = person["name"]
is_city_in_dict = "city" in person
person["email"] = "test@example.com"
person["age"] = 31
assert name_value == "Alice"
assert is_city_in_dict == True
assert person["email"] == "test@example.com"
assert person["age"] == 31`,
      },
    ],
    hints: [
      'dict["key"] - get value (raises error if not found)',
      'dict.get("key") - get value (returns None if not found)',
      '"key" in dict - check if key exists',
      'dict["new_key"] = value - add new key',
    ],
    difficulty: 'beginner',
    concepts: ['dictionaries', 'data_structures'],
    dayNumber: 6,
    points: 10,
  },
  {
    id: 'py-1-27',
    moduleId: 'week-01',
    slug: 'dict-get-method',
    title: 'The .get() Method',
    description: 'Safely access dictionary values with default.',
    instructions: `Use .get() to:
1. Get "name" from person (exists)
2. Get "phone" from person (doesn\'t exist, return "N/A")
3. Get "email" with default "unknown@example.com"`,
    starterCode: `person = {"name": "Alice", "age": 30}

name_val = ""      # Use .get()
phone_val = ""     # Use .get() with default
email_val = ""     # Use .get() with default`,
    solutionCode: `person = {"name": "Alice", "age": 30}

name_val = person.get("name")
phone_val = person.get("phone", "N/A")
email_val = person.get("email", "unknown@example.com")`,
    tests: [
      {
        name: 'test_get_method',
        code: `person = {"name": "Alice", "age": 30}
name_val = person.get("name")
phone_val = person.get("phone", "N/A")
email_val = person.get("email", "unknown@example.com")
assert name_val == "Alice"
assert phone_val == "N/A"
assert email_val == "unknown@example.com"`,
      },
    ],
    hints: [
      '.get("key") - returns value or None',
      '.get("key", default) - returns value or default',
      'Safer than dict["key"] which raises KeyError',
    ],
    difficulty: 'beginner',
    concepts: ['dictionaries'],
    dayNumber: 6,
    points: 10,
  },
  {
    id: 'py-1-28',
    moduleId: 'week-01',
    slug: 'dict-items-keys-values',
    title: 'Dict Methods: .items(), .keys(), .values()',
    description: 'Iterate over dictionary contents.',
    instructions: `From \`scores\` dict:
1. Get all student names
2. Get all score values
3. Create a list of "name: score" strings using .items()`,
    starterCode: `scores = {
    "Alice": 95,
    "Bob": 87,
    "Charlie": 92
}

names = []           # All student names
score_values = []    # All score values
formatted = []       # List of "name: score" strings`,
    solutionCode: `scores = {
    "Alice": 95,
    "Bob": 87,
    "Charlie": 92
}

names = list(scores.keys())
score_values = list(scores.values())
formatted = [f"{name}: {score}" for name, score in scores.items()]`,
    tests: [
      {
        name: 'test_dict_methods',
        code: `scores = {"Alice": 95, "Bob": 87, "Charlie": 92}
names = list(scores.keys())
score_values = list(scores.values())
formatted = [f"{name}: {score}" for name, score in scores.items()]
assert set(names) == {"Alice", "Bob", "Charlie"}
assert set(score_values) == {95, 87, 92}
assert "Alice: 95" in formatted`,
      },
    ],
    hints: [
      '.keys() - returns all keys',
      '.values() - returns all values',
      '.items() - returns (key, value) pairs',
      'Use list() to convert view object to list',
    ],
    difficulty: 'beginner',
    concepts: ['dictionaries', 'loops'],
    dayNumber: 6,
    points: 10,
  },
  {
    id: 'py-1-29',
    moduleId: 'week-01',
    slug: 'dict-comprehensions',
    title: 'Dictionary Comprehensions',
    description: 'Create dictionaries with comprehensions.',
    instructions: `Use dict comprehensions to:
1. Create squares dict: {1: 1, 2: 4, 3: 9, ...} for 1-5
2. Create word length dict from list`,
    starterCode: `# Create {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
squares_dict = {}

# Create {"apple": 5, "banana": 6, "cherry": 6}
words = ["apple", "banana", "cherry"]
lengths_dict = {}`,
    solutionCode: `# Create {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
squares_dict = {x: x**2 for x in range(1, 6)}

# Create {"apple": 5, "banana": 6, "cherry": 6}
words = ["apple", "banana", "cherry"]
lengths_dict = {word: len(word) for word in words}`,
    tests: [
      {
        name: 'test_squares_dict',
        code: `squares_dict = {x: x**2 for x in range(1, 6)}
assert squares_dict == {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`,
      },
      {
        name: 'test_lengths_dict',
        code: `words = ["apple", "banana", "cherry"]
lengths_dict = {word: len(word) for word in words}
assert lengths_dict == {"apple": 5, "banana": 6, "cherry": 6}`,
      },
    ],
    hints: [
      '{key: value for item in sequence}',
      '{key_expr: value_expr for item in sequence}',
      'Similar to list comprehensions but with key: value pairs',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries', 'comprehensions'],
    dayNumber: 6,
    points: 10,
  },
  {
    id: 'py-1-30',
    moduleId: 'week-01',
    slug: 'nested-dictionaries',
    title: 'Nested Dictionaries',
    description: 'Work with dictionaries inside dictionaries.',
    instructions: `Given nested \`students\` dict:
1. Get Alice\'s math score
2. Get Bob\'s science score
3. Add a new student "Charlie" with scores
4. Calculate Alice\'s average score`,
    starterCode: `students = {
    "Alice": {"math": 95, "science": 88, "english": 92},
    "Bob": {"math": 87, "science": 90, "english": 85}
}

alice_math = 0          # Alice's math score
bob_science = 0         # Bob's science score
alice_avg = 0.0         # Alice's average

# Add Charlie with scores: math 82, science 85, english 88`,
    solutionCode: `students = {
    "Alice": {"math": 95, "science": 88, "english": 92},
    "Bob": {"math": 87, "science": 90, "english": 85}
}

alice_math = students["Alice"]["math"]
bob_science = students["Bob"]["science"]
alice_scores = students["Alice"].values()
alice_avg = sum(alice_scores) / len(alice_scores)
students["Charlie"] = {"math": 82, "science": 85, "english": 88}`,
    tests: [
      {
        name: 'test_nested_dict',
        code: `students = {
    "Alice": {"math": 95, "science": 88, "english": 92},
    "Bob": {"math": 87, "science": 90, "english": 85}
}
alice_math = students["Alice"]["math"]
bob_science = students["Bob"]["science"]
alice_scores = students["Alice"].values()
alice_avg = sum(alice_scores) / len(alice_scores)
students["Charlie"] = {"math": 82, "science": 85, "english": 88}
assert alice_math == 95
assert bob_science == 90
assert alice_avg == (95 + 88 + 92) / 3
assert "Charlie" in students`,
      },
    ],
    hints: [
      'Access nested values: dict["outer"]["inner"]',
      'Use .values() to get all values from inner dict',
      'sum() / len() to calculate average',
    ],
    difficulty: 'intermediate',
    concepts: ['dictionaries'],
    dayNumber: 6,
    points: 10,
  },
];
