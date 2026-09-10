import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Scene } from './types/birthday';
import { BIRTHDAY_CONFIG } from './data/birthday';
import { MEMORIES } from './data/memories';
import { useSound } from './hooks/useSound';

import { FloatingHearts } from './components/FloatingHearts';
import { SoundToggle } from './components/SoundToggle';
import { HeartIntro } from './components/HeartIntro';
import { Envelope } from './components/Envelope';
import { Letter } from './components/Letter';
import { BirthdayUnlock } from './components/BirthdayUnlock';
import { CakeScene } from './components/CakeScene';
import { MemoryCarousel } from './components/MemoryCarousel';
import { FinalSurprise } from './components/FinalSurprise';

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('HEART');
  const sound = useSound();

  const handleHeartTapped = useCallback(() => {
    setCurrentScene('ENVELOPE');
  }, []);

  const handleEnvelopeOpened = useCallback(() => {
    setCurrentScene('LETTER');
  }, []);

  const handleLetterContinued = useCallback(() => {
    setCurrentScene('UNLOCK');
  }, []);

  const handleUnlockSuccess = useCallback(() => {
    setCurrentScene('CAKE');
  }, []);

  const handleCakeContinued = useCallback(() => {
    setCurrentScene('MEMORIES');
  }, []);

  const handleMemoriesContinued = useCallback(() => {
    setCurrentScene('SURPRISE');
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentScene('HEART');
  }, []);

  return (
    <main
      id="app-root"
      className="relative w-screen h-dvh-safe flex items-center justify-center overflow-hidden bg-[#FAF7F2]"
    >
      {/* Subtle ambient lighting vignette & warm radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#FFFDF9_0%,#F8F3EA_55%,#F3ECE0_100%)] pointer-events-none" />

      {/* Floating background micro-hearts */}
      <FloatingHearts count={10} />

      {/* Sound Mute/Unmute toggle */}
      <SoundToggle isEnabled={sound.isEnabled} onToggle={sound.toggleSound} />

      {/* Mobile-centric stage container:
          Strictly preserves 360px - 430px mobile proportions,
          while gracefully centering within desktop viewports */}
      <div className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-center px-4 z-10">
        <AnimatePresence mode="wait">
          {currentScene === 'HEART' && (
            <motion.div
              key="scene-heart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <HeartIntro
                onTap={handleHeartTapped}
                onPlaySound={sound.playHeart}
              />
            </motion.div>
          )}

          {currentScene === 'ENVELOPE' && (
            <motion.div
              key="scene-envelope"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <Envelope
                onOpenComplete={handleEnvelopeOpened}
                onPlaySound={sound.playPaper}
              />
            </motion.div>
          )}

          {currentScene === 'LETTER' && (
            <motion.div
              key="scene-letter"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <Letter
                config={BIRTHDAY_CONFIG}
                onContinue={handleLetterContinued}
                onPlaySound={sound.playChime}
              />
            </motion.div>
          )}

          {currentScene === 'UNLOCK' && (
            <motion.div
              key="scene-unlock"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <BirthdayUnlock
                config={BIRTHDAY_CONFIG}
                onUnlock={handleUnlockSuccess}
                onPlayKeypad={sound.playKeypad}
                onPlaySuccess={sound.playUnlockSuccess}
                onPlayError={sound.playUnlockError}
              />
            </motion.div>
          )}

          {currentScene === 'CAKE' && (
            <motion.div
              key="scene-cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <CakeScene
                config={BIRTHDAY_CONFIG}
                onContinue={handleCakeContinued}
                onPlaySlice={sound.playSlice}
                onPlayCelebration={sound.playCelebration}
              />
            </motion.div>
          )}

          {currentScene === 'MEMORIES' && (
            <motion.div
              key="scene-memories"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <MemoryCarousel
                title={BIRTHDAY_CONFIG.memoriesTitle}
                memories={MEMORIES}
                onContinue={handleMemoriesContinued}
                onPlayChime={sound.playChime}
              />
            </motion.div>
          )}

          {currentScene === 'SURPRISE' && (
            <motion.div
              key="scene-surprise"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <FinalSurprise
                config={BIRTHDAY_CONFIG}
                onReplay={handleReplay}
                onPlayCelebration={sound.playCelebration}
                onPlayChime={sound.playChime}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
