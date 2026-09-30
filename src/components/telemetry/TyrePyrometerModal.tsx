import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Thermometer, 
  Save, 
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TyrePyrometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  carModel?: string;
}

interface TyreTelemetry {
  outer: number;
  center: number;
  inner: number;
  coldPsi: number;
  hotPsi: number;
}

interface SetupPreset {
  id: string;
  name: string;
  condition: string;
  ambientC: number;
  telemetry: {
    fl: TyreTelemetry;
    fr: TyreTelemetry;
    rl: TyreTelemetry;
    rr: TyreTelemetry;
  };
  notes: string;
}

const PRESETS: Record<string, SetupPreset> = {
  b_road_damp: {
    id: 'b_road_damp',
    name: 'B-Road Shakedown (Damp 11°C)',
    condition: 'Damp Bitumen • Snake Pass A57',
    ambientC: 11,
    telemetry: {
      fl: { outer: 42, center: 45, inner: 49, coldPsi: 31.5, hotPsi: 33.8 },
      fr: { outer: 44, center: 48, inner: 52, coldPsi: 31.5, hotPsi: 34.2 },
      rl: { outer: 46, center: 50, inner: 54, coldPsi: 32.0, hotPsi: 35.0 },
      rr: { outer: 48, center: 53, inner: 56, coldPsi: 32.0, hotPsi: 35.4 }
    },
    notes: 'Optimal thermal window for Michelin Pilot Sport 4S. Controlled temperature gradient across contact patch with -1.8° front camber.'
  },
  track_nurburgring: {
    id: 'track_nurburgring',
    name: 'Nürburgring Nordschleife Attack (Dry 22°C)',
    condition: 'High Lateral Load • Hatzenbach to Karussell',
    ambientC: 22,
    telemetry: {
      fl: { outer: 72, center: 78, inner: 86, coldPsi: 27.5, hotPsi: 32.0 },
      fr: { outer: 76, center: 82, inner: 91, coldPsi: 27.5, hotPsi: 32.8 },
      rl: { outer: 68, center: 74, inner: 81, coldPsi: 28.0, hotPsi: 32.5 },
      rr: { outer: 71, center: 77, inner: 84, coldPsi: 28.0, hotPsi: 33.0 }
    },
    notes: 'Aggressive track setup on Michelin Cup 2 / Cup 2R. Hot pressures stabilized precisely at 32.0 PSI target.'
  },
  winter_frost: {
    id: 'winter_frost',
    name: 'Dawn Frost & Cold Bitumen (0°C)',
    condition: 'Sub-Zero Bitumen • Bealach na Bà Summit',
    ambientC: 0,
    telemetry: {
      fl: { outer: 14, center: 18, inner: 22, coldPsi: 33.5, hotPsi: 34.2 },
      fr: { outer: 15, center: 19, inner: 23, coldPsi: 33.5, hotPsi: 34.4 },
      rl: { outer: 16, center: 20, inner: 24, coldPsi: 34.0, hotPsi: 35.0 },
      rr: { outer: 17, center: 21, inner: 25, coldPsi: 34.0, hotPsi: 35.2 }
    },
    notes: 'Compound operating below glass transition temperature. Pre-heating cycles required before lateral loading.'
  }
};

