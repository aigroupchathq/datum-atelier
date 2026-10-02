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
  Type,
  ShieldCheck,
  Menu,
  X,
  Layers,
  Radio,
  FileCheck2
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
  onOpenBackendInspector?: () => void;
  onOpenArchitecturalChamber?: () => void;
  onOpenWorkshopStamping?: () => void;
}

export type FontMode = 'horlogerie' | 'modernist' | 'technical';

export const Navbar: FC<NavbarProps> = ({
  onOpenCreatePost,
  onOpenPrivacyCheck,
  onOpenSplashScreen,
  onOpenAcousticStudio,
  onOpenPassRadar,
  onOpenTransitCarnet,
  onOpenBackendInspector,
  onOpenArchitecturalChamber,
  onOpenWorkshopStamping
}) => {
  const { theme, setTheme, themeMeta } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isStudioHubOpen, setIsStudioHubOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const closeAllDropdowns = () => {
    setIsThemeDropdownOpen(false);
    setIsFontDropdownOpen(false);
    setIsStudioHubOpen(false);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR: 56PX (LAPTOP) / 48PX (MOBILE)         */}
      {/* ========================================================= */}
      <header
        className="sticky top-0 z-40 h-12 md:h-14 flex items-center backdrop-blur-xl border-b px-4 lg:px-6 transition-all duration-300 select-none"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">

          {/* ───────────────────────────────────────────────────────── */}
          {/* 1. LEFT ZONE: BRAND EMBLEM & DESKTOP NAV LINKS            */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-5 lg:gap-7 shrink-0">
            {/* Logo Anchor */}
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Precision Engineering Diamond Mark */}
              <div
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-void)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <svg className="w-5 h-5 md:w-5.5 md:h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon
                    points="12,2 22,12 12,22 2,12"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="var(--bg-surface)"
                  />
                  <circle cx="12" cy="12" r="3.5" fill="var(--accent)" />
                  <line x1="12" y1="5" x2="12" y2="7" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="12" y1="17" x2="12" y2="19" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="5" y1="12" x2="7" y2="12" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <line x1="17" y1="12" x2="19" y2="12" stroke="var(--text-primary)" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Wordmark */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="font-luxury-display text-sm md:text-base font-black tracking-[0.22em] uppercase">
                    DATUM
                  </span>
                  <span className="font-serif italic text-xs font-normal" style={{ color: 'var(--accent)' }}>
                    Atelier
                  </span>
                </div>
                <span className="text-[8px] font-mono-numbers tracking-widest uppercase opacity-60 hidden sm:block mt-0.5">
                  Vehicle Custody
                </span>
              </div>
            </Link>

            {/* Primary Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { to: '/', label: 'Feed' },
                { to: '/explore', label: 'Explore', icon: <Compass className="w-3.5 h-3.5" /> },
                { to: '/communities', label: 'Clubs', icon: <Users className="w-3.5 h-3.5" /> },
                { to: '/pro', label: 'Pro', icon: <Wrench className="w-3.5 h-3.5" /> },
                { to: '/about', label: 'About', icon: <FileText className="w-3.5 h-3.5" /> },
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: isActive ? 'var(--border-default)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  })}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      isActive ? 'font-bold shadow-xs' : 'hover:opacity-100 opacity-80'
                    }`
                  }
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 2. CENTER ZONE: REFINED SEARCH COMMAND PILL               */}
          {/* ───────────────────────────────────────────────────────── */}
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center relative flex-1 max-w-sm xl:max-w-md mx-4 cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 absolute left-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            <div
              className="w-full pl-8.5 pr-3 py-1.5 rounded-full border text-xs transition font-sans flex items-center justify-between shadow-xs"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-muted)',
              }}
            >
              <span className="truncate">Search vehicles, passes, telemetry…</span>
              <span
                className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded border ml-2"
                style={{
                  backgroundColor: 'var(--bg-void)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                ⌘K
              </span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 3. RIGHT ZONE: REFINED UTILITY TOOLBAR & ATELIER SUITES   */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Mobile Search Icon Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="md:hidden p-2 rounded-lg border text-zinc-400 hover:text-white transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 800m Privacy Beacon (Subtle Dot Indicator) */}
            <button
              onClick={onOpenPrivacyCheck}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              title="Home Privacy (800m Radius Protected)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xl:inline text-emerald-400 font-bold">800m Protected</span>
            </button>

            {/* ── ATELIER STUDIO SUITES FLYOUT (Unifies 6 Tools Cleanly) ── */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStudioHubOpen(!isStudioHubOpen);
                  setIsThemeDropdownOpen(false);
                  setIsFontDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer"
                style={{
                  backgroundColor: isStudioHubOpen ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isStudioHubOpen ? 'var(--accent)' : 'var(--border-subtle)',
                  color: isStudioHubOpen ? 'var(--accent)' : 'var(--text-primary)',
                }}
                title="Atelier Tools & Diagnostics"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-xs font-mono-numbers">Suites</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isStudioHubOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Atelier Suites Popover Menu */}
              {isStudioHubOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="px-3 py-2 border-b mb-1 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold flex items-center gap-1.5 text-zinc-400">
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        ATELIER WORKSHOP & LABS
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* Chamber Designer */}
                      {onOpenArchitecturalChamber && (
                        <button
                          onClick={() => { onOpenArchitecturalChamber(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            <Wrench className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Chamber Designer</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Showroom lighting, finishes & acoustics</div>
                          </div>
                        </button>
                      )}

                      {/* Pass Radar */}
                      {onOpenPassRadar && (
                        <button
                          onClick={() => { onOpenPassRadar(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                            <Compass className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Pass Grip Radar</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Alpine pass road grip & live weather</div>
                          </div>
                        </button>
                      )}

                      {/* Acoustic Studio */}
                      {onOpenAcousticStudio && (
                        <button
                          onClick={() => { onOpenAcousticStudio(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shrink-0">
                            <Volume2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Exhaust Sound Studio</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Engine sound & valvetrain acoustics</div>
                          </div>
                        </button>
                      )}

                      {/* ATA Carnet */}
                      {onOpenTransitCarnet && (
                        <button
                          onClick={() => { onOpenTransitCarnet(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>ATA Carnet Transit</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Cross-border travel customs pass</div>
                          </div>
                        </button>
                      )}

                      {/* Workshop Stamping Desk */}
                      {onOpenWorkshopStamping && (
                        <button
                          onClick={() => { onOpenWorkshopStamping(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Workshop Stamping Desk</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Mechanic digital service seals (£49/mo)</div>
                          </div>
                        </button>
                      )}

                      {/* Backend Inspector */}
                      {onOpenBackendInspector && (
                        <button
                          onClick={() => { onOpenBackendInspector(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                            <Radio className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Vehicle Telemetry Ledger</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">CAN bus telemetry & service ledger</div>
                          </div>
                        </button>
                      )}

                      {/* Splash Engine Start */}
                      {onOpenSplashScreen && (
                        <button
                          onClick={() => { onOpenSplashScreen(); closeAllDropdowns(); }}
                          className="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center gap-3 hover:bg-white/5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>Starter Ignition</div>
                            <div className="text-[10px] text-zinc-400 font-mono-numbers">Starter motor crank & exhaust flare</div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Typography Tuner Trigger */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setIsFontDropdownOpen(!isFontDropdownOpen);
                  setIsThemeDropdownOpen(false);
                  setIsStudioHubOpen(false);
                }}
                className="p-2 rounded-lg border text-xs transition cursor-pointer"
                style={{
                  backgroundColor: isFontDropdownOpen ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isFontDropdownOpen ? 'var(--accent)' : 'var(--border-subtle)',
                  color: isFontDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                }}
                title="Typography Style"
              >
                <Type className="w-3.5 h-3.5" />
              </button>

              {/* Font Dropdown */}
              {isFontDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="px-3 py-2 border-b mb-1 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold flex items-center gap-1.5 text-zinc-400">
                        <Type className="w-3.5 h-3.5 text-amber-500" />
                        TYPOGRAPHY STYLE
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
                            color: 'var(--text-primary)',
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
                          {fontMode === f.id && <Check className="w-4 h-4 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PTS Color Palette Switcher Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  setIsFontDropdownOpen(false);
                  setIsStudioHubOpen(false);
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg border text-xs transition cursor-pointer"
                style={{
                  backgroundColor: isThemeDropdownOpen ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isThemeDropdownOpen ? 'var(--accent)' : 'var(--border-subtle)',
                }}
                title="PTS Luxury Color Palettes (5 Themes)"
              >
                <div className="flex items-center -space-x-1">
                  <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: themeMeta.bgHex }} />
                  <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: themeMeta.accentHex }} />
                </div>
              </button>

              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="px-3 py-2 border-b mb-1 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="text-[10px] font-mono-numbers uppercase tracking-widest font-bold flex items-center gap-1.5 text-zinc-400">
                        <Palette className="w-3.5 h-3.5 text-amber-500" />
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
                              border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center -space-x-1 shrink-0">
                                <div className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: tMeta.bgHex }} />
                                <div className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: tMeta.accentHex }} />
                              </div>
                              <div>
                                <div className="font-bold text-xs">{tMeta.name}</div>
                                <div className="text-[9px] opacity-60 font-mono-numbers mt-0.5 truncate max-w-[170px]">
                                  {tMeta.subtitle}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Action Button: + Log Drive */}
            <button
              onClick={() => onOpenCreatePost('post')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono-numbers uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs hover:scale-102 shrink-0"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#09090B',
              }}
            >
              <span>+ Log</span>
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border text-zinc-400 hover:text-white transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
              aria-label="Toggle Mobile Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE SLIDE-DOWN DRAWER (PHONE COMPANION)                */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-12 z-30 border-b backdrop-blur-2xl shadow-2xl p-5 space-y-5 animate-in slide-in-from-top-2 duration-200"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Navigation Route Links */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { to: '/', label: 'Feed', icon: <Compass className="w-4 h-4" /> },
              { to: '/explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
              { to: '/communities', label: 'Clubs', icon: <Users className="w-4 h-4" /> },
              { to: '/pro', label: 'Pro', icon: <Wrench className="w-4 h-4" /> },
              { to: '/about', label: 'About', icon: <FileText className="w-4 h-4" /> },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Quick Studio Suite Triggers */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 font-bold block">
              Atelier Tools & Labs:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers">
              {onOpenArchitecturalChamber && (
                <button
                  onClick={() => { onOpenArchitecturalChamber(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl border flex items-center gap-2 hover:bg-white/5 text-left"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chamber Designer</span>
                </button>
              )}
              {onOpenPassRadar && (
                <button
                  onClick={() => { onOpenPassRadar(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl border flex items-center gap-2 hover:bg-white/5 text-left"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Pass Radar</span>
                </button>
              )}
              {onOpenAcousticStudio && (
                <button
                  onClick={() => { onOpenAcousticStudio(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl border flex items-center gap-2 hover:bg-white/5 text-left"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Volume2 className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Sound Studio</span>
                </button>
              )}
              {onOpenBackendInspector && (
                <button
                  onClick={() => { onOpenBackendInspector(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl border flex items-center gap-2 hover:bg-white/5 text-left"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Radio className="w-3.5 h-3.5 text-pink-500" />
                  <span>Telemetry</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Command Palette Modal Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenSplashScreen={onOpenSplashScreen}
        onOpenAcousticStudio={onOpenAcousticStudio}
        onOpenPassRadar={onOpenPassRadar}
        onOpenTransitCarnet={onOpenTransitCarnet}
        onOpenArchitecturalChamber={onOpenArchitecturalChamber}
      />
    </>
  );
};
