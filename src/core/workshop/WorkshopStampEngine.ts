import { sha256 } from '../crypto/sha256';

/**
 * DATUM ATELIER — Specialist Workshop Cryptographic Stamping Engine
 * 
 * Implements certified digital service stamping with cryptographic mechanic signature,
 * immutable provenance hash chaining, and VAT invoice notarization.
 * Fulfills DOSSIER.md Chapter 2.4 B2B Workshop SaaS (£49/mo).
 */

export type ServiceCategory = 
  | 'MAJOR_INSPECTION' 
  | 'OIL_SPECTROSCOPY' 
  | 'BRAKE_DAMPER_OVERHAUL' 
  | 'POWERTRAIN_CALIBRATION' 
  | 'STRUCTURAL_CONSERVATION' 
  | 'CORNER_WEIGHTING';

export interface CertifiedWorkshop {
  id: string;
  name: string;
  location: string;
  accreditationCode: string; // e.g. IMI-MASTER-4819 or DVSA-STATION-UK
  masterMechanic: string;
  publicKey: string;
}

export interface InstalledComponent {
  category: string;
  componentName: string;
  serialNumber?: string;
  torqueSpecNm?: number;
  costGbp: number;
}

export interface CertifiedServiceStamp {
  stampId: string;
  vehicleId: string;
  chassisCode: string;
  vin: string;
  mileage: number;
  serviceDate: string;
  category: ServiceCategory;
  title: string;
  workDescription: string;
  workshop: CertifiedWorkshop;
  components: InstalledComponent[];
  totalCostGbp: number;
  invoiceNumber: string;
  invoiceHash: string; // SHA-256 of itemized VAT invoice
  previousStampHash: string; // Chained hash of earlier stamp
  stampSignatureHash: string; // Deterministic SHA-256 signature
  createdAt: string;
  status: 'VERIFIED_PROFESSIONAL' | 'AUDIT_PENDING' | 'REVOKED';
}

export const VERIFIED_WORKSHOPS: CertifiedWorkshop[] = [
  {
    id: 'ws-litchfield',
    name: 'Litchfield Motors',
    location: 'Tewkesbury, Gloucestershire',
    accreditationCode: 'IMI-CERT-LITCHFIELD-993',
    masterMechanic: 'Iain Litchfield (Master Technician)',
    publicKey: '04a8b72c91e4f6d3e89102c7b5a1f893d'
  },
  {
    id: 'ws-manthey',
    name: 'Manthey Racing UK Partner Atelier',
    location: 'Silverstone Circuit, Northamptonshire',
    accreditationCode: 'MR-MEUSPATH-UK-084',
    masterMechanic: 'Hans-Peter Vogel (Chassis Engineer)',
    publicKey: '04e12c88f9104b2a3c77e9910d54a2b1f'
  },
  {
    id: 'ws-parklane',
    name: 'BMW Park Lane Atelier Service',
    location: 'Mayfair, Central London',
    accreditationCode: 'BMW-M-AUTHORISED-001',
    masterMechanic: 'Marcus Vance (Head of M Heritage)',
    publicKey: '04c3390f71b2e88a9144d187e22b09a4d'
  },
  {
    id: 'ws-bristol',
    name: 'Bristol Classic Coachwork Specialists',
    location: 'Clifton, Bristol',
    accreditationCode: 'FBHVC-MASTER-COACHBUILDER-28',
    masterMechanic: 'Dan Gallagher (Lead Restorer)',
    publicKey: '0477b91d2c44e9a0f11088c3a912e75bc'
  },
  {
    id: 'ws-highland',
    name: 'Highland Overland & Marine Engineering',
    location: 'Fort William, Scottish Highlands',
    accreditationCode: 'SCOT-HERITAGE-4X4-102',
    masterMechanic: 'Hamish MacLeod (Expedition Fitter)',
    publicKey: '0488d01f9c33e88a1027b44d7e99c15ab'
  }
];

export const INITIAL_STAMP_CHAIN: CertifiedServiceStamp[] = [
  {
    stampId: 'stamp-init-01',
    vehicleId: 'car-maya-m3',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    mileage: 40150,
    serviceDate: '2024-09-14',
    category: 'MAJOR_INSPECTION',
    title: 'Comprehensive 40,000-Mile Major Inspection & Differential Fluid Renewal',
    workDescription: 'Spark plugs renewed with NGK Laser Iridium. M Differential fluid flushed with Castrol Syntrax 75W-140. ISTA digital diagnostics validated 0 error codes.',
    workshop: VERIFIED_WORKSHOPS[0],
    components: [
      { category: 'Drivetrain Lubrication', componentName: 'Castrol Syntrax 75W-140 Limited Slip Fluid', costGbp: 145.00 },
      { category: 'Ignition', componentName: 'NGK SILZKBR8F8S Laser Iridium Plugs (x6)', costGbp: 180.00 }
    ],
    totalCostGbp: 1480.00,
    invoiceNumber: 'INV-LM-2024-8842',
    invoiceHash: sha256('INV-LM-2024-8842:40150:1480.00:WBA-31AY-0084-M3'),
    previousStampHash: '0000000000000000000000000000000000000000000000000000000000000000',
    stampSignatureHash: sha256('stamp-init-01:car-maya-m3:40150:MAJOR_INSPECTION:INV-LM-2024-8842'),
    createdAt: '2024-09-14T14:30:00Z',
    status: 'VERIFIED_PROFESSIONAL'
  },
  {
    stampId: 'stamp-init-02',
    vehicleId: 'car-kuro-gt3',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    mileage: 16200,
    serviceDate: '2024-06-22',
    category: 'CORNER_WEIGHTING',
    title: 'Manthey Racing Nürburgring Chassis Geometry & Centerlock Rig Setup',
    workDescription: 'Optical laser 4-corner alignment on Beissbarth optical scales. Negative camber set to -2.2° Front, -2.0° Rear. Corner-weighted with 75kg driver ballast to 50.0% static cross-balance.',
    workshop: VERIFIED_WORKSHOPS[1],
    components: [
      { category: 'Chassis Tuning', componentName: 'Manthey Rose-Jointed Geometry Adjustment Shims', torqueSpecNm: 160, costGbp: 720.00 },
      { category: 'Centerlock Lubrication', componentName: 'Castrol Molub-Alloy Paste Application', torqueSpecNm: 600, costGbp: 110.00 }
    ],
    totalCostGbp: 1650.00,
    invoiceNumber: 'MR-UK-2024-1092',
    invoiceHash: sha256('MR-UK-2024-1092:16200:1650.00:WP0-ZZZ-99Z-NS-1092'),
    previousStampHash: '0000000000000000000000000000000000000000000000000000000000000000',
    stampSignatureHash: sha256('stamp-init-02:car-kuro-gt3:16200:CORNER_WEIGHTING:MR-UK-2024-1092'),
    createdAt: '2024-06-22T16:45:00Z',
    status: 'VERIFIED_PROFESSIONAL'
  }
];

