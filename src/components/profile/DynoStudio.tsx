import { useState } from 'react';
import type { FC } from 'react';
import { 
  Gauge, 
  Zap, 
  Activity, 
  Wrench, 
  Sparkles,
  Flame,
  FileCheck2
} from 'lucide-react';

interface DynoPoint {
  rpm: number;
  bhp: number;
  torqueNm: number;
  boostBar?: number;
}

interface DynoStage {
  id: string;
  name: string;
  badge: string;
  peakBhp: number;
  peakTorqueNm: number;
  peakRpmBhp: number;
  peakRpmTorque: number;
  peakBoostBar: number;
  weightDeltaKg: number;
  hardwareModifications: string[];
  certifiedOperator: string;
  dynoDate: string;
  points: DynoPoint[];
}

interface DynoStudioProps {
  vehicleId: string;
  vehicleName: string;
}

// Tailored dyno curves for each vehicle
const VEHICLE_DYNO_DATA: Record<string, { engineTitle: string; maxRpm: number; maxPower: number; stages: DynoStage[] }> = {
  'car-maya-m3': {
    engineTitle: 'BMW S58 3.0L Twin-Turbo Inline-6 (G80)',
    maxRpm: 7500,
    maxPower: 700,
    stages: [
      {
        id: 'stock',
        name: 'Factory Delivery Baseline',
        badge: 'OEM M-POWER',
        peakBhp: 503,
        peakTorqueNm: 650,
        peakRpmBhp: 6250,
        peakRpmTorque: 2750,
        peakBoostBar: 1.7,
        weightDeltaKg: 0,
        hardwareModifications: ['Factory BMW M Competition Map', 'OEM twin-pipe sports exhaust', 'Factory paper panel filters'],
        certifiedOperator: 'BMW Park Lane Delivery Cell',
        dynoDate: 'March 2023',
        points: [
          { rpm: 2000, bhp: 180, torqueNm: 580, boostBar: 1.2 },
          { rpm: 2750, bhp: 254, torqueNm: 650, boostBar: 1.7 },
          { rpm: 3500, bhp: 324, torqueNm: 650, boostBar: 1.7 },
          { rpm: 4500, bhp: 416, torqueNm: 650, boostBar: 1.7 },
          { rpm: 5500, bhp: 490, torqueNm: 625, boostBar: 1.6 },
          { rpm: 6250, bhp: 503, torqueNm: 565, boostBar: 1.5 },
          { rpm: 7200, bhp: 480, torqueNm: 470, boostBar: 1.3 }
        ]
      },
      {
        id: 'stage1',
        name: 'Stage 1 + Eventuri Intake',
        badge: '560 BHP CALIBRATION',
        peakBhp: 562,
        peakTorqueNm: 710,
        peakRpmBhp: 6300,
        peakRpmTorque: 3200,
        peakBoostBar: 2.0,
        weightDeltaKg: -2.8,
        hardwareModifications: ['Bootmod3 Stage 1 99 RON map', 'Eventuri Matte Carbon Dual Intake', 'CSF Heat Exchanger'],
        certifiedOperator: 'Evolve Automotive (Luton)',
        dynoDate: 'July 2025',
        points: [
          { rpm: 2000, bhp: 195, torqueNm: 610, boostBar: 1.3 },
          { rpm: 2750, bhp: 280, torqueNm: 685, boostBar: 1.9 },
          { rpm: 3200, bhp: 324, torqueNm: 710, boostBar: 2.0 },
          { rpm: 4500, bhp: 455, torqueNm: 710, boostBar: 2.0 },
          { rpm: 5500, bhp: 540, torqueNm: 690, boostBar: 1.9 },
          { rpm: 6300, bhp: 562, torqueNm: 625, boostBar: 1.8 },
          { rpm: 7200, bhp: 535, torqueNm: 520, boostBar: 1.5 }
        ]
      },
      {
        id: 'stage2',
        name: 'Stage 2 + Full Akrapovič Titanium',
        badge: '612 BHP CURRENT STATE',
        peakBhp: 612,
        peakTorqueNm: 780,
        peakRpmBhp: 6400,
        peakRpmTorque: 3400,
        peakBoostBar: 2.2,
        weightDeltaKg: -14.6,
        hardwareModifications: ['Litchfield Custom ECU recalibration', 'Akrapovič Evolution Line Titanium System', '200-cell high-flow sport downpipes', 'KW V4 Coilovers'],
        certifiedOperator: 'Litchfield Motors (Tewkesbury)',
        dynoDate: 'September 2026',
        points: [
          { rpm: 2000, bhp: 215, torqueNm: 640, boostBar: 1.4 },
          { rpm: 2750, bhp: 310, torqueNm: 740, boostBar: 2.0 },
          { rpm: 3400, bhp: 378, torqueNm: 780, boostBar: 2.2 },
          { rpm: 4500, bhp: 500, torqueNm: 775, boostBar: 2.2 },
          { rpm: 5500, bhp: 590, torqueNm: 750, boostBar: 2.1 },
          { rpm: 6400, bhp: 612, torqueNm: 670, boostBar: 1.9 },
          { rpm: 7200, bhp: 585, torqueNm: 570, boostBar: 1.7 }
        ]
      }
    ]
  },
  'car-kuro-gt3': {
    engineTitle: 'Porsche Motorsport 4.0L Naturally Aspirated Flat-Six (992)',
    maxRpm: 9200,
    maxPower: 600,
    stages: [
      {
        id: 'stock',
        name: 'Factory GT3 Zuffenhausen Calibration',
        badge: '9,000 RPM NATURALLY ASPIRATED',
        peakBhp: 502,
        peakTorqueNm: 470,
        peakRpmBhp: 8400,
        peakRpmTorque: 6100,
        peakBoostBar: 0.0,
        weightDeltaKg: 0,
        hardwareModifications: ['Six individual throttle bodies', 'Porsche Motorsport dry-sump lubrication', 'Factory lightweight stainless exhaust'],
        certifiedOperator: 'Porsche Leipzig Verification Cell',
        dynoDate: 'October 2024',
        points: [
          { rpm: 2500, bhp: 140, torqueNm: 390, boostBar: 0.0 },
          { rpm: 4000, bhp: 245, torqueNm: 430, boostBar: 0.0 },
          { rpm: 5500, bhp: 360, torqueNm: 460, boostBar: 0.0 },
          { rpm: 6100, bhp: 410, torqueNm: 470, boostBar: 0.0 },
          { rpm: 7500, bhp: 475, torqueNm: 445, boostBar: 0.0 },
          { rpm: 8400, bhp: 502, torqueNm: 418, boostBar: 0.0 },
          { rpm: 9000, bhp: 495, torqueNm: 385, boostBar: 0.0 }
        ]
      },
      {
        id: 'manthey',
        name: 'Manthey Racing Titanium System & Map',
        badge: '524 BHP BESPOKE',
        peakBhp: 524,
        peakTorqueNm: 490,
        peakRpmBhp: 8500,
        peakRpmTorque: 6200,
        peakBoostBar: 0.0,
        weightDeltaKg: -9.5,
        hardwareModifications: ['Manthey Racing inconel/titanium headers', 'BMC high-flow air filters', 'RPM Technik bespoke ECU flash'],
        certifiedOperator: 'RPM Technik (Tring)',
        dynoDate: 'September 2026',
        points: [
          { rpm: 2500, bhp: 152, torqueNm: 405, boostBar: 0.0 },
          { rpm: 4000, bhp: 260, torqueNm: 450, boostBar: 0.0 },
          { rpm: 5500, bhp: 382, torqueNm: 480, boostBar: 0.0 },
          { rpm: 6200, bhp: 432, torqueNm: 490, boostBar: 0.0 },
          { rpm: 7500, bhp: 498, torqueNm: 465, boostBar: 0.0 },
          { rpm: 8500, bhp: 524, torqueNm: 432, boostBar: 0.0 },
          { rpm: 9000, bhp: 518, torqueNm: 402, boostBar: 0.0 }
        ]
      }
    ]
  },
  'car-e30-retromod': {
    engineTitle: 'BMW M42B18 1.8L 16V Twin-Cam (E30 318is)',
    maxRpm: 7200,
    maxPower: 200,
    stages: [
      {
        id: 'stock',
        name: '1989 Factory Baseline (Rotisserie Rebuilt)',
        badge: 'HISTORIC M42 SPEC',
        peakBhp: 136,
        peakTorqueNm: 175,
        peakRpmBhp: 6000,
        peakRpmTorque: 4500,
        peakBoostBar: 0.0,
        weightDeltaKg: 0,
        hardwareModifications: ['Fresh OEM timing chain & hydraulic tensioner', 'Cleaned Bosch fuel injectors', 'Factory cast manifold'],
        certifiedOperator: 'The Classic Motor Hub Atelier',
        dynoDate: 'April 2025',
        points: [
          { rpm: 2000, bhp: 42, torqueNm: 145, boostBar: 0.0 },
          { rpm: 3500, bhp: 82, torqueNm: 165, boostBar: 0.0 },
          { rpm: 4500, bhp: 112, torqueNm: 175, boostBar: 0.0 },
          { rpm: 5500, bhp: 132, torqueNm: 168, boostBar: 0.0 },
          { rpm: 6000, bhp: 136, torqueNm: 160, boostBar: 0.0 },
          { rpm: 6800, bhp: 125, torqueNm: 130, boostBar: 0.0 }
        ]
      },
      {
        id: 'fast-road',
        name: 'Supersprint Stainless + Conforti EPROM',
        badge: '152 BHP PERIOD CORRECT',
        peakBhp: 152,
        peakTorqueNm: 192,
        peakRpmBhp: 6300,
        peakRpmTorque: 4600,
        peakBoostBar: 0.0,
        weightDeltaKg: -6.2,
        hardwareModifications: ['Supersprint 4-into-1 stainless headers', 'Period Jim Conforti revised fuel maps', 'Lightened single-mass flywheel (6.2 kg)'],
        certifiedOperator: 'Autofarm Classic Centre',
        dynoDate: 'July 2026',
        points: [
          { rpm: 2000, bhp: 48, torqueNm: 158, boostBar: 0.0 },
          { rpm: 3500, bhp: 94, torqueNm: 182, boostBar: 0.0 },
          { rpm: 4600, bhp: 126, torqueNm: 192, boostBar: 0.0 },
          { rpm: 5500, bhp: 144, torqueNm: 184, boostBar: 0.0 },
          { rpm: 6300, bhp: 152, torqueNm: 170, boostBar: 0.0 },
          { rpm: 6900, bhp: 140, torqueNm: 142, boostBar: 0.0 }
        ]
      }
    ]
  },
  'car-expedition-110': {
    engineTitle: 'Ingenium 3.0L Turbocharged MHEV Inline-6 (P400)',
    maxRpm: 6800,
    maxPower: 500,
    stages: [
      {
        id: 'stock',
        name: 'Factory Solihull Overland Calibration',
        badge: '400 BHP / 550 NM OVERLAND',
        peakBhp: 395,
        peakTorqueNm: 550,
        peakRpmBhp: 5500,
        peakRpmTorque: 2000,
        peakBoostBar: 1.5,
        weightDeltaKg: 0,
        hardwareModifications: ['Factory 48V electric supercharger + twin-scroll turbo', 'Raised air intake snorkel', 'Heavy-duty cooling pack'],
        certifiedOperator: 'JLR Solihull Engineering Cell',
        dynoDate: 'May 2024',
        points: [
          { rpm: 1500, bhp: 110, torqueNm: 510, boostBar: 1.2 },
          { rpm: 2000, bhp: 156, torqueNm: 550, boostBar: 1.5 },
          { rpm: 3500, bhp: 274, torqueNm: 550, boostBar: 1.5 },
          { rpm: 4500, bhp: 352, torqueNm: 550, boostBar: 1.5 },
          { rpm: 5500, bhp: 395, torqueNm: 505, boostBar: 1.4 },
          { rpm: 6500, bhp: 370, torqueNm: 400, boostBar: 1.2 }
        ]
      }
    ]
  }
};

