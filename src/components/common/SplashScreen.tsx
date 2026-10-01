import { useState, useRef, useCallback } from 'react';
import type { FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Power, 
  Zap
} from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  carName?: string;
  carModel?: string;
}

export type PersonaId = 'maya' | 'kuro' | 'sanctuary' | 'dan' | 'vault';

interface VehiclePersona {
  id: PersonaId;
  name: string;
  badgeLabel: string;
  make: string;
  model: string;
  chassisCode: string;
  engine: string;
  power: string;
  torque: string;
  redlineRpm: number;
  idleRpm: number;
  paintName: string;
  location: string;
  weather: string;
  tempC: number;
  frictionMu: number;
  imageSrc: string;
}

const VEHICLES: Record<PersonaId, VehiclePersona> = {
  maya: {
    id: 'maya',
    name: 'MAYA',
    badgeLabel: 'M3 Competition',
    make: 'BMW M Motorsport',
    model: 'M3 Competition xDrive (G80)',
    chassisCode: 'CHASSIS // WBS-G80-COMP-UK',
    engine: '3.0L S58 Twin-Turbo Inline-6',
    power: '510 BHP',
    torque: '650 Nm',
    redlineRpm: 7200,
    idleRpm: 750,
    paintName: 'Isle of Man Green Metallic',
    location: 'Cotswolds Cotswold Stone Driveway',
    weather: 'Damp Bitumen • Morning Mist',
    tempC: 7.2,
    frictionMu: 0.78,
    imageSrc: '/real_uk_m3_cottage.jpg'
  },
  kuro: {
    id: 'kuro',
    name: 'KURO',
    badgeLabel: 'GT3 Touring',
    make: 'Porsche Motorsport',
    model: '911 GT3 Touring (992.1)',
    chassisCode: 'CHASSIS // WP0-992-GT3-WEISSACH',
    engine: '4.0L Naturally Aspirated Boxer-6',
    power: '502 BHP',
    torque: '470 Nm',
    redlineRpm: 9000,
    idleRpm: 950,
    paintName: 'Crayon / Chalk Non-Metallic',
    location: 'Hertfordshire Suburban Paddock',
    weather: 'Crisp Dry Bitumen • Track Optimal',
    tempC: 6.4,
    frictionMu: 0.88,
    imageSrc: '/real_uk_gt3_suburb.jpg'
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'COBRA & FERRARI',
    badgeLabel: 'Stone Sanctuary',
    make: 'Shelby & Maranello',
    model: '427 S/C & 488 Spider Duo',
    chassisCode: 'CHASSIS // SHELBY-427-DUO',
    engine: '7.0L Ford FE V8 & 3.9L Twin-Turbo V8',
    power: '1,150+ Combined BHP',
    torque: '1,200+ Nm',
    redlineRpm: 8000,
    idleRpm: 850,
    paintName: 'Guardsman Blue & Rosso Corsa',
    location: 'Private Cotswolds Open Stone Bay',
    weather: 'Sunny Dry • Zero Moisture Drift',
    tempC: 18.5,
    frictionMu: 0.96,
    imageSrc: '/feed/stone_garage_cobra_ferrari.jpg'
  },
  dan: {
    id: 'dan',
    name: 'RETRO MOD',
    badgeLabel: 'E30 318is',
    make: 'BMW Classic Heritage',
    model: '318is Slicktop Coupé (E30)',
    chassisCode: 'CHASSIS // WBA-AF92-1989',
    engine: '1.8L 16V M42 Naturally Aspirated I4',
    power: '136 BHP',
    torque: '172 Nm',
    redlineRpm: 6800,
    idleRpm: 800,
    paintName: 'Brilliant Red (Brilliantrot)',
    location: 'Bristol Victorian Curbside',
    weather: 'Coastal Overcast • Pure Analog',
    tempC: 9.1,
    frictionMu: 0.82,
    imageSrc: '/real_uk_e30_terrace.jpg'
  },
  vault: {
    id: 'vault',
    name: 'MAYFAIR VAULT',
    badgeLabel: 'Empty Bay',
    make: 'DATUM Atelier',
    model: 'Mayfair Architectural Chamber 01',
    chassisCode: 'VAULT // BAY-01-LONDON',
    engine: 'Acoustic Slatted Climate Studio',
    power: 'Vault Ready',
    torque: '100% Induction',
    redlineRpm: 8000,
    idleRpm: 0,
    paintName: 'Architectural Oak & Brushed Slate',
    location: 'Central London Private Collector Vault',
    weather: 'Climate Controlled 20.5°C',
    tempC: 20.5,
    frictionMu: 0.99,
    imageSrc: '/splash_curated.jpg'
  }
};

