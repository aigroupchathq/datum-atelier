import type { FC } from 'react';
import { Shield, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  isVeilActive: boolean;
  onToggleVeil: () => void;
}

export const Header: FC<HeaderProps> = ({ isVeilActive, onToggleVeil }) => {
  return (
    <>
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-black text-base tracking-tighter shadow-lg shadow-orange-500/20">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-wider text-white">DATUM</span>
                <span className="text-[10px] font-mono-nums px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 uppercase">
                  ENGINE 2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">The Ground Truth of the Machine</p>
            </div>
          </div>

          {/* Active Machine Anchor */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-zinc-200">MAYA</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 font-mono-nums">G80 M3 COMPETITION</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono-nums text-emerald-400">92% INTEGRITY</span>
          </div>

          {/* Privacy Veil Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-mono-nums tracking-widest text-zinc-400">Privacy Veil</span>
              <span className={`text-xs font-bold font-mono-nums ${isVeilActive ? 'text-purple-400' : 'text-emerald-400'}`}>
                {isVeilActive ? 'CLOAKED [PUBLIC]' : 'CUSTODIAN [OPEN]'}
              </span>
            </div>

            <button
              onClick={onToggleVeil}
              aria-label="Toggle Privacy Veil"
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none p-1 border ${
                isVeilActive ? 'bg-purple-950 border-purple-700/60' : 'bg-emerald-950 border-emerald-700/60'
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform ${
                  isVeilActive ? 'translate-x-0 bg-purple-400 text-black' : 'translate-x-8 bg-emerald-400 text-black'
                }`}
              >
                {isVeilActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Veil State Banner */}
      <div className={`px-4 py-2 text-xs border-b transition-colors ${
        isVeilActive ? 'bg-purple-950/40 border-purple-800/40 text-purple-300' : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isVeilActive ? (
                <><strong>Zero-Knowledge Veil Active:</strong> Legal owner decoupled. Plate redacted. GPS start/end fuzzed by 850m.</>
              ) : (
                <><strong>Custodian View Active:</strong> All unmasked telemetry, V5C proof, and private cost receipts visible.</>
              )}
            </span>
          </div>
          <button onClick={onToggleVeil} className="underline text-xs font-mono-nums hover:opacity-80">
            {isVeilActive ? 'Switch to Custodian Mode' : 'Cloak Machine'}
          </button>
        </div>
      </div>
    </>
  );
};
