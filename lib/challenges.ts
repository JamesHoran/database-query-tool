import type { Challenge } from '@/types';

function unescapeSqlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const week1 = (await import('@/data/challenges/week-1.json')).default as any[];
    return week1.map(c => ({
      ...c,
      seedData: unescapeSqlString(c.seedData),
      difficulty: c.difficulty as Challenge['difficulty'],
    })) as Challenge[];
  } catch (err) {
    console.error('Error loading challenges:', err);
    return [];
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const challenges = await getAllChallenges();
  return challenges.find((c) => c.id === id) || null;
}

export async function getChallengesByDay(week: number, day: number): Promise<Challenge[]> {
  const challenges = await getAllChallenges();
  return challenges.filter((c) => Math.ceil(c.day / 7) === week && c.day === day);
}

export async function getChallengesByWeek(week: number): Promise<Challenge[]> {
  const challenges = await getAllChallenges();
  return challenges.filter((c) => Math.ceil(c.day / 7) === week);
}

export function getChallengePath(id: string): string {
  return `/challenge/${id}`;
}

export function getNextChallengeId(currentId: string, challenges: Challenge[]): string | undefined {
  const index = challenges.findIndex((c) => c.id === currentId);
  if (index === -1 || index === challenges.length - 1) return undefined;
  return challenges[index + 1].id;
}

export function getPreviousChallengeId(currentId: string, challenges: Challenge[]): string | undefined {
  const index = challenges.findIndex((c) => c.id === currentId);
  if (index <= 0) return undefined;
  return challenges[index - 1].id;
}
