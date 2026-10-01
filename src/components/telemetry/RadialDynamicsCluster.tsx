import { useState, useEffect, useMemo, useRef } from 'react';
import type { FC } from 'react';
import {
  Activity,
  Flame,
  Droplets,
  Wind,
  Disc,
  Radio,
  Sliders,
  Gauge,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  CheckCircle2
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

export interface TransducerNode {
  id: string;
  code: string;
  name: string;
  shortLabel: string;
  value: string | number;
  unit: string;
  status: 'nominal' | 'elevated' | 'optimal';
  hardwareSupplier: string;
  specTolerance: string;
  ringLevel: 1 | 2 | 3; // 1 = inner, 2 = mid, 3 = outer concentric tier
  history: number[]; // Sparkline buffer
}

export interface DynamicsSector {
  id: DynamicsSectorId;
  angleIndex: number; // 0 to 7 (45° segments)
  title: string;
  categoryLabel: string;
  badgeAccent: string;
  icon: typeof Activity;
  leadTelemetry: string;
  transducers: TransducerNode[];
  engineeringMemo: string;
}

export const RadialDynamicsCluster: FC<RadialDynamicsClusterProps> = ({
  carName = 'MAYA',
  carModel = 'BMW M3 Competition (G80)'
}) => {
  const [selectedSector, setSelectedSector] = useState<DynamicsSectorId>('friction');
  const [activeTransducerId, setActiveTransducerId] = useState<string>('mu_friction');
  const [isSweepActive, setIsSweepActive] = useState<boolean>(true);
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [telemetryHistory, setTelemetryHistory] = useState<number[]>([]);
  
  // Real-time telemetry feed from backend
  const [telemetry, setTelemetry] = useState<DecodedTelemetryPacket | null>(null);
  const [gripResult, setGripResult] = useState<GripAnalysisResult | null>(null);
  const historyRef = useRef<number[]>([]);

  // 10Hz backend stream subscription
  useEffect(() => {
    datumBackend.startTelemetryStream(10);
    const unsubscribe = datumBackend.subscribe((frame) => {
      setTelemetry(frame.decoded);
      if (frame.gripSnapshot) {
        setGripResult(frame.gripSnapshot);
      }

      // Maintain live 24-point rolling waveform buffer
      const currentVal = frame.gripSnapshot ? frame.gripSnapshot.muEffective * 100 : 88;
      historyRef.current = [...historyRef.current.slice(-23), currentVal];
      setTelemetryHistory([...historyRef.current]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Smooth continuous radar sweep arm animation (subtle analog scan line)
  useEffect(() => {
    if (!isSweepActive) return;
    let animId: number;
    const animate = () => {
      setSweepAngle((prev) => (prev + 0.45) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isSweepActive]);

  // Dynamic 8-Sector Taxonomy modeled after the UX Reference
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
        angleIndex: 0, // 12 o'clock
        title: 'Powertrain & Combustion',
        categoryLabel: 'Powertrain',
        badgeAccent: '#EAB308',
        icon: Flame,
        leadTelemetry: `${rpm} RPM • ${(rpm * 0.071).toFixed(0)} BHP`,
        engineeringMemo: 'BMW M S58 twin-turbo straight-six. Forged crankshaft with wire-arc sprayed iron cylinder bores maintaining 1.45 BAR peak manifold charge pressure.',
        transducers: [
          { id: 'rpm_sensor', code: 'S58-RPM', name: 'Engine Crank Speed', shortLabel: 'Crank RPM', value: rpm, unit: 'RPM', status: rpm > 6800 ? 'elevated' : 'optimal', hardwareSupplier: 'Bosch Motronic', specTolerance: '±10 RPM @ 7,200 Redline', ringLevel: 1, history: [4100, 4300, 4600, 4850, 5200, 4850] },
          { id: 'road_speed', code: 'V-KPH', name: 'Road Velocity Vector', shortLabel: 'Road Speed', value: speed, unit: 'KM/H', status: 'optimal', hardwareSupplier: 'ABS Wheel Hall Effect', specTolerance: '±0.5 km/h Linear Range', ringLevel: 2, history: [78, 80, 82, 84, 85, 84.5] },
          { id: 'boost_sensor', code: 'MAP-01', name: 'Manifold Absolute Boost', shortLabel: 'Boost Pressure', value: '1.45', unit: 'BAR', status: 'optimal', hardwareSupplier: 'Continental Sensor', specTolerance: '0.2 - 2.2 BAR Nominal', ringLevel: 2, history: [1.1, 1.25, 1.4, 1.45, 1.42, 1.45] },
          { id: 'throttle_tps', code: 'TPS-DUAL', name: 'Drive-By-Wire Throttle', shortLabel: 'Throttle TPS', value: throttle, unit: '%', status: 'optimal', hardwareSupplier: 'BMW M Motorsport', specTolerance: '0 - 100% Linear Hall Effect', ringLevel: 3, history: [35, 50, 65, 68, 62, 68] },
          { id: 'afr_lambda', code: 'O2-LAMBDA', name: 'Wideband Air-Fuel Ratio', shortLabel: 'AFR Lambda', value: '12.4', unit: 'λ:1', status: 'nominal', hardwareSupplier: 'NTK Wideband', specTolerance: '11.8 - 14.7 λ Range', ringLevel: 3, history: [12.6, 12.5, 12.4, 12.4, 12.5, 12.4] },
        ]
      },
      thermals: {
        id: 'thermals',
        angleIndex: 1, // 1:30
        title: 'Thermodynamics & Heat Exchanger',
        categoryLabel: 'Thermals',
        badgeAccent: '#F97316',
        icon: Droplets,
        leadTelemetry: `${oilTemp}°C Oil • ${coolantTemp}°C Coolant`,
        engineeringMemo: 'Dual auxiliary wheel-well radiators and mechanical water pump circulating 12.8 L/min. Synthetic oil shear stability preserved at high track temperature.',
        transducers: [
          { id: 'oil_temp', code: 'OT-5W30', name: 'Synthetic Oil Sump Temp', shortLabel: 'Oil Sump', value: oilTemp, unit: '°C', status: 'optimal', hardwareSupplier: 'Castrol EDGE Professional', specTolerance: '85°C - 118°C Safe Corridor', ringLevel: 1, history: [92, 93, 94, 95, 96, 96] },
          { id: 'coolant_temp', code: 'CT-FLOW', name: 'Engine Block Coolant', shortLabel: 'Coolant Core', value: coolantTemp, unit: '°C', status: 'optimal', hardwareSupplier: 'Behr Hella Exchanger', specTolerance: '88°C - 102°C Thermostat', ringLevel: 2, history: [88, 89, 89, 90, 90, 90] },
          { id: 'oil_pressure', code: 'OP-LINE', name: 'Main Gallery Oil Pressure', shortLabel: 'Oil Line Bar', value: oilPress, unit: 'BAR', status: 'optimal', hardwareSupplier: 'Sensata Automotive', specTolerance: '1.8 - 5.5 BAR Active Window', ringLevel: 3, history: [4.6, 4.7, 4.8, 4.75, 4.72, 4.75] },
          { id: 'charge_air', code: 'IAT-IC', name: 'Indirect Charge Air Temp', shortLabel: 'Charge Temp', value: '28.5', unit: '°C', status: 'optimal', hardwareSupplier: 'CSF High-Flow Core', specTolerance: '+8°C Ambient Delta Max', ringLevel: 3, history: [26, 27, 27.5, 28, 28.5, 28.5] }
        ]
      },
      friction: {
        id: 'friction',
        angleIndex: 2, // 3 o'clock
        title: 'Tarmac Surface Grip & Adhesion',
        categoryLabel: 'Road Adhesion',
        badgeAccent: '#10B981',
        icon: Activity,
        leadTelemetry: `μ ${mu} Adhesion • ${psiScore}/100 PSI`,
        engineeringMemo: 'Real-time road surface model calculating dampness, tire contact patch, and cornering grip across alpine tarmac.',
        transducers: [
          { id: 'mu_friction', code: 'PAC-MU', name: 'Peak Friction Coefficient', shortLabel: 'Grip Adhesion', value: `μ ${mu}`, unit: '', status: 'optimal', hardwareSupplier: 'DATUM Physics Engine', specTolerance: 'μ 0.20 (Ice) - 1.25 (Cup2)', ringLevel: 1, history: [84, 86, 88, 87, 89, 88] },
          { id: 'psi_score', code: 'PASS-PSI', name: 'Pass Surface Safety Score', shortLabel: 'Pass Safety Index', value: `${psiScore}`, unit: '/100', status: 'optimal', hardwareSupplier: 'Atelier Met Office Sync', specTolerance: '≥75 Receptive / <40 Hazard', ringLevel: 2, history: [86, 87, 88, 89, 89, 89] },
          { id: 'hydro_risk', code: 'HYDRO-H2O', name: 'Standing Water Film Risk', shortLabel: 'Hydroplane Margin', value: `${hydroRisk}%`, unit: '', status: 'optimal', hardwareSupplier: 'Doppler Radar Ingestion', specTolerance: 'Aquaplane threshold based on tire pressure', ringLevel: 3, history: [15, 14, 13, 12, 12, 12] },
          { id: 'cornering_stiff', code: 'C-ALPHA', name: 'Slip Angle Cornering Stiffness', shortLabel: 'Cornering Force', value: '1,280', unit: 'N/°', status: 'optimal', hardwareSupplier: 'Michelin PS4S Matrix', specTolerance: '1,100 - 1,450 N/° Linear Range', ringLevel: 3, history: [1220, 1250, 1270, 1280, 1275, 1280] }
        ]
      },
      braking: {
        id: 'braking',
        angleIndex: 3, // 4:30
        title: 'Braking Hydraulics & Deceleration',
        categoryLabel: 'Braking',
        badgeAccent: '#EF4444',
        icon: Disc,
        leadTelemetry: `${brakePress > 0 ? brakePress : '0.0'} BAR • 342°C Rotor`,
        engineeringMemo: 'AP Racing Radi-CAL 6-piston monobloc front calipers biting 380mm floating slotted curved-vane iron rotors with Ferodo DS2500 high-friction compound.',
        transducers: [
          { id: 'brake_press', code: 'HYD-LINE', name: 'Brake Line Hydraulic Pressure', shortLabel: 'Line Pressure', value: brakePress, unit: 'BAR', status: 'optimal', hardwareSupplier: 'Brembo S.p.A.', specTolerance: '0 - 120 BAR Trail-Brake Range', ringLevel: 1, history: [0, 15, 45, 60, 20, 0] },
          { id: 'rotor_temp', code: 'ROTOR-FL', name: 'Front Left Rotor Temperature', shortLabel: 'Front Discs', value: '342', unit: '°C', status: 'optimal', hardwareSupplier: 'AP Racing UK', specTolerance: '180°C - 580°C Bite Window', ringLevel: 2, history: [310, 325, 338, 345, 342, 342] },
          { id: 'fluid_boiling', code: 'DOT-5.1', name: 'Brake Fluid Dry Boiling Point', shortLabel: 'Fluid Reserve', value: '295', unit: '°C', status: 'optimal', hardwareSupplier: 'Motul RBF 660', specTolerance: 'Dry: 325°C / Wet: 205°C Min', ringLevel: 3, history: [298, 296, 295, 295, 295, 295] },
          { id: 'abs_cycling', code: 'BOSCH-ABS', name: 'Cornering ABS Frequency', shortLabel: 'ABS Status', value: 'STANDBY', unit: '', status: 'nominal', hardwareSupplier: 'Bosch Motorsport M5', specTolerance: '12-Phase Multi-Map Logic', ringLevel: 3, history: [0, 0, 0, 0, 0, 0] }
        ]
      },
      kinematics: {
        id: 'kinematics',
        angleIndex: 4, // 6 o'clock
        title: 'Chassis Kinematics & Inertial G',
        categoryLabel: 'Kinematics',
        badgeAccent: '#06B6D4',
        icon: Gauge,
        leadTelemetry: `${latG}G Lat • ${longG}G Long`,
        engineeringMemo: '3-Axis MEMS accelerometer logging yaw rate, chassis roll center height, and longitudinal squat under full S58 xDrive acceleration.',
        transducers: [
          { id: 'lat_g_force', code: 'ACCEL-Y', name: 'Apex Lateral G-Force', shortLabel: 'Lateral Accel', value: `${latG}G`, unit: '', status: 'optimal', hardwareSupplier: 'Analog Devices IMU', specTolerance: '±1.45G Peak Adhesion Band', ringLevel: 1, history: [0.65, 0.72, 0.81, 0.88, 0.84, 0.88] },
          { id: 'long_g_force', code: 'ACCEL-X', name: 'Longitudinal Accelerometer', shortLabel: 'Drive Squat', value: `${longG}G`, unit: '', status: 'optimal', hardwareSupplier: 'Analog Devices IMU', specTolerance: '±1.10G Launch & Braking', ringLevel: 2, history: [0.32, 0.38, 0.45, 0.42, 0.40, 0.42] },
          { id: 'steering_angle', code: 'SAS-CAN', name: 'Pinion Steering Wheel Angle', shortLabel: 'Steering Angle', value: `${steerAngle}°`, unit: '', status: 'optimal', hardwareSupplier: 'ZF Servotronic M', specTolerance: '14.1:1 Variable Sport Ratio', ringLevel: 3, history: [8, 12, 14, 15, 14.5, 14.5] },
          { id: 'yaw_velocity', code: 'YAW-GYRO', name: 'Chassis Yaw Rotation Rate', shortLabel: 'Yaw Velocity', value: '12.8', unit: '°/s', status: 'optimal', hardwareSupplier: 'Bosch Inertial Sensor', specTolerance: '<45°/s Controlled Oversteer', ringLevel: 3, history: [9.5, 11.2, 12.5, 13.0, 12.8, 12.8] }
        ]
      },
      dampers: {
        id: 'dampers',
        angleIndex: 5, // 7:30
        title: 'Suspension & Damper Articulation',
        categoryLabel: 'Suspension',
        badgeAccent: '#8B5CF6',
        icon: Sliders,
        leadTelemetry: 'KW V4 3-Way • 50:50 Balance',
        engineeringMemo: 'Independent high and low speed compression valves with twin-tube stainless steel bodies. Corner-balanced for B-road frost heaves.',
        transducers: [
          { id: 'comp_fl', code: 'KW-FL-HS', name: 'Front Left High-Speed Compression', shortLabel: 'FL Comp Valve', value: '8 clicks', unit: '', status: 'optimal', hardwareSupplier: 'KW automotive GmbH', specTolerance: '16-Click Adjustable Sweep', ringLevel: 1, history: [8, 8, 8, 8, 8, 8] },
          { id: 'rebound_rr', code: 'KW-RR-RB', name: 'Rear Right Rebound Damping', shortLabel: 'RR Rebound', value: '11 clicks', unit: '', status: 'optimal', hardwareSupplier: 'KW automotive GmbH', specTolerance: '16-Click TVR-A Valve', ringLevel: 2, history: [11, 11, 11, 11, 11, 11] },
          { id: 'corner_weight', code: 'SCALE-CROSS', name: 'Static Cross-Weight Ratio', shortLabel: 'Corner Weight', value: '50.1%', unit: '', status: 'optimal', hardwareSupplier: 'Intercomp Scales', specTolerance: '50.0% ± 0.5% Target Window', ringLevel: 3, history: [50.1, 50.1, 50.1, 50.1, 50.1, 50.1] },
          { id: 'ride_height', code: 'RIDE-MM', name: 'Static Front Axle Ground Clearance', shortLabel: 'Ride Clearance', value: '114', unit: 'MM', status: 'optimal', hardwareSupplier: 'KW V4 Adjustable Perch', specTolerance: '105 - 130mm Road Legal', ringLevel: 3, history: [114, 114, 114, 114, 114, 114] }
        ]
      },
      aerodynamics: {
        id: 'aerodynamics',
        angleIndex: 6, // 9 o'clock
        title: 'Aerodynamic Flux & Ground Effect',
        categoryLabel: 'Aerodynamics',
        badgeAccent: '#3B82F6',
        icon: Wind,
        leadTelemetry: '125 kg Downforce @ 120 km/h',
        engineeringMemo: 'Chassis underside Venturi strakes and functional front air curtains channeling high-pressure laminar air away from rotating wheels.',
        transducers: [
          { id: 'splitter_load', code: 'AERO-FR', name: 'Front Splitter Aerodynamic Load', shortLabel: 'Splitter Load', value: '45', unit: 'KG', status: 'optimal', hardwareSupplier: 'M Performance Carbon', specTolerance: 'Linear v² Aerodynamic Curve', ringLevel: 1, history: [32, 38, 42, 45, 43, 45] },
          { id: 'diffuser_suction', code: 'AERO-VENT', name: 'Underbody Diffuser Suction', shortLabel: 'Diffuser Ground', value: '80', unit: 'KG', status: 'optimal', hardwareSupplier: 'Akrapovič Aerodynamics', specTolerance: 'Bernoulli Negative Pressure', ringLevel: 2, history: [58, 68, 75, 80, 78, 80] },
          { id: 'drag_coeff', code: 'AERO-CD', name: 'Total Drag Coefficient', shortLabel: 'Drag Coeff Cd', value: '0.33', unit: 'Cd', status: 'optimal', hardwareSupplier: 'BMW Aero Wind Tunnel', specTolerance: '0.31 - 0.35 Flap Configuration', ringLevel: 3, history: [0.33, 0.33, 0.33, 0.33, 0.33, 0.33] },
          { id: 'air_curtain', code: 'AERO-CURT', name: 'Wheelhouse Pressure Bleed', shortLabel: 'Air Curtains', value: 'OPTIMAL', unit: '', status: 'optimal', hardwareSupplier: 'Bumper Duct Intake', specTolerance: 'Boundary Layer Separation Free', ringLevel: 3, history: [1, 1, 1, 1, 1, 1] }
        ]
      },
      can_bus: {
        id: 'can_bus',
        angleIndex: 7, // 10:30
        title: 'CAN-Bus Electronic Infrastructure',
        categoryLabel: 'CAN Network',
        badgeAccent: '#EC4899',
        icon: Radio,
        leadTelemetry: '500 kbps • 0 Dropped Packets',
        engineeringMemo: 'ISO 11898-1 high-speed differential serial network logging 10Hz to 50Hz arbitration frames with synchronous CRC verification.',
        transducers: [
          { id: 'can_baud', code: 'CAN-BAUD', name: 'Differential Transmission Speed', shortLabel: 'Network Baud', value: '500', unit: 'KBPS', status: 'optimal', hardwareSupplier: 'Bosch CAN Transceiver', specTolerance: 'ISO 11898-2 High-Speed Spec', ringLevel: 1, history: [500, 500, 500, 500, 500, 500] },
          { id: 'frame_drop', code: 'CAN-CRC', name: 'Frame Integrity Error Counter', shortLabel: 'Packet Drops', value: '0', unit: 'DROPS', status: 'optimal', hardwareSupplier: 'DATUM Stream Decoder', specTolerance: '<0.001% Permissible Jitter', ringLevel: 2, history: [0, 0, 0, 0, 0, 0] },
          { id: 'alt_voltage', code: 'ELEC-V', name: 'Charging Alternator Potential', shortLabel: 'Bus Voltage', value: '14.2', unit: 'V', status: 'optimal', hardwareSupplier: 'Valeo 180A Alternator', specTolerance: '13.6V - 14.8V Regulated Float', ringLevel: 3, history: [14.1, 14.2, 14.2, 14.2, 14.1, 14.2] },
          { id: 'bus_latency', code: 'CAN-LAT', name: 'Serial Ingress Frame Latency', shortLabel: 'Frame Latency', value: '<2.1', unit: 'MS', status: 'optimal', hardwareSupplier: 'Silicon Labs Isolator', specTolerance: '<5.0 ms Critical Safety Window', ringLevel: 3, history: [2.0, 2.1, 2.0, 2.1, 2.0, 2.1] }
        ]
      }
    };
  }, [telemetry, gripResult]);

  const activeSector = sectors[selectedSector];
  const activeTransducer = useMemo(() => {
    return (
      activeSector.transducers.find((t) => t.id === activeTransducerId) ||
      activeSector.transducers[0]
    );
  }, [activeSector, activeTransducerId]);

  // Polar coordinate math for 8 sectors (45° segments)
  const cx = 300;
  const cy = 300;
  const rCore = 80;
  const rRing1 = 135;
  const rRing2 = 195;
  const rOuter = 260;

  // Sector wedge geometry
  const getSectorGeometry = (index: number) => {
    // Offset by -90° - 22.5° so sector 0 centers at 12 o'clock
    const startDeg = index * 45 - 90 - 22.5;
    const endDeg = startDeg + 45;
    const midDeg = (startDeg + endDeg) / 2;

    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const midRad = (midDeg * Math.PI) / 180;

    const x1 = cx + rOuter * Math.cos(startRad);
    const y1 = cy + rOuter * Math.sin(startRad);
    const x2 = cx + rOuter * Math.cos(endRad);
    const y2 = cy + rOuter * Math.sin(endRad);
    const x3 = cx + rCore * Math.cos(endRad);
    const y3 = cy + rCore * Math.sin(endRad);
    const x4 = cx + rCore * Math.cos(startRad);
    const y4 = cy + rCore * Math.sin(startRad);

    const pathD = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rCore} ${rCore} 0 0 0 ${x4} ${y4} Z`;

    // Coordinates for the 3 concentric transducer nodes
    const node1X = cx + rRing1 * Math.cos(midRad);
    const node1Y = cy + rRing1 * Math.sin(midRad);

    const node2OffsetRad = midRad - (11 * Math.PI) / 180;
    const node2X = cx + rRing2 * Math.cos(node2OffsetRad);
    const node2Y = cy + rRing2 * Math.sin(node2OffsetRad);

    const node3OffsetRad = midRad + (11 * Math.PI) / 180;
    const node3X = cx + rRing2 * Math.cos(node3OffsetRad);
    const node3Y = cy + rRing2 * Math.sin(node3OffsetRad);

    // Pill badge placement at outer rim
    const pillRadius = 282;
    const pillX = cx + pillRadius * Math.cos(midRad);
    const pillY = cy + pillRadius * Math.sin(midRad);

    return {
      pathD,
      midDeg,
      nodes: [
        { x: node1X, y: node1Y },
        { x: node2X, y: node2Y },
        { x: node3X, y: node3Y },
      ],
      pillX,
      pillY
    };
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xl ${
        isFullscreen ? 'fixed inset-4 z-[99] m-0 max-h-screen' : 'relative'
      }`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* ========================================================= */}
      {/* 1. EDITORIAL HEADER BAR                                   */}
      {/* ========================================================= */}
      <div
        className="flex flex-wrap items-center justify-between px-6 py-4 border-b gap-4"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md border"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#09090B',
              borderColor: 'var(--border-default)',
            }}
          >
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="font-luxury-display text-base sm:text-lg font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                Chassis Dynamics & Telemetry
              </h3>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold border"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                }}
              >
                10 HZ SYNCHRONOUS
              </span>
            </div>
            <p className="text-xs font-mono-numbers text-zinc-400">
              {carModel} • Real-Time Mechanical Diagnostics & Dynamics
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Radar Sweep Toggle */}
          <button
            onClick={() => setIsSweepActive(!isSweepActive)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono-numbers transition cursor-pointer"
            style={{
              backgroundColor: isSweepActive ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
              borderColor: isSweepActive ? 'var(--accent)' : 'var(--border-subtle)',
              color: isSweepActive ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            title={isSweepActive ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
          >
            {isSweepActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSweepActive ? 'Live Sweep' : 'Paused'}</span>
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border text-zinc-400 hover:text-white transition cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border-subtle)',
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN COCKPIT: RADIAL DIAL + SUBSYSTEM INSPECTOR       */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ───────────────────────────────────────────────────────── */}
        {/* LEFT: 8-SECTOR PRECISION RADIAL RADAR CANVAS (SVG)       */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center select-none relative">
          
          <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
            
            {/* SVG Precision Radar Engine */}
            <svg
              className="w-full h-full"
              viewBox="0 0 600 600"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Metallic Dial Subtle Texture */}
                <radialGradient id="dial-metallic-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.03)" />
                  <stop offset="65%" stopColor="rgba(0, 0, 0, 0.2)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0.7)" />
                </radialGradient>

                {/* Sweep Hand Gradient */}
                <linearGradient id="sweep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="85%" stopColor="rgba(234, 179, 8, 0.08)" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* 1. Outer Knurled Bezel Track with 120 Swiss Milled Ticks */}
              <circle
                cx={cx}
                cy={cy}
                r={rOuter + 8}
                fill="url(#dial-metallic-bg)"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.5"
              />

              {/* Chronometer Hairspring 360-Tick Ring */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isMajor = deg % 45 === 0;
                const isMedium = deg % 15 === 0;
                const rad = (deg * Math.PI) / 180;
                const tickLen = isMajor ? 8 : isMedium ? 5 : 3;
                const innerR = rOuter + 8 - tickLen;
                const xStart = cx + innerR * Math.cos(rad);
                const yStart = cy + innerR * Math.sin(rad);
                const xEnd = cx + (rOuter + 8) * Math.cos(rad);
                const yEnd = cy + (rOuter + 8) * Math.sin(rad);

                return (
                  <line
                    key={i}
                    x1={xStart}
                    y1={yStart}
                    x2={xEnd}
                    y2={yEnd}
                    stroke={isMajor ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={isMajor ? 2 : 1}
                  />
                );
              })}

              {/* 2. Concentric Range Rings (Core, Tier 1, Tier 2, Tier 3) */}
              <circle
                cx={cx}
                cy={cy}
                r={rRing1}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={cx}
                cy={cy}
                r={rRing2}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* 3. 8 Interactive Radial Wedges */}
              {(Object.keys(sectors) as DynamicsSectorId[]).map((secId) => {
                const sec = sectors[secId];
                const isSelected = selectedSector === secId;
                const geo = getSectorGeometry(sec.angleIndex);

                return (
                  <g
                    key={secId}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => {
                      setSelectedSector(secId);
                      setActiveTransducerId(sec.transducers[0].id);
                    }}
                  >
                    {/* Wedge Segment */}
                    <path
                      d={geo.pathD}
                      fill={isSelected ? sec.badgeAccent : 'rgba(255, 255, 255, 0.015)'}
                      fillOpacity={isSelected ? 0.22 : 0.4}
                      stroke={isSelected ? sec.badgeAccent : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-300 hover:fill-opacity-35"
                    />

                    {/* Radiating Spoke Boundary Line */}
                    <line
                      x1={cx + rCore * Math.cos(((sec.angleIndex * 45 - 90 - 22.5) * Math.PI) / 180)}
                      y1={cy + rCore * Math.sin(((sec.angleIndex * 45 - 90 - 22.5) * Math.PI) / 180)}
                      x2={cx + rOuter * Math.cos(((sec.angleIndex * 45 - 90 - 22.5) * Math.PI) / 180)}
                      y2={cy + rOuter * Math.sin(((sec.angleIndex * 45 - 90 - 22.5) * Math.PI) / 180)}
                      stroke="rgba(255, 255, 255, 0.18)"
                      strokeWidth="1"
                    />

                    {/* Transducer Micro-Nodes Plotted in Wedge (Concentric Tiers) */}
                    {sec.transducers.slice(0, 3).map((node, nodeIdx) => {
                      const pos = geo.nodes[nodeIdx];
                      const isNodeActive = activeTransducerId === node.id;

                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSector(secId);
                            setActiveTransducerId(node.id);
                          }}
                        >
                          {/* Node Halo Ring */}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isNodeActive ? 12 : 8}
                            fill={isNodeActive ? sec.badgeAccent : '#18181B'}
                            stroke={isNodeActive ? '#FFFFFF' : sec.badgeAccent}
                            strokeWidth={isNodeActive ? 2.5 : 1.5}
                            className="transition-all duration-200"
                          />

                          {/* Node Glyph or Value */}
                          <text
                            x={pos.x}
                            y={pos.y + 3}
                            textAnchor="middle"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                            fill={isNodeActive ? '#09090B' : '#FFFFFF'}
                            className="select-none pointer-events-none"
                          >
                            {nodeIdx + 1}
                          </text>

                          {/* Micro-Label Badge */}
                          {isSelected && (
                            <text
                              x={pos.x}
                              y={pos.y + 20}
                              textAnchor="middle"
                              fontSize="8"
                              fontFamily="monospace"
                              fill="rgba(255, 255, 255, 0.85)"
                              className="select-none pointer-events-none font-bold"
                            >
                              {node.shortLabel}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* 4. Dynamic Sweep Arm Scanner */}
              {isSweepActive && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + rOuter * Math.cos((sweepAngle * Math.PI) / 180)}
                  y2={cy + rOuter * Math.sin((sweepAngle * Math.PI) / 180)}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              )}

              {/* 5. Center Dial Core */}
              <circle
                cx={cx}
                cy={cy}
                r={rCore}
                fill="#09090B"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
              />

              {/* Central Chronometer Dial Telemetry Display */}
              <text
                x={cx}
                y={cy - 20}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                letterSpacing="0.2em"
                fill="rgba(255, 255, 255, 0.5)"
                className="select-none uppercase"
              >
                {carName} // TELEMETRY
              </text>
              <text
                x={cx}
                y={cy + 6}
                textAnchor="middle"
                fontSize="18"
                fontFamily="monospace"
                fontWeight="bold"
                fill={activeSector.badgeAccent}
                className="select-none"
              >
                {activeSector.leadTelemetry.split(' ')[0]} {activeSector.leadTelemetry.split(' ')[1]}
              </text>
              <text
                x={cx}
                y={cy + 24}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                letterSpacing="0.15em"
                fill="rgba(255, 255, 255, 0.8)"
                className="select-none uppercase font-bold"
              >
                {activeSector.categoryLabel}
              </text>
            </svg>

          </div>

          {/* Bottom Taxonomy Sector Badges Strip (Inspired by the Reference Image) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-xl">
            {(Object.keys(sectors) as DynamicsSectorId[]).map((secId) => {
              const sec = sectors[secId];
              const isSelected = selectedSector === secId;

              return (
                <button
                  key={secId}
                  onClick={() => {
                    setSelectedSector(secId);
                    setActiveTransducerId(sec.transducers[0].id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono-numbers font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'shadow-md scale-105'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? sec.badgeAccent : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#09090B' : 'var(--text-primary)',
                    borderColor: isSelected ? sec.badgeAccent : 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#09090B' : sec.badgeAccent }}
                  />
                  <span>{sec.categoryLabel}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* RIGHT: SUBSYSTEM SENSOR INSPECTOR & TELEMETRY TRACE       */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Sector Dossier Header */}
          <div
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: activeSector.badgeAccent,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-mono-numbers font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: activeSector.badgeAccent,
                }}
              >
                {activeSector.categoryLabel} Status
              </span>
              <span className="text-xs font-bold font-mono-numbers text-white">
                {activeSector.leadTelemetry}
              </span>
            </div>

            <h4
              className="text-lg sm:text-xl font-bold font-luxury-display uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {activeSector.title}
            </h4>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {activeSector.engineeringMemo}
            </p>
          </div>

          {/* Concentric Transducer Sub-App Buttons Grid (Matching Reference) */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono-numbers uppercase tracking-widest text-zinc-400 font-bold block">
              Key Telemetry & Sensors in {activeSector.categoryLabel}:
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {activeSector.transducers.map((t) => {
                const isActive = activeTransducerId === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTransducerId(t.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isActive ? 'border shadow-md' : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--bg-elevated)' : 'rgba(0,0,0,0.2)',
                      borderColor: isActive ? activeSector.badgeAccent : 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono-numbers text-zinc-400 uppercase">
                      <span>Tier {t.ringLevel} • {t.code}</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: activeSector.badgeAccent }}
                      />
                    </div>

                    <div className="text-xs font-bold font-mono-numbers text-white mt-1">
                      {t.name}
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span
                        className="text-base font-bold font-mono-numbers"
                        style={{ color: isActive ? activeSector.badgeAccent : '#FFFFFF' }}
                      >
                        {t.value}
                      </span>
                      {t.unit && (
                        <span className="text-[10px] font-mono-numbers text-zinc-400">
                          {t.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Transducer Deep Telemetry Scope & Waveform */}
          <div
            className="p-4 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between text-xs font-mono-numbers">
              <span className="text-zinc-400 uppercase tracking-widest text-[10px]">
                Live Telemetry Trace // {activeTransducer.name}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CALIBRATED</span>
              </span>
            </div>

            {/* Sparkline Waveform */}
            <div className="h-16 w-full flex items-end gap-1 pt-2 pb-1 px-1 rounded-xl bg-black/60 border border-white/10">
              {telemetryHistory.map((val, i) => {
                const heightPct = Math.max(15, Math.min(95, ((val - 60) / 40) * 100));
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-200"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor:
                        i === telemetryHistory.length - 1
                          ? activeSector.badgeAccent
                          : 'rgba(255, 255, 255, 0.25)',
                    }}
                  />
                );
              })}
            </div>

            {/* Hardware & Tolerance Specs */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-numbers text-zinc-300 pt-1">
              <div>
                <span className="text-zinc-500 block uppercase">Supplier Hardware</span>
                <strong className="text-white">{activeTransducer.hardwareSupplier}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase">Spec Tolerance Band</span>
                <strong className="text-white">{activeTransducer.specTolerance}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
