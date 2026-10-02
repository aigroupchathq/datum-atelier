import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Comment {
  id: string;
  handle: string;
  text: string;
  likesCount: number;
  timeAgo: string;
  liked?: boolean;
}

interface CommentsDrawerProps {
  isOpen: boolean;
  postId: string;
  postType?: string;
  authorHandle?: string;
  commentsCount?: number;
  onClose: () => void;
}

// Seed comments per post type — gives every open authentic engineering discussion
const SEED_COMMENTS_BY_TYPE: Record<string, Comment[]> = {
  DRIVE: [
    { id: 's1', handle: 'kuro_gt3', text: 'Proper pace through that technical section. The tarmac looked greasy at the summit — did you adjust camber before departure?', likesCount: 24, timeAgo: '2h' },
    { id: 's2', handle: 'yuki_gr_yaris', text: 'Did you run traction control completely off or in sport dynamic mode? Asking because the E57 corner looks slippery on the radar.', likesCount: 18, timeAgo: '1h 45m' },
    { id: 's3', handle: 'hamish_heritage', text: 'Snake Pass A57 summit road temperature is deceptive. Micro-frost pockets on the north-facing shaded sections even in October.', likesCount: 31, timeAgo: '1h' },
  ],
  BUILD_UPDATE: [
    { id: 's1', handle: 'apex_720s', text: 'Superb component selection. The Bilstein B16 PSS10 coilover is a benchmark for fast-road B-road tuning on that chassis.', likesCount: 42, timeAgo: '3h' },
    { id: 's2', handle: 'julian_vane', text: 'Was the corner-weighting performed with driver and full fuel load? Cross-weight at 50% is achievable but needs a wet-plate surface.', likesCount: 29, timeAgo: '2h 20m' },
    { id: 's3', handle: 'e30_heritage', text: 'Period-correct choice. The Ferodo DS2500 compound was standard on the M3 GT spec. Cold bite is extraordinary.', likesCount: 17, timeAgo: '40m' },
  ],
  MAINTENANCE_UPDATE: [
    { id: 's1', handle: 'litchfield_eng', text: 'Proper provenance chain. Mobil 1 ESP X3 0W-40 with spectroscopic analysis confirms the bearing wear is within tolerance bands.', likesCount: 55, timeAgo: '4h' },
    { id: 's2', handle: 'hamish_heritage', text: "Always request the oil analysis report in PDF — Blackstone Labs UK sends an excellent 3-column breakdown vs. the engine's wear baseline.", likesCount: 33, timeAgo: '2h' },
    { id: 's3', handle: 'kuro_gt3', text: 'Smart to log the mileage at each service. DVSA provenance argument at auction becomes watertight with stamped photographic evidence.', likesCount: 22, timeAgo: '1h' },
  ],
  CAR_STORY: [
    { id: 's1', handle: 'cairngorm_crew', text: 'That morning light on limestone is exquisite. Cotswolds honey-stone with a German sports saloon is an underrated visual pairing.', likesCount: 67, timeAgo: '5h' },
    { id: 's2', handle: 'midlands_sanctuary', text: 'Clean private driveway. The lack of road salt residue on those arches suggests proper underseal treatment. Dinitrol?', likesCount: 38, timeAgo: '3h 10m' },
    { id: 's3', handle: 'yuki_gr_yaris', text: 'The B-road patina is exactly what this platform celebrates. No posturing, no supercar showroom — just honest mechanical character.', likesCount: 91, timeAgo: '2h' },
  ],
  EVENT: [
    { id: 's1', handle: 'julian_vane', text: 'Paddock organisation was impeccable. PMR446 ch.7 had zero interference from the public gallery — well chosen frequency.', likesCount: 28, timeAgo: '6h' },
    { id: 's2', handle: 'cairngorm_crew', text: 'The Defender support vehicle positioned at the 3rd summit waypoint was an excellent decision. Solo stragglers had recovery cover.', likesCount: 19, timeAgo: '4h' },
    { id: 's3', handle: 'midlands_sanctuary', text: 'Departure at 05:45 AM means empty roads through the Windrush Valley. This is the correct philosophy for convoy running.', likesCount: 44, timeAgo: '2h' },
  ],
  QUESTION: [
    { id: 's1', handle: 'hamish_heritage', text: 'For wet Cotswolds B-roads: Michelin Pilot Sport 4S outperforms the Cup 2 significantly below 8°C ambient. The compound stays pliable.', likesCount: 36, timeAgo: '3h' },
    { id: 's2', handle: 'kuro_gt3', text: 'Agreed on the tyre choice. Also ensure your brake bias is adjusted if switching from summer to winter compound — very different thermal thresholds.', likesCount: 27, timeAgo: '2h 30m' },
    { id: 's3', handle: 'apex_720s', text: 'Have you consulted the DATUM Road Grip Radar for Snake Pass before heading out? Live surface temp and µ coefficient are shown.', likesCount: 15, timeAgo: '1h' },
  ],
};

