'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  // Close menus when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuPanelRef.current && !userMenuPanelRef.current.contains(event.target as Node) &&
          userMenuButtonRef.current && !userMenuButtonRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isUserMenuOpen) {
          setIsUserMenuOpen(false);
          userMenuButtonRef.current?.focus();
        } else if (isMenuOpen) {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, isUserMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);

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

  // Get user initials for avatar
  const getUserInitials = (email: string | null) => {
    if (!email) return '?';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Get avatar color based on email
  const getAvatarColor = (email: string | null) => {
    if (!email) return 'from-zinc-500 to-zinc-700';
    const colors = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-emerald-500 to-emerald-700',
      'from-amber-500 to-amber-700',
      'from-rose-500 to-rose-700',
      'from-cyan-500 to-cyan-700',
      'from-indigo-500 to-indigo-700',
      'from-pink-500 to-pink-700',
    ];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <header className="border-b border-zinc-800/50 sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            onClick={closeMenu}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-zinc-100 text-base leading-tight">SQL Mastery</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/course">Course</NavLink>
            <NavLink href="/progress">Progress</NavLink>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Week Quick Links - Desktop */}
            <div className="hidden xl:flex items-center gap-1 mr-2">
              <WeekQuickLinks />
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden lg:block">
              <AuthSection
                userEmail={userEmail}
                isLoading={isLoading}
                onLogout={handleLogout}
                isOpen={isUserMenuOpen}
                onToggle={toggleUserMenu}
                buttonRef={userMenuButtonRef}
                panelRef={userMenuPanelRef}
                getUserInitials={getUserInitials}
                getAvatarColor={getAvatarColor}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-900/50"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        userEmail={userEmail}
        isLoading={isLoading}
        onLogout={handleLogout}
        closeMenu={closeMenu}
        menuPanelRef={menuPanelRef}
        getUserInitials={getUserInitials}
        getAvatarColor={getAvatarColor}
      />
    </header>
  );
}

// ============ Subcomponents ============

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isActive = usePathname() === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'text-white bg-zinc-800 shadow-sm'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
      }`}
    >
      {children}
    </Link>
  );
}

function WeekQuickLinks() {
  const weekColors = [
    { color: 'blue', href: '/course#w1', label: '1' },
    { color: 'purple', href: '/course#w2', label: '2' },
    { color: 'emerald', href: '/course#w3', label: '3' },
    { color: 'amber', href: '/course#w4', label: '4' },
    { color: 'rose', href: '/course#w5', label: '5' },
  ];

  return (
    <>
      {weekColors.map(({ color, href, label }) => (
        <Link
          key={label}
          href={href}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${getWeekColorClass(color)}`}
          title={`Week ${label}`}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

function getWeekColorClass(color: string): string {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
  };
  return colorClasses[color] || colorClasses.blue;
}

interface AuthSectionProps {
  userEmail: string | null;
  isLoading: boolean;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  getUserInitials: (email: string | null) => string;
  getAvatarColor: (email: string | null) => string;
}

function AuthSection({
  userEmail,
  isLoading,
  onLogout,
  isOpen,
  onToggle,
  buttonRef,
  panelRef,
  getUserInitials,
  getAvatarColor,
}: AuthSectionProps) {
  if (isLoading) {
    return (
      <div className="w-36 h-10 bg-zinc-900/50 rounded-xl animate-pulse" />
    );
  }

  if (userEmail) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-xl transition-all border border-zinc-800/50 hover:border-zinc-700/50"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {/* Avatar */}
          <div className={`w-7 h-7 bg-gradient-to-br ${getAvatarColor(userEmail)} rounded-lg flex items-center justify-center shadow-sm`}>
            <span className="text-xs font-bold text-white">
              {getUserInitials(userEmail)}
            </span>
          </div>
          {/* Email */}
          <span className="text-sm text-zinc-300 max-w-[140px] truncate">
            {userEmail}
          </span>
          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden"
          >
            <div className="p-3 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Signed in as</p>
              <p className="text-sm font-medium text-zinc-200 truncate">{userEmail}</p>
            </div>
            <div className="p-1">
              <DropdownLink href="/profile" icon="user">Profile</DropdownLink>
              <DropdownLink href="/progress" icon="chart">Progress</DropdownLink>
              <DropdownLink href="/course" icon="book">Course</DropdownLink>
            </div>
            <div className="p-1 border-t border-zinc-800">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-lg shadow-blue-500/25"
      >
        Sign up
      </Link>
    </div>
  );
}

function DropdownLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  const icons: Record<string, React.ReactElement> = {
    user: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    chart: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    book: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
    >
      {icons[icon] || icons.user}
      {children}
    </Link>
  );
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  userEmail: string | null;
  isLoading: boolean;
  onLogout: () => void;
  closeMenu: () => void;
  menuPanelRef: React.RefObject<HTMLDivElement | null>;
  getUserInitials: (email: string | null) => string;
  getAvatarColor: (email: string | null) => string;
}

function MobileMenu({
  isMenuOpen,
  userEmail,
  isLoading,
  onLogout,
  closeMenu,
  menuPanelRef,
  getUserInitials,
  getAvatarColor,
}: MobileMenuProps) {
  return (
    <div
      ref={menuPanelRef}
      className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out ${
        isMenuOpen ? 'max-h-[600px] opacity-100 border-t border-zinc-800/50' : 'max-h-0 opacity-0'
      }`}
      aria-hidden={!isMenuOpen}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Main Navigation */}
        <div className="space-y-1 mb-4">
          <MobileNavLink href="/course" onClose={closeMenu}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Course
          </MobileNavLink>
          <MobileNavLink href="/progress" onClose={closeMenu}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Progress
          </MobileNavLink>
          {userEmail && (
            <MobileNavLink href="/profile" onClose={closeMenu}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </MobileNavLink>
          )}
        </div>

        {/* Week Quick Links */}
        <div className="border-t border-zinc-800/50 pt-4 mb-4">
          <p className="text-xs text-zinc-500 px-2 mb-3 font-medium uppercase tracking-wider">Quick Jump to Week</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((week) => (
              <Link
                key={week}
                href={`/course#w${week}`}
                onClick={closeMenu}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${getWeekColorClass(['blue', 'purple', 'emerald', 'amber', 'rose'][week - 1])}`}
              >
                W{week}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="border-t border-zinc-800/50 pt-4">
          {userEmail ? (
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
              <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(userEmail)} rounded-xl flex items-center justify-center shadow-sm`}>
                <span className="text-sm font-bold text-white">
                  {getUserInitials(userEmail)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{userEmail}</p>
                <p className="text-xs text-zinc-500">Signed in</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
                className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex gap-2">
              <div className="flex-1 h-11 bg-zinc-900/50 rounded-xl animate-pulse" />
              <div className="flex-1 h-11 bg-blue-600/30 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl transition-all border border-zinc-800/50"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/25"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

function MobileNavLink({ href, onClose, children }: { href: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-xl transition-all font-medium"
    >
      {children}
    </Link>
  );
}
