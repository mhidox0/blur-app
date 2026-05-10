import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';
import { Zap } from 'lucide-react';

export default function SpeedTap() {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [phase, setPhase] = useState('ready'); // 'ready', 'waiting', 'target', 'result', 'leaderboard'
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [results, setResults] = useState([]);
  const [falseStart, setFalseStart] = useState(false);
  
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleStart = () => {
    setPhase('waiting');
    setFalseStart(false);
    
    // Random wait between 1.5s and 4.5s
    const delay = Math.random() * 3000 + 1500;
    
    timerRef.current = setTimeout(() => {
      setTargetPos({
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 70 + 15}%`
      });
      setPhase('target');
      setStartTime(Date.now());
    }, delay);
  };

  const handleScreenTap = () => {
    if (phase === 'waiting') {
      clearTimeout(timerRef.current);
      setFalseStart(true);
      setReactionTime(9999); // Penalty
      setPhase('result');
    }
  };

  const handleTargetTap = (e) => {
    e.stopPropagation();
    if (phase !== 'target') return;
    const time = Date.now() - startTime;
    setReactionTime(time);
    setPhase('result');
  };

  const handleNextPlayer = () => {
    const newResults = [...results, { name: players[activePlayerIndex].name, time: reactionTime }];
    setResults(newResults);
    
    if (activePlayerIndex + 1 < players.length) {
      setActivePlayerIndex(activePlayerIndex + 1);
      setPhase('ready');
    } else {
      setPhase('leaderboard');
    }
  };

  const getSortedResults = () => {
    return [...results].sort((a, b) => a.time - b.time);
  };

  const resetGame = () => {
    setResults([]);
    setActivePlayerIndex(0);
    setPhase('ready');
  };

  return (
    <div 
      className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden"
      onClick={handleScreenTap}
    >
      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">SPEED TAP</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        
        {phase === 'ready' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
            <h3 className="font-display text-4xl mb-4 text-white uppercase text-center tracking-widest text-blur-cyan">
              {players[activePlayerIndex].name}
            </h3>
            <p className="text-white/70 text-center mb-12 font-sans">
              Prépare-toi à taper sur la cible dès qu'elle apparaît. Ne tape pas trop tôt !
            </p>
            <NeonButton variant="cyan" onClick={handleStart} className="w-full py-6 text-2xl">
              PRÊT !
            </NeonButton>
          </motion.div>
        )}

        {phase === 'waiting' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center w-full h-full absolute inset-0"
          >
            <p className="font-display text-5xl text-white/50 tracking-widest animate-pulse">ATTENDS...</p>
          </motion.div>
        )}

        {phase === 'target' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleTargetTap}
            className="absolute w-24 h-24 rounded-full bg-blur-pink border-4 border-white shadow-[0_0_30px_rgba(255,45,120,0.8)] z-50 flex items-center justify-center focus:outline-none"
            style={{ top: targetPos.top, left: targetPos.left, transform: 'translate(-50%, -50%)' }}
          >
            <Zap size={48} className="text-white" fill="currentColor" />
          </motion.button>
        )}

        {phase === 'result' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
            <GlassCard className={`border-2 ${falseStart ? 'border-red-500 bg-red-500/10' : 'border-blur-cyan bg-blur-cyan/10'}`}>
              <h3 className="font-display text-3xl mb-4 text-white text-center">{players[activePlayerIndex].name}</h3>
              
              {falseStart ? (
                <div className="text-center">
                  <p className="font-display text-4xl text-red-500 neon-text-pink mb-2">FAUX DÉPART !</p>
                  <p className="font-sans text-white/70">Pénalité maximale.</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-display text-5xl text-blur-cyan neon-text-cyan mb-2">{reactionTime} ms</p>
                  <p className="font-sans text-white/70">Temps de réaction</p>
                </div>
              )}
            </GlassCard>
            
            <NeonButton variant="purple" onClick={handleNextPlayer} className="w-full mt-12 py-4">
              {activePlayerIndex + 1 < players.length ? 'JOUEUR SUIVANT' : 'VOIR LE CLASSEMENT'}
            </NeonButton>
          </motion.div>
        )}

        {phase === 'leaderboard' && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center w-full h-full py-4">
            <h3 className="font-display text-4xl mb-8 text-blur-purple neon-text-purple tracking-widest text-center">CLASSEMENT</h3>
            
            <div className="flex flex-col gap-4 w-full">
              {getSortedResults().map((res, i) => (
                <GlassCard key={i} className={`flex justify-between items-center p-4 border ${i === 0 ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : i === players.length - 1 ? 'border-red-500 bg-red-500/10' : 'border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-2xl text-white/50">{i + 1}.</span>
                    <span className="font-display text-xl text-white tracking-widest">{res.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-sans font-bold ${res.time === 9999 ? 'text-red-500' : 'text-white'}`}>
                      {res.time === 9999 ? 'FAUX DÉPART' : `${res.time} ms`}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="mt-8 p-4 text-center border-t border-white/20 w-full">
              <p className="text-white/70 mb-2">Le plus lent :</p>
              <p className="font-display text-3xl text-red-500 neon-text-pink">
                {getSortedResults()[players.length - 1].name} BOIT !
              </p>
            </div>

            <NeonButton variant="cyan" onClick={resetGame} className="w-full mt-8 py-4">
              REJOUER
            </NeonButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
