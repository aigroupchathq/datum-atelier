import { useState, useEffect, useRef, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { PlateBlurImage } from '../components/common/PlateBlurImage';
import { PassGripRadarModal } from '../components/telemetry/PassGripRadarModal';
import { useToast } from '../context/ToastContext';
import { 
  Compass, 
  ShieldCheck, 
  Download, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Gauge, 
  Activity, 
  Zap, 
  Mountain, 
  CornerDownRight,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Users,
  Calendar,
  MapPin,
  X,
  Sparkles
} from 'lucide-react';

interface RoutePoint {
  progress: number; // 0 to 1
  distanceMi: number;
  elevationFt: number;
  gradientPct: number;
  speedMph: number;
  gear: number;
  rpm: number;
  lateralG: number; // negative = left, positive = right
  throttlePct: number;
  brakePct: number;
  sectorName: string;
  notes: string;
  hazard?: string;
  xPct: number; // 0 to 100 on map
  yPct: number; // 0 to 100 on map
}

interface RoutePreset {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  distanceMiles: number;
  duration: string;
  peakElevationFt: number;
  surfaceCondition: string;
  weather: string;
  ambientPressure: string;
  fuelConsumed: string;
  avgMpg: number;
  tripCostGbp: number;
  ownerCar: string;
  custodianNotes: string;
  radioChannel: string;
  rendezvousPoint: string;
  photos: string[];
  telemetry: RoutePoint[];
}

const ROUTE_PRESETS: Record<string, RoutePreset> = {
  'snake-pass': {
    id: 'snake-pass',
    title: 'Snake Pass (A57) Dawn Shakedown',
    subtitle: 'Sheffield West to Glossop via High Peak Summit',
    region: 'Peak District National Park, Derbyshire',
    distanceMiles: 84.6,
    duration: '1h 38m',
    peakElevationFt: 1688,
    surfaceCondition: 'Damp Bitumen (12°C)',
    weather: 'Overcast & Low Cloud',
    ambientPressure: '1018 hPa',
    fuelConsumed: '18.4 L (Shell V-Power 99)',
    avgMpg: 22.8,
    tripCostGbp: 34.20,
    ownerCar: 'MAYA — BMW M3 Competition (G80)',
    custodianNotes: 'Left Sheffield outskirts at 05:45 AM before traffic built up. Damp tree cover through Rivelin Valley demanded smooth throttle modulation in MDM mode. As the road opened along Ladybower Reservoir, the S58 engine felt totally awake. Up the 8.5% incline toward the summit, the KW V4 coilovers kept the chassis flat without skipping over road ripples. Summit at 1,688 ft had stiff crosswinds. Brake discs reached 340°C on the descent into Glossop before cooling nicely.',
    radioChannel: 'PMR446 Ch 7 • CTCSS 12 (100.0 Hz)',
    rendezvousPoint: 'A57 Sheffield Outskirts Layby (800m Geofenced)',
    photos: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_driveway_wash.jpg'
    ],
    telemetry: [
      { progress: 0.0, distanceMi: 0.0, elevationFt: 420, gradientPct: 1.2, speedMph: 35, gear: 2, rpm: 2800, lateralG: 0.05, throttlePct: 30, brakePct: 0, sectorName: 'Start Geofence (Sheffield West)', notes: '800m privacy perimeter active. Gentle oil warm-up cruise.', xPct: 6, yPct: 82 },
      { progress: 0.08, distanceMi: 6.8, elevationFt: 540, gradientPct: 3.1, speedMph: 54, gear: 4, rpm: 3600, lateralG: 0.15, throttlePct: 65, brakePct: 0, sectorName: 'Rivelin Valley Incline', notes: 'Entering thick canopy. Damp bitumen patches on turn-in.', hazard: 'Tree canopy dampness & leaves', xPct: 15, yPct: 72 },
      { progress: 0.18, distanceMi: 15.2, elevationFt: 710, gradientPct: 4.8, speedMph: 66, gear: 4, rpm: 4400, lateralG: -0.38, throttlePct: 78, brakePct: 0, sectorName: 'Moscar Moor Ascent', notes: 'Moderate left sweeper. Michelin PS4S tyres keyed into the asphalt.', xPct: 26, yPct: 56 },
      { progress: 0.25, distanceMi: 21.4, elevationFt: 720, gradientPct: -3.2, speedMph: 31, gear: 2, rpm: 5600, lateralG: -0.92, throttlePct: 20, brakePct: 85, sectorName: 'Ladybower Reservoir Hairpin', notes: 'Heavy trail-braking zone. Downshift to 2nd gear. 0.92G left apex.', hazard: 'Tight 180° stone-wall hairpin', xPct: 36, yPct: 65 },
      { progress: 0.35, distanceMi: 29.6, elevationFt: 920, gradientPct: 6.2, speedMph: 60, gear: 3, rpm: 5400, lateralG: 0.48, throttlePct: 92, brakePct: 0, sectorName: 'Ashopton Viaduct Rise', notes: 'Full throttle exit. S58 twin-turbos on full boost.', xPct: 46, yPct: 50 },
      { progress: 0.46, distanceMi: 38.9, elevationFt: 1340, gradientPct: 8.2, speedMph: 55, gear: 3, rpm: 5200, lateralG: 0.72, throttlePct: 75, brakePct: 10, sectorName: 'Snake Pass South Curves', notes: 'Cambered right bend. High steering fidelity through M-differential.', xPct: 56, yPct: 36 },
      { progress: 0.57, distanceMi: 48.2, elevationFt: 1688, gradientPct: 0.4, speedMph: 79, gear: 5, rpm: 6100, lateralG: 0.08, throttlePct: 95, brakePct: 0, sectorName: 'High Peak Summit (1,688 ft)', notes: 'Summit crest reached! Panoramic views of Bleaklow Moor.', hazard: 'Exposed crosswinds & roaming sheep', xPct: 66, yPct: 22 },
      { progress: 0.68, distanceMi: 57.5, elevationFt: 1480, gradientPct: -6.8, speedMph: 45, gear: 2, rpm: 5700, lateralG: -0.94, throttlePct: 18, brakePct: 78, sectorName: 'Doctors Gate Hairpin 1', notes: 'Technical downhill switchback. Front axle bite is immense.', hazard: 'Steep downhill braking zone', xPct: 74, yPct: 40 },
      { progress: 0.78, distanceMi: 66.0, elevationFt: 1140, gradientPct: -7.5, speedMph: 52, gear: 3, rpm: 4900, lateralG: 0.86, throttlePct: 42, brakePct: 35, sectorName: 'Snake Forest S-Bends', notes: 'Fast left-right weight transfer. Damp tarmac under larch trees.', xPct: 82, yPct: 54 },
      { progress: 0.90, distanceMi: 76.1, elevationFt: 750, gradientPct: -4.0, speedMph: 58, gear: 4, rpm: 3800, lateralG: -0.22, throttlePct: 55, brakePct: 0, sectorName: 'Glossop Moor Descent', notes: 'Gradient flattening. Oil & rotor temp cooldown pass.', xPct: 90, yPct: 65 },
      { progress: 1.0, distanceMi: 84.6, elevationFt: 590, gradientPct: 0.2, speedMph: 30, gear: 2, rpm: 2200, lateralG: 0.02, throttlePct: 20, brakePct: 20, sectorName: 'Finish Geofence (Glossop West)', notes: 'Trip logged to Maya sovereign passport. 800m privacy active.', xPct: 96, yPct: 74 },
    ]
  },
  'llanberis-pass': {
    id: 'llanberis-pass',
    title: 'Llanberis Pass (A4086) Slate Valley',
    subtitle: 'Capel Curig to Llanberis via Pen-y-Pass Crest',
    region: 'Snowdonia / Eryri National Park, North Wales',
    distanceMiles: 46.2,
    duration: '58m',
    peakElevationFt: 1170,
    surfaceCondition: 'Coarse Grippy Asphalt (9°C)',
    weather: 'Misty Rain with Slate Spray',
    ambientPressure: '1012 hPa',
    fuelConsumed: '12.2 L (Super Unleaded)',
    avgMpg: 24.1,
    tripCostGbp: 22.80,
    ownerCar: 'KURO — Porsche 911 GT3 Touring (992)',
    custodianNotes: 'Raw acoustic theater. The naturally aspirated 4.0L flat-six bouncing its 9,000 RPM howl off the vertical slate rock faces of Llanberis Pass is an experience that cannot be replicated. PASM in sport mode, manual rev-matching down into 2nd gear for the Pen-y-Pass hairpin. Steering communication through the double-wishbone front axle gave total confidence despite wet road spray.',
    radioChannel: 'PMR446 Ch 3 • CTCSS 8 (88.5 Hz)',
    rendezvousPoint: 'Capel Curig Bridge Layby (A4086)',
    photos: [
      '/real_uk_gt3_suburb.jpg',
      '/real_uk_e30_terrace.jpg'
    ],
    telemetry: [
      { progress: 0.0, distanceMi: 0.0, elevationFt: 620, gradientPct: 1.0, speedMph: 40, gear: 3, rpm: 3400, lateralG: 0.05, throttlePct: 35, brakePct: 0, sectorName: 'Capel Curig Departure', notes: 'Heading west along Afon Llugwy. Wet road glaze.', xPct: 8, yPct: 78 },
      { progress: 0.22, distanceMi: 10.2, elevationFt: 840, gradientPct: 4.2, speedMph: 68, gear: 4, rpm: 5800, lateralG: 0.42, throttlePct: 80, brakePct: 0, sectorName: 'Pen-y-Gwryd Approach', notes: 'Ascending toward Snowdon massif. Slate cliffs on right flank.', xPct: 28, yPct: 62 },
      { progress: 0.45, distanceMi: 20.8, elevationFt: 1170, gradientPct: 6.8, speedMph: 34, gear: 2, rpm: 7200, lateralG: -0.98, throttlePct: 40, brakePct: 80, sectorName: 'Pen-y-Pass Crest Hairpin', notes: 'Apex at the base of Snowdon trail. GT3 Cup 2 tyres digging deep.', hazard: 'Tourist coaches & hikers crossing', xPct: 52, yPct: 30 },
      { progress: 0.65, distanceMi: 30.0, elevationFt: 780, gradientPct: -8.4, speedMph: 58, gear: 3, rpm: 6800, lateralG: 0.85, throttlePct: 50, brakePct: 45, sectorName: 'Slate Quarry Gorge S-Bends', notes: 'Vertical rock faces echo 9,000 RPM acoustic valvetrain note.', hazard: 'Fallen rock debris advisory', xPct: 70, yPct: 48 },
      { progress: 0.88, distanceMi: 40.6, elevationFt: 410, gradientPct: -3.5, speedMph: 50, gear: 4, rpm: 4200, lateralG: -0.15, throttlePct: 45, brakePct: 0, sectorName: 'Llyn Peris Lake Run', notes: 'Fast flowing lake perimeter road into Llanberis town.', xPct: 88, yPct: 66 },
      { progress: 1.0, distanceMi: 46.2, elevationFt: 380, gradientPct: 0.0, speedMph: 28, gear: 2, rpm: 2100, lateralG: 0.01, throttlePct: 15, brakePct: 15, sectorName: 'Llanberis Terminal Enclave', notes: 'Expedition completed. Flat-six cooling tick recorded.', xPct: 95, yPct: 72 },
    ]
  },
  'cotswolds-b4425': {
    id: 'cotswolds-b4425',
    title: 'Cotswolds Roman Way (B4425 & Fosse)',
    subtitle: 'Burford to Bibury & Cirencester Rural Run',
    region: 'Gloucestershire / Cotswolds AONB',
    distanceMiles: 52.4,
    duration: '1h 12m',
    peakElevationFt: 620,
    surfaceCondition: 'Dry Roman Macadam (18°C)',
    weather: 'Clear Autumn Sun & Golden Light',
    ambientPressure: '1022 hPa',
    fuelConsumed: '11.8 L (99 RON)',
    avgMpg: 27.4,
    tripCostGbp: 21.60,
    ownerCar: 'RETRO MOD — BMW 318is Slicktop (E30)',
    custodianNotes: 'The quintessential British countryside dawn drive. Rolling Cotswolds limestone hills, ancient Roman alignments, and crisp morning air entering the M42 twin-cam intake. The non-assisted mechanical steering communicates every stone and camber shift directly into the hands. Zero turbo lag, purely linear throttle cable response.',
    radioChannel: 'PMR446 Ch 5 • CTCSS 16 (114.8 Hz)',
    rendezvousPoint: 'Burford Hill High Street (06:15 AM)',
    photos: [
      '/real_uk_m3_cottage.jpg',
      '/real_uk_defender_farm.jpg'
    ],
    telemetry: [
      { progress: 0.0, distanceMi: 0.0, elevationFt: 380, gradientPct: 0.5, speedMph: 30, gear: 2, rpm: 2500, lateralG: 0.02, throttlePct: 25, brakePct: 0, sectorName: 'Burford Hill Departure', notes: 'Coasting down through limestone houses. Oil temp 75°C.', xPct: 10, yPct: 75 },
      { progress: 0.25, distanceMi: 13.1, elevationFt: 540, gradientPct: 3.2, speedMph: 62, gear: 4, rpm: 4800, lateralG: 0.35, throttlePct: 75, brakePct: 0, sectorName: 'Aldsworth High Plain', notes: 'Open undulating fields. Mechanical rasp at 5,000 RPM.', xPct: 32, yPct: 58 },
      { progress: 0.50, distanceMi: 26.2, elevationFt: 410, gradientPct: -2.8, speedMph: 38, gear: 2, rpm: 5200, lateralG: -0.78, throttlePct: 30, brakePct: 60, sectorName: 'Bibury Stone Bridge Chicanes', notes: 'S-bends over River Coln. E30 Bilstein B12 dampers in harmony.', hazard: 'Narrow single-track stone bridge', xPct: 55, yPct: 62 },
      { progress: 0.75, distanceMi: 39.3, elevationFt: 620, gradientPct: 2.1, speedMph: 72, gear: 5, rpm: 5600, lateralG: 0.12, throttlePct: 88, brakePct: 0, sectorName: 'Fosse Way Roman Straight', notes: 'Ancient Roman road. Perfectly straight sightlines.', xPct: 78, yPct: 42 },
      { progress: 1.0, distanceMi: 52.4, elevationFt: 460, gradientPct: 0.0, speedMph: 32, gear: 3, rpm: 2800, lateralG: 0.04, throttlePct: 20, brakePct: 15, sectorName: 'Classic Motor Hub Rendezvous', notes: 'Arrival at historic WWII airbase atelier for coffee.', xPct: 94, yPct: 55 },
    ]
  }
};

