import type { FC } from 'react';
import type { ProvenanceType } from '../../types';
import { ShieldCheck, Award, User, HelpCircle, Activity, Sparkles, AlertCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  signatory?: string;
  className?: string;
}

export const ProvenanceBadge: FC<ProvenanceBadgeProps> = ({ type, signatory, className = '' }) => {
  switch (type) {
    case 'official_information':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/20 ${className}`}>
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Official {signatory ? `• ${signatory}` : 'Source'}</span>
        </span>
      );
    case 'verified_professional':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300/90 border border-blue-500/20 ${className}`}>
          <Award className="w-3 h-3 text-blue-400" />
          <span>Verified Pro {signatory ? `• ${signatory}` : ''}</span>
        </span>
      );
    case 'owner_experience':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-300/90 border border-white/[0.08] ${className}`}>
          <User className="w-3 h-3 text-zinc-400" />
          <span>Owner Experience</span>
        </span>
      );
    case 'vehicle_data':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/20 ${className}`}>
          <Activity className="w-3 h-3 text-amber-400" />
          <span>Vehicle Telemetry</span>
        </span>
      );
    case 'estimated_information':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/20 ${className}`}>
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>Estimated Data</span>
        </span>
      );
    case 'sponsored_content':
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300/90 border border-purple-500/20 ${className}`}>
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Sponsored</span>
        </span>
      );
    case 'community_opinion':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/[0.06] ${className}`}>
          <HelpCircle className="w-3 h-3 text-zinc-500" />
          <span>Community Discussion</span>
        </span>
      );
  }
};