export const SplashScreen: FC<SplashScreenProps> = ({ onEnter }) => {
  // State
  const [activePersona, setActivePersona] = useState<PersonaId>('maya');
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [currentRpm, setCurrentRpm] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') !== 'false';
  });

  const car = VEHICLES[activePersona];
  const audioCtxRef = useRef<AudioContext | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Parallax on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!parallaxRef.current) { rafRef.current = null; return; }
      const rect = parallaxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * 8;
      const dy = ((e.clientY - cy) / rect.height) * 8;
      parallaxRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.02)`;
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (parallaxRef.current) {
      parallaxRef.current.style.transform = 'translate(0px, 0px) scale(1.02)';
    }
  }, []);

  // Web Audio engine synthesis for smooth realistic ignition
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playEngineIgnitionSound = () => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // 1. Starter motor crank pulse (3 rhythmic starter teeth engagements)
      [0, 0.11, 0.22].forEach((timeOffset) => {
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'sawtooth';
        crank.frequency.setValueAtTime(75, ctx.currentTime + timeOffset);
        crankGain.gain.setValueAtTime(0.22, ctx.currentTime + timeOffset);
        crankGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + timeOffset + 0.08);
        crank.connect(crankGain);
        crankGain.connect(ctx.destination);
        crank.start(ctx.currentTime + timeOffset);
        crank.stop(ctx.currentTime + timeOffset + 0.09);
      });

      // 2. High-power ignition surge (combustion flare)
      const fireTime = ctx.currentTime + 0.35;
      const fireOsc = ctx.createOscillator();
      const fireFilter = ctx.createBiquadFilter();
      const fireGain = ctx.createGain();

      fireOsc.type = 'sawtooth';
      fireOsc.frequency.setValueAtTime(60, fireTime);
      fireOsc.frequency.exponentialRampToValueAtTime(260, fireTime + 0.35); // Rev flare
      fireOsc.frequency.exponentialRampToValueAtTime(Math.max(55, car.idleRpm / 14), fireTime + 0.95);

      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(220, fireTime);
      fireFilter.frequency.exponentialRampToValueAtTime(950, fireTime + 0.35);
      fireFilter.frequency.exponentialRampToValueAtTime(320, fireTime + 0.95);

      fireGain.gain.setValueAtTime(0.01, fireTime);
      fireGain.gain.linearRampToValueAtTime(0.42, fireTime + 0.22);
      fireGain.gain.exponentialRampToValueAtTime(0.02, fireTime + 1.25);

      fireOsc.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(ctx.destination);

      fireOsc.start(fireTime);
      fireOsc.stop(fireTime + 1.35);
    } catch {
      // Audio fallback
    }
  };

  const handleStartEngine = () => {
    if (isStarting || isAdmitting) return;
    setIsStarting(true);
    playEngineIgnitionSound();

    // Animate RPM needle flare
    setCurrentRpm(car.redlineRpm * 0.75);
    setTimeout(() => {
      setCurrentRpm(car.idleRpm);
    }, 700);

    // After engine ignition flare, smoothly transition into the atelier
    setTimeout(() => {
      setIsAdmitting(true);
      setTimeout(() => {
        onEnter();
      }, 500);
    }, 1250);
  };

  const handleSkip = () => {
    setIsAdmitting(true);
    setTimeout(() => {
      onEnter();
    }, 300);
  };

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    localStorage.setItem('garage_splash_audio', String(nextState));
  };

  // Calculate tachometer RPM percentage for arc fill
  const rpmPercent = isStarting ? currentRpm / (car.redlineRpm || 8000) : 0;

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isAdmitting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      } bg-[#09090B] text-zinc-100 flex flex-col justify-between`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ========================================================= */}
      {/* 1. CINEMATIC AUTOMOTIVE PHOTOGRAPHIC CANVAS               */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        
        {/* Parallax Vehicle Image */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ 
            transform: 'scale(1.02)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={car.imageSrc}
            alt={car.name}
            className={`w-full h-full object-cover object-center transition-all duration-700 ${
              isStarting ? 'brightness-110 scale-[1.01]' : 'brightness-95'
            }`}
          />
        </div>

        {/* Ambient Darkened Spatial Overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Dynamic Headlight / Floor Reflection Surge on Ignition */}
        <div 
          className={`absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[110px] pointer-events-none transition-all duration-700 ${
            isStarting ? 'opacity-100 scale-110' : 'opacity-20 scale-90'
          }`} 
          style={{ backgroundColor: 'var(--accent)' }}
        />
      </div>

      {/* ========================================================= */}
      {/* 2. TOP HEADER: BRAND CREST + CHASSIS SELECTOR             */}
      {/* ========================================================= */}
      <header className="relative z-20 pt-6 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Crest */}
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-luxury-display shadow-md border"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#09090B',
              borderColor: 'var(--border-default)'
            }}
          >
            D
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-luxury-display text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white">
                DATUM
              </span>
              <span className="font-serif italic text-xs" style={{ color: 'var(--accent)' }}>
                Atelier
              </span>
            </div>
            <span className="text-[9px] font-mono-numbers tracking-widest uppercase block text-zinc-400">
              Sovereign Vehicle Custody
            </span>
          </div>
        </div>

        {/* Quick Chassis Selector Strip */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-xs font-mono-numbers">
          {(Object.keys(VEHICLES) as PersonaId[]).map((pId) => {
            const v = VEHICLES[pId];
            const isSelected = activePersona === pId;
            return (
              <button
                key={pId}
                onClick={() => setActivePersona(pId)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                  isSelected
                    ? 'shadow-xs border'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                  color: isSelected ? '#09090B' : undefined,
                  borderColor: isSelected ? 'var(--border-default)' : 'transparent'
                }}
              >
                {v.badgeLabel}
              </button>
            );
          })}
        </div>

        {/* Audio & Skip Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-zinc-300 hover:text-white transition backdrop-blur-md cursor-pointer"
            title={audioEnabled ? 'Sound On' : 'Sound Muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" style={{ color: 'var(--accent)' }} /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-xs font-mono-numbers text-zinc-200 hover:text-white transition backdrop-blur-md cursor-pointer"
          >
            <span>Enter</span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          </button>
        </div>

      </header>

      {/* ========================================================= */}
      {/* 3. CENTER STAGE: CAR TELEMETRY HUD + TACHOMETER IGNITION  */}
      {/* ========================================================= */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 flex flex-col justify-between py-6">
        
        {/* Upper HUD Rail: Car Dossier & Atmospheric Telemetry */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          
          {/* Active Vehicle Badge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 max-w-md space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400">
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{car.make}</span>
              <span>•</span>
              <span>{car.chassisCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-luxury-display uppercase text-white">
              {car.model}
            </h2>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono-numbers text-zinc-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <strong>{car.power}</strong>
              </span>
              <span>•</span>
              <span>{car.torque}</span>
              <span>•</span>
              <span className="text-zinc-400">{car.engine}</span>
            </div>
          </div>

          {/* Environmental Conditions Readout */}
          <div className="hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 text-xs font-mono-numbers text-zinc-300">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block uppercase">Adhesion μ</span>
              <strong className="text-sm text-emerald-400 font-bold">μ {car.frictionMu}</strong>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase">Location</span>
              <span className="text-xs text-white">{car.location}</span>
            </div>
          </div>

        </div>

        {/* Center: Dynamic Tachometer & Engine Start Button */}
        <div className="my-auto flex flex-col items-center justify-center text-center py-4">
          
          <div className="relative flex items-center justify-center">
            
            {/* Circular Tachometer Gauge Dial Ring */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-white/15 flex items-center justify-center shadow-2xl bg-black/40 backdrop-blur-md">
              
              {/* Tachometer Tick Marks SVG */}
              <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100">
                {/* Gauge arc track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  strokeDasharray="200"
                  strokeDashoffset="40"
                  transform="rotate(120 50 50)"
                />
                {/* Active RPM arc surge */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeDasharray="200"
                  strokeDashoffset={200 - rpmPercent * 160}
                  strokeLinecap="round"
                  transform="rotate(120 50 50)"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Start Engine Mechanical Button */}
              <button
                onClick={handleStartEngine}
                disabled={isStarting}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
                  isStarting
                    ? 'scale-95 ring-4 ring-yellow-400/50 bg-zinc-900 border-2'
                    : 'hover:scale-105 active:scale-95 bg-zinc-950 border-2 border-white/25 hover:border-white/60'
                }`}
                style={{
                  borderColor: isStarting ? 'var(--accent)' : undefined
                }}
              >
                <Power 
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300 ${
                    isStarting ? 'animate-bounce' : 'text-zinc-400 group-hover:text-white'
                  }`}
                  style={{ color: isStarting ? 'var(--accent)' : undefined }}
                />
                <span 
                  className="text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-bold mt-1"
                  style={{ color: isStarting ? 'var(--accent)' : '#FFFFFF' }}
                >
                  {isStarting ? 'CRANKING...' : 'START'}
                </span>
                <span className="text-[8px] font-mono-numbers tracking-widest text-zinc-400 uppercase">
                  ENGINE
                </span>
              </button>

            </div>

          </div>

          {/* Subtitle Telemetry Status */}
          <div className="mt-4 space-y-1">
            <p className="text-xs font-mono-numbers uppercase tracking-[0.25em] text-zinc-300">
              {isStarting ? `Igniting ${car.engine} • Redline ${car.redlineRpm} RPM` : 'Press Button to Start Engine & Enter'}
            </p>
            <p className="text-[11px] font-serif italic text-zinc-400">
              {car.paintName} • {car.location}
            </p>
          </div>

        </div>

        {/* Bottom Mobile Chassis Switcher Pills */}
        <div className="flex md:hidden items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-2">
          {(Object.keys(VEHICLES) as PersonaId[]).map((pId) => {
            const v = VEHICLES[pId];
            const isSelected = activePersona === pId;
            return (
              <button
                key={pId}
                onClick={() => setActivePersona(pId)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono-numbers font-bold whitespace-nowrap transition ${
                  isSelected ? 'bg-white text-zinc-950 shadow-xs' : 'bg-black/60 text-zinc-400 border border-white/10'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent)' : undefined,
                  color: isSelected ? '#09090B' : undefined
                }}
              >
                {v.badgeLabel}
              </button>
            );
          })}
        </div>

      </main>

      {/* ========================================================= */}
      {/* 4. BOTTOM FOLIO FOOTER                                    */}
      {/* ========================================================= */}
      <footer className="relative z-20 pb-4 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] font-mono-numbers uppercase tracking-[0.25em] text-zinc-500 border-t border-white/10 pt-3">
        <span>DATUM ATELIER // VOL. IV</span>
        <span className="hidden sm:inline">100% PROPRIETARY CUSTODY</span>
        <span>AUTHORED BY vD</span>
      </footer>

    </div>
  );
};
