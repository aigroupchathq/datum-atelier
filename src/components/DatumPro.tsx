import type { FC } from 'react';
import { Star, CheckCircle2, Shield, Wrench, Sparkles, Disc } from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  icon: any;
  description: string;
  verifiedJobs: number;
  rating: number;
  reviewsCount: number;
  relevantReason: string;
}

const specialists: Specialist[] = [
  {
    id: 's1',
    name: 'Apex Tyres & Laser Alignment',
    specialty: 'Tyres & Chassis Setup',
    icon: Disc,
    description: 'Beissbarth 3D laser alignment specialists. Experienced with BMW G80 track and fast-road camber configurations.',
    verifiedJobs: 240,
    rating: 4.9,
    reviewsCount: 88,
    relevantReason: 'Surfaced because Maya\'s rear tyres are at 3.4mm with -1.8° camber wear.',
  },
  {
    id: 's2',
    name: 'Evolve Automotive',
    specialty: 'M-Power Specialist & Tuning',
    icon: Wrench,
    description: 'Specialist BMW M-division engineering, dyno performance diagnostics, KW suspension and Akrapovič certified installer.',
    verifiedJobs: 512,
    rating: 5.0,
    reviewsCount: 312,
    relevantReason: 'Installed and stamped Maya\'s KW V4 coilovers and brake setup.',
  },
  {
    id: 's3',
    name: 'Precision Detailing & Studio',
    specialty: 'PPF & Ceramic Protection',
    icon: Sparkles,
    description: 'Gyeon certified studio, self-healing paint protection film application, stage-2 paint correction.',
    verifiedJobs: 180,
    rating: 4.9,
    reviewsCount: 72,
    relevantReason: 'Certified detailing for high-value track and road builds.',
  },
];

export const DatumPro: FC = () => {
  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono-nums font-bold">
            DATUM PRO GUILD
          </span>
          <span className="text-xs text-zinc-400">Contextual Discovery Layer</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">Verified Automotive Professionals</h2>
        <p className="text-xs text-zinc-400">
          Businesses discovered through your vehicle's real physical needs—not through paid keyword bidding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specialists.map((pro) => {
          const Icon = pro.icon;
          return (
            <div key={pro.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-zinc-800 text-orange-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{pro.name}</h3>
                      <span className="text-[10px] text-zinc-400 font-mono-nums">{pro.specialty}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono-nums font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> PRO
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-amber-300/90 font-mono-nums">
                  ⚡ <strong>Context:</strong> {pro.relevantReason}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {pro.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="text-xs text-zinc-300 font-mono-nums flex justify-between">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{pro.verifiedJobs} Jobs Stamped</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>{pro.rating.toFixed(1)} ({pro.reviewsCount})</span>
                  </span>
                </div>

                <button
                  onClick={() => alert(`Contextual quote request transmitted directly to ${pro.name} with Maya's tyre specs.`)}
                  className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition font-mono-nums"
                >
                  Request Frictionless Quote →
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
