import { sha256 } from '../crypto/sha256';

export interface CustodianRecord {
  custodianId: string;
  displayName: string;
  custodyStartDate: string;
  custodyEndDate?: string;
  startMileage: number;
  endMileage?: number;
  status: 'ACTIVE' | 'HISTORICAL';
  sovereignSignature: string;
  transferNotes?: string;
  locationRegion: string;
}

export interface CustodyHandoverToken {
  tokenId: string;
  vehicleId: string;
  vin: string;
  chassisCode: string;
  currentMileage: number;
  fromCustodianId: string;
  fromCustodianName: string;
  intendedRecipientName: string;
  createdAt: string;
  expiresAt: string;
  authPasscodeHash: string;
  stateChecksum: string;
  handoverSignature: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'REVOKED';
}

export interface VehicleCustodyChain {
  vehicleId: string;
  vin: string;
  chassisCode: string;
  activeCustodian: CustodianRecord;
  custodyHistory: CustodianRecord[];
  totalCustodians: number;
  provenanceIntegrityHash: string;
  lastUpdated: string;
}

export interface HandoverResult {
  success: boolean;
  message: string;
  updatedChain?: VehicleCustodyChain;
  receiptHash?: string;
}

/**
 * Generates an initial authentic custody chain for seed atelier vehicles.
 */
export const SEED_CUSTODY_CHAINS: Record<string, VehicleCustodyChain> = {
  'car-maya-m3': {
    vehicleId: 'car-maya-m3',
    vin: 'WBS-8M92-0004-MAYAM3',
    chassisCode: 'G80-M3-COMP-LCI',
    activeCustodian: {
      custodianId: 'custodian-maya-vane',
      displayName: 'Lady Maya Vance',
      custodyStartDate: '2023-04-12T10:00:00.000Z',
      startMileage: 1200,
      status: 'ACTIVE',
      locationRegion: 'Gloucestershire / Cotswolds (UK)',
      sovereignSignature: '0x8f2a4c9b1e7d3f5a8c2e4b6d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7',
      transferNotes: 'Acquired via BMW Park Lane VIP handover. Continuous private garage climate storage.',
    },
    custodyHistory: [
      {
        custodianId: 'custodian-bmw-parklane',
        displayName: 'BMW Park Lane Executive Fleet',
        custodyStartDate: '2023-01-15T09:00:00.000Z',
        custodyEndDate: '2023-04-12T09:59:59.000Z',
        startMileage: 0,
        endMileage: 1200,
        status: 'HISTORICAL',
        locationRegion: 'London, Mayfair (UK)',
        sovereignSignature: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
        transferNotes: 'PDI run-in inspection completed. Zero launch controls activated.',
      }
    ],
    totalCustodians: 2,
    provenanceIntegrityHash: '0x7e3f892a10b49c71e54911dca943be87f1c4e902b78d2a138940ef91823abce1',
    lastUpdated: '2026-10-02T18:00:00.000Z',
  },
  'car-kuro-gt3': {
    vehicleId: 'car-kuro-gt3',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    chassisCode: '992-GT3-TOURING',
    activeCustodian: {
      custodianId: 'custodian-alexander-chen',
      displayName: 'Alexander Chen',
      custodyStartDate: '2024-03-01T11:30:00.000Z',
      startMileage: 4200,
      status: 'ACTIVE',
      locationRegion: 'Surrey Hills (UK)',
      sovereignSignature: '0x992b4a1c6e8d2f4a7c1e3b5d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6',
      transferNotes: 'Handover executed at Bicester Heritage. DME interrogated with zero rev over-ranges.',
    },
    custodyHistory: [
      {
        custodianId: 'custodian-porsche-zuffenhausen',
        displayName: 'Dr. Ing. h.c. F. Porsche AG Factory Delivery',
        custodyStartDate: '2022-09-10T08:00:00.000Z',
        custodyEndDate: '2024-03-01T11:29:59.000Z',
        startMileage: 12,
        endMileage: 4200,
        status: 'HISTORICAL',
        locationRegion: 'Stuttgart-Zuffenhausen (DE)',
        sovereignSignature: '0x44c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
        transferNotes: 'Factory collection Euro-delivery tour across Black Forest and Grossglockner.',
      }
    ],
    totalCustodians: 2,
    provenanceIntegrityHash: '0x88b1f2e4c3a9d0e1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
    lastUpdated: '2026-10-02T19:30:00.000Z',
  },
  'car-e30-retromod': {
    vehicleId: 'car-e30-retromod',
    vin: 'WBA-AF92-0019-E30',
    chassisCode: 'E30-318IS-SLICKTOP',
    activeCustodian: {
      custodianId: 'custodian-dan-retromod',
      displayName: 'Dan RetroMod',
      custodyStartDate: '2019-06-15T14:00:00.000Z',
      startMileage: 112000,
      status: 'ACTIVE',
      locationRegion: 'Bristol / Somerset (UK)',
      sovereignSignature: '0x308a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      transferNotes: 'Complete mechanical restoration: blueprinted M42 motor, Getrag 240 rebuild, BBS basketweaves.',
    },
    custodyHistory: [
      {
        custodianId: 'custodian-arthur-pendleton',
        displayName: 'Arthur Pendleton (Original Owner)',
        custodyStartDate: '1991-08-01T10:00:00.000Z',
        custodyEndDate: '2019-06-15T13:59:59.000Z',
        startMileage: 0,
        endMileage: 112000,
        status: 'HISTORICAL',
        locationRegion: 'Bath, Somerset (UK)',
        sovereignSignature: '0x1991a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
        transferNotes: 'Purchased new from Westerly BMW. Dry-stored in heated brick garage.',
      }
    ],
    totalCustodians: 2,
    provenanceIntegrityHash: '0x308f2a1b4c9d0e1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    lastUpdated: '2026-10-02T12:00:00.000Z',
  }
};

