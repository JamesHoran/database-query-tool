// Python Challenge Data Loader
// Using direct imports instead of import.meta.glob for webpack compatibility

import type { PythonChallenge, ProjectChallenge, PythonModule } from '@/types/python';

// Import all challenge modules directly
import * as day01Variables from '@/data/python-challenges/week-01-basics/day-01-variables';
import * as day02Conditionals from '@/data/python-challenges/week-01-basics/day-02-conditionals';
import * as day03Loops from '@/data/python-challenges/week-01-basics/day-03-loops';
import * as day04Functions from '@/data/python-challenges/week-01-basics/day-04-functions';
import * as day05Lists from '@/data/python-challenges/week-01-basics/day-05-lists';
import * as day06Dictionaries from '@/data/python-challenges/week-01-basics/day-06-dictionaries';
import * as day07Review from '@/data/python-challenges/week-01-basics/day-07-review';
import * as week02Day01 from '@/data/python-challenges/week-02-data-structures-oop/day-01-lists-advanced';
import * as week02Day02 from '@/data/python-challenges/week-02-data-structures-oop/day-02-dicts-advanced';
import * as week02Day03 from '@/data/python-challenges/week-02-data-structures-oop/day-03-tuples-sets';
import * as week02Day04 from '@/data/python-challenges/week-02-data-structures-oop/day-04-classes';
import * as week02Day05 from '@/data/python-challenges/week-02-data-structures-oop/day-05-methods';
import * as week02Day06 from '@/data/python-challenges/week-02-data-structures-oop/day-06-oop-practice';
import * as week02Day07 from '@/data/python-challenges/week-02-data-structures-oop/day-07-review';
import * as week03Project from '@/data/python-challenges/week-03-project/arithmetic-formatter';

// Type guards to check if a module has challenges property
function hasChallenges(mod: any): mod is { challenges: PythonChallenge[] } {
  return mod && Array.isArray(mod.challenges);
}

function isChallengeModule(mod: any): mod is { challenge: PythonChallenge } {
  return mod && mod.challenge && typeof mod.challenge.id === 'string';
}

// Collect all challenges
const challengeModules = [
  day01Variables,
  day02Conditionals,
  day03Loops,
  day04Functions,
  day05Lists,
  day06Dictionaries,
  day07Review,
  week02Day01,
  week02Day02,
  week02Day03,
  week02Day04,
  week02Day05,
  week02Day06,
  week02Day07,
  week03Project,
];

export function getAllChallenges(): PythonChallenge[] {
  const challenges: PythonChallenge[] = [];

  for (const mod of challengeModules) {
    if (hasChallenges(mod)) {
      challenges.push(...mod.challenges);
    } else if (isChallengeModule(mod)) {
      challenges.push(mod.challenge);
    }
  }

  // Sort by week, day, and order
  return challenges.sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) {
      return a.dayNumber - b.dayNumber;
    }
    return a.points - b.points;
  });
}

export function getChallengeBySlug(slug: string): PythonChallenge | undefined {
  const challenges = getAllChallenges();
  return challenges.find((c) => c.slug === slug);
}

export function getChallengeById(id: string): PythonChallenge | undefined {
  const challenges = getAllChallenges();
  return challenges.find((c) => c.id === id);
}

export function getChallengesByModule(moduleId: string): PythonChallenge[] {
  const challenges = getAllChallenges();
  return challenges.filter((c) => c.moduleId === moduleId);
}

export function getChallengesByWeek(weekNumber: number): PythonChallenge[] {
  const challenges = getAllChallenges();
  return challenges.filter((c) => c.dayNumber >= (weekNumber - 1) * 7 + 1 && c.dayNumber <= weekNumber * 7);
}

export function getAllModules(): PythonModule[] {
  return [
    {
      id: 'week-01',
      slug: 'week-01-basics',
      title: 'Week 1: Python Fundamentals',
      description: 'Learn the basics of Python programming including variables, conditionals, loops, functions, and data structures.',
      weekNumber: 1,
      estimatedHours: 7,
    },
    {
      id: 'week-02',
      slug: 'week-02-data-structures-oop',
      title: 'Week 2: Data Structures & OOP Essentials',
      description: 'Deep dive into lists, dictionaries, tuples, sets, and object-oriented programming with classes and methods.',
      weekNumber: 2,
      estimatedHours: 7,
    },
    {
      id: 'week-03',
      slug: 'week-03-project',
      title: 'Week 3: Portfolio Project',
      description: 'Build a complete, resume-worthy project applying all learned concepts.',
      weekNumber: 3,
      estimatedHours: 7,
    },
  ];
}

export function getModuleBySlug(slug: string): PythonModule | undefined {
  return getAllModules().find((m) => m.slug === slug);
}

export function getModuleById(id: string): PythonModule | undefined {
  return getAllModules().find((m) => m.id === id);
}

export function getChallengeSlugs(): string[] {
  return getAllChallenges().map((c) => c.slug);
}

export function getFirstChallengeSlug(): string | undefined {
  const slugs = getChallengeSlugs();
  return slugs[0];
}
