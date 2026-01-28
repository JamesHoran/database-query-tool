// Week 2, Day 4: Classes Basics
// 5 challenges covering class definition, __init__, and self

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-16',
    moduleId: 'week-02',
    slug: 'defining-classes',
    title: 'Defining a Simple Class',
    description: 'Create a class with attributes and a method.',
    instructions: `Create a \`Dog\` class with:
- \`__init__\` that sets name and breed attributes
- A \`bark\` method that returns "{name} says Woof!"`,
    starterCode: `class Dog:
    def __init__(self, name, breed):
        # Your code here
        pass

    def bark(self):
        # Return "{name} says Woof!"
        pass`,
    solutionCode: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def bark(self):
        return f"{self.name} says Woof!"`,
    tests: [
      {
        name: 'test_dog_class',
        code: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    def bark(self):
        return f"{self.name} says Woof!"
dog = Dog("Buddy", "Golden Retriever")
assert dog.name == "Buddy"
assert dog.breed == "Golden Retriever"
assert dog.bark() == "Buddy says Woof!"`,
      },
    ],
    hints: [
      'Use __init__ to initialize attributes',
      'self.name = name stores the name as an attribute',
      'self refers to the instance being created',
      'Methods always take self as first parameter',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 11,
    points: 10,
  },
  {
    id: 'py-2-17',
    moduleId: 'week-02',
    slug: 'class-with-multiple-methods',
    title: 'Class with Multiple Methods',
    description: 'Create a class with several methods.',
    instructions: `Create a \`Rectangle\` class with:
- Attributes: width, height
- Method \`area()\` - returns width × height
- Method \`perimeter()\` - returns 2 × (width + height)
- Method \`is_square()\` - returns True if width == height`,
    starterCode: `class Rectangle:
    def __init__(self, width, height):
        # Your code here
        pass

    def area(self):
        pass

    def perimeter(self):
        pass

    def is_square(self):
        pass`,
    solutionCode: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height`,
    tests: [
      {
        name: 'test_rectangle_class',
        code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    def area(self):
        return self.width * self.height
    def perimeter(self):
        return 2 * (self.width + self.height)
    def is_square(self):
        return self.width == self.height
r = Rectangle(5, 3)
assert r.area() == 15
assert r.perimeter() == 16
assert r.is_square() == False`,
      },
      {
        name: 'test_square_rectangle',
        code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    def area(self):
        return self.width * self.height
    def perimeter(self):
        return 2 * (self.width + self.height)
    def is_square(self):
        return self.width == self.height
s = Rectangle(4, 4)
assert s.is_square() == True
assert s.area() == 16`,
      },
    ],
    hints: [
      'All instance methods take self as first parameter',
      'Access attributes using self.attribute_name',
      'Methods can call other methods via self',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 11,
    points: 10,
  },
  {
    id: 'py-2-18',
    moduleId: 'week-02',
    slug: 'default-attributes',
    title: 'Default Attribute Values',
    description: 'Set default values for attributes.',
    instructions: `Create a \`Car\` class with:
- __init__ taking make, model, and year (default 2024)
- Method \`description()\` returning "{year} {make} {model}"
- Method \`age()\` returning years since 2024`,
    starterCode: `class Car:
    def __init__(self, make, model, year):
        # Your code here
        pass

    def description(self):
        pass

    def age(self):
        pass`,
    solutionCode: `class Car:
    def __init__(self, make, model, year=2024):
        self.make = make
        self.model = model
        self.year = year

    def description(self):
        return f"{self.year} {self.make} {self.model}"

    def age(self):
        return 2024 - self.year`,
    tests: [
      {
        name: 'test_car_default_year',
        code: `class Car:
    def __init__(self, make, model, year=2024):
        self.make = make
        self.model = model
        self.year = year
    def description(self):
        return f"{self.year} {self.make} {self.model}"
    def age(self):
        return 2024 - self.year
car = Car("Toyota", "Camry")
assert car.year == 2024
assert car.description() == "2024 Toyota Camry"`,
      },
      {
        name: 'test_car_custom_year',
        code: `class Car:
    def __init__(self, make, model, year=2024):
        self.make = make
        self.model = model
        self.year = year
    def description(self):
        return f"{self.year} {self.make} {self.model}"
    def age(self):
        return 2024 - self.year
old_car = Car("Honda", "Civic", 2015)
assert old_car.age() == 9`,
      },
    ],
    hints: [
      'Set default values in __init__ parameters',
      'def __init__(self, make, model, year=2024):',
      'Use the parameter value or the default if not provided',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 11,
    points: 10,
  },
  {
    id: 'py-2-19',
    moduleId: 'week-02',
    slug: 'class-attributes',
    title: 'Class Attributes vs Instance Attributes',
    description: 'Understand class-level and instance-level attributes.',
    instructions: `Create a \`BankAccount\` class with:
- Class attribute \`interest_rate\` = 0.02
- Instance attributes: owner, balance
- Method \`apply_interest()\` - adds interest to balance
- Method \`__str__\` - returns "Account: {owner}, Balance: ${balance}"`,
    starterCode: `class BankAccount:
    interest_rate = 0.02  # Class attribute

    def __init__(self, owner, balance):
        # Your code here
        pass

    def apply_interest(self):
        pass

    def __str__(self):
        pass`,
    solutionCode: `class BankAccount:
    interest_rate = 0.02

    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def apply_interest(self):
        self.balance += self.balance * BankAccount.interest_rate

    def __str__(self):
        return f"Account: {self.owner}, Balance: ${self.balance:.2f}"`,
    tests: [
      {
        name: 'test_bank_account',
        code: `class BankAccount:
    interest_rate = 0.02
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def apply_interest(self):
        self.balance += self.balance * BankAccount.interest_rate
    def __str__(self):
        return f"Account: {self.owner}, Balance: ${self.balance:.2f}"
acc = BankAccount("Alice", 1000)
acc.apply_interest()
assert round(acc.balance, 2) == 1020.0
assert "Alice" in str(acc)`,
      },
    ],
    hints: [
      'Class attributes are shared by all instances',
      'Instance attributes are unique to each instance',
      'Access class attribute via ClassName.attribute',
      '__str__ controls how object is converted to string',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 11,
    points: 10,
  },
  {
    id: 'py-2-20',
    moduleId: 'week-02',
    slug: 'comparing-objects',
    title: 'Comparing Objects with __eq__',
    description: 'Define how objects are compared for equality.',
    instructions: `Create a \`Point\` class with:
- Attributes: x, y
- __eq__ method that returns True if both x and y are equal
- __str__ method that returns "Point({x}, {y})"`,
    starterCode: `class Point:
    def __init__(self, x, y):
        # Your code here
        pass

    def __eq__(self, other):
        # Return True if x and y are equal
        pass

    def __str__(self):
        pass`,
    solutionCode: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"Point({self.x}, {self.y})"`,
    tests: [
      {
        name: 'test_point_equality',
        code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    def __str__(self):
        return f"Point({self.x}, {self.y})"
p1 = Point(3, 4)
p2 = Point(3, 4)
p3 = Point(1, 2)
assert p1 == p2
assert p1 != p3
assert str(p1) == "Point(3, 4)"`,
      },
    ],
    hints: [
      '__eq__ defines behavior for == operator',
      'Compare attribute values: self.x == other.x',
      '__str__ defines behavior for str() and print()',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 11,
    points: 10,
  },
];
