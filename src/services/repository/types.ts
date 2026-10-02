import type { Vehicle, CommunityPost } from '../../types';
import type { CertifiedServiceStamp, CertifiedWorkshop } from '../../core/workshop/WorkshopStampEngine';

/**
 * DATUM ATELIER // ENTERPRISE REPOSITORY INTERFACES
 * 
 * Institutional Domain Contracts adhering to CQRS, Event Sourcing,
 * and Zero-Trust Privacy specifications (ADR-0006).
 */

export interface CustodianIdentity {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string;
  bio: string;
  role: 'CUSTODIAN' | 'WORKSHOP_OPERATOR' | 'MARQUE_INSPECTOR' | 'ANONYMOUS_OBSERVER';
  reputationPoints: number;
  publicKey: string;
  isVerifiedPro: boolean;
}

export type LedgerEventType = 
  | 'CHASSIS_GENESIS'
  | 'MILEAGE_ACCUMULATION'
  | 'SERVICE_STAMP_COMMITTED'
  | 'EXPEDITION_RECORDED'
  | 'DYNO_BENCH_CALIBRATION'
  | 'HARDWARE_COMPONENT_FITTED'
  | 'ACOUSTIC_FINGERPRINT_NOTARIZED'
  | 'CUSTOMS_CARNET_STAMPED';

export interface ProvenanceLedgerEvent {
  eventId: string;
  vehicleId: string;
  eventType: LedgerEventType;
  payload: Record<string, any>;
  actorHandle: string;
  actorPublicKey: string;
  eventSignatureHash: string;
  previousEventHash: string;
  timestamp: string;
}

export interface IVehicleRepository {
  getVehicleById(id: string): Promise<Vehicle | null>;
  listVehicles(): Promise<Vehicle[]>;
  getProvenanceEvents(vehicleId: string): Promise<ProvenanceLedgerEvent[]>;
  appendLedgerEvent(event: Omit<ProvenanceLedgerEvent, 'eventId' | 'eventSignatureHash' | 'previousEventHash' | 'timestamp'>): Promise<ProvenanceLedgerEvent>;
  getOdometerMileage(vehicleId: string): Promise<number>;
  getProvenanceScore(vehicleId: string): Promise<number>;
}

export interface IFeedRepository {
  listPosts(filter?: string, page?: number, limit?: number): Promise<CommunityPost[]>;
  getPostById(postId: string): Promise<CommunityPost | null>;
  createPost(newPost: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'repliesCount'>): Promise<CommunityPost>;
  toggleRespect(postId: string, custodianHandle: string): Promise<{ respectsCount: number; respected: boolean }>;
  addComment(postId: string, authorHandle: string, text: string): Promise<{ id: string; author: string; text: string; timeAgo: string }>;
  subscribeToFeed(listener: (updatedPosts: CommunityPost[]) => void): () => void;
}

export interface IWorkshopRepository {
  listWorkshops(): Promise<CertifiedWorkshop[]>;
  getWorkshopById(id: string): Promise<CertifiedWorkshop | null>;
  listStamps(vehicleId?: string): Promise<CertifiedServiceStamp[]>;
  issueStamp(stamp: CertifiedServiceStamp): Promise<CertifiedServiceStamp>;
  verifyChain(vehicleId?: string): Promise<{ isValid: boolean; totalVerified: number; brokenAtStampId?: string }>;
  subscribeToStamps(listener: (stamps: CertifiedServiceStamp[]) => void): () => void;
}

export interface IAuthRepository {
  getCurrentCustodian(): Promise<CustodianIdentity>;
  switchCustodian(handle: string): Promise<CustodianIdentity>;
  listAvailablePersonas(): Promise<CustodianIdentity[]>;
  isCertifiedMechanic(): Promise<boolean>;
}
