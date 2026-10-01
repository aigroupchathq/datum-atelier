import { useState } from 'react';
import type { FC } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Snowflake, 
  HelpCircle, 
  Info, 
  Compass, 
  Thermometer
} from 'lucide-react';
import { calculateRoadGrip, type GripInputs, type GripResult } from '../../utils/gripCalculation';
import { GripCalculatorModal } from './GripCalculatorModal';

interface GripMetricCardProps {
  locationName: string;
  roadNumber?: string;
  inputs: GripInputs;
  onOpenRadarModal?: () => void;
  sourceLabel?: string;
  freshnessLabel?: string;
  compact?: boolean;
}

export const GripMetricCard: FC<GripMetricCardProps> = ({
  locationName,
  roadNumber,
  inputs,
  onOpenRadarModal,
  sourceLabel = 'Met Office & UK Road Sensors',
  freshnessLabel = 'Updated 4m ago',
  compact = false
}) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Compute live from verified engine
  const gripResult: GripResult = calculateRoadGrip(inputs, sourceLabel, freshnessLabel);

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
        return <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />;
      case 'alert-octagon':
        return <AlertOctagon className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />;
      case 'snowflake':
        return <Snowflake className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />;
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <>
      <section 
        className="card-surface p-4 sm:p-5 rounded-2xl border border-zinc-800/80 shadow-lg space-y-3.5"
        aria-label={`Road grip report for ${locationName}`}
      >
        {/* Top Header: Location + Source */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pass Grip Radar</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{locationName}</span>
              {roadNumber && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">
                  {roadNumber}
                </span>
              )}
            </h3>
          </div>

          <span className="text-[10px] sm:text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            MET OFFICE
          </span>
        </div>

        {/* Core Metric Presentation: Plain words first, number second */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold ${getToneBadgeClass(gripResult.badgeTone)}`}>
              {renderIcon(gripResult.iconKind)}
              <span>{gripResult.headline}</span>
            </span>

            {gripResult.frictionNumber != null ? (
              <span className="text-xs font-mono text-zinc-400">
                (<strong className="text-zinc-200">{gripResult.frictionNumber.toFixed(2)}</strong> index)
              </span>
            ) : (
              <span className="text-xs text-zinc-500 italic">No numeric reading</span>
            )}
          </div>

          {/* How is this calculated button */}
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2 transition focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            aria-label="How is this grip score calculated?"
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            <span>How is this calculated?</span>
          </button>
        </div>

        {/* One sentence real-life driving advice */}
        <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-zinc-900">
          <span className="text-amber-400 font-medium">In Real Life: </span>
          <span>{gripResult.drivingAdvice}</span>
        </div>

        {/* Environmental conditions row */}
        {!compact && (
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-zinc-500 block text-[10px]">ROAD SURFACE</span>
                <span className="font-mono font-semibold text-white">
                  {inputs.surfaceTempC != null ? `${inputs.surfaceTempC.toFixed(1)}°C` : 'Sensor Offline'}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-2">
              <span className="text-base shrink-0" aria-hidden="true">💧</span>
              <div>
                <span className="text-zinc-500 block text-[10px]">SURFACE STATE</span>
                <span className="font-semibold text-white truncate block">
                  {inputs.surfaceCondition || 'Damp Bitumen'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Source and freshness line */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
          <span>{gripResult.sourceAttribution}</span>
          <span>{gripResult.freshness}</span>
        </div>

        {/* CTA to open full radar modal */}
        {onOpenRadarModal && (
          <button
            onClick={onOpenRadarModal}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Open Live Mountain Pass Radar (6 UK Passes)</span>
          </button>
        )}
      </section>

      {/* Embedded Explanation Modal */}
      <GripCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialInputs={inputs}
        locationName={locationName}
      />
    </>
  );
};
