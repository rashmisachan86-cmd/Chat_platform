import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType, Gender, Vibe } from '../types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gender, setGender] = useState<Gender>(null);
  const [vibe, setVibe] = useState<Vibe>(null);

  // Apply theme class to body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-girl', 'theme-boy');
    if (gender === 'girl') {
      root.classList.add('theme-girl');
      // Apply vibe specific styles if needed here
    } else if (gender === 'boy') {
      root.classList.add('theme-boy');
    }
  }, [gender]);

  const contextValue: ThemeContextType = {
    gender,
    vibe,
    setGender,
    setVibe,
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