const DEFAULT_SEEDS: Comment[] = [
  { id: 's1', handle: 'kuro_gt3', text: 'Genuine provenance. The DATUM ledger makes this a credible resale asset.', likesCount: 18, timeAgo: '2h' },
  { id: 's2', handle: 'hamish_heritage', text: 'Excellent craft. Workshop standards like this are exactly what the platform should celebrate.', likesCount: 12, timeAgo: '1h' },
  { id: 's3', handle: 'yuki_gr_yaris', text: "Following this chassis's progress now. The telemetry logs add extraordinary depth.", likesCount: 9, timeAgo: '30m' },
];

export const CommentsDrawer: FC<CommentsDrawerProps> = ({
  isOpen,
  postId: _postId,
  postType = 'CAR_STORY',
  authorHandle = 'MAYA',
  commentsCount = 0,
  onClose,
}) => {
  const { isWhiteYellow } = useTheme();
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [likedSeeds, setLikedSeeds] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const seedComments = SEED_COMMENTS_BY_TYPE[postType] || DEFAULT_SEEDS;
  const allComments = [...seedComments, ...userComments];
  const totalCount = commentsCount + userComments.length;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setCommentText('');
    }
  }, [isOpen]);

  // Scroll to bottom after new comment
  useEffect(() => {
    if (userComments.length > 0 && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `u-${Date.now()}`,
      handle: 'maya_m3',
      text,
      likesCount: 0,
      timeAgo: 'just now',
    };
    setUserComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const toggleSeedLike = (id: string) => {
    setLikedSeeds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Drawer — slides up from bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[75vh] ${
          isWhiteYellow
            ? 'bg-white border-t border-zinc-200'
            : 'bg-[#111113] border-t border-white/[0.1]'
        }`}
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className={`w-10 h-1 rounded-full ${isWhiteYellow ? 'bg-zinc-300' : 'bg-zinc-700'}`} />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b shrink-0 ${
          isWhiteYellow ? 'border-zinc-100' : 'border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-2">
            <MessageCircle className={`w-4 h-4 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`} />
            <span className={`text-sm font-bold font-mono-numbers ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
              Driver Comments
            </span>
            <span className={`text-xs font-mono-numbers px-2 py-0.5 rounded-full border ${
              isWhiteYellow
                ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                : 'bg-white/[0.06] text-zinc-400 border-white/[0.08]'
            }`}>
              {totalCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comment list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {allComments.map((cmt) => {
            const isUserComment = cmt.id.startsWith('u-');
            const isLiked = likedSeeds[cmt.id];
            return (
              <div key={cmt.id} className="flex items-start gap-3 animate-in fade-in duration-150">
                {/* Avatar placeholder */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold uppercase ${
                  isUserComment
                    ? isWhiteYellow ? 'bg-yellow-400 text-zinc-950' : 'bg-amber-400 text-black'
                    : isWhiteYellow ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {cmt.handle.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isWhiteYellow ? 'text-zinc-950' : 'text-white'}`}>
                      {cmt.handle}
                    </span>
                    <span className={`text-[10px] font-mono-numbers ${isWhiteYellow ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {cmt.timeAgo}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 leading-relaxed font-sans ${isWhiteYellow ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {cmt.text}
                  </p>
                </div>
                {/* Like button on seed comments */}
                {!isUserComment && (
                  <button
                    onClick={() => toggleSeedLike(cmt.id)}
                    className={`flex items-center gap-1 text-[10px] font-mono-numbers shrink-0 transition mt-0.5 ${
                      isLiked
                        ? 'text-rose-500'
                        : isWhiteYellow ? 'text-zinc-400 hover:text-zinc-700' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{cmt.likesCount + (isLiked ? 1 : 0)}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Comment input */}
        <div className={`px-5 pb-6 pt-3 border-t shrink-0 ${
          isWhiteYellow ? 'border-zinc-100 bg-zinc-50/80' : 'border-white/[0.06] bg-[#0D0D0F]/80'
        }`}>
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
              isWhiteYellow ? 'bg-yellow-400 text-zinc-950' : 'bg-amber-400 text-black'
            }`}>
              MA
            </div>
            <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition ${
              isWhiteYellow
                ? 'bg-white border-zinc-200 focus-within:border-yellow-400'
                : 'bg-white/[0.04] border-white/[0.08] focus-within:border-amber-400/40'
            }`}>
              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Add a technical note to ${authorHandle}…`}
                maxLength={280}
                className={`flex-1 bg-transparent text-xs font-sans focus:outline-none ${
                  isWhiteYellow ? 'text-zinc-900 placeholder-zinc-400' : 'text-white placeholder-zinc-600'
                }`}
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className={`p-1 rounded-full transition ${
                    isWhiteYellow
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
          {commentText.length > 200 && (
            <p className={`text-[10px] font-mono-numbers text-right mt-1 ${
              commentText.length >= 280 ? 'text-rose-400' : isWhiteYellow ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {commentText.length}/280
            </p>
          )}
        </div>
      </div>
    </>
  );
};
