import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Download, 
  Lock,
  QrCode,
  Calendar,
  Award
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface VehiclePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName?: string;
}

export const VehiclePassportModal: FC<VehiclePassportModalProps> = ({ 
  isOpen, 
  onClose,
  vehicleName = 'MAYA (BMW M3 Competition)'
}) => {
  const [activeSection, setActiveSection] = useState<'v5c' | 'mot' | 'hardware' | 'integrity' | 'handoff'>('v5c');
  const [isPlateRevealed, setIsPlateRevealed] = useState<boolean>(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Generate a downloadable JSON provenance file
    const dossierData = {
      registryTitle: 'SOVEREIGN AUTOMOBILE PASSPORT & ENCLAVE DOSSIER',
      protocolVersion: 'Garage Atelier v2.4',
      vehicleName,
      chassisSerial: 'G80-M3-COMP-2023-UK',
      enclaveHash: '0x7E3F8120B4C92A145DF6899E0154B2A7D8F91230',
      timestamp: new Date().toISOString(),
      statutoryInspection: 'DVSA Road Legal • 0 Defects • 0 Advisories',
      provenanceIndex: 'Grade A+ (98/100)',
      privacyPerimeter: '800m Residential Geofenced',
      hardwareLedger: [
        { item: 'KW V4 Coilovers', fitter: 'Evolve Automotive', costGbp: 4200 },
        { item: 'Akrapovič Evolution Line Titanium', fitter: 'Litchfield Motors', costGbp: 6450 },
        { item: 'Eventuri Matte Carbon Intake', fitter: 'Evolve Automotive', costGbp: 1850 }
      ]
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vehicleName.replace(/[^a-zA-Z0-9]/g, '_')}_Sovereign_Passport.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      title: 'Provenance Dossier Exported',
      message: 'Cryptographically signed JSON dossier and verification hash downloaded.',
      type: 'privacy'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* LEATHER-BOUND SOVEREIGN VEHICLE PASSPORT DOSSIER          */}
      {/* ========================================================= */}
      <div className="relative max-w-4xl w-full rounded-3xl bg-[#0D0E12] border border-amber-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Gilded Passport Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-amber-500/20 bg-gradient-to-r from-[#14151C] via-[#0E0F14] to-[#14151C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/60 border border-amber-500/40 flex items-center justify-center shadow-inner">
              <span className="font-luxury-display text-amber-300 font-bold text-sm">G</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-luxury-display text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-200 uppercase">
                  SOVEREIGN VEHICLE PASSPORT
                </span>
                <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  DVSA AUTHENTICATED
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono-numbers tracking-wider uppercase mt-0.5">
                British & European Sovereign Automobile Registry • Official Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white text-xs font-mono-numbers transition border border-white/[0.1]"
              title="Print Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono-numbers transition border border-amber-500/40"
              title="Download Sealed Dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Passport Navigation Ribbon */}
        <div className="px-6 sm:px-8 py-2.5 bg-black/40 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono-numbers">
          {[
            { id: 'v5c', label: '1. V5C REGISTRATION & IDENTITY' },
            { id: 'mot', label: '2. DVSA STATUTORY INSPECTIONS' },
            { id: 'hardware', label: '3. VERIFIED HARDWARE LEDGER' },
            { id: 'integrity', label: '4. PROVENANCE & ENCLAVE INTEGRITY' },
            { id: 'handoff', label: '5. CONCIERGE HANDOFF & CERTIFICATE' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold ${
                activeSection === sec.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Passport Interior Pages */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#0A0B0E]">
          
          {/* SECTION 1: V5C REGISTRATION & IDENTITY */}
          {activeSection === 'v5c' && (
            <div className="space-y-6">
              
              <div className="rounded-2xl p-6 sm:p-7 bg-[#121319] border border-amber-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-72 h-72 opacity-5 pointer-events-none rounded-full border-[12px] border-amber-400" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono-numbers text-amber-400 font-bold uppercase tracking-[0.2em] block">
                      UNITED KINGDOM DRIVER AND VEHICLE STANDARDS AGENCY
                    </span>
                    <h3 className="font-luxury-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mt-1">
                      Certificate of Sovereign Vehicle Registration
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono-numbers text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      OFFICIALLY VALIDATED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-xs font-mono-numbers">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Vehicle Call-Sign</span>
                    <span className="font-luxury-display text-lg font-bold text-white block mt-0.5">{vehicleName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Vehicle Registration (VRM)</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono-numbers font-bold text-amber-400 text-base">
                        {isPlateRevealed ? 'LJ23 WXY' : 'LJ23 ••• [CLOAKED]'}
                      </span>
                      <button
                        onClick={() => setIsPlateRevealed(!isPlateRevealed)}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-white transition"
                      >
                        {isPlateRevealed ? 'Cloak' : 'Reveal'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">VIN / Chassis Identifier</span>
                    <span className="font-mono-numbers text-white block mt-0.5">WBA-33AY-040F-MAYA</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Engine Number / Code</span>
                    <span className="font-mono-numbers text-white block mt-0.5">S58-B30A • 3.0L TWIN-TURBO</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">Factory Color & Trim</span>
                    <span className="font-mono-numbers text-emerald-400 block mt-0.5">Isle of Man Green (C4G)</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">First Registration Date</span>
                    <span className="font-mono-numbers text-white block mt-0.5">15 March 2023 • UK Spec</span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-black/60 border border-white/[0.06] text-xs text-zinc-400 font-mono-numbers flex items-center justify-between">
                  <span>Cryptographic Enclave Hash: <strong className="text-zinc-300">0x7E3F...9A1B</strong></span>
                  <span className="text-emerald-400 font-bold">100% TITLE CLEAN</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MOT INSPECTIONS */}
          {activeSection === 'mot' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-[#121319] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono-numbers text-emerald-400 font-bold uppercase tracking-wider">
                      OFFICIAL UK MOT RECORD • DVSA TEST ENCLAVE
                    </span>
                    <h4 className="font-luxury-display text-lg font-bold text-white uppercase mt-0.5">
                      Statutory Roadworthiness Inspection History
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono-numbers font-bold border border-emerald-500/20">
                    PASS • 0 DEFECTS
                  </span>
                </div>

                <div className="space-y-3 font-mono-numbers text-xs">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-sm">Pass (Zero Advisories)</span>
                      <span className="text-zinc-400">14 March 2026 • 38,190 mi</span>
                    </div>
                    <p className="text-zinc-400 font-sans text-xs">
                      All computerized checks passed: Brake efficiency 78% front / 68% rear. Steering ball-joints nominal. Suspension dampening rate symmetrical within 2%. Hydrocarbon & CO emissions below Euro 6d thresholds.
                    </p>
                    <div className="text-[10px] text-zinc-500 pt-1 border-t border-white/[0.05] flex justify-between">
                      <span>Test Centre: #9201DVSA</span>
                      <span>Certificate: #9401-2041-8812</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: HARDWARE LEDGER */}
          {activeSection === 'hardware' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-[#121319] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono-numbers text-amber-400 font-bold uppercase tracking-wider">
                      PROVENANCE & HARDWARE LEDGER
                    </span>
                    <h4 className="font-luxury-display text-lg font-bold text-white uppercase mt-0.5">
                      Certified Modifications & Authenticated Receipts
                    </h4>
                  </div>
                  <span className="text-xs font-mono-numbers text-zinc-400">Total Investment: £12,500.00</span>
                </div>

                <div className="space-y-2.5 font-mono-numbers text-xs">
                  {[
                    { component: 'KW V4 3-Way Adjustable Coilovers', installer: 'Evolve Automotive (Guildford)', date: 'August 2026', cost: '£4,200.00', status: 'VERIFIED' },
                    { component: 'Akrapovič Evolution Line Titanium System', installer: 'Litchfield Motors (Tewkesbury)', date: 'July 2026', cost: '£6,450.00', status: 'VERIFIED' },
                    { component: 'Eventuri Matte Carbon Dual Air Intake', installer: 'Evolve Automotive', date: 'May 2025', cost: '£1,850.00', status: 'VERIFIED' },
                  ].map((part, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-bold">{part.component}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          Certified Signatory: <span className="text-emerald-400">{part.installer}</span> • {part.date}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-amber-400 font-bold text-xs">{part.cost}</span>
                        <span className="text-[10px] text-zinc-500 block">Verified Invoice</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PROVENANCE & PRIVACY INTEGRITY */}
          {activeSection === 'integrity' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-[#121319] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono-numbers text-emerald-400 font-bold uppercase tracking-wider">
                      GRADE A+ PROVENANCE AUDIT
                    </span>
                    <h4 className="font-luxury-display text-lg font-bold text-white uppercase mt-0.5">
                      Sovereignty, Geofencing & Authenticity Score
                    </h4>
                  </div>
                  <span className="text-lg font-bold text-amber-400 font-mono-numbers">98 / 100</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-numbers">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                    <span className="text-zinc-400 uppercase text-[10px]">Residential Perimeter Audit</span>
                    <div className="text-sm font-bold text-emerald-400">800m Geofence Maintained</div>
                    <p className="text-zinc-400 font-sans text-xs">
                      Zero residential driveway GPS coordinates leaked across 184 documented expeditions. Departure coordinates clipped strictly outside residential perimeter.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                    <span className="text-zinc-400 uppercase text-[10px]">Diagnostics & Fault Audit</span>
                    <div className="text-sm font-bold text-emerald-400">0 Active Diagnostic Trouble Codes</div>
                    <p className="text-zinc-400 font-sans text-xs">
                      OBD-II CANBUS diagnostic interrogation nominal. Knock sensor counter, lambda sensor AFR, and boost pressure curves match factory calibration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: CONCIERGE HANDOFF & TRANSFER CERTIFICATE */}
          {activeSection === 'handoff' && (
            <div className="space-y-6">
              
              {/* Official Transfer Certificate Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#14151D] to-[#0A0B0E] border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
                
                {/* Gilded seal watermark */}
                <div className="absolute right-6 top-6 w-32 h-32 rounded-full border-4 border-amber-500/10 flex items-center justify-center pointer-events-none rotate-12">
                  <span className="font-luxury-display text-[10px] text-amber-500/20 font-bold uppercase tracking-widest text-center">
                    SEALED ATELIER DOSSIER
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-mono-numbers text-amber-300 font-bold uppercase tracking-widest">
                        MAYFAIR & GOODWOOD PRIVATE TRANSFER ACCREDITATION
                      </span>
                    </div>
                    <h3 className="font-luxury-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-1">
                      Certificate of Ownership Transfer & Provenance
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono-numbers text-xs font-bold border border-amber-500/30">
                      IMMUTABLE RECORD
                    </span>
                  </div>
                </div>

                {/* Transfer Ledger Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-numbers">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase">Registered Chassis Call-Sign</span>
                    <span className="text-base font-bold text-white block">{vehicleName}</span>
                    <span className="text-[10px] text-zinc-400">First Registered: 15 Mar 2023</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase">Current Mileage Ledger</span>
                    <span className="text-base font-bold text-white block">41,200 mi</span>
                    <span className="text-[10px] text-emerald-400">DVSA MOT Authenticated</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase">Agreed Insurance Valuation</span>
                    <span className="text-base font-bold text-amber-400 block">£78,500.00</span>
                    <span className="text-[10px] text-zinc-400">Hiscox Private Client Benchmark</span>
                  </div>
                </div>

                {/* Active Concierge Appointments & Maintenance Handoff */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-numbers">
                    <span className="font-bold text-white uppercase flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Active Concierge Appointments & Service Schedule</span>
                    </span>
                    <span className="text-emerald-400 font-bold">1 CONFIRMED</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono-numbers">
                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-white block">Hunter HawkEye 3D Geometry Calibration</span>
                        <span className="text-[10px] text-zinc-400">Apex Tyres & Laser Geometry (Guildford) • Target: 15 Oct 2026</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        SLOT RESERVED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Public Seal & QR Code */}
                <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-numbers">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-white font-bold block">Cryptographic Verification Seal</span>
                      <span className="text-[10px] text-zinc-500 break-all">
                        PUBLIC KEY: 0x7E3F8120B4C92A145DF6899E0154B2A7D8F91230
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-mono-numbers uppercase tracking-wider transition shadow-lg shrink-0 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed Dossier</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Passport Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-black/60 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-numbers">
          <div className="flex items-center gap-2 text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic Integrity Protected • Validated under Garage Protocol v2.4</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition shadow-sm w-full sm:w-auto"
          >
            Close Passport
          </button>
        </div>

      </div>

    </div>
  );
};
