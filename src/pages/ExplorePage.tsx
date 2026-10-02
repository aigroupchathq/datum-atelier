import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const getCarProfileId = (handle: string): string => {
  if (handle.includes('m3') || handle.includes('maya')) return 'car-maya-m3';
  if (handle.includes('gt3') || handle.includes('kuro')) return 'car-kuro-gt3';
  if (handle.includes('e30') || handle.includes('classic') || handle.includes('heritage')) return 'car-e30-retromod';
  if (handle.includes('110') || handle.includes('overland') || handle.includes('defender')) return 'car-expedition-110';
  return 'car-maya-m3';
};
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
  Smile
} from 'lucide-react';

interface ExploreItem {
  id: string;
  category: 'track' | 'pass' | 'engine' | 'classic' | 'supercar' | 'stance' | 'build';
  authorHandle: string;
  authorName: string;
  authorCar: string;
  authorAvatar: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  caption: string;
  telemetryTag?: string;
  isMultiImage?: boolean;
  isVideoReel?: boolean;
  isPro?: boolean;
  spanClass?: string; // For Instagram 2x2 hero grid layout
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: 'exp-01',
    category: 'pass',
    authorHandle: 'maya_m3',
    authorName: 'MAYA',
    authorCar: 'BMW M3 Competition (G80)',
    authorAvatar: '/real_uk_m3_cottage.jpg',
    images: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    likesCount: 1420,
    commentsCount: 118,
    caption: 'Damp morning shakedown outside Cotswolds cottage. KW V4 rebound damping dialled in for undulating B-roads.',
    telemetryTag: '1,688 ft Peak · 84.6 mi',
    isMultiImage: true,
    spanClass: 'col-span-1 md:col-span-2 md:row-span-2' // Big 2x2 Hero Feature Tile
  },
  {
    id: 'exp-02',
    category: 'supercar',
    authorHandle: 'kuro_gt3',
    authorName: 'KURO',
    authorCar: 'Porsche 911 GT3 (992)',
    authorAvatar: '/real_uk_gt3_suburb.jpg',
    images: [
      '/real_uk_gt3_suburb.jpg'
    ],
    likesCount: 2890,
    commentsCount: 164,
    caption: 'British suburban block-paved driveway cold start. 4.0L naturally aspirated flat-six 9,000 RPM idle warm-up.',
    telemetryTag: '9,000 RPM · 502 BHP',
    isVideoReel: true
  },
  {
    id: 'exp-03',
    category: 'track',
    authorHandle: 'yuki_gr_yaris',
    authorName: 'YUKI',
    authorCar: 'Toyota GR Yaris Circuit',
    authorAvatar: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 840,
    commentsCount: 52,
    caption: 'Cadwell Park Hall Bends kerb ride. 28 PSI cold target hit 32 PSI hot perfectly.',
    telemetryTag: '1:38.4 Cadwell · 1.42G'
  },
  {
    id: 'exp-04',
    category: 'build',
    authorHandle: 'driveway_lab',
    authorName: 'Driveway Detailing',
    authorCar: 'Sunday Decon Routine',
    authorAvatar: '/real_uk_driveway_wash.jpg',
    images: [
      '/real_uk_driveway_wash.jpg'
    ],
    likesCount: 1980,
    commentsCount: 142,
    caption: 'Sunday 07:00 AM snow-foam pre-wash outside suburban semi. Bilt-Hamber touchless decon before the road run.',
    telemetryTag: 'Detailing · pH Neutral',
    isPro: true
  },
  {
    id: 'exp-05',
    category: 'supercar',
    authorHandle: 'valkyrie_720s',
    authorName: 'VALKYRIE',
    authorCar: 'McLaren 720S Performance',
    authorAvatar: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 3410,
    commentsCount: 220,
    caption: 'Papaya Spark in the evening shadows. 710 BHP twin-turbo V8, dry weight 1,419 kg.',
    telemetryTag: '710 BHP · 1,419 kg'
  },
  {
    id: 'exp-06',
    category: 'classic',
    authorHandle: 'e30_heritage',
    authorName: 'RetroMod Dan',
    authorCar: 'BMW 318is (E30) Slicktop',
    authorAvatar: '/real_uk_e30_terrace.jpg',
    images: [
      '/real_uk_e30_terrace.jpg'
    ],
    likesCount: 1250,
    commentsCount: 88,
    caption: 'Victorian terraced street residential parking. 1989 E30 318is slicktop survivor with period-correct BBS basketweaves.',
    telemetryTag: '1989 Analog · 1,120 kg'
  },
  {
    id: 'exp-07',
    category: 'pass',
    authorHandle: 'uk_broads_club',
    authorName: 'UK B-Roads',
    authorCar: 'Collective Convoy',
    authorAvatar: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 2190,
    commentsCount: 175,
    caption: 'Midnight convoy through Brecon Beacons. 16 cars running the A4067 under clear moonlight.',
    telemetryTag: '16 Cars · 42.8 mi Pass',
    isMultiImage: true,
    spanClass: 'col-span-1 md:col-span-2 md:row-span-2' // Second 2x2 Feature Tile
  },
  {
    id: 'exp-08',
    category: 'engine',
    authorHandle: 'apex_engineering',
    authorName: 'Apex Track',
    authorCar: 'Specialist Dyno Cell',
    authorAvatar: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 960,
    commentsCount: 68,
    caption: 'S58 twin-turbo cylinder head port flow study. 80 PSI walnut shell media valve rejuvenation.',
    telemetryTag: 'Dyno Cell 2 · +14 CFM',
    isPro: true
  },
  {
    id: 'exp-09',
    category: 'stance',
    authorHandle: 'bbs_archive',
    authorName: 'Stance Guild',
    authorCar: 'Porsche 964 Carrera RS',
    authorAvatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 3120,
    commentsCount: 240,
    caption: 'Air-cooled 964 rotisserie build. Zero arch rub with custom 3-piece BBS LM offsets.',
    telemetryTag: 'Flush Offset · ET18'
  },
  {
    id: 'exp-10',
    category: 'pass',
    authorHandle: 'overland_110',
    authorName: 'EXPEDITION',
    authorCar: 'Defender 110 V8',
    authorAvatar: '/real_uk_defender_farm.jpg',
    images: [
      '/real_uk_defender_farm.jpg'
    ],
    likesCount: 1680,
    commentsCount: 104,
    caption: 'Yorkshire Dales stone barn driveway shakedown. BFGoodrich KO2s aired down after Strata Florida river crossings.',
    telemetryTag: '900mm Wading · 18 PSI'
  },
  {
    id: 'exp-11',
    category: 'track',
    authorHandle: 'caffeine_machine',
    authorName: 'Sunday Dawn',
    authorCar: 'Dawn Patrol Gathering',
    authorAvatar: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 4210,
    commentsCount: 310,
    caption: 'Caffeine & Machine 06:30 AM yard roll-call. Cold morning exhaust notes and fresh roast coffee.',
    telemetryTag: 'Cotswolds Loop · 06:30 AM',
    isVideoReel: true
  },
  {
    id: 'exp-12',
    category: 'supercar',
    authorHandle: 'apex_gt4',
    authorName: 'Marcus GT4',
    authorCar: 'Porsche 718 Cayman GT4',
    authorAvatar: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=150&q=90',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90'
    ],
    likesCount: 1840,
    commentsCount: 96,
    caption: 'Viton PCV membrane upgrade installed. Rock-solid 800 RPM idle restored through Surrey twisties.',
    telemetryTag: '4.0L Boxer-6 · 414 BHP'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Paddock' },
  { id: 'pass', label: 'Mountain Passes' },
  { id: 'track', label: 'Track Days' },
  { id: 'supercar', label: 'Supercars' },
  { id: 'build', label: 'Workshop Builds' },
  { id: 'engine', label: 'Engine Bays' },
  { id: 'classic', label: 'Vintage Analog' },
  { id: 'stance', label: 'Stance & Fitment' }
];

