import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function GlassCard({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'glass-panel rounded-2xl p-6 text-center w-full max-w-sm mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
