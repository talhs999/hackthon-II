'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VaultContainerProps {
  children: React.ReactNode;
}

export default function VaultContainer({ children }: VaultContainerProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Trigger unlock animation after component mounts
    const timer = setTimeout(() => setIsUnlocked(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950">
      {/* Animated background gradients */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #1e1b4b 0%, #0f172a 50%)',
            'radial-gradient(circle at 80% 50%, #312e81 0%, #0f172a 50%)',
            'radial-gradient(circle at 20% 50%, #1e1b4b 0%, #0f172a 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Vault door animation */}
      <AnimatePresence>
        {!isUnlocked && (
          <>
            {/* Left door */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute top-0 left-0 w-1/2 h-full z-50"
              style={{
                background: 'linear-gradient(to right, #0f172a, #1e293b)',
                borderRight: '2px solid #8b5cf6',
                boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* Vault lock design */}
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                  className="w-24 h-24 rounded-full border-4 border-purple-500"
                >
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-purple-500 rounded-full" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right door */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute top-0 right-0 w-1/2 h-full z-50"
              style={{
                background: 'linear-gradient(to left, #0f172a, #1e293b)',
                borderLeft: '2px solid #8b5cf6',
                boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* Vault lock design */}
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                  className="w-24 h-24 rounded-full border-4 border-purple-500"
                >
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-purple-500 rounded-full" />
                </motion.div>
              </div>
            </motion.div>

            {/* Center lock indicator */}
            <motion.div
              initial={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="text-6xl">🔒</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content reveal animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isUnlocked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 h-full"
      >
        {children}
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
    </div>
  );
}
