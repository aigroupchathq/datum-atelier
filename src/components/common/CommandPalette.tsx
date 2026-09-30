import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Compass,
  Users,
  Wrench,
  FileText,
  Palette,
  Shield,
  Volume2,
  Sparkles,
  Sliders,
  Cpu,
  CornerDownLeft,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSplashScreen?: () => void;
  onOpenAcousticStudio?: () => void;
  onOpenPassRadar?: () => void;
  onOpenTransitCarnet?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Chassis & Vehicles' | 'Themes & Palettes' | 'Engineering & Tools' | 'Passes';
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenSplashScreen,
  onOpenAcousticStudio,
  onOpenPassRadar,
  onOpenTransitCarnet
}) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global hotkey listener (⌘K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-feed',
      category: 'Navigation',
      label: 'Atelier Feed',
      sublabel: 'Mutual custodianship & community wrenching stories',
      icon: <Compass className="w-4 h-4 text-yellow-500" />,
      action: () => { navigate('/'); onClose(); }
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      label: 'About & Case Study Monograph',
      sublabel: 'Level 1–6 Donne Martin distributed system & FAQ',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      badge: 'Vogue Monograph',
      action: () => { navigate('/about'); onClose(); }
    },
    {
      id: 'nav-explore',
      category: 'Navigation',
      label: 'Explore Mountain Passes & Builds',
      sublabel: 'Curated routes, track builds & dyno records',
      icon: <Compass className="w-4 h-4 text-sky-500" />,
      action: () => { navigate('/explore'); onClose(); }
    },
    {
      id: 'nav-clubs',
      category: 'Navigation',
      label: 'Guild Clubs & Shared Bays',
      sublabel: 'Join invite-only ateliers & multi-sig tool vaults',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      action: () => { navigate('/communities'); onClose(); }
    },
    {
      id: 'nav-pro',
      category: 'Navigation',
      label: 'Garage Pro // Mechanic Advisory',
      sublabel: 'Direct telemetry consultation & engine diagnostics',
      icon: <Wrench className="w-4 h-4 text-amber-500" />,
      action: () => { navigate('/pro'); onClose(); }
    },

    // Chassis & Vehicles
    {
      id: 'car-maya',
      category: 'Chassis & Vehicles',
      label: 'Maya — BMW M3 Competition (G80)',
      sublabel: 'Isle of Man Green • S58 Twin-Turbo • Cotswolds',
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
      action: () => { navigate('/car/car-maya-m3'); onClose(); }
    },
    {
      id: 'car-kuro',
      category: 'Chassis & Vehicles',
      label: 'Kuro — Porsche 911 GT3 Touring (992.1)',
      sublabel: 'Chalk White • 4.0L Naturally Aspirated Boxer-6',
      icon: <Shield className="w-4 h-4 text-zinc-400" />,
      action: () => { navigate('/car/car-maya-m3'); onClose(); }
    },
    {
      id: 'car-dan',
      category: 'Chassis & Vehicles',
      label: 'Retro Mod — BMW 318is Slicktop (E30)',
      sublabel: 'Brilliantrot • 1989 Analog Survivor • Bristol',
      icon: <Shield className="w-4 h-4 text-red-500" />,
      action: () => { navigate('/car/car-maya-m3'); onClose(); }
    },

    // Themes & Palettes
    {
      id: 'theme-bordeaux',
      category: 'Themes & Palettes',
      label: 'Bordeaux & Aero Cyan Palette',
      sublabel: 'PTS Ruby Star Velvet Plum meets Interstellar Cyan',
      icon: <Palette className="w-4 h-4 text-cyan-400" />,
      badge: theme === 'bordeaux-cyan' ? 'Active' : undefined,
      action: () => { setTheme('bordeaux-cyan'); onClose(); }
    },
    {
      id: 'theme-c2mtl',
      category: 'Themes & Palettes',
      label: 'C2MTL Avant-Garde Palette',
      sublabel: 'Graphic Noir, Hyper-Cobalt & Tangerine Orange',
      icon: <Palette className="w-4 h-4 text-blue-500" />,
      badge: theme === 'c2mtl-avantgarde' ? 'Active' : undefined,
      action: () => { setTheme('c2mtl-avantgarde'); onClose(); }
    },
    {
      id: 'theme-alpine',
      category: 'Themes & Palettes',
      label: 'Alpine British Racing Green Palette',
      sublabel: 'Deep Petroleum Forest with Emerald & Sterling Silver',
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
      badge: theme === 'alpine-emerald' ? 'Active' : undefined,
      action: () => { setTheme('alpine-emerald'); onClose(); }
    },
    {
      id: 'theme-mayfair',
      category: 'Themes & Palettes',
      label: 'Mayfair White & Speed Yellow Palette',
      sublabel: 'Haute Horlogerie Porcelain & Vibrant Racing Yellow',
      icon: <Palette className="w-4 h-4 text-yellow-400" />,
      badge: theme === 'white-yellow' ? 'Active' : undefined,
      action: () => { setTheme('white-yellow'); onClose(); }
    },
    {
      id: 'theme-obsidian',
      category: 'Themes & Palettes',
      label: 'Obsidian & Pure Gold Palette',
      sublabel: 'Deep Carbon Black with 24k Horological Gold Trims',
      icon: <Palette className="w-4 h-4 text-amber-400" />,
      badge: theme === 'obsidian' ? 'Active' : undefined,
      action: () => { setTheme('obsidian'); onClose(); }
    },

    // Engineering & Tools
    {
      id: 'tool-splash',
      category: 'Engineering & Tools',
      label: 'Launch Minimalist Engine Start Ignition',
      sublabel: 'Experience the tactile Web Audio starter motor & rev flare',
      icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
      action: () => { if (onOpenSplashScreen) onOpenSplashScreen(); onClose(); }
    },
    {
      id: 'tool-acoustics',
      category: 'Engineering & Tools',
      label: 'Acoustic Valvetrain DSP Studio',
      sublabel: 'Simulate flat-plane V8 vs Boxer harmonic combustion',
      icon: <Volume2 className="w-4 h-4 text-yellow-500" />,
      action: () => { if (onOpenAcousticStudio) onOpenAcousticStudio(); onClose(); }
    },
    {
      id: 'tool-radar',
      category: 'Engineering & Tools',
      label: 'Pass Surface Grip & Meteorological Radar',
      sublabel: 'Live telemetry friction (μ) calculation for UK mountain passes',
      icon: <Sliders className="w-4 h-4 text-sky-400" />,
      action: () => { if (onOpenPassRadar) onOpenPassRadar(); onClose(); }
    },
    {
      id: 'tool-carnet',
      category: 'Engineering & Tools',
      label: 'Zero-Knowledge Transit Carnet Protocol',
      sublabel: 'Generate border pass & cryptographically cloaked carnet',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      action: () => { if (onOpenTransitCarnet) onOpenTransitCarnet(); onClose(); }
    }
  ];

  const filteredCommands = allCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.sublabel && cmd.sublabel.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Command Palette Card */}
      <div 
        className="relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Top Search Input Bar */}
        <div 
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <Search className="w-5 h-5 opacity-50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDownList}
            placeholder="Type a command, car, pass, or palette (e.g. 'Bordeaux', 'Maya', 'Radar', 'About')..."
            className="flex-1 bg-transparent text-sm sm:text-base font-sans focus:outline-none placeholder:opacity-40"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span 
            className="text-[10px] font-mono-numbers px-2 py-0.5 rounded border opacity-60 hidden sm:inline"
            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono-numbers opacity-60">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between gap-4 transition cursor-pointer border ${
                    isSelected
                      ? 'shadow-xs font-semibold'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: isSelected ? 'var(--border-active)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-void)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {cmd.label}
                        </span>
                        {cmd.badge && (
                          <span 
                            className="text-[9px] font-mono-numbers px-1.5 py-0.5 rounded-full uppercase font-bold"
                            style={{
                              backgroundColor: 'var(--accent)',
                              color: '#09090B'
                            }}
                          >
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      {cmd.sublabel && (
                        <p className="text-[11px] opacity-60 truncate font-sans">
                          {cmd.sublabel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono-numbers opacity-40 uppercase hidden sm:inline">
                      {cmd.category}
                    </span>
                    <CornerDownLeft className={`w-3.5 h-3.5 opacity-60 transition-transform ${isSelected ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div 
          className="px-5 py-3 border-t flex items-center justify-between text-[10px] font-mono-numbers opacity-60"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: 'var(--accent)' }} />
            <span>DATUM AI Smart Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
};
