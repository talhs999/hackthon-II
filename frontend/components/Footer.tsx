'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 py-6 mt-12"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Main credit */}
          <motion.div
            className="text-center sm:text-left"
            whileHover={{ x: 5 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Made with ❤️ by
            </p>
            <motion.a
              href="#"
              className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
            >
              Talha Khan
            </motion.a>
          </motion.div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-300 dark:bg-gray-600 sm:block" />

          {/* Links */}
          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              Portfolio
            </motion.a>
          </motion.div>

          {/* Year */}
          <motion.div
            className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            © {currentYear} Talha Khan. All rights reserved.
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mb-3">
            Built with modern web technologies
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'FastAPI', 'SQLite'].map((tech) => (
              <motion.span
                key={tech}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 font-medium"
                whileHover={{ scale: 1.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
