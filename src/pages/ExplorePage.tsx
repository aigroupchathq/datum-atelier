import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveVehicle } from '../context/ActiveVehicleContext';
import {
  parseKinematicSnippet,
  calculateKinematicMatch,
  CURATED_SNIPPETS,
  type AlgorithmWeights
} from '../core/algorithm/semanticKinematicEngine';
import {
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Layers,
  Compass,
  Play,
  Wrench,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Clipboard,
  RotateCcw,
  Activity,
  Zap,
  Mountain,
  Gauge
} from 'lucide-react';

const getCarProfileId = (handle: string): string => {
  const h = handle.toLowerCase();
  if (h.includes('m3') || h.includes('maya') || h.includes('audi') || h.includes('b7')) return 'car-maya-m3';
  if (h.includes('gt3') || h.includes('kuro') || h.includes('supercar') || h.includes('curator')) return 'car-kuro-gt3';
  if (h.includes('e30') || h.includes('classic') || h.includes('heritage') || h.includes('mgb') || h.includes('nova') || h.includes('splitty') || h.includes('barn')) return 'car-e30-retromod';
  if (h.includes('110') || h.includes('overland') || h.includes('defender') || h.includes('expedition') || h.includes('convoy')) return 'car-expedition-110';
  return 'car-maya-m3';
};

