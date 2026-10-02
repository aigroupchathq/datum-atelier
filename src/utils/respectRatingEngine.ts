/**
 * DATUM Atelier — Motoring Cadence & Community Respect Engine
 * 
 * Replaces vanity social media "Likes" with "Respects Earned".
 * Engineered around mindful, aware driving (route completion, scenic mid-way waypoints,
 * weather/grip harmony, and unbroken flow cadence) with zero speed or reckless aggression incentives.
 */

export type CadenceRank = 'EX' | 'S' | 'A+' | 'A' | 'ZEN';

export type CustodianTier = 
  | 'PILOT' 
  | 'ARTISAN' 
  | 'APEX_CUSTODIAN' 
  | 'MASTER_OF_THE_MACHINE';

export interface DriveCadenceInput {
  routeCompleted: boolean;
  waypointPhotosCount: number; // Mid-way waypoint photos taken
  frictionMu?: number; // Road grip from live weather (0.0 to 1.0)
  surfaceCondition?: string;
  durationMinutes: number;
  flowContinuityRatio?: number; // 0.0 to 1.0 unbroken driving cadence
  hazardReported?: boolean;
}

export interface DriveCadenceBreakdown {
  routeCompletionPts: number; // Max 40
  waypointCapturePts: number; // Max 25
  gripAccordPts: number;      // Max 20
  flowCadencePts: number;      // Max 15
}

export interface DriveCadenceResult {
  totalScore: number; // 0 to 100
  rank: CadenceRank;
  rankTitle: string;
  rankSubtitle: string;
  respectsEarned: number;
  breakdown: DriveCadenceBreakdown;
  motto: string;
  hudTag: string;
}

export interface CustodianProfile {
  totalRespects: number;
  tier: CustodianTier;
  tierTitle: string;
  tierDescription: string;
  nextTierThreshold: number;
  progressPercent: number;
}

export interface ExpeditionPreset {
  id: string;
  label: string;
  icon: string;
  title: string;
  caption: string;
  passName: string;
  surfaceCondition: string;
  frictionMu: number;
  atmosphereBadge: string;
}

/**
 * Pre-configured 1-Tap Expedition Vibes for effortless post creation
 */
export const EXPEDITION_PRESETS: ExpeditionPreset[] = [
  {
    id: 'dawn-patrol',
    label: 'Dawn Patrol',
    icon: '🌄',
    title: 'A57 Snake Pass Dawn Patrol',
    caption: 'Tires warmed progressively through cold morning mist. Zero traffic on the High Peak ribbons; pulled over at the 512m summit turnout for the sunrise light.',
    passName: 'A57 Snake Pass (High Peak)',
    surfaceCondition: 'Damp Bitumen (9°C)',
    frictionMu: 0.78,
    atmosphereBadge: 'DAWN PATROL // 05:42'
  },
  {
    id: 'rain-master',
    label: 'Rain Master',
    icon: '🌧️',
    title: 'Kirkstone Pass Low-Friction Flow',
    caption: 'Steady rain across the Lakeland tarmac. Smooth weight transfers and progressive pedal modulation. The chassis danced through standing water without a flicker of panic.',
    passName: 'Kirkstone Pass (Lake District)',
    surfaceCondition: 'Wet Asphalt (11°C)',
    frictionMu: 0.62,
    atmosphereBadge: 'RAIN MASTER // LOW-MU FLOW'
  },
  {
    id: 'summit-ascent',
    label: 'Summit Ascent',
    icon: '🏔️',
    title: 'Hardknott Pass 33% Grade Ascent',
    caption: 'Roman pass conquest. Careful gear selection, cooling cooldown intervals, and total respect for single-track dry stone wall boundaries.',
    passName: 'Hardknott Pass (Cumbria)',
    surfaceCondition: 'Dry Coarse Aggregate (14°C)',
    frictionMu: 0.85,
    atmosphereBadge: 'ALPINE SUMMIT // 33% GRADE'
  },
  {
    id: 'sunday-meet',
    label: 'Sunday Meet',
    icon: '☕',
    title: 'Cotswolds Dawn Run to Paddock Meet',
    caption: 'Joined the 07:00 convoy. Clean lines through Chipping Campden, respectful residential perimeter speeds, and open garage conversations with fellow custodians.',
    passName: 'Cotswolds B-Road Circuit',
    surfaceCondition: 'Dry Hot Rolled Asphalt (16°C)',
    frictionMu: 0.88,
    atmosphereBadge: 'PADDOCK CONVOY // CAMARADERIE'
  }
];

/**
 * Calculates a transparent, healthy 100-point Drive Cadence score and Respects earned.
 * Explicitly rejects speed metrics; strictly rewards journey completion, mid-way scenic stops,
 * weather harmony, and unbroken smooth cadence.
 */
