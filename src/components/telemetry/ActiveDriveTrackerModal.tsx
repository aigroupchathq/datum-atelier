import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  X,
  Compass,
  Play,
  Square,
  Camera,
  AlertTriangle,
  Mountain,
  ChevronRight,
  Send
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { calculateDriveCadence, type DriveCadenceResult } from '../../utils/respectRatingEngine';
import { fetchPassLiveWeather, type PassLiveWeatherData } from '../../utils/openMeteoWeather';
import { calculateRoadGrip } from '../../utils/gripCalculation';

interface ActiveDriveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDrive: (driveData: {
    title: string;
    caption: string;
    passName: string;
    durationMinutes: number;
    cadenceResult: DriveCadenceResult;
    waypoints: { id: string; title: string; time: string; altitudeM: number; imageUrl: string }[];
    carId: string;
    carName: string;
    carModel: string;
    frictionMu: number;
  }) => void;
}

const PASS_OPTIONS = [
  { id: 'snake-pass-a57', name: 'A57 Snake Pass', summitElevation: 512, county: 'Derbyshire / High Peak' },
  { id: 'kirkstone-pass-a592', name: 'Kirkstone Pass', summitElevation: 454, county: 'Cumbria / Lake District' },
  { id: 'hardknott-pass', name: 'Hardknott Pass', summitElevation: 393, county: 'Cumbria (33% Incline)' },
  { id: 'cat-and-fiddle-a537', name: 'Cat and Fiddle (A537)', summitElevation: 515, county: 'Peak District National Park' }
];

const TRACKER_CARS = [
  { id: 'car-maya-m3', name: 'MAYA', model: 'BMW M3 Competition (G80)', year: 2023 },
  { id: 'car-kuro-gt3', name: 'KURO', model: 'Porsche 911 GT3 Touring (992)', year: 2023 },
  { id: 'car-retro-e30', name: 'RETRO MOD', model: 'BMW 318is Slicktop (E30)', year: 1991 },
  { id: 'car-expedition-110', name: 'EXPEDITION', model: 'Defender 110 P400 SE', year: 2022 }
];

const SAMPLE_WAYPOINT_PHOTOS = [
  { label: 'Snake Pass High Peak Turnout', url: '/real_uk_m3_cottage.jpg', altM: 512 },
  { label: 'Kirkstone Inn Scenic Layby', url: '/real_uk_gt3_suburb.jpg', altM: 454 },
  { label: 'Hardknott Roman Fort Vista', url: '/real_uk_defender_farm.jpg', altM: 393 },
  { label: 'Cat & Fiddle Moorland Crest', url: '/real_uk_driveway_wash.jpg', altM: 515 }
];

