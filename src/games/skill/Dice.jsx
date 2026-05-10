import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import content from '../../lib/content/fr/dice.json';

export default function Dice() {
  const [mode, setMode] = useState(null);
  const [rules, setRules] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'mix') {
      const mixed = [...content.soft, ...content.hot].sort(() => Math.random() - 0.5).slice(0, 6);
      setRules(mixed);
    } else {
      setRules(content[selectedMode]);
    }
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    
    // Animate numbers randomly for 1.5s
    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setResult(rules[finalValue - 1]);
        setRolling(false);
      }
    }, 100);
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-screen p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-purple">DÉ À BOIRE</h2>
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
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">DÉ À BOIRE</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10">
        
        {/* DICE DISPLAY */}
        <div className="mb-12 h-40 flex items-center justify-center">
          <motion.div
            animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
            transition={rolling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { type: "spring" }}
            className="w-32 h-32 bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center border-4 border-gray-200"
          >
            <span className="font-display text-7xl text-blur-bg">{diceValue}</span>
          </motion.div>
        </div>

        {/* RESULT */}
        <div className="h-48 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full"
              >
                <GlassCard className="border-blur-cyan">
                  <div className="text-center mb-2">
                    <span className="text-blur-cyan font-sans uppercase tracking-widest text-xs border border-blur-cyan px-2 py-1 rounded-full">Face {diceValue}</span>
                  </div>
                  <p className="font-sans text-2xl text-center text-white/90 px-2 font-medium">{result}</p>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-white/50 font-sans tracking-widest uppercase animate-pulse text-center">Appuie pour lancer le dé</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <div className="mt-auto pt-6 flex gap-4 w-full max-w-sm mx-auto z-10">
        <NeonButton variant="purple" onClick={rollDice} disabled={rolling} className="w-full py-5 text-2xl">
          LANCER
        </NeonButton>
      </div>
    </div>
  );
}
