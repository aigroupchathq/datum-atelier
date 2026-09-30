import { useState, useRef, useCallback } from 'react';
import type { FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ChevronRight, 
  Power, 
  MapPin,
  SlidersHorizontal,
  Compass,
  FileCheck2
} from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  carName?: string;
  carModel?: string;
}

export type GarageLightingMood = 'overcast' | 'dusk' | 'stealth';

export type PersonaId = 'maya' | 'kuro' | 'dan' | 'expedition';

interface GaragePersona {
  id: PersonaId;
  name: string;
  badgeLabel: string;
  make: string;
  model: string;
  chassis: string;
  location: string;
  colorName: string;
  power: string;
  engine: string;
  setup: string;
  mileage: string;
  healthScore: number;
  hash: string;
  imageSrc: string;
  accentColor: string;
}

const GARAGE_PERSONAS: Record<PersonaId, GaragePersona> = {
  maya: {
    id: 'maya',
    name: 'MAYA',
    badgeLabel: 'M3 (G80)',
    make: 'BMW M Atelier',
    model: 'M3 Competition xDrive',
    chassis: 'G80 Saloon • Sovereign Custody',
    location: 'Cotswolds Stone Cottage Driveway',
    colorName: 'Isle of Man Green Metallic',
    power: '510 BHP • 650 Nm',
    engine: '3.0L S58 Twin-Turbocharged Inline-6',
    setup: 'KW Variant 4 3-Way Coilovers • Michelin PS4S',
    mileage: '42,184 miles',
    healthScore: 98,
    hash: 'DVSA-GB-9821-M3',
    imageSrc: '/real_uk_m3_cottage.jpg',
    accentColor: '#34D399' // Racing emerald green
  },
  kuro: {
    id: 'kuro',
    name: 'KURO',
    badgeLabel: 'GT3 Touring',
    make: 'Porsche Weissach',
    model: '911 GT3 Touring (992)',
    chassis: '992.1 Coupé • 6-Speed GT Manual',
    location: 'Surrey Semi-Detached Block-Paved Drive',
    colorName: 'Crayon / Chalk Grey',
    power: '502 BHP • 9,000 RPM Redline',
    engine: '4.0L Naturally Aspirated Boxer-6',
    setup: 'Mobil 1 ESP X3 • Michelin Pilot Sport Cup 2',
    mileage: '18,400 miles',
    healthScore: 99,
    hash: 'DVSA-GB-4019-GT3',
    imageSrc: '/real_uk_gt3_suburb.jpg',
    accentColor: '#D4AF37' // Posh champagne gold
  },
  dan: {
    id: 'dan',
    name: 'RETRO MOD',
    badgeLabel: 'E30 318is',
    make: 'BMW Classic Heritage',
    model: '318is Slicktop (E30)',
    chassis: 'E30 Coupé • 1989 Analog Survivor',
    location: 'Victorian Terraced Street, Bristol',
    colorName: 'Brilliant Red (Brilliantrot)',
    power: '136 BHP • M42 Twin-Cam',
    engine: '1.8L 16V M42 Naturally Aspirated I4',
    setup: 'Period BBS Basketweaves • Bilstein B12 Damper Kit',
    mileage: '118,500 miles',
    healthScore: 94,
    hash: 'DVSA-GB-1989-E30',
    imageSrc: '/real_uk_e30_terrace.jpg',
    accentColor: '#F87171' // Classic vintage crimson
  },
  expedition: {
    id: 'expedition',
    name: 'EXPEDITION',
    badgeLabel: 'Defender 110',
    make: 'Solihull Special Operations',
    model: 'Defender 110 P400 SE',
    chassis: 'L663 Monocoque • Terrain Response 2',
    location: 'Yorkshire Dales Stone Barn Farmstead',
    colorName: 'Pangea Green with White Contrast Roof',
    power: '400 BHP • 550 Nm',
    engine: '3.0L Turbocharged Ingenium MHEV I6',
    setup: 'BFGoodrich KO2 All-Terrain • 900mm Wading Suspension',
    mileage: '31,200 miles',
    healthScore: 97,
    hash: 'DVSA-GB-6631-DEF',
    imageSrc: '/real_uk_defender_farm.jpg',
    accentColor: '#A3E635' // Slate olive / field green
  }
};

