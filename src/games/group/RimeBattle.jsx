import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import { useSession } from '../../hooks/useSession';

const STARTING_WORDS = ['Verre', 'Soir', 'Fête', 'Matin', 'Lit', 'Boire', 'Jour', 'Nuit', 'Chat', 'Chien', 'Main', 'Pain', 'Gare', 'Peur'];

export default function RimeBattle() {
  const [currentWord, setCurrentWord] = useState('');
  const [wordHistory, setWordHistory] = useState([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5000);
  const [phase, setPhase] = useState('ready'); // ready, playing, input, failed
  const [newWordInput, setNewWordInput] = useState('');
  
  const timerRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  useEffect(() => {
    setCurrentWord(STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)]);
    return () => cancelAnimationFrame(timerRef.current);
  }, []);

  const startGame = () => {
    setPhase('playing');
    setTimeRemaining(5000);
    setWordHistory([currentWord]);
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

  const handleValidHit = () => {
    if (phase !== 'playing') return;
    setPhase('input');
    cancelAnimationFrame(timerRef.current);
  };

  const submitNewWord = (e) => {
    e.preventDefault();
    if (!newWordInput.trim()) return;
    
    setCurrentWord(newWordInput.trim().toUpperCase());
    setWordHistory(prev => [...prev, newWordInput.trim().toUpperCase()]);
    setNewWordInput('');
    setActivePlayerIndex((activePlayerIndex + 1) % players.length);
    setPhase('playing');
    setTimeRemaining(5000);
  };

  const handleFail = () => {
    setPhase('failed');
    cancelAnimationFrame(timerRef.current);
  };

  const nextBattle = () => {
    setCurrentWord(STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)]);
    setWordHistory([]);
    setActivePlayerIndex(Math.floor(Math.random() * players.length));
    setPhase('ready');
  };

  const pct = (timeRemaining / 5000) * 100;

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {phase === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">RIME BATTLE</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10 relative">
        
        {phase === 'ready' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
            <p className="text-white/50 text-sm uppercase tracking-widest mb-2">Mot de départ :</p>
            <h2 className="font-display text-5xl text-center text-white mb-10 tracking-widest">{currentWord}</h2>
            
            <p className="text-white text-center mb-8 font-sans">
              Le premier joueur est : <br/>
              <span className="font-display text-2xl text-blur-purple neon-text-purple mt-2 block">{players[activePlayerIndex].name}</span>
            </p>
            
            <NeonButton variant="cyan" onClick={startGame} className="w-full py-6 text-2xl">C'EST PARTI !</NeonButton>
          </motion.div>
        )}

        {(phase === 'playing' || phase === 'input') && (
          <div className="flex flex-col items-center w-full flex-1 pt-8">
            <h2 className="font-display text-6xl text-center text-blur-cyan neon-text-cyan mb-8 uppercase break-all w-full leading-tight">
              {currentWord}
            </h2>
            
            {phase === 'playing' ? (
              <>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/20">
                  <div 
                    className="h-full bg-blur-cyan"
                    style={{ width: `${pct}%`, transition: 'width 50ms linear' }}
                  />
                </div>

                <h4 className="font-display text-3xl text-white tracking-widest text-center mb-2">
                  {players[activePlayerIndex].name}
                </h4>
                <p className="text-white/50 text-sm uppercase">Trouve une rime !</p>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <p className="text-white/70 text-center mb-4">Rime validée ! Quel était le mot ?</p>
                <form onSubmit={submitNewWord} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={newWordInput}
                    onChange={(e) => setNewWordInput(e.target.value)}
                    placeholder="Tape le mot ici..."
                    className="w-full bg-black/50 border-2 border-blur-purple rounded-xl py-4 px-6 text-white text-xl font-sans text-center focus:outline-none focus:border-blur-pink"
                    autoFocus
                  />
                  <NeonButton variant="purple" onClick={submitNewWord} type="submit" disabled={!newWordInput.trim()}>
                    CONFIRMER ET PASSER LE TOUR
                  </NeonButton>
                </form>
              </motion.div>
            )}
            
            {/* History scroll at bottom */}
            <div className="mt-auto h-32 w-full overflow-hidden flex flex-col items-center justify-end pb-4 opacity-50">
              {wordHistory.slice(-4).map((w, i) => (
                <p key={i} className="text-white font-display text-xl tracking-widest opacity-70 line-through">
                  {w}
                </p>
              ))}
            </div>
          </div>
        )}

        {phase === 'failed' && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
             <p className="font-display text-4xl text-red-500 neon-text-pink mb-4">PERDU !</p>
             <p className="font-sans text-xl text-white mb-8">
               <span className="font-bold">{players[activePlayerIndex].name}</span> n'a pas trouvé de rime en {currentWord} et boit 2 gorgées !
             </p>
          </motion.div>
        )}
      </div>

      <div className="pt-4 flex w-full max-w-sm mx-auto z-10">
        {phase === 'playing' && (
          <NeonButton variant="cyan" onClick={handleValidHit} className="w-full py-6 text-3xl h-24 rounded-2xl">
            ✓ RIME !
          </NeonButton>
        )}
        {phase === 'failed' && (
          <NeonButton variant="purple" onClick={nextBattle} className="w-full py-4 text-xl">
            NOUVEAU MOT
          </NeonButton>
        )}
      </div>
    </div>
  );
}
