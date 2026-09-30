import { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { SubsystemHealth, TyreStatus } from '../types/datum';

interface HealthTwinProps {
  onNavigateToPro: () => void;
}

const mockSubsystems: SubsystemHealth[] = [
  {
    name: 'Powertrain',
    component: 'S58 3.0L Twin-Turbo',
    percentage: 94,
    type: 'MEASURED',
    status: 'Nominal',
    details: [
      { label: 'OBD-II DTC Codes', value: '0 Active Faults' },
      { label: 'Oil Life Remaining', value: '4,200 mi' },
      { label: 'Boost Target Deviation', value: '<0.05 bar' },
    ],
  },
  {
    name: 'Braking System',
    component: 'Ferodo DS2500 + Motul RBF 660',
    percentage: 68,
    type: 'ESTIMATED WEAR',
    status: 'Good Condition',
    details: [
      { label: 'Front Pad Thickness', value: '6.2 mm' },
      { label: 'Fluid Boiling Temp', value: '295°C' },
      { label: 'DVSA MOT Inspection', value: 'Pass (0 Advisories)' },
    ],
  },
  {
    name: 'Electrical & 12V',
    component: '12V AGM Core System',
    percentage: 88,
    type: 'MEASURED',
    status: 'Healthy',
    details: [
      { label: 'Resting Voltage', value: '12.42 V' },
      { label: 'Alternator Load', value: '14.2 V Charging' },
      { label: 'Parasitic Quiescent Drain', value: '22 mA' },
    ],
  },
  {
    name: 'Emissions & Exhaust',
    component: 'Akrapovič / Catalytic Subsystem',
    percentage: 96,
    type: 'MEASURED',
    status: 'Nominal',
    details: [
      { label: 'O2 Sensor Lambda', value: '1.00 ± 0.02' },
      { label: 'Exhaust Valve Servo', value: 'Calibrated' },
      { label: 'Euro 6d Compliance', value: 'Pass' },
    ],
  },
];

const mockTyres: TyreStatus[] = [
  { position: 'FL', label: 'Front Left', treadMm: 5.2, psi: 32.0, status: 'good', notes: 'Even wear • DOT 1423' },
  { position: 'FR', label: 'Front Right', treadMm: 5.1, psi: 32.1, status: 'good', notes: 'Even wear • DOT 1423' },
  { position: 'RL', label: 'Rear Left', treadMm: 3.4, psi: 34.2, status: 'advisory', notes: 'Inner shoulder -1.8° camber' },
  { position: 'RR', label: 'Rear Right', treadMm: 3.5, psi: 34.0, status: 'advisory', notes: 'Inner shoulder -1.8° camber' },
];

export const HealthTwin: React.FC<HealthTwinProps> = ({ onNavigateToPro }) => {
  const [filter, setFilter] = useState<'all' | 'MEASURED' | 'ESTIMATED WEAR'>('all');

  const filteredSubsystems = mockSubsystems.filter(
    (item) => filter === 'all' || item.type === filter
  );

  return (
    <div className="space-y-6">
      
      {/* Philosophy Header Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono-nums font-bold">
            HONEST TELEMETRY
          </span>
          <span className="text-zinc-300">
            Explicitly delineating <strong>Physical Measured Telemetry</strong> from <strong>Actuarial Wear Estimates</strong>.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'MEASURED', 'ESTIMATED WEAR'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2.5 py-1 rounded font-mono-nums text-[11px] transition ${
                filter === mode
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode === 'all' ? 'All Subsystems' : mode === 'MEASURED' ? 'Measured Only' : 'Estimated Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Subsystems 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSubsystems.map((sub) => (
          <div key={sub.name} className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono-nums uppercase text-zinc-400">{sub.name}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{sub.component}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-nums border ${
                  sub.type === 'MEASURED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {sub.type}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono-nums ${
                sub.percentage > 85 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {sub.percentage}%
              </span>
              <span className="text-xs text-zinc-400 font-mono-nums">{sub.status}</span>
            </div>

            <div className="text-xs text-zinc-400 space-y-1.5 pt-1 border-t border-zinc-800/80">
              {sub.details.map((d) => (
                <div key={d.label} className="flex justify-between items-center text-[11px]">
                  <span>{d.label}</span>
                  <span className="font-mono-nums text-zinc-300 font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tyres Subsystem: 4-Wheel Contact Patch Visualizer */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Footwear & Contact Patch</h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono-nums flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> ADVISORY IN ~1,400 MILES
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Michelin Pilot Sport 4S (Front: 275/35 R19 • Rear: 285/30 R20)
            </p>
          </div>
          <button
            onClick={onNavigateToPro}
            className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 text-xs font-bold text-orange-400 transition font-mono-nums flex items-center gap-1.5 shrink-0"
          >
            <span>Compare 3 Verified Local Fitters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Tyres Visualization Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {mockTyres.map((tyre) => {
            const isAdvisory = tyre.status === 'advisory';
            return (
              <div
                key={tyre.position}
                className={`p-4 rounded-xl bg-zinc-950 border space-y-2 relative ${
                  isAdvisory ? 'border-amber-600/50' : 'border-zinc-800'
                }`}
              >
                {isAdvisory && (
                  <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono-nums font-bold">
                    WEAR THRESHOLD
                  </span>
                )}
                <div className="flex justify-between text-[11px] font-mono-nums pt-1">
                  <span className="text-zinc-400">{tyre.label}</span>
                  <span className={`font-bold ${isAdvisory ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tyre.treadMm} mm
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isAdvisory ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${(tyre.treadMm / 8.0) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono-nums flex justify-between pt-1">
                  <span>{tyre.psi} PSI</span>
                  <span className="truncate max-w-[110px]" title={tyre.notes}>{tyre.notes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
