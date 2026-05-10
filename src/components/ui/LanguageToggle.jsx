import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LanguageToggle() {
  const [lang, setLang] = useState('FR');

  const toggleLang = () => {
    setLang(prev => prev === 'FR' ? 'EN' : 'FR');
    // Implement global language context switch here later
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleLang}
      className="bg-blur-surface border border-white/10 rounded-full px-3 py-1 font-display tracking-widest text-sm hover:bg-white/10 transition-colors"
    >
      {lang}
    </motion.button>
  );
}
