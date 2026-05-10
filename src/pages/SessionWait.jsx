import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCodeDisplay from '../components/session/QRCodeDisplay';
import PlayerList from '../components/session/PlayerList';
import NeonButton from '../components/ui/NeonButton';
import { useSession } from '../hooks/useSession';

export default function SessionWait() {
  const { id: code } = useParams();
  const navigate = useNavigate();
  const { session, loadSession, isHost, updateSessionStatus, error } = useSession();

  useEffect(() => {
    if (!session && code) {
      loadSession(code);
    }
  }, [code, session]);

  useEffect(() => {
    if (session?.status === 'playing') {
      navigate('/games');
    }
  }, [session?.status, navigate]);

  const handleLaunch = () => {
    if (isHost && session) {
      updateSessionStatus(session.code, 'playing');
    }
  };

  const sessionUrl = `${window.location.origin}/lobby?action=join&code=${code}`;
  
  if (error) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center bg-blur-bg p-6">
        <p className="text-red-500 font-display text-2xl tracking-widest text-center mb-8">{error}</p>
        <NeonButton onClick={() => navigate('/')} variant="cyan">Retour à l'accueil</NeonButton>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-full items-center justify-center bg-blur-bg">
        <p className="text-white/50 animate-pulse font-display text-2xl tracking-widest">CHARGEMENT...</p>
      </div>
    );
  }

  const hostPlayer = session.players.find(p => p.is_host);

  return (
    <div className="flex flex-col min-h-full p-6 relative overflow-hidden bg-blur-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blur-purple/20 via-blur-bg to-blur-bg z-0 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full flex-1">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/')} className="text-white/50 text-sm hover:text-white transition-colors">
            ← Quitter
          </button>
          <h2 className="font-display text-2xl tracking-widest text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            SALLE D'ATTENTE
          </h2>
          <div className="w-16"></div>
        </div>
        
        <QRCodeDisplay url={sessionUrl} code={session.code} />
        
        <div className="mt-8 flex-1 flex flex-col items-center">
          <h3 className="text-center text-white/50 text-sm uppercase tracking-widest mb-4">
            Joueurs connectés ({session.players.length})
          </h3>
          <PlayerList players={session.players} />
        </div>

        <div className="mt-auto pt-10">
          {isHost ? (
            <NeonButton 
              variant="pink" 
              className="w-full py-5 text-xl" 
              onClick={handleLaunch}
              disabled={session.players.length < 2}
            >
              {session.players.length < 2 ? 'ATTENTE DE JOUEURS...' : 'LANCER LA SOIRÉE 🎉'}
            </NeonButton>
          ) : (
            <div className="text-center p-6 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-md">
              <p className="text-white/70 font-sans animate-pulse flex flex-col gap-2">
                <span>En attente de</span>
                <span className="font-bold text-white text-xl">
                  {hostPlayer?.emoji} {hostPlayer?.name || "l'hôte"}
                </span>
                <span>pour lancer la soirée...</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
