/**
 * DATUM Synaptic Telemetry & Kinematic Discovery Algorithm
 * Multi-dimensional semantic deconstruction engine for automotive engineering,
 * chassis dynamics, hardware Bill of Materials (BOM), and provenance matching.
 * 
 * Unlike engagement-bait algorithms on mainstream social media, this engine
 * deconstructs pasted text, classifieds, forum posts, and invoices into verifiable
 * engineering telemetry vectors and grants the driver direct control over algorithmic weights.
 */

export type VectorCategory = 'chassis' | 'powertrain' | 'hardware' | 'kinematics' | 'topography' | 'provenance';

export interface DetectedVector {
  category: VectorCategory;
  token: string;
  displayLabel: string;
  weight: number;
}

export interface ParsedKinematicQuery {
  rawText: string;
  detectedVectors: DetectedVector[];
  primaryChassis?: string;
  inferredCategory?: string;
  kinematicTargetG?: number;
  adhesionTarget?: 'dry' | 'damp' | 'frost' | 'any';
  summaryBadge: string;
}

export interface AlgorithmWeights {
  /** 0 = Modern High-Output AWD/Turbo, 100 = Analog Naturally Aspirated Manual Purist */
  mechanicalPurism: number;
  /** 'all' | 'dry' | 'damp' | 'frost' */
  surfaceGripTarget: 'all' | 'dry' | 'damp' | 'frost';
  /** 0 = Relaxed Scenic Touring, 100 = Track Apex 1.2G+ Kinematics */
  kinematicIntensity: number;
  /** 0 = All Community Posts, 100 = 100% Verified Workshop DAG Stamped */
  provenanceStrictness: number;
}

export interface ExploreEntity {
  id: string;
  category: string;
  authorHandle: string;
  authorName: string;
  authorCar: string;
  caption: string;
  telemetryTag?: string;
  isPro?: boolean;
  purismScore?: number; // 0 (electronic/auto) to 100 (pure analog manual NA)
  surfaceCondition?: 'dry' | 'damp' | 'frost';
  peakLateralG?: number;
  provenanceScore?: number;
}

export interface KinematicMatchResult {
  score: number; // 0 to 100%
  isStrongMatch: boolean;
  reasons: string[];
  matchedVectors: DetectedVector[];
}

