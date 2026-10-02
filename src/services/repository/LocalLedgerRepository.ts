import { sha256 } from '../../core/crypto/sha256';
import type { Vehicle, CommunityPost } from '../../types';
import { mockMayaVehicle, mockOtherVehicles, mockFeedPosts } from '../../data/mockData';
import {
  type CertifiedServiceStamp,
  type CertifiedWorkshop,
  VERIFIED_WORKSHOPS,
  INITIAL_STAMP_CHAIN,
  verifyStampChainIntegrity
} from '../../core/workshop/WorkshopStampEngine';
import type {
  CustodianIdentity,
  ProvenanceLedgerEvent,
  IVehicleRepository,
  IFeedRepository,
  IWorkshopRepository,
  IAuthRepository
} from './types';

const INITIAL_PERSONAS: CustodianIdentity[] = [
  {
    id: 'user-maya',
    handle: 'maya_m3',
    name: 'Maya Lin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'BMW M Heritage Custodian · Cotswolds B-Road Regular',
    role: 'CUSTODIAN',
    reputationPoints: 1420,
    publicKey: '043f11c988e001a4bc8819ef001a89c3e',
    isVerifiedPro: true
  },
  {
    id: 'user-kuro',
    handle: 'kuro_gt3',
    name: 'Kenji Sato',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Porsche 992 GT3 Touring · Surrey & Nürburgring Nordschleife',
    role: 'CUSTODIAN',
    reputationPoints: 2180,
    publicKey: '04e12c88f9104b2a3c77e9910d54a2b1f',
    isVerifiedPro: true
  },
  {
    id: 'user-litchfield',
    handle: 'litchfield_eng',
    name: 'Iain Litchfield',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Master Technician & Chassis Architect · Litchfield Motors',
    role: 'WORKSHOP_OPERATOR',
    reputationPoints: 5400,
    publicKey: '04a8b72c91e4f6d3e89102c7b5a1f893d',
    isVerifiedPro: true
  }
];

// In-Memory & Storage Keys
const STORAGE_EVENTS_KEY = 'datum_ledger_events';
const STORAGE_POSTS_KEY = 'datum_posts_ledger';
const STORAGE_STAMPS_KEY = 'datum_workshop_stamps_registry';
const STORAGE_CUSTODIAN_KEY = 'datum_active_custodian';

// =========================================================================
// 1. VEHICLE EVENT SOURCING REPOSITORY
// =========================================================================
export class LocalVehicleRepository implements IVehicleRepository {
  private vehicles: Map<string, Vehicle>;
  private events: ProvenanceLedgerEvent[] = [];

  constructor() {
    this.vehicles = new Map<string, Vehicle>();
    this.vehicles.set(mockMayaVehicle.id, mockMayaVehicle);
    mockOtherVehicles.forEach(v => this.vehicles.set(v.id, v));

    this.hydrateEvents();
  }