/**
 * Computes deterministic cryptographic hash representing the unbroken chain of custody.
 */
export function calculateCustodyHash(
  vehicleId: string,
  vin: string,
  active: CustodianRecord,
  history: CustodianRecord[]
): string {
  const payload = JSON.stringify({
    vehicleId,
    vin,
    active: {
      id: active.custodianId,
      name: active.displayName,
      start: active.custodyStartDate,
      mileage: active.startMileage,
      sig: active.sovereignSignature,
    },
    history: history.map(h => ({
      id: h.custodianId,
      name: h.displayName,
      start: h.custodyStartDate,
      end: h.custodyEndDate,
      miles: [h.startMileage, h.endMileage],
      sig: h.sovereignSignature,
    }))
  });
  return '0x' + sha256(payload);
}

/**
 * Generates a time-locked, cryptographically signed handover token.
 */
export function generateCustodyHandoverToken(params: {
  vehicleId: string;
  vin: string;
  chassisCode: string;
  currentMileage: number;
  fromCustodianId: string;
  fromCustodianName: string;
  intendedRecipientName: string;
  authPasscode: string;
  validHours?: number;
}): CustodyHandoverToken {
  const createdAt = new Date().toISOString();
  const validDurationHours = params.validHours || 72; // 72-hour window default for vehicle collection
  const expiresAt = new Date(Date.now() + validDurationHours * 3600 * 1000).toISOString();
  
  const authPasscodeHash = sha256(params.authPasscode.trim().toUpperCase());
  const stateChecksum = sha256(`${params.vin}:${params.currentMileage}:${params.fromCustodianId}`);
  
  const tokenPayload = [
    'DATUM_CUSTODY_HANDOVER_V1',
    params.vehicleId,
    params.vin,
    params.chassisCode,
    params.currentMileage.toString(),
    params.fromCustodianId,
    params.intendedRecipientName,
    createdAt,
    expiresAt,
    authPasscodeHash,
    stateChecksum
  ].join('|');

  const handoverSignature = '0x' + sha256(tokenPayload);
  const tokenId = `TOKEN-CUSTODY-${params.vin.slice(-6)}-${Date.now().toString(36).toUpperCase()}`;

  const token: CustodyHandoverToken = {
    tokenId,
    vehicleId: params.vehicleId,
    vin: params.vin,
    chassisCode: params.chassisCode,
    currentMileage: params.currentMileage,
    fromCustodianId: params.fromCustodianId,
    fromCustodianName: params.fromCustodianName,
    intendedRecipientName: params.intendedRecipientName,
    createdAt,
    expiresAt,
    authPasscodeHash,
    stateChecksum,
    handoverSignature,
    status: 'PENDING',
  };

  saveTokenToStorage(token);
  return token;
}

