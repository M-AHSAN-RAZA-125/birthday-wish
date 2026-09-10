import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';
import { triggerConfetti } from './Confetti';

interface CakeSceneProps {
  config: BirthdayConfig;
  onContinue: () => void;
  onPlaySlice?: () => void;
  onPlayCelebration?: () => void;
}

export const CakeScene: React.FC<CakeSceneProps> = ({
  config,
  onContinue,
  onPlaySlice,
  onPlayCelebration
}) => {
  const [isCut, setIsCut] = useState(false);
  const [sliceProgress, setSliceProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cakeLeftRef = useRef<SVGGElement>(null);
  const cakeRightRef = useRef<SVGGElement>(null);
  const flameRef = useRef<SVGGElement>(null);
  const cutLineRef = useRef<SVGLineElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }
    );
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCut) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setSliceProgress(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isCut || !dragStartRef.current) return;
    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    // 80px swipe threshold
    const progress = Math.min(1, deltaX / 90);
    setSliceProgress(progress);

    if (progress >= 0.95) {
      triggerCakeCut();
    }
  };

  const handlePointerUp = () => {
    if (isCut) return;
    if (sliceProgress < 0.95) {
      setSliceProgress(0);
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const triggerCakeCut = () => {
    if (isCut) return;
    setIsCut(true);
    setIsDragging(false);

    onPlaySlice?.();

    // GSAP animations for splitting cake & blowing out candle
    const tl = gsap.timeline();

    // Flash slice line
    tl.to(cutLineRef.current, {
      opacity: 1,
      strokeWidth: 3,
      duration: 0.15
    })
      // Blow out candle flame
      .to(flameRef.current, {
        scale: 0,
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power2.out',
        transformOrigin: 'bottom center'
      }, '<')
      // Separate cake halves
      .to(cakeLeftRef.current, {
        x: -18,
        y: 4,
        rotate: -2.5,
        duration: 0.9,
        ease: 'power2.out',
        transformOrigin: 'bottom left'
      }, '-=0.1')
      .to(cakeRightRef.current, {
        x: 18,
        y: 4,
        rotate: 2.5,
        duration: 0.9,
        ease: 'power2.out',
        transformOrigin: 'bottom right'
      }, '<')
      .to(cutLineRef.current, {
        opacity: 0,
        duration: 0.3
      }, '-=0.4')
      // Fade out swipe instruction
      .to(instructionRef.current, {
        opacity: 0,
        y: -5,
        duration: 0.25
      }, '<')
      // Fade in celebratory message & continue button
      .fromTo(
        celebrationRef.current,
        { opacity: 0, y: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          onStart: () => {
            triggerConfetti(0.5);
            onPlayCelebration?.();
          }
        }
      );
  };

  return (
    <div
      ref={containerRef}
      id="cake-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-5 py-4 select-none touch-none"
    >
      {/* Title Header */}
      <div className="flex flex-col items-center text-center mb-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-800 tracking-tight font-medium flex items-center gap-2">
          <span>{config.cakeWishPrompt}</span>
        </h2>
      </div>

      {/* Interactive Cake SVG Area */}
      <div
        id="interactive-cake-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-[280px] sm:w-[310px] h-[260px] sm:h-[280px] flex items-center justify-center cursor-ew-resize my-1"
      >
        <svg
          viewBox="0 0 320 280"
          className="w-full h-full overflow-visible drop-shadow-[0_12px_24px_rgba(45,36,36,0.09)]"
        >
          <defs>
            {/* Candle flame glow filter */}
            <filter id="flame-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clipping path for Left Half */}
            <clipPath id="leftHalfClip">
              <rect x="0" y="0" width="160" height="280" />
            </clipPath>

            {/* Clipping path for Right Half */}
            <clipPath id="rightHalfClip">
              <rect x="160" y="0" width="160" height="280" />
            </clipPath>
          </defs>

          {/* Plate */}
          <ellipse cx="160" cy="242" rx="130" ry="20" fill="#EAE2D5" />
          <ellipse cx="160" cy="238" rx="122" ry="16" fill="#FFFDF8" stroke="#E2D7C8" strokeWidth="1.5" />

          {/* LEFT HALF OF CAKE */}
          <g ref={cakeLeftRef} clipPath="url(#leftHalfClip)">
            {/* Bottom Sponge Tier */}
            <path
              d="M 50,175 C 50,175 90,202 160,202 L 160,230 C 90,230 50,203 50,203 Z"
              fill="#F8C8CC"
            />
            <path
              d="M 50,165 C 50,165 90,192 160,192 L 160,202 C 90,202 50,175 50,175 Z"
              fill="#F472B6"
            />
            {/* Middle tier sponge */}
            <path
              d="M 50,140 C 50,140 90,167 160,167 L 160,192 C 90,192 50,165 50,165 Z"
              fill="#FFF4E6"
            />

            {/* Frosting Drips (Left) */}
            <path
              d="M 50,140 C 65,152 75,145 90,154 C 105,146 120,156 140,148 C 150,152 155,144 160,145 L 160,135 C 120,135 80,135 50,135 Z"
              fill="#FFFFFF"
            />

            {/* Top Tier Cake */}
            <path
              d="M 75,100 C 75,100 110,120 160,120 L 160,140 C 110,140 75,120 75,120 Z"
              fill="#FDE2E4"
            />
            {/* Top Surface */}
            <ellipse cx="160" cy="98" rx="85" ry="24" fill="#FFFDF9" />
            <ellipse cx="160" cy="98" rx="85" ry="24" fill="none" stroke="#FCE7F3" strokeWidth="2" />

            {/* Strawberries & Pearls on Left */}
            <circle cx="105" cy="94" r="7" fill="#E11D48" />
            <circle cx="103" cy="92" r="1.5" fill="#FFE4E6" />
            <circle cx="130" cy="103" r="6" fill="#F43F5E" />
            <circle cx="128" cy="101" r="1.5" fill="#FFE4E6" />
            <circle cx="90" cy="102" r="3.5" fill="#FDE047" />
          </g>

          {/* RIGHT HALF OF CAKE */}
          <g ref={cakeRightRef} clipPath="url(#rightHalfClip)">
            {/* Bottom Sponge Tier */}
            <path
              d="M 160,202 C 230,202 270,175 270,175 L 270,203 C 270,203 230,230 160,230 Z"
              fill="#F8C8CC"
            />
            <path
              d="M 160,192 C 230,192 270,165 270,165 L 270,175 C 270,175 230,202 160,202 Z"
              fill="#F472B6"
            />
            {/* Middle tier sponge */}
            <path
              d="M 160,167 C 230,167 270,140 270,140 L 270,165 C 270,165 230,192 160,192 Z"
              fill="#FFF4E6"
            />

            {/* Frosting Drips (Right) */}
            <path
              d="M 160,145 C 165,144 170,152 180,148 C 200,156 215,146 230,154 C 245,145 255,152 270,140 L 270,135 C 240,135 200,135 160,135 Z"
              fill="#FFFFFF"
            />

            {/* Top Tier Cake */}
            <path
              d="M 160,120 C 210,120 245,100 245,100 L 245,120 C 245,120 210,140 160,140 Z"
              fill="#FDE2E4"
            />
            {/* Top Surface */}
            <ellipse cx="160" cy="98" rx="85" ry="24" fill="#FFFDF9" />
            <ellipse cx="160" cy="98" rx="85" ry="24" fill="none" stroke="#FCE7F3" strokeWidth="2" />

            {/* Strawberries & Pearls on Right */}
            <circle cx="215" cy="94" r="7" fill="#E11D48" />
            <circle cx="213" cy="92" r="1.5" fill="#FFE4E6" />
            <circle cx="190" cy="103" r="6" fill="#F43F5E" />
            <circle cx="188" cy="101" r="1.5" fill="#FFE4E6" />
            <circle cx="230" cy="102" r="3.5" fill="#FDE047" />
          </g>

          {/* Candle (Center) */}
          <rect x="156" y="55" width="8" height="42" rx="3" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
          {/* Candle stripes */}
          <line x1="156" y1="65" x2="164" y2="69" stroke="#F43F5E" strokeWidth="2.5" />
          <line x1="156" y1="77" x2="164" y2="81" stroke="#F43F5E" strokeWidth="2.5" />
          <line x1="156" y1="89" x2="164" y2="93" stroke="#F43F5E" strokeWidth="2.5" />

          {/* Wick */}
          <line x1="160" y1="55" x2="160" y2="48" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

          {/* Animated Flame */}
          <g ref={flameRef} className={!isCut ? 'animate-flame' : ''}>
            {/* Outer golden aura */}
            <ellipse cx="160" cy="38" rx="10" ry="14" fill="#FBBF24" opacity="0.4" filter="url(#flame-glow)" />
            {/* Flame body */}
            <path
              d="M 160,25 C 167,33 166,45 160,47 C 154,45 153,33 160,25 Z"
              fill="#FB923C"
            />
            {/* Inner intense flame core */}
            <path
              d="M 160,33 C 163,38 163,44 160,46 C 157,44 157,38 160,33 Z"
              fill="#FEF08A"
            />
          </g>

          {/* Real-time Slice Cutting Line */}
          <line
            ref={cutLineRef}
            x1="160"
            y1="30"
            x2="160"
            y2="245"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity={sliceProgress > 0 && !isCut ? sliceProgress : 0}
          />
        </svg>

        {/* Drag Visual Progress Guide (when dragging) */}
        {sliceProgress > 0 && !isCut && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-rose-200/50 rounded-full overflow-hidden pointer-events-none">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-75"
              style={{ width: `${sliceProgress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Swipe Instruction (before cut) */}
      {!isCut && (
        <div ref={instructionRef} className="flex flex-col items-center mt-2 text-center">
          <div className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm font-medium tracking-wide">
            <span className="w-6 h-px bg-stone-300" />
            <span>{config.cakeCutInstruction}</span>
            <span className="w-6 h-px bg-stone-300" />
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Drag horizontally across the cake
          </p>
        </div>
      )}

      {/* Celebration & Continue Container (after cut) */}
      <div
        ref={celebrationRef}
        className={`flex flex-col items-center text-center mt-3 ${
          isCut ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-semibold">Wish Granted!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <p className="text-stone-700 text-sm sm:text-base font-handwriting text-lg leading-relaxed max-w-[280px]">
          {config.cakeCelebrationText}
        </p>

        <button
          id="cake-continue-btn"
          onClick={onContinue}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium shadow-sm hover:bg-stone-800 active:scale-95 transition-all cursor-pointer border border-stone-800"
        >
          <span>Continue to Memories</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
