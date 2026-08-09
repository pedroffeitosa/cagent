import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'default' | 'light' | 'midnight' | 'royal';

interface ThemeContextType {
  themePreset: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreset, setThemePreset] = useState<ThemePreset>('default');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-midnight', 'theme-royal');

    if (themePreset !== 'default') {
      root.classList.add(`theme-${themePreset}`);
    }
  }, [themePreset]);

  return (
    <ThemeContext.Provider value={{ themePreset, setThemePreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
