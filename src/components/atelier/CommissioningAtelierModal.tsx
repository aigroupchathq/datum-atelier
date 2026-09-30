import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  FileText, 
  Award,
  Layers
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CommissioningAtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  carModel?: string;
  initialVin?: string;
}

interface PaintOption {
  id: string;
  name: string;
  code: string;
  colorHex: string;
  type: string;
  heritageStory: string;
}

const PAINT_OPTIONS: PaintOption[] = [
  {
    id: 'oak-green-neo',
    name: 'Oak Green Metallic Neo',
    code: 'PTS-22L',
    colorHex: '#1B3B2B',
    type: 'Liquid Metallic',
    heritageStory: 'Ferry Porsche’s personal 930 Turbo hue. Deep alpine pine tones that turn emerald under direct sunlight.'
  },
  {
    id: 'isle-of-man-green',
    name: 'Isle of Man Green Metallic',
    code: 'BMW-C4G',
    colorHex: '#084B3E',
    type: 'High-Pearl Metallic',
    heritageStory: 'Celebrating the Snaefell Mountain Course. Vibrant deep teal flake with dark forest lowlights.'
  },
  {
    id: 'british-racing-green',
    name: 'British Racing Green Heritage',
    code: 'HISTORIC-BRG',
    colorHex: '#0B291A',
    type: 'Non-Metallic Solid',
    heritageStory: 'The legendary Gordon Bennett Cup 1903 national racing livery. Understated, regal, pure coachbuilder pedigree.'
  },
  {
    id: 'san-marino-blue',
    name: 'San Marino Blue Pearl',
    code: 'BMW-B51',
    colorHex: '#142E6B',
    type: 'Deep Multi-Stage Pearl',
    heritageStory: 'One of the greatest modern European blue shades. Shimmers with rich royal violet undertones.'
  },
  {
    id: 'viola-metallic',
    name: 'Viola Metallic Heritage',
    code: 'PTS-3AE',
    colorHex: '#2E1933',
    type: 'Liquid Pearl Metallic',
    heritageStory: 'Iconic 1990s atelier purple made famous on the 30th Anniversary 964. Deep eggplant that flashes amethyst.'
  },
  {
    id: 'grigio-telesto',
    name: 'Grigio Telesto Opaco',
    code: 'LAMBO-0098',
    colorHex: '#52555A',
    type: 'Satin Industrial Gloss',
    heritageStory: 'Originally formulated for the Murciélago SuperVeloce. Aggressive aeronautical slate grey.'
  },
  {
    id: 'dakar-yellow',
    name: 'Dakar Yellow II',
    code: 'BMW-337',
    colorHex: '#D4B83C',
    type: 'Historic Solid Gloss',
    heritageStory: 'The definitive E36 M3 GT livery. Warm pastel ochre yellow inspired by endurance desert raids.'
  }
];

interface LeatherOption {
  id: string;
  name: string;
  tannery: string;
  swatchHex: string;
  stitching: string;
  description: string;
}

const LEATHER_OPTIONS: LeatherOption[] = [
  {
    id: 'bridge-of-weir-tan',
    name: 'Highland Saddle Tan',
    tannery: 'Bridge of Weir (Renfrewshire, Scotland)',
    swatchHex: '#9E6238',
    stitching: 'Sterling Silver 1.2mm Twill Double-Stitch',
    description: 'Low-carbon, semi-aniline Scottish bull hide with natural grain markings and supple hand feel.'
  },
  {
    id: 'connolly-chestnut',
    name: 'Vintage Vaumol Chestnut',
    tannery: 'Connolly Brothers (Kent, UK)',
    swatchHex: '#6E3A20',
    stitching: 'Oatmeal Waxed Linen Thread',
    description: 'The historic formulation found in DB5s and coachbuilt Bentleys. Vegetable-tanned with classic patina aroma.'
  },
  {
    id: 'nero-acid-green',
    name: 'Obsidian Nappa & Acid Pipings',
    tannery: 'Bader Leather (Germany)',
    swatchHex: '#18181B',
    stitching: 'Electric Acid Green Micro-Stitch & 12-o-clock Centre Stripe',
    description: 'Full-grain smooth Bavarian nappa leather paired with perforated Alcantara seat center panels.'
  },
  {
    id: 'oxford-navy',
    name: 'Oxford Blue Pebble Grain',
    tannery: 'Weimar Fine Hides (Germany)',
    swatchHex: '#1E293B',
    stitching: 'Chalk White Contrast Saddle Cross-Stitch',
    description: 'Stately maritime navy pebble leather with brushed matte finish resistant to UV solar degradation.'
  }
];

