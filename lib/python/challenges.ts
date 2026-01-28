// Python Challenge Data Loader

import type { PythonChallenge, ProjectChallenge, PythonModule } from '@/types/python';

// Dynamically import challenge modules
const challengeModules = import.meta.glob('@/data/python-challenges/**/*.ts', {
  eager: true,
});

const moduleIndex = import.meta.glob('@/data/python-challenges/**/index.ts', {
  eager: true,
});

export function getAllChallenges(): PythonChallenge[] {
  const challenges: PythonChallenge[] = [];

  for (const path in challengeModules) {
    // Skip index files
    if (path.endsWith('index.ts')) {
      continue;
    }

    const module = challengeModules[path] as any;
    if (module.challenge) {
      challenges.push(module.challenge);
    } else if (module.challenges) {
      challenges.push(...module.challenges);
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
