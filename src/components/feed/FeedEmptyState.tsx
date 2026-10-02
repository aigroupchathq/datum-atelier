import type { FC } from 'react';
import { Compass, Wrench, Camera, HelpCircle, Route, Inbox } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FeedEmptyStateProps {
  filterId: string;
  onOpenCreatePost: (mode?: 'post' | 'story') => void;
}

const EMPTY_STATES: Record<string, {
  icon: typeof Inbox;
  title: string;
  subtitle: string;
  cta: string;
  mode?: 'post' | 'story';
}> = {
  all: {
    icon: Inbox,
    title: 'The Atelier Ledger Awaits',
    subtitle: 'No sovereign journals yet. Be the first custodian to chronicle a journey.',
    cta: 'Chronicle a Journey',
  },
  drives: {
    icon: Compass,
    title: 'No Expeditions Logged',
    subtitle: 'No verified pass routes or mountain expeditions in the feed. Record the first dawn departure.',
    cta: 'Log an Expedition',
  },
  builds: {
    icon: Wrench,
    title: 'No Chassis Builds Posted',
    subtitle: 'Workshop hardware upgrades, dyno results, and restoration milestones belong here.',
    cta: 'Post a Build Update',
  },
  tech: {
    icon: Wrench,
    title: 'No Workshop Dispatches',
    subtitle: 'Technical guides, maintenance milestones, and engineering notes await your expertise.',
    cta: 'Share Technical Knowledge',
  },
  arrivals: {
    icon: Camera,
    title: 'No Sovereign Arrivals Yet',
    subtitle: 'New vehicle acquisitions and heritage custody transfers are celebrated here.',
    cta: 'Present an Arrival',
  },
  events: {
    icon: Route,
    title: 'No Paddock Convoys Dispatched',
    subtitle: 'Guild convoy dispatches, paddock gatherings, and marque club events appear here.',
    cta: 'Announce a Convoy',
  },
  questions: {
    icon: HelpCircle,
    title: 'No Owner Inquiries Open',
    subtitle: 'Technical questions, route recommendations, and marque expertise requests appear here.',
    cta: 'Post an Inquiry',
  },
};

export const FeedEmptyState: FC<FeedEmptyStateProps> = ({ filterId, onOpenCreatePost }) => {
  const { isWhiteYellow, themeMeta } = useTheme();
  const state = EMPTY_STATES[filterId] || EMPTY_STATES.all;
  const Icon = state.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-20 px-8 rounded-[28px] border text-center transition-colors ${
      isWhiteYellow
        ? 'bg-white border-zinc-200/80 shadow-xs'
        : 'bg-[#141418]/60 border-white/[0.06]'
    }`}>
      {/* Icon orb */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
        style={{ backgroundColor: `${themeMeta.accentHex}18`, border: `1.5px solid ${themeMeta.accentHex}30` }}
      >
        <Icon className="w-7 h-7" style={{ color: themeMeta.accentHex }} />
      </div>

      {/* Text */}
      <h3 className={`font-luxury-display text-lg font-bold uppercase tracking-wider mb-2 ${
        isWhiteYellow ? 'text-zinc-950' : 'text-white'
      }`}>
        {state.title}
      </h3>
      <p className={`text-sm font-sans max-w-xs leading-relaxed mb-8 ${
        isWhiteYellow ? 'text-zinc-500' : 'text-zinc-500'
      }`}>
        {state.subtitle}
      </p>

      {/* CTA */}
      <button
        onClick={() => onOpenCreatePost(state.mode || 'post')}
        className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-md ${
          isWhiteYellow
            ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300 border border-yellow-500'
            : 'bg-white/[0.07] text-zinc-200 hover:bg-white/[0.12] border border-white/[0.12]'
        }`}
        style={isWhiteYellow ? {} : { borderColor: `${themeMeta.accentHex}40` }}
      >
        {state.cta}
      </button>

      {/* Topology label */}
      <p className={`text-[10px] font-mono-numbers mt-6 uppercase tracking-widest ${
        isWhiteYellow ? 'text-zinc-400' : 'text-zinc-700'
      }`}>
        DATUM Atelier · {themeMeta.layoutTitle}
      </p>
    </div>
  );
};
