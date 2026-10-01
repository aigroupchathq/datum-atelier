import { useState, useMemo } from 'react';
import type { FC } from 'react';
import {
  X,
  Sparkles,
  Sun,
  Droplets,
  Wind,
  ShieldCheck,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Flame,
  Lightbulb
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ArchitecturalChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChassis?: string;
}

export type FloorFinishId = 'terrazzo' | 'slate' | 'oak' | 'concrete';
export type WallFinishId = 'slatted_oak' | 'cotswold_stone' | 'carbon_fluted' | 'gallery_white';
export type LightingPresetId = 'warm_mayfair' | 'daylight_studio' | 'dramatic_spot' | 'nocturne_glow';
export type ChassisPlacementId = 'maya' | 'kuro' | 'sanctuary' | 'dan' | 'empty';

interface FloorFinish {
  id: FloorFinishId;
  name: string;
  subtitle: string;
  colorHex: string;
  texturePattern: string;
  reflectivityPct: number;
  frictionMu: number;
  description: string;
}

interface WallFinish {
  id: WallFinishId;
  name: string;
  subtitle: string;
  acousticNrcScore: number;
  textureCss: string;
  description: string;
}

interface ChassisOption {
  id: ChassisPlacementId;
  name: string;
  badge: string;
  model: string;
  imageSrc: string;
  paint: string;
  dimensions: string;
}

const FLOOR_FINISHES: Record<FloorFinishId, FloorFinish> = {
  terrazzo: {
    id: 'terrazzo',
    name: 'Mayfair Polished Terrazzo',
    subtitle: 'Carrara Marble & Brass Inlay Grid',
    colorHex: '#27272A',
    texturePattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)',
    reflectivityPct: 82,
    frictionMu: 0.94,
    description: 'Ultra-dense cast Italian marble chips diamond-ground to 3000 grit. Embedded 4mm solid brass expansion grid provides mirror-like floor reflections under spot fixtures.'
  },
  slate: {
    id: 'slate',
    name: 'Monolithic Brushed Slate',
    subtitle: 'Welsh Cleft Stone & Beveled Joints',
    colorHex: '#141416',
    texturePattern: 'linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%)',
    reflectivityPct: 35,
    frictionMu: 0.98,
    description: 'Deep natural charcoal cleft stone brushed with matte hydrophobic sealant. Zero glare with high acoustic absorption and integrated drainage gutters.'
  },
  oak: {
    id: 'oak',
    name: 'Smoked French Oak Parquet',
    subtitle: 'Chevron Hardwood with Oiled Finish',
    colorHex: '#221812',
    texturePattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 10px, transparent 10px, transparent 20px)',
    reflectivityPct: 48,
    frictionMu: 0.88,
    description: 'Select-grade French white oak fumed with natural tannin reaction for deep hazelnut undertones. Warm underfoot with tactile bespoke residence presence.'
  },
  concrete: {
    id: 'concrete',
    name: 'Cast Architectural Concrete',
    subtitle: 'Monolithic Silicate Burnished Slab',
    colorHex: '#1C1D21',
    texturePattern: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 0)',
    reflectivityPct: 58,
    frictionMu: 0.91,
    description: 'Poured-in-place high-density silicate floor treated with lithium densifier. Minimalist industrial gallery aesthetic engineered for 10-tonne axle loads.'
  }
};

