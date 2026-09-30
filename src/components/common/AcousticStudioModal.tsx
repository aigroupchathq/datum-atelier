import { useState, useEffect, useRef, useCallback } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Volume2, 
  Play, 
  Pause, 
  Flame, 
  Gauge, 
  Activity, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AcousticVehicle {
  id: string;
  name: string;
  fullName: string;
  chassisCode: string;
  engineCode: string;
  displacement: string;
  valvetrainDesc: string;
  exhaustSpec: string;
  powerBhp: number;
  torqueNm: number;
  redlineRpm: number;
  idleRpm: number;
  baseFrequencyHz: number;
  peakFrequencyHz: number;
  musicalNote: string;
  weightKg: number;
  heroImage: string;
  accentClass: string;
  badgeFoil: string;
  timbreDescription: string;
}

const ACOUSTIC_FLEET: Record<string, AcousticVehicle> = {
  'car-maya-m3': {
    id: 'car-maya-m3',
    name: 'MAYA',
    fullName: 'BMW M3 Competition (G80)',
    chassisCode: 'G80-M3-COMP-UK',
    engineCode: 'S58B30A Twin-Turbo',
    displacement: '2,993 cc',
    valvetrainDesc: '24V DOHC Double-VANOS • Valvetronic',
    exhaustSpec: 'Akrapovič Evolution Line Titanium System',
    powerBhp: 612,
    torqueNm: 780,
    redlineRpm: 7200,
    idleRpm: 750,
    baseFrequencyHz: 42,
    peakFrequencyHz: 480,
    musicalNote: 'B1 to A4 Harmonic Spool',
    weightKg: 1730,
    heroImage: '/real_uk_m3_cottage.jpg',
    accentClass: 'text-emerald-400',
    badgeFoil: 'foil-emerald',
    timbreDescription: 'Deep baritone inline-six idle resonance with rapid twin-scroll turbo spool and metallic high-RPM induction rasp.'
  },
  'car-kuro-gt3': {
    id: 'car-kuro-gt3',
    name: 'KURO',
    fullName: 'Porsche 911 GT3 Touring (992)',
    chassisCode: '992-GT3-TOURING',
    engineCode: '4.0L Boxer-6 Naturally Aspirated',
    displacement: '3,996 cc',
    valvetrainDesc: '24V DOHC Individual Throttle Bodies • Rigid Valve Drive',
    exhaustSpec: 'Porsche Motorsport Titanium Sports System',
    powerBhp: 502,
    torqueNm: 470,
    redlineRpm: 9000,
    idleRpm: 850,
    baseFrequencyHz: 68,
    peakFrequencyHz: 840,
    musicalNote: 'D2 to F#5 Valvetrain Howl',
    weightKg: 1418,
    heroImage: '/real_uk_gt3_suburb.jpg',
    accentClass: 'text-amber-400',
    badgeFoil: 'foil-gold',
    timbreDescription: 'Spine-tingling, mechanical flat-six symphonics. Solid cam followers screaming to 9,000 RPM with pure atmospheric purity.'
  },
  'car-e30-retromod': {
    id: 'car-e30-retromod',
    name: 'RETRO MOD',
    fullName: 'BMW 318is Slicktop (E30)',
    chassisCode: 'E30-318IS-SLICKTOP',
    engineCode: 'M42B18 16V Twin-Cam',
    displacement: '1,796 cc',
    valvetrainDesc: '16V DOHC Chain-Driven Twin-Cam • Hydraulic Lifters',
    exhaustSpec: 'Supersprint Stainless 4-into-1 System',
    powerBhp: 152,
    torqueNm: 192,
    redlineRpm: 6900,
    idleRpm: 800,
    baseFrequencyHz: 55,
    peakFrequencyHz: 620,
    musicalNote: 'A1 to E4 Analog Rasp',
    weightKg: 1120,
    heroImage: '/real_uk_e30_terrace.jpg',
    accentClass: 'text-rose-400',
    badgeFoil: 'foil-platinum',
    timbreDescription: 'Raw, unassisted mechanical induction. Direct throttle-cable valve click, high-revving rasp with period-correct Supersprint growl.'
  },
  'car-expedition-110': {
    id: 'car-expedition-110',
    name: 'EXPEDITION',
    fullName: 'Land Rover Defender 110 P400 SE',
    chassisCode: 'L663-DEFENDER-110',
    engineCode: 'Ingenium 3.0L MHEV I6',
    displacement: '2,996 cc',
    valvetrainDesc: '24V DOHC Continuous Variable Valve Lift (CVVL)',
    exhaustSpec: 'Heavy-Duty Inconel Submerged Dual Runners',
    powerBhp: 395,
    torqueNm: 550,
    redlineRpm: 6500,
    idleRpm: 700,
    baseFrequencyHz: 38,
    peakFrequencyHz: 420,
    musicalNote: 'G1 to C4 Overland Rumble',
    weightKg: 2360,
    heroImage: '/real_uk_defender_farm.jpg',
    accentClass: 'text-lime-400',
    badgeFoil: 'foil-platinum',
    timbreDescription: 'Deep low-frequency bass with high-pitch 48V electric supercharger whine, designed for 900mm wading depth.'
  }
};

