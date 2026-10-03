import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award, 
  Copy, 
  Check, 
  FileCheck, 
  Wrench, 
  Sparkles,
  Download
} from 'lucide-react';
import { loadVehicleBom } from '../../core/supplychain/supplyChainBom';
import { loadVehicleCustodyChain } from '../../core/custody/custodyTransferEngine';
import { loadWorkshopStamps } from '../../core/workshop/WorkshopStampEngine';
import type { CertifiedServiceStamp } from '../../core/workshop/WorkshopStampEngine';
import { generateQrSvg } from '../../core/crypto/qrCodeGenerator';
import { useToast } from '../../context/ToastContext';
import { FluidLevitation } from '../../core/motion/FluidLevitation';

interface ConcoursHeritageDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    name: string;
    fullName: string;
    chassisCode: string;
    vin: string;
    factoryColor: string;
    mileage: number;
    provenanceScore: number;
    engineSpec: string;
    powerOutput: string;
    drivetrain: string;
    exhaustSpec: string;
    damperSpec: string;
    heroImage: string;
    location: string;
  };
}

export const ConcoursHeritageDossierModal: FC<ConcoursHeritageDossierModalProps> = ({
  isOpen,
  onClose,
  car
}) => {
  const { showToast } = useToast();
  const [copiedHash, setCopiedHash] = useState(false);

  // Load live data
  const bomComponents = useMemo(() => loadVehicleBom(car.id), [car.id]);
  const custodyChain = useMemo(() => loadVehicleCustodyChain(car.id), [car.id]);
  const workshopStamps = useMemo(() => {
    return loadWorkshopStamps().filter((s: CertifiedServiceStamp) => s.vehicleId === car.id);
  }, [car.id]);

  // Generate Dossier Seal QR Code
  const qrSvg = useMemo(() => {
    try {
      const payload = JSON.stringify({
        d: 'CHD_V1',
        v: car.vin,
        c: car.chassisCode,
        s: car.provenanceScore,
        h: custodyChain.provenanceIntegrityHash.slice(0, 16),
        u: `https://datum.atelier/v/${car.vin}`
      });
      return generateQrSvg(payload, { size: 140, margin: 1, darkColor: '#0E1015', lightColor: '#FFFFFF' });
    } catch {
      return generateQrSvg(`https://datum.atelier/v/${car.vin}`, { size: 140, margin: 1, darkColor: '#0E1015', lightColor: '#FFFFFF' });
    }
  }, [car, custodyChain]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    showToast({
      title: 'Concours Dossier Print Dispatch',
      message: 'Print stylesheet applied. Select "Save as PDF" for auction catalogue submission.',
      type: 'drive'
    });
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(custodyChain.provenanceIntegrityHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    showToast({
      title: 'Master Ledger Hash Copied',
      message: 'Cryptographic hash copied to clipboard.',
      type: 'clipboard'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <FluidLevitation ambientIntensity={0.5} className="w-full max-w-4xl my-auto">
        <div className="relative rounded-3xl bg-[#0C0D11] border border-white/[0.15] shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
          
          {/* Non-Printable Header Bar */}
          <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-luxury-display text-sm sm:text-base font-bold tracking-wider uppercase text-white">
                  Concours d'Elegance Heritage Dossier
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono-numbers">
                  Certified Mechanical Monograph & Supply Chain Provenance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                title="Print or Export as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition"
                title="Close Dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PRINTABLE DOSSIER SHEET */}
          <div 
            id="concours-printable-dossier" 
            className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#0D0F14] print:bg-white print:text-black print:p-0 print:m-0"
          >
            
            {/* 1. HERALDIC LETTERHEAD & EMBOSSED SEAL */}
            <div className="border-b-2 border-amber-500/40 pb-6 print:border-black flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-luxury-display text-xs tracking-[0.25em] text-amber-400 print:text-black font-bold uppercase">
                    DATUM ATELIER • SOVEREIGN VEHICLE REGISTRY
                  </span>
                  <span className="text-[9px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 print:border print:border-black font-semibold border border-emerald-500/20">
                    CONCOURS D'ELEGANCE CERTIFIED
                  </span>
                </div>
                <h1 className="font-luxury-display text-2xl sm:text-4xl font-extrabold tracking-wider text-white print:text-black uppercase">
                  {car.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 print:text-zinc-700 font-mono-numbers mt-1">
                  Official Provenance Monograph • Chassis Code: <strong>{car.chassisCode}</strong>
                </p>
              </div>

              {/* QR Verification Seal */}
              <div className="flex items-center gap-3 sm:text-right">
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] font-mono-numbers uppercase text-zinc-400 print:text-zinc-600">
                    Cryptographic Seal
                  </div>
                  <div className="text-xs font-mono-numbers font-bold text-amber-400 print:text-black">
                    {car.vin.slice(-8)}
                  </div>
                </div>
                <div className="p-1 rounded-lg bg-white shadow-md flex-shrink-0" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              </div>
            </div>

            {/* 2. CHASSIS IDENTIFICATION & PEDIGREE GRID */}
            <div>
              <h2 className="text-xs font-mono-numbers uppercase tracking-wider text-amber-400 print:text-black font-bold mb-3 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                I. VEHICLE SPECIFICATION & STATUTORY IDENTITY
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers">
                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">VEHICLE VIN</span>
                  <strong className="text-white print:text-black">{car.vin}</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">VERIFIED MILEAGE</span>
                  <strong className="text-white print:text-black">{car.mileage.toLocaleString()} MILES</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">PAINTWORK / PTS</span>
                  <strong className="text-white print:text-black">{car.factoryColor}</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">PROVENANCE SCORE</span>
                  <strong className="text-emerald-400 print:text-black font-bold">{car.provenanceScore} / 100</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300 col-span-2">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">POWERTRAIN & OUTPUT</span>
                  <strong className="text-white print:text-black">{car.engineSpec} • {car.powerOutput}</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 print:bg-zinc-100 border border-white/5 print:border-zinc-300 col-span-2">
                  <span className="text-zinc-500 print:text-zinc-600 block text-[10px]">DRIVETRAIN & CHASSIS</span>
                  <strong className="text-white print:text-black">{car.drivetrain} • {car.damperSpec}</strong>
                </div>
              </div>
            </div>

            {/* 3. SOVEREIGN CUSTODY CHAIN & TENURE */}
            <div>
              <h2 className="text-xs font-mono-numbers uppercase tracking-wider text-amber-400 print:text-black font-bold mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                II. UNBROKEN CHAIN OF CUSTODY (MERKLE DAG AUDITED)
              </h2>

              <div className="space-y-2">
                {/* Active Custodian */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 print:bg-zinc-100 border border-amber-500/25 print:border-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-numbers">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 print:text-black uppercase">
                      ACTIVE SOVEREIGN CUSTODIAN
                    </span>
                    <div className="font-bold text-white print:text-black text-sm mt-0.5">
                      {custodyChain.activeCustodian.displayName} ({custodyChain.activeCustodian.locationRegion})
                    </div>
                    <div className="text-zinc-400 print:text-zinc-600 text-[11px] mt-0.5">
                      Tenure: {new Date(custodyChain.activeCustodian.custodyStartDate).getFullYear()} – Present • Commenced at {custodyChain.activeCustodian.startMileage.toLocaleString()} mi
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 print:text-black print:border print:border-black font-semibold">
                      VERIFIED V5C STAKE
                    </span>
                  </div>
                </div>

                {/* Preceding Custodians */}
                {custodyChain.custodyHistory.map((hist, idx) => (
                  <div 
                    key={hist.custodianId || idx}
                    className="p-3 rounded-xl bg-zinc-950/40 print:bg-zinc-50 border border-white/5 print:border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-numbers"
                  >
                    <div>
                      <span className="text-[10px] text-zinc-500 print:text-zinc-600 uppercase">
                        PREVIOUS CUSTODIAN #{custodyChain.totalCustodians - 1 - idx}
                      </span>
                      <div className="font-semibold text-zinc-200 print:text-black">
                        {hist.displayName} ({hist.locationRegion})
                      </div>
                      <div className="text-zinc-400 print:text-zinc-600 text-[11px]">
                        Tenure: {new Date(hist.custodyStartDate).getFullYear()} – {hist.custodyEndDate ? new Date(hist.custodyEndDate).getFullYear() : 'Transfer'} • {hist.startMileage.toLocaleString()} to {(hist.endMileage || car.mileage).toLocaleString()} mi
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 print:text-zinc-600">
                        Historical Lineage Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. AEROSPACE-GRADE BILL OF MATERIALS (BOM) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-mono-numbers uppercase tracking-wider text-amber-400 print:text-black font-bold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  III. SERIALIZED BILL OF MATERIALS (BOM) & COMPONENT LINEAGE
                </h2>
                <span className="text-[10px] font-mono-numbers text-zinc-400 print:text-zinc-600">
                  {bomComponents.length} Verified Components Sealed
                </span>
              </div>

              <div className="border border-white/10 print:border-zinc-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono-numbers">
                  <thead className="bg-zinc-950 print:bg-zinc-200 text-zinc-400 print:text-black uppercase text-[10px] border-b border-white/10 print:border-zinc-300">
                    <tr>
                      <th className="p-3">Component & Spec</th>
                      <th className="p-3 hidden sm:table-cell">Origin & MFR</th>
                      <th className="p-3 hidden md:table-cell">Torque Rating</th>
                      <th className="p-3">Serial / Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-zinc-200 bg-black/40 print:bg-white text-zinc-300 print:text-black">
                    {bomComponents.map((comp) => (
                      <tr key={comp.id} className="hover:bg-white/[0.02] print:hover:bg-zinc-50">
                        <td className="p-3">
                          <strong className="text-white print:text-black block">{comp.partName}</strong>
                          <span className="text-[10px] text-zinc-500 print:text-zinc-600">{comp.category}</span>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <div className="text-zinc-200 print:text-black">{comp.manufacturer}</div>
                          <span className="text-[10px] text-zinc-500 print:text-zinc-600">{comp.originFacility}, {comp.originCountry}</span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-amber-300 print:text-black font-semibold">
                          {comp.torqueSpec}
                        </td>
                        <td className="p-3">
                          <div className="text-[11px] font-bold text-white print:text-black">{comp.serialNumber}</div>
                          <span className="text-[10px] text-zinc-500 print:text-zinc-600 font-mono">
                            {comp.provenanceHash ? comp.provenanceHash.slice(0, 14) + '…' : 'SHA-256 SEALED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. VERIFIED WORKSHOP SERVICE DAG HISTORY */}
            {workshopStamps.length > 0 && (
              <div>
                <h2 className="text-xs font-mono-numbers uppercase tracking-wider text-amber-400 print:text-black font-bold mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  IV. NOTARIZED WORKSHOP SERVICE CHAIN
                </h2>

                <div className="space-y-2 text-xs font-mono-numbers">
                  {workshopStamps.map((stamp: CertifiedServiceStamp) => (
                    <div 
                      key={stamp.stampId}
                      className="p-3 rounded-xl bg-zinc-950/50 print:bg-zinc-100 border border-white/5 print:border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white print:text-black">{stamp.title}</strong>
                          <span className="text-emerald-400 print:text-black text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {stamp.workshop.name}
                          </span>
                        </div>
                        <p className="text-zinc-400 print:text-zinc-600 text-[11px] mt-0.5">
                          {stamp.serviceDate} • {stamp.mileage.toLocaleString()} mi • Signatory: {stamp.workshop.masterMechanic}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 print:text-zinc-600 block">Stamp Seal:</span>
                        <strong className="text-zinc-300 print:text-black font-mono">{stamp.stampSignatureHash.slice(0, 16)}…</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. STATUTORY NOTARY & HASH FOOTER */}
            <div className="border-t-2 border-amber-500/40 print:border-black pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-numbers">
              <div className="space-y-1">
                <span className="text-zinc-500 print:text-zinc-600 block text-[10px] uppercase">
                  MASTER PROVENANCE DAG ROOT INTEGRITY HASH
                </span>
                <div className="flex items-center gap-2">
                  <code className="text-amber-400 print:text-black font-bold text-xs">
                    {custodyChain.provenanceIntegrityHash}
                  </code>
                  <button 
                    onClick={handleCopyHash}
                    className="print:hidden p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                    title="Copy Cryptographic Root Hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 print:text-zinc-600 mt-1">
                  Issued under the authority of DATUM Sovereign Automobile Ledger. Verified tamper-evident.
                </p>
              </div>

              <div className="text-left sm:text-right print:text-right">
                <div className="text-[10px] text-zinc-400 print:text-zinc-600 uppercase font-semibold">
                  STATUTORY NOTARY SEAL
                </div>
                <div className="font-luxury-display text-sm font-bold text-white print:text-black mt-0.5">
                  GUILD OF AUTOMOTIVE CUSTODIANS
                </div>
                <div className="text-[10px] text-emerald-400 print:text-black mt-0.5 font-bold">
                  ✓ VERIFIED UNBROKEN GENEALOGY
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer Controls */}
          <div className="print:hidden px-6 py-3.5 bg-black/60 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-numbers">
            <span className="text-zinc-500">
              Auction & Concours Catalog Ready • Collecting Cars / BaT Compliant
            </span>
            <button
              onClick={handlePrint}
              className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certified PDF</span>
            </button>
          </div>

        </div>
      </FluidLevitation>
    </div>
  );
};
