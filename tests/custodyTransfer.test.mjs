import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCustodyHash,
  generateCustodyHandoverToken,
  verifyCustodyHandoverToken,
  executeCustodyHandover,
  loadVehicleCustodyChain,
  saveVehicleCustodyChain,
  SEED_CUSTODY_CHAINS
} from '../src/core/custody/custodyTransferEngine.ts';

test('1. calculateCustodyHash is deterministic and collision resistant', () => {
  const seed = SEED_CUSTODY_CHAINS['car-maya-m3'];
  const hash1 = calculateCustodyHash(seed.vehicleId, seed.vin, seed.activeCustodian, seed.custodyHistory);
  const hash2 = calculateCustodyHash(seed.vehicleId, seed.vin, seed.activeCustodian, seed.custodyHistory);

  assert.equal(hash1, hash2, 'Hash must be identical for identical custody payloads');
  assert.equal(typeof hash1, 'string');
  assert.equal(hash1.startsWith('0x'), true);
  assert.equal(hash1.length, 66, '0x + 64 hex characters');

  // Altering mileage must change hash
  const alteredActive = { ...seed.activeCustodian, startMileage: 99999 };
  const alteredHash = calculateCustodyHash(seed.vehicleId, seed.vin, alteredActive, seed.custodyHistory);
  assert.notEqual(hash1, alteredHash, 'Altering mileage must alter cryptographic custody seal');
});

test('2. generateCustodyHandoverToken generates a cryptographically signed handover token', () => {
  const token = generateCustodyHandoverToken({
    vehicleId: 'car-kuro-gt3',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    chassisCode: '992-GT3-TOURING',
    currentMileage: 18400,
    fromCustodianId: 'custodian-alexander-chen',
    fromCustodianName: 'Alexander Chen',
    intendedRecipientName: 'Julian Sterling',
    authPasscode: 'PORSCHE-992-ATELIER',
    validHours: 48,
  });

  assert.equal(token.status, 'PENDING');
  assert.equal(token.vin, 'WP0-ZZZ-99Z-NS-1092');
  assert.equal(token.currentMileage, 18400);
  assert.equal(token.fromCustodianName, 'Alexander Chen');
  assert.equal(token.intendedRecipientName, 'Julian Sterling');
  assert.equal(token.handoverSignature.startsWith('0x'), true);
  assert.equal(token.handoverSignature.length, 66);
});

test('3. verifyCustodyHandoverToken validates correct passcodes and catches invalid credentials', () => {
  const token = generateCustodyHandoverToken({
    vehicleId: 'car-maya-m3',
    vin: 'WBS-8M92-0004-MAYAM3',
    chassisCode: 'G80-M3-COMP-LCI',
    currentMileage: 24850,
    fromCustodianId: 'custodian-maya-vane',
    fromCustodianName: 'Lady Maya Vance',
    intendedRecipientName: 'Lord Alistair Vance',
    authPasscode: 'COTSWOLDS-M3-2026',
    validHours: 72,
  });

  // Valid verification
  const validCheck = verifyCustodyHandoverToken(token, 'COTSWOLDS-M3-2026');
  assert.equal(validCheck.isValid, true);
  assert.equal(validCheck.reason, undefined);

  // Case insensitive check
  const caseCheck = verifyCustodyHandoverToken(token, 'cotswolds-m3-2026');
  assert.equal(caseCheck.isValid, true);

  // Wrong passcode
  const wrongPasscode = verifyCustodyHandoverToken(token, 'WRONG-PASSWORD-123');
  assert.equal(wrongPasscode.isValid, false);
  assert.match(wrongPasscode.reason, /Incorrect authorization/);

  // Tampered signature
  const tamperedToken = { ...token, handoverSignature: '0x0000000000000000000000000000000000000000000000000000000000000000' };
  const tamperedCheck = verifyCustodyHandoverToken(tamperedToken, 'COTSWOLDS-M3-2026');
  assert.equal(tamperedCheck.isValid, false);
  assert.match(tamperedCheck.reason, /signature mismatch/);
});

test('4. executeCustodyHandover successfully transitions active custodian and archives historical tenure', () => {
  const token = generateCustodyHandoverToken({
    vehicleId: 'car-e30-retromod',
    vin: 'WBA-AF92-0019-E30',
    chassisCode: 'E30-318IS-SLICKTOP',
    currentMileage: 114500,
    fromCustodianId: 'custodian-dan-retromod',
    fromCustodianName: 'Dan RetroMod',
    intendedRecipientName: 'Claire Redfield',
    authPasscode: 'BBS-BASKETWEAVE',
    validHours: 24,
  });

  const result = executeCustodyHandover({
    token,
    enteredPasscode: 'BBS-BASKETWEAVE',
    newCustodianDisplayName: 'Claire Redfield',
    newCustodianRegion: 'Edinburgh, Scotland (UK)',
    transferNotes: 'Acquired for Highland tours. Complete mechanical and cosmetic inspection passed.',
  });

  assert.equal(result.success, true);
  assert.match(result.message, /successfully transitioned to Claire Redfield/);
  assert.ok(result.receiptHash);

  const updatedChain = result.updatedChain;
  assert.ok(updatedChain);
  assert.equal(updatedChain.activeCustodian.displayName, 'Claire Redfield');
  assert.equal(updatedChain.activeCustodian.status, 'ACTIVE');
  assert.equal(updatedChain.activeCustodian.locationRegion, 'Edinburgh, Scotland (UK)');
  assert.equal(updatedChain.activeCustodian.startMileage, 114500);

  // Dan RetroMod is now archived into custody history
  const danArchived = updatedChain.custodyHistory[0];
  assert.equal(danArchived.displayName, 'Dan RetroMod');
  assert.equal(danArchived.status, 'HISTORICAL');
  assert.equal(danArchived.endMileage, 114500);

  // Original owner Arthur Pendleton is still in custody history
  const arthur = updatedChain.custodyHistory.find(h => h.displayName.includes('Arthur Pendleton'));
  assert.ok(arthur);
  assert.equal(arthur.status, 'HISTORICAL');

  // Token status updated to COMPLETED
  assert.equal(token.status, 'COMPLETED');
});

test('5. Local storage persistence restores custom custody chains accurately', () => {
  const customChain = {
    vehicleId: 'car-test-singer',
    vin: 'WP0-SINGER-911-001',
    chassisCode: '964-DLS-ATELIER',
    activeCustodian: {
      custodianId: 'custodian-singer-test',
      displayName: 'Rob Dickinson',
      custodyStartDate: '2025-01-01T00:00:00.000Z',
      startMileage: 250,
      status: 'ACTIVE',
      locationRegion: 'Sun Valley, California',
      sovereignSignature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    custodyHistory: [],
    totalCustodians: 1,
    provenanceIntegrityHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    lastUpdated: '2026-10-02T00:00:00.000Z',
  };

  saveVehicleCustodyChain('car-test-singer', customChain);
  const loaded = loadVehicleCustodyChain('car-test-singer');
  assert.equal(loaded.vehicleId, 'car-test-singer');
  assert.equal(loaded.activeCustodian.displayName, 'Rob Dickinson');
});
