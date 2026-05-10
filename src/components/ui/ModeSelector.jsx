import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function ModeSelector({ selectedMode, onSelectMode }) {
  const modes = [
    { id: 'soft', label: 'SOFT', icon: '🌙', color: 'cyan', classes: { border: 'border-blur-cyan', bg: 'bg-blur-cyan/20', shadow: 'shadow-[0_0_15px_rgba(0,245,255,0.5)]', text: 'neon-text-cyan', gradient: 'from-blur-cyan' } },
    { id: 'mix', label: 'MIX', icon: '🎲', color: 'purple', classes: { border: 'border-blur-purple', bg: 'bg-blur-purple/20', shadow: 'shadow-[0_0_15px_rgba(155,48,255,0.5)]', text: 'neon-text-purple', gradient: 'from-blur-purple' } },
    { id: 'hot', label: 'HOT', icon: '🔥', color: 'pink', classes: { border: 'border-blur-pink', bg: 'bg-blur-pink/20', shadow: 'shadow-[0_0_15px_rgba(255,45,120,0.5)]', text: 'neon-text-pink', gradient: 'from-blur-pink' } }
  ];

  return (
    <div className="flex gap-3 justify-center items-center w-full max-w-sm mx-auto p-4">
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id;
        
        return (
          <motion.button
            key={mode.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectMode(mode.id)}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden',
              isSelected 
                ? `${mode.classes.border} ${mode.classes.bg} ${mode.classes.shadow}` 
                : 'border-white/10 bg-blur-surface'
            )}
          >
            {isSelected && (
              <motion.div 
                layoutId="mode-bg"
                className={cn('absolute inset-0 bg-gradient-to-b opacity-20 to-transparent', mode.classes.gradient)}
              />
            )}
            <span className="text-3xl mb-1 relative z-10">{mode.icon}</span>
            <span className={cn(
              'font-display tracking-widest text-lg relative z-10',
              isSelected ? mode.classes.text : 'text-white/50'
            )}>
              {mode.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
