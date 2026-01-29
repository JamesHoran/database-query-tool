'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

interface Progress {
  completed_challenges: string[];
  current_challenge: string;
  started_at: string;
  last_activity: string;
}

interface ProfileData {
  profile: Profile;
  progress: Progress;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      fetchProfile();
    };

    checkAuth();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="animate-pulse">
          <div className="h-8 sm:h-10 bg-zinc-800 rounded w-1/3 mb-6"></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 mb-6">
            <div className="h-20 sm:h-24 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Error Loading Profile</h2>
          <p className="text-zinc-400 mb-4">{error || 'Failed to load profile data'}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { profile, progress } = profileData;
  const completedCount = progress.completed_challenges.length;
  const totalChallenges = 125;
  const completionRate = Math.round((completedCount / totalChallenges) * 100);
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lastActivity = new Date(progress.last_activity).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate current level based on completed challenges
  const getLevel = (completed: number): { name: string; color: string; emoji: string } => {
    if (completed < 10) return { name: 'Beginner', color: 'text-zinc-400', emoji: '🌱' };
    if (completed < 30) return { name: 'Learner', color: 'text-blue-400', emoji: '📚' };
    if (completed < 60) return { name: 'Practitioner', color: 'text-purple-400', emoji: '🔧' };
    if (completed < 100) return { name: 'Expert', color: 'text-emerald-400', emoji: '🎯' };
    return { name: 'Master', color: 'text-amber-400', emoji: '🏆' };
  };

  const level = getLevel(completedCount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2">Profile</h1>
        <p className="text-sm sm:text-base text-zinc-400">View your account details and learning progress</p>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <span className="text-3xl sm:text-4xl">
              {profile.email ? profile.email[0].toUpperCase() : '?'}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-1">
              {profile.email || 'Anonymous User'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500">
              <span>Member since {memberSince}</span>
              <span className="hidden sm:inline">•</span>
              <span>Last active {lastActivity}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Level Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">
              {level.emoji}
            </div>
            <div>
              <p className="text-xs text-zinc-500">Current Level</p>
              <p className={`text-lg font-bold ${level.color}`}>{level.name}</p>
            </div>
          </div>
        </div>

        {/* Challenges Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Completed</p>
              <p className="text-lg font-bold text-zinc-100">{completedCount} <span className="text-zinc-500">/ {totalChallenges}</span></p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Progress</p>
              <p className="text-lg font-bold text-zinc-100">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/progress"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Detailed Progress
          </Link>
          <Link
            href="/sql"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Continue Learning
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-300">Course Completion</span>
          <span className="text-sm font-bold text-zinc-100">{completionRate}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {completedCount} of {totalChallenges} challenges completed
        </p>
      </div>
    </div>
  );
}
