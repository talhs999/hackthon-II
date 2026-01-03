'use client';

import { Task, TaskUpdate } from '@/lib/api';
import { tasksAPI } from '@/lib/api';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  userId: string;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

export default function TaskCard({
  task,
  userId,
  onTaskUpdate,
  onTaskDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      const updatedTask = await tasksAPI.toggleCompletion(userId, task.id);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      try {
        await tasksAPI.deleteTask(userId, task.id);
        onTaskDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    setIsLoading(true);
    try {
      const updates: TaskUpdate = {
        title: editTitle,
        description: editDescription || undefined,
      };
      const updatedTask = await tasksAPI.updateTask(userId, task.id, updates);
      onTaskUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-xl font-bold text-gray-800 border-b-2 border-indigo-500 outline-none mb-4 pb-2"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-gray-600 border border-gray-300 rounded p-2 mb-4 resize-none"
          rows={3}
          placeholder="Task description"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          } disabled:opacity-50 flex items-center justify-center`}
        >
          {task.completed && <span className="text-white text-sm">✓</span>}
        </button>

        <div className="flex-grow">
          <h3
            className={`text-lg font-semibold ${
              task.completed
                ? 'text-gray-500 line-through'
                : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span>
              Created{' '}
              {new Date(task.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {task.completed && task.completed_at && (
              <span className="text-green-600">
                Completed{' '}
                {new Date(task.completed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
