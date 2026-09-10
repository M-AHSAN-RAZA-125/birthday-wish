import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface EnvelopeProps {
  onOpenComplete: () => void;
  onPlaySound?: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpenComplete, onPlaySound }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!envelopeRef.current) return;

    // Gentle float on the closed envelope
    const ctx = gsap.context(() => {
      gsap.fromTo(
        envelopeRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
      );

      gsap.to(envelopeRef.current, {
        y: -6,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.9
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    onPlaySound?.();

    const flap = flapRef.current;
    const letter = letterRef.current;
    const seal = sealRef.current;
    const prompt = promptRef.current;
    const envelope = envelopeRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      }
    });

    // 1. Hide prompt text & pop seal
    tl.to(prompt, { opacity: 0, y: -5, duration: 0.2, ease: 'power1.out' })
      .to(seal, { scale: 0, opacity: 0, duration: 0.25, ease: 'back.in(1.7)' }, '<')

      // 2. Open flap 3D upwards
      .to(flap, {
        rotateX: 180,
        duration: 0.6,
        ease: 'power2.inOut',
        transformOrigin: 'top center'
      })

      // 3. Slide letter upward out of the pocket
      .to(letter, {
        y: -110,
        scale: 1.05,
        duration: 0.7,
        ease: 'power2.out'
      }, '-=0.15')

      // 4. Smooth scale & zoom into letter reading
      .to(letter, {
        scale: 1.15,
        duration: 0.45,
        ease: 'power1.inOut'
      })
      .to(envelope, {
        opacity: 0,
        y: 40,
        duration: 0.4,
        ease: 'power2.in'
      }, '<');
  };

  return (
    <div
      ref={containerRef}
      id="envelope-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-6 select-none"
    >
      {/* Central Envelope Container: max-width ~270px (approx 65% of mobile screen) */}
      <div
        ref={envelopeRef}
        onClick={handleOpen}
        className="relative w-[260px] sm:w-[280px] h-[170px] sm:h-[185px] cursor-pointer group"
        style={{ perspective: '1000px' }}
      >
        {/* Soft realistic drop shadow under envelope */}
        <div className="absolute -bottom-4 left-4 right-4 h-6 bg-stone-900/10 rounded-full blur-md" />

        {/* Envelope Outer Pocket / Body */}
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-stone-200/80 bg-[#F4EFE6] shadow-[0_10px_25px_-5px_rgba(45,36,36,0.12)]">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D8CFC4_1px,transparent_1px)] [background-size:10px_10px]" />

          {/* Letter inside (peeking out) */}
          <div
            ref={letterRef}
            className="absolute left-3 right-3 top-3 bottom-3 rounded-lg bg-[#FFFCF7] border border-amber-100 shadow-xs flex flex-col items-center justify-center p-3 z-10"
            style={{ transform: 'translateY(0px)' }}
          >
            <div className="w-8 h-0.5 bg-rose-300/60 rounded-full mb-1.5" />
            <div className="w-24 h-1 bg-stone-200/80 rounded-full mb-1" />
            <div className="w-16 h-1 bg-stone-200/60 rounded-full" />
            <span className="text-[10px] text-rose-500 font-handwriting mt-1 font-bold text-center">
              A note for you ❤️
            </span>
          </div>

          {/* Envelope lower fold triangles (Pocket front) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Left triangle */}
            <div
              className="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-tr from-[#EFE8DD] to-[#F7F2EA]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                filter: 'drop-shadow(2px 0 3px rgba(0,0,0,0.03))'
              }}
            />
            {/* Right triangle */}
            <div
              className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-tl from-[#ECE5D8] to-[#F7F2EA]"
              style={{
                clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
                filter: 'drop-shadow(-2px 0 3px rgba(0,0,0,0.03))'
              }}
            />
            {/* Bottom triangle pocket */}
            <div
              className="absolute left-0 right-0 bottom-0 h-[60%] bg-gradient-to-t from-[#E8DFCFA0] to-[#FAF6EE]"
              style={{
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                filter: 'drop-shadow(0 -3px 4px rgba(45,36,36,0.05))'
              }}
            />
          </div>

          {/* Envelope Top Flap */}
          <div
            ref={flapRef}
            className="absolute top-0 left-0 right-0 h-[52%] z-30 origin-top"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(0deg)'
            }}
          >
            {/* Flap face */}
            <div
              className="w-full h-full bg-gradient-to-b from-[#F2ECE0] to-[#E9E1D2] border-t border-stone-200/60"
              style={{
                clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
              }}
            />
          </div>

          {/* Heart Seal on center of flap */}
          <div
            ref={sealRef}
            className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-md flex items-center justify-center text-white cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-white drop-shadow-xs"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Instruction text */}
      <p
        ref={promptRef}
        className="mt-8 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-stone-500/80 text-center"
      >
        Tap to open
      </p>
    </div>
  );
};
