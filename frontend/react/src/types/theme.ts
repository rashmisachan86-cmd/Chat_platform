export type Gender = 'girl' | 'boy' | null;
export type Vibe = 'soft' | 'elegant' | 'cute' | 'calm' | null;

export interface ThemeContextType {
  gender: Gender;
  vibe: Vibe;
  setGender: (gender: Gender) => void;
  setVibe: (vibe: Vibe) => void;
  isGirl: boolean;
  isBoy: boolean;
}