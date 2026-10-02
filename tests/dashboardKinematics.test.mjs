import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGearAndRpm,
  calculateTachometerAngle,
  calculateOilPressure,
  calculateBoostPressure,
  calculateGForceCoords,
  formatOdometer
} from '../src/utils/dashboardKinematics.ts';

test('1. calculateGearAndRpm: Stationary car idles in 1st gear at 850 RPM', () => {
  const result = calculateGearAndRpm(0, 'COMFORT');
  assert.equal(result.gear, 1);
  assert.equal(result.rpm, 850);
  assert.equal(result.throttlePct, 0);
  assert.equal(result.shiftLightsCount, 0);
});

test('2. calculateGearAndRpm: Dynamic highway pace scales to appropriate gear and revs', () => {
  const cruise = calculateGearAndRpm(75, 'SPORT');
  assert.ok(cruise.gear >= 3 && cruise.gear <= 4, `Gear should be 3 or 4 at 75mph, got ${cruise.gear}`);
  assert.ok(cruise.rpm >= 3000 && cruise.rpm <= 8500, `RPM should be in powerband, got ${cruise.rpm}`);
  assert.ok(cruise.throttlePct > 0);
});

test('3. calculateGearAndRpm: High speed activates progressive shift lights', () => {
  const highRev = calculateGearAndRpm(66, 'SPORT+');
  assert.ok(highRev.rpm > 6500, `RPM should be in upper rev band in SPORT+, got ${highRev.rpm}`);
  assert.ok(highRev.shiftLightsCount >= 1, `Shift lights should trigger, got ${highRev.shiftLightsCount}`);
});

test('4. calculateTachometerAngle: Covers 270 degree sweep from idle to 9000 RPM', () => {
  const idleAngle = calculateTachometerAngle(0);
  const midAngle = calculateTachometerAngle(4500);
  const redlineAngle = calculateTachometerAngle(9000);

  assert.equal(idleAngle, -135);
  assert.equal(midAngle, 0);
  assert.equal(redlineAngle, 135);
});

test('5. calculateOilPressure: Correctly computes higher pressure at high revs', () => {
  const idlePres = calculateOilPressure(850, 95);
  const highPres = calculateOilPressure(7500, 95);

  assert.ok(idlePres >= 1.5 && idlePres <= 2.5, `Idle oil pressure should be ~2 Bar, got ${idlePres}`);
  assert.ok(highPres >= 4.5 && highPres <= 5.8, `High RPM oil pressure should be ~5 Bar, got ${highPres}`);
  assert.ok(highPres > idlePres, 'Oil pressure must scale up with engine RPM');
});

test('6. calculateBoostPressure: SPORT+ and TRACK yield maximum turbo manifold boost', () => {
  const comfortBoost = calculateBoostPressure(80, 'COMFORT');
  const trackBoost = calculateBoostPressure(80, 'TRACK');

  assert.ok(trackBoost > comfortBoost, 'TRACK mode boost must exceed COMFORT mode boost');
  assert.ok(trackBoost <= 1.6, `Boost should not exceed 1.6 Bar, got ${trackBoost}`);
});

test('7. calculateGForceCoords & formatOdometer: Formats authentic instrument data', () => {
  const coords = calculateGForceCoords(0.75, 0.5, 1.5, 30);
  assert.equal(typeof coords.x, 'number');
  assert.equal(typeof coords.y, 'number');

  const odo = formatOdometer(18420.7);
  assert.equal(odo, '018,420');

  const lowOdo = formatOdometer(450);
  assert.equal(lowOdo, '000,450');
});
