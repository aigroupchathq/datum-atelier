import { useState, useId } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  X, 
  Wrench, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  Plus, 
  Trash2, 
  Key, 
  Building2, 
  Car, 
  Layers,
  Sparkles,
  Link2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
  type CertifiedServiceStamp,
  type ServiceCategory,
  type InstalledComponent,
  VERIFIED_WORKSHOPS,
  issueServiceStamp,
  verifyStampChainIntegrity,
  loadWorkshopStamps,
  saveWorkshopStamps
} from '../../core/workshop/WorkshopStampEngine';

interface WorkshopStampingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStampIssued?: (stamp: CertifiedServiceStamp) => void;
  preselectedVehicleId?: string;
}

const STABLE_VEHICLES = [
  {
    id: 'car-maya-m3',
    name: 'MAYA',
    fullName: 'BMW M3 Competition (G80)',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    currentMileage: 42184
  },
  {
    id: 'car-kuro-gt3',
    name: 'KURO',
    fullName: 'Porsche 911 GT3 Touring (992)',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    currentMileage: 18450
  },
  {
    id: 'car-retro-e30',
    name: 'RETRO MOD',
    fullName: 'BMW 318is Slicktop (E30)',
    chassisCode: 'E30-318IS-SLICKTOP',
    vin: 'WBA-AF92-0018-E30',
    currentMileage: 118400
  },
  {
    id: 'car-expedition-110',
    name: 'EXPEDITION',
    fullName: 'Defender 110 P400 SE',
    chassisCode: 'L663-DEFENDER-110',
    vin: 'SAL-WR2V-40MA-110',
    currentMileage: 31200
  }
];

const CATEGORY_LABELS: Record<ServiceCategory, { label: string; desc: string }> = {
  MAJOR_INSPECTION: { label: 'Major Inspection', desc: 'Full mechanical inspection, fluids, filters, ISTA/PIWIS diagnostics' },
  OIL_SPECTROSCOPY: { label: 'Oil Spectroscopy', desc: 'Laboratory oil wear analysis, magnetic plug inspection' },
  BRAKE_DAMPER_OVERHAUL: { label: 'Brakes & Dampers', desc: 'Coilover rebuild, pad friction renewal, fluid flush' },
  POWERTRAIN_CALIBRATION: { label: 'Powertrain Calibration', desc: 'Maha LPS 3000 hub dyno cell test, AFR map tuning' },
  STRUCTURAL_CONSERVATION: { label: 'Structural Conservation', desc: 'Cavity wax injection, seam welding, rust protection' },
  CORNER_WEIGHTING: { label: 'Corner Balancing', desc: '4-wheel laser string alignment and ballast cross-weighting' }
};

