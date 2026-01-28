import { notFound } from 'next/navigation';
import { getChallengeBySlug, getAllChallenges, getChallengeSlugs } from '@/lib/python/challenges';
import { getNextChallengeSlug, getPreviousChallengeSlug } from '@/lib/python/grader';
import { PythonPlayer } from './python-player';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const challenge = getChallengeBySlug(id);

  if (!challenge) {
    return {
      title: 'Challenge Not Found',
    };
  }

  return {
    title: `${challenge.title} | Python Mastery`,
    description: challenge.description,
  };
}

export async function generateStaticParams() {
  const challenges = getAllChallenges();
  return challenges.map((challenge) => ({
    id: challenge.slug,
  }));
}

export default async function ChallengePage({ params }: PageProps) {
  const { id } = await params;
  const challenge = getChallengeBySlug(id);

  if (!challenge) {
    notFound();
  }

  const allSlugs = getAllChallenges().map((c) => c.slug);
  const nextSlug = getNextChallengeSlug(id, allSlugs);
  const previousSlug = getPreviousChallengeSlug(id, allSlugs);
  const allChallenges = getAllChallenges();

  return (
    <PythonPlayer
      challenge={challenge}
      nextId={nextSlug}
      previousId={previousSlug}
      allChallenges={allChallenges}
    />
  );
}
