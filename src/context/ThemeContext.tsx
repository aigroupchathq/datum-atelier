import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

export type Theme = 'white-yellow' | 'obsidian';

interface ThemeContextType {
  theme: Theme;
  isWhiteYellow: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('garage_theme');
    // Default to 'white-yellow' as requested
    return (saved === 'obsidian' || saved === 'white-yellow') ? saved : 'white-yellow';
  });

  useEffect(() => {
    localStorage.setItem('garage_theme', theme);
    const root = document.documentElement;
    if (theme === 'white-yellow') {
      root.classList.add('theme-white-yellow');
      root.classList.remove('theme-obsidian');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F8F9FA';
      document.body.style.color = '#09090B';
    } else {
      root.classList.add('theme-obsidian');
      root.classList.remove('theme-white-yellow');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#09090B';
      document.body.style.color = '#F4F4F5';
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'white-yellow' ? 'obsidian' : 'white-yellow'));

  return (
    <ThemeContext.Provider value={{ theme, isWhiteYellow: theme === 'white-yellow', setTheme, toggleTheme }}>
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
