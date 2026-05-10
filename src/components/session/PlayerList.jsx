import { motion, AnimatePresence } from 'framer-motion';

export default function PlayerList({ players }) {
  if (!players || players.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
      <AnimatePresence>
        {players.map((player) => (
          <motion.div
            key={player.id || player.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/5 relative overflow-hidden group"
          >
            <div className="flex items-center gap-2 z-10 truncate">
              <span className="text-2xl">{player.emoji || '👤'}</span>
              <span className="text-white font-sans text-sm font-medium truncate">{player.name}</span>
            </div>
            {player.is_host && (
              <span className="text-[10px] bg-blur-purple/30 text-blur-purple px-2 py-1 rounded-full uppercase tracking-wider font-bold z-10 border border-blur-purple/50">
                Hôte
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
