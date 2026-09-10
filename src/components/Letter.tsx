import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Heart } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';

interface LetterProps {
  config: BirthdayConfig;
  onContinue: () => void;
  onPlaySound?: () => void;
}

export const Letter: React.FC<LetterProps> = ({ config, onContinue, onPlaySound }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const signOffRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    onPlaySound?.();

    const ctx = gsap.context(() => {
      // 1. Initial unfolding appearance
      gsap.fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      // 2. Gentle ambient paper float
      gsap.to(cardRef.current, {
        y: -4,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8
      });

      // 3. Staggered line-by-line reveal
      const lineElements = linesRef.current?.children ? Array.from(linesRef.current.children) : [];

      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
        .fromTo(
          lineElements,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.28,
            ease: 'power2.out'
          },
          '-=0.2'
        )
        .fromTo(
          signOffRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.1'
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
          '+=0.1'
        );
    });

    return () => ctx.revert();
  }, [onPlaySound]);

  const handleNext = () => {
    onPlaySound?.();
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      y: -15,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: onContinue
    });
  };

  return (
    <div
      id="letter-reading-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-5 py-4 select-none"
    >
      {/* Compact centered handwritten birthday note */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[310px] sm:max-w-[340px] rounded-2xl bg-[#FFFDF9] border border-amber-100/90 shadow-[0_12px_36px_-6px_rgba(45,36,36,0.12)] p-6 sm:p-7 flex flex-col items-center text-center paper-texture"
      >
        {/* Little decorative tape or pin at top */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-amber-100/80 rounded-xs border border-amber-200/50 backdrop-blur-xs opacity-75 shadow-xs" />

        {/* Small floating heart accent */}
        <div className="absolute top-4 right-4 text-rose-300 opacity-60 animate-pulse">
          <Heart className="w-4 h-4 fill-current" />
        </div>

        {/* Letter Title */}
        <h2
          ref={titleRef}
          className="text-2xl sm:text-[26px] font-handwriting font-bold text-rose-600 mb-3 tracking-wide"
        >
          {config.letterTitle}
        </h2>

        {/* Message body lines */}
        <div ref={linesRef} className="flex flex-col gap-2.5 w-full my-2 text-stone-700">
          {config.letterLines.map((line, idx) => (
            <p
              key={idx}
              className="text-lg sm:text-[19px] font-handwriting leading-snug tracking-wide"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Sign-off */}
        <p
          ref={signOffRef}
          className="mt-3 text-base sm:text-lg font-handwriting text-stone-500 italic"
        >
          {config.letterSignOff}
        </p>

        {/* Small elegant continue button */}
        <button
          ref={buttonRef}
          id="letter-continue-btn"
          onClick={handleNext}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:bg-stone-800 active:scale-95 transition-all cursor-pointer border border-stone-800"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
