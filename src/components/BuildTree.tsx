import { useState } from 'react';
import { GitFork, Check, X } from 'lucide-react';
import type { BuildComponent } from '../types/datum';

const mockBuildComponents: BuildComponent[] = [
  {
    id: 'b1',
    category: 'Suspension',
    currentPart: 'KW Variant 4 3-Way Coilovers',
    previousPart: 'OEM M-Adaptive Dampers',
    rationale: 'Handling & compliance on uneven Welsh B-roads. Rebound: 12 clicks, Compression: 6 clicks.',
    provenance: 'PRO CERTIFIED',
    costGbp: 3850,
  },
  {
    id: 'b2',
    category: 'Exhaust',
    currentPart: 'Akrapovič Evolution Titanium',
    previousPart: 'OEM Steel Exhaust System',
    rationale: '-14kg weight reduction from rear axle. Deeper acoustic character with zero drone at 70mph cruise.',
    provenance: 'INVOICE STAMP',
    costGbp: 6200,
  },
  {
    id: 'b3',
    category: 'Wheels',
    currentPart: 'BBS FI-R Forged Monobloc (19" / 20")',
    previousPart: 'OEM Style 826M Cast Alloy',
    rationale: 'Substantial drop in rotational unsprung mass (-7.2kg total). Sharpened turn-in response.',
    provenance: 'PRO CERTIFIED',
    costGbp: 7400,
  },
  {
    id: 'b4',
    category: 'Brakes',
    currentPart: 'Ferodo DS2500 Pads + Motul RBF 660',
    previousPart: 'OEM Textar Organic Compound',
    rationale: 'High-thermal fade resistance during sustained mountain passes and track sessions.',
    provenance: 'PRO CERTIFIED',
    costGbp: 480,
  },
];

export const BuildTree: React.FC = () => {
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [hasForked, setHasForked] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Living Modification Spec</h2>
          <p className="text-xs text-zinc-400">
            Version 4.2 • 4 Key Commits • Documented setup rationale with verified provenance.
          </p>
        </div>
        <button
          onClick={() => setIsForkModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-500/20 shrink-0"
        >
          <GitFork className="w-4 h-4" />
          <span>Fork This Build Spec</span>
        </button>
      </div>

      {/* Build Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/70">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 font-mono-nums uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Subsystem</th>
                <th className="py-3 px-4">Installed Part</th>
                <th className="py-3 px-4">Previous Part</th>
                <th className="py-3 px-4">Setup Rationale & Feedback</th>
                <th className="py-3 px-4">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono-nums">
              {mockBuildComponents.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{item.category}</td>
                  <td className="py-3.5 px-4 text-orange-400 font-bold">{item.currentPart}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{item.previousPart}</td>
                  <td className="py-3.5 px-4 text-zinc-300 font-sans text-xs leading-relaxed max-w-xs sm:max-w-md">
                    {item.rationale}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.provenance === 'PRO CERTIFIED'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.provenance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fork Modal */}
      {isForkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <GitFork className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Fork Maya's G80 Suspension Spec</h3>
              </div>
              <button onClick={() => setIsForkModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Clone this verified setup into your vehicle wishlist or build pipeline. Fully compatible with all BMW G80 M3 / G82 M4 chassis.
            </p>

            <div className="p-3 bg-zinc-950 rounded-lg text-xs font-mono-nums space-y-1.5 border border-zinc-800">
              <div className="text-orange-400 font-bold">• Part: KW Variant 4 3-Way Coilovers</div>
              <div className="text-zinc-400">• Rebound: 12 clicks front / 10 clicks rear</div>
              <div className="text-zinc-400">• Compression: 6 clicks low-speed / 4 clicks high-speed</div>
              <div className="text-zinc-400">• Ride Height: -20mm front / -15mm rear</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsForkModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setHasForked(true);
                  setTimeout(() => {
                    setIsForkModalOpen(false);
                    setHasForked(false);
                  }, 1200);
                }}
                className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold flex items-center gap-1.5"
              >
                {hasForked ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Spec Forked to Your Garage!</span>
                  </>
                ) : (
                  <span>Confirm Fork to My Car</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
