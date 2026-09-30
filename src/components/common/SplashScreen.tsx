import { useState, useRef, useCallback } from 'react';
import type { FC } from 'react';
import { Volume2, VolumeX, ChevronRight, Power } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  carName?: string;
  carModel?: string;
}

export const SplashScreen: FC<SplashScreenProps> = ({ onEnter }) => {
  
  // State
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('garage_splash_audio') !== 'false';
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Smooth subtle parallax on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!parallaxRef.current) { rafRef.current = null; return; }
      const rect = parallaxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * 6;
      const dy = ((e.clientY - cy) / rect.height) * 6;
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

      // 1. Starter motor crank pulse (2 rhythmic engagements)
      [0, 0.12].forEach((timeOffset) => {
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'sawtooth';
        crank.frequency.setValueAtTime(75, ctx.currentTime + timeOffset);
        crankGain.gain.setValueAtTime(0.2, ctx.currentTime + timeOffset);
        crankGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + timeOffset + 0.08);
        crank.connect(crankGain);
        crankGain.connect(ctx.destination);
        crank.start(ctx.currentTime + timeOffset);
        crank.stop(ctx.currentTime + timeOffset + 0.09);
      });

      // 2. Combustion ignition flare & purr
      const fireTime = ctx.currentTime + 0.28;
      const fireOsc = ctx.createOscillator();
      const fireFilter = ctx.createBiquadFilter();
      const fireGain = ctx.createGain();

      fireOsc.type = 'sawtooth';
      fireOsc.frequency.setValueAtTime(65, fireTime);
      fireOsc.frequency.exponentialRampToValueAtTime(220, fireTime + 0.3); // Gentle rev rise
      fireOsc.frequency.exponentialRampToValueAtTime(60, fireTime + 0.85); // Smooth idle

      fireFilter.type = 'lowpass';
      fireFilter.frequency.setValueAtTime(240, fireTime);
      fireFilter.frequency.exponentialRampToValueAtTime(800, fireTime + 0.3);
      fireFilter.frequency.exponentialRampToValueAtTime(300, fireTime + 0.85);

      fireGain.gain.setValueAtTime(0.01, fireTime);
      fireGain.gain.linearRampToValueAtTime(0.35, fireTime + 0.18);
      fireGain.gain.exponentialRampToValueAtTime(0.02, fireTime + 1.1);

      fireOsc.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(ctx.destination);

      fireOsc.start(fireTime);
      fireOsc.stop(fireTime + 1.2);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleStartEngine = () => {
    if (isStarting || isAdmitting) return;
    setIsStarting(true);
    playEngineIgnitionSound();

    // After engine ignition flare, smoothly transition into the atelier
    setTimeout(() => {
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
    }, 300);
  };

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    localStorage.setItem('garage_splash_audio', String(nextState));
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-all duration-700 ${
        isAdmitting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      } bg-[#09090B] text-zinc-100 flex flex-col justify-between`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ========================================================= */}
      {/* 1. SANCTUARY PHOTOGRAPHIC CANVAS                          */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        
        {/* Parallax Image */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ 
            transform: 'scale(1.02)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src="/splash_curated.jpg"
            alt="DATUM Atelier Sanctuary"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Minimalist ambient lighting & vignettes */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Floor ignition glow pulse */}
        <div 
          className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-yellow-400/25 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 ${
            isStarting ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          }`} 
        />
      </div>

      {/* ========================================================= */}
      {/* 2. TOP MINIMALIST HEADER                                  */}
      {/* ========================================================= */}
      <header className="relative z-20 pt-6 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Minimalist Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold text-xs font-luxury-display shadow-xs border border-yellow-500">
            D
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-[0.3em] font-luxury-display uppercase text-white">
              DATUM ATELIER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Clean Controls */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition backdrop-blur-md cursor-pointer"
            title={audioEnabled ? 'Sound On' : 'Sound Muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-yellow-400" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          {/* Quick Enter Link */}
          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono-numbers text-zinc-200 hover:text-white transition backdrop-blur-md cursor-pointer"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5 text-yellow-400" />
          </button>
        </div>

      </header>

      {/* ========================================================= */}
      {/* 3. CENTER MINIMALIST ENGINE START BUTTON                  */}
      {/* ========================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4">
        
        <div className="space-y-6 max-w-md mx-auto">
          
          {/* The Engine Start / Stop Button */}
          <button
            onClick={handleStartEngine}
            disabled={isStarting}
            className={`group relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isStarting 
                ? 'scale-95 ring-8 ring-yellow-400/40 bg-zinc-900 border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)]' 
                : 'hover:scale-105 active:scale-95 bg-zinc-950/80 border-2 border-white/20 hover:border-yellow-400/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] ring-4 ring-white/5 hover:ring-yellow-400/20'
            } backdrop-blur-xl`}
          >
            {/* Pulsing Ambient Glow */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
              isStarting ? 'bg-yellow-400/20 animate-pulse' : 'group-hover:bg-yellow-400/10'
            }`} />

            {/* Inner Ring Texture */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 text-center">
              <Power className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300 ${
                isStarting ? 'text-yellow-400 animate-bounce' : 'text-zinc-400 group-hover:text-yellow-400'
              }`} />
              
              <span className={`text-[10px] sm:text-[11px] font-mono-numbers uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${
                isStarting ? 'text-yellow-400' : 'text-zinc-300 group-hover:text-white'
              }`}>
                {isStarting ? 'IGNITING...' : 'START ENGINE'}
              </span>
            </div>
          </button>

          {/* Minimalist Prompt Subtitle */}
          <div className="space-y-1">
            <p className="text-xs font-mono-numbers uppercase tracking-[0.25em] text-zinc-400">
              {isStarting ? 'Engaging Mechanical Ignition' : 'Tap to Start Engine & Enter'}
            </p>
            <p className="text-[11px] font-serif italic text-zinc-500">
              Mayfair Sanctuary • Sovereign Custody
            </p>
          </div>

        </div>

      </main>

      {/* ========================================================= */}
      {/* 4. BOTTOM MINIMALIST FOLIO FOOTER                         */}
      {/* ========================================================= */}
      <footer className="relative z-20 pb-6 text-center text-[10px] font-mono-numbers uppercase tracking-[0.3em] text-zinc-500">
        <span>DATUM ATELIER // VOL. IV</span>
      </footer>

    </div>
  );
};
