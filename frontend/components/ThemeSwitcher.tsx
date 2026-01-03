'use client';

import { motion } from 'framer-motion';
import { useTheme, type Theme } from './ThemeProvider';
import { useState } from 'react';

const themes: { name: Theme; emoji: string; label: string; description: string }[] = [
  { name: 'light', emoji: '☀️', label: 'Light', description: 'Bright and clean' },
  { name: 'dark', emoji: '🌙', label: 'Dark', description: 'Easy on the eyes' },
  { name: 'normal', emoji: '⚪', label: 'Normal', description: 'Default style' },
  { name: 'blue', emoji: '🔵', label: 'Blue', description: 'Ocean vibes' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change theme"
      >
        <span className="text-xl">
          {themes.find((t) => t.name === theme)?.emoji || '⚪'}
        </span>
      </motion.button>

      {/* Theme Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-slate-700"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-3 space-y-1">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
              Choose Theme
            </div>

            {themes.map((t) => (
              <motion.button
                key={t.name}
                onClick={() => {
                  setTheme(t.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  theme === t.name
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg w-6">{t.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs opacity-70">{t.description}</div>
                </div>
                {theme === t.name && (
                  <motion.div
                    className="ml-auto text-blue-600 dark:text-blue-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
