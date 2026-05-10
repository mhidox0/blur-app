import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../hooks/useSession';
import NeonButton from '../components/ui/NeonButton';
import PlayerList from '../components/session/PlayerList';
import JoinForm from '../components/session/JoinForm';

export default function Lobby() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'create';
  const navigate = useNavigate();
  
  const { createSession, joinSession, recentPlayers } = useSession();
  const [players, setPlayers] = useState(recentPlayers.length > 0 ? recentPlayers : []);
  const [newPlayer, setNewPlayer] = useState('');

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (newPlayer.trim() && !players.includes(newPlayer.trim()) && players.length < 12) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (players.length < 2) return;
    const session = await createSession(players);
    if (session) navigate(`/session/${session.code}`);
  };

  const handleJoin = async (code, name) => {
    await joinSession(code, name);
    navigate(`/session/${code}`);
  };

  return (
    <div className="flex flex-col min-h-full p-6">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/')} className="text-white/50 hover:text-white transition-colors">
          ← Retour
        </button>
        <h2 className="font-display text-2xl tracking-widest text-white">LOBBY</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        {action === 'create' ? (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h3 className="font-display text-4xl neon-text-purple mb-2">LES JOUEURS</h3>
              <p className="text-white/50 text-sm">Ajoute jusqu'à 12 joueurs</p>
            </div>
            
            <form onSubmit={handleAddPlayer} className="flex gap-2">
              <input
                type="text"
                placeholder="Nouveau joueur..."
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                className="flex-1 bg-blur-surface border border-white/20 rounded-xl px-4 py-3 font-sans outline-none focus:border-blur-purple transition-colors"
                maxLength={15}
              />
              <NeonButton type="submit" variant="purple" className="px-4 py-3 text-sm">
                +
              </NeonButton>
            </form>

            <PlayerList players={players} onRemovePlayer={handleRemovePlayer} />

            <div className="mt-auto pt-6">
              <NeonButton 
                variant="purple" 
                className="w-full" 
                onClick={handleCreate}
                disabled={players.length < 2}
              >
                CRÉER LA SESSION
              </NeonButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center pt-10">
            <h3 className="font-display text-4xl neon-text-cyan mb-8">REJOINDRE</h3>
            <JoinForm onJoin={handleJoin} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