interface AcousticStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicleId?: string;
  initialCarId?: string;
}

export const AcousticStudioModal: FC<AcousticStudioModalProps> = ({
  isOpen,
  onClose,
  initialVehicleId,
  initialCarId
}) => {
  const defaultId = initialVehicleId || initialCarId || 'car-maya-m3';
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(defaultId);
  const [compareVehicleId, setCompareVehicleId] = useState<string>('car-kuro-gt3');
  const [currentRpm, setCurrentRpm] = useState<number>(850);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBlipActive, setIsBlipActive] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<boolean>(true);

  const { showToast } = useToast();

  const vehicleA = ACOUSTIC_FLEET[selectedVehicleId] || ACOUSTIC_FLEET['car-maya-m3'];
  const vehicleB = ACOUSTIC_FLEET[compareVehicleId] || ACOUSTIC_FLEET['car-kuro-gt3'];

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscSubRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // Stop audio synthesis cleanly
  const stopAudio = useCallback(() => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.15);
      } catch {
        // Fallback
      }
    }
    setTimeout(() => {
      try {
        oscRef.current?.stop();
        oscSubRef.current?.stop();
      } catch {
        // Already stopped
      }
      oscRef.current = null;
      oscSubRef.current = null;
      gainRef.current = null;
      filterRef.current = null;
      setIsPlaying(false);
    }, 180);
  }, []);

  // Calculate synthesized frequency based on RPM
  const calculateFrequency = useCallback((rpm: number, veh: AcousticVehicle) => {
    const rpmFrac = (rpm - veh.idleRpm) / (veh.redlineRpm - veh.idleRpm);
    const clampedFrac = Math.max(0, Math.min(1, rpmFrac));
    return veh.baseFrequencyHz + clampedFrac * (veh.peakFrequencyHz - veh.baseFrequencyHz);
  }, []);

  // Start continuous audio synthesis
  const startAudio = useCallback((rpm: number) => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous nodes if active
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch { /* ignore */ }
      }
      if (oscSubRef.current) {
        try { oscSubRef.current.stop(); } catch { /* ignore */ }
      }

      const fundamentalFreq = calculateFrequency(rpm, vehicleA);

      // Primary tone oscillator (sawtooth for valvetrain bite)
      const osc = ctx.createOscillator();
      osc.type = vehicleA.id === 'car-kuro-gt3' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(fundamentalFreq, ctx.currentTime);

      // Sub-harmonic bass oscillator (for exhaust pulse depth)
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sawtooth';
      oscSub.frequency.setValueAtTime(fundamentalFreq * 0.5, ctx.currentTime);

      // Biquad resonance filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.max(200, fundamentalFreq * 4), ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      // Master output gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.12);

      // Node graph routing
      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscSub.start();

      oscRef.current = osc;
      oscSubRef.current = oscSub;
      filterRef.current = filter;
      gainRef.current = gain;

      setIsPlaying(true);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [calculateFrequency, vehicleA]);

  // Handle throttle rev-blip simulation
  const handleThrottleBlip = () => {
    if (!isPlaying) {
      startAudio(currentRpm);
    }

    setIsBlipActive(true);
    const ctx = audioCtxRef.current;
    if (ctx && oscRef.current && filterRef.current && gainRef.current) {
      const targetRpm = Math.min(vehicleA.redlineRpm - 400, currentRpm + 3800);
      const blipFreq = calculateFrequency(targetRpm, vehicleA);

      // Instantaneous blip attack & decay
      oscRef.current.frequency.cancelScheduledValues(ctx.currentTime);
      oscRef.current.frequency.exponentialRampToValueAtTime(blipFreq, ctx.currentTime + 0.22);
      oscRef.current.frequency.exponentialRampToValueAtTime(calculateFrequency(currentRpm, vehicleA), ctx.currentTime + 0.85);

      if (oscSubRef.current) {
        oscSubRef.current.frequency.exponentialRampToValueAtTime(blipFreq * 0.5, ctx.currentTime + 0.22);
        oscSubRef.current.frequency.exponentialRampToValueAtTime(calculateFrequency(currentRpm, vehicleA) * 0.5, ctx.currentTime + 0.85);
      }

      filterRef.current.frequency.exponentialRampToValueAtTime(blipFreq * 6, ctx.currentTime + 0.22);
      filterRef.current.frequency.exponentialRampToValueAtTime(Math.max(200, calculateFrequency(currentRpm, vehicleA) * 4), ctx.currentTime + 0.85);

      gainRef.current.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 0.2);
      gainRef.current.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.85);

      showToast({
        title: `${vehicleA.name} Throttle Blip`,
        message: `Rev blipped to ${targetRpm} RPM • Peak frequency ${Math.round(blipFreq)} Hz`,
        type: 'garage'
      });
    }

    setTimeout(() => {
      setIsBlipActive(false);
    }, 900);
  };

  // Update frequency when RPM changes via slider
  const handleRpmChange = (newRpm: number) => {
    setCurrentRpm(newRpm);
    const ctx = audioCtxRef.current;
    if (ctx && oscRef.current && filterRef.current) {
      const freq = calculateFrequency(newRpm, vehicleA);
      oscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
      if (oscSubRef.current) {
        oscSubRef.current.frequency.setTargetAtTime(freq * 0.5, ctx.currentTime, 0.05);
      }
      filterRef.current.frequency.setTargetAtTime(Math.max(200, freq * 4), ctx.currentTime, 0.05);
    }
  };

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Studio Dialog Container */}
      <div className="relative max-w-5xl w-full rounded-3xl bg-[#0B0C10] border border-amber-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-amber-500/20 bg-gradient-to-r from-[#14151C] via-[#0E0F14] to-[#14151C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-luxury-display text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-200 uppercase">
                  VALVETRAIN ACOUSTIC ATELIER
                </span>
                <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  WEB AUDIO SYNTHESIS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono-numbers tracking-wider uppercase mt-0.5">
                Real-Time Valvetrain Harmonic Analysis & Multi-Chassis Superposition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition border hidden sm:flex items-center gap-1.5 ${
                compareMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Superposition Matrix: Active' : 'Single Vehicle'}</span>
            </button>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#090A0D]">
          
          {/* Primary Acoustic Synthesizer Console */}
          <div className="p-6 rounded-3xl bg-[#101117] border border-amber-500/20 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Vehicle Selector Pills */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-850 pb-4">
              <div>
                <span className="text-[10px] font-mono-numbers text-amber-400 uppercase font-bold tracking-wider block">
                  ACTIVE ACOUSTIC TEST BENCH
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-luxury-display uppercase tracking-wide mt-0.5">
                  {vehicleA.name} • {vehicleA.engineCode}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono-numbers">
                {Object.values(ACOUSTIC_FLEET).map((veh) => (
                  <button
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      if (isPlaying) {
                        stopAudio();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs font-bold ${
                      selectedVehicleId === veh.id
                        ? 'bg-amber-400 text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {veh.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Synthesis Controls & Animated VU Meter */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              {/* Left: Playback & Blip Triggers */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        stopAudio();
                      } else {
                        startAudio(currentRpm);
                      }
                    }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-black transition-all shadow-xl active:scale-95 ${
                      isPlaying 
                        ? 'bg-amber-400 ring-4 ring-amber-400/30' 
                        : 'bg-white hover:bg-zinc-200'
                    }`}
                    title={isPlaying ? 'Halt Valvetrain Audio' : 'Ignite Valvetrain Soulprint'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <div>
                    <span className="text-xs font-bold text-white font-mono-numbers uppercase tracking-wider block">
                      {isPlaying ? 'ACOUSTIC RUN ACTIVE' : 'ENGINE COLD • READY'}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono-numbers">
                      {vehicleA.musicalNote}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleThrottleBlip}
                    className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-mono-numbers font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                      isBlipActive ? 'brightness-125 scale-95' : 'hover:brightness-105'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Free-Rev Blip</span>
                  </button>

                  <button
                    onClick={() => handleRpmChange(vehicleA.idleRpm)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                    title="Return to Idle"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center: Interactive RPM Slider */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-850">
                <div className="flex items-center justify-between text-xs font-mono-numbers">
                  <span className="text-zinc-400 uppercase flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ENGINE TACHOMETER</span>
                  </span>
                  <span className="text-amber-400 font-bold text-base">
                    {currentRpm} <span className="text-xs text-zinc-500">RPM</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={vehicleA.idleRpm}
                  max={vehicleA.redlineRpm}
                  step={25}
                  value={currentRpm}
                  onChange={(e) => handleRpmChange(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                />

                <div className="flex items-center justify-between text-[10px] font-mono-numbers text-zinc-500">
                  <span>Idle {vehicleA.idleRpm}</span>
                  <span>Mid {Math.round(vehicleA.redlineRpm / 2)}</span>
                  <span className="text-red-400 font-bold">Redline {vehicleA.redlineRpm}</span>
                </div>
              </div>

              {/* Right: Multi-Channel Real-Time VU Meter */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono-numbers text-zinc-400">
                  <span>SPECTRUM FREQUENCY</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(calculateFrequency(currentRpm, vehicleA))} HZ
                  </span>
                </div>

                {/* Animated Bars */}
                <div className="flex items-end gap-1 h-12 py-1 justify-between">
                  {[14, 22, 38, 48, 30, 24, 42, 54, 36, 28, 46, 52, 34, 20].map((h, i) => {
                    const barHeight = isPlaying 
                      ? Math.min(48, Math.max(6, (h * (currentRpm / vehicleA.redlineRpm)) + (i % 3) * 6)) 
                      : 4;
                    return (
                      <div
                        key={i}
                        className={`w-full rounded-sm transition-all duration-75 ${
                          isPlaying 
                            ? i > 10 ? 'bg-rose-400' : i > 7 ? 'bg-amber-400' : 'bg-emerald-400'
                            : 'bg-zinc-800'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono-numbers text-zinc-500">
                  <span>Sub-Bass</span>
                  <span>Harmonics</span>
                  <span>Valvetrain</span>
                </div>
              </div>

            </div>

            {/* Exhaust & Timbre Note */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 text-xs font-mono-numbers flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-zinc-300">
                <strong className="text-white">Acoustic Timbre:</strong> {vehicleA.timbreDescription}
              </span>
              <span className="text-amber-400 font-bold shrink-0">
                Exhaust: {vehicleA.exhaustSpec}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SUPERPOSITION MATRIX (Side-by-Side Chassis Comparison)   */}
          {/* ========================================================= */}
          {compareMode && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono-numbers uppercase text-amber-400 tracking-wider font-bold">
                    FLEET TELEMETRY SUPERPOSITION
                  </span>
                  <h3 className="text-base font-bold text-white font-luxury-display uppercase tracking-wide">
                    Chassis Engineering & Powerband Comparison
                  </h3>
                </div>

                {/* Compare Target Selector */}
                <div className="flex items-center gap-2 text-xs font-mono-numbers">
                  <span className="text-zinc-500 uppercase text-[10px]">Compare Against:</span>
                  <select
                    value={compareVehicleId}
                    onChange={(e) => setCompareVehicleId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                  >
                    {Object.values(ACOUSTIC_FLEET).filter(v => v.id !== vehicleA.id).map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.fullName})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Vehicle A Card */}
                <div className="posh-card p-5 rounded-2xl bg-[#0F1015] border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                    <div>
                      <span className="text-[10px] font-mono-numbers text-amber-400 uppercase font-bold block">
                        BENCH REFERENCE A
                      </span>
                      <h4 className="text-base font-bold text-white font-luxury-display">
                        {vehicleA.name} ({vehicleA.fullName})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-mono-numbers">
                      {vehicleA.powerBhp} BHP
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Specific Power</span>
                      <span className="font-bold text-white text-sm">
                        {(vehicleA.powerBhp / (parseFloat(vehicleA.displacement.replace(/[^0-9]/g, '')) / 1000)).toFixed(1)} BHP/L
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Power-to-Weight</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {((vehicleA.powerBhp / vehicleA.weightKg) * 1000).toFixed(0)} BHP/Tonne
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Rev Limit Redline</span>
                      <span className="font-bold text-white text-sm">{vehicleA.redlineRpm.toLocaleString()} RPM</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Peak Valvetrain Hz</span>
                      <span className="font-bold text-amber-400 text-sm">{vehicleA.peakFrequencyHz} Hz</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono-numbers">
                    Valvetrain: {vehicleA.valvetrainDesc}
                  </p>
                </div>

                {/* Vehicle B Card */}
                <div className="posh-card p-5 rounded-2xl bg-[#0F1015] border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                    <div>
                      <span className="text-[10px] font-mono-numbers text-cyan-400 uppercase font-bold block">
                        BENCH REFERENCE B
                      </span>
                      <h4 className="text-base font-bold text-white font-luxury-display">
                        {vehicleB.name} ({vehicleB.fullName})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 font-mono-numbers">
                      {vehicleB.powerBhp} BHP
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Specific Power</span>
                      <span className="font-bold text-white text-sm">
                        {(vehicleB.powerBhp / (parseFloat(vehicleB.displacement.replace(/[^0-9]/g, '')) / 1000)).toFixed(1)} BHP/L
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Power-to-Weight</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {((vehicleB.powerBhp / vehicleB.weightKg) * 1000).toFixed(0)} BHP/Tonne
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Rev Limit Redline</span>
                      <span className="font-bold text-white text-sm">{vehicleB.redlineRpm.toLocaleString()} RPM</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Peak Valvetrain Hz</span>
                      <span className="font-bold text-cyan-400 text-sm">{vehicleB.peakFrequencyHz} Hz</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono-numbers">
                    Valvetrain: {vehicleB.valvetrainDesc}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-black/60 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-numbers">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Harmonic Valvetrain Calibration Certified under Garage Protocol v2.4</span>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition shadow-sm"
          >
            Close Studio
          </button>
        </div>

      </div>

    </div>
  );
};
