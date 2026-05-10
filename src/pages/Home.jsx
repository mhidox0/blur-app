import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../components/ui/NeonButton';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-blur-bg">
      
      {/* Background Animated Particles/Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blur-purple/20 rounded-full blur-3xl mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blur-pink/10 rounded-full blur-3xl mix-blend-screen"
        />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="z-20 w-full max-w-sm flex flex-col items-center flex-1 justify-center -mt-20">
        
        {/* BIG LOGO */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-8xl font-display text-white tracking-widest text-center mb-4"
        >
          <span className="relative inline-block">
            BLUR
            <motion.span 
              animate={{ opacity: [0.5, 1, 0.5], filter: ['blur(4px)', 'blur(10px)', 'blur(4px)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blur-cyan via-blur-purple to-blur-pink blur-md -z-10"
            >
              BLUR
            </motion.span>
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/50 font-sans tracking-[0.3em] uppercase text-sm mb-20 text-center"
        >
          La soirée commence ici.
        </motion.p>
        
        <div className="flex flex-col gap-6 w-full mt-auto mb-10">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <NeonButton onClick={() => navigate('/lobby')} variant="purple" className="w-full py-5 text-xl tracking-widest">
              NOUVELLE SOIRÉE
            </NeonButton>
          </motion.div>
          
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <button 
              onClick={() => navigate('/lobby')} 
              className="w-full py-5 border-2 border-white/20 text-white font-display text-xl tracking-widest rounded-2xl hover:bg-white/5 hover:border-white/40 transition-all shadow-lg"
            >
              REJOINDRE
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
