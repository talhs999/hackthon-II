'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const session = localStorage.getItem('auth-session');
      if (session) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Organize Your Tasks with Ease
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, responsive todo application that helps you stay productive and keep track of everything you need to do.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Task Management</h3>
            <p className="text-gray-600">
              Create, edit, and organize your tasks with a clean and intuitive interface.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is secure with JWT authentication and encrypted communications.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600">
              Access your tasks on any device with our fully responsive web application.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Built with Modern Technology
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-semibold text-gray-800">Next.js 16</p>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🐍</div>
              <p className="font-semibold text-gray-800">FastAPI</p>
              <p className="text-sm text-gray-600">Backend API</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🗄️</div>
              <p className="font-semibold text-gray-800">PostgreSQL</p>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔐</div>
              <p className="font-semibold text-gray-800">JWT Auth</p>
              <p className="text-sm text-gray-600">Authentication</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}