import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';
import content from '../../lib/content/fr/truth-or-shot.json';

export default function TruthOrShot() {
  const [mode, setMode] = useState(null);
  const [phase, setPhase] = useState('spin'); // 'spin', 'choice', 'action', 'vote'
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [actionType, setActionType] = useState(null);
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    startSpin();
  };

  const startSpin = () => {
    setPhase('spin');
    setCurrentCard(null);
    setActionType(null);
    let count = 0;
    const interval = setInterval(() => {
      setActivePlayer(players[count % players.length]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setActivePlayer(players[Math.floor(Math.random() * players.length)]);
        setTimeout(() => setPhase('choice'), 600);
      }
    }, 100);
  };

  const handleChoice = (type) => {
    setActionType(type);
    let items = [];
    if (mode === 'mix') {
      items = [...content[type].soft, ...content[type].hot];
    } else {
      items = content[type][mode];
    }
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setCurrentCard(randomItem);
    
    if (type === 'questions') {
      setPhase('vote');
    } else {
      setPhase('action');
    }
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-full p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-pink">VÉRITÉ OU SHOT</h2>
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
      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">VÉRITÉ OU SHOT</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {phase === 'spin' && (
            <motion.div
              key="spin"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center w-full"
            >
              <h3 className="text-white/50 mb-12 uppercase tracking-widest">Qui va jouer ?</h3>
              <div className="h-32 flex items-center justify-center">
                <span className="text-6xl font-display neon-text-purple tracking-wider">
                  {activePlayer ? activePlayer.name : '?'}
                </span>
              </div>
            </motion.div>
          )}

          {phase === 'choice' && (
            <motion.div
              key="choice"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="flex flex-col gap-6 w-full"
            >
              <h3 className="font-display text-5xl text-center text-white mb-12 uppercase">{activePlayer?.name}</h3>
              <NeonButton variant="cyan" onClick={() => handleChoice('questions')} className="py-8 text-2xl">
                VÉRITÉ
              </NeonButton>
              <NeonButton variant="pink" onClick={() => handleChoice('defis')} className="py-8 text-2xl">
                SHOT (DÉFI)
              </NeonButton>
            </motion.div>
          )}

          {(phase === 'action' || phase === 'vote') && currentCard && (
            <motion.div
              key="action"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full"
            >
              <GlassCard className={`border-2 flex flex-col justify-between min-h-[400px] ${actionType === 'questions' ? 'border-blur-cyan bg-blur-cyan/10' : 'border-blur-pink bg-blur-pink/10'}`}>
                <div className="text-center">
                  <span className={`text-sm font-sans uppercase tracking-widest px-3 py-1 rounded-full border ${actionType === 'questions' ? 'text-blur-cyan border-blur-cyan' : 'text-blur-pink border-blur-pink'}`}>
                    {actionType === 'questions' ? 'VÉRITÉ' : 'SHOT (DÉFI)'}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h3 className="font-display text-4xl mb-6 text-white text-center uppercase">{activePlayer?.name}</h3>
                  <p className="font-sans text-2xl text-center text-white/90 leading-relaxed px-2">{currentCard}</p>
                </div>
                
                {phase === 'vote' ? (
                  <div className="flex flex-col gap-4 mt-6">
                    <p className="text-center text-white/50 text-sm uppercase tracking-widest mb-2">Le groupe valide ?</p>
                    <div className="flex gap-4">
                      <NeonButton variant="cyan" onClick={startSpin} className="flex-1 text-sm py-3 px-2">HONNÊTE</NeonButton>
                      <NeonButton variant="pink" onClick={startSpin} className="flex-1 text-sm py-3 px-2">MENSONGE</NeonButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-6">
                    <NeonButton variant="purple" onClick={startSpin} className="w-full py-4">C'EST FAIT</NeonButton>
                    <button onClick={startSpin} className="text-white/50 hover:text-white text-sm uppercase tracking-wider py-2 transition-colors">
                      Refuser (Boit Double)
                    </button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
