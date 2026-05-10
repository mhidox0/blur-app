import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CountdownRing({ duration, onComplete, size = 120, strokeWidth = 8 }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const progress = timeLeft / duration;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#FF2D78"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 1, ease: "linear" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-display text-4xl text-white neon-text-pink">
        {timeLeft}
      </span>
    </div>
  );
}
