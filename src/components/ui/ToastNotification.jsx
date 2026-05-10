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
          className="fixed top-6 inset-x-0 mx-auto w-full max-w-[390px] flex justify-center z-50 pointer-events-none px-6"
        >
          <div className="bg-blur-surface backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] px-6 py-3 rounded-full text-white font-sans text-sm flex items-center gap-3">
            <p className="font-sans font-medium text-white">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
