export interface VehicleDatum {
  id: string;
  handle: string;
  displayName: string;
  spec: {
    make: string;
    model: string;
    chassisCode: string;
    year: number;
    engine: string;
    outputBhp: number;
    transmission: string;
    factoryColor: string;
  };
  custodian: {
    name: string;
    verifiedV5C: boolean;
    since: string;
  };
  metrics: {
    odometer: number;
    healthIndex: number;
    motDaysRemaining: number;
    trueCostPerMile: number;
    provenanceScore: number;
    estimatedResalePremium: number;
  };
  provenanceBreakdown: {
    dvsaTests: number;
    proStamps: number;
    documentedInvoices: number;
    unverified: number;
  };
}

export interface DriveCapsule {
  id: string;
  number: number;
  title: string;
  date: string;
  location: string;
  ambientTempC: number;
  distanceMiles: number;
  durationFormatted: string;
  efficiencyMpg: number;
  fuelCostGbp: number;
  elevationGainFt: number;
  privacyZoneFuzzedRadiusM: number;
  roadDesignation: string;
  narrative: string;
}

export interface BuildComponent {
  id: string;
  category: 'Suspension' | 'Exhaust' | 'Wheels' | 'Brakes' | 'Powertrain';
  currentPart: string;
  previousPart: string;
  rationale: string;
  provenance: 'PRO CERTIFIED' | 'INVOICE STAMP' | 'OWNER LOGGED';
  costGbp?: number;
}

export interface MemoryEntry {
  id: string;
  date: string;
  mileage: number;
  title: string;
  description: string;
  tier: 'REGULATORY DVSA' | 'PRO CERTIFIED' | 'OWNER MILESTONE';
  issuer: string;
  costGbp?: number;
}

export interface SubsystemHealth {
  name: string;
  component: string;
  percentage: number;
  type: 'MEASURED' | 'ESTIMATED WEAR';
  status: string;
  details: { label: string; value: string }[];
}

export interface TyreStatus {
  position: 'FL' | 'FR' | 'RL' | 'RR';
  label: string;
  treadMm: number;
  psi: number;
  status: 'good' | 'advisory' | 'critical';
  notes: string;
}
