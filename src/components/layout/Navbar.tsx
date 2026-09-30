import { useState } from 'react';
import type { FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Search, 
  Wrench, 
  ChevronDown, 
  Compass, 
  Users, 
  Sparkles, 
  Volume2, 
  FileText, 
  Palette, 
  Check, 
  Type
} from 'lucide-react';
import { useTheme, ATELIER_THEMES } from '../../context/ThemeContext';
import type { Theme } from '../../context/ThemeContext';
import { CommandPalette } from '../common/CommandPalette';

interface NavbarProps {
  onOpenCreatePost: (initialMode?: 'post' | 'story') => void;
  onOpenPrivacyCheck: () => void;
  onOpenSplashScreen?: () => void;
  onOpenAcousticStudio?: () => void;
  onOpenPassRadar?: () => void;
  onOpenTransitCarnet?: () => void;
}

export type FontMode = 'horlogerie' | 'modernist' | 'technical';

export const Navbar: FC<NavbarProps> = ({
  onOpenCreatePost,
  onOpenPrivacyCheck,
  onOpenSplashScreen,
  onOpenAcousticStudio,
  onOpenPassRadar,
  onOpenTransitCarnet
}) => {
  const { theme, setTheme, themeMeta } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [fontMode, setFontMode] = useState<FontMode>('horlogerie');

  const handleFontChange = (mode: FontMode) => {
    setFontMode(mode);
    const root = document.documentElement;
    root.classList.remove('font-mode-horlogerie', 'font-mode-modernist', 'font-mode-technical');
    root.classList.add(`font-mode-${mode}`);
    localStorage.setItem('datum_font_mode', mode);
    setIsFontDropdownOpen(false);
  };

  const handleSearchClick = () => {
    setIsCommandPaletteOpen(true);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 h-14 flex items-center backdrop-blur-xl border-b px-4 lg:px-8 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-6">

          {/* ── 1. BESPOKE DATUM ATELIER LOGO & BRAND CREST ── */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              
              {/* Precision Engineering Octagonal Emblem */}
              <div 
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md border"
                style={{
                  backgroundColor: 'var(--bg-void)',
                  borderColor: 'var(--border-default)'
                }}
              >
                {/* Outer decorative datum ring */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {/* Outer geometric chassis diamond */}
                  <polygon 
                    points="12,2 22,12 12,22 2,12" 
                    stroke="var(--accent)" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="var(--bg-surface)"
                  />
                  {/* Central datum calibration circle */}
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="4" 
                    fill="var(--accent)" 
                  />
                  {/* Crosshair precision ticks */}
                  <line x1="12" y1="5" x2="12" y2="7" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="12" y1="17" x2="12" y2="19" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="5" y1="12" x2="7" y2="12" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="17" y1="12" x2="19" y2="12" stroke="var(--text-primary)" strokeWidth="1.5" />
                </svg>

                {/* Subtle pulsating center LED */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: '0 0 15px var(--accent)' }}
                />
              </div>

              {/* Wordmark */}
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-luxury-display text-sm sm:text-base font-black tracking-[0.22em] uppercase leading-none">
                    DATUM
                  </span>
                  <span 
                    className="font-serif italic text-xs font-normal transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    Atelier
                  </span>
                </div>
                <span 
                  className="text-[9px] font-mono-numbers tracking-widest uppercase block mt-0.5 opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Sovereign Vehicle Custody
                </span>
              </div>
            </Link>

            {/* Smart Search & Command Palette Trigger */}
            <div 
              onClick={handleSearchClick}
              className="hidden lg:flex items-center relative w-60 xl:w-72 cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 absolute left-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <div 
                className="w-full pl-8.5 pr-9 py-1.5 rounded-lg border text-xs transition font-sans flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-muted)'
                }}
              >
                <span className="truncate">Cars, passes, builds…</span>
                <span 
                  className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-void)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)'
                  }}
                >
                  ⌘K
                </span>
              </div>
            </div>

            {/* ── 2. REFINED NAVIGATION BUTTONS ── */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { to: '/', label: 'Feed' },
                { to: '/explore', label: 'Explore', icon: <Compass className="w-3.5 h-3.5" /> },
                { to: '/communities', label: 'Clubs', icon: <Users className="w-3.5 h-3.5" /> },
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: isActive ? 'var(--border-active)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                  })}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isActive ? 'font-bold shadow-xs' : 'hover:opacity-100 opacity-80'
                    }`
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              ))}

              {/* Garage Pro */}
              <NavLink
                to="/pro"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isActive ? 'var(--border-active)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                })}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isActive ? 'font-bold shadow-xs' : 'hover:opacity-100 opacity-80'
                  }`
                }
              >
                <Wrench className="w-3.5 h-3.5" />
                Pro
              </NavLink>

              {/* About / Case Study */}
              <NavLink
                to="/about"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isActive ? 'var(--border-active)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                })}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isActive ? 'font-bold shadow-xs' : 'hover:opacity-100 opacity-80'
                  }`
                }
              >
                <FileText className="w-3.5 h-3.5" />
                About
              </NavLink>
            </nav>
          </div>

          {/* ── 3. RIGHT SMART TOOLBAR CLUSTER ── */}
          <div className="flex items-center gap-2">
            
            {/* Live Privacy & Telemetry Cloak Beacon */}
            <button
              onClick={onOpenPrivacyCheck}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)'
              }}
              title="Zero-Knowledge 800m Residential Cloaking Active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xl:inline text-emerald-400 font-bold">800m Cloaked</span>
            </button>

            {/* Smart Typography Font Tuner Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsFontDropdownOpen(!isFontDropdownOpen); setIsThemeDropdownOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
                title="Smart Typography & Font Tuner"
              >
                <Type className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span className="hidden xl:inline text-[11px] font-mono-numbers capitalize">
                  {fontMode}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Font Dropdown Menu */}
              {isFontDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFontDropdownOpen(false)} />
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="px-3 py-2 border-b mb-1 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <Type className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        TYPOGRAPHY TUNER
                      </span>
                    </div>

                    <div className="space-y-1">
                      {[
                        { id: 'horlogerie' as FontMode, name: 'Haute Horlogerie', sub: 'Cinzel + Cormorant Garamond', fontClass: 'font-luxury-editorial' },
                        { id: 'modernist' as FontMode, name: 'Modernist Grotesk', sub: 'Plus Jakarta Sans + Inter', fontClass: 'font-sans' },
                        { id: 'technical' as FontMode, name: 'Technical Telemetry', sub: 'JetBrains Mono', fontClass: 'font-mono-numbers' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => handleFontChange(f.id)}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between gap-3 cursor-pointer"
                          style={{
                            backgroundColor: fontMode === f.id ? 'var(--bg-elevated)' : 'transparent',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <div>
                            <div className={`font-bold text-xs ${f.fontClass}`}>
                              {f.name}
                            </div>
                            <div className="text-[10px] opacity-60 font-mono-numbers mt-0.5">
                              {f.sub}
                            </div>
                          </div>
                          {fontMode === f.id && <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Atelier Luxury Palette Switcher Popover */}
            <div className="relative">
              <button
                onClick={() => { setIsThemeDropdownOpen(!isThemeDropdownOpen); setIsFontDropdownOpen(false); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
                title="Switch Atelier Luxury Palette (5 PTS Themes)"
              >
                {/* Active Theme Color Swatch Duo */}
                <div className="flex items-center -space-x-1">
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: themeMeta.bgHex }}
                  />
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: themeMeta.accentHex }}
                  />
                </div>

                <span className="hidden xl:inline text-[11px] font-mono-numbers font-medium truncate max-w-[110px]">
                  {themeMeta.name.split(' ')[0]}
                </span>

                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                  <div 
                    className="absolute right-0 mt-2 w-72 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="px-3 py-2 border-b mb-1 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        PTS COLOR PALETTE
                      </span>
                      <span className="text-[9px] font-mono-numbers px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border-subtle)' }}>
                        5 THEMES
                      </span>
                    </div>

                    <div className="space-y-1">
                      {(Object.keys(ATELIER_THEMES) as Theme[]).map((tKey) => {
                        const tMeta = ATELIER_THEMES[tKey];
                        const isSelected = theme === tKey;

                        return (
                          <button
                            key={tKey}
                            onClick={() => {
                              setTheme(tKey);
                              setIsThemeDropdownOpen(false);
                            }}
                            className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between gap-3 cursor-pointer"
                            style={{
                              backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                              border: isSelected ? '1px solid var(--border-active)' : '1px solid transparent',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center -space-x-1 shrink-0">
                                <div 
                                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                                  style={{ backgroundColor: tMeta.bgHex }}
                                />
                                <div 
                                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                                  style={{ backgroundColor: tMeta.accentHex }}
                                />
                              </div>

                              <div>
                                <div className="font-bold text-xs leading-tight">
                                  {tMeta.name}
                                </div>
                                <div className="text-[10px] opacity-60 font-mono-numbers mt-0.5 truncate max-w-[170px]">
                                  {tMeta.subtitle}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Splash replay */}
            {onOpenSplashScreen && (
              <button
                onClick={onOpenSplashScreen}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)'
                }}
                title="Atelier Engine Start"
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span>Atelier</span>
              </button>
            )}

            {/* Acoustic Valvetrain Atelier trigger */}
            {onOpenAcousticStudio && (
              <button
                onClick={onOpenAcousticStudio}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)'
                }}
                title="Acoustic Valvetrain DSP Atelier"
              >
                <Volume2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span>Acoustics</span>
              </button>
            )}

            {/* Mountain Pass Surface Grip Radar trigger */}
            {onOpenPassRadar && (
              <button
                onClick={onOpenPassRadar}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)'
                }}
                title="Pass Surface Grip & Weather Radar"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-500" />
                <span>Pass Radar</span>
              </button>
            )}

            {/* Quick Create Post Action */}
            <button
              onClick={() => onOpenCreatePost('post')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-numbers uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:scale-102"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#09090B'
              }}
            >
              <span>+ Log Drive</span>
            </button>

          </div>

        </div>
      </header>

      {/* Smart Command Palette Modal Overlay */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenSplashScreen={onOpenSplashScreen}
        onOpenAcousticStudio={onOpenAcousticStudio}
        onOpenPassRadar={onOpenPassRadar}
        onOpenTransitCarnet={onOpenTransitCarnet}
      />
    </>
  );
};
