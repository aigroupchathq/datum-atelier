import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  ShieldCheck, 
  Globe2, 
  Download, 
  CheckCircle2, 
  PoundSterling, 
  FileCheck, 
  Lock,
  Mountain
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TransitCarnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  carModel?: string;
  vin?: string;
}

interface AlpinePass {
  id: string;
  name: string;
  country: string;
  altitudeMeters: number;
  status: 'OPEN' | 'ADVISORY' | 'RESTRICTED';
  surface: string;
  snowChainsRequired: boolean;
  gradientMax: string;
  barometricCompensationPct: string;
  lastUpdated: string;
}

const ALPINE_PASSES: AlpinePass[] = [
  {
    id: 'stelvio',
    name: 'Stelvio Pass (Passo dello Stelvio)',
    country: 'Italy / South Tyrol',
    altitudeMeters: 2757,
    status: 'OPEN',
    surface: 'Dry Bitumen (Hairpin 48/48 cleared)',
    snowChainsRequired: false,
    gradientMax: '12.0%',
    barometricCompensationPct: '-14% N/A (Twin-Turbo Wastegate Active)',
    lastUpdated: '06:30 CET'
  },
  {
    id: 'furka',
    name: 'Furka Pass (Goldfinger Route)',
    country: 'Switzerland (Valais / Uri)',
    altitudeMeters: 2429,
    status: 'OPEN',
    surface: 'Damp Alpine Run-off (5°C)',
    snowChainsRequired: false,
    gradientMax: '11.8%',
    barometricCompensationPct: '-12% Ambient Density',
    lastUpdated: '07:15 CET'
  },
  {
    id: 'grossglockner',
    name: 'Großglockner High Alpine Road',
    country: 'Austria (Salzburg / Carinthia)',
    altitudeMeters: 2504,
    status: 'OPEN',
    surface: 'High-Grip Micro-Asphalt',
    snowChainsRequired: false,
    gradientMax: '12.0%',
    barometricCompensationPct: '-13% Barometric Drop',
    lastUpdated: '06:00 CET'
  },
  {
    id: 'turini',
    name: 'Col de Turini (Monte Carlo Rally Stage)',
    country: 'France (Maritime Alps)',
    altitudeMeters: 1607,
    status: 'OPEN',
    surface: 'Dry Pine-Needle Bitumen (14°C)',
    snowChainsRequired: false,
    gradientMax: '10.5%',
    barometricCompensationPct: '-7% Ambient Density',
    lastUpdated: '07:45 CET'
  }
];