/**
 * Verifies validity and cryptographic integrity of a custody handover token.
 */
export function verifyCustodyHandoverToken(
  token: CustodyHandoverToken,
  enteredPasscode: string
): { isValid: boolean; reason?: string } {
  // Check expiration
  if (new Date() > new Date(token.expiresAt)) {
    return { isValid: false, reason: 'Custody Handover Token has expired.' };
  }

  if (token.status !== 'PENDING') {
    return { isValid: false, reason: `Token is no longer valid (Status: ${token.status}).` };
  }

  // Verify Passcode
  const computedPasscodeHash = sha256(enteredPasscode.trim().toUpperCase());
  if (computedPasscodeHash !== token.authPasscodeHash) {
    return { isValid: false, reason: 'Incorrect authorization security passcode.' };
  }

  // Verify Signature
  const tokenPayload = [
    'DATUM_CUSTODY_HANDOVER_V1',
    token.vehicleId,
    token.vin,
    token.chassisCode,
    token.currentMileage.toString(),
    token.fromCustodianId,
    token.intendedRecipientName,
    token.createdAt,
    token.expiresAt,
    token.authPasscodeHash,
    token.stateChecksum
  ].join('|');

  const expectedSignature = '0x' + sha256(tokenPayload);
  if (expectedSignature !== token.handoverSignature) {
    return { isValid: false, reason: 'Cryptographic signature mismatch — possible tampering detected.' };
  }

  return { isValid: true };
}

/**
 * Executes sovereign handover from active custodian to the new custodian.
 * The previous custodian is permanently archived into custodyHistory with unbroken DAG provenance.
 */
