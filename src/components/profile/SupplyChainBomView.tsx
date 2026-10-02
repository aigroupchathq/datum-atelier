import { useState, useMemo } from 'react';
import type { FC } from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Plus,
  Sparkles,
  AlertTriangle,
  Factory,
  Check
} from 'lucide-react';
import {
  loadVehicleBom,
  calculateSupplyChainHealth,
  verifyComponentIntegrity,
  type SerializedComponent,
  type ComponentCategory
} from '../../core/supplychain/supplyChainBom';
import { AddComponentModal } from './AddComponentModal';
import { useToast } from '../../context/ToastContext';

interface SupplyChainBomViewProps {
  vehicleId: string;
  vin: string;
  vehicleName: string;
}

const CATEGORIES: Array<{ id: 'ALL' | ComponentCategory; label: string }> = [
  { id: 'ALL', label: 'All Assemblies' },
  { id: 'Suspension & Kinematics', label: 'Suspension & Dampers' },
  { id: 'Powertrain', label: 'Powertrain & Core' },
  { id: 'Exhaust & Induction', label: 'Exhaust & Airflow' },
  { id: 'Braking Friction', label: 'Braking Friction' },
  { id: 'Tribology & Fluids', label: 'Tribology & Fluids' },
  { id: 'Chassis & Structure', label: 'Chassis & Structure' }
];

// Country flag mapping helper
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

export const SupplyChainBomView: FC<SupplyChainBomViewProps> = ({
  vehicleId,
  vin,
  vehicleName
}) => {
  const { showToast } = useToast();
  const [components, setComponents] = useState<SerializedComponent[]>(() => loadVehicleBom(vehicleId));
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ComponentCategory>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // Re-read when vehicle changes
  useMemo(() => {
    setComponents(loadVehicleBom(vehicleId));
  }, [vehicleId]);

  const health = useMemo(() => calculateSupplyChainHealth(components), [components]);

  const filteredComponents = useMemo(() => {
    if (selectedCategory === 'ALL') return components;
    return components.filter(c => c.category === selectedCategory);
  }, [components, selectedCategory]);

  const handleCopyHash = (comp: SerializedComponent) => {
    navigator.clipboard?.writeText(comp.provenanceHash);
    setCopiedHashId(comp.id);
    showToast({
      title: 'Provenance Hash Copied',
      message: `SHA-256 seal for ${comp.partName} copied to clipboard.`,
      type: 'clipboard',
      badge: 'SHA-256'
    });
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleComponentAdded = (newComp: SerializedComponent) => {
    setComponents(prev => [newComp, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* 1. SUPPLY CHAIN INTEGRITY BINNACLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        {/* Subtle guilloche background highlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-numbers font-bold border border-amber-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SUPPLY CHAIN PROVENANCE & BOM
              </span>
              <span className="text-xs font-mono-numbers text-zinc-400">
                AEROSPACE-GRADE BILL OF MATERIALS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {vehicleName} Serialized Component Lineage
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1 max-w-2xl leading-relaxed">
              Every critical sub-assembly, damper, brake compound, and fluid batch is notarized to chassis VIN <strong className="text-zinc-200 font-mono-numbers">{vin}</strong>. Unbroken custody prevents counterfeit replica parts from entering the vehicle lifecycle.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-xl hover:brightness-110 flex items-center gap-2 self-start lg:self-center shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Serialized Part</span>
          </button>
        </div>

        {/* Supply Chain Health Metric Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-xs font-mono-numbers relative z-10">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Traceability Score</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-400">{health.score}</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Grade A+ Custody</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Counterfeit Risk</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-bold text-white">{health.counterfeitRisk}</span>
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">0 Unverified Replicas</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Specialist Sign-off</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{health.verifiedPct}%</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Master Technicians</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.06]">
            <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Logged Assemblies</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{health.componentsLogged}</span>
              <span className="text-xs text-zinc-500">parts</span>
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">Avg Life: {health.activeLifeAvg}%</span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY PILL FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono-numbers whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-950/70 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. SERIALIZED COMPONENTS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComponents.map((comp) => {
          const isValid = verifyComponentIntegrity(comp);
          const flag = getCountryFlag(comp.originCountry);
          const isCopied = copiedHashId === comp.id;

          return (
            <div
              key={comp.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10] border border-white/[0.08] hover:border-white/20 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              {/* Card Top: Title, Category & Origin Flag */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                        {comp.category}
                      </span>
                      <span className="text-xs" title={comp.originCountry}>
                        {flag} {comp.originCountry}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {comp.partName}
                    </h3>
                  </div>

                  {isValid ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono-numbers font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>SEALED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono-numbers font-bold flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>UNVERIFIED</span>
                    </span>
                  )}
                </div>

                {/* Manufacturer & Facility */}
                <div className="text-xs font-mono-numbers text-zinc-400 flex items-center gap-1.5 pt-0.5">
                  <Factory className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{comp.manufacturer}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">{comp.originFacility}</span>
                </div>

                {/* Engineering Rationale */}
                <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-3 pt-2 border-t border-white/[0.06]">
                  {comp.engineeringRationale}
                </p>
              </div>

              {/* Card Bottom: Torque, Serial, Service Life, and Hash */}
              <div className="space-y-3 pt-2 text-xs font-mono-numbers">
                {/* Fastener Torque Spec Callout */}
                <div className="p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-400/20 flex items-center justify-between text-amber-300">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Fastener Torque:</span>
                  </div>
                  <strong className="text-xs font-mono-numbers text-amber-200">{comp.torqueSpec}</strong>
                </div>

                {/* Serial & Batch info */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-white/[0.04]">
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">Serial Number</span>
                    <strong className="text-zinc-200">{comp.serialNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">Production Lot</span>
                    <strong className="text-zinc-200">{comp.batchLotNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">Fitted At</span>
                    <span className="text-zinc-300">{comp.installationMileage.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">Workshop</span>
                    <span className="text-zinc-300 line-clamp-1">{comp.installedByWorkshop}</span>
                  </div>
                </div>

                {/* Service Life Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                    <span>Component Health Life</span>
                    <span className="text-emerald-400 font-bold">{comp.serviceLifeRemainingPct}% Remaining</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        comp.serviceLifeRemainingPct > 70
                          ? 'bg-emerald-400'
                          : comp.serviceLifeRemainingPct > 40
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${comp.serviceLifeRemainingPct}%` }}
                    />
                  </div>
                </div>

                {/* Cryptographic Hash Bar */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-600">SHA-256:</span>
                    <code className="text-zinc-400 font-mono">{comp.provenanceHash.slice(0, 16)}…</code>
                  </div>
                  <button
                    onClick={() => handleCopyHash(comp)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white transition px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08]"
                    title="Copy full 64-character SHA-256 cryptographic provenance hash"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Hash</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Component Modal */}
      <AddComponentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vehicleId={vehicleId}
        vin={vin}
        vehicleName={vehicleName}
        onComponentAdded={handleComponentAdded}
      />
    </div>
  );
};
