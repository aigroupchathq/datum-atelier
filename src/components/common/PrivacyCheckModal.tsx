import { useState } from 'react';
import type { FC } from 'react';
import { ShieldCheck, X, Check } from 'lucide-react';

interface PrivacyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyCheckModal: FC<PrivacyCheckModalProps> = ({ isOpen, onClose }) => {
  const [blurPlates, setBlurPlates] = useState<boolean>(true);
  const [fuzzHomeWork, setFuzzHomeWork] = useState<boolean>(true);
  const [veilHumanOwner, setVeilHumanOwner] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Garage Privacy Guardrails</h3>
              <p className="text-xs text-zinc-400">Owner protection active across all public car posts.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guardrail controls */}
        <div className="space-y-4 text-xs">
          
          {/* Plate blur toggle */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Auto Registration Plate Blur</span>
              <p className="text-zinc-400 leading-relaxed">
                Automatically detects and applies a privacy filter over vehicle number plates on all uploads.
              </p>
            </div>
            <button
              onClick={() => setBlurPlates(!blurPlates)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                blurPlates ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  blurPlates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Location geofence fuzzing */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Start / Finish Geofence Protection</span>
              <p className="text-zinc-400 leading-relaxed">
                Strips the first and last 800 meters of any recorded Drive to prevent disclosing home or work premises.
              </p>
            </div>
            <button
              onClick={() => setFuzzHomeWork(!fuzzHomeWork)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                fuzzHomeWork ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  fuzzHomeWork ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Human veil */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Sovereign Vehicle Persona</span>
              <p className="text-zinc-400 leading-relaxed">
                Posts and comments originate from the Car identity (e.g. <em>MAYA</em>). The legal human owner name remains private.
              </p>
            </div>
            <button
              onClick={() => setVeilHumanOwner(!veilHumanOwner)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                veilHumanOwner ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  veilHumanOwner ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-500 font-mono-numbers">ICO 2025 Transport Compliant</span>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-black font-semibold text-xs transition flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <span>Save Privacy Settings</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
