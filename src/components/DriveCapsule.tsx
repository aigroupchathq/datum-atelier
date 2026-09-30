import { useEffect, useRef } from 'react';
import { Compass, ShieldCheck, MapPin, Download } from 'lucide-react';
import type { DriveCapsule as DriveType } from '../types/datum';

const mockDrive: DriveType = {
  id: 'drive-184',
  number: 184,
  title: 'A4067 Black Mountain Pass Dawn Patrol',
  date: 'Sunday, 06:14 AM',
  location: 'Brecon Beacons National Park, Wales',
  ambientTempC: 11,
  distanceMiles: 126.4,
  durationFormatted: '2h 14m',
  efficiencyMpg: 38.4,
  fuelCostGbp: 19.40,
  elevationGainFt: 1420,
  privacyZoneFuzzedRadiusM: 850,
  roadDesignation: 'A4067',
  narrative: `Testing the newly installed KW V4 suspension over the mid-corner undulations around Llangadog. The compression damping at 6 clicks finally eliminated the high-speed pogo bounce the stock G80 dampers suffered from. Rear tyres handled the damp hairpins with zero drama.`,
};

export const DriveCapsule: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 600;
    const height = 240;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Background
    ctx.fillStyle = '#0c0c0e';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1a1a20';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
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

    // Polyline
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(40, height - 40);
    ctx.bezierCurveTo(width * 0.25, 40, width * 0.45, height - 30, width * 0.65, 60);
    ctx.bezierCurveTo(width * 0.75, 120, width * 0.85, 40, width - 40, 70);
    ctx.stroke();

    // Privacy Geofence Circle around Start
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(40, height - 40, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Waypoints
    const waypoints = [
      { x: width * 0.42, y: height * 0.5 },
      { x: width * 0.65, y: 60 },
      { x: width * 0.82, y: 70 },
    ];
    waypoints.forEach((pt) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
      
      {/* Title & Privacy Geofence Strip */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-mono-nums font-bold">
              DRIVE #{mockDrive.number}
            </span>
            <span className="text-xs text-zinc-400 font-mono-nums">
              {mockDrive.date} • {mockDrive.location}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1.5">{mockDrive.title}</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Cool {mockDrive.ambientTempC}°C morning air • Road: {mockDrive.roadDesignation} • Zero commuter congestion
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center gap-2.5 text-xs text-purple-300">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <div className="font-bold">Start/End Geofence Clipped</div>
            <div className="text-[10px] text-purple-400">
              Home terminus within {mockDrive.privacyZoneFuzzedRadiusM}m removed from polyline.
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Distance</div>
          <div className="text-lg font-bold font-mono-nums text-white mt-0.5">
            {mockDrive.distanceMiles} <span className="text-xs text-zinc-400 font-normal">mi</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Moving Time</div>
          <div className="text-lg font-bold font-mono-nums text-white mt-0.5">{mockDrive.durationFormatted}</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Efficiency</div>
          <div className="text-lg font-bold font-mono-nums text-emerald-400 mt-0.5">
            {mockDrive.efficiencyMpg} <span className="text-xs text-zinc-400 font-normal">MPG</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-[10px] font-mono-nums uppercase text-zinc-400">True Fuel Cost</div>
          <div className="text-lg font-bold font-mono-nums text-cyan-400 mt-0.5">£{mockDrive.fuelCostGbp.toFixed(2)}</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-[10px] font-mono-nums uppercase text-zinc-400">Elevation Gain</div>
          <div className="text-lg font-bold font-mono-nums text-amber-400 mt-0.5">
            +{mockDrive.elevationGainFt} <span className="text-xs text-zinc-400 font-normal">ft</span>
          </div>
        </div>
      </div>

      {/* Map Canvas Simulation */}
      <div className="relative w-full h-64 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute bottom-3 left-3 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-[11px] font-mono-nums text-zinc-300 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>Snapped to {mockDrive.roadDesignation} • 3 Photo Waypoints</span>
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={() => alert('Route GPX downloaded without private home endpoints.')}
            className="px-2.5 py-1.5 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-nums text-zinc-200 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Save Route to My Car</span>
          </button>
        </div>
      </div>

      {/* Owner Narrative & Reflections */}
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-orange-400" />
          <h4 className="text-xs font-bold uppercase font-mono-nums text-zinc-400">
            Custodian Journey Reflection
          </h4>
        </div>
        <p className="text-sm text-zinc-200 leading-relaxed font-sans">
          "{mockDrive.narrative}"
        </p>
      </div>

    </div>
  );
};