export const WorkshopStampingModal: FC<WorkshopStampingModalProps> = ({
  isOpen,
  onClose,
  onStampIssued,
  preselectedVehicleId = 'car-maya-m3'
}) => {
  const { isWhiteYellow, themeMeta } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'ISSUER' | 'CHAIN_AUDIT'>('ISSUER');

  // Workshop & Vehicle state
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(VERIFIED_WORKSHOPS[0].id);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(preselectedVehicleId);
  const [category, setCategory] = useState<ServiceCategory>('MAJOR_INSPECTION');
  const [title, setTitle] = useState('42,000-Mile Scheduled Service & Differential Fluid Flush');
  const [workDescription, setWorkDescription] = useState('Spark plugs renewed with NGK Laser Iridium. Rear differential fluid drained and renewed with Castrol 75W-140. Brake caliper slide pins lubricated. 0 diagnostic faults recorded.');
  const [mileage, setMileage] = useState<number>(42200);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-LM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [totalCostGbp, setTotalCostGbp] = useState<number>(890.00);

  // Components state
  const [components, setComponents] = useState<InstalledComponent[]>([
    { category: 'Ignition', componentName: 'NGK Laser Iridium Spark Plugs (x6)', serialNumber: 'NGK-SIL-99', torqueSpecNm: 25, costGbp: 180.00 },
    { category: 'Drivetrain', componentName: 'Castrol Syntrax 75W-140 Limited Slip Fluid (2.5L)', costGbp: 95.00 }
  ]);
  const [newCompName, setNewCompName] = useState('');
  const [newCompCategory, setNewCompCategory] = useState('Dampers & Suspension');
  const [newCompCost, setNewCompCost] = useState('');
  const [newCompTorque, setNewCompTorque] = useState('');

  // Stamps registry
  const [stamps, setStamps] = useState<CertifiedServiceStamp[]>(() => loadWorkshopStamps());
  const [isSigning, setIsSigning] = useState(false);

  const selectedVehicle = STABLE_VEHICLES.find(v => v.id === selectedVehicleId) || STABLE_VEHICLES[0];
  const selectedWorkshop = VERIFIED_WORKSHOPS.find(w => w.id === selectedWorkshopId) || VERIFIED_WORKSHOPS[0];

  const vehicleStamps = stamps.filter(s => s.vehicleId === selectedVehicleId);
  const chainAudit = verifyStampChainIntegrity(stamps);

  const compIdPrefix = useId();

  if (!isOpen) return null;

  const handleAddComponent = () => {
    if (!newCompName.trim()) return;
    const cost = parseFloat(newCompCost) || 0;
    const torque = parseFloat(newCompTorque) || undefined;
    setComponents(prev => [
      ...prev,
      {
        category: newCompCategory,
        componentName: newCompName.trim(),
        costGbp: cost,
        torqueSpecNm: torque
      }
    ]);
    setNewCompName('');
    setNewCompCost('');
    setNewCompTorque('');
  };

  const handleRemoveComponent = (idx: number) => {
    setComponents(prev => prev.filter((_, i) => i !== idx));
  };

  const handleIssueStamp = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !workDescription.trim()) {
      showToast({ title: 'Validation Incomplete', message: 'Title and technical description are mandatory.', type: 'garage' });
      return;
    }

    setIsSigning(true);

    setTimeout(() => {
      const newStamp = issueServiceStamp({
        vehicleId: selectedVehicle.id,
        chassisCode: selectedVehicle.chassisCode,
        vin: selectedVehicle.vin,
        mileage: Number(mileage),
        serviceDate: new Date().toISOString().split('T')[0],
        category,
        title: title.trim(),
        workDescription: workDescription.trim(),
        workshopId: selectedWorkshop.id,
        components,
        totalCostGbp: Number(totalCostGbp),
        invoiceNumber: invoiceNumber.trim()
      }, stamps);

      const updatedStamps = [...stamps, newStamp];
      setStamps(updatedStamps);
      saveWorkshopStamps(updatedStamps);
      setIsSigning(false);

      if (onStampIssued) {
        onStampIssued(newStamp);
      }

      showToast({
        title: 'Cryptographic Stamp Issued',
        message: `Signed by ${selectedWorkshop.masterMechanic} • Sealed to ${selectedVehicle.name}'s Provenance Chain`,
        type: 'privacy',
        badge: 'SEALED'
      });

      setActiveTab('CHAIN_AUDIT');
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl flex flex-col max-h-[92vh] ${
          isWhiteYellow ? 'bg-white border-zinc-200 text-zinc-950' : 'bg-[#121318] border-white/[0.12] text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isWhiteYellow ? 'border-zinc-200 bg-zinc-50' : 'border-white/[0.08] bg-[#0E0F14]'
        }`}>
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
              style={{
                backgroundColor: isWhiteYellow ? '#FEF08A' : `${themeMeta.accentHex}20`,
                border: `1.5px solid ${themeMeta.accentHex}40`
              }}
            >
              <Wrench className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-luxury-display text-base sm:text-lg font-bold uppercase tracking-wider">
                  Specialist Workshop Stamping Desk
                </h3>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                  OPERATOR PORTAL
                </span>
              </div>
              <p className={`text-xs font-mono-numbers mt-0.5 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Digital Service Sign-Off & Cryptographic Provenance Chaining (£49/mo B2B SaaS)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 border-b flex items-center justify-between text-xs font-mono-numbers ${
          isWhiteYellow ? 'border-zinc-200 bg-white' : 'border-white/[0.06] bg-[#0A0B0E]'
        }`}>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('ISSUER')}
              className={`py-3 border-b-2 font-bold transition flex items-center gap-2 ${
                activeTab === 'ISSUER'
                  ? isWhiteYellow ? 'border-amber-500 text-zinc-950' : 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>1. ISSUE CERTIFIED STAMP</span>
            </button>
            <button
              onClick={() => setActiveTab('CHAIN_AUDIT')}
              className={`py-3 border-b-2 font-bold transition flex items-center gap-2 ${
                activeTab === 'CHAIN_AUDIT'
                  ? isWhiteYellow ? 'border-amber-500 text-zinc-950' : 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>2. PROVENANCE HASH CHAIN AUDIT</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${chainAudit.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {chainAudit.isValid ? 'VALID' : 'TAMPERED'}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>ECDSA / SHA-256 Signatures Active</span>
          </div>
        </div>

        {/* Tab 1: Stamp Issuer Form */}
        {activeTab === 'ISSUER' && (
          <form onSubmit={handleIssueStamp} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
            
            {/* Workshop & Target Vehicle Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Workshop Selector */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Signing Specialist Workshop</span>
                </label>
                <select
                  value={selectedWorkshopId}
                  onChange={(e) => setSelectedWorkshopId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono-numbers focus:outline-none ${
                    isWhiteYellow
                      ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                      : 'bg-black/60 border-white/10 text-white focus:border-amber-400/50'
                  }`}
                >
                  {VERIFIED_WORKSHOPS.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                  ))}
                </select>
                <div className="text-[10px] font-mono-numbers text-zinc-500 space-y-0.5 pt-1">
                  <p>Accreditation: <strong className="text-emerald-400">{selectedWorkshop.accreditationCode}</strong></p>
                  <p>Signatory: <span className={isWhiteYellow ? 'text-zinc-800' : 'text-zinc-300'}>{selectedWorkshop.masterMechanic}</span></p>
                </div>
              </div>

              {/* Target Vehicle Selector */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Chassis Dossier</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    const veh = STABLE_VEHICLES.find(v => v.id === e.target.value);
                    if (veh) setMileage(veh.currentMileage + 150);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono-numbers focus:outline-none ${
                    isWhiteYellow
                      ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                      : 'bg-black/60 border-white/10 text-white focus:border-amber-400/50'
                  }`}
                >
                  {STABLE_VEHICLES.map(v => (
                    <option key={v.id} value={v.id}>{v.name} — {v.fullName}</option>
                  ))}
                </select>
                <div className="text-[10px] font-mono-numbers text-zinc-500 space-y-0.5 pt-1">
                  <p>Chassis: <strong className={isWhiteYellow ? 'text-zinc-800' : 'text-zinc-200'}>{selectedVehicle.chassisCode}</strong></p>
                  <p>VIN: <span className="text-amber-400 font-mono-numbers">{selectedVehicle.vin}</span></p>
                </div>
              </div>

            </div>

            {/* Service Category & Title */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 tracking-wider block font-bold">
                Service Category & Protocol
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map(catKey => {
                  const isSelected = category === catKey;
                  return (
                    <button
                      type="button"
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? isWhiteYellow
                            ? 'bg-amber-100 border-amber-500 text-zinc-950 font-bold shadow-xs'
                            : 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : isWhiteYellow
                            ? 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                            : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-sans truncate">{CATEGORY_LABELS[catKey].label}</div>
                      <div className="text-[10px] font-mono-numbers text-zinc-500 truncate mt-0.5">{CATEGORY_LABELS[catKey].desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Title & Scope */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 font-bold block">
                  Service Milestone Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-sans focus:outline-none ${
                    isWhiteYellow
                      ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                      : 'bg-black/60 border-white/10 text-white focus:border-amber-400/50'
                  }`}
                  placeholder="e.g. 40,000-Mile Scheduled Service & Differential Fluid Flush"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 font-bold block">
                  Verified Mileage (Odometer)
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono-numbers focus:outline-none ${
                    isWhiteYellow
                      ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                      : 'bg-black/60 border-white/10 text-white focus:border-amber-400/50'
                  }`}
                  min={selectedVehicle.currentMileage}
                  required
                />
              </div>
            </div>

            {/* Technical Work Log */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono-numbers uppercase text-zinc-400 font-bold block">
                Technical Work Description & Diagnostic Observations
              </label>
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl border text-xs font-sans leading-relaxed focus:outline-none ${
                  isWhiteYellow
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                    : 'bg-black/60 border-white/10 text-white focus:border-amber-400/50'
                }`}
                placeholder="Detail procedures, fluid specifications, torque values, and diagnostic status…"
                required
              />
            </div>

            {/* Installed Components Ledger */}
            <div className={`p-4 rounded-2xl border space-y-3 ${isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-luxury-display uppercase tracking-wider font-bold flex items-center gap-1.5 text-amber-500">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Itemized Components & Hardware Fitted ({components.length})</span>
                </span>
                <span className="text-[10px] font-mono-numbers text-zinc-500">LINEAGE TRACKING</span>
              </div>

              {/* Component Rows */}
              {components.map((comp, idx) => (
                <div key={`${compIdPrefix}-${idx}`} className="flex items-center justify-between gap-3 text-xs font-mono-numbers p-2 rounded-xl bg-black/20 border border-white/[0.04]">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 mr-2">[{comp.category}]</span>
                    <strong className={isWhiteYellow ? 'text-zinc-900' : 'text-zinc-200'}>{comp.componentName}</strong>
                    {comp.torqueSpecNm && (
                      <span className="text-amber-400 text-[10px] ml-2 font-semibold">({comp.torqueSpecNm} Nm)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">£{comp.costGbp.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Component Sub-Form */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-dashed border-zinc-300 dark:border-white/10">
                <select
                  value={newCompCategory}
                  onChange={(e) => setNewCompCategory(e.target.value)}
                  className={`p-2 rounded-lg border text-xs ${
                    isWhiteYellow ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-black/60 border-white/10 text-white'
                  }`}
                >
                  <option value="Dampers & Suspension">Dampers & Suspension</option>
                  <option value="Ignition & Plugs">Ignition & Plugs</option>
                  <option value="Braking System">Braking System</option>
                  <option value="Lubrication & Fluids">Lubrication & Fluids</option>
                  <option value="Powertrain & Intake">Powertrain & Intake</option>
                  <option value="Exhaust & Catalysts">Exhaust & Catalysts</option>
                </select>
                <input
                  type="text"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="Part name (e.g. Ferodo DS2500 Pads)"
                  className={`sm:col-span-2 p-2 rounded-lg border text-xs ${
                    isWhiteYellow ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-black/60 border-white/10 text-white'
                  }`}
                />
                <input
                  type="number"
                  value={newCompCost}
                  onChange={(e) => setNewCompCost(e.target.value)}
                  placeholder="Cost (£)"
                  className={`p-2 rounded-lg border text-xs font-mono-numbers ${
                    isWhiteYellow ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-black/60 border-white/10 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddComponent}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono-numbers flex items-center justify-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Part</span>
                </button>
              </div>
            </div>

            {/* Invoicing & Hash Chain Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-numbers">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase block">VAT Invoice Serial Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono-numbers ${
                    isWhiteYellow ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-black/60 border-white/10 text-white'
                  }`}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase block">Total Workshop Invoice Cost (£ GBP)</label>
                <input
                  type="number"
                  value={totalCostGbp}
                  onChange={(e) => setTotalCostGbp(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono-numbers font-bold text-amber-500 ${
                    isWhiteYellow ? 'bg-white border-zinc-300' : 'bg-black/60 border-white/10'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Cryptographic Linkage Preview */}
            <div className={`p-3.5 rounded-2xl border text-xs font-mono-numbers space-y-1.5 ${
              isWhiteYellow ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>CRYPTOGRAPHIC HASH-CHAIN LINKAGE ACTIVE</span>
              </div>
              <p className="text-[10.5px] opacity-80 leading-relaxed font-sans">
                This stamp links to previous stamp signature: <code className="font-mono-numbers">{vehicleStamps[vehicleStamps.length - 1]?.stampSignatureHash.slice(0, 16) || 'GENESIS (00000000)'}…</code>. Once sealed, modifying any figure renders the digital dossier invalid.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono-numbers font-semibold transition ${
                  isWhiteYellow ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300' : 'bg-white/10 text-zinc-300 hover:bg-white/15'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSigning}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono-numbers bg-amber-400 hover:bg-amber-300 text-zinc-950 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSigning ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Signing with Master Key…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Notarize & Seal to Sovereign Ledger</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* Tab 2: Chain Audit View */}
        {activeTab === 'CHAIN_AUDIT' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
            
            {/* Audit Status Bar */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono-numbers ${
              chainAudit.isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                {chainAudit.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {chainAudit.isValid ? 'PROVENANCE HASH CHAIN: 100% UNBROKEN' : 'PROVENANCE HASH CHAIN: TAMPERING DETECTED'}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {chainAudit.totalVerified} verified digital service stamps in sovereign immutable registry.
                  </p>
                </div>
              </div>

              <span className="text-[10px] px-3 py-1 rounded-full bg-black/40 border border-white/10 uppercase tracking-widest font-bold">
                SHA-256 DAG
              </span>
            </div>

            {/* List of Verified Stamps */}
            <div className="space-y-4">
              <p className={`text-xs font-mono-numbers uppercase tracking-wider ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Verified Ledger Entries ({stamps.length})
              </p>

              {stamps.slice().reverse().map((stamp) => (
                <div
                  key={stamp.stampId}
                  className={`p-4 rounded-2xl border space-y-3 transition-all ${
                    isWhiteYellow
                      ? 'bg-zinc-50 border-zinc-200 shadow-xs'
                      : 'bg-white/[0.02] border-white/[0.08]'
                  }`}
                >
                  {/* Top Stamp Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/50 dark:border-white/[0.06] pb-2 text-xs font-mono-numbers">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold border border-amber-400/30 text-[10px]">
                        {stamp.category}
                      </span>
                      <strong className={isWhiteYellow ? 'text-zinc-950' : 'text-white'}>{stamp.title}</strong>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                      <span>{stamp.serviceDate}</span>
                      <span>•</span>
                      <strong className="text-emerald-400">{stamp.mileage.toLocaleString()} mi</strong>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-xs font-sans leading-relaxed ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {stamp.workDescription}
                  </p>

                  {/* Installed components pill */}
                  {stamp.components.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stamp.components.map((comp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-black/20 border border-white/[0.06] text-zinc-400"
                        >
                          {comp.componentName} (£{comp.costGbp.toFixed(0)})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hash & Signature Footer */}
                  <div className="pt-2 border-t border-zinc-200/50 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono-numbers text-zinc-500">
                    <div className="flex items-center gap-2 truncate max-w-md">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">Sign: <code className="text-amber-400">{stamp.stampSignatureHash}</code></span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span>{stamp.workshop.name}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">£{stamp.totalCostGbp.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action to return to Issuer */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('ISSUER')}
                className="px-5 py-2 rounded-xl text-xs font-bold font-mono-numbers bg-amber-400 hover:bg-amber-300 text-zinc-950 transition"
              >
                + Issue Another Service Stamp
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
