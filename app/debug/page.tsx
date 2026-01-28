'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface DebugInfo {
  session: any;
  user: any;
  profile: any;
  progress: any;
  hasTables: boolean | null;
  error: string | null;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    session: null,
    user: null,
    profile: null,
    progress: null,
    hasTables: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  async function fetchDebugInfo() {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();

      // Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Get user
      const user = session?.user || null;

      let profile = null;
      let progress = null;
      let hasTables = null;

      if (user) {
        // Try to fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        profile = profileData;

        // Check what kind of error we got
        if (profileError?.code === 'PGRST116') {
          // Table doesn't exist
          hasTables = false;
        } else if (profileError?.message?.includes('does not exist')) {
          hasTables = false;
        } else {
          hasTables = true;
        }

        // Try to fetch progress
        if (hasTables) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          progress = progressData;
        }
      }

      setDebugInfo({
        session,
        user,
        profile,
        progress,
        hasTables,
        error: null,
      });
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
      }));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">Auth Debug</h1>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-100">Auth Debug</h1>
          <button
            onClick={fetchDebugInfo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        {debugInfo.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-300 font-semibold">Error:</p>
            <p className="text-red-200 text-sm">{debugInfo.error}</p>
          </div>
        )}

        {/* Auth Status */}
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Auth Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 w-32">Logged in:</span>
              <span className={debugInfo.user ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.user ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            {debugInfo.user && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 w-32">User ID:</span>
                  <span className="text-zinc-200 font-mono text-xs">{debugInfo.user.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 w-32">Email:</span>
                  <span className="text-zinc-200">{debugInfo.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 w-32">Email Confirmed:</span>
                  <span className={debugInfo.user.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}>
                    {debugInfo.user.email_confirmed_at ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 w-32">Created at:</span>
                  <span className="text-zinc-200">{new Date(debugInfo.user.created_at).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Database Tables */}
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Database Tables</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 w-32">Tables exist:</span>
              <span className={debugInfo.hasTables === true ? 'text-green-400' : debugInfo.hasTables === false ? 'text-red-400' : 'text-zinc-500'}>
                {debugInfo.hasTables === true ? '✓ Yes' : debugInfo.hasTables === false ? '✗ No' : '? Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Profile</h2>
          {debugInfo.profile ? (
            <pre className="text-xs text-zinc-300 overflow-x-auto bg-zinc-950 p-3 rounded">
              {JSON.stringify(debugInfo.profile, null, 2)}
            </pre>
          ) : (
            <p className={debugInfo.user ? 'text-yellow-400' : 'text-zinc-500'}>
              {debugInfo.user ? '⚠ Profile not found (will be created on first API call)' : 'Not logged in'}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Progress</h2>
          {debugInfo.progress ? (
            <pre className="text-xs text-zinc-300 overflow-x-auto bg-zinc-950 p-3 rounded">
              {JSON.stringify(debugInfo.progress, null, 2)}
            </pre>
          ) : (
            <p className={debugInfo.user ? 'text-yellow-400' : 'text-zinc-500'}>
              {debugInfo.user ? '⚠ Progress not found (will be created on first API call)' : 'Not logged in'}
            </p>
          )}
        </div>

        {/* Session */}
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Raw Session Data</h2>
          <pre className="text-xs text-zinc-300 overflow-x-auto bg-zinc-950 p-3 rounded max-h-64">
            {JSON.stringify(debugInfo.session, null, 2)}
          </pre>
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Test Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              Go to Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              Go to Signup
            </a>
            <button
              onClick={async () => {
                const supabase = getSupabaseClient();
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
