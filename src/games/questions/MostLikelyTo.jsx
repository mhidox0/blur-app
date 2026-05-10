import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import GlassCard from '../../components/ui/GlassCard';
import { useSession } from '../../hooks/useSession';
import content from '../../lib/content/fr/most-likely-to.json';

export default function MostLikelyTo() {
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [phase, setPhase] = useState('voting'); // voting, reveal
  const [votingPlayerIndex, setVotingPlayerIndex] = useState(0);
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    let q = [];
    if (selectedMode === 'mix') {
      q = [...content.questions.soft, ...content.questions.hot].sort(() => Math.random() - 0.5);
    } else {
      q = [...content.questions[selectedMode]].sort(() => Math.random() - 0.5);
    }
    setQuestions(q);
    resetVotes();
  };

  const resetVotes = () => {
    const initialVotes = {};
    players.forEach(p => initialVotes[p.name] = 0);
    setVotes(initialVotes);
    setVotingPlayerIndex(0);
    setPhase('voting');
  };

  const handleVote = (playerName) => {
    setVotes(prev => ({...prev, [playerName]: prev[playerName] + 1}));
    
    if (votingPlayerIndex + 1 < players.length) {
      setVotingPlayerIndex(votingPlayerIndex + 1);
    } else {
      setPhase('reveal');
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    resetVotes();
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-screen p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-purple">MOST LIKELY TO</h2>
        <ModeSelector selectedMode={mode} onSelectMode={handleStart} />
      </div>
    );
  }

  const getLosers = () => {
    let max = 0;
    let losers = [];
    Object.entries(votes).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        losers = [name];
      } else if (count === max && max > 0) {
        losers.push(name);
      }
    });
    return { losers, max };
  };

  const { losers, max } = getLosers();

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-blur-bg overflow-hidden">
      <div className="flex justify-between items-center mb-8 z-10">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm">← Menu</button>
        <span className="font-display tracking-widest text-white/70 uppercase">Most Likely To</span>
        <span className="text-white/50 text-sm">{currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-w-sm mx-auto z-10">
        <GlassCard className="border-blur-cyan w-full mb-8">
          <p className="font-sans text-2xl text-center text-white/90 font-medium leading-relaxed">
            {questions[currentIndex]}
          </p>
        </GlassCard>

        <AnimatePresence mode="wait">
          {phase === 'voting' ? (
            <motion.div
              key="voting"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full flex flex-col items-center"
            >
              <h4 className="text-blur-purple font-display text-2xl mb-6 tracking-widest">
                Tour de : {players[votingPlayerIndex].name}
              </h4>
              <p className="text-white/50 text-sm uppercase tracking-widest mb-6">Vote secrètement :</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                {players.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleVote(p.name)}
                    className="py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-sans transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="font-display text-4xl neon-text-purple mb-8">RÉSULTATS</h3>
              <div className="flex flex-col gap-3 w-full mb-8">
                {Object.entries(votes).sort((a,b) => b[1] - a[1]).map(([name, count], i) => (
                  <motion.div 
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <span className="font-sans text-white text-lg">{name}</span>
                    <span className="font-display text-2xl text-blur-cyan">{count}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: Object.keys(votes).length * 0.2 + 0.5, type: 'spring' }}
                className="text-center w-full"
              >
                <div className="py-6 rounded-2xl bg-blur-pink/20 border-2 border-blur-pink shadow-[0_0_30px_rgba(255,45,120,0.5)]">
                  <p className="font-display text-2xl text-white mb-2">
                    {losers.join(' & ')}
                  </p>
                  <p className="font-display text-4xl neon-text-pink text-blur-pink">
                    BOIT {max} GORGÉES !
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-6 w-full max-w-sm mx-auto z-10">
        {phase === 'reveal' && (
          <NeonButton variant="cyan" onClick={nextQuestion} className="w-full">
            QUESTION SUIVANTE
          </NeonButton>
        )}
      </div>
    </div>
  );
}
