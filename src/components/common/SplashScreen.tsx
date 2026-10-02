import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ShieldCheck, 
  Image as ImageIcon,
  Disc3,
  Flame,
  Gauge
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
  firingOrder: number[];
  cylinders: number;
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
    firingOrder: [1, 5, 3, 6, 2, 4],
    cylinders: 6,
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
    idleRpm: 850,
    firingOrder: [1, 6, 2, 4, 3, 5],
    cylinders: 6,
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
    firingOrder: [1, 3, 7, 2, 6, 5, 4, 8],
    cylinders: 8,
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
    firingOrder: [1, 3, 4, 2],
    cylinders: 4,
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
    firingOrder: [1, 2, 3, 4, 5, 6],
    cylinders: 6,
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
  
  // Interactive Playground State (Does NOT open the site)
  const [isBlipping, setIsBlipping] = useState<boolean>(false);
  const [sliderRpm, setSliderRpm] = useState<number>(0);

  // Wallpaper removed by default for classy posh minimalism, with an option to toggle
  const [showWallpaper, setShowWallpaper] = useState<boolean>(() => {
    return localStorage.getItem('datum_splash_wallpaper') === 'true';
  });

  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') !== 'false';
  });

  const car = VEHICLES[activePersona];
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Rotational Physics State & Refs
  const flywheelRef = useRef<SVGGElement | null>(null);
  const camGearRef = useRef<SVGGElement | null>(null);
  const crankWebRef = useRef<SVGGElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [liveRpm, setLiveRpm] = useState<number>(0);
  const [liveAngle, setLiveAngle] = useState<number>(0);
  const [activeCylinder, setActiveCylinder] = useState<number>(1);

  // Physics animation variables stored in ref
  const physicsRef = useRef({
    currentRpm: 0,
    targetRpm: 0,
    crankAngle: 0,
    lastTime: performance.now()
  });

  // Toggle wallpaper and save preference
  const toggleWallpaper = () => {
    const next = !showWallpaper;
    setShowWallpaper(next);
    localStorage.setItem('datum_splash_wallpaper', String(next));
  };

  // Web Audio engine synthesis
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

  // Full Starter Ignition Sound (Triggered ONLY on "Start Engine & Enter")
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

  // Pure Throttle Rev Blip Sound (For Interactive Playground — Does NOT enter site)
  const playThrottleBlipSound = (targetRpm: number) => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const blipOsc = ctx.createOscillator();
      const blipSubOsc = ctx.createOscillator();
      const blipFilter = ctx.createBiquadFilter();
      const blipGain = ctx.createGain();

      const baseFreq = Math.max(38, (car.idleRpm / 60) * (car.cylinders / 2));
      const peakFreq = Math.max(120, (targetRpm / 60) * (car.cylinders / 2));

      blipOsc.type = car.id === 'kuro' ? 'sawtooth' : 'triangle';
      blipOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      blipOsc.frequency.exponentialRampToValueAtTime(peakFreq, ctx.currentTime + 0.18);
      blipOsc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + 0.75);

      blipSubOsc.type = 'sawtooth';
      blipSubOsc.frequency.setValueAtTime(baseFreq * 0.5, ctx.currentTime);
      blipSubOsc.frequency.exponentialRampToValueAtTime(peakFreq * 0.5, ctx.currentTime + 0.18);
      blipSubOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.75);

      blipFilter.type = 'lowpass';
      blipFilter.frequency.setValueAtTime(260, ctx.currentTime);
      blipFilter.frequency.exponentialRampToValueAtTime(Math.min(3200, peakFreq * 5.2), ctx.currentTime + 0.18);
      blipFilter.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.75);
      blipFilter.Q.setValueAtTime(3.6, ctx.currentTime);

      blipGain.gain.setValueAtTime(0.01, ctx.currentTime);
      blipGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.14);
      blipGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.82);

      blipOsc.connect(blipFilter);
      blipSubOsc.connect(blipFilter);
      blipFilter.connect(blipGain);
      blipGain.connect(ctx.destination);

      blipOsc.start(ctx.currentTime);
      blipSubOsc.start(ctx.currentTime);
      blipOsc.stop(ctx.currentTime + 0.85);
      blipSubOsc.stop(ctx.currentTime + 0.85);
    } catch {
      // Audio fallback
    }
  };

  // High-Precision 60fps Rotational Physics Loop
  useEffect(() => {
    let isSubscribed = true;

    const loop = (time: number) => {
      if (!isSubscribed) return;

      const p = physicsRef.current;
      const dt = Math.min(0.05, (time - p.lastTime) / 1000);
      p.lastTime = time;

      // Smooth RPM interpolation
      p.currentRpm += (p.targetRpm - p.currentRpm) * Math.min(1, dt * 7.5);

      // Crank angle integration: degrees = (RPM / 60) * 360 * dt
      const degDelta = (p.currentRpm / 60) * 360 * dt;
      p.crankAngle = (p.crankAngle + degDelta) % 720; // 4-stroke cycle over 720 degrees

      // Hardware-accelerated direct DOM SVG transforms
      if (flywheelRef.current) {
        flywheelRef.current.style.transform = `rotate(${p.crankAngle}deg)`;
      }
      if (camGearRef.current) {
        camGearRef.current.style.transform = `rotate(${-p.crankAngle * 0.5}deg)`;
      }
      if (crankWebRef.current) {
        crankWebRef.current.style.transform = `rotate(${p.crankAngle}deg)`;
      }

      // Calculate firing cylinder based on 4-stroke cycle
      const cycleProgress = p.crankAngle / 720;
      const firingIndex = Math.floor(cycleProgress * car.firingOrder.length) % car.firingOrder.length;
      const currentCyl = car.firingOrder[firingIndex] || 1;

      // Periodically update telemetry display states
      if (Math.random() < 0.32) {
        setLiveRpm(Math.round(p.currentRpm));
        setLiveAngle(Math.round(p.crankAngle % 360));
        setActiveCylinder(currentCyl);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [car.firingOrder]);

  // 1. INTERACTIVE THROTTLE BLIP (DOES NOT ENTER OR OPEN SITE)
  const handleInteractiveBlip = (intensity: 'blip' | 'redline' = 'blip') => {
    if (isStarting || isAdmitting) return;
    setIsBlipping(true);

    const target = intensity === 'redline'
      ? car.redlineRpm
      : Math.min(car.redlineRpm - 300, Math.max(car.idleRpm + 3600, 4800));

    physicsRef.current.targetRpm = target;
    setSliderRpm(target);
    playThrottleBlipSound(target);

    // After throttle blip peak, return smoothly to rest without opening site
    setTimeout(() => {
      if (!isStarting) {
        physicsRef.current.targetRpm = 0;
        setSliderRpm(0);
        setIsBlipping(false);
      }
    }, 850);
  };

  // 2. INTERACTIVE SLIDER DRAG (DOES NOT ENTER OR OPEN SITE)
  const handleSliderChange = (newRpm: number) => {
    if (isStarting || isAdmitting) return;
    setSliderRpm(newRpm);
    physicsRef.current.targetRpm = newRpm;
    if (newRpm > 0 && Math.random() < 0.2) {
      playThrottleBlipSound(newRpm);
    }
  };

  // 3. START ENGINE & ENTER (ONLY THIS ACTION OPENS THE SITE)
  const handleEngageMachine = () => {
    if (isStarting || isAdmitting) return;
    setIsStarting(true);
    setIgnitionStage('solenoid');

    // Spin up starter motor
    physicsRef.current.targetRpm = 280;
    playEngineIgnitionSound();

    // Surge into combustion flare
    setTimeout(() => {
      setIgnitionStage('combustion');
      physicsRef.current.targetRpm = Math.min(3600, car.redlineRpm * 0.45);
    }, 380);

    // Settle into steady idle cadence and enter atelier
    setTimeout(() => {
      setIgnitionStage('ready');
      physicsRef.current.targetRpm = car.idleRpm;
      setIsAdmitting(true);
      setTimeout(() => {
        onEnter();
      }, 500);
    }, 1150);
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

  // Keyboard engagement: Space = Rev Blip (Play), Enter = Start & Enter Site
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        handleInteractiveBlip('blip');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEngageMachine();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarting, isAdmitting]);

  // Cylinder firing positions placed at equal intervals around the circular dial
  const cylinderNodes = car.firingOrder.map((cylNum, i) => {
    const angleRad = (i / car.firingOrder.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 118;
    const x = 150 + radius * Math.cos(angleRad);
    const y = 150 + radius * Math.sin(angleRad);
    const isCurrentlyFiring = (isStarting || isBlipping || liveRpm > 200) && activeCylinder === cylNum;
    return { cylNum, x, y, isCurrentlyFiring };
  });

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isAdmitting ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
      } bg-[#060709] text-zinc-100 flex flex-col justify-between`}
    >
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BACKGROUND: CLASSY POSH VOID (Optional Wallpaper Toggle)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Optional Wallpaper Overlay */}
        {showWallpaper && (
          <div className="absolute inset-0 transition-opacity duration-700">
            <img
              src={car.imageSrc}
              alt={car.name}
              className="w-full h-full object-cover object-center brightness-[0.38] saturate-[0.8] contrast-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/85 to-[#060709]/95" />
          </div>
        )}

        {/* Haute-Horlogerie Satin Obsidian Fine Engineering Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,_rgba(251,191,36,0.04)_0%,_transparent_65%)]" />

        {/* Concentric Horological Calibration Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-white/[0.025] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.035] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.05] pointer-events-none" />

        {/* Ambient Combustion Glow on Ignition or Interactive Blip */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-amber-500/15 blur-[120px] pointer-events-none transition-opacity duration-300 ${
            ignitionStage === 'combustion' || isBlipping ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          }`}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TOP HOROLOGICAL HALLMARK (Posh Branding & Quiet Toolbar)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 pt-6 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Monogram Brand Hallmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/15 flex items-center justify-center font-luxury-display font-bold text-xs text-amber-300 shadow-sm">
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
                onClick={() => {
                  setActivePersona(pId);
                  physicsRef.current.targetRpm = 0;
                  setSliderRpm(0);
                }}
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

        {/* Right Utility: Wallpaper Toggle + Audio + Fast Skip */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono-numbers">
          
          <button
            onClick={toggleWallpaper}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono-numbers transition backdrop-blur-md cursor-pointer ${
              showWallpaper
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08]'
            }`}
            title="Toggle Backdrop: Void vs Photographic"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showWallpaper ? 'Wallpaper: On' : 'Wallpaper: Off'}</span>
          </button>

          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-zinc-400 hover:text-white transition backdrop-blur-md cursor-pointer"
            title={audioEnabled ? 'Exhaust Acoustic Audio: ON' : 'Audio Muted'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-[11px] text-zinc-300 hover:text-white transition backdrop-blur-md cursor-pointer"
          >
            <span>Enter</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. COCKPIT HORIZON: UNIFIED 3-COLUMN HAUTE-HORLOGERIE STANCE  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 flex-1 flex flex-col justify-center my-auto py-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* ── LEFT FLANK: MACHINE IDENTITY & SCULPTURAL TYPOGRAPHY (4 COLS) ── */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-4">
            
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono-numbers text-amber-300/90 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{car.chassisCode}</span>
            </div>

            <div className="space-y-1">
              <h1 className="font-luxury-display text-5xl sm:text-6xl xl:text-7xl font-light tracking-[0.15em] uppercase text-white leading-none">
                {car.name}
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-zinc-300 font-light tracking-wide">
                {car.subtitle}
              </p>
            </div>

            {/* Precision Mechanical Specification Block */}
            <div className="pt-2 space-y-1.5 text-xs font-mono-numbers text-zinc-400 max-w-sm mx-auto lg:mx-0">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Induction Architecture</span>
                <span className="text-zinc-200">{car.engine}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Power & Torque</span>
                <span className="text-white font-bold">{car.power} • {car.torque}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Four-Stroke Firing</span>
                <span className="text-amber-300 font-semibold">{car.firingOrder.join(' - ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 uppercase text-[10px]">Mechanical Rev Limit</span>
                <span className="text-rose-400 font-bold">{car.redlineRpm.toLocaleString()} RPM</span>
              </div>
            </div>

          </div>

          {/* ── CENTER JEWEL: ROTATIONAL ESCAPEMENT DIAL & PUSHERS (4 COLS) ── */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-5">
            
            {/* The Monumental 300px Escapement Gauge */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              <svg 
                className="w-full h-full overflow-visible drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" 
                viewBox="0 0 300 300"
              >
                {/* Precision Outer Stepped Bezel Ring */}
                <circle
                  cx="150"
                  cy="150"
                  r="144"
                  fill="#08090D"
                  stroke="rgba(255, 255, 255, 0.09)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.2)"
                  strokeWidth="0.75"
                  strokeDasharray="1 5"
                />

                {/* 1. ROTATING FLYWHEEL RING GEAR (Outer Teeth) */}
                <g 
                  ref={flywheelRef} 
                  className="origin-center will-change-transform"
                  style={{ transformOrigin: '150px 150px' }}
                >
                  <circle
                    cx="150"
                    cy="150"
                    r="134"
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.45)"
                    strokeWidth="2.5"
                  />

                  {/* 36 Machined Flywheel Teeth Radial Ticks */}
                  {Array.from({ length: 36 }).map((_, i) => {
                    const deg = (i / 36) * 360;
                    return (
                      <line
                        key={i}
                        x1="150"
                        y1="12"
                        x2="150"
                        y2="20"
                        stroke={i % 6 === 0 ? '#FBBF24' : 'rgba(255, 255, 255, 0.25)'}
                        strokeWidth={i % 6 === 0 ? '2' : '1'}
                        transform={`rotate(${deg} 150 150)`}
                      />
                    );
                  })}

                  {/* Weight Cutout Windows */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <circle
                      key={deg}
                      cx="150"
                      cy="44"
                      r="6.5"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="1"
                      transform={`rotate(${deg} 150 150)`}
                    />
                  ))}
                </g>

                {/* 2. COUNTER-ROTATING CAMSHAFT TIMING GEAR (Half-Speed 1:2 DOHC) */}
                <g 
                  ref={camGearRef} 
                  className="origin-center will-change-transform"
                  style={{ transformOrigin: '150px 150px' }}
                >
                  <circle
                    cx="150"
                    cy="150"
                    r="94"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                  />

                  {/* Vernier Cam Timing Marks */}
                  {[0, 120, 240].map((deg) => (
                    <line
                      key={deg}
                      x1="150"
                      y1="56"
                      x2="150"
                      y2="66"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      transform={`rotate(${deg} 150 150)`}
                    />
                  ))}
                </g>

                {/* 3. CENTRAL CRANKSHAFT COUNTERWEIGHT WEB & JOURNAL */}
                <g 
                  ref={crankWebRef} 
                  className="origin-center will-change-transform"
                  style={{ transformOrigin: '150px 150px' }}
                >
                  <path
                    d="M 134 150 C 134 112, 166 112, 166 150 C 166 188, 134 188, 134 150 Z"
                    fill="rgba(251, 191, 36, 0.12)"
                    stroke="rgba(251, 191, 36, 0.6)"
                    strokeWidth="1.5"
                  />

                  {/* Connecting Rod Journal Pin (Orbiting Throw) */}
                  <circle
                    cx="150"
                    cy="126"
                    r="8"
                    fill="#08090D"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />

                  <circle
                    cx="150"
                    cy="150"
                    r="4.5"
                    fill="#F59E0B"
                  />
                </g>

                {/* 4. STATIC CYLINDER FIRING ORDER STROBE NODES */}
                {cylinderNodes.map(({ cylNum, x, y, isCurrentlyFiring }) => (
                  <g key={cylNum} className="transition-all duration-100">
                    <circle
                      cx={x}
                      cy={y}
                      r={isCurrentlyFiring ? 13 : 9.5}
                      fill={isCurrentlyFiring ? 'rgba(251, 191, 36, 0.3)' : 'rgba(12, 14, 18, 0.95)'}
                      stroke={isCurrentlyFiring ? '#FBBF24' : 'rgba(255, 255, 255, 0.22)'}
                      strokeWidth={isCurrentlyFiring ? 2 : 1}
                      className="transition-all duration-100"
                    />
                    <text
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={isCurrentlyFiring ? '#FDE68A' : 'rgba(255, 255, 255, 0.55)'}
                    >
                      #{cylNum}
                    </text>
                    {isCurrentlyFiring && (
                      <circle
                        cx={x}
                        cy={y}
                        r="18"
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth="1"
                        className="animate-ping opacity-80"
                      />
                    )}
                  </g>
                ))}

              </svg>

              {/* Center Gauge Telemetry Core */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] font-mono-numbers text-zinc-500 uppercase tracking-widest block">
                  {liveRpm > 50 ? 'ROTATING' : 'STANDBY'}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono-numbers tracking-tight text-white mt-0.5">
                  {liveRpm} <span className="text-xs text-amber-400 font-normal">RPM</span>
                </span>
                <span className="text-[9px] font-mono-numbers text-zinc-400 tracking-wider uppercase mt-0.5">
                  {liveRpm > 50 ? `CYL #${activeCylinder} IGNITING` : 'TDC READY'}
                </span>
              </div>

            </div>

            {/* ── INTEGRATED CHRONOGRAPH PUSHERS & SCRUBBER (No container box) ── */}
            <div className="w-full max-w-xs space-y-2.5">
              
              {/* Dual Milled Aerospace Pushers */}
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => handleInteractiveBlip('blip')}
                  disabled={isStarting}
                  className="flex-1 py-2 px-3 rounded-full bg-white/[0.05] hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/50 text-zinc-200 hover:text-amber-300 font-mono-numbers text-[11px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  title="Blip throttle to spin rotational meter without opening site"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blip (+3.6k)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInteractiveBlip('redline')}
                  disabled={isStarting}
                  className="flex-1 py-2 px-3 rounded-full bg-white/[0.05] hover:bg-rose-500/20 border border-white/15 hover:border-rose-400/50 text-zinc-200 hover:text-rose-300 font-mono-numbers text-[11px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  title="Test redline surge"
                >
                  <Gauge className="w-3.5 h-3.5 text-rose-400" />
                  <span>Redline</span>
                </button>
              </div>

              {/* Minimalist Hairline RPM Scrubber */}
              <div className="space-y-1 px-1">
                <input
                  type="range"
                  min={0}
                  max={car.redlineRpm}
                  step={50}
                  value={sliderRpm}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                  title="Drag to scrub rotational velocity manually"
                />
                <div className="flex items-center justify-between text-[8px] font-mono-numbers text-zinc-500">
                  <span>REST</span>
                  <span className="text-amber-400 font-bold tracking-wider">
                    {sliderRpm > 0 ? `${sliderRpm} RPM SCRUB` : 'DRAG TO SCRUB'}
                  </span>
                  <span>{car.redlineRpm} RPM</span>
                </div>
              </div>

            </div>

          </div>

          {/* ── RIGHT FLANK: OROGRAPHIC & ENVIRONMENTAL TELEMETRY (4 COLS) ── */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-4">
            
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono-numbers text-emerald-400/90 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>OROGRAPHIC TELEMETRY</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono-numbers text-zinc-500 uppercase tracking-widest block">
                Active Ground Coordinates
              </span>
              <p className="font-mono-numbers text-sm text-zinc-200 font-semibold">
                {car.location}
              </p>
              <p className="font-mono-numbers text-xs text-zinc-400">
                {car.coordinates}
              </p>
            </div>

            {/* Dynamic Telemetry Metric Strip */}
            <div className="pt-2 space-y-1.5 text-xs font-mono-numbers text-zinc-400 max-w-sm mx-auto lg:ml-auto lg:mr-0">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Road Surface Condition</span>
                <span className="text-zinc-200">{car.weather}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Tarmac Friction Accord</span>
                <span className="text-emerald-400 font-bold">μ {car.frictionMu} Adhesion</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-zinc-500 uppercase text-[10px]">Instantaneous Crank</span>
                <span className="text-amber-400 font-bold">{liveAngle}° BTDC</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 uppercase text-[10px]">Valvetrain Ratio</span>
                <span className="text-zinc-300">1:2 DOHC Continuous</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── LOWER ANCHOR: THE MILLED OBSIDIAN HALO IGNITION SWITCH ── */}
        <div className="pt-8 flex flex-col items-center justify-center gap-2.5">
          
          <button
            type="button"
            onClick={handleEngageMachine}
            disabled={isStarting}
            className={`group relative px-10 py-3.5 rounded-full font-mono-numbers text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] ${
              isStarting
                ? 'bg-amber-400 text-black border-amber-300 scale-[0.98] shadow-[0_0_40px_rgba(251,191,36,0.45)]'
                : 'bg-[#0E1015] hover:bg-[#151720] text-zinc-100 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.25)] active:scale-95'
            }`}
          >
            <Disc3 className={`w-4 h-4 transition-transform duration-700 ${
              isStarting ? 'animate-spin text-black' : 'group-hover:rotate-90 text-amber-400'
            }`} />
            
            <span>
              {ignitionStage === 'solenoid' && 'Engaging Starter Motor...'}
              {ignitionStage === 'combustion' && 'Combustion Surge...'}
              {ignitionStage === 'ready' && 'Systems Harmonized'}
              {ignitionStage === 'idle' && 'Engage Chassis & Enter Atelier'}
            </span>

            <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isStarting ? 'translate-x-1' : 'group-hover:translate-x-1 text-amber-400'
            }`} />
          </button>

          {/* Quiet Keyboard Guide */}
          <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-500">
            Press <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-black/60 text-zinc-300">Space</kbd> to Rev Blip • <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-black/60 text-zinc-300">Enter</kbd> to Launch
          </span>

        </div>

      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FOOTER: CHASSIS PROVENANCE HALLMARK                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 pb-4 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between text-[9px] font-mono-numbers uppercase tracking-[0.25em] text-zinc-500 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>DATUM ATELIER // ZERO-KNOWLEDGE CHASSIS PROVENANCE</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <span>HAUTE-HORLOGERIE INSTRUMENTATION</span>
          <span>•</span>
          <span>EDITION 2026 // vD</span>
        </div>
      </footer>

    </div>
  );
};
