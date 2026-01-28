import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { UserProgress } from '@/types';

// Ensure profile and progress exist for the user
async function ensureUserRecord(supabase: any, userId: string) {
  // Check if profile exists, create if not
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) {
    await supabase.from('profiles').insert({
      id: userId,
      email: null, // Will be updated by trigger if it works
    });
  }

  // Check if progress exists, create if not
  const { data: progress } = await supabase
    .from('user_progress')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!progress) {
    await supabase.from('user_progress').insert({
      user_id: userId,
      completed_challenges: [],
      current_challenge: 'w1-d1-c1',
    });
  }
}

// Supabase table row type (snake_case)
interface DatabaseUserProgress {
  user_id: string;
  completed_challenges: string[];
  current_challenge: string;
  started_at: string;
  last_activity: string;
}

// GET /api/progress - Fetch user progress
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure profile and progress exist (lazy initialization)
    await ensureUserRecord(supabase, user.id);

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // If no progress found, return default progress
    if (!data) {
      return NextResponse.json({
        completedChallenges: [],
        currentChallenge: 'w1-d1-c1',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      } satisfies UserProgress);
    }

    // Convert from database format to UserProgress format
    const dbProgress = data as DatabaseUserProgress | null;
    const userProgress: UserProgress = {
      completedChallenges: dbProgress?.completed_challenges || [],
      currentChallenge: dbProgress?.current_challenge || 'w1-d1-c1',
      startedAt: dbProgress?.started_at || new Date().toISOString(),
      lastActivity: dbProgress?.last_activity || new Date().toISOString(),
    };

    return NextResponse.json(userProgress);
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update user progress
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure profile and progress exist first
    await ensureUserRecord(supabase, user.id);

    const body = await request.json();
    const { completedChallenges, currentChallenge, startedAt, lastActivity } = body;

    // Validate required fields
    if (!Array.isArray(completedChallenges)) {
      return NextResponse.json(
        { error: 'completedChallenges must be an array' },
        { status: 400 }
      );
    }

    const progressData: DatabaseUserProgress = {
      user_id: user.id,
      completed_challenges: completedChallenges,
      current_challenge: currentChallenge || 'w1-d1-c1',
      started_at: startedAt || new Date().toISOString(),
      last_activity: lastActivity || new Date().toISOString(),
    };

    // Use type assertion for the upsert
    const { data, error } = await (supabase
      .from('user_progress') as any)
      .upsert(progressData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) throw error;

    // Convert back to UserProgress format
    const dbProgress = data as DatabaseUserProgress | null;
    const userProgress: UserProgress = {
      completedChallenges: dbProgress?.completed_challenges || [],
      currentChallenge: dbProgress?.current_challenge || 'w1-d1-c1',
      startedAt: dbProgress?.started_at || new Date().toISOString(),
      lastActivity: dbProgress?.last_activity || new Date().toISOString(),
    };

    return NextResponse.json(userProgress);
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
