'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function InputArea({
  onSendMessage,
  isLoading,
  disabled = false,
}: InputAreaProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.5 }}
      className="bg-slate-900/80 backdrop-blur-lg border-t border-purple-500/30 shadow-2xl"
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-3">
          <motion.textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask me about your tasks..."
            disabled={disabled}
            rows={1}
            animate={{
              borderColor: isFocused ? '#8b5cf6' : '#475569',
            }}
            className="flex-1 px-4 py-3 bg-slate-800 border-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none resize-none disabled:bg-slate-900 disabled:cursor-not-allowed transition-colors"
          />
          <motion.button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/50"
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <span>↗️</span>
              </>
            )}
          </motion.button>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-xs text-gray-500 mt-2"
        >
          Press Shift+Enter for new line, Enter to send
        </motion.p>
      </div>
    </motion.div>
  );
}
