import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateComponentHash,
  verifyComponentIntegrity,
  calculateSupplyChainHealth,
  DEFAULT_VEHICLE_BOMS,
  addComponentToBom,
  loadVehicleBom
} from '../src/core/supplychain/supplyChainBom.ts';

// Mock localStorage for node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

test('1. generateComponentHash produces deterministic 64-char SHA-256 hash', () => {
  const params = {
    vin: 'WBA-31AY-0084-M3',
    partName: 'KW Variant 4 3-Way Coilovers',
    serialNumber: 'KW-V4-352-1088-DE',
    batchLotNumber: 'LOT-2024-Q3-8419',
    installationMileage: 38400
  };

  const hash1 = generateComponentHash(params);
  const hash2 = generateComponentHash(params);

  assert.equal(typeof hash1, 'string');
  assert.equal(hash1.length, 64);
  assert.equal(hash1, hash2, 'Hash must be strictly deterministic across identical inputs');
});

test('2. verifyComponentIntegrity validates authentic component and detects tampering', () => {
  const comp = DEFAULT_VEHICLE_BOMS['car-maya-m3'][0];
  assert.ok(comp.provenanceHash, 'Baseline component must have pre-computed hash');

  const isValid = verifyComponentIntegrity(comp);
  assert.equal(isValid, true, 'Authentic baseline component must pass verification');

  // Tamper with serial number
  const tamperedComp = {
    ...comp,
    serialNumber: 'COUNTERFEIT-KW-V4'
  };
  const isTamperedValid = verifyComponentIntegrity(tamperedComp);
  assert.equal(isTamperedValid, false, 'Tampered serial number must fail integrity verification');
});

test('3. calculateSupplyChainHealth scores verified components accurately', () => {
  const components = DEFAULT_VEHICLE_BOMS['car-maya-m3'];
  const health = calculateSupplyChainHealth(components);

  assert.ok(health.score >= 90, `Supply chain health score must be high for authentic components (got ${health.score})`);
  assert.equal(health.counterfeitRisk, 'NONE');
  assert.equal(health.componentsLogged, 5);
  assert.ok(health.verifiedPct >= 80);
});

test('4. calculateSupplyChainHealth flags elevated risk on tampered or missing hashes', () => {
  const corruptComponents = [
    {
      id: 'c-fake',
      vehicleId: 'car-test',
      vin: 'TEST-VIN-001',
      partName: 'Fake Turbo',
      category: 'Exhaust & Induction',
      manufacturer: 'Unknown',
      originCountry: 'Nowhere',
      originFacility: 'Unknown',
      serialNumber: 'FAKE-123',
      batchLotNumber: 'LOT-00',
      installationMileage: 1000,
      installationDate: '2024',
      installedByWorkshop: 'Shady Garage',
      torqueSpec: 'Tight',
      isoStandardCert: 'None',
      serviceLifeRemainingPct: 10,
      provenanceHash: '0000000000000000000000000000000000000000000000000000000000000000',
      engineeringRationale: 'None',
      verifiedByMasterMechanic: false
    }
  ];

  const health = calculateSupplyChainHealth(corruptComponents);
  assert.equal(health.counterfeitRisk, 'ELEVATED');
  assert.ok(health.score < 50);
});

test('5. addComponentToBom seals part with SHA-256 and persists to vehicle store', () => {
  const vehicleId = 'car-maya-m3';
  const newPart = {
    vehicleId,
    vin: 'WBA-31AY-0084-M3',
    partName: 'CSF High-Performance All-Aluminum Radiator',
    category: 'Powertrain',
    manufacturer: 'CSF Radiators Inc.',
    originCountry: 'United States',
    originFacility: 'Rancho Cucamonga Facility',
    serialNumber: 'CSF-7088-M3G80',
    batchLotNumber: 'LOT-RAD-24-09',
    installationMileage: 41200,
    installationDate: '01 October 2024',
    installedByWorkshop: 'Litchfield Motors',
    torqueSpec: 'Bracket bolts: 10 Nm • Hose clamps: 3.5 Nm',
    isoStandardCert: 'ISO 9001:2015 Registered Radiator Core',
    serviceLifeRemainingPct: 100,
    replacementIntervalMiles: 100000,
    engineeringRationale: 'Dual-pass core reduces water and oil temperatures by 12°C under sustained track laps.',
    verifiedByMasterMechanic: true
  };

  const sealed = addComponentToBom(vehicleId, newPart);
  assert.ok(sealed.provenanceHash.length === 64, 'Added part must be sealed with 64-char hash');
  assert.ok(verifyComponentIntegrity(sealed), 'Added part must verify against its own data');

  const stored = loadVehicleBom(vehicleId);
  const found = stored.find(c => c.serialNumber === 'CSF-7088-M3G80');
  assert.ok(found, 'Part must be retrievable from vehicle BOM store');
  assert.equal(found.provenanceHash, sealed.provenanceHash);
});