export function executeCustodyHandover(params: {
  token: CustodyHandoverToken;
  enteredPasscode: string;
  newCustodianDisplayName: string;
  newCustodianRegion: string;
  transferNotes?: string;
}): HandoverResult {
  const verification = verifyCustodyHandoverToken(params.token, params.enteredPasscode);
  if (!verification.isValid) {
    return {
      success: false,
      message: verification.reason || 'Handshake failed verification.',
    };
  }

  const currentChain = loadVehicleCustodyChain(params.token.vehicleId);
  const now = new Date().toISOString();

  // Archive current active custodian to historical sequence
  const departingCustodian: CustodianRecord = {
    ...currentChain.activeCustodian,
    custodyEndDate: now,
    endMileage: params.token.currentMileage,
    status: 'HISTORICAL',
  };

  // Create new active custodian
  const newCustodianId = `custodian-${params.newCustodianDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
  const sovereignSignature = '0x' + sha256(`${params.token.vin}:${newCustodianId}:${now}:${params.token.handoverSignature}`);

  const arrivingCustodian: CustodianRecord = {
    custodianId: newCustodianId,
    displayName: params.newCustodianDisplayName.trim(),
    custodyStartDate: now,
    startMileage: params.token.currentMileage,
    status: 'ACTIVE',
    locationRegion: params.newCustodianRegion.trim(),
    sovereignSignature,
    transferNotes: params.transferNotes || `Handover completed via cryptographic token ${params.token.tokenId}.`,
  };

  const updatedHistory = [departingCustodian, ...currentChain.custodyHistory];
  const newIntegrityHash = calculateCustodyHash(
    currentChain.vehicleId,
    currentChain.vin,
    arrivingCustodian,
    updatedHistory
  );

  const updatedChain: VehicleCustodyChain = {
    ...currentChain,
    activeCustodian: arrivingCustodian,
    custodyHistory: updatedHistory,
    totalCustodians: updatedHistory.length + 1,
    provenanceIntegrityHash: newIntegrityHash,
    lastUpdated: now,
  };

  // Mark token completed
  params.token.status = 'COMPLETED';
  saveTokenToStorage(params.token);
  saveVehicleCustodyChain(currentChain.vehicleId, updatedChain);

  const receiptHash = '0x' + sha256(`${params.token.tokenId}:${sovereignSignature}:${now}`);

  return {
    success: true,
    message: `Custody sovereignty successfully transitioned to ${params.newCustodianDisplayName}.`,
    updatedChain,
    receiptHash,
  };
}

/**
 * Storage helpers with in-memory cache and browser localStorage fallback.
 */
const CUSTODY_STORAGE_PREFIX = 'datum_custody_chain_';
const TOKEN_STORAGE_PREFIX = 'datum_custody_token_';

const memoryCustodyCache = new Map<string, VehicleCustodyChain>();
const memoryTokenCache = new Map<string, CustodyHandoverToken>();

export function loadVehicleCustodyChain(vehicleId: string): VehicleCustodyChain {
  // Check memory cache first
  if (memoryCustodyCache.has(vehicleId)) {
    return memoryCustodyCache.get(vehicleId)!;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(`${CUSTODY_STORAGE_PREFIX}${vehicleId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryCustodyCache.set(vehicleId, parsed);
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  // Fallback to seed or synthesize
  if (SEED_CUSTODY_CHAINS[vehicleId]) {
    return { ...SEED_CUSTODY_CHAINS[vehicleId] };
  }

  const defaultChain: VehicleCustodyChain = {
    vehicleId,
    vin: `VIN-${vehicleId.toUpperCase()}`,
    chassisCode: 'CHASSIS-SPEC',
    activeCustodian: {
      custodianId: `custodian-${vehicleId}`,
      displayName: 'Verified Enthusiast Custodian',
      custodyStartDate: '2023-01-01T00:00:00.000Z',
      startMileage: 5000,
      status: 'ACTIVE',
      locationRegion: 'United Kingdom',
      sovereignSignature: '0x' + sha256(`SEED:${vehicleId}`),
    },
    custodyHistory: [],
    totalCustodians: 1,
    provenanceIntegrityHash: '0x' + sha256(`INITIAL:${vehicleId}`),
    lastUpdated: new Date().toISOString(),
  };

  return defaultChain;
}

export function saveVehicleCustodyChain(vehicleId: string, chain: VehicleCustodyChain): void {
  memoryCustodyCache.set(vehicleId, chain);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(`${CUSTODY_STORAGE_PREFIX}${vehicleId}`, JSON.stringify(chain));
    } catch {
      // ignore
    }
  }
}

function saveTokenToStorage(token: CustodyHandoverToken): void {
  memoryTokenCache.set(token.tokenId, token);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(`${TOKEN_STORAGE_PREFIX}${token.tokenId}`, JSON.stringify(token));
    } catch {
      // ignore
    }
  }
}

export function loadTokenFromStorage(tokenId: string): CustodyHandoverToken | null {
  if (memoryTokenCache.has(tokenId)) {
    return memoryTokenCache.get(tokenId)!;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(`${TOKEN_STORAGE_PREFIX}${tokenId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryTokenCache.set(tokenId, parsed);
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  return null;
}
