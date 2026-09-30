import type { FC } from 'react';
import { Route, AlertCircle, Mountain, CheckCircle } from 'lucide-react';

export const RoadObject: FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-mono-nums font-bold flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-orange-400" />
              <span>ROAD OBJECT: A4067</span>
            </span>
            <span className="text-xs text-zinc-400 font-mono-nums">
              Powys / Brecon Beacons, UK
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1.5">The Black Mountain Pass</h2>
          <p className="text-xs text-zinc-400 mt-1">
            23.4 miles • Elevation Delta: +1,610 ft • Technical Grade: Class 1 Sweep & Hairpins
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-right">
          <div className="text-xl font-black font-mono-nums text-orange-400">428 Passes</div>
          <div className="text-[11px] text-zinc-400">Logged by Verified Datum Vehicles</div>
        </div>
      </div>

      {/* Conditions HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono-nums uppercase text-zinc-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Surface Condition
          </span>
          <div className="text-sm font-bold text-emerald-400">Pristine Smooth Tarmac</div>
          <p className="text-[11px] text-zinc-500">Resurfaced section between Upper Brynamman & Llangadog.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono-nums uppercase text-zinc-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Active Hazards
          </span>
          <div className="text-sm font-bold text-amber-400">Free-Roaming Mountain Sheep</div>
          <p className="text-[11px] text-zinc-500">Low-visibility hairpins frequently have livestock on verge.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono-nums uppercase text-zinc-400 flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-cyan-400" /> Recommended Waypoint
          </span>
          <div className="text-sm font-bold text-white">Cray Reservoir Layby</div>
          <p className="text-[11px] text-zinc-500">Wide gravel pull-off with panoramic ridge views.</p>
        </div>
      </div>

      {/* Most Common Chassis Driven */}
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
        <h4 className="text-xs font-bold uppercase font-mono-nums text-zinc-400">
          Chassis Demographics on A4067
        </h4>
        <div className="flex flex-wrap gap-2 text-xs font-mono-nums">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
            Porsche 911 (991/992) • 28%
          </span>
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
            BMW M-Division (G80/F87) • 24%
          </span>
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
            Mazda MX-5 (ND) • 19%
          </span>
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
            Toyota GR Yaris / Supra • 16%
          </span>
        </div>
      </div>

    </div>
  );
};
