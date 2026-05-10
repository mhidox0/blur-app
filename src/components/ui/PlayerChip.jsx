import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function PlayerChip({ name, emoji, active = false, onClick, onRemove }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 border border-white/10',
        active ? 'bg-blur-purple/30 border-blur-purple shadow-[0_0_10px_rgba(155,48,255,0.3)]' : 'bg-blur-surface hover:bg-white/10'
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-sans font-medium text-sm truncate max-w-[80px]">{name}</span>
      {onRemove && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
