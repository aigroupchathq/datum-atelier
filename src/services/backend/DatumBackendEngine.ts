/**
 * DATUM Unified Domain Gateway & Telemetry Stream Engine
 * 
 * Singleton microservice coordinator that orchestrates all 5 core engines:
 * 1. MerkleDagLedger — Provenance chain
 * 2. ZeroKnowledgeGeofence — 800m privacy cloaking
 * 3. GripPhysicsEngine — Dynamic friction & thermodynamics
 * 4. CanBusStreamDecoder — CAN-bus telemetry
 * 5. CarnetVaultEngine — Time-locked transit tokens
 */

import { MerkleDagLedger } from '../../core/provenance/MerkleDagLedger';
import type { MaintenanceEventBlock } from '../../core/provenance/MerkleDagLedger';
import { ZeroKnowledgeGeofence } from '../../core/privacy/ZeroKnowledgeGeofence';
import type { GeoCoordinate, CloakedLocation } from '../../core/privacy/ZeroKnowledgeGeofence';
import { GripPhysicsEngine } from '../../core/radar/GripPhysicsEngine';
import type { EnvironmentalConditions, TyreProfile, GripAnalysisResult } from '../../core/radar/GripPhysicsEngine';
import { CanBusStreamDecoder } from '../../core/telemetry/CanBusStreamDecoder';
import type { DecodedTelemetryPacket } from '../../core/telemetry/CanBusStreamDecoder';
import { CarnetVaultEngine } from '../../core/carnet/CarnetVaultEngine';

export interface BackendSystemStatus {
  ledger: {
    rootHash: string;
    blockCount: number;
    lastBlockTimestamp: string | null;
  };
  telemetry: DecodedTelemetryPacket | null;
  geofence: {
    activeCloaks: number;
    lastProofId: string | null;
  };
  grip: GripAnalysisResult | null;
  carnet: {
    activeTokens: number;
    totalCertificates: number;
  };
  uptime: number;
  simulationHz: number;
}

export interface TelemetryStreamFrame {
  timestamp: number;
  canDump: string;
  decoded: DecodedTelemetryPacket;
  gripSnapshot: GripAnalysisResult | null;
}

export class DatumBackendEngine {
  private static instance: DatumBackendEngine;

  private ledger: MerkleDagLedger;
  private geofence: ZeroKnowledgeGeofence;
  private gripEngine: GripPhysicsEngine;
  private canDecoder: CanBusStreamDecoder;
  private vaultEngine: CarnetVaultEngine;

  private startTime: number;
  private simTime: number;
  private subscribers: Set<(frame: TelemetryStreamFrame) => void>;
  private intervalId: ReturnType<typeof setInterval> | null;
  private isStreaming: boolean;
  private cacheL1: Map<string, { data: unknown; ttl: number; cachedAt: number }>;

  private _simulationHz: number;
  private lastTelemetry: DecodedTelemetryPacket | null;
  private lastGrip: GripAnalysisResult | null;
  private activeCloakCount: number;
  private lastProofId: string | null;
  private seeded: boolean;

  private constructor() {
    this.ledger = new MerkleDagLedger();
    this.geofence = new ZeroKnowledgeGeofence();
    this.gripEngine = new GripPhysicsEngine();
    this.canDecoder = new CanBusStreamDecoder();
    this.vaultEngine = new CarnetVaultEngine();

    this.startTime = Date.now();
    this.simTime = 0;
    this.subscribers = new Set();
    this.intervalId = null;
    this.isStreaming = false;
    this.cacheL1 = new Map();
    this._simulationHz = 0;
    this.lastTelemetry = null;
    this.lastGrip = null;
    this.activeCloakCount = 0;
    this.lastProofId = null;
    this.seeded = false;
  }

  public static getInstance(): DatumBackendEngine {
    if (!DatumBackendEngine.instance) {
      DatumBackendEngine.instance = new DatumBackendEngine();
    }
    return DatumBackendEngine.instance;
  }

  public getLedger(): MerkleDagLedger {
    return this.ledger;
  }

  public getGeofence(): ZeroKnowledgeGeofence {
    return this.geofence;
  }

  public getGripEngine(): GripPhysicsEngine {
    return this.gripEngine;
  }

  public getCanDecoder(): CanBusStreamDecoder {
    return this.canDecoder;
  }

  public getVaultEngine(): CarnetVaultEngine {
    return this.vaultEngine;
  }

  public getSystemStatus(): BackendSystemStatus {
    const blocks = this.ledger.getBlocks();
    const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
    const allTokens = this.vaultEngine.getAllTokens();

    return {
      ledger: {
        rootHash: this.ledger.getRootHash(),
        blockCount: blocks.length,
        lastBlockTimestamp: lastBlock ? lastBlock.timestamp : null,
      },
      telemetry: this.lastTelemetry,
      geofence: {
        activeCloaks: this.activeCloakCount,
        lastProofId: this.lastProofId,
      },
      grip: this.lastGrip,
      carnet: {
        activeTokens: allTokens.filter(t => t.status === 'ACTIVE').length,
        totalCertificates: this.vaultEngine.getAllCertificates().length,
      },
      uptime: (Date.now() - this.startTime) / 1000,
      simulationHz: this._simulationHz,
    };
  }