  private hydrateEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (raw) {
        this.events = JSON.parse(raw);
        return;
      }
    } catch { /* ignore */ }

    // Seed Genesis Events
    const genesisEvent: ProvenanceLedgerEvent = {
      eventId: 'evt-genesis-01',
      vehicleId: 'car-maya-m3',
      eventType: 'CHASSIS_GENESIS',
      payload: {
        vin: 'WBA-31AY-0084-M3',
        model: 'BMW M3 Competition (G80)',
        factoryColor: 'Isle of Man Green Metallic',
        initialOdometer: 1200
      },
      actorHandle: 'BMW_PARK_LANE',
      actorPublicKey: '04c3390f71b2e88a9144d187e22b09a4d',
      eventSignatureHash: sha256('evt-genesis-01:car-maya-m3:CHASSIS_GENESIS:GENESIS'),
      previousEventHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '2023-05-10T10:00:00Z'
    };
    this.events = [genesisEvent];
    this.persistEvents();
  }

  private persistEvents() {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(this.events));
    } catch { /* ignore */ }
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  async listVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getProvenanceEvents(vehicleId: string): Promise<ProvenanceLedgerEvent[]> {
    return this.events.filter(e => e.vehicleId === vehicleId);
  }

  async appendLedgerEvent(
    eventData: Omit<ProvenanceLedgerEvent, 'eventId' | 'eventSignatureHash' | 'previousEventHash' | 'timestamp'>
  ): Promise<ProvenanceLedgerEvent> {
    const vehicleEvents = this.events.filter(e => e.vehicleId === eventData.vehicleId);
    const lastEvent = vehicleEvents[vehicleEvents.length - 1];
    const previousEventHash = lastEvent 
      ? lastEvent.eventSignatureHash 
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();
    const eventSignatureHash = sha256(`${eventId}:${eventData.vehicleId}:${eventData.eventType}:${previousEventHash}`);

    const newEvent: ProvenanceLedgerEvent = {
      ...eventData,
      eventId,
      previousEventHash,
      eventSignatureHash,
      timestamp
    };

    this.events.push(newEvent);
    this.persistEvents();
    return newEvent;
  }

  async getOdometerMileage(vehicleId: string): Promise<number> {
    const veh = await this.getVehicleById(vehicleId);
    return veh ? (veh.spec?.mileageCurrent ?? 42184) : 0;
  }

  async getProvenanceScore(vehicleId: string): Promise<number> {
    if (vehicleId === 'car-maya-m3') return 98;
    if (vehicleId === 'car-kuro-gt3') return 99;
    if (vehicleId === 'car-e30-retromod' || vehicleId.includes('e30')) return 94;
    if (vehicleId === 'car-expedition-110' || vehicleId.includes('110')) return 96;
    return 95;
  }
}

// =========================================================================
// 2. FEED & SOCIAL CHRONICLE REPOSITORY
// =========================================================================
export class LocalFeedRepository implements IFeedRepository {
  private posts: CommunityPost[] = [];
  private listeners: Set<(posts: CommunityPost[]) => void> = new Set();

  constructor() {
    this.hydratePosts();
  }

  private hydratePosts() {
    try {
      const raw = localStorage.getItem(STORAGE_POSTS_KEY);
      if (raw) {
        this.posts = JSON.parse(raw);
        return;
      }
    } catch { /* ignore */ }
    this.posts = [...mockFeedPosts];
    this.persistPosts();
  }

