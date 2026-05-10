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
      deck.push({ suit: s, value: v, numeric: getCardValue(v), color: (s === '♥️' || s === '♦️') ? 'text-red-500' : 'text-blur-bg' });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (cards) => {
  let score = 0;
  let aces = 0;
  for (let c of cards) {
    score += c.numeric;
    if (c.value === 'A') aces += 1;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
};

export default function BlackjackDrink() {
  const [deck, setDeck] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playersState, setPlayersState] = useState([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [phase, setPhase] = useState('init'); // 'playing', 'dealer', 'results'
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}];

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const d = createDeck();
    setDealerCards([d.pop()]);
    
    const ps = players.map(p => ({
      name: p.name,
      cards: [d.pop(), d.pop()],
      status: 'playing', // 'playing', 'stood', 'bust'
      result: null
    }));
    
    setPlayersState(ps);
    setDeck(d);
    setActivePlayerIndex(0);
    setPhase('playing');
  };

  const hit = () => {
    const d = [...deck];
    const card = d.pop();
    setDeck(d);
    
    const ps = [...playersState];
    const p = ps[activePlayerIndex];
    p.cards.push(card);
    
    if (calculateScore(p.cards) > 21) {
      p.status = 'bust';
      p.result = 'bust';
    }
    
    setPlayersState(ps);
    
    if (p.status === 'bust') {
      setTimeout(() => nextPlayer(), 2000);
    }
  };

  const stand = () => {
    const ps = [...playersState];
    ps[activePlayerIndex].status = 'stood';
    setPlayersState(ps);
    nextPlayer();
  };

  const nextPlayer = () => {
    if (activePlayerIndex + 1 < playersState.length) {
      setActivePlayerIndex(activePlayerIndex + 1);
    } else {
      playDealer();
    }
  };

  const playDealer = () => {
    setPhase('dealer');
    let d = [...deck];
    let dc = [...dealerCards];
    
    // Dealer draws until 17
    while (calculateScore(dc) < 17 && d.length > 0) {
      dc.push(d.pop());
    }
    
    setDealerCards(dc);
    setDeck(d);
    
    const dealerScore = calculateScore(dc);
    const dealerBust = dealerScore > 21;
    
    const ps = [...playersState];
    for (let p of ps) {
      if (p.status === 'bust') continue;
      
      const pScore = calculateScore(p.cards);
      if (dealerBust) {
        p.result = 'win';
      } else if (pScore > dealerScore) {
        p.result = 'win';
      } else if (pScore < dealerScore) {
        p.result = 'lose';
        p.diff = Math.min(dealerScore - pScore, 5);
      } else {
        p.result = 'push';
      }
    }
    
    setPlayersState(ps);
    setTimeout(() => setPhase('results'), 2500);
  };

  const renderCard = (card, i) => (
    <motion.div
      key={`${card.value}-${card.suit}-${i}`}
      initial={{ x: 100, opacity: 0, rotate: 10 }}
      animate={{ x: 0, opacity: 1, rotate: i * 5 - 5 }}
      className={`absolute w-28 h-40 bg-white rounded-xl border border-gray-300 shadow-xl flex flex-col items-center justify-center`}
      style={{ left: `${i * 30}px`, zIndex: i }}
    >
      <span className={`text-3xl ${card.color} mb-1`}>{card.suit}</span>
      <span className={`text-4xl font-bold ${card.color} font-sans`}>{card.value}</span>
    </motion.div>
  );

  if (phase === 'init') return null;

  const activeP = playersState[activePlayerIndex];
  const dealerScore = calculateScore(dealerCards);

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <AnimatePresence>
        {activeP?.status === 'bust' && phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500 z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm hover:text-white transition-colors">← Menu</button>
        <span className="font-display tracking-widest text-white/70">BLACKJACK DRINK</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-sm mx-auto relative z-10">
        {/* Dealer Section */}
        <div className="mb-8">
          <h4 className="text-center text-white/50 uppercase tracking-widest text-sm mb-2">Dealer {phase === 'dealer' || phase === 'results' ? `(${dealerScore})` : ''}</h4>
          <div className="relative h-40 w-48 mx-auto flex justify-center">
            {dealerCards.map((c, i) => renderCard(c, i))}
            {phase === 'playing' && (
              <div className="absolute w-28 h-40 bg-gradient-to-br from-blur-purple to-blur-pink rounded-xl border border-white/20 shadow-xl" style={{ left: '30px', zIndex: 1 }} />
            )}
          </div>
        </div>

        {/* Player Section */}
        {phase === 'playing' && activeP && (
          <div className="flex-1 flex flex-col items-center mt-10">
            <h3 className="font-display text-4xl text-white mb-2 tracking-widest">{activeP.name}</h3>
            <p className="text-blur-cyan font-sans text-xl mb-6">Score: {calculateScore(activeP.cards)}</p>
            
            <div className="relative h-40 w-48 mx-auto flex justify-center mb-8">
              {activeP.cards.map((c, i) => renderCard(c, i))}
            </div>

            {activeP.status === 'bust' ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mt-8 text-center">
                <p className="font-display text-4xl neon-text-pink text-red-500">BUST !</p>
                <p className="font-sans text-white mt-2">Bois un shot direct !</p>
              </motion.div>
            ) : (
              <div className="flex gap-4 w-full mt-auto">
                <NeonButton variant="cyan" onClick={hit} className="flex-1">TIRER</NeonButton>
                <NeonButton variant="purple" onClick={stand} className="flex-1">RESTER</NeonButton>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {phase === 'results' && (
          <div className="flex-1 flex flex-col items-center mt-4 w-full overflow-y-auto hide-scrollbar pb-20">
            <h3 className="font-display text-4xl neon-text-purple mb-8">RÉSULTATS</h3>
            <div className="flex flex-col gap-4 w-full">
              {playersState.map((p, i) => (
                <GlassCard key={i} className={`border flex justify-between items-center p-4 ${p.result === 'win' ? 'border-green-500' : p.result === 'bust' || p.result === 'lose' ? 'border-red-500' : 'border-gray-500'}`}>
                  <div>
                    <p className="font-display text-2xl text-white tracking-widest">{p.name}</p>
                    <p className="text-white/50 text-sm">Score: {calculateScore(p.cards)}</p>
                  </div>
                  <div className="text-right">
                    {p.result === 'win' && <p className="text-green-400 font-bold tracking-widest">GAGNÉ</p>}
                    {p.result === 'push' && <p className="text-gray-400 font-bold tracking-widest">ÉGALITÉ</p>}
                    {p.result === 'bust' && <p className="text-red-500 font-bold tracking-widest">BUST (SHOT)</p>}
                    {p.result === 'lose' && <p className="text-red-500 font-bold tracking-widest">PERDU ({p.diff} gorgées)</p>}
                  </div>
                </GlassCard>
              ))}
            </div>
            
            <NeonButton variant="cyan" onClick={startNewRound} className="w-full mt-8">NOUVEAU ROUND</NeonButton>
          </div>
        )}
      </div>
    </div>
  );
}