// Canonical Engineering Vector Vocabulary
const VECTOR_DICTIONARY: Record<VectorCategory, Array<{ keywords: string[]; label: string; weight: number }>> = {
  chassis: [
    { keywords: ['g80', 'm3 comp', 'm3 competition', 'g82', 'm4'], label: 'BMW M3/M4 (G80/G82)', weight: 1.0 },
    { keywords: ['992', 'gt3', 'gt3 touring', 'touring package', '911 gt3'], label: 'Porsche 911 GT3 (992)', weight: 1.0 },
    { keywords: ['e30', '318is', 'slicktop', 'e30 m3', 'e36'], label: 'BMW 3-Series Slicktop (E30)', weight: 1.0 },
    { keywords: ['l663', 'defender', 'defender 110', 'defender 90', 'overland'], label: 'Land Rover Defender (L663)', weight: 1.0 },
    { keywords: ['gr yaris', 'yaris circuit', 'g16e', 'gazoo'], label: 'Toyota GR Yaris Circuit', weight: 0.95 },
    { keywords: ['720s', 'mclaren', 'monocage'], label: 'McLaren 720S Supercar', weight: 0.95 },
    { keywords: ['718', 'cayman gt4', 'boxster spyder', 'gt4'], label: 'Porsche 718 Cayman GT4', weight: 0.95 },
    { keywords: ['964', 'carrera rs', 'air-cooled', 'air cooled', 'g-body'], label: 'Porsche 911 Air-Cooled (964)', weight: 0.95 },
  ],
  powertrain: [
    { keywords: ['s58', 'twin-turbo', 'biturbo', 'twin turbo'], label: '3.0L S58 Twin-Turbocharged I6', weight: 0.9 },
    { keywords: ['naturally aspirated', '4.0l', '9000 rpm', '9,000 rpm', 'flat-six', 'flat six', 'boxer-6'], label: '4.0L NA 9,000 RPM Valvetrain', weight: 0.95 },
    { keywords: ['m42', 'twin-cam', '16v', 'getrag', '4.10 lsd', 'small-case'], label: 'M42 Twin-Cam & Mechanical LSD', weight: 0.9 },
    { keywords: ['v8', 'supercharged', 'ingenium', 'twin-speed transfer'], label: '5.0L Supercharged V8 / Ingenium', weight: 0.85 },
    { keywords: ['manual', '6-speed', 'stick shift', '3 pedals', 'purist manual', 'auto-blip'], label: 'GT Sports Manual Transmission', weight: 0.95 },
  ],
  hardware: [
    { keywords: ['kw v4', 'kw variant 4', 'kw clubsport', 'dampers', 'coilovers', '3-way independent'], label: 'KW Variant 4 3-Way Independent Dampers', weight: 0.95 },
    { keywords: ['akrapovic', 'akrapovič', 'titanium exhaust', 'downpipe', 'evolution line'], label: 'Akrapovič Titanium Lightweight Exhaust', weight: 0.9 },
    { keywords: ['cup 2', 'pilot sport cup 2', 'michelin cup', 'cup2'], label: 'Michelin Pilot Sport Cup 2 Track Tyres', weight: 0.85 },
    { keywords: ['ps4s', 'pilot sport 4s', 'michelin ps4s'], label: 'Michelin Pilot Sport 4S Road Tyres', weight: 0.8 },
    { keywords: ['bfgoodrich', 'ko2', 'all-terrain', 'steel rims', 'aired down'], label: 'BFGoodrich All-Terrain T/A KO2 Overland Tyres', weight: 0.85 },
    { keywords: ['brembo', 'ds2500', 'ferodo', '6-piston', 'gt6', 'carbon ceramic'], label: 'Brembo / Ferodo High-Friction Braking Compound', weight: 0.85 },
    { keywords: ['bbs', 'bbs lm', 'basketweaves', 'split rims', 'rotisserie'], label: 'Period-Correct Modular Lightweight Wheels', weight: 0.85 },
  ],
  kinematics: [
    { keywords: ['1.2g', '1.4g', '1.1g', 'g-force', 'lateral g', 'cornering load', 'kamm circle'], label: 'High Lateral Grip Envelope (>1.1G)', weight: 0.9 },
    { keywords: ['damp', 'wet', 'rain', 'greasy', 'bitumen', 'slip angle'], label: 'Damp Bitumen Adhesion Dynamics (μ 0.55–0.75)', weight: 0.85 },
    { keywords: ['frost', 'black ice', 'freezing', 'cold tarmac', 'sub-zero'], label: 'Low Friction Cryospheric Hazard (μ < 0.35)', weight: 0.9 },
    { keywords: ['dry', 'warm asphalt', 'high adhesion', 'peak grip'], label: 'High Adhesion Optimum Asphalt (μ > 0.85)', weight: 0.8 },
    { keywords: ['900mm', 'wading', 'river crossing', 'bog recovery', 'winch'], label: 'Deep Overland Wading Depth (900mm)', weight: 0.85 },
  ],
  topography: [
    { keywords: ['snake pass', 'a57', 'high peak', 'ladybower', 'derbyshire'], label: 'Snake Pass (A57) Derbyshire Summit', weight: 0.95 },
    { keywords: ['llanberis', 'snowdonia', 'slate quarries', 'pass of llanberis'], label: 'Llanberis Pass (A4086) Snowdonia Slate Cliffs', weight: 0.95 },
    { keywords: ['cotswolds', 'roman way', 'b4425', 'chipping campden', 'burford'], label: 'Cotswolds Roman Way Undulating B-Roads', weight: 0.9 },
    { keywords: ['cadwell park', 'hall bends', 'kerb ride', 'mountain section'], label: 'Cadwell Park Circuit (The Mini Nürburgring)', weight: 0.9 },
    { keywords: ['strata florida', 'green lane', 'cambrian mountains', 'welsh bog'], label: 'Strata Florida Historic Welsh Greenway', weight: 0.9 },
    { keywords: ['b-road', 'b roads', 'national speed limit', 'undulations'], label: 'British Rural B-Road Fast Flow', weight: 0.8 },
  ],
  provenance: [
    { keywords: ['v5c', 'statutory', 'mot clean', '0 advisories', 'dvsa'], label: 'DVSA Statutory Clean Pass (0 Advisories)', weight: 0.9 },
    { keywords: ['workshop stamp', 'notarized', 'dag chain', 'litchfield', 'service log'], label: 'Cryptographically Stamped Workshop Provenance', weight: 0.95 },
    { keywords: ['concours', 'preservation', 'unmolested', 'original cosmoline'], label: 'Concours d’Elegance Unmolested Heritage', weight: 0.9 },
    { keywords: ['sunroof delete', 'slicktop', 'homologation', 'factory spec'], label: 'Factory Slicktop / Homologation Spec', weight: 0.9 },
  ]
};

/**
 * Deconstructs pasted arbitrary automotive text into multidimensional telemetry vectors
 */
