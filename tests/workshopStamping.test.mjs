import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStampSignature,
  issueServiceStamp,
  verifyStampChainIntegrity,
  VERIFIED_WORKSHOPS
} from '../src/core/workshop/WorkshopStampEngine.ts';
import { sha256 } from '../src/core/crypto/sha256.ts';

test('1. calculateStampSignature generates deterministic 64-char hex hash', () => {
  const hash1 = calculateStampSignature(
    'stamp-101',
    'car-maya-m3',
    42000,
    'MAJOR_INSPECTION',
    'hash-inv-1',
    'hash-prev-0',
    'pubkey-litchfield'
  );
  const hash2 = calculateStampSignature(
    'stamp-101',
    'car-maya-m3',
    42000,
    'MAJOR_INSPECTION',
    'hash-inv-1',
    'hash-prev-0',
    'pubkey-litchfield'
  );

  assert.equal(typeof hash1, 'string');
  assert.equal(hash1.length, 64);
  assert.equal(hash1, hash2, 'Identical inputs must produce identical signature hash');
});

test('2. issueServiceStamp correctly chains previous stamp hash', () => {
  const workshop = VERIFIED_WORKSHOPS[0];
  const stamp1 = issueServiceStamp({
    vehicleId: 'car-maya-m3',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    mileage: 42184,
    serviceDate: '2026-10-02',
    category: 'MAJOR_INSPECTION',
    title: '42,000-Mile Fluid & Plugs Overhaul',
    workDescription: 'Spark plugs renewed. Differential fluid replaced with Castrol 75W-140.',
    workshopId: workshop.id,
    components: [{ category: 'Ignition', componentName: 'NGK Laser Iridium', costGbp: 180 }],
    totalCostGbp: 980.00,
    invoiceNumber: 'INV-2026-001'
  }, []);

  assert.equal(stamp1.previousStampHash, '0000000000000000000000000000000000000000000000000000000000000000');
  assert.equal(stamp1.status, 'VERIFIED_PROFESSIONAL');

  const stamp2 = issueServiceStamp({
    vehicleId: 'car-maya-m3',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    mileage: 44500,
    serviceDate: '2026-10-15',
    category: 'CORNER_WEIGHTING',
    title: 'KW Variant 4 Damper Setup',
    workDescription: '4-wheel alignment and cross-weight calibration.',
    workshopId: workshop.id,
    components: [{ category: 'Suspension', componentName: 'KW V4 Shims', costGbp: 450 }],
    totalCostGbp: 850.00,
    invoiceNumber: 'INV-2026-002'
  }, [stamp1]);

  assert.equal(stamp2.previousStampHash, stamp1.stampSignatureHash, 'Stamp 2 must link to Stamp 1 signature');
});

test('3. verifyStampChainIntegrity validates clean chain and rejects tampered payload', () => {
  const workshop = VERIFIED_WORKSHOPS[0];
  const stamp1 = issueServiceStamp({
    vehicleId: 'car-kuro-gt3',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    mileage: 18000,
    serviceDate: '2026-09-01',
    category: 'OIL_SPECTROSCOPY',
    title: 'Annual Mobil 1 Flush & Wear Analysis',
    workDescription: 'Oil spectroscopy confirmed zero ppm wear particles.',
    workshopId: workshop.id,
    components: [],
    totalCostGbp: 750,
    invoiceNumber: 'INV-992-01'
  }, []);

  const cleanResult = verifyStampChainIntegrity([stamp1]);
  assert.equal(cleanResult.isValid, true);
  assert.equal(cleanResult.totalVerified, 1);

  // Tamper with mileage on stamp1
  const tamperedStamp = { ...stamp1, mileage: 12000 };
  const tamperedResult = verifyStampChainIntegrity([tamperedStamp]);
  assert.equal(tamperedResult.isValid, false, 'Tampered mileage must fail hash check');
  assert.equal(tamperedResult.brokenAtStampId, stamp1.stampId);
});

test('4. verifyStampChainIntegrity detects broken hash chain link', () => {
  const workshop = VERIFIED_WORKSHOPS[1];
  const stamp1 = issueServiceStamp({
    vehicleId: 'car-e30-retromod',
    chassisCode: 'E30-318IS-SLICKTOP',
    vin: 'WBA-AF92-0018-E30',
    mileage: 118000,
    serviceDate: '2026-08-01',
    category: 'STRUCTURAL_CONSERVATION',
    title: 'Dinitrol Cavity Wax Treatment',
    workDescription: 'Full underbody steam wash and Dinitrol cavity injection.',
    workshopId: workshop.id,
    components: [],
    totalCostGbp: 650,
    invoiceNumber: 'INV-E30-01'
  }, []);

  const stamp2 = issueServiceStamp({
    vehicleId: 'car-e30-retromod',
    chassisCode: 'E30-318IS-SLICKTOP',
    vin: 'WBA-AF92-0018-E30',
    mileage: 119500,
    serviceDate: '2026-09-10',
    category: 'POWERTRAIN_CALIBRATION',
    title: 'Weber 40 DCOE Balance & Jetting',
    workDescription: 'Carburettor airflow synchronization.',
    workshopId: workshop.id,
    components: [],
    totalCostGbp: 420,
    invoiceNumber: 'INV-E30-02'
  }, [stamp1]);

  // Break the link
  const brokenStamp2 = {
    ...stamp2,
    previousStampHash: '1111111111111111111111111111111111111111111111111111111111111111',
    // Recalculate signature so self-hash passes, but chain link is severed
    stampSignatureHash: calculateStampSignature(
      stamp2.stampId,
      stamp2.vehicleId,
      stamp2.mileage,
      stamp2.category,
      stamp2.invoiceHash,
      '1111111111111111111111111111111111111111111111111111111111111111',
      workshop.publicKey
    )
  };

  const result = verifyStampChainIntegrity([stamp1, brokenStamp2]);
  assert.equal(result.isValid, false, 'Broken previousStampHash link must fail chain validation');
});

test('5. Multi-vehicle chains isolate independent hash lineage', () => {
  const workshop = VERIFIED_WORKSHOPS[0];
  const mayaStamp = issueServiceStamp({
    vehicleId: 'car-maya-m3',
    chassisCode: 'G80-M3-COMP-UK',
    vin: 'WBA-31AY-0084-M3',
    mileage: 42000,
    serviceDate: '2026-10-01',
    category: 'MAJOR_INSPECTION',
    title: 'M3 Inspection',
    workDescription: 'Standard inspection',
    workshopId: workshop.id,
    components: [],
    totalCostGbp: 500,
    invoiceNumber: 'INV-M1'
  }, []);

  const kuroStamp = issueServiceStamp({
    vehicleId: 'car-kuro-gt3',
    chassisCode: '992-GT3-TOURING',
    vin: 'WP0-ZZZ-99Z-NS-1092',
    mileage: 15000,
    serviceDate: '2026-10-01',
    category: 'CORNER_WEIGHTING',
    title: 'GT3 Alignment',
    workDescription: 'Standard setup',
    workshopId: workshop.id,
    components: [],
    totalCostGbp: 600,
    invoiceNumber: 'INV-K1'
  }, [mayaStamp]);

  // Because kuroStamp is a different vehicle, its previousStampHash should be all zeros, not maya's hash
  assert.equal(kuroStamp.previousStampHash, '0000000000000000000000000000000000000000000000000000000000000000');
  
  const validation = verifyStampChainIntegrity([mayaStamp, kuroStamp]);
  assert.equal(validation.isValid, true);
  assert.equal(validation.totalVerified, 2);
});
