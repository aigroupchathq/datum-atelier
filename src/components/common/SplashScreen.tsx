import { useState, useRef, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Sparkles, 
  Gauge, 
  FileText, 
  CheckCircle2, 
  Wind, 
  Thermometer
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SplashScreenProps {
  onEnter: () => void;
  carName?: string;
  carModel?: string;
}

export type PersonaId = 'maya' | 'kuro' | 'dan' | 'expedition';

interface AtelierChassis {
  id: PersonaId;
  name: string;
  badgeLabel: string;
  make: string;
  model: string;
  chassisCode: string;
  curator: string;
  location: string;
  locationDetails: string;
  paintName: string;
  paintHex: string;
  power: string;
  torque: string;
  redlineRpm: number;
  idleRpm: number;
  engineSpec: string;
  setupSpec: string;
  mileage: string;
  healthScore: number;
  dvsaPassHash: string;
  imageSrc: string;
  fobMaterial: string;
  fobAccent: string;
  microClimate: {
    tempC: number;
    frictionMu: number;
    barometerHpa: number;
    weatherDesc: string;
    windMph: number;
  };
}

const ATELIER_CHASSIS_ROSTER: Record<PersonaId, AtelierChassis> = {
  maya: {
    id: 'maya',
    name: 'MAYA',
    badgeLabel: 'M3 (G80)',
    make: 'BMW M Atelier',
    model: 'M3 Competition xDrive (G80)',
    chassisCode: 'WBS-G80-COMP-UK-084',
    curator: 'vD — Sovereign Custody',
    location: 'Chipping Campden, Cotswolds',
    locationDetails: 'Honey-stone cottage driveway • Overcast morning dew',
    paintName: 'Isle of Man Green Metallic',
    paintHex: '#1B4D3E',
    power: '510 BHP',
    torque: '650 Nm',
    redlineRpm: 7200,
    idleRpm: 750,
    engineSpec: '3.0L S58 Twin-Turbocharged Inline-6',
    setupSpec: 'KW Variant 4 3-Way Coilovers • Michelin Pilot Sport 4S',
    mileage: '42,184 mi',
    healthScore: 99,
    dvsaPassHash: 'DVSA-GB-9821-M3',
    imageSrc: '/real_uk_m3_cottage.jpg',
    fobMaterial: 'Milled Titanium & British Racing Green Alcantara',
    fobAccent: '#EAB308',
    microClimate: {
      tempC: 7.2,
      frictionMu: 0.74,
      barometerHpa: 1018,
      weatherDesc: 'Damp Bitumen • Drying on Crests',
      windMph: 14
    }
  },
  kuro: {
    id: 'kuro',
    name: 'KURO',
    badgeLabel: 'GT3 Touring',
    make: 'Porsche Motorsport',
    model: '911 GT3 Touring (992.1)',
    chassisCode: 'WP0-992-GT3-WEISSACH-11',
    curator: 'vD — Sovereign Custody',
    location: 'Harpenden, Hertfordshire',
    locationDetails: 'Suburban block-paved driveway • 06:45 AM Cold Start',
    paintName: 'Crayon / Chalk Non-Metallic',
    paintHex: '#C5C6C3',
    power: '502 BHP',
    torque: '470 Nm',
    redlineRpm: 9000,
    idleRpm: 950,
    engineSpec: '4.0L Naturally Aspirated Boxer-6',
    setupSpec: 'Weissach Spec • 6-Speed GT Manual • Cup 2 Tyres',
    mileage: '18,400 mi',
    healthScore: 100,
    dvsaPassHash: 'DVSA-GB-4019-GT3',
    imageSrc: '/real_uk_gt3_suburb.jpg',
    fobMaterial: 'Billet Chalk Aluminum with Guards Red Lanyard',
    fobAccent: '#FACC15',
    microClimate: {
      tempC: 6.4,
      frictionMu: 0.82,
      barometerHpa: 1022,
      weatherDesc: 'Crisp Dry Bitumen • Optimal Track Grip',
      windMph: 9
    }
  },
  dan: {
    id: 'dan',
    name: 'RETRO MOD',
    badgeLabel: 'E30 318is',
    make: 'BMW Classic Heritage',
    model: '318is Slicktop (E30 Coupé)',
    chassisCode: 'WBA-AF92-E30-1989-UK',
    curator: 'vD — Sovereign Custody',
    location: 'Clifton, Bristol',
    locationDetails: 'Victorian terraced curbside • Pure 1989 Analog Survivor',
    paintName: 'Brilliant Red (Brilliantrot)',
    paintHex: '#B22222',
    power: '136 BHP',
    torque: '172 Nm',
    redlineRpm: 6800,
    idleRpm: 800,
    engineSpec: '1.8L 16V M42 Naturally Aspirated I4',
    setupSpec: 'Period BBS Basketweaves • Bilstein B12 Dampers',
    mileage: '118,500 mi',
    healthScore: 94,
    dvsaPassHash: 'DVSA-GB-1989-E30',
    imageSrc: '/real_uk_e30_terrace.jpg',
    fobMaterial: '1989 Bavarian Stamped Brass & Munich Leather Roundel',
    fobAccent: '#EAB308',
    microClimate: {
      tempC: 9.1,
      frictionMu: 0.78,
      barometerHpa: 1015,
      weatherDesc: 'Urban Overcast • Gentle Coastal Breeze',
      windMph: 11
    }
  },
  expedition: {
    id: 'expedition',
    name: 'EXPEDITION',
    badgeLabel: 'Defender 110',
    make: 'Solihull Special Vehicles',
    model: 'Defender 110 P400 SE',
    chassisCode: 'SAL-L663-SPEC-OPS-77',
    curator: 'vD — Sovereign Custody',
    location: 'Swaledale, Yorkshire Dales',
    locationDetails: 'Stone barn farmstead • Post-moorland shakedown',
    paintName: 'Pangea Green with Fuji White Roof',
    paintHex: '#4F6151',
    power: '400 BHP',
    torque: '550 Nm',
    redlineRpm: 6500,
    idleRpm: 680,
    engineSpec: '3.0L Ingenium Turbocharged MHEV I6',
    setupSpec: 'BFGoodrich KO2 All-Terrain • 900mm Wading Sonar',
    mileage: '31,200 mi',
    healthScore: 97,
    dvsaPassHash: 'DVSA-GB-6631-DEF',
    imageSrc: '/real_uk_defender_farm.jpg',
    fobMaterial: 'Knurled Gunmetal Stainless Steel & Paracord',
    fobAccent: '#EAB308',
    microClimate: {
      tempC: 5.8,
      frictionMu: 0.69,
      barometerHpa: 1012,
      weatherDesc: 'Misty High Moorland • Water Runoff Hazard',
      windMph: 24
    }
  }
};

export const SplashScreen: FC<SplashScreenProps> = ({ onEnter }) => {
  const { isWhiteYellow } = useTheme();
  const [activePersona, setActivePersona] = useState<PersonaId>('maya');
  const [keyPosition, setKeyPosition] = useState<0 | 1 | 2>(0); // 0: Lock, 1: ACC / Telemetry, 2: IGNITION
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [tachometerRpm, setTachometerRpm] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') !== 'false';
  });
  const [skipNextTime, setSkipNextTime] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_skip') === 'true';
  });

  const car = ATELIER_CHASSIS_ROSTER[activePersona];
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Smooth parallax tilt refs
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

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

  // Web Audio engine synthesis for tactile key mechanical clicks and engine ignition
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

  const playKeyLatchClick = () => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Mechanical lock cylinder snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);

      // Low fuel pump relay hum on ACC
      const pump = ctx.createOscillator();
      const pumpGain = ctx.createGain();
      pump.type = 'sine';
      pump.frequency.setValueAtTime(140, ctx.currentTime);
      pumpGain.gain.setValueAtTime(0.01, ctx.currentTime);
      pumpGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.08);
      pumpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      pump.connect(pumpGain);
      pumpGain.connect(ctx.destination);
      pump.start();
      pump.stop(ctx.currentTime + 0.45);
    } catch {
      // Fallback if audio policy requires gesture
    }
  };

  const playEngineIgnitionSound = () => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // 1. Starter motor crank pulse (3 rhythmic pulses)
      [0, 0.12, 0.24].forEach((timeOffset) => {
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'sawtooth';
        crank.frequency.setValueAtTime(65, ctx.currentTime + timeOffset);
        crankGain.gain.setValueAtTime(0.18, ctx.currentTime + timeOffset);
        crankGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + timeOffset + 0.09);
        crank.connect(crankGain);
        crankGain.connect(ctx.destination);
        crank.start(ctx.currentTime + timeOffset);
        crank.stop(ctx.currentTime + timeOffset + 0.1);
      });

      // 2. High-power ignition surge (engine fires up)
      const fireTime = ctx.currentTime + 0.38;
      const fireOsc = ctx.createOscillator();
      const fireFilter = ctx.createBiquadFilter();
      const fireGain = ctx.createGain();

      fireOsc.type = 'sawtooth';
      fireOsc.frequency.setValueAtTime(55, fireTime);
      fireOsc.frequency.exponentialRampToValueAtTime(240, fireTime + 0.3); // Flare to 2,500 RPM equivalent
      fireOsc.frequency.exponentialRampToValueAtTime(car.idleRpm / 15, fireTime + 0.9); // Settle to idle

      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(180, fireTime);
      fireFilter.frequency.exponentialRampToValueAtTime(850, fireTime + 0.3);
      fireFilter.frequency.exponentialRampToValueAtTime(280, fireTime + 0.9);

      fireGain.gain.setValueAtTime(0.01, fireTime);
      fireGain.gain.linearRampToValueAtTime(0.38, fireTime + 0.2);
      fireGain.gain.exponentialRampToValueAtTime(0.01, fireTime + 1.2);

      fireOsc.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(ctx.destination);

      fireOsc.start(fireTime);
      fireOsc.stop(fireTime + 1.3);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Turn Key to position 1 (ACC)
  const handleKeyTurnAcc = () => {
    if (keyPosition === 0) {
      setKeyPosition(1);
      playKeyLatchClick();
      setTachometerRpm(car.idleRpm);
    }
  };

  // Turn Key to position 2 (Ignition & Enter Atelier)
  const handleKeyTurnIgnite = () => {
    setKeyPosition(2);
    setIsAdmitting(true);
    playEngineIgnitionSound();

    // Needle flare to redline
    setTachometerRpm(car.redlineRpm * 0.75);

    localStorage.setItem('garage_splash_audio', String(audioEnabled));
    localStorage.setItem('garage_splash_skip', String(skipNextTime));

    setTimeout(() => {
      onEnter();
    }, 750);
  };

  const handleInstantBypass = () => {
    localStorage.setItem('garage_splash_audio', String(audioEnabled));
    localStorage.setItem('garage_splash_skip', String(skipNextTime));
    onEnter();
  };

  // Reset tachometer when switching persona
  useEffect(() => {
    setKeyPosition(0);
    setTachometerRpm(0);
  }, [activePersona]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isAdmitting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      } ${isWhiteYellow ? 'bg-[#F8F9FA] text-zinc-900' : 'bg-[#09090B] text-zinc-100'} font-sans flex flex-col justify-between`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ========================================================= */}
      {/* 1. MASTER PHOTOGRAPHIC CANVAS WITH SERENE ATELIER TINT    */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        
        {/* Parallax layer */}
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
            alt={`${car.name} — ${car.location}`}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              isAdmitting ? 'scale-105 filter brightness-105' : 'scale-100'
            }`}
          />
        </div>

        {/* High-Society Alabaster & Racing Yellow Scrims */}
        {isWhiteYellow ? (
          <>
            {/* Top gradient for navbar clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FA]/90 via-[#F8F9FA]/40 to-[#F8F9FA]/85 pointer-events-none" />
            {/* Horizontal reading balance */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/95 via-[#F8F9FA]/60 to-transparent pointer-events-none" />
            {/* Golden hour warm atelier glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[140px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/90 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/75 pointer-events-none" />
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. TOP ATELIER CONCIERGE BAR                              */}
      {/* ========================================================= */}
      <header className={`relative z-20 px-6 sm:px-10 py-5 flex items-center justify-between border-b backdrop-blur-xl ${
        isWhiteYellow ? 'bg-white/80 border-zinc-200/90 shadow-xs' : 'bg-black/40 border-white/10'
      }`}>
        
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tracking-widest bg-yellow-400 text-zinc-950 font-luxury-display shadow-sm border border-yellow-500">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-[0.25em] font-luxury-display uppercase">
                DATUM ATELIER
              </span>
              <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-950 font-bold border border-yellow-300 uppercase">
                CURATED ADMISSION
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono-numbers mt-0.5">
              High-Society Automotive Provenance & Sovereign Digital Custody
            </p>
          </div>
        </div>

        {/* Quick controls: Sound, Skip, Instant Enter */}
        <div className="flex items-center gap-3">
          
          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono-numbers transition flex items-center gap-1.5 shadow-xs ${
              isWhiteYellow
                ? 'bg-white/90 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
                : 'bg-black/60 border-white/10 text-zinc-300 hover:text-white'
            }`}
            title={audioEnabled ? 'Mechanical Ignition Audio Active' : 'Audio Muted'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-yellow-600" />
                <span className="hidden md:inline font-semibold">Sound Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden md:inline">Muted</span>
              </>
            )}
          </button>

          {/* Instant admission button */}
          <button
            onClick={handleInstantBypass}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-400 text-zinc-950 text-xs font-mono-numbers font-bold hover:bg-yellow-300 transition border border-yellow-500 shadow-sm"
          >
            <span>Enter Atelier</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. CENTER / LOWER ATELIER ADMISSION CHAMBER               */}
      {/* ========================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-6 flex-1 flex flex-col justify-between w-full">
        
        {/* Top: Station & Real-Time Weather HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Location Badge */}
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-mono-numbers shadow-xs ${
            isWhiteYellow ? 'bg-white/90 border-zinc-200 text-zinc-800' : 'bg-black/60 border-white/10 text-zinc-200'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-yellow-400/30 animate-pulse" />
            <span className="font-bold tracking-wide">
              STATION: {car.location.toUpperCase()}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              800m SANCTUARY CLOAKED
            </span>
          </div>

          {/* Live Micro-Climate Readout */}
          <div className={`hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full border text-xs font-mono-numbers backdrop-blur-md shadow-xs ${
            isWhiteYellow ? 'bg-white/80 border-zinc-200 text-zinc-600' : 'bg-black/50 border-white/10 text-zinc-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-yellow-600" />
              <strong className="text-zinc-900">{car.microClimate.tempC}°C</strong>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-yellow-600" />
              <span>Grip μ <strong className="text-zinc-900">{car.microClimate.frictionMu}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-600" />
              <span>{car.microClimate.windMph} mph</span>
            </div>
          </div>
        </div>

        {/* Middle / Bottom Handover Chamber: Left Chassis Plaque & Right Titanium Key Ignition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pt-6 pb-2">
          
          {/* LEFT 7 COLS: Stamped Chassis Provenance Plaque */}
          <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl transition-all shadow-md relative overflow-hidden ${
            isWhiteYellow ? 'bg-white/95 border-zinc-200 text-zinc-900' : 'bg-zinc-950/90 border-white/10 text-white'
          }`}>
            
            {/* Corner Rivet Screws */}
            <div className="absolute top-3 left-3 text-[9px] font-black text-zinc-400 font-mono-numbers">+</div>
            <div className="absolute top-3 right-3 text-[9px] font-black text-zinc-400 font-mono-numbers">+</div>
            <div className="absolute bottom-3 left-3 text-[9px] font-black text-zinc-400 font-mono-numbers">+</div>
            <div className="absolute bottom-3 right-3 text-[9px] font-black text-zinc-400 font-mono-numbers">+</div>

            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold uppercase tracking-wider">
                      {car.make}
                    </span>
                    <span className="text-[10px] font-mono-numbers text-yellow-700 font-bold">
                      {car.chassisCode}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black font-luxury-display uppercase tracking-tight mt-1 text-zinc-950">
                    {car.name}
                  </h1>
                  <p className="text-xs text-zinc-600 font-medium">
                    {car.model}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono-numbers font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{car.healthScore}% HEALTH</span>
                  </span>
                  <p className="text-[10px] font-mono-numbers text-zinc-400 mt-1">
                    {car.mileage} Logged
                  </p>
                </div>
              </div>

              {/* Engineering Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono-numbers">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Finish Spec</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: car.paintHex }} />
                    <span className="font-bold text-zinc-900 text-[11px] truncate">{car.paintName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">BHP & Output</span>
                  <span className="font-bold text-yellow-700 text-sm block mt-1">
                    {car.power} <span className="text-[10px] text-zinc-500 font-normal">({car.torque})</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">DVSA Reference</span>
                  <span className="font-bold text-zinc-900 text-[11px] block mt-1 truncate">
                    {car.dvsaPassHash}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 col-span-2 sm:col-span-3">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Chassis Setup & Hardware</span>
                  <p className="text-zinc-700 text-[11px] font-medium mt-0.5 truncate">
                    {car.setupSpec}
                  </p>
                </div>
              </div>

              {/* Handover Custodian Guarantee */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono-numbers text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-yellow-600" />
                  <span>Curator: <strong className="text-zinc-900">{car.curator}</strong></span>
                </span>
                <span className="text-emerald-700 font-semibold">DVSA Statutory Pass • Zero Advisories</span>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: The Interactive Titanium Handover Key & Ignition */}
          <div className={`lg:col-span-5 rounded-3xl border p-6 backdrop-blur-2xl shadow-md flex flex-col items-center justify-between space-y-5 ${
            isWhiteYellow ? 'bg-white/95 border-zinc-200 text-zinc-900' : 'bg-zinc-950/90 border-white/10 text-white'
          }`}>
            
            <div className="w-full text-center space-y-1">
              <span className="text-[10px] font-mono-numbers uppercase tracking-widest text-yellow-600 font-bold block">
                CUSTODIAN IGNITION PROTOCOL
              </span>
              <h3 className="text-base font-bold font-luxury-display uppercase text-zinc-950">
                Turn Sovereign Key To Admit
              </h3>
              <p className="text-xs text-zinc-500 font-mono-numbers">
                {car.fobMaterial}
              </p>
            </div>

            {/* Circular Ignition Cylinder & Key Fob */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-2">
              
              {/* Outer Dial Flange with Tick Marks */}
              <div className="absolute inset-0 rounded-full border-2 border-zinc-200 bg-gradient-to-tr from-zinc-100 via-white to-zinc-50 shadow-inner flex items-center justify-center">
                {/* 3 Position Labels */}
                <span className={`absolute top-3 text-[9px] font-mono-numbers font-bold ${keyPosition === 0 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                  0 · LOCK
                </span>
                <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-mono-numbers font-bold ${keyPosition === 1 ? 'text-yellow-600 font-black' : 'text-zinc-400'}`}>
                  I · ACC
                </span>
                <span className={`absolute bottom-3 text-[9px] font-mono-numbers font-bold ${keyPosition === 2 ? 'text-yellow-600 font-black animate-pulse' : 'text-zinc-400'}`}>
                  II · IGNITE
                </span>
              </div>

              {/* Live Tachometer SVG Gauge Ring */}
              <svg className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] pointer-events-none -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="78"
                  fill="none"
                  stroke={isWhiteYellow ? '#E4E4E7' : '#27272A'}
                  strokeWidth="4"
                  strokeDasharray="490"
                  strokeDashoffset="120"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="78"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="5"
                  strokeDasharray="490"
                  strokeDashoffset={490 - (tachometerRpm / car.redlineRpm) * 370}
                  className="transition-all duration-300 ease-out"
                  strokeLinecap="round"
                />
              </svg>

              {/* Central Billet Tumbler & Key Grip */}
              <div 
                className="relative z-10 w-28 h-28 rounded-full border-2 border-zinc-300 shadow-xl flex items-center justify-center transition-transform duration-300 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F4F4F5 50%, #E4E4E7 100%)',
                  transform: keyPosition === 0 ? 'rotate(0deg)' : keyPosition === 1 ? 'rotate(45deg)' : 'rotate(90deg)'
                }}
                onClick={() => {
                  if (keyPosition === 0) handleKeyTurnAcc();
                  else handleKeyTurnIgnite();
                }}
              >
                {/* Laser-Cut Key Slot */}
                <div className="w-14 h-4 rounded-md bg-zinc-900 border border-zinc-700 shadow-inner flex items-center justify-center relative">
                  <div className="w-8 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_#EAB308]" />
                  <Key className="w-3 h-3 text-zinc-400 absolute right-1 pointer-events-none" />
                </div>

                {/* Rotating Indicator Arrow */}
                <div className="absolute top-1.5 w-1.5 h-3 bg-yellow-500 rounded-full" />
              </div>
            </div>

            {/* Action CTAs */}
            <div className="w-full space-y-2">
              {keyPosition === 0 ? (
                <button
                  onClick={handleKeyTurnAcc}
                  className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono-numbers text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Key className="w-4 h-4 text-yellow-400" />
                  <span>Insert & Turn Key to [I · ACC]</span>
                </button>
              ) : (
                <button
                  onClick={handleKeyTurnIgnite}
                  disabled={isAdmitting}
                  className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-mono-numbers text-xs font-bold transition flex items-center justify-center gap-2 shadow-md border border-yellow-500 animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Turn to [II · IGNITE] & Enter Atelier</span>
                </button>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono-numbers text-zinc-500 px-1 pt-1">
                <span>RPM: <strong className="text-zinc-900 font-bold">{tachometerRpm}</strong></span>
                <button
                  onClick={handleInstantBypass}
                  className="hover:text-yellow-600 transition underline underline-offset-2"
                >
                  Bypass Sequence →
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 4. CHASSIS PEDESTAL SELECTOR TABS                         */}
        {/* ========================================================= */}
        <div className={`mt-4 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isWhiteYellow ? 'border-zinc-200' : 'border-white/10'
        }`}>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-mono-numbers text-zinc-400 uppercase font-bold tracking-wider shrink-0 pr-1">
              Select Chassis:
            </span>
            {(Object.keys(ATELIER_CHASSIS_ROSTER) as PersonaId[]).map((pKey) => {
              const p = ATELIER_CHASSIS_ROSTER[pKey];
              const isSelected = activePersona === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setActivePersona(pKey)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono-numbers font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-yellow-400 text-zinc-950 font-bold border border-yellow-500 shadow-sm'
                      : isWhiteYellow
                      ? 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
                      : 'bg-black/60 border border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full border border-black/20" style={{ backgroundColor: p.paintHex }} />
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-70">({p.badgeLabel})</span>
                </button>
              );
            })}
          </div>

          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-500 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={skipNextTime}
              onChange={(e) => setSkipNextTime(e.target.checked)}
              className="rounded accent-yellow-500 w-3.5 h-3.5"
            />
            <span>Remember admission & skip on return</span>
          </label>
        </div>

      </main>

    </div>
  );
};
