import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <button
      id="sound-toggle-btn"
      onClick={onToggle}
      aria-label={isEnabled ? 'Mute sound' : 'Unmute sound'}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-stone-900/5 hover:bg-stone-900/10 active:scale-95 transition-all text-stone-600 backdrop-blur-xs border border-stone-200/50"
    >
      {isEnabled ? (
        <Volume2 className="w-4 h-4 text-rose-600/80" />
      ) : (
        <VolumeX className="w-4 h-4 text-stone-400" />
      )}
    </button>
  );
};
