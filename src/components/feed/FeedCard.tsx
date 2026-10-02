import { useState, useRef, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { CommunityPost } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { PlateBlurImage } from '../common/PlateBlurImage';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Compass,
  GitCommit,
  ArrowRight,
  Share2,
  Copy,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Activity,
  Info,
  Award,
  Wrench,
  Route,
  X
} from 'lucide-react';

interface FeedCardProps {
  post: CommunityPost;
}

interface CommentEntry {
  id: string;
  authorHandle: string;
  authorName: string;
  authorCar: string;
  avatarUrl: string;
  text: string;
  timeAgo: string;
  likes: number;
  liked: boolean;
  isVerifiedPro?: boolean;
}

// Certified Custodian Respect criteria (grounded in respectRatingEngine)
export interface RespectCriterion {
  id: string;
  label: string;
  points: number;
}

export const RESPECT_CRITERIA: RespectCriterion[] = [
  { id: 'flow', label: 'Smooth Flow (Cornering Composure)', points: 30 },
  { id: 'thermal', label: 'Thermal Tempo (Warmup Patience)', points: 25 },
  { id: 'waypoint', label: 'Scenic Waypoint Photo Verification', points: 20 },
  { id: 'hazard', label: 'Community Road Hazard Alert', points: 50 },
];

// Snake Pass sample elevation profile for drive scrub bar
const ELEVATION_WAYPOINTS = [
  { progress: 0.0, elevationFt: 420, speedMph: 35, gForce: '+0.05G', sector: 'Rivelin Incline', distanceMi: 0.0 },
  { progress: 0.2, elevationFt: 780, speedMph: 68, gForce: '+0.18G', sector: 'Ladybower Straight', distanceMi: 16.9 },
  { progress: 0.35, elevationFt: 860, speedMph: 42, gForce: '-0.92G', sector: 'Reservoir Hairpin', distanceMi: 27.0 },
  { progress: 0.55, elevationFt: 1410, speedMph: 58, gForce: '+0.76G', sector: 'Snake South Curves', distanceMi: 40.6 },
  { progress: 0.70, elevationFt: 1688, speedMph: 79, gForce: '+0.08G', sector: 'High Peak Summit (1,688 ft)', distanceMi: 48.2 },
  { progress: 0.85, elevationFt: 1210, speedMph: 50, gForce: '-0.95G', sector: 'Doctors Gate Switchback', distanceMi: 62.6 },
  { progress: 1.0, elevationFt: 590, speedMph: 30, gForce: '+0.02G', sector: 'Glossop Moor Finish', distanceMi: 84.6 },
];

// Seeded realistic automotive discussion thread
const SEED_COMMENTS: CommentEntry[] = [
  {
    id: 'c1',
    authorHandle: 'kuro_gt3',
    authorName: 'KURO',
    authorCar: 'Porsche 911 GT3 (992)',
    avatarUrl: '/real_uk_gt3_suburb.jpg',
    text: 'This is what motoring should always be about. Shared knowledge and open garage doors over gatekeeping.',
    timeAgo: '45m',
    likes: 18,
    liked: false
  },
  {
    id: 'c2',
    authorHandle: 'hamish_heritage',
    authorName: 'Hamish MacLeod',
    authorCar: 'Heritage Engine Bench',
    avatarUrl: '/feed/heritage_wrenching_workshop.jpg',
    text: 'If anyone in the community needs a dial bore gauge or ring filing tool this weekend, my workshop doors in the hills are always unlocked.',
    timeAgo: '30m',
    likes: 34,
    liked: true,
    isVerifiedPro: true
  },
  {
    id: 'c3',
    authorHandle: 'retromod_dan',
    authorName: 'Dan (E30)',
    authorCar: 'BMW 318is Slicktop',
    avatarUrl: '/real_uk_e30_terrace.jpg',
    text: 'Spot on. We protect the hobby by welcoming the next generation in, not locking them out.',
    timeAgo: '15m',
    likes: 12,
    liked: false
  }
];

