import { Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

export default function Settings() {
  const navigate = useNavigate();

  const handleClearData = () => {
    if (window.confirm("Es-tu sûr de vouloir supprimer tous les pseudos et données de session ?")) {
      localStorage.clear();
      alert("Données réinitialisées.");
      navigate('/');
    }
  }

  const handleInstall = () => {
    alert("Pour installer l'app, utilisez le bouton de partage de votre navigateur puis 'Sur l'écran d'accueil'.");
  }

  return (
    <div className="flex flex-col min-h-full p-6 pt-12 relative bg-blur-bg">
      <div className="flex justify-between items-center mb-10 z-10">
        <button onClick={() => navigate(-1)} className="text-white/50 text-sm hover:text-white transition-colors">← Retour</button>
        <span className="font-display tracking-widest text-white/70">PARAMÈTRES</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col gap-6 w-full max-w-sm mx-auto z-10">
        
        <GlassCard className="p-6">
          <h3 className="font-display text-xl text-white mb-4 tracking-widest border-b border-white/10 pb-2">Général</h3>
          
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-white font-sans">Langue de l'app</span>
            <div className="flex gap-2">
              <button className="bg-blur-cyan text-black px-3 py-1 rounded-md text-sm font-bold">FR</button>
              <button className="bg-white/10 text-white/50 px-3 py-1 rounded-md text-sm">EN</button>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <span className="text-white font-sans">Sons & Effets</span>
            <div className="w-12 h-6 bg-blur-purple rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-xl text-white mb-4 tracking-widest border-b border-white/10 pb-2">Données</h3>
          <button 
            onClick={handleClearData}
            className="w-full text-left py-3 text-red-400 font-sans hover:text-red-300 transition-colors"
          >
            Réinitialiser les pseudos & session
          </button>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-xl text-white mb-4 tracking-widest border-b border-white/10 pb-2">Application</h3>
          <button 
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 font-sans transition-colors mb-4"
          >
            Installer BLUR (PWA) <Smartphone size={18} />
          </button>
          
          <div className="text-center mt-6">
            <p className="text-white/30 text-xs uppercase tracking-widest">Version 1.0.0</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">Made for parties</p>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
