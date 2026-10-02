import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  X, 
  ShieldCheck, 
  Wrench, 
  Sparkles
} from 'lucide-react';
import { 
  addComponentToBom, 
  type ComponentCategory, 
  type SerializedComponent 
} from '../../core/supplychain/supplyChainBom';
import { FluidLevitation } from '../../core/motion/FluidLevitation';
import { useToast } from '../../context/ToastContext';

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vin: string;
  vehicleName: string;
  onComponentAdded: (component: SerializedComponent) => void;
}

const CATEGORIES: ComponentCategory[] = [
  'Suspension & Kinematics',
  'Powertrain',
  'Exhaust & Induction',
  'Braking Friction',
  'Wheels & Tyres',
  'Tribology & Fluids',
  'Chassis & Structure'
];

export const AddComponentModal: FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vin,
  vehicleName,
  onComponentAdded
}) => {
  const { showToast } = useToast();

  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('Suspension & Kinematics');
  const [manufacturer, setManufacturer] = useState('');
  const [originCountry, setOriginCountry] = useState('United Kingdom');
  const [originFacility, setOriginFacility] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [batchLotNumber, setBatchLotNumber] = useState('');
  const [installationMileage, setInstallationMileage] = useState<number>(41000);
  const [installedByWorkshop, setInstalledByWorkshop] = useState('Independent Specialist Atelier');
  const [torqueSpec, setTorqueSpec] = useState('Statutory OEM Spec');
  const [isoStandardCert, setIsoStandardCert] = useState('ISO 9001 / TÜV Conformity');
  const [engineeringRationale, setEngineeringRationale] = useState('');
  const [verifiedByMasterMechanic, setVerifiedByMasterMechanic] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!partName.trim()) {
      showToast({
        title: 'Component Name Required',
        message: 'Please specify the component name to register in the Bill of Materials.',
        type: 'garage',
        badge: 'VALIDATION'
      });
      return;
    }

    const sNum = serialNumber.trim() || `SN-${Math.floor(Math.random() * 899999 + 100000)}`;
    const bLot = batchLotNumber.trim() || `LOT-${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`;

    const newComp = addComponentToBom(vehicleId, {
      vehicleId,
      vin,
      partName: partName.trim(),
      category,
      manufacturer: manufacturer.trim() || 'OEM Performance Atelier',
      originCountry: originCountry.trim() || 'Great Britain',
      originFacility: originFacility.trim() || 'Specialist Facility',
      serialNumber: sNum,
      batchLotNumber: bLot,
      installationMileage: Number(installationMileage) || 0,
      installationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      installedByWorkshop: installedByWorkshop.trim() || 'Self-Commissioned / Custodian',
      torqueSpec: torqueSpec.trim() || 'Torqued to calibrated engineering spec',
      isoStandardCert: isoStandardCert.trim() || 'ISO 9001 / TÜV Verified',
      serviceLifeRemainingPct: 100,
      replacementIntervalMiles: 50000,
      engineeringRationale: engineeringRationale.trim() || 'Installed for enhanced mechanical feel and thermal resilience.',
      verifiedByMasterMechanic
    });

    onComponentAdded(newComp);

    showToast({
      title: 'Component Sealed to Chassis Ledger',
      message: `${newComp.partName} cryptographically anchored with SHA-256 hash.`,
      type: 'garage',
      badge: 'BOM PROVENANCE'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <FluidLevitation ambientIntensity={0.8} className="w-full max-w-2xl my-8">
        <div className="relative rounded-3xl bg-[#0D0D11] border border-[#C5A059]/40 shadow-2xl p-6 sm:p-8 text-zinc-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-luxury-display">
                  LOG SERIALIZED COMPONENT (BOM)
                </h3>
                <p className="text-[11px] font-mono-numbers text-zinc-400">
                  {vehicleName} • VIN: {vin} • Immutable Supply Chain Custody
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-numbers">
            {/* Component Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Hardware Component Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KW Variant 4 3-Way Coilovers"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Component Assembly Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-400/60"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manufacturer & Country of Origin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Manufacturer / Foundry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Akrapovič d.d. / Brembo S.p.A."
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Origin Country & Facility
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Country (e.g. Germany)"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-1/2 px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                  />
                  <input
                    type="text"
                    placeholder="Facility / City"
                    value={originFacility}
                    onChange={(e) => setOriginFacility(e.target.value)}
                    className="w-1/2 px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                  />
                </div>
              </div>
            </div>

            {/* Serial Number & Batch ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Physical Serial Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. SN-8842-DE (auto-generated if blank)"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Production Lot / Batch ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. LOT-2024-Q3 (auto-generated if blank)"
                  value={batchLotNumber}
                  onChange={(e) => setBatchLotNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            {/* Installation Odometer & Fastener Torque Spec */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Installation Mileage (Miles)
                </label>
                <input
                  type="number"
                  value={installationMileage}
                  onChange={(e) => setInstallationMileage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-amber-400 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-amber-400" />
                  Fastener Torque Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. 35 Nm top mounts • 120 Nm wheel studs"
                  value={torqueSpec}
                  onChange={(e) => setTorqueSpec(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-amber-400/30 text-amber-300 placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            {/* Workshop & ISO Standard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Installing Workshop / Custodian
                </label>
                <input
                  type="text"
                  placeholder="e.g. Litchfield Motors / Manthey Atelier"
                  value={installedByWorkshop}
                  onChange={(e) => setInstalledByWorkshop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  ISO / TÜV Homologation Cert
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISO 9001 / TÜV Teilegutachten"
                  value={isoStandardCert}
                  onChange={(e) => setIsoStandardCert(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>

            {/* Engineering Rationale */}
            <div>
              <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                Engineering Rationale & Mechanical Behavior
              </label>
              <textarea
                rows={2}
                placeholder="Explain why this component was chosen (e.g. provides sharper turn-in on wet B-roads, eliminates brake fade on alpine passes)..."
                value={engineeringRationale}
                onChange={(e) => setEngineeringRationale(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 font-sans text-xs"
              />
            </div>

            {/* Master Mechanic Verification Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <input
                type="checkbox"
                id="mechanicVerify"
                checked={verifiedByMasterMechanic}
                onChange={(e) => setVerifiedByMasterMechanic(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400/50 bg-zinc-800 border-zinc-700"
              />
              <label htmlFor="mechanicVerify" className="text-zinc-300 text-xs flex items-center gap-2 cursor-pointer select-none">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sign off with Master Mechanic certification seal (Adds +30 Provenance Weight)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold hover:brightness-110 transition shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Seal Component with SHA-256</span>
              </button>
            </div>

          </form>

        </div>
      </FluidLevitation>
    </div>
  );
};
