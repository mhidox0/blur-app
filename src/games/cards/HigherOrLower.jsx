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
    for (let i = 0; i < VALUES.length; i++) {
      deck.push({ suit: s, value: VALUES[i], numericValue: i + 2, color: (s === '♥️' || s === '♦️') ? 'text-red-500' : 'text-blur-bg' });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export default function HigherOrLower() {
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [message, setMessage] = useState(null);
  const [flash, setFlash] = useState(null); // 'red', 'purple', 'green'
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}];

  useEffect(() => {
    const newDeck = createDeck();
    setCurrentCard(newDeck.pop());
    setDeck(newDeck);
  }, []);

  const handleGuess = (guess) => {
    if (deck.length === 0) return;
    
    const nextCard = deck.pop();
    setDeck([...deck]);
    
    const isHigher = nextCard.numericValue > currentCard.numericValue;
    const isLower = nextCard.numericValue < currentCard.numericValue;
    const isEqual = nextCard.numericValue === currentCard.numericValue;
    
    setCurrentCard(nextCard);

    if (isEqual) {
      setFlash('purple');
      setMessage("ÉGALITÉ ! TOUT LE MONDE BOIT !");
    } else if ((guess === 'higher' && isHigher) || (guess === 'lower' && isLower)) {
      setFlash('green'); 
      setMessage("BIEN JOUÉ !");
      setTimeout(() => {
        setMessage(null);
        setFlash(null);
        setActivePlayerIndex((activePlayerIndex + 1) % players.length);
      }, 1500);
      return;
    } else {
      setFlash('red');
      setMessage(`${players[activePlayerIndex].name} BOIT 2 GORGÉES !`);
    }

    setTimeout(() => {
      setMessage(null);
      setFlash(null);
      setActivePlayerIndex((activePlayerIndex + 1) % players.length);
    }, 2500);
  };

  if (!currentCard) return null;

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 pointer-events-none z-0 ${flash === 'red' ? 'bg-red-500' : flash === 'purple' ? 'bg-blur-purple' : 'bg-green-500'}`}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 hover:text-white transition-colors text-sm">← Menu</button>
        <span className="font-display tracking-widest text-white/70">HIGHER OR LOWER</span>
        <span className="text-white/50 text-sm">{deck.length} cartes</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        <h3 className="font-display text-4xl mb-8 text-white uppercase text-center tracking-widest">
          {players[activePlayerIndex].name}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.value + currentCard.suit + deck.length}
            initial={{ scale: 0.8, x: 200, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0.8, x: -200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <GlassCard className="w-56 h-80 flex flex-col items-center justify-center bg-white border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span className={`text-7xl ${currentCard.color} mb-4`}>{currentCard.suit}</span>
              <span className={`text-8xl font-bold ${currentCard.color} font-sans`}>{currentCard.value}</span>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        <div className="h-24 mt-8 flex items-center justify-center w-full">
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={`font-display text-3xl tracking-widest text-center uppercase px-4 ${flash === 'red' ? 'text-red-500 neon-text-pink' : flash === 'purple' ? 'text-blur-purple neon-text-purple' : 'text-green-400'}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-4 z-10 max-w-sm mx-auto w-full">
        <NeonButton variant="cyan" onClick={() => handleGuess('higher')} disabled={!!message} className="flex-1 text-lg">
          PLUS HAUT ▲
        </NeonButton>
        <NeonButton variant="pink" onClick={() => handleGuess('lower')} disabled={!!message} className="flex-1 text-lg">
          PLUS BAS ▼
        </NeonButton>
      </div>
    </div>
  );
}
