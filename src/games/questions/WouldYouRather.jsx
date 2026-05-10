import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeSelector from '../../components/ui/ModeSelector';
import NeonButton from '../../components/ui/NeonButton';
import { useSession } from '../../hooks/useSession';
import content from '../../lib/content/fr/would-you-rather.json';
import { Beer } from 'lucide-react';

export default function WouldYouRather() {
  const [mode, setMode] = useState(null);
  const [dilemmas, setDilemmas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [phase, setPhase] = useState('voting'); // voting, reveal
  const [voterIndex, setVoterIndex] = useState(0);
  
  const navigate = useNavigate();
  const { session } = useSession();
  const players = session?.players || [{name: "Joueur 1"}, {name: "Joueur 2"}, {name: "Joueur 3"}];

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
    let d = [];
    if (selectedMode === 'mix') {
      d = [...content.dilemmes.soft, ...content.dilemmes.hot].sort(() => Math.random() - 0.5);
    } else {
      d = [...content.dilemmes[selectedMode]].sort(() => Math.random() - 0.5);
    }
    setDilemmas(d);
    resetTurn();
  };

  const resetTurn = () => {
    setVotesA(0);
    setVotesB(0);
    setVoterIndex(0);
    setPhase('voting');
  };

  const handleVote = (choice) => {
    if (choice === 'A') setVotesA(prev => prev + 1);
    if (choice === 'B') setVotesB(prev => prev + 1);
    
    if (voterIndex + 1 < players.length) {
      setVoterIndex(voterIndex + 1);
    } else {
      setPhase('reveal');
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    resetTurn();
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-full p-6 pt-20">
        <h2 className="text-3xl font-display text-center mb-10 text-white tracking-widest neon-text-purple">TU PRÉFÈRES</h2>
        <ModeSelector selectedMode={mode} onSelectMode={handleStart} />
      </div>
    );
  }

  const currentDilemma = dilemmas[currentIndex];
  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 0;
  const pctB = totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 0;
  const isTie = votesA === votesB;

  return (
    <div className="flex flex-col min-h-full relative bg-blur-bg overflow-hidden">
      
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
        <button onClick={() => navigate('/games')} className="text-white/50 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">← Menu</button>
        <span className="font-display tracking-widest text-white/70 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">TU PRÉFÈRES</span>
        <span className="text-white/50 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">{currentIndex + 1} / {dilemmas.length}</span>
      </div>

      {phase === 'voting' && (
        <div className="absolute top-24 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-black/80 px-6 py-2 rounded-full border border-white/20">
             <p className="font-display text-xl text-white tracking-widest">
               Vote : <span className="text-blur-cyan">{players[voterIndex].name}</span>
             </p>
          </div>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="absolute top-24 inset-x-0 flex flex-col items-center z-50 pointer-events-none gap-2">
          {isTie ? (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-blur-pink/90 px-8 py-4 rounded-xl border-2 border-white shadow-[0_0_30px_rgba(255,45,120,1)]">
               <p className="font-display text-3xl text-white tracking-widest flex items-center justify-center gap-2">ÉGALITÉ <Beer size={28} /></p>
               <p className="font-sans text-white text-center mt-2">Tout le monde boit !</p>
             </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-black/80 px-8 py-4 rounded-xl border border-white/20 backdrop-blur-md text-center">
              <p className="font-display text-2xl text-white tracking-widest">LA MINORITÉ BOIT !</p>
              <p className="font-sans text-white/70 mt-1">
                Ceux qui ont voté {votesA < votesB ? 'en HAUT' : 'en BAS'} boivent 2 gorgées.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Split Screen Layout */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* OPTION A */}
        <motion.div 
          className="flex-1 relative bg-blur-purple/20 flex flex-col items-center justify-center p-8 cursor-pointer group"
          onClick={() => phase === 'voting' && handleVote('A')}
          whileTap={phase === 'voting' ? { scale: 0.98 } : {}}
        >
          {phase === 'reveal' && (
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: `${pctA}%` }} 
              className="absolute bottom-0 inset-x-0 bg-blur-purple/40 z-0"
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
          <div className="z-10 flex flex-col items-center pointer-events-none">
            {phase === 'reveal' && <span className="font-display text-5xl text-white mb-4 drop-shadow-md">{pctA}%</span>}
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-white text-center leading-tight drop-shadow-lg">
              {currentDilemma.A}
            </h3>
          </div>
          {phase === 'voting' && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-0" />}
        </motion.div>

        {/* Divider */}
        <div className="h-2 w-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white font-display text-xl rounded-full w-12 h-12 flex items-center justify-center border-2 border-white">
            OU
          </div>
        </div>

        {/* OPTION B */}
        <motion.div 
          className="flex-1 relative bg-blur-pink/20 flex flex-col items-center justify-center p-8 cursor-pointer group"
          onClick={() => phase === 'voting' && handleVote('B')}
          whileTap={phase === 'voting' ? { scale: 0.98 } : {}}
        >
          {phase === 'reveal' && (
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: `${pctB}%` }} 
              className="absolute top-0 inset-x-0 bg-blur-pink/40 z-0"
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
          <div className="z-10 flex flex-col items-center pointer-events-none">
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-white text-center leading-tight drop-shadow-lg">
              {currentDilemma.B}
            </h3>
            {phase === 'reveal' && <span className="font-display text-5xl text-white mt-4 drop-shadow-md">{pctB}%</span>}
          </div>
          {phase === 'voting' && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-0" />}
        </motion.div>

      </div>

      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="absolute bottom-6 inset-x-6 z-50"
          >
            <NeonButton variant="cyan" onClick={nextQuestion} className="w-full py-4 text-xl shadow-xl">
              DILEMME SUIVANT
            </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
