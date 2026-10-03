import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Wrench, 
  ShieldCheck, 
  Factory, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';
import { FluidLevitation } from '../../core/motion/FluidLevitation';
import { useToast } from '../../context/ToastContext';

interface TaggedBomComponent {
  id: string;
  partName: string;
  category: string;
  manufacturer: string;
  originCountry: string;
  torqueSpec: string;
  serialNumber: string;
  provenanceHash: string;
  installedByWorkshop?: string;
}

interface ComponentSpecPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  component?: TaggedBomComponent | null;
  authorVehicleId?: string;
  authorVehicleName?: string;
}

function getCountryFlag(country: string): string {
  const c = country.toLowerCase();
  if (c.includes('germany') || c.includes('deutschland')) return '🇩🇪';
  if (c.includes('slovenia')) return '🇸🇮';
  if (c.includes('kingdom') || c.includes('britain') || c.includes('uk')) return '🇬🇧';
  if (c.includes('italy') || c.includes('italia')) return '🇮🇹';
  if (c.includes('france')) return '🇫🇷';
  if (c.includes('belgium')) return '🇧🇪';
  if (c.includes('united states') || c.includes('usa') || c.includes('america')) return '🇺🇸';
  if (c.includes('australia')) return '🇦🇺';
  if (c.includes('japan')) return '🇯🇵';
  if (c.includes('sweden')) return '🇸🇪';
  return '🌐';
}

export const ComponentSpecPreviewModal: FC<ComponentSpecPreviewModalProps> = ({
  isOpen,
  onClose,
  component,
  authorVehicleId,
  authorVehicleName
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !component) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(component.provenanceHash);
    setCopied(true);
    showToast({
      title: 'Component Provenance Hash Copied',
      message: `SHA-256 seal for ${component.partName} copied to clipboard.`,
      type: 'clipboard',
      badge: 'SHA-256'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const flag = getCountryFlag(component.originCountry);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <FluidLevitation ambientIntensity={0.8} className="w-full max-w-xl my-8">
        <div className="relative rounded-3xl bg-[#0D0D11] border border-[#C5A059]/40 shadow-2xl p-6 sm:p-8 text-zinc-200">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono-numbers font-bold border border-amber-500/20 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  VERIFIED BOM HARDWARE
                </span>
                <span className="text-xs">
                  {flag} {component.originCountry}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {component.partName}
              </h3>
              <p className="text-xs font-mono-numbers text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-zinc-500" />
                <span>{component.manufacturer}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">{component.category}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono-numbers">
            
            {/* FASTENER TORQUE SPEC CALLOUT (High-Value for Car Passion Heads) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.06] to-transparent border border-amber-400/30 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                <span>Fastener Torque Specification</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-amber-200">
                {component.torqueSpec}
              </p>
              <p className="text-[10px] text-zinc-400 font-sans">
                Calibrated workshop torque setting. Essential for track-day paddock checks and pre-drive torque wrench verification.
              </p>
            </div>

            {/* Industrial Lineage Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-black/50 border border-white/[0.06]">
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Physical Serial No.</span>
                <strong className="text-zinc-200 text-xs font-mono">{component.serialNumber}</strong>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Certified Workshop</span>
                <span className="text-zinc-300 text-xs line-clamp-1">{component.installedByWorkshop || 'Independent Specialist Atelier'}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Provenance Standard</span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ISO 9001 / TÜV Conformity
                </span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">Chassis Integrity</span>
                <span className="text-zinc-300 text-xs">Authentic Verified Origin</span>
              </div>
            </div>

            {/* SHA-256 Cryptographic Seal */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-[11px]">
              <div className="space-y-0.5">
                <span className="text-[9px] text-zinc-500 block uppercase">SHA-256 Cryptographic Seal</span>
                <code className="text-zinc-300 font-mono text-[10px] block break-all">
                  {component.provenanceHash ? `${component.provenanceHash.slice(0, 24)}…${component.provenanceHash.slice(-8)}` : 'SEALED-PROVENANCE'}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Navigation to Car BOM Ledger */}
            {authorVehicleId && (
              <div className="pt-2">
                <Link
                  to={`/car/${authorVehicleId}?tab=bom`}
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-400/40 text-white font-bold text-xs transition flex items-center justify-between group shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Inspect {authorVehicleName || 'Vehicle'} Full Bill of Materials</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

          </div>

        </div>
      </FluidLevitation>
    </div>
  );
};
