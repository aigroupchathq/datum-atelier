import { useState } from 'react';
import type { FC } from 'react';
import { 
  CUSTODIAN_ANALYTICS_STABLE, 
  FLEET_SCATTER_DATA, 
  COMMUNITY_ARCHETYPE_SHARE 
} from '../../data/userAnalyticsData';
import { useActiveVehicle } from '../../context/ActiveVehicleContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
  Cell
} from 'recharts';
import {
  Gauge,
  Activity,
  Mountain,
  ShieldCheck,
  Zap,
  TrendingUp,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

interface CustodianAnalyticsViewProps {
  isWhiteYellow?: boolean;
}

export const CustodianAnalyticsView: FC<CustodianAnalyticsViewProps> = ({
  isWhiteYellow = false
}) => {
  const { activeVehicle } = useActiveVehicle();
  const [scatterFilter, setScatterFilter] = useState<string>('all');

  // Filtered scatter data
  const scatterPoints = FLEET_SCATTER_DATA.filter((p) => {
    if (scatterFilter === 'all') return true;
    return p.archetype.toLowerCase().includes(scatterFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* ── TOP KPI TELEMETRY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isWhiteYellow 
            ? 'bg-white border-zinc-200 shadow-sm' 
            : 'bg-[#0E0F13] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono-numbers mb-1">
            <span className="uppercase tracking-wider">Logged Miles</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-white">
            {CUSTODIAN_ANALYTICS_STABLE.totalLoggedMiles.toLocaleString()}
            <span className="text-xs font-normal text-zinc-500 ml-1">mi</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono-numbers text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3,120 mi this month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isWhiteYellow 
            ? 'bg-white border-zinc-200 shadow-sm' 
            : 'bg-[#0E0F13] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono-numbers mb-1">
            <span className="uppercase tracking-wider">Highland Ascent</span>
            <Mountain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-white">
            {CUSTODIAN_ANALYTICS_STABLE.totalMountainAscentFeet.toLocaleString()}
            <span className="text-xs font-normal text-zinc-500 ml-1">ft</span>
          </div>
          <div className="text-[11px] font-mono-numbers text-zinc-400 mt-2">
            Honister &bull; Hardknott &bull; Llanberis
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isWhiteYellow 
            ? 'bg-white border-zinc-200 shadow-sm' 
            : 'bg-[#0E0F13] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono-numbers mb-1">
            <span className="uppercase tracking-wider">Peak Lateral G</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-white">
            {CUSTODIAN_ANALYTICS_STABLE.highestLateralGRecorded}
            <span className="text-xs font-normal text-zinc-500 ml-1">G</span>
          </div>
          <div className="text-[11px] font-mono-numbers text-emerald-400 mt-2">
            Cotswolds B4425 Roman Way Apex
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isWhiteYellow 
            ? 'bg-white border-zinc-200 shadow-sm' 
            : 'bg-[#0E0F13] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono-numbers mb-1">
            <span className="uppercase tracking-wider">Provenance Score</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-amber-400">
            {CUSTODIAN_ANALYTICS_STABLE.activeProvenanceScore}
            <span className="text-xs font-normal text-zinc-500 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] font-mono-numbers text-amber-400/90 mt-2">
            100% Cryptographic BOM Sealed
          </div>
        </div>
      </div>

      {/* ── SECTION 1: DRIVING CADENCE & RESPECT VELOCITY (AREA CHART) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0F13] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-luxury-display text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Custodian Dynamic Pace &amp; Respect Velocity</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono-numbers">
              Monthly miles logged vs community respect tokens awarded across UK pass expeditions
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono-numbers text-xs font-bold self-start sm:self-auto">
            Current Custodian: {activeVehicle.name} ({activeVehicle.chassisCode})
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CUSTODIAN_ANALYTICS_STABLE.monthlyTelemetry}>
              <defs>
                <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRespects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#71717A" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#F59E0B" tick={{ fill: '#F59E0B', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#38BDF8" tick={{ fill: '#38BDF8', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#F4F4F5', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="loggedMiles" name="Logged Miles (mi)" stroke="#F59E0B" fillOpacity={1} fill="url(#colorMiles)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="respectsEarned" name="Respects Earned" stroke="#38BDF8" fillOpacity={1} fill="url(#colorRespects)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SECTION 2: DUAL COLUMN (GRIP EXPOSURE & CHASSIS RADAR) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* GRIP FRICTION HISTOGRAM */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0F13] border border-white/10 space-y-4 shadow-xl">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-base font-bold font-luxury-display text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Road Surface Adhesion Exposure (&mu;)</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono-numbers">
              Miles logged under real British surface conditions (Dry vs Damp vs Rain vs Frost)
            </p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CUSTODIAN_ANALYTICS_STABLE.gripExposure}>
                <XAxis dataKey="frictionRange" stroke="#71717A" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                <YAxis stroke="#71717A" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any, _name: any, item: any) => [`${val.toLocaleString()} mi (${item.payload.percentage}%)`, item.payload.surfaceType]}
                />
                <Bar dataKey="milesLogged" radius={[8, 8, 0, 0]}>
                  {CUSTODIAN_ANALYTICS_STABLE.gripExposure.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-numbers pt-2 border-t border-white/[0.06]">
            {CUSTODIAN_ANALYTICS_STABLE.gripExposure.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 truncate">{item.surfaceType}</span>
                </div>
                <span className="font-bold text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHASSIS ATTRIBUTE RADAR */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0F13] border border-white/10 space-y-4 shadow-xl">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-base font-bold font-luxury-display text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chassis Dynamics Radar vs Fleet Average</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono-numbers">
              Active custodian machine ({activeVehicle.name}) benchmarking against 20+ Motorworld chassis
            </p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={CUSTODIAN_ANALYTICS_STABLE.chassisRadar}>
                <PolarGrid stroke="#27272A" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: '#A1A1AA', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525B" tick={{ fontSize: 9 }} />
                <Radar name={activeVehicle.name} dataKey="activeVehicleScore" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                <Radar name="Fleet Average" dataKey="fleetAverageScore" stroke="#71717A" fill="#71717A" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '12px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs font-mono-numbers text-amber-300/90 flex items-center justify-between">
            <span>Strongest Metric: All-Weather Adhesion (96/100)</span>
            <span className="font-bold text-amber-400">+34% vs Fleet</span>
          </div>
        </div>

      </div>

      {/* ── SECTION 3: POWER-TO-WEIGHT VS 0–60 MPH PERFORMANCE ENVELOPE (SCATTER PLOT) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0F13] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-luxury-display text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Motorworld Kinematic Envelope: Power-to-Weight vs 0–60 MPH</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono-numbers">
              Physical acceleration dynamics &bull; X: Power-to-Weight (BHP/Tonne) &bull; Y: 0–60 Acceleration (Seconds)
            </p>
          </div>

          {/* Archetype Filter for Scatter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-numbers">
            {['all', 'Hot Hatch', 'Analog Purist', 'Track Weapon', 'Supercar'].map((tag) => (
              <button
                key={tag}
                onClick={() => setScatterFilter(tag)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  scatterFilter === tag 
                    ? 'bg-amber-400 text-black font-bold' 
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <XAxis 
                type="number" 
                dataKey="powerToWeight" 
                name="Power-to-Weight" 
                unit=" BHP/T" 
                domain={[100, 550]} 
                stroke="#71717A" 
                tick={{ fill: '#A1A1AA', fontSize: 11 }} 
              />
              <YAxis 
                type="number" 
                dataKey="zeroToSixty" 
                name="0–60 MPH" 
                unit="s" 
                domain={[2.0, 8.0]} 
                reversed={true} 
                stroke="#71717A" 
                tick={{ fill: '#A1A1AA', fontSize: 11 }} 
              />
              <ZAxis range={[70, 200]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as any;
                    return (
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-amber-400/40 text-xs font-mono-numbers space-y-1 shadow-xl">
                        <p className="font-bold text-white text-sm">{data.name} ({data.chassisCode})</p>
                        <p className="text-amber-400">{data.make} &bull; {data.archetype}</p>
                        <div className="pt-1 text-[11px] text-zinc-300 space-y-0.5 border-t border-white/10">
                          <p>Power: <span className="font-bold text-white">{data.powerBhp} BHP</span></p>
                          <p>Weight: <span className="font-bold text-white">{data.curbWeightKg.toLocaleString()} kg</span></p>
                          <p>P:W: <span className="font-bold text-emerald-400">{data.powerToWeight} BHP/T</span></p>
                          <p>0–60: <span className="font-bold text-sky-400">{data.zeroToSixty}s</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Motorworld Fleet" data={scatterPoints} fill="#38BDF8">
                {scatterPoints.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isActiveVehicle ? '#F59E0B' : entry.archetype === 'Track Weapon' ? '#EC4899' : entry.archetype === 'Supercar & GT' ? '#A855F7' : '#38BDF8'} 
                    stroke={entry.isActiveVehicle ? '#FFFFFF' : 'none'}
                    strokeWidth={entry.isActiveVehicle ? 2 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono-numbers pt-2 border-t border-white/[0.06] text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-white" />
              <span className="text-white font-bold">Active Custodian ({activeVehicle.name})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
              <span>Track Weapons</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span>Supercars &amp; GTs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
              <span>Hot Hatches &amp; Saloons</span>
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">Note: Y-axis is inverted (faster times near top)</span>
        </div>
      </div>

      {/* ── SECTION 4: COMMUNITY FLEET ARCHETYPE BREAKDOWN ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0F13] border border-white/10 space-y-4 shadow-xl">
        <div className="border-b border-white/[0.08] pb-3">
          <h3 className="text-base font-bold font-luxury-display text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>DATUM Motoring Society: Archetype Fleet Distribution</span>
          </h3>
          <p className="text-xs text-zinc-400 font-mono-numbers">
            Composition of all authenticated enthusiast chassis in the DATUM ecosystem
          </p>
        </div>

        {/* Horizontal stacked progress bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-zinc-800">
          {COMMUNITY_ARCHETYPE_SHARE.map((item, i) => (
            <div 
              key={i} 
              style={{ width: `${item.percentage}%`, backgroundColor: item.fill }} 
              title={`${item.name}: ${item.percentage}%`}
              className="h-full transition-all hover:opacity-80 cursor-pointer"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {COMMUNITY_ARCHETYPE_SHARE.map((item, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 font-mono-numbers">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-[10px] text-zinc-400 uppercase truncate">{item.name.split('(')[0]}</span>
              </div>
              <div className="text-sm font-bold text-white">{item.percentage}%</div>
              <div className="text-[10px] text-zinc-500">{item.count} chassis</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
