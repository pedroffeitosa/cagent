import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'default' | 'light' | 'midnight' | 'royal';

const THEME_STORAGE_KEY = 'cagent-theme-preset';
const VALID_PRESETS: ThemePreset[] = ['default', 'light', 'midnight', 'royal'];

function getStoredThemePreset(): ThemePreset {
  if (typeof window === 'undefined') return 'default';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_PRESETS.includes(stored as ThemePreset) ? (stored as ThemePreset) : 'default';
}

interface ThemeContextType {
  themePreset: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreset, setThemePresetState] = useState<ThemePreset>(getStoredThemePreset);

  const setThemePreset = (preset: ThemePreset) => {
    setThemePresetState(preset);
    window.localStorage.setItem(THEME_STORAGE_KEY, preset);
  };

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
