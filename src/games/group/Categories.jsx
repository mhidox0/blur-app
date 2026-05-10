import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import { useSession } from '../../hooks/useSession';
import content from '../../lib/content/fr/categories.json';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5000); // in ms
  const [baseTime, setBaseTime] = useState(5000);
  const [phase, setPhase] = useState('ready'); // ready, playing, failed
  
  const timerRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  useEffect(() => {
    setCategories([...content.categories].sort(() => Math.random() - 0.5));
    return () => cancelAnimationFrame(timerRef.current);
  }, []);

  const startGame = () => {
    setPhase('playing');
    setTimeRemaining(baseTime);
    lastUpdateRef.current = Date.now();
    updateTimer();
  };

  const updateTimer = () => {
    const now = Date.now();
    const delta = now - lastUpdateRef.current;
    
    setTimeRemaining(prev => {
      const nextTime = prev - delta;
      if (nextTime <= 0) {
        handleFail();
        return 0;
      }
      return nextTime;
    });
    
    lastUpdateRef.current = now;
    if (phase === 'playing') {
      timerRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (phase === 'playing') {
      lastUpdateRef.current = Date.now();
      timerRef.current = requestAnimationFrame(updateTimer);
    }
    return () => cancelAnimationFrame(timerRef.current);
  }, [phase]);

  const handleValid = () => {
    if (phase !== 'playing') return;
    
    // decrease time by 0.5s for pressure, min 2s
    const newBaseTime = Math.max(2000, baseTime - 500);
    setBaseTime(newBaseTime);
    setTimeRemaining(newBaseTime);
    setActivePlayerIndex((activePlayerIndex + 1) % players.length);
  };

  const handleFail = () => {
    setPhase('failed');
    cancelAnimationFrame(timerRef.current);
  };

  const nextCategory = () => {
    setCurrentIndex((currentIndex + 1) % categories.length);
    setBaseTime(5000);
    setActivePlayerIndex(Math.floor(Math.random() * players.length));
    setPhase('ready');
  };

  const pct = (timeRemaining / baseTime) * 100;
  const isUrgent = timeRemaining < 2000;

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {phase === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">CATÉGORIES</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10">
        
        {phase === 'ready' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
            <h3 className="text-white/50 font-sans uppercase tracking-widest text-sm mb-2">Thème :</h3>
            <h2 className="font-display text-4xl text-center text-blur-cyan mb-12">{categories[currentIndex]}</h2>
            
            <p className="text-white text-center mb-8 font-sans">
              Le premier joueur est : <br/>
              <span className="font-display text-2xl text-blur-purple neon-text-purple mt-2 block">{players[activePlayerIndex].name}</span>
            </p>
            
            <NeonButton variant="cyan" onClick={startGame} className="w-full py-6 text-2xl">
              C'EST PARTI !
            </NeonButton>
          </motion.div>
        )}

        {phase === 'playing' && (
          <div className="flex flex-col items-center w-full">
            <h3 className="text-white/50 font-sans uppercase tracking-widest text-sm mb-2">Thème :</h3>
            <h2 className="font-display text-3xl text-center text-white mb-10">{categories[currentIndex]}</h2>
            
            {/* Custom Circular Timer */}
            <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={isUrgent ? '#FF2D78' : '#00F5FF'} 
                  strokeWidth="5" 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * pct) / 100}
                  style={{ transition: 'stroke-dashoffset 50ms linear, stroke 0.3s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`font-display text-3xl ${isUrgent ? 'text-blur-pink animate-pulse' : 'text-white'}`}>
                  {(timeRemaining / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            <h4 className="font-display text-3xl text-blur-purple neon-text-purple tracking-widest text-center mb-2">
              {players[activePlayerIndex].name}
            </h4>
            <p className="text-white/50 text-sm uppercase">C'est à toi !</p>
          </div>
        )}

        {phase === 'failed' && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
             <p className="font-display text-4xl text-red-500 neon-text-pink mb-4">TEMPS ÉCOULÉ !</p>
             <p className="font-sans text-xl text-white mb-8">
               <span className="font-bold">{players[activePlayerIndex].name}</span> a bloqué et boit 2 gorgées !
             </p>
          </motion.div>
        )}
      </div>

      <div className="mt-auto pt-6 flex w-full max-w-sm mx-auto z-10 h-28 items-end">
        {phase === 'playing' && (
          <NeonButton variant="cyan" onClick={handleValid} className="w-full py-6 text-2xl h-full rounded-2xl">
            ✓ VALIDÉ
          </NeonButton>
        )}
        {phase === 'failed' && (
          <NeonButton variant="purple" onClick={nextCategory} className="w-full py-4 text-xl">
            THÈME SUIVANT
          </NeonButton>
        )}
      </div>
    </div>
  );
}
