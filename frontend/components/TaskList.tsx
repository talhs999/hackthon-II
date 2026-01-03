'use client';

import { useState, useEffect } from 'react';
import { Task, tasksAPI } from '@/lib/api';
import TaskCard from './TaskCard';

interface TaskListProps {
  userId: string;
  refreshTrigger?: number;
}

export default function TaskList({ userId, refreshTrigger = 0 }: TaskListProps) {
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

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-indigo-600">{pendingCount}</span> pending •{' '}
            <span className="font-semibold text-green-600">{completedCount}</span> done
          </div>
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 mt-2">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">
            {statusFilter === 'all'
              ? 'No tasks yet. Create one to get started!'
              : `No ${statusFilter} tasks`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              userId={userId}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}