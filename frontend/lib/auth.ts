// Authentication utilities for Better Auth integration

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User;
  token: string;
}

export const authClient = {
  // Get current session from localStorage (synchronously)
  getSessionSync: (): Session | null => {
    try {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('auth-session');
        return session ? JSON.parse(session) : null;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    return null;
  },

  // Get current session from localStorage (async for compatibility)
  getSession: async (): Promise<Session | null> => {
    try {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('auth-session');
        return session ? JSON.parse(session) : null;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    return null;
  },

  // Sign in user
  signIn: async (email: string, password: string): Promise<Session> => {
    try {
      // In production, this would call your Better Auth backend endpoint
      // For now, using a mock implementation
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Sign in failed');
      }

      const data = await response.json();
      const session: Session = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        },
        token: data.token,
      };

      // Only access localStorage in browser environment (client-only)
      try {
        localStorage.setItem('auth-session', JSON.stringify(session));
      } catch (e) {
        // Silently fail if localStorage is not available (e.g., SSR)
      }

      return session;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign up new user
  signUp: async (email: string, password: string, name: string): Promise<Session> => {
    try {
      // In production, this would call your Better Auth backend endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data = await response.json();
      const session: Session = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        },
        token: data.token,
      };

      // Only access localStorage in browser environment (client-only)
      try {
        localStorage.setItem('auth-session', JSON.stringify(session));
      } catch (e) {
        // Silently fail if localStorage is not available (e.g., SSR)
      }

      return session;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign out user
  signOut: async (): Promise<void> => {
    try {
      // Only access localStorage in browser environment (client-only)
      localStorage.removeItem('auth-session');
    } catch (error) {
      // Silently fail if localStorage is not available (e.g., SSR)
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const session = await authClient.getSession();
    return !!session && !!session.token;
  },
};

export const auth = {
  // Auth instance for Better Auth
  getSession: authClient.getSession,
};