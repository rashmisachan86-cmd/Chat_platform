import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeContextType, Gender, Vibe } from '../types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });

  const [gender, setGender] = useState<Gender>(user.gender?.toLowerCase() || null);
  const [vibe, setVibe] = useState<Vibe>(user.vibe || null);
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(() => {
    return user.soundsEnabled !== undefined ? user.soundsEnabled : (localStorage.getItem('soundsEnabled') !== 'false');
  });
  const [accentColor, setAccentColor] = useState<string>(() => {
    return user.accentColor || localStorage.getItem('accentColor') || '#a855f7';
  });
  const [chatWallpaper, setChatWallpaper] = useState<string>(() => {
    return user.chatWallpaper || localStorage.getItem('chatWallpaper') || '';
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('soundsEnabled', soundsEnabled.toString());
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('chatWallpaper', chatWallpaper);
    document.documentElement.style.setProperty('--accent-primary', accentColor);
  }, [soundsEnabled, accentColor, chatWallpaper]);

  useEffect(() => {
    const root = document.documentElement;
    // ... (rest of the effect stays similar)
    root.classList.remove('theme-girl', 'theme-boy');
    if (gender === 'girl') {
      root.classList.add('theme-girl');
    } else if (gender === 'boy') {
      root.classList.add('theme-boy');
    }
  }, [gender]);

  const contextValue: ThemeContextType = {
    gender,
    vibe,
    setGender,
    setVibe,
    soundsEnabled,
    setSoundsEnabled,
    accentColor,
    setAccentColor,
    chatWallpaper,
    setChatWallpaper,
    isGirl: gender === 'girl',
    isBoy: gender === 'boy'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};