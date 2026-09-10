import confetti from 'canvas-confetti';

export const triggerConfetti = (originY: number = 0.6) => {
  // Gentle romantic birthday colors: soft rose, champagne gold, peach, cream, pink
  const colors = ['#FDA4AF', '#F43F5E', '#FDE68A', '#F97316', '#FBCFE8', '#FCE7F3'];

  // Left cannon
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0.15, y: originY },
    colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 0.9,
    shapes: ['circle', 'square']
  });

  // Right cannon
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 0.85, y: originY },
    colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 0.9,
    shapes: ['circle', 'square']
  });

  // Center star burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      spread: 100,
      origin: { x: 0.5, y: originY - 0.1 },
      colors: ['#FFE4E6', '#FECDD3', '#FDE047'],
      scalar: 1.1,
      gravity: 0.8
    });
  }, 180);
};

export const triggerHeartConfetti = () => {
  const colors = ['#E11D48', '#FB7185', '#FDA4AF', '#FFE4E6'];
  confetti({
    particleCount: 25,
    spread: 70,
    origin: { x: 0.5, y: 0.55 },
    colors,
    scalar: 1,
    ticks: 180
  });
};