export const TransitCarnetModal: FC<TransitCarnetModalProps> = ({
  isOpen,
  onClose,
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)',
  vin = 'WBA-33AY-080P-M3COMP'
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'carnet' | 'alpine' | 'checklist' | 'valuation'>('carnet');
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'EUR' | 'CHF'>('GBP');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Logistics checklist item state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    eurotunnel: true,
    ferryLash: true,
    critAir: true,
    swissVignette: true,
    austrianVignette: true,
    headlampBeamDeflector: true,
    warningTriangleVest: true,
    v5cOriginalPresent: true,
  });

  if (!isOpen) return null;

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast({
        title: updated[key] ? 'Transit Item Certified' : 'Transit Item Pending',
        message: `Updated status on international road travel manifesto.`,
        type: 'garage',
        badge: 'CARNET'
      });
      return updated;
    });
  };

  const getAgreedValuation = () => {
    const baseGbp = 89500;
    if (selectedCurrency === 'EUR') return { symbol: '€', amount: (baseGbp * 1.18).toLocaleString('en-GB', { maximumFractionDigits: 0 }) };
    if (selectedCurrency === 'CHF') return { symbol: 'CHF', amount: (baseGbp * 1.14).toLocaleString('en-GB', { maximumFractionDigits: 0 }) };
    return { symbol: '£', amount: baseGbp.toLocaleString('en-GB') };
  };

  const valuation = getAgreedValuation();

  const handleExportCarnet = () => {
    setIsExporting(true);
    setTimeout(() => {
      const carnetRecord = {
        document: 'INTERNATIONAL_ATA_CARNET_PASSPORT',
        carnetNumber: 'GB/LON/2026/8841-K',
        issuingChamber: 'London Chamber of Commerce & Industry (LCCI)',
        vehicle: {
          identifier: carName,
          model: carModel,
          vin: vin,
          chassisHash: '0x7F4B...99A1',
          agreedValuationGbp: 89500,
          currencyEquivalents: {
            EUR: 105610,
            CHF: 102030
          }
        },
        transitManifest: {
          departurePort: 'Eurotunnel Folkestone Shuttle Terminal',
          entryPort: 'Calais Coquelles / Swiss Basel Border',
          purposeOfTransit: 'Alpine Touring Expedition & Nürburgring Industry-Pool Track Testing',
          customsBondStatus: 'BONDED_EXEMPTION_ACTIVE',
          validUntil: '31 DECEMBER 2026'
        },
        complianceLedger: checklist,
        alpinePassReadiness: ALPINE_PASSES.map(p => ({ pass: p.name, altitude: `${p.altitudeMeters}m`, status: p.status }))
      };

      const blob = new Blob([JSON.stringify(carnetRecord, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATA_CARNET_${carName.replace(/\s+/g, '_')}_2026.json`;
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast({
        title: 'ATA Carnet Passport Downloaded',
        message: 'Official International Customs Passage Dossier cryptographically signed.',
        type: 'success',
        badge: 'CARNET'
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B0C10] border border-amber-500/25 rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
        
        {/* Top Header with Stamped Gold Leaf Aesthetic */}
        <div className="flex justify-between items-start border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Globe2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-luxury-display text-xl sm:text-2xl font-black text-white tracking-[0.15em] uppercase">
                  Cross-Border Transit & Carnet
                </h2>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  ATA CARNET #GB-8841-K
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Official International Customs Passage • UK & European Alpine Corridors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono-numbers overflow-x-auto no-scrollbar">
          {[
            { id: 'carnet', label: 'I. CUSTOMS CARNET', icon: FileCheck },
            { id: 'alpine', label: 'II. ALPINE PASS RADAR', icon: Mountain },
            { id: 'checklist', label: 'III. TRANSIT MANIFEST', icon: CheckCircle2 },
            { id: 'valuation', label: 'IV. AGREED VALUE NOTARY', icon: PoundSterling }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-300 border border-amber-500/30 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OFFICIAL ATA CARNET CUSTOMS PASSPORT               */}
        {/* ========================================================= */}
        {activeTab === 'carnet' && (
          <div className="space-y-5">
            {/* Holographic Bonded Pass Card */}
            <div className="chassis-plate rounded-2xl p-6 relative overflow-hidden border border-amber-500/30">
              {/* Corner screw rivets */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono-numbers tracking-[0.2em] text-zinc-400 uppercase font-bold block">
                    LONDON CHAMBER OF COMMERCE & INDUSTRY
                  </span>
                  <h3 className="font-luxury-display text-lg font-bold text-white mt-0.5">
                    FEDERATION INTERNATIONALE DE L’AUTOMOBILE • CARNET DE PASSAGES
                  </h3>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono-numbers text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  BONDED EXEMPTION
                </span>
              </div>

              {/* Passport particulars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono-numbers">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Registered Vehicle</span>
                  <span className="text-white font-bold block mt-0.5">{carName}</span>
                  <span className="text-[11px] text-zinc-400 truncate">{carModel}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Chassis Identification</span>
                  <span className="text-amber-400 font-bold block mt-0.5">{vin}</span>
                  <span className="text-[11px] text-zinc-400">UK V5C Authenticated</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Agreed Bond Value</span>
                  <span className="text-white font-bold block mt-0.5">£89,500 GBP</span>
                  <span className="text-[11px] text-emerald-400">Underwritten by Chubb</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Customs Expiry</span>
                  <span className="text-white font-bold block mt-0.5">31 DEC 2026</span>
                  <span className="text-[11px] text-zinc-400">365-Day Validity</span>
                </div>
              </div>

              {/* Border Post Stamps Strip */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono-numbers text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-zinc-300">
                    🇬🇧 DOVER OUT: <strong className="text-emerald-400">CLEARED</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-zinc-300">
                    🇫🇷 CALAIS IN: <strong className="text-emerald-400">CLEARED</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-zinc-300">
                    🇨🇭 BASEL ZOLL: <strong className="text-amber-400">ACTIVE</strong>
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-zinc-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Immutable Carnet Hash: 0x8F92...B31A</span>
                </div>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] text-xs text-zinc-300 font-sans leading-relaxed">
              <p>
                <strong className="text-amber-300">Sovereign Customs Protocol:</strong> The ATA Carnet serves as an international passport for your vehicle, enabling temporary tax-free importation across France, Switzerland, Italy, Germany, and Austria without requiring duplicate VAT bonds or import duty declarations at alpine frontiers.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ALPINE PASS CONDITIONS RADAR                       */}
        {/* ========================================================= */}
        {activeTab === 'alpine' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono-numbers px-1">
              <span className="text-zinc-400">HIGH-ALTITUDE ALPINE MOUNTAIN CORRIDORS</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Alpine Telemetry Sync
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ALPINE_PASSES.map((pass) => (
                <div 
                  key={pass.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-3 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">{pass.name}</h4>
                      </div>
                      <p className="text-[11px] font-mono-numbers text-zinc-400 mt-0.5">{pass.country}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono-numbers font-bold">
                      {pass.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers pt-1">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-500 block">Summit Altitude</span>
                      <strong className="text-zinc-100">{pass.altitudeMeters.toLocaleString()} m</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-500 block">Max Gradient</span>
                      <strong className="text-amber-400">{pass.gradientMax}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono-numbers">
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">Surface:</span>
                      <span className="text-zinc-200">{pass.surface}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">Aspiration Comp:</span>
                      <span className="text-emerald-400">{pass.barometricCompensationPct}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-[10px] font-mono-numbers text-zinc-500">
                    <span>Snow Chains: {pass.snowChainsRequired ? 'Mandatory' : 'Exempt'}</span>
                    <span>Updated {pass.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TRANSIT MANIFEST & STATUTORY COMPLIANCE             */}
        {/* ========================================================= */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="text-xs font-mono-numbers text-zinc-400">
              CROSS-BORDER LOGISTICS & LOW-GROUND-CLEARANCE RIGGING
            </div>

            <div className="space-y-2.5">
              {[
                { 
                  id: 'eurotunnel', 
                  title: 'Eurotunnel Le Shuttle Single-Deck Allocation', 
                  desc: 'Allocated wide-carriage carriage slot for supercars with ground clearance under 110mm.', 
                  required: true 
                },
                { 
                  id: 'ferryLash', 
                  title: 'Ferry Approach Ramps & Chassis Lash Certification', 
                  desc: 'Wooden approach planks reserved to prevent front splitter scuff on Dover-Calais slipways.', 
                  required: true 
                },
                { 
                  id: 'critAir', 
                  title: 'French Crit’Air 1 Vignette', 
                  desc: 'Statutory violet low-emission badge affixed for Paris & Lyon motorway bypass zones.', 
                  required: true 
                },
                { 
                  id: 'swissVignette', 
                  title: 'Swiss National Motorway E-Vignette (40 CHF)', 
                  desc: 'Digital registration linked to verified chassis index for unrestricted transit across Swiss Autobahns.', 
                  required: true 
                },
                { 
                  id: 'austrianVignette', 
                  title: 'Austrian Asfinag 10-Day Digital Toll', 
                  desc: 'Pre-registered digital vignette for Grossglockner & Brenner Autobahn passage.', 
                  required: false 
                },
                { 
                  id: 'headlampBeamDeflector', 
                  title: 'Asymmetric Headlamp Beam Redirection', 
                  desc: 'LED matrix dipped beam calibrated for continental right-hand traffic to avoid blinding drivers.', 
                  required: true 
                },
                { 
                  id: 'v5cOriginalPresent', 
                  title: 'Physical DVSA V5C Registration Document', 
                  desc: 'Original paper V5C logbook onboard (mandatory for French Gendarmerie roadside inspection).', 
                  required: true 
                }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    checklist[item.id]
                      ? 'bg-zinc-950/80 border-emerald-500/30'
                      : 'bg-zinc-950/30 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-mono-numbers">{item.title}</h4>
                      {item.required && (
                        <span className="text-[9px] font-mono-numbers px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                          STATUTORY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-sans">{item.desc}</p>
                  </div>

                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    checklist[item.id]
                      ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                      : 'border-white/20 bg-black/40'
                  }`}>
                    {checklist[item.id] && <CheckCircle2 className="w-4 h-4 fill-current text-black" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AGREED VALUATION NOTARY                             */}
        {/* ========================================================= */}
        {activeTab === 'valuation' && (
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-widest block">
                    CHUBB PRIVATE COLLECTOR POLICY NOTARIZATION
                  </span>
                  <h3 className="font-luxury-display text-lg font-bold text-white mt-0.5">
                    Multi-Currency Agreed Value Hedging
                  </h3>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-black border border-white/10 text-xs font-mono-numbers">
                  {(['GBP', 'EUR', 'CHF'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setSelectedCurrency(curr)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedCurrency === curr
                          ? 'bg-amber-400 text-black font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-black/60 border border-white/[0.08] text-center space-y-1">
                <span className="text-xs font-mono-numbers text-zinc-400">Total Agreed Insurance Valuation</span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono-numbers tracking-tight">
                  <span className="text-amber-400 mr-2">{valuation.symbol}</span>
                  {valuation.amount}
                </div>
                <p className="text-[11px] text-emerald-400 font-mono-numbers pt-1">
                  ✓ Protected against currency volatility during Continental European transit
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-numbers">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-500 block uppercase">Nürburgring Liability</span>
                  <strong className="text-white mt-0.5 block">Touristenfahrten Covered</strong>
                  <span className="text-[10px] text-zinc-400">Includes Armco barrier indemnity</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-500 block uppercase">Repatriation Bond</span>
                  <strong className="text-white mt-0.5 block">Enclosed Transporter</strong>
                  <span className="text-[10px] text-zinc-400">Direct transit to UK workshop</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-[10px] text-zinc-500 block uppercase">Cryptographic Seal</span>
                  <strong className="text-emerald-400 mt-0.5 block">SHA-256 Validated</strong>
                  <span className="text-[10px] text-zinc-400">Signatory: Chubb Atelier GB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted under Geneva Convention of 1961</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleExportCarnet}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating Customs Pass...' : 'Download Official Carnet (JSON)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
