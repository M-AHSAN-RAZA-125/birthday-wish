import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';
import { triggerConfetti } from './Confetti';

interface FinalSurpriseProps {
  config: BirthdayConfig;
  onReplay: () => void;
  onPlayCelebration?: () => void;
  onPlayChime?: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  config,
  onReplay,
  onPlayCelebration,
  onPlayChime
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const heartBadgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const replayBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Trigger initial celebration fanfare
    triggerConfetti(0.45);
    onPlayCelebration?.();

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
        .fromTo(
          heartBadgeRef.current,
          { scale: 0, rotate: -25 },
          { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.4'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          replayBtnRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
          '+=0.1'
        );

      // 2. Heart badge gentle floating pulse
      gsap.to(heartBadgeRef.current, {
        scale: 1.08,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.9
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onPlayCelebration]);

  const handleReplayClick = () => {
    onPlayChime?.();
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: onReplay
    });
  };

  return (
    <div
      ref={containerRef}
      id="final-surprise-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-5 py-4 select-none"
    >
      {/* Centered Celebration Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[310px] sm:max-w-[340px] rounded-3xl bg-[#FFFDF9] border border-rose-100 shadow-[0_16px_40px_-8px_rgba(45,36,36,0.14)] p-6 sm:p-7 flex flex-col items-center text-center paper-texture"
      >
        {/* Soft radial glow */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-rose-200/40 blur-2xl pointer-events-none -z-10" />

        {/* Central Heart Badge */}
        <div
          ref={heartBadgeRef}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-md mb-3"
        >
          <Heart className="w-7 h-7 fill-current drop-shadow-xs" />
        </div>

        {/* Eyebrow / Intro */}
        <span
          ref={subtitleRef}
          className="text-xs uppercase tracking-[0.25em] font-medium text-rose-500/90 mb-1 flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-rose-400" />
          {config.finalSurpriseHeader}
        </span>

        {/* Main Title */}
        <h2
          ref={headlineRef}
          className="text-2xl sm:text-[28px] font-serif font-medium text-stone-800 tracking-tight mb-2.5"
        >
          {config.finalMessage}
        </h2>

        {/* Personal Emotional Message */}
        <p
          ref={textRef}
          className="text-sm sm:text-[15px] font-handwriting text-lg text-stone-600 leading-relaxed max-w-[280px] my-1"
        >
          {config.finalSubtext}
        </p>

        {/* Replay Experience Button */}
        <button
          ref={replayBtnRef}
          id="replay-story-btn"
          onClick={handleReplayClick}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:bg-stone-800 active:scale-95 transition-all cursor-pointer border border-stone-800"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Replay Our Story</span>
        </button>
      </div>
    </div>
  );
};
