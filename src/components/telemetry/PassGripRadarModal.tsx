import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Wind, 
  Thermometer, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Navigation, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  RefreshCw,
  Activity,
  Eye
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface PassTelemetryData {
  id: string;
  name: string;
  region: string;
  elevationFt: number;
  elevationM: number;
  roadNumber: string;
  gradientMax: string;
  surfaceCondition: 'Damp Bitumen' | 'Dry Asphalt' | 'Wet Bitumen' | 'Damp Stone & Bitumen' | 'Frost Hazard';
  airTempC: number;
  surfaceTempC: number;
  dewPointC: number;
  frictionMu: number; // 0.0 to 1.0 (friction coefficient)
  windSpeedMph: number;
  windGustMph: number;
  windDirection: string;
  advisoryNotice: string;
  pmrChannel: string;
  pmrSubCode: string;
  pmrFreqMhz: string;
  livePassStatus: 'OPTIMAL' | 'MODERATE' | 'CAUTION' | 'RESTRICTED';
  candidLocationNote: string;
}

export const UK_PASSES_TELEMETRY: Record<string, PassTelemetryData> = {
  'snake-pass-a57': {
    id: 'snake-pass-a57',
    name: 'Snake Pass',
    region: 'Peak District National Park, Derbyshire',
    elevationFt: 1688,
    elevationM: 514,
    roadNumber: 'A57',
    gradientMax: '10.5%',
    surfaceCondition: 'Damp Bitumen',
    airTempC: 7.2,
    surfaceTempC: 6.1,
    dewPointC: 5.8,
    frictionMu: 0.74,
    windSpeedMph: 18,
    windGustMph: 28,
    windDirection: 'WNW',
    advisoryNotice: 'Damp shaded sections through Doctors Gate switchbacks. Derbyshire Constabulary cattle grid advisory active. Sheep roaming on high moor.',
    pmrChannel: 'Ch 7',
    pmrSubCode: 'DCS 12',
    pmrFreqMhz: '446.08125 MHz',
    livePassStatus: 'MODERATE',
    candidLocationNote: 'Summit car park open. Surface moisture drying on open crests, damp in pine forests.'
  },
  'llanberis-pass-a4086': {
    id: 'llanberis-pass-a4086',
    name: 'Llanberis Pass',
    region: 'Snowdonia / Eryri National Park, North Wales',
    elevationFt: 1178,
    elevationM: 359,
    roadNumber: 'A4086',
    gradientMax: '14.2%',
    surfaceCondition: 'Wet Bitumen',
    airTempC: 9.4,
    surfaceTempC: 8.8,
    dewPointC: 7.2,
    frictionMu: 0.68,
    windSpeedMph: 22,
    windGustMph: 36,
    windDirection: 'SW',
    advisoryNotice: 'Mountain stream runoff across Turn 4 apex. High crosswind gusts through glacial valley funnels. Painted cattle grids slippery.',
    pmrChannel: 'Ch 3',
    pmrSubCode: 'CTCSS 08',
    pmrFreqMhz: '446.03125 MHz',
    livePassStatus: 'CAUTION',
    candidLocationNote: 'Pen-y-Pass laybys saturated. Welsh slate cliffs generating water spray.'
  },
  'bealach-na-ba': {
    id: 'bealach-na-ba',
    name: 'Bealach na Bà (Pass of the Cattle)',
    region: 'Applecross Peninsula, Scottish Highlands',
    elevationFt: 2053,
    elevationM: 626,
    roadNumber: 'Single Track Alpine Pass',
    gradientMax: '20.0%',
    surfaceCondition: 'Damp Bitumen',
    airTempC: 4.8,
    surfaceTempC: 3.9,
    dewPointC: 3.5,
    frictionMu: 0.62,
    windSpeedMph: 31,
    windGustMph: 45,
    windDirection: 'NNE',
    advisoryNotice: 'Alpine hairpins above 1,800 ft experiencing low cloud and condensation. Single-track passing places clear. High ground clearance recommended for hairpins.',
    pmrChannel: 'Ch 8',
    pmrSubCode: 'DCS 16',
    pmrFreqMhz: '446.09375 MHz',
    livePassStatus: 'CAUTION',
    candidLocationNote: 'Sub-zero windchill at summit viewpoint. Scottish Highlands mist rolling across loch approach.'
  },
  'hardknott-pass': {
    id: 'hardknott-pass',
    name: 'Hardknott Pass',
    region: 'Lake District National Park, Cumbria',
    elevationFt: 1289,
    elevationM: 393,
    roadNumber: 'Roman Mountain Pass',
    gradientMax: '33.3% (1 in 3)',
    surfaceCondition: 'Damp Stone & Bitumen',
    airTempC: 6.5,
    surfaceTempC: 5.4,
    dewPointC: 4.9,
    frictionMu: 0.52,
    windSpeedMph: 14,
    windGustMph: 22,
    windDirection: 'ENE',
    advisoryNotice: 'Extreme 33% gradient switchbacks. Traction control intervention frequent on damp stone paving. Zero room for heavy vehicles or low front splitters.',
    pmrChannel: 'Ch 1',
    pmrSubCode: 'CTCSS 01',
    pmrFreqMhz: '446.00625 MHz',
    livePassStatus: 'CAUTION',
    candidLocationNote: 'Ancient Roman fort ruins clear. Passing places tight, clutch preservation advised.'
  },
  'cheddar-gorge-b3135': {
    id: 'cheddar-gorge-b3135',
    name: 'Cheddar Gorge',
    region: 'Mendip Hills, Somerset',
    elevationFt: 850,
    elevationM: 259,
    roadNumber: 'B3135',
    gradientMax: '16.0%',
    surfaceCondition: 'Dry Asphalt',
    airTempC: 12.4,
    surfaceTempC: 14.8,
    dewPointC: 6.1,
    frictionMu: 0.89,
    windSpeedMph: 8,
    windGustMph: 12,
    windDirection: 'SE',
    advisoryNotice: 'Prime morning tarmac condition. Limestone cliff canyon dry. Mind early morning cyclists and wild goats on lower switchbacks.',
    pmrChannel: 'Ch 5',
    pmrSubCode: 'CTCSS 22',
    pmrFreqMhz: '446.05625 MHz',
    livePassStatus: 'OPTIMAL',
    candidLocationNote: 'Crisp morning sunlight illuminating limestone faces. Dry surface provides maximum lateral grip.'
  },
  'black-mountain-a4069': {
    id: 'black-mountain-a4069',
    name: 'Black Mountain Pass',
    region: 'Brecon Beacons / Bannau Brycheiniog, Wales',
    elevationFt: 1617,
    elevationM: 493,
    roadNumber: 'A4069',
    gradientMax: '12.0%',
    surfaceCondition: 'Damp Bitumen',
    airTempC: 8.6,
    surfaceTempC: 8.0,
    dewPointC: 6.8,
    frictionMu: 0.79,
    windSpeedMph: 16,
    windGustMph: 24,
    windDirection: 'W',
    advisoryNotice: 'Fast sweepers with predictable lateral grip. Open moorland cattle grids clear. Low visibility risk if western front rolls in before 11:00 AM.',
    pmrChannel: 'Ch 4',
    pmrSubCode: 'DCS 19',
    pmrFreqMhz: '446.04375 MHz',
    livePassStatus: 'MODERATE',
    candidLocationNote: 'The classic Top Gear test route. High camber corners in prime condition.'
  }
};

