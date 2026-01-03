'use client';

import AnimatedMessage from './AnimatedMessage';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_used?: string;
  action_taken?: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string;
}

export default function MessageList({
  messages,
  isLoading,
  error,
}: MessageListProps) {
  if (messages.length === 0 && !isLoading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            🤖
          </motion.div>
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Welcome to Task Vault</h2>
          <p className="text-gray-400 mb-6 max-w-sm">
            Your AI-powered task assistant. Ask me anything:
          </p>
          <motion.ul
            className="text-gray-500 space-y-2 max-w-sm mx-auto text-sm"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {[
              '• Remember to buy groceries',
              '• What do I need to do?',
              '• Mark groceries as done',
              '• Delete that task',
            ].map((example, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                {example}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded"
        >
          {error}
        </motion.div>
      )}

      {messages.map((message, index) => (
        <AnimatedMessage key={message.id} message={message} index={index} />
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="bg-slate-800 border border-purple-500/30 text-gray-100 px-4 py-2 rounded-lg">
            <div className="flex gap-2">
              {[0, 150, 300].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: delay / 1000,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
