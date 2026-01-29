'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

type CourseType = 'sql' | 'python' | null;

interface Course {
  id: CourseType;
  name: string;
  shortName: string;
  path: string;
  weeks: number;
  color: string;
  icon: React.ReactNode;
}

const courses: Record<CourseType, Course> = {
  sql: {
    id: 'sql',
    name: 'SQL Mastery',
    shortName: 'SQL',
    path: '/course',
    weeks: 5,
    color: 'blue',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6M12 9v6" />
      </svg>
    ),
  },
  python: {
    id: 'python',
    name: 'Python Mastery',
    shortName: 'Python',
    path: '/python',
    weeks: 3,
    color: 'emerald',
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
};

function getActiveCourse(pathname: string): CourseType {
  if (pathname.startsWith('/python')) return 'python';
  if (pathname.startsWith('/course') || pathname.startsWith('/challenge')) return 'sql';
  return null;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const activeCourse = getActiveCourse(pathname);
  const currentCourse = activeCourse ? courses[activeCourse] : null;

  // Fetch user session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        setUserEmail(session?.user?.email || null);
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const weekColors = currentCourse?.id === 'sql'
    ? [
        { color: 'blue', label: 'W1' },
        { color: 'purple', label: 'W2' },
        { color: 'emerald', label: 'W3' },
        { color: 'amber', label: 'W4' },
        { color: 'rose', label: 'W5' },
      ]
    : currentCourse?.id === 'python'
    ? [
        { color: 'blue', label: 'W1' },
        { color: 'purple', label: 'W2' },
        { color: 'emerald', label: 'W3' },
      ]
    : [];

  return (
    <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {currentCourse ? (
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              <div className={currentCourse.id === 'python'
                ? 'w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20'
                : 'w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20'
              }>
                {currentCourse.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-zinc-100 text-sm sm:text-base leading-tight">{currentCourse.name}</span>
                <span className="text-[10px] sm:text-xs text-zinc-500">{currentCourse.shortName} Course</span>
              </div>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-zinc-100 text-sm sm:text-base leading-tight">CodeMastery</span>
                <span className="text-[10px] sm:text-xs text-zinc-500">Learn SQL & Python</span>
              </div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {currentCourse ? (
              <>
                <NavLink href={currentCourse.path}>Course</NavLink>
                <WeekNav weeks={currentCourse.weeks} basePath={currentCourse.path} />
                <NavLink href="/progress">Progress</NavLink>
              </>
            ) : (
              <>
                <CourseSelector />
                <NavLink href="/progress">Progress</NavLink>
              </>
            )}
            <AuthButtons
              userEmail={userEmail}
              isLoading={isLoading}
              onLogout={handleLogout}
            />
            {userEmail && <NavLink href="/profile">Profile</NavLink>}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-900/50"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                aria-hidden="true"
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}
                aria-hidden="true"
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuPanelRef}
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100 border-t border-zinc-800' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          {/* Course Selection on Home */}
          {!currentCourse && (
            <div className="pb-3 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 px-4 py-1.5 mb-2 font-medium uppercase tracking-wide">Choose a Course</p>
              <Link
                href="/course"
                onClick={closeMenu}
                className="block mx-4 px-4 py-3 rounded-lg bg-blue-900/20 border border-blue-800/50 text-blue-400 hover:bg-blue-900/30 transition-colors font-medium"
              >
                SQL Course
              </Link>
              <Link
                href="/python"
                onClick={closeMenu}
                className="block mx-4 mt-2 px-4 py-3 rounded-lg bg-emerald-900/20 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/30 transition-colors font-medium"
              >
                Python Course
              </Link>
            </div>
          )}

          {/* Main Navigation */}
          {currentCourse && (
            <Link
              href={currentCourse.path}
              onClick={closeMenu}
              className="block px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors font-medium"
            >
              Course
            </Link>
          )}

          {/* Week Navigation */}
          {currentCourse && weekColors.length > 0 && (
            <div className="border-t border-zinc-800 pt-3">
              <p className="text-xs text-zinc-500 px-4 py-1.5 mb-2 font-medium uppercase tracking-wide">Weeks</p>
              <div className="flex justify-center gap-2 px-2">
                {weekColors.map(({ color, label }) => (
                  <Link
                    key={label}
                    href={`${currentCourse.path}#${label.toLowerCase()}`}
                    onClick={closeMenu}
                    className={weekColorClasses[color]}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          <Link
            href="/progress"
            onClick={closeMenu}
            className="block px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors font-medium"
          >
            Progress
          </Link>

          {/* Auth Section - Mobile */}
          <div className="border-t border-zinc-800 pt-3">
            {userEmail ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg mx-4">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-zinc-300 truncate">{userEmail}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors font-medium text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-lg text-blue-400 hover:bg-blue-900/20 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isActive = usePathname() === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'text-zinc-100 bg-zinc-900'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
      }`}
    >
      {children}
    </Link>
  );
}

function AuthButtons({
  userEmail,
  isLoading,
  onLogout,
}: {
  userEmail: string | null;
  isLoading: boolean;
  onLogout: () => void;
}) {
  if (isLoading) {
    return (
      <div className="ml-2 w-16 h-8 bg-zinc-800 animate-pulse rounded-lg" />
    );
  }

  if (userEmail) {
    return (
      <div className="ml-2 flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
          title={userEmail}
        >
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs text-zinc-300 max-w-[120px] truncate">{userEmail}</span>
        </Link>
        <button
          onClick={onLogout}
          className="px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="ml-2 flex items-center gap-1">
      <Link
        href="/login"
        className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
}

function WeekNav({ weeks, basePath }: { weeks: number; basePath: string }) {
  const getWeekColors = (numWeeks: number) => {
    const allColors = [
      { color: 'blue', label: 'W1' },
      { color: 'purple', label: 'W2' },
      { color: 'emerald', label: 'W3' },
      { color: 'amber', label: 'W4' },
      { color: 'rose', label: 'W5' },
    ];
    return allColors.slice(0, numWeeks).map(({ color, label }) => ({
      color,
      href: `${basePath}#${label.toLowerCase()}`,
      label,
    }));
  };

  const weekColors = getWeekColors(weeks);

  return (
    <div className="flex items-center gap-1 ml-4 pl-4 border-l border-zinc-800">
      {weekColors.map(({ color, href, label }) => (
        <WeekLink key={label} href={href} color={color}>
          {label}
        </WeekLink>
      ))}
    </div>
  );
}

function CourseSelector() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/course"
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
      >
        SQL
      </Link>
      <Link
        href="/python"
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
      >
        Python
      </Link>
    </div>
  );
}

function WeekLink({ href, color, children }: { href: string; color: string; children: React.ReactNode }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/20',
  };

  return (
    <Link
      href={href}
      className={`px-2 py-1 rounded-md text-xs font-bold border transition-all ${colorClasses[color]}`}
      title={`Week ${children}`}
    >
      {children}
    </Link>
  );
}

const weekColorClasses: Record<string, string> = {
  blue: 'px-3 py-2 rounded-md text-xs font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors',
  purple: 'px-3 py-2 rounded-md text-xs font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 transition-colors',
  emerald: 'px-3 py-2 rounded-md text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors',
  amber: 'px-3 py-2 rounded-md text-xs font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors',
  rose: 'px-3 py-2 rounded-md text-xs font-bold border bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 transition-colors',
};