interface ExploreItem {
  id: string;
  category: 'pass' | 'track' | 'supercar' | 'build' | 'engine' | 'classic' | 'stance';
  authorHandle: string;
  authorName: string;
  authorCar: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  caption: string;
  telemetryTag?: string;
  isMultiImage?: boolean;
  isVideoReel?: boolean;
  isPro?: boolean;
  spanClass?: string;
  purismScore?: number;
  surfaceCondition?: 'dry' | 'damp' | 'frost';
  peakLateralG?: number;
  provenanceScore?: number;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: 'exp-01',
    category: 'pass',
    authorHandle: 'maya_m3',
    authorName: 'MAYA',
    authorCar: 'BMW M3 Competition (G80)',
    images: [
      '/real_uk_m3_cottage.jpg',
      '/clean_garage_m3.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    likesCount: 1420,
    commentsCount: 118,
    caption: 'Damp morning shakedown outside Cotswolds cottage. KW V4 3-way rebound damping dialled in for undulating B-roads and Roman Way crests.',
    telemetryTag: '1,688 ft Peak · 84.6 mi',
    isMultiImage: true,
    spanClass: 'col-span-1 md:col-span-2 md:row-span-2',
    purismScore: 65,
    surfaceCondition: 'damp',
    peakLateralG: 1.24,
    provenanceScore: 98,
    isPro: true
  },
  {
    id: 'exp-02',
    category: 'supercar',
    authorHandle: 'kuro_gt3',
    authorName: 'KURO',
    authorCar: 'Porsche 911 GT3 (992)',
    images: [
      '/real_uk_gt3_suburb.jpg',
      '/clean_garage_gt3.jpg'
    ],
    likesCount: 2890,
    commentsCount: 164,
    caption: 'British suburban block-paved driveway cold start. 4.0L naturally aspirated flat-six 9,000 RPM idle warm-up with 6-speed purist manual and Michelin Pilot Sport Cup 2 tyres.',
    telemetryTag: '9,000 RPM · 502 BHP',
    isMultiImage: true,
    isVideoReel: true,
    purismScore: 95,
    surfaceCondition: 'dry',
    peakLateralG: 1.38,
    provenanceScore: 99,
    isPro: true
  },
  {
    id: 'exp-03',
    category: 'track',
    authorHandle: 'outcast_vxr',
    authorName: 'Outcast Racing',
    authorCar: 'Vauxhall Zafira VXR Aero Spec',
    images: [
      '/feed/zafira_vxr_outcast_black_red.jpg',
      '/feed/widebody_zafira_speedhunters_aero.jpg'
    ],
    likesCount: 1840,
    commentsCount: 94,
    caption: 'Cadwell Park Hall Bends kerb ride. 28 PSI cold target hit 32 PSI hot perfectly under 1.42G sustained cornering load. Brembo 6-pot forged calipers and Speedhunters aero splitters.',
    telemetryTag: '1:38.4 Cadwell · 1.42G',
    isMultiImage: true,
    purismScore: 78,
    surfaceCondition: 'dry',
    peakLateralG: 1.42,
    provenanceScore: 96,
    isPro: true
  },
  {
    id: 'exp-04',
    category: 'build',
    authorHandle: 'driveway_lab',
    authorName: 'Driveway Detailing',
    authorCar: 'Sunday Decon Routine',
    images: [
      '/real_uk_driveway_wash.jpg',
      '/clean_garage_m3.jpg'
    ],
    likesCount: 1980,
    commentsCount: 142,
    caption: 'Sunday 07:00 AM snow-foam pre-wash outside suburban semi. Bilt-Hamber touchless decon before the road run. Paint micrometer depth verified at 134 microns.',
    telemetryTag: 'Detailing · pH Neutral',
    isMultiImage: true,
    isPro: true,
    purismScore: 80,
    surfaceCondition: 'damp',
    peakLateralG: 0.40,
    provenanceScore: 97
  },
  {
    id: 'exp-05',
    category: 'classic',
    authorHandle: 'barn_concours',
    authorName: 'Barn Heritage',
    authorCar: 'Shelby Cobra & Ferrari 250 GT',
    images: [
      '/stone_garage_cobra_ferrari.jpg',
      '/collective_atelier_hall.jpg'
    ],
    likesCount: 3410,
    commentsCount: 220,
    caption: 'Private Cotswolds stone barn collection resting in ambient dehumidified climate. Hand-formed aluminium bodywork and Weber twin-choke carburettor tune.',
    telemetryTag: 'V8 & V12 · Concours',
    spanClass: 'col-span-1 md:col-span-2 md:row-span-2',
    isMultiImage: true,
    isPro: true,
    purismScore: 99,
    surfaceCondition: 'dry',
    peakLateralG: 0.88,
    provenanceScore: 100
  },
  {
    id: 'exp-06',
    category: 'classic',
    authorHandle: 'e30_heritage',
    authorName: 'RetroMod Dan',
    authorCar: 'BMW 318is (E30) Slicktop',
    images: [
      '/real_uk_e30_terrace.jpg',
      '/heritage_wrenching_workshop.jpg'
    ],
    likesCount: 1250,
    commentsCount: 88,
    caption: 'Victorian terraced street residential parking. 1989 E30 318is factory slicktop sunroof-delete with M42 twin-cam, small-case 4.10 LSD, and period-correct BBS basketweaves.',
    telemetryTag: '1989 Analog · 1,120 kg',
    isMultiImage: true,
    purismScore: 98,
    surfaceCondition: 'dry',
    peakLateralG: 0.95,
    provenanceScore: 98,
    isPro: true
  },
  {
    id: 'exp-07',
    category: 'pass',
    authorHandle: 'overland_convoy',
    authorName: 'Alpine Expedition',
    authorCar: 'Winter Mountain Convoy',
    images: [
      '/snow_mountain_overland_convoy.jpg',
      '/real_uk_defender_farm.jpg'
    ],
    likesCount: 2190,
    commentsCount: 175,
    caption: 'Sub-zero high pass traverse with BFGoodrich tyres aired down for fresh powder and packed ice. Cryospheric telemetry logged with zero brake fade over 2,200m summit.',
    telemetryTag: '2,240m Summit · Sub-Zero',
    isMultiImage: true,
    purismScore: 74,
    surfaceCondition: 'frost',
    peakLateralG: 0.82,
    provenanceScore: 95
  },
  {
    id: 'exp-08',
    category: 'engine',
    authorHandle: 'heritage_works',
    authorName: 'Atelier Workshop',
    authorCar: 'Engine Bay Machining',
    images: [
      '/heritage_wrenching_workshop.jpg',
      '/clean_garage_m3.jpg'
    ],
    likesCount: 1960,
    commentsCount: 88,
    caption: 'Cylinder head port flow study and crankshaft balancing on the engine stand. Akrapovič titanium system matched with bespoke inlet trumpets and 8,500 RPM valvetrain harmonics.',
    telemetryTag: 'Specialist Bay · 8,500 RPM',
    isMultiImage: true,
    isPro: true,
    purismScore: 88,
    surfaceCondition: 'dry',
    peakLateralG: 0.50,
    provenanceScore: 99
  },
  {
    id: 'exp-09',
    category: 'classic',
    authorHandle: 'sebring_classics',
    authorName: 'Sebring Works',
    authorCar: 'MGB Roadster Sebring Spec',
    images: [
      '/feed/mgb_roadster_sebring_bwg_15t.jpg',
      '/stone_garage_cobra_ferrari.jpg'
    ],
    likesCount: 3120,
    commentsCount: 240,
    caption: 'Period Sebring wide-arch race conversions with Minilite magnesium wheels, straight-cut dog-box, and Weber 45 DCOE induction bark across Sussex lanes.',
    telemetryTag: 'Sebring Arches · Weber 45',
    isMultiImage: true,
    purismScore: 96,
    surfaceCondition: 'dry',
    peakLateralG: 1.02,
    provenanceScore: 98
  },
  {
    id: 'exp-10',
    category: 'pass',
    authorHandle: 'overland_110',
    authorName: 'EXPEDITION',
    authorCar: 'Defender 110 V8 (L663)',
    images: [
      '/real_uk_defender_farm.jpg',
      '/snow_mountain_overland_convoy.jpg'
    ],
    likesCount: 1680,
    commentsCount: 104,
    caption: 'Yorkshire Dales stone barn driveway shakedown. BFGoodrich KO2 all-terrain tyres aired down to 18 PSI after Strata Florida river crossings with 900mm wading active.',
    telemetryTag: '900mm Wading · 18 PSI',
    isMultiImage: true,
    purismScore: 60,
    surfaceCondition: 'damp',
    peakLateralG: 0.65,
    provenanceScore: 97,
    isPro: true
  },
  {
    id: 'exp-11',
    category: 'track',
    authorHandle: 'arden_nova',
    authorName: 'Arden Performance',
    authorCar: 'Vauxhall Nova Turbo (C20LET)',
    images: [
      '/feed/nova_turbo_arden_k77_nva.jpg',
      '/feed/widebody_zafira_speedhunters_aero.jpg'
    ],
    likesCount: 2410,
    commentsCount: 130,
    caption: 'C20LET turbo swap with Quaife ATB differential and Speedline Alessio wheels. 310 BHP in an 830 kg chassis tearing through Curborough sprint circuit.',
    telemetryTag: '310 BHP · 830 kg · C20LET',
    isMultiImage: true,
    purismScore: 85,
    surfaceCondition: 'dry',
    peakLateralG: 1.26,
    provenanceScore: 95
  },
  {
    id: 'exp-12',
    category: 'stance',
    authorHandle: 'atelier_curator',
    authorName: 'Collective Atelier',
    authorCar: 'Curated Heritage Hall',
    images: [
      '/collective_atelier_hall.jpg',
      '/clean_garage_gt3.jpg'
    ],
    likesCount: 2840,
    commentsCount: 156,
    caption: 'Curated lineup under industrial hangar lights. Mirror-polished concrete reflection showing millimeter-calibrated ride height and custom titanium exhaust tips.',
    telemetryTag: 'Atelier Pavilion · Zero Rub',
    isMultiImage: true,
    purismScore: 90,
    surfaceCondition: 'dry',
    peakLateralG: 0.90,
    provenanceScore: 99,
    isPro: true
  },
  {
    id: 'exp-13',
    category: 'classic',
    authorHandle: 'aircooled_vault',
    authorName: 'Aircooled Vault',
    authorCar: 'VW Split-Screen Single Cab',
    images: [
      '/feed/vw_splitty_singlecab_ubd_214g.jpg',
      '/feed/messerschmitt_kr200_bubblecar.jpg'
    ],
    likesCount: 1720,
    commentsCount: 82,
    caption: 'Barn-find survivor preserved in genuine patina. Twin-carb 1600cc boxer with dropped spindles and period timber dropsides.',
    telemetryTag: '1964 Aircooled · Patina',
    isMultiImage: true,
    purismScore: 97,
    surfaceCondition: 'dry',
    peakLateralG: 0.60,
    provenanceScore: 96
  },
  {
    id: 'exp-14',
    category: 'build',
    authorHandle: 'b7_artisan',
    authorName: 'Brembo Atelier',
    authorCar: 'Audi B7 Cabriolet Red Roof',
    images: [
      '/feed/audi_b7_cabriolet_red_roof_brembo.jpg',
      '/feed/audi_cabriolet_mythos_sw71_ryb.jpg'
    ],
    likesCount: 1650,
    commentsCount: 78,
    caption: 'Brembo GT6 380mm 2-piece floating discs behind custom forged wheels. Contrast crimson mohair roof with Mythos Black paint restoration.',
    telemetryTag: 'Brembo GT6 · 380mm Floating',
    isMultiImage: true,
    purismScore: 70,
    surfaceCondition: 'dry',
    peakLateralG: 1.10,
    provenanceScore: 96,
    isPro: true
  },
  {
    id: 'exp-15',
    category: 'classic',
    authorHandle: 'bubble_heritage',
    authorName: 'Microcar Archive',
    authorCar: 'Messerschmitt KR200',
    images: [
      '/feed/messerschmitt_kr200_bubblecar.jpg',
      '/feed/ford_taunus_crayford_classic_pg_1135.jpg'
    ],
    likesCount: 2210,
    commentsCount: 114,
    caption: 'Aviation-inspired tandem cockpit with transparent plexiglass dome canopy and Fichtel & Sachs two-stroke single cylinder engine.',
    telemetryTag: '191cc Two-Stroke · 230 kg',
    isMultiImage: true,
    purismScore: 99,
    surfaceCondition: 'dry',
    peakLateralG: 0.72,
    provenanceScore: 99
  },
  {
    id: 'exp-16',
    category: 'stance',
    authorHandle: 'stance_vxr',
    authorName: 'Arden Stance',
    authorCar: 'Vauxhall Zafira VXR Air-Ride',
    images: [
      '/feed/bagged_zafira_vxr_arden_stance.jpg',
      '/feed/kadett_e_cabrio_yellow_widebody.jpg'
    ],
    likesCount: 1540,
    commentsCount: 92,
    caption: 'Airlift 3P management with custom notched subframe and 19-inch BBS forged wheels tucked flush into rolling arches.',
    telemetryTag: 'AirLift 3P · Zero Clearance',
    isMultiImage: true,
    purismScore: 62,
    surfaceCondition: 'dry',
    peakLateralG: 0.85,
    provenanceScore: 94
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Discoveries' },
  { id: 'pass', label: 'Mountain Passes' },
  { id: 'track', label: 'Track Days' },
  { id: 'supercar', label: 'Supercars' },
  { id: 'build', label: 'Workshop Builds' },
  { id: 'engine', label: 'Engine Bays' },
  { id: 'classic', label: 'Vintage Analog' },
  { id: 'stance', label: 'Stance & Fitment' }
];

const DEFAULT_ALGORITHM_WEIGHTS: AlgorithmWeights = {
  mechanicalPurism: 80,
  surfaceGripTarget: 'all',
  kinematicIntensity: 65,
  provenanceStrictness: 60
};

export const ExplorePage: FC = () => {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const { activeVehicle } = useActiveVehicle();

  // Search & Pasting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAlgorithmTuningOpen, setIsAlgorithmTuningOpen] = useState(false);
  const [algorithmWeights, setAlgorithmWeights] = useState<AlgorithmWeights>(DEFAULT_ALGORITHM_WEIGHTS);

  // Modal State
  const [activeModalItem, setActiveModalItem] = useState<ExploreItem | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalLiked, setModalLiked] = useState<Record<string, boolean>>({});
  const [modalSaved, setModalSaved] = useState<Record<string, boolean>>({});
  const [modalCommentInput, setModalCommentInput] = useState('');
  const [modalComments, setModalComments] = useState<Record<string, string[]>>({});

