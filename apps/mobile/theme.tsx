import React, { createContext, useContext, useState } from 'react';

export type ThemePreset = 'default' | 'light' | 'midnight' | 'royal';

export interface ThemeColors {
  background: string;
  card: string;
  elevated: string;
  foreground: string;
  mutedForeground: string;
  faint: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryForeground: string;
  // Espectro da marca (mesmo usado no logo e no fundo ambiente do web) —
  // usado aqui para o gradiente do cabeçalho de perfil.
  gradA: string;
  gradB: string;
  gradC: string;
  gradD: string;
}

// Mesmas paletas (convertidas de HSL para hex) do apps/web/src/index.css —
// mantém web e mobile visualmente equivalentes por tema.
export const THEMES: Record<ThemePreset, ThemeColors> = {
  default: {
    background: '#05080f',
    card: '#090e1a',
    elevated: '#121a2b',
    foreground: '#f8fafc',
    mutedForeground: '#94a3b8',
    faint: '#637288',
    border: '#1b2636',
    borderStrong: '#2e3e56',
    primary: '#10b77f',
    primaryForeground: '#05080f',
    gradA: '#36d399',
    gradB: '#10b77f',
    gradC: '#07b6d5',
    gradD: '#fbb53c',
  },
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    elevated: '#e7ecf3',
    foreground: '#020817',
    mutedForeground: '#64748b',
    faint: '#7f8c9f',
    border: '#e2e8f0',
    borderStrong: '#bfcad9',
    primary: '#10b77f',
    primaryForeground: '#f8fafc',
    gradA: '#27b07d',
    gradB: '#0d9668',
    gradC: '#0f9bb3',
    gradD: '#dc8f09',
  },
  midnight: {
    background: '#030711',
    card: '#050c1f',
    elevated: '#121a30',
    foreground: '#f8fafc',
    mutedForeground: '#94a3b8',
    faint: '#65718b',
    border: '#131d39',
    borderStrong: '#293860',
    primary: '#07b6d5',
    primaryForeground: '#030711',
    gradA: '#39dcf9',
    gradB: '#0ea9f1',
    gradC: '#3e80ea',
    gradD: '#5a71e2',
  },
  royal: {
    background: '#0c0416',
    card: '#160727',
    elevated: '#231434',
    foreground: '#f8fafc',
    mutedForeground: '#ada1ba',
    faint: '#847693',
    border: '#2d1c40',
    borderStrong: '#483262',
    primary: '#fbbd23',
    primaryForeground: '#0c0416',
    gradA: '#fbcb50',
    gradB: '#f5a314',
    gradC: '#cb4da1',
    gradD: '#9059cf',
  },
};

export const THEME_LABELS: Record<ThemePreset, string> = {
  default: 'Deco Banking Dark',
  light: 'Deco Light Minimalist',
  midnight: 'Midnight Cyber',
  royal: 'Royal Luxury',
};

const THEME_ORDER: ThemePreset[] = ['default', 'light', 'midnight', 'royal'];

interface ThemeContextType {
  themePreset: ThemePreset;
  colors: ThemeColors;
  setThemePreset: (preset: ThemePreset) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreset, setThemePreset] = useState<ThemePreset>('default');

  const cycleTheme = () => {
    const nextIndex = (THEME_ORDER.indexOf(themePreset) + 1) % THEME_ORDER.length;
    setThemePreset(THEME_ORDER[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ themePreset, colors: THEMES[themePreset], setThemePreset, cycleTheme }}>
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
