import { useState, useId } from 'react';
import type { FC } from 'react';
import { 
  X, 
  HelpCircle, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Snowflake, 
  Thermometer, 
  CloudRain, 
  RotateCcw,
  Info,
  CheckCircle2
} from 'lucide-react';
import { calculateRoadGrip, type GripInputs, type GripResult } from '../../utils/gripCalculation';

interface GripCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInputs?: GripInputs;
  locationName?: string;
}

export const GripCalculatorModal: FC<GripCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialInputs,
  locationName = 'Snake Pass (A57)'
}) => {
  const modalTitleId = useId();

  // Interactive Simulator State
  const [simSurfaceTemp, setSimSurfaceTemp] = useState<number>(initialInputs?.surfaceTempC ?? 6.1);
  const [simRainRate, setSimRainRate] = useState<number>(initialInputs?.rainMmPerHour ?? 0.8);
  const [simTyreTemp, setSimTyreTemp] = useState<number>(initialInputs?.tyreTempC ?? 35);
  const [simCondition, setSimCondition] = useState<string>(initialInputs?.surfaceCondition ?? 'Damp Bitumen');

  if (!isOpen) return null;

  // Real-time calculation from simulator sliders
  const simResult: GripResult = calculateRoadGrip({
    surfaceTempC: simSurfaceTemp,
    rainMmPerHour: simRainRate,
    tyreTempC: simTyreTemp,
    surfaceCondition: simCondition
  }, 'Live Interactive Simulator', 'Calculated in real time');

  const handleResetToPassDefaults = () => {
    setSimSurfaceTemp(initialInputs?.surfaceTempC ?? 6.1);
    setSimRainRate(initialInputs?.rainMmPerHour ?? 0.8);
    setSimTyreTemp(initialInputs?.tyreTempC ?? 35);
    setSimCondition(initialInputs?.surfaceCondition ?? 'Damp Bitumen');
  };

  const getToneBadgeClass = (tone: GripResult['badgeTone']) => {
    switch (tone) {
      case 'green':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'orange':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'red':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  };

  const renderIcon = (iconKind: GripResult['iconKind']) => {
    switch (iconKind) {
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />;
      case 'alert-octagon':
        return <AlertOctagon className="w-5 h-5 text-orange-400 shrink-0" aria-hidden="true" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />;
      default:
        return <HelpCircle className="w-5 h-5 text-zinc-400 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 text-zinc-100 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>Transparent Road Adhesion</span>
            </div>
            <h2 id={modalTitleId} className="text-xl md:text-2xl font-bold tracking-tight text-white">
              How Road Grip is Calculated
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Active baseline for <span className="text-zinc-200 font-medium">{locationName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
            aria-label="Close calculation explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plain English Formula Explanation */}
        <div className="space-y-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            The Formula in Everyday Language
          </h3>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
            We start with a dry road's natural grip, then subtract penalties for water and freezing cold, and add a small bonus when your tyres are warm.
          </p>

          <div className="bg-black/50 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-300 space-y-1">
            <div className="text-amber-400 font-semibold">Grip = Base Tarmac Grip - Water Penalty - Frost Penalty + Warm Tyre Bonus</div>
            <div className="text-zinc-500 text-[11px]">Result is converted into plain words for safe driving choices.</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="block text-zinc-400">Base Tarmac</span>
              <span className="font-semibold text-white font-mono">0.92</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="block text-zinc-400">Water Penalty</span>
              <span className="font-semibold text-rose-400 font-mono">-{simResult.breakdown.waterPenalty.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="block text-zinc-400">Road Temp</span>
              <span className="font-semibold text-amber-400 font-mono">
                {simResult.breakdown.temperatureEffect >= 0 ? '+' : ''}{simResult.breakdown.temperatureEffect.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="block text-zinc-400">Tyre Warmth</span>
              <span className="font-semibold text-emerald-400 font-mono">
                +{simResult.breakdown.tyreWarmthBonus.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* "Try It" Live Simulator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>"Try It" Simulator (Live What-If Test)</span>
            </h3>
            <button
              onClick={handleResetToPassDefaults}
              className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Actual Road Data</span>
            </button>
          </div>

          {/* Sliders Box */}
          <div className="space-y-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            
            {/* Slider 1: Surface Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="temp-slider" className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Road Surface Temperature
                </label>
                <span className="font-mono font-bold text-white">
                  {simSurfaceTemp.toFixed(1)}°C {simSurfaceTemp <= 1 ? '(Freezing Risk)' : ''}
                </span>
              </div>
              <input
                id="temp-slider"
                type="range"
                min="-10"
                max="40"
                step="0.5"
                value={simSurfaceTemp}
                onChange={(e) => setSimSurfaceTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>-10°C (Sub-Zero Ice)</span>
                <span>0°C</span>
                <span>+40°C (Hot Summer)</span>
              </div>
            </div>

            {/* Slider 2: Rain / Moisture Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="rain-slider" className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  Rainfall / Moisture Level
                </label>
                <span className="font-mono font-bold text-white">
                  {simRainRate === 0 ? 'Dry (0.0 mm/h)' : `${simRainRate.toFixed(1)} mm/h`}
                </span>
              </div>
              <input
                id="rain-slider"
                type="range"
                min="0"
                max="12"
                step="0.2"
                value={simRainRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSimRainRate(val);
                  if (val === 0) setSimCondition('Dry Asphalt');
                  else if (val < 2) setSimCondition('Damp Bitumen');
                  else setSimCondition('Wet Bitumen');
                }}
                className="w-full accent-blue-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Dry</span>
                <span>Damp Mist (1 mm/h)</span>
                <span>Torrential Rain (12 mm/h)</span>
              </div>
            </div>

            {/* Slider 3: Tyre Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="tyre-slider" className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <span>🛞 Tyre Warmth</span>
                </label>
                <span className="font-mono font-bold text-white">
                  {simTyreTemp}°C {simTyreTemp >= 45 ? '(Warm & Grippy)' : simTyreTemp <= 10 ? '(Cold Rubber)' : '(Normal)'}
                </span>
              </div>
              <input
                id="tyre-slider"
                type="range"
                min="0"
                max="80"
                step="1"
                value={simTyreTemp}
                onChange={(e) => setSimTyreTemp(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0°C (Cold Start)</span>
                <span>35°C (Cruising)</span>
                <span>80°C (Spirited B-Road)</span>
              </div>
            </div>
          </div>

          {/* Live Updating Result Box */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                Live Simulator Output
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Friction: <span className="text-white font-bold">{simResult.frictionNumber?.toFixed(2)}</span> / 1.00
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${getToneBadgeClass(simResult.badgeTone)}`}>
                {renderIcon(simResult.iconKind)}
                <span>{simResult.headline}</span>
              </span>
            </div>

            <p className="text-sm text-zinc-200">
              <strong className="text-white font-semibold">In Real Life: </strong>
              {simResult.drivingAdvice}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
              <span>{simResult.statusDescription}</span>
              <span>{simResult.freshness}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs text-zinc-500">
          <span>Source: UK Road Sensor Network & Met Office Weather Stream</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
