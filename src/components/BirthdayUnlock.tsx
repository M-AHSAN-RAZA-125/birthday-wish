import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Delete, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';

interface BirthdayUnlockProps {
  config: BirthdayConfig;
  onUnlock: () => void;
  onPlayKeypad?: () => void;
  onPlaySuccess?: () => void;
  onPlayError?: () => void;
}

export const BirthdayUnlock: React.FC<BirthdayUnlockProps> = ({
  config,
  onUnlock,
  onPlayKeypad,
  onPlaySuccess,
  onPlayError
}) => {
  const [inputDigits, setInputDigits] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const keypadRef = useRef<HTMLDivElement>(null);

  const targetLength = config.dateOfBirth.length;

  const handlePressDigit = (digit: string) => {
    if (isSuccess || isError || inputDigits.length >= targetLength) return;

    onPlayKeypad?.();
    const nextInput = inputDigits + digit;
    setInputDigits(nextInput);

    // If reached required length, validate immediately
    if (nextInput.length === targetLength) {
      if (nextInput === config.dateOfBirth) {
        // Success
        setIsSuccess(true);
        onPlaySuccess?.();

        const tl = gsap.timeline({
          onComplete: () => {
            onUnlock();
          }
        });

        tl.to(indicatorsRef.current, {
          scale: 1.15,
          duration: 0.3,
          ease: 'back.out(2)'
        })
          .to(keypadRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.in'
          }, '-=0.1')
          .to(containerRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.in'
          }, '+=0.2');
      } else {
        // Error / Incorrect DOB
        setIsError(true);
        onPlayError?.();

        // Shake animation
        gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              setInputDigits('');
              setIsError(false);
            }, 300);
          }
        })
          .to(indicatorsRef.current, { x: -10, duration: 0.08, repeat: 3, yoyo: true })
          .to(indicatorsRef.current, { x: 0, duration: 0.08 });
      }
    }
  };

  const handleBackspace = () => {
    if (isSuccess || isError || inputDigits.length === 0) return;
    onPlayKeypad?.();
    setInputDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isSuccess || isError || inputDigits.length === 0) return;
    onPlayKeypad?.();
    setInputDigits('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      ref={containerRef}
      id="birthday-unlock-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-6 select-none"
    >
      {/* Header Titles */}
      <div className="flex flex-col items-center text-center mb-6">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-500/80 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-rose-400" />
          One little secret...
        </span>
        <h3 className="text-xl sm:text-2xl font-serif text-stone-800 tracking-tight font-medium">
          Enter your birthday
        </h3>
        <span className="text-[11px] text-stone-400 mt-1 font-medium tracking-widest">
          {config.dobFormatDisplay}
        </span>
      </div>

      {/* Digit Indicators */}
      <div
        ref={indicatorsRef}
        className="flex items-center justify-center gap-3.5 mb-8"
      >
        {Array.from({ length: targetLength }).map((_, i) => {
          const filled = i < inputDigits.length;
          return (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border ${
                isError
                  ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-sm'
                  : isSuccess
                  ? 'border-rose-500 bg-rose-500 text-white shadow-md scale-105'
                  : filled
                  ? 'border-rose-300 bg-rose-100/60 text-rose-700 shadow-xs scale-100'
                  : 'border-stone-200 bg-white/70 text-transparent'
              }`}
            >
              {isSuccess ? (
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              ) : filled ? (
                <span className="text-base font-semibold font-sans-custom">
                  {inputDigits[i]}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile-Centric Keypad (3 x 4) */}
      <div
        ref={keypadRef}
        className="w-full max-w-[260px] sm:max-w-[280px] grid grid-cols-3 gap-3 sm:gap-3.5"
      >
        {keys.map((k) => (
          <button
            key={k}
            id={`keypad-${k}`}
            onClick={() => handlePressDigit(k)}
            className="h-13 sm:h-14 rounded-2xl bg-white/90 border border-stone-200/80 text-stone-800 text-lg sm:text-xl font-medium shadow-xs active:scale-92 active:bg-rose-50 active:border-rose-200 hover:bg-stone-50 transition-all flex items-center justify-center cursor-pointer"
          >
            {k}
          </button>
        ))}

        {/* Clear Button */}
        <button
          id="keypad-clear"
          onClick={handleClear}
          aria-label="Clear all digits"
          className="h-13 sm:h-14 rounded-2xl bg-stone-100/70 border border-stone-200/50 text-stone-500 text-xs font-semibold tracking-wider active:scale-92 active:bg-stone-200 transition-all flex items-center justify-center cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 0 Button */}
        <button
          id="keypad-0"
          onClick={() => handlePressDigit('0')}
          className="h-13 sm:h-14 rounded-2xl bg-white/90 border border-stone-200/80 text-stone-800 text-lg sm:text-xl font-medium shadow-xs active:scale-92 active:bg-rose-50 active:border-rose-200 hover:bg-stone-50 transition-all flex items-center justify-center cursor-pointer"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          id="keypad-backspace"
          onClick={handleBackspace}
          aria-label="Backspace"
          className="h-13 sm:h-14 rounded-2xl bg-stone-100/70 border border-stone-200/50 text-stone-600 active:scale-92 active:bg-stone-200 transition-all flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Hint Link */}
      <div className="mt-5 text-center">
        {showHint ? (
          <p className="text-xs text-rose-500 font-medium tracking-wide animate-fade-in">
            {config.dobHint}
          </p>
        ) : (
          <button
            id="dob-hint-toggle"
            onClick={() => setShowHint(true)}
            className="text-[11px] text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Need a hint?
          </button>
        )}
      </div>
    </div>
  );
};
