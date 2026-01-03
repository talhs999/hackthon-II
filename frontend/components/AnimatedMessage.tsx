'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_used?: string;
  action_taken?: string;
  timestamp: string;
}

interface AnimatedMessageProps {
  message: Message;
  index: number;
}

export default function AnimatedMessage({ message, index }: AnimatedMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Slide in animation from left (assistant) or right (user)
  const slideVariants = {
    hidden: {
      opacity: 0,
      x: message.role === 'user' ? 50 : -50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: index * 0.1, // Stagger messages
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  // Hover animation
  const hoverVariants = {
    scale: 1.02,
    transition: { duration: 0.2 },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={slideVariants}
      whileHover={hoverVariants}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        className={`max-w-md px-4 py-3 rounded-lg shadow-lg ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
            : 'bg-gradient-to-r from-slate-800 to-slate-700 text-gray-100 border border-purple-500/30'
        }`}
        layout // Animate layout changes
      >
        <p className="text-sm">{message.content}</p>

        {/* Tool usage indicator with pulse animation */}
        {message.tool_used && message.action_taken && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
            className="mt-2 pt-2 border-t border-purple-400/30 text-xs opacity-75"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block"
            >
              ✨
            </motion.span>
            <span className="font-semibold ml-1">{message.tool_used}:</span> {message.action_taken}
          </motion.div>
        )}

        {/* Timestamp */}
        <p className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </motion.div>
    </motion.div>
  );
}
