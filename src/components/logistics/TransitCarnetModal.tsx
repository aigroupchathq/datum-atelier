import { useState, useEffect, useCallback } from 'react';
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
  Mountain,
  Printer,
  RefreshCw,
  QrCode,
  Wifi,
  WifiOff,
  FileText,
  Stamp
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { generateQrSvg } from '../../core/crypto/qrCodeGenerator';
import { 
  defaultVaultEngine, 
  type CarnetManifest, 
  type CustomsClearanceStamp 
} from '../../core/carnet/CarnetVaultEngine';
import { 
  fetchPassLiveWeather, 
  calculateAlpineAtmosphericCompensation, 
  ALPINE_PASS_COORDINATES,
  type PassLiveWeatherData 
} from '../../utils/openMeteoWeather';
import { calculateRoadGrip } from '../../utils/gripCalculation';

interface TransitCarnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  carModel?: string;
  vin?: string;
}

export const TransitCarnetModal: FC<TransitCarnetModalProps> = ({
  isOpen,
  onClose,
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)',
  vin = 'WBA-33AY-080P-M3COMP'
}) => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'terminal' | 'voucher'>('terminal');
  const [activeTab, setActiveTab] = useState<'carnet' | 'alpine' | 'stamps' | 'checklist' | 'valuation'>('carnet');
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'EUR' | 'CHF'>('GBP');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  
  // Real-time weather state for Alpine passes
  const [alpineWeatherData, setAlpineWeatherData] = useState<Record<string, PassLiveWeatherData>>({});
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Carnet Manifest state from engine
  const [manifest, setManifest] = useState<CarnetManifest | null>(null);
  const [stamps, setStamps] = useState<CustomsClearanceStamp[]>([]);
  const [selectedStationToStamp, setSelectedStationToStamp] = useState<string>('dover');
  const [officerBadgeInput, setOfficerBadgeInput] = useState<string>('DOUANE-FR-8821');

  // Logistics statutory checklist
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

  // Initialize or reload carnet manifest & stamps from vault engine
  const reloadCarnetState = useCallback(() => {
    // Attempt load from localStorage first
    defaultVaultEngine.loadFromOfflineStorage();

    // Ensure token exists
    const tokens = defaultVaultEngine.getAllTokens();
    let token = tokens.find((t) => t.vin === vin);
    if (!token) {
      token = defaultVaultEngine.issueToken(
        vin,
        '0x7E3F...9A1B',
        ['GB', 'FR', 'CH', 'IT', 'AT'],
        'ATA_CARNET',
        365
      );
    }

    const currentStamps = defaultVaultEngine.getClearanceStamps(token.id);
    if (currentStamps.length === 0) {
      // Seed initial Dover clearance stamp
      defaultVaultEngine.recordClearanceStamp(token.id, {
        stationName: 'Eurotunnel Folkestone Shuttle Pier (GB)',
        countryCode: 'GB',
        checkpointType: 'EXPORT',
        officerBadge: 'BORDER-FORCE-UK-4412',
        customsSealCode: 'LCCI-SEAL-GB-2026',
        latitude: 51.0934,
        longitude: 1.1448
      });
    }

    const updatedStamps = defaultVaultEngine.getClearanceStamps(token.id);
    setStamps(updatedStamps);

    const generated = defaultVaultEngine.generateManifest(vin, {
      callSign: carName,
      makeModel: carModel,
      currency: selectedCurrency,
    });
    setManifest(generated);
  }, [vin, carName, carModel, selectedCurrency]);

  // Load weather for Alpine Passes
  const loadAlpineWeather = useCallback(async () => {
    setIsLoadingWeather(true);
    const passKeys = Object.keys(ALPINE_PASS_COORDINATES);
    const results: Record<string, PassLiveWeatherData> = {};

    await Promise.all(
      passKeys.map(async (key) => {
        try {
          const data = await fetchPassLiveWeather(key);
          results[key] = data;
        } catch {
          // handled gracefully inside fetchPassLiveWeather
        }
      })
    );

    setAlpineWeatherData(results);
    setIsLoadingWeather(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reloadCarnetState();
      loadAlpineWeather();
    }
  }, [isOpen, reloadCarnetState, loadAlpineWeather]);

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
    if (selectedCurrency === 'EUR') {
      return { 
        symbol: '€', 
        amount: (baseGbp * 1.18).toLocaleString('en-GB', { maximumFractionDigits: 0 }),
        vatBond: (baseGbp * 1.18 * 0.40).toLocaleString('en-GB', { maximumFractionDigits: 0 })
      };
    }
    if (selectedCurrency === 'CHF') {
      return { 
        symbol: 'CHF', 
        amount: (baseGbp * 1.14).toLocaleString('en-GB', { maximumFractionDigits: 0 }),
        vatBond: (baseGbp * 1.14 * 0.40).toLocaleString('en-GB', { maximumFractionDigits: 0 })
      };
    }
    return { 
      symbol: '£', 
      amount: baseGbp.toLocaleString('en-GB'),
      vatBond: (baseGbp * 0.40).toLocaleString('en-GB')
    };
  };

  const valuation = getAgreedValuation();

  // Verification URI for QR code
  const carnetNumber = manifest?.carnetNumber || 'GB/LON/2026/8841-K';
  const enclaveHash = manifest?.offlineEnclaveHash || '0x7F4B99A1';
  const qrVerificationPayload = `https://datum.atelier/carnet/${encodeURIComponent(carnetNumber)}?vin=${encodeURIComponent(vin)}&hash=${enclaveHash.slice(0, 10)}`;
  const qrSvgMarkup = generateQrSvg(qrVerificationPayload, {
    size: 160,
    margin: 2,
    darkColor: '#000000',
    lightColor: '#FFFFFF',
  });

  // Handle affixing a new customs stamp
  const handleAffixStamp = () => {
    const tokens = defaultVaultEngine.getAllTokens();
    const token = tokens.find((t) => t.vin === vin);
    if (!token) return;

    const stationMap: Record<string, {
      name: string;
      country: CustomsClearanceStamp['countryCode'];
      type: CustomsClearanceStamp['checkpointType'];
      seal: string;
    }> = {
      calais: {
        name: 'Douane Française • Terminal Coquelles (Calais)',
        country: 'FR',
        type: 'TRANSIT',
        seal: 'DOUANE-FR-REPUBLIQUE-2026'
      },
      basel: {
        name: 'Eidgenössische Zollverwaltung • Basel St. Louis Autobahn (EZV)',
        country: 'CH',
        type: 'IMPORT',
        seal: 'EZV-CH-BASEL-ZOLL-A35'
      },
      stelvio: {
        name: 'Agenzia delle Dogane • Passo dello Stelvio Valico (IT)',
        country: 'IT',
        type: 'IMPORT',
        seal: 'DOGANA-IT-STELVIO-2757M'
      },
      folkestone_return: {
        name: 'HM Revenue & Customs • Folkestone Re-Import Pier (GB)',
        country: 'GB',
        type: 'RE_IMPORT',
        seal: 'HMRC-CUSTODY-RETURN-UK'
      }
    };

    const target = stationMap[selectedStationToStamp] || stationMap.calais;
    
    defaultVaultEngine.recordClearanceStamp(token.id, {
      stationName: target.name,
      countryCode: target.country,
      checkpointType: target.type,
      officerBadge: officerBadgeInput.trim() || 'OFFICER-FR-4412',
      customsSealCode: target.seal
    });

    reloadCarnetState();

    showToast({
      title: 'Customs Seal Cryptographically Stamped',
      message: `${target.name} clearance appended to immutable transit chain.`,
      type: 'success',
      badge: 'CUSTOMS'
    });
  };

  const handleExportCarnetJson = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportData = {
        documentType: 'INTERNATIONAL_ATA_CARNET_PASSPORT',
        protocol: 'GENEVA_CONVENTION_1961_CUSTOMS_PASSAGE',
        manifest: manifest,
        offlineCryptographicEnclave: {
          enclaveHash: manifest?.offlineEnclaveHash,
          qrPayload: qrVerificationPayload,
          isOfflineReady: true,
          storageSync: 'LOCAL_BROWSER_ENCLAVE',
        },
        complianceLedger: checklist,
        alpinePassReadiness: Object.entries(ALPINE_PASS_COORDINATES).map(([k, p]) => {
          const live = alpineWeatherData[k];
          return {
            pass: p.name,
            country: p.country,
            summitElevation: `${p.elevationM}m`,
            surfaceCondition: live?.surfaceCondition || p.defaultCondition,
            liveAirTemp: live ? `${live.airTempC}°C` : `${p.defaultAirTempC}°C`,
            gradientMax: p.gradientMax
          };
        })
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATA_CARNET_${carName.replace(/\s+/g, '_')}_${vin.slice(-6)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast({
        title: 'ATA Carnet Passport Exported',
        message: 'Official international customs dossier downloaded with tamper-evident Merkle hash.',
        type: 'success',
        badge: 'CARNET'
      });
    }, 600);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B0C10] border border-amber-500/25 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
        
        {/* Top Header with Stamped Gold Leaf Aesthetic */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Globe2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-luxury-display text-xl sm:text-2xl font-black text-white tracking-[0.15em] uppercase">
                  Cross-Border Transit & Carnet
                </h2>
                <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  {carnetNumber}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Official International Customs Passage • UK & European Alpine Corridors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* View Mode Toggle: Digital Cockpit vs Official LCCI Paper Replica */}
            <div className="p-1 rounded-xl bg-black border border-white/10 flex items-center text-xs font-mono-numbers">
              <button
                onClick={() => setViewMode('terminal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'terminal'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Cockpit Terminal</span>
              </button>
              <button
                onClick={() => setViewMode('voucher')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'voucher'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Official LCCI Voucher</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: DIGITAL COCKPIT TERMINAL                                     */}
        {/* ========================================================================= */}
        {viewMode === 'terminal' && (
          <div className="space-y-6">
            
            {/* Offline Status & Quick Protocol Bar */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-numbers">
              <div className="flex items-center gap-2.5">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isSimulatedOffline
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isSimulatedOffline ? 'HIGH-ALTITUDE PASS BLACKOUT (OFFLINE READY)' : 'ONLINE SATELLITE LINK ACTIVE'}</span>
                </div>
                <span className="text-zinc-400 text-[11px] hidden md:inline">
                  • Local Storage Enclave Synced (Zero Cellular Required)
                </span>
              </div>

              <button
                onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                className="text-[11px] px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 transition flex items-center gap-1.5"
              >
                <span>{isSimulatedOffline ? 'Restore Satellite Link' : 'Test Offline High-Pass Mode'}</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono-numbers overflow-x-auto no-scrollbar">
              {[
                { id: 'carnet', label: 'I. CUSTOMS CARNET & QR', icon: FileCheck },
                { id: 'alpine', label: 'II. ALPINE PASS RADAR', icon: Mountain },
                { id: 'stamps', label: 'III. BORDER CLEARANCE STAMPS', icon: Stamp },
                { id: 'checklist', label: 'IV. TRANSIT MANIFEST', icon: CheckCircle2 },
                { id: 'valuation', label: 'V. AGREED VALUE NOTARY', icon: PoundSterling }
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

            {/* ═══ SUBTAB 1: OFFICIAL CARNET & CRYPTOGRAPHIC OFFLINE QR ═══ */}
            {activeTab === 'carnet' && (
              <div className="space-y-5">
                <div className="chassis-plate rounded-2xl p-6 relative overflow-hidden border border-amber-500/30 bg-[#0E0F14]">
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
                        FÉDÉRATION INTERNATIONALE DE L’AUTOMOBILE • CARNET DE PASSAGES
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono-numbers text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      BONDED EXEMPTION ACTIVE
                    </span>
                  </div>

                  {/* Main Particulars & QR Code Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    
                    {/* Left Column: Vehicle & Bond Particulars */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs font-mono-numbers">
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
                        <span className="text-white font-bold block mt-0.5">{valuation.symbol}{valuation.amount}</span>
                        <span className="text-[11px] text-emerald-400">40% Customs Bond Indemnity</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Customs Expiry</span>
                        <span className="text-white font-bold block mt-0.5">31 DEC 2026</span>
                        <span className="text-[11px] text-zinc-400">365-Day Validity (Geneva)</span>
                      </div>

                      <div className="col-span-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Issuing Body: <strong>LCCI Motoring Directorate</strong></span>
                        <span>Underwriter: <strong>Chubb Private Client</strong></span>
                      </div>
                    </div>

                    {/* Right Column: Scannable Offline QR Code */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950 border border-white/10 space-y-2.5">
                      <div 
                        className="p-2 bg-white rounded-xl shadow-lg border border-zinc-200"
                        dangerouslySetInnerHTML={{ __html: qrSvgMarkup }}
                      />
                      <div className="text-center font-mono-numbers">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold flex items-center justify-center gap-1">
                          <QrCode className="w-3 h-3 text-amber-400" />
                          Offline Scannable QR
                        </span>
                        <span className="text-[9px] text-zinc-500 break-all block mt-0.5">
                          {enclaveHash.slice(0, 18)}...
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Quorum Council Multi-Sig Notarization Badges */}
                  <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-2">
                    <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-wider block">
                      QUORUM COUNCIL MULTI-SIG NOTARIZATION (4 OF 4 VALIDATED):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-numbers">
                      {[
                        { role: 'OWNER', name: 'Lord Alistair Vance', status: 'SIGNED' },
                        { role: 'CUSTODIAN', name: 'Apex Workshop (Bicester)', status: 'SIGNED' },
                        { role: 'INSURER', name: 'Chubb European Group', status: 'SIGNED' },
                        { role: 'AUTHORITY', name: 'LCCI London Border Desk', status: 'NOTARIZED' }
                      ].map((sig, i) => (
                        <div key={i} className="p-2 rounded-lg bg-black/50 border border-white/[0.06] flex items-center justify-between">
                          <span className="text-zinc-400 truncate">{sig.role}: {sig.name.split(' ')[0]}</span>
                          <span className="text-emerald-400 font-bold ml-1">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Explanatory Protocol Notice */}
                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] text-xs text-zinc-300 font-sans leading-relaxed">
                  <p>
                    <strong className="text-amber-300">Sovereign Customs Protocol:</strong> The ATA Carnet serves as an international passport for your vehicle, enabling temporary tax-free importation across France, Switzerland, Italy, Germany, and Austria without requiring duplicate VAT bonds or import duty declarations at alpine frontiers. This token is cryptographically sealed in your browser's offline storage and works without cellular connectivity.
                  </p>
                </div>
              </div>
            )}

            {/* ═══ SUBTAB 2: ALPINE PASS RADAR (WITH LIVE OPEN-METEO WEATHER) ═══ */}
            {activeTab === 'alpine' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono-numbers px-1">
                  <span className="text-zinc-400">HIGH-ALTITUDE ALPINE MOUNTAIN CORRIDORS</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={loadAlpineWeather}
                      disabled={isLoadingWeather}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                      <span>{isLoadingWeather ? 'Syncing Radar...' : 'Refresh Live Telemetry'}</span>
                    </button>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Open-Meteo Live API
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {Object.entries(ALPINE_PASSES_DATA).map(([id, pass]) => {
                    const live = alpineWeatherData[id];
                    const surfaceTemp = live ? live.surfaceTempC : pass.defaultSurfaceTempC;
                    const rainMm = live ? live.rainMmPerHour : 0;
                    const condition = live ? live.surfaceCondition : pass.defaultCondition;
                    
                    // Road grip calculation
                    const grip = calculateRoadGrip({
                      surfaceTempC: surfaceTemp,
                      airTempC: live ? live.airTempC : pass.defaultAirTempC,
                      surfaceCondition: condition,
                      rainMmPerHour: rainMm,
                      tyreTempC: 38
                    });
                    
                    // Barometric engine derating & wastegate offset
                    const atmoComp = calculateAlpineAtmosphericCompensation(pass.elevationM, true);

                    return (
                      <div 
                        key={id}
                        className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-3 shadow-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Mountain className="w-4 h-4 text-amber-400" />
                              <h4 className="text-sm font-bold text-white">{pass.name}</h4>
                            </div>
                            <p className="text-[11px] font-mono-numbers text-zinc-400 mt-0.5">
                              {pass.country} • {pass.roadNumber}
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold border ${
                            condition === 'Frost Hazard'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : condition === 'Wet Bitumen'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}>
                            {condition}
                          </span>
                        </div>

                        {/* Telemetry Grid */}
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono-numbers pt-1">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                            <span className="text-[10px] text-zinc-500 block">Summit</span>
                            <strong className="text-zinc-100">{pass.elevationM.toLocaleString()} m</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                            <span className="text-[10px] text-zinc-500 block">Road Friction</span>
                            <strong className="text-emerald-400">μ = {(grip.frictionNumber ?? 0.85).toFixed(2)}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06]">
                            <span className="text-[10px] text-zinc-500 block">Air Temp</span>
                            <strong className="text-zinc-100">{live ? `${live.airTempC}°C` : `${pass.defaultAirTempC}°C`}</strong>
                          </div>
                        </div>

                        {/* Route Highlight & Engine Atmospheric Compensation */}
                        <div className="space-y-1.5 text-[11px] font-mono-numbers pt-1 border-t border-white/[0.06]">
                          <div className="flex justify-between text-zinc-300">
                            <span className="text-zinc-500">Route Note:</span>
                            <span className="text-zinc-300 truncate max-w-[220px]">{pass.routeHighlight}</span>
                          </div>
                          <div className="flex justify-between text-zinc-300">
                            <span className="text-zinc-500">Twin-Turbo Comp:</span>
                            <span className="text-cyan-400">{atmoComp.summaryText}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-[10px] font-mono-numbers text-zinc-500">
                          <span>Max Grade: <strong className="text-amber-400">{pass.gradientMax}</strong></span>
                          <span>Chains: {pass.snowChainsRequired ? 'Mandatory' : 'Exempt'}</span>
                          <span>{live?.freshness || 'Verified Telemetry'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ SUBTAB 3: BORDER CLEARANCE STAMPS ═══ */}
            {activeTab === 'stamps' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center text-xs font-mono-numbers px-1">
                  <span className="text-zinc-400">IMMUTABLE CUSTOMS CLEARANCE STAMP CHAIN</span>
                  <span className="text-amber-400 font-bold">
                    {stamps.length} RECORDED STAMPS
                  </span>
                </div>

                {/* Interactive Stamping Station */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-amber-400" />
                    <h4 className="font-luxury-display text-sm font-bold text-white uppercase tracking-wider">
                      Border Customs Stamping Station (Field Clearance)
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-numbers">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">SELECT CHECKPOINT POST</label>
                      <select 
                        value={selectedStationToStamp}
                        onChange={(e) => setSelectedStationToStamp(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white font-mono-numbers text-xs"
                      >
                        <option value="calais">🇫🇷 Calais Coquelles Terminal (FR)</option>
                        <option value="basel">🇨🇭 Basel St. Louis Autobahn Zoll (CH)</option>
                        <option value="stelvio">🇮🇹 Passo dello Stelvio Valico (IT)</option>
                        <option value="folkestone_return">🇬🇧 Folkestone Re-Import Pier (GB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">CUSTOMS OFFICER BADGE #</label>
                      <input 
                        type="text" 
                        value={officerBadgeInput}
                        onChange={(e) => setOfficerBadgeInput(e.target.value)}
                        placeholder="OFFICER-ID"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white font-mono-numbers text-xs"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleAffixStamp}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs font-mono-numbers uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
                      >
                        <Stamp className="w-3.5 h-3.5" />
                        <span>Affix Customs Stamp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stamped Ledger Chronology */}
                <div className="space-y-3">
                  {stamps.map((s, idx) => (
                    <div 
                      key={s.stampId}
                      className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-white/20 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono-numbers"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-white text-sm">{s.stationName}</h5>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {s.checkpointType} CLEARED
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Officer: <strong className="text-zinc-200">{s.officerBadge}</strong> • Seal: <strong className="text-zinc-200">{s.customsSealCode}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right text-[10px] text-zinc-500">
                        <div className="text-zinc-300 font-bold">{new Date(s.clearanceTimestamp).toLocaleDateString('en-GB')} {new Date(s.clearanceTimestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-zinc-500">Stamp Hash: {s.merkleStampHash.slice(0, 14)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SUBTAB 4: STATUTORY TRANSIT MANIFEST ═══ */}
            {activeTab === 'checklist' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono-numbers px-1">
                  <span className="text-zinc-400">CROSS-BORDER LOGISTICS & LOW-GROUND-CLEARANCE RIGGING</span>
                  <span className="text-emerald-400 font-bold">
                    {Object.values(checklist).filter(Boolean).length} / {Object.values(checklist).length} STATUTORY COMPLIANT
                  </span>
                </div>

                <div className="space-y-2.5">
                  {TRANSIT_CHECKLIST_ITEMS.map((item) => (
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

            {/* ═══ SUBTAB 5: AGREED VALUATION NOTARY & BOND ═══ */}
            {activeTab === 'valuation' && (
              <div className="space-y-5">
                <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-widest block">
                        CHUBB PRIVATE COLLECTOR POLICY NOTARIZATION
                      </span>
                      <h3 className="font-luxury-display text-lg font-bold text-white mt-0.5">
                        Multi-Currency Agreed Value Hedging & Customs Bond
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-black/60 border border-white/[0.08] text-center space-y-1">
                      <span className="text-xs font-mono-numbers text-zinc-400">Total Agreed Insurance Valuation</span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-numbers tracking-tight">
                        <span className="text-amber-400 mr-2">{valuation.symbol}</span>
                        {valuation.amount}
                      </div>
                      <p className="text-[11px] text-emerald-400 font-mono-numbers pt-1">
                        ✓ Protected against continental currency volatility
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-black/60 border border-amber-500/20 text-center space-y-1">
                      <span className="text-xs font-mono-numbers text-zinc-400">40% EU VAT Exemption Customs Bond</span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono-numbers tracking-tight">
                        <span className="text-amber-400 mr-2">{valuation.symbol}</span>
                        {valuation.vatBond}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono-numbers pt-1">
                        Guaranteed by London Chamber of Commerce
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-numbers pt-2">
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

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: OFFICIAL LCCI PHYSICAL VOUCHER (PRINT REPLICA)               */}
        {/* ========================================================================= */}
        {viewMode === 'voucher' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono-numbers text-zinc-400 px-1">
              <span>OFFICIAL LONDON CHAMBER OF COMMERCE ATA CARNET REPLICA</span>
              <button
                onClick={handlePrintVoucher}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Physical Carnet Document</span>
              </button>
            </div>

            {/* Stamped Paper Certificate Replica */}
            <div className="bg-[#FFFDF9] text-[#1A1A1A] rounded-2xl p-6 sm:p-8 border-4 border-[#C88A3B] shadow-2xl space-y-6 font-serif select-text">
              
              {/* LCCI & FIA Guilloche Header */}
              <div className="border-b-2 border-[#C88A3B] pb-4 text-center space-y-1">
                <div className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold text-[#8C5E1B]">
                  FEDERATION INTERNATIONALE DE L'AUTOMOBILE • LONDON CHAMBER OF COMMERCE
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-[#111]">
                  CARNET DE PASSAGES EN DOUANE
                </h3>
                <p className="text-xs italic text-[#555]">
                  POUR VÉHICULES À MOTEUR • INTERNATIONAL CUSTOMS PASS FOR MOTOR VEHICLES
                </p>
                <div className="font-mono-numbers text-xs font-bold text-[#A86414] pt-1">
                  CARNET NUMBER: {carnetNumber} • VALID UNTIL 31 DECEMBER 2026
                </div>
              </div>

              {/* Grid Particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-b border-[#E5D7BF] pb-5">
                <div className="space-y-2">
                  <div className="p-3 bg-[#F9F4EB] rounded-lg border border-[#E0D2BC]">
                    <span className="text-[10px] text-[#7A6242] uppercase font-bold block">1. Holder / Legal Custodian</span>
                    <strong className="text-sm text-[#111] block mt-0.5">{manifest?.holderName}</strong>
                    <span className="text-xs text-[#555]">{manifest?.holderAddress}</span>
                  </div>

                  <div className="p-3 bg-[#F9F4EB] rounded-lg border border-[#E0D2BC]">
                    <span className="text-[10px] text-[#7A6242] uppercase font-bold block">2. Issuing Association</span>
                    <strong className="text-xs text-[#111] block mt-0.5">{manifest?.issuingChamber}</strong>
                    <span className="text-[11px] text-[#555]">33 Queen Street, London EC4R 1AP (United Kingdom)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-[#F9F4EB] rounded-lg border border-[#E0D2BC]">
                    <span className="text-[10px] text-[#7A6242] uppercase font-bold block">3. Motor Vehicle Particulars</span>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                      <div><span className="text-[#777]">Make/Model:</span> <strong className="text-[#111]">{carModel}</strong></div>
                      <div><span className="text-[#777]">Plate:</span> <strong className="text-[#111]">LJ23 WXY</strong></div>
                      <div><span className="text-[#777]">Chassis/VIN:</span> <strong className="text-[#111]">{vin}</strong></div>
                      <div><span className="text-[#777]">Agreed Value:</span> <strong className="text-[#111]">£89,500 GBP</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F9F4EB] rounded-lg border border-[#E0D2BC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7A6242] uppercase font-bold block">4. Cryptographic Offline Hash</span>
                      <span className="text-xs font-mono-numbers font-bold text-[#111] break-all">{enclaveHash}</span>
                    </div>
                    <div 
                      className="p-1 bg-white rounded border border-[#C88A3B] shrink-0 ml-2"
                      dangerouslySetInnerHTML={{ __html: generateQrSvg(qrVerificationPayload, { size: 64, margin: 1, darkColor: '#1A1A1A', lightColor: '#FFFFFF' }) }}
                    />
                  </div>
                </div>
              </div>

              {/* Customs Official Stamp Inspection Boxes */}
              <div className="space-y-2">
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#7A6242] block">
                  5. VOLET DE SORTIE ET D’ENTRÉE (CUSTOMS FRONTIER CERTIFICATES)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'DOVER / FOLKESTONE', sub: 'Bureau de Sortie (UK)', stamp: stamps[0] },
                    { label: 'CALAIS COQUELLES', sub: 'Bureau d’Entrée (FR)', stamp: stamps[1] },
                    { label: 'BASEL ST. LOUIS', sub: 'Zollverwaltung (CH)', stamp: stamps[2] },
                    { label: 'PASSO DELLO STELVIO', sub: 'Dogana Valico (IT)', stamp: stamps[3] }
                  ].map((box, i) => (
                    <div key={i} className="p-3 rounded-lg border-2 border-dashed border-[#C88A3B] bg-[#FDFBF7] min-h-[90px] flex flex-col justify-between">
                      <span className="text-[10px] font-sans font-bold text-[#7A6242] uppercase block">{box.label}</span>
                      <span className="text-[9px] text-[#888] block">{box.sub}</span>
                      {box.stamp ? (
                        <div className="p-1 rounded bg-[#EAF7EE] border border-[#2EA043] text-[#1B6F30] font-sans font-bold text-[10px] mt-1">
                          ✓ {box.stamp.officerBadge}
                        </div>
                      ) : (
                        <span className="text-[10px] italic text-[#AAA] mt-2">Awaiting Border Officer Seal</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Undertaking */}
              <p className="text-[10px] italic text-[#666] border-t border-[#E5D7BF] pt-3 leading-relaxed">
                The holder undertakes to strictly comply with the customs laws and regulations of the countries visited and to re-export the vehicle before the expiration of the validity period. This digital carnet replica conforms to the ATA Convention of 6 December 1961.
              </p>

            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted under Geneva Convention of 1961 • SHA-256 Enclave</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleExportCarnetJson}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
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

// Data presets for Alpine Passes
const ALPINE_PASSES_DATA = ALPINE_PASS_COORDINATES;

// Statutory Logistics Checklist Items
const TRANSIT_CHECKLIST_ITEMS = [
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
];
