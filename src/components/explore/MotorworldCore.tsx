import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  MOTORWORLD_DATABASE, 
  searchMotorworldDatabase, 
  type MotorworldProfile 
} from '../../data/motorworldIntelligence';
import { 
  Search, 
  Wrench, 
  ShieldAlert, 
  Droplet, 
  Timer, 
  Coins, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X,
  Info
} from 'lucide-react';

interface MotorworldCoreProps {
  isWhiteYellow?: boolean;
  onSelectVehicleChassis?: (chassisCode: string) => void;
}

export const MotorworldCore: FC<MotorworldCoreProps> = ({
  isWhiteYellow = false,
  onSelectVehicleChassis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<MotorworldProfile | null>(null);
  const [filterFocus, setFilterFocus] = useState<'all' | 'mot' | 'fluids' | 'recalls' | 'census' | 'track'>('all');

  // Filtered profiles
  const profiles = useMemo(() => {
    const list = searchMotorworldDatabase(searchQuery);
    if (filterFocus === 'all') return list;
    if (filterFocus === 'recalls') return list.filter(p => p.officialDvsaRecalls.length > 0);
    if (filterFocus === 'census') return list.filter(p => p.howManyLeftCensus.rarityTier !== 'Plentiful');
    if (filterFocus === 'track') return list.filter(p => !!p.performanceLapTelemetry.nurburgringNordschleifeTime);
    if (filterFocus === 'mot') return list.filter(p => p.dvsaMotAnalytics.overallFirstTimePassRate < 85);
    return list;
  }, [searchQuery, filterFocus]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isWhiteYellow 
          ? 'bg-gradient-to-br from-amber-500/10 via-white to-zinc-50 border-amber-200 shadow-sm' 
          : 'bg-gradient-to-br from-amber-500/10 via-[#0D0E12] to-black border-amber-400/20 shadow-xl'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[10px] font-mono-numbers tracking-widest uppercase">
                MOTORWORLD ENGINE CORE
              </span>
              <span className="text-xs text-zinc-400 font-mono-numbers">
                UK DVSA &bull; DVLA &bull; OEM Codex &bull; Lap Benchmarks
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-luxury-display text-white tracking-wide">
              Official Automotive Knowledge Codex
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
              Cross-referenced repository of UK MOT roadworthiness failure rates, "How Many Left?" survival censuses, factory fluid &amp; lubricant specifications, official safety recalls, and Nürburgring lap telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[90px]">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono-numbers">Indexed Fleets</span>
              <span className="text-lg font-bold text-amber-400 font-mono-numbers">
                {Object.keys(MOTORWORLD_DATABASE).length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[90px]">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono-numbers">DVSA Test Data</span>
              <span className="text-lg font-bold text-emerald-400 font-mono-numbers">
                72k+ MOTs
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filter Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-white/[0.08] mt-5">
          <button
            onClick={() => setFilterFocus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition cursor-pointer flex items-center gap-1.5 ${
              filterFocus === 'all' 
                ? 'bg-amber-400 text-black font-bold shadow-md' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <span>All Sources</span>
            <span className="text-[10px] opacity-75">({Object.keys(MOTORWORLD_DATABASE).length})</span>
          </button>

          <button
            onClick={() => setFilterFocus('mot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition cursor-pointer flex items-center gap-1.5 ${
              filterFocus === 'mot' 
                ? 'bg-amber-400 text-black font-bold shadow-md' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High MOT Watchlist (&lt;85% Pass)</span>
          </button>

          <button
            onClick={() => setFilterFocus('recalls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition cursor-pointer flex items-center gap-1.5 ${
              filterFocus === 'recalls' 
                ? 'bg-amber-400 text-black font-bold shadow-md' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Active Safety Recalls</span>
          </button>

          <button
            onClick={() => setFilterFocus('census')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition cursor-pointer flex items-center gap-1.5 ${
              filterFocus === 'census' 
                ? 'bg-amber-400 text-black font-bold shadow-md' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Rare &amp; Collector Survival</span>
          </button>

          <button
            onClick={() => setFilterFocus('track')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-numbers transition cursor-pointer flex items-center gap-1.5 ${
              filterFocus === 'track' 
                ? 'bg-amber-400 text-black font-bold shadow-md' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Nordschleife Benchmarks</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any information: '10W-60', 'subframe', 'DRC', 'FL5', 'airbag recall', 'B7 RS4'..."
          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400/60 font-mono-numbers transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono-numbers transition cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count & Quick Status */}
      <div className="flex items-center justify-between text-xs font-mono-numbers text-zinc-400">
        <span>Displaying {profiles.length} technical profiles from UK &amp; European official databases</span>
        <span className="text-amber-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Click any dossier for deep specifications
        </span>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p) => {
          const passRate = p.dvsaMotAnalytics.overallFirstTimePassRate;
          const passColor = passRate >= 92 ? 'text-emerald-400' : passRate >= 82 ? 'text-amber-400' : 'text-rose-400';
          const rarity = p.howManyLeftCensus.rarityTier;
          const rarityBadge = 
            rarity === 'Ultra-Rare' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
            rarity === 'Heritage Low' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            rarity === 'Enthusiast Core' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
            'bg-zinc-800 text-zinc-300 border-zinc-700';

          return (
            <div
              key={p.chassisCode}
              onClick={() => setSelectedProfile(p)}
              className="group p-5 rounded-3xl bg-[#0E0F13] border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl space-y-4"
            >
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black font-extrabold text-[10px] font-mono-numbers">
                    {p.chassisCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono-numbers uppercase font-semibold ${rarityBadge}`}>
                    {rarity}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-mono-numbers text-amber-400/90 font-bold uppercase">{p.make}</p>
                  <h3 className="text-base font-bold text-white font-luxury-display group-hover:text-amber-300 transition">
                    {p.model} <span className="text-xs text-zinc-400 font-normal">{p.variant}</span>
                  </h3>
                </div>
              </div>

              {/* Technical Snapshot Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers">
                {/* MOT Pass Rate */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">DVSA MOT Pass Rate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-sm font-bold ${passColor}`}>{passRate}%</span>
                    <span className="text-[9px] text-zinc-500">({p.dvsaMotAnalytics.testSampleCount.toLocaleString()} tests)</span>
                  </div>
                </div>

                {/* UK Survival (Licensed vs SORN) */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">UK Fleet Survival</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-white">{p.howManyLeftCensus.licensedCount.toLocaleString()}</span>
                    <span className="text-[9px] text-zinc-400">taxed &bull; {p.howManyLeftCensus.sornCount} SORN</span>
                  </div>
                </div>

                {/* Factory Oil Spec */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">OEM Engine Oil</span>
                  <span className="font-bold text-amber-400 block truncate">{p.fluidsAndServiceCodex.engineOil.viscosity}</span>
                  <span className="text-[9px] text-zinc-400 block truncate">{p.fluidsAndServiceCodex.engineOil.sumpCapacityLitres}L capacity</span>
                </div>

                {/* Lap Benchmark */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Nürburgring BTG / Lap</span>
                  <span className="font-bold text-emerald-400 block truncate">
                    {p.performanceLapTelemetry.nurburgringNordschleifeTime || 'N/A'}
                  </span>
                  <span className="text-[9px] text-zinc-400 block">
                    60–0: {p.performanceLapTelemetry.sixtyToZeroMeters}m
                  </span>
                </div>
              </div>

              {/* Safety Recalls & Key Failure Point Warning */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono-numbers">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>{p.officialDvsaRecalls.length} Official Recalls</span>
                </div>

                <span className="text-amber-400 flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition">
                  Deep Codex <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: FULL MOTORWORLD DOSSIER ── */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0E0F13] border border-white/15 p-5 sm:p-8 space-y-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-black font-extrabold text-xs font-mono-numbers">
                  {selectedProfile.chassisCode}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 text-xs font-mono-numbers">
                  {selectedProfile.productionYears}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono-numbers">
                  {selectedProfile.howManyLeftCensus.rarityTier} Survival
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-luxury-display text-white">
                {selectedProfile.make} {selectedProfile.model}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono-numbers">
                {selectedProfile.variant} &bull; DVSA &amp; OEM Motorworld Knowledge Archive
              </p>
            </div>

            {/* 6 Comprehensive Intelligence Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* SECTION 1: DVSA MOT ROADWORTHINESS TESTING */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold font-mono-numbers flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>DVSA MOT Testing &amp; Pass Rates</span>
                  </h4>
                  <span className="text-sm font-bold text-white font-mono-numbers">
                    {selectedProfile.dvsaMotAnalytics.overallFirstTimePassRate}% Pass
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  Based on <span className="text-white font-bold">{selectedProfile.dvsaMotAnalytics.testSampleCount.toLocaleString()}</span> verified DVSA testing records.
                </p>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" 
                    style={{ width: `${selectedProfile.dvsaMotAnalytics.overallFirstTimePassRate}%` }}
                  />
                </div>

                {/* Top Failure Categories */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono-numbers font-semibold">
                    Top Verified Failure Root Causes:
                  </span>
                  {selectedProfile.dvsaMotAnalytics.topFailureCategories.map((cat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                      <div className="flex justify-between text-xs font-mono-numbers">
                        <span className="font-bold text-zinc-200">{cat.category}</span>
                        <span className="text-rose-400 font-bold">{cat.failureRatePct}% failure rate</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {cat.commonDefects.join('; ')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Advisory trends */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono-numbers">
                    Tester Advisory Trends:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                    {selectedProfile.dvsaMotAnalytics.advisoryTrends.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SECTION 2: HOW MANY LEFT UK SURVIVAL CENSUS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold font-mono-numbers flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>How Many Left? UK Survival Census</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] font-extrabold font-mono-numbers">
                    {selectedProfile.howManyLeftCensus.rarityTier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono-numbers">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Licensed</span>
                    <span className="text-base font-bold text-white">
                      {selectedProfile.howManyLeftCensus.licensedCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">SORN</span>
                    <span className="text-base font-bold text-amber-400">
                      {selectedProfile.howManyLeftCensus.sornCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Total UK</span>
                    <span className="text-base font-bold text-emerald-400">
                      {selectedProfile.howManyLeftCensus.totalUkFleet.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono-numbers">
                  <span className="text-zinc-400">10-Year Fleet Survival Trajectory:</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    selectedProfile.howManyLeftCensus.tenYearSurvivalTrendPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedProfile.howManyLeftCensus.tenYearSurvivalTrendPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {selectedProfile.howManyLeftCensus.tenYearSurvivalTrendPct > 0 ? `+${selectedProfile.howManyLeftCensus.tenYearSurvivalTrendPct}%` : `${selectedProfile.howManyLeftCensus.tenYearSurvivalTrendPct}%`}
                  </span>
                </div>

                {/* Running Cost Index */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono-numbers">
                    Annual Running Cost Index (UK Market):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">Annual VED Tax</span>
                      <span className="font-bold text-white">£{selectedProfile.runningCostIndex.annualRoadTaxVedGbp}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">Insurance Group</span>
                      <span className="font-bold text-amber-400">Group {selectedProfile.runningCostIndex.insuranceGroup} of 50</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">WLTP Economy</span>
                      <span className="font-bold text-emerald-400">{selectedProfile.runningCostIndex.wltpCombinedMpg} MPG</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">Est. Annual Service</span>
                      <span className="font-bold text-zinc-200">£{selectedProfile.runningCostIndex.averageAnnualServiceCostGbp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: FLUIDS, LUBRICATION & SERVICE CODEX */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold font-mono-numbers flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-amber-400" />
                  <span>OEM Factory Fluids &amp; Service Intervals</span>
                </h4>

                <div className="space-y-2 text-xs font-mono-numbers">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Engine Oil Spec:</span>
                      <span className="font-bold text-amber-400">{selectedProfile.fluidsAndServiceCodex.engineOil.viscosity}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">{selectedProfile.fluidsAndServiceCodex.engineOil.oemApproval}</p>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Sump: {selectedProfile.fluidsAndServiceCodex.engineOil.sumpCapacityLitres} Litres</span>
                      <span>Change: every {selectedProfile.fluidsAndServiceCodex.engineOil.intervalMiles.toLocaleString()} mi</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Gearbox Fluid:</span>
                      <span className="font-bold text-white">{selectedProfile.fluidsAndServiceCodex.gearboxOil.capacityLitres}L</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 truncate">{selectedProfile.fluidsAndServiceCodex.gearboxOil.spec}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Differential Fluid:</span>
                      <span className="font-bold text-white">{selectedProfile.fluidsAndServiceCodex.differentialOil.capacityLitres}L</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 truncate">{selectedProfile.fluidsAndServiceCodex.differentialOil.spec}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex justify-between">
                    <div>
                      <span className="text-zinc-400 block">Brake Fluid:</span>
                      <span className="font-bold text-sky-400">{selectedProfile.fluidsAndServiceCodex.brakeFluid.spec}</span>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="text-zinc-300 block">Dry: {selectedProfile.fluidsAndServiceCodex.brakeFluid.dryBoilingPointC}°C</span>
                      <span className="text-zinc-500 block">Wet: {selectedProfile.fluidsAndServiceCodex.brakeFluid.wetBoilingPointC}°C</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex justify-between">
                    <div>
                      <span className="text-zinc-400 block">Cold Road Pressures:</span>
                      <span className="font-bold text-white">
                        {selectedProfile.fluidsAndServiceCodex.tirePressures.coldRoadFrontPsi} PSI Front &bull; {selectedProfile.fluidsAndServiceCodex.tirePressures.coldRoadRearPsi} PSI Rear
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-400 block">Hot Track Pressures:</span>
                      <span className="font-bold text-amber-400">
                        {selectedProfile.fluidsAndServiceCodex.tirePressures.hotTrackFrontPsi} / {selectedProfile.fluidsAndServiceCodex.tirePressures.hotTrackRearPsi} PSI
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: OFFICIAL DVSA SAFETY RECALLS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold font-mono-numbers flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Official DVSA Safety Recalls ({selectedProfile.officialDvsaRecalls.length})</span>
                  </h4>
                </div>

                {selectedProfile.officialDvsaRecalls.length === 0 ? (
                  <div className="p-6 rounded-xl bg-black/40 border border-white/[0.06] text-center space-y-1">
                    <span className="text-emerald-400 font-bold text-xs font-mono-numbers block">Zero Active Safety Recalls</span>
                    <p className="text-[11px] text-zinc-500">No safety critical recall campaigns registered with the UK DVSA.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProfile.officialDvsaRecalls.map((rec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-1.5 font-mono-numbers">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-amber-400">{rec.campaignRef}</span>
                          <span className="text-zinc-500 text-[10px]">{rec.issueDate}</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-200">{rec.component}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{rec.description}</p>
                        
                        <div className="pt-1 text-[10px] space-y-0.5 border-t border-white/[0.04]">
                          <p className="text-rose-400"><span className="font-bold">Risk:</span> {rec.safetyRisk}</p>
                          <p className="text-emerald-400"><span className="font-bold">Remedy:</span> {rec.remedy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Performance Lap Telemetry */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2 font-mono-numbers">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                    Verified Performance &amp; Lap Times:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">Nürburgring Nordschleife</span>
                      <span className="font-bold text-amber-400">{selectedProfile.performanceLapTelemetry.nurburgringNordschleifeTime || 'N/A'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">Anglesey Coastal</span>
                      <span className="font-bold text-sky-400">{selectedProfile.performanceLapTelemetry.angleseyCoastalTime || 'N/A'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">1/4 Mile ET @ Speed</span>
                      <span className="font-bold text-white">{selectedProfile.performanceLapTelemetry.quarterMileSeconds}s @ {selectedProfile.performanceLapTelemetry.quarterMileTrapSpeedMph} MPH</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] text-zinc-500 block">60–0 MPH Emergency Brake</span>
                      <span className="font-bold text-emerald-400">{selectedProfile.performanceLapTelemetry.sixtyToZeroMeters} meters</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-500 font-mono-numbers">
                Data sources: UK Driver and Vehicle Standards Agency (DVSA) &bull; Department for Transport (DfT)
              </span>
              <div className="flex items-center gap-2">
                {onSelectVehicleChassis && (
                  <button
                    onClick={() => {
                      onSelectVehicleChassis(selectedProfile.chassisCode);
                      setSelectedProfile(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-numbers text-xs font-bold transition cursor-pointer"
                  >
                    View in Universe Directory &rarr;
                  </button>
                )}
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
