import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function CardDeck({ onCardFlip }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && onCardFlip) onCardFlip();
  };

  return (
    <div className="relative w-48 h-72 mx-auto cursor-pointer" style={{ perspective: '1000px' }} onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative transition-all duration-500"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Back of card */}
        <div className="absolute inset-0 bg-gradient-to-br from-blur-purple to-blur-pink rounded-xl border border-white/20 shadow-[0_0_30px_rgba(155,48,255,0.4)] flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
          <span className="font-display text-4xl text-white opacity-80">BLUR</span>
        </div>
        
        {/* Front of card */}
        <div className="absolute inset-0 bg-white text-blur-bg rounded-xl border-4 border-white flex flex-col items-center justify-center p-4" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <span className="text-4xl mb-4">🃏</span>
          <p className="font-sans font-bold text-center text-lg">Action à faire</p>
        </div>
      </motion.div>
    </div>
  );
}
