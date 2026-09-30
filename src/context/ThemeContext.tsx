import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

export type Theme = 
  | 'white-yellow' 
  | 'obsidian' 
  | 'bordeaux-cyan' 
  | 'c2mtl-avantgarde' 
  | 'alpine-emerald';

export interface ThemeMetadata {
  id: Theme;
  name: string;
  subtitle: string;
  mode: 'light' | 'dark';
  primaryHex: string;
  accentHex: string;
  bgHex: string;
  cardHex: string;
}

export const ATELIER_THEMES: Record<Theme, ThemeMetadata> = {
  'white-yellow': {
    id: 'white-yellow',
    name: 'Mayfair White & Speed Yellow',
    subtitle: 'Porcelain Atelier • Racing Yellow Accents',
    mode: 'light',
    primaryHex: '#09090B',
    accentHex: '#EAB308',
    bgHex: '#F8F9FA',
    cardHex: '#FFFFFF'
  },
  'obsidian': {
    id: 'obsidian',
    name: 'Obsidian & Pure Gold',
    subtitle: 'Deep Carbon • Warm Horlogerie Gold',
    mode: 'dark',
    primaryHex: '#F4F4F5',
    accentHex: '#F59E0B',
    bgHex: '#09090B',
    cardHex: '#111113'
  },
  'bordeaux-cyan': {
    id: 'bordeaux-cyan',
    name: 'Bordeaux & Aero Cyan',
    subtitle: 'PTS Plum Velvet • Electric Aerospace Cyan',
    mode: 'dark',
    primaryHex: '#FFFFFF',
    accentHex: '#0677A1',
    bgHex: '#1B0E16',
    cardHex: '#2E1624'
  },
  'c2mtl-avantgarde': {
    id: 'c2mtl-avantgarde',
    name: 'C2MTL Avant-Garde',
    subtitle: 'Graphic Noir • Electric Cobalt & Tangerine',
    mode: 'dark',
    primaryHex: '#FFFFFF',
    accentHex: '#273DB4',
    bgHex: '#141414',
    cardHex: '#1C1C1E'
  },
  'alpine-emerald': {
    id: 'alpine-emerald',
    name: 'Alpine British Racing Green',
    subtitle: 'Forest Petroleum • Emerald & Platinum',
    mode: 'dark',
    primaryHex: '#F4FBF7',
    accentHex: '#10B981',
    bgHex: '#0B1411',
    cardHex: '#12211C'
  }
};

interface ThemeContextType {
  theme: Theme;
  isWhiteYellow: boolean;
  themeMeta: ThemeMetadata;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('garage_theme') as Theme;
    if (saved && ATELIER_THEMES[saved]) {
      return saved;
    }
    return 'white-yellow';
  });

  const themeMeta = ATELIER_THEMES[theme] || ATELIER_THEMES['white-yellow'];

  useEffect(() => {
    localStorage.setItem('garage_theme', theme);
    const root = document.documentElement;

    // Remove all previous theme classes
    Object.keys(ATELIER_THEMES).forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });

    // Add current theme class
    root.classList.add(`theme-${theme}`);
    root.style.colorScheme = themeMeta.mode;
    document.body.style.backgroundColor = themeMeta.bgHex;
    document.body.style.color = themeMeta.primaryHex;
  }, [theme, themeMeta]);

  const setTheme = (t: Theme) => setThemeState(t);
  
  const toggleTheme = () => {
    setThemeState(prev => (prev === 'white-yellow' ? 'obsidian' : 'white-yellow'));
  };

  const cycleTheme = () => {
    const themeKeys: Theme[] = ['white-yellow', 'bordeaux-cyan', 'c2mtl-avantgarde', 'alpine-emerald', 'obsidian'];
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setThemeState(themeKeys[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isWhiteYellow: theme === 'white-yellow', 
      themeMeta,
      setTheme, 
      toggleTheme,
      cycleTheme
    }}>
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
