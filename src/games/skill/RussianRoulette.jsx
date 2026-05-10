import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import { useSession } from '../../hooks/useSession';
import { GlassWater, Droplet, Bomb } from 'lucide-react';

export default function RussianRoulette() {
  const [loadedGlass, setLoadedGlass] = useState(null);
  const [glasses, setGlasses] = useState(Array(6).fill('safe')); // 'safe', 'loaded', 'revealed-safe', 'revealed-loaded', 'counting'
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [exploded, setExploded] = useState(false);
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    setLoadedGlass(Math.floor(Math.random() * 6));
    setGlasses(Array(6).fill('hidden'));
    setExploded(false);
    setCountdown(null);
  };

  const handleSelectGlass = (index) => {
    if (glasses[index] !== 'hidden' || exploded || countdown !== null) return;
    
    // Start countdown
    let newGlasses = [...glasses];
    newGlasses[index] = 'counting';
    setGlasses(newGlasses);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        revealGlass(index);
      }
    }, 800);
  };

  const revealGlass = (index) => {
    let newGlasses = [...glasses];
    if (index === loadedGlass) {
      newGlasses[index] = 'revealed-loaded';
      setGlasses(newGlasses);
      setExploded(true);
    } else {
      newGlasses[index] = 'revealed-safe';
      setGlasses(newGlasses);
      
      // Next player
      setTimeout(() => {
        setActivePlayerIndex((activePlayerIndex + 1) % players.length);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {exploded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.8, 0.4, 0.8, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-0 mix-blend-color"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">ROULETTE RUSSE</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10">
        
        {!exploded && (
          <div className="mb-12 text-center h-20">
            <h3 className="font-display text-3xl text-white uppercase tracking-widest text-blur-cyan">
              {players[activePlayerIndex].name}
            </h3>
            <p className="text-white/50 font-sans text-sm mt-2 uppercase tracking-widest">Choisis un verre</p>
          </div>
        )}

        {exploded && (
          <div className="mb-12 text-center h-20">
            <motion.h3 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="font-display text-4xl text-red-500 neon-text-pink uppercase tracking-widest"
            >
              BOOM !
            </motion.h3>
            <p className="text-white font-sans text-lg mt-2">{players[activePlayerIndex].name} boit un shot direct !</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 w-full max-w-xs mx-auto mb-8">
          {glasses.map((status, index) => (
            <motion.button
              key={index}
              whileTap={status === 'hidden' && countdown === null ? { scale: 0.9 } : {}}
              onClick={() => handleSelectGlass(index)}
              disabled={status !== 'hidden' || countdown !== null || exploded}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300
                ${status === 'hidden' ? 'border-white/20 bg-white/5 hover:bg-white/10' : 
                  status === 'counting' ? 'border-blur-cyan bg-blur-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.5)]' :
                  status === 'revealed-safe' ? 'border-green-500/50 bg-green-500/10' :
                  status === 'revealed-loaded' ? 'border-red-500 bg-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.8)]' : ''
                }
              `}
            >
              {status === 'hidden' && <GlassWater size={40} className="opacity-50" />}
              {status === 'counting' && <span className="font-display text-5xl neon-text-cyan">{countdown}</span>}
              {status === 'revealed-safe' && <Droplet size={40} className="opacity-30 blur-[2px]" />}
              {status === 'revealed-loaded' && <Bomb size={48} className="text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,1)]" />}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 flex w-full max-w-sm mx-auto z-10">
        {exploded && (
          <NeonButton variant="purple" onClick={initGame} className="w-full py-4 text-xl">
            NOUVELLE PARTIE
          </NeonButton>
        )}
      </div>
    </div>
  );
}
