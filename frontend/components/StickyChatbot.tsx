'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarChat from './SidebarChat';

export default function StickyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* Sidebar Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 overflow-hidden"
          >
            <SidebarChat onClose={() => setIsOpen(false)} setUnreadCount={setUnreadCount} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Chatbot Icon Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-2xl z-50 flex items-center justify-center overflow-hidden group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(168, 85, 247, 0.7)',
            '0 0 0 10px rgba(168, 85, 247, 0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0 }}
        />

        {/* Button content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Robot emoji with animation */}
          <motion.span
            className="text-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🤖
          </motion.span>
          {unreadCount > 0 && (
            <motion.div
              className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-sm px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI Assistant
        </div>
      </motion.button>
    </>
  );
}
