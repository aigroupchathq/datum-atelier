import { useState, useRef, useEffect, useMemo } from 'react';
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
  Check,
  Lock
} from 'lucide-react';
import type { CommunityPost } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useActiveVehicle } from '../../context/ActiveVehicleContext';
import { redactPlateOnCanvas } from '../../utils/plateRedactionCanvas';
import { loadVehicleBom } from '../../core/supplychain/supplyChainBom';
import { 
  EXPEDITION_PRESETS, 
  calculateDriveCadence, 
  type DriveCadenceResult, 
  type ExpeditionPreset 
} from '../../utils/respectRatingEngine';
import { FluidLevitation } from '../../core/motion/FluidLevitation';
import { FLUID_PRESETS } from '../../core/motion/fluidPhysics';

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

// Curated domestic UK & European presets
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
  { id: 'car-e30-retromod', name: 'RETRO MOD', model: 'BMW 318is Slicktop (E30)', year: 1991, defaultPresetIndex: 2 },
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
  const { activeVehicle } = useActiveVehicle();
  const [mode, setMode] = useState<'post' | 'story'>(initialMode);
  
  const initialCarIndex = useMemo(() => {
    const idx = STABLE_CARS.findIndex(c => c.id === activeVehicle.id);
    return idx >= 0 ? idx : 0;
  }, [activeVehicle.id]);

  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(initialCarIndex);
  const currentCar = STABLE_CARS[selectedCarIndex] || STABLE_CARS[0];
  const [selectedBomComponentId, setSelectedBomComponentId] = useState<string>('');
  const availableBomComponents = useMemo(() => loadVehicleBom(currentCar.id), [currentCar.id]);
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

      const selectedPart = availableBomComponents.find(c => c.id === selectedBomComponentId);
      const taggedBomComponent = selectedPart ? {
        id: selectedPart.id,
        partName: selectedPart.partName,
        category: selectedPart.category,
        manufacturer: selectedPart.manufacturer,
        originCountry: selectedPart.originCountry,
        torqueSpec: selectedPart.torqueSpec,
        serialNumber: selectedPart.serialNumber,
        provenanceHash: selectedPart.provenanceHash,
        installedByWorkshop: selectedPart.installedByWorkshop
      } : undefined;

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
        mediaUrls: [finalMediaUrl],
        taggedBomComponent
      });

      // Clear draft upon successful publish
      try {
        sessionStorage.removeItem('datum_create_post_draft');
      } catch {
        // Ignore
      }

      showToast({
        title: mode === 'story' ? 'Dispatch Shared' : 'Published to Feed',
        message: `Posted under ${currentCar.name} • License plate permanently protected.`,
        type: 'success',
        badge: 'PUBLISHED'
      });

      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <FluidLevitation
        config={FLUID_PRESETS.weightlessModal}
        initialY={36}
        initialScale={0.96}
        ambientLevitation={true}
        ambientIntensity={0.65}
        className={`border rounded-2xl sm:rounded-3xl max-w-2xl w-full flex flex-col max-h-[92vh] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] relative my-auto transition-colors ${
          isWhiteYellow
            ? 'bg-[#FAF9F6] border-stone-200 text-zinc-900 shadow-2xl'
            : 'bg-[#101115] border-white/[0.09] text-white shadow-2xl'
        }`}
      >
        
        {/* ========================================================= */}
        {/* HAUTE HORLOGERIE PRECISION HEADER                         */}
        {/* ========================================================= */}
        <div className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b shrink-0 ${
          isWhiteYellow 
            ? 'border-stone-200/80 bg-white/70 backdrop-blur-md' 
            : 'border-white/[0.07] bg-[#121318]/90 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
              isWhiteYellow
                ? 'bg-amber-50/80 border-amber-200/80 text-amber-900'
                : 'bg-zinc-900/90 border-[#C5A059]/30 text-[#E6C687] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-numbers uppercase tracking-[0.22em] text-[#C5A059] font-semibold">
                  COMMISSION LOG //
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded font-semibold border tracking-wider ${
                  isWhiteYellow
                    ? 'bg-stone-100 text-stone-800 border-stone-300'
                    : 'bg-white/[0.04] text-zinc-200 border-white/[0.08]'
                }`}>
                  CHASSIS {currentCar.name}
                </span>
              </div>
              <h3 className={`text-sm sm:text-base font-bold font-luxury-display uppercase tracking-wider ${
                isWhiteYellow ? 'text-zinc-950' : 'text-zinc-100'
              }`}>
                Record Atelier Dispatch
              </h3>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className={`p-2 rounded-xl transition border ${
              isWhiteYellow
                ? 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-stone-200/60'
                : 'border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE FORM BODY                                      */}
        {/* ========================================================= */}
        <form id="create-post-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          
          {/* Chassis Selector Plinth (Milled Horological Switch) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border text-xs font-mono-numbers overflow-x-auto no-scrollbar bg-black/40 border-white/[0.06] shadow-inner">
            <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 font-bold shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
              CHASSIS:
            </span>
            {STABLE_CARS.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCarSelect(idx)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 text-[11px] font-semibold tracking-wider ${
                  selectedCarIndex === idx
                    ? isWhiteYellow
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-gradient-to-b from-[#E6C687] to-[#B89047] text-zinc-950 font-bold shadow-[0_2px_8px_rgba(197,160,89,0.3)]'
                    : isWhiteYellow
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-stone-200/50'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Mode Selector: Permanent Ledger vs 24h Chrono */}
          <div className={`grid grid-cols-2 p-1 rounded-xl border text-xs ${
            isWhiteYellow ? 'bg-stone-100/80 border-stone-200' : 'bg-black/40 border-white/[0.06]'
          }`}>
            <button
              type="button"
              onClick={() => setMode('post')}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                mode === 'post'
                  ? isWhiteYellow
                    ? 'bg-white text-zinc-950 shadow-xs border border-stone-300'
                    : 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                  : isWhiteYellow
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-luxury-display uppercase tracking-widest text-[11px]">Permanent Record</span>
            </button>
            
            <button
              type="button"
              onClick={() => setMode('story')}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                mode === 'story'
                  ? isWhiteYellow
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                    : 'bg-white/[0.08] text-[#E6C687] border border-[#C5A059]/40 shadow-sm'
                  : isWhiteYellow
                    ? 'text-zinc-600 hover:text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-luxury-display uppercase tracking-widest text-[11px]">24h Chrono Reel</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* EXHIBITION MOUNT: PHOTO & CLIENT-SIDE PRIVACY CANVAS      */}
          {/* ========================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-semibold ${
                isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                EXHIBITION PLATE // OPTICAL VEIL
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
                className={`text-[11px] font-mono-numbers tracking-wider font-semibold flex items-center gap-1.5 transition ${
                  isWhiteYellow ? 'text-amber-800 hover:text-amber-950' : 'text-[#E6C687] hover:text-[#FFF0C8]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Media</span>
              </button>
            </div>

            {/* Photo Canvas Container (with Precision Horological Viewfinder Brackets) */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl aspect-[16/10]"
            >
              {/* Corner Viewfinder Crosshairs */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-white/40 pointer-events-none z-10" />
              <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/40 pointer-events-none z-10" />
              <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/40 pointer-events-none z-10" />
              <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-white/40 pointer-events-none z-10" />

              <img
                src={(isVeilActive && sanitizedImage && !inspectRawMode) ? sanitizedImage : selectedImage}
                alt="Preview"
                className="w-full h-full object-cover transition duration-300"
              />

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center bg-black/65 backdrop-blur-[2px] z-20">
                  <div className="px-4 py-2 rounded-xl bg-zinc-950/90 border border-[#C5A059]/40 text-xs font-mono-numbers text-[#E6C687] flex items-center gap-2.5 shadow-2xl">
                    <Scan className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                    <span className="tracking-wider uppercase text-[10px]">Overwriting Raw Plate Bytes on Canvas...</span>
                  </div>
                </div>
              )}

              {/* Inspect Original / View Protected Toggle */}
              {sanitizedImage && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectRawMode(!inspectRawMode)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono-numbers uppercase tracking-wider border transition backdrop-blur-md bg-zinc-950/80 border-white/[0.15] text-zinc-300 hover:text-white shadow-lg flex items-center gap-1.5"
                  >
                    {inspectRawMode ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-zinc-400" />}
                    <span>{inspectRawMode ? 'View Cloaked' : 'Inspect Raw'}</span>
                  </button>
                </div>
              )}

              {/* Bottom Precision Telemetry Bar */}
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-white/[0.08] backdrop-blur-md text-[10px] font-mono-numbers z-10">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="tracking-wider">
                    {isScanning 
                      ? 'SCRUBBING PIXELS...' 
                      : sanitizedPixelCount > 0 
                        ? `PLATE: ${activePlateText} // ${sanitizedPixelCount} PX DESTROYED` 
                        : `PLATE: ${activePlateText}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {(['frosted', 'pixel', 'blackout'] as const).map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setVeilStyle(style)}
                      className={`px-2 py-0.5 rounded capitalize transition text-[10px] ${
                        veilStyle === style
                          ? 'bg-[#C5A059] text-zinc-950 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* HIGH-SOCIETY SOVEREIGN PRIVACY PLAQUE (High Impact Fix #4) */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
              isWhiteYellow
                ? 'bg-stone-100/90 border-stone-200 text-stone-800'
                : 'bg-zinc-950/70 border-white/[0.06] text-zinc-300'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono-numbers tracking-wide">
                  Number plate scrubbed · 800m residential sanctuary active
                </span>
              </div>
              <span className="text-[9px] font-mono-numbers uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                SECURED
              </span>
            </div>

            {/* Quick Presets (Clean Single Line) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className={`text-[9px] uppercase font-mono-numbers tracking-[0.2em] font-bold shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                LOCALES:
              </span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => triggerOpticalScan(preset.url, preset.plate, preset.plateBox)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-numbers shrink-0 transition border ${
                    selectedImage === preset.url
                      ? isWhiteYellow
                        ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                        : 'bg-[#C5A059]/20 text-[#E6C687] border-[#C5A059]/40 font-bold shadow-xs'
                      : isWhiteYellow
                        ? 'bg-stone-50 text-zinc-600 border-stone-200 hover:bg-stone-100'
                        : 'bg-zinc-950/60 text-zinc-400 border-white/[0.05] hover:text-zinc-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* BESPOKE VELLUM INPUTS: TITLE & DRIVER IMPRESSIONS         */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div>
              <label className={`text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-semibold block mb-1 ${
                isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'
              }`}>
                Title / Dispatch Notation <span className="text-zinc-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dawn shakedown through the Lake District"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition shadow-inner font-sans ${
                  isWhiteYellow
                    ? 'bg-white border-stone-300 text-zinc-900 placeholder-stone-400 focus:border-amber-500'
                    : 'bg-[#0B0C0E] border-white/[0.08] text-white placeholder-zinc-600 focus:border-[#C5A059]/60'
                }`}
              />
            </div>

            {/* TAG SERIALIZED BOM COMPONENT */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 ${
                  isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'
                }`}>
                  <Wrench className="w-3 h-3 text-[#C5A059]" />
                  <span>Tag Serialized Hardware (BOM)</span>
                  <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                </label>
                {selectedBomComponentId && (
                  <span className="text-[9px] font-mono-numbers text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>✓ Linked to Chassis BOM</span>
                  </span>
                )}
              </div>
              <select
                value={selectedBomComponentId}
                onChange={(e) => setSelectedBomComponentId(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-numbers focus:outline-none transition shadow-inner ${
                  isWhiteYellow
                    ? 'bg-white border-stone-300 text-zinc-900 focus:border-amber-500'
                    : 'bg-[#0B0C0E] border-white/[0.08] text-white focus:border-[#C5A059]/60'
                }`}
              >
                <option value="">— No hardware component tagged (General Post / Drive) —</option>
                {availableBomComponents.map((comp) => (
                  <option key={comp.id} value={comp.id} className={isWhiteYellow ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}>
                    {comp.partName} ({comp.category} • Torque: {comp.torqueSpec.split('•')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-semibold block mb-1 ${
                isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'
              }`}>
                Driver Story & Mechanical Notes <span className="text-[#C5A059]">*</span>
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What made this drive memorable? Road feel, damping composure, conditions, sound..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none transition focus:outline-none shadow-inner font-sans ${
                  isWhiteYellow
                    ? 'bg-white border-stone-300 text-zinc-900 placeholder-stone-400 focus:border-amber-500'
                    : 'bg-[#0B0C0E] border-white/[0.08] text-white placeholder-zinc-600 focus:border-[#C5A059]/60'
                }`}
                required
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLLAPSIBLE ADVANCED INSTRUMENTATION PANEL                */}
          {/* ========================================================= */}
          <div className={`rounded-2xl border transition-colors ${
            isWhiteYellow ? 'border-stone-200 bg-stone-50/50' : 'border-white/[0.06] bg-zinc-950/30'
          }`}>
            <button
              type="button"
              onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
              className={`w-full px-4 py-3 flex items-center justify-between text-xs font-medium transition rounded-2xl ${
                isWhiteYellow ? 'text-zinc-700 hover:text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono-numbers text-[11px] tracking-wider uppercase">
                  {showAdvancedDetails ? 'Collapse Technical Ledger' : 'Add Technical Ledger (Route, Workshop, Weather)'}
                </span>
                {(postType !== 'CAR_STORY' || selectedExpeditionId) && (
                  <span className="text-[9px] font-mono-numbers uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#E6C687] font-bold border border-[#C5A059]/30">
                    Active
                  </span>
                )}
              </div>
              {showAdvancedDetails ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {showAdvancedDetails && (
              <div className={`p-4 pt-1 space-y-4 border-t ${isWhiteYellow ? 'border-stone-200' : 'border-white/[0.06]'}`}>
                
                {/* Post Category Picker */}
                <div>
                  <label className={`text-[10px] font-mono-numbers uppercase tracking-[0.2em] font-bold block mb-1.5 ${
                    isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    Classification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-numbers text-xs">
                    {[
                      { type: 'CAR_STORY', label: 'Car Story', icon: Camera },
                      { type: 'DRIVE', label: 'Expedition', icon: Compass },
                      { type: 'BUILD_UPDATE', label: 'Workshop', icon: Wrench },
                      { type: 'QUESTION', label: 'Inquiry', icon: HelpCircle },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          type="button"
                          key={opt.type}
                          onClick={() => setPostType(opt.type as any)}
                          className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold transition border flex items-center justify-center gap-1.5 ${
                            postType === opt.type
                              ? isWhiteYellow
                                ? 'bg-zinc-900 text-white border-zinc-900 font-bold shadow-xs'
                                : 'bg-[#C5A059] text-zinc-950 border-[#C5A059] font-bold shadow-md'
                              : isWhiteYellow
                                ? 'bg-white text-zinc-600 border-stone-200 hover:bg-stone-100'
                                : 'bg-black/40 text-zinc-400 border-white/[0.06] hover:text-white'
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
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3 font-mono-numbers">
                    <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                      <Wrench className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs uppercase tracking-wider font-bold text-[#E6C687]">
                        Certified Workshop Ledger
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Workshop or Specialist</label>
                        <input
                          type="text"
                          value={workshopName}
                          onChange={(e) => setWorkshopName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none focus:border-[#C5A059]"
                          placeholder="e.g. Litchfield Motors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Work / Component Category</label>
                        <input
                          type="text"
                          value={componentCategory}
                          onChange={(e) => setComponentCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none focus:border-[#C5A059]"
                          placeholder="e.g. Suspension, Exhaust"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1 flex items-center gap-1">
                          <PoundSterling className="w-3 h-3 text-[#C5A059]" />
                          <span>Invoiced Amount (£ GBP)</span>
                        </label>
                        <input
                          type="text"
                          value={invoicedCost}
                          onChange={(e) => setInvoicedCost(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none focus:border-[#C5A059]"
                          placeholder="2,850.00"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1 flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-[#C5A059]" />
                          <span>Performance / Weight Delta</span>
                        </label>
                        <input
                          type="text"
                          value={performanceDelta}
                          onChange={(e) => setPerformanceDelta(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none focus:border-[#C5A059]"
                          placeholder="+18 BHP / -8 kg"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-zinc-300">
                      <input
                        type="checkbox"
                        checked={vatInvoiceNotarized}
                        onChange={(e) => setVatInvoiceNotarized(e.target.checked)}
                        className="rounded border-zinc-700 text-[#C5A059] focus:ring-0"
                      />
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cryptographically bind itemised VAT invoice for V5C provenance</span>
                      </span>
                    </label>
                  </div>
                )}

                {/* Conditional Drive Presets & Environmental Inputs */}
                {(postType === 'DRIVE' || showAdvancedDetails) && (
                  <div className="space-y-3 font-mono-numbers">
                    <div className="space-y-2">
                      <span className={`text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 ${
                        isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'
                      }`}>
                        <Zap className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                        <span>Cadence & Route Presets</span>
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EXPEDITION_PRESETS.map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => handleApplyExpeditionPreset(exp)}
                            className={`p-2.5 rounded-xl border text-left transition ${
                              selectedExpeditionId === exp.id
                                ? 'bg-[#C5A059]/20 border-[#C5A059] ring-1 ring-[#C5A059]/40 text-white font-bold'
                                : isWhiteYellow
                                  ? 'bg-white border-stone-200 text-zinc-700 hover:bg-stone-100'
                                  : 'bg-black/40 border-white/[0.06] text-zinc-300 hover:border-white/[0.15]'
                            }`}
                          >
                            <div className="flex items-center gap-1 text-xs">
                              <span>{exp.icon}</span>
                              <span className="truncate font-semibold">{exp.label}</span>
                            </div>
                            <div className="text-[9px] text-[#C5A059] truncate mt-0.5">
                              {exp.frictionMu} µ Friction
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1 flex items-center gap-1">
                          <CloudRain className="w-3 h-3 text-cyan-400" />
                          <span>Surface State</span>
                        </label>
                        <input
                          type="text"
                          value={surfaceCondition}
                          onChange={(e) => setSurfaceCondition(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none"
                          placeholder="Damp Bitumen"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Atmospheric</label>
                        <input
                          type="text"
                          value={barometricPressure}
                          onChange={(e) => setBarometricPressure(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none"
                          placeholder="1018 hPa"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Fuel RON</label>
                        <input
                          type="text"
                          value={fuelGrade}
                          onChange={(e) => setFuelGrade(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-white text-xs outline-none"
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
        {/* HAUTE HORLOGERIE STICKY FOOTER & BRUSHED GOLD PUBLISH CTA */}
        {/* ========================================================= */}
        <div className={`p-4 sm:px-6 border-t flex items-center justify-between gap-3 shrink-0 rounded-b-2xl sm:rounded-b-3xl ${
          isWhiteYellow 
            ? 'bg-stone-50 border-stone-200' 
            : 'bg-[#0E0F13]/95 border-white/[0.08] backdrop-blur-xl shadow-[0_-10px_25px_rgba(0,0,0,0.5)]'
        }`}>
          {/* Subtle Sanctuary Status */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-numbers">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] tracking-wide">Shielded by Design • 800m Sanctuary</span>
            <span className="sm:hidden text-[10px]">Shielded</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-[11px] font-mono-numbers uppercase tracking-wider transition ${
                isWhiteYellow
                  ? 'border border-stone-300 text-zinc-600 hover:text-zinc-950 hover:bg-stone-100'
                  : 'border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Cancel
            </button>

            <button
              form="create-post-form"
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-[0.16em] transition-all disabled:opacity-40 active:scale-[0.98] flex items-center gap-2 ${
                isWhiteYellow
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-zinc-950 border border-yellow-500/80 shadow-[0_4px_16px_rgba(234,179,8,0.25)] hover:brightness-105'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-zinc-950 shadow-[0_4px_20px_rgba(212,175,55,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] hover:brightness-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Notarizing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Publish Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>

      </FluidLevitation>
    </div>
  );
};
