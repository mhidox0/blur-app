import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../hooks/useSession';
import NeonButton from '../components/ui/NeonButton';
import JoinForm from '../components/session/JoinForm';

export default function Lobby() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'create';
  const navigate = useNavigate();
  
  const { createSession, joinSession, loading, localPlayerName } = useSession();
  const [hostName, setHostName] = useState(localPlayerName || '');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    const session = await createSession(hostName.trim());
    if (session) navigate(`/session/${session.code}`);
  };

  const handleJoin = async (code, name) => {
    const session = await joinSession(code, name);
    if (session) navigate(`/session/${code}`);
  };

  return (
    <div className="flex flex-col min-h-full p-6 relative bg-blur-bg overflow-hidden">
      <div className="flex justify-between items-center mb-12 z-10">
        <button onClick={() => navigate('/')} className="text-white/50 hover:text-white transition-colors">
          ← Retour
        </button>
        <h2 className="font-display text-2xl tracking-widest text-white">LOBBY</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center items-center w-full max-w-sm mx-auto z-10"
      >
        {action === 'create' ? (
          <div className="flex flex-col gap-8 w-full">
            <div className="text-center mb-4">
              <h3 className="font-display text-5xl neon-text-purple mb-4">CRÉER</h3>
              <p className="text-white/50 text-sm tracking-widest uppercase">Nouvelle session</p>
            </div>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Ton pseudo ?"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full bg-blur-surface border border-white/20 rounded-xl px-4 py-4 text-center font-sans text-xl outline-none focus:border-blur-purple transition-colors text-white shadow-inner"
                maxLength={15}
              />

              <NeonButton 
                type="submit" 
                variant="purple" 
                className="w-full py-4 text-xl mt-4" 
                disabled={!hostName.trim() || loading}
              >
                {loading ? 'CRÉATION...' : 'GÉNÉRER LE CODE'}
              </NeonButton>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center w-full">
            <h3 className="font-display text-5xl neon-text-cyan mb-8">REJOINDRE</h3>
            <JoinForm onJoin={handleJoin} loading={loading} defaultName={localPlayerName} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
