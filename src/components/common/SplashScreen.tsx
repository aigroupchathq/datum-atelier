import { useState, useRef, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShieldCheck,
  Disc3
} from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  carName?: string;
  carModel?: string;
}

export type PersonaId = 'maya' | 'kuro' | 'sanctuary' | 'dan' | 'vault';

interface VehiclePersona {
  id: PersonaId;
  index: string;
  name: string;
  subtitle: string;
  chassisCode: string;
  engine: string;
  power: string;
  torque: string;
  redlineRpm: number;
  idleRpm: number;
  location: string;
  coordinates: string;
  weather: string;
  frictionMu: number;
  imageSrc: string;
}

const VEHICLES: Record<PersonaId, VehiclePersona> = {
  maya: {
    id: 'maya',
    index: '01',
    name: 'MAYA',
    subtitle: 'BMW M3 Competition (G80)',
    chassisCode: 'CHASSIS // WBS-G80-COMP-UK',
    engine: '3.0L S58 Twin-Turbo Inline-6',
    power: '510 BHP',
    torque: '650 Nm',
    redlineRpm: 7200,
    idleRpm: 750,
    location: 'Cotswolds Private Estate',
    coordinates: '51.833° N, 1.842° W',
    weather: 'Damp Bitumen • Morning Mist',
    frictionMu: 0.78,
    imageSrc: '/real_uk_m3_cottage.jpg'
  },
  kuro: {
    id: 'kuro',
    index: '02',
    name: 'KURO',
    subtitle: 'Porsche 911 GT3 Touring (992.1)',
    chassisCode: 'CHASSIS // WP0-992-GT3-WEISSACH',
    engine: '4.0L Naturally Aspirated Boxer-6',
    power: '502 BHP',
    torque: '470 Nm',
    redlineRpm: 9000,
    idleRpm: 950,
    location: 'Hertfordshire Suburban Paddock',
    coordinates: '51.752° N, 0.339° W',
    weather: 'Crisp Dry Bitumen • Track Optimal',
    frictionMu: 0.88,
    imageSrc: '/real_uk_gt3_suburb.jpg'
  },
  sanctuary: {
    id: 'sanctuary',
    index: '03',
    name: 'SANCTUARY',
    subtitle: 'Shelby 427 S/C & 488 Spider Duo',
    chassisCode: 'CHASSIS // SHELBY-427-DUO',
    engine: '7.0L Ford FE V8 & 3.9L Twin-Turbo V8',
    power: '1,150+ BHP Combined',
    torque: '1,200+ Nm',
    redlineRpm: 8000,
    idleRpm: 850,
    location: 'Private Cotswolds Stone Gallery',
    coordinates: '51.929° N, 1.734° W',
    weather: 'Sunny Dry • Zero Moisture Drift',
    frictionMu: 0.96,
    imageSrc: '/stone_garage_cobra_ferrari.jpg'
  },
  dan: {
    id: 'dan',
    index: '04',
    name: 'RETRO MOD',
    subtitle: 'BMW 318is Slicktop Coupé (E30)',
    chassisCode: 'CHASSIS // WBA-AF92-1989',
    engine: '1.8L 16V M42 Naturally Aspirated I4',
    power: '136 BHP',
    torque: '172 Nm',
    redlineRpm: 6800,
    idleRpm: 800,
    location: 'Bristol Victorian Curbside',
    coordinates: '51.454° N, 2.587° W',
    weather: 'Coastal Overcast • Pure Analog',
    frictionMu: 0.82,
    imageSrc: '/real_uk_e30_terrace.jpg'
  },
  vault: {
    id: 'vault',
    index: '05',
    name: 'THE VAULT',
    subtitle: 'Mayfair Architectural Chamber 01',
    chassisCode: 'VAULT // BAY-01-LONDON',
    engine: 'Climate-Controlled Slatted Wood Studio',
    power: 'Vault Ready',
    torque: '100% Induction',
    redlineRpm: 8000,
    idleRpm: 0,
    location: 'Central London Private Vault',
    coordinates: '51.507° N, 0.144° W',
    weather: 'Controlled 20.5°C • 45% Relative Humidity',
    frictionMu: 0.99,
    imageSrc: '/splash_curated.jpg'
  }
};

