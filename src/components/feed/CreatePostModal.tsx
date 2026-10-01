import { useState, useRef } from 'react';
import type { FC, DragEvent, ChangeEvent } from 'react';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  Scan, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  Compass,
  Wrench,
  HelpCircle,
  Camera,
  Gauge,
  FileCheck2,
  Lock,
  PoundSterling,
  CloudRain
} from 'lucide-react';
import type { CommunityPost } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Partial<CommunityPost>) => void;
  initialMode?: 'post' | 'story';
}

// Candid domestic UK & European presets
const DEMO_PRESETS = [
  {
    id: 'm3-cottage',
    label: 'Cotswolds M3 G80',
    plate: 'LJ23 WXY',
    plateBox: { top: 68, left: 45, width: 14, height: 5 },
    url: '/real_uk_m3_cottage.jpg',
    location: 'Chipping Campden, Cotswolds'
  },
  {
    id: 'gt3-suburb',
    label: 'British Suburb 911 GT3',
    plate: 'GT03 TOU',
    plateBox: { top: 63, left: 43, width: 14, height: 5 },
    url: '/real_uk_gt3_suburb.jpg',
    location: 'Harpenden, Hertfordshire'
  },
  {
    id: 'e30-terrace',
    label: 'Bristol Terrace E30',
    plate: 'H318 REK',
    plateBox: { top: 72, left: 44, width: 15, height: 6 },
    url: '/real_uk_e30_terrace.jpg',
    location: 'Clifton, Bristol'
  },
  {
    id: 'defender-farm',
    label: 'Yorkshire Dales Defender',
    plate: 'YD20 DEF',
    plateBox: { top: 66, left: 42, width: 16, height: 6 },
    url: '/real_uk_defender_farm.jpg',
    location: 'Swaledale, North Yorkshire'
  },
  {
    id: 'driveway-wash',
    label: 'Sunday 07:00 Snow Foam',
    plate: 'P054 CHE',
    plateBox: { top: 60, left: 43, width: 14, height: 5 },
    url: '/real_uk_driveway_wash.jpg',
    location: 'Wilmslow, Cheshire'
  }
];

const STABLE_CARS = [
  { id: 'car-maya-m3', name: 'MAYA', model: 'BMW M3 Competition (G80)', year: 2023, defaultPresetIndex: 0 },
  { id: 'car-kuro-gt3', name: 'KURO', model: 'Porsche 911 GT3 Touring (992)', year: 2023, defaultPresetIndex: 1 },
  { id: 'car-retro-e30', name: 'RETRO MOD', model: 'BMW 318is Slicktop (E30)', year: 1991, defaultPresetIndex: 2 },
  { id: 'car-expedition-110', name: 'EXPEDITION', model: 'Defender 110 P400 SE', year: 2022, defaultPresetIndex: 3 }
];