const WALL_FINISHES: Record<WallFinishId, WallFinish> = {
  slatted_oak: {
    id: 'slatted_oak',
    name: 'Nordic Slatted Acoustic Oak',
    subtitle: 'Sound-Damping Timber Battens (NRC 0.85)',
    acousticNrcScore: 0.85,
    textureCss: 'repeating-linear-gradient(90deg, #18130E, #18130E 14px, #0A0806 14px, #0A0806 20px)',
    description: 'Vertical solid oak ribs mounted on recycled acoustic PET felt. Eliminates mechanical engine flutter echo, providing concert-hall clarity during warm-up idles.'
  },
  cotswold_stone: {
    id: 'cotswold_stone',
    name: 'Cotswold Ashlar Drystone',
    subtitle: 'Hand-Chiseled Oolitic Limestone',
    acousticNrcScore: 0.45,
    textureCss: 'linear-gradient(to right, #1E1A16, #28221D)',
    description: 'Locally quarried honeyed limestone laid in traditional coursed ashlar bond. Authentic Cotswold barn architecture combined with modern thermal mass insulation.'
  },
  carbon_fluted: {
    id: 'carbon_fluted',
    name: 'Carbon Fluted Ceramic Ribs',
    subtitle: 'Aeronautical Matte Black Anodized Louvres',
    acousticNrcScore: 0.78,
    textureCss: 'repeating-linear-gradient(90deg, #111113, #111113 8px, #080809 8px, #080809 12px)',
    description: 'Extruded high-fired ceramic louvres with radar-absorbent matte carbon coating. Provides futuristic hypercar enclosure aesthetic with integrated perimeter LED tracks.'
  },
  gallery_white: {
    id: 'gallery_white',
    name: 'Museum White Monolith',
    subtitle: 'Seamless Acoustic Plasterboard',
    acousticNrcScore: 0.65,
    textureCss: 'linear-gradient(180deg, #202024, #18181B)',
    description: 'Flawlessly skimmed Baswaphon micro-porous acoustic plaster. Pure minimalist backdrop allowing the coachwork silhouette and paint metallic flake to dominate.'
  }
};

const CHASSIS_OPTIONS: Record<ChassisPlacementId, ChassisOption> = {
  maya: {
    id: 'maya',
    name: 'MAYA',
    badge: 'M3 Competition',
    model: 'BMW M3 Competition (G80)',
    imageSrc: '/real_uk_m3_cottage.jpg',
    paint: 'Isle of Man Green Metallic',
    dimensions: '4,794mm × 1,903mm × 1,433mm'
  },
  kuro: {
    id: 'kuro',
    name: 'KURO',
    badge: 'GT3 Touring',
    model: 'Porsche 911 GT3 Touring (992.1)',
    imageSrc: '/real_uk_gt3_suburb.jpg',
    paint: 'Crayon / Chalk Non-Metallic',
    dimensions: '4,573mm × 1,852mm × 1,279mm'
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'COBRA & FERRARI',
    badge: 'Sanctuary Duo',
    model: 'Shelby 427 S/C & Ferrari 488 Spider',
    imageSrc: '/feed/stone_garage_cobra_ferrari.jpg',
    paint: 'Guardsman Blue & Rosso Corsa',
    dimensions: 'Dual Bay Paddock Layout'
  },
  dan: {
    id: 'dan',
    name: 'RETRO MOD',
    badge: 'E30 318is',
    model: 'BMW 318is Slicktop (E30)',
    imageSrc: '/real_uk_e30_terrace.jpg',
    paint: 'Brilliant Red (Brilliantrot)',
    dimensions: '4,325mm × 1,645mm × 1,380mm'
  },
  empty: {
    id: 'empty',
    name: 'COMMISSIONING PLINTH',
    badge: 'Empty Bay 01',
    model: 'Reserved for Incoming Atelier Chassis',
    imageSrc: '/splash_curated.jpg',
    paint: 'Architectural Oak & Brushed Slate Plinth',
    dimensions: '6,200mm × 3,800mm Clear Bay'
  }
};

