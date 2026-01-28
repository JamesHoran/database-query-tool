import { notFound } from 'next/navigation';
import { getChallengeById, getAllChallenges, getNextChallengeId, getPreviousChallengeId } from '@/lib/challenges';
import { ChallengePlayer } from './challenge-player';

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  const allChallenges = await getAllChallenges();
  const nextId = getNextChallengeId(id, allChallenges);
  const previousId = getPreviousChallengeId(id, allChallenges);

  return (
    <ChallengePlayer
      challenge={challenge}
      nextId={nextId}
      previousId={previousId}
      allChallenges={allChallenges}
    />
  );
}