export const SplashScreen: FC<SplashScreenProps> = ({ onEnter }) => {
  const [activePersona, setActivePersona] = useState<PersonaId>('maya');
  const [lightingMood, setLightingMood] = useState<GarageLightingMood>('overcast');
  const [isStartingEngine, setIsStartingEngine] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') === 'true';
  });
  const [skipNextTime, setSkipNextTime] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_skip') === 'true';
  });

  // Mouse-move parallax refs
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!parallaxRef.current) { rafRef.current = null; return; }
      const rect = parallaxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * 10;
      const dy = ((e.clientY - cy) / rect.height) * 10;
      parallaxRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (parallaxRef.current) {
      parallaxRef.current.style.transform = 'translate(0px, 0px) scale(1.03)';
    }
  }, []);

  const car = GARAGE_PERSONAS[activePersona];

  // Web Audio engine cold start synthesis
  const playIgnitionSound = () => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(42, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(175, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.9);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.35);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.1);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleStartEngine = () => {
    setIsStartingEngine(true);
    playIgnitionSound();

    localStorage.setItem('garage_splash_audio', String(audioEnabled));
    localStorage.setItem('garage_splash_skip', String(skipNextTime));

    setTimeout(() => {
      onEnter();
    }, 650);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isStartingEngine ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      } bg-[#0A0B0E] text-zinc-100 font-sans`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ========================================================= */}
      {/* 1. REALISTIC CANDID EUROPEAN/UK DOMESTIC BACKDROP         */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        
        {/* Parallax wrapper — smooth mouse perspective */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ 
            transform: 'scale(1.03)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={car.imageSrc}
            alt={`${car.name} parked at ${car.location}`}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              isStartingEngine ? 'scale-105 filter brightness-110' : 'scale-100'
            }`}
          />
        </div>

        {/* Ambient lighting mood tint over the realistic scene */}
        <div 
          className="absolute inset-0 transition-all duration-700 pointer-events-none"
          style={{
            background: lightingMood === 'overcast' 
              ? 'radial-gradient(circle at 50% 30%, rgba(220, 230, 242, 0.12) 0%, transparent 70%)'
              : lightingMood === 'dusk'
              ? 'radial-gradient(circle at 60% 85%, rgba(212, 175, 55, 0.2) 0%, transparent 65%)'
              : 'rgba(0, 0, 0, 0.35)'
          }}
        />

        {/* Minimalist Editorial Matte Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/60 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E]/80 via-transparent to-[#0A0B0E]/70 pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 2. MINIMALIST & POSH ATELIER TOP HEADER                   */}
      {/* ========================================================= */}
      <div className="relative z-10 px-5 sm:px-10 py-5 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-md bg-black/30">
        
        {/* Understated Wordmark */}
        <div className="flex items-center gap-3.5">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs tracking-widest transition-all bg-white/[0.06] border border-white/20 text-white"
          >
            G
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span 
                className="font-bold text-sm tracking-[0.35em] text-white uppercase"
              >
                GARAGE
              </span>
              <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 font-semibold tracking-widest uppercase border border-white/[0.08]">
                SOVEREIGN ATELIER
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono-numbers tracking-wider uppercase mt-0.5">
              Private Residential Registry • Plates Cloaked
            </p>
          </div>
        </div>

        {/* Right Navigation & Persona Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Persona Selection Pills */}
          <div className="hidden sm:flex items-center p-1 rounded-full bg-black/60 border border-white/[0.1] text-[11px] font-mono-numbers backdrop-blur-md">
            {(Object.keys(GARAGE_PERSONAS) as PersonaId[]).map((pKey) => {
              const p = GARAGE_PERSONAS[pKey];
              const isSelected = activePersona === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setActivePersona(pKey)}
                  className={`px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                    isSelected
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p.badgeLabel}
                </button>
              );
            })}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="px-3 py-1.5 rounded-full bg-black/50 border border-white/[0.12] hover:border-white/30 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono-numbers backdrop-blur-md"
            title={audioEnabled ? 'Tactile Cold Start Audio ON' : 'Audio Muted'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Ignition Note</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden md:inline">Muted</span>
              </>
            )}
          </button>

          {/* Instant Enter / Bypass */}
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 hover:text-white text-xs font-mono-numbers transition border border-white/[0.1] backdrop-blur-md"
          >
            <span>Enter Registry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CENTER / LOWER CONTENT DOSSIER                         */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 py-6 flex flex-col justify-between flex-1 min-h-[calc(100vh-140px)]">
        
        {/* Top Status Pill: Subtle & Posh */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-white/[0.1] backdrop-blur-md text-xs font-mono-numbers">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.accentColor }} />
            <span className="text-zinc-300 font-medium tracking-wide uppercase">
              RESIDENCE: {car.location}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              800m GEOFENCE ACTIVE
            </span>
          </div>
        </div>

        {/* Lower Row: Vehicle Atelier Dossier (Left) & Minimalist Push-to-Start (Right) */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 pt-10 pb-4">
          
          {/* Posh Minimalist Vehicle Dossier */}
          <div 
            className="p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-white/[0.12] backdrop-blur-2xl shadow-2xl max-w-lg w-full space-y-4"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-numbers tracking-widest text-zinc-400 uppercase">
                  {car.make}
                </span>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3" />
                  {car.healthScore}% HEALTH
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
                {car.name}
              </h2>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">
                {car.model}
              </p>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5 font-mono-numbers">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{car.location}</span>
              </div>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers pt-2 border-t border-white/[0.08]">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 block uppercase">Finish</span>
                <span className="text-zinc-200 text-xs font-semibold truncate block mt-0.5">
                  {car.colorName}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 block uppercase">Powertrain</span>
                <span className="text-white text-xs font-bold block mt-0.5" style={{ color: car.accentColor }}>
                  {car.power}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] col-span-2">
                <span className="text-[10px] text-zinc-500 block uppercase">Chassis & Setup</span>
                <span className="text-zinc-300 text-[11px] block truncate mt-0.5">
                  {car.setup}
                </span>
              </div>
            </div>

            {/* DVSA Hash & Logged Mileage */}
            <div className="flex items-center justify-between text-[11px] font-mono-numbers pt-1 border-t border-white/[0.08] text-zinc-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-zinc-500" />
                DVSA REF: {car.hash}
              </span>
              <span className="text-zinc-300 font-semibold">{car.mileage}</span>
            </div>
          </div>

          {/* Minimalist Posh Push-to-Start Engine Switch */}
          <div className="flex flex-col items-center gap-4 w-full lg:w-auto text-center">
            
            <button
              onClick={handleStartEngine}
              disabled={isStartingEngine}
              className="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-3 transition-all duration-300 transform active:scale-95 focus:outline-none"
              style={{
                background: 'radial-gradient(circle, #1F232B 0%, #0A0B0E 100%)',
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)`
              }}
            >
              {/* Brushed Titanium Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-white/20 transition-all duration-500 group-hover:border-white/40 group-hover:scale-105"
                style={{
                  boxShadow: `0 0 20px ${car.accentColor}33`
                }}
              />

              {/* Discreet Accent Indicator Halo */}
              <div 
                className="absolute inset-1 rounded-full border border-dashed opacity-40 animate-spin"
                style={{ borderColor: car.accentColor, animationDuration: '30s' }}
              />

              {/* Button Core */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <Power className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] font-mono-numbers font-bold uppercase tracking-widest text-zinc-300">
                  ENGINE
                </span>
                <span 
                  className="text-xs font-black uppercase tracking-wider group-hover:text-white transition-colors"
                  style={{ color: car.accentColor }}
                >
                  START
                </span>
                <span className="text-[9px] font-mono-numbers text-zinc-500 uppercase tracking-widest mt-0.5">
                  STOP
                </span>
              </div>
            </button>

            {/* Instruction Callout */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-white tracking-widest uppercase block font-mono-numbers">
                PRESS TO DISENGAGE CLOAK & DRIVE OUT
              </span>
              <span className="text-[11px] text-zinc-400 font-mono-numbers block">
                Cold-start exhaust tone • Seamless transition to Paddock
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. REFINED EDITORIAL FOOTER                               */}
      {/* ========================================================= */}
      <div className="relative z-10 px-5 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-numbers text-zinc-400 border-t border-white/[0.08] bg-black/40 backdrop-blur-md">
        <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200 transition">
          <input
            type="checkbox"
            checked={skipNextTime}
            onChange={(e) => setSkipNextTime(e.target.checked)}
            className="rounded bg-black border-zinc-700 text-zinc-300 focus:ring-0"
          />
          <span>Remember choice & skip atelier splash on next launch</span>
        </label>

        {/* Ambient Mood Switcher */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">Atmosphere:</span>
          <button 
            onClick={() => setLightingMood('overcast')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
              lightingMood === 'overcast' 
                ? 'bg-white/[0.15] text-white border border-white/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            British Overcast
          </button>
          <button 
            onClick={() => setLightingMood('dusk')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
              lightingMood === 'dusk' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Cotswolds Dusk
          </button>
          <button 
            onClick={() => setLightingMood('stealth')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
              lightingMood === 'stealth' 
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Stealth Monochrome
          </button>
        </div>

        <button 
          onClick={handleStartEngine} 
          className="text-zinc-200 hover:text-white hover:underline font-semibold"
        >
          Enter Paddock Feed →
        </button>
      </div>

    </div>
  );
};
