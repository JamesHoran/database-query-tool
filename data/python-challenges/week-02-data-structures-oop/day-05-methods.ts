// Week 2, Day 5: Methods
// 5 challenges covering instance methods, __str__, and @property

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-21',
    moduleId: 'week-02',
    slug: 'str-vs-repr',
    title: '__str__ vs __repr__',
    description: 'Understand the difference between string representations.',
    instructions: `Create a \`Book\` class with:
- Attributes: title, author, year
- __str__ for user-friendly: "{title}" by {author}
- __repr__ for debugging: Book({title}, {author}, {year})`,
    starterCode: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def __str__(self):
        # User-friendly string
        pass

    def __repr__(self):
        # Developer-friendly string
        pass`,
    solutionCode: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def __str__(self):
        return f'"{self.title}" by {self.author}'

    def __repr__(self):
        return f"Book({self.title!r}, {self.author!r}, {self.year})"`,
    tests: [
      {
        name: 'test_book_str_repr',
        code: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year
    def __str__(self):
        return f'"{self.title}" by {self.author}'
    def __repr__(self):
        return f"Book({self.title!r}, {self.author!r}, {self.year})"
book = Book("1984", "George Orwell", 1949)
assert str(book) == '"1984" by George Orwell'
assert "Book(" in repr(book) and "1984" in repr(book)`,
      },
    ],
    hints: [
      '__str__ is for end users (readable)',
      '__repr__ is for developers (unambiguous)',
      'Use {var!r} for repr formatting in f-strings',
      'print() uses __str__, repr() uses __repr__',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 12,
    points: 10,
  },
  {
    id: 'py-2-22',
    moduleId: 'week-02',
    slug: 'property-decorator',
    title: 'The @property Decorator',
    description: 'Create computed attributes with @property.',
    instructions: `Create a \`Circle\` class with:
- Attribute: radius
- @property area: returns π × r² (use 3.14)
- @property diameter: returns 2 × radius`,
    starterCode: `class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        pass

    @property
    def diameter(self):
        pass`,
    solutionCode: `class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return 3.14 * self.radius ** 2

    @property
    def diameter(self):
        return 2 * self.radius`,
    tests: [
      {
        name: 'test_circle_properties',
        code: `class Circle:
    def __init__(self, radius):
        self.radius = radius
    @property
    def area(self):
        return 3.14 * self.radius ** 2
    @property
    def diameter(self):
        return 2 * self.radius
c = Circle(5)
assert round(c.area, 2) == 78.5
assert c.diameter == 10`,
      },
    ],
    hints: [
      '@property makes a method act like an attribute',
      'Access without parentheses: circle.area',
      'Use for computed values derived from other attributes',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 12,
    points: 10,
  },
  {
    id: 'py-2-23',
    moduleId: 'week-02',
    slug: 'setter-decorator',
    title: 'Property Setters',
    description: 'Control attribute assignment with setters.',
    instructions: `Create a \`Temperature\` class with:
- Private _celsius attribute
- @property celsius: getter
- @celsius.setter: validates temperature >= -273.15
- @property fahrenheit: returns converted temp`,
    starterCode: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        pass

    @celsius.setter
    def celsius(self, value):
        # Set only if value >= -273.15
        pass

    @property
    def fahrenheit(self):
        pass`,
    solutionCode: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value >= -273.15:
            self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32`,
    tests: [
      {
        name: 'test_temperature_class',
        code: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    @property
    def celsius(self):
        return self._celsius
    @celsius.setter
    def celsius(self, value):
        if value >= -273.15:
            self._celsius = value
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32
t = Temperature(0)
assert t.fahrenheit == 32
t.celsius = 100
assert t.fahrenheit == 212
t.celsius = -300
assert t.celsius == 100  # Should not change`,
      },
    ],
    hints: [
      'Use _attribute for "private" attributes',
      '@prop.setter defines the setter',
      'Validate before setting in the setter',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 12,
    points: 10,
  },
  {
    id: 'py-2-24',
    moduleId: 'week-02',
    slug: 'class-methods',
    title: 'Class Methods with @classmethod',
    description: 'Create methods that work on the class, not instances.',
    instructions: `Create a \`Student\` class with:
- Class attribute: school_name
- Instance: name, grade
- @classmethod from_string: parse "name,grade" string
- Instance method: get_info()`,
    starterCode: `class Student:
    school_name = "Python Academy"

    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    @classmethod
    def from_string(cls, info_string):
        # Parse "name,grade" and return new Student
        pass

    def get_info(self):
        pass`,
    solutionCode: `class Student:
    school_name = "Python Academy"

    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    @classmethod
    def from_string(cls, info_string):
        name, grade = info_string.split(",")
        return cls(name, int(grade))

    def get_info(self):
        return f"{self.name} (Grade {self.grade}) - {self.school_name}"`,
    tests: [
      {
        name: 'test_student_classmethod',
        code: `class Student:
    school_name = "Python Academy"
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    @classmethod
    def from_string(cls, info_string):
        name, grade = info_string.split(",")
        return cls(name, int(grade))
    def get_info(self):
        return f"{self.name} (Grade {self.grade}) - {self.school_name}"
s = Student.from_string("Alice,10")
assert s.name == "Alice"
assert s.grade == 10
assert s.get_info() == "Alice (Grade 10) - Python Academy"`,
      },
    ],
    hints: [
      '@classmethod takes cls as first parameter (not self)',
      'cls refers to the class itself',
      'Use to create alternative constructors',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 12,
    points: 10,
  },
  {
    id: 'py-2-25',
    moduleId: 'week-02',
    slug: 'static-methods',
    title: 'Static Methods with @staticmethod',
    description: 'Create utility methods that don\'t need instance or class.',
    instructions: `Create a \`Math\` class with:
- @staticmethod: add(a, b) - returns sum
- @staticmethod: multiply(a, b) - returns product
- @staticmethod: power(base, exp) - returns base**exp`,
    starterCode: `class Math:
    @staticmethod
    def add(a, b):
        pass

    @staticmethod
    def multiply(a, b):
        pass

    @staticmethod
    def power(base, exp):
        pass`,
    solutionCode: `class Math:
    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def multiply(a, b):
        return a * b

    @staticmethod
    def power(base, exp):
        return base ** exp`,
    tests: [
      {
        name: 'test_math_staticmethods',
        code: `class Math:
    @staticmethod
    def add(a, b):
        return a + b
    @staticmethod
    def multiply(a, b):
        return a * b
    @staticmethod
    def power(base, exp):
        return base ** exp
assert Math.add(3, 5) == 8
assert Math.multiply(4, 7) == 28
assert Math.power(2, 5) == 32`,
      },
    ],
    hints: [
      '@staticmethod doesn\'t take self or cls',
      'Use for utility functions related to the class',
      'Call via ClassName.method()',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 12,
    points: 10,
  },
];
