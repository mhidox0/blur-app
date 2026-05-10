import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';
import picoloContent from '../../lib/content/fr/picolo.json';

export default function Picolo() {
  const [mode, setMode] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const { session } = useSession();
  
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    let selectedCards = [];
    if (selectedMode === 'mix') {
      selectedCards = [...picoloContent.soft, ...picoloContent.hot].sort(() => Math.random() - 0.5);
    } else {
      selectedCards = [...picoloContent[selectedMode]].sort(() => Math.random() - 0.5);
    }
    setCards(selectedCards);
  };

  const nextCard = (dir = 1) => {
    setDirection(dir);
    setCurrentIndex(prev => prev + 1);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      nextCard(1); // Swiped right
    } else if (info.offset.x < -100) {
      nextCard(-1); // Swiped left
    }
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-screen p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-cyan">PICOLO</h2>
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-4xl font-display neon-text-purple mb-6 text-center">FIN DU JEU</h2>
        <NeonButton onClick={() => navigate('/games')} variant="purple">RETOUR</NeonButton>
      </div>
    );
  }

  const card = cards[currentIndex];
  let text = card.text;
  let activePlayer = "Tout le monde";

  if (text.includes('{player}')) {
    activePlayer = players[Math.floor(Math.random() * players.length)].name;
    text = text.replace('{player}', activePlayer);
  } else if (text.includes('{player1}') && text.includes('{player2}')) {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    activePlayer = shuffled[0].name;
    text = text.replace('{player1}', shuffled[0].name).replace('{player2}', shuffled[1]?.name || "Un joueur");
  }

  return (
    <div className="flex flex-col min-h-screen p-6 overflow-hidden bg-blur-bg">
      <div className="flex justify-between items-center mb-8 z-10 relative">
        <button onClick={() => navigate('/games')} className="text-white/50 hover:text-white transition-colors text-sm font-sans">
          ← Menu
        </button>
        <span className="font-display tracking-widest text-white/70">PICOLO</span>
        <span className="text-white/50 text-sm">{currentIndex + 1} / {cards.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-sm mx-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300, rotate: direction > 0 ? 10 : -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300, rotate: direction > 0 ? -10 : 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05 }}
            className="w-full h-96 absolute cursor-grab active:cursor-grabbing flex items-center justify-center"
          >
            <GlassCard className={`h-full w-full flex flex-col justify-between border-2 ${card.type === 'rule' ? 'border-blur-pink bg-blur-pink/10' : card.type === 'action' ? 'border-blur-purple bg-blur-purple/10' : 'border-blur-cyan bg-blur-cyan/10'}`}>
              <div className="text-center mt-4">
                <span className={`text-sm font-sans uppercase tracking-widest px-3 py-1 rounded-full border ${card.type === 'rule' ? 'text-blur-pink border-blur-pink' : card.type === 'action' ? 'text-blur-purple border-blur-purple' : 'text-blur-cyan border-blur-cyan'}`}>
                  {card.type === 'rule' ? 'RÈGLE' : card.type === 'action' ? 'ACTION' : 'GLOBAL'}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center">
                <h3 className="font-display text-4xl mb-4 text-white uppercase text-center w-full break-words px-2">{activePlayer}</h3>
                <p className="font-sans text-xl text-center text-white/90 leading-relaxed px-4">{text}</p>
              </div>

              {card.duration === 'permanent' && (
                <div className="text-center mb-4">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Règle Permanente</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-10 z-10 relative flex flex-col gap-4">
        <NeonButton variant="purple" onClick={() => nextCard(1)} className="w-full">
          CARTE SUIVANTE
        </NeonButton>
        <button onClick={() => { /* maybe handle penalty */ nextCard(-1); }} className="w-full py-3 border border-white/20 rounded-xl text-white/70 hover:bg-white/5 transition-colors font-sans text-sm uppercase tracking-wider">
          Boire à la place
        </button>
      </div>
    </div>
  );
}
