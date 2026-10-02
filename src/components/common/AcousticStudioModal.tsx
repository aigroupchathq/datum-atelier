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
  RotateCcw,
  Download,
  Copy,
  Radio,
  FileCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  FLEET_ACOUSTIC_PROFILES,
  analyzeAcousticProfile,
  issueAcousticPassport
} from '../../utils/acousticFingerprintEngine';
import type {
  EngineAcousticProfile,
  AcousticSpectrumData,
  AcousticPassportRecord
} from '../../utils/acousticFingerprintEngine';

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
  const [visMode, setVisMode] = useState<'spectrum' | 'oscilloscope'>('spectrum');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const { showToast } = useToast();

  const profileA: EngineAcousticProfile = FLEET_ACOUSTIC_PROFILES[selectedVehicleId] || FLEET_ACOUSTIC_PROFILES['car-maya-m3'];
  const profileB: EngineAcousticProfile = FLEET_ACOUSTIC_PROFILES[compareVehicleId] || FLEET_ACOUSTIC_PROFILES['car-kuro-gt3'];

  // Current acoustic analytics
  const analysisA: AcousticSpectrumData = analyzeAcousticProfile(profileA, currentRpm);
  const analysisB: AcousticSpectrumData = analyzeAcousticProfile(profileB, profileB.idleRpm + (profileB.redlineRpm - profileB.idleRpm) * 0.5);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscSubRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Canvas visualizer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop audio synthesis cleanly
  const stopAudio = useCallback(() => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.12);
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
      analyserRef.current = null;
      setIsPlaying(false);
    }, 140);
  }, []);

  // Calculate synthesized fundamental frequency based on combustion physics
  const calculateFrequency = useCallback((rpm: number, prof: EngineAcousticProfile) => {
    const rpmFrac = (rpm - prof.idleRpm) / (prof.redlineRpm - prof.idleRpm);
    const clampedFrac = Math.max(0, Math.min(1, rpmFrac));
    const baseHz = (prof.idleRpm / 60) * (prof.cylinders / 2);
    const redlineHz = (prof.redlineRpm / 60) * (prof.cylinders / 2);
    return Math.max(25, baseHz + clampedFrac * (redlineHz - baseHz));
  }, []);

  // Start continuous audio synthesis with real AnalyserNode
  const startAudio = useCallback((rpm: number) => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

      const fundamentalFreq = calculateFrequency(rpm, profileA);

      // Primary tone oscillator (sawtooth for mechanical valvetrain bite)
      const osc = ctx.createOscillator();
      osc.type = profileA.configuration === 'F6' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(fundamentalFreq, ctx.currentTime);

      // Sub-harmonic bass oscillator (for deep exhaust pulse depth)
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sawtooth';
      oscSub.frequency.setValueAtTime(fundamentalFreq * 0.5, ctx.currentTime);

      // Biquad resonance filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.max(180, fundamentalFreq * 4.2), ctx.currentTime);
      filter.Q.setValueAtTime(3.8, ctx.currentTime);

      // AnalyserNode for Real-Time FFT & Waveform Visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;

      // Master output gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.26, ctx.currentTime + 0.1);

      // Node graph routing: (Osc + OscSub) -> Filter -> Analyser -> Gain -> Destination
      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscSub.start();

      oscRef.current = osc;
      oscSubRef.current = oscSub;
      filterRef.current = filter;
      analyserRef.current = analyser;
      gainRef.current = gain;

      setIsPlaying(true);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [calculateFrequency, profileA]);

  // Handle throttle rev-blip simulation
  const handleThrottleBlip = () => {
    if (!isPlaying) {
      startAudio(currentRpm);
    }

    setIsBlipActive(true);
    const ctx = audioCtxRef.current;
    if (ctx && oscRef.current && filterRef.current && gainRef.current) {
      const targetRpm = Math.min(profileA.redlineRpm - 300, currentRpm + 3600);
      const blipFreq = calculateFrequency(targetRpm, profileA);

      // Instantaneous blip attack & decay
      oscRef.current.frequency.cancelScheduledValues(ctx.currentTime);
      oscRef.current.frequency.exponentialRampToValueAtTime(blipFreq, ctx.currentTime + 0.2);
      oscRef.current.frequency.exponentialRampToValueAtTime(calculateFrequency(currentRpm, profileA), ctx.currentTime + 0.82);

      if (oscSubRef.current) {
        oscSubRef.current.frequency.exponentialRampToValueAtTime(blipFreq * 0.5, ctx.currentTime + 0.2);
        oscSubRef.current.frequency.exponentialRampToValueAtTime(calculateFrequency(currentRpm, profileA) * 0.5, ctx.currentTime + 0.82);
      }

      filterRef.current.frequency.exponentialRampToValueAtTime(blipFreq * 5.5, ctx.currentTime + 0.2);
      filterRef.current.frequency.exponentialRampToValueAtTime(Math.max(180, calculateFrequency(currentRpm, profileA) * 4), ctx.currentTime + 0.82);

      gainRef.current.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.18);
      gainRef.current.gain.linearRampToValueAtTime(0.26, ctx.currentTime + 0.82);

      showToast({
        title: `${profileA.name} Throttle Blip`,
        message: `Rev blipped to ${targetRpm} RPM • Peak Combustion Hz: ${Math.round(blipFreq)} Hz`,
        type: 'garage'
      });
    }

    setTimeout(() => {
      setIsBlipActive(false);
    }, 850);
  };

  // Update frequency when RPM changes via slider
  const handleRpmChange = (newRpm: number) => {
    setCurrentRpm(newRpm);
    const ctx = audioCtxRef.current;
    if (ctx && oscRef.current && filterRef.current) {
      const freq = calculateFrequency(newRpm, profileA);
      oscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.04);
      if (oscSubRef.current) {
        oscSubRef.current.frequency.setTargetAtTime(freq * 0.5, ctx.currentTime, 0.04);
      }
      filterRef.current.frequency.setTargetAtTime(Math.max(180, freq * 4.2), ctx.currentTime, 0.04);
    }
  };

  // Live Canvas FFT & Oscilloscope Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#07080A';
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const analyser = analyserRef.current;

      if (isPlaying && analyser) {
        if (visMode === 'spectrum') {
          // FFT Frequency Spectrum Bars
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          const barCount = 48;
          const barWidth = (width / barCount) - 2;

          for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor(Math.pow(i / barCount, 1.4) * (bufferLength / 3));
            const value = dataArray[dataIndex] || 0;
            const barHeight = Math.max(3, (value / 255) * (height - 18));

            // Color gradient across acoustic frequency bands
            let gradientColor = '#10B981'; // Sub-bass emerald
            if (i > 12 && i <= 26) gradientColor = '#F59E0B'; // Exhaust throat amber
            else if (i > 26 && i <= 38) gradientColor = '#EC4899'; // Valvetrain rasp rose
            else if (i > 38) gradientColor = '#06B6D4'; // Turbo spool cyan

            ctx.fillStyle = gradientColor;
            ctx.shadowColor = gradientColor;
            ctx.shadowBlur = 6;
            ctx.fillRect(i * (barWidth + 2) + 2, height - barHeight - 4, barWidth, barHeight);
            ctx.shadowBlur = 0;
          }

          // Spectrum Frequency Band Annotation Footers
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '9px monospace';
          ctx.fillText('SUB-BASS (20-120Hz)', 10, 14);
          ctx.fillText('EXHAUST THROAT (120-450Hz)', width * 0.28, 14);
          ctx.fillText('VALVETRAIN (450-1.8kHz)', width * 0.62, 14);

        } else {
          // Time-Domain Mechanical Oscilloscope Waveform
          const bufferLength = analyser.fftSize;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.2;
          ctx.strokeStyle = '#F59E0B';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 8;
          ctx.beginPath();

          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
          }

          ctx.lineTo(width, height / 2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.font = '9px monospace';
          ctx.fillText('TIME-DOMAIN CYLINDER FIRING PRESSURE WAVEFORM', 10, 14);
        }
      } else {
        // Resting Standby Baseline
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VALVETRAIN ACOUSTIC SENSORS IDLE • TAP PLAY TO INITIALIZE FFT SPECTRUM', width / 2, height / 2 - 10);
        ctx.textAlign = 'left';
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, visMode]);

  // Cleanup audio nodes on unmount or close
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Export / Download Official Acoustic Valvetrain Passport
  const handleExportPassport = () => {
    const passport: AcousticPassportRecord = issueAcousticPassport(profileA);
    const payload = {
      document: 'DATUM_ATELIER_ACOUSTIC_VALVETRAIN_PASSPORT',
      standard: 'ISO_10844_UK_NOISE_COMPLIANT',
      passport,
      fleetProfile: profileA,
      harmonicAnalysis: analysisA
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACOUSTIC_PASSPORT_${profileA.engineCode}_${profileA.name}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      title: 'Valvetrain Sound Passport Minted',
      message: `Cryptographic Acoustic Hash ${passport.fingerprintHash} downloaded under Anti-ASD Protocol.`,
      type: 'success',
      badge: 'ACOUSTICS'
    });
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(analysisA.acousticFingerprintHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    showToast({
      title: 'Acoustic Hash Copied',
      message: `${analysisA.acousticFingerprintHash} copied to clipboard.`,
      type: 'garage'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Studio Dialog Container */}
      <div className="relative max-w-5xl w-full rounded-3xl bg-[#0B0C10] border border-amber-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="px-6 sm:px-8 py-4.5 border-b border-amber-500/20 bg-gradient-to-r from-[#14151C] via-[#0E0F14] to-[#14151C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-luxury-display text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-200 uppercase">
                  VALVETRAIN ACOUSTIC HARMONICS STUDIO
                </span>
                <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  FFT SPECTRUM ENGINE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono-numbers tracking-wider uppercase mt-0.5">
                Real-Time Fast Fourier Transform • Cryptographic Audio Fingerprinting • Anti-ASD Ban
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition border hidden sm:flex items-center gap-1.5 ${
                compareMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Dual Superposition: ON' : 'Single Vehicle'}</span>
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
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#090A0D]">
          
          {/* Primary Acoustic Synthesizer & Canvas Console */}
          <div className="p-6 rounded-3xl bg-[#101117] border border-amber-500/25 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Vehicle Selector Pills & Fingerprint Monogram */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-numbers text-amber-400 uppercase font-bold tracking-wider">
                    ACOUSTIC REFERENCE BENCHMARK
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono-numbers font-bold border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    ANTI-ASD PURITY: {analysisA.mechanicalAuthenticityScore}%
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-luxury-display uppercase tracking-wide mt-0.5">
                  {profileA.name} • {profileA.engineCode}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono-numbers">
                {Object.values(FLEET_ACOUSTIC_PROFILES).map((veh) => (
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

            {/* REAL-TIME HTML5 CANVAS VISUALIZER (FFT Spectrum vs Oscilloscope) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-numbers px-1">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>ACOUSTIC HARMONICS MONITOR</span>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-amber-300 font-bold text-[11px]">
                    {analysisA.timbreProfileLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setVisMode('spectrum')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-numbers transition ${
                      visMode === 'spectrum' 
                        ? 'bg-amber-400 text-black font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    FFT Spectrum
                  </button>
                  <button
                    onClick={() => setVisMode('oscilloscope')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-numbers transition ${
                      visMode === 'oscilloscope' 
                        ? 'bg-amber-400 text-black font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Oscilloscope
                  </button>
                </div>
              </div>

              {/* The HTML5 Canvas Viewport */}
              <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-black/60 shadow-inner relative">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={150}
                  className="w-full h-36 block"
                />
              </div>
            </div>

            {/* Audio Synthesis Controls & Dynamic Telemetry Gauges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
              
              {/* Left: Playback & Blip Triggers */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        stopAudio();
                      } else {
                        startAudio(currentRpm);
                      }
                    }}
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-black transition-all shadow-xl active:scale-95 cursor-pointer ${
                      isPlaying 
                        ? 'bg-amber-400 ring-4 ring-amber-400/30' 
                        : 'bg-white hover:bg-zinc-200'
                    }`}
                    title={isPlaying ? 'Halt Valvetrain Audio' : 'Ignite Valvetrain Soulprint'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <div>
                    <span className="text-xs font-bold text-white font-mono-numbers uppercase tracking-wider block">
                      {isPlaying ? 'ACOUSTIC RUN ACTIVE' : 'ENGINE COLD • READY'}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono-numbers">
                      {profileA.exhaustSystem}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleThrottleBlip}
                    className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-mono-numbers font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                      isBlipActive ? 'brightness-125 scale-95' : 'hover:brightness-105'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Free-Rev Blip (+3,600 RPM)</span>
                  </button>

                  <button
                    onClick={() => handleRpmChange(profileA.idleRpm)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
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
                    {currentRpm.toLocaleString()} <span className="text-xs text-zinc-500">RPM</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={profileA.idleRpm}
                  max={profileA.redlineRpm}
                  step={25}
                  value={currentRpm}
                  onChange={(e) => handleRpmChange(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                />

                <div className="flex items-center justify-between text-[10px] font-mono-numbers text-zinc-500">
                  <span>Idle {profileA.idleRpm}</span>
                  <span>Mid {Math.round(profileA.redlineRpm / 2)}</span>
                  <span className="text-red-400 font-bold">Redline {profileA.redlineRpm}</span>
                </div>
              </div>

              {/* Right: Sound Pressure & Harmonic Ratios */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2.5 text-xs font-mono-numbers">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[10px] uppercase">DECIBEL SPL RATING</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {analysisA.decibelSpl} dB(A)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="text-zinc-500 block">Firing Freq</span>
                    <strong className="text-emerald-400">{analysisA.fundamentalFreqHz} Hz</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-zinc-800">
                    <span className="text-zinc-500 block">Valvetrain Hz</span>
                    <strong className="text-rose-400">{analysisA.valvetrainRaspHz} Hz</strong>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-0.5">
                  <span>UK Noise Compliance:</span>
                  <span className="text-emerald-400 font-bold">Stationary Pass</span>
                </div>
              </div>

            </div>

            {/* Cryptographic Acoustic Fingerprint Bar & Passport Export Button */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-numbers">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 uppercase">ACOUSTIC FINGERPRINT HASH:</span>
                    <span className="text-amber-300 font-bold tracking-wider">{analysisA.acousticFingerprintHash}</span>
                    <button
                      onClick={handleCopyHash}
                      className="p-1 rounded text-zinc-400 hover:text-white transition"
                      title="Copy Hash"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedHash && <span className="text-[9px] text-emerald-400 font-bold">Copied!</span>}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Deterministic Timbre Hash derived from {profileA.cylinders}-cyl {profileA.configuration} {profileA.displacementCc}cc firing order {profileA.firingOrder}
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportPassport}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono-numbers transition flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Valvetrain Passport</span>
              </button>
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
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {Object.values(FLEET_ACOUSTIC_PROFILES).filter(v => v.id !== profileA.id).map((v) => (
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
                        {profileA.name} ({profileA.fullName})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-mono-numbers">
                      {profileA.engineCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Firing Frequency</span>
                      <span className="font-bold text-white text-sm">
                        {analysisA.fundamentalFreqHz} Hz @ {currentRpm} RPM
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Sound Pressure</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {analysisA.decibelSpl} dB(A)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Rev Limit Redline</span>
                      <span className="font-bold text-white text-sm">{profileA.redlineRpm.toLocaleString()} RPM</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Valvetrain Clatter</span>
                      <span className="font-bold text-amber-400 text-sm">{analysisA.valvetrainRaspHz} Hz</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono-numbers">
                    Exhaust: {profileA.exhaustSystem}
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
                        {profileB.name} ({profileB.fullName})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 font-mono-numbers">
                      {profileB.engineCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Firing Frequency</span>
                      <span className="font-bold text-white text-sm">
                        {analysisB.fundamentalFreqHz} Hz @ 50% Load
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Sound Pressure</span>
                      <span className="font-bold text-cyan-400 text-sm">
                        {analysisB.decibelSpl} dB(A)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Rev Limit Redline</span>
                      <span className="font-bold text-white text-sm">{profileB.redlineRpm.toLocaleString()} RPM</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <span className="text-[10px] text-zinc-500 block uppercase">Valvetrain Clatter</span>
                      <span className="font-bold text-cyan-400 text-sm">{analysisB.valvetrainRaspHz} Hz</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono-numbers">
                    Exhaust: {profileB.exhaustSystem}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-3.5 bg-black/60 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-numbers">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Valvetrain Harmonics & Acoustic Fingerprint Certified under DATUM Protocol v3.0</span>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition shadow-sm cursor-pointer"
          >
            Close Studio
          </button>
        </div>

      </div>

    </div>
  );
};
