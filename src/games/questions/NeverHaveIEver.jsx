import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import content from '../../lib/content/fr/never-have-i-ever.json';
import { Beer } from 'lucide-react';

export default function NeverHaveIEver() {
  const [mode, setMode] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drankCount, setDrankCount] = useState(0);
  const navigate = useNavigate();

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    let selectedCards = [];
    if (selectedMode === 'mix') {
      selectedCards = [...content.phrases.soft, ...content.phrases.hot].sort(() => Math.random() - 0.5);
    } else {
      selectedCards = [...content.phrases[selectedMode]].sort(() => Math.random() - 0.5);
    }
    setCards(selectedCards);
    setDrankCount(0);
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    setDrankCount(0);
  };

  const handleDrink = () => {
    setDrankCount(prev => prev + 1);
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-full p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-purple">JE N'AI JAMAIS</h2>
        <ModeSelector selectedMode={mode} onSelectMode={handleStart} />
        <div className="mt-auto">
          <button onClick={() => navigate('/games')} className="w-full py-4 text-white/50 text-sm tracking-widest uppercase hover:text-white transition-colors">
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6">
        <h2 className="text-4xl font-display neon-text-purple mb-6 text-center">FIN DU JEU</h2>
        <NeonButton onClick={() => navigate('/games')} variant="purple">RETOUR</NeonButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">JE N'AI JAMAIS</span>
        <span className="text-white/50 text-sm">{currentIndex + 1} / {cards.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full"
          >
            <GlassCard className="border-2 border-blur-purple bg-blur-purple/10 min-h-[300px] flex flex-col justify-center">
              <h3 className="font-display text-3xl mb-8 text-white text-center tracking-widest neon-text-purple">JE N'AI JAMAIS...</h3>
              <p className="font-sans text-2xl text-center text-white/90 font-medium leading-relaxed px-2">
                ...{cards[currentIndex].replace("Je n'ai jamais ", "")}
              </p>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-6 w-full max-w-sm mx-auto z-10">
        <div className="text-center h-28 flex flex-col items-center justify-end">
          <AnimatePresence>
            {drankCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-4 font-display text-2xl text-blur-pink tracking-widest neon-text-pink"
              >
                {drankCount} {drankCount > 1 ? 'JOUEURS BOIVENT' : 'JOUEUR BOIT'}
              </motion.p>
            )}
          </AnimatePresence>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDrink}
            className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full py-4 px-8 font-sans font-medium text-lg text-white transition-colors w-full shadow-lg flex items-center justify-center gap-2"
          >
            Je l'ai fait <Beer size={20} />
          </motion.button>
        </div>

        <NeonButton variant="purple" onClick={nextCard} className="w-full mt-2">
          CARTE SUIVANTE
        </NeonButton>
      </div>
    </div>
  );
}