// Helper for editorial post category badges based on theme
const getCategoryBadge = (postType: string, isWhiteYellow: boolean) => {
  const configs: Record<string, { label: string; lightClass: string; darkClass: string }> = {
    'DRIVE': { label: 'B-Road Expedition', lightClass: 'text-yellow-950 bg-yellow-100 border-yellow-300 font-bold', darkClass: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
    'BUILD_UPDATE': { label: 'Chassis Spec', lightClass: 'text-sky-900 bg-sky-100 border-sky-300 font-bold', darkClass: 'text-sky-300 bg-sky-500/10 border-sky-500/25' },
    'MILESTONE': { label: 'DVSA Statutory Pass', lightClass: 'text-emerald-900 bg-emerald-100 border-emerald-300 font-bold', darkClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25' },
    'GUIDE': { label: 'Workshop Blueprint', lightClass: 'text-yellow-950 bg-yellow-100 border-yellow-300 font-bold', darkClass: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
    'MAINTENANCE_UPDATE': { label: 'Atelier Service Log', lightClass: 'text-purple-900 bg-purple-100 border-purple-300 font-bold', darkClass: 'text-purple-300 bg-purple-500/10 border-purple-500/25' },
    'EVENT': { label: 'Paddock Convoy', lightClass: 'text-rose-900 bg-rose-100 border-rose-300 font-bold', darkClass: 'text-rose-300 bg-rose-500/10 border-rose-500/25' },
    'CAR_POST': { label: 'Sovereign Journal', lightClass: 'text-zinc-800 bg-zinc-100 border-zinc-300 font-bold', darkClass: 'text-zinc-300 bg-white/[0.05] border-white/[0.1]' },
    'CAR_STORY': { label: 'Atelier Vignette', lightClass: 'text-yellow-950 bg-yellow-100 border-yellow-300 font-bold', darkClass: 'text-amber-200 bg-amber-500/10 border-amber-500/20' },
    'QUESTION': { label: 'Technical Inquiry', lightClass: 'text-zinc-800 bg-zinc-100 border-zinc-300 font-bold', darkClass: 'text-zinc-300 bg-white/[0.05] border-white/[0.1]' }
  };
  const cfg = configs[postType] || { label: postType.replace('_', ' '), lightClass: 'text-zinc-700 bg-zinc-100 border-zinc-200', darkClass: 'text-zinc-400 bg-white/5 border-white/10' };
  return {
    label: cfg.label,
    className: isWhiteYellow ? cfg.lightClass : cfg.darkClass
  };
};

// Animated like counter — slides up on bump
const LikeCounter: FC<{ count: number; bumped: boolean; isWhiteYellow?: boolean }> = ({ count, bumped, isWhiteYellow }) => (
  <span
    key={bumped ? 'b' : 'n'}
    className={`font-bold tabular-nums transition-all duration-200 ${
      isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'
    } ${bumped ? 'animate-in slide-in-from-bottom-2 fade-in' : ''}`}
  >
    {count.toLocaleString()}
  </span>
);

export const FeedCard: FC<FeedCardProps> = ({ post }) => {
  const { showToast } = useToast();
  const { isWhiteYellow } = useTheme();

  const [respected, setRespected] = useState(false);
  const [showRespectMenu, setShowRespectMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [likeCountBumped, setLikeCountBumped] = useState(false);
  const [showRespectBurst, setShowRespectBurst] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPrivacyPopover, setShowPrivacyPopover] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  
  // Interactive Comment Drawer state
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [drawerInput, setDrawerInput] = useState('');
  const [comments, setComments] = useState<CommentEntry[]>(SEED_COMMENTS);
  const [repliesCount, setRepliesCount] = useState(post.repliesCount || SEED_COMMENTS.length);

  // Carousel
  const mediaUrls = post.mediaUrls.length > 1
    ? post.mediaUrls
    : post.mediaUrls.length === 1
    ? [post.mediaUrls[0], post.mediaUrls[0]]
    : [];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);

  // Interactive Drive Telemetry scrub state
  const [scrubProgress, setScrubProgress] = useState(0.70); // default at peak summit
  const [isPlayingTelemetry, setIsPlayingTelemetry] = useState(false);

  // Interpolated telemetry point
  const currentTelemetry = useMemo(() => {
    let p = ELEVATION_WAYPOINTS[0];
    for (let i = 0; i < ELEVATION_WAYPOINTS.length; i++) {
      if (scrubProgress >= ELEVATION_WAYPOINTS[i].progress) {
        p = ELEVATION_WAYPOINTS[i];
      }
    }
    return p;
  }, [scrubProgress]);

  // Telemetry simulation auto-play loop
  useEffect(() => {
    if (!isPlayingTelemetry) return;
    const interval = setInterval(() => {
      setScrubProgress((prev) => {
        const next = prev + 0.04;
        if (next >= 1) {
          setIsPlayingTelemetry(false);
          return 0;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlayingTelemetry]);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndex(i => Math.max(0, i - 1));
  };
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndex(i => Math.min(mediaUrls.length - 1, i + 1));
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (delta < -40 && carouselIndex < mediaUrls.length - 1) setCarouselIndex(i => i + 1);
    else if (delta > 40 && carouselIndex > 0) setCarouselIndex(i => i - 1);
    dragStartX.current = null;
  };

  const triggerRespect = () => {
    if (!respected) {
      setLikesCount(c => c + 25);
      setRespected(true);
      setLikeCountBumped(true);
      setTimeout(() => setLikeCountBumped(false), 600);
      showToast({
        title: `Respect Ratified for ${post.authorVehicleName || 'Chassis'}`,
        message: 'Driver telemetry respect recorded',
        type: 'kudos',
        badge: '+25 RESPECT'
      });
    }
    setShowRespectBurst(true);
    setTimeout(() => setShowRespectBurst(false), 900);
  };

  const handleToggleRespect = () => {
    if (respected) {
      setLikesCount(c => Math.max(0, c - 25));
      setRespected(false);
    } else {
      setLikesCount(c => c + 25);
      setRespected(true);
      setLikeCountBumped(true);
      setTimeout(() => setLikeCountBumped(false), 600);
      showToast({
        title: `Respect Ratified for ${post.authorVehicleName || 'Chassis'}`,
        message: 'Driver telemetry respect recorded',
        type: 'kudos',
        badge: '+25 RESPECT'
      });
    }
  };

  const handleAwardCriterion = (criterion: RespectCriterion) => {
    if (!respected) {
      setRespected(true);
    }
    setLikesCount(c => c + criterion.points);
    setShowRespectMenu(false);
    showToast({
      title: `${criterion.label}`,
      message: `+${criterion.points} Certified Respects awarded to ${post.authorVehicleName}`,
      type: 'kudos',
      badge: `+${criterion.points} PTS`
    });
  };

  const handleToggleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    showToast({
      title: nextSaved ? 'Saved to Offline Pocket' : 'Removed from Saved',
      message: nextSaved ? 'Route GPX & telemetry cached for offline driving' : undefined,
      type: 'drive',
      badge: nextSaved ? 'SAVED' : undefined
    });
  };

  const postNewComment = (text: string) => {
    if (!text.trim()) return;
    const newEntry: CommentEntry = {
      id: `c-${Date.now()}`,
      authorHandle: 'maya_m3',
      authorName: 'MAYA',
      authorCar: 'BMW M3 Competition',
      avatarUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=90',
      text: text.trim(),
      timeAgo: 'Just now',
      likes: 1,
      liked: true
    };
    setComments(prev => [newEntry, ...prev]);
    setRepliesCount(c => c + 1);
    showToast({
      title: 'Comment Published',
      message: 'Added as MAYA (BMW M3 Competition)',
      type: 'success'
    });
  };

  const handleInlineComment = (e: React.FormEvent) => {
    e.preventDefault();
    postNewComment(commentInput);
    setCommentInput('');
  };

  const handleDrawerComment = (e: React.FormEvent) => {
    e.preventDefault();
    postNewComment(drawerInput);
    setDrawerInput('');
  };

  const toggleCommentLike = (id: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            liked: !c.liked,
            likes: c.liked ? c.likes - 1 : c.likes + 1
          };
        }
        return c;
      })
    );
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText?.(window.location.href);
    showToast({
      title: 'Link Copied to Clipboard',
      message: 'Share this sovereign car post anywhere',
      type: 'clipboard'
    });
    setTimeout(() => {
      setCopiedLink(false);
      setIsOptionsOpen(false);
    }, 1200);
  };

  const categoryBadge = getCategoryBadge(post.postType, isWhiteYellow);

  return (
    // Haute-Horlogerie Milled Obsidian Plinth
    <article className={`group relative transition-all duration-300 ${
      isWhiteYellow
        ? 'bg-white border border-zinc-200/90 shadow-sm hover:border-yellow-400/60 rounded-[24px]'
        : 'bg-[#0B0C10] border border-white/[0.08] hover:border-amber-400/30 shadow-xl rounded-[24px]'
    } overflow-hidden`}>

      {/* ── HEADER ── */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">

          {/* Avatar ring */}
          <Link to={`/car/${post.authorVehicleId || 'car-maya-m3'}`} className="shrink-0 group/av">
            <div className="w-10 h-10 rounded-full p-[1.5px] ring-maya transition-transform duration-300 group-hover/av:scale-105 shadow-sm">
              <div className={`w-full h-full rounded-full p-[1.5px] overflow-hidden ${isWhiteYellow ? 'bg-white' : 'bg-[#09090B]'}`}>
                <img
                  src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=90'}
                  alt={post.authorVehicleName || 'Car'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/car/${post.authorVehicleId || 'car-maya-m3'}`}
                className={`text-[14.5px] font-bold transition-colors tracking-tight leading-snug truncate ${
                  isWhiteYellow ? 'text-zinc-950 hover:text-yellow-600' : 'text-white hover:text-amber-300'
                }`}
              >
                {post.authorVehicleName || 'Automotive Member'}
              </Link>

              <ProvenanceBadge type={post.provenanceTag} />
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs">
              {post.authorVehicleModel && (
                <span className={`truncate font-medium ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {post.authorVehicleModel}
                </span>
              )}
              {post.authorVehicleModel && <span className={isWhiteYellow ? 'text-zinc-300' : 'text-zinc-600'}>·</span>}
              <span className={`font-mono-numbers text-[11px] shrink-0 ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {post.createdAt}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryBadge.className} font-mono-numbers hidden sm:inline-flex`}>
            {categoryBadge.label}
          </span>

          <button
            onClick={() => setIsOptionsOpen(true)}
            className={`p-2 rounded-full transition cursor-pointer ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
            }`}
            title="Post Options & Privacy Guardrails"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CINEMATIC EDGE-TO-EDGE MEDIA PLINTH ── */}
      {mediaUrls.length > 0 && (
        <div
          className="relative w-full overflow-hidden bg-black/80 cursor-pointer select-none group/media"
          onDoubleClick={triggerRespect}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle editorial vignette overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 opacity-70 z-[1]" />

          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {mediaUrls.map((url, i) => (
              <div key={i} className="w-full shrink-0">
                <PlateBlurImage
                  src={url}
                  alt={post.title || 'Vehicle photo'}
                  aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
                  className="rounded-none w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Privacy Badge Watermark overlay (Plate Redacted + 800m Geofence) in bottom-right */}
          <div className="absolute bottom-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPrivacyPopover(!showPrivacyPopover);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[9.5px] font-mono-numbers text-emerald-300 hover:bg-black/90 transition-all shadow-md cursor-pointer"
              title="Click to inspect privacy protection"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VEIL // 800M SANCTUARY</span>
              <Info className="w-2.5 h-2.5 text-zinc-400" />
            </button>

            {/* Privacy details popover */}
            {showPrivacyPopover && (
              <div
                className={`absolute bottom-8 right-0 w-64 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-2xl z-30 text-[11px] space-y-2 animate-in fade-in duration-150 ${
                  isWhiteYellow
                    ? 'bg-white/98 border-emerald-400/50 text-zinc-800'
                    : 'bg-[#141418]/95 border-emerald-500/30 text-zinc-300'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-emerald-500 font-bold font-mono-numbers">
                  <span>VEIL PROTOCOL ACTIVE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20">SHA-256</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  Autonomous CV plate redaction engaged. Start/end GPS endpoints clipped by 800m to conceal residential sanctuary.
                </p>
                <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-mono-numbers ${
                  isWhiteYellow ? 'border-zinc-200 text-zinc-500' : 'border-white/[0.08] text-zinc-500'
                }`}>
                  <span>Owner: Anonymous</span>
                  <span className="text-emerald-500 font-semibold">100% Compliant</span>
                </div>
              </div>
            )}
          </div>

          {/* Carousel Counter badge in top right */}
          {mediaUrls.length > 1 && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono-numbers text-zinc-200 tracking-wider shadow-md pointer-events-none">
              {carouselIndex + 1}/{mediaUrls.length}
            </div>
          )}

          {carouselIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/media:opacity-100 transition-all border border-white/15 hover:bg-black/80 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {carouselIndex < mediaUrls.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/media:opacity-100 transition-all border border-white/15 hover:bg-black/80 hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Floating pill dots */}
          {mediaUrls.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {mediaUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === carouselIndex
                      ? isWhiteYellow
                        ? 'w-4 h-1 bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]'
                        : 'w-4 h-1 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'w-1 h-1 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Double-tap Respect burst with gold/amber bloom */}
          {showRespectBurst && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-in zoom-in-75 fade-in duration-200 border border-amber-400/40">
                <ShieldCheck className="w-11 h-11 text-amber-400 fill-amber-400/30 drop-shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
              </div>
            </div>
          )}

          {/* Hover hint */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover/media:opacity-100 transition-opacity px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9.5px] font-mono-numbers text-zinc-400 pointer-events-none z-10">
            Double-tap to ratify respect
          </div>
        </div>
      )}

      {/* ── INTERACTIVE DRIVE TELEMETRY & ELEVATION SCRUB BAR ── */}
      {post.postType === 'DRIVE' && (
        <div className={`px-4 sm:px-6 py-4 border-b space-y-3 ${
          isWhiteYellow
            ? 'bg-amber-50/40 border-zinc-200'
            : 'bg-white/[0.015] border-white/[0.06]'
        }`}>
          
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 border ${
                isWhiteYellow
                  ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                  : 'bg-amber-500/[0.1] border-amber-500/20 text-amber-400'
              }`}>
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                  <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                    {post.title || 'Mountain Pass Shakedown'}
                  </span>
                  <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                    isWhiteYellow
                      ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    Telemetry Active
                  </span>
                </div>
                <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  84.6 mi · 1,688 ft Peak · S58 Twin-Turbo
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsPlayingTelemetry(!isPlayingTelemetry)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono-numbers transition-all ${
                  isWhiteYellow
                    ? 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800 hover:text-zinc-950 shadow-xs'
                    : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white'
                }`}
                title={isPlayingTelemetry ? 'Pause tour simulation' : 'Auto-play route tour'}
              >
                {isPlayingTelemetry 
                  ? <Pause className={`w-3 h-3 ${isWhiteYellow ? 'text-yellow-600' : 'text-amber-400'}`} /> 
                  : <Play className={`w-3 h-3 ${isWhiteYellow ? 'text-yellow-600 fill-yellow-600' : 'text-amber-400 fill-amber-400'}`} />
                }
                <span className="hidden sm:inline">{isPlayingTelemetry ? 'Pause' : 'Tour'}</span>
              </button>

              <Link
                to={post.linkedDriveId ? `/drive/${post.linkedDriveId}` : '/drive/drive-184'}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 ${
                  isWhiteYellow
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border-yellow-500/40 shadow-xs'
                    : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/30 text-amber-300 hover:text-amber-200'
                }`}
              >
                <span>Map</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Interactive Scrub Bar & Elevation Sparkline */}
          <div className={`space-y-2 p-3 rounded-xl border ${
            isWhiteYellow
              ? 'bg-white border-zinc-200/90 shadow-sm'
              : 'bg-[#08090C] border-white/[0.06] shadow-inner'
          }`}>
            
            {/* Live HUD telemetry readouts during scrub */}
            <div className="flex items-center justify-between text-[11px] font-mono-numbers">
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 font-bold ${isWhiteYellow ? 'text-yellow-700' : 'text-amber-400'}`}>
                  <Activity className="w-3 h-3" />
                  <span>{currentTelemetry.elevationFt} ft</span>
                </span>
                <span className={isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'}>
                  {currentTelemetry.speedMph} MPH
                </span>
                <span className={`px-1.5 py-0.2 rounded font-medium ${
                  isWhiteYellow ? 'bg-zinc-100 text-zinc-800 border border-zinc-200' : 'bg-white/[0.05] text-zinc-300'
                }`}>
                  {currentTelemetry.gForce}
                </span>
              </div>
              <span className={`truncate max-w-[160px] text-right font-medium ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {currentTelemetry.sector}
              </span>
            </div>

            {/* Elevation SVG line profile */}
            <div className="relative h-9 w-full overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id={`grad-${post.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EAB308" stopOpacity={isWhiteYellow ? "0.35" : "0.4"} />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Elevation Mountain Polygon */}
                <polygon
                  points="0,28 10,24 25,20 38,22 50,14 66,4 78,16 88,22 100,26 100,30 0,30"
                  fill={`url(#grad-${post.id})`}
                />
                <polyline
                  points="0,28 10,24 25,20 38,22 50,14 66,4 78,16 88,22 100,26"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="2"
                />
              </svg>

              {/* Scrubber indicator pin */}
              <div
                className={`absolute top-0 bottom-0 w-0.5 pointer-events-none transition-all duration-75 ${
                  isWhiteYellow ? 'bg-zinc-950 shadow-[0_0_8px_rgba(234,179,8,0.7)]' : 'bg-white shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                }`}
                style={{ left: `${scrubProgress * 100}%` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-white -translate-x-[4px] -translate-y-1 shadow-md" />
              </div>

              {/* Invisible range slider overlay for scrubbing */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={scrubProgress}
                onChange={(e) => {
                  setIsPlayingTelemetry(false);
                  setScrubProgress(parseFloat(e.target.value));
                }}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                title="Scrub across mountain route telemetry"
              />
            </div>

            {/* Route start / end markers */}
            <div className={`flex justify-between text-[9px] font-mono-numbers px-0.5 ${
              isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'
            }`}>
              <span>Start (800m Geofenced)</span>
              <span>Summit: 1,688 ft</span>
              <span>Finish (800m Geofenced)</span>
            </div>
          </div>

        </div>
      )}

      {/* ── BUILD ATTACHMENT ── */}
      {post.postType === 'BUILD_UPDATE' && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-sky-100 border-sky-300 text-sky-800'
                : 'bg-blue-500/[0.08] border-blue-500/20 text-blue-400'
            }`}>
              <GitCommit className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  KW V4 3-Way Coilovers · Ferodo DS2500
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                    : 'bg-blue-500/[0.08] text-blue-300 border-blue-500/20'
                }`}>
                  {post.linkedBuildVersion || 'BUILD 04'}
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Rebound: 12 clicks · Compression: 6 clicks · Corner Balanced
              </div>
            </div>
          </div>
          <Link
            to="/car/car-maya-m3?tab=build"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800 hover:text-zinc-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white'
            }`}
          >
            <span>Inspect Spec</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── MILESTONE (STATUTORY MOT / ROADWORTHINESS) ATTACHMENT ── */}
      {post.postType === 'MILESTONE' && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400'
            }`}>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  Official UK DVSA Roadworthiness Test
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                }`}>
                  PASS (0 DEFECTS)
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                42,184 mi · 78% Front Brake Force · Euro 6d Cryptographic Pass
              </div>
            </div>
          </div>
          <Link
            to="/car/car-maya-m3?tab=health"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-emerald-50 border-zinc-200 text-emerald-800 hover:text-emerald-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-emerald-300 hover:text-white'
            }`}
          >
            <span>Verify Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── TECHNICAL GUIDE / CALIBRATION ATTACHMENT ── */}
      {post.postType === 'GUIDE' && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                : 'bg-amber-500/[0.08] border-amber-500/20 text-amber-400'
            }`}>
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  Hub Dyno Calibration & IAT Blueprint
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  PRO GUIDE
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                IAT Delta: -22°C · 15 Consecutive Pulls · Dual-Pass Core
              </div>
            </div>
          </div>
          <Link
            to="/pro"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-yellow-50 border-zinc-200 text-yellow-900 hover:text-zinc-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-amber-300 hover:text-white'
            }`}
          >
            <span>Workshop Spec</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── MAINTENANCE / SUMP FLUSH ATTACHMENT ── */}
      {post.postType === 'MAINTENANCE_UPDATE' && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-purple-500/[0.08] border-purple-500/20 text-purple-400'
            }`}>
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  18,000-Mile Fluid Service & Optical Geometry
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                }`}>
                  LOGGED
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Mobil 1 ESP 0W-40 (7.8L) · -2.2° Front Camber · 8.2° Caster
              </div>
            </div>
          </div>
          <Link
            to="/car/car-maya-m3?tab=health"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-purple-50 border-zinc-200 text-purple-900 hover:text-zinc-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white'
            }`}
          >
            <span>Service Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── CONVOY EVENT ATTACHMENT ── */}
      {post.postType === 'EVENT' && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-orange-100 border-orange-300 text-orange-800'
                : 'bg-orange-500/[0.08] border-orange-500/20 text-orange-400'
            }`}>
              <Route className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  Midnight Brecon Convoy (A4067)
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-orange-100 text-orange-900 border-orange-300'
                    : 'bg-orange-500/10 text-orange-300 border-orange-500/20'
                }`}>
                  16 CARS LOGGED
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Sennybridge → Crickhowell · 800m Protected · Clean Run
              </div>
            </div>
          </div>
          <Link
            to="/communities"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-orange-50 border-zinc-200 text-orange-900 hover:text-zinc-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white'
            }`}
          >
            <span>Club Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── NEW CAR PASSPORT / REGISTRY INDUCTION ATTACHMENT ── */}
      {post.postType === 'CAR_POST' && post.title?.includes('Passport') && (
        <div className={`mx-3 sm:mx-4 mt-3 rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isWhiteYellow
            ? 'bg-zinc-50/90 border-zinc-200/90 shadow-xs'
            : 'bg-zinc-900/50 backdrop-blur-md border-white/[0.07] shadow-inner'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isWhiteYellow
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
                <span className={`truncate ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  Garage Sovereign Passport Registry
                </span>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                }`}>
                  VERIFIED IDENTITY
                </span>
              </div>
              <div className={`text-[11px] font-mono-numbers mt-0.5 truncate ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Plates Protected · Geofence Radius: 800m · Vehicle Ledger
              </div>
            </div>
          </div>
          <Link
            to={post.authorVehicleId ? `/car/${post.authorVehicleId}` : '/car/car-maya-m3'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              isWhiteYellow
                ? 'bg-white hover:bg-emerald-50 border-zinc-200 text-emerald-800 hover:text-emerald-950 shadow-xs'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.16] text-emerald-300 hover:text-white'
            }`}
          >
            <span>View Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── ACTION BAR + BODY ── */}
      <div className="px-4 sm:px-6 pt-3.5 pb-4 space-y-3">

        {/* ── ACTION ROW: CERTIFIED CUSTODIAN RESPECT ACTUATOR & LOGBOOK ── */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">

            {/* The Milled Titanium Respect Actuator */}
            <div className="relative flex items-center">
              <button
                onClick={handleToggleRespect}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono-numbers font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                  respected
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.45)]'
                    : isWhiteYellow
                    ? 'bg-zinc-100 hover:bg-yellow-100 border-zinc-200 text-zinc-900'
                    : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/15 text-zinc-200 hover:text-amber-300'
                }`}
                title="Ratify Custodian Respect for this machine"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${respected ? 'text-black' : 'text-amber-400'}`} />
                <span>{respected ? 'RESPECTED' : 'RESPECT'}</span>
                <span className="opacity-40">|</span>
                <LikeCounter count={likesCount} bumped={likeCountBumped} isWhiteYellow={isWhiteYellow} />
              </button>

              {/* Discreet Criterion Exploder Button */}
              <button
                onClick={() => setShowRespectMenu(!showRespectMenu)}
                className={`ml-1.5 p-1.5 rounded-full border transition text-[10px] cursor-pointer ${
                  isWhiteYellow 
                    ? 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100' 
                    : 'border-white/10 text-zinc-400 hover:text-amber-300 hover:bg-white/[0.06]'
                }`}
                title="Inspect or award specific custodian criteria"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {/* Respect Criteria Popover */}
              {showRespectMenu && (
                <div 
                  className={`absolute bottom-11 left-0 z-30 w-72 p-3 rounded-2xl border shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-2 fade-in duration-150 ${
                    isWhiteYellow
                      ? 'bg-white/98 border-zinc-200 text-zinc-900 shadow-xl'
                      : 'bg-[#121318]/95 border-amber-500/30 text-zinc-200 shadow-2xl'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08] text-[10px] font-mono-numbers font-bold text-amber-400 uppercase tracking-wider">
                    <span>CUSTODIAN RESPECT CRITERIA</span>
                    <button 
                      onClick={() => setShowRespectMenu(false)}
                      className="text-zinc-500 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {RESPECT_CRITERIA.map((criterion) => (
                      <button
                        key={criterion.id}
                        onClick={() => handleAwardCriterion(criterion)}
                        className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between text-[11px] font-mono-numbers border cursor-pointer ${
                          isWhiteYellow
                            ? 'bg-zinc-50 hover:bg-yellow-50 border-zinc-200 text-zinc-800'
                            : 'bg-white/[0.03] hover:bg-amber-400/[0.08] border-white/[0.06] hover:border-amber-400/40 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-2">{criterion.label}</span>
                        <span className="text-amber-400 font-bold shrink-0">+{criterion.points}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chassis Logbook Trigger */}
            <button
              onClick={() => setIsCommentDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono-numbers transition-all cursor-pointer ${
                isWhiteYellow
                  ? 'bg-zinc-100 hover:bg-zinc-200/70 border-zinc-200 text-zinc-700'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-zinc-300 hover:text-white'
              }`}
              title="Inspect Chassis Provenance Logbook"
            >
              <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>{repliesCount} NOTES</span>
            </button>

            {/* Share / Export */}
            <button
              onClick={() => setIsOptionsOpen(true)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWhiteYellow
                  ? 'border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                  : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="Share post & export route"
            >
              <Send className="w-3.5 h-3.5 -rotate-12" />
            </button>
          </div>

          {/* Bookmark / Route Pocket */}
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isWhiteYellow
                ? 'border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            title={saved ? 'Remove from Route Pocket' : 'Save to Route Pocket'}
          >
            <Bookmark
              className={`w-4 h-4 transition-all ${
                saved
                  ? isWhiteYellow
                    ? 'fill-yellow-500 text-yellow-500 scale-110'
                    : 'fill-amber-400 text-amber-400 scale-110'
                  : ''
              }`}
            />
          </button>
        </div>

        {/* Respects count & social proof with driver micro-avatars */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex -space-x-1.5 overflow-hidden shrink-0">
            <img
              src="/real_uk_gt3_suburb.jpg"
              alt="kuro_gt3"
              className={`inline-block w-4 h-4 rounded-full object-cover ${isWhiteYellow ? 'ring-1 ring-white' : 'ring-1 ring-[#0D0D11]'}`}
            />
            <img
              src="/real_uk_e30_terrace.jpg"
              alt="retromod_dan"
              className={`inline-block w-4 h-4 rounded-full object-cover ${isWhiteYellow ? 'ring-1 ring-white' : 'ring-1 ring-[#0D0D11]'}`}
            />
            <img
              src="/real_uk_defender_farm.jpg"
              alt="expedition_110"
              className={`inline-block w-4 h-4 rounded-full object-cover ${isWhiteYellow ? 'ring-1 ring-white' : 'ring-1 ring-[#0D0D11]'}`}
            />
          </div>
          <p className={`text-[12px] font-mono-numbers tracking-tight ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'}`}>
            Ratified by <span className={`font-semibold ${isWhiteYellow ? 'text-zinc-950' : 'text-zinc-200'}`}>kuro_gt3</span> and{' '}
            <LikeCounter count={likesCount} bumped={likeCountBumped} isWhiteYellow={isWhiteYellow} />{' '}
            <span>custodians</span>
          </p>
        </div>

        {/* ── GAMER-MINIMALIST CADENCE HUD BANNER ── */}
        {post.cadenceRank && (
          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono-numbers transition-all ${
            isWhiteYellow
              ? 'bg-amber-50/80 border-amber-300/80 text-zinc-950'
              : 'bg-black/90 border-amber-500/35 text-white shadow-inner'
          }`}>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black text-[11px] shadow">
                [ {post.cadenceRank} ]
              </span>
              <div>
                <span className="font-bold tracking-tight">
                  {post.cadenceRank === 'EX'
                    ? 'TRANSCENDENT'
                    : post.cadenceRank === 'S'
                    ? 'APEX HARMONY'
                    : post.cadenceRank === 'A+'
                    ? 'IN THE GROOVE'
                    : 'FLOW STATE'}
                </span>
                {post.cadenceScore && (
                  <span className="opacity-60 text-[10px] ml-2">Score: {post.cadenceScore}/100</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>+{post.respectsEarned || 14} RESPECTS</span>
            </div>
          </div>
        )}

        {/* ── SCENIC MID-WAY WAYPOINTS CAROUSEL ── */}
        {post.waypoints && post.waypoints.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {post.waypoints.map((wp) => (
              <div
                key={wp.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10.5px] font-mono-numbers shrink-0 ${
                  isWhiteYellow
                    ? 'bg-white border-zinc-200 text-zinc-800'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                }`}
              >
                <Compass className="w-3 h-3 text-amber-400" />
                <span className="font-bold truncate max-w-[130px]">{wp.title}</span>
                <span className="text-zinc-500">{wp.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Caption with clean toggle */}
        <div className={`text-[13.5px] leading-relaxed space-y-1 ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-300'}`}>
          {post.title && (
            <h3 className={`font-bold text-[14.5px] tracking-tight leading-snug ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
              {post.title}
            </h3>
          )}
          <p className="leading-relaxed">
            <Link
              to={`/car/${post.authorVehicleId || 'car-maya-m3'}`}
              className={`font-bold mr-2 transition-colors ${
                isWhiteYellow ? 'text-zinc-950 hover:text-yellow-600' : 'text-white hover:text-amber-300'
              }`}
            >
              {post.authorVehicleName}
            </Link>
            <span className={`font-normal ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-300/90'}`}>
              {isCaptionExpanded || post.content.length <= 130
                ? post.content
                : `${post.content.slice(0, 130)}…`}
            </span>
            {post.content.length > 130 && (
              <button
                onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                className={`text-xs ml-1 font-mono-numbers transition-colors ${
                  isWhiteYellow ? 'text-yellow-700 hover:text-yellow-800 font-semibold' : 'text-zinc-500 hover:text-amber-300'
                }`}
              >
                {isCaptionExpanded ? 'less' : 'more'}
              </button>
            )}
          </p>
        </div>

        {/* Comments preview */}
        <div className="space-y-1.5 pt-0.5">
          <button 
            onClick={() => setIsCommentDrawerOpen(true)}
            className={`text-[12.5px] font-medium transition-colors block ${
              isWhiteYellow ? 'text-zinc-500 hover:text-yellow-700' : 'text-zinc-500 hover:text-amber-300/90'
            }`}
          >
            View all {repliesCount} driver notes & setup feedback →
          </button>

          {/* Top 1 clean comment preview */}
          {comments.length > 0 && (
            <div className={`text-[12.5px] leading-snug flex items-start gap-2 ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-400'}`}>
              <span className={`font-semibold shrink-0 ${isWhiteYellow ? 'text-zinc-900' : 'text-zinc-200'}`}>
                {comments[0].authorHandle}
              </span>
              <span className={`truncate ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300/90'}`}>
                {comments[0].text}
              </span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className={`text-[10px] font-mono-numbers uppercase tracking-wider ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {post.createdAt} · Geofenced 800m
        </p>

        {/* Quick inline comment input with persona avatar */}
        <form
          onSubmit={handleInlineComment}
          className={`pt-2.5 border-t flex items-center gap-2.5 ${isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.05]'}`}
        >
          <div className={`w-6 h-6 rounded-full overflow-hidden shrink-0 border shadow-xs ${isWhiteYellow ? 'border-zinc-300' : 'border-white/[0.08]'}`}>
            <img
              src="/real_uk_m3_cottage.jpg"
              alt="MAYA"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            id={`ci-${post.id}`}
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Share driver perspective as MAYA…"
            className={`w-full bg-transparent text-[12.5px] focus:outline-none font-sans ${
              isWhiteYellow
                ? 'text-zinc-900 placeholder-zinc-400'
                : 'text-zinc-200 placeholder-zinc-500'
            }`}
          />
          {commentInput.trim() && (
            <button
              type="submit"
              className={`text-[11.5px] font-bold transition-all shrink-0 font-mono-numbers px-3 py-1 rounded-full ${
                isWhiteYellow
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border border-yellow-500/40 shadow-xs'
                  : 'bg-amber-400/10 text-amber-400 hover:text-amber-300 border border-amber-400/25'
              }`}
            >
              Post
            </button>
          )}
        </form>
      </div>

      {/* ── INTERACTIVE COMMENTS DRAWER MODAL ── */}
      {isCommentDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsCommentDrawerOpen(false)}
        >
          <div 
            className={`rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl backdrop-blur-2xl overflow-hidden border ${
              isWhiteYellow
                ? 'bg-white border-zinc-200 text-zinc-900'
                : 'bg-zinc-950/95 border-white/[0.1] text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${
              isWhiteYellow
                ? 'bg-zinc-50 border-zinc-200'
                : 'bg-zinc-900/50 border-white/[0.08]'
            }`}>
              <div>
                <h3 className={`text-sm font-bold tracking-tight ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                  Driver Notes & Discussion
                </h3>
                <p className={`text-[11px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {repliesCount} verified participant responses
                </p>
              </div>
              <button 
                onClick={() => setIsCommentDrawerOpen(false)}
                className={`p-1.5 rounded-full transition ${
                  isWhiteYellow
                    ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments Scrollable Feed */}
            <div className={`flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar divide-y ${
              isWhiteYellow ? 'divide-zinc-100' : 'divide-white/[0.04]'
            }`}>
              {comments.map((c) => (
                <div key={c.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <img 
                      src={c.avatarUrl} 
                      alt={c.authorName} 
                      className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
                        isWhiteYellow ? 'border-zinc-200' : 'border-white/[0.1]'
                      }`} 
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold leading-none ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                          {c.authorHandle}
                        </span>
                        {c.isVerifiedPro && (
                          <span className={`text-[9px] font-mono-numbers px-2 py-0.2 rounded-full font-bold border ${
                            isWhiteYellow
                              ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            PRO
                          </span>
                        )}
                        <span className={`text-[10px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {c.authorCar}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono-numbers">· {c.timeAgo}</span>
                      </div>
                      <p className={`text-xs leading-relaxed font-sans ${isWhiteYellow ? 'text-zinc-800' : 'text-zinc-300'}`}>
                        {c.text}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleCommentLike(c.id)}
                    className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-rose-500 transition shrink-0 pt-1"
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="text-[9px] font-mono-numbers">{c.likes}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Drawer Input Bar */}
            <form onSubmit={handleDrawerComment} className={`p-4 border-t flex items-center gap-2.5 ${
              isWhiteYellow
                ? 'bg-zinc-50 border-zinc-200'
                : 'bg-zinc-900/50 border-white/[0.08]'
            }`}>
              <input 
                type="text"
                value={drawerInput}
                onChange={(e) => setDrawerInput(e.target.value)}
                placeholder="Share setup note or question as MAYA…"
                className={`flex-1 rounded-full px-4 py-2.5 text-xs focus:outline-none transition font-sans border ${
                  isWhiteYellow
                    ? 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-yellow-500'
                    : 'bg-white/[0.05] border-white/[0.08] text-white placeholder-zinc-500 focus:border-amber-400/40'
                }`}
              />
              <button 
                type="submit"
                disabled={!drawerInput.trim()}
                className={`px-4 py-2 rounded-full font-bold text-xs font-mono-numbers uppercase tracking-wider transition disabled:opacity-40 ${
                  isWhiteYellow
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border border-yellow-500/40 shadow-xs'
                    : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                }`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── OPTIONS SHEET ── */}
      {isOptionsOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#09090B]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsOptionsOpen(false)}
        >
          <div
            className={`rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl text-center text-sm font-semibold border divide-y ${
              isWhiteYellow
                ? 'bg-white border-zinc-200 text-zinc-900 divide-zinc-100'
                : 'bg-[#1C1C1F] border-white/[0.10] text-[#F4F4F5] divide-white/[0.07]'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleCopyLink}
              className={`w-full py-3.5 px-4 transition flex items-center justify-center gap-2 ${
                isWhiteYellow ? 'hover:bg-zinc-50 text-zinc-900' : 'hover:bg-white/[0.05] text-[#F4F4F5]'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => {
                setIsOptionsOpen(false);
                showToast({
                  title: 'GPX Route Exported',
                  message: 'Ready for GPS navigation & track telemetry apps',
                  type: 'drive',
                  badge: 'GPX'
                });
              }}
              className={`w-full py-3.5 px-4 transition flex items-center justify-center gap-2 ${
                isWhiteYellow ? 'hover:bg-zinc-50 text-zinc-900' : 'hover:bg-white/[0.05] text-[#F4F4F5]'
              }`}
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
              <span>Share to Drivers (Export GPX)</span>
            </button>

            <button
              onClick={() => {
                setIsOptionsOpen(false);
                showToast({
                  title: 'Privacy Shield Verified',
                  message: 'Plates auto-blurred · 800m privacy protected',
                  type: 'privacy',
                  badge: 'SECURE'
                });
              }}
              className={`w-full py-3.5 px-4 text-emerald-600 transition flex items-center justify-center gap-2 ${
                isWhiteYellow ? 'hover:bg-emerald-50/50' : 'hover:bg-white/[0.05]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Privacy Shield</span>
            </button>

            <button
              onClick={() => setIsOptionsOpen(false)}
              className={`w-full py-3 px-4 transition font-normal ${
                isWhiteYellow ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