  // Real-time Synaptic Deconstruction
  const parsedQuery = useMemo(() => {
    return parseKinematicSnippet(searchQuery);
  }, [searchQuery]);

  // Handle Pasting text from clipboard with single click
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setSearchQuery(text);
          showToast({
            title: 'Snippet Analyzed',
            message: 'Extracted mechanical, kinematic, and chassis telemetry vectors.',
            type: 'drive',
            badge: 'PARSER ACTIVE'
          });
          return;
        }
      }
    } catch {
      // Fallback: cycle a curated snippet
    }

    // Fallback cycle through curated automotive snippets
    const randomSnippet = CURATED_SNIPPETS[Math.floor(Math.random() * CURATED_SNIPPETS.length)];
    setSearchQuery(randomSnippet.snippet);
    showToast({
      title: randomSnippet.title,
      message: 'Automotive telemetry vectors mapped across stable.',
      type: 'drive',
      badge: 'KINEMATIC VECTOR'
    });
  };

  // Scored and Ranked Items based on Synaptic Kinematic Algorithm
  const scoredItems = useMemo(() => {
    return EXPLORE_ITEMS.map((item) => {
      const match = calculateKinematicMatch(item, parsedQuery, algorithmWeights);
      
      // Determine if this item relates to the user's current active car
      const isActiveVehicleMatch = 
        item.authorCar.toLowerCase().includes(activeVehicle.name.toLowerCase()) ||
        item.caption.toLowerCase().includes(activeVehicle.chassisCode.split('-')[0].toLowerCase()) ||
        item.authorHandle.includes(activeVehicle.id.replace('car-', ''));

      return {
        ...item,
        matchScore: match.score,
        isStrongMatch: match.isStrongMatch,
        matchReasons: match.reasons,
        isActiveVehicleMatch
      };
    });
  }, [parsedQuery, algorithmWeights, activeVehicle]);

  // Filter and Sort by Kinematic Score
  const filteredAndRankedItems = useMemo(() => {
    return scoredItems
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        if (!matchesCategory) return false;
        
        // If there's an active query, require at least a modest match
        if (parsedQuery.detectedVectors.length > 0 && item.matchScore < 45) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Prioritize strong kinematic match score
        return b.matchScore - a.matchScore;
      });
  }, [scoredItems, selectedCategory, parsedQuery]);

  const handleOpenItem = (item: ExploreItem) => {
    setActiveModalItem(item);
    setModalImageIndex(0);
  };

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = !modalLiked[id];
    setModalLiked(prev => ({ ...prev, [id]: next }));
    showToast({
      title: next ? 'Driver Kudos Recorded' : 'Kudos Removed',
      message: next ? 'Respect logged in car discovery ledger' : undefined,
      type: 'kudos'
    });
  };

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = !modalSaved[id];
    setModalSaved(prev => ({ ...prev, [id]: next }));
    showToast({
      title: next ? 'Saved to Pocket' : 'Removed from Saved',
      message: next ? 'Cached for offline vehicle inspection' : undefined,
      type: 'drive'
    });
  };

  const handlePostModalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCommentInput.trim() || !activeModalItem) return;
    const itemId = activeModalItem.id;
    const authorSignature = `${activeVehicle.name.toLowerCase().replace(/\s+/g, '_')}`;
    setModalComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), `${authorSignature}: ${modalCommentInput.trim()}`]
    }));
    setModalCommentInput('');
    showToast({
      title: 'Comment Published',
      message: `Posted as ${activeVehicle.name} (${activeVehicle.fullName})`,
      type: 'success'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* ── REFINED KINEMATIC DISCOVERY COMMAND BAR (Calm, Smart, Effortless) ── */}
      <div className="space-y-4">
        
        {/* Understated Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-luxury-display text-lg sm:text-xl font-bold tracking-wider text-zinc-100 uppercase">
                Atelier Discovery
              </h1>
              <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Kinematic Search Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl font-sans">
              Discover verified chassis builds, technical mountain passes, and hardware setups across the collective stable.
            </p>
          </div>

          {/* Understated Action Strip */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition-all border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white cursor-pointer"
              title="Paste text from clipboard or sample an enthusiast snippet"
            >
              <Clipboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Paste Snippet</span>
            </button>

            <button
              onClick={() => setIsAlgorithmTuningOpen(!isAlgorithmTuningOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition-all border cursor-pointer ${
                isAlgorithmTuningOpen
                  ? 'bg-amber-400 text-zinc-950 font-bold border-amber-300 shadow-sm'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Tune Discovery Weights"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Switchgear</span>
            </button>
          </div>
        </div>

        {/* Clean, Tactile Search Input */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chassis (G80, 992, E30, L663), mechanical specs, parts, or paste tuning notes…"
            className={`w-full pl-11 pr-24 py-3 rounded-2xl border text-xs sm:text-sm transition font-sans shadow-inner ${
              isWhiteYellow
                ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                : 'bg-zinc-950/70 border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400/50'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono-numbers flex items-center gap-1 cursor-pointer transition"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Real-time Detected Vectors Strip (Refined & Non-Intrusive) */}
        {parsedQuery.detectedVectors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-200">
            <span className="text-[11px] font-mono-numbers text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Extracted physical vectors ({parsedQuery.detectedVectors.length}):</span>
            </span>
            {parsedQuery.detectedVectors.map((v, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono-numbers text-zinc-300 flex items-center gap-1.5"
              >
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">{v.category}</span>
                <span>{v.displayLabel}</span>
              </span>
            ))}
            {parsedQuery.kinematicTargetG && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono-numbers text-emerald-400 font-semibold">
                {parsedQuery.kinematicTargetG}G Target
              </span>
            )}
            {parsedQuery.adhesionTarget && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono-numbers text-sky-400 font-semibold uppercase">
                μ: {parsedQuery.adhesionTarget}
              </span>
            )}
          </div>
        )}

        {/* Curated Sample Snippet Seed Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[11px] font-mono-numbers text-zinc-500 shrink-0 font-medium">
            Inspiration:
          </span>
          {CURATED_SNIPPETS.map((sample, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(sample.snippet)}
              className={`px-3 py-1 rounded-full text-xs font-mono-numbers transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                searchQuery === sample.snippet
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-semibold'
                  : isWhiteYellow
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* ── DRIVER-TUNED ALGORITHM SWITCHGEAR CONSOLE (Expandable) ── */}
        {isAlgorithmTuningOpen && (
          <div className={`p-5 rounded-3xl border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isWhiteYellow ? 'bg-zinc-50 border-zinc-300 shadow-md' : 'bg-zinc-950/95 border-white/10 backdrop-blur-xl shadow-2xl'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-white/[0.08]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono-numbers uppercase tracking-wider font-bold text-zinc-100">
                  Driver Algorithmic Weights (Zero Black-Box Bias)
                </span>
              </div>
              <button
                onClick={() => setAlgorithmWeights(DEFAULT_ALGORITHM_WEIGHTS)}
                className="text-[11px] font-mono-numbers text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono-numbers">
              {/* Dial 1: Mechanical Purism */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mechanical Purism</span>
                  </span>
                  <span className="text-amber-400 font-bold">{algorithmWeights.mechanicalPurism}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={algorithmWeights.mechanicalPurism}
                  onChange={(e) => setAlgorithmWeights(w => ({ ...w, mechanicalPurism: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>Modern AWD Turbo</span>
                  <span>Analog NA Manual</span>
                </div>
              </div>

              {/* Dial 2: Surface Grip Target */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-bold flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tarmac Adhesion (μ)</span>
                  </span>
                  <span className="text-sky-400 font-bold uppercase">{algorithmWeights.surfaceGripTarget}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  {(['all', 'dry', 'damp', 'frost'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAlgorithmWeights(w => ({ ...w, surfaceGripTarget: mode }))}
                      className={`py-1 rounded-lg font-bold uppercase transition cursor-pointer ${
                        algorithmWeights.surfaceGripTarget === mode
                          ? 'bg-sky-400 text-black shadow-xs'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="text-[9px] text-zinc-500 truncate">
                  {algorithmWeights.surfaceGripTarget === 'all' ? 'All road conditions' :
                   algorithmWeights.surfaceGripTarget === 'dry' ? 'Optimum Asphalt (μ > 0.85)' :
                   algorithmWeights.surfaceGripTarget === 'damp' ? 'Damp Bitumen (μ 0.55–0.75)' : 'Cryospheric Hazard (μ < 0.35)'}
                </div>
              </div>

              {/* Dial 3: Kinematic Load Intensity */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-bold flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kinematic Load (G)</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{algorithmWeights.kinematicIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={algorithmWeights.kinematicIntensity}
                  onChange={(e) => setAlgorithmWeights(w => ({ ...w, kinematicIntensity: Number(e.target.value) }))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>Scenic Touring</span>
                  <span>Apex Attack (&gt;1.1G)</span>
                </div>
              </div>

              {/* Dial 4: Provenance Strictness */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Provenance Strictness</span>
                  </span>
                  <span className="text-amber-400 font-bold">{algorithmWeights.provenanceStrictness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={algorithmWeights.provenanceStrictness}
                  onChange={(e) => setAlgorithmWeights(w => ({ ...w, provenanceStrictness: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>All Entries</span>
                  <span>Workshop Stamped DAG</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters (Horizontal Scrollable) */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-yellow-400 text-zinc-950 font-bold border border-yellow-500 shadow-sm'
                  : isWhiteYellow
                  ? 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
                  : 'bg-[#141418] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* ── INNOVATIVE EXPLORE GRID WITH RICH VISUAL EFFECTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[250px] md:auto-rows-[290px]">
        {filteredAndRankedItems.map(item => {
          const isItemLiked = modalLiked[item.id];
          const isItemSaved = modalSaved[item.id];

          return (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md ${
                isWhiteYellow
                  ? 'bg-white border border-zinc-200/90 hover:border-yellow-400/80 hover:shadow-xl'
                  : 'bg-[#111113] border border-white/[0.08] hover:border-amber-400/50 hover:shadow-2xl'
              } ${item.spanClass || 'col-span-1 row-span-1'}`}
            >
              {/* Photo Media with Smooth Zoom */}
              <img
                src={item.images[0]}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Top Left: Kinematic Match Score Badge */}
              <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
                <span className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono-numbers font-bold shadow-lg border flex items-center gap-1 ${
                  item.matchScore >= 80
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : item.matchScore >= 65
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-black/70 border-white/15 text-zinc-300'
                }`}>
                  <Zap className="w-3 h-3" />
                  <span>{item.matchScore}% Match</span>
                </span>

                {item.isActiveVehicleMatch && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-mono-numbers font-extrabold shadow-md flex items-center gap-1">
                    ★ {activeVehicle.name} Fitment
                  </span>
                )}
              </div>

              {/* Corner Badges (Multi-Image / Video Reel / Pro) */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
                {item.isMultiImage && (
                  <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono-numbers flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{item.images.length}</span>
                  </div>
                )}
                {item.isVideoReel && (
                  <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white">
                    <Play className="w-3 h-3 fill-white" />
                  </div>
                )}
                {item.isPro && (
                  <div className="p-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300">
                    <Wrench className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Always-Visible Soft Bottom Vignette for Rich Context */}
              <div className="absolute inset-x-0 bottom-0 pt-12 pb-3.5 px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-white truncate drop-shadow-md">
                    {item.authorCar}
                  </p>
                  <p className="text-[10px] text-zinc-300 font-mono-numbers truncate">
                    @{item.authorHandle}
                  </p>
                </div>
                {item.telemetryTag && (
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono-numbers text-amber-300 shrink-0">
                    {item.telemetryTag}
                  </span>
                )}
              </div>

              {/* Subtle Tactile Hover Overlay */}
              <div className="absolute inset-0 bg-[#09090B]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20">
                
                {/* Top Author Tag & Quick Bookmark */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/car/${getCarProfileId(item.authorHandle)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 min-w-0 group/author hover:opacity-90"
                    title={`View ${item.authorName}'s Atelier Dossier`}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0 bg-zinc-800">
                      <img
                        src={item.images[0]}
                        alt={item.authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white leading-none truncate group-hover/author:text-amber-400 transition-colors">
                        {item.authorHandle}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono-numbers truncate mt-0.5">{item.authorCar}</p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => handleToggleSave(item.id, e)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0 cursor-pointer"
                    title={isItemSaved ? 'Saved' : 'Save to Pocket'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isItemSaved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </button>
                </div>

                {/* Center Match Reasons & Stat Counts */}
                <div className="space-y-2 text-center">
                  {item.matchReasons.length > 0 && (
                    <div className="space-y-1">
                      {item.matchReasons.map((r, ri) => (
                        <p key={ri} className="text-[10px] font-mono-numbers text-amber-300/90 truncate">
                          ✓ {r}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-6 text-white font-bold text-sm pt-1">
                    <button
                      onClick={(e) => handleToggleLike(item.id, e)}
                      className="flex items-center gap-1.5 drop-shadow-md hover:scale-105 transition cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isItemLiked ? 'fill-rose-500 text-rose-500' : 'fill-white text-white'}`} />
                      <span>{item.likesCount + (isItemLiked ? 1 : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1.5 drop-shadow-md">
                      <MessageCircle className="w-4 h-4 fill-white text-white" />
                      <span>{item.commentsCount + (modalComments[item.id]?.length || 0)}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Caption Preview */}
                <p className="text-xs text-zinc-300 font-sans line-clamp-2 leading-snug">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PHOTO DETAIL MODAL / LIGHTBOX ── */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className={`border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative ${
              isWhiteYellow ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#141418] border-white/[0.12] text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white border border-white/20 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left 60%: Large Photo Media with Carousel */}
            <div className="w-full md:w-[60%] bg-black relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
              <img
                src={activeModalItem.images[modalImageIndex]}
                alt={activeModalItem.caption}
                className="w-full h-full object-cover max-h-[85vh] transition-all duration-300"
              />

              {/* Prev/Next arrows for multi-image */}
              {activeModalItem.images.length > 1 && (
                <>
                  {modalImageIndex > 0 && (
                    <button
                      onClick={() => setModalImageIndex(i => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white border border-white/20 hover:bg-black/90 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {modalImageIndex < activeModalItem.images.length - 1 && (
                    <button
                      onClick={() => setModalImageIndex(i => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white border border-white/20 hover:bg-black/90 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {activeModalItem.images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setModalImageIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          modalImageIndex === dotIdx ? 'bg-amber-400 w-4' : 'bg-white/40 w-2 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right 40%: Car Spec, Caption, Comments */}
            <div className="w-full md:w-[40%] flex flex-col justify-between overflow-y-auto">
              {/* Header: Author & Car Info */}
              <div className={`p-4 border-b flex items-center justify-between ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.08]'}`}>
                <Link
                  to={`/car/${getCarProfileId(activeModalItem.authorHandle)}`}
                  className="flex items-center gap-3 min-w-0 group"
                  onClick={() => setActiveModalItem(null)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-zinc-800">
                    <img
                      src={activeModalItem.images[0]}
                      alt={activeModalItem.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate transition ${isWhiteYellow ? 'text-zinc-950 group-hover:text-yellow-600' : 'text-white group-hover:text-amber-300'}`}>
                      {activeModalItem.authorHandle}
                    </p>
                    <p className={`text-xs font-mono-numbers truncate ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      {activeModalItem.authorCar}
                    </p>
                  </div>
                </Link>

                <Link
                  to={`/car/${getCarProfileId(activeModalItem.authorHandle)}`}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 font-mono-numbers px-2.5 py-1 rounded-lg border border-amber-400/30 bg-amber-400/10"
                >
                  Dossier →
                </Link>
              </div>

              {/* Body: Caption, Kinematic Badges, Comments */}
              <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
                <p className={`text-xs sm:text-sm leading-relaxed ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  {activeModalItem.caption}
                </p>

                {/* Telemetry pill */}
                {activeModalItem.telemetryTag && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono-numbers text-xs font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeModalItem.telemetryTag}</span>
                    </span>
                    {activeModalItem.provenanceScore && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono-numbers text-xs font-semibold">
                        {activeModalItem.provenanceScore}/100 Provenance
                      </span>
                    )}
                  </div>
                )}

                {/* Comments Thread */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <p className="text-[11px] font-mono-numbers uppercase tracking-wider text-zinc-400 font-bold">
                    Custodian Discussions ({activeModalItem.commentsCount + (modalComments[activeModalItem.id]?.length || 0)})
                  </p>

                  <div className={`text-xs space-y-2.5 ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    <p>
                      <span className={`font-bold mr-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>kuro_gt3</span>
                      <span>Proper pace through that technical section! The tarmac looked greasy at the summit.</span>
                    </p>
                    <p>
                      <span className={`font-bold mr-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>yuki_gr_yaris</span>
                      <span>Did you run traction control completely off or in sport dynamic mode?</span>
                    </p>
                    
                    {/* User submitted comments */}
                    {modalComments[activeModalItem.id]?.map((cmt, idx) => (
                      <p key={idx} className="animate-in fade-in duration-150">
                        <span className={`font-bold mr-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{cmt.split(': ')[0]}</span>
                        <span>{cmt.split(': ')[1]}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Engagement & Action Bar */}
              <div className={`p-4 border-t space-y-3 ${isWhiteYellow ? 'border-zinc-200 bg-zinc-50/70' : 'border-white/[0.08] bg-[#111114]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleToggleLike(activeModalItem.id, e)}
                      className={`transition cursor-pointer ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Heart
                        className={`w-6 h-6 ${modalLiked[activeModalItem.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                    </button>
                    <button className={`transition ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText?.(window.location.href);
                        showToast({ title: 'Discovery Link Copied', type: 'clipboard' });
                      }}
                      className={`transition cursor-pointer ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Share2 className="w-5 h-5 -rotate-12" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleToggleSave(activeModalItem.id, e)}
                    className={`transition cursor-pointer ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Bookmark
                      className={`w-6 h-6 ${modalSaved[activeModalItem.id] ? 'fill-yellow-500 text-yellow-500' : ''}`}
                    />
                  </button>
                </div>

                <p className={`text-xs font-bold font-mono-numbers ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  {(activeModalItem.likesCount + (modalLiked[activeModalItem.id] ? 1 : 0)).toLocaleString()} drivers respected
                </p>

                {/* Inline Comment Input with Active Vehicle Persona */}
                <form onSubmit={handlePostModalComment} className={`flex items-center gap-2 pt-1 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.06]'}`}>
                  <img
                    src={activeVehicle.heroImage}
                    alt={activeVehicle.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <input
                    type="text"
                    value={modalCommentInput}
                    onChange={(e) => setModalCommentInput(e.target.value)}
                    placeholder={`Add a comment as ${activeVehicle.name}…`}
                    className={`flex-1 bg-transparent text-xs font-sans focus:outline-none ${isWhiteYellow ? 'text-zinc-900 placeholder-zinc-400' : 'text-white placeholder-zinc-500'}`}
                  />
                  {modalCommentInput.trim() && (
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-yellow-400 text-zinc-950 hover:bg-yellow-300 transition font-mono-numbers shadow-xs cursor-pointer"
                    >
                      Post
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
