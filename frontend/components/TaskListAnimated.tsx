'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, tasksAPI } from '@/lib/api';
import TaskCard from './TaskCard';

interface TaskListProps {
  userId: string;
  refreshTrigger?: number;
}

export default function TaskListAnimated({ userId, refreshTrigger = 0 }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [userId, refreshTrigger, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksAPI.getTasks(userId, statusFilter);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with stats */}
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            📋 Your Tasks
          </motion.h2>

          {/* Progress indicator */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-purple-600">{pendingCount}</span> pending •{' '}
                <span className="font-semibold text-green-600">{completedCount}</span> done
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {completionRate}% Complete 🎯
              </div>
            </div>

            {/* Circular progress indicator */}
            <motion.div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 282.7 }}
                  animate={{ strokeDashoffset: 282.7 * (1 - completionRate / 100) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  strokeDasharray={282.7}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-600">
                {completionRate}%
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Filter buttons */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {['all', 'pending', 'completed'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter === 'all' && '📋 All'}
              {filter === 'pending' && '⏳ Pending'}
              {filter === 'completed' && '✅ Done'}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Tasks loading state */}
      {loading && (
        <motion.div
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-gray-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⏳
          </motion.div>
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </motion.div>
      )}

      {/* Tasks list */}
      {!loading && (
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              key="empty"
              className="py-12 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div className="text-5xl mb-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                ✨
              </motion.div>
              <p className="text-gray-600 text-lg font-semibold">No tasks yet</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter === 'completed'
                  ? 'Complete some tasks to see them here!'
                  : 'Create your first task to get started!'}
              </p>
            </motion.div>
          ) : (
            <motion.div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    exit: { duration: 0.2 },
                  }}
                  layout
                >
                  <TaskCard
                    task={task}
                    userId={userId}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
