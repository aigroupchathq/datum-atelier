import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { mockMayaVehicle, mockOtherVehicles } from '../data/mockData';
import type { CommunityPost } from '../types';
import { FeedCard } from '../components/feed/FeedCard';
import { StoriesBar } from '../components/feed/StoriesBar';
import { FeedEmptyState } from '../components/feed/FeedEmptyState';
import { GripMetricCard } from '../components/telemetry/GripMetricCard';
import { fetchPassLiveWeather, type PassLiveWeatherData } from '../utils/openMeteoWeather';
import { useTheme } from '../context/ThemeContext';
import {
  Compass,
  GitCommit,
  ShieldCheck,
  ArrowRight,
  Route,
  Camera,
  HelpCircle,
  Users,
  RefreshCw
} from 'lucide-react';

interface FeedPageProps {
  onOpenCreatePost: (initialMode?: 'post' | 'story') => void;
  posts: CommunityPost[];
  onOpenPassRadar?: (passId?: string) => void;
  onOpenDriveTracker?: () => void;
}

// Shimmer skeleton — uses .skeleton CSS class from index.css
const SkeletonCard: FC = () => (
  <div className="card-surface overflow-hidden">
    <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-200/50">
      <div className="w-9 h-9 rounded-full skeleton" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-24 rounded skeleton" />
        <div className="h-2 w-16 rounded skeleton opacity-60" />
      </div>
    </div>
    <div className="skeleton aspect-[16/10] w-full" />
    <div className="px-4 py-3 space-y-2.5">
      <div className="flex gap-4 mb-1">
        {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full skeleton" />)}
      </div>
      <div className="h-2.5 w-28 rounded skeleton" />
      <div className="h-2 w-full rounded skeleton opacity-70" />
      <div className="h-2 w-3/4 rounded skeleton opacity-50" />
    </div>
  </div>
);

const POSTS_PER_PAGE = 8;

export const FeedPage: FC<FeedPageProps> = ({ onOpenCreatePost, posts, onOpenPassRadar, onOpenDriveTracker }) => {
  const { isWhiteYellow, themeMeta, cycleTheme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<'maya' | 'kuro'>('maya');
  const [followedCars, setFollowedCars] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('datum_followed_handles');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { 'kuro_gt3': true, 'yuki_gr_yaris': false, 'apex_720s': false, 'e30_heritage': false };
  });
  const [liveSnakePassWeather, setLiveSnakePassWeather] = useState<PassLiveWeatherData | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPassLiveWeather('snake-pass-a57').then((data) => {
      if (isMounted) setLiveSnakePassWeather(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleFollow = (handle: string) => {
    setFollowedCars(prev => {
      const next = { ...prev, [handle]: !prev[handle] };
      try { localStorage.setItem('datum_followed_handles', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => { setVisibleCount(c => c + POSTS_PER_PAGE); setIsLoadingMore(false); }, 500);
  };

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'drives') return post.postType === 'DRIVE';
    if (selectedFilter === 'builds') return post.postType === 'BUILD_UPDATE';
    if (selectedFilter === 'tech') return post.postType === 'GUIDE' || post.postType === 'MILESTONE' || post.postType === 'MAINTENANCE_UPDATE';
    if (selectedFilter === 'arrivals') return post.postType === 'CAR_POST' || post.postType === 'CAR_STORY';
    if (selectedFilter === 'events') return post.postType === 'EVENT';
    if (selectedFilter === 'questions') return post.postType === 'QUESTION';
    return true;
  });

  const activeCar = selectedPersona === 'maya' ? mockMayaVehicle : mockOtherVehicles[0];

  const FILTERS = [
    { id: 'all', label: 'All Journals' },
    { id: 'drives', label: 'Passes & Expeditions' },
    { id: 'builds', label: 'Chassis Builds' },
    { id: 'tech', label: 'Workshop & Tech' },
    { id: 'arrivals', label: 'Sovereign Arrivals' },
    { id: 'events', label: 'Paddock Convoys' },
    { id: 'questions', label: 'Owner Inquiries' },
  ];

  const SUGGESTED = [
    { id: 'julian_vane', handle: 'julian_vane', model: 'AC Cobra 427 & Ferrari 488', reason: 'Chilterns Private Custody', img: '/feed/stone_garage_cobra_ferrari.jpg' },
    { id: 'hamish_heritage', handle: 'hamish_heritage', model: 'Master Engine Rebuild Bench', reason: 'Highland Workshop Mentorship', img: '/feed/heritage_wrenching_workshop.jpg' },
    { id: 'midlands_sanctuary', handle: 'midlands_sanctuary', model: 'Cooperative Atelier (24 Bays)', reason: 'Independent Custodian Hall', img: '/feed/collective_atelier_hall.jpg' },
    { id: 'cairngorm_crew', handle: 'cairngorm_crew', model: 'Highland Overland Guild', reason: 'Sub-Zero Expedition Crew', img: '/feed/snow_mountain_overland_convoy.jpg' },
    { id: 'kuro_gt3', handle: 'kuro_gt3', model: 'Porsche 911 GT3 Touring', reason: 'Harpenden, Hertfordshire', img: '/real_uk_gt3_suburb.jpg' },
  ];

  return (
    // Atelier Cockpit Horizon — Authoritative 640px stage + 360px Telemetry Co-Pilot Console
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-10">

        {/* ════════════════════════════════════════
            MAIN ATELIER LEDGER COLUMN (Dynamically adapted by Cockpit Typology)
        ════════════════════════════════════════ */}
        <main className={`w-full ${themeMeta.feedWidthClass} mx-auto lg:mx-0 space-y-6 shrink-0 transition-all duration-300`}>

          {/* Active Cockpit Mode Indicator & Quick Ergonomic Selector */}
          <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] font-mono-numbers transition-all ${
            isWhiteYellow
              ? 'bg-[#FFFFFF] border-stone-200/80 bevel-porcelain text-stone-700'
              : 'bg-[#141418] border-white/10 bevel-machined text-zinc-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isWhiteYellow ? 'bg-[#D4AF37]' : 'bg-[#C5A059]'
              }`} />
              <span className="uppercase tracking-widest font-bold">
                TOPOLOGY // {themeMeta.layoutTitle.toUpperCase()}
              </span>
            </div>
            <button
              onClick={cycleTheme}
              className={`text-[9.5px] uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 px-2 py-0.5 rounded-lg cursor-pointer ${
                isWhiteYellow
                  ? 'text-[#B8860B] hover:text-black bg-stone-100 hover:bg-stone-200/60'
                  : 'text-[#C5A059] hover:text-white bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
              title="Cycle through the 5 cockpit ergonomic layouts"
            >
              <span>Shift Mode ({themeMeta.name.split('&')[0].trim()})</span>
              <span>→</span>
            </button>
          </div>

          {/* Stories rail */}
          <StoriesBar onAddStory={() => onOpenCreatePost('story')} />

          {/* Create trigger — refined atelier journal prompt */}
          <div className={`p-4 sm:p-5 space-y-3.5 rounded-[26px] border transition-colors ${
            isWhiteYellow
              ? 'bg-white border-zinc-200/90 shadow-xs'
              : 'card-surface'
          }`}>
            <div className="flex items-center gap-3">
              <Link to="/car/car-maya-m3" className="shrink-0" title="Inspect active vehicle passport">
                <div className="w-10 h-10 rounded-full ring-maya p-[1.5px] transition-transform duration-300 hover:scale-105 shadow-sm">
                  <img
                    src={activeCar.heroImageUrl}
                    alt={activeCar.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </Link>

              <button
                onClick={() => onOpenCreatePost('post')}
                className={`flex-1 text-left px-4 py-2.5 rounded-2xl border transition-all font-sans flex items-center justify-between group ${
                  isWhiteYellow
                    ? 'bg-zinc-100 hover:bg-zinc-200/70 border-zinc-200 hover:border-yellow-400/60 text-zinc-600 hover:text-zinc-950'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-amber-400/30 text-zinc-400 hover:text-zinc-200 shadow-inner'
                }`}
              >
                <span className="truncate">Chronicle today's journey with {activeCar.name}…</span>
                <span className={`text-[10.5px] font-mono-numbers px-2.5 py-1 rounded-full border transition shrink-0 ml-2 font-bold ${
                  isWhiteYellow
                    ? 'bg-yellow-400 text-zinc-950 border-yellow-500 shadow-xs group-hover:bg-yellow-300'
                    : 'bg-amber-400/10 text-amber-300 border-amber-400/25 group-hover:bg-amber-400/20 group-hover:border-amber-400/40'
                }`}>
                  Chronicle
                </span>
              </button>
            </div>

            {/* Post type shortcuts */}
            <div className={`grid grid-cols-4 gap-1.5 pt-2.5 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.05]'}`}>
              {[
                { label: 'Story', icon: <Camera className={`w-3.5 h-3.5 transition ${isWhiteYellow ? 'text-zinc-500 group-hover:text-yellow-600' : 'text-zinc-400 group-hover:text-amber-300'}`} />, action: () => onOpenCreatePost('story') },
                { label: 'Expedition', icon: <Compass className={`w-3.5 h-3.5 transition ${isWhiteYellow ? 'text-zinc-500 group-hover:text-yellow-600' : 'text-zinc-400 group-hover:text-amber-300'}`} />, action: () => onOpenDriveTracker ? onOpenDriveTracker() : onOpenCreatePost('post') },
                { label: 'Spec Build', icon: <GitCommit className={`w-3.5 h-3.5 transition ${isWhiteYellow ? 'text-zinc-500 group-hover:text-yellow-600' : 'text-zinc-400 group-hover:text-sky-300'}`} />, action: () => onOpenCreatePost('post') },
                { label: 'Inquiry', icon: <HelpCircle className={`w-3.5 h-3.5 transition ${isWhiteYellow ? 'text-zinc-500 group-hover:text-yellow-600' : 'text-zinc-400 group-hover:text-emerald-300'}`} />, action: () => onOpenCreatePost('post') },
              ].map(({ label, icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[11.5px] font-medium transition group ${
                    isWhiteYellow
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Active Expedition & Waypoint HUD Banner */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono-numbers transition-all ${
              isWhiteYellow
                ? 'bg-amber-50/70 border-amber-300 text-zinc-950 shadow-xs'
                : 'bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/25 text-white'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  isWhiteYellow ? 'bg-yellow-400 text-zinc-950' : 'bg-amber-400 text-black'
                }`}>
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold flex items-center gap-2 truncate">
                    <span>Active Mountain Pass Tracker</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                      AWARE MOTORING
                    </span>
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Log scenic turnout waypoints, harmonize with road grip & earn Respects
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenDriveTracker?.()}
                className={`px-3.5 py-2 rounded-xl font-bold shrink-0 text-xs transition shadow-md flex items-center gap-1.5 active:scale-95 ${
                  isWhiteYellow
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black'
                }`}
              >
                <span>Track Drive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter pills with smooth horizontal scrolling */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {FILTERS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    selectedFilter === tab.id
                      ? isWhiteYellow
                        ? 'bg-yellow-400 text-zinc-950 font-bold border border-yellow-500 shadow-sm shadow-yellow-500/20'
                        : 'bg-amber-400/15 text-amber-300 border border-amber-400/35 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                      : isWhiteYellow
                        ? 'text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05]'
                  }`}
                >
                  {selectedFilter === tab.id && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isWhiteYellow ? 'bg-zinc-950' : 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]'}`} />
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <span className={`text-[10.5px] font-mono-numbers hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 ${
              isWhiteYellow
                ? 'bg-white border-zinc-200 text-zinc-600 shadow-xs'
                : 'bg-white/[0.03] border-white/[0.05] text-zinc-500'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredPosts.length} entries
            </span>
          </div>

          {/* Feed posts */}
          <div className="space-y-5">
            {isLoading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : (
              <>
                {filteredPosts.slice(0, visibleCount).map((post, i) => (
                  <div
                    key={post.id}
                    className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                  >
                    <FeedCard post={post} />
                  </div>
                ))}

                {filteredPosts.length > visibleCount ? (
                  <div className="flex justify-center py-2">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold transition disabled:opacity-50 ${
                        isWhiteYellow
                          ? 'bg-white border border-zinc-200 hover:border-yellow-400 hover:bg-yellow-50/50 text-zinc-900 shadow-xs'
                          : 'bg-white/[0.04] border border-white/[0.09] hover:border-amber-400/30 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isLoadingMore
                        ? <><RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-500" /><span>Loading journals…</span></>
                        : <span>Load More Journals</span>
                      }
                    </button>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className={`text-center py-8 border-t space-y-1.5 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.05]'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mx-auto ${isWhiteYellow ? 'bg-yellow-500' : 'bg-amber-400/40'}`} />
                    <p className={`text-[11px] font-mono-numbers uppercase tracking-widest ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      You're all caught up
                    </p>
                    <p className={`text-[10.5px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      All verified sovereign journals up to date
                    </p>
                  </div>
                ) : (
                  <FeedEmptyState filterId={selectedFilter} onOpenCreatePost={onOpenCreatePost} />
                )}
              </>
            )}
          </div>

        </main>

        {/* ════════════════════════════════════════
            RIGHT TELEMETRY CO-PILOT CONSOLE (360px width)
        ════════════════════════════════════════ */}
        <aside className="hidden lg:flex w-[360px] xl:w-[380px] shrink-0 flex-col gap-5 sticky top-20">

          {/* Active car profile */}
          <div className={`p-4 rounded-[24px] border transition-colors ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 shadow-xs' : 'card-surface'
          }`}>
            <div className="flex items-center justify-between">
              <Link to={`/car/${activeCar.id}`} className="flex items-center gap-3 group min-w-0">
                <div className="w-11 h-11 rounded-full ring-maya p-[2px] shrink-0 transition group-hover:scale-105">
                  <img
                    src={activeCar.heroImageUrl}
                    alt={activeCar.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate transition-colors ${
                    isWhiteYellow ? 'text-zinc-950 group-hover:text-yellow-600' : 'text-[#F4F4F5] group-hover:text-amber-300'
                  }`}>
                    {activeCar.name}
                  </p>
                  <p className={`text-[11px] font-mono-numbers truncate ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    {activeCar.make} · {activeCar.model}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setSelectedPersona(selectedPersona === 'maya' ? 'kuro' : 'maya')}
                className={`text-[12px] font-bold transition shrink-0 font-mono-numbers ${
                  isWhiteYellow ? 'text-yellow-700 hover:text-yellow-800' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Switch
              </button>
            </div>

            {/* 3 metric chips */}
            <div className={`grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.06]'}`}>
              {[
                { label: 'Drives', value: String(activeCar.metrics.drivesCount) },
                { label: 'Miles', value: `${(activeCar.spec.mileageCurrent / 1000).toFixed(1)}k` },
                { label: 'Health', value: '92%', accent: true },
              ].map(({ label, value, accent }) => (
                <div 
                  key={label} 
                  className={`p-2 text-center rounded-xl border ${
                    isWhiteYellow
                      ? 'bg-zinc-50 border-zinc-200/80'
                      : 'card-surface-elevated'
                  }`}
                >
                  <p className={`text-[10px] font-mono-numbers uppercase ${isWhiteYellow ? 'text-zinc-500 font-semibold' : 'text-zinc-600'}`}>{label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${
                    accent 
                      ? isWhiteYellow ? 'text-emerald-700' : 'text-emerald-400' 
                      : isWhiteYellow ? 'text-zinc-950' : 'text-[#F4F4F5]'
                  }`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested cars */}
          <div className={`p-4 space-y-4 rounded-[24px] border transition-colors ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 shadow-xs' : 'card-surface'
          }`}>
            <div className="flex items-center justify-between">
              <p className={`text-[11px] font-bold uppercase tracking-wider font-mono-numbers ${
                isWhiteYellow ? 'text-zinc-900' : 'text-zinc-400'
              }`}>
                Suggested For You
              </p>
              <Link to="/explore" className={`text-[11px] transition ${
                isWhiteYellow ? 'text-yellow-700 hover:text-yellow-800 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {SUGGESTED.map(car => (
                <div key={car.id} className="flex items-center justify-between gap-2">
                  <Link to={`/car/${car.id}`} className="flex items-center gap-2.5 group min-w-0">
                    <img
                      src={car.img}
                      alt={car.handle}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`text-[12px] font-semibold truncate transition ${
                        isWhiteYellow ? 'text-zinc-900 group-hover:text-yellow-600' : 'text-zinc-200 group-hover:text-white'
                      }`}>
                        {car.handle}
                      </p>
                      <p className={`text-[10px] font-mono-numbers truncate ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-600'}`}>{car.reason}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleFollow(car.handle)}
                    className={`text-[11px] font-bold shrink-0 transition px-3 py-1 rounded-lg font-mono-numbers ${
                      followedCars[car.id]
                        ? isWhiteYellow
                          ? 'text-zinc-600 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200'
                          : 'text-zinc-500 bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.08]'
                        : isWhiteYellow
                          ? 'text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border border-yellow-500 shadow-xs'
                          : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    {followedCars[car.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active convoys */}
          <div className={`p-4 space-y-3 rounded-[24px] border transition-colors ${
            isWhiteYellow ? 'bg-white border-zinc-200/90 shadow-xs' : 'card-surface'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Route className={`w-3.5 h-3.5 ${isWhiteYellow ? 'text-yellow-600' : 'text-orange-400'}`} />
                <p className={`text-[11px] font-bold uppercase tracking-wider font-mono-numbers ${
                  isWhiteYellow ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  Active Convoys
                </p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <Link
              to="/drive/drive-184"
              className={`block p-3 rounded-xl border transition group ${
                isWhiteYellow
                  ? 'bg-zinc-50 border-zinc-200 hover:border-yellow-400/80 hover:bg-yellow-50/30'
                  : 'bg-[#0D0D0F] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between text-[12px] font-bold transition">
                <span className={isWhiteYellow ? 'text-zinc-950 group-hover:text-yellow-600' : 'text-zinc-200 group-hover:text-white'}>
                  Snake Pass (A57) Dawn Run
                </span>
                <span className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded-md font-bold ${
                  isWhiteYellow
                    ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                    : 'bg-orange-500/[0.08] text-orange-400 border border-orange-500/20'
                }`}>
                  Sun 06:00
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-mono-numbers ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-600'}`}>
                14 cars confirmed · Peak District · 800m privacy
              </p>
            </Link>

            <Link
              to="/communities"
              className={`flex items-center justify-between text-[12px] transition pt-0.5 ${
                isWhiteYellow ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Explore 15 Subculture Guilds</span>
              </span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Live Pass Surface Grip & Weather Radar */}
          <GripMetricCard
            locationName="Snake Pass"
            roadNumber="A57"
            inputs={{
              surfaceTempC: liveSnakePassWeather?.surfaceTempC ?? 6.1,
              airTempC: liveSnakePassWeather?.airTempC ?? 7.2,
              surfaceCondition: liveSnakePassWeather?.surfaceCondition ?? 'Damp Bitumen',
              rainMmPerHour: liveSnakePassWeather?.rainMmPerHour ?? 0.8,
              tyreTempC: 38
            }}
            onOpenRadarModal={onOpenPassRadar ? () => onOpenPassRadar('snake-pass-a57') : undefined}
            sourceLabel={liveSnakePassWeather?.sourceAttribution ?? "UK Met Office Road Sensors"}
            freshnessLabel={liveSnakePassWeather?.freshness ?? "Updated 4m ago"}
          />

          {/* Privacy guardian */}
          <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border ${
            isWhiteYellow
              ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
              : 'border-emerald-500/[0.15] bg-emerald-500/[0.04]'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className={`text-[11px] font-bold ${isWhiteYellow ? 'text-emerald-900' : 'text-emerald-400'}`}>PRIVACY VEIL ACTIVE</p>
              <p className={`text-[10px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-600'}`}>Plates blurred · 800m route protected</p>
            </div>
          </div>

          {/* Footer */}
          <div className={`text-[10px] font-mono-numbers space-y-1.5 px-0.5 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-700'}`}>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {['About', 'Privacy', 'DVSA Registry', 'Pro Directory', 'Rules'].map(l => (
                <span key={l} className={`cursor-pointer transition ${isWhiteYellow ? 'hover:text-zinc-900' : 'hover:text-zinc-500'}`}>{l}</span>
              ))}
            </div>
            <p>© 2026 GARAGE · THE DIGITAL HOME FOR YOUR CAR</p>
          </div>

        </aside>

      </div>
    </div>
  );
};
