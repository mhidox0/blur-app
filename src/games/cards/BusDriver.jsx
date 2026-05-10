import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';

const SUITS = ['♥️', '♦️', '♣️', '♠️'];
const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

const getCardValue = (val) => {
  if (['J', 'Q', 'K'].includes(val)) return 10;
  if (val === 'A') return 11;
  return parseInt(val);
};

const createDeck = () => {
  let deck = [];
  for (let s of SUITS) {
    for (let v of VALUES) {
      deck.push({ 
        suit: s, 
        value: v, 
        numeric: getCardValue(v), 
        isRed: (s === '♥️' || s === '♦️'), 
        color: (s === '♥️' || s === '♦️') ? 'text-red-500' : 'text-blur-bg' 
      });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export default function BusDriver() {
  const [deck, setDeck] = useState([]);
  const [bus, setBus] = useState([]); // 10 cards
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to 9
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [phase, setPhase] = useState('playing'); // playing, crashed, finished
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}];

  useEffect(() => {
    initBus();
  }, []);

  const initBus = () => {
    const d = createDeck();
    const b = Array.from({length: 10}).map(() => d.pop());
    setBus(b.map(c => ({...c, flipped: false})));
    setDeck(d);
    setCurrentIndex(0);
    setPhase('playing');
    setMessage('');
  };

  const getRuleTitle = () => {
    const rules = ['ROUGE OU NOIR ?', 'PLUS HAUT OU PLUS BAS ?', 'DEDANS OU DEHORS ?', 'COULEUR ?'];
    return rules[currentIndex % 4];
  };

  const evaluateGuess = (guess, card) => {
    const ruleType = currentIndex % 4;
    
    if (ruleType === 0) { // Red or Black
      if (guess === 'red' && card.isRed) return true;
      if (guess === 'black' && !card.isRed) return true;
      return false;
    }
    
    if (ruleType === 1) { // Higher or Lower (compared to previous)
      if (currentIndex === 0) return true; // fallback, shouldn't happen
      const prev = bus[currentIndex - 1];
      if (guess === 'higher' && card.numeric > prev.numeric) return true;
      if (guess === 'lower' && card.numeric < prev.numeric) return true;
      if (card.numeric === prev.numeric) return false; // equal loses
      return false;
    }
    
    if (ruleType === 2) { // Inside or Outside (compared to previous 2)
      if (currentIndex < 2) return true;
      const prev1 = bus[currentIndex - 1].numeric;
      const prev2 = bus[currentIndex - 2].numeric;
      const high = Math.max(prev1, prev2);
      const low = Math.min(prev1, prev2);
      
      if (guess === 'inside' && card.numeric > low && card.numeric < high) return true;
      if (guess === 'outside' && (card.numeric < low || card.numeric > high)) return true;
      return false; // equal bounds loses
    }
    
    if (ruleType === 3) { // Suit
      return card.suit === guess;
    }
    
    return false;
  };

  const handleGuess = (guess) => {
    if (phase !== 'playing') return;
    
    const newBus = [...bus];
    const card = newBus[currentIndex];
    card.flipped = true;
    setBus(newBus);
    
    const isCorrect = evaluateGuess(guess, card);
    
    if (isCorrect) {
      if (currentIndex === 9) {
        setPhase('finished');
        setMessage("🎉 BUS TRAVERSÉ AVEC SUCCÈS !");
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setPhase('crashed');
      setMessage(`💥 CRASH ! BOIS ${currentIndex + 1} GORGÉES !`);
      
      setTimeout(() => {
        // Reset bus up to the point they reached? Standard rule: back to 0, replace flipped cards.
        let d = [...deck];
        let b = [...newBus];
        for (let i = 0; i <= currentIndex; i++) {
          if (d.length === 0) d = createDeck();
          b[i] = {...d.pop(), flipped: false};
        }
        setDeck(d);
        setBus(b);
        setCurrentIndex(0);
        setActivePlayerIndex((activePlayerIndex + 1) % players.length);
        setPhase('playing');
        setMessage('');
      }, 3500);
    }
  };

  const renderButtons = () => {
    const ruleType = currentIndex % 4;
    
    if (ruleType === 0) {
      return (
        <div className="flex gap-4 w-full">
          <button onClick={() => handleGuess('red')} className="flex-1 py-4 bg-red-600 rounded-xl font-display text-xl text-white">ROUGE</button>
          <button onClick={() => handleGuess('black')} className="flex-1 py-4 bg-gray-900 rounded-xl font-display text-xl text-white">NOIR</button>
        </div>
      );
    }
    if (ruleType === 1) {
      return (
        <div className="flex gap-4 w-full">
          <NeonButton variant="cyan" onClick={() => handleGuess('higher')} className="flex-1">PLUS HAUT</NeonButton>
          <NeonButton variant="pink" onClick={() => handleGuess('lower')} className="flex-1">PLUS BAS</NeonButton>
        </div>
      );
    }
    if (ruleType === 2) {
      return (
        <div className="flex gap-4 w-full">
          <NeonButton variant="purple" onClick={() => handleGuess('inside')} className="flex-1">DEDANS</NeonButton>
          <NeonButton variant="cyan" onClick={() => handleGuess('outside')} className="flex-1">DEHORS</NeonButton>
        </div>
      );
    }
    if (ruleType === 3) {
      return (
        <div className="grid grid-cols-2 gap-4 w-full">
          <button onClick={() => handleGuess('♥️')} className="py-4 bg-white rounded-xl text-red-500 text-3xl">♥️</button>
          <button onClick={() => handleGuess('♦️')} className="py-4 bg-white rounded-xl text-red-500 text-3xl">♦️</button>
          <button onClick={() => handleGuess('♣️')} className="py-4 bg-white rounded-xl text-blur-bg text-3xl">♣️</button>
          <button onClick={() => handleGuess('♠️')} className="py-4 bg-white rounded-xl text-blur-bg text-3xl">♠️</button>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {phase === 'crashed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-0 mix-blend-color"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm">← Menu</button>
        <span className="font-display tracking-widest text-white/70">LE BUS</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center z-10 w-full max-w-sm mx-auto">
        <h3 className="font-display text-3xl mb-2 text-white uppercase text-center tracking-widest">
          Chauffeur : {players[activePlayerIndex].name}
        </h3>
        
        <p className="text-white/50 font-sans text-sm mb-6 uppercase tracking-widest">Étape {currentIndex + 1}/10</p>

        {/* The Bus (Grid of 10 cards) */}
        <div className="grid grid-cols-5 gap-2 mb-8 w-full">
          {bus.map((card, i) => (
            <motion.div
              key={i}
              animate={phase === 'crashed' && i === currentIndex ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`aspect-[2/3] rounded-md flex items-center justify-center border ${i === currentIndex ? 'border-blur-cyan shadow-[0_0_15px_rgba(0,245,255,0.5)]' : 'border-white/20'}`}
              style={{ backgroundColor: card.flipped ? '#fff' : 'rgba(155,48,255,0.2)' }}
            >
              {card.flipped ? (
                <div className="flex flex-col items-center justify-center">
                  <span className={`text-xl ${card.color}`}>{card.suit}</span>
                  <span className={`text-lg font-bold ${card.color}`}>{card.value}</span>
                </div>
              ) : (
                <span className="text-[10px] text-white/30 font-display opacity-50 -rotate-45">BLUR</span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="h-20 flex items-center justify-center w-full mb-4">
          <AnimatePresence mode="wait">
            {phase === 'playing' ? (
              <motion.h4
                key="rule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-display text-3xl text-blur-cyan tracking-widest text-center"
              >
                {getRuleTitle()}
              </motion.h4>
            ) : (
              <motion.p
                key="msg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`font-display text-2xl tracking-widest text-center ${phase === 'crashed' ? 'text-red-500 neon-text-pink' : 'text-green-400 neon-text-cyan'}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-4 pb-4 flex flex-col gap-4 z-10 max-w-sm mx-auto w-full">
        {phase === 'playing' && renderButtons()}
        {phase === 'finished' && (
          <NeonButton variant="purple" onClick={initBus} className="w-full">
            NOUVEAU CHAUFFEUR
          </NeonButton>
        )}
      </div>
    </div>
  );
}
