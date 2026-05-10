import { useState, useEffect, useRef } from 'react';
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
    for (let i = 0; i < VALUES.length; i++) {
      deck.push({ suit: s, value: VALUES[i], color: (s === '♥️' || s === '♦️') ? 'text-red-500' : 'text-blur-bg' });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export default function SnapDrink() {
  const [deck, setDeck] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [snapActive, setSnapActive] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}];

  useEffect(() => {
    setDeck(createDeck());
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleFlip = () => {
    if (deck.length === 0 || snapActive || penaltyMessage) return;
    
    const newCard = deck.pop();
    const newPlayed = [newCard, ...playedCards].slice(0, 2);
    setDeck([...deck]);
    setPlayedCards(newPlayed);
    
    if (newPlayed.length === 2 && newPlayed[0].value === newPlayed[1].value) {
      setSnapActive(true);
      setTimeLeft(3);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = setTimeout(() => {
        if (snapActive) {
          setSnapActive(false);
          setPenaltyMessage("TROP TARD ! TOUT LE MONDE BOIT !");
          setTimeout(() => resetTurn(), 3000);
        }
      }, 3000);
    } else {
      setActivePlayerIndex((activePlayerIndex + 1) % players.length);
    }
  };

  const handleSnap = () => {
    if (!snapActive) return;
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    setSnapActive(false);
    
    const winner = players[activePlayerIndex].name; 
    setPenaltyMessage(`💥 ${winner} A TAPÉ EN PREMIER ! DISTRIBUE 3 GORGÉES !`);
    setTimeout(() => resetTurn(), 4000);
  };

  const resetTurn = () => {
    setPenaltyMessage(null);
    setActivePlayerIndex((activePlayerIndex + 1) % players.length);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {snapActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none bg-red-500 z-0"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">SNAP DRINK</span>
        <span className="text-white/50 text-sm">{deck.length} cartes</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        <h3 className="font-display text-3xl mb-8 text-white uppercase text-center tracking-widest text-blur-purple">
          Tour de : {players[activePlayerIndex].name}
        </h3>

        <div className="flex justify-center gap-4 w-full h-64 relative">
          <AnimatePresence>
            {playedCards.map((card, index) => (
              <motion.div
                key={`${card.value}-${card.suit}-${index}`}
                initial={{ scale: 0.8, y: index === 0 ? -100 : 0, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="w-1/2 h-full z-10"
              >
                <GlassCard className="w-full h-full flex flex-col items-center justify-center bg-white border border-white">
                  <span className={`text-4xl ${card.color} mb-2`}>{card.suit}</span>
                  <span className={`text-5xl font-bold ${card.color} font-sans`}>{card.value}</span>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-32 mt-8 flex flex-col items-center justify-center w-full relative z-20">
          <AnimatePresence>
            {penaltyMessage && (
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="font-display text-2xl tracking-widest text-center text-red-500 neon-text-pink uppercase leading-tight"
              >
                {penaltyMessage}
              </motion.p>
            )}
            
            {snapActive && !penaltyMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-full flex flex-col items-center gap-2"
              >
                <p className="text-blur-pink font-display tracking-widest animate-pulse">VITE ! ({timeLeft}s)</p>
                <motion.button
                  animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  onClick={handleSnap}
                  className="w-full py-6 bg-red-600 rounded-2xl text-white font-display text-6xl tracking-widest shadow-[0_0_50px_rgba(255,0,0,0.8)] border-4 border-white"
                >
                  SNAP 💥
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-4 z-10 max-w-sm mx-auto w-full">
        <NeonButton 
          variant="cyan" 
          onClick={handleFlip} 
          disabled={snapActive || !!penaltyMessage || deck.length === 0} 
          className="w-full py-4 text-xl"
        >
          RETOURNER
        </NeonButton>
      </div>
    </div>
  );
}