export const DynoStudio: FC<DynoStudioProps> = ({ vehicleId, vehicleName }) => {
  const data = VEHICLE_DYNO_DATA[vehicleId] || VEHICLE_DYNO_DATA['car-maya-m3'];
  const [selectedStageId, setSelectedStageId] = useState<string>(data.stages[data.stages.length - 1].id);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const activeStage = data.stages.find((s) => s.id === selectedStageId) || data.stages[0];
  const activeHover = hoveredPointIndex !== null ? activeStage.points[hoveredPointIndex] : null;

  // SVG coordinate transformation helpers
  const svgWidth = 800;
  const svgHeight = 280;
  const padLeft = 60;
  const padRight = 60;
  const padTop = 30;
  const padBottom = 40;

  const graphW = svgWidth - padLeft - padRight;
  const graphH = svgHeight - padTop - padBottom;

  const minRpm = activeStage.points[0].rpm;
  const maxRpm = data.maxRpm;
  const maxPower = data.maxPower;

  const getX = (rpm: number) => padLeft + ((rpm - minRpm) / (maxRpm - minRpm)) * graphW;
  const getYPower = (bhp: number) => padTop + graphH - (bhp / maxPower) * graphH;
  const getYTorque = (torque: number) => padTop + graphH - (torque / (maxPower * 1.2)) * graphH;

  // Build SVG path strings
  const powerPoints = activeStage.points.map((p) => `${getX(p.rpm)},${getYPower(p.bhp)}`).join(' ');
  const torquePoints = activeStage.points.map((p) => `${getX(p.rpm)},${getYTorque(p.torqueNm)}`).join(' ');

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border border-amber-500/20 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono-numbers font-bold border border-amber-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CERTIFIED HUB DYNO CELL</span>
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500">Maha LPS 3000 Standard</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white font-luxury-display uppercase tracking-wider mt-1.5">
              Interactive Power & Torque Ledger
            </h2>
            <p className="text-xs text-zinc-400 font-mono-numbers mt-0.5">
              Chassis {vehicleName} • {data.engineTitle} • Shell V-Power 99 RON
            </p>
          </div>

          {/* Stage Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono-numbers">
            {data.stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => {
                  setSelectedStageId(stage.id);
                  setHoveredPointIndex(null);
                }}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs font-bold ${
                  selectedStageId === stage.id
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {stage.name.split('+')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Live Output HUD Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers">
          
          {/* Peak BHP */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Peak Power</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <div className="my-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-amber-400 tracking-tight">
                {activeHover ? activeHover.bhp : activeStage.peakBhp}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">BHP</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              @ {activeHover ? `${activeHover.rpm} RPM` : `${activeStage.peakRpmBhp} RPM`}
            </span>
          </div>

          {/* Peak Torque */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Peak Torque</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <div className="my-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-cyan-400 tracking-tight">
                {activeHover ? activeHover.torqueNm : activeStage.peakTorqueNm}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">NM</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              @ {activeHover ? `${activeHover.rpm} RPM` : `${activeStage.peakRpmTorque} RPM`}
            </span>
          </div>

          {/* Manifold Boost Pressure */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Boost Pressure</span>
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
            </span>
            <div className="my-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-white tracking-tight">
                {activeHover?.boostBar !== undefined ? activeHover.boostBar : activeStage.peakBoostBar}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">BAR</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {activeStage.peakBoostBar === 0 ? 'Naturally Aspirated' : 'Target Boost Peak'}
            </span>
          </div>

          {/* Hardware Weight Delta */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center justify-between">
              <span>Weight Delta</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="my-1.5">
              <span className={`text-3xl sm:text-4xl font-black font-mono-numbers tracking-tight ${
                activeStage.weightDeltaKg < 0 ? 'text-emerald-400' : 'text-zinc-200'
              }`}>
                {activeStage.weightDeltaKg}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">KG</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              Unsprung/Exhaust Shed
            </span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE SVG DYNO GRAPH                                */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono-numbers border-b border-zinc-850 pb-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                <span>Brake Horsepower (BHP)</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                <span>Torque (Nm)</span>
              </span>
            </div>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              Hover over curve points to inspect engine telemetry
            </span>
          </div>

          {/* SVG Viewport */}
          <div className="relative w-full overflow-hidden">
            <svg
              className="w-full h-auto"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="torqueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[100, 200, 300, 400, 500, 600].map((powerVal) => {
                if (powerVal > maxPower) return null;
                const y = getYPower(powerVal);
                return (
                  <g key={powerVal}>
                    <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="#181a22" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={padLeft - 10} y={y + 3} fill="#52525b" fontSize="9" fontFamily="monospace" textAnchor="end">
                      {powerVal}
                    </text>
                  </g>
                );
              })}

              {/* RPM X-Axis ticks */}
              {[2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000].map((rpmVal) => {
                if (rpmVal > maxRpm || rpmVal < minRpm) return null;
                const x = getX(rpmVal);
                return (
                  <g key={rpmVal}>
                    <line x1={x} y1={padTop} x2={x} y2={padTop + graphH} stroke="#181a22" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={x} y={padTop + graphH + 18} fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {rpmVal}
                    </text>
                  </g>
                );
              })}

              {/* Torque Curve */}
              <polyline
                points={torquePoints}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Power Curve */}
              <polyline
                points={powerPoints}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points dots with hover triggers */}
              {activeStage.points.map((pt, i) => {
                const px = getX(pt.rpm);
                const pyPower = getYPower(pt.bhp);
                const pyTorque = getYTorque(pt.torqueNm);
                const isSelected = hoveredPointIndex === i;

                return (
                  <g key={i}>
                    {/* Power Point */}
                    <circle
                      cx={px}
                      cy={pyPower}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#ffffff' : '#f59e0b'}
                      stroke="#f59e0b"
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                    />

                    {/* Torque Point */}
                    <circle
                      cx={px}
                      cy={pyTorque}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#ffffff' : '#06b6d4'}
                      stroke="#06b6d4"
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                    />

                    {/* Vertical hover line */}
                    {isSelected && (
                      <line
                        x1={px}
                        y1={padTop}
                        x2={px}
                        y2={padTop + graphH}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Notarization & Workshop Certification Footer */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-numbers">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-white font-bold block">
                Operator: {activeStage.certifiedOperator}
              </span>
              <span className="text-zinc-500 text-[10px]">
                Notarized: {activeStage.dynoDate} • Ambient DIN 70020 Corrected
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeStage.hardwareModifications.map((mod, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px]">
                {mod}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* TORQUE SPECIFICATION & DIY WRENCHING BLUEPRINT            */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border border-white/[0.08] space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-luxury-display uppercase tracking-wider">
              Chassis Torque Specifications & Wrenching Protocol
            </h3>
          </div>
          <span className="text-[10px] font-mono-numbers text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            FACTORY WORKSHOP MANUAL DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-numbers">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Wheel Hub Bolts</span>
            <span className="text-xl font-bold text-white block">140 Nm</span>
            <p className="text-[10px] text-zinc-400 font-sans">
              M14x1.25 bolt thread. 5-point star-pattern tightening sequence. Never use copper slip on bolt conical seats.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Spark Plugs</span>
            <span className="text-xl font-bold text-white block">23 Nm</span>
            <p className="text-[10px] text-zinc-400 font-sans">
              NGK SILZKBR8F8S Laser Iridium. Gap 0.55mm for tuned boost levels. Install on cold cylinder head.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Oil Sump Drain Plug</span>
            <span className="text-xl font-bold text-white block">25 Nm</span>
            <p className="text-[10px] text-zinc-400 font-sans">
              New copper crush washer mandatory on every service. Sump capacity: 7.0 Litres 0W-30 / 0W-40 Motul 300V.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase block">Brake Caliper Pins</span>
            <span className="text-xl font-bold text-white block">35 Nm</span>
            <p className="text-[10px] text-zinc-400 font-sans">
              M8 slide pins. Clean with brake cleaner, lubricate with high-temp silicone grease. Ferodo DS2500 fast-road pads.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