interface TrimOption {
  id: string;
  name: string;
  material: string;
  desc: string;
}

const TRIM_OPTIONS: TrimOption[] = [
  {
    id: 'matte-carbon',
    name: '3K Twill Matte Carbon Weave',
    material: 'Autoclave Pre-Preg Carbon Fiber',
    desc: 'Unlacquered satin surface eliminates harsh cabin reflections on bright mornings.'
  },
  {
    id: 'english-walnut',
    name: 'Open-Pore English Burr Walnut',
    material: 'Sustainably Harvested Sussex Timber',
    desc: 'Book-matched architectural veneer with natural tactile woodgrain pore texture.'
  },
  {
    id: 'knurled-titanium',
    name: 'Machine-Turned Billet Titanium',
    material: 'Grade 5 Titanium & Aerospace 6061-T6',
    desc: 'Diamond-knurled rotary switches and brushed center console bezel for tactile mechanical precision.'
  }
];

export const CommissioningAtelierModal: FC<CommissioningAtelierModalProps> = ({
  isOpen,
  onClose,
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)',
  initialVin = 'WBA-33AY-08P-G8077'
}) => {
  const [selectedPaint, setSelectedPaint] = useState<PaintOption>(PAINT_OPTIONS[0]);
  const [selectedLeather, setSelectedLeather] = useState<LeatherOption>(LEATHER_OPTIONS[0]);
  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(TRIM_OPTIONS[0]);
  const [custodianName, setCustodianName] = useState<string>('V. DRIVER');
  const [commissionEdition, setCommissionEdition] = useState<string>('01 / 10 ATELIER EDITION');
  const [finishType, setFinishType] = useState<'gloss' | 'satin'>('gloss');
  const [isNotarizing, setIsNotarizing] = useState<boolean>(false);
  const { showToast } = useToast();

  const commissionSerial = `AGY-UK-${selectedPaint.code}-${Date.now().toString().slice(-4)}`;

  const handleNotarizeCommission = () => {
    setIsNotarizing(true);
    setTimeout(() => {
      setIsNotarizing(false);
      showToast({
        title: 'Commission Plaque Stamped & Notarized',
        message: `${carName} bespoke specification (${selectedPaint.name}) cryptographically recorded to Chassis Passport`,
        type: 'garage',
        badge: 'ATELIER'
      });
      onClose();
    }, 800);
  };

  const handleDownloadSpec = () => {
    const specDossier = {
      platform: 'GARAGE SOVEREIGN AUTOMOTIVE ATELIER',
      documentType: 'OFFICIAL_COACHBUILDER_COMMISSION_CERTIFICATE',
      commissionSerial,
      vehicle: {
        name: carName,
        model: carModel,
        vin: initialVin,
        edition: commissionEdition,
        custodian: custodianName,
      },
      bespokeSpecification: {
        paintToSample: {
          name: selectedPaint.name,
          factoryCode: selectedPaint.code,
          hexSwatch: selectedPaint.colorHex,
          finish: finishType === 'gloss' ? 'Triple-Layer Ceramic Clearcoat' : 'Satin Frozen Silk Matte',
          heritageNote: selectedPaint.heritageStory
        },
        interiorUpholstery: {
          leather: selectedLeather.name,
          tannery: selectedLeather.tannery,
          stitching: selectedLeather.stitching,
          grain: selectedLeather.description
        },
        cockpitArchitecture: {
          trim: selectedTrim.name,
          material: selectedTrim.material,
          treatment: selectedTrim.desc
        }
      },
      notarization: {
        jurisdiction: 'Mayfair & Goodwood Paddock Guild, United Kingdom',
        cryptographicProof: '0x9E7F4B2C81DA0934F',
        timestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(specDossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${carName}_Atelier_Commission_${commissionSerial}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      title: 'Commission Specification Exported',
      message: `Downloaded official ${carName} Atelier Dossier (.JSON)`,
      type: 'clipboard',
      badge: 'EXPORT'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0B0C10] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Corner Rivet Details */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-400/50 shadow-inner flex items-center justify-center text-[7px] text-zinc-900 font-black">+</div>

        {/* ── HEADER ── */}
        <header className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0E0F14]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-luxury-display tracking-wider">
                  BESPOKE COACHBUILDER COMMISSIONING ATELIER
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  MAYFAIR & GOODWOOD GUILD
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono-numbers mt-0.5">
                Chassis Serial Stamping • Heritage Paint-to-Sample • Scottish Bull Hides • Titanium Plaque Forge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* ── BODY VIEWPORT ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* ========================================================= */}
          {/* 1. INTERACTIVE STAMPED TITANIUM COMMISSIONING PLAQUE      */}
          {/* ========================================================= */}
          <div className="chassis-plate rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-2xl border border-white/20">
            
            {/* Rivets */}
            <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-300 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-black">+</div>
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-300 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-black">+</div>
            <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-300 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-black">+</div>
            <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-300 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-black">+</div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.12]">
              <div>
                <span className="text-[10px] font-mono-numbers tracking-[0.25em] text-zinc-400 uppercase font-bold block">
                  BESPOKE COACHBUILDER IDENTIFICATION & COMMISSIONING PLAQUE
                </span>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-base sm:text-lg font-bold font-luxury-display text-white">
                    {carName} • {carModel}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-xs font-mono-numbers text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {commissionEdition}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-numbers text-emerald-400 font-bold px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MAYFAIR ATELIER AUTHENTICATED</span>
                </span>
              </div>
            </div>

            {/* Plaque Specification Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-mono-numbers">
              
              {/* Paint Swatch Column */}
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider font-semibold">COACHWORK PTS</span>
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-5 h-5 rounded-md border border-white/30 shadow-md shrink-0" 
                    style={{ backgroundColor: selectedPaint.colorHex }}
                  />
                  <div className="min-w-0">
                    <strong className="text-zinc-100 block truncate">{selectedPaint.name}</strong>
                    <span className="text-[10px] text-zinc-400">{selectedPaint.code} • {finishType.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Leather Swatch Column */}
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider font-semibold">CABIN UPHOLSTERY</span>
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-5 h-5 rounded-md border border-white/30 shadow-md shrink-0" 
                    style={{ backgroundColor: selectedLeather.swatchHex }}
                  />
                  <div className="min-w-0">
                    <strong className="text-zinc-100 block truncate">{selectedLeather.name}</strong>
                    <span className="text-[10px] text-zinc-400">{selectedLeather.tannery.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Trim Spec Column */}
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider font-semibold">INTERIOR ARCHITECTURE</span>
                <strong className="text-zinc-100 block truncate">{selectedTrim.name}</strong>
                <span className="text-[10px] text-zinc-400 block truncate">{selectedTrim.material}</span>
              </div>

              {/* Custodian Column */}
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider font-semibold">COMMISSIONED FOR</span>
                <strong className="text-amber-400 block truncate">{custodianName}</strong>
                <span className="text-[10px] text-zinc-500 block truncate">SERIAL: {commissionSerial}</span>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* 2. BESPOKE CUSTOMIZATION CONTROLS                         */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Paint-to-Sample (PTS) Selector */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold font-luxury-display text-white uppercase tracking-wider">
                    Paint-to-Sample (PTS) Heritage Palette
                  </h3>
                </div>
                <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-white/[0.06] text-[10px] font-mono-numbers">
                  <button
                    onClick={() => setFinishType('gloss')}
                    className={`px-2 py-0.5 rounded ${finishType === 'gloss' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    GLOSS
                  </button>
                  <button
                    onClick={() => setFinishType('satin')}
                    className={`px-2 py-0.5 rounded ${finishType === 'satin' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    FROZEN SATIN
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAINT_OPTIONS.map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      onClick={() => setSelectedPaint(paint)}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-white/[0.08] border-amber-400/80 shadow-md ring-1 ring-amber-400/40' 
                          : 'bg-black/40 border-white/[0.06] hover:border-white/[0.14]'
                      }`}
                    >
                      <div 
                        className="w-7 h-7 rounded-lg border border-white/20 shadow-inner shrink-0 mt-0.5" 
                        style={{ backgroundColor: paint.colorHex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono-numbers truncate">
                            {paint.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono-numbers block mt-0.5">
                          {paint.code} • {paint.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Paint Heritage Note */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-sans text-zinc-300 leading-relaxed">
                <span className="text-[10px] font-mono-numbers text-amber-400 uppercase font-bold block mb-1">
                  HISTORIC ATELIER PROVENANCE:
                </span>
                {selectedPaint.heritageStory}
              </div>
            </div>

            {/* Right: Interior Bull Hides & Architecture */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold font-luxury-display text-white uppercase tracking-wider">
                  Scottish Tannery Hides & Architecture
                </h3>
              </div>

              {/* Leather selections */}
              <div className="space-y-2.5">
                {LEATHER_OPTIONS.map((leather) => {
                  const isSelected = selectedLeather.id === leather.id;
                  return (
                    <button
                      key={leather.id}
                      onClick={() => setSelectedLeather(leather)}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-white/[0.08] border-emerald-400/80 shadow-md ring-1 ring-emerald-400/40' 
                          : 'bg-black/40 border-white/[0.06] hover:border-white/[0.14]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-6 h-6 rounded-md border border-white/20 shadow-inner shrink-0" 
                          style={{ backgroundColor: leather.swatchHex }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white font-mono-numbers block truncate">
                            {leather.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono-numbers truncate block">
                            {leather.tannery}
                          </span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Trim selections */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono-numbers text-zinc-500 uppercase tracking-wider block font-semibold">
                  INTERIOR ARCHITECTURAL TRIM & SWITCHES
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {TRIM_OPTIONS.map((trim) => {
                    const isSelected = selectedTrim.id === trim.id;
                    return (
                      <button
                        key={trim.id}
                        onClick={() => setSelectedTrim(trim)}
                        className={`p-2 rounded-lg border text-left text-xs transition ${
                          isSelected 
                            ? 'bg-white/[0.08] border-amber-400 text-white font-bold' 
                            : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="block truncate text-[11px] font-mono-numbers">{trim.name.split(' ')[0]} {trim.name.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custodian Input Fields */}
              <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-xs font-mono-numbers">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase block mb-1">Custodian Inscription</label>
                  <input
                    type="text"
                    value={custodianName}
                    onChange={(e) => setCustodianName(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.1] text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    placeholder="E.G. V. DRIVER"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase block mb-1">Edition Stamping</label>
                  <input
                    type="text"
                    value={commissionEdition}
                    onChange={(e) => setCommissionEdition(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.1] text-xs text-zinc-200 font-semibold focus:outline-none focus:border-amber-400"
                    placeholder="E.G. 01 / 10 ATELIER"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ── FOOTER ACTIONS ── */}
        <footer className="px-6 py-4 border-t border-white/[0.08] bg-[#0E0F14] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Official Mayfair Coachbuilder Specification Serial: {commissionSerial}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadSpec}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono-numbers text-xs font-semibold transition flex items-center gap-2 border border-white/[0.1]"
              title="Download Specification Dossier JSON"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export Dossier (.JSON)</span>
            </button>
            <button
              onClick={handleNotarizeCommission}
              disabled={isNotarizing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-luxury-display uppercase tracking-wider transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>{isNotarizing ? 'Notarizing...' : 'Stamp & Notarize Plaque'}</span>
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
