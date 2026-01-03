'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import ThemeSwitcher from './ThemeSwitcher';
import DateTime from './DateTime';

/**
 * Navbar component - displays user info, datetime, theme switcher and logout button
 * Does NOT check authentication or redirect
 * Simply displays session info if available
 */
export default function Navbar() {
  const router = useRouter();
  const { session, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-slate-900 dark:to-slate-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-2xl">📝</span>
            <h1 className="text-2xl font-bold">Todo App</h1>
          </motion.div>

          {/* DateTime Display */}
          <div className="hidden sm:block">
            <DateTime />
          </div>

          {/* Right Side Items */}
          {session && (
            <motion.div
              className="flex items-center gap-4 ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* User Info */}
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm">{session.user.name || session.user.email}</p>
                <p className="text-xs text-pink-100 dark:text-gray-300 truncate max-w-xs">{session.user.email}</p>
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                className="bg-pink-700 hover:bg-pink-800 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Mobile DateTime Display */}
        <div className="sm:hidden mt-3 flex justify-center">
          <DateTime />
        </div>
      </div>
    </nav>
  );
}
