import type { FC } from 'react';
import { X, Award, ShieldCheck, CheckCircle2, FileCheck2, Gauge, Compass, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ProvenanceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
  fullName: string;
  chassisCode: string;
  vin: string;
  provenanceScore: number;
}

export const ProvenanceBreakdownModal: FC<ProvenanceBreakdownModalProps> = ({
  isOpen,
  onClose,
  carName,
  fullName,
  chassisCode,
  vin,
  provenanceScore,
}) => {
  const { isWhiteYellow, themeMeta } = useTheme();

  if (!isOpen) return null;

  const PILLARS = [
    {
      title: 'Certified Specialist Workshop Stamps',
      score: '25 / 25 PTS',
      status: 'VERIFIED',
      icon: FileCheck2,
      description: 'Continuous maintenance executed strictly under marque protocol by verified master workshops. Full VAT invoice hashes notarized to ledger.',
      evidence: 'Litchfield Motors & BMW Park Lane recorded'
    },
    {
      title: 'DVSA Statutory MOT & Title Clearance',
      score: '20 / 20 PTS',
      status: 'CLEARED',
      icon: ShieldCheck,
      description: 'Statutory annual roadworthiness pass with zero advisories. Continuous mileage progression with zero odometer rollback indicators.',
      evidence: 'Statutory Pass (March 2027 Expiry) · V5C Title Unencumbered'
    },
    {
      title: 'Bench Dyno & Calibrated Telemetry',
      score: '20 / 20 PTS',
      status: 'NOTARIZED',
      icon: Gauge,
      description: 'Maha LPS 3000 hub-dyno power verification cell run under barometric calibration (1018 hPa). Wideband lambda AFR and boost logs archived.',
      evidence: '510.4 BHP & 652 Nm verified'
    },
    {
      title: 'Chassis Stamping & Physical Integrity',
      score: '18 / 20 PTS',
      status: 'GRADE A+',
      icon: Award,
      description: 'Authentic chassis stamping matches factory production register. Factory cavity wax and anti-corrosion barrier verified in structural chambers.',
      evidence: `Chassis ${chassisCode} · Factory Paint-to-Sample`
    },
    {
      title: 'Sovereign Expedition Telemetry Logs',
      score: '15 / 15 PTS',
      status: 'LOGGED',
      icon: Compass,
      description: 'Verified mountain pass traversals with road temperature and friction coefficients recorded. All departure and arrival coordinates geofenced by 800m.',
      evidence: '184 B-road passes recorded · Zero speed broadcasts'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl flex flex-col max-h-[90vh] ${
          isWhiteYellow ? 'bg-white border-zinc-200 text-zinc-950' : 'bg-[#121318] border-white/[0.12] text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isWhiteYellow ? 'border-zinc-200 bg-zinc-50' : 'border-white/[0.08] bg-[#0E0F14]'
        }`}>
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
              style={{
                backgroundColor: isWhiteYellow ? '#FEF08A' : `${themeMeta.accentHex}20`,
                border: `1.5px solid ${themeMeta.accentHex}40`
              }}
            >
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-luxury-display text-base sm:text-lg font-bold uppercase tracking-wider">
                  Provenance Audit Breakdown
                </h3>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25">
                  AUDITED
                </span>
              </div>
              <p className={`text-xs font-mono-numbers mt-0.5 ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {carName} · {fullName} · VIN: {vin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isWhiteYellow
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Score Banner */}
        <div className={`px-6 py-4 border-b flex items-center justify-between text-xs font-mono-numbers ${
          isWhiteYellow ? 'bg-amber-50/70 border-amber-200 text-zinc-900' : 'bg-amber-500/[0.06] border-amber-500/20 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold">Sovereign Heritage Rating:</span>
            <span className="font-bold text-emerald-500">GRADE A+ (INVESTMENT GRADE)</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono-numbers text-amber-500">
              {provenanceScore}
            </span>
            <span className="text-zinc-500 text-xs"> / 100 PTS</span>
          </div>
        </div>

        {/* Scrollable Pillars */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 no-scrollbar">
          <p className={`text-xs font-sans leading-relaxed ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
            DATUM Atelier calculates provenance through 5 cryptographically signed verification vectors. Each point represents verified physical, regulatory, or telemetry proof.
          </p>

          <div className="space-y-3">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWhiteYellow
                      ? 'bg-zinc-50/80 border-zinc-200/90'
                      : 'bg-white/[0.02] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold font-sans">
                        {p.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono-numbers font-bold text-emerald-500">
                      {p.score}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {p.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-zinc-200/50 flex items-center justify-between text-[10px] font-mono-numbers text-zinc-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{p.evidence}</span>
                    </span>
                    <span className="uppercase text-emerald-400 font-bold">{p.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Seal */}
        <div className={`p-4 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-numbers ${
          isWhiteYellow ? 'border-zinc-200 bg-zinc-50 text-zinc-600' : 'border-white/[0.08] bg-[#0E0F14] text-zinc-500'
        }`}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Notarized under Council Standard #ATELIER-2026-V5C</span>
          </div>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition font-mono-numbers ${
              isWhiteYellow
                ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
