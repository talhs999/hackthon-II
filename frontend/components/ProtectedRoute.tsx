'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * IMPORTANT: Only redirects ONCE when auth is fully initialized.
 * Does NOT redirect if already authenticated.
 *
 * This component avoids hydration mismatch by:
 * - Not using typeof window checks
 * - Always rendering the same thing on server and client initially
 * - Using state to track redirect status (client-only)
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { session, initialized } = useAuth();

  useEffect(() => {
    // Wait for auth to initialize
    if (!initialized) {
      return;
    }

    // If initialized but no session, redirect to login
    if (!session) {
      router.push('/login');
      return;
    }
  }, [initialized, session, router]);

  // While loading or not ready to render, show loading state
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (redirect will happen in useEffect)
  if (!session) {
    return null;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