export function calculateDriveCadence(input: DriveCadenceInput): DriveCadenceResult {
  // 1. Route Completion (Max 40 pts)
  const routeCompletionPts = input.routeCompleted ? 40 : 20;

  // 2. Mid-way Waypoint Photo Capture (Max 25 pts)
  // Taking a scenic break and documenting the machine earns significant points
  let waypointCapturePts = 0;
  if (input.waypointPhotosCount >= 2) {
    waypointCapturePts = 25;
  } else if (input.waypointPhotosCount === 1) {
    waypointCapturePts = 20;
  } else {
    waypointCapturePts = 10; // Encourages at least one scenic stop next time
  }

  // 3. Road Grip & Weather Accord (Max 20 pts)
  // Driving composedly across whatever the sky gives us
  let gripAccordPts = 16;
  const mu = input.frictionMu ?? 0.80;
  if (mu < 0.65) {
    // Wet / low grip composure earns maximum points
    gripAccordPts = 20;
  } else if (mu >= 0.65 && mu <= 0.85) {
    gripAccordPts = 18;
  } else {
    gripAccordPts = 16;
  }

  // 4. Flow Cadence & Continuity (Max 15 pts)
  const flow = input.flowContinuityRatio ?? 0.85;
  const flowCadencePts = Math.min(15, Math.round(flow * 15));

  // Total 100-point Score
  const totalScore = Math.min(100, Math.max(0, routeCompletionPts + waypointCapturePts + gripAccordPts + flowCadencePts));

  // Rank Determination
  let rank: CadenceRank = 'ZEN';
  let rankTitle = 'PURE CRUISE';
  let rankSubtitle = 'Soulful miles with no pressure';
  let motto = 'The road belongs to those who savor the journey.';

  if (totalScore >= 96) {
    rank = 'EX';
    rankTitle = 'TRANSCENDENT';
    rankSubtitle = 'Pure Zen • Flawless Flow & Complete Harmony';
    motto = 'Smooth is fast. The chassis, driver, and ribbon of tarmac are in complete accord.';
  } else if (totalScore >= 88) {
    rank = 'S';
    rankTitle = 'APEX HARMONY';
    rankSubtitle = 'Masterful Cadence • Unbroken Road Rhythm';
    motto = 'Effortless momentum without fighting the machine.';
  } else if (totalScore >= 80) {
    rank = 'A+';
    rankTitle = 'IN THE GROOVE';
    rankSubtitle = 'Crisp Poise • Locked-in Composure';
    motto = 'Reading the contours three bends ahead.';
  } else if (totalScore >= 70) {
    rank = 'A';
    rankTitle = 'FLOW STATE';
    rankSubtitle = 'Clean Cadence • Balanced Momentum';
    motto = 'Clean lines, safe margins, and mechanical empathy.';
  }

  // Respects Earned Calculation
  let respects = 4; // Base for completing drive
  if (input.waypointPhotosCount > 0) respects += 5; // Mid-way photo waypoint respect
  if (mu < 0.70) respects += 3; // Adverse weather respect
  if (input.hazardReported) respects += 2; // Community alert respect
  if (rank === 'EX') respects += 4;
  else if (rank === 'S') respects += 2;

  const hudTag = `[ ${rank} ] // CADENCE: ${rankTitle} // SCORE: ${totalScore}/100 // +${respects} RESPECTS`;

  return {
    totalScore,
    rank,
    rankTitle,
    rankSubtitle,
    respectsEarned: respects,
    breakdown: {
      routeCompletionPts,
      waypointCapturePts,
      gripAccordPts,
      flowCadencePts
    },
    motto,
    hudTag
  };
}

/**
 * Calculates long-term Custodian Tier based on cumulative Respects Earned across
 * drives, builds, and community contributions.
 */
export function calculateCustodianTier(totalRespects: number): CustodianProfile {
  if (totalRespects >= 2500) {
    return {
      totalRespects,
      tier: 'MASTER_OF_THE_MACHINE',
      tierTitle: 'Master of the Machine',
      tierDescription: 'Legendary stewardship. Provenance, mechanical wisdom, and thousands of respected miles.',
      nextTierThreshold: 5000,
      progressPercent: Math.min(100, Math.round((totalRespects / 5000) * 100))
    };
  }

  if (totalRespects >= 750) {
    return {
      totalRespects,
      tier: 'APEX_CUSTODIAN',
      tierTitle: 'Apex Custodian',
      tierDescription: 'A cornerstone of the atelier. Frequent mountain pass waypoints and verified workshop provenance.',
      nextTierThreshold: 2500,
      progressPercent: Math.round(((totalRespects - 750) / (2500 - 750)) * 100)
    };
  }

  if (totalRespects >= 150) {
    return {
      totalRespects,
      tier: 'ARTISAN',
      tierTitle: 'Artisan Pilot',
      tierDescription: 'Active road explorer. Documents builds transparently and clocks regular scenic waypoints.',
      nextTierThreshold: 750,
      progressPercent: Math.round(((totalRespects - 150) / (750 - 150)) * 100)
    };
  }

  return {
    totalRespects,
    tier: 'PILOT',
    tierTitle: 'Expedition Pilot',
    tierDescription: 'Beginning their motoring journey. Exploring local B-roads and earning their first respects.',
    nextTierThreshold: 150,
    progressPercent: Math.round((totalRespects / 150) * 100)
  };
}
