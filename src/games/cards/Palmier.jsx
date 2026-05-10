import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import content from '../../lib/content/fr/palmier.json';

export default function Palmier() {
  const [mode, setMode] = useState(null);
  const [cards, setCards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const navigate = useNavigate();

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    
    let rules = [];
    if (selectedMode === 'mix') {
      rules = [...content.soft, ...content.hot].sort(() => Math.random() - 0.5);
    } else {
      rules = [...content[selectedMode]].sort(() => Math.random() - 0.5);
    }
    
    const selectedCards = Array.from({length: 10}).map((_, i) => ({
      id: i,
      rule: rules[i % rules.length],
      flipped: false
    }));
    
    setCards(selectedCards);
  };

  const handleCardClick = (index) => {
    if (cards[index].flipped) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setActiveCardIndex(index);
  };

  const closeRule = () => {
    setActiveCardIndex(null);
    if (cards.every(c => c.flipped)) {
      setTimeout(() => navigate('/games'), 1500);
    }
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-full p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-purple">LE PALMIER</h2>
        <ModeSelector selectedMode={mode} onSelectMode={handleStart} />
        <div className="mt-auto">
          <button onClick={() => navigate('/games')} className="w-full py-4 text-white/50 text-sm tracking-widest uppercase hover:text-white transition-colors">
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <div className="flex justify-between items-center mb-12 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">LE PALMIER</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start relative w-full h-full max-w-sm mx-auto pt-10">
        {/* Palmier Fan */}
        <div className="relative w-full h-64 flex items-center justify-center">
          {cards.map((card, i) => {
            const angle = (i - 4.5) * 15; // spread from -67.5 to 67.5 deg
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 150, rotate: 0 }}
                animate={{ opacity: card.flipped ? 0.2 : 1, y: 0, rotate: angle }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                onClick={() => handleCardClick(i)}
                className={`absolute origin-bottom cursor-pointer w-20 h-32 ${card.flipped ? 'pointer-events-none' : ''}`}
                style={{ zIndex: card.flipped ? 0 : 10 }}
                whileHover={{ y: -20, scale: 1.1 }}
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blur-purple to-blur-pink border border-white/30 shadow-[0_0_15px_rgba(155,48,255,0.4)] flex items-center justify-center">
                  <span className="text-white/80 font-display text-sm tracking-widest -rotate-90">BLUR</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active Rule Modal */}
        <AnimatePresence>
          {activeCardIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="absolute inset-x-0 bottom-10 z-50 flex flex-col items-center w-full"
            >
              <GlassCard className="border-blur-cyan min-h-[280px] flex flex-col justify-between w-full shadow-[0_0_40px_rgba(0,245,255,0.2)]">
                <h3 className="font-display text-3xl mb-4 text-white text-center tracking-widest neon-text-cyan">RÈGLE</h3>
                <p className="font-sans text-2xl text-center text-white/90 px-2 leading-relaxed flex-1 flex items-center justify-center font-medium">
                  {cards[activeCardIndex].rule}
                </p>
                <div className="flex gap-4 mt-8">
                  <NeonButton variant="cyan" onClick={closeRule} className="flex-1 py-4 text-sm font-bold">FAIT ✓</NeonButton>
                  <NeonButton variant="pink" onClick={closeRule} className="flex-1 py-4 text-xs">REFUSE (BOIT DOUBLE)</NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {cards.every(c => c.flipped) && activeCardIndex === null && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blur-bg/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center"
        >
           <h2 className="text-4xl font-display neon-text-purple mb-6 text-center">FIN DU JEU</h2>
        </motion.div>
      )}
    </div>
  );
}
