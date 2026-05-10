import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

const CATEGORIES = [
  {
    title: '🃏 CARTES',
    games: [
      { id: 'palmier', name: 'Le Palmier', desc: 'L\'éventail des punitions', players: '3-8', path: '/games/palmier' },
      { id: 'blackjack', name: 'Blackjack Drink', desc: 'Battez le dealer', players: '2-6', path: '/games/blackjack' },
      { id: 'pmu', name: 'PMU', desc: 'Faites vos jeux', players: '3-8', path: '/games/pmu' },
      { id: 'bus-driver', name: 'Bus Driver', desc: 'Traverse le bus !', players: '2-6', path: '/games/bus-driver' },
      { id: 'higher-or-lower', name: 'Higher or Lower', desc: 'Prédiction pure', players: '2-8', path: '/games/higher-or-lower' },
      { id: 'snap-drink', name: 'Snap Drink', desc: 'Réflexe de survie', players: '3-8', path: '/games/snap-drink' },
    ]
  },
  {
    title: '❓ QUESTIONS',
    games: [
      { id: 'picolo', name: 'Picolo', desc: 'Des défis sans pitié', players: '2-10', path: '/games/picolo', hot: true },
      { id: 'truth-or-shot', name: 'Vérité ou Shot', desc: 'Honnêteté ou alcool', players: '3-8', path: '/games/truth-or-shot', hot: true },
      { id: 'never-have-i-ever', name: 'Je n\'ai jamais', desc: 'Révélations chocs', players: '3-10', path: '/games/never-have-i-ever', hot: true },
      { id: 'most-likely-to', name: 'Most Likely To', desc: 'Qui est le plus ?', players: '3-10', path: '/games/most-likely-to', hot: true },
      { id: 'would-you-rather', name: 'Tu préfères', desc: 'Dilemmes impossibles', players: '2-10', path: '/games/would-you-rather', hot: true },
    ]
  },
  {
    title: '⚡ SKILL & ACTION',
    games: [
      { id: 'speed-tap', name: 'Speed Tap', desc: 'Le plus lent boit', players: '2-8', path: '/games/speed-tap' },
      { id: 'dice', name: 'Dé à boire', desc: 'Laisses faire le hasard', players: '2-8', path: '/games/dice', hot: true },
      { id: 'russian-roulette', name: 'Roulette Russe', desc: '1 verre sur 6 est fatal', players: '3-6', path: '/games/russian-roulette' },
    ]
  },
  {
    title: '🗣️ GROUPE',
    games: [
      { id: 'categories', name: 'Catégories', desc: 'Trouve vite un mot !', players: '3-10', path: '/games/categories' },
      { id: 'rime-battle', name: 'Rime Battle', desc: 'Trouve une rime', players: '3-8', path: '/games/rime-battle' },
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function GamesMenu() {
  const navigate = useNavigate();
  const [globalMode, setGlobalMode] = useState('mix'); // soft, mix, hot

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 relative bg-blur-bg pb-32">
      
      <div className="flex justify-between items-center mb-10 z-10">
        <h1 className="font-display text-4xl tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">JEUX</h1>
        <button onClick={() => navigate('/settings')} className="text-white/70 text-2xl">⚙️</button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-10 z-10 w-full max-w-sm mx-auto">
        {CATEGORIES.map((cat, i) => (
          <div key={i}>
            <h2 className="font-display text-2xl text-blur-cyan mb-4 tracking-widest border-b border-white/10 pb-2">
              {cat.title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {cat.games.map((game, j) => (
                <motion.div key={j} variants={item}>
                  <GlassCard 
                    className="p-4 cursor-pointer hover:border-blur-pink transition-colors h-full flex flex-col justify-between"
                    onClick={() => navigate(game.path)}
                  >
                    <div>
                      <h3 className="font-display text-lg text-white mb-1 leading-tight">{game.name}</h3>
                      <p className="font-sans text-xs text-white/50 mb-3">{game.desc}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full">{game.players} j</span>
                      {game.hot && globalMode === 'hot' && <span className="text-[10px] text-blur-pink border border-blur-pink px-2 py-1 rounded-full animate-pulse">HOT</span>}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Global Mode FAB */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div className="bg-black/80 p-2 rounded-full border border-white/20 backdrop-blur-md flex gap-2 pointer-events-auto shadow-2xl">
          <button 
            onClick={() => setGlobalMode('soft')}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${globalMode === 'soft' ? 'bg-white text-black font-bold' : 'text-white/50 hover:text-white'}`}
          >
            SOFT
          </button>
          <button 
            onClick={() => setGlobalMode('mix')}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${globalMode === 'mix' ? 'bg-blur-purple text-white font-bold' : 'text-white/50 hover:text-white'}`}
          >
            MIX
          </button>
          <button 
            onClick={() => setGlobalMode('hot')}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${globalMode === 'hot' ? 'bg-blur-pink text-white font-bold' : 'text-white/50 hover:text-white'}`}
          >
            HOT
          </button>
        </div>
      </div>

    </div>
  );
}