  private persistPosts() {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(this.posts));
    } catch { /* ignore */ }
    this.notify();
  }

  private notify() {
    const copy = [...this.posts];
    this.listeners.forEach(cb => cb(copy));
  }

  async listPosts(filter: string = 'all', page: number = 1, limit: number = 20): Promise<CommunityPost[]> {
    let result = this.posts;
    if (filter === 'drives') result = result.filter(p => p.postType === 'DRIVE');
    else if (filter === 'builds') result = result.filter(p => p.postType === 'BUILD_UPDATE');
    else if (filter === 'tech') result = result.filter(p => p.postType === 'MAINTENANCE_UPDATE');
    else if (filter === 'arrivals') result = result.filter(p => p.postType === 'CAR_STORY');
    else if (filter === 'events') result = result.filter(p => p.postType === 'EVENT');
    else if (filter === 'questions') result = result.filter(p => p.postType === 'QUESTION');

    const start = (page - 1) * limit;
    return result.slice(start, start + limit);
  }

  async getPostById(postId: string): Promise<CommunityPost | null> {
    return this.posts.find(p => p.id === postId) || null;
  }

  async createPost(
    newPostData: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'repliesCount'>
  ): Promise<CommunityPost> {
    const created: CommunityPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0
    };

    this.posts = [created, ...this.posts];
    this.persistPosts();
    return created;
  }

  async toggleRespect(postId: string, custodianHandle: string): Promise<{ respectsCount: number; respected: boolean }> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return { respectsCount: 0, respected: false };
    }

    const post = this.posts[postIndex];
    const respectKey = `datum_respected_${postId}_${custodianHandle}`;
    const alreadyRespected = localStorage.getItem(respectKey) === 'true';

    let newCount = post.likesCount;
    let respected = false;

    if (alreadyRespected) {
      newCount = Math.max(0, newCount - 1);
      localStorage.removeItem(respectKey);
      respected = false;
    } else {
      newCount += 1;
      localStorage.setItem(respectKey, 'true');
      respected = true;
    }

    this.posts[postIndex] = { ...post, likesCount: newCount };
    this.persistPosts();
    return { respectsCount: newCount, respected };
  }

  async addComment(
    postId: string,
    authorHandle: string,
    text: string
  ): Promise<{ id: string; author: string; text: string; timeAgo: string }> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex] = {
        ...this.posts[postIndex],
        repliesCount: this.posts[postIndex].repliesCount + 1
      };
      this.persistPosts();
    }

    return {
      id: `comment-${Date.now()}`,
      author: authorHandle,
      text,
      timeAgo: 'Just now'
    };
  }

  subscribeToFeed(listener: (updatedPosts: CommunityPost[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// =========================================================================
// 3. WORKSHOP CRYPTOGRAPHIC STAMP REPOSITORY
// =========================================================================
export class LocalWorkshopRepository implements IWorkshopRepository {
  private stamps: CertifiedServiceStamp[] = [];
  private listeners: Set<(stamps: CertifiedServiceStamp[]) => void> = new Set();

  constructor() {
    this.hydrateStamps();
  }

  private hydrateStamps() {
    try {
      const raw = localStorage.getItem(STORAGE_STAMPS_KEY);
      if (raw) {
        this.stamps = JSON.parse(raw);
        return;
      }
    } catch { /* ignore */ }
    this.stamps = [...INITIAL_STAMP_CHAIN];
    this.persistStamps();
  }

  private persistStamps() {
    try {
      localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(this.stamps));
    } catch { /* ignore */ }
    this.listeners.forEach(cb => cb([...this.stamps]));
  }

  async listWorkshops(): Promise<CertifiedWorkshop[]> {
    return VERIFIED_WORKSHOPS;
  }

  async getWorkshopById(id: string): Promise<CertifiedWorkshop | null> {
    return VERIFIED_WORKSHOPS.find(w => w.id === id) || null;
  }

  async listStamps(vehicleId?: string): Promise<CertifiedServiceStamp[]> {
    if (!vehicleId) return [...this.stamps];
    return this.stamps.filter(s => s.vehicleId === vehicleId);
  }

  async issueStamp(stamp: CertifiedServiceStamp): Promise<CertifiedServiceStamp> {
    this.stamps.push(stamp);
    this.persistStamps();
    return stamp;
  }

  async verifyChain(vehicleId?: string): Promise<{ isValid: boolean; totalVerified: number; brokenAtStampId?: string }> {
    const targetStamps = vehicleId ? this.stamps.filter(s => s.vehicleId === vehicleId) : this.stamps;
    return verifyStampChainIntegrity(targetStamps);
  }

  subscribeToStamps(listener: (stamps: CertifiedServiceStamp[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// =========================================================================
// 4. CUSTODIAN AUTHENTICATION & IDENTITY REPOSITORY
// =========================================================================
export class LocalAuthRepository implements IAuthRepository {
  private activeHandle: string;

  constructor() {
    this.activeHandle = localStorage.getItem(STORAGE_CUSTODIAN_KEY) || 'maya_m3';
  }

  async getCurrentCustodian(): Promise<CustodianIdentity> {
    const persona = INITIAL_PERSONAS.find(p => p.handle === this.activeHandle);
    return persona || INITIAL_PERSONAS[0];
  }

  async switchCustodian(handle: string): Promise<CustodianIdentity> {
    const persona = INITIAL_PERSONAS.find(p => p.handle === handle);
    if (persona) {
      this.activeHandle = persona.handle;
      localStorage.setItem(STORAGE_CUSTODIAN_KEY, persona.handle);
      return persona;
    }
    return INITIAL_PERSONAS[0];
  }

  async listAvailablePersonas(): Promise<CustodianIdentity[]> {
    return INITIAL_PERSONAS;
  }

  async isCertifiedMechanic(): Promise<boolean> {
    const cur = await this.getCurrentCustodian();
    return cur.role === 'WORKSHOP_OPERATOR';
  }
}
