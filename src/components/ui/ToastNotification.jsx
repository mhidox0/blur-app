import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ToastNotification({ message, isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blur-surface backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <p className="font-sans font-medium text-white">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