export const ActiveDriveTrackerModal: FC<ActiveDriveTrackerModalProps> = ({
  isOpen,
  onClose,
  onCompleteDrive
}) => {
  const { isWhiteYellow } = useTheme();
  const { showToast } = useToast();

  const [sessionState, setSessionState] = useState<'idle' | 'tracking' | 'summary'>('idle');
  const [selectedPassId, setSelectedPassId] = useState<string>('snake-pass-a57');
  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
  const [liveWeather, setLiveWeather] = useState<PassLiveWeatherData | null>(null);

  // In-session metrics
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [waypoints, setWaypoints] = useState<{ id: string; title: string; time: string; altitudeM: number; imageUrl: string }[]>([]);
  const [hazardReported, setHazardReported] = useState<boolean>(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);

  // Result summary
  const [cadenceResult, setCadenceResult] = useState<DriveCadenceResult | null>(null);

  // Fetch live pass weather on pass change
  useEffect(() => {
    let active = true;
    fetchPassLiveWeather(selectedPassId).then((data) => {
      if (active) setLiveWeather(data);
    });
    return () => {
      active = false;
    };
  }, [selectedPassId]);

  // Session timer ticker
  useEffect(() => {
    let timer: any = null;
    if (sessionState === 'tracking') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionState]);

  if (!isOpen) return null;

  const currentCar = TRACKER_CARS[selectedCarIndex];
  const currentPass = PASS_OPTIONS.find((p) => p.id === selectedPassId) || PASS_OPTIONS[0];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartDrive = () => {
    setSessionState('tracking');
    setElapsedSeconds(0);
    setWaypoints([]);
    setHazardReported(false);
    showToast({
      title: 'Drive Cadence Tracker Engaged',
      message: `${currentPass.name} telemetry active. Flow and road awareness rewarded.`,
      type: 'drive',
      badge: 'EXPEDITION_ACTIVE'
    });
  };

  const handleLogWaypoint = (photoPresetIndex = 0) => {
    const preset = SAMPLE_WAYPOINT_PHOTOS[photoPresetIndex] || SAMPLE_WAYPOINT_PHOTOS[0];
    const newWp = {
      id: `wp-${Date.now()}`,
      title: `${currentPass.name} Waypoint (${preset.altM}m)`,
      time: formatTimer(elapsedSeconds),
      altitudeM: preset.altM,
      imageUrl: preset.url
    };
    setWaypoints((prev) => [...prev, newWp]);
    setIsPhotoPickerOpen(false);

    showToast({
      title: 'Mid-Way Waypoint Notarized',
      message: `Scenic pause logged (+25 Cadence Pts, +5 Respects).`,
      type: 'success',
      badge: '+5 RESPECTS'
    });
  };

  const handleToggleHazard = () => {
    const nextVal = !hazardReported;
    setHazardReported(nextVal);
    if (nextVal) {
      showToast({
        title: 'Road Surface Hazard Broadcast',
        message: 'Community alert dispatched. You earned +2 Alert Respects.',
        type: 'privacy',
        badge: '+2 RESPECTS'
      });
    }
  };

  // Calculate live road grip from weather
  const liveRoadGrip = liveWeather ? calculateRoadGrip({
    surfaceTempC: liveWeather.surfaceTempC,
    airTempC: liveWeather.airTempC,
    rainMmPerHour: liveWeather.rainMmPerHour,
    surfaceCondition: liveWeather.surfaceCondition
  }) : null;
  const currentFriction = liveRoadGrip?.frictionNumber ?? 0.78;

  const handleFinishDrive = () => {
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const friction = currentFriction;

    const result = calculateDriveCadence({
      routeCompleted: true,
      waypointPhotosCount: waypoints.length,
      frictionMu: friction,
      surfaceCondition: liveRoadGrip?.statusDescription,
      durationMinutes: durationMins,
      flowContinuityRatio: 0.95,
      hazardReported
    });

    setCadenceResult(result);
    setSessionState('summary');

    showToast({
      title: `Drive Completed: [ ${result.rank} ] ${result.rankTitle}`,
      message: `Scored ${result.totalScore}/100 • You earned ${result.respectsEarned} Respects!`,
      type: 'garage',
      badge: `${result.rank}-RANK`
    });
  };

  const handleProceedToPublish = () => {
    if (!cadenceResult) return;

    const caption = waypoints.length > 0
      ? `Completed ${currentPass.name} shakedown with ${currentCar.name}. Logged ${waypoints.length} scenic waypoint(s) at ${currentPass.summitElevation}m summit. Harmonized with ${currentFriction} µ surface grip.`
      : `Dawn exploration across ${currentPass.name}. Smooth cadence and total chassis composure through the High Peak ribbons.`;

    onCompleteDrive({
      title: `${currentPass.name} Expedition`,
      caption,
      passName: currentPass.name,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      cadenceResult,
      waypoints,
      carId: currentCar.id,
      carName: currentCar.name,
      carModel: currentCar.model,
      frictionMu: currentFriction
    });

    onClose();
    setSessionState('idle');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 transition-colors ${
          isWhiteYellow
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
            : 'bg-[#0B0C0E] border-amber-500/25 text-white shadow-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className={`flex justify-between items-center border-b pb-4 ${isWhiteYellow ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner ${
              isWhiteYellow ? 'bg-yellow-100 border-yellow-300 text-yellow-900' : 'bg-zinc-950 border-amber-500/30 text-amber-400'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Active Expedition Tracker</h3>
                <span className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded-full font-bold border ${
                  isWhiteYellow ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 'bg-amber-400/10 text-amber-300 border-amber-400/25'
                }`}>
                  AWARE MOTORING
                </span>
              </div>
              <p className={`text-xs ${isWhiteYellow ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Rewards cadence, scenic pauses & road respect • Zero speed incentives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition ${isWhiteYellow ? 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STATE 1: IDLE / PRE-FLIGHT BRIEFING ── */}
        {sessionState === 'idle' && (
          <div className="space-y-5">
            {/* Vehicle Selector */}
            <div className="space-y-2">
              <label className={`text-xs font-mono-numbers uppercase tracking-wider block ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Select Active Chassis
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRACKER_CARS.map((car, idx) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setSelectedCarIndex(idx)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedCarIndex === idx
                        ? isWhiteYellow
                          ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/30 text-zinc-950 font-bold'
                          : 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 text-white font-bold'
                        : isWhiteYellow
                          ? 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="text-xs font-mono-numbers text-amber-400">{car.name}</div>
                    <div className="text-[11px] truncate mt-0.5">{car.model}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target UK Pass Selector */}
            <div className="space-y-2">
              <label className={`text-xs font-mono-numbers uppercase tracking-wider block ${isWhiteYellow ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Target Mountain Pass
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PASS_OPTIONS.map((pass) => (
                  <button
                    key={pass.id}
                    type="button"
                    onClick={() => setSelectedPassId(pass.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedPassId === pass.id
                        ? isWhiteYellow
                          ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/30 text-zinc-950 font-bold'
                          : 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 text-white font-bold'
                        : isWhiteYellow
                          ? 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{pass.name}</span>
                      <span className="text-[10px] font-mono-numbers opacity-70">{pass.summitElevation}m</span>
                    </div>
                    <div className="text-[11px] opacity-70 truncate mt-0.5">{pass.county}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Weather & Road Friction Peek */}
            {liveWeather && (
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono-numbers ${
                isWhiteYellow ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Surface Grip: <strong className="text-amber-400">{currentFriction} µ</strong></span>
                </div>
                <span className="text-zinc-500">Air: {liveWeather.airTempC}°C • Road: {liveWeather.surfaceTempC}°C</span>
              </div>
            )}

            {/* Launch Button */}
            <button
              onClick={handleStartDrive}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-lg active:scale-98 ${
                isWhiteYellow
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950 shadow-yellow-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ENGAGE EXPEDITION TRACKER</span>
            </button>
          </div>
        )}

        {/* ── STATE 2: ACTIVE IN-DRIVE OLED HUD ── */}
        {sessionState === 'tracking' && (
          <div className="space-y-6">
            {/* Minimalist In-Drive HUD Box */}
            <div className="p-6 rounded-3xl bg-black border border-amber-500/30 text-white space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <Mountain className="w-32 h-32" />
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 font-mono-numbers text-xs text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CADENCE HUD ACTIVE</span>
                </div>
                <span className="font-mono-numbers text-xs text-zinc-400">{currentPass.name}</span>
              </div>

              {/* Big Ticking Timer */}
              <div className="text-center py-2">
                <div className="text-5xl sm:text-6xl font-mono-numbers font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  {formatTimer(elapsedSeconds)}
                </div>
                <div className="text-[11px] font-mono-numbers text-zinc-400 uppercase tracking-widest mt-1">
                  Session Flow Duration
                </div>
              </div>

              {/* Real-time telemetry badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono-numbers">
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">ROAD SURFACE GRIP</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {currentFriction} µ
                  </span>
                  <span className="text-zinc-400 block text-[10px]">Optimal Friction</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">WAYPOINTS LOGGED</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {waypoints.length} CAPTURED
                  </span>
                  <span className="text-zinc-400 block text-[10px]">+25 Cadence Pts</span>
                </div>
              </div>
            </div>

            {/* In-Drive Awareness Actions */}
            <div className="space-y-2.5">
              {/* Waypoint Snap Trigger */}
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(true)}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isWhiteYellow
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <span>Log Mid-Way Scenic Waypoint</span>
                      <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold">
                        +5 RESPECTS
                      </span>
                    </div>
                    <div className="text-xs opacity-75">
                      Pull over safely at a scenic layby or pass summit
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-60" />
              </button>

              {/* Surface Hazard Report Button */}
              <button
                type="button"
                onClick={handleToggleHazard}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  hazardReported
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : isWhiteYellow
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${hazardReported ? 'text-red-400' : 'text-zinc-500'}`} />
                  <span>{hazardReported ? 'Road Hazard Broadcasted to Atelier' : 'Report Standing Water / Surface Hazard'}</span>
                </div>
                <span className="font-mono-numbers font-bold">
                  {hazardReported ? 'ALERT ACTIVE (+2 RESPECTS)' : '+2 RESPECTS'}
                </span>
              </button>
            </div>

            {/* Photo Picker Overlay if open */}
            {isPhotoPickerOpen && (
              <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
                isWhiteYellow ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-900 border-zinc-700'
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider font-mono-numbers">
                  Select Turnout Vista to Notarize:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_WAYPOINT_PHOTOS.map((sample, i) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleLogWaypoint(i)}
                      className="group relative rounded-xl overflow-hidden aspect-[16/10] border border-zinc-700 hover:ring-2 hover:ring-amber-400 transition"
                    >
                      <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end text-left">
                        <span className="text-[10px] font-bold text-white truncate">{sample.label}</span>
                        <span className="text-[9px] font-mono-numbers text-amber-300">{sample.altM}m Summit</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* End Drive Trigger */}
            <button
              onClick={handleFinishDrive}
              className="w-full py-3.5 rounded-2xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>COMPLETE EXPEDITION & CALCULATE CADENCE</span>
            </button>
          </div>
        )}

        {/* ── STATE 3: POST-DRIVE SUMMARY & RESPECT CALCULATION ── */}
        {sessionState === 'summary' && cadenceResult && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            {/* Minimalist Gamer Rank Hero Banner */}
            <div className="p-6 rounded-3xl bg-black border-2 border-amber-500/40 text-white space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs font-mono-numbers">
                <span className="text-amber-400 font-bold">// EXPEDITION NOTARIZED</span>
                <span className="text-zinc-500">{currentPass.name}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-mono-numbers font-black text-amber-400">
                      [ {cadenceResult.rank} ]
                    </span>
                    <span className="text-lg font-bold tracking-tight text-white">
                      {cadenceResult.rankTitle}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{cadenceResult.rankSubtitle}</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-mono-numbers font-black text-emerald-400">
                    +{cadenceResult.respectsEarned}
                  </div>
                  <span className="text-[10px] font-mono-numbers text-zinc-400 uppercase tracking-widest block">
                    Respects Earned
                  </span>
                </div>
              </div>

              {/* 100-Point Score Breakdown Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-800 text-[11px] font-mono-numbers text-center">
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px]">ROUTE</span>
                  <span className="text-white font-bold">{cadenceResult.breakdown.routeCompletionPts}/40</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px]">WAYPOINTS</span>
                  <span className="text-white font-bold">{cadenceResult.breakdown.waypointCapturePts}/25</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px]">WEATHER</span>
                  <span className="text-white font-bold">{cadenceResult.breakdown.gripAccordPts}/20</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px]">CADENCE</span>
                  <span className="text-white font-bold">{cadenceResult.breakdown.flowCadencePts}/15</span>
                </div>
              </div>

              <div className="text-[11px] font-mono-numbers text-amber-300/80 italic text-center pt-1">
                "{cadenceResult.motto}"
              </div>
            </div>

            {/* Waypoints Captured Preview */}
            {waypoints.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono-numbers uppercase tracking-wider block text-zinc-400">
                  Notarized Turnout Waypoints ({waypoints.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {waypoints.map((wp) => (
                    <div key={wp.id} className="flex items-center gap-2 p-2 rounded-xl border border-zinc-800 bg-zinc-950/60">
                      <img src={wp.imageUrl} alt={wp.title} className="w-12 h-10 rounded-lg object-cover" />
                      <div className="min-w-0 text-left">
                        <div className="text-[11px] font-bold text-white truncate">{wp.title}</div>
                        <div className="text-[10px] font-mono-numbers text-amber-400">{wp.time} • {wp.altitudeM}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dispatch to Feed Button */}
            <button
              onClick={handleProceedToPublish}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-lg active:scale-98 ${
                isWhiteYellow
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>DISPATCH TELEMETRY ARTIFACT TO ATELIER FEED</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
