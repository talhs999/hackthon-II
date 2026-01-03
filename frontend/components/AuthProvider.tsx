'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Define types
export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

interface AuthContextType {
  session: AuthSession | null;
  signIn: (email: string, name?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global initialization flag to prevent multiple initializations
let authInitialized = false;
let pendingSession: AuthSession | null = null;

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage for existing session
        const authSession = localStorage.getItem('auth-session');
        const mockSession = localStorage.getItem('mock-session');

        const sessionData = authSession
          ? JSON.parse(authSession)
          : mockSession
          ? JSON.parse(mockSession)
          : null;

        setSession(sessionData);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Initialize immediately
    initializeAuth();
  }, []);

  const signIn = useCallback(async (email: string, name?: string, password: string = 'password') => {
    // Generate a user ID
    const userId = `user-${Math.random().toString(36).substr(2, 9)}`;

    // Generate a proper JWT token that backend can verify
    // Format: header.payload.signature
    // For demo: we'll create a simple token structure
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: userId,
      sub: userId,
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (86400 * 7) // 7 days
    }));
    // Note: Real signature would be HMAC-SHA256, but for demo we'll use a placeholder
    const signature = btoa('demo-signature');
    const token = `${header}.${payload}.${signature}`;

    const newSession: AuthSession = {
      user: {
        id: userId,
        email,
        name: name || email.split('@')[0] || 'User'
      },
      token: token
    };

    // Update local state
    setSession(newSession);
    pendingSession = newSession;

    // Persist to localStorage (safe since this is client-only)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-session', JSON.stringify(newSession));
      localStorage.setItem('mock-session', JSON.stringify(newSession));
    }
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    pendingSession = null;

    // Clear from localStorage (safe since this is client-only)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-session');
      localStorage.removeItem('mock-session');
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!session && !!session.token;
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, loading, initialized, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}