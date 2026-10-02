import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LocalVehicleRepository,
  LocalFeedRepository,
  LocalWorkshopRepository,
  LocalAuthRepository
} from '../src/services/repository/LocalLedgerRepository.ts';
import { issueServiceStamp } from '../src/core/workshop/WorkshopStampEngine.ts';

// Mock localStorage for Node.js test environment if absent
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

test('1. VehicleRepository retrieves vehicles and provides provenance score', async () => {
  const repo = new LocalVehicleRepository();
  const vehicles = await repo.listVehicles();
  assert.ok(vehicles.length >= 2, 'Must return at least Maya and other vehicles');

  const maya = await repo.getVehicleById('car-maya-m3');
  assert.ok(maya);
  assert.equal(maya.name, 'MAYA');

  const score = await repo.getProvenanceScore('car-maya-m3');
  assert.equal(score, 98);
});

test('2. VehicleRepository appends event with immutable SHA-256 hash chaining', async () => {
  const repo = new LocalVehicleRepository();
  const initialEvents = await repo.getProvenanceEvents('car-maya-m3');
  assert.ok(initialEvents.length >= 1, 'Genesis event must exist');

  const newEvent = await repo.appendLedgerEvent({
    vehicleId: 'car-maya-m3',
    eventType: 'EXPEDITION_RECORDED',
    payload: { passName: 'Snake Pass A57', frictionMu: 0.85 },
    actorHandle: 'maya_m3',
    actorPublicKey: 'pub-test-01'
  });

  assert.ok(newEvent.eventId.startsWith('evt-'));
  assert.equal(newEvent.eventSignatureHash.length, 64);
  assert.equal(newEvent.previousEventHash, initialEvents[initialEvents.length - 1].eventSignatureHash);

  const updatedEvents = await repo.getProvenanceEvents('car-maya-m3');
  assert.equal(updatedEvents.length, initialEvents.length + 1);
});

test('3. FeedRepository lists, creates posts, and dispatches reactive updates', async () => {
  const repo = new LocalFeedRepository();
  const initialPosts = await repo.listPosts('all');
  assert.ok(initialPosts.length > 0);

  let notified = false;
  const unsubscribe = repo.subscribeToFeed((updatedPosts) => {
    notified = true;
    assert.ok(updatedPosts.length > initialPosts.length);
  });

  const created = await repo.createPost({
    author: 'maya_m3',
    authorName: 'Maya Lin',
    avatar: '/real_uk_m3_cottage.jpg',
    postType: 'DRIVE',
    title: 'Dawn Run over Snake Pass',
    caption: 'Tarmac drying out nicely at summit waypoint.',
    photos: ['/real_uk_m3_cottage.jpg']
  });

  assert.ok(created.id.startsWith('post-'));
  assert.equal(notified, true, 'Subscriber must be notified of new post');
  unsubscribe();
});

test('4. FeedRepository toggleRespect accurately tracks idempotent respects', async () => {
  const repo = new LocalFeedRepository();
  const posts = await repo.listPosts('all');
  const targetPost = posts[0];
  const initialCount = targetPost.likesCount;

  // Toggle on
  const res1 = await repo.toggleRespect(targetPost.id, 'test_custodian');
  assert.equal(res1.respected, true);
  assert.equal(res1.respectsCount, initialCount + 1);

  // Toggle off
  const res2 = await repo.toggleRespect(targetPost.id, 'test_custodian');
  assert.equal(res2.respected, false);
  assert.equal(res2.respectsCount, initialCount);
});

test('5. WorkshopRepository verifies provenance DAG chain integrity', async () => {
  const repo = new LocalWorkshopRepository();
  const stamps = await repo.listStamps();
  assert.ok(stamps.length >= 2);

  const audit = await repo.verifyChain();
  assert.equal(audit.isValid, true);
  assert.equal(audit.totalVerified, stamps.length);

  // Issue new stamp
  const workshops = await repo.listWorkshops();
  const newStamp = issueServiceStamp({
    vehicleId: 'car-maya-m3',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    mileage: 43000,
    serviceDate: '2026-10-02',
    category: 'MAJOR_INSPECTION',
    title: 'B-Road Pre-Flight Health Inspection',
    workDescription: 'Checked fluid levels and damper pressures.',
    workshopId: workshops[0].id,
    components: [],
    totalCostGbp: 350,
    invoiceNumber: 'INV-TEST-99'
  }, stamps);

  await repo.issueStamp(newStamp);
  const updatedAudit = await repo.verifyChain();
  assert.equal(updatedAudit.isValid, true);
  assert.equal(updatedAudit.totalVerified, stamps.length + 1);
});

test('6. AuthRepository switches custodian personas reliably', async () => {
  const repo = new LocalAuthRepository();
  const defaultUser = await repo.getCurrentCustodian();
  assert.equal(defaultUser.handle, 'maya_m3');

  const switched = await repo.switchCustodian('kuro_gt3');
  assert.equal(switched.handle, 'kuro_gt3');
  assert.equal(switched.role, 'CUSTODIAN');

  const mechanic = await repo.switchCustodian('litchfield_eng');
  assert.equal(mechanic.role, 'WORKSHOP_OPERATOR');
  const isMech = await repo.isCertifiedMechanic();
  assert.equal(isMech, true);
});
