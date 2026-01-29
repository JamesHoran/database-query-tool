// Week 2, Day 6: OOP Practice
// 5 challenges for practical class design

import type { PythonChallenge } from '@/types/python';

export const challenges: PythonChallenge[] = [
  {
    id: 'py-2-26',
    moduleId: 'week-02',
    slug: 'shopping-cart-class',
    title: 'Shopping Cart Class',
    description: 'Design a class to manage a shopping cart.',
    instructions: `Create a \`ShoppingCart\` class with:
- Items stored as a dict: {item_name: price}
- add_item(name, price) - adds item
- remove_item(name) - removes item
- get_total() - returns total price
- __len__() - returns number of items`,
    starterCode: `class ShoppingCart:
    def __init__(self):
        self.items = {}

    def add_item(self, name, price):
        pass

    def remove_item(self, name):
        pass

    def get_total(self):
        pass

    def __len__(self):
        pass`,
    solutionCode: `class ShoppingCart:
    def __init__(self):
        self.items = {}

    def add_item(self, name, price):
        self.items[name] = price

    def remove_item(self, name):
        if name in self.items:
            del self.items[name]

    def get_total(self):
        return sum(self.items.values())

    def __len__(self):
        return len(self.items)`,
    tests: [
      {
        name: 'test_shopping_cart',
        code: `cart = ShoppingCart()
cart.add_item("Apple", 1.50)
cart.add_item("Bread", 2.00)
assert len(cart) == 2, "Cart should have 2 items"
assert cart.get_total() == 3.5, "Total should be sum of prices"
cart.remove_item("Apple")
assert len(cart) == 1, "Cart should have 1 item after removal"`,
      },
    ],
    hints: [
      '__len__ defines behavior for len() function',
      'Store items in a dictionary',
      'sum(dict.values()) gives total of all values',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 13,
    points: 10,
  },
  {
    id: 'py-2-27',
    moduleId: 'week-02',
    slug: 'player-class',
    title: 'Game Player Class',
    description: 'Create a class for a game player.',
    instructions: `Create a \`Player\` class with:
- name, health, max_health attributes
- take_damage(amount) - reduces health, min 0
- heal(amount) - increases health, max max_health
- is_alive() - returns True if health > 0`,
    starterCode: `class Player:
    def __init__(self, name, max_health):
        # Initialize health to max_health
        pass

    def take_damage(self, amount):
        pass

    def heal(self, amount):
        pass

    def is_alive(self):
        pass`,
    solutionCode: `class Player:
    def __init__(self, name, max_health):
        self.name = name
        self.max_health = max_health
        self.health = max_health

    def take_damage(self, amount):
        self.health = max(0, self.health - amount)

    def heal(self, amount):
        self.health = min(self.max_health, self.health + amount)

    def is_alive(self):
        return self.health > 0`,
    tests: [
      {
        name: 'test_player_class',
        code: `p = Player("Hero", 100)
p.take_damage(30)
assert p.health == 70, "Health should decrease by damage amount"
p.heal(20)
assert p.health == 90, "Health should increase by heal amount"
p.take_damage(100)
assert p.health == 0, "Health should not go below 0"
assert p.is_alive() == False, "Player should not be alive at 0 health"`,
      },
    ],
    hints: [
      'Use max(0, value) to set a minimum',
      'Use min(max, value) to set a maximum',
      'min and max can be combined: max(0, min(max, value))',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'oop'],
    dayNumber: 13,
    points: 10,
  },
  {
    id: 'py-2-28',
    moduleId: 'week-02',
    slug: 'counter-class',
    title: 'Counter Class',
    description: 'Create a class that counts occurrences.',
    instructions: `Create a \`Counter\` class with:
- Internal dict to store counts
- add(item) - increments count for item
- get_count(item) - returns count or 0
- get_most_common() - returns item with highest count`,
    starterCode: `class Counter:
    def __init__(self):
        self.counts = {}

    def add(self, item):
        pass

    def get_count(self, item):
        pass

    def get_most_common(self):
        pass`,
    solutionCode: `class Counter:
    def __init__(self):
        self.counts = {}

    def add(self, item):
        self.counts[item] = self.counts.get(item, 0) + 1

    def get_count(self, item):
        return self.counts.get(item, 0)

    def get_most_common(self):
        if not self.counts:
            return None
        return max(self.counts.items(), key=lambda x: x[1])[0]`,
    tests: [
      {
        name: 'test_counter_class',
        code: `c = Counter()
c.add("apple")
c.add("banana")
c.add("apple")
assert c.get_count("apple") == 2, "Apple should be counted twice"
assert c.get_count("banana") == 1, "Banana should be counted once"
assert c.get_most_common() == "apple", "Apple should be most common"`,
      },
    ],
    hints: [
      'Use .get(key, 0) for safe dictionary access',
      'max(dict.items(), key=lambda x: x[1]) finds max by value',
      'Return None for empty counter in get_most_common',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'dictionaries'],
    dayNumber: 13,
    points: 10,
  },
  {
    id: 'py-2-29',
    moduleId: 'week-02',
    slug: 'timer-class',
    title: 'Timer Class with Context Manager',
    description: 'Create a class that can be used as a context manager.',
    instructions: `Create a \`Timer\` class with:
- Records start/end times
- __enter__ starts the timer
- __exit__ stops it and prints elapsed time
- get_elapsed() returns elapsed seconds`,
    starterCode: `import time

class Timer:
    def __init__(self):
        self.start_time = None
        self.end_time = None

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def get_elapsed(self):
        pass`,
    solutionCode: `import time

class Timer:
    def __init__(self):
        self.start_time = None
        self.end_time = None

    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        print(f"Elapsed: {self.get_elapsed():.2f}s")

    def get_elapsed(self):
        if self.start_time is None:
            return 0
        end = self.end_time or time.time()
        return end - self.start_time`,
    tests: [
      {
        name: 'test_timer_class',
        code: `import time
t = Timer()
assert t.get_elapsed() == 0, "Timer should return 0 before starting"`,
      },
    ],
    hints: [
      '__enter__ is called at the start of "with" block',
      '__exit__ is called at the end',
      'Return self from __enter__ to use in "as" clause',
      'time.time() returns current timestamp in seconds',
    ],
    difficulty: 'advanced',
    concepts: ['classes', 'oop'],
    dayNumber: 13,
    points: 10,
  },
  {
    id: 'py-2-30',
    moduleId: 'week-02',
    slug: 'deck-of-cards',
    title: 'Deck of Cards Class',
    description: 'Design a class representing a deck of playing cards.',
    instructions: `Create a \`Deck\` class with:
- Cards as list of (rank, suit) tuples
- __init__ creates 52 cards
- shuffle() shuffles the deck
- deal() removes and returns top card (None if empty)`,
    starterCode: `import random

class Deck:
    def __init__(self):
        self.cards = []
        # Create 52 cards: ranks 2-10, J, Q, K, A and 4 suits
        pass

    def shuffle(self):
        pass

    def deal(self):
        pass`,
    solutionCode: `import random

class Deck:
    def __init__(self):
        self.cards = []
        ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
        suits = ["hearts", "diamonds", "clubs", "spades"]
        for suit in suits:
            for rank in ranks:
                self.cards.append((rank, suit))

    def shuffle(self):
        random.shuffle(self.cards)

    def deal(self):
        if not self.cards:
            return None
        return self.cards.pop()`,
    tests: [
      {
        name: 'test_deck_class',
        code: `deck = Deck()
assert len(deck.cards) == 52, "Deck should have 52 cards"
card = deck.deal()
assert card is not None, "Dealing should return a card"
assert len(deck.cards) == 51, "Deck should have 51 cards after dealing"`,
      },
    ],
    hints: [
      'Use nested loops to generate all card combinations',
      'random.shuffle() shuffles a list in place',
      'list.pop() removes and returns the last item',
    ],
    difficulty: 'intermediate',
    concepts: ['classes', 'lists', 'oop'],
    dayNumber: 13,
    points: 10,
  },
];