export const SplashScreen: FC<SplashScreenProps> = ({ onEnter }) => {
  const [activePersona, setActivePersona] = useState<PersonaId>('maya');
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [ignitionStage, setIgnitionStage] = useState<'idle' | 'solenoid' | 'combustion' | 'ready'>('idle');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') !== 'false';
  });

  const car = VEHICLES[activePersona];
  const audioCtxRef = useRef<AudioContext | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Subtle Parallax on mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!parallaxRef.current) { rafRef.current = null; return; }
      const rect = parallaxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * 6;
      const dy = ((e.clientY - cy) / rect.height) * 6;
      parallaxRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

      // Starter solenoid engagement teeth
      [0, 0.12, 0.24].forEach((timeOffset) => {
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'sawtooth';
        crank.frequency.setValueAtTime(68, ctx.currentTime + timeOffset);
        crankGain.gain.setValueAtTime(0.18, ctx.currentTime + timeOffset);
        crankGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + timeOffset + 0.08);
        crank.connect(crankGain);
        crankGain.connect(ctx.destination);
        crank.start(ctx.currentTime + timeOffset);
        crank.stop(ctx.currentTime + timeOffset + 0.09);
      });

      // Combustion flare surge
      const fireTime = ctx.currentTime + 0.38;
      const fireOsc = ctx.createOscillator();
      const fireFilter = ctx.createBiquadFilter();
      const fireGain = ctx.createGain();

      fireOsc.type = car.id === 'kuro' ? 'sawtooth' : 'triangle';
      fireOsc.frequency.setValueAtTime(55, fireTime);
      fireOsc.frequency.exponentialRampToValueAtTime(240, fireTime + 0.35);
      fireOsc.frequency.exponentialRampToValueAtTime(Math.max(45, car.idleRpm / 15), fireTime + 0.95);

      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(200, fireTime);
      fireFilter.frequency.exponentialRampToValueAtTime(850, fireTime + 0.35);
      fireFilter.frequency.exponentialRampToValueAtTime(300, fireTime + 0.95);

      fireGain.gain.setValueAtTime(0.01, fireTime);
      fireGain.gain.linearRampToValueAtTime(0.35, fireTime + 0.2);
      fireGain.gain.exponentialRampToValueAtTime(0.01, fireTime + 1.2);

      fireOsc.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(ctx.destination);

      fireOsc.start(fireTime);
      fireOsc.stop(fireTime + 1.25);
    } catch {
      // Audio fallback
    }
  };

  const handleEngageMachine = () => {
    if (isStarting || isAdmitting) return;
    setIsStarting(true);
    setIgnitionStage('solenoid');

    playEngineIgnitionSound();

    setTimeout(() => {
      setIgnitionStage('combustion');
    }, 400);

    setTimeout(() => {
      setIgnitionStage('ready');
      setIsAdmitting(true);
      setTimeout(() => {
        onEnter();
      }, 500);
    }, 1100);
  };

  const handleSkip = () => {
    setIsAdmitting(true);
    setTimeout(() => {
      onEnter();
    }, 280);
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    localStorage.setItem('garage_splash_audio', String(next));
  };

  // Keyboard engagement: Space or Enter triggers ignition
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleEngageMachine();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarting, isAdmitting]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isAdmitting ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
      } bg-[#060709] text-zinc-100 flex flex-col justify-between`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CINEMATIC BACKGROUND CANVAS (Full-Bleed Photographic Soul) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Parallax Vehicle Image with Smooth Breathing Depth */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ 
            transform: 'scale(1.02)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={car.imageSrc}
            alt={car.name}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              isStarting ? 'brightness-110 saturate-[1.08] scale-[1.01]' : 'brightness-[0.88] saturate-[0.95]'
            }`}
          />
        </div>

        {/* Refined Architectural Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]/80" />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* Subtle Ignition Flash */}
        <div 
          className={`absolute inset-0 bg-amber-500/10 pointer-events-none transition-opacity duration-500 ${
            ignitionStage === 'combustion' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TOP HOROLOGICAL HALLMARK (Minimalist Navigation & Audio)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 pt-7 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Monogram Hallmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-luxury-display font-bold text-xs text-white">
            D
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-luxury-display text-sm font-light tracking-[0.35em] uppercase text-white">
                DATUM
              </span>
              <span className="font-serif italic text-xs text-amber-400 font-light">
                Atelier
              </span>
            </div>
            <span className="text-[8px] font-mono-numbers tracking-[0.25em] uppercase text-zinc-400 block -mt-0.5">
              Sovereign Machine Provenance
            </span>
          </div>
        </div>

        {/* Discreet Persona Index Pagination */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono-numbers">
          {(Object.keys(VEHICLES) as PersonaId[]).map((pId) => {
            const v = VEHICLES[pId];
            const isSelected = activePersona === pId;
            return (
              <button
                key={pId}
                onClick={() => setActivePersona(pId)}
                className={`transition-all duration-200 cursor-pointer flex items-center gap-1.5 py-1 ${
                  isSelected
                    ? 'text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isSelected ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'
                }`} />
                <span className="text-[11px] tracking-wider">{v.index}</span>
                <span className="text-[10px] tracking-widest uppercase opacity-80">{v.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility: Audio & Direct Entry */}
        <div className="flex items-center gap-3 text-xs font-mono-numbers">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-zinc-400 hover:text-white transition backdrop-blur-md cursor-pointer"
            title={audioEnabled ? 'Exhaust Acoustic Audio: ON' : 'Audio Muted'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 text-[11px] text-zinc-300 hover:text-white transition backdrop-blur-md cursor-pointer"
          >
            <span>Enter</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CENTER & LOWER FOCUS: SCULPTURAL IDENTITY & ENGAGEMENT     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 space-y-8">
        
        {/* Sculptural Vehicle Typography & Fine Telemetry Strip */}
        <div className="space-y-4 max-w-3xl">
          
          <div className="flex items-center gap-3 text-xs font-mono-numbers text-zinc-400">
            <span className="text-amber-400 font-bold tracking-widest">{car.chassisCode}</span>
            <span>•</span>
            <span>{car.coordinates}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">μ {car.frictionMu} ADHESION</span>
          </div>

          <div>
            <h1 className="font-luxury-display text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.12em] uppercase text-white/95 leading-none">
              {car.name}
            </h1>
            <p className="font-serif italic text-lg sm:text-2xl text-zinc-300 font-light mt-2 tracking-wide">
              {car.subtitle}
            </p>
          </div>

          {/* Minimalist Micro-Specifications Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-numbers text-zinc-400 pt-1">
            <span className="text-zinc-200">{car.engine}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-bold">{car.power}</span>
            <span className="text-zinc-600">/</span>
            <span>{car.torque}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-300">REDLINE {car.redlineRpm.toLocaleString()} RPM</span>
          </div>

        </div>

        {/* ── THE MINIMALIST IGNITION KEY (Horizontal Tactile Engagement Bar) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-white/10">
          
          <div className="flex items-center gap-4">
            
            {/* The Tactile Engage Key */}
            <button
              onClick={handleEngageMachine}
              disabled={isStarting}
              className={`group relative px-8 py-4 rounded-full font-mono-numbers text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer flex items-center gap-3 border shadow-2xl ${
                isStarting
                  ? 'bg-amber-400 text-black border-amber-300 scale-[0.98]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] active:scale-95'
              }`}
            >
              <Disc3 className={`w-4 h-4 transition-transform duration-700 ${
                isStarting ? 'animate-spin text-black' : 'group-hover:rotate-90 text-amber-400'
              }`} />
              
              <span>
                {ignitionStage === 'solenoid' && 'Engaging Starter...'}
                {ignitionStage === 'combustion' && 'Combustion Surge...'}
                {ignitionStage === 'ready' && 'Systems Calibrated'}
                {ignitionStage === 'idle' && 'Engage Machine'}
              </span>

              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isStarting ? 'translate-x-1' : 'group-hover:translate-x-1'
              }`} />
            </button>

            {/* Quiet Keyboard Hint */}
            <span className="hidden sm:inline text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-black/40 text-zinc-300">Space</kbd> to Launch
            </span>
          </div>

          {/* Environmental Micro-Status */}
          <div className="flex items-center gap-4 text-[11px] font-mono-numbers text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{car.location}</span>
            </div>
            <span className="text-zinc-600">•</span>
            <span>{car.weather}</span>
          </div>

        </div>

      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FOOTER FOLIO (Quiet Provenance Hallmark)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 pb-5 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between text-[9px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>DATUM ATELIER // ZERO-KNOWLEDGE CHASSIS PROVENANCE</span>
        </div>
        <span className="hidden sm:inline">ALL TELEMETRY CRYPTOGRAPHICALLY SECURED</span>
        <span>EDITION 2026 // vD</span>
      </footer>

    </div>
  );
};
