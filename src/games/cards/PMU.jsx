import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';

const SUITS = ['♥️', '♦️', '♣️', '♠️'];
const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

const createDeck = () => {
  let deck = [];
  for (let s of SUITS) {
    for (let v of VALUES) {
      deck.push({ suit: s, value: v, isRed: (s === '♥️' || s === '♦️'), color: (s === '♥️' || s === '♦️') ? 'text-red-500' : 'text-blur-bg' });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export default function PMU() {
  const [deck, setDeck] = useState([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [betAmount, setBetAmount] = useState(1);
  const [phase, setPhase] = useState('betting'); // 'betting', 'result'
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}];

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const handleBet = (colorBet) => {
    if (deck.length === 0) setDeck(createDeck());
    
    const card = deck.pop();
    setDeck([...deck]);
    setCurrentCard(card);
    setPhase('result');
    
    const isWin = (colorBet === 'red' && card.isRed) || (colorBet === 'black' && !card.isRed);
    setWon(isWin);
    
    if (isWin) {
      setMessage(`GAGNÉ ! DISTRIBUE ${betAmount} GORGÉES.`);
    } else {
      setMessage(`PERDU ! BOIS ${betAmount} GORGÉES.`);
    }
    
    setTimeout(() => {
      setPhase('betting');
      setCurrentCard(null);
      setActivePlayerIndex((activePlayerIndex + 1) % players.length);
      setMessage('');
      setBetAmount(1);
    }, 3000);
  };

  if (deck.length === 0 && !currentCard) return null;

  const activePlayer = players[activePlayerIndex];

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 pointer-events-none z-0 ${won ? 'bg-green-500' : 'bg-red-500'}`}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">PMU</span>
        <span className="text-white/50 text-sm">{deck.length} cartes</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        <h3 className="font-display text-4xl mb-2 text-white uppercase text-center tracking-widest text-blur-purple">
          {activePlayer.name}
        </h3>
        
        {phase === 'betting' && (
          <p className="text-white/50 mb-8 uppercase tracking-widest text-sm">Fais tes jeux !</p>
        )}

        <div className="h-72 flex items-center justify-center w-full relative perspective-1000">
          <AnimatePresence mode="wait">
            {phase === 'betting' ? (
              <motion.div
                key="back"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                className="w-48 h-72 rounded-xl bg-gradient-to-br from-blur-purple to-blur-pink border border-white/20 shadow-xl flex items-center justify-center"
              >
                <span className="text-white/50 font-display text-3xl">PMU</span>
              </motion.div>
            ) : (
              <motion.div
                key="front"
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <GlassCard className="w-48 h-72 flex flex-col items-center justify-center bg-white border border-white">
                  <span className={`text-6xl ${currentCard?.color} mb-4`}>{currentCard?.suit}</span>
                  <span className={`text-7xl font-bold ${currentCard?.color} font-sans`}>{currentCard?.value}</span>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-20 mt-6 flex items-center justify-center w-full">
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`font-display text-2xl tracking-widest text-center ${won ? 'text-green-400 neon-text-cyan' : 'text-red-500 neon-text-pink'}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-6 z-10 max-w-sm mx-auto w-full">
        {phase === 'betting' && (
          <>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/50 uppercase text-xs tracking-widest">Mise (Gorgées)</span>
              <div className="flex items-center gap-4 bg-white/5 rounded-full px-6 py-2 border border-white/10">
                <button onClick={() => setBetAmount(Math.max(1, betAmount - 1))} className="text-2xl text-white/50 hover:text-white">-</button>
                <span className="font-display text-3xl text-blur-cyan w-8 text-center">{betAmount}</span>
                <button onClick={() => setBetAmount(Math.min(5, betAmount + 1))} className="text-2xl text-white/50 hover:text-white">+</button>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleBet('red')}
                className="flex-1 py-4 bg-red-600 rounded-xl font-display text-2xl tracking-widest text-white shadow-[0_0_20px_rgba(255,0,0,0.5)] border-2 border-red-400 hover:scale-105 transition-transform"
              >
                ROUGE
              </button>
              <button 
                onClick={() => handleBet('black')}
                className="flex-1 py-4 bg-gray-900 rounded-xl font-display text-2xl tracking-widest text-white shadow-[0_0_20px_rgba(0,0,0,0.8)] border-2 border-gray-500 hover:scale-105 transition-transform"
              >
                NOIR
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
