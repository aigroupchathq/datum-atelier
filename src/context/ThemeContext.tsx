import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

export type Theme = 
  | 'white-yellow' 
  | 'obsidian' 
  | 'bordeaux-cyan' 
  | 'c2mtl-avantgarde' 
  | 'alpine-emerald';

export type LayoutMode = 
  | 'monograph' 
  | 'chronograph' 
  | 'telemetry' 
  | 'blueprint' 
  | 'expedition';

export interface ThemeMetadata {
  id: Theme;
  name: string;
  subtitle: string;
  layoutMode: LayoutMode;
  layoutTitle: string;
  feedWidthClass: string;
  aspectRatio: string;
  density: 'comfortable' | 'compact' | 'ultra-dense';
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
    subtitle: 'Porcelain Atelier • 24K Gilt & Racing Yellow Accents',
    layoutMode: 'monograph',
    layoutTitle: 'Concours Monograph Spread',
    feedWidthClass: 'max-w-[700px]',
    aspectRatio: 'aspect-[4/3] sm:aspect-[4/5]',
    density: 'comfortable',
    mode: 'light',
    primaryHex: '#18181B',
    accentHex: '#D4AF37',
    bgHex: '#FAF9F6',
    cardHex: '#FFFFFF'
  },
  'obsidian': {
    id: 'obsidian',
    name: 'Obsidian & Pure Gold',
    subtitle: 'DLC Smoked Ruthenium • Brushed 18K Champagne Gold',
    layoutMode: 'chronograph',
    layoutTitle: 'Haute-Horlogerie Flush Plinth',
    feedWidthClass: 'max-w-[640px]',
    aspectRatio: 'aspect-[16/10] sm:aspect-[16/9]',
    density: 'comfortable',
    mode: 'dark',
    primaryHex: '#F2F2F0',
    accentHex: '#C5A059',
    bgHex: '#0D0D11',
    cardHex: '#141418'
  },
  'bordeaux-cyan': {
    id: 'bordeaux-cyan',
    name: 'Bordeaux & Aero Cyan',
    subtitle: 'Deep Amarone Velvet • Aerospace Glaucus Cyan',
    layoutMode: 'telemetry',
    layoutTitle: 'F1 Pit-Wall Telemetry HUD',
    feedWidthClass: 'max-w-[760px]',
    aspectRatio: 'aspect-[16/10]',
    density: 'compact',
    mode: 'dark',
    primaryHex: '#FDFCFD',
    accentHex: '#00A3C4',
    bgHex: '#160812',
    cardHex: '#240D1D'
  },
  'c2mtl-avantgarde': {
    id: 'c2mtl-avantgarde',
    name: 'C2MTL Avant-Garde',
    subtitle: 'Prussian Cyanotype • ISO Technical Cobalt & Tangerine',
    layoutMode: 'blueprint',
    layoutTitle: 'CAD Workshop Drafting Blueprint',
    feedWidthClass: 'max-w-[660px]',
    aspectRatio: 'aspect-square sm:aspect-[4/3]',
    density: 'comfortable',
    mode: 'dark',
    primaryHex: '#FFFFFF',
    accentHex: '#2E5BFF',
    bgHex: '#0E1118',
    cardHex: '#161A24'
  },
  'alpine-emerald': {
    id: 'alpine-emerald',
    name: 'Alpine British Racing Green',
    subtitle: 'Brooklands Petroleum Green • Connolly Saddle Tan',
    layoutMode: 'expedition',
    layoutTitle: 'Transcontinental Rallye Spine',
    feedWidthClass: 'max-w-[680px]',
    aspectRatio: 'aspect-[16/9]',
    density: 'comfortable',
    mode: 'dark',
    primaryHex: '#F5FAF7',
    accentHex: '#198754',
    bgHex: '#091310',
    cardHex: '#10211B'
  }
};

interface ThemeContextType {
  theme: Theme;
  layoutMode: LayoutMode;
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

    // Add current theme class and layout attribute
    root.classList.add(`theme-${theme}`);
    root.setAttribute('data-layout', themeMeta.layoutMode);
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
      layoutMode: themeMeta.layoutMode,
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