export const ArchitecturalChamberModal: FC<ArchitecturalChamberModalProps> = ({
  isOpen,
  onClose,
  initialChassis = 'maya'
}) => {
  const { showToast } = useToast();

  // Spatial Customization State
  const [selectedChassis, setSelectedChassis] = useState<ChassisPlacementId>(
    (initialChassis as ChassisPlacementId) in CHASSIS_OPTIONS ? (initialChassis as ChassisPlacementId) : 'maya'
  );
  const [selectedFloor, setSelectedFloor] = useState<FloorFinishId>('terrazzo');
  const [selectedWall, setSelectedWall] = useState<WallFinishId>('slatted_oak');
  
  // Lighting Physics Controls
  const [kelvinTemp, setKelvinTemp] = useState<number>(3200); // 2200K (Candle) to 6000K (Daylight)
  const [luxIntensity, setLuxIntensity] = useState<number>(85); // 0 to 100%
  const [spotlightFocus, setSpotlightFocus] = useState<boolean>(true);
  const [perimeterCove, setPerimeterCove] = useState<boolean>(true);
  const [floorGrazingUplight, setFloorGrazingUplight] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);

  // Climate Control Simulation State
  const [targetHumidity] = useState<number>(48.5);
  const [targetTempC] = useState<number>(20.8);
  const [hepaAirChangesPerHour] = useState<number>(4.8);

  const chassis = CHASSIS_OPTIONS[selectedChassis];
  const floor = FLOOR_FINISHES[selectedFloor];
  const wall = WALL_FINISHES[selectedWall];

  // Derive Dynamic Kelvin Light Color
  const kelvinRgb = useMemo(() => {
    // Approximate Kelvin to RGB tint
    if (kelvinTemp <= 2700) return 'rgba(255, 175, 95, ';
    if (kelvinTemp <= 3500) return 'rgba(255, 205, 140, ';
    if (kelvinTemp <= 4500) return 'rgba(255, 235, 205, ';
    if (kelvinTemp <= 5500) return 'rgba(240, 245, 255, ';
    return 'rgba(215, 235, 255, ';
  }, [kelvinTemp]);

  const handleApplyPreset = (preset: LightingPresetId) => {
    switch (preset) {
      case 'warm_mayfair':
        setKelvinTemp(2700);
        setLuxIntensity(75);
        setSpotlightFocus(true);
        setPerimeterCove(true);
        setFloorGrazingUplight(true);
        setSelectedFloor('terrazzo');
        setSelectedWall('slatted_oak');
        break;
      case 'daylight_studio':
        setKelvinTemp(5600);
        setLuxIntensity(100);
        setSpotlightFocus(true);
        setPerimeterCove(true);
        setFloorGrazingUplight(false);
        setSelectedFloor('concrete');
        setSelectedWall('gallery_white');
        break;
      case 'dramatic_spot':
        setKelvinTemp(3200);
        setLuxIntensity(95);
        setSpotlightFocus(true);
        setPerimeterCove(false);
        setFloorGrazingUplight(true);
        setSelectedFloor('slate');
        setSelectedWall('carbon_fluted');
        break;
      case 'nocturne_glow':
        setKelvinTemp(2200);
        setLuxIntensity(40);
        setSpotlightFocus(false);
        setPerimeterCove(true);
        setFloorGrazingUplight(true);
        setSelectedFloor('oak');
        setSelectedWall('cotswold_stone');
        break;
    }
    showToast({
      title: 'Architectural Preset Applied',
      message: `Tuned chamber to ${preset.replace(/_/g, ' ').toUpperCase()}`,
      type: 'garage',
      badge: 'ARCH'
    });
  };

  const handleCopySpec = () => {
    const spec = `DATUM ATELIER // ARCHITECTURAL CHAMBER SPECIFICATION
Chassis Placement: ${chassis.model} (${chassis.paint})
Floor Finish     : ${floor.name} (${floor.subtitle}) [Friction μ ${floor.frictionMu}]
Wall System      : ${wall.name} [Acoustic NRC ${wall.acousticNrcScore}]
Lighting Engine  : ${kelvinTemp}K Color Temp • ${luxIntensity}% Lux Output
Fixtures Active  : ${spotlightFocus ? 'Spot Gimbal • ' : ''}${perimeterCove ? 'Perimeter Cove • ' : ''}${floorGrazingUplight ? 'Floor Uplight' : ''}
Climate Enclave  : ${targetTempC}°C Target • ${targetHumidity}% RH • ${hepaAirChangesPerHour} ACH HEPA
Provenance Hash  : ED25519-ARCH-${Date.now().toString(36).toUpperCase()}`;

    navigator.clipboard.writeText(spec);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);

    showToast({
      title: 'Chamber Dossier Copied',
      message: 'Architectural specification exported to clipboard',
      type: 'success',
      badge: 'COPIED'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose} 
      />

      {/* Main Container */}
      <div 
        className={`relative z-10 w-full transition-all duration-300 flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${
          isFullscreen 
            ? 'h-full max-h-screen rounded-none' 
            : 'max-w-7xl h-[92vh] max-h-[960px] mx-4'
        }`}
        style={{
          backgroundColor: 'var(--bg-void)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* ========================================================= */}
        {/* 1. TOP HEADER: ARCHITECTURAL EMBLEM + CONTROLS           */}
        {/* ========================================================= */}
        <header 
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-3.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#09090B',
                borderColor: 'var(--border-default)'
              }}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h2 
                  className="font-luxury-display text-sm sm:text-base font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Architectural Chamber Designer
                </h2>
                <span className="font-serif italic text-xs hidden sm:inline" style={{ color: 'var(--accent)' }}>
                  Vol. IV Spatial Studio
                </span>
              </div>
              <p className="text-[10px] font-mono-numbers tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
                Bespoke Lighting Physics • Acoustic Slats • Terrazzo Reflectivity • HEPA Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Spec Button */}
            <button
              onClick={handleCopySpec}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono-numbers transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
              title="Copy Architectural Specification"
            >
              {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSpec ? 'Copied' : 'Export Dossier'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg border text-zinc-400 hover:text-white transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)'
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chamber'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border text-zinc-400 hover:text-white transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. BODY: 3D ISOMETRIC STAGE + RIGHT CONTROL COLUMN        */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* ───────────────────────────────────────────────────────── */}
          {/* LEFT: INTERACTIVE SPATIAL CHAMBER RENDER STAGE           */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex-1 relative overflow-hidden bg-black flex flex-col justify-between p-6">
            
            {/* Dynamic Wall Texture (Background Layer) */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{
                background: wall.textureCss,
                opacity: 0.85
              }}
            />

            {/* Dynamic Perimeter Cove Lighting Glow (Top Ceiling Rail) */}
            {perimeterCove && (
              <div 
                className="absolute top-0 inset-x-0 h-36 blur-3xl pointer-events-none transition-all duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${kelvinRgb}${luxIntensity * 0.007}), transparent)`
                }}
              />
            )}

            {/* Top Stage Badges: Climate & Spatial Info */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
              {/* Chassis Badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono-numbers">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="font-bold text-white uppercase">{chassis.name}</span>
                <span className="text-zinc-400">• {chassis.paint}</span>
              </div>

              {/* Climate Telemetry Pill */}
              <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono-numbers text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{hepaAirChangesPerHour} ACH HEPA</span>
                </div>
                <span className="text-zinc-600">|</span>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{targetTempC}°C</span>
                </div>
                <span className="text-zinc-600">|</span>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{targetHumidity}% RH</span>
                </div>
              </div>
            </div>

            {/* Center: Interactive Perspective Floor Plinth + Vehicle Composite */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center">
              
              {/* Perspective Isometric Floor Plinth */}
              <div 
                className="relative w-full max-w-2xl h-80 sm:h-96 rounded-3xl overflow-hidden border shadow-2xl transition-all duration-700 flex items-center justify-center"
                style={{
                  backgroundColor: floor.colorHex,
                  backgroundImage: floor.texturePattern,
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 100px rgba(0,0,0,0.6)`
                }}
              >
                {/* Vehicle Photographic Artwork */}
                <div className="relative w-full h-full p-6 flex items-center justify-center">
                  <img 
                    src={chassis.imageSrc} 
                    alt={chassis.name}
                    className="w-full h-full object-cover object-center rounded-2xl transition-all duration-700 shadow-2xl"
                    style={{
                      filter: `brightness(${0.75 + (luxIntensity / 100) * 0.4}) contrast(1.05)`,
                    }}
                  />

                  {/* Dynamic Floor Reflection Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%, ${kelvinRgb}${luxIntensity * 0.003}) 100%)`,
                      opacity: floor.reflectivityPct / 100
                    }}
                  />

                  {/* Focused Downlight Spotlight Cone */}
                  {spotlightFocus && (
                    <div 
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-3/4 rounded-full blur-2xl pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle, ${kelvinRgb}${luxIntensity * 0.006}) 0%, transparent 70%)`
                      }}
                    />
                  )}

                  {/* Floor Grazing Uplight Glow */}
                  {floorGrazingUplight && (
                    <div 
                      className="absolute -bottom-8 inset-x-12 h-24 blur-xl pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(ellipse at bottom, ${kelvinRgb}${luxIntensity * 0.005}) 0%, transparent 80%)`
                      }}
                    />
                  )}
                </div>

                {/* Floor Plinth Metadata Inlay Badge */}
                <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono-numbers text-zinc-300">
                  <span className="font-bold text-white uppercase">{floor.name}</span>
                  <span>•</span>
                  <span>μ {floor.frictionMu} Grip</span>
                  <span>•</span>
                  <span>{floor.reflectivityPct}% Specular</span>
                </div>

              </div>

            </div>

            {/* Bottom Quick Preset Strip */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono-numbers text-zinc-400">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span>Curated Lighting Ambience:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'warm_mayfair', label: '2700K Mayfair Vault' },
                  { id: 'daylight_studio', label: '5600K Studio White' },
                  { id: 'dramatic_spot', label: 'Dramatic Shadow' },
                  { id: 'nocturne_glow', label: '2200K Nocturne' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p.id as LightingPresetId)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono-numbers text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* RIGHT: ARCHITECTURAL CUSTOMIZATION TUNER                  */}
          {/* ───────────────────────────────────────────────────────── */}
          <div 
            className="w-full lg:w-96 p-6 border-t lg:border-t-0 lg:border-l overflow-y-auto space-y-6"
            style={{ 
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            
            {/* 1. CHASSIS PLACEMENT SELECTOR */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono-numbers uppercase tracking-widest font-bold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>1. Vehicle Placement</span>
                <span className="text-[10px]" style={{ color: 'var(--accent)' }}>{chassis.badge}</span>
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(CHASSIS_OPTIONS) as ChassisPlacementId[]).map((cId) => {
                  const opt = CHASSIS_OPTIONS[cId];
                  const isSelected = selectedChassis === cId;
                  return (
                    <button
                      key={cId}
                      onClick={() => setSelectedChassis(cId)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected 
                          ? 'shadow-sm border' 
                          : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="text-xs font-bold font-mono-numbers" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {opt.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {opt.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. FLOOR MATERIAL FINISH */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono-numbers uppercase tracking-widest font-bold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>2. Floor Architectural Finish</span>
                <span className="text-[10px] text-zinc-400">{floor.reflectivityPct}% Reflective</span>
              </label>

              <div className="space-y-2">
                {(Object.keys(FLOOR_FINISHES) as FloorFinishId[]).map((fId) => {
                  const f = FLOOR_FINISHES[fId];
                  const isSelected = selectedFloor === fId;
                  return (
                    <div
                      key={fId}
                      onClick={() => setSelectedFloor(fId)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected 
                          ? 'border' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: f.colorHex }}
                          />
                          <span className="text-xs font-bold font-mono-numbers" style={{ color: 'var(--text-primary)' }}>
                            {f.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-numbers text-zinc-400">
                          μ {f.frictionMu}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 pl-6">
                        {f.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. WALL ACOUSTIC CLADDING */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono-numbers uppercase tracking-widest font-bold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>3. Acoustic Wall Cladding</span>
                <span className="text-[10px] text-emerald-400">NRC {wall.acousticNrcScore}</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(WALL_FINISHES) as WallFinishId[]).map((wId) => {
                  const w = WALL_FINISHES[wId];
                  const isSelected = selectedWall === wId;
                  return (
                    <button
                      key={wId}
                      onClick={() => setSelectedWall(wId)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected ? 'border shadow-xs' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="text-xs font-bold font-mono-numbers truncate" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {w.name}
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">
                        NRC {w.acousticNrcScore}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. LIGHTING PHYSICS ENGINE TUNER */}
            <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <label className="text-[11px] font-mono-numbers uppercase tracking-widest font-bold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span>4. Optical Color Temp & Lux</span>
                </span>
                <span className="font-bold text-xs" style={{ color: 'var(--accent)' }}>{kelvinTemp}K</span>
              </label>

              {/* Kelvin Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="2200"
                  max="6500"
                  step="100"
                  value={kelvinTemp}
                  onChange={(e) => setKelvinTemp(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-zinc-800"
                />
                <div className="flex justify-between text-[9px] font-mono-numbers text-zinc-500">
                  <span>2200K (Candle Warm)</span>
                  <span>4000K (Neutral)</span>
                  <span>6500K (Cool Daylight)</span>
                </div>
              </div>

              {/* Lux Intensity Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono-numbers text-zinc-400">
                  <span>Illuminance Flux</span>
                  <span className="font-bold text-white">{luxIntensity}% ({(luxIntensity * 12).toFixed(0)} Lux)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={luxIntensity}
                  onChange={(e) => setLuxIntensity(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer h-1.5 rounded-lg bg-zinc-800"
                />
              </div>

              {/* Fixture Toggles */}
              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <button
                  onClick={() => setSpotlightFocus(!spotlightFocus)}
                  className={`px-2 py-1.5 rounded-lg border text-[10px] font-mono-numbers transition cursor-pointer text-center ${
                    spotlightFocus ? 'border font-bold' : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: spotlightFocus ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: spotlightFocus ? 'var(--accent)' : 'var(--border-subtle)',
                    color: spotlightFocus ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  Spotlights
                </button>

                <button
                  onClick={() => setPerimeterCove(!perimeterCove)}
                  className={`px-2 py-1.5 rounded-lg border text-[10px] font-mono-numbers transition cursor-pointer text-center ${
                    perimeterCove ? 'border font-bold' : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: perimeterCove ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: perimeterCove ? 'var(--accent)' : 'var(--border-subtle)',
                    color: perimeterCove ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  Cove Rail
                </button>

                <button
                  onClick={() => setFloorGrazingUplight(!floorGrazingUplight)}
                  className={`px-2 py-1.5 rounded-lg border text-[10px] font-mono-numbers transition cursor-pointer text-center ${
                    floorGrazingUplight ? 'border font-bold' : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: floorGrazingUplight ? 'var(--bg-elevated)' : 'transparent',
                    borderColor: floorGrazingUplight ? 'var(--accent)' : 'var(--border-subtle)',
                    color: floorGrazingUplight ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  Floor Uplights
                </button>
              </div>

            </div>

            {/* 5. CONSERVATION HVAC SPECS */}
            <div 
              className="p-3.5 rounded-2xl border space-y-2 text-xs font-mono-numbers"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Conservation Enclave</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">HEPA Air Filtration</span>
                  <strong className="text-white">MERV 18 • 99.97%</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Static Dissipation</span>
                  <strong className="text-white">&lt; 100V Conductive</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">VOC Extraction</span>
                  <strong className="text-emerald-400">Active Carbon Bed</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Thermal Mass Drift</span>
                  <strong className="text-white">± 0.2°C / 24h</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. FOOTER ACTIONS                                         */}
        {/* ========================================================= */}
        <footer 
          className="flex flex-wrap items-center justify-between px-6 py-3 border-t text-xs font-mono-numbers shrink-0"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>CHAMBER CODE // LON-MAYFAIR-BAY-01</span>
            <span>•</span>
            <span style={{ color: 'var(--accent)' }}>DESIGNED FOR {chassis.model}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySpec}
              className="px-4 py-1.5 rounded-xl border text-xs font-bold font-mono-numbers transition cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              Copy Chamber Spec
            </button>

            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl text-xs font-bold font-mono-numbers uppercase tracking-wider transition cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#09090B'
              }}
            >
              Done
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
