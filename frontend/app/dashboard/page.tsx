'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import TaskListAnimated from '@/components/TaskListAnimated';
import StickyChatbot from '@/components/StickyChatbot';
import FingerprintLock from '@/components/FingerprintLock';
import Footer from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';

function DashboardContent() {
  const { session, initialized } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showLock, setShowLock] = useState(true);

  // Show fingerprint lock only on first load
  useEffect(() => {
    const lockShown = localStorage.getItem('fingerprint-lock-shown');
    if (lockShown) {
      setShowLock(false);
    }
  }, []);

  const handleUnlock = () => {
    setShowLock(false);
    localStorage.setItem('fingerprint-lock-shown', 'true');
  };

  // Only render dashboard content if we have a session
  // ProtectedRoute handles the redirect if no session
  if (!initialized || !session) {
    return null;
  }

  const handleTaskCreate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Fingerprint Lock Animation */}
      <AnimatePresence>
        {showLock && <FingerprintLock onUnlock={handleUnlock} />}
      </AnimatePresence>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        {/* Welcome Section with SLOW Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome, {session.user.name || session.user.email.split('@')[0]}! 👋
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-gray-600 text-lg"
          >
            Organize and manage your tasks efficiently with AI assistance
          </motion.p>
        </motion.div>

        {/* Task Form Section with SLOW Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <TaskForm userId={session.user.id} onTaskCreate={handleTaskCreate} />
        </motion.div>

        {/* Task List Section with SLOW Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.8 }}
        >
          <TaskListAnimated userId={session.user.id} refreshTrigger={refreshTrigger} />
        </motion.div>
      </main>

      {/* Sticky Chatbot */}
      <StickyChatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