export const TyrePyrometerModal: FC<TyrePyrometerModalProps> = ({
  isOpen,
  onClose,
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)'
}) => {
  const { showToast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState<string>('b_road_damp');
  const [tyres, setTyres] = useState(PRESETS['b_road_damp'].telemetry);
  const [activeCorner, setActiveCorner] = useState<'fl' | 'fr' | 'rl' | 'rr'>('fl');

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setTyres(PRESETS[presetKey].telemetry);
    showToast({
      title: 'Tyre Profile Loaded',
      message: `${PRESETS[presetKey].name} telemetry synchronized with pyrometer.`,
      type: 'drive',
      badge: 'THERMAL'
    });
  };

  const currentCornerData = tyres[activeCorner];

  // Thermal delta calculation (Inner - Outer)
  const thermalDelta = currentCornerData.inner - currentCornerData.outer;
  const isCamberOptimal = thermalDelta >= 3 && thermalDelta <= 10;
  
  // Center crowning check (Overinflation)
  const expectedCenter = (currentCornerData.inner + currentCornerData.outer) / 2;
  const isPressureBalanced = Math.abs(currentCornerData.center - expectedCenter) <= 4;

  const handleSaveToChassis = () => {
    showToast({
      title: 'Pyrometer Session Stamped',
      message: `Thermal dataset permanently notarized under ${carName} Diagnostic Telemetry ledger.`,
      type: 'success',
      badge: 'CANBUS'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B0C10] border border-amber-500/25 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Thermometer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-luxury-display text-xl sm:text-2xl font-black text-white tracking-[0.15em] uppercase">
                  Tyre Pyrometer & Contact Patch
                </h2>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25">
                  INFRARED CALIBRATED
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {carModel} • 3-Zone Thermal Surface Probing & Camber Balancing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-white/[0.08] overflow-x-auto no-scrollbar">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono-numbers transition-all text-center shrink-0 ${
                selectedPreset === key
                  ? 'bg-amber-400 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* 4-Corner Vehicle Overhead Schematic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Left Column: Visual Car Footprint */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex flex-col items-center justify-between relative min-h-[300px]">
            <span className="text-[10px] font-mono-numbers tracking-[0.2em] text-zinc-400 uppercase font-semibold self-start">
              CHASSIS THERMAL TOPOLOGY • {carName}
            </span>

            {/* Front Axle */}
            <div className="flex justify-between w-full max-w-[280px] my-4">
              {/* Front Left */}
              <button
                onClick={() => setActiveCorner('fl')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeCorner === 'fl'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg scale-105'
                    : 'border-white/10 bg-black/60 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono-numbers text-zinc-400 font-bold">FRONT LEFT</div>
                <div className="text-sm font-bold text-white font-mono-numbers mt-0.5">{tyres.fl.center}°C</div>
                <div className="text-[10px] font-mono-numbers text-emerald-400">{tyres.fl.hotPsi} PSI Hot</div>
              </button>

              {/* Front Right */}
              <button
                onClick={() => setActiveCorner('fr')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  activeCorner === 'fr'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg scale-105'
                    : 'border-white/10 bg-black/60 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono-numbers text-zinc-400 font-bold">FRONT RIGHT</div>
                <div className="text-sm font-bold text-white font-mono-numbers mt-0.5">{tyres.fr.center}°C</div>
                <div className="text-[10px] font-mono-numbers text-emerald-400">{tyres.fr.hotPsi} PSI Hot</div>
              </button>
            </div>

            {/* Center Vehicle Silhouette Indicator */}
            <div className="text-zinc-600 font-mono-numbers text-[11px] tracking-widest uppercase my-2 py-1 px-4 rounded-full border border-zinc-800 bg-black/40">
              ▲ DIRECTION OF TRAVEL ▲
            </div>

            {/* Rear Axle */}
            <div className="flex justify-between w-full max-w-[280px] my-4">
              {/* Rear Left */}
              <button
                onClick={() => setActiveCorner('rl')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeCorner === 'rl'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg scale-105'
                    : 'border-white/10 bg-black/60 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono-numbers text-zinc-400 font-bold">REAR LEFT</div>
                <div className="text-sm font-bold text-white font-mono-numbers mt-0.5">{tyres.rl.center}°C</div>
                <div className="text-[10px] font-mono-numbers text-emerald-400">{tyres.rl.hotPsi} PSI Hot</div>
              </button>

              {/* Rear Right */}
              <button
                onClick={() => setActiveCorner('rr')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  activeCorner === 'rr'
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg scale-105'
                    : 'border-white/10 bg-black/60 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono-numbers text-zinc-400 font-bold">REAR RIGHT</div>
                <div className="text-sm font-bold text-white font-mono-numbers mt-0.5">{tyres.rr.center}°C</div>
                <div className="text-[10px] font-mono-numbers text-emerald-400">{tyres.rr.hotPsi} PSI Hot</div>
              </button>
            </div>

            <div className="text-[10px] font-mono-numbers text-zinc-500 self-center">
              Click any wheel to inspect 3-zone contact patch
            </div>
          </div>

          {/* Right Column: Selected Corner 3-Zone Thermal Breakdown */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <span className="font-mono-numbers text-xs text-amber-400 font-bold uppercase tracking-wider">
                  CORNER: {activeCorner.toUpperCase()} CONTACT PATCH
                </span>
                <span className="text-[10px] font-mono-numbers text-zinc-400">
                  Target: 70°C – 85°C
                </span>
              </div>

              {/* 3 Probes: Outer, Center, Inner */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 text-center font-mono-numbers">
                {/* Outer */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Outer</span>
                  <div className="text-2xl font-bold text-white">{currentCornerData.outer}°C</div>
                  <span className="text-[9px] text-zinc-400">Shoulder</span>
                </div>

                {/* Center */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Center</span>
                  <div className="text-2xl font-bold text-amber-400">{currentCornerData.center}°C</div>
                  <span className="text-[9px] text-zinc-400">Crown</span>
                </div>

                {/* Inner */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Inner</span>
                  <div className="text-2xl font-bold text-white">{currentCornerData.inner}°C</div>
                  <span className="text-[9px] text-zinc-400">Camber Rib</span>
                </div>
              </div>

              {/* Thermal Analysis Bars */}
              <div className="space-y-3 pt-5 text-xs font-mono-numbers">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Camber Delta (Inner - Outer):</span>
                    <strong className={isCamberOptimal ? 'text-emerald-400' : 'text-amber-400'}>
                      +{thermalDelta}°C {isCamberOptimal ? '✓ OPTIMAL' : '⚠️ ADVISORY'}
                    </strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className={`h-full ${isCamberOptimal ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                      style={{ width: `${Math.min(100, (thermalDelta / 15) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Pressure Balance (Crown Inflation):</span>
                    <strong className={isPressureBalanced ? 'text-emerald-400' : 'text-amber-400'}>
                      {isPressureBalanced ? '✓ FLAT PATCH' : '⚠️ CROWN EXPANSION'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-sans text-zinc-300">
                  <p>
                    <strong className="text-white">Cold Setting:</strong> {currentCornerData.coldPsi} PSI → <strong className="text-white">Hot Stabilized:</strong> {currentCornerData.hotPsi} PSI (+{(currentCornerData.hotPsi - currentCornerData.coldPsi).toFixed(1)} PSI thermal expansion).
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-sans text-zinc-400 pt-2 border-t border-white/[0.06]">
              {PRESETS[selectedPreset].notes}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Calibrated with FIA / SRO Motorsport Optical Telemetry Standards</span>
          </div>

          <button
            onClick={handleSaveToChassis}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Notarize to Chassis CANBUS Ledger</span>
          </button>
        </div>

      </div>
    </div>
  );
};
