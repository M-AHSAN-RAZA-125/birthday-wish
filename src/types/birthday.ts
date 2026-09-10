export type Scene =
  | 'HEART'
  | 'ENVELOPE'
  | 'LETTER'
  | 'UNLOCK'
  | 'CAKE'
  | 'MEMORIES'
  | 'SURPRISE';

export interface BirthdayConfig {
  name: string;
  dateOfBirth: string; // Keypad code, e.g., "1024"
  dobHint: string; // e.g., "Hint: MM/DD (e.g. 10/24)"
  dobFormatDisplay: string; // e.g., "MM / DD"
  greeting: string;
  letterTitle: string;
  letterLines: string[];
  letterSignOff: string;
  cakeWishPrompt: string;
  cakeCutInstruction: string;
  cakeCelebrationText: string;
  memoriesTitle: string;
  finalSurpriseHeader: string;
  finalMessage: string;
  finalSubtext: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  image: string;
  caption: string;
  tag?: string;
  accentColor?: string;
}

export interface AnimationState {
  isTransitioning: boolean;
  soundEnabled: boolean;
  activeScene: Scene;
}