export const DriveDetailPage: FC = () => {
  const { showToast } = useToast();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('snake-pass');
  const activeRoute = ROUTE_PRESETS[selectedRouteId];

  const [progress, setProgress] = useState<number>(0.57); // Start at peak summit
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Convoy registration modal state
  const [isConvoyModalOpen, setIsConvoyModalOpen] = useState<boolean>(false);
  const [convoyVehicle, setConvoyVehicle] = useState<string>('MAYA — BMW M3 Competition (G80)');
  const [radioChecked, setRadioChecked] = useState<boolean>(true);
  const [tyresChecked, setTyresChecked] = useState<boolean>(true);
  const [fuelChecked, setFuelChecked] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isRadarOpen, setIsRadarOpen] = useState<boolean>(false);

  // When switching route, reset progress to midpoint
  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    setProgress(0.5);
    setIsPlaying(false);
  };

  // Interpolate telemetry at current progress (0 to 1)
  const currentTelemetry = useMemo(() => {
    const profile = activeRoute.telemetry;
    if (progress <= 0) return profile[0];
    if (progress >= 1) return profile[profile.length - 1];

    let idx = 0;
    while (idx < profile.length - 1 && profile[idx + 1].progress < progress) {
      idx++;
    }
    const p1 = profile[idx];
    const p2 = profile[idx + 1];
    const segmentT = (progress - p1.progress) / (p2.progress - p1.progress);

    return {
      progress,
      distanceMi: Number((p1.distanceMi + segmentT * (p2.distanceMi - p1.distanceMi)).toFixed(1)),
      elevationFt: Math.round(p1.elevationFt + segmentT * (p2.elevationFt - p1.elevationFt)),
      gradientPct: Number((p1.gradientPct + segmentT * (p2.gradientPct - p1.gradientPct)).toFixed(1)),
      speedMph: Math.round(p1.speedMph + segmentT * (p2.speedMph - p1.speedMph)),
      gear: segmentT > 0.6 ? p2.gear : p1.gear,
      rpm: Math.round(p1.rpm + segmentT * (p2.rpm - p1.rpm)),
      lateralG: Number((p1.lateralG + segmentT * (p2.lateralG - p1.lateralG)).toFixed(2)),
      throttlePct: Math.round(p1.throttlePct + segmentT * (p2.throttlePct - p1.throttlePct)),
      brakePct: Math.round(p1.brakePct + segmentT * (p2.brakePct - p1.brakePct)),
      sectorName: segmentT > 0.5 ? p2.sectorName : p1.sectorName,
      notes: segmentT > 0.5 ? p2.notes : p1.notes,
      hazard: segmentT > 0.5 ? p2.hazard : p1.hazard,
      xPct: p1.xPct + segmentT * (p2.xPct - p1.xPct),
      yPct: p1.yPct + segmentT * (p2.yPct - p1.yPct),
    };
  }, [progress, activeRoute]);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.005 * playbackSpeed;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Canvas map drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 700;
    const height = 300;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Muted dark canvas background
    ctx.fillStyle = '#08090C';
    ctx.fillRect(0, 0, width, height);

    // Topographical contour lines
    ctx.strokeStyle = '#151720';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(width * 0.55, height * 0.35, 70 + i * 45, 40 + i * 25, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.strokeStyle = '#12141A';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const profile = activeRoute.telemetry;

    // Full Route Polyline (unvisited in dark zinc)
    ctx.beginPath();
    profile.forEach((pt, i) => {
      const px = (pt.xPct / 100) * width;
      const py = (pt.yPct / 100) * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Driven Section Polyline (illuminated emerald)
    ctx.beginPath();
    let started = false;
    profile.forEach((pt) => {
      if (pt.progress <= currentTelemetry.progress) {
        const px = (pt.xPct / 100) * width;
        const py = (pt.yPct / 100) * height;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    });

    const curX = (currentTelemetry.xPct / 100) * width;
    const curY = (currentTelemetry.yPct / 100) * height;
    if (started) {
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Start 800m Geofence
    const startPt = profile[0];
    const endPt = profile[profile.length - 1];

    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc((startPt.xPct / 100) * width, (startPt.yPct / 100) * height, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Finish 800m Geofence
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc((endPt.xPct / 100) * width, (endPt.yPct / 100) * height, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Waypoints markers
    profile.forEach((wp) => {
      const wx = (wp.xPct / 100) * width;
      const wy = (wp.yPct / 100) * height;
      ctx.fillStyle = wp.hazard ? '#f59e0b' : '#52525b';
      ctx.beginPath();
      ctx.arc(wx, wy, wp.hazard ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Active Vehicle Puck (Glowing Beacon)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#10B981';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(curX, curY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [currentTelemetry, activeRoute]);

  const handleConfirmConvoy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      setIsConvoyModalOpen(false);
      showToast({
        title: 'Convoy Roster Synchronized',
        message: `${convoyVehicle} checked into ${activeRoute.title}. Radio locked to ${activeRoute.radioChannel}.`,
        type: 'drive'
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Return Navigation & Route Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/car/car-maya-m3"
          className="inline-flex items-center gap-2 text-xs font-mono-numbers text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 shrink-0 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sovereign Atelier</span>
        </Link>

        {/* Multi-Route Expedition Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-zinc-950 border border-zinc-800/80 rounded-2xl text-xs font-mono-numbers">
          <span className="text-zinc-500 uppercase px-2 text-[10px] hidden md:inline">Expeditions:</span>
          {Object.values(ROUTE_PRESETS).map((r) => (
            <button
              key={r.id}
              onClick={() => handleRouteChange(r.id)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs font-semibold ${
                selectedRouteId === r.id
                  ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {r.id === 'snake-pass' ? 'Snake Pass (A57)' : r.id === 'llanberis-pass' ? 'Llanberis Pass (A4086)' : 'Cotswolds Roman Way'}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* DRIVE HERO & SYNCHRONIZED TELEMETRY COCKPIT               */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-[#0B0C10] border border-amber-500/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        
        {/* Title & Privacy Badge Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SOVEREIGN B-ROAD EXPEDITION</span>
              </span>
              <span className="text-xs font-mono-numbers text-zinc-600">•</span>
              <span className="text-xs font-mono-numbers text-zinc-400">
                {activeRoute.weather} • {activeRoute.ambientPressure} • {activeRoute.surfaceCondition}
              </span>
            </div>
            
            <h1 className="font-luxury-display text-2xl sm:text-4xl font-black tracking-wide text-white uppercase">
              {activeRoute.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-300 font-mono-numbers">
              {activeRoute.subtitle} • {activeRoute.region}
            </p>
          </div>

          {/* Action CTAs: Join Convoy & Privacy Shield */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setIsConvoyModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-mono-numbers uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join Convoy Roster</span>
            </button>

            <button
              onClick={() => setIsRadarOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-zinc-900/90 border border-white/[0.1] hover:border-amber-400/40 text-zinc-200 hover:text-white font-mono-numbers text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Surface Grip Radar</span>
            </button>

            <div className="p-2.5 rounded-2xl bg-black/70 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[10px] font-mono-numbers">
                <span className="text-white font-bold block">800m Geofenced</span>
                <span className="text-zinc-500">Residential endpoints cloaked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LIVE SYNCHRONIZED TELEMETRY HUD GAUGE CLUSTER            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          
          {/* Speedometer */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Velocity</span>
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-white tracking-tight">
                {currentTelemetry.speedMph}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">MPH</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTelemetry.speedMph / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gear & RPM */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Gear & Revs</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-amber-400">
                G{currentTelemetry.gear}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-400">
                {currentTelemetry.rpm} <span className="text-zinc-600 text-[10px]">RPM</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTelemetry.rpm / 7200) * 100)}%` }}
              />
            </div>
          </div>

          {/* Lateral G-Force */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Lateral Load</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="my-2">
              <span className={`text-3xl sm:text-4xl font-black font-mono-numbers tracking-tight ${
                Math.abs(currentTelemetry.lateralG) > 0.8 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {Math.abs(currentTelemetry.lateralG)}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">
                {currentTelemetry.lateralG < 0 ? 'G (L)' : 'G (R)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono-numbers text-zinc-500">
              <span>Peak: 0.98G</span>
              <span className="text-emerald-400">Nominal</span>
            </div>
          </div>

          {/* Altitude */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Altitude</span>
              <Mountain className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-white tracking-tight">
                {currentTelemetry.elevationFt}
              </span>
              <span className="text-xs font-mono-numbers text-zinc-500 ml-1">FT</span>
            </div>
            <div className="text-[11px] font-mono-numbers text-purple-300">
              {currentTelemetry.gradientPct > 0 ? `+${currentTelemetry.gradientPct}% Incline` : `${currentTelemetry.gradientPct}% Descent`}
            </div>
          </div>

          {/* Throttle & Brake Bar */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Pedal Inputs</span>
              <span className="text-zinc-600">THR / BRK</span>
            </div>
            <div className="my-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-numbers">
                <span className="text-emerald-400">THR {currentTelemetry.throttlePct}%</span>
                <span className="text-red-400">BRK {currentTelemetry.brakePct}%</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${currentTelemetry.throttlePct}%` }} />
                </div>
                <div className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${currentTelemetry.brakePct}%` }} />
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono-numbers text-zinc-500">
              MDM Active
            </div>
          </div>

          {/* Efficiency & Fuel */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono-numbers uppercase">
              <span>Efficiency</span>
              <span className="text-emerald-400 font-bold">{activeRoute.avgMpg} MPG</span>
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-emerald-400 tracking-tight">
                £{activeRoute.tripCostGbp.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] font-mono-numbers text-zinc-500 truncate">
              {activeRoute.fuelConsumed}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SYNCHRONIZED ROUTE MAP CANVAS                             */}
        {/* ========================================================= */}
        <div className="relative w-full h-[320px] rounded-3xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          {/* Waypoint Tag & Hazard Callout */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 max-w-sm pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md text-xs font-mono-numbers text-white flex items-center gap-2 shadow-lg">
              <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{currentTelemetry.sectorName}</span>
            </div>
            
            {currentTelemetry.hazard && (
              <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono-numbers text-[10px] border border-amber-500/40 flex items-center gap-1.5 shadow">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ADVISORY: {currentTelemetry.hazard}</span>
              </div>
            )}

            <div className="px-3 py-1 rounded-lg bg-black/80 text-[11px] text-zinc-300 font-sans backdrop-blur-sm border border-white/5">
              "{currentTelemetry.notes}"
            </div>
          </div>

          {/* Action Button: Export Route */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => showToast({
                title: 'Cryptographic GPX Polyline Exported',
                message: `${activeRoute.title} (${activeRoute.distanceMiles} mi) • 800m privacy coordinates locked.`,
                type: 'drive'
              })}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 text-xs font-mono-numbers text-white transition flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Safe GPX</span>
            </button>
          </div>

          {/* Map Footer Information */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/85 border border-white/10 text-[11px] font-mono-numbers text-zinc-400 flex items-center gap-3 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Sync Active</span>
            </div>
            <span>•</span>
            <span>Mile {currentTelemetry.distanceMi} of {activeRoute.distanceMiles} mi</span>
            <span>•</span>
            <span className="text-zinc-500">Radio: {activeRoute.radioChannel}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SYNCHRONIZED ELEVATION PROFILE CHART                      */}
        {/* ========================================================= */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-numbers">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Mountain className="w-4 h-4 text-purple-400" />
              <span>Route Topography (Summit Crest: {activeRoute.peakElevationFt} ft)</span>
            </div>
            <div className="text-zinc-400">
              Current Altitude: <strong className="text-white font-bold">{currentTelemetry.elevationFt} ft</strong>
            </div>
          </div>

          {/* Visual Elevation Profile SVG */}
          <div className="relative h-28 w-full bg-black/60 rounded-xl overflow-hidden border border-zinc-800/80">
            <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon
                points="0,120 0,90 120,80 250,60 380,75 570,15 720,50 860,85 1000,95 1000,120"
                fill="url(#elevationGrad)"
              />
              <polyline
                points="0,90 120,80 250,60 380,75 570,15 720,50 860,85 1000,95"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Peak Marker */}
              <line x1="570" y1="0" x2="570" y2="120" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Synchronized Vertical Laser Tracking Cursor */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_10px_#10B981] pointer-events-none transition-all duration-75"
              style={{ left: `${progress * 100}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400 -translate-x-[5px] -translate-y-1 shadow-md" />
            </div>

            {/* Summit Label */}
            <div className="absolute top-2 left-[57%] -translate-x-1/2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono-numbers font-bold border border-amber-500/30">
              Peak Summit ({activeRoute.peakElevationFt} ft)
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE ROUTE & TIMELINE SCRUBBER CONTROLLER          */}
        {/* ========================================================= */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono-numbers">
            <span className="font-bold text-zinc-300">Synchronized Drive Scrubber</span>
            <span className="text-emerald-400 font-bold">
              Progress: {Math.round(progress * 100)}% ({currentTelemetry.distanceMi} mi)
            </span>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
          </div>

          {/* Playback Controls & Waypoint Jump Chips */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs font-mono-numbers flex items-center gap-2 hover:bg-zinc-200 transition shadow"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Play Drive Sim'}</span>
              </button>

              <button
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                title="Reset to Start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono-numbers">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      playbackSpeed === spd
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Waypoint Jumps */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono-numbers text-zinc-400">
              <span className="text-zinc-500 uppercase mr-1">Waypoints:</span>
              <button
                onClick={() => setProgress(0.0)}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
              >
                Start
              </button>
              <button
                onClick={() => setProgress(0.25)}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
              >
                Hairpin
              </button>
              <button
                onClick={() => setProgress(0.57)}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-800"
              >
                Peak
              </button>
              <button
                onClick={() => setProgress(1.0)}
                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
              >
                Finish
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* WAYPOINT & HAZARD INSPECTION TABLE                        */}
        {/* ========================================================= */}
        <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-luxury-display uppercase tracking-wider">
                Sector Telemetry & Hazard Ledger
              </h3>
            </div>
            <span className="text-[10px] font-mono-numbers text-zinc-400">
              {activeRoute.telemetry.length} VERIFIED SECTORS
            </span>
          </div>

          <div className="space-y-2 overflow-x-auto">
            {activeRoute.telemetry.map((pt, idx) => (
              <div
                key={idx}
                onClick={() => setProgress(pt.progress)}
                className={`p-3 rounded-xl border text-xs font-mono-numbers transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  Math.abs(progress - pt.progress) < 0.05
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-zinc-500 font-bold">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white block sm:inline mr-2">
                      {pt.sectorName}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans">
                      {pt.notes}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-[11px]">
                  {pt.hazard && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>{pt.hazard}</span>
                    </span>
                  )}
                  <span>{pt.distanceMi} mi</span>
                  <span className="text-purple-300">{pt.elevationFt} ft</span>
                  <span className="text-emerald-400">{pt.speedMph} mph</span>
                  <span className="text-zinc-500">G{pt.gear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PILOT REFLECTION & FIELD NOTES                            */}
        {/* ========================================================= */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono-numbers uppercase text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Pilot Reflection & Mechanical Notes ({activeRoute.ownerCar})</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-sans">
            "{activeRoute.custodianNotes}"
          </p>
        </div>

        {/* Route Photography Gallery with automatic plate blur */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase font-mono-numbers tracking-wider text-zinc-400">
            Expedition Captures & Waypoint Scenery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeRoute.photos.map((photo, i) => (
              <PlateBlurImage key={i} src={photo} alt="Drive photo" aspectRatio="aspect-[16/10]" />
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE CONVOY REGISTRATION MODAL                     */}
      {/* ========================================================= */}
      {isConvoyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0C0E] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-luxury-display uppercase tracking-wider">
                    Convoy Roster Check-In
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    {activeRoute.title}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsConvoyModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmConvoy} className="space-y-4 text-xs font-mono-numbers">
              
              {/* Departure Telemetry */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>NEXT SHAKEDOWN</span>
                  </span>
                  <span className="font-bold text-white">Sunday 06:00 AM Departure</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PMR RADIO CHANNEL</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{activeRoute.radioChannel}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RENDEZVOUS POINT</span>
                  </span>
                  <span className="text-zinc-400">{activeRoute.rendezvousPoint}</span>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">PARTICIPATING GARAGE VEHICLE</label>
                <select
                  value={convoyVehicle}
                  onChange={(e) => setConvoyVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-400"
                >
                  <option value="MAYA — BMW M3 Competition (G80)">MAYA — BMW M3 Competition (G80)</option>
                  <option value="KURO — Porsche 911 GT3 Touring (992)">KURO — Porsche 911 GT3 Touring (992)</option>
                  <option value="RETRO MOD — 1989 BMW 318is (E30)">RETRO MOD — 1989 BMW 318is (E30)</option>
                  <option value="EXPEDITION — Defender 110 P400 SE">EXPEDITION — Defender 110 P400 SE</option>
                </select>
              </div>

              {/* Pre-Flight Checklist */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] text-zinc-400 block">PRE-CONVOY TECHNICAL PROTOCOL</label>
                
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={tyresChecked}
                    onChange={(e) => setTyresChecked(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0"
                  />
                  <span>Cold tyre pressures calibrated within ±0.5 PSI</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={fuelChecked}
                    onChange={(e) => setFuelChecked(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0"
                  />
                  <span>Tank filled with 99 RON high-octane fuel (Shell V-Power or Tesco Momentum)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={radioChecked}
                    onChange={(e) => setRadioChecked(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0"
                  />
                  <span>Two-way PMR446 handset tested on assigned tone</span>
                </label>
              </div>

              {/* Privacy Perimeter */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Sovereign 800m privacy geofence will cloak your departure from home until you join the collective rendezvous point.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConvoyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering || !tyresChecked || !fuelChecked || !radioChecked}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold uppercase tracking-wider transition disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                >
                  {isRegistering ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Roster Entry</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Live Mountain Pass Surface Grip & Micro-Climate Radar */}
      <PassGripRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        initialPassId={
          activeRoute.id === 'drive-184' 
            ? 'snake-pass-a57' 
            : activeRoute.id === 'route-llanberis' 
              ? 'llanberis-pass-a4086' 
              : 'cheddar-gorge-b3135'
        }
      />

    </div>
  );
};
