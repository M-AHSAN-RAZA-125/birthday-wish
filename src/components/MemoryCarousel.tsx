import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Calendar } from 'lucide-react';
import { Memory } from '../types/birthday';

interface MemoryCarouselProps {
  title: string;
  memories: Memory[];
  onContinue: () => void;
  onPlayChime?: () => void;
}

export const MemoryCarousel: React.FC<MemoryCarouselProps> = ({
  title,
  memories,
  onContinue,
  onPlayChime
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      onPlayChime?.();
    }
  };

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      onPlayChime?.();
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (diffX > threshold) {
      // Swiped Left -> Next
      handleNext();
    } else if (diffX < -threshold) {
      // Swiped Right -> Prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Curated artistic SVG illustration fallback for memories
  const renderFallbackIllustration = (index: number) => {
    switch (index % 4) {
      case 0:
        // Golden sunset coast
        return (
          <div className="w-full h-full bg-gradient-to-b from-amber-200 via-rose-300 to-amber-700 flex flex-col justify-end p-4 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 blur-md" />
            <div className="w-full h-8 bg-amber-900/40 rounded-t-full blur-xs" />
            <div className="w-full h-5 bg-amber-950/60 rounded-t-xl" />
          </div>
        );
      case 1:
        // Cozy coffee cafe
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-stone-300 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-16 h-12 rounded-b-2xl bg-amber-800/80 relative flex items-center justify-center shadow-xs">
              <div className="w-4 h-6 border-2 border-amber-800/80 rounded-r-full absolute -right-3 top-1" />
              <span className="text-[10px] text-amber-100 font-bold">☕</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              <span className="w-1 h-3 bg-amber-600/30 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-amber-600/30 rounded-full animate-pulse delay-75" />
            </div>
          </div>
        );
      case 2:
        // Starlit night
        return (
          <div className="w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 right-5 w-7 h-7 rounded-full bg-amber-100 shadow-[0_0_12px_rgba(254,240,138,0.8)]" />
            <div className="absolute inset-0 flex flex-wrap gap-6 p-4 opacity-70">
              <span className="text-amber-200 text-xs animate-ping">✦</span>
              <span className="text-white text-xs">★</span>
              <span className="text-purple-200 text-xs">✦</span>
              <span className="text-white text-[10px]">★</span>
            </div>
          </div>
        );
      case 3:
      default:
        // Radiant amusement park / Ferris wheel joy
        return (
          <div className="w-full h-full bg-gradient-to-tr from-pink-200 via-rose-300 to-purple-300 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-rose-600/50 flex items-center justify-center animate-spin [animation-duration:15s]">
              <Heart className="w-6 h-6 text-rose-500 fill-current" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      id="memories-scene"
      className="relative flex flex-col items-center justify-center w-full h-full px-3 py-2 select-none"
    >
      {/* Title */}
      <div className="flex flex-col items-center text-center mb-3">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-800 tracking-tight font-medium flex items-center gap-1.5">
          <span>{title}</span>
        </h2>
        <span className="text-[11px] text-stone-400 font-medium tracking-wide">
          Swipe through our moments ({currentIndex + 1} of {memories.length})
        </span>
      </div>

      {/* Carousel Container */}
      <div
        id="memories-carousel"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[340px] sm:max-w-[380px] h-[330px] sm:h-[350px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Navigation Arrow Left */}
        <button
          id="memory-prev-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Previous memory"
          className={`absolute left-0 z-30 p-2 rounded-full bg-white/80 border border-stone-200/60 shadow-xs backdrop-blur-xs transition-opacity cursor-pointer ${
            currentIndex === 0 ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4 text-stone-700" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          id="memory-next-btn"
          onClick={handleNext}
          disabled={currentIndex === memories.length - 1}
          aria-label="Next memory"
          className={`absolute right-0 z-30 p-2 rounded-full bg-white/80 border border-stone-200/60 shadow-xs backdrop-blur-xs transition-opacity cursor-pointer ${
            currentIndex === memories.length - 1
              ? 'opacity-20 pointer-events-none'
              : 'opacity-80 hover:opacity-100 active:scale-95'
          }`}
        >
          <ChevronRight className="w-4 h-4 text-stone-700" />
        </button>

        {/* Render Carousel Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {memories.map((mem, index) => {
            const offset = index - currentIndex;
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            if (!isVisible) return null;

            return (
              <motion.div
                key={mem.id}
                className="absolute w-[230px] sm:w-[250px] rounded-2xl bg-white p-3 shadow-[0_10px_30px_-5px_rgba(45,36,36,0.12)] border border-stone-200/70 paper-texture flex flex-col items-center"
                initial={false}
                animate={{
                  x: offset * 210, // partial visibility on left and right!
                  scale: isCenter ? 1 : 0.84,
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 20 : 10,
                  rotateZ: offset * 3
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24
                }}
              >
                {/* Photo frame inside polaroid */}
                <div className="relative w-full h-[155px] sm:h-[170px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/50 shadow-inner">
                  {/* Photo image with fallback illustration */}
                  <img
                    src={mem.image}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide failed img so fallback artwork displays
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Illustrated backdrop when image is not loaded */}
                  <div className="absolute inset-0 -z-10">
                    {renderFallbackIllustration(index)}
                  </div>

                  {/* Date Tag */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/60 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-rose-300" />
                    <span>{mem.date}</span>
                  </div>

                  {mem.tag && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[9px] text-stone-700 font-semibold tracking-wider uppercase shadow-xs">
                      {mem.tag}
                    </div>
                  )}
                </div>

                {/* Polaroid Bottom Notes */}
                <div className="w-full mt-2.5 px-1 text-center">
                  <h4 className="text-sm font-semibold text-stone-800 tracking-tight font-serif line-clamp-1">
                    {mem.title}
                  </h4>
                  <p className="text-xs font-handwriting text-stone-600 mt-1 leading-snug line-clamp-2">
                    "{mem.caption}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-1.5 mt-2">
        {memories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              onPlayChime?.();
            }}
            aria-label={`Go to memory ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'w-5 bg-rose-500'
                : 'w-1.5 bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* Continue Button */}
      <button
        id="memories-continue-btn"
        onClick={onContinue}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium shadow-sm hover:bg-stone-800 active:scale-95 transition-all cursor-pointer border border-stone-800"
      >
        <span>One Last Surprise</span>
        <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
      </button>
    </div>
  );
};