const TRENDING_TAGS = [
  '#SnakePass', '#GT3Touring', '#NC500', '#CadwellPark', '#S58TwinTurbo', '#StrataFlorida', '#BBSMotorsport', '#BealachNaBa'
];

export const ExplorePage: FC = () => {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState<ExploreItem | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalLiked, setModalLiked] = useState<Record<string, boolean>>({});
  const [modalSaved, setModalSaved] = useState<Record<string, boolean>>({});
  const [modalCommentInput, setModalCommentInput] = useState('');
  const [modalComments, setModalComments] = useState<Record<string, string[]>>({});

  const filteredItems = EXPLORE_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorCar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.telemetryTag && item.telemetryTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
      title: next ? 'Saved to Route & Spec Pocket' : 'Removed from Saved',
      message: next ? 'Cached for offline vehicle inspection' : undefined,
      type: 'drive'
    });
  };

  const handlePostModalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCommentInput.trim() || !activeModalItem) return;
    const itemId = activeModalItem.id;
    setModalComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), `maya_m3: ${modalCommentInput.trim()}`]
    }));
    setModalCommentInput('');
    showToast({
      title: 'Comment Published',
      message: `Posted as MAYA on ${activeModalItem.authorHandle}'s discovery`,
      type: 'success'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* ── TOP SEARCH & EXPLORE HEADER ── */}
      <div className="space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cars (M3, GT3, Yaris), mountain passes, chassis codes..."
            className={`w-full pl-11 pr-10 py-3 rounded-2xl border text-sm transition font-sans shadow-xs ${
              isWhiteYellow
                ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                : 'bg-[#141418] border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/[0.2]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isWhiteYellow ? 'text-zinc-400 hover:text-zinc-800' : 'text-zinc-500 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters (Horizontal Scrollable) */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
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

        {/* Trending Tags Ticker */}
        <div className="flex items-center justify-start md:justify-center gap-2 text-[11px] font-mono-numbers overflow-x-auto no-scrollbar">
          <span className={`font-bold uppercase tracking-wider shrink-0 ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-600'}`}>Trending:</span>
          {TRENDING_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag.replace('#', ''))}
              className={`transition shrink-0 font-medium ${isWhiteYellow ? 'text-zinc-600 hover:text-yellow-600' : 'text-zinc-400 hover:text-yellow-400'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── INSTAGRAM-STYLE MASONRY EXPLORE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[240px] md:auto-rows-[280px]">
        {filteredItems.map(item => {
          const isItemLiked = modalLiked[item.id];
          const isItemSaved = modalSaved[item.id];

          return (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
                isWhiteYellow
                  ? 'bg-white border border-zinc-200/90 shadow-xs hover:border-yellow-400/80 hover:shadow-md'
                  : 'bg-[#111113] border border-white/[0.08] hover:border-white/[0.2] hover:shadow-2xl'
              } ${item.spanClass || 'col-span-1 row-span-1'}`}
            >
              {/* Photo Media */}
              <img
                src={item.images[0]}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Corner Badges (Carousel / Video Reel / Pro) */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
                {item.isMultiImage && (
                  <div className="p-1.5 rounded-lg bg-[#09090B]/80 backdrop-blur-md border border-white/[0.1] text-white">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                )}
                {item.isVideoReel && (
                  <div className="p-1.5 rounded-lg bg-[#09090B]/80 backdrop-blur-md border border-white/[0.1] text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
                {item.isPro && (
                  <div className="p-1.5 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Telemetry pill on bottom left if present */}
              {item.telemetryTag && (
                <div className="absolute bottom-3 left-3 z-10 opacity-90 group-hover:opacity-0 transition-opacity pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-[#09090B]/85 backdrop-blur-md border border-white/[0.09] text-[10px] font-mono-numbers text-zinc-300 font-semibold shadow-md flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" />
                    <span>{item.telemetryTag}</span>
                  </span>
                </div>
              )}

              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 z-20">
                
                {/* Top Author Tag & Quick Bookmark */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/car/${getCarProfileId(item.authorHandle)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 min-w-0 group/author hover:opacity-90"
                    title={`View ${item.authorName}'s Atelier Dossier`}
                  >
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className="w-7 h-7 rounded-full object-cover border border-white/[0.2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white leading-none truncate group-hover/author:text-amber-400 transition-colors">
                        {item.authorHandle}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono-numbers truncate mt-0.5">{item.authorCar}</p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => handleToggleSave(item.id, e)}
                    className="p-1.5 rounded-lg bg-white/[0.1] hover:bg-white/[0.2] text-white transition shrink-0"
                    title={isItemSaved ? 'Saved' : 'Save to Pocket'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isItemSaved ? 'fill-white text-white' : ''}`} />
                  </button>
                </div>

                {/* Center Stat Counts (♥ Likes & 💬 Comments) */}
                <div className="flex items-center justify-center gap-6 text-white font-bold text-sm">
                  <span className="flex items-center gap-2 drop-shadow-md">
                    <Heart className={`w-5 h-5 ${isItemLiked ? 'fill-rose-500 text-rose-500' : 'fill-white text-white'}`} />
                    <span>{item.likesCount + (isItemLiked ? 1 : 0)}</span>
                  </span>
                  <span className="flex items-center gap-2 drop-shadow-md">
                    <MessageCircle className="w-5 h-5 fill-white text-white" />
                    <span>{item.commentsCount}</span>
                  </span>
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

      {/* ── INSTAGRAM-STYLE PHOTO DETAIL MODAL / LIGHTBOX ── */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
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
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white border border-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left 60%: Large Photo Media with Carousel */}
            <div className="w-full md:w-[60%] bg-black relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
              <img
                src={activeModalItem.images[modalImageIndex]}
                alt={activeModalItem.caption}
                className="w-full h-full object-cover max-h-[85vh]"
              />

              {/* Privacy Shield Plate Protection Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono-numbers text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Plate Protected · 800m Geofenced</span>
              </div>

              {/* Carousel Arrows */}
              {activeModalItem.images.length > 1 && (
                <>
                  {modalImageIndex > 0 && (
                    <button
                      onClick={() => setModalImageIndex(i => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white border border-white/10 hover:bg-black transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {modalImageIndex < activeModalItem.images.length - 1 && (
                    <button
                      onClick={() => setModalImageIndex(i => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white border border-white/10 hover:bg-black transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {activeModalItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalImageIndex(idx)}
                        className={`rounded-full transition-all ${idx === modalImageIndex ? 'w-4 h-1.5 bg-yellow-400' : 'w-1.5 h-1.5 bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right 40%: Author, Caption, Comments & Engagement */}
            <div className={`w-full md:w-[40%] flex flex-col justify-between border-t md:border-t-0 md:border-l ${
              isWhiteYellow ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#141418] border-white/[0.08] text-white'
            }`}>
              
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.08]'}`}>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/car/${getCarProfileId(activeModalItem.authorHandle)}`}
                    className="flex items-center gap-3 group"
                    title={`Inspect ${activeModalItem.authorName}'s Atelier Dossier`}
                  >
                    <img
                      src={activeModalItem.authorAvatar}
                      alt={activeModalItem.authorName}
                      className={`w-10 h-10 rounded-full object-cover border transition-transform group-hover:scale-105 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/10'}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold leading-none group-hover:text-amber-400 transition-colors ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                          {activeModalItem.authorHandle}
                        </p>
                        {activeModalItem.isPro && (
                          <span className="text-[9px] font-mono-numbers px-1.5 py-0.2 rounded bg-yellow-400 text-zinc-950 font-bold border border-yellow-500">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-mono-numbers mt-0.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>{activeModalItem.authorCar}</p>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/car/${getCarProfileId(activeModalItem.authorHandle)}`}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono-numbers font-semibold transition ${
                      isWhiteYellow
                        ? 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                        : 'border-white/15 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    Dossier →
                  </Link>
                  <button className={`text-xs font-bold transition font-mono-numbers ${isWhiteYellow ? 'text-yellow-600 hover:text-yellow-700' : 'text-yellow-400 hover:text-yellow-300'}`}>
                    Follow
                  </button>
                </div>
              </div>

              {/* Scrollable Caption & Discussion */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar max-h-[350px]">
                {/* Author Caption */}
                <div className="flex items-start gap-3">
                  <img
                    src={activeModalItem.authorAvatar}
                    alt={activeModalItem.authorName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="text-xs space-y-1">
                    <p>
                      <span className={`font-bold mr-1.5 ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>{activeModalItem.authorHandle}</span>
                      <span className={`leading-relaxed font-sans ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>{activeModalItem.caption}</span>
                    </p>
                    {activeModalItem.telemetryTag && (
                      <span className={`inline-block text-[10px] font-mono-numbers px-2 py-0.5 rounded border ${
                        isWhiteYellow ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 'bg-white/[0.06] text-zinc-400 border-white/[0.06]'
                      }`}>
                        {activeModalItem.telemetryTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`border-t pt-3 space-y-3 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.06]'}`}>
                  <p className={`text-[11px] font-mono-numbers uppercase tracking-wider ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Driver Comments ({activeModalItem.commentsCount + (modalComments[activeModalItem.id]?.length || 0)})
                  </p>

                  {/* Seeded discussion preview */}
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
                      className={`transition ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
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
                      className={`transition ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Share2 className="w-5 h-5 -rotate-12" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleToggleSave(activeModalItem.id, e)}
                    className={`transition ${isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Bookmark
                      className={`w-6 h-6 ${modalSaved[activeModalItem.id] ? 'fill-yellow-500 text-yellow-500' : ''}`}
                    />
                  </button>
                </div>

                <p className={`text-xs font-bold font-mono-numbers ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  {(activeModalItem.likesCount + (modalLiked[activeModalItem.id] ? 1 : 0)).toLocaleString()} drivers respected
                </p>

                {/* Inline Comment Input */}
                <form onSubmit={handlePostModalComment} className={`flex items-center gap-2 pt-1 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.06]'}`}>
                  <Smile className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={modalCommentInput}
                    onChange={(e) => setModalCommentInput(e.target.value)}
                    placeholder="Add a comment as MAYA…"
                    className={`flex-1 bg-transparent text-xs font-sans focus:outline-none ${isWhiteYellow ? 'text-zinc-900 placeholder-zinc-400' : 'text-white placeholder-zinc-500'}`}
                  />
                  {modalCommentInput.trim() && (
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-yellow-400 text-zinc-950 hover:bg-yellow-300 transition font-mono-numbers shadow-xs"
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
