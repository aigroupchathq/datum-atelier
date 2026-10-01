import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import {
  Activity,
  Gauge,
  Flame,
  Droplets,
  Wind,
  Disc,
  Radio,
  Sliders
} from 'lucide-react';
import { datumBackend } from '../../services/backend/DatumBackendEngine';
import type { DecodedTelemetryPacket } from '../../core/telemetry/CanBusStreamDecoder';
import type { GripAnalysisResult } from '../../core/radar/GripPhysicsEngine';

interface RadialDynamicsClusterProps {
  carName?: string;
  carModel?: string;
}

export type DynamicsSectorId = 
  | 'powertrain' 
  | 'thermals' 
  | 'friction' 
  | 'braking' 
  | 'kinematics' 
  | 'dampers' 
  | 'aerodynamics' 
  | 'can_bus';

interface DynamicsSubMetric {
  label: string;
  value: string | number;
  unit: string;
  status: 'optimal' | 'elevated' | 'caution';
  iconText?: string;
}

interface DynamicsSector {
  id: DynamicsSectorId;
  angleIndex: number; // 0 to 7 (for 8 sectors)
  title: string;
  subtitle: string;
  category: string;
  colorHex: string;
  icon: typeof Activity;
  primaryValue: string;
  subMetrics: DynamicsSubMetric[];
  description: string;
}

