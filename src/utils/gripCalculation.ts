/**
 * Road Grip & Surface Friction Calculation Engine
 * 
 * Plain English Explanation:
 * Road grip is how well tyres stick to the road surface.
 * On dry, warm tarmac, tyres have excellent grip.
 * When the road gets wet or cold, grip drops.
 * If moisture freezes on the road, grip drops dangerously low.
 * 
 * This engine takes real-world road and weather measurements and turns them into:
 * 1. A human-friendly grip level (e.g. "Optimal", "Good", "Moderate", "Low", "Ice Hazard").
 * 2. An exact friction number between 0.05 (pure ice) and 0.98 (warm dry racing tarmac).
 * 3. One sentence of real-life driving advice.
 */

export type GripLevel = 'optimal' | 'good' | 'moderate' | 'low' | 'ice_hazard';

export interface GripInputs {
  /** Road surface temperature in degrees Celsius (from roadside infrared sensors). */
  surfaceTempC?: number | null;
  /** Air temperature in degrees Celsius. */
  airTempC?: number | null;
  /** Road moisture condition string. */
  surfaceCondition?: 'Dry Asphalt' | 'Damp Bitumen' | 'Wet Bitumen' | 'Standing Water' | 'Frost Hazard' | 'Ice / Snow' | string;
  /** Rain rate in millimetres per hour (0 = dry, >4 = heavy rain). */
  rainMmPerHour?: number | null;
  /** Tyre carcass temperature in degrees Celsius (20°C is cold, 40-70°C is warm). */
  tyreTempC?: number | null;
  /** Optional road aggregate type. Default is standard bitumen. */
  roadType?: 'standard_bitumen' | 'high_friction_asphalt' | 'concrete' | 'polished_stone';
}

export interface GripResult {
  /** Whether the inputs were sensible and complete enough to calculate grip. */
  isValid: boolean;
  /** If data was missing or impossible, why we could not calculate it. */
  reasonIfInvalid?: string;
  /** The calculated friction coefficient (0.05 to 1.00), or null if invalid. */
  frictionNumber: number | null;
  /** Plain English rating category. */
  gripLevel: GripLevel;
  /** Human-readable headline label, e.g. "Grip: Moderate". */
  headline: string;
  /** One-sentence description of current road state. */
  statusDescription: string;
  /** One-sentence practical driving tip. */
  drivingAdvice: string;
  /** Semantic color theme for badges (green, amber, orange, red, grey). */
  badgeTone: 'green' | 'amber' | 'orange' | 'red' | 'grey';
  /** Icon name for accessibility (not relying on color alone). */
  iconKind: 'shield-check' | 'alert-triangle' | 'alert-octagon' | 'snowflake' | 'help-circle';
  /** Data source attribution. */
  sourceAttribution: string;
  /** Data freshness string. */
  freshness: string;
  /** Transparent breakdown of the calculation for the "How it works" panel. */
  breakdown: {
    baseTarmacGrip: number;
    temperatureEffect: number;
    waterPenalty: number;
    tyreWarmthBonus: number;
  };
}

/**
 * Validates sensor inputs.
 * Returns null if valid, or a friendly error message if invalid.
 */
function validateInputs(inputs: GripInputs): string | null {
  if (inputs.surfaceTempC == null && inputs.airTempC == null) {
    return 'Missing temperature data from both road surface and air sensors.';
  }

  const effectiveSurfaceTemp = inputs.surfaceTempC ?? inputs.airTempC!;
  if (Number.isNaN(effectiveSurfaceTemp)) {
    return 'Temperature sensor returned an unreadable number.';
  }

  // Realistic Earth road surface temperatures are between -45°C and +75°C.
  if (effectiveSurfaceTemp < -45 || effectiveSurfaceTemp > 75) {
    return `Temperature sensor reading (${effectiveSurfaceTemp.toFixed(1)}°C) is outside realistic road limits (-45°C to 75°C).`;
  }

  if (inputs.rainMmPerHour != null) {
    if (Number.isNaN(inputs.rainMmPerHour) || inputs.rainMmPerHour < 0 || inputs.rainMmPerHour > 250) {
      return `Rainfall rate (${inputs.rainMmPerHour} mm/h) is outside valid sensor range.`;
    }
  }

  if (inputs.tyreTempC != null) {
    if (Number.isNaN(inputs.tyreTempC) || inputs.tyreTempC < -30 || inputs.tyreTempC > 140) {
      return `Tyre temperature reading (${inputs.tyreTempC}°C) is outside operating limits.`;
    }
  }

  return null;
}

/**
 * Main road grip calculation function.
 * Pure, reliable, and easily testable.
 */
