import { ShieldCheck, Award, Flag } from 'lucide-react';
import type { MemoryEntry } from '../types/datum';

const mockMemory: MemoryEntry[] = [
  {
    id: 'm1',
    date: 'June 2026',
    mileage: 41200,
    title: 'Brake Upgrade & Fluid Pressure Flush',
    description: 'Fitted Ferodo DS2500 fast-road pads front/rear. Flushed brake hydraulics with Motul RBF 660 racing fluid.',
    tier: 'PRO CERTIFIED',
    issuer: 'Evolve Automotive (Datum Pro #829)',
    costGbp: 480,
  },
  {
    id: 'm2',
    date: 'March 2026',
    mileage: 38190,
    title: 'Annual MOT Statutory Inspection',
    description: 'Official UK DVSA computerized roadworthiness test. Brakes, steering, suspension, emissions inspected.',
    tier: 'REGULATORY DVSA',
    issuer: 'DVSA Test Station #64219 • Result: PASS (0 Advisories)',
    costGbp: 54.85,
  },
  {
    id: 'm3',
    date: 'August 2025',
    mileage: 34500,
    title: 'Silverstone GP Circuit Shakedown',
    description: 'First intermediate track day session. 42 laps completed. Monitored engine oil temp remained at 104°C max.',
    tier: 'OWNER MILESTONE',
    issuer: 'Silverstone Circuit / Documented by Custodian',
  },
  {
    id: 'm4',
    date: 'March 2023',
    mileage: 12,
    title: 'Factory Rollout & Pre-Delivery Inspection',
    description: 'Handed over at BMW Park Lane. Initial running-in service completed at 1,200 miles on schedule.',
    tier: 'PRO CERTIFIED',
    issuer: 'BMW Park Lane Official Retailer',
  },
];

export const MemoryLedger: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Lifetime History Ledger</h2>
          <p className="text-xs text-zinc-400">
            Immutable chronicle from factory roll-out to present day. Retained with car across ownership handovers.
          </p>
        </div>
        <span className="text-xs font-mono-nums px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
          38 Verified Records
        </span>
      </div>

      <div className="relative border-l border-zinc-800 ml-4 space-y-6 pl-6">
        {mockMemory.map((entry) => {
          let dotColor = 'bg-blue-500';
          let badgeStyle = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
          let Icon = Award;

          if (entry.tier === 'REGULATORY DVSA') {
            dotColor = 'bg-emerald-500';
            badgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            Icon = ShieldCheck;
          } else if (entry.tier === 'OWNER MILESTONE') {
            dotColor = 'bg-orange-500';
            badgeStyle = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            Icon = Flag;
          }

          return (
            <div key={entry.id} className="relative">
              <span className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full ${dotColor} border-2 border-[#09090b]`}></span>
              
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-nums font-bold border flex items-center gap-1 ${badgeStyle}`}>
                      <Icon className="w-3 h-3" />
                      <span>{entry.tier}</span>
                    </span>
                    <span className="text-xs font-bold text-white">{entry.title}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono-nums">
                    {entry.mileage.toLocaleString()} mi • {entry.date}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {entry.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono-nums text-zinc-400">
                  <span>Signatory: <strong className="text-zinc-300">{entry.issuer}</strong></span>
                  {entry.costGbp && (
                    <span className="text-zinc-300 font-bold">Total: £{entry.costGbp.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
