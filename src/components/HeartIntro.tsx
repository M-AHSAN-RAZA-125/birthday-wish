import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface HeartIntroProps {
  onTap: () => void;
  onPlaySound?: () => void;
}

export const HeartIntro: React.FC<HeartIntroProps> = ({ onTap, onPlaySound }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const isTapped = useRef(false);

  useEffect(() => {
    if (!heartRef.current || !glowRef.current || !textRef.current) return;

    // Gentle ambient floating & heartbeat pulse
    const ctx = gsap.context(() => {
      // Floating animation
      gsap.to(heartRef.current, {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Soft heartbeat pulse
      gsap.to(heartRef.current, {
        scale: 1.07,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Soft pulsing glow
      gsap.to(glowRef.current, {
        scale: 1.25,
        opacity: 0.65,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Subtle breathing instruction text
      gsap.to(textRef.current, {
        opacity: 0.45,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    if (isTapped.current) return;
    isTapped.current = true;

    onPlaySound?.();

    const heartEl = heartRef.current;
    const glowEl = glowRef.current;
    const textEl = textRef.current;
    const particlesEl = particlesRef.current;

    // Cinematic GSAP expansion & transition
    const tl = gsap.timeline({
      onComplete: () => {
        onTap();
      }
    });

    // Tap scale shockwave
    tl.to(heartEl, {
      scale: 0.9,
      duration: 0.12,
      ease: 'power1.in'
    })
      .to(heartEl, {
        scale: 1.45,
        duration: 0.65,
        ease: 'power2.out'
      })
      .to(glowEl, {
        scale: 2.8,
        opacity: 0.9,
        duration: 0.65,
        ease: 'power2.out'
      }, '<')
      .to(textEl, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.in'
      }, '<')
      .to(particlesEl?.children ? Array.from(particlesEl.children) : [], {
        scale: 0,
        x: (i) => Math.cos((i * 60 * Math.PI) / 180) * 80,
        y: (i) => Math.sin((i * 60 * Math.PI) / 180) * 80,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '<0.1')
      .to([heartEl, glowEl], {
        opacity: 0,
        scale: 1.8,
        duration: 0.45,
        ease: 'power2.in'
      }, '-=0.2');
  };

  return (
    <div
      ref={containerRef}
      id="heart-intro-scene"
      className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer px-6 select-none"
      onClick={handleClick}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Soft radial aura */}
        <div
          ref={glowRef}
          className="absolute w-36 h-36 rounded-full bg-rose-300/30 blur-2xl pointer-events-none"
        />

        {/* Floating micro particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
          {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
            <div
              key={deg}
              className="absolute w-2 h-2 rounded-full bg-rose-300/70"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${deg}deg) translate(46px) scale(${0.7 + (idx % 3) * 0.2})`,
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.4)'
              }}
            />
          ))}
        </div>

        {/* Central Small Heart */}
        <div
          ref={heartRef}
          className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transition-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-rose-500 filter drop-shadow-[0_4px_16px_rgba(244,63,94,0.45)]"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Tiny highlight reflection */}
          <div className="absolute top-2.5 left-3.5 w-3 h-2 rounded-full bg-white/40 rotate-[-25deg] blur-[0.5px]" />
        </div>

        {/* Instruction label */}
        <p
          ref={textRef}
          className="mt-8 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-stone-500/80 text-center"
        >
          Tap the heart
        </p>
      </div>
    </div>
  );
};
