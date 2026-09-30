import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export interface StoryItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorModel: string;
  avatarUrl: string;
  storyMediaUrl: string;
  timeAgo: string;
  caption: string;
  location?: string;
  telemetry?: string;
}

interface StoryViewerModalProps {
  isOpen: boolean;
  activeStoryIndex: number;
  stories: StoryItem[];
  onClose: () => void;
  onSelectStory: (index: number) => void;
}

// Story duration in seconds
const STORY_DURATION = 5;

export const StoryViewerModal: FC<StoryViewerModalProps> = ({
  isOpen,
  activeStoryIndex,
  stories,
  onClose,
  onSelectStory,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reactionSent, setReactionSent] = useState<string | null>(null);

  const currentStory = stories[activeStoryIndex] || stories[0];

  // Remaining seconds display (e.g. ":04")
  const secondsRemaining = Math.max(
    0,
    Math.ceil(STORY_DURATION - (progress / 100) * STORY_DURATION)
  );

  // Auto-advancing story timer
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const ticksTotal = STORY_DURATION * 10; // 100ms intervals
    const increment = 100 / ticksTotal;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            onSelectStory(activeStoryIndex + 1);
            return 0;
          } else {
            onClose();
            return 0;
          }
        }
        return Math.min(100, prev + increment);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, activeStoryIndex, stories.length, onSelectStory, onClose]);

  // Reset progress & liked state when story changes
  useEffect(() => {
    setProgress(0);
    setLiked(false);
    setReactionSent(null);
  }, [activeStoryIndex]);

  // ⌨️ Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          if (activeStoryIndex < stories.length - 1) {
            onSelectStory(activeStoryIndex + 1);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          if (activeStoryIndex > 0) {
            onSelectStory(activeStoryIndex - 1);
          }
          break;
        case ' ':
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    },
    [isOpen, activeStoryIndex, stories.length, onSelectStory, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !currentStory) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStoryIndex > 0) {
      onSelectStory(activeStoryIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStoryIndex < stories.length - 1) {
      onSelectStory(activeStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const handleSendReaction = (emoji: string) => {
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1500);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReactionSent(`Sent: "${replyText.trim()}"`);
    setReplyText('');
    setTimeout(() => setReactionSent(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      
      {/* Close button in top-right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10"
        title="Close (Esc)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-zinc-400 font-mono-numbers border border-white/10">
        <span>← → navigate</span>
        <span>·</span>
        <span>Space pause</span>
        <span>·</span>
        <span>Esc close</span>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
          title="Previous Story (←)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
          title="Next Story (→)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Central Story Canvas (9:16 Instagram Story Ratio) */}
      <div 
        className="relative w-full max-w-[420px] h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-zinc-950 flex flex-col justify-between shadow-2xl border border-white/10"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px 2px rgba(245, 158, 11, 0.12)'
        }}
      >
        
        {/* Story Background Media */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.storyMediaUrl}
            alt={currentStory.caption}
            className="w-full h-full object-cover"
          />
          {/* Top and Bottom Dark Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
          
          {/* Privacy Plate Redaction Stamp */}
          <div className="absolute top-[52%] left-[40%] px-3 py-1 rounded plate-blur border border-white/20 text-[9px] font-mono-numbers text-zinc-300 font-bold uppercase tracking-widest pointer-events-none">
            [PLATE PROTECTED]
          </div>
        </div>

        {/* Reaction Pop Animation */}
        {reactionSent && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
            <span className="text-5xl drop-shadow-lg animate-bounce">
              {reactionSent}
            </span>
          </div>
        )}

        {/* TOP OVERLAYS: Progress Bars & Author Profile */}
        <div className="relative z-10 p-4 space-y-3">
          
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((st, i) => (
              <div
                key={st.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: i < activeStoryIndex 
                      ? '100%' 
                      : i === activeStoryIndex 
                      ? `${progress}%` 
                      : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-sm">
                <img
                  src={currentStory.avatarUrl}
                  alt={currentStory.authorName}
                  className="w-full h-full rounded-full object-cover border border-black"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {currentStory.authorHandle}
                  </span>
                  <span className="text-xs text-zinc-300 font-mono-numbers">
                    {currentStory.timeAgo}
                  </span>
                </div>
                {currentStory.location && (
                  <p className="text-[11px] text-zinc-300 font-medium">
                    📍 {currentStory.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-white">
              {/* Countdown badge */}
              {!isPaused && (
                <span className="text-[10px] font-mono-numbers text-zinc-300 bg-black/50 rounded-full px-2 py-0.5 mr-1">
                  :{secondsRemaining.toString().padStart(2, '0')}
                </span>
              )}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full hover:bg-white/20 transition"
                title={isPaused ? 'Play (Space)' : 'Pause (Space)'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full hover:bg-white/20 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Telemetry Pill if available */}
          {currentStory.telemetry && (
            <div className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-yellow-400/40 text-[10px] font-mono-numbers text-yellow-300">
              ⚡ {currentStory.telemetry}
            </div>
          )}
        </div>

        {/* Tap areas for Prev / Next story (mobile) */}
        <div className="absolute inset-y-24 inset-x-0 z-20 flex">
          <div 
            onClick={handlePrev} 
            className="w-1/3 h-full cursor-pointer"
            title="Previous story (tap left)"
          />
          <div 
            onClick={handleNext} 
            className="w-2/3 h-full cursor-pointer"
            title="Next story (tap right)"
          />
        </div>

        {/* BOTTOM OVERLAYS: Caption, Quick Reactions, and Reply Bar */}
        <div className="relative z-30 p-4 space-y-3">
          
          {/* Caption */}
          <div className="text-white text-xs sm:text-sm font-sans drop-shadow leading-relaxed">
            <span className="font-bold mr-1.5 text-yellow-400">{currentStory.authorName}:</span>
            {currentStory.caption}
          </div>

          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-between text-lg px-2 py-1 bg-black/40 rounded-full backdrop-blur-md border border-white/10">
            {['🔥', '🏎️', '💨', '⚡', '👏', '❤️'].map((em) => (
              <button
                key={em}
                onClick={() => handleSendReaction(em)}
                className="hover:scale-125 transition-transform p-1"
              >
                {em}
              </button>
            ))}
          </div>

          {/* Reply Form (Instagram Style) */}
          <form onSubmit={handleReplySubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              placeholder={`Send message to ${currentStory.authorHandle}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder-zinc-300 focus:outline-none focus:border-yellow-400 font-sans"
            />
            {replyText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-yellow-400 text-zinc-950 font-bold hover:bg-yellow-300 transition shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLiked(!liked);
                  if (!liked) handleSendReaction('❤️');
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
          </form>

        </div>

      </div>

    </div>
  );
};