export const RadialDynamicsCluster: FC<RadialDynamicsClusterProps> = ({
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)'
}) => {
  const [selectedSector, setSelectedSector] = useState<DynamicsSectorId>('friction');
  const [telemetry, setTelemetry] = useState<DecodedTelemetryPacket | null>(null);
  const [gripResult, setGripResult] = useState<GripAnalysisResult | null>(null);

  // Subscribe to live telemetry backend stream
  useEffect(() => {
    datumBackend.startTelemetryStream(10);
    const unsubscribe = datumBackend.subscribe((frame) => {
      setTelemetry(frame.decoded);
      if (frame.gripSnapshot) {
        setGripResult(frame.gripSnapshot);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute 8 Dynamic Sectors based on live telemetry & grip calculations
  const sectors: Record<DynamicsSectorId, DynamicsSector> = useMemo(() => {
    const rpm = telemetry?.engineRpm || 4850;
    const speed = telemetry?.speedKph || 84.5;
    const throttle = telemetry?.throttlePct || 68;
    const brakePress = telemetry?.brakePressureBar || 0;
    const latG = telemetry?.lateralG || 0.88;
    const longG = telemetry?.longitudinalG || 0.42;
    const oilTemp = telemetry?.oilTempC || 96;
    const coolantTemp = telemetry?.coolantTempC || 90;
    const oilPress = telemetry?.oilPressureBar || 4.75;
    const steerAngle = telemetry?.steeringAngleDeg || 14.5;
    const mu = gripResult?.muEffective || 0.88;
    const psiScore = gripResult?.passSafetyIndex || 89;
    const hydroRisk = gripResult ? Math.round(gripResult.hydroplaningRiskScore * 100) : 12;

    return {
      powertrain: {
        id: 'powertrain',
        angleIndex: 0, // Top (12 o'clock)
        title: 'Powertrain & Boost',
        subtitle: 'S58 Twin-Turbo Combustion',
        category: 'ENGINE DYNAMICS',
        colorHex: '#EAB308', // Speed Yellow
        icon: Flame,
        primaryValue: `${rpm} RPM`,
        description: 'Bi-turbo twin mono-scroll induction. Wastegate duty cycle active with immediate throttle pickup on apex exits.',
        subMetrics: [
          { label: 'Engine Speed', value: rpm, unit: 'RPM', status: rpm > 6800 ? 'elevated' : 'optimal' },
          { label: 'Road Velocity', value: speed, unit: 'KM/H', status: 'optimal' },
          { label: 'Throttle Position', value: throttle, unit: '%', status: 'optimal' },
          { label: 'Air-Fuel Ratio', value: '12.4', unit: 'λ', status: 'optimal' }
        ]
      },
      thermals: {
        id: 'thermals',
        angleIndex: 1, // 1:30 position
        title: 'Thermodynamic Fluids',
        subtitle: 'Heat Dissipation & Viscosity',
        category: 'COOLING ENCLAVE',
        colorHex: '#F97316', // Orange
        icon: Droplets,
        primaryValue: `${oilTemp}°C Oil`,
        description: 'Castrol 5W-30 synthetic fluid film integrity. Dual auxiliary radiators maintaining thermal equilibrium under heavy load.',
        subMetrics: [
          { label: 'Synthetic Oil Temp', value: oilTemp, unit: '°C', status: oilTemp > 110 ? 'elevated' : 'optimal' },
          { label: 'Coolant Flow', value: coolantTemp, unit: '°C', status: 'optimal' },
          { label: 'Oil Hydraulic Pressure', value: oilPress, unit: 'BAR', status: oilPress < 1.5 ? 'caution' : 'optimal' },
          { label: 'Charge Air Temp', value: '28.5', unit: '°C', status: 'optimal' }
        ]
      },
      friction: {
        id: 'friction',
        angleIndex: 2, // 3 o'clock
        title: 'Pacejka Tarmac Grip',
        subtitle: 'Dynamic Friction Coefficient (μ)',
        category: 'ROAD ADHESION',
        colorHex: '#10B981', // Emerald
        icon: Activity,
        primaryValue: `μ ${mu}`,
        description: 'Pacejka Magic Formula tire-road friction model synthesizing bitumen wetness, micro-texture, and Michelin PS4S contact patch.',
        subMetrics: [
          { label: 'Friction Coefficient', value: `μ ${mu}`, unit: '', status: mu < 0.65 ? 'caution' : 'optimal' },
          { label: 'Pass Safety Index', value: `${psiScore}/100`, unit: 'PSI', status: psiScore < 60 ? 'caution' : 'optimal' },
          { label: 'Hydroplaning Risk', value: `${hydroRisk}%`, unit: '', status: hydroRisk > 40 ? 'elevated' : 'optimal' },
          { label: 'Cornering Stiffness', value: '1,280', unit: 'N/°', status: 'optimal' }
        ]
      },
      braking: {
        id: 'braking',
        angleIndex: 3, // 4:30 position
        title: 'Braking Hydraulics',
        subtitle: 'Brembo DOT 5.1 & Pad Thermal',
        category: 'DECELERATION',
        colorHex: '#EF4444', // Red
        icon: Disc,
        primaryValue: `${brakePress > 0 ? brakePress : '0.0'} BAR`,
        description: 'AP Racing 6-piston monobloc calipers with Ferodo DS2500 high-friction pad compound. Brake disc temperatures within target fade window.',
        subMetrics: [
          { label: 'Brake Line Pressure', value: brakePress, unit: 'BAR', status: brakePress > 45 ? 'elevated' : 'optimal' },
          { label: 'Front Rotor Temp', value: '342', unit: '°C', status: 'optimal' },
          { label: 'Rear Rotor Temp', value: '285', unit: '°C', status: 'optimal' },
          { label: 'ABS Modulation', value: 'STANDBY', unit: '', status: 'optimal' }
        ]
      },
      kinematics: {
        id: 'kinematics',
        angleIndex: 4, // 6 o'clock (Bottom)
        title: 'Chassis Kinematics',
        subtitle: '3-Axis G-Force & Yaw Vector',
        category: 'INERTIAL MATRIX',
        colorHex: '#06B6D4', // Cyan
        icon: Gauge,
        primaryValue: `${latG}G Lat`,
        description: 'Bi-directional accelerometer logging roll center and pitch acceleration through high-speed mountain pass sweeping transitions.',
        subMetrics: [
          { label: 'Lateral G-Force', value: `${latG}G`, unit: '', status: Math.abs(latG) > 1.0 ? 'elevated' : 'optimal' },
          { label: 'Longitudinal G-Force', value: `${longG}G`, unit: '', status: 'optimal' },
          { label: 'Steering Wheel Angle', value: `${steerAngle}°`, unit: '', status: 'optimal' },
          { label: 'Yaw Rotation Rate', value: '12.8', unit: '°/s', status: 'optimal' }
        ]
      },
      dampers: {
        id: 'dampers',
        angleIndex: 5, // 7:30 position
        title: 'KW V4 Suspension',
        subtitle: '3-Way Independent Damping',
        category: 'CHASSIS ARTICULATION',
        colorHex: '#8B5CF6', // Purple
        icon: Sliders,
        primaryValue: '50:50 Cross',
        description: 'KW Variant 4 independent high/low speed compression and rebound valves eliminating chassis bounce over frost heaves and pavement drops.',
        subMetrics: [
          { label: 'FL High-Speed Comp', value: '8 clicks', unit: '', status: 'optimal' },
          { label: 'FR High-Speed Comp', value: '8 clicks', unit: '', status: 'optimal' },
          { label: 'Cross-Weight Balance', value: '50.1%', unit: '', status: 'optimal' },
          { label: 'Dynamic Pitch Offset', value: '-0.8°', unit: '', status: 'optimal' }
        ]
      },
      aerodynamics: {
        id: 'aerodynamics',
        angleIndex: 6, // 9 o'clock
        title: 'Aero Downforce',
        subtitle: 'Venturi Underbody & Wing Flux',
        category: 'FLUID DYNAMICS',
        colorHex: '#3B82F6', // Blue
        icon: Wind,
        primaryValue: '125 kg @ 120kph',
        description: 'Rear carbon diffuser and front splitter generating stable underbody suction with minimal parasite drag coefficient (Cd 0.33).',
        subMetrics: [
          { label: 'Front Splitter Downforce', value: '45', unit: 'KG', status: 'optimal' },
          { label: 'Rear Spoiler Load', value: '80', unit: 'KG', status: 'optimal' },
          { label: 'Drag Coefficient', value: '0.33', unit: 'Cd', status: 'optimal' },
          { label: 'Ground Clearance', value: '112', unit: 'MM', status: 'optimal' }
        ]
      },
      can_bus: {
        id: 'can_bus',
        angleIndex: 7, // 10:30 position
        title: 'CAN-Bus Integrity',
        subtitle: 'ISO 11898-1 High-Speed Telemetry',
        category: 'ELECTRONIC BACKBONE',
        colorHex: '#EC4899', // Pink
        icon: Radio,
        primaryValue: '10 Hz Sync',
        description: 'Full-duplex CAN 2.0B differential bus operating with zero packet checksum drops and real-time mechanical anomaly detection.',
        subMetrics: [
          { label: 'Bus Transmission Rate', value: '500', unit: 'KBPS', status: 'optimal' },
          { label: 'Frame Error Counter', value: '0', unit: 'DROPS', status: 'optimal' },
          { label: 'System Voltage', value: '14.2', unit: 'V', status: 'optimal' },
          { label: 'Signal Latency', value: '< 2.4', unit: 'MS', status: 'optimal' }
        ]
      }
    };
  }, [telemetry, gripResult]);

  const activeSector = sectors[selectedSector];

  // Helper to compute SVG sector wedge path and icon coordinates
  const getSectorCoordinates = (index: number) => {
    // 8 sectors = 45 degrees each. Offset by -90 deg so index 0 is at 12 o'clock (top)
    const startAngleDeg = index * 45 - 90 - 22.5;
    const endAngleDeg = startAngleDeg + 45;
    const midAngleDeg = (startAngleDeg + endAngleDeg) / 2;

    const startAngleRad = (startAngleDeg * Math.PI) / 180;
    const endAngleRad = (endAngleDeg * Math.PI) / 180;
    const midAngleRad = (midAngleDeg * Math.PI) / 180;

    const outerRadius = 140;
    const innerRadius = 75;
    const iconRadius = 108;

    const x1 = 150 + outerRadius * Math.cos(startAngleRad);
    const y1 = 150 + outerRadius * Math.sin(startAngleRad);
    const x2 = 150 + outerRadius * Math.cos(endAngleRad);
    const y2 = 150 + outerRadius * Math.sin(endAngleRad);
    const x3 = 150 + innerRadius * Math.cos(endAngleRad);
    const y3 = 150 + innerRadius * Math.sin(endAngleRad);
    const x4 = 150 + innerRadius * Math.cos(startAngleRad);
    const y4 = 150 + innerRadius * Math.sin(startAngleRad);

    const iconX = 150 + iconRadius * Math.cos(midAngleRad);
    const iconY = 150 + iconRadius * Math.sin(midAngleRad);

    // SVG path definition
    const pathD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;

    return { pathD, iconX, iconY, midAngleDeg };
  };

  return (
    <div 
      className="rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)'
      }}
    >
      {/* Top Header Rail */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md border"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#09090B',
              borderColor: 'var(--border-default)'
            }}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-luxury-display text-base sm:text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Radial Telemetry Dynamics Cluster
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                10 HZ LIVE
              </span>
            </div>
            <p className="text-xs font-mono-numbers text-zinc-400">
              8-Sector Multi-Dimensional Vehicle Adhesion & Kinematics Taxonomy
            </p>
          </div>
        </div>

        {/* Live Stream Indicator Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono-numbers text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CAN 2.0B FEED ACTIVE</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">{carModel}</span>
        </div>
      </div>

      {/* Main Grid: Radial Dial on Left + Deep Telemetry Dimension Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ========================================================= */}
        {/* 1. LEFT: 8-SECTOR CIRCULAR RADAR WHEEL (SVG VISUALIZER)    */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none">
          
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* Ambient Backlight Glow */}
            <div 
              className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-500 pointer-events-none"
              style={{ backgroundColor: activeSector.colorHex }}
            />

            {/* SVG 8-Sector Radar Wheel */}
            <svg 
              className="w-full h-full transform hover:scale-[1.01] transition-transform duration-300" 
              viewBox="0 0 300 300"
            >
              <defs>
                {/* Sector Glow Filter */}
                <filter id="sector-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Outer Ring Track */}
              <circle
                cx="150"
                cy="150"
                r="142"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Inner Chassis Enclave Ring */}
              <circle
                cx="150"
                cy="150"
                r="72"
                fill="rgba(9, 9, 11, 0.95)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />

              {/* Render 8 Interactive Sector Wedges */}
              {(Object.keys(sectors) as DynamicsSectorId[]).map((secId) => {
                const sec = sectors[secId];
                const isSelected = selectedSector === secId;
                const { pathD, iconX, iconY } = getSectorCoordinates(sec.angleIndex);

                return (
                  <g 
                    key={secId} 
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => setSelectedSector(secId)}
                  >
                    {/* Wedge Segment */}
                    <path
                      d={pathD}
                      fill={isSelected ? sec.colorHex : 'rgba(255,255,255,0.03)'}
                      fillOpacity={isSelected ? 0.28 : 0.6}
                      stroke={isSelected ? sec.colorHex : 'rgba(255,255,255,0.12)'}
                      strokeWidth={isSelected ? 2.5 : 1}
                      className="transition-all duration-300 hover:fill-opacity-40"
                      filter={isSelected ? 'url(#sector-glow)' : undefined}
                    />

                    {/* Sector Node Marker Point */}
                    <circle
                      cx={iconX}
                      cy={iconY}
                      r={isSelected ? 7 : 4}
                      fill={isSelected ? '#FFFFFF' : sec.colorHex}
                      stroke={sec.colorHex}
                      strokeWidth={isSelected ? 3 : 1}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Core Cockpit HUD Display */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-center p-2 bg-[#09090B]/90 backdrop-blur-md border border-white/15 shadow-2xl">
                <span className="text-[9px] font-mono-numbers uppercase tracking-widest text-zinc-400">
                  {carName} LIVE
                </span>
                <span 
                  className="text-base sm:text-lg font-bold font-mono-numbers leading-tight mt-0.5"
                  style={{ color: activeSector.colorHex }}
                >
                  {activeSector.primaryValue}
                </span>
                <span className="text-[9px] font-mono-numbers uppercase tracking-wider text-zinc-300 mt-0.5 truncate max-w-[90px]">
                  {activeSector.category.split(' ')[0]}
                </span>
              </div>
            </div>

          </div>

          {/* Dial Interaction Tip */}
          <p className="text-[11px] font-mono-numbers text-zinc-500 mt-3 text-center">
            Click or tap any radial sector to inspect deep subsystem telemetry
          </p>

        </div>

        {/* ========================================================= */}
        {/* 2. RIGHT: DETAILED SUBSYSTEM TELEMETRY MATRIX            */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Sector Dossier Header */}
          <div 
            className="p-5 rounded-2xl border transition-all duration-300 space-y-2"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: activeSector.colorHex
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-numbers font-bold uppercase tracking-widest text-zinc-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSector.colorHex }} />
                <span>{activeSector.category}</span>
                <span>•</span>
                <span>SECTOR 0{activeSector.angleIndex + 1}</span>
              </div>
              <span className="text-xs font-bold font-mono-numbers px-2.5 py-1 rounded-full bg-black/40 border border-white/10" style={{ color: activeSector.colorHex }}>
                {activeSector.primaryValue}
              </span>
            </div>

            <h4 className="text-xl font-bold font-luxury-display uppercase" style={{ color: 'var(--text-primary)' }}>
              {activeSector.title}
            </h4>
            
            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeSector.description}
            </p>
          </div>

          {/* 4-Card Sub-Metric Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            {activeSector.subMetrics.map((m, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border space-y-1 transition-all"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-wider">
                  <span>{m.label}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    m.status === 'optimal' ? 'bg-emerald-400' : m.status === 'elevated' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                </div>
                <div className="flex items-baseline gap-1 pt-0.5">
                  <span className="text-base sm:text-lg font-bold font-mono-numbers text-white">
                    {m.value}
                  </span>
                  {m.unit && (
                    <span className="text-xs font-mono-numbers text-zinc-400">
                      {m.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sector Quick-Select Pills Strip (8 Domains) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
            {(Object.keys(sectors) as DynamicsSectorId[]).map((sId) => {
              const s = sectors[sId];
              const isSelected = selectedSector === sId;
              return (
                <button
                  key={sId}
                  onClick={() => setSelectedSector(sId)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono-numbers font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                    isSelected ? 'shadow-xs' : 'opacity-60 hover:opacity-100 hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? s.colorHex : 'transparent',
                    color: isSelected ? '#09090B' : 'var(--text-secondary)',
                    borderColor: isSelected ? s.colorHex : 'var(--border-subtle)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? '#09090B' : s.colorHex }} />
                  <span>{s.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
