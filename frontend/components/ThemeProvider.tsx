'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'normal' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<Theme, Record<string, string>> = {
  light: {
    '--primary': '#3b82f6',
    '--secondary': '#1e40af',
    '--accent': '#60a5fa',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f3f4f6',
    '--text-primary': '#1f2937',
    '--text-secondary': '#6b7280',
    '--border': '#e5e7eb',
  },
  dark: {
    '--primary': '#8b5cf6',
    '--secondary': '#7c3aed',
    '--accent': '#a78bfa',
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--text-primary': '#f1f5f9',
    '--text-secondary': '#cbd5e1',
    '--border': '#334155',
  },
  normal: {
    '--primary': '#6366f1',
    '--secondary': '#4f46e5',
    '--accent': '#818cf8',
    '--bg-primary': '#f8fafc',
    '--bg-secondary': '#f1f5f9',
    '--text-primary': '#1e293b',
    '--text-secondary': '#64748b',
    '--border': '#e2e8f0',
  },
  blue: {
    '--primary': '#0ea5e9',
    '--secondary': '#0284c7',
    '--accent': '#38bdf8',
    '--bg-primary': '#f0f9ff',
    '--bg-secondary': '#e0f2fe',
    '--text-primary': '#0c2d42',
    '--text-secondary': '#164e63',
    '--border': '#bae6fd',
  },
};

export function ThemeProviderComponent({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('normal');
  const [mounted, setMounted] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null;
    const initialTheme = savedTheme || 'normal';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (themeName: Theme) => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-normal', 'theme-blue');
    body.classList.remove('theme-light', 'theme-dark', 'theme-normal', 'theme-blue');

    // Add new theme class
    root.classList.add(`theme-${themeName}`);
    body.classList.add(`theme-${themeName}`);

    // Also set CSS variables as fallback
    const colors = themeColors[themeName];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProviderComponent');
  }
  return context;
}
