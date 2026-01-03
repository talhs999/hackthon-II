'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function DateTime() {
  const [dateTime, setDateTime] = useState<string>(() => {
    // Initialize with current date/time during first render
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return now.toLocaleDateString('en-US', options);
  });
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const formatted = now.toLocaleDateString('en-US', options);
      setDateTime(formatted);
    };

    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-lg"
      >
        🕐
      </motion.span>
      <motion.span
        key={dateTime}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {dateTime}
      </motion.span>
    </motion.div>
  );
}
