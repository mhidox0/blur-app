import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCodeDisplay from '../components/session/QRCodeDisplay';
import PlayerList from '../components/session/PlayerList';
import NeonButton from '../components/ui/NeonButton';
import { useSession } from '../hooks/useSession';

export default function SessionWait() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { session } = useSession(); // In a real app, you'd fetch or subscribe to this session

  // Simulated session data for now if not fetched properly
  const mockSession = session || {
    code,
    players: [{ name: 'Hôte' }, { name: 'Joueur 2' }]
  };

  const sessionUrl = `${window.location.origin}/lobby?action=join&code=${code}`;

  return (
    <div className="flex flex-col min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blur-purple/20 via-blur-bg to-blur-bg z-0"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="font-display text-3xl tracking-widest text-center text-white mb-8">SALLE D'ATTENTE</h2>
        
        <QRCodeDisplay url={sessionUrl} code={mockSession.code} />
        
        <div className="mt-8 flex-1">
          <h3 className="text-center text-white/50 text-sm uppercase tracking-widest mb-4">Joueurs connectés ({mockSession.players.length})</h3>
          <PlayerList players={mockSession.players} />
        </div>

        <div className="mt-auto pt-6">
          <NeonButton 
            variant="pink" 
            className="w-full" 
            onClick={() => navigate('/games')}
          >
            LANCER LES JEUX
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
