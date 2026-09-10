import { useState, useCallback, useRef } from 'react';

// Web Audio API synthesizer for instant zero-latency feedback without external assets
class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playHeartPulse() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.24);
  }

  playChime(frequency: number = 523.25, duration: number = 0.8) {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  playPaperRustle() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(1.8, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  playKeypadClick() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  playUnlockSuccess() {
    this.initCtx();
    if (!this.ctx) return;
    // Harmonious melody: C5 - E5 - G5 - C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.7);
      }, idx * 90);
    });
  }

  playUnlockError() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(150, t + 0.2);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  playCakeSlice() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.35);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  playCelebration() {
    this.initCtx();
    if (!this.ctx) return;
    // G4, C5, E5, G5, C6 arpeggio
    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((note, i) => {
      setTimeout(() => {
        this.playChime(note, 1.2);
      }, i * 110);
    });
  }
}

const soundFXInstance = new SoundFX();

export function useSound() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const soundRef = useRef(soundFXInstance);

  const toggleSound = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  const playHeart = useCallback(() => {
    if (isEnabled) soundRef.current.playHeartPulse();
  }, [isEnabled]);

  const playChime = useCallback((freq?: number, dur?: number) => {
    if (isEnabled) soundRef.current.playChime(freq, dur);
  }, [isEnabled]);

  const playPaper = useCallback(() => {
    if (isEnabled) soundRef.current.playPaperRustle();
  }, [isEnabled]);

  const playKeypad = useCallback(() => {
    if (isEnabled) soundRef.current.playKeypadClick();
  }, [isEnabled]);

  const playUnlockSuccess = useCallback(() => {
    if (isEnabled) soundRef.current.playUnlockSuccess();
  }, [isEnabled]);

  const playUnlockError = useCallback(() => {
    if (isEnabled) soundRef.current.playUnlockError();
  }, [isEnabled]);

  const playSlice = useCallback(() => {
    if (isEnabled) soundRef.current.playCakeSlice();
  }, [isEnabled]);

  const playCelebration = useCallback(() => {
    if (isEnabled) soundRef.current.playCelebration();
  }, [isEnabled]);

  return {
    isEnabled,
    toggleSound,
    playHeart,
    playChime,
    playPaper,
    playKeypad,
    playUnlockSuccess,
    playUnlockError,
    playSlice,
    playCelebration
  };
}