  public startTelemetryStream(hz: number = 10): void {
    if (this.isStreaming) return;
    this._simulationHz = hz;
    const intervalMs = 1000 / hz;
    this.isStreaming = true;

    this.intervalId = setInterval(() => {
      this.simTime += intervalMs / 1000;
      const timestamp = Date.now();

      // Generate simulated CAN frame from the decoder's built-in simulator
      const frame = this.canDecoder.generateSimulatedFrame(this.simTime);
      const decoded = this.canDecoder.decodeFrame(frame);
      this.lastTelemetry = decoded;

      // Format candump string
      const canDump = this.canDecoder.formatCanDump(frame);

      // Run grip physics evaluation every 5th frame (~2 Hz grip updates)
      let gripSnapshot: GripAnalysisResult | null = this.lastGrip;
      if (Math.round(this.simTime * hz) % 5 === 0) {
        const env: EnvironmentalConditions = {
          ambientTempC: 14,
          roadSurfaceTempC: 11,
          precipitationMmH: 0.2,
          surfaceWaterFilmDepthMm: 0.3,
          relativeHumidityPct: 72,
          elevationMeters: 380,
          roadMaterial: 'ASPHALT_HIGH_FRICTION',
        };
        const tyre: TyreProfile = {
          compound: 'SEMI_SLICK_CUP2',
          tyrePressureBar: 2.4,
          tyreTempC: 42 + Math.sin(this.simTime * 0.3) * 15,
          treadDepthMm: 5.2,
          widthMm: 275,
          wheelLoadKg: 420,
        };
        gripSnapshot = this.gripEngine.evaluateGrip(env, tyre, decoded.speedKph);
        this.lastGrip = gripSnapshot;
      }

      const streamFrame: TelemetryStreamFrame = {
        timestamp,
        canDump,
        decoded,
        gripSnapshot,
      };

      for (const subscriber of this.subscribers) {
        try {
          subscriber(streamFrame);
        } catch (e) {
          console.error('[DatumBackend] Subscriber error:', e);
        }
      }
    }, intervalMs);
  }

  public stopTelemetryStream(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isStreaming = false;
    this._simulationHz = 0;
  }

  public subscribe(callback: (frame: TelemetryStreamFrame) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public cloakLocation(raw: GeoCoordinate): CloakedLocation {
    this.activeCloakCount++;
    return this.geofence.cloakCoordinates(raw);
  }

  public evaluatePassGrip(env: EnvironmentalConditions, tyre: TyreProfile, speed: number): GripAnalysisResult {
    return this.gripEngine.evaluateGrip(env, tyre, speed);
  }

  public appendMaintenanceBlock(
    vin: string,
    eventType: MaintenanceEventBlock['eventType'],
    details: string,
    techPubKey: string,
    signature: string,
    mileage: number,
    torqueSpecsNm?: number,
    dynoBhp?: number
  ): MaintenanceEventBlock {
    return this.ledger.appendBlock(vin, eventType, details, techPubKey, signature, mileage, torqueSpecsNm, dynoBhp);
  }

  public cacheGet(key: string): unknown | null {
    const entry = this.cacheL1.get(key);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > entry.ttl) {
      this.cacheL1.delete(key);
      return null;
    }
    return entry.data;
  }

  public cacheSet(key: string, data: unknown, ttlMs: number): void {
    this.cacheL1.set(key, { data, ttl: ttlMs, cachedAt: Date.now() });
  }

  /**
   * Seeds realistic demo data into the Merkle DAG ledger and Carnet vault.
   */
  public seedDemoData(): void {
    if (this.seeded) return;
    this.seeded = true;

    const vin = 'WBS-G80-COMP-UK-2023';
    const techKey = 'PUB_KEY_ATELIER_TECH_001';
    const sig = 'ED25519_SIG_DEMO';

    this.ledger.appendBlock(
      vin, 'OIL_SERVICE',
      'Castrol EDGE 5W-30 LL IV — 6.5L full synthetic change with OEM Mann HU6015z filter',
      techKey, sig, 1247
    );
    this.ledger.appendBlock(
      vin, 'BRAKE_FLUID',
      'Brembo DOT 5.1 full system flush & bleed — front AP Racing calipers verified',
      techKey, sig, 8420
    );
    this.ledger.appendBlock(
      vin, 'DYNO_TUNE',
      'MHD Stage 1+ flash — 510 BHP baseline pull confirmed on Dynapack AWD rollers',
      techKey, sig, 12650, 650, 510
    );
    this.ledger.appendBlock(
      vin, 'VALVE_CLEARANCE',
      'S58 intake & exhaust shim inspection — all 6 cylinders within 0.02mm factory spec',
      techKey, sig, 24800, 25
    );

    // Issue demo carnet token
    this.vaultEngine.issueToken(
      vin,
      'OWNER_PUB_KEY_MAYA_001',
      ['GB', 'FR', 'DE', 'IT', 'CH', 'AT'],
      'ATA_CARNET',
      365
    );
  }
}

export const datumBackend = DatumBackendEngine.getInstance();
