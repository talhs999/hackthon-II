'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FingerprintLockProps {
  onUnlock: () => void;
}

export default function FingerprintLock({ onUnlock }: FingerprintLockProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [locked, setLocked] = useState(true);

  // Handle space key and click to unlock
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && locked) {
        e.preventDefault();
        handleUnlock();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [locked]);

  const handleUnlock = async () => {
    setIsScanning(true);

    // Simulate scanning animation (5 seconds - much slower)
    await new Promise(resolve => setTimeout(resolve, 5000));

    setLocked(false);
    onUnlock();
  };

  if (!locked) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Fingerprint icon */}
        <motion.div
          className="relative mb-8"
          animate={isScanning ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
        >
          {/* Outer circles for scanning effect */}
          {isScanning && (
            <>
              <motion.div
                className="absolute inset-0 border-4 border-blue-400 rounded-full"
                animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  width: '200px',
                  height: '200px',
                  left: '-100px',
                  top: '-100px',
                }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-cyan-400 rounded-full"
                animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                style={{
                  width: '200px',
                  height: '200px',
                  left: '-100px',
                  top: '-100px',
                }}
              />
            </>
          )}

          {/* Fingerprint SVG */}
          <svg
            width="120"
            height="140"
            viewBox="0 0 120 140"
            className="w-32 h-40 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Fingerprint curves */}
            <motion.path
              d="M60 20 Q30 40 30 70 Q30 110 60 120 Q90 110 90 70 Q90 40 60 20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isScanning ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            />
            <motion.path
              d="M50 35 Q40 50 40 70 Q40 95 60 105 Q80 95 80 70 Q80 50 70 35"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isScanning ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            <motion.path
              d="M55 50 Q50 60 50 70 Q50 85 60 92 Q70 85 70 70 Q70 60 65 50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isScanning ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </svg>

          {/* Lock icon in center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 3.5, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
          >
            <div className="text-4xl">🔒</div>
          </motion.div>

          {/* Status text */}
          {isScanning && (
            <motion.div
              className="absolute top-full mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-blue-300 font-semibold">Scanning...</p>
              <div className="flex gap-1 justify-center mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Info text */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard Locked</h1>
          <p className="text-cyan-300 text-lg mb-6">Scan your fingerprint to unlock</p>

          {/* Instructions */}
          <motion.div
            className="bg-blue-900/40 backdrop-blur-sm border border-blue-500/50 rounded-lg p-6 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-blue-200 text-sm mb-4">
              Press <span className="font-bold bg-blue-600 px-2 py-1 rounded">SPACE</span> to scan
            </p>
            <p className="text-blue-200 text-sm">Or click the fingerprint above</p>
          </motion.div>
        </motion.div>

        {/* Unlock button */}
        <motion.button
          onClick={handleUnlock}
          className="mt-12 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isScanning ? 'Scanning...' : 'Tap to Scan'}
        </motion.button>

        {/* Keyboard hint */}
        <motion.p
          className="mt-8 text-blue-400/70 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡 Hint: Press SPACE to unlock instantly
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
