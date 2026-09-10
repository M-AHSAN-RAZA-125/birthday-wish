import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotation: number;
}

interface FloatingHeartsProps {
  count?: number;
  interactive?: boolean;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 12 }) => {
  const particles = useMemo<HeartParticle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 8 + (i * 85) % 84, // percentage
      size: 10 + (i % 4) * 4, // 10px to 22px
      duration: 7 + (i % 5) * 1.5,
      delay: (i * 0.8) % 6,
      opacity: 0.15 + (i % 3) * 0.1,
      rotation: -15 + (i % 7) * 5
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-rose-400"
          style={{
            left: `${p.x}%`,
            bottom: '-20px',
            opacity: p.opacity
          }}
          animate={{
            y: [0, -850],
            x: [0, Math.sin(p.id) * 25, 0],
            rotate: [p.rotation, p.rotation + 20, p.rotation - 10],
            opacity: [0, p.opacity, p.opacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut'
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="filter drop-shadow-xs"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