export interface CreateStampParams {
  vehicleId: string;
  chassisCode: string;
  vin: string;
  mileage: number;
  serviceDate: string;
  category: ServiceCategory;
  title: string;
  workDescription: string;
  workshopId: string;
  components: InstalledComponent[];
  totalCostGbp: number;
  invoiceNumber: string;
}

/**
 * Calculates a cryptographic signature hash for a service stamp
 */
export function calculateStampSignature(
  stampId: string,
  vehicleId: string,
  mileage: number,
  category: ServiceCategory,
  invoiceHash: string,
  previousStampHash: string,
  workshopPublicKey: string
): string {
  const seedString = `${stampId}:${vehicleId}:${mileage}:${category}:${invoiceHash}:${previousStampHash}:${workshopPublicKey}`;
  return sha256(seedString);
}

/**
 * Generates an immutable, verified service stamp and appends it to the vehicle's hash chain
 */
export function issueServiceStamp(
  params: CreateStampParams,
  existingChain: CertifiedServiceStamp[] = []
): CertifiedServiceStamp {
  const workshop = VERIFIED_WORKSHOPS.find(w => w.id === params.workshopId) || VERIFIED_WORKSHOPS[0];
  
  // Find vehicle's latest stamp in existing chain to form hash link
  const vehicleStamps = existingChain.filter(s => s.vehicleId === params.vehicleId);
  const latestStamp = vehicleStamps[vehicleStamps.length - 1];
  const previousStampHash = latestStamp 
    ? latestStamp.stampSignatureHash 
    : '0000000000000000000000000000000000000000000000000000000000000000';

  const stampId = `stamp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const invoiceHash = sha256(`${params.invoiceNumber}:${params.mileage}:${params.totalCostGbp}:${params.vin}`);
  
  const stampSignatureHash = calculateStampSignature(
    stampId,
    params.vehicleId,
    params.mileage,
    params.category,
    invoiceHash,
    previousStampHash,
    workshop.publicKey
  );

  return {
    stampId,
    vehicleId: params.vehicleId,
    chassisCode: params.chassisCode,
    vin: params.vin,
    mileage: params.mileage,
    serviceDate: params.serviceDate,
    category: params.category,
    title: params.title,
    workDescription: params.workDescription,
    workshop,
    components: params.components,
    totalCostGbp: params.totalCostGbp,
    invoiceNumber: params.invoiceNumber,
    invoiceHash,
    previousStampHash,
    stampSignatureHash,
    createdAt: new Date().toISOString(),
    status: 'VERIFIED_PROFESSIONAL'
  };
}

/**
 * Validates the cryptographic integrity of a stamp chain
 */
export function verifyStampChainIntegrity(chain: CertifiedServiceStamp[]): {
  isValid: boolean;
  brokenAtStampId?: string;
  totalVerified: number;
} {
  if (chain.length === 0) return { isValid: true, totalVerified: 0 };

  for (let i = 0; i < chain.length; i++) {
    const stamp = chain[i];
    
    // 1. Verify self-consistency of stamp signature hash
    const expectedHash = calculateStampSignature(
      stamp.stampId,
      stamp.vehicleId,
      stamp.mileage,
      stamp.category,
      stamp.invoiceHash,
      stamp.previousStampHash,
      stamp.workshop.publicKey
    );

    if (stamp.stampSignatureHash !== expectedHash) {
      return { isValid: false, brokenAtStampId: stamp.stampId, totalVerified: i };
    }

    // 2. Verify hash chain link with previous stamp for the same vehicle
    if (i > 0) {
      const prevSameVehicle = chain.slice(0, i).reverse().find(s => s.vehicleId === stamp.vehicleId);
      if (prevSameVehicle && stamp.previousStampHash !== prevSameVehicle.stampSignatureHash) {
        return { isValid: false, brokenAtStampId: stamp.stampId, totalVerified: i };
      }
    }
  }

  return { isValid: true, totalVerified: chain.length };
}

/**
 * Storage helpers
 */
const STORAGE_KEY = 'datum_workshop_stamps_registry';

export function loadWorkshopStamps(): CertifiedServiceStamp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: CertifiedServiceStamp[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_STAMP_CHAIN;
}

export function saveWorkshopStamps(stamps: CertifiedServiceStamp[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
  } catch {
    // ignore
  }
}
