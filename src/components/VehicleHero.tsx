import { useState } from 'react';
import { Play, Pause, FileCheck, ArrowUpRight, Award } from 'lucide-react';
import type { VehicleDatum } from '../types/datum';

interface VehicleHeroProps {
  vehicle: VehicleDatum;
  isVeilActive: boolean;
  onOpenExportModal: () => void;
}

export const VehicleHero: React.FC<VehicleHeroProps> = ({
  vehicle,
  isVeilActive,
  onOpenExportModal,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/90 p-6 lg:p-8 overflow-hidden shadow-2xl">
      {/* Background Watermark */}
      <div className="absolute -right-8 -bottom-10 text-[130px] font-black text-zinc-800/10 pointer-events-none select-none tracking-tighter">
        M3
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Car Avatar, Specs, Audio */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold font-mono-nums">
              CHASSIS #{vehicle.spec.chassisCode}
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 text-xs font-mono-nums">
              {vehicle.spec.engine} • {vehicle.spec.outputBhp} BHP
            </span>
            <span className={`px-2.5 py-1 rounded text-xs font-mono-nums font-bold border ${
              isVeilActive 
                ? 'bg-zinc-900 text-zinc-400 border-zinc-700/80' 
                : 'bg-amber-400 text-black border-amber-500'
            }`}>
              {isVeilActive ? 'REG: [••••••• BLURRED]' : 'REG: LG23 BMW'}
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> DVSA VERIFIED
            </span>
          </div>

          <div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              {vehicle.displayName}{' '}
              <span className="text-xl lg:text-2xl text-zinc-500 font-semibold font-mono-nums">
                / {vehicle.spec.make} {vehicle.spec.model}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Custodian:{' '}
              <span className={`font-mono-nums ${isVeilActive ? 'text-purple-400' : 'text-emerald-300 font-semibold'}`}>
                {isVeilActive ? '[Protected by Veil • Anonymous Custodian]' : vehicle.custodian.name}
              </span>{' '}
              • In Custody Since: <span className="text-zinc-300">{vehicle.custodian.since}</span>
            </p>
          </div>

          {/* Quick Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
              <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Odometer</div>
              <div className="text-xl font-bold font-mono-nums text-white mt-0.5">
                {vehicle.metrics.odometer.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">mi</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
              <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Health Index</div>
              <div className="text-xl font-bold font-mono-nums text-emerald-400 mt-0.5">
                {vehicle.metrics.healthIndex}% <span className="text-xs text-zinc-400 font-normal">Verified</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
              <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Next MOT In</div>
              <div className="text-xl font-bold font-mono-nums text-amber-400 mt-0.5">
                {vehicle.metrics.motDaysRemaining} <span className="text-xs text-zinc-400 font-normal">days</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
              <div className="text-[10px] font-mono-nums uppercase text-zinc-400">True Cost/Mile</div>
              <div className="text-xl font-bold font-mono-nums text-cyan-400 mt-0.5">
                £{vehicle.metrics.trueCostPerMile.toFixed(2)} <span className="text-xs text-zinc-400 font-normal">/ mi</span>
              </div>
            </div>
          </div>

          {/* Audio Soulprint Player */}
          <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`w-10 h-10 rounded-lg bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center font-bold transition shadow-lg shadow-orange-500/20 ${
                  isPlayingAudio ? 'ring-2 ring-orange-400' : ''
                }`}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Acoustic Soulprint: S58 Cold Start & Downshift</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-mono-nums">
                    Lossless 24-bit
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">Akrapovič Evolution Titanium with catless downpipes</div>
              </div>
            </div>
            {isPlayingAudio && (
              <div className="flex items-center gap-1 h-6">
                <span className="w-1 bg-orange-500 rounded-full h-2 animate-pulse"></span>
                <span className="w-1 bg-orange-500 rounded-full h-5 animate-pulse"></span>
                <span className="w-1 bg-orange-500 rounded-full h-3 animate-pulse"></span>
                <span className="w-1 bg-orange-500 rounded-full h-6 animate-pulse"></span>
                <span className="w-1 bg-orange-500 rounded-full h-4 animate-pulse"></span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Provenance Passport & Resale Premium */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono-nums uppercase tracking-wider text-zinc-400">Datum Passport™</span>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-400" /> Provenance Rating
              </h2>
            </div>
            <div className="text-2xl font-black font-mono-nums text-orange-400">
              {vehicle.metrics.provenanceScore}<span className="text-xs text-zinc-500">/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Estimated Resale Premium</span>
              <span className="font-bold text-emerald-400 font-mono-nums">
                +£{vehicle.metrics.estimatedResalePremium.toLocaleString()} (vs avg)
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${vehicle.metrics.provenanceScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Backed by continuous DVSA MOT records, verified invoices, and pro-stamped service entries.
            </p>
          </div>

          {/* Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-nums">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-emerald-400 font-bold">{vehicle.provenanceBreakdown.dvsaTests} OFFICIAL</div>
              <div className="text-zinc-300 text-[11px]">DVSA Tests</div>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-blue-400 font-bold">{vehicle.provenanceBreakdown.proStamps} PRO STAMPS</div>
              <div className="text-zinc-300 text-[11px]">Verified Workshops</div>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-amber-400 font-bold">{vehicle.provenanceBreakdown.documentedInvoices} DOCUMENTED</div>
              <div className="text-zinc-300 text-[11px]">Invoices & Builds</div>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-zinc-400 font-bold">0 UNVERIFIED</div>
              <div className="text-zinc-300 text-[11px]">Zero Hearsay</div>
            </div>
          </div>

          <button
            onClick={onOpenExportModal}
            className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition flex items-center justify-center gap-2"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Verified Resale Dossier</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 ml-auto" />
          </button>
        </div>

      </div>
    </div>
  );
};
