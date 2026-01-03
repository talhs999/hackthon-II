'use client';

import { motion } from 'framer-motion';

interface VaultAnimationProps {
  onComplete?: () => void;
}

export default function VaultAnimation({ onComplete }: VaultAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Vault Doors Container */}
        <div className="relative w-96 h-80 mb-8">
          {/* Left Door */}
          <motion.div
            className="absolute left-0 top-0 w-48 h-80 bg-gradient-to-r from-slate-800 to-slate-700 border-4 border-slate-600 rounded-lg"
            animate={{ rotateY: 90 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            style={{
              transformPerspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-30">
              🔒
            </div>
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="absolute right-0 top-0 w-48 h-80 bg-gradient-to-l from-slate-800 to-slate-700 border-4 border-slate-600 rounded-lg"
            animate={{ rotateY: -90 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            style={{
              transformPerspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-30">
              🔒
            </div>
          </motion.div>

          {/* Center Lock */}
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl"
            animate={{ rotate: [0, 360, 360] }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            🔑
          </motion.div>

          {/* Light burst from opened vault */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-yellow-400/0 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </div>

        {/* Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">Welcome Back!</h2>
          <motion.p
            className="text-lg text-purple-200"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Your dashboard is unlocked 🚀
          </motion.p>
        </motion.div>

        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((i / 20) * Math.PI * 2) * 200,
              y: Math.sin((i / 20) * Math.PI * 2) * 200,
              opacity: 0,
            }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
