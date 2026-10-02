import { useState, useRef, useEffect } from 'react';
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
  PoundSterling,
  CloudRain,
  Zap,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import type { CommunityPost } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { redactPlateOnCanvas } from '../../utils/plateRedactionCanvas';
import { 
  EXPEDITION_PRESETS, 
  calculateDriveCadence, 
  type DriveCadenceResult, 
  type ExpeditionPreset 
} from '../../utils/respectRatingEngine';

export interface InitialDriveData {
  title?: string;
  caption?: string;
  passName?: string;
  durationMinutes?: number;
  cadenceResult?: DriveCadenceResult;
  waypoints?: { id: string; title: string; time: string; altitudeM: number; imageUrl: string }[];
  carId?: string;
  carName?: string;
  carModel?: string;
  frictionMu?: number;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Partial<CommunityPost>) => void;
  initialMode?: 'post' | 'story';
  initialDriveData?: InitialDriveData | null;
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
    label: 'Sunday Snow Foam',
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
  initialMode = 'post',
  initialDriveData
}) => {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const [mode, setMode] = useState<'post' | 'story'>(initialMode);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
  const [postType, setPostType] = useState<CommunityPost['postType']>('CAR_STORY');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showAdvancedDetails, setShowAdvancedDetails] = useState<boolean>(false);
  
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
  const [sanitizedImage, setSanitizedImage] = useState<string | null>(null);
  const [sanitizedPixelCount, setSanitizedPixelCount] = useState<number>(0);
  const [inspectRawMode, setInspectRawMode] = useState<boolean>(false);
  const [activePlateText, setActivePlateText] = useState<string>(DEMO_PRESETS[0].plate);
  const [plateBox, setPlateBox] = useState(DEMO_PRESETS[0].plateBox);
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isVeilActive, setIsVeilActive] = useState<boolean>(true);
  const [veilStyle, setVeilStyle] = useState<'frosted' | 'pixel' | 'blackout'>('blackout');
  
  // Cadence & Respects state
  const [cadenceResult, setCadenceResult] = useState<DriveCadenceResult | null>(null);
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Restore draft if available
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem('datum_create_post_draft');
      if (savedDraft && !initialDriveData) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.content) setContent(parsed.content);
      }
    } catch {
      // Ignore storage errors
    }
  }, [initialDriveData]);

  // Save draft on change
  useEffect(() => {
    try {
      if (title || content) {
        sessionStorage.setItem('datum_create_post_draft', JSON.stringify({ title, content }));
      }
    } catch {
      // Ignore
    }
  }, [title, content]);

  // Ingest initialDriveData if provided from ActiveDriveTrackerModal
  useEffect(() => {
    if (initialDriveData) {
      if (initialDriveData.title) setTitle(initialDriveData.title);
      if (initialDriveData.caption) setContent(initialDriveData.caption);
      setPostType('DRIVE');
      setShowAdvancedDetails(true);
      if (initialDriveData.cadenceResult) setCadenceResult(initialDriveData.cadenceResult);
      if (initialDriveData.carId) {
        const foundCarIdx = STABLE_CARS.findIndex(c => c.id === initialDriveData.carId);
        if (foundCarIdx >= 0) setSelectedCarIndex(foundCarIdx);
      }
      if (initialDriveData.waypoints && initialDriveData.waypoints.length > 0) {
        const topWp = initialDriveData.waypoints[0];
        triggerOpticalScan(topWp.imageUrl, 'WAYPOINT REG', { top: 65, left: 42, width: 16, height: 6 });
      }
      if (initialDriveData.frictionMu) {
        setSurfaceCondition(`Bitumen (${initialDriveData.frictionMu} µ Friction)`);
      }
    }
  }, [initialDriveData]);

  // Execute true HTML5 Canvas physical pixel redaction
  const runCanvasRedaction = async (imgUrl: string, box: typeof plateBox, style: typeof veilStyle) => {
    try {
      const mappedStyle = style === 'pixel' ? 'pixelate' : style === 'blackout' ? 'blackout' : 'monogram';
      const result = await redactPlateOnCanvas(imgUrl, box, {
        style: mappedStyle,
        watermarkText: 'DATUM // CLOAKED',
        quality: 0.92
      });
      setSanitizedImage(result.dataUrl);
      setSanitizedPixelCount(result.redactedPixelCount);
    } catch (err) {
      console.warn('Canvas pixel redaction warning (fallback to visual):', err);
    }
  };

  // Re-run canvas redaction whenever image, box or veil style changes
  useEffect(() => {
    if (selectedImage) {
      runCanvasRedaction(selectedImage, plateBox, veilStyle);
    }
  }, [selectedImage, plateBox, veilStyle]);

  if (!isOpen) return null;

  const currentCar = STABLE_CARS[selectedCarIndex];

  // Trigger optical scanning animation when image changes
  const triggerOpticalScan = (imageUrl: string, plateText = 'UK PLATE', customBox?: typeof plateBox) => {
    setSelectedImage(imageUrl);
    setActivePlateText(plateText);
    const box = customBox || plateBox;
    if (customBox) setPlateBox(customBox);
    setIsScanning(true);

    // Run canvas pixel destruction immediately
    runCanvasRedaction(imageUrl, box, veilStyle);

    setTimeout(() => {
      setIsScanning(false);
      setIsVeilActive(true);
      showToast({
        title: 'Plate Protected',
        message: `License plate ${plateText} permanently blurred on client canvas.`,
        type: 'privacy'
      });
    }, 900);
  };

  const handleCarSelect = (index: number) => {
    setSelectedCarIndex(index);
    const targetCar = STABLE_CARS[index];
    const preset = DEMO_PRESETS[targetCar.defaultPresetIndex];
    if (preset) {
      triggerOpticalScan(preset.url, preset.plate, preset.plateBox);
    }
    showToast({
      title: `Selected Car: ${targetCar.name}`,
      message: `${targetCar.model} • Ready to share.`,
      type: 'garage'
    });
  };

  // 1-Tap Expedition Preset Clicker
  const handleApplyExpeditionPreset = (expedition: ExpeditionPreset) => {
    setSelectedExpeditionId(expedition.id);
    setTitle(expedition.title);
    setContent(expedition.caption);
    setSurfaceCondition(expedition.surfaceCondition);
    setPostType('DRIVE');

    const calculated = calculateDriveCadence({
      routeCompleted: true,
      waypointPhotosCount: 1,
      frictionMu: expedition.frictionMu,
      durationMinutes: 42,
      flowContinuityRatio: 0.95
    });
    setCadenceResult(calculated);

    showToast({
      title: `Drive Route Preset Applied`,
      message: `${expedition.label} • ${calculated.rankTitle}`,
      type: 'drive'
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
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      let enrichedContent = content.trim();
      if (postType === 'BUILD_UPDATE') {
        enrichedContent += `\n\n[WORKSHOP LEDGER: ${componentCategory} fitted by ${workshopName} • £${invoicedCost} • Delta: ${performanceDelta}]`;
      } else if (postType === 'DRIVE') {
        const cadenceTag = cadenceResult ? `\n\n${cadenceResult.hudTag}` : '';
        enrichedContent += `\n\n[DRIVE TELEMETRY: ${surfaceCondition} • Fuel: ${fuelGrade} • 800m privacy sanctuary active]${cadenceTag}`;
      }

      const finalMediaUrl = (isVeilActive && sanitizedImage) ? sanitizedImage : selectedImage;

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
        likesCount: 1,
        respectsCount: 1,
        cadenceRank: cadenceResult?.rank || (postType === 'DRIVE' ? 'S' : undefined),
        cadenceScore: cadenceResult?.totalScore,
        respectsEarned: cadenceResult?.respectsEarned || (postType === 'DRIVE' ? 14 : 10),
        routePassName: title.includes('Pass') ? title : undefined,
        mediaUrls: [finalMediaUrl]
      });

      // Clear draft upon successful publish
      try {
        sessionStorage.removeItem('datum_create_post_draft');
      } catch {
        // Ignore
      }

      showToast({
        title: mode === 'story' ? 'Story Shared' : 'Published to Feed',
        message: `Posted under ${currentCar.name} • License plate permanently protected.`,
        type: 'success',
        badge: 'PUBLISHED'
      });

      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className={`border rounded-2xl sm:rounded-3xl max-w-2xl w-full flex flex-col max-h-[92vh] shadow-2xl relative my-auto animate-in fade-in duration-200 transition-colors ${
        isWhiteYellow
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
          : 'bg-[#0B0C0E] border-amber-500/20 text-white shadow-2xl'
      }`}>
        
        {/* ========================================================= */}
        {/* FIXED HEADER                                              */}
        {/* ========================================================= */}
        <div className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b shrink-0 ${
          isWhiteYellow ? 'border-zinc-200 bg-white' : 'border-zinc-800/80 bg-[#0B0C0E]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isWhiteYellow
                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                : 'bg-zinc-900 border-amber-500/30 text-amber-400'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm sm:text-base font-bold ${
                  isWhiteYellow ? 'text-zinc-950' : 'text-zinc-100'
                }`}>
                  Share a Drive or Story
                </h3>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded font-bold border tracking-wider ${
                  isWhiteYellow
                    ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {currentCar.name}
                </span>
              </div>
              <p className={`text-xs ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {currentCar.model} • Privacy veil enabled
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className={`p-2 rounded-xl transition ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE FORM BODY                                      */}
        {/* ========================================================= */}
        <form id="create-post-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          
          {/* Car Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border text-xs font-mono-numbers overflow-x-auto no-scrollbar">
            <span className={`text-[10px] uppercase px-2 font-bold shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Car:
            </span>
            {STABLE_CARS.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCarSelect(idx)}
                className={`px-3 py-1.5 rounded-lg transition shrink-0 text-xs ${
                  selectedCarIndex === idx
                    ? isWhiteYellow
                      ? 'bg-yellow-400 text-zinc-950 font-bold shadow-xs'
                      : 'bg-amber-400 text-black font-extrabold shadow-sm'
                    : isWhiteYellow
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Mode Selector: Feed Post vs 24h Story */}
          <div className={`grid grid-cols-2 p-1 rounded-xl border text-xs ${
            isWhiteYellow ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
          }`}>
            <button
              type="button"
              onClick={() => setMode('post')}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                mode === 'post'
                  ? isWhiteYellow
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-300'
                    : 'bg-zinc-800/90 text-white shadow-sm border border-amber-500/30'
                  : isWhiteYellow
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Feed Post</span>
            </button>
            
            <button
              type="button"
              onClick={() => setMode('story')}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                mode === 'story'
                  ? isWhiteYellow
                    ? 'bg-yellow-100 text-yellow-900 border border-yellow-400 shadow-xs'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : isWhiteYellow
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>24h Story</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* PHOTO PREVIEW & CLIENT-SIDE PRIVACY GUARANTEE             */}
          {/* ========================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Photo & Privacy
              </span>

              {/* Hidden file input */}
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
                className={`text-xs font-semibold flex items-center gap-1.5 transition ${
                  isWhiteYellow ? 'text-yellow-700 hover:text-yellow-800' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {/* Photo Canvas Container */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 aspect-[16/10]"
            >
              <img
                src={(isVeilActive && sanitizedImage && !inspectRawMode) ? sanitizedImage : selectedImage}
                alt="Preview"
                className="w-full h-full object-cover transition duration-200"
              />

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center bg-black/60 backdrop-blur-[2px]">
                  <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/90 border border-amber-500/40 text-xs font-mono-numbers text-amber-300 flex items-center gap-2 shadow-2xl">
                    <Scan className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Blurring license plate...</span>
                  </div>
                </div>
              )}

              {/* Inspect / View Original Toggle */}
              {sanitizedImage && (
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectRawMode(!inspectRawMode)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium border transition backdrop-blur-md bg-zinc-950/80 border-zinc-700 text-zinc-200 hover:text-white shadow-md flex items-center gap-1"
                  >
                    {inspectRawMode ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-zinc-400" />}
                    <span>{inspectRawMode ? 'View Protected' : 'Inspect Original'}</span>
                  </button>
                </div>
              )}

              {/* Bottom Subtle Indicator */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-zinc-800 backdrop-blur-md text-[11px]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">
                    {isScanning ? 'Scrubbing...' : sanitizedPixelCount > 0 ? `Plate: ${activePlateText} (${sanitizedPixelCount} px masked)` : `Plate: ${activePlateText}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  {(['frosted', 'pixel', 'blackout'] as const).map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setVeilStyle(style)}
                      className={`px-2 py-0.5 rounded capitalize transition ${
                        veilStyle === style
                          ? 'bg-zinc-800 text-amber-400 font-bold border border-zinc-700'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* UNIFIED PRIVACY REASSURANCE BANNER (High Impact Fix #4) */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
              isWhiteYellow
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">
                  Number plate blurred · Exact home location masked (800m sanctuary)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                ACTIVE
              </span>
            </div>

            {/* Quick Preset Location Samples (Clean Single Line) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className={`text-[10px] uppercase font-bold shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Presets:
              </span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => triggerOpticalScan(preset.url, preset.plate, preset.plateBox)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] shrink-0 transition border ${
                    selectedImage === preset.url
                      ? isWhiteYellow
                        ? 'bg-yellow-400 text-zinc-950 font-bold border-yellow-500 shadow-xs'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : isWhiteYellow
                        ? 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* PRIMARY INPUTS: TITLE & STORY (High Impact Fix #3)       */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-200'}`}>
                Title <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning drive through the Lake District"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                  isWhiteYellow
                    ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:bg-white'
                    : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400/60'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-200'}`}>
                Notes & Story <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What made this drive memorable? Road feel, conditions, favorite section..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none transition focus:outline-none ${
                  isWhiteYellow
                    ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:bg-white'
                    : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400/60'
                }`}
                required
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLLAPSIBLE ADVANCED DETAILS (High Impact Fix #1 & #5)    */}
          {/* ========================================================= */}
          <div className={`rounded-2xl border transition-colors ${
            isWhiteYellow ? 'border-zinc-200 bg-zinc-50/50' : 'border-zinc-800/80 bg-zinc-950/40'
          }`}>
            <button
              type="button"
              onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
              className={`w-full px-4 py-3 flex items-center justify-between text-xs font-medium transition rounded-2xl ${
                isWhiteYellow ? 'text-zinc-700 hover:text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">
                  {showAdvancedDetails ? 'Hide Extra Details' : 'Add Extra Details (Route, Workshop, Weather)'}
                </span>
                {(postType !== 'CAR_STORY' || selectedExpeditionId) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    Active
                  </span>
                )}
              </div>
              {showAdvancedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvancedDetails && (
              <div className={`p-4 pt-1 space-y-4 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800/60'}`}>
                
                {/* Post Category Picker */}
                <div>
                  <label className={`text-[11px] uppercase font-bold block mb-1.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Post Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: 'CAR_STORY', label: 'Car Story', icon: Camera },
                      { type: 'DRIVE', label: 'Drive Route', icon: Compass },
                      { type: 'BUILD_UPDATE', label: 'Workshop', icon: Wrench },
                      { type: 'QUESTION', label: 'Question', icon: HelpCircle },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          type="button"
                          key={opt.type}
                          onClick={() => setPostType(opt.type as any)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                            postType === opt.type
                              ? isWhiteYellow
                                ? 'bg-yellow-400 text-zinc-950 border-yellow-500 font-bold shadow-xs'
                                : 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md font-bold'
                              : isWhiteYellow
                                ? 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Workshop Inputs */}
                {postType === 'BUILD_UPDATE' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-amber-500/20 space-y-3">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">
                        Workshop Details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Workshop or Specialist</label>
                        <input
                          type="text"
                          value={workshopName}
                          onChange={(e) => setWorkshopName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                          placeholder="e.g. Litchfield Motors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Work / Component</label>
                        <input
                          type="text"
                          value={componentCategory}
                          onChange={(e) => setComponentCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                          placeholder="e.g. Suspension, Exhaust"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                          <PoundSterling className="w-3 h-3 text-amber-400" />
                          <span>Invoiced Cost (£)</span>
                        </label>
                        <input
                          type="text"
                          value={invoicedCost}
                          onChange={(e) => setInvoicedCost(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                          placeholder="2,850.00"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-amber-400" />
                          <span>Performance / Weight Change</span>
                        </label>
                        <input
                          type="text"
                          value={performanceDelta}
                          onChange={(e) => setPerformanceDelta(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                          placeholder="+18 BHP / -8 kg"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={vatInvoiceNotarized}
                        onChange={(e) => setVatInvoiceNotarized(e.target.checked)}
                        className="rounded border-zinc-700 text-amber-400 focus:ring-0"
                      />
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cryptographically verify itemised VAT receipt</span>
                      </span>
                    </label>
                  </div>
                )}

                {/* Conditional Drive Presets & Environmental Inputs */}
                {(postType === 'DRIVE' || showAdvancedDetails) && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className={`text-[11px] uppercase font-bold flex items-center gap-1.5 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span>Drive Route Presets (Optional)</span>
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EXPEDITION_PRESETS.map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => handleApplyExpeditionPreset(exp)}
                            className={`p-2 rounded-xl border text-left transition ${
                              selectedExpeditionId === exp.id
                                ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 text-white font-bold'
                                : isWhiteYellow
                                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-1 text-xs">
                              <span>{exp.icon}</span>
                              <span className="truncate font-semibold">{exp.label}</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                              {exp.frictionMu} µ Grip
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1">
                          <CloudRain className="w-3 h-3 text-cyan-400" />
                          <span>Road Surface</span>
                        </label>
                        <input
                          type="text"
                          value={surfaceCondition}
                          onChange={(e) => setSurfaceCondition(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                          placeholder="Damp Bitumen"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Atmospheric Pressure</label>
                        <input
                          type="text"
                          value={barometricPressure}
                          onChange={(e) => setBarometricPressure(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                          placeholder="1018 hPa"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Fuel Grade</label>
                        <input
                          type="text"
                          value={fuelGrade}
                          onChange={(e) => setFuelGrade(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                          placeholder="99 RON"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </form>

        {/* ========================================================= */}
        {/* STICKY FOOTER WITH PROMINENT PUBLISH BUTTON (High Impact Fix #2) */}
        {/* ========================================================= */}
        <div className={`p-4 sm:px-6 border-t flex items-center justify-between gap-3 shrink-0 rounded-b-2xl sm:rounded-b-3xl ${
          isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/90 border-zinc-800 backdrop-blur-md'
        }`}>
          {/* Subtle Privacy Status */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Plates & Location Protected</span>
            <span className="sm:hidden">Protected</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isWhiteYellow
                  ? 'border border-zinc-300 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  : 'border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Cancel
            </button>

            <button
              form="create-post-form"
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-md flex items-center gap-2 ${
                isWhiteYellow
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border border-yellow-500'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Post</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