export const CreatePostModal: FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmitPost,
  initialMode = 'post'
}) => {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const [mode, setMode] = useState<'post' | 'story'>(initialMode);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
  const [postType, setPostType] = useState<CommunityPost['postType']>('CAR_STORY');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Bespoke Build Ledger fields
  const [workshopName, setWorkshopName] = useState('Litchfield Motors, Gloucestershire');
  const [componentCategory, setComponentCategory] = useState('Exhaust & Downpipes');
  const [invoicedCost, setInvoicedCost] = useState('2,850.00');
  const [performanceDelta, setPerformanceDelta] = useState('+18.5 BHP / -8.4 kg');
  const [vatInvoiceNotarized, setVatInvoiceNotarized] = useState(true);

  // Expedition Telemetry fields
  const [surfaceCondition, setSurfaceCondition] = useState('Damp Bitumen (12°C)');
  const [barometricPressure, setBarometricPressure] = useState('1018 hPa');
  const [fuelGrade, setFuelGrade] = useState('Shell V-Power 99 RON');

  // Media & Plate Detection state
  const [selectedImage, setSelectedImage] = useState<string>(DEMO_PRESETS[0].url);
  const [activePlateText, setActivePlateText] = useState<string>(DEMO_PRESETS[0].plate);
  const [plateBox, setPlateBox] = useState(DEMO_PRESETS[0].plateBox);
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [plateDetected, setPlateDetected] = useState<boolean>(true);
  const [isVeilActive, setIsVeilActive] = useState<boolean>(true);
  const [veilStyle, setVeilStyle] = useState<'frosted' | 'pixel' | 'blackout'>('frosted');
  
  const [blurPlateChecked, setBlurPlateChecked] = useState<boolean>(true);
  const [protectEndpointsChecked, setProtectEndpointsChecked] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentCar = STABLE_CARS[selectedCarIndex];

  // Trigger optical scanning animation when image changes
  const triggerOpticalScan = (imageUrl: string, plateText = 'UK PLATE', customBox?: typeof plateBox) => {
    setSelectedImage(imageUrl);
    setActivePlateText(plateText);
    if (customBox) setPlateBox(customBox);
    setIsScanning(true);
    setPlateDetected(false);

    setTimeout(() => {
      setIsScanning(false);
      setPlateDetected(true);
      setIsVeilActive(true);
      showToast({
        title: 'Optical Cloaking Engaged',
        message: `DVSA plate index ${plateText} automatically masked with cryptographic veil.`,
        type: 'privacy'
      });
    }, 1100);
  };

  const handleCarSelect = (index: number) => {
    setSelectedCarIndex(index);
    const targetCar = STABLE_CARS[index];
    const preset = DEMO_PRESETS[targetCar.defaultPresetIndex];
    if (preset) {
      triggerOpticalScan(preset.url, preset.plate, preset.plateBox);
    }
    showToast({
      title: `Active Vehicle: ${targetCar.name}`,
      message: `${targetCar.model} • Ready to notarize new artifact.`,
      type: 'garage',
      badge: 'ACTIVE_CHASSIS'
    });
  };

  // Handle local file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      triggerOpticalScan(url, 'UK VEHICLE REG', { top: 65, left: 40, width: 24, height: 8 });
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      triggerOpticalScan(url, 'CUSTOM REG', { top: 65, left: 40, width: 24, height: 8 });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Build tailored content with engineering metadata if build or drive
      let enrichedContent = content.trim();
      if (postType === 'BUILD_UPDATE') {
        enrichedContent += `\n\n[PROVENANCE LEDGER: ${componentCategory} fitted by ${workshopName} • £${invoicedCost} • Delta: ${performanceDelta} • VAT receipt cryptographically notarized]`;
      } else if (postType === 'DRIVE') {
        enrichedContent += `\n\n[TELEMETRY: Surface ${surfaceCondition} • Fuel: ${fuelGrade} • Ambient: ${barometricPressure} • 800m residential perimeter cloaked]`;
      }

      onSubmitPost({
        postType: mode === 'story' ? 'CAR_STORY' : postType,
        title: title.trim() || undefined,
        content: enrichedContent,
        authorType: 'car',
        authorVehicleId: currentCar.id,
        authorVehicleName: currentCar.name,
        authorVehicleModel: currentCar.model,
        authorVehicleYear: currentCar.year,
        provenanceTag: postType === 'BUILD_UPDATE' ? 'verified_professional' : 'owner_experience',
        createdAt: 'Just now',
        likesCount: 0,
        repliesCount: 0,
        mediaUrls: [selectedImage]
      });

      showToast({
        title: mode === 'story' ? 'Paddock Reel Dispatched' : 'Automotive Artifact Notarized',
        message: `Logged under ${currentCar.name} chassis sovereign ledger. Privacy perimeter preserved.`,
        type: 'success'
      });

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`border rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200 transition-colors ${
        isWhiteYellow
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
          : 'bg-[#0B0C0E] border-amber-500/20 text-white shadow-2xl'
      }`}>
        
        {/* Modal Top Header with Haute Horlogerie aesthetic */}
        <div className={`flex justify-between items-center border-b pb-4 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800/80'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner border ${
              isWhiteYellow
                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                : 'bg-zinc-950 border-amber-500/30 text-white'
            }`}>
              <Camera className={`w-5 h-5 ${isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-luxury-display uppercase tracking-widest font-bold ${
                  isWhiteYellow ? 'text-zinc-950' : 'text-zinc-100'
                }`}>
                  Atelier Log Entry
                </h3>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded font-bold border tracking-wider ${
                  isWhiteYellow
                    ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  CHASSIS {currentCar.name}
                </span>
              </div>
              <p className={`text-xs font-sans ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {currentCar.model} • Sovereign vehicle ledger notarization
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stable Chassis Selector */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border text-xs font-mono-numbers overflow-x-auto no-scrollbar ${
          isWhiteYellow
            ? 'bg-zinc-100 border-zinc-200'
            : 'bg-zinc-950 border-white/[0.08]'
        }`}>
          <span className={`text-[10px] uppercase px-2 font-bold shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'}`}>
            STABLE CHASSIS:
          </span>
          {STABLE_CARS.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCarSelect(idx)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 text-xs ${
                selectedCarIndex === idx
                  ? isWhiteYellow
                    ? 'bg-yellow-400 text-zinc-950 font-bold border border-yellow-500 shadow-xs'
                    : 'bg-amber-400 text-black font-extrabold shadow-sm'
                  : isWhiteYellow
                    ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Mode Selector: Feed Post vs 24h Paddock Reel */}
        <div className={`flex items-center p-1 rounded-xl border ${
          isWhiteYellow ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
        }`}>
          <button
            type="button"
            onClick={() => setMode('post')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'post'
                ? isWhiteYellow
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-300 font-bold'
                  : 'bg-zinc-800/90 text-white shadow-sm border border-amber-500/30'
                : isWhiteYellow
                  ? 'text-zinc-600 hover:text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="font-luxury-display tracking-wider text-[11px]">Sovereign Feed Record (Permanent)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMode('story')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'story'
                ? isWhiteYellow
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-400 shadow-xs font-bold'
                  : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-700/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : isWhiteYellow
                  ? 'text-zinc-600 hover:text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'}`} />
            <span className="font-luxury-display tracking-wider text-[11px]">Paddock Dispatch (24h Reel)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE MEDIA UPLOAD & OPTICAL PLATE DETECTION VIEW   */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono-numbers uppercase text-zinc-400 flex items-center gap-2 tracking-wider">
              <Scan className="w-3.5 h-3.5 text-amber-400" />
              <span>Optical Cloaking & Plate Redaction Studio</span>
            </label>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-mono-numbers text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Candid Photo</span>
            </button>
          </div>

          {/* Main Photo Canvas Viewport */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner group ${
              mode === 'story' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[16/10]'
            }`}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            {/* Scanning Laser Sweep Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center bg-black/50 backdrop-blur-[2px]">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-pulse top-1/2 -translate-y-1/2" />
                <div className="px-4 py-2 rounded-xl bg-zinc-950/90 border border-amber-500/40 text-xs font-mono-numbers text-amber-300 flex items-center gap-2 shadow-2xl">
                  <Scan className="w-4 h-4 animate-spin text-amber-400" />
                  <span>ANALYZING REGISTRATION TELEMETRY & CLOAKING...</span>
                </div>
              </div>
            )}

            {/* Plate Detection Bounding Target Box */}
            {plateDetected && (
              <div
                style={{
                  top: `${plateBox.top}%`,
                  left: `${plateBox.left}%`,
                  width: `${plateBox.width}%`,
                  height: `${plateBox.height}%`,
                }}
                className={`absolute transition-all duration-300 rounded ${
                  isVeilActive
                    ? veilStyle === 'frosted'
                      ? 'backdrop-blur-md bg-zinc-950/85 border border-amber-400/40 shadow-lg'
                      : veilStyle === 'pixel'
                      ? 'bg-zinc-950/95 border-2 border-dashed border-amber-400 shadow-lg'
                      : 'bg-black border border-zinc-700 shadow-lg'
                    : 'border-2 border-amber-400 ring-2 ring-amber-400/30'
                } flex items-center justify-center`}
              >
                {!isVeilActive && (
                  <span className="text-[10px] font-mono-numbers font-black px-1.5 py-0.5 rounded bg-amber-400 text-black shadow">
                    {activePlateText}
                  </span>
                )}

                {isVeilActive && (
                  <div className="text-center px-1">
                    <span className="text-[9px] font-mono-numbers text-zinc-300 tracking-widest uppercase block font-bold">
                      {veilStyle === 'pixel' ? '▓▓▓▓▓▓▓' : '[CLOAKED]'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Floating Veil Toolbar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between p-2 rounded-xl bg-zinc-950/85 border border-zinc-800 backdrop-blur-md text-xs font-mono-numbers">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300 font-semibold hidden sm:inline">
                  {isScanning ? 'Scanning...' : `Detected: ${activePlateText} [UK]`}
                </span>
                <span className="text-zinc-400 sm:hidden">Privacy Guard</span>
              </div>

              {/* Veil Toggle Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVeilActive(!isVeilActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    isVeilActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                >
                  {isVeilActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isVeilActive ? 'Privacy Veil: ON' : 'Raw Plate: EXPOSED'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Real Domestic Presets & Blur Texture Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Quick Demo Car Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[10px] font-mono-numbers text-zinc-500 uppercase mr-1">Candid UK Locales:</span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => triggerOpticalScan(preset.url, preset.plate, preset.plateBox)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-numbers transition border ${
                    selectedImage === preset.url
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Blur Style Switcher */}
            <div className="flex items-center gap-1 text-[11px] font-mono-numbers">
              <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
              {(['frosted', 'pixel', 'blackout'] as const).map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setVeilStyle(style)}
                  className={`px-2 py-0.5 rounded capitalize transition ${
                    veilStyle === style
                      ? 'bg-zinc-800 text-amber-300 font-semibold border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* POST DETAILS FORM                                         */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Post Object Type (If Feed Post Mode) */}
          {mode === 'post' && (
            <div>
              <label className="text-[11px] font-mono-numbers uppercase text-zinc-400 block mb-1.5 tracking-wider">
                Automotive Object Classification
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'CAR_STORY', label: 'Candid Artifact', icon: Camera },
                  { type: 'DRIVE', label: 'Expedition Route', icon: Compass },
                  { type: 'BUILD_UPDATE', label: 'Workshop Ledger', icon: Wrench },
                  { type: 'QUESTION', label: 'Guild Inquiry', icon: HelpCircle },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setPostType(opt.type as any)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                        postType === opt.type
                          ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md font-bold'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conditional Atelier Workshop Ledger Inputs */}
          {postType === 'BUILD_UPDATE' && mode === 'post' && (
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-luxury-display uppercase tracking-wider text-amber-300 font-bold">
                    Certified Hardware Ledger
                  </span>
                </div>
                <span className="text-[10px] font-mono-numbers text-zinc-400">
                  PROOF OF WORK NOTARIZATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono-numbers">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">CERTIFIED WORKSHOP / FITTER</label>
                  <input
                    type="text"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-400 outline-none"
                    placeholder="e.g. Litchfield Motors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">COMPONENT CLASSIFICATION</label>
                  <input
                    type="text"
                    value={componentCategory}
                    onChange={(e) => setComponentCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-400 outline-none"
                    placeholder="e.g. Dampers, Exhaust, Brakes"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                    <PoundSterling className="w-3 h-3 text-amber-400" />
                    <span>INVOICED COST (£ GBP)</span>
                  </label>
                  <input
                    type="text"
                    value={invoicedCost}
                    onChange={(e) => setInvoicedCost(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-400 outline-none"
                    placeholder="e.g. 2,850.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-amber-400" />
                    <span>DYNO / WEIGHT DELTA</span>
                  </label>
                  <input
                    type="text"
                    value={performanceDelta}
                    onChange={(e) => setPerformanceDelta(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-400 outline-none"
                    placeholder="e.g. +18.5 BHP / -8.4 kg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-zinc-300 font-mono-numbers">
                <input
                  type="checkbox"
                  checked={vatInvoiceNotarized}
                  onChange={(e) => setVatInvoiceNotarized(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0"
                />
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Attach cryptographic hash of itemised VAT invoice for DVSA V5C provenance</span>
                </span>
              </label>
            </div>
          )}

          {/* Conditional Expedition Telemetry Inputs */}
          {postType === 'DRIVE' && mode === 'post' && (
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-luxury-display uppercase tracking-wider text-cyan-300 font-bold">
                    Expedition Telemetry Ledger
                  </span>
                </div>
                <span className="text-[10px] font-mono-numbers text-cyan-400/80">
                  800M RESIDENTIAL CLOAK ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono-numbers">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-cyan-400" />
                    <span>SURFACE CONDITION</span>
                  </label>
                  <input
                    type="text"
                    value={surfaceCondition}
                    onChange={(e) => setSurfaceCondition(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-cyan-400 outline-none"
                    placeholder="e.g. Damp Bitumen (12°C)"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">ATMOSPHERIC PRESSURE</label>
                  <input
                    type="text"
                    value={barometricPressure}
                    onChange={(e) => setBarometricPressure(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-cyan-400 outline-none"
                    placeholder="e.g. 1018 hPa"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-zinc-400 block">FUEL GRADE CONSUMED</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFuelGrade('Shell V-Power 99 RON (48.2L @ £1.729/L = £83.34)');
                        showToast({
                          title: '99 RON Fuel Receipt Notarized',
                          message: 'Shell V-Power 99 RON • 48.20 Litres @ £1.729/L cryptographically attached.',
                          type: 'success',
                          badge: '99 RON'
                        });
                      }}
                      className="text-[9px] font-mono-numbers text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Scan 99 RON Receipt</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={fuelGrade}
                    onChange={(e) => setFuelGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-cyan-400 outline-none"
                    placeholder="e.g. Shell V-Power 99"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={`text-[11px] font-mono-numbers uppercase block mb-1 tracking-wider ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Title / Artifact Notation
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={mode === 'story' ? 'e.g. Early Morning Cotswolds Shakedown' : 'e.g. Akrapovič Evolution Line Titanium System Installed'}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition font-sans ${
                isWhiteYellow
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:bg-white'
                  : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-400/60'
              }`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={`text-[11px] font-mono-numbers uppercase block mb-1 tracking-wider ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Candid Mechanical Impressions & Driver Notes
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record genuine cold-tyre feel, damping compliance on broken B-roads, fuel consumption, or maintenance insights..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none font-sans transition focus:outline-none ${
                isWhiteYellow
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:bg-white'
                  : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-400/60'
              }`}
              required
            />
          </div>

          {/* Mandatory Pre-Publish Privacy Checklist */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
            isWhiteYellow
              ? 'bg-emerald-50/70 border-emerald-300'
              : 'bg-zinc-950 border-zinc-800/80'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold ${isWhiteYellow ? 'text-emerald-950' : 'text-zinc-200'}`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-luxury-display uppercase tracking-wider text-[11px]">Residential Privacy Buffer (Active)</span>
              </div>
              <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded border font-bold ${
                isWhiteYellow
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              }`}>
                ACTIVE
              </span>
            </div>

            <div className={`space-y-1.5 text-xs font-mono-numbers ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'}`}>
              <label className="flex items-center gap-2 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={blurPlateChecked}
                  onChange={(e) => setBlurPlateChecked(e.target.checked)}
                  className="rounded border-zinc-300 text-emerald-600 focus:ring-0"
                />
                <span>Auto-blur registration plates on uploaded media [DVSA Privacy Rule]</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={protectEndpointsChecked}
                  onChange={(e) => setProtectEndpointsChecked(e.target.checked)}
                  className="rounded border-zinc-300 text-emerald-600 focus:ring-0"
                />
                <span>Clip 800m privacy perimeter around residential garaging GPS endpoints</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl border text-xs font-mono-numbers transition ${
                isWhiteYellow
                  ? 'border-zinc-300 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs font-mono-numbers uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-md flex items-center gap-2 ${
                isWhiteYellow
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border border-yellow-500 shadow-yellow-500/20'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Stamping...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Notarize & Publish to Paddock</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
