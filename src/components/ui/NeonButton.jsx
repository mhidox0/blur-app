import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function NeonButton({ children, onClick, variant = 'purple', className, ...props }) {
  const colors = {
    purple: 'border-blur-purple text-blur-purple hover:bg-blur-purple hover:text-white shadow-[0_0_15px_rgba(155,48,255,0.5)] hover:shadow-[0_0_25px_rgba(155,48,255,0.8)]',
    pink: 'border-blur-pink text-blur-pink hover:bg-blur-pink hover:text-white shadow-[0_0_15px_rgba(255,45,120,0.5)] hover:shadow-[0_0_25px_rgba(255,45,120,0.8)]',
    cyan: 'border-blur-cyan text-blur-cyan hover:bg-blur-cyan hover:text-white shadow-[0_0_15px_rgba(0,245,255,0.5)] hover:shadow-[0_0_25px_rgba(0,245,255,0.8)]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-xl font-display text-xl uppercase tracking-wider border-2 transition-all duration-300',
        colors[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
