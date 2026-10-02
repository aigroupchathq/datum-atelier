import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import type { CommunityPost } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  calculateGearAndRpm,
  calculateTachometerAngle,
  calculateOilPressure,
  calculateBoostPressure,
  calculateGForceCoords,
  formatOdometer,
  type DriveMode
} from '../../utils/dashboardKinematics';
import {
  Zap,
  Volume2,
  VolumeX,
  Sliders,
  Compass,
  ChevronRight
} from 'lucide-react';

interface ObsidianDashboardBinnacleProps {
  post: CommunityPost;
  onOpenTelemetryModal?: () => void;
}

export const ObsidianDashboardBinnacle: FC<ObsidianDashboardBinnacleProps> = ({
  post,
  onOpenTelemetryModal
}) => {
  const { showToast } = useToast();

  // Cockpit Switchgear State
  const [driveMode, setDriveMode] = useState<DriveMode>('SPORT');
  const [speedUnit, setSpeedUnit] = useState<'MPH' | 'KPH'>('MPH');
  const [isExhaustOpen, setIsExhaustOpen] = useState<boolean>(true);
  const [isPasmFirm, setIsPasmFirm] = useState<boolean>(true);
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [revBoost, setRevBoost] = useState<number>(0);

  // Derive baseline speed from post
  const baseSpeedMph = useMemo(() => {
    if (post.postType === 'DRIVE') return 84;
    if (post.postType === 'BUILD_UPDATE') return 0;
    if (post.postType === 'GUIDE' || post.postType === 'MILESTONE') return 62;
    return 45;
  }, [post.postType]);

  // Handle interactive throttle blip
  const handleThrottleBlip = () => {
    if (isRevving) return;
    setIsRevving(true);
    setRevBoost(3200);

    const vehicleTitle = post.authorVehicleModel || post.authorVehicleName || 'Sovereign GT';

    showToast({
      title: `${vehicleTitle} // Throttle Blip`,
      message: `8,400 RPM Flat-Six Overrun Crackle · ${isExhaustOpen ? 'Exhaust Valves Open' : 'Valves Muffled'}`,
      type: 'drive'
    });

    const timer1 = setTimeout(() => setRevBoost(1400), 400);
    const timer2 = setTimeout(() => {
      setRevBoost(0);
      setIsRevving(false);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Derive comprehensive automotive kinematics
  const kinematics = useMemo(() => {
    const rawSpeed = baseSpeedMph;
    const currentSpeed = speedUnit === 'MPH' ? rawSpeed : Math.round(rawSpeed * 1.60934);
    
    // Core transmission & tachometer calculations
    const baseCalc = calculateGearAndRpm(rawSpeed, driveMode);
    const effectiveRpm = Math.min(9000, baseCalc.rpm + revBoost);
    const needleDeg = calculateTachometerAngle(effectiveRpm);
    
    // Engine mechanical vitals
    const oilTemp = driveMode === 'TRACK' ? 92 : driveMode === 'SPORT+' ? 95 : 98;
    const oilPressure = calculateOilPressure(effectiveRpm, oilTemp);
    const coolantTemp = 90;
    const boostPressure = calculateBoostPressure(baseCalc.throttlePct, driveMode);

    // G-Force Vector Dynamics
    const latG = post.postType === 'DRIVE' ? 0.92 : 0.15;
    const longG = isRevving ? 0.65 : 0.28;
    const gCoords = calculateGForceCoords(latG, longG, 1.5, 34);

    return {
      speedDisplay: currentSpeed,
      gear: baseCalc.gear,
      rpm: effectiveRpm,
      throttlePct: isRevving ? 95 : baseCalc.throttlePct,
      shiftLights: isRevving ? 5 : baseCalc.shiftLightsCount,
      needleDeg,
      oilTemp,
      oilPressure,
      coolantTemp,
      boostPressure,
      gCoords,
      latG,
      longG
    };
  }, [baseSpeedMph, speedUnit, driveMode, revBoost, isRevving, post.postType]);

  // Clock time
  const [clockTime, setClockTime] = useState<string>('14:32:05');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#131318] via-[#0E0E12] to-[#09090C] border-b border-[#C5A059]/35 text-[#F2F2F0] font-sans">
      
      {/* Horological Sapphire Glass Reflection Overlay */}
      <div className="absolute inset-0 cluster-glass pointer-events-none z-20" />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP BINNACLE COWL & INSTRUMENT STATUS EYEBROW            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-6 py-2.5 bg-[#0A0A0E] border-b border-[#C5A059]/25 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-numbers">
        
        {/* Left: Ignition Beacon & Vehicle Identifier */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-[#C5A059]/30">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#D4AF37] animate-pulse" />
            <span className="font-bold text-[#E6C687] uppercase tracking-wider text-[9px]">
              IGNITION ARMED
            </span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="font-bold tracking-widest uppercase text-zinc-300 truncate">
            {post.authorVehicleModel || post.authorVehicleName || 'PORSCHE 911 GT3'} COCKPIT
          </span>
        </div>

        {/* Center: Live Horological Chronometer */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-black/40 border border-white/5 text-[9.5px]">
          <span className="text-[#C5A059] font-bold">UTC CHRONO</span>
          <span className="text-zinc-300 font-mono-numbers font-semibold">{clockTime}</span>
        </div>

        {/* Right: Chassis Number & 24K Ingot Token */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-zinc-500 hidden sm:inline text-[9px]">CHASSIS #042</span>
          <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#E6C687] border border-[#C5A059]/40 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1">
            <span>24K</span>
            <span className="text-zinc-400 font-normal">PROVENANCE</span>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. MAIN INSTRUMENT CLUSTER (TRIPLE-DIAL BINNACLE)           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-center justify-items-center relative z-10">

        {/* ── DIAL 1: TACHOMETER & TRANSMISSION BINNACLE ── */}
        <div className="w-full max-w-[220px] aspect-square rounded-full gold-dial-ring p-3 relative flex flex-col items-center justify-center knurled-dial group select-none">
          {/* Subtle concentric chapter track */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#C5A059]/25 pointer-events-none" />

          {/* SVG Tachometer Dial Scale */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
            {/* Safe Rev Scale Arc (0 to 7,200 RPM) */}
            <path
              d="M 46.3 153.7 A 76 76 0 1 1 175 88"
              fill="none"
              stroke="rgba(212, 175, 55, 0.20)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Redline Danger Arc (7,200 to 9,000 RPM) */}
            <path
              d="M 175 88 A 76 76 0 0 1 146.3 162.7"
              fill="none"
              stroke="#E11D48"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
              filter="drop-shadow(0 0 4px rgba(225, 29, 72, 0.6))"
            />

            {/* Dial Numerical Markers (0 to 9) */}
            {[
              { val: 0, x: 50, y: 154 },
              { val: 1, x: 38, y: 122 },
              { val: 2, x: 42, y: 84 },
              { val: 3, x: 62, y: 52 },
              { val: 4, x: 96, y: 40 },
              { val: 5, x: 130, y: 46 },
              { val: 6, x: 154, y: 74 },
              { val: 7, x: 162, y: 110 },
              { val: 8, x: 152, y: 144 },
              { val: 9, x: 128, y: 166 }
            ].map(({ val, x, y }) => (
              <text
                key={val}
                x={x}
                y={y}
                fill={val >= 8 ? '#FB7185' : '#D4AF37'}
                fontSize="10"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
                opacity={val >= 8 ? 0.95 : 0.8}
              >
                {val}
              </text>
            ))}

            {/* Rotating 24K Gold Sweep Needle */}
            <g
              style={{
                transform: `rotate(${kinematics.needleDeg}deg)`,
                transformOrigin: '100px 100px',
                transition: isRevving ? 'transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28)' : 'transform 0.4s ease-out'
              }}
            >
              {/* Tapered Needle */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="drop-shadow(0 0 3px rgba(245, 158, 11, 0.6))"
              />
              <line
                x1="100"
                y1="28"
                x2="100"
                y2="22"
                stroke="#E11D48"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Center Boss / Gold Pivot Cap */}
              <circle cx="100" cy="100" r="8" fill="#1C1C24" stroke="#D4AF37" strokeWidth="2" />
              <circle cx="100" cy="100" r="3" fill="#D4AF37" />
            </g>
          </svg>

          {/* Central Digital Gear & Shift Lights */}
          <div className="relative z-10 flex flex-col items-center justify-center mt-2 text-center pointer-events-auto">
            {/* Shift Light Array (5 LEDs) */}
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((idx) => {
                const isActive = kinematics.shiftLights >= idx;
                const isPeak = idx >= 4;
                return (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                      isActive
                        ? isPeak
                          ? 'bg-rose-500 shadow-[0_0_6px_#F43F5E]'
                          : 'bg-[#D4AF37] shadow-[0_0_5px_#F59E0B]'
                        : 'bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Gear Display */}
            <div className="w-12 h-12 rounded-xl bg-black/75 border border-[#C5A059]/40 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[8px] font-mono-numbers text-[#C5A059] uppercase tracking-widest leading-none">
                GEAR
              </span>
              <span className="text-xl font-bold font-mono-numbers text-white leading-tight">
                {kinematics.gear}
              </span>
            </div>

            {/* Real-time RPM Readout */}
            <div className="mt-1 text-[10px] font-mono-numbers font-bold text-[#E6C687]">
              {kinematics.rpm.toLocaleString()} <span className="text-[8px] text-zinc-400">RPM</span>
            </div>
            <div className="text-[8px] font-mono-numbers text-zinc-400">
              {kinematics.throttlePct}% THROTTLE
            </div>
          </div>
        </div>

        {/* ── DIAL 2: HOROLOGICAL SPEEDOMETER & G-METER CROSSHAIR ── */}
        <div className="w-full max-w-[220px] aspect-square rounded-full gold-dial-ring p-3 relative flex flex-col items-center justify-center knurled-dial select-none">
          <div className="absolute inset-2 rounded-full border border-dashed border-[#C5A059]/25 pointer-events-none" />

          {/* Central Horological Speed Display */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            
            <button
              onClick={() => setSpeedUnit(prev => prev === 'MPH' ? 'KPH' : 'MPH')}
              className="group/unit flex flex-col items-center cursor-pointer transition-transform active:scale-95"
              title="Click to toggle MPH / KPH"
            >
              <span className="text-4xl sm:text-5xl font-extrabold font-mono-numbers text-white tracking-tight drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
                {kinematics.speedDisplay}
              </span>
              <span className="text-[10px] font-mono-numbers font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-1 group-hover/unit:text-white transition-colors">
                <span>{speedUnit}</span>
                <span className="text-[8px] text-zinc-500">[SWITCH]</span>
              </span>
            </button>

            {/* G-Force Target Crosshair Display */}
            <div className="mt-3 relative w-16 h-16 rounded-full bg-black/60 border border-[#C5A059]/30 flex items-center justify-center">
              {/* Polar Target Grid Rings */}
              <div className="absolute inset-1 rounded-full border border-white/5" />
              <div className="absolute inset-3 rounded-full border border-white/5" />
              {/* Crosshair Axes */}
              <div className="absolute inset-x-0 h-[1px] bg-white/10" />
              <div className="absolute inset-y-0 w-[1px] bg-white/10" />

              {/* Dynamic G-Ball Vector Dot */}
              <div
                className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] border border-black shadow-[0_0_8px_#F59E0B] transition-transform duration-300 relative z-10"
                style={{
                  transform: `translate(${kinematics.gCoords.x}px, ${kinematics.gCoords.y}px)`
                }}
              />
            </div>

            {/* G-Force Readout */}
            <div className="mt-1 text-[9px] font-mono-numbers text-[#E6C687] font-bold">
              {kinematics.latG > 0 ? `+${kinematics.latG.toFixed(2)}G` : `${kinematics.latG.toFixed(2)}G`} <span className="text-zinc-500 font-normal">LAT APEX</span>
            </div>
          </div>
        </div>

        {/* ── DIAL 3: QUAD MECHANICAL VITALS & TRANSDUCERS ── */}
        <div className="w-full max-w-[220px] aspect-square rounded-full gold-dial-ring p-3 relative flex flex-col items-center justify-center knurled-dial select-none">
          <div className="absolute inset-2 rounded-full border border-dashed border-[#C5A059]/25 pointer-events-none" />

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-2 text-center">
            
            {/* Dial Title */}
            <div className="text-[8.5px] font-mono-numbers font-bold text-[#D4AF37] tracking-widest uppercase">
              TRANSDUCER VITALS
            </div>

            {/* 2x2 Grid of Engine Mechanical Metrics */}
            <div className="grid grid-cols-2 gap-2 w-full px-2 text-[9px] font-mono-numbers">
              {/* Oil Temp */}
              <div className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-center">
                <span className="text-zinc-400 block text-[7.5px]">OIL TEMP</span>
                <span className="text-[#E6C687] font-bold">{kinematics.oilTemp}°C</span>
              </div>
              {/* Oil Pressure */}
              <div className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-center">
                <span className="text-zinc-400 block text-[7.5px]">OIL PRESS</span>
                <span className="text-cyan-300 font-bold">{kinematics.oilPressure} BAR</span>
              </div>
              {/* Coolant */}
              <div className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-center">
                <span className="text-zinc-400 block text-[7.5px]">COOLANT</span>
                <span className="text-emerald-400 font-bold">{kinematics.coolantTemp}°C</span>
              </div>
              {/* Boost Pressure */}
              <div className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-center">
                <span className="text-zinc-400 block text-[7.5px]">BOOST</span>
                <span className="text-amber-400 font-bold">{kinematics.boostPressure} BAR</span>
              </div>
            </div>

            {/* Status Pilot Lamp */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[8px] font-mono-numbers text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34D399]" />
              <span>SYSTEMS OPTIMAL</span>
            </div>

          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. TACTILE ROTARY SWITCHGEAR POD (Automotive 3-Knob Console) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-4 bg-[#0A0A0D] border-t border-[#C5A059]/25 flex flex-wrap items-center justify-around gap-4 text-[10px] font-mono-numbers relative z-10">
        
        {/* Rotary Dial 1: DRIVE PROGRAM */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[8px] font-mono-numbers text-zinc-400 uppercase tracking-widest font-bold">
            DRIVE PROGRAM
          </span>
          <button
            onClick={() => {
              const modes: DriveMode[] = ['COMFORT', 'SPORT', 'SPORT+', 'TRACK', 'ATELIER'];
              const nextIdx = (modes.indexOf(driveMode) + 1) % modes.length;
              const nextMode = modes[nextIdx];
              setDriveMode(nextMode);
              showToast({
                title: `Drive Mode // ${nextMode}`,
                message: `Rotary calibration shifted to ${nextMode} powerband maps.`,
                type: 'drive'
              });
            }}
            className="w-14 h-14 rounded-full gold-dial-ring p-1 relative flex flex-col items-center justify-center knurled-dial cursor-pointer active:scale-95 transition-transform group shadow-md"
            title="Click to rotate Drive Program"
          >
            {/* Outer notch indicator */}
            <div 
              className="absolute w-1 h-2.5 rounded bg-[#D4AF37] top-0.5 shadow-[0_0_6px_#D4AF37] transition-transform duration-300"
              style={{
                transform: `rotate(${['COMFORT', 'SPORT', 'SPORT+', 'TRACK', 'ATELIER'].indexOf(driveMode) * 72}deg)`,
                transformOrigin: 'center 26px'
              }}
            />
            <span className="text-[8.5px] font-bold font-mono-numbers text-[#E6C687] leading-tight mt-1">
              {driveMode}
            </span>
            <span className="text-[6.5px] text-zinc-500 uppercase">CYCLE ↻</span>
          </button>
        </div>

        {/* Rotary Dial 2: PASM SUSPENSION */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[8px] font-mono-numbers text-zinc-400 uppercase tracking-widest font-bold">
            SUSPENSION
          </span>
          <button
            onClick={() => {
              setIsPasmFirm(!isPasmFirm);
              showToast({
                title: isPasmFirm ? 'Damper // PASM Soft (Touring)' : 'Damper // PASM Firm (Apex Attack)',
                message: isPasmFirm ? 'Valving opened for compliant alpine road surface' : 'Stiffened compression & rebound for high-G stability',
                type: 'drive'
              });
            }}
            className={`w-14 h-14 rounded-full p-1 relative flex flex-col items-center justify-center knurled-dial cursor-pointer active:scale-95 transition-transform shadow-md ${
              isPasmFirm ? 'gold-dial-ring' : 'bg-black/60 border border-white/10'
            }`}
            title="Click to toggle Adaptive Dampers"
          >
            <Sliders className={`w-3.5 h-3.5 mb-0.5 ${isPasmFirm ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
            <span className={`text-[8px] font-bold font-mono-numbers ${isPasmFirm ? 'text-[#FFF8E7]' : 'text-zinc-400'}`}>
              {isPasmFirm ? 'FIRM' : 'SOFT'}
            </span>
            <span className="text-[6.5px] text-zinc-500 uppercase">PASM</span>
          </button>
        </div>

        {/* Rotary Dial 3: EXHAUST SOUND */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[8px] font-mono-numbers text-zinc-400 uppercase tracking-widest font-bold">
            EXHAUST
          </span>
          <button
            onClick={() => {
              setIsExhaustOpen(!isExhaustOpen);
              showToast({
                title: isExhaustOpen ? 'Exhaust // Quiet Flap Closed' : 'Exhaust // Sport Valves Open',
                message: isExhaustOpen ? 'Secondary bypass closed for civil neighborhood transit' : 'Full acoustic straight-pipe resonance armed',
                type: 'drive'
              });
            }}
            className={`w-14 h-14 rounded-full p-1 relative flex flex-col items-center justify-center knurled-dial cursor-pointer active:scale-95 transition-transform shadow-md ${
              isExhaustOpen ? 'gold-dial-ring' : 'bg-black/60 border border-white/10'
            }`}
            title="Click to toggle Exhaust Bypass Flaps"
          >
            {isExhaustOpen ? <Volume2 className="w-3.5 h-3.5 text-amber-400 mb-0.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500 mb-0.5" />}
            <span className={`text-[8px] font-bold font-mono-numbers ${isExhaustOpen ? 'text-amber-300' : 'text-zinc-400'}`}>
              {isExhaustOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <span className="text-[6.5px] text-zinc-500 uppercase">VALVES</span>
          </button>
        </div>

        {/* Push-Button Engine Ignition / Throttle Blip */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[8px] font-mono-numbers text-[#D4AF37] uppercase tracking-widest font-bold">
            IGNITION
          </span>
          <button
            onClick={handleThrottleBlip}
            disabled={isRevving}
            className={`w-14 h-14 rounded-full p-1 relative flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all shadow-lg ${
              isRevving
                ? 'bg-rose-600 text-white animate-pulse border-2 border-white'
                : 'bg-gradient-to-b from-[#2B1B0E] to-[#120B05] border-2 border-[#D4AF37] hover:border-[#FFF8E7] text-[#D4AF37] hover:text-white'
            }`}
            title="Push to Blip Throttle and Rev to 8,400 RPM"
          >
            <Zap className={`w-3.5 h-3.5 fill-current mb-0.5 ${isRevving ? 'text-white' : 'text-[#D4AF37]'}`} />
            <span className="text-[8px] font-extrabold font-mono-numbers leading-tight uppercase">
              {isRevving ? 'REV' : 'START'}
            </span>
            <span className="text-[6.5px] text-[#C5A059] uppercase">BLIP</span>
          </button>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. ROLLING MECHANICAL ODOMETER & TRIP METRICS RIBBON        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#08080A] border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono-numbers">
        
        {/* Rolling Odometer Display */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[8.5px] uppercase font-bold">TOTAL ODO</span>
          <div className="px-2 py-0.5 rounded bg-black border border-white/10 text-[#E6C687] font-bold tracking-widest shadow-inner">
            {formatOdometer(18420.4)} <span className="text-[8px] text-zinc-500">MI</span>
          </div>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 text-[9px]">TRIP A: <span className="text-white font-bold">142.8 MI</span></span>
        </div>

        {/* Alpine Atmosphere & Road Adhesion */}
        <div className="flex items-center gap-2.5 text-zinc-400 text-[9.5px]">
          <span className="flex items-center gap-1 text-[#C5A059]">
            <Compass className="w-3 h-3" />
            <span>1,688 FT</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 font-bold">μ 0.88 PEAK ADHESION</span>
          {onOpenTelemetryModal && (
            <button
              onClick={onOpenTelemetryModal}
              className="text-[#D4AF37] hover:text-white underline transition ml-1 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Full Telemetry</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
