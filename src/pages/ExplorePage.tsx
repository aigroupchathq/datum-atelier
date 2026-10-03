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
  AUTOMOTIVE_UNIVERSE,
  ARCHETYPE_META,
  type AutomotiveModel,
  type CarArchetype
} from '../data/ukAutomotiveUniverse';
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
  Gauge,
  BookOpen,
  Volume2,
  AlertTriangle,
  ArrowRight
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

const ALPHABET = ['ALL', 'A', 'B', 'C', 'F', 'H', 'L', 'M', 'N', 'P', 'T', 'V'];

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

  // Active Explore Mode: 'universe' (A-Z Car Universe) vs 'community' (Photo Journals)
  const [activeTab, setActiveTab] = useState<'universe' | 'community'>('universe');

  // Search & Pasting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAlgorithmTuningOpen, setIsAlgorithmTuningOpen] = useState(false);
  const [algorithmWeights, setAlgorithmWeights] = useState<AlgorithmWeights>(DEFAULT_ALGORITHM_WEIGHTS);

  // Universe Directory Filters
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('all');

  // Community Modal State
  const [activeModalItem, setActiveModalItem] = useState<ExploreItem | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalLiked, setModalLiked] = useState<Record<string, boolean>>({});
  const [modalSaved, setModalSaved] = useState<Record<string, boolean>>({});
  const [modalCommentInput, setModalCommentInput] = useState('');
  const [modalComments, setModalComments] = useState<Record<string, string[]>>({});

  // Automotive Universe Blueprint Modal State
  const [activeModelModal, setActiveModelModal] = useState<AutomotiveModel | null>(null);
  const [modelModalTab, setModelModalTab] = useState<'blueprint' | 'lore' | 'watchpoints' | 'matchup'>('blueprint');

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

    const randomSnippet = CURATED_SNIPPETS[Math.floor(Math.random() * CURATED_SNIPPETS.length)];
    setSearchQuery(randomSnippet.snippet);
    showToast({
      title: randomSnippet.title,
      message: 'Automotive telemetry vectors mapped across stable.',
      type: 'drive',
      badge: 'KINEMATIC VECTOR'
    });
  };

  // Filtered and Ranked Automotive Models (A to Z Universe)
  const filteredModels = useMemo(() => {
    return AUTOMOTIVE_UNIVERSE.filter((car) => {
      // 1. Archetype filter
      if (selectedArchetype !== 'all' && car.archetype !== selectedArchetype) {
        return false;
      }
      // 2. Alphabet filter
      if (selectedLetter !== 'ALL' && !car.make.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }
      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = car.make.toLowerCase().includes(q) || 
                            car.model.toLowerCase().includes(q) || 
                            (car.variant && car.variant.toLowerCase().includes(q));
        const matchesChassis = car.chassisCode.toLowerCase().includes(q);
        const matchesEngine = car.specs.engineCode.toLowerCase().includes(q) || car.specs.cylinderConfig.toLowerCase().includes(q);
        const matchesDrivetrain = car.specs.drivetrain.toLowerCase().includes(q);
        const matchesMod = car.marketIntelligence.commonEnthusiastMods.some(m => m.toLowerCase().includes(q));
        
        // Also check if any detected vector matches
        const matchesVector = parsedQuery.detectedVectors.some(v => 
          car.chassisCode.toLowerCase().includes(v.token) ||
          car.make.toLowerCase().includes(v.token) ||
          car.model.toLowerCase().includes(v.token) ||
          car.specs.engineCode.toLowerCase().includes(v.token)
        );

        if (!matchesName && !matchesChassis && !matchesEngine && !matchesDrivetrain && !matchesMod && !matchesVector) {
          return false;
        }
      }
      return true;
    });
  }, [selectedArchetype, selectedLetter, searchQuery, parsedQuery]);

  // Scored and Ranked Community Items
  const scoredItems = useMemo(() => {
    return EXPLORE_ITEMS.map((item) => {
      const match = calculateKinematicMatch(item, parsedQuery, algorithmWeights);
      
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

  // Filter and Sort Community Items
  const filteredAndRankedItems = useMemo(() => {
    return scoredItems
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        if (!matchesCategory) return false;
        
        if (parsedQuery.detectedVectors.length > 0 && item.matchScore < 45) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* ── TOP EDITORIAL HORIZON & DUAL UNIVERSE NAV ── */}
      <div className="space-y-4">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-luxury-display text-lg sm:text-2xl font-bold tracking-wider text-zinc-100 uppercase">
                DATUM Automotive Universe
              </h1>
              <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-amber-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                A–Z Chassis Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
              The ultimate automotive taxonomy. Search across UK benchmarks, homologation specials, WRC icons, and B-road legends with real mechanical blueprints.
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
            placeholder="Search make, model, chassis (G80, 992, FL5, E46, L663), engine code (S58, 2JZ, K20C1), or paste forum notes…"
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

        {/* Real-time Detected Vectors Strip */}
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

        {/* ── UNIVERSE VS COMMUNITY PRIMARY SWITCHER ── */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('universe')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-luxury-display uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'universe'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Automotive Universe A–Z ({filteredModels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-luxury-display uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'community'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Community Journals & Feeds ({filteredAndRankedItems.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono-numbers text-zinc-500 hidden sm:inline">
            Active: {activeVehicle.name} ({activeVehicle.fullName})
          </span>
        </div>

        {/* ── SUB-FILTERS FOR AUTOMOTIVE UNIVERSE (A-Z & Archetypes) ── */}
        {activeTab === 'universe' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* A to Z Fast Alphabet Index Bar */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-mono-numbers text-zinc-500 uppercase tracking-widest mr-1.5 shrink-0 font-bold">
                Marques:
              </span>
              {ALPHABET.map((letter) => {
                const isSelected = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono-numbers font-bold flex items-center justify-center transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : isWhiteYellow
                        ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Archetype Filter Strip */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
              <button
                onClick={() => setSelectedArchetype('all')}
                className={`px-3 py-1.5 rounded-xl font-mono-numbers transition whitespace-nowrap shrink-0 border cursor-pointer ${
                  selectedArchetype === 'all'
                    ? 'bg-yellow-400 text-zinc-950 font-bold border-yellow-500'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-white border-white/[0.06]'
                }`}
              >
                All Archetypes ({AUTOMOTIVE_UNIVERSE.length})
              </button>
              {(Object.keys(ARCHETYPE_META) as CarArchetype[]).map((key) => {
                const meta = ARCHETYPE_META[key];
                const isSelected = selectedArchetype === key;
                const count = AUTOMOTIVE_UNIVERSE.filter(c => c.archetype === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedArchetype(key)}
                    className={`px-3 py-1.5 rounded-xl font-mono-numbers transition whitespace-nowrap shrink-0 border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 font-bold border-amber-300'
                        : 'bg-white/[0.03] text-zinc-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SUB-FILTERS FOR COMMUNITY FEEDS ── */}
        {activeTab === 'community' && (
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
        )}

      </div>

      {/* ── ALGORITHM SWITCHGEAR CONSOLE (Expandable) ── */}
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
            {/* Dial 1 */}
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

            {/* Dial 2 */}
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
            </div>

            {/* Dial 3 */}
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
            </div>

            {/* Dial 4 */}
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
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ── TAB 1: AUTOMOTIVE UNIVERSE (A TO Z BLUEPRINTS) ──     */}
      {/* ========================================================= */}
      {activeTab === 'universe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModels.map((car) => {
              const meta = ARCHETYPE_META[car.archetype];
              const isGaragePeer = activeVehicle.fullName.toLowerCase().includes(car.make.toLowerCase()) || 
                                   activeVehicle.fullName.toLowerCase().includes(car.model.toLowerCase());

              return (
                <div
                  key={car.id}
                  onClick={() => {
                    setActiveModelModal(car);
                    setModelModalTab('blueprint');
                  }}
                  className={`group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-md ${
                    isWhiteYellow
                      ? 'bg-white border-zinc-200 hover:border-yellow-400 hover:shadow-xl'
                      : 'bg-[#0E0F13] border-white/10 hover:border-amber-400/50 hover:shadow-2xl'
                  }`}
                >
                  {/* Photo Header */}
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={car.heroImage}
                      alt={car.model}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F13] via-black/25 to-transparent" />
                    
                    {/* Top Archetype Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono-numbers text-white font-bold shadow-lg">
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </div>

                    {/* Chassis Code & Years */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isGaragePeer && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-black text-[9px] font-mono-numbers font-extrabold shadow-md">
                          GARAGE PEER
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] font-mono-numbers font-extrabold shadow-md">
                        {car.chassisCode}
                      </span>
                    </div>

                    {/* Bottom overlay title */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[11px] font-mono-numbers uppercase tracking-wider text-amber-400 font-bold">
                        {car.make}
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-white font-luxury-display leading-tight truncate">
                        {car.model} {car.variant ? `· ${car.variant}` : ''}
                      </h3>
                    </div>
                  </div>

                  {/* Mechanical Telemetry Blueprint Card Body */}
                  <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                    
                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers">
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Powertrain</span>
                        <span className="font-bold text-zinc-100 block truncate">{car.specs.engineCode}</span>
                        <span className="text-[10px] text-amber-400 block font-semibold">{car.specs.powerBhp} BHP · {car.specs.torqueNm} Nm</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Curb Weight / P:W</span>
                        <span className="font-bold text-zinc-100 block">{car.specs.curbWeightKg.toLocaleString()} kg</span>
                        <span className="text-[10px] text-emerald-400 block font-semibold">{car.specs.powerToWeightBhpPerTonne} BHP/T</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">0–60 MPH</span>
                        <span className="font-bold text-zinc-100 block">{car.specs.zeroToSixtyMph}s</span>
                        <span className="text-[10px] text-zinc-400 block">{car.specs.topSpeedMph} MPH Top</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Peak Grip</span>
                        <span className="font-bold text-sky-400 block">{car.specs.peakLateralG}G</span>
                        <span className="text-[10px] text-zinc-400 block uppercase">μ: {car.specs.surfaceAffinity}</span>
                      </div>
                    </div>

                    {/* Acoustic & Cultural Excerpt */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-zinc-300 font-sans line-clamp-2 leading-relaxed">
                        {car.marketIntelligence.ukEnthusiastStatus}
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] font-mono-numbers text-amber-300/80 truncate">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{car.marketIntelligence.soundtrackSignature}</span>
                      </div>
                    </div>

                    {/* Footer Strip */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="font-mono-numbers font-bold text-zinc-400 text-[11px]">
                        {car.marketIntelligence.estimatedPriceGbp}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModelModal(car);
                          setModelModalTab('blueprint');
                        }}
                        className="flex items-center gap-1 text-xs font-mono-numbers font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Inspect Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <p className="text-zinc-400 text-sm font-mono-numbers">
                No automotive models match your current filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedLetter('ALL');
                  setSelectedArchetype('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs font-mono-numbers"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* ── TAB 2: COMMUNITY JOURNALS & SHAKEDOWNS ──              */}
      {/* ========================================================= */}
      {activeTab === 'community' && (
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
                {/* Photo Media */}
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

                {/* Corner Badges */}
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

                {/* Always-Visible Soft Bottom Vignette */}
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

                {/* Tactile Hover Overlay */}
                <div className="absolute inset-0 bg-[#09090B]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/car/${getCarProfileId(item.authorHandle)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 min-w-0 group/author hover:opacity-90"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0 bg-zinc-800">
                        <img src={item.images[0]} alt={item.authorName} className="w-full h-full object-cover" />
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
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isItemSaved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                  </div>

                  {/* Match Reasons & Kudos */}
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

                  <p className="text-xs text-zinc-300 font-sans line-clamp-2 leading-snug">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* ── AUTOMOTIVE MODEL BLUEPRINT MODAL (Deep Intelligence) ── */}
      {/* ========================================================= */}
      {activeModelModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveModelModal(null)}
        >
          <div
            className={`border rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative ${
              isWhiteYellow ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#0E0F14] border-white/10 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold uppercase">
                    {activeModelModal.chassisCode}
                  </span>
                  <span className="text-[11px] font-mono-numbers text-zinc-400">
                    {activeModelModal.productionYears} · {activeModelModal.marketIntelligence.estimatedPriceGbp}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-luxury-display">
                  {activeModelModal.make} {activeModelModal.model}
                </h2>
                {activeModelModal.variant && (
                  <p className="text-xs font-mono-numbers text-amber-400">
                    {activeModelModal.variant}
                  </p>
                )}
              </div>

              <button
                onClick={() => setActiveModelModal(null)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/[0.06] text-xs font-mono-numbers overflow-x-auto no-scrollbar">
              <button
                onClick={() => setModelModalTab('blueprint')}
                className={`pb-2.5 px-2 border-b-2 font-bold cursor-pointer transition whitespace-nowrap ${
                  modelModalTab === 'blueprint' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Engineering Blueprint
              </button>
              <button
                onClick={() => setModelModalTab('lore')}
                className={`pb-2.5 px-2 border-b-2 font-bold cursor-pointer transition whitespace-nowrap ${
                  modelModalTab === 'lore' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                UK Enthusiast Lore
              </button>
              <button
                onClick={() => setModelModalTab('watchpoints')}
                className={`pb-2.5 px-2 border-b-2 font-bold cursor-pointer transition whitespace-nowrap ${
                  modelModalTab === 'watchpoints' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Inspection Watchpoints
              </button>
              <button
                onClick={() => setModelModalTab('matchup')}
                className={`pb-2.5 px-2 border-b-2 font-bold cursor-pointer transition whitespace-nowrap ${
                  modelModalTab === 'matchup' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Matchup vs {activeVehicle.name}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs font-mono-numbers">
              {modelModalTab === 'blueprint' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Engine Architecture</span>
                      <p className="font-bold text-sm text-zinc-100">{activeModelModal.specs.engineCode}</p>
                      <p className="text-zinc-400 text-[11px]">{activeModelModal.specs.cylinderConfig}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Output & Torque</span>
                      <p className="font-bold text-sm text-amber-400">{activeModelModal.specs.powerBhp} BHP</p>
                      <p className="text-zinc-400 text-[11px]">{activeModelModal.specs.torqueNm} Nm Peak</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Power-to-Weight</span>
                      <p className="font-bold text-sm text-emerald-400">{activeModelModal.specs.powerToWeightBhpPerTonne} BHP/T</p>
                      <p className="text-zinc-400 text-[11px]">{activeModelModal.specs.curbWeightKg.toLocaleString()} kg Kerb</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Acceleration & Pace</span>
                      <p className="font-bold text-sm text-zinc-100">{activeModelModal.specs.zeroToSixtyMph}s (0–60)</p>
                      <p className="text-zinc-400 text-[11px]">{activeModelModal.specs.topSpeedMph} MPH Top</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Transmission</span>
                      <p className="font-bold text-zinc-100">{activeModelModal.specs.transmission}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase">Drivetrain & Differential</span>
                      <p className="font-bold text-zinc-100">{activeModelModal.specs.drivetrain}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase">Factory Chassis & Tyre Spec</span>
                    <p className="text-zinc-200">{activeModelModal.specs.factoryTireSpec}</p>
                    <p className="text-zinc-400 text-[11px]">Peak Lateral Acceleration: <span className="text-sky-400 font-bold">{activeModelModal.specs.peakLateralG}G</span> · Optimal Surface: <span className="uppercase text-amber-400">{activeModelModal.specs.surfaceAffinity}</span></p>
                  </div>
                </div>
              )}

              {modelModalTab === 'lore' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-2">
                    <span className="text-[10px] text-amber-400 uppercase font-bold">Why Drivers Revere This Platform</span>
                    <p className="text-zinc-200 font-sans leading-relaxed text-xs">
                      {activeModelModal.marketIntelligence.ukEnthusiastStatus}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Exhaust & Valvetrain Acoustic Signature</span>
                    </span>
                    <p className="text-zinc-300 font-sans leading-relaxed text-xs italic">
                      "{activeModelModal.marketIntelligence.soundtrackSignature}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-sky-400" />
                      <span>Benchmark UK Road / Sector</span>
                    </span>
                    <p className="text-zinc-200 font-bold text-sm">
                      {activeModelModal.marketIntelligence.benchmarkRoadSector}
                    </p>
                  </div>
                </div>
              )}

              {modelModalTab === 'watchpoints' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Critical Inspection Points & Common Failure Areas</span>
                    </span>
                    <div className="space-y-2">
                      {activeModelModal.marketIntelligence.criticalInspectionPoints.map((pt, i) => (
                        <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-start gap-2 font-sans">
                          <span className="font-bold text-rose-400 font-mono-numbers">0{i+1}.</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>Celebrated Enthusiast Aftermarket Hardware (BOM)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModelModal.marketIntelligence.commonEnthusiastMods.map((mod, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-xs font-mono-numbers">
                          ✓ {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modelModalTab === 'matchup' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-amber-400 font-bold uppercase">My Active Custodian Machine</p>
                      <p className="font-bold text-sm text-white">{activeVehicle.name} ({activeVehicle.fullName})</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400 text-black font-extrabold text-[10px]">
                      BENCHMARK
                    </span>
                  </div>

                  {(() => {
                    const userBhp = parseInt(activeVehicle.powerOutput, 10) || 500;
                    const powerDelta = activeModelModal.specs.powerBhp - userBhp;
                    return (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                          <span className="text-[10px] text-zinc-500 uppercase">Power Comparison</span>
                          <p className="text-xs text-zinc-300">
                            {activeModelModal.model}: <span className="font-bold text-amber-400">{activeModelModal.specs.powerBhp} BHP</span>
                          </p>
                          <p className="text-xs text-zinc-400">
                            {activeVehicle.name}: <span className="font-bold text-white">{userBhp} BHP</span>
                          </p>
                          <p className={`text-[10px] font-bold ${powerDelta >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            Delta: {powerDelta > 0 ? `+${powerDelta} BHP` : `${powerDelta} BHP`}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                          <span className="text-[10px] text-zinc-500 uppercase">Weight Comparison</span>
                          <p className="text-xs text-zinc-300">
                            {activeModelModal.model}: <span className="font-bold text-emerald-400">{activeModelModal.specs.curbWeightKg} kg</span>
                          </p>
                          <p className="text-xs text-zinc-400">
                            Drivetrain: <span className="font-bold text-white">{activeModelModal.specs.drivetrain.split('(')[0]}</span>
                          </p>
                          <p className="text-[10px] text-sky-400 font-bold">
                            Peak Lateral: {activeModelModal.specs.peakLateralG}G
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSearchQuery(`${activeModelModal.make} ${activeModelModal.model} ${activeModelModal.chassisCode}`);
                        setActiveTab('community');
                        setActiveModelModal(null);
                        showToast({
                          title: 'Filtered Community Feed',
                          message: `Searching posts matching ${activeModelModal.model}`,
                          type: 'drive'
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition"
                    >
                      Search Community Journals for this Chassis →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono-numbers text-zinc-500">
                Verified DATUM Automotive Registry Blueprint
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(`${window.location.origin}/explore?car=${activeModelModal.id}`);
                  showToast({ title: 'Chassis Dossier Link Copied', type: 'clipboard' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono-numbers text-zinc-300 hover:text-white cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Blueprint</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── PHOTO DETAIL MODAL / LIGHTBOX (Community Journals) ── */}
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

            {/* Left: Image Carousel */}
            <div className="w-full md:w-[60%] bg-black relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
              <img
                src={activeModalItem.images[modalImageIndex]}
                alt={activeModalItem.caption}
                className="w-full h-full object-cover max-h-[85vh] transition-all duration-300"
              />

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

            {/* Right: Caption & Comments */}
            <div className="w-full md:w-[40%] flex flex-col justify-between overflow-y-auto">
              <div className={`p-4 border-b flex items-center justify-between ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.08]'}`}>
                <Link
                  to={`/car/${getCarProfileId(activeModalItem.authorHandle)}`}
                  className="flex items-center gap-3 min-w-0 group"
                  onClick={() => setActiveModalItem(null)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-zinc-800">
                    <img src={activeModalItem.images[0]} alt={activeModalItem.authorName} className="w-full h-full object-cover" />
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

              <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
                <p className={`text-xs sm:text-sm leading-relaxed ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  {activeModalItem.caption}
                </p>

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
                    
                    {modalComments[activeModalItem.id]?.map((cmt, idx) => (
                      <p key={idx} className="animate-in fade-in duration-150">
                        <span className={`font-bold mr-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{cmt.split(': ')[0]}</span>
                        <span>{cmt.split(': ')[1]}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Engagement Bar */}
              <div className={`p-4 border-t space-y-3 ${isWhiteYellow ? 'border-zinc-200 bg-zinc-50/70' : 'border-white/[0.08] bg-[#111114]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleToggleLike(activeModalItem.id, e)}
                      className={`transition cursor-pointer ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Heart className={`w-6 h-6 ${modalLiked[activeModalItem.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
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
                    <Bookmark className={`w-6 h-6 ${modalSaved[activeModalItem.id] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </button>
                </div>

                <p className={`text-xs font-bold font-mono-numbers ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  {(activeModalItem.likesCount + (modalLiked[activeModalItem.id] ? 1 : 0)).toLocaleString()} drivers respected
                </p>

                {/* Inline Comment Form */}
                <form onSubmit={handlePostModalComment} className={`flex items-center gap-2 pt-1 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.06]'}`}>
                  <img
                    src={activeVehicle.heroImage || '/real_uk_m3_cottage.jpg'}
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
