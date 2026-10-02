import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ShieldCheck, 
  Image as ImageIcon,
  Disc3,
  Cpu
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

  // Physics animation variables stored in ref to avoid re-rendering bottleneck
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

  // Web Audio engine synthesis for realistic mechanical starter & combustion flare
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

  // High-Precision 60fps Rotational Physics Loop
  useEffect(() => {
    let isSubscribed = true;

    const loop = (time: number) => {
      if (!isSubscribed) return;

      const p = physicsRef.current;
      const dt = Math.min(0.05, (time - p.lastTime) / 1000);
      p.lastTime = time;

      // Smooth RPM interpolation
      p.currentRpm += (p.targetRpm - p.currentRpm) * Math.min(1, dt * 6.5);

      // Crank angle integration: degrees = (RPM / 60) * 360 * dt
      const degDelta = (p.currentRpm / 60) * 360 * dt;
      p.crankAngle = (p.crankAngle + degDelta) % 720; // 4-stroke cycle over 720 degrees

      // Hardware-accelerated direct DOM SVG transforms (zero React re-render overhead)
      if (flywheelRef.current) {
        flywheelRef.current.style.transform = `rotate(${p.crankAngle}deg)`;
      }
      if (camGearRef.current) {
        // Camshaft turns at exactly half crankshaft speed in opposite or geared orientation
        camGearRef.current.style.transform = `rotate(${-p.crankAngle * 0.5}deg)`;
      }
      if (crankWebRef.current) {
        crankWebRef.current.style.transform = `rotate(${p.crankAngle}deg)`;
      }

      // Calculate firing cylinder based on 4-stroke cycle
      const cycleProgress = p.crankAngle / 720;
      const firingIndex = Math.floor(cycleProgress * car.firingOrder.length) % car.firingOrder.length;
      const currentCyl = car.firingOrder[firingIndex] || 1;

      // Periodically update telemetry display states (every ~60ms)
      if (Math.random() < 0.3) {
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

    // Settle into steady idle cadence
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

  // Cylinder firing positions placed at equal intervals around the circular dial
  const cylinderNodes = car.firingOrder.map((cylNum, i) => {
    const angleRad = (i / car.firingOrder.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 108;
    const x = 140 + radius * Math.cos(angleRad);
    const y = 140 + radius * Math.sin(angleRad);
    const isCurrentlyFiring = isStarting && activeCylinder === cylNum;
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
        
        {/* Optional Wallpaper Overlay (Only if enabled by user) */}
        {showWallpaper && (
          <div className="absolute inset-0 transition-opacity duration-700">
            <img
              src={car.imageSrc}
              alt={car.name}
              className="w-full h-full object-cover object-center brightness-[0.45] saturate-[0.85] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/80 to-[#060709]/95" />
          </div>
        )}

        {/* Haute-Horlogerie Satin Obsidian Fine Engineering Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(251,191,36,0.035)_0%,_transparent_70%)]" />

        {/* Concentric Horological Calibration Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.06] pointer-events-none" />

        {/* Subtle Ambient Combustion Glow on Ignition */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none transition-opacity duration-500 ${
            ignitionStage === 'combustion' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          }`}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TOP HOROLOGICAL HALLMARK (Posh Branding & Quiet Toolbar)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 pt-6 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Monogram Brand Hallmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.07] backdrop-blur-md border border-white/15 flex items-center justify-center font-luxury-display font-bold text-xs text-amber-200">
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

        {/* Right Utility: Wallpaper Toggle + Audio + Fast Skip */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono-numbers">
          
          {/* Wallpaper Toggle Button (Classy Posh Void vs Photographic) */}
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

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-zinc-400 hover:text-white transition backdrop-blur-md cursor-pointer"
            title={audioEnabled ? 'Exhaust Acoustic Audio: ON' : 'Audio Muted'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Instant Enter */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 text-[11px] text-zinc-300 hover:text-white transition backdrop-blur-md cursor-pointer"
          >
            <span>Enter</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CENTERPIECE: ROTATIONAL ENGINE MECHANICS VISUALIZER        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 flex-1 flex flex-col items-center justify-center my-auto py-4">
        
        <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl text-center">
          
          {/* THE ROTATIONAL ENGINE ESCAPEMENT DIAL (Precision SVG) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 280 280"
            >
              {/* Static Outer Degree Calibration Scale */}
              <circle
                cx="140"
                cy="140"
                r="134"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />

              {/* 1. ROTATING FLYWHEEL RING GEAR (Outer Teeth) */}
              <g 
                ref={flywheelRef} 
                className="origin-center will-change-transform"
                style={{ transformOrigin: '140px 140px' }}
              >
                {/* Ring Gear Perimeter */}
                <circle
                  cx="140"
                  cy="140"
                  r="124"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.35)"
                  strokeWidth="2.5"
                />

                {/* 36 Machined Flywheel Teeth Radial Ticks */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const deg = (i / 36) * 360;
                  return (
                    <line
                      key={i}
                      x1="140"
                      y1="12"
                      x2="140"
                      y2="19"
                      stroke={i % 6 === 0 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255, 255, 255, 0.25)'}
                      strokeWidth={i % 6 === 0 ? '2' : '1'}
                      transform={`rotate(${deg} 140 140)`}
                    />
                  );
                })}

                {/* Flywheel Weight Cutout Windows */}
                {[0, 90, 180, 270].map((deg) => (
                  <circle
                    key={deg}
                    cx="140"
                    cy="40"
                    r="8"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                    transform={`rotate(${deg} 140 140)`}
                  />
                ))}
              </g>

              {/* 2. COUNTER-ROTATING CAMSHAFT TIMING GEAR (Half-Speed 1:2 DOHC) */}
              <g 
                ref={camGearRef} 
                className="origin-center will-change-transform"
                style={{ transformOrigin: '140px 140px' }}
              >
                <circle
                  cx="140"
                  cy="140"
                  r="86"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                />

                {/* Vernier Cam Timing Marks */}
                {[0, 120, 240].map((deg) => (
                  <line
                    key={deg}
                    x1="140"
                    y1="50"
                    x2="140"
                    y2="60"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 140 140)`}
                  />
                ))}
              </g>

              {/* 3. CENTRAL CRANKSHAFT COUNTERWEIGHT WEB & JOURNAL */}
              <g 
                ref={crankWebRef} 
                className="origin-center will-change-transform"
                style={{ transformOrigin: '140px 140px' }}
              >
                {/* Eccentric Crank Web Lobe */}
                <path
                  d="M 125 140 C 125 105, 155 105, 155 140 C 155 175, 125 175, 125 140 Z"
                  fill="rgba(251, 191, 36, 0.1)"
                  stroke="rgba(251, 191, 36, 0.5)"
                  strokeWidth="1.5"
                />

                {/* Connecting Rod Journal Pin (Orbiting Throw) */}
                <circle
                  cx="140"
                  cy="118"
                  r="7"
                  fill="#0B0C10"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />

                {/* Crankshaft Center Axis */}
                <circle
                  cx="140"
                  cy="140"
                  r="4"
                  fill="#F59E0B"
                />
              </g>

              {/* 4. STATIC CYLINDER FIRING ORDER STROBE NODES */}
              {cylinderNodes.map(({ cylNum, x, y, isCurrentlyFiring }) => (
                <g key={cylNum} className="transition-all duration-150">
                  {/* Subtle Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCurrentlyFiring ? 12 : 9}
                    fill={isCurrentlyFiring ? 'rgba(251, 191, 36, 0.25)' : 'rgba(11, 12, 16, 0.85)'}
                    stroke={isCurrentlyFiring ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={isCurrentlyFiring ? 2 : 1}
                    className="transition-all duration-100"
                  />
                  {/* Cylinder Number Marker */}
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={isCurrentlyFiring ? '#FCD34D' : 'rgba(255, 255, 255, 0.5)'}
                  >
                    #{cylNum}
                  </text>
                  {/* Glow Ring on Combustion Strike */}
                  {isCurrentlyFiring && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1"
                      className="animate-ping opacity-75"
                    />
                  )}
                </g>
              ))}

            </svg>

            {/* Center Status Badge Overlay */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-mono-numbers text-zinc-500 uppercase tracking-widest block">
                {isStarting ? 'ROTATING' : 'STANDBY'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono-numbers tracking-tight text-white mt-0.5">
                {liveRpm} <span className="text-xs text-amber-400 font-normal">RPM</span>
              </span>
              <span className="text-[9px] font-mono-numbers text-zinc-400 tracking-wider uppercase mt-0.5">
                {isStarting ? `CYL #${activeCylinder} IGNITING` : 'TDC READY'}
              </span>
            </div>

          </div>

          {/* Vehicle Identity & Engineering Specifications */}
          <div className="space-y-2 pt-2">
            <h1 className="font-luxury-display text-4xl sm:text-6xl font-light tracking-[0.2em] uppercase text-white/95 leading-none">
              {car.name}
            </h1>
            <p className="font-serif italic text-base sm:text-xl text-zinc-300 font-light tracking-wide">
              {car.subtitle}
            </p>
            
            {/* Fine Monospace Engineering Specification Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono-numbers text-zinc-400 pt-1">
              <span className="text-zinc-200">{car.engine}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-white font-bold">{car.power}</span>
              <span className="text-zinc-600">/</span>
              <span>{car.torque}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-amber-300">FIRING ORDER: {car.firingOrder.join(' - ')}</span>
            </div>
          </div>

          {/* ── THE TACTILE IGNITION ENGAGEMENT PILL ── */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              onClick={handleEngageMachine}
              disabled={isStarting}
              className={`group relative px-9 py-4 rounded-full font-mono-numbers text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer flex items-center gap-3.5 border shadow-2xl ${
                isStarting
                  ? 'bg-amber-400 text-black border-amber-300 scale-[0.98] shadow-[0_0_35px_rgba(251,191,36,0.35)]'
                  : 'bg-white/[0.08] hover:bg-white/[0.18] text-white border-white/20 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] active:scale-95'
              }`}
            >
              <Disc3 className={`w-4 h-4 transition-transform duration-700 ${
                isStarting ? 'animate-spin text-black' : 'group-hover:rotate-90 text-amber-400'
              }`} />
              
              <span>
                {ignitionStage === 'solenoid' && 'Engaging Starter Motor...'}
                {ignitionStage === 'combustion' && 'Combustion Surge...'}
                {ignitionStage === 'ready' && 'Systems Harmonized'}
                {ignitionStage === 'idle' && 'Engage Machine'}
              </span>

              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isStarting ? 'translate-x-1' : 'group-hover:translate-x-1'
              }`} />
            </button>

            {/* Keyboard Launch Tooltip */}
            <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-black/50 text-zinc-300">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-black/50 text-zinc-300">Enter</kbd> to Ignite
            </span>
          </div>

        </div>

      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FOOTER: ROTATIONAL TELEMETRY & PROVENANCE HALLMARK         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 pb-5 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-mono-numbers uppercase tracking-[0.25em] text-zinc-500 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Cpu className="w-3 h-3 text-amber-400" />
            <span>CRANK: {liveAngle}° BTDC</span>
          </div>
          <span>•</span>
          <span>VALVETRAIN RATIO: 1:2 DOHC</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">μ {car.frictionMu} ADHESION</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>DATUM ATELIER // ZERO-KNOWLEDGE CHASSIS PROVENANCE</span>
        </div>
      </footer>

    </div>
  );
};