export function parseKinematicSnippet(inputText: string): ParsedKinematicQuery {
  const clean = (inputText || '').trim().toLowerCase();
  const detectedVectors: DetectedVector[] = [];

  if (!clean) {
    return {
      rawText: '',
      detectedVectors: [],
      summaryBadge: 'Awaiting Telemetry Input'
    };
  }

  // Iterate categories and extract matches
  (Object.keys(VECTOR_DICTIONARY) as VectorCategory[]).forEach((category) => {
    const list = VECTOR_DICTIONARY[category];
    list.forEach((entry) => {
      const isMatched = entry.keywords.some((kw) => {
        // Direct inclusion or boundary regex
        if (clean.includes(kw)) return true;
        const rx = new RegExp(`\\b${kw.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'i');
        return rx.test(clean);
      });

      if (isMatched) {
        detectedVectors.push({
          category,
          token: entry.keywords[0],
          displayLabel: entry.label,
          weight: entry.weight
        });
      }
    });
  });

  // Extract explicit lateral G if mentioned, e.g. "1.25G" or "1.2 G"
  let kinematicTargetG: number | undefined;
  const gMatch = clean.match(/(\d+\.?\d*)\s*g\b/i);
  if (gMatch && gMatch[1]) {
    const parsedG = parseFloat(gMatch[1]);
    if (!isNaN(parsedG) && parsedG > 0 && parsedG < 3.0) {
      kinematicTargetG = parsedG;
    }
  }

  // Extract surface adhesion target
  let adhesionTarget: ParsedKinematicQuery['adhesionTarget'] = 'any';
  if (clean.includes('frost') || clean.includes('ice') || clean.includes('snow') || clean.includes('sub-zero')) {
    adhesionTarget = 'frost';
  } else if (clean.includes('damp') || clean.includes('wet') || clean.includes('rain') || clean.includes('greasy')) {
    adhesionTarget = 'damp';
  } else if (clean.includes('dry') || clean.includes('warm') || clean.includes('optimum')) {
    adhesionTarget = 'dry';
  }

  // Primary chassis code detection
  const primaryChassis = detectedVectors.find(v => v.category === 'chassis')?.displayLabel;

  // Infer primary category
  let inferredCategory = 'all';
  if (clean.includes('pass') || clean.includes('mountain') || clean.includes('expedition') || clean.includes('a57')) inferredCategory = 'pass';
  else if (clean.includes('track') || clean.includes('lap') || clean.includes('circuit') || clean.includes('cadwell')) inferredCategory = 'track';
  else if (clean.includes('build') || clean.includes('damper') || clean.includes('bushing') || clean.includes('workshop')) inferredCategory = 'build';
  else if (clean.includes('engine') || clean.includes('dyno') || clean.includes('valvetrain') || clean.includes('port flow')) inferredCategory = 'engine';
  else if (clean.includes('slicktop') || clean.includes('e30') || clean.includes('classic') || clean.includes('vintage')) inferredCategory = 'classic';
  else if (clean.includes('gt3') || clean.includes('supercar') || clean.includes('720s')) inferredCategory = 'supercar';

  const summaryBadge = detectedVectors.length > 0 
    ? `${detectedVectors.length} Telemetry Vectors Resolved` 
    : 'General Semantic Scan';

  return {
    rawText: inputText,
    detectedVectors,
    primaryChassis,
    inferredCategory,
    kinematicTargetG,
    adhesionTarget,
    summaryBadge
  };
}

/**
 * Calculates a mathematical match score (0 to 100%) between an explore entity
 * and the parsed query deconstruction, adjusted by the driver's active algorithmic weights.
 */
export function calculateKinematicMatch(
  item: ExploreEntity,
  query: ParsedKinematicQuery,
  weights: AlgorithmWeights
): KinematicMatchResult {
  const reasons: string[] = [];
  const matchedVectors: DetectedVector[] = [];
  
  // Base starting score
  let score = 50.0;

  const itemText = `${item.caption} ${item.authorCar} ${item.authorName} ${item.telemetryTag || ''}`.toLowerCase();

  // 1. Vector Keyword Affinity Matching (Up to +45 points)
  if (query.detectedVectors.length > 0) {
    let vectorPoints = 0;
    query.detectedVectors.forEach((v) => {
      // Check if item text contains the token or related keywords
      const matched = itemText.includes(v.token.toLowerCase());
      if (matched) {
        matchedVectors.push(v);
        vectorPoints += 15 * v.weight;
        reasons.push(`${v.category.toUpperCase()}: ${v.displayLabel}`);
      }
    });

    const normalizedVectorPoints = Math.min(45, vectorPoints);
    score += normalizedVectorPoints;
  } else {
    // If no specific vectors detected, base on category match
    if (query.rawText.trim()) {
      const words = query.rawText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      let matchCount = 0;
      words.forEach(w => {
        if (itemText.includes(w)) matchCount++;
      });
      score += Math.min(25, matchCount * 8);
    }
  }

  // 2. Mechanical Purism Alignment (Up to +/- 15 points)
  // Higher weights.mechanicalPurism favors NA manual analog vehicles (purismScore near 100)
  // Lower weights favors modern forced-induction / AWD / dual-clutch track cars
  const itemPurism = item.purismScore ?? (
    item.authorCar.includes('E30') ? 95 :
    item.authorCar.includes('992') || item.authorCar.includes('GT3') ? 92 :
    item.authorCar.includes('GR Yaris') ? 70 :
    item.authorCar.includes('Defender') ? 60 :
    item.authorCar.includes('M3') ? 65 :
    item.authorCar.includes('720S') ? 55 : 75
  );

  const purismDiff = Math.abs(itemPurism - weights.mechanicalPurism);
  const purismAffinity = Math.max(0, 15 - (purismDiff / 100) * 15);
  score += purismAffinity;
  if (purismDiff < 20) {
    reasons.push(`Mechanical Purism Target Aligned (${itemPurism}% score)`);
  }

  // 3. Surface Friction Adhesion Target (Up to +/- 15 points)
  if (weights.surfaceGripTarget !== 'all') {
    const itemSurface = item.surfaceCondition ?? (
      itemText.includes('frost') || itemText.includes('ice') ? 'frost' :
      itemText.includes('damp') || itemText.includes('wet') || itemText.includes('rain') ? 'damp' : 'dry'
    );

    if (itemSurface === weights.surfaceGripTarget) {
      score += 15;
      reasons.push(`Surface Adhesion Matched (${weights.surfaceGripTarget.toUpperCase()} Tarmac)`);
    } else {
      score -= 10;
    }
  }

  // 4. Kinematic Intensity Match (Lateral G / Acceleration)
  if (weights.kinematicIntensity > 50) {
    const hasHighG = (item.peakLateralG && item.peakLateralG >= 1.1) || 
      itemText.includes('1.42g') || itemText.includes('1.2g') || itemText.includes('track') || itemText.includes('cadwell');
    if (hasHighG) {
      score += 10;
      reasons.push('High Kinematic Lateral Load (>1.1G Telemetry Verified)');
    }
  }

  // 5. Provenance Strictness Filter
  if (weights.provenanceStrictness > 50) {
    const isVerified = (item.provenanceScore && item.provenanceScore >= 95) || item.isPro || itemText.includes('dvsa') || itemText.includes('notarized');
    if (isVerified) {
      score += 10;
      reasons.push('Verified Cryptographic Provenance Tier');
    } else {
      score -= (weights.provenanceStrictness / 100) * 20;
    }
  }

  // Bound score between 12% and 99.8%
  const finalScore = Math.min(99.8, Math.max(12.0, Number(score.toFixed(1))));

  return {
    score: finalScore,
    isStrongMatch: finalScore >= 75.0,
    reasons: reasons.slice(0, 3),
    matchedVectors
  };
}

// Preset Automotive Telemetry Snippets for 1-Click Testing & Demonstration
export const CURATED_SNIPPETS = [
  {
    title: 'Cotswolds Damp B-Road KW Dampers',
    snippet: 'KW Variant 4 3-way dampers on damp British B-roads like Cotswolds Roman Way aiming for 1.2G lateral and zero axle tramp.',
    category: 'pass'
  },
  {
    title: 'Porsche GT3 Touring 9,000 RPM Valvetrain',
    snippet: 'Porsche 911 GT3 Touring 992 4.0L naturally aspirated flat-six 9,000 RPM 6-speed manual with Michelin Pilot Sport Cup 2.',
    category: 'supercar'
  },
  {
    title: 'Analog Classic E30 Slicktop',
    snippet: '1989 BMW 318is E30 slicktop sunroof-delete with M42 twin-cam, 4.10 small-case LSD and BBS basketweaves.',
    category: 'classic'
  },
  {
    title: 'Yorkshire Dales Overland Rig',
    snippet: 'Land Rover Defender 110 V8 L663 with BFGoodrich KO2 all-terrain tyres, 900mm wading depth, and Strata Florida river crossing.',
    category: 'pass'
  },
  {
    title: 'High-RPM Port Flow & Titanium Exhaust',
    snippet: 'S58 twin-turbo Akrapovič titanium exhaust with dyno cell port flow calibration and Ferodo DS2500 high-friction braking compound.',
    category: 'engine'
  }
];
