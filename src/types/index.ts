// Domain models aligned strictly with GARAGE - PRODUCT + ENGINEERING RULES

export type ProvenanceType = 
  | 'owner_experience'
  | 'community_opinion'
  | 'verified_professional'
  | 'official_information'
  | 'vehicle_data'
  | 'estimated_information'
  | 'sponsored_content';

export interface User {
  id: string;
  isPrivate: boolean;
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  locationRegion?: string; // Broad region only (e.g., "Surrey, UK"), never precise address
  garageIds: string[];
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerIsAnonymous: boolean;
  name: string; // e.g. "MAYA"
  make: string;
  model: string;
  trim?: string;
  year: number;
  heroImageUrl: string;
  galleryImages: string[];
  vrmPlate: string; // Stored securely
  isPlateBlurredDefault: boolean;
  spec: {
    engine: string;
    transmission: string;
    drivetrain: string;
    powerBhp: number;
    factoryColor: string;
    mileageCurrent: number;
  };
  metrics: {
    followerCount: number;
    drivesCount: number;
    buildVersionsCount: number;
    memoryEventsCount: number;
  };
}

export interface VehicleHealth {
  vehicleId: string;
  lastUpdated: string;
  subsystems: {
    name: string;
    metricLabel: string;
    metricValue: string | number;
    status: 'good' | 'attention' | 'critical';
    confidence: 'measured' | 'recorded' | 'estimated' | 'user_entered';
    notes: string;
  }[];
  tyres: {
    brand: string;
    model: string;
    frontTreadMm: number;
    rearTreadMm: number;
    confidence: 'measured' | 'user_entered';
    advisoryNotice?: string;
  };
}

export interface Drive {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleModel: string;
  driveNumber: number;
  title: string;
  date: string;
  routeTitle: string; // e.g., "London → Cotswolds"
  distanceMiles: number;
  durationMinutes: number;
  efficiencyMpg?: number;
  costTotalGbp?: number;
  elevationGainFt?: number;
  weather?: string;
  approximateStartRegion: string; // Never exact address
  approximateEndRegion: string;
  privacyProtectedEndpoints: boolean;
  photos: string[];
  ownerNotes: string;
  likesCount: number;
  savesCount: number;
}

export interface BuildVersion {
  versionCode: string; // "BUILD 01", "BUILD 02", "BUILD 03"
  date: string;
  title: string;
  summary: string;
  partsAdded: {
    category: 'Suspension' | 'Exhaust' | 'Wheels' | 'Brakes' | 'Powertrain' | 'Aero' | 'Interior';
    componentName: string;
    previousPart?: string;
    rationale: string;
    costGbp?: number;
    provenance: 'verified_professional' | 'owner_experience';
  }[];
  photos: string[];
}

export interface Build {
  id: string;
  vehicleId: string;
  currentVersion: string;
  versions: BuildVersion[];
}

export interface MemoryEvent {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  title: string;
  category: 'purchase' | 'service' | 'repair' | 'modification' | 'trip' | 'milestone' | 'tyres' | 'mot';
  description: string;
  provenance: ProvenanceType;
  verifiedSignatory?: string; // e.g. "DVSA MOT API" or "Evolve Automotive (Garage Pro)"
  costGbp?: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  serviceType: string;
  partsReplaced: string[];
  performedBy: 'self' | 'professional';
  proBusinessId?: string;
  invoiceDocumentPrivate?: boolean;
}

export interface CostRecord {
  id: string;
  vehicleId: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'tax' | 'tyres' | 'modifications';
  amountGbp: number;
  date: string;
  odometer?: number;
  litresOrUnits?: number;
  costPerMileCalculated?: number;
}

export type CommunityCategory = 
  | 'technical_expert' 
  | 'motorsport_performance' 
  | 'aesthetic_subculture' 
  | 'lifestyle_adventure' 
  | 'brand_era';

export interface Community {
  id: string;
  name: string;
  category: CommunityCategory;
  subcategory: string;
  type: 'model' | 'interest' | 'local';
  description: string;
  memberCount: number;
  activeCarsCount: number;
  coverImageUrl: string;
  badgeEmoji: string;
  tags: string[];
  featuredSpec?: string;
  activeConvoyOrChallenge?: string;
  topVehicles: { name: string; model: string; imageUrl: string; spec: string }[];
  verifiedProPartner?: { name: string; specialty: string };
}

export interface CommunityPost {
  id: string;
  authorType: 'car' | 'user' | 'professional';
  authorVehicleId?: string;
  authorVehicleName?: string;
  authorVehicleModel?: string;
  authorVehicleYear?: number;
  postType: 
    | 'CAR_POST' 
    | 'DRIVE' 
    | 'BUILD_UPDATE' 
    | 'MILESTONE' 
    | 'QUESTION' 
    | 'GUIDE' 
    | 'MAINTENANCE_UPDATE' 
    | 'EVENT' 
    | 'CAR_STORY';
  title?: string;
  content: string;
  mediaUrls: string[];
  provenanceTag: ProvenanceType;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  linkedDriveId?: string;
  linkedBuildVersion?: string;
}

export interface Professional {
  id: string;
  businessName: string;
  category: 
    | 'Mechanic' 
    | 'Mobile Mechanic' 
    | 'Detailer' 
    | 'Tyre Specialist' 
    | 'Inspector' 
    | 'Restorer' 
    | 'Fabricator' 
    | 'Photographer' 
    | 'EV Specialist';
  verifiedStatus: boolean;
  locationArea: string;
  bio: string;
  verifiedJobsCount: number;
  ratingScore: number;
  specialistMakes: string[];
  verifiedPortfolio: {
    vehicleName: string;
    workSummary: string;
    date: string;
  }[];
}

export interface GarageEvent {
  id: string;
  title: string;
  date: string;
  locationRegion: string;
  organizerName: string;
  attendeesCount: number;
  coverImageUrl: string;
  type: 'meet' | 'drive' | 'track_day' | 'show';
}
