/**
 * Automotive Dashboard Kinematics & Horological Dial Physics Engine
 * Ref: Porsche 911 GT3 (992) / Singer DLS Instrument Binnacle
 */

export type DriveMode = 'COMFORT' | 'SPORT' | 'SPORT+' | 'TRACK' | 'ATELIER';

export interface DashboardTelemetryState {
  speedMph: number;
  speedKph: number;
  gear: number | 'N' | 'P' | 'R';
  rpm: number;
  throttlePct: number;
  shiftLightsCount: number; // 0 to 5
  lateralG: number;
  longitudinalG: number;
  oilTempC: number;
  oilPressureBar: number;
  coolantTempC: number;
  boostPressureBar: number;
  tachometerAngleDeg: number;
  gForceOffset: { x: number; y: number };
  adhesionMu: number;
  roadCondition: string;
}

// Gear velocity bands for high-revving 4.0L flat-six / S58 twin-turbo (mph)
const GEAR_RATIOS = [
  { gear: 1, minMph: 0, maxMph: 42, idleRpm: 850, redlineMph: 45 },
  { gear: 2, minMph: 25, maxMph: 68, idleRpm: 1800, redlineMph: 72 },
  { gear: 3, minMph: 45, maxMph: 98, idleRpm: 2400, redlineMph: 104 },
  { gear: 4, minMph: 70, maxMph: 128, idleRpm: 2600, redlineMph: 135 },
  { gear: 5, minMph: 95, maxMph: 158, idleRpm: 2800, redlineMph: 165 },
  { gear: 6, minMph: 120, maxMph: 188, idleRpm: 2900, redlineMph: 195 },
  { gear: 7, minMph: 145, maxMph: 215, idleRpm: 2200, redlineMph: 220 }
];

/**
 * Derives current transmission gear, engine RPM, throttle opening, and shift lights
 */
export function calculateGearAndRpm(speedMph: number, driveMode: DriveMode = 'SPORT'): {
  gear: number;
  rpm: number;
  throttlePct: number;
  shiftLightsCount: number;
} {
  if (speedMph <= 0) {
    return { gear: 1, rpm: 850, throttlePct: 0, shiftLightsCount: 0 };
  }

  // Determine optimal gear for speed
  let selected = GEAR_RATIOS[0];
  for (const g of GEAR_RATIOS) {
    if (speedMph >= g.minMph) {
      selected = g;
    }
  }

  // In Sport+ or Track mode, transmission holds lower gear longer for peak powerband
  if ((driveMode === 'SPORT+' || driveMode === 'TRACK') && selected.gear > 2 && speedMph < selected.maxMph * 0.85) {
    const lowerGear = GEAR_RATIOS.find(g => g.gear === selected.gear - 1);
    if (lowerGear && speedMph <= lowerGear.redlineMph) {
      selected = lowerGear;
    }
  }

  const speedSpan = selected.redlineMph - selected.minMph;
  const currentInSpan = Math.max(0, speedMph - selected.minMph);
  const ratio = Math.min(1, currentInSpan / speedSpan);

  // Compute RPM between 2,800 and 8,800 RPM
  const baseRpm = selected.gear === 1 ? 850 : 3100;
  const maxRpm = 9000;
  const rpm = Math.round(baseRpm + ratio * (maxRpm - baseRpm));

  // Compute throttle load based on drive mode and speed
  let throttlePct = Math.round(35 + (rpm / 9000) * 55);
  if (driveMode === 'TRACK') throttlePct = Math.min(100, throttlePct + 10);
  if (driveMode === 'COMFORT') throttlePct = Math.max(20, throttlePct - 15);

  // 5-stage progressive shift light indicator
  // Stage 1: 6,800 | Stage 2: 7,400 | Stage 3: 7,900 | Stage 4: 8,300 | Stage 5: 8,700
  let shiftLightsCount = 0;
  if (rpm >= 6800) shiftLightsCount = 1;
  if (rpm >= 7400) shiftLightsCount = 2;
  if (rpm >= 7900) shiftLightsCount = 3;
  if (rpm >= 8300) shiftLightsCount = 4;
  if (rpm >= 8700) shiftLightsCount = 5;

  return {
    gear: selected.gear,
    rpm: Math.min(9000, Math.max(850, rpm)),
    throttlePct,
    shiftLightsCount
  };
}

/**
 * Computes tachometer needle angle (225° start to 495° redline, 270° total span)
 */
export function calculateTachometerAngle(rpm: number, maxRpm: number = 9000): number {
  const clamped = Math.max(0, Math.min(maxRpm, rpm));
  const startDeg = -135; // 225 deg normalized (-135 from top 0)
  const sweepDeg = 270;
  return startDeg + (clamped / maxRpm) * sweepDeg;
}

/**
 * Computes mechanical oil pressure (Bar) from engine RPM and oil temperature
 */
export function calculateOilPressure(rpm: number, oilTempC: number = 96): number {
  // Cold oil has higher viscosity; hot oil drops slightly
  const tempCorrection = oilTempC > 105 ? -0.3 : oilTempC < 75 ? +0.6 : 0;
  const baseIdleBar = 1.8;
  const maxBar = 5.4;
  const pressure = baseIdleBar + (rpm / 9000) * (maxBar - baseIdleBar) + tempCorrection;
  return Number(Math.max(1.2, Math.min(6.0, pressure)).toFixed(1));
}

/**
 * Computes turbo manifold boost pressure (Bar)
 */
export function calculateBoostPressure(throttlePct: number, driveMode: DriveMode = 'SPORT'): number {
  if (driveMode === 'COMFORT') {
    return Number(((throttlePct / 100) * 0.75).toFixed(2));
  }
  if (driveMode === 'SPORT') {
    return Number(((throttlePct / 100) * 1.25).toFixed(2));
  }
  // SPORT+ & TRACK full wastegate clamp
  return Number(((throttlePct / 100) * 1.55).toFixed(2));
}

/**
 * Computes 2D coordinate displacement for G-Force Crosshair
 */
export function calculateGForceCoords(
  lateralG: number,
  longitudinalG: number,
  maxG: number = 1.5,
  radiusPx: number = 32
): { x: number; y: number } {
  const normX = Math.max(-1, Math.min(1, lateralG / maxG));
  const normY = Math.max(-1, Math.min(1, longitudinalG / maxG));
  return {
    x: Math.round(normX * radiusPx),
    y: Math.round(-normY * radiusPx) // Invert Y so positive longitudinal acceleration pulls back
  };
}

/**
 * Formats a number of miles into an authentic mechanical rolling odometer string
 * e.g. 18420 -> "018,420"
 */
export function formatOdometer(miles: number): string {
  const rounded = Math.max(0, Math.floor(miles));
  const rawStr = rounded.toString().padStart(6, '0');
  return `${rawStr.slice(0, 3)},${rawStr.slice(3)}`;
}
