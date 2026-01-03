export type Gender = 'boy' | 'girl' | null;
export type Vibe = 'professional' | 'coding_wizard' | 'chill' | 'luxury' | 'minimal' | null;

export interface ThemeContextType {
  gender: Gender;
  vibe: Vibe;
  setGender: (gender: Gender) => void;
  setVibe: (vibe: Vibe) => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  chatWallpaper: string;
  setChatWallpaper: (wp: string) => void;
  isGirl: boolean;
  isBoy: boolean;
}