interface PassGripRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassId?: string;
}

export const PassGripRadarModal: FC<PassGripRadarModalProps> = ({
  isOpen,
  onClose,
  initialPassId = 'snake-pass-a57'
}) => {
  const [selectedPassId, setSelectedPassId] = useState<string>(initialPassId);
  const [simColdDrop, setSimColdDrop] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { showToast } = useToast();

  const currentPass = UK_PASSES_TELEMETRY[selectedPassId] || UK_PASSES_TELEMETRY['snake-pass-a57'];

  // Adjusted figures when simulating early dawn cold front
  const effectiveAirTemp = simColdDrop ? currentPass.airTempC - 5.5 : currentPass.airTempC;
  const effectiveSurfaceTemp = simColdDrop ? currentPass.surfaceTempC - 5.8 : currentPass.surfaceTempC;
  const isBlackIceRisk = effectiveSurfaceTemp <= 1.0 && currentPass.surfaceCondition !== 'Dry Asphalt';
  const effectiveFriction = isBlackIceRisk 
    ? Math.max(0.28, currentPass.frictionMu - 0.42)
    : simColdDrop 
      ? Math.max(0.45, currentPass.frictionMu - 0.12)
      : currentPass.frictionMu;

  const handleCopyRadio = () => {
    navigator.clipboard.writeText(
      `[GARAGE PADDOCK RADIO] Pass: ${currentPass.name} (${currentPass.roadNumber}) • Channel: ${currentPass.pmrChannel} (${currentPass.pmrSubCode}) • Freq: ${currentPass.pmrFreqMhz}`
    );
    showToast({
      title: 'PMR446 Frequency Locked',
      message: `${currentPass.name}: ${currentPass.pmrChannel} (${currentPass.pmrFreqMhz}) copied to clipboard`,
      type: 'clipboard',
      badge: 'RADIO'
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        title: 'Micro-Climate Telemetry Refreshed',
        message: `Synced with Met Office & Derbyshire/Welsh Dales road surface sensors`,
        type: 'success',
        badge: 'LIVE'
      });
    }, 600);
  };

  const handleLogToDossier = () => {
    showToast({
      title: `Logged to Sovereign Chassis Dossier`,
      message: `Pass: ${currentPass.name} • Surface Friction: μ ${effectiveFriction.toFixed(2)} • Temp: ${effectiveSurfaceTemp.toFixed(1)}°C notarized`,
      type: 'garage',
      badge: 'NOTARIZED'
    });
  };

  // Helper color for status
  const statusColor = useMemo(() => {
    if (isBlackIceRisk) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    switch (currentPass.livePassStatus) {
      case 'OPTIMAL': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MODERATE': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CAUTION': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
    }
  }, [currentPass.livePassStatus, isBlackIceRisk]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0B0C10] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Subtle Corner Rivets */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>

        {/* ── HEADER ── */}
        <header className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0E0F14]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-luxury-display tracking-wider">
                  UK PASS SURFACE GRIP & MICRO-CLIMATE RADAR
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                  MET OFFICE & SENSOR STREAM
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono-numbers mt-0.5">
                Real-Time Tarmac Friction Coefficient (μ) • Dew Point Margin • Convoy PMR446 Ledgers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 transition"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── PASS SELECTOR TABS ── */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/[0.06] overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          {Object.values(UK_PASSES_TELEMETRY).map((pass) => {
            const isSelected = pass.id === selectedPassId;
            return (
              <button
                key={pass.id}
                onClick={() => setSelectedPassId(pass.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-numbers font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-md font-bold'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] border border-white/[0.05]'
                }`}
              >
                <span>{pass.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-black/50 text-zinc-400'}`}>
                  {pass.roadNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── BODY VIEWPORT ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Black Ice Warning Banner if active */}
          {isBlackIceRisk && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3.5 text-rose-200 animate-pulse shadow-lg">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <strong className="text-sm font-bold block font-mono-numbers tracking-wider uppercase text-rose-300">
                  CRITICAL METEOROLOGICAL ALERT: BLACK ICE PRECIPITATION
                </strong>
                <p className="text-xs text-rose-200/90 font-mono-numbers mt-0.5">
                  Road surface temperature ({effectiveSurfaceTemp.toFixed(1)}°C) is below dew point margin with moisture present. Lateral grip reduced to μ {effectiveFriction.toFixed(2)}. Extreme caution required on switchbacks.
                </p>
              </div>
            </div>
          )}

          {/* Pass Identity & Live Summary Bar */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold text-white font-luxury-display tracking-wide">
                  {currentPass.name} ({currentPass.roadNumber})
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono-numbers font-bold border ${statusColor}`}>
                  {isBlackIceRisk ? 'ICE ADVISORY' : currentPass.livePassStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono-numbers mt-1 flex items-center gap-2">
                <span>{currentPass.region}</span>
                <span>•</span>
                <span>Max Incline: {currentPass.gradientMax}</span>
                <span>•</span>
                <span>Summit: {currentPass.elevationFt.toLocaleString()} ft ({currentPass.elevationM} m)</span>
              </p>
            </div>

            {/* Sim Dawn Frost Toggle */}
            <div className="flex items-center gap-3 bg-white/[0.04] p-1.5 rounded-xl border border-white/[0.06] shrink-0">
              <span className="text-[11px] font-mono-numbers text-zinc-400 pl-2">
                Dawn Frost (-5.5°C):
              </span>
              <button
                onClick={() => setSimColdDrop(!simColdDrop)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono-numbers transition ${
                  simColdDrop 
                    ? 'bg-cyan-500 text-black shadow-md' 
                    : 'bg-white/[0.08] text-zinc-300 hover:text-white'
                }`}
              >
                {simColdDrop ? 'ACTIVE' : 'OFFLINE'}
              </button>
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono-numbers text-xs">
            
            {/* 1. Surface Friction (μ) Gauge */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="uppercase tracking-wider">Surface Friction (μ)</span>
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${
                  effectiveFriction > 0.8 ? 'text-emerald-400' : effectiveFriction > 0.65 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  μ {effectiveFriction.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-500">Coefficient</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    effectiveFriction > 0.8 ? 'bg-emerald-400' : effectiveFriction > 0.65 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${Math.min(100, effectiveFriction * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 truncate">
                {effectiveFriction > 0.8 ? 'Dry Full Lateral Grip' : effectiveFriction > 0.65 ? 'Damp Bitumen Traction' : 'Sub-Zero Polish Caution'}
              </p>
            </div>

            {/* 2. Road Surface Temperature */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="uppercase tracking-wider">Surface Temperature</span>
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {effectiveSurfaceTemp.toFixed(1)}°C
                </span>
                <span className="text-[10px] text-zinc-500">Air: {effectiveAirTemp.toFixed(1)}°C</span>
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Dew Point:</span>
                <strong className="text-zinc-200">{currentPass.dewPointC.toFixed(1)}°C</strong>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">
                Margin: {(effectiveSurfaceTemp - currentPass.dewPointC).toFixed(1)}°C spread
              </p>
            </div>

            {/* 3. Wind & Canyon Funneling */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="uppercase tracking-wider">Wind & Gusts</span>
                <Wind className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {currentPass.windSpeedMph} <span className="text-xs text-zinc-400">mph</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold">Gust {currentPass.windGustMph}</span>
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Vector:</span>
                <strong className="text-zinc-200">{currentPass.windDirection} Flow</strong>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">
                Ridge Crest Buffeting: {currentPass.windGustMph > 30 ? 'High' : 'Moderate'}
              </p>
            </div>

            {/* 4. PMR446 Convoy Radio Lock */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="uppercase tracking-wider">PMR446 Radio Lock</span>
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">
                  {currentPass.pmrChannel}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">{currentPass.pmrSubCode}</span>
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Freq:</span>
                <strong className="text-zinc-200">{currentPass.pmrFreqMhz}</strong>
              </div>
              <button
                onClick={handleCopyRadio}
                className="w-full text-center py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] font-semibold text-emerald-300 transition flex items-center justify-center gap-1"
              >
                <Copy className="w-2.5 h-2.5" />
                <span>Copy Radio Spec</span>
              </button>
            </div>

          </div>

          {/* Sector Conditions & Constabulary Notarization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Road Surface & Candid Environment */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-numbers text-amber-400 font-bold uppercase tracking-wider">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Observer Ground Reconnaissance</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {currentPass.candidLocationNote}
              </p>
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-numbers">
                <span className="text-zinc-500">SURFACE STATE:</span>
                <span className="font-bold text-white px-2.5 py-0.5 rounded bg-white/[0.06]">
                  {currentPass.surfaceCondition}
                </span>
              </div>
            </div>

            {/* Constabulary & Hazard Advisory */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-numbers text-orange-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span>Constabulary & Hazard Advisory</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {currentPass.advisoryNotice}
              </p>
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-numbers">
                <span className="text-zinc-500">DVSA/HIGHWAYS STATUS:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pass Open & Navigable
                </span>
              </div>
            </div>

          </div>

          {/* Friction vs Speed Safety Recommendation Chart */}
          <div className="p-5 rounded-2xl bg-[#09090C] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono-numbers text-white uppercase tracking-wider">
                  ATELIER DAMP-SURFACE BRAKING & APEX VELOCITY RECOMMENDATIONS
                </span>
              </div>
              <span className="text-[10px] font-mono-numbers text-zinc-500">
                Calculated for Michelin Pilot Sport 4S & Cup 2 tyres
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-numbers">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">Apex Lateral Limit</span>
                <strong className="text-white text-base block mt-0.5">
                  {(effectiveFriction * 1.15).toFixed(2)} G Max
                </strong>
                <span className="text-[10px] text-zinc-400">Cup 2 Warm Optimum</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">60 - 0 mph Stopping Distance</span>
                <strong className="text-amber-400 text-base block mt-0.5">
                  {(34 / effectiveFriction).toFixed(0)} meters
                </strong>
                <span className="text-[10px] text-zinc-400">+{( (34 / effectiveFriction) - 34 ).toFixed(0)}m vs dry asphalt</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-500 text-[10px] block uppercase">Recommended Cold PSI</span>
                <strong className="text-emerald-400 text-base block mt-0.5">
                  30.5 PSI Front • 31.0 PSI Rear
                </strong>
                <span className="text-[10px] text-zinc-400">Compensate for damp tarmac</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── FOOTER ACTIONS ── */}
        <footer className="px-6 py-4 border-t border-white/[0.08] bg-[#0E0F14] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>800m Residential Sanctuary Active on all Route Links</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleLogToDossier}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono-numbers text-xs font-semibold transition flex items-center gap-2 border border-white/[0.1]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Telemetry to Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-luxury-display text-xs font-bold transition shadow-lg"
            >
              Close Radar
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
