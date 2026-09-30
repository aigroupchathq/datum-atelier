import { useState } from 'react';
import type { FC } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Shield, Plus, Search, Wrench, ChevronDown, Compass, Users, Sparkles, Volume2, Globe2, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenCreatePost: (initialMode?: 'post' | 'story') => void;
  onOpenPrivacyCheck: () => void;
  onOpenSplashScreen?: () => void;
  onOpenAcousticStudio?: () => void;
  onOpenPassRadar?: () => void;
  onOpenTransitCarnet?: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  onOpenCreatePost,
  onOpenPrivacyCheck,
  onOpenSplashScreen,
  onOpenAcousticStudio,
  onOpenPassRadar,
  onOpenTransitCarnet
}) => {
  const { isWhiteYellow, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    // Ref: Luxury automotive lookbook navigation
    <header className={`sticky top-0 z-40 h-14 flex items-center backdrop-blur-xl border-b px-4 lg:px-8 transition-colors duration-200 ${
      isWhiteYellow
        ? 'bg-white/95 border-zinc-200/90 shadow-xs text-zinc-900'
        : 'bg-[#09090B]/96 border-white/[0.06] text-zinc-100'
    }`}>
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-6">

        {/* ── BRAND ── */}
        <div className="flex items-center gap-7">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            {/* Wordmark mark — bespoke luxury atelier badge */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition shadow-sm ${
              isWhiteYellow
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border border-yellow-300 text-zinc-950 shadow-yellow-500/20 group-hover:scale-105'
                : 'bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/20 text-white shadow-inner group-hover:border-white/40'
            }`}>
              <span className="font-luxury-display text-xs font-bold">G</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-luxury-display text-xs sm:text-sm font-bold tracking-[0.2em] uppercase leading-none transition-colors ${
                isWhiteYellow ? 'text-zinc-950' : 'text-[#F4F4F5]'
              }`}>
                GARAGE
              </span>
              <span className={`text-[9px] font-mono-numbers tracking-widest uppercase block mt-0.5 ${
                isWhiteYellow ? 'text-yellow-700 font-semibold' : 'text-zinc-400'
              }`}>
                Sovereign Automobile Atelier
              </span>
            </div>
          </Link>

          {/* Search — minimal, icon-left */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-60 xl:w-72">
            <Search className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cars, routes, builds, communities…"
              className={`w-full pl-8.5 pr-9 py-1.5 rounded-lg border text-xs transition font-sans ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-yellow-500 focus:bg-white'
                  : 'bg-[#1C1C1F] border-white/[0.07] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/[0.15] focus:bg-[#252528]'
              }`}
            />
            <span className={`absolute right-2.5 text-[10px] font-mono-numbers px-1.5 py-0.5 rounded border ${
              isWhiteYellow ? 'bg-zinc-200 text-zinc-600 border-zinc-300' : 'bg-[#28282D] text-zinc-500 border-white/[0.07]'
            }`}>
              ⌘K
            </span>
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { to: '/', label: 'Feed' },
              { to: '/explore', label: 'Explore', icon: <Compass className="w-3.5 h-3.5" /> },
              { to: '/communities', label: 'Clubs', icon: <Users className="w-3.5 h-3.5" /> },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? isWhiteYellow 
                        ? 'text-zinc-950 font-bold bg-yellow-400/20 border border-yellow-400/40 shadow-xs' 
                        : 'text-white bg-white/[0.08]'
                      : isWhiteYellow 
                        ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
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
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isWhiteYellow 
                      ? 'text-zinc-950 font-bold bg-yellow-400/20 border border-yellow-400/40 shadow-xs' 
                      : 'text-white bg-white/[0.08]'
                    : isWhiteYellow 
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100' 
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <Wrench className="w-3.5 h-3.5" />
              Pro
            </NavLink>

            {/* About / Case Study */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isWhiteYellow 
                      ? 'text-zinc-950 font-bold bg-yellow-400/20 border border-yellow-400/40 shadow-xs' 
                      : 'text-white bg-white/[0.08]'
                    : isWhiteYellow 
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100' 
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <FileText className="w-3.5 h-3.5" />
              About
            </NavLink>
          </nav>
        </div>

        {/* ── RIGHT CLUSTER ── */}
        <div className="flex items-center gap-2">
          {/* Theme switcher toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isWhiteYellow
                ? 'bg-yellow-50 border-yellow-300/80 text-yellow-900 hover:bg-yellow-100 shadow-xs'
                : 'bg-[#1C1C1F] border-white/[0.07] text-zinc-400 hover:text-yellow-400 hover:border-yellow-500/30'
            }`}
            title={isWhiteYellow ? 'Switch to Obsidian Dark' : 'Switch to White & Yellow'}
          >
            {isWhiteYellow ? (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                <span className="hidden xl:inline text-[11px] font-mono-numbers font-bold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden xl:inline text-[11px] font-mono-numbers">Dark</span>
              </>
            )}
          </button>

          {/* Splash replay */}
          {onOpenSplashScreen && (
            <button
              onClick={onOpenSplashScreen}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
                  : 'bg-[#1C1C1F] border-white/[0.07] hover:border-white/[0.14] text-zinc-400 hover:text-zinc-200'
              }`}
              title="Atelier Splash Screen"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
              <span>Atelier</span>
            </button>
          )}

          {/* Acoustic Valvetrain Atelier trigger */}
          {onOpenAcousticStudio && (
            <button
              onClick={onOpenAcousticStudio}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-yellow-700 hover:border-yellow-400/60 hover:bg-yellow-50/50'
                  : 'bg-[#1C1C1F] border-white/[0.07] hover:border-amber-500/30 text-zinc-400 hover:text-amber-300'
              }`}
              title="Acoustic Valvetrain Atelier"
            >
              <Volume2 className="w-3.5 h-3.5 text-yellow-600" />
              <span>Acoustics</span>
            </button>
          )}

          {/* Mountain Pass Surface Grip Radar trigger */}
          {onOpenPassRadar && (
            <button
              onClick={onOpenPassRadar}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-cyan-700 hover:border-cyan-400/60 hover:bg-cyan-50/50'
                  : 'bg-[#1C1C1F] border-white/[0.07] hover:border-cyan-500/30 text-zinc-400 hover:text-cyan-300'
              }`}
              title="Pass Surface Grip & Weather Radar"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
              <span>Pass Radar</span>
            </button>
          )}

          {/* Cross-Border ATA Carnet trigger */}
          {onOpenTransitCarnet && (
            <button
              onClick={onOpenTransitCarnet}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-emerald-700 hover:border-emerald-400/60 hover:bg-emerald-50/50'
                  : 'bg-[#1C1C1F] border-white/[0.07] hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-300'
              }`}
              title="Cross-Border Transit & ATA Carnet Logistics"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Carnet</span>
            </button>
          )}

          {/* Privacy shield — emerald, subtle */}
          <button
            onClick={onOpenPrivacyCheck}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono-numbers transition ${
              isWhiteYellow
                ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-emerald-700 hover:border-emerald-400/60 hover:bg-emerald-50/50'
                : 'bg-[#1C1C1F] border-white/[0.07] hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-300'
            }`}
            title="Privacy Shield Active"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">Protected</span>
          </button>

          {/* Record CTA — Racing Yellow in light theme, Crisp white in obsidian */}
          <button
            onClick={() => onOpenCreatePost('post')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95 ${
              isWhiteYellow
                ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border border-yellow-500/40 shadow-yellow-500/20'
                : 'bg-white hover:bg-zinc-100 text-[#09090B]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Record</span>
          </button>

          {/* Vehicle Fleet Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border transition group ${
                isWhiteYellow
                  ? 'bg-zinc-100 border-zinc-200 hover:border-yellow-400 text-zinc-900'
                  : 'bg-[#1C1C1F] border-white/[0.07] hover:border-amber-500/30 text-zinc-200'
              }`}
            >
              <img
                src="/real_uk_m3_cottage.jpg"
                alt="Active Vehicle"
                className="w-6 h-6 rounded-md object-cover border border-zinc-300"
              />
              <span className={`text-xs font-bold hidden sm:block font-luxury-display ${
                isWhiteYellow ? 'text-zinc-900' : 'text-zinc-200'
              }`}>
                MAYA
              </span>
              <ChevronDown className={`w-3 h-3 transition ${
                isWhiteYellow ? 'text-zinc-500 group-hover:text-yellow-600' : 'text-zinc-500 group-hover:text-amber-400'
              }`} />
            </button>

            {isCarDropdownOpen && (
              <>
                {/* Backdrop dismiss */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCarDropdownOpen(false)}
                />
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isWhiteYellow
                    ? 'bg-white border-zinc-200 shadow-2xl text-zinc-900'
                    : 'bg-[#14151B] border-amber-500/20 shadow-2xl text-zinc-100'
                }`}>
                  <div className={`px-3 py-2 border-b mb-1.5 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.07]'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-luxury-display tracking-wider text-xs uppercase font-bold ${
                        isWhiteYellow ? 'text-zinc-900' : 'text-amber-300'
                      }`}>
                        Atelier Stable
                      </span>
                      <span className={`text-[9px] font-mono-numbers px-1.5 py-0.5 rounded font-bold ${
                        isWhiteYellow
                          ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        4 VEHICLES
                      </span>
                    </div>
                  </div>

                  {/* Fleet Switch List */}
                  <div className="space-y-1">
                    {[
                      { id: 'car-maya-m3', name: 'MAYA', model: 'BMW M3 Competition (G80)', img: '/real_uk_m3_cottage.jpg', plate: 'LJ23 WXY' },
                      { id: 'car-kuro-gt3', name: 'KURO', model: 'Porsche 911 GT3 Touring', img: '/real_uk_gt3_suburb.jpg', plate: 'GT03 TOU' },
                      { id: 'car-e30-retromod', name: 'RETRO MOD', model: 'BMW 318is Slicktop (E30)', img: '/real_uk_e30_terrace.jpg', plate: 'H318 REK' },
                      { id: 'car-expedition-110', name: 'EXPEDITION', model: 'Land Rover Defender 110', img: '/real_uk_defender_farm.jpg', plate: 'YD20 DEF' },
                    ].map((car) => (
                      <Link
                        key={car.id}
                        to={`/car/${car.id}`}
                        onClick={() => setIsCarDropdownOpen(false)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl transition group ${
                          isWhiteYellow ? 'hover:bg-zinc-100' : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        <img 
                          src={car.img} 
                          alt={car.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-zinc-200 group-hover:border-yellow-500/50" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold font-luxury-display transition ${
                              isWhiteYellow ? 'text-zinc-900 group-hover:text-yellow-600' : 'text-white group-hover:text-amber-300'
                            }`}>
                              {car.name}
                            </span>
                            <span className="text-[9px] font-mono-numbers text-zinc-500">
                              {car.plate}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            {car.model}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className={`border-t mt-2 pt-1.5 space-y-0.5 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.07]'}`}>
                    {onOpenPassRadar && (
                      <button
                        onClick={() => { setIsCarDropdownOpen(false); onOpenPassRadar(); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                          isWhiteYellow ? 'text-cyan-700 hover:bg-cyan-50' : 'text-cyan-400/90 hover:text-cyan-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="font-luxury-display text-[11px] tracking-wider">Pass Surface Grip Radar</span>
                        <Compass className="w-3.5 h-3.5 text-cyan-500" />
                      </button>
                    )}
                    {onOpenAcousticStudio && (
                      <button
                        onClick={() => { setIsCarDropdownOpen(false); onOpenAcousticStudio(); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                          isWhiteYellow ? 'text-yellow-700 hover:bg-yellow-50' : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="font-luxury-display text-[11px] tracking-wider">Acoustic Harmonics Lab</span>
                        <Volume2 className="w-3.5 h-3.5 text-yellow-600" />
                      </button>
                    )}
                    {onOpenSplashScreen && (
                      <button
                        onClick={() => { setIsCarDropdownOpen(false); onOpenSplashScreen(); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                          isWhiteYellow ? 'text-yellow-800 hover:bg-yellow-50' : 'text-amber-400/80 hover:text-amber-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="font-luxury-display text-[11px] tracking-wider">Atelier Experience</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                      </button>
                    )}
                    <button
                      onClick={() => { setIsCarDropdownOpen(false); onOpenPrivacyCheck(); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        isWhiteYellow ? 'text-emerald-700 hover:bg-emerald-50' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Sovereign Privacy Enclave</span>
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