export function calculateRoadGrip(
  inputs: GripInputs,
  sourceLabel = 'UK Road Sensor Network',
  freshnessLabel = 'Updated 4 min ago'
): GripResult {
  const validationError = validateInputs(inputs);

  if (validationError) {
    return {
      isValid: false,
      reasonIfInvalid: validationError,
      frictionNumber: null,
      gripLevel: 'moderate',
      headline: 'Grip: Not enough data',
      statusDescription: validationError,
      drivingAdvice: 'Drive with caution and assess the road surface visually.',
      badgeTone: 'grey',
      iconKind: 'help-circle',
      sourceAttribution: sourceLabel,
      freshness: freshnessLabel,
      breakdown: {
        baseTarmacGrip: 0.90,
        temperatureEffect: 0,
        waterPenalty: 0,
        tyreWarmthBonus: 0
      }
    };
  }

  // 1. Establish base tarmac texture (dry standard bitumen is typically 0.90 - 0.95)
  let baseTarmacGrip = 0.92;
  if (inputs.roadType === 'high_friction_asphalt') baseTarmacGrip = 0.96;
  if (inputs.roadType === 'concrete') baseTarmacGrip = 0.85;
  if (inputs.roadType === 'polished_stone') baseTarmacGrip = 0.70;

  // 2. Determine surface temperature
  const surfaceTemp = inputs.surfaceTempC ?? (inputs.airTempC! - 1.2);

  // 3. Water / Moisture penalty
  let waterPenalty = 0.0;
  const cond = (inputs.surfaceCondition || '').toLowerCase();
  const rainRate = inputs.rainMmPerHour ?? (
    cond.includes('wet') || cond.includes('standing') ? 4.0 :
    cond.includes('damp') ? 0.8 : 0.0
  );

  if (rainRate > 0) {
    waterPenalty = Math.min(0.38, 0.12 + (rainRate * 0.04));
  } else if (cond.includes('damp')) {
    waterPenalty = 0.16;
  } else if (cond.includes('wet')) {
    waterPenalty = 0.28;
  } else if (cond.includes('standing')) {
    waterPenalty = 0.38;
  }

  // 4. Frost and ice check (freezing moisture)
  let frostPenalty = 0.0;
  const isFreezing = surfaceTemp <= 1.0;
  const hasMoisture = waterPenalty > 0 || cond.includes('frost') || cond.includes('ice');

  if (isFreezing && hasMoisture) {
    if (surfaceTemp <= -1.0) {
      frostPenalty = 0.55; // severe black ice
    } else {
      frostPenalty = 0.40; // patchy frost
    }
  } else if (cond.includes('frost')) {
    frostPenalty = 0.38;
  } else if (cond.includes('ice') || cond.includes('snow')) {
    frostPenalty = 0.60;
  }

  // 5. Road temperature effect (very cold asphalt hardens rubber compounds)
  let temperatureEffect = 0.0;
  if (surfaceTemp < 5.0) {
    temperatureEffect = -0.06;
  } else if (surfaceTemp >= 15.0 && surfaceTemp <= 32.0) {
    temperatureEffect = +0.03;
  }

  // 6. Tyre warmth bonus (warm tyres conform better to road aggregate)
  let tyreWarmthBonus = 0.0;
  const tyreTemp = inputs.tyreTempC ?? (surfaceTemp + 12.0);
  if (tyreTemp >= 40.0) {
    tyreWarmthBonus = Math.min(0.06, (tyreTemp - 30.0) * 0.002);
  } else if (tyreTemp < 10.0) {
    tyreWarmthBonus = -0.04;
  }

  // Final friction calculation (clamped between 0.08 ice limit and 0.98 dry limit)
  const rawMu = baseTarmacGrip - waterPenalty - frostPenalty + temperatureEffect + tyreWarmthBonus;
  const frictionNumber = Math.round(Math.max(0.08, Math.min(0.98, rawMu)) * 100) / 100;

  // Categorise for human driver UX
  let gripLevel: GripLevel = 'good';
  let headline = 'Grip: Good';
  let statusDescription = 'Dry asphalt with reliable traction.';
  let drivingAdvice = 'Normal braking distances. Corner with standard road confidence.';
  let badgeTone: 'green' | 'amber' | 'orange' | 'red' | 'grey' = 'green';
  let iconKind: 'shield-check' | 'alert-triangle' | 'alert-octagon' | 'snowflake' | 'help-circle' = 'shield-check';

  if (frictionNumber >= 0.85) {
    gripLevel = 'optimal';
    headline = 'Grip: Optimal';
    statusDescription = 'Warm, dry surface with maximum tyre adhesion.';
    drivingAdvice = 'Excellent grip. Full confidence for spirited B-road driving.';
    badgeTone = 'green';
    iconKind = 'shield-check';
  } else if (frictionNumber >= 0.70) {
    gripLevel = 'good';
    headline = 'Grip: Good';
    statusDescription = 'Mostly dry road with standard adhesion.';
    drivingAdvice = 'Normal braking distances. Corner with standard road confidence.';
    badgeTone = 'green';
    iconKind = 'shield-check';
  } else if (frictionNumber >= 0.52) {
    gripLevel = 'moderate';
    headline = 'Grip: Moderate';
    statusDescription = 'Damp or cool asphalt reducing tyre bite.';
    drivingAdvice = 'Wet road. Take mountain corners slower than usual and increase stopping distance.';
    badgeTone = 'amber';
    iconKind = 'alert-triangle';
  } else if (frictionNumber >= 0.32) {
    gripLevel = 'low';
    headline = 'Grip: Low';
    statusDescription = 'Significant water or cold grease on the road surface.';
    drivingAdvice = 'Slippery road. Double your braking distance and avoid sudden throttle in corners.';
    badgeTone = 'orange';
    iconKind = 'alert-octagon';
  } else {
    gripLevel = 'ice_hazard';
    headline = 'Grip: Ice Hazard';
    statusDescription = 'Freezing moisture or black ice detected on the road.';
    drivingAdvice = 'Extreme skid risk. Feather brakes gently and avoid abrupt steering movements.';
    badgeTone = 'red';
    iconKind = 'snowflake';
  }

  return {
    isValid: true,
    frictionNumber,
    gripLevel,
    headline,
    statusDescription,
    drivingAdvice,
    badgeTone,
    iconKind,
    sourceAttribution: sourceLabel,
    freshness: freshnessLabel,
    breakdown: {
      baseTarmacGrip: Math.round(baseTarmacGrip * 100) / 100,
      temperatureEffect: Math.round(temperatureEffect * 100) / 100,
      waterPenalty: Math.round((waterPenalty + frostPenalty) * 100) / 100,
      tyreWarmthBonus: Math.round(tyreWarmthBonus * 100) / 100
    }
  };
}
